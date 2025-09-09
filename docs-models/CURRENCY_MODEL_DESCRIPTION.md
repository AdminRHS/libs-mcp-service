# Currency Model Description for MCP Integration

## Full Currency Model Description

### Core Fields
- **id**: Primary key (INTEGER, auto-increment)
- **name**: Currency name (STRING(100), required, unique)
- **iso3**: ISO 3-letter currency code (STRING(3), required, unique)
- **symbol**: Currency symbol (STRING(10), required)

### Relationships
- **No direct relationships**: Currency model has no foreign key relationships defined
- **Referenced by**: Other entities may reference currencies (though not currently implemented)

## Important: Simple Creation Process

**NOTE**: Like Statuses, Priorities, and Shifts, Currency creation is simple and doesn't involve TermGroups or complex relationships.

### Frontend Form Data Structure:
```javascript
const currencyData = {
  name: "US Dollar",           // REQUIRED - Unique currency name
  iso3: "USD",                // REQUIRED - Unique ISO 3-letter code
  symbol: "$"                 // REQUIRED - Currency symbol
};
```

### Backend Processing:
1. **Validates uniqueness** of currency name and ISO3 code
2. **Creates Currency** with name, iso3, and symbol
3. **Returns created currency** with ID

## MCP Instructions for Currency Operations

### Available MCP Functions for Currencies:

1. **Get all currencies**:
   ```javascript
   mcp_libs-mcp-service_get_currencies({
     page: 1,           // Page number (default: 1)
     limit: 10,         // Number of currencies per page (default: 10)
     search: "search"   // Search by currency name, ISO3, or symbol
   })
   ```

2. **Get specific currency**:
   ```javascript
   mcp_libs-mcp-service_get_currency({
     currencyId: "currency_id_here"
   })
   ```

3. **Create new currency**:
   ```javascript
   mcp_libs-mcp-service_create_currency({
     name: "Currency Name",           // REQUIRED
     description: "Currency description"  // REQUIRED
   })
   ```

4. **Update existing currency**:
   ```javascript
   mcp_libs-mcp-service_update_currency({
     currencyId: "currency_id_here",     // REQUIRED
     name: "Updated Currency Name",      // REQUIRED
     description: "Updated description"  // REQUIRED
   })
   ```

### Important Notes for MCP Usage:

1. **Required Fields**: Both `name` and `description` are required for creation/update
2. **Simple Structure**: Currencies are simple entities without complex relationships
3. **No TermGroups**: Currencies don't use the TermGroup system like Departments and Professions
4. **Currency Management**: The MCP interface uses `description` field for currency info (unlike the actual model which has separate `iso3` and `symbol` fields)
5. **Unique Constraints**: Currency names and ISO3 codes must be unique across the system
6. **No Referential Integrity**: Currencies can be deleted without checking usage

### Example Usage for Another AI:

```javascript
// Get all currencies
const currencies = await mcp_libs-mcp-service_get_currencies({
  page: 1,
  limit: 50
});

// Create a new currency
const newCurrency = await mcp_libs-mcp-service_create_currency({
  name: "Euro",
  description: "EUR-€"  // ISO3-Symbol format
});

// Update a currency
const updatedCurrency = await mcp_libs-mcp-service_update_currency({
  currencyId: "123",
  name: "British Pound",
  description: "GBP-£"  // Updated ISO3-Symbol format
});
```

### Response Format

All MCP functions return JSON objects with the following structure:

```javascript
{
  success: true,
  data: {
    id: 1,
    name: "Currency Name",
    description: "Currency description",  // Used for ISO3-Symbol in MCP
    // ... other fields managed internally
  },
  message: "Operation completed successfully"
}
```

## Complete Field Reference

### Currency Model Fields:
```javascript
{
  id: INTEGER,                    // Primary key, auto-increment
  name: STRING(100),              // REQUIRED - Unique currency name
  iso3: STRING(3),                // REQUIRED - Unique ISO 3-letter code
  symbol: STRING(10)              // REQUIRED - Currency symbol
}
```

