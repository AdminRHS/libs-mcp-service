# Format Model Description for MCP Integration

## Full Format Model Description

### Core Fields
- **id**: Primary key (INTEGER, auto-increment)
- **name**: Format name (STRING(100), required, unique)

### Relationships
- **Many-to-many with Object**: `formats.id` ↔ `objects.id` via `object_format` junction table

## Important: Simple Reference Model

**NOTE**: The Format model is a simple reference model used for categorizing Objects by their formats. It has a straightforward structure without complex creation processes.

### Frontend Form Data Structure:
```javascript
const formData = {
  name: "Format Name"              // REQUIRED - Unique format name
};
```

### Required Fields for Creating the Simplest Format:

#### 1. Format Model (Simple):
```javascript
{
  name: "Format Name"              // REQUIRED - Unique format name
}
```

### Backend Processing:
1. **Creates Format** with name
2. **Validates uniqueness** of format name
3. **No complex relationships** or TermGroups involved

## MCP Instructions for Format Operations

### Available MCP Functions for Formats:

**NOTE**: Currently, there are no dedicated MCP functions for Format operations. The Format model appears to be a reference model used internally by the system.

### Important Notes for MCP Usage:

1. **No Direct MCP Interface**: The Format model does not have dedicated MCP functions
2. **Reference Model**: Used internally for categorizing Objects by format
3. **Simple Structure**: No complex relationships or TermGroups
4. **Object Integration**: Many-to-many relationship with Objects

### Example Usage for Another AI:

```javascript
// Currently no MCP functions available for Format operations
// Format model is used internally by the system for Object categorization
```

## Complete Field Reference

### Format Model Fields:
```javascript
{
  id: INTEGER,                    // Primary key, auto-increment
  name: STRING(100)              // REQUIRED - Unique format name
}
```

### ObjectFormat Junction Table Fields:
```javascript
{
  format_id: INTEGER,            // REQUIRED - Foreign key to Format
  object_id: INTEGER,            // REQUIRED - Foreign key to Object
  createdAt: DATE,               // Auto-generated timestamp
  updatedAt: DATE                // Auto-generated timestamp
}
```

### Related Model Fields (for Reference):

#### Object Model:
```javascript
{
  id: INTEGER,                    // Primary key, auto-increment
  term_group_id: INTEGER         // Foreign key to TermGroup (nullable)
}
```

### Default Values Used by Backend:
- **No default values**: All fields are either required or auto-generated

### Common Format Examples:
```javascript
[
  { name: "PDF" },
  { name: "DOCX" },
  { name: "JPG" },
  { name: "PNG" },
  { name: "MP4" },
  { name: "AVI" },
  { name: "MP3" },
  { name: "WAV" },
  { name: "SQL" },
  { name: "JSON" },
  { name: "REST" },
  { name: "GraphQL" },
  { name: "XML" },
  { name: "CSV" },
  { name: "TXT" },
  { name: "HTML" },
  { name: "CSS" },
  { name: "JavaScript" },
  { name: "Python" },
  { name: "Java" },
  { name: "C++" },
  { name: "PHP" },
  { name: "Ruby" },
  { name: "Go" },
  { name: "Rust" },
  { name: "Swift" },
  { name: "Kotlin" },
  { name: "TypeScript" },
  { name: "Docker" },
  { name: "Kubernetes" },
  { name: "YAML" },
  { name: "Markdown" },
  { name: "LaTeX" },
  { name: "SVG" },
  { name: "GIF" },
  { name: "BMP" },
  { name: "TIFF" },
  { name: "WebP" },
  { name: "AVIF" },
  { name: "HEIC" },
  { name: "MOV" },
  { name: "WMV" },
  { name: "FLV" },
  { name: "WebM" },
  { name: "OGG" },
  { name: "AAC" },
  { name: "FLAC" },
  { name: "ALAC" },
  { name: "WMA" },
  { name: "ZIP" },
  { name: "RAR" },
  { name: "7Z" },
  { name: "TAR" },
  { name: "GZ" },
  { name: "BZ2" },
  { name: "XZ" }
]
```

