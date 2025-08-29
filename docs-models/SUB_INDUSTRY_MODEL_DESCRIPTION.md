# Sub-Industry Model Description for MCP Integration

## Full Sub-Industry Model Description

### Core Fields
- **id**: Primary key (INTEGER, auto-increment)
- **term_group_id**: Foreign key to TermGroup model (INTEGER, nullable)
- **industry_id**: Foreign key to Industry model (INTEGER, nullable)

### Relationships
- **Belongs to TermGroup**: `term_group_id` → `term_groups.id` (holds name/description/icon and translations)
- **Belongs to Industry**: `industry_id` → `industries.id` (parent industry)

## Important: Creation/Update Process (Terms & TermGroup)

The Sub-Industry entity stores only references to parent Industry and TermGroup; human-readable name and description reside in TermGroup/Terms and are managed by backend services.

### Typical JSON Payload (Token/REST)
Content-Type: application/json
```json
{
  "industry_id": 5,                       // Optional; link to parent Industry
  "mainTerm": {                           // REQUIRED for readable name
    "value": "FinTech",
    "description": "Financial Technology",
    "language_id": 1,
    "term_type_id": 1,
    "status_id": 1
  },
  "terms": [                              // Optional extra terms/translations
    { "value": "Фінтех", "language_id": 1, "term_type_id": 2 },
    { "value": "Финтех", "language_id": 2, "term_type_id": 2 }
  ],
  "description": "Sub-Industry: FinTech"   // Goes to TermGroup.description
}
```

Backend behavior:
1. Creates Sub-Industry row with optional `industry_id`.
2. Ensures a TermGroup exists and wires `term_group_id`.
3. Creates/updates MainTerm (and optional Terms) with provided language/type/status.
4. Syncs terms via Terms Service and sets TermGroup fields (name/description/icon).

Notes:
- Token routes do not handle file upload for `icon` here; send only string fields.

### Default Values Used by Backend
- `language_id`: null (for sub-industry main term when not provided)
- `term_type_id`: null for created main term unless provided
- `status_id`: null unless provided
- `created_by`: "0" if not provided

## Complete Field Reference

### Sub-Industry Model Fields
```javascript
{
  id: INTEGER,             // PK
  term_group_id: INTEGER,  // Nullable, FK → TermGroup
  industry_id: INTEGER     // Nullable, FK → Industry
}
```

### Term Model Fields (for Main Term)
```javascript
{
  id: INTEGER,            // PK
  value: STRING,          // REQUIRED - Sub-Industry name
  description: TEXT,      // Nullable
  language_id: INTEGER,   // Nullable (in controller)
  term_type_id: INTEGER,  // Nullable (in controller)
  status_id: SMALLINT,    // Nullable
  created_by: STRING      // Nullable
}
```

### TermGroup Model Fields
```javascript
{
  id: INTEGER,            // PK
  name: STRING,           // From MainTerm.value
  main_term_id: INTEGER,  // FK → main Term
  description: TEXT,      // Optional sub-industry description
  status_id: SMALLINT,    // Nullable
  created_by: STRING      // Nullable
}
```

### Industry Model (Relation Reference)
```javascript
{
  id: INTEGER,            // PK
  term_group_id: INTEGER  // FK → TermGroup
}
```

## Token API Instructions (for another AI)

Base: `/api/token/sub-industries` (Scopes: `sub_industries:read` for GET, `sub_industries:write` for POST/PUT/DELETE)

### List Sub-Industries (paginated)
```bash
curl -H "Authorization: Bearer $API_KEY" \
  "$BASE_URL/api/token/sub-industries?limit=25&page=1&sortBy=name&sortOrder=asc&search=fin&filters={\"language_id\":1,\"industry_id\":5}"
```

All sub-industries (no pagination):
```bash
curl -H "Authorization: Bearer $API_KEY" "$BASE_URL/api/token/sub-industries?all=true"
```

### Get Sub-Industry by ID
```bash
curl -H "Authorization: Bearer $API_KEY" "$BASE_URL/api/token/sub-industries/123"
```

### Create Sub-Industry
```bash
curl -X POST -H "Authorization: Bearer $API_KEY" -H "Content-Type: application/json" \
  -d '{
    "industry_id": 5,
    "mainTerm": {"value":"FinTech","language_id":1,"term_type_id":1},
    "terms": [{"value":"Фінтех","language_id":1,"term_type_id":2}],
    "description": "Sub-Industry: FinTech"
  }' \
  "$BASE_URL/api/token/sub-industries"
```

### Update Sub-Industry
```bash
curl -X PUT -H "Authorization: Bearer $API_KEY" -H "Content-Type: application/json" \
  -d '{
    "industry_id": 6,
    "mainTerm": {"value":"FinTech Platforms","description":"Updated"},
    "terms": [{"id":789,"value":"FinTech Apps","language_id":1,"term_type_id":2}]
  }' \
  "$BASE_URL/api/token/sub-industries/123"
```

### Delete Sub-Industry
```bash
curl -X DELETE -H "Authorization: Bearer $API_KEY" "$BASE_URL/api/token/sub-industries/123"
```

### Terms (Flattened) for Sub-Industries
```bash
curl -H "Authorization: Bearer $API_KEY" "$BASE_URL/api/token/sub-industries/terms/all?limit=50&page=1&sortBy=subIndustryName&filters={\"industry_id\":5}"
```

### Sorting / Filtering / Search
- `sortBy`: `id`, `name` (MainTerm.value), `language`, `termType`, `status`, `industry`
- `filters` (JSON): `language_id`, `term_type_id`, `status_id`, `industry_id`
- `search`: matches MainTerm.value, TermGroup.description, related Industry.MainTerm, or numeric `id`

### Token Validation
```bash
curl -H "Authorization: Bearer $API_KEY" "$BASE_URL/api/token/validate"
```

## Terms Management
Update related terms (non-main) by including `id` in `terms` array:
```json
{
  "terms": [
    {
      "id": 789,  // Must be a related term of this sub-industry's group (not main)
      "value": "Updated term",
      "language_id": 1,
      "term_type_id": 2
    }
  ]
}
```
Omitting existing related terms from your `terms` array will unlink them from the sub-industry’s term group (records remain in `terms` table).

## Summary

Sub-Industry links to a TermGroup for readable data and belongs to a parent Industry. Use token endpoints with proper scopes to list/read/create/update/delete. Backend ensures TermGroup/Terms consistency and supports filtering by parent industry.