### Related Model Fields (for Reference):

#### Currency Format Examples:
```javascript
// Common currency formats:
{
  name: "US Dollar",
  iso3: "USD",
  symbol: "$"
}

{
  name: "Euro",
  iso3: "EUR",
  symbol: "€"
}

{
  name: "British Pound",
  iso3: "GBP",
  symbol: "£"
}
```

### Default Currencies (Common Examples):
```javascript
[
  { name: "US Dollar", iso3: "USD", symbol: "$" },
  { name: "Euro", iso3: "EUR", symbol: "€" },
  { name: "British Pound", iso3: "GBP", symbol: "£" },
  { name: "Japanese Yen", iso3: "JPY", symbol: "¥" },
  { name: "Canadian Dollar", iso3: "CAD", symbol: "C$" },
  { name: "Australian Dollar", iso3: "AUD", symbol: "A$" },
  { name: "Swiss Franc", iso3: "CHF", symbol: "CHF" },
  { name: "Chinese Yuan", iso3: "CNY", symbol: "¥" }
]
```

### Relationships:
- **Currency** → **No direct relationships** (currently isolated entity)
- **Future Integration**: May be referenced by other entities for financial operations

## API Endpoints for Currencies

### Available REST API Endpoints:

1. **Create Currency**:
   ```
   POST /api/currencies
   Content-Type: application/json
   Authorization: Bearer <token>
   Body: { "name": "Currency Name", "iso3": "XXX", "symbol": "X" }
   ```

2. **Get all Currencies**:
   ```
   GET /api/currencies
   Query Parameters:
   - page: Page number (default: 1)
   - limit: Items per page (default: 10)
   - search: Search by name, ISO3, symbol, or ID
   - sortBy: Sort field (id, name, iso3, symbol)
   - sortOrder: Sort order (asc, desc)
   - all: Return all currencies without pagination
   - isShort: Return only ID and name
   ```

3. **Get specific Currency**:
   ```
   GET /api/currencies/:id
   ```

4. **Update Currency**:
   ```
   PUT /api/currencies/:id
   Content-Type: application/json
   Authorization: Bearer <token>
   Body: { "name": "Updated Currency", "iso3": "XXX", "symbol": "X" }
   ```

5. **Delete Currency**:
   ```
   DELETE /api/currencies/:id
   Authorization: Bearer <token>
   ```

## Key Differences from Department/Profession Models

### 1. **Simple Structure**:
- **No TermGroups**: Currencies don't use the complex TermGroup system
- **No AI Fields**: Currencies don't have AI-generated content fields
- **No File Uploads**: Currencies don't support icon uploads
- **No Complex Relationships**: No foreign key relationships defined
- **Financial Focus**: Focus on currency management rather than content management

### 2. **MCP Interface Mismatch**:
- **Actual Model**: Has `name`, `iso3`, and `symbol` fields
- **MCP Interface**: Uses `name` and `description` fields (description stores ISO3-Symbol)
- **Field Mapping**: MCP `description` field maps to model ISO3-Symbol fields

### 3. **Usage Pattern**:
- **Isolated Entity**: Currently not referenced by other entities
- **Financial Management**: Currencies represent monetary units
- **International Standards**: Uses ISO 3-letter codes
- **Unique Constraints**: Names and ISO3 codes must be unique

## Advanced Features

### 1. **Search and Filtering**:
```javascript
// Search by name, ISO3, symbol, or ID
GET /api/currencies?search=USD

// Sort by different fields
GET /api/currencies?sortBy=iso3&sortOrder=asc

// Get short format (ID and name only)
GET /api/currencies?isShort=true

// Get all currencies without pagination
GET /api/currencies?all=true
```

