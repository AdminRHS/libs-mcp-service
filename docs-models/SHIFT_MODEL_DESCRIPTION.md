# Shift Model Description for MCP Integration

## Full Shift Model Description

### Core Fields
- **id**: Primary key (INTEGER, auto-increment)
- **name**: Shift name (STRING(100), required, unique)
- **start_time**: Shift start time (TIME, required)
- **end_time**: Shift end time (TIME, required)

### Relationships
- **No direct relationships**: Shift model has no foreign key relationships defined
- **Referenced by**: Other entities may reference shifts (though not currently implemented)

## Important: Simple Creation Process

**NOTE**: Like Statuses and Priorities, Shift creation is simple and doesn't involve TermGroups or complex relationships.

### Frontend Form Data Structure:
```javascript
const shiftData = {
  name: "Day Shift",           // REQUIRED - Unique shift name
  start_time: "09:00:00",      // REQUIRED - Start time (HH:MM:SS)
  end_time: "17:00:00"         // REQUIRED - End time (HH:MM:SS)
};
```

### Backend Processing:
1. **Validates uniqueness** of shift name
2. **Creates Shift** with name, start_time, and end_time
3. **Returns created shift** with ID

## MCP Instructions for Shift Operations

### Available MCP Functions for Shifts:

1. **Get all shifts**:
   ```javascript
   mcp_libs-mcp-service_get_shifts({
     page: 1,           // Page number (default: 1)
     limit: 10,         // Number of shifts per page (default: 10)
     search: "search"   // Search by shift name
   })
   ```

2. **Get specific shift**:
   ```javascript
   mcp_libs-mcp-service_get_shift({
     shiftId: "shift_id_here"
   })
   ```

3. **Create new shift**:
   ```javascript
   mcp_libs-mcp-service_create_shift({
     name: "Shift Name",           // REQUIRED
     description: "Shift description"  // REQUIRED
   })
   ```

4. **Update existing shift**:
   ```javascript
   mcp_libs-mcp-service_update_shift({
     shiftId: "shift_id_here",     // REQUIRED
     name: "Updated Shift Name",  // REQUIRED
     description: "Updated description"  // REQUIRED
   })
   ```

### Important Notes for MCP Usage:

1. **Required Fields**: Both `name` and `description` are required for creation/update
2. **Simple Structure**: Shifts are simple entities without complex relationships
3. **No TermGroups**: Shifts don't use the TermGroup system like Departments and Professions
4. **Time Management**: The MCP interface uses `description` field for time information (unlike the actual model which has separate `start_time` and `end_time` fields)
5. **Unique Names**: Shift names must be unique across the system
6. **No Referential Integrity**: Shifts can be deleted without checking usage

### Example Usage for Another AI:

```javascript
// Get all shifts
const shifts = await mcp_libs-mcp-service_get_shifts({
  page: 1,
  limit: 50
});

// Create a new shift
const newShift = await mcp_libs-mcp-service_create_shift({
  name: "Night Shift",
  description: "22:00:00-06:00:00"  // Start-End time format
});

// Update a shift
const updatedShift = await mcp_libs-mcp-service_update_shift({
  shiftId: "123",
  name: "Evening Shift",
  description: "18:00:00-02:00:00"  // Updated time range
});
```

### Response Format

All MCP functions return JSON objects with the following structure:

```javascript
{
  success: true,
  data: {
    id: 1,
    name: "Shift Name",
    description: "Shift description",  // Used for time info in MCP
    // ... other fields managed internally
  },
  message: "Operation completed successfully"
}
```

## Complete Field Reference

### Shift Model Fields:
```javascript
{
  id: INTEGER,                    // Primary key, auto-increment
  name: STRING(100),              // REQUIRED - Unique shift name
  start_time: TIME,               // REQUIRED - Start time (HH:MM:SS)
  end_time: TIME                  // REQUIRED - End time (HH:MM:SS)
}
```

### Related Model Fields (for Reference):

#### Time Format:
```javascript
// TIME format examples:
{
  start_time: "09:00:00",         // 9:00 AM
  end_time: "17:00:00"            // 5:00 PM
}

// 24-hour format:
{
  start_time: "22:00:00",         // 10:00 PM
  end_time: "06:00:00"            // 6:00 AM (next day)
}
```

### Default Shifts (Common Examples):
```javascript
[
  { name: "Day Shift", start_time: "09:00:00", end_time: "17:00:00" },
  { name: "Evening Shift", start_time: "17:00:00", end_time: "01:00:00" },
  { name: "Night Shift", start_time: "22:00:00", end_time: "06:00:00" },
  { name: "Morning Shift", start_time: "06:00:00", end_time: "14:00:00" },
  { name: "Afternoon Shift", start_time: "14:00:00", end_time: "22:00:00" }
]
```

### Relationships:
- **Shift** → **No direct relationships** (currently isolated entity)
- **Future Integration**: May be referenced by other entities for scheduling

## API Endpoints for Shifts

### Available REST API Endpoints:

1. **Create Shift**:
   ```
   POST /api/shifts
   Content-Type: application/json
   Authorization: Bearer <token>
   Body: { "name": "Shift Name", "start_time": "09:00:00", "end_time": "17:00:00" }
   ```

