# TermGroup Model Description for MCP Integration

## Full TermGroup Model Description

### Core Fields
- **id**: Primary key (INTEGER, auto-increment)
- **name**: Group name (STRING, required)
- **main_term_id**: Foreign key to main Term (INTEGER, required)
- **description**: Group description (TEXT, nullable)
- **status_id**: Foreign key to Status (SMALLINT, nullable)
- **created_by**: User who created the group (STRING, nullable)
- **icon**: Path to icon file (STRING, nullable)

### AI-Generated Content Fields
- **ai_generated**: Boolean flag indicating if content was AI-generated (default: false)
- **ai_model**: AI model used for generation (STRING(100), nullable)
- **ai_prompt_version**: Version of the prompt used (STRING(50), nullable)
- **ai_generation_date**: Date when AI generated the content (DATE, nullable)
- **ai_tokens_used**: Number of tokens consumed (INTEGER, nullable)
- **ai_quality_score**: Quality score from 0.00 to 9.99 (DECIMAL(3,2), nullable)
- **ai_validation_status**: Status enum ('pending', 'approved', 'rejected', 'needs_review', default: 'pending')
- **ai_source_data**: Original source data used for generation (JSONB, nullable)
- **ai_metadata**: Additional metadata (JSONB, nullable)
- **ai_confidence_score**: AI confidence score from 0.00 to 9.99 (DECIMAL(3,2), nullable)
- **ai_human_reviewed**: Boolean flag for human review (default: false)
- **ai_human_reviewer**: Name of human reviewer (STRING(100), nullable)
- **ai_review_date**: Date of human review (DATE, nullable)
- **ai_version**: Version number (INTEGER, default: 1)
- **ai_batch_id**: Batch identifier for bulk operations (STRING(50), nullable)
- **ai_edit_history**: History of edits made (JSONB, nullable)
- **ai_original_data**: Original data before changes (JSONB, nullable)
- **ai_manual_overrides**: Manual overrides applied (JSONB, nullable)
- **ai_market_validated**: Market validation flag (default: false)
- **ai_validation_errors**: Validation error details (JSONB, nullable)

### Relationships
- **Belongs to MainTerm**: `main_term_id` → `terms.id`
- **Belongs to Status**: `status_id` → `statuses.id`
- **Has many Terms**: `term_groups.id` → `term_group_relations.term_group_id`
- **Has many Professions**: `term_groups.id` → `professions.term_group_id`
- **Has many Departments**: `term_groups.id` → `departments.term_group_id`
- **Has many Languages**: `term_groups.id` → `languages.term_group_id`

## TermGroupRelation Model (Junction Table)

### Fields
- **id**: Primary key (INTEGER, auto-increment)
- **term_group_id**: Foreign key to TermGroup (INTEGER, required)
- **term_id**: Foreign key to Term (INTEGER, required)
- **term_type_id**: Foreign key to TermType (INTEGER, required)
- **priority**: Priority order (INTEGER, default: 0)

### Relationships
- **Belongs to TermGroup**: `term_group_id` → `term_groups.id`
- **Belongs to Term**: `term_id` → `terms.id`
- **Belongs to TermType**: `term_type_id` → `term_types.id`

## Important: Complex Creation Process

**CRITICAL**: TermGroup creation involves multiple related models and complex relationships.

### Frontend Form Data Structure:
```javascript
const termGroupData = {
  mainTerm: {
    value: "Term Group Name",           // REQUIRED
    description: "Term group description",
    language_id: 1,                    // Language ID (default: 1)
    status_id: 1,                      // Status ID (default: 1)  
    term_type_id: 1,                   // Term Type ID (default: 1)
    created_by: "user_id"              // Optional
  },
  terms: [                             // Additional terms (optional)
    {
      value: "Additional Term",
      description: "Term description",
      language_id: 1,
      term_type_id: 2,                 // Different term type
      status_id: 1,
      created_by: "user_id"
    }
  ],
  entity_type: "department",           // Optional - for entity linking
  entity_id: 123,                      // Optional - entity ID
  aiMetadata: {                        // Optional AI metadata
    ai_generated: true,
    ai_model: "gpt-4",
    ai_prompt_version: "1.0"
  },
  icon: iconFile                       // Optional icon file
};
```