### Relationships:
- **Format** ↔ **Object** (many-to-many via `object_format` junction table)

## API Endpoints for Formats

### Available REST API Endpoints:

1. **Create Format**:
   ```
   POST /api/formats
   Content-Type: application/json
   Authorization: Bearer <token>
   ```

2. **Get all Formats**:
   ```
   GET /api/formats?page=1&limit=20&search=search_term&sortBy=name&sortOrder=ASC
   ```

3. **Get specific Format**:
   ```
   GET /api/formats/:id
   ```

4. **Update Format**:
   ```
   PUT /api/formats/:id
   Content-Type: application/json
   Authorization: Bearer <token>
   ```

5. **Delete Format**:
   ```
   DELETE /api/formats/:id
   Authorization: Bearer <token>
   ```

## Key Differences from Other Models

### 1. **Simple Reference Model**:
- **No Complex Creation**: Simple name field only
- **No TermGroups**: Does not use the Term system for content management
- **No File Uploads**: No icon or file upload capabilities
- **No AI Fields**: No AI-related fields or processing

### 2. **Object Categorization**:
- **Format Categorization**: Used for categorizing Objects by format
- **Many-to-many Relationship**: Objects can have multiple formats
- **Reference Purpose**: Provides format categorization for Objects

### 3. **Minimal Structure**:
- **Simple Fields**: Only id and name
- **No Complex Relationships**: Only has Objects via many-to-many
- **No External Integration**: Not exposed through MCP or complex APIs

## Validation Rules

### Name Field Validation:
- **Required**: Cannot be empty or null
- **Unique**: Must be unique across all formats
- **Length**: Maximum 100 characters, minimum 2 characters
- **Format**: String value (no special format requirements)

### Backend Validation:
```javascript
// Validation logic in controller
if (!name) {
  return res.status(400).json({ message: 'Поле name обязательно для заполнения' });
}

// Uniqueness is handled by database constraint
const format = await Format.create({ name });
```

### Frontend Validation:
```javascript
const validateForm = () => {
  const errors = {};
  if (!formData.name.trim()) {
    errors.name = 'Name is required';
  } else if (formData.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters long';
  } else if (formData.name.trim().length > 100) {
    errors.name = 'Name must be less than 100 characters';
  }
  return Object.keys(errors).length === 0;
};
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
     message: "Format name must be unique"
   }
   ```

3. **Not Found Errors**:
   ```javascript
   {
     message: "Формат не найден"
   }
   ```

4. **Server Errors**:
   ```javascript
   {
     message: "Ошибка при создании формата"
   }
   ```

## Response Format

### Success Response:
```javascript
{
  id: 1,
  name: "PDF",
  createdAt: "2025-01-01T00:00:00.000Z",
  updatedAt: "2025-01-01T00:00:00.000Z"
}
```

### Paginated Response:
```javascript
{
  data: [
    { id: 1, name: "PDF", createdAt: "...", updatedAt: "..." },
    { id: 2, name: "DOCX", createdAt: "...", updatedAt: "..." }
  ],
  pagination: {
    totalItems: 50,
    totalPages: 5,
    currentPage: 1,
    pageSize: 10,
    hasNextPage: true,
    hasPrevPage: false
  },
  sorting: {
    sortBy: "name",
    sortOrder: "ASC"
  }
}
```

## Summary

The Format model is a **simple reference model** used for categorizing Objects by their formats. Unlike other models in the system, it has a minimal structure without complex creation processes or TermGroups.

### Key Points:
1. **Simple Reference Model**: Only id and name fields
2. **No Complex Processing**: No TermGroups or complex relationships
3. **Object Categorization**: Used for categorizing Objects by format
4. **No MCP Interface**: Not exposed through MCP functions
5. **REST API Available**: Complete REST API for format operations
6. **Many-to-many with Objects**: Objects can have multiple formats

### For AI Integration:
The Format model is not designed for direct AI integration. It serves as a reference model for categorizing Objects by format, providing a simple categorization system.

