# City Model Description for MCP Integration

## Full City Model Description

### Core Fields
- **id**: Primary key (INTEGER, auto-increment)
- **latitude**: Latitude (DECIMAL(10,8), nullable)
- **longitude**: Longitude (DECIMAL(11,8), nullable)
- **term_group_id**: Foreign key to TermGroup (INTEGER, nullable)
- **country_id**: Foreign key to Country (INTEGER, nullable)

### Relationships
- **Belongs to TermGroup**: `term_group_id` → `term_groups.id` (name/description/translations)
- **Belongs to Country**: `country_id` → `countries.id`

## Important: Creation/Update Process (Terms & TermGroup)

City stores geo/country relations; human-readable name and description live in TermGroup/Terms and are managed by backend.

### Typical JSON Payload (Token/REST)
```json
{
  "latitude": 50.4501,
  "longitude": 30.5234,
  "country_id": 123,
  "mainTerm": "Kyiv",                  // REQUIRED for readable name
  "terms": { "uk": { "name": "Київ" } },
  "description": "City: Kyiv"
}
```

Backend behavior:
1. Creates/updates City with geo/country fields.
2. Ensures a TermGroup exists; links `term_group_id`.
3. Creates/updates MainTerm (and optional Terms) with defaults.
4. Syncs terms via Terms Service; sets TermGroup description if provided.

### Default Values Used by Backend
- `language_id`: 1 (default language for MainTerm)
- `term_type_id`: 1 ("main") for MainTerm
- `status_id`: 1 (e.g., "Active")
- `created_by`: "0" if not provided

## Complete Field Reference

### City Model Fields
```javascript
{
  id: INTEGER,             // PK
  latitude: DECIMAL(10,8), // Nullable
  longitude: DECIMAL(11,8),// Nullable
  term_group_id: INTEGER,  // Nullable, FK → TermGroup
  country_id: INTEGER      // Nullable, FK → Country
}
```

### Term Model Fields (for Main Term)
```javascript
{
  id: INTEGER,            // PK
  value: STRING,          // REQUIRED - City name
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
  description: TEXT,      // Optional city description
  status_id: SMALLINT,    // Nullable
  created_by: STRING      // Nullable
}
```

### Country Model (Relation Reference)
```javascript
{
  id: INTEGER,            // PK
  iso2: STRING(2),        // REQUIRED, unique
  iso3: STRING(3)         // REQUIRED, unique
}
```

## Token API Instructions (for another AI)

Base: `/api/token/cities` (Scopes: `cities:read` for GET, `cities:write` for POST/PUT/DELETE)

### List Cities (paginated or all)
```bash
curl -H "Authorization: Bearer $API_KEY" \
  "$BASE_URL/api/token/cities?limit=25&page=1&sortBy=name&sortOrder=asc&search=ky&filters={\"language_id\":1}"
```

All cities (no pagination):
```bash
curl -H "Authorization: Bearer $API_KEY" "$BASE_URL/api/token/cities?all=true"
```

### Get City by ID
```bash
curl -H "Authorization: Bearer $API_KEY" "$BASE_URL/api/token/cities/123"
```

### Create City
```bash
curl -X POST -H "Authorization: Bearer $API_KEY" -H "Content-Type: application/json" \
  -d '{
    "latitude":50.4501,
    "longitude":30.5234,
    "country_id":123,
    "mainTerm":"Kyiv",
    "terms":{"uk":{"name":"Київ"}},
    "description":"City: Kyiv"
  }' \
  "$BASE_URL/api/token/cities"
```

### Update City
```bash
curl -X PUT -H "Authorization: Bearer $API_KEY" -H "Content-Type: application/json" \
  -d '{"description":"Capital of Ukraine"}' \
  "$BASE_URL/api/token/cities/123"
```

### Delete City
```bash
curl -X DELETE -H "Authorization: Bearer $API_KEY" "$BASE_URL/api/token/cities/123"
```

### Sorting / Filtering / Search
- `sortBy`: `id`, `name` (MainTerm.value), `language`, `termType`, `status`, `country`
- `filters` (JSON): `language_id`, `term_type_id`, `status_id`, `country_id`
- `search`: matches MainTerm.value/description and TermGroup fields; numeric id supported

### Token Validation
```bash
curl -H "Authorization: Bearer $API_KEY" "$BASE_URL/api/token/validate"
```

## Summary

City holds geo and country linkage; human-readable content is in TermGroup/Terms. Use token endpoints with proper scopes to list/read/create/update/delete. Backend ensures TermGroup/Terms consistency and applies defaults.