2. **Get all Shifts**:
   ```
   GET /api/shifts
   Query Parameters:
   - page: Page number (default: 1)
   - limit: Items per page (default: 10)
   - search: Search by name or ID
   - sortBy: Sort field (id, name, start_time, end_time)
   - sortOrder: Sort order (asc, desc)
   - all: Return all shifts without pagination
   - isShort: Return only ID and name
   ```

3. **Get specific Shift**:
   ```
   GET /api/shifts/:id
   ```

4. **Update Shift**:
   ```
   PUT /api/shifts/:id
   Content-Type: application/json
   Authorization: Bearer <token>
   Body: { "name": "Updated Shift", "start_time": "10:00:00", "end_time": "18:00:00" }
   ```

5. **Delete Shift**:
   ```
   DELETE /api/shifts/:id
   Authorization: Bearer <token>
   ```

## Key Differences from Department/Profession Models

### 1. **Simple Structure**:
- **No TermGroups**: Shifts don't use the complex TermGroup system
- **No AI Fields**: Shifts don't have AI-generated content fields
- **No File Uploads**: Shifts don't support icon uploads
- **No Complex Relationships**: No foreign key relationships defined
- **Time-based**: Focus on time management rather than content management

### 2. **MCP Interface Mismatch**:
- **Actual Model**: Has `name`, `start_time`, and `end_time` fields
- **MCP Interface**: Uses `name` and `description` fields (description stores time info)
- **Field Mapping**: MCP `description` field maps to model time fields

### 3. **Usage Pattern**:
- **Isolated Entity**: Currently not referenced by other entities
- **Scheduling Management**: Shifts represent work time periods
- **Time-based Operations**: Focus on time ranges and scheduling
- **Unique Constraints**: Names must be unique across the system

## Advanced Features

### 1. **Search and Filtering**:
```javascript
// Search by name or ID
GET /api/shifts?search=day

// Sort by different fields
GET /api/shifts?sortBy=start_time&sortOrder=asc

// Get short format (ID and name only)
GET /api/shifts?isShort=true

// Get all shifts without pagination
GET /api/shifts?all=true
```

### 2. **Time Validation**:
```javascript
// Backend validates:
// - start_time format (HH:MM:SS)
// - end_time format (HH:MM:SS)
// - name uniqueness
// - Logical time ranges (start < end, unless overnight)
```

### 3. **Pagination Support**:
```javascript
// Response includes pagination metadata:
{
  data: [...],
  pagination: {
    total: 25,
    page: 1,
    limit: 10,
    totalPages: 3
  }
}
```

## Key Differences from Status/Priority Models

### 1. **Time Management**:
- **Shift**: Has time fields (start_time, end_time)
- **Status/Priority**: No time fields

### 2. **Unique Constraints**:
- **Shift**: Names must be unique
- **Status/Priority**: No unique constraints

### 3. **Data Type**:
- **Shift**: Uses TIME data type
- **Status/Priority**: Uses STRING data type

### 4. **Usage Context**:
- **Shift**: Work scheduling and time management
- **Status**: Workflow states
- **Priority**: Urgency levels

## Time Management Examples

### 1. **Standard Business Hours**:
```javascript
{
  name: "Day Shift",
  start_time: "09:00:00",
  end_time: "17:00:00"
}
```

### 2. **Overnight Shift**:
```javascript
{
  name: "Night Shift",
  start_time: "22:00:00",
  end_time: "06:00:00"  // Next day
}
```

### 3. **Split Shift**:
```javascript
{
  name: "Split Shift",
  start_time: "08:00:00",
  end_time: "12:00:00"  // Morning part
}
```

### 4. **Flexible Hours**:
```javascript
{
  name: "Flexible Shift",
  start_time: "10:00:00",
  end_time: "18:00:00"
}
```

## Summary

The Shift model is a **simple time-based entity** used for work scheduling and time management. Like Statuses and Priorities, Shifts:

### Key Points:
1. **Simple MCP Interface**: Only `name` and `description` (time) required
2. **No Complex Processing**: Direct creation without TermGroups or AI fields
3. **Time Management**: Focus on start and end times
4. **Unique Names**: Shift names must be unique across the system
5. **Scheduling Context**: Represents work time periods
6. **Isolated Entity**: Currently not referenced by other entities
7. **No Referential Integrity**: Can be deleted without usage checks

### For AI Integration:
The Shift model is one of the simplest entities to work with:
- **Minimal Fields**: Only name and time fields
- **No Complex Relationships**: No foreign key references
- **Direct Creation**: No intermediate models or services
- **Clear Purpose**: Work time period management
- **Time-based**: Focus on scheduling and time management

### Common Use Cases:
1. **Work Shifts**: Day, Evening, Night shifts
2. **Schedule Management**: Employee scheduling
3. **Time Tracking**: Work hour management
4. **Shift Planning**: Workforce planning
5. **Overtime Management**: Extended hour shifts

### Future Considerations:
- **Integration Potential**: May be referenced by employee schedules
- **Calendar Integration**: Could be used in calendar systems
- **Payroll Integration**: Shift-based pay calculations
- **Attendance Tracking**: Shift-based attendance management

The MCP interface provides a simplified way to manage shifts, though it uses the `description` field to store time information instead of dedicated time fields. The time-based nature makes it suitable for scheduling and workforce management systems.

