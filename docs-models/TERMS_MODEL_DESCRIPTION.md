# Terms Model Description for MCP Integration

## Full Terms Model Description

### Core Term Fields
- **id**: Primary key (INTEGER, auto-increment)
- **value**: Term text value (STRING, required)
- **description**: Term description (TEXT, optional)
- **language_id**: Foreign key to Language model (INTEGER, required)
- **term_type_id**: Foreign key to TermType model (INTEGER, required)
- **status_id**: Foreign key to Status model (SMALLINT, optional)
- **entity_type_id**: Foreign key to EntityType model (INTEGER, optional)
- **created_by**: Creator identifier (STRING, optional)

### AI Metadata Fields
- **ai_generated**: Whether AI-generated (BOOLEAN, default: false)
- **ai_model**: AI model identifier (STRING(100), optional)
- **ai_prompt_version**: Prompt version used (STRING(50), optional)
- **ai_generation_date**: Generation timestamp (DATE, optional)
- **ai_tokens_used**: Tokens consumed (INTEGER, optional)
- **ai_quality_score**: Quality score 0.00-9.99 (DECIMAL(3,2), optional)
- **ai_validation_status**: Status enum: 'pending', 'approved', 'rejected', 'needs_review' (default: 'pending')
- **ai_source_data**: Original source data (JSONB, optional)
- **ai_metadata**: Additional metadata (JSONB, optional)
- **ai_confidence_score**: Confidence score 0.00-9.99 (DECIMAL(3,2), optional)
- **ai_human_reviewed**: Human review flag (BOOLEAN, default: false)
- **ai_human_reviewer**: Reviewer identifier (STRING(100), optional)
- **ai_review_date**: Review timestamp (DATE, optional)
- **ai_version**: Content version (INTEGER, default: 1)
- **ai_batch_id**: Batch identifier (STRING(50), optional)
- **ai_edit_history**: Edit history (JSONB, optional)
- **ai_original_data**: Original data snapshot (JSONB, optional)
- **ai_manual_overrides**: Manual overrides (JSONB, optional)
- **ai_market_validated**: Market validation flag (BOOLEAN, default: false)
- **ai_validation_errors**: Validation errors (JSONB, optional)

### TermGroup Fields
- **id**: Primary key (INTEGER, auto-increment)
- **name**: Group name (STRING, required)
- **main_term_id**: Foreign key to main Term (INTEGER, required)
- **description**: Group description (TEXT, optional)
- **status_id**: Foreign key to Status model (SMALLINT, optional)
- **created_by**: Creator identifier (STRING, optional)
- **icon**: Icon URL/path (STRING, optional)

### Relationships
- **Term belongs to TermType**: `term_type_id` → `term_types.id`
- **Term belongs to Language**: `language_id` → `languages.id`
- **Term belongs to Status**: `status_id` → `statuses.id`
- **Term belongs to EntityType**: `entity_type_id` → `entity_types.id`
- **Term belongs to many TermGroups**: Many-to-many through `term_group_relations`
- **TermGroup belongs to Term (MainTerm)**: `main_term_id` → `terms.id`
- **TermGroup belongs to Status**: `status_id` → `statuses.id`
- **TermGroup belongs to many Terms**: Many-to-many through `term_group_relations`

## Important: Terms Management Process

Terms can be managed individually or as part of TermGroups. Individual terms exist independently and can be linked to multiple groups.

### Individual Term Creation/Update
Terms can be created and updated directly without being part of a group initially.

### TermGroup Management
- Each TermGroup has one main term and can have multiple related terms
- Terms are linked to groups through junction table `term_group_relations`
- Priority is determined by order in relationships

## API Endpoints for Individual Terms

### Create Individual Term (Bearer Token)
**POST** `/api/terms/terms`
**Content-Type**: `application/json`
**Auth**: Bearer token with `term:create` permission

### Create Individual Term (API Token)
**POST** `/api/token/terms`
**Content-Type**: `application/json`
**Auth**: API token with `terms:write` scope

**Required fields for token endpoint:**
- `value` (string) - Term value
- `language_id` (number) - Language ID
- `term_type_id` (number) - Term type ID
- `term_group_id` (number) - Term group ID
- `term_group_relation_type` (string) - Relation type: 'main', 'similar', 'translation'

**Optional fields:**
- `description` (string) - Term description
- `status_id` (number) - Status ID
- `created_by` (string) - Creator identifier
- `aiMetadata` (object) - AI metadata

