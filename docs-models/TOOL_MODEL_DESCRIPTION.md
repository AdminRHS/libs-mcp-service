# Tool Model Description for MCP Integration

## Full Tool Model Description

### Core Fields
- **id**: Primary key (INTEGER, auto-increment)
- **name**: Tool name (STRING(255), required)
- **link**: Tool URL/link (TEXT, nullable)
- **description**: Tool description (TEXT, nullable)
- **icon**: Path to icon file (STRING(255), nullable)
- **createdAt**: Creation timestamp (DATE, auto-generated)
- **updatedAt**: Last update timestamp (DATE, auto-generated)

### Relationships
- **Many-to-many with ToolType**: `tools.id` ↔ `tool_types.id` via `tool_tool_type` junction table
- **Many-to-many with Profession**: `tools.id` ↔ `professions.id` via `profession_tool` junction table

## Important: Moderate Complexity Creation Process

**NOTE**: Tool creation has **moderate complexity** - simpler than Departments/Professions/Languages but more complex than ToolTypes due to file uploads and many-to-many relationships.

### Frontend Form Data Structure:
```javascript
// For JSON requests (no file upload)
const formData = {
  name: "Tool Name",                    // REQUIRED
  link: "https://tool-url.com",         // Optional
  description: "Tool description",      // Optional
  toolTypeIds: [1, 2, 3]               // Optional - Array of tool type IDs
};

// For FormData requests (with file upload)
const formDataToSend = new FormData();
formDataToSend.append('name', formData.name);
formDataToSend.append('link', formData.link);
formDataToSend.append('description', formData.description);
formDataToSend.append('toolTypeIds', formData.toolTypeIds[0]);
formDataToSend.append('toolTypeIds', formData.toolTypeIds[1]);
formDataToSend.append('icon', iconFile); // Optional icon file
```

### Required Fields for Creating the Simplest Tool:

#### 1. Tool Model (Minimal):
```javascript
{
  name: "Tool Name"  // REQUIRED - Tool name (2-255 characters)
}
```

#### 2. Optional Fields:
```javascript
{
  link: "https://tool-url.com",         // Optional - Valid URL
  description: "Tool description",      // Optional - Text description
  icon: "/path/to/icon.png",            // Optional - Icon file path
  toolTypeIds: [1, 2, 3]               // Optional - Array of tool type IDs
}
```

### Backend Processing:
1. **Validates name**: Ensures it's not empty, 2-255 characters, and unique
2. **Handles file uploads**: Processes icon files with validation
3. **Creates Tool**: Database insertion with file path
4. **Manages relationships**: Sets up many-to-many with ToolTypes
5. **Returns created entity**: With all relationships loaded

## MCP Instructions for Tool Operations

### Available MCP Functions for Tools:

1. **Get all tools**:
   ```javascript
   mcp_libs-mcp-service_get_tools({
     page: 1,           // Page number (default: 1)
     limit: 10,         // Number of tools per page (default: 10)
     search: "search"   // Search by tool name or description
   })
   ```

2. **Get specific tool**:
   ```javascript
   mcp_libs-mcp-service_get_tool({
     toolId: "tool_id_here"
   })
   ```

3. **Create new tool**:
   ```javascript
   mcp_libs-mcp-service_create_tool({
     name: "Tool Name",                    // REQUIRED
     description: "Tool description",      // REQUIRED
     link: "https://tool-url.com",         // Optional
     toolTypeIds: [1, 2, 3]               // Optional - Array of tool type IDs
   })
   ```

4. **Update existing tool**:
   ```javascript
   mcp_libs-mcp-service_update_tool({
     toolId: "tool_id_here",               // REQUIRED
     name: "Updated Tool Name",            // REQUIRED
     description: "Updated description",   // REQUIRED
     link: "https://updated-url.com",      // Optional
     toolTypeIds: [1, 2, 3]               // Optional - Array of tool type IDs
   })
   ```

### Important Notes for MCP Usage:

1. **Required Fields**: Only `name` and `description` are required for creation/update
2. **File Uploads**: MCP interface does NOT support icon file uploads
3. **ToolType Relationships**: Can specify tool type IDs for categorization
4. **URL Validation**: Links are validated for proper URL format
5. **Unique Names**: Tool names must be unique across the system

### Example Usage for Another AI:

