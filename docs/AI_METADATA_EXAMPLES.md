# AI Metadata Examples

## Когда заполнять AI metadata поля

**ВСЕГДА заполняйте AI metadata поля когда:**
- Создаете новую сущность с помощью AI
- Обновляете существующую сущность с помощью AI
- Создаете новые термины с помощью AI
- Обновляете существующие термины с помощью AI

## Обязательные поля для AI-generated контента

```json
{
  "aiMetadata": {
    "ai_generated": true,
    "ai_model": "gpt-4o-mini",
    "ai_generation_date": "2025-01-27T10:30:00.000Z"
  }
}
```

## Полный пример AI metadata

```json
{
  "aiMetadata": {
    "ai_generated": true,
    "ai_model": "gpt-4o-mini",
    "ai_prompt_version": "v1.0",
    "ai_generation_date": "2025-01-27T10:30:00.000Z",
    "ai_tokens_used": 150,
    "ai_quality_score": 9.5,
    "ai_validation_status": "pending",
    "ai_source_data": {
      "origin": "ai_generation",
      "entity_type": "department",
      "prompt_type": "create_department"
    },
    "ai_metadata": {
      "purpose": "create_new_department",
      "category": "hr_management"
    },
    "ai_confidence_score": 9.2,
    "ai_human_reviewed": false,
    "ai_version": 1,
    "ai_batch_id": "batch-001"
  }
}
```

## Примеры использования

### Создание департамента с AI metadata

```json
{
  "resource": "departments",
  "payload": {
    "mainTerm": {
      "value": "AI Research Department",
      "description": "Department focused on AI research and development",
      "language_id": 57,
      "term_type_id": 1,
      "aiMetadata": {
        "ai_generated": true,
        "ai_model": "gpt-4o-mini",
        "ai_generation_date": "2025-01-27T10:30:00.000Z",
        "ai_prompt_version": "v1.0",
        "ai_tokens_used": 120,
        "ai_quality_score": 9.3
      }
    },
    "terms": [
      {
        "value": "AI Research",
        "language_id": 57,
        "term_type_id": 2,
        "aiMetadata": {
          "ai_generated": true,
          "ai_model": "gpt-4o-mini",
          "ai_generation_date": "2025-01-27T10:30:00.000Z"
        }
      }
    ]
  }
}
```

### Обновление профессии с AI metadata

```json
{
  "resource": "professions",
  "id": "123",
  "payload": {
    "mainTerm": {
      "value": "Senior AI Engineer",
      "description": "Senior engineer specializing in AI systems",
      "language_id": 57,
      "term_type_id": 1,
      "aiMetadata": {
        "ai_generated": true,
        "ai_model": "gpt-4o-mini",
        "ai_generation_date": "2025-01-27T10:35:00.000Z",
        "ai_prompt_version": "v1.1",
        "ai_tokens_used": 180,
        "ai_quality_score": 9.7,
        "ai_validation_status": "approved"
      }
    }
  }
}
```

## Важные правила

1. **ВСЕГДА** устанавливайте `ai_generated: true` для AI-сгенерированного контента
2. **ВСЕГДА** указывайте `ai_model` (например, "gpt-4o-mini")
3. **ВСЕГДА** указывайте `ai_generation_date` с текущим временем
4. **Рекомендуется** указывать `ai_prompt_version` для отслеживания версий промптов
5. **Рекомендуется** указывать `ai_tokens_used` для мониторинга использования токенов
6. **Рекомендуется** указывать `ai_quality_score` для оценки качества

## Проверка AI metadata

После создания/обновления сущности проверьте, что AI metadata поля сохранились:

```json
{
  "id": 123,
  "mainTerm": {
    "value": "AI Research Department",
    "aiMetadata": {
      "ai_generated": true,
      "ai_model": "gpt-4o-mini",
      "ai_generation_date": "2025-01-27T10:30:00.000Z"
    }
  }
}
```

Если AI metadata поля не сохранились, проверьте:
1. Правильно ли указаны обязательные поля
2. Корректно ли указан формат даты (ISO 8601)
3. Соответствует ли структура схеме
