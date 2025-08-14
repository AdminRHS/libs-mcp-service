# Status Model Description for MCP Integration

## Full Status Model Description

### Core Fields
- **id**: Primary key (SMALLINT, auto-increment)
- **name**: Status name (STRING(50), required)
- **color**: Color code for UI display (STRING(50), required)

### Relationships
- **Has many Terms**: `statuses.id` → `terms.status_id`
- **Has many TermGroups**: `statuses.id` → `term_groups.status_id`

**Note**: Library relationships will be removed in future updates.

## Important: Simple Creation Process

**NOTE**: Unlike Departments and Professions, Status creation is much simpler and doesn't involve TermGroups or complex relationships.

### Frontend Form Data Structure:
```javascript
const statusData = {
  name: "Status Name",           // REQUIRED
  color: "#4CAF50"              // REQUIRED - Color code
};
```

### Backend Processing:
1. **Creates Status** with name and color
2. **Publishes event** about status creation
3. **Returns created status** with ID

## MCP Instructions for Status Operations

### Available MCP Functions for Statuses:

1. **Get all statuses**:
   ```javascript
   mcp_libs-mcp-service_get_statuses({
     page: 1,           // Page number (default: 1)
     limit: 10,         // Number of statuses per page (default: 10)
     search: "search"   // Search by status name
   })
   ```

2. **Get specific status**:
   ```javascript
   mcp_libs-mcp-service_get_status({
     statusId: "status_id_here"
   })
   ```

3. **Create new status**:
   ```javascript
   mcp_libs-mcp-service_create_status({
     name: "Status Name",           // REQUIRED
     description: "Status description"  // REQUIRED
   })
   ```

4. **Update existing status**:
   ```javascript
   mcp_libs-mcp-service_update_status({
     statusId: "status_id_here",    // REQUIRED
     name: "Updated Status Name",   // REQUIRED
     description: "Updated description"  // REQUIRED
   })
   ```

### Important Notes for MCP Usage:

1. **Required Fields**: Both `name` and `description` are required for creation/update
2. **Simple Structure**: Statuses are simple entities without complex relationships
3. **No TermGroups**: Statuses don't use the TermGroup system like Departments and Professions
4. **Color Management**: The MCP interface uses `description` field for color (unlike the actual model which has a separate `color` field)
5. **Referential Integrity**: Statuses cannot be deleted if they are used by other entities

### Example Usage for Another AI:

```javascript
// Get all statuses
const statuses = await mcp_libs-mcp-service_get_statuses({
  page: 1,
  limit: 50
});

// Create a new status
const newStatus = await mcp_libs-mcp-service_create_status({
  name: "Active",
  description: "#4CAF50"  // Green color
});

// Update a status
const updatedStatus = await mcp_libs-mcp-service_update_status({
  statusId: "123",
  name: "Inactive",
  description: "#F44336"  // Red color
});
```

### Response Format

All MCP functions return JSON objects with the following structure:

```javascript
{
  success: true,
  data: {
    id: 1,
    name: "Status Name",
    description: "Status description",  // Used for color in MCP
    // ... other fields managed internally
  },
  message: "Operation completed successfully"
}
```

## Complete Field Reference

### Status Model Fields:
```javascript
{
  id: SMALLINT,                   // Primary key, auto-increment
  name: STRING(50),               // REQUIRED - Status name
  color: STRING(50)               // REQUIRED - Color code for UI display
}
```

### Related Model Fields (for Reference):

#### Term Model:
```javascript
{
  id: INTEGER,                    // Primary key, auto-increment
  value: STRING,                  // REQUIRED - Term value
  description: TEXT,              // Nullable - Term description
  language_id: INTEGER,           // REQUIRED - Foreign key to Language
  term_type_id: INTEGER,          // REQUIRED - Foreign key to TermType
  status_id: SMALLINT,            // Nullable - Foreign key to Status
  entity_type_id: INTEGER,        // Nullable - Foreign key to EntityType
  created_by: STRING              // Nullable - User who created the term
}
```

