# Object Model Description for MCP Integration

## Full Object Model Description

### Core Fields
- **id**: Primary key (INTEGER, auto-increment)
- **term_group_id**: Foreign key to TermGroup model (INTEGER, nullable)

### Relationships
- **Belongs to TermGroup**: `objects.term_group_id` → `term_groups.id`
- **Many-to-many with Format**: `objects.id` ↔ `formats.id` via `object_format` junction table

## Important: Complex Creation Process

**CRITICAL**: The actual object creation process involves TermGroups and complex relationships, similar to Departments, Professions, Languages, and Actions.

### Frontend Form Data Structure:
```javascript
const formDataToSend = new FormData();
formDataToSend.append('mainTerm', JSON.stringify({
  value: "Object Name",              // REQUIRED
  description: "Object description",
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
formDataToSend.append('format_ids', JSON.stringify([1, 2, 3])); // Optional format IDs
formDataToSend.append('icon', iconFile); // Optional icon file
```

### Required Fields for Creating the Simplest Object:

#### 1. Object Model (Minimal):
```javascript
{
  // No required fields - Object is created empty
}
```

#### 2. Term Model (Main Term - REQUIRED):
```javascript
{
  value: "Object Name",              // REQUIRED - The object name
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
  name: "Object Name",               // Auto-filled from mainTerm.value
  main_term_id: 123,                 // Auto-linked to created Term
  description: "Description",         // Auto-filled from mainTerm.description
  created_by: "user_id",             // Auto-filled from mainTerm.created_by
  icon: "/path/to/icon.png"          // Optional, from file upload
}
```

#### 4. Format Relationships (Optional):
```javascript
{
  format_ids: [1, 2, 3]             // Optional - Array of format IDs
}
```

### Backend Processing:
1. **Creates Object** with no additional fields
2. **Creates TermGroup** with mainTerm and additional terms
3. **Links Object** to TermGroup via `term_group_id`
4. **Handles file uploads** for icons
5. **Manages format relationships** via many-to-many with Formats
6. **Manages complex relationships** between terms, languages, statuses, and term types

## MCP Instructions for Object Operations

### Available MCP Functions for Objects:

**NOTE**: Currently, there are no dedicated MCP functions for Object operations. The Object model appears to be a complex entity that would require MCP integration similar to other models.

### Important Notes for MCP Usage:

1. **No Direct MCP Interface**: The Object model does not have dedicated MCP functions yet
2. **Complex Creation Process**: Involves TermGroups, Terms, and Format relationships
3. **Format Integration**: Can be linked to multiple formats via many-to-many relationship
4. **Term System Integration**: Full integration with Term system for content management

### Example Usage for Another AI:

```javascript
// Currently no MCP functions available for Object operations
// Object model is used internally by the system with complex TermGroup and Format relationships
```

## Complete Field Reference

### Object Model Fields:
```javascript
{
  id: INTEGER,                    // Primary key, auto-increment
  term_group_id: INTEGER         // Foreign key to TermGroup (nullable)
}
```

### ObjectFormat Junction Table Fields:
```javascript
{
  object_id: INTEGER,            // REQUIRED - Foreign key to Object
  format_id: INTEGER,            // REQUIRED - Foreign key to Format
  createdAt: DATE,               // Auto-generated timestamp
  updatedAt: DATE                // Auto-generated timestamp
}
```