### Backend Processing:
1. **Creates Main Term** with provided data
2. **Creates TermGroup** with main term reference
3. **Creates Additional Terms** (if provided)
4. **Creates TermGroupRelations** for all terms
5. **Handles file uploads** for icons
6. **Links to Entity** (if entity_type and entity_id provided)
7. **Manages AI metadata** and validation status

## API Endpoints for TermGroups

### Available REST API Endpoints:

1. **Create TermGroup**:
   ```
   POST /api/terms/groups
   Content-Type: multipart/form-data
   Authorization: Bearer <token>
   ```

2. **Get all TermGroups**:
   ```
   GET /api/terms/groups?page=1&limit=20&search=search_term
   ```

3. **Get specific TermGroup**:
   ```
   GET /api/terms/groups/:id
   ```

4. **Update TermGroup**:
   ```
   PUT /api/terms/groups/:id
   Content-Type: multipart/form-data
   Authorization: Bearer <token>
   ```

5. **Delete TermGroup**:
   ```
   DELETE /api/terms/groups/:id
   Authorization: Bearer <token>
   ```

6. **Get Terms by Type**:
   ```
   GET /api/terms/groups/:id/by-type
   ```

7. **Add Term to Group**:
   ```
   POST /api/terms/groups/:id/terms
   Authorization: Bearer <token>
   ```

## MCP Instructions for TermGroup Operations

### Important Note:
**Currently, there are NO dedicated MCP functions for TermGroup operations.** The MCP service only provides functions for:
- Departments
- Professions
- Statuses
- Priorities
- Languages
- Tool Types
- Tools

### Available MCP Functions (Related):
```javascript
// Get all departments (which have term_group_id)
mcp_libs-mcp-service_get_departments({
  page: 1,
  limit: 10,
  search: "search"
});

// Get all professions (which have term_group_id)
mcp_libs-mcp-service_get_professions({
  page: 1,
  limit: 10,
  search: "search"
});

// Get all languages (which have term_group_id)
mcp_libs-mcp-service_get_languages({
  page: 1,
  limit: 10,
  search: "search"
});
```

### For TermGroup Operations, Use REST API:

#### 1. Create TermGroup via REST API:
```javascript
const formData = new FormData();
formData.append('mainTerm', JSON.stringify({
  value: "Term Group Name",
  description: "Term group description",
  language_id: 1,
  status_id: 1,
  term_type_id: 1,
  created_by: "user_id"
}));
formData.append('terms', JSON.stringify([]));
formData.append('entity_type', 'department');
formData.append('entity_id', '123');

const response = await fetch('/api/terms/groups', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + token
  },
  body: formData
});
```

#### 2. Get TermGroups via REST API:
```javascript
const response = await fetch('/api/terms/groups?page=1&limit=20&search=search');
const data = await response.json();
```

#### 3. Update TermGroup via REST API:
```javascript
const formData = new FormData();
formData.append('mainTerm', JSON.stringify({
  value: "Updated Term Group Name",
  description: "Updated description"
}));

const response = await fetch(`/api/terms/groups/${termGroupId}`, {
  method: 'PUT',
  headers: {
    'Authorization': 'Bearer ' + token
  },
  body: formData
});
```

## Complete Field Reference

