# Industry Model Description for MCP Integration

## Full Industry Model Description

### Core Fields
- **id**: Primary key (INTEGER, auto-increment)
- **term_group_id**: Foreign key to TermGroup model (INTEGER, nullable)

### Relationships
- **Belongs to TermGroup**: `term_group_id` → `term_groups.id` (holds name/description/icon and translations)
- **Has many SubIndustries**: `industries.id` → `sub_industries.industry_id`

## Important: Creation/Update Process (Terms & TermGroup)

The Industry entity stores only the link to its `TermGroup`; human-readable name, description and icon reside in TermGroup/Terms and are managed by backend services.

### Typical JSON Payload (Token/REST)
Content-Type: application/json
```json
{
  "mainTerm": {                         // REQUIRED for readable name
    "value": "Information Technology",
    "description": "IT industry",
    "language_id": 1,
    "term_type_id": 1,
    "status_id": 1
  },
  "terms": [                            // Optional extra terms/translations
    { "value": "Інформаційні технології", "language_id": 1, "term_type_id": 2 },
    { "value": "Информационные технологии", "language_id": 2, "term_type_id": 2 }
  ],
  "description": "Industry: IT",       // Goes to TermGroup.description
  "icon": "/uploads/industries/it.svg",// Optional as STRING (URL/path)
  "subIndustryIds": [10, 11]            // Optional: link existing sub-industries to this industry
}
```

Backend behavior:
1. Creates Industry row.
2. Ensures a TermGroup exists and wires `term_group_id`.
3. Creates/updates MainTerm (and optional Terms) with provided language/type/status.
4. Syncs terms via Terms Service and sets TermGroup fields (name/description/icon).
5. Optionally reassigns SubIndustries listed in `subIndustryIds` to this Industry.

Notes:
- Token routes do not handle file uploads for `icon`; send a string path/URL. File uploads, if needed, must be handled outside token endpoints.

### Default Values Used by Backend
- `language_id`: 1 (default language for MainTerm)
- `term_type_id`: 1 ("main") for MainTerm
- `status_id`: null (unless provided)
- `created_by`: "0" if not provided

## Complete Field Reference

### Industry Model Fields
```javascript
{
  id: INTEGER,             // PK
  term_group_id: INTEGER   // Nullable, FK → TermGroup
}
```

### Term Model Fields (for Main Term)
```javascript
{
  id: INTEGER,            // PK
  value: STRING,          // REQUIRED - Industry name
  description: TEXT,      // Nullable
  language_id: INTEGER,   // REQUIRED
  term_type_id: INTEGER,  // REQUIRED (main)
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
  description: TEXT,      // Optional industry description
  status_id: SMALLINT,    // Nullable
  created_by: STRING,     // Nullable
  icon: STRING            // Optional path/URL to icon
}
```

### SubIndustry Model (Relation Reference)
```javascript
{
  id: INTEGER,            // PK
  term_group_id: INTEGER, // FK → TermGroup
  industry_id: INTEGER    // FK → Industry
}
```

## Token API Instructions (for another AI)

Base: `/api/token/industries` (Scopes: `industries:read` for GET, `industries:write` for POST/PUT/DELETE)

### List Industries (paginated)
```bash
curl -H "Authorization: Bearer $API_KEY" \
  "$BASE_URL/api/token/industries?limit=25&page=1&sortBy=name&sortOrder=asc&search=tech&filters={\"language_id\":1}"
```

All industries (no pagination):
```bash
curl -H "Authorization: Bearer $API_KEY" "$BASE_URL/api/token/industries?all=true"
```

### Get Industry by ID
```bash
curl -H "Authorization: Bearer $API_KEY" "$BASE_URL/api/token/industries/123"
```

### Create Industry
```bash
curl -X POST -H "Authorization: Bearer $API_KEY" -H "Content-Type: application/json" \
  -d '{
    "mainTerm": {"value":"Information Technology","language_id":1,"term_type_id":1},
    "terms": [{"value":"IT","language_id":1,"term_type_id":2}],
    "description": "Industry: IT",
    "icon": "/uploads/industries/it.svg",
    "subIndustryIds": [10,11]
  }' \
  "$BASE_URL/api/token/industries"
```

### Update Industry
```bash
curl -X PUT -H "Authorization: Bearer $API_KEY" -H "Content-Type: application/json" \
  -d '{
    "mainTerm": {"value":"IT & Software","description":"Updated"},
    "terms": [{"id":456,"value":"Tech","language_id":1,"term_type_id":2}],
    "icon": "/uploads/industries/it-new.svg",
    "subIndustryIds": [12,13]
  }' \
  "$BASE_URL/api/token/industries/123"
```

### Delete Industry
```bash
curl -X DELETE -H "Authorization: Bearer $API_KEY" "$BASE_URL/api/token/industries/123"
```

### Terms (Flattened) for Industries
```bash
curl -H "Authorization: Bearer $API_KEY" "$BASE_URL/api/token/industries/terms/all?limit=50&page=1&sortBy=industryName"
```

### Sorting / Filtering / Search
- `sortBy`: `id`, `name` (MainTerm.value), `language`, `termType`, `status`
- `filters` (JSON): `language_id`, `term_type_id`, `status_id`
- `search`: matches MainTerm.value, TermGroup.description, or numeric `id`

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
      "id": 456,  // Must be a related term of this industry's group (not main)
      "value": "Updated term",
      "language_id": 1,
      "term_type_id": 2
    }
  ]
}
```
Omitting existing related terms from your `terms` array will unlink them from the industry’s term group (records remain in `terms` table).

## Summary

Industry links to a TermGroup for readable data and can own multiple SubIndustries. Use token endpoints with proper scopes to list/read/create/update/delete. Backend ensures TermGroup/Terms consistency and allows assigning sub-industries via `subIndustryIds`.
