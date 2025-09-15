# Position Model Description for MCP Integration

## Full Position Model Description

### Core Fields
- **id**: Primary key (INTEGER, auto-increment)
- **term_group_id**: Foreign key to TermGroup model (INTEGER, nullable)

### Relationships
- **Belongs to TermGroup**: `term_group_id` → `term_groups.id`
- **Has many Terms**: Via TermGroup relationship

## Important: Complex Creation Process

**CRITICAL**: Like Departments, Professions, Industries, Sub-Industries, and Levels, Position creation involves complex TermGroup management with multi-language support.

### Frontend Form Data Structure:
```javascript
const formDataToSend = new FormData();
formDataToSend.append('mainTerm', JSON.stringify({
  value: "Software Developer",      // REQUIRED
  description: "Develops software applications",
  language_id: 1,                    // Language ID (default: 1)
  status_id: 1,                      // Status ID (default: 1)  
  term_type_id: 1                    // Term Type ID (default: 1)
}));
formDataToSend.append('terms', JSON.stringify([
  {
    value: "Programmer",
    description: "Alternative term for developer",
    language_id: 1,
    term_type_id: 2,
    status_id: 1
  }
]));
formDataToSend.append('icon', iconFile); // Optional icon file
```

### Required Fields for Creating the Simplest Position:

#### 1. Position Model (Minimal):
```javascript
{
  // No specific fields required - only term_group_id is auto-assigned
}
```

#### 2. Term Model (Main Term - REQUIRED):
```javascript
{
  value: "Software Developer",       // REQUIRED - The position name
  description: "Description",       // Optional
  language_id: 1,                    // REQUIRED - Default: 1 (usually Russian)
  term_type_id: 1,                   // REQUIRED - Default: 1 (usually "main")
  status_id: 1,                      // Optional - Default: 1 (usually "Active")
  created_by: "user_id"              // Optional
}
```

#### 3. TermGroup Model (Auto-created):
```javascript
{
  name: "Software Developer",        // Auto-filled from mainTerm.value
  main_term_id: 123,                 // Auto-linked to created Term
  description: "Description",        // Auto-filled from mainTerm.description
  created_by: "user_id",             // Auto-filled from mainTerm.created_by
  icon: "/path/to/icon.png"          // Optional, from file upload
}
```

### Default Values Used by Backend:
- **language_id**: 1 (usually Russian)
- **term_type_id**: 1 (usually "main" term type)
- **status_id**: 1 (usually "Active" status)
- **created_by**: "0" (if not provided)

## MCP Instructions for Position Operations

### Available MCP Functions for Positions:

1. **Get all positions**:
   ```javascript
   mcp_libs-mcp-service_get_positions({
     page: 1,           // Page number (default: 1)
     limit: 10,         // Number of positions per page (default: 10)
     search: "search"   // Search by position name or description
   })
   ```

2. **Get specific position**:
   ```javascript
   mcp_libs-mcp-service_get_position({
     positionId: "position_id_here"
   })
   ```

3. **Create new position**:
   ```javascript
   mcp_libs-mcp-service_create_position({
     name: "Position Name",           // REQUIRED
     description: "Position description"  // REQUIRED
   })
   ```

4. **Update existing position**:
   ```javascript
   mcp_libs-mcp-service_update_position({
     positionId: "position_id_here",     // REQUIRED
     name: "Updated Position Name",      // REQUIRED
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
   - Icon uploads
   - Additional terms
   - Language/status/term type selection
   - Complex term group management

### Example Usage for Another AI:

```javascript
// Get all positions
const positions = await mcp_libs-mcp-service_get_positions({
  page: 1,
  limit: 50
});

// Create a new position (simplified)
const newPosition = await mcp_libs-mcp-service_create_position({
  name: "Senior Developer",
  description: "Senior software development position with extensive experience"
});

