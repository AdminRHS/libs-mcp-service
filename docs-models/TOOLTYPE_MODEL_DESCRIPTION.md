# ToolType Model Description for MCP Integration

## Full ToolType Model Description

### Core Fields
- **id**: Primary key (INTEGER, auto-increment)
- **name**: Tool type name (STRING(100), required, unique)
- **createdAt**: Creation timestamp (DATE, auto-generated)
- **updatedAt**: Last update timestamp (DATE, auto-generated)

### Relationships
- **Many-to-many with Tool**: `tool_types.id` ↔ `tools.id` via `tool_tool_type` junction table
- **Many-to-many with Profession**: `tools.id` ↔ `professions.id` via `profession_tool` junction table (indirect relationship)

## Important: Simple Creation Process

**NOTE**: Unlike Departments, Professions, and Languages, ToolType has a **simple creation process** without TermGroups or complex relationships.

### Frontend Form Data Structure:
```javascript
const formData = {
  name: "Tool Type Name"  // REQUIRED - Only field needed
};
```

### Required Fields for Creating the Simplest ToolType:

#### 1. ToolType Model (Minimal):
```javascript
{
  name: "Development Tool"  // REQUIRED - Tool type name (2-100 characters)
}
```

### Backend Processing:
1. **Validates name**: Ensures it's not empty, 2-100 characters, and unique
2. **Creates ToolType**: Simple database insertion
3. **Returns created entity**: No complex relationship setup needed

## MCP Instructions for ToolType Operations

### Available MCP Functions for ToolTypes:

1. **Get all tool types**:
   ```javascript
   mcp_libs-mcp-service_get_tool_types({
     page: 1,           // Page number (default: 1)
     limit: 10,         // Number of tool types per page (default: 10)
     search: "search"   // Search by tool type name
   })
   ```

2. **Get specific tool type**:
   ```javascript
   mcp_libs-mcp-service_get_tool_type({
     toolTypeId: "tool_type_id_here"
   })
   ```

3. **Create new tool type**:
   ```javascript
   mcp_libs-mcp-service_create_tool_type({
     name: "Tool Type Name",           // REQUIRED
     description: "Tool type description"  // REQUIRED
   })
   ```

4. **Update existing tool type**:
   ```javascript
   mcp_libs-mcp-service_update_tool_type({
     toolTypeId: "tool_type_id_here",    // REQUIRED
     name: "Updated Tool Type Name",     // REQUIRED
     description: "Updated description"   // REQUIRED
   })
   ```

### Important Notes for MCP Usage:

1. **Required Fields**: Only `name` and `description` are required for creation/update
2. **Simple Interface**: The MCP service provides a simple interface that matches the actual backend complexity
3. **No Complex Processing**: Unlike other models, ToolType doesn't require TermGroups or complex relationships
4. **Unique Constraint**: Tool type names must be unique across the system
5. **Validation**: Names must be 2-100 characters long

### Example Usage for Another AI:

```javascript
// Get all tool types
const toolTypes = await mcp_libs-mcp-service_get_tool_types({
  page: 1,
  limit: 50
});

// Create a new tool type
const newToolType = await mcp_libs-mcp-service_create_tool_type({
  name: "Development Tool",
  description: "Tools used for software development"
});

// Update a tool type
const updatedToolType = await mcp_libs-mcp-service_update_tool_type({
  toolTypeId: "123",
  name: "Software Development Tool",
  description: "Updated description for development tools"
});
```

### Response Format

All MCP functions return JSON objects with the following structure:

```javascript
{
  success: true,
  data: {
    id: 1,
    name: "Tool Type Name",
    description: "Tool type description",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z"
  },
  message: "Operation completed successfully"
}
```

## Complete Field Reference

### ToolType Model Fields:
```javascript
{
  id: INTEGER,                    // Primary key, auto-increment
  name: STRING(100),             // REQUIRED - Tool type name (unique)
  createdAt: DATE,               // Auto-generated timestamp
  updatedAt: DATE                // Auto-generated timestamp
}
```

### Tool Model Fields (Related):
```javascript
{
  id: INTEGER,                    // Primary key, auto-increment
  name: STRING(255),             // REQUIRED - Tool name
  link: TEXT,                    // Nullable - Tool URL/link
  description: TEXT,             // Nullable - Tool description
  icon: STRING(255),             // Nullable - Path to icon file
  createdAt: DATE,               // Auto-generated timestamp
  updatedAt: DATE                // Auto-generated timestamp
}
```

### ToolToolType Junction Table Fields:
```javascript
{
  tool_id: INTEGER,              // REQUIRED - Foreign key to Tool
  tool_type_id: INTEGER,         // REQUIRED - Foreign key to ToolType
  createdAt: DATE,               // Auto-generated timestamp
  updatedAt: DATE                // Auto-generated timestamp
}
```

### Related Model Fields (for Reference):

#### Tool Model:
```javascript
{
  id: INTEGER,                    // Primary key, auto-increment
  name: STRING(255),             // REQUIRED - Tool name
  link: TEXT,                    // Nullable - Tool URL/link
  description: TEXT,             // Nullable - Tool description
  icon: STRING(255),             // Nullable - Path to icon file
  createdAt: DATE,               // Auto-generated timestamp
  updatedAt: DATE                // Auto-generated timestamp
}
```

#### Profession Model:
```javascript
{
  id: INTEGER,                    // Primary key, auto-increment
  library_id: INTEGER,           // Foreign key to Library (nullable)
  term_group_id: INTEGER,        // Foreign key to TermGroup (nullable)
  department_id: INTEGER,        // Foreign key to Department (nullable)
  color: STRING(50),             // Nullable - Color code
  // ... other fields
}
```

