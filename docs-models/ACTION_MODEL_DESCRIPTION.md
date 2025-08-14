# Action Model Description for MCP Integration

## Full Action Model Description

### Core Fields
- **id**: Primary key (INTEGER, auto-increment)
- **term_group_id**: Foreign key to TermGroup model (INTEGER, nullable)

### Relationships
- **Belongs to TermGroup**: `actions.term_group_id` → `term_groups.id`

## Important: Complex Creation Process

**CRITICAL**: The actual action creation process involves TermGroups and complex relationships, similar to Departments, Professions, and Languages.

### Frontend Form Data Structure:
```javascript
const formDataToSend = new FormData();
formDataToSend.append('mainTerm', JSON.stringify({
  value: "Action Name",              // REQUIRED
  description: "Action description",
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

### Required Fields for Creating the Simplest Action:

#### 1. Action Model (Minimal):
```javascript
{
  // No required fields - Action is created empty
}
```

#### 2. Term Model (Main Term - REQUIRED):
```javascript
{
  value: "Action Name",              // REQUIRED - The action name
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
  name: "Action Name",               // Auto-filled from mainTerm.value
  main_term_id: 123,                 // Auto-linked to created Term
  description: "Description",         // Auto-filled from mainTerm.description
  created_by: "user_id",             // Auto-filled from mainTerm.created_by
  icon: "/path/to/icon.png"          // Optional, from file upload
}
```

### Backend Processing:
1. **Creates Action** with no additional fields
2. **Creates TermGroup** with mainTerm and additional terms
3. **Links Action** to TermGroup via `term_group_id`
4. **Handles file uploads** for icons
5. **Manages complex relationships** between terms, languages, statuses, and term types

## MCP Instructions for Action Operations

### Available MCP Functions for Actions:

1. **Get all actions**:
   ```javascript
   mcp_libs-mcp-service_get_actions({
     page: 1,           // Page number (default: 1)
     limit: 10,         // Number of actions per page (default: 10)
     search: "search"   // Search by action name
   })
   ```

2. **Get specific action**:
   ```javascript
   mcp_libs-mcp-service_get_action({
     actionId: "action_id_here"
   })
   ```

3. **Create new action**:
   ```javascript
   mcp_libs-mcp-service_create_action({
     name: "Action Name",              // REQUIRED
     description: "Action description"  // REQUIRED
   })
   ```

4. **Update existing action**:
   ```javascript
   mcp_libs-mcp-service_update_action({
     actionId: "action_id_here",       // REQUIRED
     name: "Updated Action Name",      // REQUIRED
     description: "Updated description" // REQUIRED
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
   - Icon uploads
   - Additional terms
   - Language/status/term type selection
   - Complex term group management

### Example Usage for Another AI:

```javascript
// Get all actions
const actions = await mcp_libs-mcp-service_get_actions({
  page: 1,
  limit: 50
});

// Create a new action (simplified)
const newAction = await mcp_libs-mcp-service_create_action({
  name: "Create User",
  description: "Action to create a new user account"
});

// Update an action (simplified)
const updatedAction = await mcp_libs-mcp-service_update_action({
  actionId: "123",
  name: "Create New User",
  description: "Updated description for user creation action"
});
```

### Response Format

All MCP functions return JSON objects with the following structure:

```javascript
{
  success: true,
  data: {
    id: 1,
    name: "Action Name",
    description: "Action description",
    // ... other fields managed internally
  },
  message: "Operation completed successfully"
}
```

## Complete Field Reference

### Action Model Fields:
```javascript
{
  id: INTEGER,                    // Primary key, auto-increment
  term_group_id: INTEGER         // Foreign key to TermGroup (nullable)
}
```

### Term Model Fields (for Main Term):
```javascript
{
  id: INTEGER,                    // Primary key, auto-increment
  value: STRING,                  // REQUIRED - Term value (action name)
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
  iso2: STRING(2),               // REQUIRED - ISO 2-letter language code
  iso3: STRING(3),               // REQUIRED - ISO 3-letter language code
  library_id: INTEGER,           // Foreign key to Library (nullable)
  term_group_id: INTEGER         // Foreign key to TermGroup (nullable)
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
- **created_by**: "0" (if not provided)

### Common Action Examples:
```javascript
[
  { name: "Create User", description: "Action to create a new user account" },
  { name: "Update Profile", description: "Action to update user profile information" },
  { name: "Delete Account", description: "Action to delete a user account" },
  { name: "Send Email", description: "Action to send an email notification" },
  { name: "Generate Report", description: "Action to generate a system report" },
  { name: "Backup Data", description: "Action to backup system data" },
  { name: "Restore Data", description: "Action to restore data from backup" },
  { name: "Validate Input", description: "Action to validate user input data" }
]
```

### Relationships:
- **Action** → **TermGroup** (via `term_group_id`)
- **TermGroup** → **Term** (via `main_term_id` for main term)
- **TermGroup** ↔ **Term** (many-to-many via `TermGroupRelation` for additional terms)
- **Term** → **Language** (via `language_id`)
- **Term** → **Status** (via `status_id`)
- **Term** → **TermType** (via `term_type_id`)

## API Endpoints for Actions

### Available REST API Endpoints:

1. **Create Action**:
   ```
   POST /api/action
   Content-Type: multipart/form-data
   Authorization: Bearer <token>
   ```

2. **Get all Actions**:
   ```
   GET /api/action?page=1&limit=20&search=search_term&all=true
   ```

3. **Get specific Action**:
   ```
   GET /api/action/:id
   ```

4. **Update Action**:
   ```
   PUT /api/action/:id
   Content-Type: multipart/form-data
   Authorization: Bearer <token>
   ```

5. **Delete Action**:
   ```
   DELETE /api/action/:id
   Authorization: Bearer <token>
   ```

6. **Get Action Terms**:
   ```
   GET /api/action/terms?page=1&limit=20&search=search_term
   ```

## Key Differences from Other Models

### 1. **Minimal Core Structure**:
- **No Additional Fields**: Action model only has id and term_group_id
- **No Direct Relationships**: No direct relationships to other entities
- **TermGroup Dependency**: All content managed through TermGroup

### 2. **Action-Specific Features**:
- **Workflow Actions**: Represents actions in workflows or processes
- **Process Management**: Used for defining system actions and operations
- **Term-Based Content**: All content managed through the Term system

### 3. **Simplified Model**:
- **No Complex Fields**: Unlike Departments/Professions, no additional metadata
- **No Direct Associations**: No direct links to other entities
- **Pure Term System**: Relies entirely on TermGroup for content management

## Validation Rules

### Name Field Validation (via Term):
- **Required**: Cannot be empty or null
- **Length**: No specific length limit (STRING field)
- **Format**: String value (no special format requirements)

### Backend Validation:
```javascript
// Validation logic in controller
if (!mainTerm?.value) {
  return res.status(400).json({ message: 'Action name is required' });
}

// Term validation through termsService
const termData = {
  value: mainTerm.value,
  description: mainTerm.description || '',
  language_id: mainTerm.language_id || 1,
  term_type_id: mainTerm.term_type_id || 1,
  status_id: mainTerm.status_id || null
};
```

## Error Handling

### Common Error Responses:

1. **Validation Errors**:
   ```javascript
   {
     message: "Action name is required"
   }
   ```

2. **Not Found Errors**:
   ```javascript
   {
     message: "Action not found"
   }
   ```

3. **Server Errors**:
   ```javascript
   {
     message: "Ошибка при создании действия"
   }
   ```

## File Upload Handling

### Icon File Processing:
1. **File Upload**: Multer middleware handles file uploads
2. **File Validation**: Validates file type (image) and size (5MB max)
3. **File Storage**: Stores files in `/uploads/` directory
4. **File Path**: Stores relative path in TermGroup
5. **File Cleanup**: Deletes old files when updating/deleting actions

### File Upload Middleware:
```javascript
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg+xml'];
    if (allowedTypes.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Unsupported file type'), false);
  }
});
```

## Summary

The Action model provides a **minimal but complex** entity for managing workflow actions through the Term system. While the core model is simple, the creation process involves TermGroups and complex relationships.

### Key Points:
1. **Minimal Core Model**: Only id and term_group_id fields
2. **Complex Creation Process**: Involves TermGroups, Terms, and file uploads
3. **Simplified MCP Interface**: Only `name` and `description` required
4. **Term-Based Content**: All content managed through Term system
5. **File Support**: Icon upload and storage capabilities
6. **Workflow Integration**: Designed for workflow and process management

### For AI Integration:
The Action model is suitable for AI systems that need to create workflow actions. The MCP interface provides a simplified view while the backend handles complex TermGroup creation and file management.

### Common Use Cases:
1. **Workflow Actions**: Creating actions for business processes
2. **System Operations**: Defining system-level actions
3. **Process Management**: Managing workflow steps and operations
4. **Action Categorization**: Organizing actions by type and purpose
5. **Multi-language Support**: Supporting actions in multiple languages

### Advantages:
- **Simple Core**: Minimal model structure
- **Flexible Content**: Rich content through Term system
- **Multi-language**: Full internationalization support
- **File Support**: Icon upload capabilities
- **AI Integration**: Full AI content management capabilities

### Limitations:
- **Term Dependency**: Relies entirely on Term system
- **Complex Creation**: Complex backend processing
- **No Direct Relationships**: No direct links to other entities
- **MCP Simplification**: Many features not exposed in MCP interface
