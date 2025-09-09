# Priority Model Description for MCP Integration

## Full Priority Model Description

### Core Fields
- **id**: Primary key (INTEGER, auto-increment)
- **name**: Priority name (STRING, required)
- **color**: Color code for UI display (STRING(50), required)

### Relationships
- **No direct relationships**: Priority model has no foreign key relationships defined
- **Referenced by**: Other entities may reference priorities (though not currently implemented)

## Important: Simple Creation Process

**NOTE**: Like Statuses, Priority creation is simple and doesn't involve TermGroups or complex relationships.

### Frontend Form Data Structure:
```javascript
const priorityData = {
  name: "Priority Name",           // REQUIRED
  color: "#FF5722"                // REQUIRED - Color code
};
```

### Backend Processing:
1. **Creates Priority** with name and color
2. **Publishes event** about priority creation
3. **Returns created priority** with ID

## MCP Instructions for Priority Operations

### Available MCP Functions for Priorities:

1. **Get all priorities**:
   ```javascript
   mcp_libs-mcp-service_get_priorities({
     page: 1,           // Page number (default: 1)
     limit: 10,         // Number of priorities per page (default: 10)
     search: "search"   // Search by priority name
   })
   ```

2. **Get specific priority**:
   ```javascript
   mcp_libs-mcp-service_get_priority({
     priorityId: "priority_id_here"
   })
   ```

3. **Create new priority**:
   ```javascript
   mcp_libs-mcp-service_create_priority({
     name: "Priority Name",           // REQUIRED
     description: "Priority description"  // REQUIRED
   })
   ```

4. **Update existing priority**:
   ```javascript
   mcp_libs-mcp-service_update_priority({
     priorityId: "priority_id_here",    // REQUIRED
     name: "Updated Priority Name",     // REQUIRED
     description: "Updated description"  // REQUIRED
   })
   ```

### Important Notes for MCP Usage:

1. **Required Fields**: Both `name` and `description` are required for creation/update
2. **Simple Structure**: Priorities are simple entities without complex relationships
3. **No TermGroups**: Priorities don't use the TermGroup system like Departments and Professions
4. **Color Management**: The MCP interface uses `description` field for color (unlike the actual model which has a separate `color` field)
5. **Event Publishing**: Backend publishes events for priority operations (create, update, delete)
6. **No Referential Integrity**: Priorities can be deleted without checking usage (unlike Statuses)

### Example Usage for Another AI:

```javascript
// Get all priorities
const priorities = await mcp_libs-mcp-service_get_priorities({
  page: 1,
  limit: 50
});

// Create a new priority
const newPriority = await mcp_libs-mcp-service_create_priority({
  name: "High",
  description: "#F44336"  // Red color
});

// Update a priority
const updatedPriority = await mcp_libs-mcp-service_update_priority({
  priorityId: "123",
  name: "Critical",
  description: "#D32F2F"  // Dark red color
});
```

### Response Format

All MCP functions return JSON objects with the following structure:

```javascript
{
  success: true,
  data: {
    id: 1,
    name: "Priority Name",
    description: "Priority description",  // Used for color in MCP
    // ... other fields managed internally
  },
  message: "Operation completed successfully"
}
```

## Complete Field Reference

### Priority Model Fields:
```javascript
{
  id: INTEGER,                    // Primary key, auto-increment
  name: STRING,                   // REQUIRED - Priority name
  color: STRING(50)              // REQUIRED - Color code for UI display
}
```

### Related Model Fields (for Reference):

#### Event Service Integration:
```javascript
// Events published by Priority operations:
{
  eventType: "priority_created" | "priority_updated" | "priority_deleted",
  data: {
    id: INTEGER,
    name: STRING,
    color: STRING,
    timestamp: DATE
  }
}
```

### Default Priorities (Common Examples):
```javascript
[
  { name: "Low", color: "#4CAF50" },        // Green
  { name: "Medium", color: "#FF9800" },     // Orange
  { name: "High", color: "#F44336" },       // Red
  { name: "Critical", color: "#D32F2F" },   // Dark Red
  { name: "Urgent", color: "#E91E63" }      // Pink
]
```

### Relationships:
- **Priority** → **No direct relationships** (currently isolated entity)
- **Future Integration**: May be referenced by other entities for priority management

## API Endpoints for Priorities

### Available REST API Endpoints:

1. **Create Priority**:
   ```
   POST /api/priority
   Content-Type: application/json
   Authorization: Bearer <token>
   Body: { "name": "Priority Name", "color": "#FF5722" }
   ```