```json
{
  "value": "Software Engineer",
  "description": "A person who writes software",
  "language_id": 1,
  "term_type_id": 1,
  "term_group_id": 123,
  "term_group_relation_type": "similar",
  "status_id": 1,
  "created_by": "api-user",
  "aiMetadata": {
    "ai_generated": true,
    "ai_model": "gpt-4o-mini",
    "ai_metadata": {
      "purpose": "profession_definition"
    }
  }
}
```

### Get Individual Term
**GET** `/api/terms/terms/:id`
**Auth**: Bearer token with `term:read` permission

Response includes term details and associated groups.

### Update Individual Term (Bearer Token)
**PUT** `/api/terms/terms/:id`
**Content-Type**: `application/json`
**Auth**: Bearer token with `term:update` permission

### Update Individual Term (API Token)
**PUT** `/api/token/terms/:id`
**Content-Type**: `application/json`
**Auth**: API token with `terms:write` scope

**Optional fields for token endpoint:**
- `value` (string) - Term value
- `language_id` (number) - Language ID
- `term_type_id` (number) - Term type ID
- `term_group_id` (number) - Term group ID (for creating/updating group relation)
- `term_group_relation_type` (string) - Relation type: 'main', 'similar', 'translation'
- `description` (string) - Term description
- `status_id` (number) - Status ID
- `aiMetadata` (object) - AI metadata

```json
{
  "value": "Software Developer",
  "description": "Updated description",
  "language_id": 1,
  "term_type_id": 1,
  "status_id": 1,
  "term_group_id": 123,
  "term_group_relation_type": "similar",
  "aiMetadata": {
    "ai_validation_status": "approved",
    "ai_human_reviewed": true,
    "ai_human_reviewer": "user123"
  }
}
```

### Delete Individual Term
**DELETE** `/api/terms/terms/:id`
**Auth**: Bearer token with `term:delete` permission

## API Endpoints for TermGroups

### Create TermGroup
**POST** `/api/terms/groups`
**Content-Type**: `application/json`
**Auth**: Bearer token with `term:create` permission

```json
{
  "name": "Technology Professions",
  "main_term_id": 123,
  "description": "Group for technology-related professions",
  "status_id": 1
}
```

### Get TermGroup with Terms
**GET** `/api/terms/groups/:id`
**Auth**: Bearer token with `term:read` permission

Response includes main term and all related terms.

### Update TermGroup
**PUT** `/api/terms/groups/:id`
**Content-Type**: `application/json`
**Auth**: Bearer token with `term:update` permission

```json
{
  "name": "Updated Technology Professions",
  "main_term_id": 124,
  "description": "Updated description",
  "status_id": 1
}
```

### Add Term to Group
**POST** `/api/terms/groups/:id/terms`
**Content-Type**: `application/json`
**Auth**: Bearer token with `term:create` permission

```json
{
  "term_id": 456,
  "priority": 2
}
```

## Search and Discovery

### Search Terms
**GET** `/api/terms/search?q=engineer&language_id=1&term_type=main&limit=20&offset=0`
**Auth**: Bearer token with `term:read` permission

### Get Term Suggestions
**GET** `/api/terms/suggestions/engineer?limit=10&language_id=1`
**Auth**: Bearer token with `term:read` permission

### Autocomplete
**GET** `/api/terms/autocomplete?q=eng&limit=10&language_id=1`
**Auth**: Bearer token with `term:read` permission

## Bulk Operations

### Bulk Update Terms
**PUT** `/api/terms/terms/bulk-update`
**Content-Type**: `application/json`
**Auth**: Bearer token with `term:update` permission

```json
{
  "updates": [
    {
      "id": 123,
      "data": {
        "value": "Updated Value",
        "status_id": 2
      }
    },
    {
      "id": 124,
      "data": {
        "description": "New description"
      }
    }
  ]
}
```

## Validation and Quality

### Validate Term
**POST** `/api/terms/validate`
**Content-Type**: `application/json`
**Auth**: Bearer token with `term:read` permission

```json
{
  "value": "Software Engineer",
  "language_id": 1
}
```

### Check Duplicates
**POST** `/api/terms/check-duplicates`
**Content-Type**: `application/json`
**Auth**: Bearer token with `term:read` permission

```json
{
  "value": "Software Engineer",
  "language_id": 1,
  "exclude_id": 123
}
```

## Statistics and Analytics