### Default Values Used by Backend:
- **createdAt**: Current timestamp (auto-generated)
- **updatedAt**: Current timestamp (auto-generated)
- **name**: Must be provided (no default)

### Common ToolType Examples:
```javascript
[
  { name: "Development Tool", description: "Tools used for software development" },
  { name: "Design Tool", description: "Tools used for design and prototyping" },
  { name: "Testing Tool", description: "Tools used for testing and quality assurance" },
  { name: "Deployment Tool", description: "Tools used for deployment and DevOps" },
  { name: "Analytics Tool", description: "Tools used for data analysis and reporting" },
  { name: "Communication Tool", description: "Tools used for team communication" },
  { name: "Project Management Tool", description: "Tools used for project management" },
  { name: "Version Control Tool", description: "Tools used for source code management" }
]
```

### Relationships:
- **ToolType** ↔ **Tool** (many-to-many via `tool_tool_type` junction table)
- **Tool** ↔ **Profession** (many-to-many via `profession_tool` junction table)
- **ToolType** → **Profession** (indirect relationship through Tools)

## API Endpoints for ToolTypes

### Available REST API Endpoints:

1. **Create ToolType**:
   ```
   POST /api/tool-type
   Content-Type: application/json
   Authorization: Bearer <token>
   Body: { "name": "Tool Type Name" }
   ```

2. **Get all ToolTypes**:
   ```
   GET /api/tool-type?page=1&limit=20&search=search_term&sortBy=name&sortOrder=ASC
   ```

3. **Get specific ToolType**:
   ```
   GET /api/tool-type/:id
   ```

4. **Update ToolType**:
   ```
   PUT /api/tool-type/:id
   Content-Type: application/json
   Authorization: Bearer <token>
   Body: { "name": "Updated Tool Type Name" }
   ```

5. **Delete ToolType**:
   ```
   DELETE /api/tool-type/:id
   Authorization: Bearer <token>
   ```

6. **Token-based API** (for external integrations):
   ```
   GET /api/tool-types (with API key authentication)
   POST /api/tool-types (with API key authentication)
   PUT /api/tool-types/:id (with API key authentication)
   ```

## Key Differences from Other Models

### 1. **Simple Structure**:
- **No TermGroups**: Unlike Departments, Professions, and Languages
- **No Complex Relationships**: Simple many-to-many with Tools
- **No File Uploads**: No icon or file management
- **No AI Fields**: No AI-generated content tracking

### 2. **Unique Constraints**:
- **Name Uniqueness**: Tool type names must be unique across the system
- **Simple Validation**: Only name length and uniqueness validation
- **No Complex Processing**: Direct database operations

### 3. **Tool Integration**:
- **Tool Categorization**: Used to categorize tools by type
- **Profession Association**: Tools can be associated with professions through tool types
- **Flexible Relationships**: Many-to-many relationships allow multiple tool types per tool

## Validation Rules

### Name Field Validation:
- **Required**: Cannot be empty or null
- **Length**: Must be between 2 and 100 characters
- **Uniqueness**: Must be unique across all tool types
- **Format**: String value (no special format requirements)

### Backend Validation:
```javascript
// Validation logic in controller
if (!name) {
  return res.status(400).json({ message: 'Поле name обязательно для заполнения' });
}

// Sequelize model validation
name: { 
  type: DataTypes.STRING(100), 
  allowNull: false, 
  unique: true 
}
```

## Error Handling

### Common Error Responses:

1. **Validation Errors**:
   ```javascript
   {
     message: "Поле name обязательно для заполнения"
   }
   ```

2. **Uniqueness Errors**:
   ```javascript
   {
     message: "Tool type with this name already exists"
   }
   ```

3. **Not Found Errors**:
   ```javascript
   {
     message: "Тип инструмента не найден"
   }
   ```

4. **Server Errors**:
   ```javascript
   {
     message: "Ошибка при создании типа инструмента"
   }
   ```

## Summary

The ToolType model is the **simplest entity** in the system, providing a straightforward way to categorize tools without complex relationships or processing requirements.

### Key Points:
1. **Simple MCP Interface**: Only `name` and `description` required
2. **No Complex Processing**: Direct database operations
3. **Unique Names**: Tool type names must be unique
4. **Tool Categorization**: Used to organize tools by type
5. **Profession Integration**: Tools can be linked to professions through tool types
6. **Token API Support**: Available for external integrations

### For AI Integration:
The ToolType model is perfect for AI systems that need to create simple categorization entities. The MCP interface matches the actual backend complexity, making it straightforward to work with.

### Common Use Cases:
1. **Tool Categorization**: Creating categories for different types of tools
2. **Tool Organization**: Organizing tools by their purpose or function
3. **Profession Tool Mapping**: Associating tools with specific professions
4. **System Administration**: Managing tool type hierarchies
5. **External Integrations**: Providing tool type data to external systems

### Advantages:
- **Simple**: No complex relationships or processing
- **Fast**: Direct database operations
- **Flexible**: Many-to-many relationships with tools
- **Scalable**: Easy to add new tool types
- **Clean**: No AI fields or complex metadata

### Limitations:
- **No Rich Content**: No descriptions, icons, or additional metadata
- **No Hierarchical Structure**: Flat structure, no parent-child relationships
- **No Versioning**: No version control or history tracking
- **No AI Integration**: No AI-generated content or validation