2. **Get all Priorities**:
   ```
   GET /api/priority
   Query Parameters:
   - page: Page number (default: 1)
   - limit: Items per page (default: 10)
   - search: Search by name or ID
   - sortBy: Sort field (id, name, color)
   - sortOrder: Sort order (asc, desc)
   - all: Return all priorities without pagination
   - isShort: Return only ID and name
   ```

3. **Get specific Priority**:
   ```
   GET /api/priority/:id
   ```

4. **Update Priority**:
   ```
   PUT /api/priority/:id
   Content-Type: application/json
   Authorization: Bearer <token>
   Body: { "name": "Updated Priority", "color": "#E91E63" }
   ```

5. **Delete Priority**:
   ```
   DELETE /api/priority/:id
   Authorization: Bearer <token>
   ```

## Key Differences from Department/Profession Models

### 1. **Simple Structure**:
- **No TermGroups**: Priorities don't use the complex TermGroup system
- **No AI Fields**: Priorities don't have AI-generated content fields
- **No File Uploads**: Priorities don't support icon uploads
- **No Complex Relationships**: No foreign key relationships defined
- **Event Integration**: Publishes events for all operations

### 2. **MCP Interface Mismatch**:
- **Actual Model**: Has `name` and `color` fields
- **MCP Interface**: Uses `name` and `description` fields (description stores color)
- **Field Mapping**: MCP `description` field maps to model `color` field

### 3. **Usage Pattern**:
- **Isolated Entity**: Currently not referenced by other entities
- **Workflow Management**: Priorities represent urgency levels
- **UI Display**: Colors are used for visual representation in the UI
- **Event-Driven**: All operations trigger events for system integration

## Advanced Features

### 1. **Search and Filtering**:
```javascript
// Search by name or ID
GET /api/priority?search=high

// Sort by different fields
GET /api/priority?sortBy=name&sortOrder=desc

// Get short format (ID and name only)
GET /api/priority?isShort=true

// Get all priorities without pagination
GET /api/priority?all=true
```

### 2. **Event System Integration**:
```javascript
// Events are automatically published for:
// - Priority creation
// - Priority updates  
// - Priority deletion

// Event types:
// - priority_created
// - priority_updated
// - priority_deleted
```

### 3. **Pagination Support**:
```javascript
// Response includes pagination metadata:
{
  priorities: [...],
  totalItems: 25,
  currentPage: 1,
  totalPages: 3,
  itemsPerPage: 10
}
```

## Key Differences from Status Model

### 1. **Event Integration**:
- **Priority**: Publishes events for all operations
- **Status**: No event publishing mentioned

### 2. **Referential Integrity**:
- **Priority**: Can be deleted without checking usage
- **Status**: Cannot be deleted if used by Terms or TermGroups

### 3. **Relationships**:
- **Priority**: No relationships defined
- **Status**: Referenced by Terms and TermGroups

### 4. **Usage Context**:
- **Priority**: Urgency/importance levels
- **Status**: Workflow states

## Summary

The Priority model is a **simple reference entity** used for priority management throughout the system. Like Statuses, Priorities:

### Key Points:
1. **Simple MCP Interface**: Only `name` and `description` (color) required
2. **No Complex Processing**: Direct creation without TermGroups or AI fields
3. **Event-Driven**: All operations trigger events for system integration
4. **UI Integration**: Colors are used for visual representation
5. **Priority Management**: Represents urgency/importance levels
6. **Isolated Entity**: Currently not referenced by other entities
7. **No Referential Integrity**: Can be deleted without usage checks

### For AI Integration:
The Priority model is one of the simplest entities to work with:
- **Minimal Fields**: Only name and color
- **No Complex Relationships**: No foreign key references
- **Direct Creation**: No intermediate models or services
- **Clear Purpose**: Priority/urgency level management
- **Event Integration**: Automatic event publishing for system integration

### Common Use Cases:
1. **Task Priority**: Low, Medium, High, Critical
2. **Issue Priority**: Minor, Major, Blocker
3. **Request Priority**: Normal, Urgent, Emergency
4. **Workflow Priority**: Background, Standard, Expedited

### Future Considerations:
- **Integration Potential**: May be referenced by other entities in future updates
- **Workflow Integration**: Could be used in task management systems
- **Notification Systems**: Priority levels could drive notification urgency
- **Reporting**: Priority-based analytics and reporting

The MCP interface provides a simplified way to manage priorities, though it uses the `description` field to store color information instead of a dedicated `color` field. The event system integration makes it suitable for complex workflow management systems.

