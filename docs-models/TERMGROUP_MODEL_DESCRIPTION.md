# TermGroup Model Description for MCP Integration (Updated)

## Full TermGroup Model Description

### Core Fields (TermGroup)
- id: Primary key (INTEGER, auto-increment)
- name: Group name (STRING, required)
- main_term_id: Foreign key to main Term (INTEGER, required)
- description: Group description (TEXT, nullable)
- status_id: Foreign key to Status (SMALLINT, nullable)
- created_by: User who created the group (STRING, nullable)
- icon: Path to icon file (STRING, nullable)

Note: AI fields are not stored on term_groups. All AI metadata lives on terms (both Main Term and additional Terms) per migration 20250721000020.

### Term AI-Generated Content Fields (apply to every Term)
These fields exist on the terms table and therefore apply to the Main Term and every additional Term in a group:
- ai_generated: Boolean flag (default: false)
- ai_model: AI model used (STRING(100), nullable)
- ai_prompt_version: Prompt version (STRING(50), nullable)
- ai_generation_date: Generation date (DATE, nullable)
- ai_tokens_used: Tokens consumed (INTEGER, nullable)
- ai_quality_score: 0.00–9.99 (DECIMAL(3,2), nullable)
- ai_validation_status: 'pending' | 'approved' | 'rejected' | 'needs_review' (default: 'pending')
- ai_source_data: Original source data (JSONB, nullable)
- ai_metadata: Additional metadata (JSONB, nullable)
- ai_confidence_score: 0.00–9.99 (DECIMAL(3,2), nullable)
- ai_human_reviewed: Human review flag (BOOLEAN, default: false)
- ai_human_reviewer: Reviewer name (STRING(100), nullable)
- ai_review_date: Human review date (DATE, nullable)
- ai_version: Version number (INTEGER, default: 1)
- ai_batch_id: Batch identifier (STRING(50), nullable)
- ai_edit_history: Edit history (JSONB, nullable)
- ai_original_data: Original data snapshot (JSONB, nullable)
- ai_manual_overrides: Manual overrides (JSONB, nullable)
- ai_market_validated: Market validation flag (BOOLEAN, default: false)
- ai_validation_errors: Validation errors (JSONB, nullable)

### Relationships
- TermGroup belongs to MainTerm: main_term_id → terms.id
- TermGroup belongs to Status: status_id → statuses.id
- TermGroup has many Terms: via term_group_relations.term_group_id
- TermGroup has many Professions: professions.term_group_id
- TermGroup has many Departments: departments.term_group_id
- TermGroup has many Languages: languages.term_group_id

## TermGroupRelation Model (Junction Table)

### Fields
- id: Primary key (INTEGER, auto-increment)
- term_group_id: FK to TermGroup (INTEGER, required)
- term_id: FK to Term (INTEGER, required)
- term_type_id: FK to TermType (INTEGER, required)
- priority: Priority order (INTEGER, default: 0)

### Relationships
- Belongs to TermGroup: term_group_id → term_groups.id
- Belongs to Term: term_id → terms.id
- Belongs to TermType: term_type_id → term_types.id

## Creation and Data Flow (Updated)

AI metadata is attached to Terms. When creating a TermGroup, you may include AI fields inside mainTerm and inside each item of terms. The backend persists those AI fields on the created/updated Term records.

### Frontend Form Data Structure (Updated)
```javascript
const termGroupData = {
  mainTerm: {
    value: "Term Group Name",           // REQUIRED
    description: "Term group description",
    language_id: 1,                      // default: 1
    status_id: 1,                        // default: 1
    term_type_id: 1,                     // default: 1 ("main")
    created_by: "user_id",
    // Optional AI fields on Main Term
    ai_generated: true,
    ai_model: "gpt-4o-mini",
    ai_prompt_version: "1.0",
    ai_generation_date: "2025-07-21T10:00:00Z",
    ai_tokens_used: 1234,
    ai_quality_score: 8.75,
    ai_validation_status: "pending",
    ai_source_data: { input: "..." },
    ai_metadata: { language: "en" },
    ai_confidence_score: 8.4,
    ai_human_reviewed: false,
    ai_version: 1,
    ai_batch_id: "BATCH-001"
  },
  terms: [
    {
      value: "Additional Term",
      description: "Term description",
      language_id: 1,
      term_type_id: 2,                   // e.g. "similar"
      status_id: 1,
      created_by: "user_id",
      // Optional AI fields on this Term
      ai_generated: true,
      ai_model: "gpt-4o-mini",
      ai_prompt_version: "1.0"
    }
  ],
  entity_type: "department",           // Optional - for linking
  entity_id: 123,                        // Optional - entity ID
  icon: iconFile                         // Optional icon file (stored on term_groups)
};
```