### Term Model Fields (for Main Term):
```javascript
{
  id: INTEGER,                    // Primary key, auto-increment
  value: STRING,                  // REQUIRED - Term value (object name)
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

### Format Model Fields (Related):
```javascript
{
  id: INTEGER,                    // Primary key, auto-increment
  name: STRING(100),             // REQUIRED - Unique format name
}
```

### Related Model Fields (for Reference):

#### Language Model:
```javascript
{
  id: INTEGER,                    // Primary key, auto-increment
  iso2: STRING(2),               // REQUIRED - ISO 2-letter language code
  iso3: STRING(3),               // REQUIRED - ISO 3-letter language code
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

### Common Object Examples:
```javascript
[
  { name: "Document", description: "Document object", format_ids: [1, 2] },
  { name: "Image", description: "Image object", format_ids: [3, 4] },
  { name: "Video", description: "Video object", format_ids: [5, 6] },
  { name: "Audio", description: "Audio object", format_ids: [7, 8] },
  { name: "Database", description: "Database object", format_ids: [9, 10] },
  { name: "API", description: "API object", format_ids: [11, 12] },
  { name: "File", description: "File object", format_ids: [1, 3, 5] },
  { name: "Report", description: "Report object", format_ids: [1, 9] }
]
```

### Common Format Examples:
```javascript
[
  { id: 1, name: "PDF" },
  { id: 2, name: "DOCX" },
  { id: 3, name: "JPG" },
  { id: 4, name: "PNG" },
  { id: 5, name: "MP4" },
  { id: 6, name: "AVI" },
  { id: 7, name: "MP3" },
  { id: 8, name: "WAV" },
  { id: 9, name: "SQL" },
  { id: 10, name: "JSON" },
  { id: 11, name: "REST" },
  { id: 12, name: "GraphQL" }
]
```

### Relationships:
- **Object** → **TermGroup** (via `term_group_id`)
- **Object** ↔ **Format** (many-to-many via `object_format` junction table)
- **TermGroup** → **Term** (via `main_term_id` for main term)
- **TermGroup** ↔ **Term** (many-to-many via `TermGroupRelation` for additional terms)
- **Term** → **Language** (via `language_id`)
- **Term** → **Status** (via `status_id`)
- **Term** → **TermType** (via `term_type_id`)

## API Endpoints for Objects

### Available REST API Endpoints:

1. **Create Object**:
   ```
   POST /api/object
   Content-Type: multipart/form-data
   Authorization: Bearer <token>
   ```

2. **Get all Objects**:
   ```
   GET /api/object?page=1&limit=20&search=search_term&all=true
   ```

3. **Get specific Object**:
   ```
   GET /api/object/:id
   ```

4. **Update Object**:
   ```
   PUT /api/object/:id
   Content-Type: multipart/form-data
   Authorization: Bearer <token>
   ```

5. **Delete Object**:
   ```
   DELETE /api/object/:id
   Authorization: Bearer <token>
   ```

6. **Get Object Terms**:
   ```
   GET /api/object/terms?page=1&limit=20&search=search_term
   ```

## Key Differences from Other Models

### 1. **Format Integration**:
- **Many-to-many with Format**: Objects can be linked to multiple formats
- **Format Categorization**: Objects are categorized by their formats
- **Format Validation**: Backend validates format IDs before linking

### 2. **Object-Specific Features**:
- **Content Objects**: Represents various types of content objects
- **Format Management**: Handles different file and content formats
- **Multi-format Support**: Objects can support multiple formats simultaneously

### 3. **Complex Structure**:
- **Term System Integration**: Full integration with Term system
- **Format Relationships**: Many-to-many relationships with formats
- **File Support**: Icon upload and storage capabilities

## Validation Rules

### Name Field Validation (via Term):
- **Required**: Cannot be empty or null
- **Length**: No specific length limit (STRING field)
- **Format**: String value (no special format requirements)

### Format IDs Validation:
- **Array Format**: Must be an array of integers
- **Valid Format IDs**: All format IDs must exist in the formats table
- **Optional**: Can be empty array or not provided

### Backend Validation:
```javascript
// Validation logic in controller
if (!mainTerm?.value) {
  return res.status(400).json({ message: 'Object name is required' });
}

// Format validation
if (Array.isArray(formatIds) && formatIds.length > 0) {
  const validFormatIds = (await Format.findAll({ 
    where: { id: formatIds }, 
    attributes: ['id'] 
  })).map(f => f.id);
  if (validFormatIds.length > 0) {
    await object.setFormats(validFormatIds);
  }
}
```

## Error Handling

### Common Error Responses:

1. **Validation Errors**:
   ```javascript
   {
     message: "Object name is required"
   }
   ```

2. **Not Found Errors**:
   ```javascript
   {
     message: "Object not found"
   }
   ```

3. **Server Errors**:
   ```javascript
   {
     message: "Ошибка при создании объекта"
   }
   ```

## File Upload Handling

### Icon File Processing:
1. **File Upload**: Multer middleware handles file uploads
2. **File Validation**: Validates file type (image) and size (5MB max)
3. **File Storage**: Stores files in `/uploads/` directory
4. **File Path**: Stores relative path in TermGroup
5. **File Cleanup**: Deletes old files when updating/deleting objects

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

The Object model provides a **complex entity** for managing content objects with format categorization through the Term system. While the core model is simple, the creation process involves TermGroups, Terms, and Format relationships.

### Key Points:
1. **Minimal Core Model**: Only id and term_group_id fields
2. **Complex Creation Process**: Involves TermGroups, Terms, and Format relationships
3. **Format Integration**: Many-to-many relationship with Format model
4. **Term-Based Content**: All content managed through Term system
5. **File Support**: Icon upload and storage capabilities
6. **Multi-format Support**: Objects can support multiple formats

### For AI Integration:
The Object model is suitable for AI systems that need to create content objects with format categorization. The model provides a flexible structure for managing various types of objects with different format requirements.

### Common Use Cases:
1. **Content Management**: Creating and managing content objects
2. **Format Categorization**: Categorizing objects by their formats
3. **Multi-format Objects**: Managing objects that support multiple formats
4. **File Organization**: Organizing files and content by type
5. **Digital Asset Management**: Managing digital assets with format metadata

### Advantages:
- **Flexible Format Support**: Multiple formats per object
- **Rich Content Management**: Full Term system integration
- **Multi-language Support**: Full internationalization capabilities
- **File Support**: Icon upload and storage capabilities
- **AI Integration**: Full AI content management capabilities

### Limitations:
- **Complex Creation**: Complex backend processing
- **Format Dependency**: Requires format management
- **No MCP Interface**: Not yet exposed through MCP functions
- **Term Dependency**: Relies entirely on Term system

## Future Considerations

### Potential MCP Integration:
1. **Object CRUD Operations**: Create, read, update, delete objects
2. **Format Management**: Manage object-format relationships
3. **Simplified Interface**: Abstract complex TermGroup creation
4. **Format Validation**: Validate format relationships
5. **Bulk Operations**: Support for bulk object operations

### Current Status:
- **Complex Model**: Full Term system and Format integration
- **REST API Available**: Complete REST API for object operations
- **Frontend Integration**: Full frontend support with form dialogs
- **No MCP Functions**: Not yet exposed through MCP interface