#### TermGroup Model:
```javascript
{
  id: INTEGER,                    // Primary key, auto-increment
  name: STRING,                   // REQUIRED - Group name
  main_term_id: INTEGER,          // REQUIRED - Foreign key to main Term
  description: TEXT,              // Nullable - Group description
  status_id: SMALLINT,            // Nullable - Foreign key to Status
  created_by: STRING,             // Nullable - User who created the group
  icon: STRING                    // Nullable - Path to icon file
}
```

### Default Statuses (Common Examples):
```javascript
[
  { name: "Active", color: "#4CAF50" },        // Green
  { name: "Inactive", color: "#F44336" },      // Red
  { name: "In Development", color: "#2196F3" }, // Blue
  { name: "Archived", color: "#9E9E9E" },      // Gray
  { name: "Needs Attention", color: "#FF9800" } // Orange
]
```

### Relationships:
- **Status** → **Term** (one-to-many, terms belong to statuses)
- **Status** → **TermGroup** (one-to-many, term groups belong to statuses)

**Note**: Library relationships will be removed in future updates.

## API Endpoints for Statuses

### Available REST API Endpoints:

1. **Create Status**:
   ```
   POST /api/status
   Content-Type: application/json
   Authorization: Bearer <token>
   Body: { "name": "Status Name", "color": "#4CAF50" }
   ```

2. **Get all Statuses**:
   ```
   GET /api/status
   ```

3. **Get specific Status**:
   ```
   GET /api/status/:id
   ```

4. **Update Status**:
   ```
   PUT /api/status/:id
   Content-Type: application/json
   Authorization: Bearer <token>
   Body: { "name": "Updated Status", "color": "#F44336" }
   ```

5. **Delete Status**:
   ```
   DELETE /api/status/:id
   Authorization: Bearer <token>
   ```

## Key Differences from Department/Profession Models

### 1. **Simple Structure**:
- **No TermGroups**: Statuses don't use the complex TermGroup system
- **No AI Fields**: Statuses don't have AI-generated content fields
- **No File Uploads**: Statuses don't support icon uploads
- **No Complex Relationships**: Only simple foreign key relationships

### 2. **MCP Interface Mismatch**:
- **Actual Model**: Has `name` and `color` fields
- **MCP Interface**: Uses `name` and `description` fields (description stores color)
- **Field Mapping**: MCP `description` field maps to model `color` field

### 3. **Usage Pattern**:
- **Referenced By**: Terms and TermGroups use statuses (Library references will be removed)
- **Workflow Management**: Statuses represent workflow states
- **UI Display**: Colors are used for visual representation in the UI

## Summary

The Status model is a **simple reference entity** used throughout the system for workflow management. Unlike Departments and Professions, Statuses:

### Key Points:
1. **Simple MCP Interface**: Only `name` and `description` (color) required
2. **No Complex Processing**: Direct creation without TermGroups or AI fields
3. **Referential Integrity**: Cannot be deleted if used by Terms or TermGroups
4. **UI Integration**: Colors are used for visual representation
5. **Workflow Management**: Represents states in the Term system workflow
6. **Future Update**: Library relationships will be removed

### For AI Integration:
The Status model is the simplest entity to work with:
- **Minimal Fields**: Only name and color
- **No Complex Relationships**: Simple foreign key references to Terms and TermGroups
- **Direct Creation**: No intermediate models or services
- **Clear Purpose**: Workflow state management for Term system
- **Future-Proof**: Library relationships will be removed

### Common Use Cases:
1. **Term Status**: Pending, Approved, Rejected
2. **TermGroup Status**: Draft, Published, Under Review
3. **Workflow States**: In Progress, Completed, Needs Review

The MCP interface provides a simplified way to manage statuses, though it uses the `description` field to store color information instead of a dedicated `color` field.
