# Rate Model Description for MCP Integration

## Full Rate Model Description

### Core Fields
- **id**: Primary key (INTEGER, auto-increment)
- **name**: Rate name (STRING(100), required, unique)
- **value**: Rate value (DECIMAL(10,2), required)
- **hours**: Number of hours (INTEGER, required)

### Relationships
- **No direct relationships**: Rate model has no foreign key relationships defined
- **Referenced by**: Other entities may reference rates (though not currently implemented)

## Important: Simple Creation Process

**NOTE**: Like Statuses, Priorities, Shifts, and Currencies, Rate creation is simple and doesn't involve TermGroups or complex relationships.

### Frontend Form Data Structure:
```javascript
const rateData = {
  name: "Hourly Rate",           // REQUIRED - Unique rate name
  value: 25.50,                 // REQUIRED - Rate value (decimal)
  hours: 8                       // REQUIRED - Number of hours
};
```

### Backend Processing:
1. **Validates uniqueness** of rate name
2. **Creates Rate** with name, value, and hours
3. **Returns created rate** with ID

## MCP Instructions for Rate Operations

### Available MCP Functions for Rates:

1. **Get all rates**:
   ```javascript
   mcp_libs-mcp-service_get_rates({
     page: 1,           // Page number (default: 1)
     limit: 10,         // Number of rates per page (default: 10)
     search: "search"   // Search by rate name
   })
   ```

2. **Get specific rate**:
   ```javascript
   mcp_libs-mcp-service_get_rate({
     rateId: "rate_id_here"
   })
   ```

3. **Create new rate**:
   ```javascript
   mcp_libs-mcp-service_create_rate({
     name: "Rate Name",           // REQUIRED
     description: "Rate description"  // REQUIRED
   })
   ```

4. **Update existing rate**:
   ```javascript
   mcp_libs-mcp-service_update_rate({
     rateId: "rate_id_here",      // REQUIRED
     name: "Updated Rate Name",   // REQUIRED
     description: "Updated description"  // REQUIRED
   })
   ```

### Important Notes for MCP Usage:

1. **Required Fields**: Both `name` and `description` are required for creation/update
2. **Simple Structure**: Rates are simple entities without complex relationships
3. **No TermGroups**: Rates don't use the TermGroup system like Departments and Professions
4. **Rate Management**: The MCP interface uses `description` field for rate info (unlike the actual model which has separate `value` and `hours` fields)
5. **Unique Names**: Rate names must be unique across the system
6. **No Referential Integrity**: Rates can be deleted without checking usage

### Example Usage for Another AI:

```javascript
// Get all rates
const rates = await mcp_libs-mcp-service_get_rates({
  page: 1,
  limit: 50
});

// Create a new rate
const newRate = await mcp_libs-mcp-service_create_rate({
  name: "Standard Rate",
  description: "25.50-8"  // Value-Hours format
});

// Update a rate
const updatedRate = await mcp_libs-mcp-service_update_rate({
  rateId: "123",
  name: "Premium Rate",
  description: "35.75-8"  // Updated Value-Hours format
});
```

### Response Format

All MCP functions return JSON objects with the following structure:

```javascript
{
  success: true,
  data: {
    id: 1,
    name: "Rate Name",
    description: "Rate description",  // Used for Value-Hours in MCP
    // ... other fields managed internally
  },
  message: "Operation completed successfully"
}
```

## Complete Field Reference

### Rate Model Fields:
```javascript
{
  id: INTEGER,                    // Primary key, auto-increment
  name: STRING(100),              // REQUIRED - Unique rate name
  value: DECIMAL(10,2),           // REQUIRED - Rate value (decimal)
  hours: INTEGER                  // REQUIRED - Number of hours
}
```

### Related Model Fields (for Reference):

#### Rate Format Examples:
```javascript
// Common rate formats:
{
  name: "Hourly Rate",
  value: 25.50,
  hours: 8
}

{
  name: "Overtime Rate",
  value: 37.50,
  hours: 4
}

{
  name: "Weekend Rate",
  value: 30.00,
  hours: 8
}
```

### Default Rates (Common Examples):
```javascript
[
  { name: "Standard Rate", value: 25.50, hours: 8 },
  { name: "Overtime Rate", value: 37.50, hours: 4 },
  { name: "Weekend Rate", value: 30.00, hours: 8 },
  { name: "Holiday Rate", value: 40.00, hours: 8 },
  { name: "Night Shift Rate", value: 28.00, hours: 8 },
  { name: "Part-time Rate", value: 20.00, hours: 4 },
  { name: "Contract Rate", value: 50.00, hours: 1 },
  { name: "Freelance Rate", value: 75.00, hours: 1 }
]
```

### Relationships:
- **Rate** → **No direct relationships** (currently isolated entity)
- **Future Integration**: May be referenced by other entities for payroll calculations

## API Endpoints for Rates

### Available REST API Endpoints:

1. **Create Rate**:
   ```
   POST /api/rates
   Content-Type: application/json
   Authorization: Bearer <token>
   Body: { "name": "Rate Name", "value": 25.50, "hours": 8 }
   ```

2. **Get all Rates**:
   ```
   GET /api/rates
   Query Parameters:
   - page: Page number (default: 1)
   - limit: Items per page (default: 10)
   - search: Search by name, ID, or hours
   - sortBy: Sort field (id, name, value, hours)
   - sortOrder: Sort order (asc, desc)
   - all: Return all rates without pagination
   - isShort: Return only ID and name
   ```