### Common Use Cases:
1. **Format Categorization**: Categorizing objects by their formats
2. **Object Organization**: Organizing objects by format type
3. **Reference Data**: Providing reference data for format types
4. **System Organization**: Organizing the system's format structure

### Advantages:
- **Simple Structure**: Minimal and straightforward
- **Clear Purpose**: Well-defined categorization role
- **Object Integration**: Integrated with Object model
- **Reference Model**: Provides clear format categorization
- **REST API**: Complete REST API for operations

### Limitations:
- **No External API**: Not exposed through MCP
- **Limited Functionality**: Only basic categorization
- **Internal Usage**: Primarily for internal system use
- **No Complex Features**: No AI, file uploads, or complex relationships

## Format Categories

### Document Formats:
- **PDF**: Portable Document Format
- **DOCX**: Microsoft Word Document
- **TXT**: Plain Text
- **RTF**: Rich Text Format
- **ODT**: OpenDocument Text
- **Markdown**: Markdown format
- **LaTeX**: LaTeX document format

### Image Formats:
- **JPG/JPEG**: Joint Photographic Experts Group
- **PNG**: Portable Network Graphics
- **GIF**: Graphics Interchange Format
- **SVG**: Scalable Vector Graphics
- **BMP**: Bitmap
- **TIFF**: Tagged Image File Format
- **WebP**: Web Picture format
- **AVIF**: AV1 Image File Format
- **HEIC**: High Efficiency Image Container

### Video Formats:
- **MP4**: MPEG-4 Part 14
- **AVI**: Audio Video Interleave
- **MOV**: QuickTime Movie
- **WMV**: Windows Media Video
- **FLV**: Flash Video
- **WebM**: Web Media
- **MKV**: Matroska Video

### Audio Formats:
- **MP3**: MPEG Audio Layer III
- **WAV**: Waveform Audio File Format
- **OGG**: Ogg Vorbis
- **AAC**: Advanced Audio Coding
- **FLAC**: Free Lossless Audio Codec
- **ALAC**: Apple Lossless Audio Codec
- **WMA**: Windows Media Audio

### Data Formats:
- **JSON**: JavaScript Object Notation
- **XML**: Extensible Markup Language
- **CSV**: Comma-Separated Values
- **SQL**: Structured Query Language
- **YAML**: YAML Ain't Markup Language
- **TOML**: Tom's Obvious, Minimal Language

### Programming Languages:
- **JavaScript**: JavaScript
- **TypeScript**: TypeScript
- **Python**: Python
- **Java**: Java
- **C++**: C++
- **PHP**: PHP
- **Ruby**: Ruby
- **Go**: Go
- **Rust**: Rust
- **Swift**: Swift
- **Kotlin**: Kotlin

### API Formats:
- **REST**: Representational State Transfer
- **GraphQL**: Graph Query Language
- **SOAP**: Simple Object Access Protocol
- **gRPC**: Google Remote Procedure Call

### Container Formats:
- **ZIP**: ZIP Archive
- **RAR**: RAR Archive
- **7Z**: 7-Zip Archive
- **TAR**: Tape Archive
- **GZ**: GNU Zip
- **BZ2**: Bzip2
- **XZ**: XZ Compression

### Development Formats:
- **Docker**: Docker container format
- **Kubernetes**: Kubernetes manifest format
- **HTML**: HyperText Markup Language
- **CSS**: Cascading Style Sheets

## Future Considerations

### Potential Enhancements:
1. **MCP Integration**: Could be exposed through MCP functions for format management
2. **Description Field**: Could add description field for format details
3. **Category System**: Could add format categories (document, image, video, etc.)
4. **MIME Type Support**: Could add MIME type information
5. **File Extension Support**: Could add file extension information

### Current Status:
- **Simple Model**: Used internally by the system
- **Reference Purpose**: Serves as reference data for format categorization
- **Object Integration**: Integrated with the Object model through many-to-many relationship
- **REST API**: Complete REST API for format operations
- **No MCP Functions**: Not exposed through MCP interface
