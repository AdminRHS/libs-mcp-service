# Level Model Description for MCP Integration

## Full Level Model Description

### Core Fields
- **id**: Primary key (INTEGER, auto-increment)
- **short_name**: Short name identifier (STRING, required)
- **term_group_id**: Foreign key to TermGroup model (INTEGER, nullable)

### Relationships
- **Belongs to TermGroup**: `term_group_id` → `term_groups.id`
- **Has many Terms**: Via TermGroup relationship

## Important: Complex Creation Process

**CRITICAL**: Like Departments, Level creation involves complex TermGroup management with multi-language support.

### Frontend Form Data Structure:
```javascript
const formDataToSend = new FormData();
formDataToSend.append('short_name', 'JR'); // REQUIRED
formDataToSend.append('mainTerm', JSON.stringify({
  value: "Junior Level",           // REQUIRED
  description: "Entry level position",
  language_id: 1,                    // Language ID (default: 1)
  status_id: 1,                      // Status ID (default: 1)  
  term_type_id: 1                    // Term Type ID (default: 1)
}));
formDataToSend.append('terms', JSON.stringify([
  {
    value: "Entry Level",
    description: "Beginning position",
    language_id: 1,
    term_type_id: 2,
    status_id: 1
  }
]));
formDataToSend.append('icon', iconFile); // Optional icon file
```

### Required Fields for Creating the Simplest Level:

#### 1. Level Model (Minimal):
```javascript
{
  short_name: "JR"  // REQUIRED - Short identifier
}
```

#### 2. Term Model (Main Term - REQUIRED):
```javascript
{
  value: "Junior Level",           // REQUIRED - The level name
  description: "Description",      // Optional
  language_id: 1,                  // REQUIRED - Default: 1 (usually Russian)
  term_type_id: 1,                 // REQUIRED - Default: 1 (usually "main")
  status_id: 1,                    // Optional - Default: 1 (usually "Active")
  created_by: "user_id"            // Optional
}
```

#### 3. TermGroup Model (Auto-created):
```javascript
{
  name: "Junior Level",            // Auto-filled from mainTerm.value
  main_term_id: 123,               // Auto-linked to created Term
  description: "Description",      // Auto-filled from mainTerm.description
  created_by: "user_id",           // Auto-filled from mainTerm.created_by
  icon: "/path/to/icon.png"        // Optional, from file upload
}
```

### Default Values Used by Backend:
- **language_id**: 1 (usually Russian)
- **term_type_id**: 1 (usually "main" term type)
- **status_id**: 1 (usually "Active" status)
- **created_by**: "0" (if not provided)

## MCP Instructions for Level Operations

### Available MCP Functions for Levels:

1. **Get all levels**:
   ```javascript
   mcp_libs-mcp-service_get_levels({
     page: 1,           // Page number (default: 1)
     limit: 10,         // Number of levels per page (default: 10)
     search: "search"   // Search by level name or description
   })
   ```

2. **Get specific level**:
   ```javascript
   mcp_libs-mcp-service_get_level({
     levelId: "level_id_here"
   })
   ```

3. **Create new level**:
   ```javascript
   mcp_libs-mcp-service_create_level({
     name: "Level Name",           // REQUIRED
     description: "Level description"  // REQUIRED
   })
   ```

4. **Update existing level**:
   ```javascript
   mcp_libs-mcp-service_update_level({
     levelId: "level_id_here",     // REQUIRED
     name: "Updated Level Name",   // REQUIRED
     description: "Updated description"  // REQUIRED
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
   - Short name customization
   - Icon uploads
   - Additional terms
   - Language/status/term type selection
   - Complex term group management

### Example Usage for Another AI:

```javascript
// Get all levels
const levels = await mcp_libs-mcp-service_get_levels({
  page: 1,
  limit: 50
});

// Create a new level (simplified)
const newLevel = await mcp_libs-mcp-service_create_level({
  name: "Senior Level",
  description: "Advanced level position with extensive experience"
});

