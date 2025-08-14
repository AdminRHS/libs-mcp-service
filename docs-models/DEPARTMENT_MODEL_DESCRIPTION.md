# Department Model Description for MCP Integration

## Full Department Model Description

### Core Fields
- **id**: Primary key (INTEGER, auto-increment)
- **term_group_id**: Foreign key to TermGroup model (INTEGER, nullable)
- **color**: Color code for UI display (STRING(50), nullable)

### Relationships
- **Belongs to TermGroup**: `term_group_id` → `term_groups.id`
- **Has many Professions**: `departments.id` → `professions.department_id`

## Important: Complex Creation Process

**CRITICAL**: The actual department creation process is much more complex than the MCP interface suggests. The frontend sends a FormData object with:

### Frontend Form Data Structure:
```javascript
const formDataToSend = new FormData();
formDataToSend.append('color', formData.color);
formDataToSend.append('mainTerm', JSON.stringify({
  value: "Department Name",           // REQUIRED
  description: "Department description",
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
```

### Required Fields for Creating the Simplest Department:

#### 1. Department Model (Minimal):
```javascript
{
  color: "#1976d2"  // Optional, has default
}
```

#### 2. Term Model (Main Term - REQUIRED):
```javascript
{
  value: "Department Name",           // REQUIRED - The department name
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
  name: "Department Name",            // Auto-filled from mainTerm.value
  main_term_id: 123,                 // Auto-linked to created Term
  description: "Description",         // Auto-filled from mainTerm.description
  created_by: "user_id",             // Auto-filled from mainTerm.created_by
  icon: "/path/to/icon.png"          // Optional, from file upload
}
```

### Default Values Used by Backend:
- **language_id**: 1 (usually Russian)
- **term_type_id**: 1 (usually "main" term type)
- **status_id**: 1 (usually "Active" status)
- **color**: "#1976d2" (default blue)
- **created_by**: "0" (if not provided)

## Complete Field Reference

### Department Model Fields:
```javascript
{
  id: INTEGER,                    // Primary key, auto-increment
  library_id: INTEGER,            // Foreign key to Library (nullable)
  term_group_id: INTEGER,         // Foreign key to TermGroup (nullable)
  color: STRING(50),              // Color code for UI display (nullable)
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
  value: STRING,                  // REQUIRED - Term value (department name)
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

### Related Model Fields (for Reference):

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

### Relationships:
- **Department** → **TermGroup** (via `term_group_id`)
- **TermGroup** → **Term** (via `main_term_id` for main term)
- **TermGroup** ↔ **Term** (many-to-many via `TermGroupRelation` for additional terms)
- **Term** → **Language** (via `language_id`)
- **Term** → **Status** (via `status_id`)
- **Term** → **TermType** (via `term_type_id`)
- **Department** → **Profession** (one-to-many, professions belong to departments)

### Backend Processing:
1. **Creates Department** with color
2. **Creates TermGroup** with mainTerm and additional terms
3. **Links Department** to TermGroup via `term_group_id`
4. **Handles file uploads** for icons
5. **Manages complex relationships** between terms, languages, statuses, and term types

## MCP Instructions for Department Operations

### Available MCP Functions for Departments:

1. **Get all departments**:
   ```javascript
   mcp_libs-mcp-service_get_departments({
     page: 1,           // Page number (default: 1)
     limit: 10,         // Number of departments per page (default: 10)
     search: "search"   // Search by department name or description
   })
   ```

2. **Get specific department**:
   ```javascript
   mcp_libs-mcp-service_get_department({
     departmentId: "department_id_here"
   })
   ```

3. **Create new department**:
   ```javascript
   mcp_libs-mcp-service_create_department({
     name: "Department Name",           // REQUIRED
     description: "Department description"  // REQUIRED
   })
   ```

4. **Update existing department**:
   ```javascript
   mcp_libs-mcp-service_update_department({
     departmentId: "department_id_here",    // REQUIRED
     name: "Updated Department Name",       // REQUIRED
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
   - Color customization
   - Icon uploads
   - Additional terms
   - Language/status/term type selection
   - Complex term group management

### Example Usage for Another AI:

```javascript
// Get all departments
const departments = await mcp_libs-mcp-service_get_departments({
  page: 1,
  limit: 50
});

// Create a new department (simplified)
const newDepartment = await mcp_libs-mcp-service_create_department({
  name: "Software Development",
  description: "Department responsible for software development activities"
});

// Update a department (simplified)
const updatedDepartment = await mcp_libs-mcp-service_update_department({
  departmentId: "123",
  name: "Advanced Software Development",
  description: "Updated description for software development department"
});
```

### Response Format

All MCP functions return JSON objects with the following structure:

```javascript
{
  success: true,
  data: {
    id: 1,
    name: "Department Name",
    description: "Department description",
    // ... other fields managed internally
  },
  message: "Operation completed successfully"
}
```

## Summary

The MCP service provides a **simplified abstraction** over a complex department creation system. While the actual system involves TermGroups, Terms, Languages, Statuses, and file uploads, the MCP interface only requires `name` and `description` fields. The backend handles all the complexity automatically, making it easy for AI systems to create departments without understanding the underlying data model complexity.