### TermGroup Model Fields:
```javascript
{
  id: INTEGER,                    // Primary key, auto-increment
  name: STRING,                   // REQUIRED - Group name
  main_term_id: INTEGER,          // REQUIRED - Foreign key to main Term
  description: TEXT,              // Nullable - Group description
  status_id: SMALLINT,            // Nullable - Foreign key to Status
  created_by: STRING,             // Nullable - User who created the group
  icon: STRING,                   // Nullable - Path to icon file
  // AI fields (managed internally)
  ai_generated: BOOLEAN,          // Default: false
  ai_model: STRING(100),          // Nullable
  ai_prompt_version: STRING(50),  // Nullable
  ai_generation_date: DATE,       // Nullable
  ai_tokens_used: INTEGER,        // Nullable
  ai_quality_score: DECIMAL(3,2), // Nullable
  ai_validation_status: ENUM,     // 'pending', 'approved', 'rejected', 'needs_review'
  ai_source_data: JSONB,          // Nullable
  ai_metadata: JSONB,             // Nullable
  ai_confidence_score: DECIMAL(3,2), // Nullable
  ai_human_reviewed: BOOLEAN,     // Default: false
  ai_human_reviewer: STRING(100), // Nullable
  ai_review_date: DATE,           // Nullable
  ai_version: INTEGER,            // Default: 1
  ai_batch_id: STRING(50),        // Nullable
  ai_edit_history: JSONB,         // Nullable
  ai_original_data: JSONB,        // Nullable
  ai_manual_overrides: JSONB,     // Nullable
  ai_market_validated: BOOLEAN,   // Default: false
  ai_validation_errors: JSONB     // Nullable
}
```

### TermGroupRelation Model Fields:
```javascript
{
  id: INTEGER,                    // Primary key, auto-increment
  term_group_id: INTEGER,         // REQUIRED - Foreign key to TermGroup
  term_id: INTEGER,               // REQUIRED - Foreign key to Term
  term_type_id: INTEGER,          // REQUIRED - Foreign key to TermType
  priority: INTEGER               // Default: 0 - Priority order
}
```

### Related Model Fields (for Reference):

#### Term Model:
```javascript
{
  id: INTEGER,                    // Primary key, auto-increment
  value: STRING,                  // REQUIRED - Term value
  description: TEXT,              // Nullable - Term description
  language_id: INTEGER,           // REQUIRED - Foreign key to Language
  term_type_id: INTEGER,          // REQUIRED - Foreign key to TermType
  status_id: SMALLINT,            // Nullable - Foreign key to Status
  entity_type_id: INTEGER,        // Nullable - Foreign key to EntityType
  created_by: STRING              // Nullable - User who created the term
}
```

#### TermType Model:
```javascript
{
  id: INTEGER,                    // Primary key, auto-increment
  name: STRING,                   // Term type name (e.g., "main", "synonym", "abbreviation")
  description: TEXT               // Term type description
}
```

### Default Values Used by Backend:
- **language_id**: 1 (usually Russian)
- **term_type_id**: 1 (usually "main" term type)
- **status_id**: 1 (usually "Active" status)
- **created_by**: "0" (if not provided)
- **priority**: 0 (for term relations)

### Relationships:
- **TermGroup** → **Term** (via `main_term_id` for main term)
- **TermGroup** ↔ **Term** (many-to-many via `TermGroupRelation` for additional terms)
- **TermGroup** → **Status** (via `status_id`)
- **TermGroup** → **Profession** (one-to-many, professions belong to term groups)
- **TermGroup** → **Department** (one-to-many, departments belong to term groups)
- **TermGroup** → **Language** (one-to-many, languages belong to term groups)
- **TermGroupRelation** → **TermType** (via `term_type_id`)

## Summary

TermGroups are complex entities that serve as containers for related terms. They are used by:
- **Departments** (for department names and descriptions)
- **Professions** (for profession names and descriptions)
- **Languages** (for language names and descriptions)

### Key Points:
1. **No MCP Interface**: TermGroups don't have dedicated MCP functions
2. **REST API Required**: Use REST API endpoints for TermGroup operations
3. **Complex Creation**: Involves creating Terms, TermGroups, and TermGroupRelations
4. **Entity Linking**: Can be linked to Departments, Professions, or Languages
5. **AI Integration**: Full AI content management capabilities
6. **File Support**: Icon upload and storage capabilities

### For AI Integration:
Since there are no MCP functions for TermGroups, AI systems should:
1. Use the REST API endpoints directly
2. Handle authentication with Bearer tokens
3. Use FormData for file uploads
4. Understand the complex data structure required
5. Consider using the simplified Department/Profession MCP functions instead