// Update a level (simplified)
const updatedLevel = await mcp_libs-mcp-service_update_level({
  levelId: "123",
  name: "Lead Level",
  description: "Updated description for lead level position"
});
```

### Response Format

All MCP functions return JSON objects with the following structure:

```javascript
{
  success: true,
  data: {
    id: 1,
    name: "Level Name",
    description: "Level description",
    // ... other fields managed internally
  },
  message: "Operation completed successfully"
}
```

## Complete Field Reference

### Level Model Fields:
```javascript
{
  id: INTEGER,                    // Primary key, auto-increment
  short_name: STRING,             // REQUIRED - Short identifier
  term_group_id: INTEGER          // Foreign key to TermGroup (nullable)
}
```

### Term Model Fields (for Main Term):
```javascript
{
  id: INTEGER,                    // Primary key, auto-increment
  value: STRING,                  // REQUIRED - Term value (level name)
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
  icon: STRING                    // Nullable - Path to icon file
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

### Default Levels (Common Examples):
```javascript
[
  { short_name: "JR", name: "Junior Level" },
  { short_name: "MD", name: "Middle Level" },
  { short_name: "SR", name: "Senior Level" },
  { short_name: "LD", name: "Lead Level" },
  { short_name: "PR", name: "Principal Level" }
]
```

### Relationships:
- **Level** → **TermGroup** (via `term_group_id`)
- **TermGroup** → **Term** (via `main_term_id` for main term)
- **TermGroup** ↔ **Term** (many-to-many via `TermGroupRelation` for additional terms)
- **Term** → **Language** (via `language_id`)
- **Term** → **Status** (via `status_id`)
- **Term** → **TermType** (via `term_type_id`)

### Backend Processing:
1. **Creates Level** with short_name
2. **Creates TermGroup** with mainTerm and additional terms
3. **Links Level** to TermGroup via `term_group_id`
4. **Handles file uploads** for icons
5. **Manages complex relationships** between terms, languages, statuses, and term types

## API Endpoints for Levels

### Available REST API Endpoints:

1. **Create Level**:
   ```
   POST /api/levels
   Content-Type: multipart/form-data
   Authorization: Bearer <token>
   Body: FormData with short_name, mainTerm, terms, icon
   ```

2. **Get all Levels**:
   ```
   GET /api/levels
   Query Parameters:
   - page: Page number (default: 1)
   - limit: Items per page (default: 10)
   - search: Search by short_name, name, or description
   - sortBy: Sort field (id, short_name, name, language, termType, status)
   - sortOrder: Sort order (asc, desc)
   - all: Return all levels without pagination
   - isShort: Return only ID and name
   - filters: JSON filters for language_id, term_type_id, status_id
   ```

3. **Get specific Level**:
   ```
   GET /api/levels/:id
   ```

4. **Update Level**:
   ```
   PUT /api/levels/:id
   Content-Type: multipart/form-data
   Authorization: Bearer <token>
   Body: FormData with short_name, mainTerm, terms, icon, removeIcon
   ```

5. **Delete Level**:
   ```
   DELETE /api/levels/:id
   Authorization: Bearer <token>
   ```

6. **Get all Level Terms**:
   ```
   GET /api/levels/terms
   Query Parameters:
   - all: Return all terms without pagination
   - page: Page number (default: 1)
   - limit: Items per page (default: 10)
   - search: Search by term value, description, level name
   - sortBy: Sort field (term, termType, language, status, levelName)
   - sortOrder: Sort order (asc, desc)
   - filters: JSON filters for language_id, term_type_id, status_id
   ```

## Key Differences from Department/Profession Models

### 1. **Short Name Field**:
- **Level**: Has `short_name` field for abbreviated identifiers
- **Department/Profession**: No short name field

### 2. **Usage Context**:
- **Level**: Represents seniority/experience levels
- **Department**: Represents organizational units
- **Profession**: Represents job roles

### 3. **Terminology**:
- **Level**: Uses "level" terminology in API endpoints
- **Department**: Uses "department" terminology
- **Profession**: Uses "profession" terminology

### 4. **Complexity**:
- **Level**: Same complexity as Department/Profession with TermGroups
- **All**: Use same TermGroup system for multi-language support

## Advanced Features

### 1. **Search and Filtering**:
```javascript
// Search by short_name, name, or description
GET /api/levels?search=junior

// Filter by language, term type, or status
GET /api/levels?filters={"language_id":1,"status_id":1}

// Sort by different fields
GET /api/levels?sortBy=short_name&sortOrder=desc

// Get short format (ID and name only)
GET /api/levels?isShort=true

// Get all levels without pagination
GET /api/levels?all=true
```

### 2. **Term Management**:
```javascript
// Get all terms from all levels
GET /api/levels/terms

// Search terms across all levels
GET /api/levels/terms?search=senior

// Filter terms by language or status
GET /api/levels/terms?filters={"language_id":1}
```

### 3. **File Upload Support**:
```javascript
// Upload icon for level
POST /api/levels
Content-Type: multipart/form-data
Body: FormData with icon file

// Remove icon
PUT /api/levels/:id
Body: { "removeIcon": "true" }
```

## Summary

The Level model is a **complex entity** that uses the TermGroup system for multi-language support, similar to Departments and Professions. Unlike simple entities like Status or Priority, Levels:

### Key Points:
1. **Complex MCP Interface**: Only `name` and `description` required (simplified)
2. **TermGroup Integration**: Uses complex TermGroup system internally
3. **Multi-language Support**: Full translation capabilities
4. **File Upload Support**: Icon management
5. **Short Name Field**: Unique identifier field
6. **Level Management**: Represents seniority/experience levels
7. **Advanced Search**: Complex filtering and search capabilities

### For AI Integration:
The Level model is one of the more complex entities to work with:
- **Simplified MCP Interface**: Only name and description required
- **Complex Backend**: Uses TermGroup system internally
- **Multi-language**: Full translation support
- **File Management**: Icon upload/removal
- **Advanced Features**: Complex search, filtering, and term management

### Common Use Cases:
1. **Seniority Levels**: Junior, Middle, Senior, Lead, Principal
2. **Experience Levels**: Entry, Mid-level, Senior, Expert
3. **Skill Levels**: Beginner, Intermediate, Advanced, Expert
4. **Position Levels**: Associate, Staff, Senior Staff, Principal

### Future Considerations:
- **Integration with Professions**: Levels could be linked to specific professions
- **Salary Bands**: Level-based compensation structures
- **Career Progression**: Level-based promotion paths
- **Skill Requirements**: Level-specific skill requirements

The MCP interface provides a simplified abstraction over a complex level management system, making it easy for AI systems to create levels without understanding the underlying TermGroup complexity.