3. **Get specific Rate**:
   ```
   GET /api/rates/:id
   ```

4. **Update Rate**:
   ```
   PUT /api/rates/:id
   Content-Type: application/json
   Authorization: Bearer <token>
   Body: { "name": "Updated Rate", "value": 30.00, "hours": 8 }
   ```

5. **Delete Rate**:
   ```
   DELETE /api/rates/:id
   Authorization: Bearer <token>
   ```

## Key Differences from Department/Profession Models

### 1. **Simple Structure**:
- **No TermGroups**: Rates don't use the complex TermGroup system
- **No AI Fields**: Rates don't have AI-generated content fields
- **No File Uploads**: Rates don't support icon uploads
- **No Complex Relationships**: No foreign key relationships defined
- **Financial Focus**: Focus on rate management rather than content management

### 2. **MCP Interface Mismatch**:
- **Actual Model**: Has `name`, `value`, and `hours` fields
- **MCP Interface**: Uses `name` and `description` fields (description stores Value-Hours)
- **Field Mapping**: MCP `description` field maps to model Value-Hours fields

### 3. **Usage Pattern**:
- **Isolated Entity**: Currently not referenced by other entities
- **Payroll Management**: Rates represent compensation levels
- **Time-based Calculations**: Focus on hourly rates and time periods
- **Unique Constraints**: Names must be unique across the system

## Advanced Features

### 1. **Search and Filtering**:
```javascript
// Search by name, ID, or hours
GET /api/rates?search=hourly

// Sort by different fields
GET /api/rates?sortBy=value&sortOrder=desc

// Get short format (ID and name only)
GET /api/rates?isShort=true

// Get all rates without pagination
GET /api/rates?all=true
```

### 2. **Validation Rules**:
```javascript
// Backend validates:
// - name uniqueness
// - value format (decimal with 2 decimal places)
// - hours format (positive integer)
// - Required field presence
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

## Key Differences from Other Simple Models

### 1. **Financial Focus**:
- **Rate**: Financial/compensation entity
- **Status**: Workflow states
- **Priority**: Urgency levels
- **Shift**: Time management
- **Currency**: Monetary units

### 2. **Decimal Values**:
- **Rate**: Uses DECIMAL(10,2) for precise financial calculations
- **Others**: Use STRING or INTEGER fields

### 3. **Time-based Calculations**:
- **Rate**: Combines value and hours for calculations
- **Shift**: Only time periods
- **Others**: No time-based calculations

### 4. **Unique Constraints**:
- **Rate**: Only names must be unique
- **Currency**: Names and ISO3 codes must be unique
- **Shift**: Only names must be unique
- **Status/Priority**: No unique constraints

## Rate Management Examples

### 1. **Standard Work Rates**:
```javascript
[
  { name: "Standard Rate", value: 25.50, hours: 8 },
  { name: "Part-time Rate", value: 20.00, hours: 4 },
  { name: "Full-time Rate", value: 25.50, hours: 8 }
]
```

### 2. **Overtime Rates**:
```javascript
[
  { name: "Overtime Rate", value: 37.50, hours: 4 },
  { name: "Double Time", value: 50.00, hours: 2 },
  { name: "Triple Time", value: 75.00, hours: 1 }
]
```

### 3. **Special Rates**:
```javascript
[
  { name: "Weekend Rate", value: 30.00, hours: 8 },
  { name: "Holiday Rate", value: 40.00, hours: 8 },
  { name: "Night Shift Rate", value: 28.00, hours: 8 }
]
```

### 4. **Contract Rates**:
```javascript
[
  { name: "Contract Rate", value: 50.00, hours: 1 },
  { name: "Freelance Rate", value: 75.00, hours: 1 },
  { name: "Consultant Rate", value: 100.00, hours: 1 }
]
```

## Summary

The Rate model is a **simple financial entity** used for rate management and payroll calculations. Like Statuses, Priorities, Shifts, and Currencies, Rates:

### Key Points:
1. **Simple MCP Interface**: Only `name` and `description` (Value-Hours) required
2. **No Complex Processing**: Direct creation without TermGroups or AI fields
3. **Financial Management**: Focus on rate values and time calculations
4. **Unique Names**: Rate names must be unique across the system
5. **Payroll Context**: Represents compensation rates and time periods
6. **Isolated Entity**: Currently not referenced by other entities
7. **No Referential Integrity**: Can be deleted without usage checks

### For AI Integration:
The Rate model is one of the simplest entities to work with:
- **Minimal Fields**: Only name, value, and hours
- **No Complex Relationships**: No foreign key references
- **Direct Creation**: No intermediate models or services
- **Clear Purpose**: Rate and compensation management
- **Financial Calculations**: Supports payroll and billing calculations

### Common Use Cases:
1. **Payroll Systems**: Employee compensation rates
2. **Billing Systems**: Service rate management
3. **Time Tracking**: Rate-based time calculations
4. **Overtime Management**: Different rates for different time periods
5. **Contract Management**: Project-based rates
6. **Freelance Platforms**: Rate-based compensation

### Future Considerations:
- **Integration Potential**: May be referenced by payroll systems
- **Employee Integration**: Rate-based employee compensation
- **Project Integration**: Project-based rate calculations
- **Time Tracking Integration**: Rate-based time tracking
- **Reporting Systems**: Rate-based financial reporting

The MCP interface provides a simplified way to manage rates, though it uses the `description` field to store Value-Hours information instead of dedicated fields. The financial focus makes it suitable for payroll systems, billing software, and compensation management applications.

