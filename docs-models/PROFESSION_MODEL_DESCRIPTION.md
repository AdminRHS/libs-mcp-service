# Profession Model Description for MCP Integration

## Full Profession Model Description

### Core Fields
- **id**: Primary key (INTEGER, auto-increment)
- **term_group_id**: Foreign key to TermGroup model (INTEGER, nullable)
- **department_id**: Foreign key to Department model (INTEGER, nullable)

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
- **Belongs to Department**: `department_id` → `departments.id`
- **Belongs to TermGroup**: `term_group_id` → `term_groups.id`
- **Many-to-many with Tool**: `professions.id` ↔ `tools.id` via `profession_tool` junction table

## Important: Complex Creation Process

**CRITICAL**: The actual profession creation process is much more complex than the MCP interface suggests. The frontend sends a FormData object with:

### Frontend Form Data Structure:
```javascript
const formDataToSend = new FormData();
formDataToSend.append('department_id', formData.department_id);
formDataToSend.append('mainTerm', JSON.stringify({
  value: "Profession Name",           // REQUIRED
  description: "Profession description",
  language_id: 1,                    // Language ID (default: 1)
  status_id: 1,                      // Status ID (default: 1)  
  term_type_id: 1                    // Term Type ID (default: 1)
}));
formDataToSend.append('terms', JSON.stringify([
  {
    value: "Additional Term",
    description: "Term description",
    language_id: 1,
    term_type_id: 2,
    status_id: 1
  }
]));
formDataToSend.append('icon', iconFile); // Optional icon file
formDataToSend.append('tool_ids', JSON.stringify([1, 2, 3])); // Optional tool IDs

### Required Fields for Creating the Simplest Profession:

#### 1. Profession Model (Minimal):
```javascript
{
  department_id: 1  // Optional, can be null
}
```

#### 2. Term Model (Main Term - REQUIRED):
```javascript
{
  value: "Profession Name",           // REQUIRED - The profession name
  description: "Description",         // Optional
  language_id: 1,                    // REQUIRED - Default: 1 (usually Russian)
  term_type_id: 1,                   // REQUIRED - Default: 1 (usually "main")
  status_id: 1,                      // Optional - Default: 1 (usually "Active")
  created_by: "user_id"              // Optional
}
```

#### 3. TermGroup Model (Auto-created):
```javascript
{
  name: "Profession Name",            // Auto-filled from mainTerm.value
  main_term_id: 123,                 // Auto-linked to created Term
  description: "Description",         // Auto-filled from mainTerm.description
  created_by: "user_id",             // Auto-filled from mainTerm.created_by
  icon: "/path/to/icon.png"          // Optional, from file upload
}
```

### Backend Processing:
1. **Creates Profession** with department_id (optional)
2. **Creates TermGroup** with mainTerm and additional terms
3. **Links Profession** to TermGroup via `term_group_id`
4. **Handles file uploads** for icons
5. **Manages tool relationships** via many-to-many with Tools
6. **Manages complex relationships** between terms, languages, statuses, and term types

## MCP Instructions for Profession Operations

### Available MCP Functions for Professions:

1. **Get all professions**:
   ```javascript
   mcp_libs-mcp-service_get_professions({
     page: 1,           // Page number (default: 1)
     limit: 10,         // Number of professions per page (default: 10)
     search: "search"   // Search by profession name or description
   })
   ```

2. **Get specific profession**:
   ```javascript
   mcp_libs-mcp-service_get_profession({
     professionId: "profession_id_here"
   })
   ```

3. **Create new profession**:
   ```javascript
   mcp_libs-mcp-service_create_profession({
     name: "Profession Name",           // REQUIRED
     description: "Profession description"  // REQUIRED
   })
   ```

4. **Update existing profession**:
   ```javascript
   mcp_libs-mcp-service_update_profession({
     professionId: "profession_id_here",    // REQUIRED
     name: "Updated Profession Name",       // REQUIRED
     description: "Updated description"     // REQUIRED
   })
   ```

### Important Notes for MCP Usage:

1. **Required Fields**: Only `name` and `description` are required for creation/update
2. **Simplified Interface**: The MCP service provides a simplified interface that abstracts away the complex term group creation process
3. **Internal Processing**: The backend automatically:
   - Creates the necessary TermGroup
   - Creates the main term with the provided name
   - Sets up language, status, and term type relationships
   - Handles all internal field management
4. **Missing Features**: The MCP interface does NOT support:
   - Department assignment
   - Icon uploads
   - Additional terms
   - Language/status/term type selection
   - Complex term group management

### Example Usage for Another AI:

```javascript
// Get all professions
const professions = await mcp_libs-mcp-service_get_professions({
  page: 1,
  limit: 50
});

// Create a new profession (simplified)
const newProfession = await mcp_libs-mcp-service_create_profession({
  name: "Software Engineer",
  description: "Professional responsible for software development"
});