### Backend Processing
1. Creates Main Term (persists any provided AI fields on terms)
2. Creates term_groups with main_term_id
3. Creates additional Terms (persists AI fields per Term)
4. Creates term_group_relations for all terms with term_type_id
5. Handles icon file upload on term_groups
6. Links to entity (if provided)

## API Endpoints for TermGroups

### Create TermGroup
```
POST /api/terms/groups
Content-Type: multipart/form-data
Authorization: Bearer <token>
```

Example (Updated):
```javascript
const formData = new FormData();
formData.append('mainTerm', JSON.stringify({
  value: "Term Group Name",
  description: "Term group description",
  language_id: 1,
  status_id: 1,
  term_type_id: 1,
  created_by: "user_id",
  ai_generated: true,
  ai_model: "gpt-4o-mini",
  ai_prompt_version: "1.0"
}));

formData.append('terms', JSON.stringify([
  {
    value: "Additional Term",
    language_id: 1,
    term_type_id: 2,
    ai_generated: true
  }
]));

formData.append('entity_type', 'department');
formData.append('entity_id', '123');

const response = await fetch('/api/terms/groups', {
  method: 'POST',
  headers: { Authorization: 'Bearer ' + token },
  body: formData
});
```

### Get TermGroups
```
GET /api/terms/groups?page=1&limit=20&search=search_term
```

### Get specific TermGroup
```
GET /api/terms/groups/:id
```

### Update TermGroup
```
PUT /api/terms/groups/:id
Content-Type: multipart/form-data
Authorization: Bearer <token>
```

Example (Updated):
```javascript
const formData = new FormData();
formData.append('mainTerm', JSON.stringify({
  value: "Updated Term Group Name",
  description: "Updated description",
  ai_validation_status: "approved",
  ai_human_reviewed: true,
  ai_human_reviewer: "editor@company"
}));

const response = await fetch(`/api/terms/groups/${termGroupId}`, {
  method: 'PUT',
  headers: { Authorization: 'Bearer ' + token },
  body: formData
});
```

## Complete Field Reference

### TermGroup Model Fields
```javascript
{
  id: INTEGER,
  name: STRING,
  main_term_id: INTEGER,
  description: TEXT,
  status_id: SMALLINT,
  created_by: STRING,
  icon: STRING
}
```

### Term Model Fields (with AI)
```javascript
{
  id: INTEGER,
  value: STRING,                    // REQUIRED
  description: TEXT,
  language_id: INTEGER,             // REQUIRED
  term_type_id: INTEGER,            // REQUIRED
  status_id: SMALLINT,
  entity_type_id: INTEGER,
  created_by: STRING,
  // AI fields on every Term (Main + additional Terms)
  ai_generated: BOOLEAN,            // Default: false
  ai_model: STRING(100),
  ai_prompt_version: STRING(50),
  ai_generation_date: DATE,
  ai_tokens_used: INTEGER,
  ai_quality_score: DECIMAL(3,2),
  ai_validation_status: ENUM('pending','approved','rejected','needs_review'),
  ai_source_data: JSONB,
  ai_metadata: JSONB,
  ai_confidence_score: DECIMAL(3,2),
  ai_human_reviewed: BOOLEAN,       // Default: false
  ai_human_reviewer: STRING(100),
  ai_review_date: DATE,
  ai_version: INTEGER,              // Default: 1
  ai_batch_id: STRING(50),
  ai_edit_history: JSONB,
  ai_original_data: JSONB,
  ai_manual_overrides: JSONB,
  ai_market_validated: BOOLEAN,     // Default: false
  ai_validation_errors: JSONB
}
```

### TermGroupRelation Model Fields
```javascript
{
  id: INTEGER,
  term_group_id: INTEGER,
  term_id: INTEGER,
  term_type_id: INTEGER,
  priority: INTEGER                 // Default: 0
}
```

### Default Values Used by Backend
- language_id: 1
- term_type_id: 1 ("main")
- status_id: 1 ("Active")
- created_by: "0" if not provided
- priority: 0

### Relationships
- TermGroup → Term (via main_term_id for main term)
- TermGroup ↔ Term (many-to-many via TermGroupRelation for additional terms)
- TermGroup → Status (via status_id)
- TermGroup → Profession/Department/Language (one-to-many via term_group_id)
- TermGroupRelation → TermType (via term_type_id)

## Migration Notes and Backward Compatibility
- AI fields were previously present on term_groups, professions, and departments.
- Migration 20250721000020 moved all AI metadata to terms and removed them from the above tables.
- New integrations should always write/read AI fields on Term records.

## MCP Instructions
- There are no dedicated MCP functions for TermGroups.
- Use REST endpoints for TermGroup operations.
- MCP functions for departments/professions/languages remain available for their own data; AI fields for naming/terms are handled on Terms.