// Update a position (simplified)
const updatedPosition = await mcp_libs-mcp-service_update_position({
  positionId: "123",
  name: "Lead Developer",
  description: "Updated description for lead developer position"
});
```

### Response Format

All MCP functions return JSON objects with the following structure:

```javascript
{
  success: true,
  data: {
    id: 1,
    name: "Position Name",
    description: "Position description",
    // ... other fields managed internally
  },
  message: "Operation completed successfully"
}
```

## Complete Field Reference

### Position Model Fields:
```javascript
{
  id: INTEGER,                    // Primary key, auto-increment
  term_group_id: INTEGER          // Foreign key to TermGroup (nullable)
}
```

### Term Model Fields (for Main Term):
```javascript
{
  id: INTEGER,                    // Primary key, auto-increment
  value: STRING,                  // REQUIRED - Term value (position name)
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

### Default Positions (Common Examples):
```javascript
[
  { name: "Software Developer" },
  { name: "Frontend Developer" },
  { name: "Backend Developer" },
  { name: "Full Stack Developer" },
  { name: "DevOps Engineer" },
  { name: "QA Engineer" },
  { name: "UI/UX Designer" },
  { name: "Product Manager" },
  { name: "Project Manager" },
  { name: "Technical Lead" },
  { name: "Team Lead" },
  { name: "Senior Developer" },
  { name: "Junior Developer" },
  { name: "Architect" },
  { name: "Data Scientist" }
]
```

### Relationships:
- **Position** → **TermGroup** (via `term_group_id`)
- **TermGroup** → **Term** (via `main_term_id` for main term)
- **TermGroup** ↔ **Term** (many-to-many via `TermGroupRelation` for additional terms)
- **Term** → **Language** (via `language_id`)
- **Term** → **Status** (via `status_id`)
- **Term** → **TermType** (via `term_type_id`)

### Backend Processing:
1. **Creates Position** (minimal entity)
2. **Creates TermGroup** with mainTerm and additional terms
3. **Links Position** to TermGroup via `term_group_id`
4. **Handles file uploads** for icons
5. **Manages complex relationships** between terms, languages, statuses, and term types

## API Endpoints for Positions

### Available REST API Endpoints:

1. **Create Position**:
   ```
   POST /api/positions
   Content-Type: multipart/form-data
   Authorization: Bearer <token>
   Body: FormData with mainTerm, terms, icon
   ```

2. **Get all Positions**:
   ```
   GET /api/positions
   Query Parameters:
   - page: Page number (default: 1)
   - limit: Items per page (default: 10)
   - search: Search by name or description
   - sortBy: Sort field (id, name, language, termType, status)
   - sortOrder: Sort order (asc, desc)
   - all: Return all positions without pagination
   - isShort: Return only ID and name
   - filters: JSON filters for language_id, term_type_id, status_id
   ```

3. **Get specific Position**:
   ```
   GET /api/positions/:id
   ```

4. **Update Position**:
   ```
   PUT /api/positions/:id
   Content-Type: multipart/form-data
   Authorization: Bearer <token>
   Body: FormData with mainTerm, terms, icon, removeIcon
   ```

5. **Delete Position**:
   ```
   DELETE /api/positions/:id
   Authorization: Bearer <token>
   ```

6. **Get all Position Terms**:
   ```
   GET /api/positions/terms
   Query Parameters:
   - all: Return all terms without pagination
   - page: Page number (default: 1)
   - limit: Items per page (default: 10)
   - search: Search by term value, description, position name
   - sortBy: Sort field (term, termType, language, status, positionName)
   - sortOrder: Sort order (asc, desc)
   - filters: JSON filters for language_id, term_type_id, status_id
   ```

## Key Differences from Department/Profession Models

### 1. **Minimal Core Model**:
- **Position**: Only has `id` and `term_group_id` fields
- **Department**: Has `color` field
- **Profession**: Has `department_id` and `tool_ids` fields

### 2. **Usage Context**:
- **Position**: Represents job positions/roles
- **Department**: Represents organizational units
- **Profession**: Represents job professions with department associations

### 3. **Terminology**:
- **Position**: Uses "position" terminology in API endpoints
- **Department**: Uses "department" terminology
- **Profession**: Uses "profession" terminology

### 4. **Complexity**:
- **Position**: Same complexity as Department/Profession with TermGroups
- **All**: Use same TermGroup system for multi-language support

## Advanced Features

### 1. **Search and Filtering**:
```javascript
// Search by name or description
GET /api/positions?search=developer

// Filter by language, term type, or status
GET /api/positions?filters={"language_id":1,"status_id":1}

// Sort by different fields
GET /api/positions?sortBy=name&sortOrder=desc

// Get short format (ID and name only)
GET /api/positions?isShort=true

// Get all positions without pagination
GET /api/positions?all=true
```

### 2. **Term Management**:
```javascript
// Get all terms from all positions
GET /api/positions/terms

// Search terms across all positions
GET /api/positions/terms?search=senior

// Filter terms by language or status
GET /api/positions/terms?filters={"language_id":1}
```

### 3. **File Upload Support**:
```javascript
// Upload icon for position
POST /api/positions
Content-Type: multipart/form-data
Body: FormData with icon file

// Remove icon
PUT /api/positions/:id
Body: { "removeIcon": "true" }
```

## Summary

The Position model is a **complex entity** that uses the TermGroup system for multi-language support, similar to Departments, Professions, Industries, Sub-Industries, and Levels. Unlike simple entities like Status, Priority, Shift, Currency, or Rate, Positions:

### Key Points:
1. **Complex MCP Interface**: Only `name` and `description` required (simplified)
2. **TermGroup Integration**: Uses complex TermGroup system internally
3. **Multi-language Support**: Full translation capabilities
4. **File Upload Support**: Icon management
5. **Minimal Core Model**: Only `id` and `term_group_id` fields
6. **Position Management**: Represents job positions and roles
7. **Advanced Search**: Complex filtering and search capabilities

### For AI Integration:
The Position model is one of the more complex entities to work with:
- **Simplified MCP Interface**: Only name and description required
- **Complex Backend**: Uses TermGroup system internally
- **Multi-language**: Full translation support
- **File Management**: Icon upload/removal
- **Advanced Features**: Complex search, filtering, and term management

### Common Use Cases:
1. **Job Positions**: Software Developer, Designer, Manager
2. **Role Definitions**: Specific job roles and responsibilities
3. **Organizational Structure**: Position-based hierarchy
4. **Recruitment**: Position-based job postings
5. **Career Development**: Position-based career paths

### Future Considerations:
- **Integration with Departments**: Positions could be linked to specific departments
- **Integration with Professions**: Positions could be linked to professions
- **Salary Bands**: Position-based compensation structures
- **Skill Requirements**: Position-specific skill requirements
- **Reporting Structure**: Position-based reporting relationships

The MCP interface provides a simplified abstraction over a complex position management system, making it easy for AI systems to create positions without understanding the underlying TermGroup complexity.
