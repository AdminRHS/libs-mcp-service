# Country Model Description for MCP Integration

## Full Country Model Description

### Core Fields
- **id**: Primary key (INTEGER, auto-increment)
- **iso2**: ISO 2-letter code (STRING(2), REQUIRED, unique)
- **iso3**: ISO 3-letter code (STRING(3), REQUIRED, unique)
- **latitude**: Latitude for geo lookup (DECIMAL(10,8), nullable)
- **longitude**: Longitude for geo lookup (DECIMAL(11,8), nullable)
- **term_group_id**: Foreign key to TermGroup model (INTEGER, nullable)

### Relationships
- **Belongs to TermGroup**: `term_group_id` → `term_groups.id` (holds name/description/icon and translations)
- **Has many Cities**: `countries.id` → `cities.country_id`

## Important: Creation/Update Process (Terms & TermGroup)

The Country entity stores only ISO/geo fields; human-readable name, description and icon reside in TermGroup/Terms and are managed by backend services.

### Typical JSON Payload (Token/REST)
```json
{
  "iso2": "UA",
  "iso3": "UKR",
  "latitude": 48.3794,
  "longitude": 31.1656,
  "mainTerm": "Ukraine",                 // REQUIRED for readable name
  "terms": {                               // Optional extra terms/translations
    "uk": { "name": "Україна" },
    "ru": { "name": "Украина" }
  },
  "description": "Country: Ukraine",      // Goes to TermGroup.description
  "icon": "/uploads/flags/ua.svg"        // Optional; stored in TermGroup.icon
}
```

Backend behavior:
1. Creates/updates Country with ISO/geo fields.
2. Ensures a TermGroup exists and wires `term_group_id`.
3. Creates/updates MainTerm (and optional Terms) with provided language/type/status defaults.
4. Syncs terms via Terms Service and sets TermGroup fields (name/description/icon).

### Default Values Used by Backend
- `language_id`: 1 (default language for MainTerm)
- `term_type_id`: 1 ("main") for MainTerm
- `status_id`: 1 (e.g., "Active")
- `created_by`: "0" if not provided

## Complete Field Reference

### Country Model Fields
```javascript
{
  id: INTEGER,             // PK
  iso2: STRING(2),         // REQUIRED, unique
  iso3: STRING(3),         // REQUIRED, unique
  latitude: DECIMAL(10,8), // Nullable
  longitude: DECIMAL(11,8),// Nullable
  term_group_id: INTEGER   // Nullable, FK → TermGroup
}
```

### Term Model Fields (for Main Term)
```javascript
{
  id: INTEGER,            // PK
  value: STRING,          // REQUIRED - Country name
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
  description: TEXT,      // Optional country description
  status_id: SMALLINT,    // Nullable
  created_by: STRING,     // Nullable
  icon: STRING            // Optional path to icon
}
```

### City Model (Relation Reference)
```javascript
{
  id: INTEGER,            // PK
  country_id: INTEGER,    // FK → Country
  latitude: DECIMAL,      // Nullable
  longitude: DECIMAL      // Nullable
}
```

## Token API Instructions (for another AI)

Base: `/api/token/countries` (Scopes: `countries:read` for GET, `countries:write` for POST/PUT/DELETE)

### List Countries (paginated or all)
```bash
curl -H "Authorization: Bearer $API_KEY" \
  "$BASE_URL/api/token/countries?limit=25&page=1&sortBy=name&sortOrder=asc&search=ua&filters={\"language_id\":1}"
```

All countries (no pagination):
```bash
curl -H "Authorization: Bearer $API_KEY" "$BASE_URL/api/token/countries?all=true"
```

### Get Country by ID
```bash
curl -H "Authorization: Bearer $API_KEY" "$BASE_URL/api/token/countries/123"
```

### Create Country
```bash
curl -X POST -H "Authorization: Bearer $API_KEY" -H "Content-Type: application/json" \
  -d '{
    "iso2":"UA",
    "iso3":"UKR",
    "latitude":48.3794,
    "longitude":31.1656,
    "mainTerm":"Ukraine",
    "terms":{"uk":{"name":"Україна"}},
    "description":"Country: Ukraine"
  }' \
  "$BASE_URL/api/token/countries"
```

### Update Country
```bash
curl -X PUT -H "Authorization: Bearer $API_KEY" -H "Content-Type: application/json" \
  -d '{"icon":"/uploads/flags/ua.svg"}' \
  "$BASE_URL/api/token/countries/123"
```

### Delete Country
```bash
curl -X DELETE -H "Authorization: Bearer $API_KEY" "$BASE_URL/api/token/countries/123"
```

### Sorting / Filtering / Search
- `sortBy`: `id`, `iso2`, `iso3`, `name` (MainTerm.value), `language`, `termType`, `status`
- `filters` (JSON): `language_id`, `term_type_id`, `status_id`, `city_id`
- `search`: matches MainTerm.value, TermGroup.description, `iso2`, `iso3`, or numeric `id`

### Token Validation
```bash
curl -H "Authorization: Bearer $API_KEY" "$BASE_URL/api/token/validate"
```

## Summary

Country holds ISO/geo fields and links to TermGroup for human-readable data and translations. Use token endpoints with proper scopes to list/read/create/update/delete. Backend ensures TermGroup/Terms consistency and applies defaults for language, term type, and status.