### 2. **Validation Rules**:
```javascript
// Backend validates:
// - name uniqueness
// - iso3 uniqueness and format (3 letters)
// - symbol format
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

## Key Differences from Status/Priority/Shift Models

### 1. **Financial Focus**:
- **Currency**: Financial/monetary entity
- **Status**: Workflow states
- **Priority**: Urgency levels
- **Shift**: Time management

### 2. **International Standards**:
- **Currency**: Uses ISO 3-letter codes
- **Others**: No international standards

### 3. **Unique Constraints**:
- **Currency**: Names and ISO3 codes must be unique
- **Status/Priority**: No unique constraints
- **Shift**: Only names must be unique

### 4. **Data Types**:
- **Currency**: Uses STRING fields with specific lengths
- **Others**: Various data types

## Currency Management Examples

### 1. **Major World Currencies**:
```javascript
[
  { name: "US Dollar", iso3: "USD", symbol: "$" },
  { name: "Euro", iso3: "EUR", symbol: "€" },
  { name: "British Pound", iso3: "GBP", symbol: "£" },
  { name: "Japanese Yen", iso3: "JPY", symbol: "¥" }
]
```

### 2. **Regional Currencies**:
```javascript
[
  { name: "Canadian Dollar", iso3: "CAD", symbol: "C$" },
  { name: "Australian Dollar", iso3: "AUD", symbol: "A$" },
  { name: "Swiss Franc", iso3: "CHF", symbol: "CHF" },
  { name: "Norwegian Krone", iso3: "NOK", symbol: "kr" }
]
```

### 3. **Emerging Market Currencies**:
```javascript
[
  { name: "Chinese Yuan", iso3: "CNY", symbol: "¥" },
  { name: "Indian Rupee", iso3: "INR", symbol: "₹" },
  { name: "Brazilian Real", iso3: "BRL", symbol: "R$" },
  { name: "Russian Ruble", iso3: "RUB", symbol: "₽" }
]
```

### 4. **Cryptocurrencies** (if supported):
```javascript
[
  { name: "Bitcoin", iso3: "BTC", symbol: "₿" },
  { name: "Ethereum", iso3: "ETH", symbol: "Ξ" },
  { name: "Litecoin", iso3: "LTC", symbol: "Ł" }
]
```

## Summary

The Currency model is a **simple financial entity** used for currency management and international monetary operations. Like Statuses, Priorities, and Shifts, Currencies:

### Key Points:
1. **Simple MCP Interface**: Only `name` and `description` (ISO3-Symbol) required
2. **No Complex Processing**: Direct creation without TermGroups or AI fields
3. **Financial Management**: Focus on currency codes and symbols
4. **Unique Constraints**: Names and ISO3 codes must be unique
5. **International Standards**: Uses ISO 3-letter currency codes
6. **Isolated Entity**: Currently not referenced by other entities
7. **No Referential Integrity**: Can be deleted without usage checks

### For AI Integration:
The Currency model is one of the simplest entities to work with:
- **Minimal Fields**: Only name, ISO3, and symbol
- **No Complex Relationships**: No foreign key references
- **Direct Creation**: No intermediate models or services
- **Clear Purpose**: Currency and monetary unit management
- **International Standards**: Uses established ISO codes

### Common Use Cases:
1. **Financial Systems**: Multi-currency support
2. **Payment Processing**: Currency selection
3. **Exchange Rates**: Currency conversion
4. **International Business**: Cross-border transactions
5. **Accounting Systems**: Multi-currency accounting
6. **E-commerce**: Currency selection for customers

### Future Considerations:
- **Integration Potential**: May be referenced by financial transactions
- **Exchange Rate Integration**: Currency conversion rates
- **Payment Gateway Integration**: Payment processing
- **Accounting Integration**: Multi-currency accounting systems
- **Reporting Systems**: Currency-based financial reporting

The MCP interface provides a simplified way to manage currencies, though it uses the `description` field to store ISO3-Symbol information instead of dedicated fields. The financial focus makes it suitable for payment systems, accounting software, and international business applications.