// Update a profession (simplified)
const updatedProfession = await mcp_libs-mcp-service_update_profession({
  professionId: "123",
  name: "Senior Software Engineer",
  description: "Updated description for senior software engineer"
});
```

### Response Format

All MCP functions return JSON objects with the following structure:

```javascript
{
  success: true,
  data: {
    id: 1,
    name: "Profession Name",
    description: "Profession description",
    // ... other fields managed internally
  },
  message: "Operation completed successfully"
}
```

## Complete Field Reference

### Profession Model Fields:
```javascript
{
  id: INTEGER,                    // Primary key, auto-increment
  term_group_id: INTEGER,         // Foreign key to TermGroup (nullable)
  department_id: INTEGER,         // Foreign key to Department (nullable)
  // AI fields (managed internally, not exposed in MCP)
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

### Term Model Fields (for Main Term):
```javascript
{
  id: INTEGER,                    // Primary key, auto-increment
  value: STRING,                  // REQUIRED - Term value (profession name)
  description: TEXT,              // Nullable - Term description
  language_id: INTEGER,           // REQUIRED - Foreign key to Language
  term_type_id: INTEGER,          // REQUIRED - Foreign key to TermType
  status_id: SMALLINT,            // Nullable - Foreign key to Status
  entity_type_id: INTEGER,        // Nullable - Foreign key to EntityType
  created_by: STRING              // Nullable - User who created the term
}
```

### TermGroup Model Fields:
```javascript
{
  id: INTEGER,                    // Primary key, auto-increment
  name: STRING,                   // REQUIRED - Group name (from main term value)
  main_term_id: INTEGER,          // REQUIRED - Foreign key to main Term
  description: TEXT,              // Nullable - Group description
  status_id: SMALLINT,            // Nullable - Foreign key to Status
  created_by: STRING,             // Nullable - User who created the group
  icon: STRING,                   // Nullable - Path to icon file
  // AI fields (managed internally, not exposed in MCP)
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

### ProfessionTool Junction Table Fields:
```javascript
{
  profession_id: INTEGER,         // REQUIRED - Foreign key to Profession
  tool_id: INTEGER,              // REQUIRED - Foreign key to Tool
  createdAt: DATE,               // Auto-generated timestamp
  updatedAt: DATE                // Auto-generated timestamp
}
```

### Related Model Fields (for Reference):

#### Department Model:
```javascript
{
  id: INTEGER,                    // Primary key, auto-increment
  library_id: INTEGER,            // Foreign key to Library (nullable)
  term_group_id: INTEGER,         // Foreign key to TermGroup (nullable)
  color: STRING(50)               // Color code for UI display (nullable)
}
```

#### Library Model:
```javascript
{
  id: INTEGER,                    // Primary key, auto-increment
  name: STRING,                   // Library name
  description: TEXT,              // Library description
  icon: STRING,                   // Path to icon file
  created_by: STRING,             // User who created the library
  status_id: SMALLINT,            // Foreign key to Status
  priority_id: INTEGER,           // Foreign key to Priority
  library_id: INTEGER,            // Foreign key to parent Library
  translation_id: INTEGER,        // Foreign key to translation Library
  library_id: INTEGER             // Foreign key to parent Library
}
```

#### Language Model:
```javascript
{
  id: INTEGER,                    // Primary key, auto-increment
  name: STRING,                   // Language name (e.g., "Russian")
  iso2: STRING(2),                // ISO 2-letter code (e.g., "ru")
  iso3: STRING(3),                // ISO 3-letter code (e.g., "rus")
  library_id: INTEGER,            // Foreign key to Library (nullable)
  term_group_id: INTEGER          // Foreign key to TermGroup (nullable)
}
```

#### Status Model:
```javascript
{
  id: SMALLINT,                   // Primary key, auto-increment
  name: STRING(50),               // Status name (e.g., "Active", "Inactive")
  color: STRING(50)               // Color code for UI display
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
- **department_id**: null (if not provided)
- **created_by**: "0" (if not provided)

### Relationships:
- **Profession** → **Department** (via `department_id`)
- **Profession** → **TermGroup** (via `term_group_id`)
- **Profession** ↔ **Tool** (many-to-many via `profession_tool` junction table)
- **TermGroup** → **Term** (via `main_term_id` for main term)
- **TermGroup** ↔ **Term** (many-to-many via `TermGroupRelation` for additional terms)
- **Term** → **Language** (via `language_id`)
- **Term** → **Status** (via `status_id`)
- **Term** → **TermType** (via `term_type_id`)

## Summary

The MCP service provides a **simplified abstraction** over a complex profession creation system. While the actual system involves TermGroups, Terms, Languages, Statuses, and file uploads, the MCP interface only requires `name` and `description` fields. The backend handles all the complexity automatically, making it easy for AI systems to create professions without understanding the underlying data model complexity.

### Key Points:
1. **Simplified MCP Interface**: Only `name` and `description` required
2. **Complex Backend Processing**: Creates TermGroups, Terms, and manages relationships
3. **Department Assignment**: Can be assigned to departments (not exposed in MCP)
4. **Tool Integration**: Can be linked to multiple tools via many-to-many relationship
5. **AI Integration**: Full AI content management capabilities
6. **File Support**: Icon upload and storage capabilities
7. **Multi-language Support**: Full internationalization capabilities

### For AI Integration:
The MCP interface is perfect for AI systems that need to create professions quickly without understanding the underlying complexity. The backend automatically handles all the complex relationships and default values.