### Terms Statistics
**GET** `/api/terms/stats`
**Auth**: Bearer token with `term:read` permission

### Usage Statistics
**GET** `/api/terms/stats/usage`
**Auth**: Bearer token with `term:read` permission

## Curl Examples

### Create Individual Term (Bearer Token)
```bash
curl -X POST http://localhost:3000/api/terms/terms \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "value": "Software Engineer",
    "description": "A person who writes software",
    "language_id": 1,
    "term_type_id": 1,
    "status_id": 1,
    "ai_generated": true,
    "ai_model": "gpt-4o-mini",
    "ai_metadata": {"purpose": "profession_definition"}
  }'
```

### Create Individual Term (API Token)
```bash
curl -X POST http://localhost:3000/api/token/terms \
  -H "Content-Type: application/json" \
  -H "X-API-Key: YOUR_API_TOKEN" \
  -d '{
    "value": "Software Engineer",
    "description": "A person who writes software",
    "language_id": 1,
    "term_type_id": 1,
    "term_group_id": 123,
    "term_group_relation_type": "similar",
    "status_id": 1,
    "created_by": "api-user",
    "aiMetadata": {
      "ai_generated": true,
      "ai_model": "gpt-4o-mini",
      "ai_metadata": {"purpose": "profession_definition"}
    }
  }'
```

### Update Individual Term (Bearer Token)
```bash
curl -X PUT http://localhost:3000/api/terms/terms/123 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "value": "Software Developer",
    "description": "Updated description",
    "ai_validation_status": "approved",
    "ai_human_reviewed": true
  }'
```

### Update Individual Term (API Token)
```bash
curl -X PUT http://localhost:3000/api/token/terms/123 \
  -H "Content-Type: application/json" \
  -H "X-API-Key: YOUR_API_TOKEN" \
  -d '{
    "value": "Software Developer",
    "description": "Updated description",
    "term_group_id": 123,
    "term_group_relation_type": "similar",
    "aiMetadata": {
      "ai_validation_status": "approved",
      "ai_human_reviewed": true,
      "ai_human_reviewer": "user123"
    }
  }'
```

### Search Terms
```bash
curl -X GET "http://localhost:3000/api/terms/search?q=engineer&language_id=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Term with Groups
```bash
curl -X GET http://localhost:3000/api/terms/terms/123 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Important Notes

### Term Creation
- `value`, `language_id`, and `term_type_id` are required
- `ai_generated` defaults to false
- `ai_validation_status` defaults to 'pending'
- `ai_version` auto-increments on updates

### Term Updates
- Only send fields you want to change
- `ai_version` automatically increments
- `ai_edit_history` can track changes
- Validation status can be updated by humans

### TermGroup Management
- Each group must have exactly one main term
- Terms can belong to multiple groups
- Priority is managed through junction table
- Deleting a term removes it from all groups

### AI Metadata
- All AI fields are optional but useful for tracking
- `ai_validation_status` workflow: pending → needs_review → approved/rejected
- `ai_human_reviewed` and `ai_human_reviewer` for audit trail
- `ai_confidence_score` and `ai_quality_score` for quality assessment

### Search and Discovery
- Search is case-insensitive
- Supports partial matching
- Can filter by language and term type
- Autocomplete requires minimum 2 characters
- Suggestions based on existing terms

### Permissions
- `term:create` - Create terms and groups
- `term:read` - Read terms, search, suggestions
- `term:update` - Update terms and groups
- `term:delete` - Delete terms and groups
- `term:list` - List all terms

### Error Handling
- 400: Invalid request data
- 401: Unauthorized
- 403: Insufficient permissions
- 404: Term/Group not found
- 500: Server error

### Best Practices
1. Always include `language_id` and `term_type_id` for proper categorization
2. Use AI metadata to track generation source and quality
3. Validate terms before creation to avoid duplicates
4. Use bulk operations for multiple updates
5. Monitor usage statistics for term popularity
6. Implement human review workflow for AI-generated terms

### Authentication Methods Comparison

**Bearer Token Endpoints (`/api/terms/terms`):**
- Use JWT Bearer tokens with user permissions
- Support individual term creation without group association
- More flexible for user-driven operations
- Require user authentication and specific permissions

**API Token Endpoints (`/api/token/terms`):**
- Use API keys with scope-based permissions
- Require `term_group_id` and `term_group_relation_type` for creation
- Designed for automated/system integrations
- Require `terms:write` scope for all operations
- Support group relation management during term creation/update
