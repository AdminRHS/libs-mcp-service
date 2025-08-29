# AI Metadata Guide

## Purpose
Explains how to attach and manage AI metadata for entities that use term groups (`mainTerm` and `terms`).

## Where to Put AI Metadata
- `mainTerm.aiMetadata`: AI metadata for the primary term
- `terms[i].aiMetadata`: AI metadata for each additional term (similar, translation, etc.)

## Required Fields
When `ai_generated = true`, include at least:
- `ai_model` (e.g., gpt-4o-mini)
- `ai_generation_date` (ISO datetime)

Recommended fields: `ai_prompt_version`, `ai_tokens_used`, `ai_quality_score`, `ai_validation_status`, `ai_source_data`, `ai_metadata`, `ai_confidence_score`, `ai_human_reviewed`, `ai_human_reviewer`, `ai_review_date`, `ai_version`, `ai_batch_id`.

## Update WARNING (Critical)
On ANY update to entities with terms, you MUST send the FULL `terms` array (including unchanged terms) to avoid unintended deletions.

## Examples
### Create Industry with AI Metadata
```json
{
  "mainTerm": {
    "value": "Generative AI",
    "description": "Industry focused on generative models and applications",
    "language_id": 57,
    "term_type_id": 1,
    "aiMetadata": {
      "ai_generated": true,
      "ai_model": "gpt-4o-mini",
      "ai_prompt_version": "v1.0",
      "ai_generation_date": "2025-08-29T09:00:00.000Z"
    }
  },
  "terms": [
    {
      "value": "GenAI",
      "language_id": 57,
      "term_type_id": 2,
      "aiMetadata": {
        "ai_generated": true,
        "ai_model": "gpt-4o-mini",
        "ai_generation_date": "2025-08-29T09:00:00.000Z"
      }
    }
  ]
}
```

### Update Industry (Send FULL terms array)
```json
{
  "industryId": "3",
  "mainTerm": {
    "value": "Generative AI",
    "description": "Updated description",
    "language_id": 57,
    "term_type_id": 1,
    "aiMetadata": {
      "ai_generated": true,
      "ai_model": "gpt-4o-mini",
      "ai_generation_date": "2025-08-29T10:00:00.000Z",
      "ai_version": 2
    }
  },
  "terms": [
    { "id": 1261, "value": "Generative AI", "language_id": 57, "term_type_id": 1 },
    { "id": 1262, "value": "GenAI", "language_id": 57, "term_type_id": 2 }
  ]
}
```

## Cross-Entity Synchronization
For Responsibilities, keep action/object terms synchronized using the provided workflow tools.

## References
- See `README.md` (Available Tools, API Endpoints)
- See `PROJECT_OVERVIEW.md` (Testing & Quality Assurance)