```javascript
// Get all tools
const tools = await mcp_libs-mcp-service_get_tools({
  page: 1,
  limit: 50
});

// Create a new tool
const newTool = await mcp_libs-mcp-service_create_tool({
  name: "Visual Studio Code",
  description: "Popular code editor for software development",
  link: "https://code.visualstudio.com",
  toolTypeIds: [1, 2] // Development Tool, Editor Tool
});

// Update a tool
const updatedTool = await mcp_libs-mcp-service_update_tool({
  toolId: "123",
  name: "VS Code",
  description: "Updated description for VS Code",
  link: "https://code.visualstudio.com",
  toolTypeIds: [1] // Only Development Tool
});
```

### Response Format

All MCP functions return JSON objects with the following structure:

```javascript
{
  success: true,
  data: {
    id: 1,
    name: "Tool Name",
    link: "https://tool-url.com",
    description: "Tool description",
    icon: "/uploads/icon.png",
    toolTypes: [
      { id: 1, name: "Development Tool" },
      { id: 2, name: "Editor Tool" }
    ],
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z"
  },
  message: "Operation completed successfully"
}
```

## Complete Field Reference

### Tool Model Fields:
```javascript
{
  id: INTEGER,                    // Primary key, auto-increment
  name: STRING(255),             // REQUIRED - Tool name (unique)
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

### ProfessionTool Junction Table Fields:
```javascript
{
  tool_id: INTEGER,              // REQUIRED - Foreign key to Tool
  profession_id: INTEGER,        // REQUIRED - Foreign key to Profession
  createdAt: DATE,               // Auto-generated timestamp
  updatedAt: DATE                // Auto-generated timestamp
}
```

### Related Model Fields (for Reference):

#### ToolType Model:
```javascript
{
  id: INTEGER,                    // Primary key, auto-increment
  name: STRING(100),             // REQUIRED - Tool type name (unique)
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
- **link**: null (if not provided)
- **description**: null (if not provided)
- **icon**: null (if not provided)
- **toolTypeIds**: [] (empty array if not provided)

### Common Tool Examples:
```javascript
[
  {
    name: "Visual Studio Code",
    description: "Popular code editor for software development",
    link: "https://code.visualstudio.com",
    toolTypeIds: [1, 2] // Development Tool, Editor Tool
  },
  {
    name: "GitHub",
    description: "Version control and collaboration platform",
    link: "https://github.com",
    toolTypeIds: [1, 8] // Development Tool, Version Control Tool
  },
  {
    name: "Figma",
    description: "Design and prototyping tool",
    link: "https://figma.com",
    toolTypeIds: [2] // Design Tool
  },
  {
    name: "Jira",
    description: "Project management and issue tracking",
    link: "https://atlassian.com/software/jira",
    toolTypeIds: [7] // Project Management Tool
  },
  {
    name: "Slack",
    description: "Team communication platform",
    link: "https://slack.com",
    toolTypeIds: [6] // Communication Tool
  }
]
```

### Relationships:
- **Tool** ↔ **ToolType** (many-to-many via `tool_tool_type` junction table)
- **Tool** ↔ **Profession** (many-to-many via `profession_tool` junction table)
- **ToolType** → **Tool** (many-to-many via `tool_tool_type` junction table)
- **Profession** → **Tool** (many-to-many via `profession_tool` junction table)

## API Endpoints for Tools

### Available REST API Endpoints:

1. **Create Tool**:
   ```
   POST /api/tools
   Content-Type: multipart/form-data (with file) OR application/json
   Authorization: Bearer <token>
   Body: { "name": "Tool Name", "link": "https://tool-url.com", "description": "Description", "toolTypeIds": [1, 2] }
   ```

2. **Get all Tools**:
   ```
   GET /api/tools?page=1&limit=20&search=search_term&sortBy=name&sortOrder=ASC&all=true
   ```

3. **Get specific Tool**:
   ```
   GET /api/tools/:id
   ```

4. **Update Tool**:
   ```
   PUT /api/tools/:id
   Content-Type: multipart/form-data (with file) OR application/json
   Authorization: Bearer <token>
   Body: { "name": "Updated Tool Name", "link": "https://updated-url.com", "description": "Updated description", "toolTypeIds": [1, 2] }
   ```

5. **Delete Tool**:
   ```
   DELETE /api/tools/:id
   Authorization: Bearer <token>
   ```

6. **Token-based API** (for external integrations):
   ```
   GET /api/tools (with API key authentication)
   POST /api/tools (with API key authentication)
   PUT /api/tools/:id (with API key authentication)
   ```

## Key Differences from Other Models

### 1. **Moderate Complexity**:
- **File Uploads**: Supports icon file uploads (not exposed in MCP)
- **Many-to-Many Relationships**: Complex relationships with ToolTypes and Professions
- **URL Validation**: Validates link URLs
- **No TermGroups**: Unlike Departments, Professions, and Languages

### 2. **Tool-Specific Features**:
- **Tool Categorization**: Can be assigned to multiple tool types
- **Profession Association**: Can be linked to multiple professions
- **File Management**: Icon upload and storage capabilities
- **URL Management**: Link validation and storage

### 3. **MCP Interface Limitations**:
- **No File Uploads**: Icon uploads not supported in MCP
- **Simplified Relationships**: ToolType relationships supported but simplified
- **No Complex Processing**: No TermGroups or AI fields

## Validation Rules

### Name Field Validation:
- **Required**: Cannot be empty or null
- **Length**: Must be between 2 and 255 characters
- **Uniqueness**: Must be unique across all tools
- **Format**: String value (no special format requirements)

### Link Field Validation:
- **Optional**: Can be null or empty
- **URL Format**: Must be a valid URL if provided
- **Length**: No specific length limit (TEXT field)

### Description Field Validation:
- **Optional**: Can be null or empty
- **Length**: No specific length limit (TEXT field)

### Icon Field Validation:
- **Optional**: Can be null or empty
- **File Type**: Must be an image file (if uploaded)
- **File Size**: Must be less than 5MB (if uploaded)
- **Path Length**: Must be less than 255 characters

### Backend Validation:
```javascript
// Validation logic in controller
if (!name) {
  return res.status(400).json({
    success: false,
    message: 'Название инструмента обязательно'
  });
}

// URL validation
if (link && !isValidUrl(link)) {
  return res.status(400).json({
    success: false,
    message: 'Invalid URL format'
  });
}

// File validation
if (req.file && req.file.size > 5 * 1024 * 1024) {
  return res.status(400).json({
    success: false,
    message: 'File size must be less than 5MB'
  });
}
```

## Error Handling

### Common Error Responses:

1. **Validation Errors**:
   ```javascript
   {
     success: false,
     message: "Название инструмента обязательно"
   }
   ```

2. **Uniqueness Errors**:
   ```javascript
   {
     success: false,
     message: "Инструмент с таким названием уже существует"
   }
   ```

3. **File Upload Errors**:
   ```javascript
   {
     success: false,
     message: "File size must be less than 5MB"
   }
   ```

4. **Not Found Errors**:
   ```javascript
   {
     success: false,
     message: "Инструмент не найден"
   }
   ```

5. **Server Errors**:
   ```javascript
   {
     success: false,
     message: "Ошибка при создании инструмента"
   }
   ```

## File Upload Handling

### Icon File Processing:
1. **File Upload**: Multer middleware handles file uploads
2. **File Validation**: Validates file type (image) and size (5MB max)
3. **File Storage**: Stores files in `/uploads/` directory
4. **File Path**: Stores relative path in database
5. **File Cleanup**: Deletes old files when updating/deleting tools

### File Upload Middleware:
```javascript
const uploadToolIcon = multer({
  storage: multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, 'tool-icon-' + uniqueSuffix + path.extname(file.originalname));
    }
  }),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});
```

## Summary

The Tool model provides a **moderately complex** entity for managing tools with file uploads and many-to-many relationships, but without the complexity of TermGroups or AI fields.

### Key Points:
1. **Moderate MCP Interface**: `name` and `description` required, optional relationships
2. **File Upload Support**: Icon uploads (not exposed in MCP)
3. **Tool Categorization**: Many-to-many with ToolTypes
4. **Profession Integration**: Can be linked to multiple professions
5. **URL Management**: Link validation and storage
6. **Token API Support**: Available for external integrations

### For AI Integration:
The Tool model is suitable for AI systems that need to create tool entities with categorization. The MCP interface provides a simplified view while the backend handles file uploads and complex relationships.

### Common Use Cases:
1. **Tool Management**: Creating and organizing tools by type
2. **Profession Tool Mapping**: Associating tools with specific professions
3. **Tool Categorization**: Organizing tools by their purpose or function
4. **Resource Management**: Managing tool resources with icons and links
5. **External Integrations**: Providing tool data to external systems

### Advantages:
- **Flexible**: Many-to-many relationships with tool types and professions
- **Rich Content**: Supports descriptions, links, and icons
- **Categorizable**: Can be assigned to multiple tool types
- **Scalable**: Easy to add new tools and categories
- **File Support**: Icon upload and storage capabilities

### Limitations:
- **No AI Integration**: No AI-generated content or validation
- **No Versioning**: No version control or history tracking
- **No Hierarchical Structure**: Flat structure, no parent-child relationships
- **MCP File Limitations**: Icon uploads not supported in MCP interface
