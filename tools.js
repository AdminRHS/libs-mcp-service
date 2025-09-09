// Tool definitions for all entities
// Shared AI fields applicable to any Term (Main Term and additional Terms)
const aiTermProps = {
  ai_generated: { type: 'boolean', description: 'Whether the term content was AI-generated (defaults to false on create in API)' },
  ai_model: { type: 'string', description: 'AI model identifier (e.g., gpt-4o-mini, gpt-4o). Required if ai_generated=true' },
  ai_prompt_version: { type: 'string', description: 'Prompt version used for generation (e.g., v1.0, v2.0)' },
  ai_generation_date: { type: 'string', description: 'Generation timestamp (ISO 8601)', format: 'date-time' },
  ai_tokens_used: { type: 'integer', description: 'Total tokens consumed during generation', minimum: 0 },
  ai_quality_score: { type: 'number', description: 'Quality score between 0.00 and 9.99', minimum: 0, maximum: 9.99 },
  ai_validation_status: { type: 'string', description: 'Validation status (defaults to pending on create in API)', enum: ['pending', 'approved', 'rejected', 'needs_review'] },
  ai_source_data: { type: 'object', description: 'Original source data (JSON), e.g. {"origin":"import","entity_type":"city"}' },
  ai_metadata: { type: 'object', description: 'Additional metadata (JSON), e.g. {"purpose":"generate_name"}' },
  ai_confidence_score: { type: 'number', description: 'Confidence score between 0.00 and 9.99', minimum: 0, maximum: 9.99 },
  ai_human_reviewed: { type: 'boolean', description: 'Whether the term was human reviewed' },
  ai_human_reviewer: { type: 'string', description: 'Human reviewer user ID (e.g., test-user)' },
  ai_review_date: { type: 'string', description: 'Human review timestamp (ISO 8601)', format: 'date-time' },
  ai_version: { type: 'integer', description: 'AI content version (auto-increments on update)' },
  ai_batch_id: { type: 'string', description: 'Batch identifier for AI generation (e.g., batch-001)' },
  ai_edit_history: { type: 'object', description: 'AI edit history (JSON)' },
  ai_original_data: { type: 'object', description: 'Original data snapshot (JSON)' },
  ai_manual_overrides: { type: 'object', description: 'Manual overrides (JSON)' },
  ai_market_validated: { type: 'boolean', description: 'Market validation flag' },
  ai_validation_errors: { type: 'object', description: 'Validation errors (JSON)' }
};

// If aiMetadata.ai_generated is true, require ai_model inside aiMetadata
const aiTermConditional = [
  {
    if: {
      properties: {
        aiMetadata: {
          properties: { ai_generated: { const: true } }
        }
      }
    },
    then: {
      properties: {
        aiMetadata: { required: ['ai_generated', 'ai_model'] }
      }
    }
  }
];

// Reusable term schema builders to reduce duplication
const REQUIRED_AI_FIELDS = ['ai_generated', 'ai_model', 'ai_generation_date'];

const baseMainTermProps = {
  value: { type: 'string' },
  description: { type: 'string', description: 'Term description (optional)' },
  language_id: { type: 'number', description: 'Language ID - REQUIRED. Use get_languages to find language ID. English is recommended as primary language' },
  term_type_id: { type: 'number', description: 'Term type ID - REQUIRED. Use get_term_types to find term type ID. "main" is recommended as primary term type' },
  status_id: { type: 'number', description: 'Status ID - optional. Use get_statuses to find status ID' },
  aiMetadata: { type: 'object', properties: { ...aiTermProps }, required: [...REQUIRED_AI_FIELDS] }
};

const baseTermItemProps = {
  value: { type: 'string' },
  description: { type: 'string', description: 'Term description (optional)' },
  language_id: { type: 'number', description: 'Language ID - REQUIRED' },
  term_type_id: { type: 'number', description: 'Term type ID - REQUIRED' },
  status_id: { type: 'number', description: 'Status ID (optional)' },
  aiMetadata: { type: 'object', properties: { ...aiTermProps }, required: [...REQUIRED_AI_FIELDS] }
};

function buildMainTermSchema(overrides = {}) {
  return {
    type: 'object',
    description: overrides.description || 'Main term (REQUIRED)',
    properties: {
      ...baseMainTermProps,
      value: { type: 'string', description: overrides.valueDescription || 'Term value - REQUIRED' },
    },
    allOf: aiTermConditional,
    required: ['value', 'language_id', 'term_type_id', 'aiMetadata']
  };
}

function buildTermItemSchema({ withId = false, overrides = {} } = {}) {
  const props = { ...baseTermItemProps };
  props.value = { type: 'string', description: overrides.valueDescription || 'Term value - REQUIRED' };
  if (withId) {
    props.id = { type: 'number', description: overrides.idDescription || 'Existing term ID (include to update a specific term)' };
  }
  return {
    type: 'object',
    properties: props,
    allOf: aiTermConditional,
    required: ['value', 'language_id', 'term_type_id', 'aiMetadata']
  };
}

// Resource-specific payload schemas for unified tools
const createPayloadSchemas = {
  departments: {
    type: 'object',
    properties: {
      mainTerm: buildMainTermSchema({ description: 'Main term for the department (REQUIRED)', valueDescription: 'Term value (department name) - REQUIRED' }),
      terms: { type: 'array', items: buildTermItemSchema({ withId: false }) },
      color: { type: 'string' },
    },
    required: ['mainTerm']
  },
  professions: {
    type: 'object',
    properties: {
      mainTerm: buildMainTermSchema({ description: 'Main term for the profession (REQUIRED)', valueDescription: 'Term value (profession name) - REQUIRED' }),
      terms: { type: 'array', items: buildTermItemSchema({ withId: false }) },
      department_id: { type: 'number' },
      tool_ids: { type: 'array', items: { type: 'number' } },
    },
    required: ['mainTerm']
  },
  languages: {
    type: 'object',
    properties: {
      mainTerm: buildMainTermSchema({ description: 'Main term for the language (REQUIRED)', valueDescription: 'Term value (language name) - REQUIRED' }),
      terms: { type: 'array', items: buildTermItemSchema({ withId: false }) },
      iso2: { type: 'string' },
      iso3: { type: 'string' },
    },
    required: ['mainTerm', 'iso2', 'iso3']
  },
  industries: {
    type: 'object',
    properties: {
      mainTerm: buildMainTermSchema({ description: 'Main term for the industry (REQUIRED)', valueDescription: 'Term value (industry name) - REQUIRED' }),
      terms: { type: 'array', items: buildTermItemSchema({ withId: false }) },
      subIndustryIds: { type: 'array', items: { type: 'number' } },
    },
    required: ['mainTerm']
  },
  'sub-industries': {
    type: 'object',
    properties: {
      industry_id: { type: 'number' },
      mainTerm: buildMainTermSchema({ description: 'Main term for the sub-industry (REQUIRED)', valueDescription: 'Term value (sub-industry name) - REQUIRED' }),
      terms: { type: 'array', items: buildTermItemSchema({ withId: false }) },
    },
    required: ['mainTerm']
  },
  'tool-types': {
    type: 'object',
    properties: {
      name: { type: 'string' },
    },
    required: ['name']
  },
  countries: {
    type: 'object',
    properties: {
      mainTerm: buildMainTermSchema({ description: 'Main term for the country (REQUIRED)', valueDescription: 'Term value (country name) - REQUIRED' }),
      terms: { type: 'array', items: buildTermItemSchema({ withId: false }) },
      iso2: { type: 'string' },
      iso3: { type: 'string' },
      latitude: { type: 'string' },
      longitude: { type: 'string' },
      cityIds: { type: 'array', items: { type: 'number' } },
    },
    required: ['mainTerm', 'iso2', 'iso3']
  },
  cities: {
    type: 'object',
    properties: {
      mainTerm: buildMainTermSchema({ description: 'Main term for the city (REQUIRED)', valueDescription: 'Term value (city name) - REQUIRED' }),
      terms: { type: 'array', items: buildTermItemSchema({ withId: false }) },
      country_id: { type: 'number' },
      latitude: { type: 'string' },
      longitude: { type: 'string' },
    },
    required: ['mainTerm']
  },
  actions: {
    type: 'object',
    properties: {
      mainTerm: buildMainTermSchema({ description: 'Main term for the action (REQUIRED)', valueDescription: 'Term value (action name) - REQUIRED' }),
      terms: { type: 'array', items: buildTermItemSchema({ withId: false }) },
    },
    required: ['mainTerm']
  },
  objects: {
    type: 'object',
    properties: {
      mainTerm: buildMainTermSchema({ description: 'Main term for the object (REQUIRED)', valueDescription: 'Term value (object name) - REQUIRED' }),
      terms: { type: 'array', items: buildTermItemSchema({ withId: false }) },
      format_ids: { type: 'array', items: { type: 'number' } },
    },
    required: ['mainTerm']
  },
  responsibilities: {
    type: 'object',
    properties: {
      action_id: { type: 'number' },
      object_id: { type: 'number' },
      mainTerm: buildMainTermSchema({ description: 'Main term for the responsibility (REQUIRED)', valueDescription: 'Term value (responsibility name) - REQUIRED' }),
      terms: { type: 'array', items: buildTermItemSchema({ withId: false }) },
    },
    required: ['action_id', 'object_id', 'mainTerm']
  },
  formats: {
    type: 'object',
    properties: {
      name: { type: 'string' },
    },
    required: ['name']
  },
  statuses: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      color: { type: 'string' },
    },
    required: ['name']
  },
  tools: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      link: { type: 'string' },
      description: { type: 'string' },
      toolTypeIds: { type: 'array', items: { type: 'number' } },
    },
    required: ['name']
  },
  shifts: {
    type: 'object',
    properties: {
      name: { type: 'string', description: 'Shift name - REQUIRED' },
      start_time: { type: 'string', description: 'Start time in HH:MM:SS format - REQUIRED' },
      end_time: { type: 'string', description: 'End time in HH:MM:SS format - REQUIRED' },
    },
    required: ['name', 'start_time', 'end_time']
  },
  currencies: {
    type: 'object',
    properties: {
      name: { type: 'string', description: 'Currency name - REQUIRED' },
      iso3: { type: 'string', description: 'ISO 3-letter currency code - REQUIRED' },
      symbol: { type: 'string', description: 'Currency symbol - REQUIRED' },
    },
    required: ['name', 'iso3', 'symbol']
  },
  rates: {
    type: 'object',
    properties: {
      name: { type: 'string', description: 'Rate name - REQUIRED' },
      value: { type: 'number', description: 'Rate value (decimal) - REQUIRED' },
      hours: { type: 'number', description: 'Number of hours - REQUIRED' },
    },
    required: ['name', 'value', 'hours']
  },
  levels: {
    type: 'object',
    properties: {
      mainTerm: buildMainTermSchema({ description: 'Main term for the level (REQUIRED)', valueDescription: 'Term value (level name) - REQUIRED' }),
      terms: { type: 'array', items: buildTermItemSchema({ withId: false }) },
      short_name: { type: 'string', description: 'Short name identifier - REQUIRED' },
    },
    required: ['mainTerm', 'short_name']
  },
};

const updatePayloadSchemas = {
  departments: {
    type: 'object',
    properties: {
      mainTerm: buildMainTermSchema({ description: 'Main term for the department (REQUIRED)', valueDescription: 'Term value (department name) - REQUIRED' }),
      terms: { type: 'array', items: buildTermItemSchema({ withId: true }) },
      color: { type: 'string' },
    },
    required: ['mainTerm', 'terms']
  },
  professions: {
    type: 'object',
    properties: {
      mainTerm: buildMainTermSchema({ description: 'Main term for the profession (REQUIRED)', valueDescription: 'Term value (profession name) - REQUIRED' }),
      terms: { type: 'array', items: buildTermItemSchema({ withId: true }) },
      department_id: { type: 'number' },
      tool_ids: { type: 'array', items: { type: 'number' } },
    },
    required: ['mainTerm', 'terms']
  },
  languages: {
    type: 'object',
    properties: {
      mainTerm: buildMainTermSchema({ description: 'Main term for the language (REQUIRED)', valueDescription: 'Term value (language name) - REQUIRED' }),
      terms: { type: 'array', items: buildTermItemSchema({ withId: true }) },
      iso2: { type: 'string' },
      iso3: { type: 'string' },
    },
    required: ['mainTerm', 'terms', 'iso2', 'iso3']
  },
  industries: {
    type: 'object',
    properties: {
      mainTerm: buildMainTermSchema({ description: 'Main term for the industry (REQUIRED)', valueDescription: 'Term value (industry name) - REQUIRED' }),
      terms: { type: 'array', items: buildTermItemSchema({ withId: true }) },
      subIndustryIds: { type: 'array', items: { type: 'number' } },
    },
    required: ['mainTerm', 'terms']
  },
  'sub-industries': {
    type: 'object',
    properties: {
      industry_id: { type: 'number' },
      mainTerm: buildMainTermSchema({ description: 'Main term for the sub-industry (REQUIRED)', valueDescription: 'Term value (sub-industry name) - REQUIRED' }),
      terms: { type: 'array', items: buildTermItemSchema({ withId: true }) },
    },
    required: ['mainTerm', 'terms']
  },
  'tool-types': {
    type: 'object',
    properties: {
      name: { type: 'string' },
    },
    required: ['name']
  },
  countries: {
    type: 'object',
    properties: {
      mainTerm: buildMainTermSchema({ description: 'Main term for the country (REQUIRED)', valueDescription: 'Term value (country name) - REQUIRED' }),
      terms: { type: 'array', items: buildTermItemSchema({ withId: true }) },
      iso2: { type: 'string' },
      iso3: { type: 'string' },
      latitude: { type: 'string' },
      longitude: { type: 'string' },
      cityIds: { type: 'array', items: { type: 'number' } },
    },
    required: ['mainTerm', 'terms', 'iso2', 'iso3']
  },
  cities: {
    type: 'object',
    properties: {
      mainTerm: buildMainTermSchema({ description: 'Main term for the city (REQUIRED)', valueDescription: 'Term value (city name) - REQUIRED' }),
      terms: { type: 'array', items: buildTermItemSchema({ withId: true }) },
      country_id: { type: 'number' },
      latitude: { type: 'string' },
      longitude: { type: 'string' },
    },
    required: ['mainTerm', 'terms']
  },
  actions: {
    type: 'object',
    properties: {
      mainTerm: buildMainTermSchema({ description: 'Main term for the action (REQUIRED)', valueDescription: 'Term value (action name) - REQUIRED' }),
      terms: { type: 'array', items: buildTermItemSchema({ withId: true }) },
    },
    required: ['mainTerm', 'terms']
  },
  objects: {
    type: 'object',
    properties: {
      mainTerm: buildMainTermSchema({ description: 'Main term for the object (REQUIRED)', valueDescription: 'Term value (object name) - REQUIRED' }),
      terms: { type: 'array', items: buildTermItemSchema({ withId: true }) },
      format_ids: { type: 'array', items: { type: 'number' } },
    },
    required: ['mainTerm', 'terms']
  },
  responsibilities: {
    type: 'object',
    properties: {
      action_id: { type: 'number' },
      object_id: { type: 'number' },
      mainTerm: buildMainTermSchema({ description: 'Main term for the responsibility (REQUIRED)', valueDescription: 'Term value (responsibility name) - REQUIRED' }),
      terms: { type: 'array', items: buildTermItemSchema({ withId: true }) },
    },
    required: ['action_id', 'object_id', 'mainTerm', 'terms']
  },
  formats: {
    type: 'object',
    properties: {
      name: { type: 'string' },
    },
    required: ['name']
  },
  statuses: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      color: { type: 'string' },
    },
    required: ['name']
  },
  tools: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      link: { type: 'string' },
      description: { type: 'string' },
      toolTypeIds: { type: 'array', items: { type: 'number' } },
    },
    required: ['name']
  },
  shifts: {
    type: 'object',
    properties: {
      name: { type: 'string', description: 'Shift name - REQUIRED' },
      start_time: { type: 'string', description: 'Start time in HH:MM:SS format - REQUIRED' },
      end_time: { type: 'string', description: 'End time in HH:MM:SS format - REQUIRED' },
    },
    required: ['name', 'start_time', 'end_time']
  },
  currencies: {
    type: 'object',
    properties: {
      name: { type: 'string', description: 'Currency name - REQUIRED' },
      iso3: { type: 'string', description: 'ISO 3-letter currency code - REQUIRED' },
      symbol: { type: 'string', description: 'Currency symbol - REQUIRED' },
    },
    required: ['name', 'iso3', 'symbol']
  },
  rates: {
    type: 'object',
    properties: {
      name: { type: 'string', description: 'Rate name - REQUIRED' },
      value: { type: 'number', description: 'Rate value (decimal) - REQUIRED' },
      hours: { type: 'number', description: 'Number of hours - REQUIRED' },
    },
    required: ['name', 'value', 'hours']
  },
  levels: {
    type: 'object',
    properties: {
      mainTerm: buildMainTermSchema({ description: 'Main term for the level (REQUIRED)', valueDescription: 'Term value (level name) - REQUIRED' }),
      terms: { type: 'array', items: buildTermItemSchema({ withId: false }) },
      short_name: { type: 'string', description: 'Short name identifier - REQUIRED' },
    },
    required: ['mainTerm', 'short_name']
  },
};

const tools = [
  {
    name: 'list',
    description: 'List entities (supports UA/RU/EN resource names)',
    inputSchema: {
      type: 'object',
      properties: {
        resource: { type: 'string', description: 'Entity name or synonym (e.g., департаменти | отделы | departments)' },
        page: { type: 'number' },
        limit: { type: 'number' },
        search: { type: 'string' },
        all: { type: 'string', enum: ['true','false'] },
        isShort: { type: 'string', enum: ['true','false'] },
      },
      required: ['resource']
    }
  },
  {
    name: 'get',
    description: 'Get single entity by ID (short form in light mode)',
    inputSchema: {
      type: 'object',
      properties: {
        resource: { type: 'string' },
        id: { type: 'string' },
        isShort: { type: 'string', enum: ['true','false'] },
      },
      required: ['resource', 'id']
    }
  },
  {
    name: 'create',
    description: 'Create an entity for the given resource. Payload shape depends on resource (e.g., departments, professions, languages, etc.). For entities with terms, provide mainTerm and optional terms with correct IDs/types. IMPORTANT: When creating AI-generated content, ALWAYS include aiMetadata fields with ai_generated=true, ai_model (e.g., "gpt-4o-mini"), and ai_generation_date. Only attach aiMetadata to the specific term(s) you are creating; terms without aiMetadata will not be touched.',
    inputSchema: {
      type: 'object',
      properties: {
        resource: { type: 'string' },
        payload: { type: 'object' },
      },
      required: ['resource', 'payload'],
      allOf: [
        { if: { properties: { resource: { const: 'departments' } } }, then: { properties: { payload: createPayloadSchemas.departments } } },
        { if: { properties: { resource: { const: 'professions' } } }, then: { properties: { payload: createPayloadSchemas.professions } } },
        { if: { properties: { resource: { const: 'languages' } } }, then: { properties: { payload: createPayloadSchemas.languages } } },
        { if: { properties: { resource: { const: 'industries' } } }, then: { properties: { payload: createPayloadSchemas.industries } } },
        { if: { properties: { resource: { const: 'sub-industries' } } }, then: { properties: { payload: createPayloadSchemas['sub-industries'] } } },
        { if: { properties: { resource: { const: 'tool-types' } } }, then: { properties: { payload: createPayloadSchemas['tool-types'] } } },
        { if: { properties: { resource: { const: 'countries' } } }, then: { properties: { payload: createPayloadSchemas.countries } } },
        { if: { properties: { resource: { const: 'cities' } } }, then: { properties: { payload: createPayloadSchemas.cities } } },
        { if: { properties: { resource: { const: 'actions' } } }, then: { properties: { payload: createPayloadSchemas.actions } } },
        { if: { properties: { resource: { const: 'objects' } } }, then: { properties: { payload: createPayloadSchemas.objects } } },
        { if: { properties: { resource: { const: 'responsibilities' } } }, then: { properties: { payload: createPayloadSchemas.responsibilities } } },
        { if: { properties: { resource: { const: 'formats' } } }, then: { properties: { payload: createPayloadSchemas.formats } } },
        { if: { properties: { resource: { const: 'statuses' } } }, then: { properties: { payload: createPayloadSchemas.statuses } } },
        { if: { properties: { resource: { const: 'tools' } } }, then: { properties: { payload: createPayloadSchemas.tools } } },
        { if: { properties: { resource: { const: 'shifts' } } }, then: { properties: { payload: createPayloadSchemas.shifts } } },
        { if: { properties: { resource: { const: 'currencies' } } }, then: { properties: { payload: createPayloadSchemas.currencies } } },
        { if: { properties: { resource: { const: 'rates' } } }, then: { properties: { payload: createPayloadSchemas.rates } } },
        { if: { properties: { resource: { const: 'levels' } } }, then: { properties: { payload: createPayloadSchemas.levels } } },
      ]
    }
  },
  {
    name: 'update',
    description: 'Update an entity by ID for the given resource. Payload shape depends on resource. For term-managed entities, send the FULL terms array on update to avoid deletions (include unchanged terms with their IDs). IMPORTANT: Include aiMetadata ONLY for the term(s) you want to update; other terms without aiMetadata in the payload will keep their existing AI metadata. Recommended fields when updating AI-generated content: ai_generated=true, ai_model (e.g., "gpt-4o-mini"), ai_generation_date.',
    inputSchema: {
      type: 'object',
      properties: {
        resource: { type: 'string' },
        id: { type: 'string' },
        payload: { type: 'object' },
      },
      required: ['resource', 'id', 'payload']
      ,
      allOf: [
        { if: { properties: { resource: { const: 'departments' } } }, then: { properties: { payload: updatePayloadSchemas.departments } } },
        { if: { properties: { resource: { const: 'professions' } } }, then: { properties: { payload: updatePayloadSchemas.professions } } },
        { if: { properties: { resource: { const: 'languages' } } }, then: { properties: { payload: updatePayloadSchemas.languages } } },
        { if: { properties: { resource: { const: 'industries' } } }, then: { properties: { payload: updatePayloadSchemas.industries } } },
        { if: { properties: { resource: { const: 'sub-industries' } } }, then: { properties: { payload: updatePayloadSchemas['sub-industries'] } } },
        { if: { properties: { resource: { const: 'tool-types' } } }, then: { properties: { payload: updatePayloadSchemas['tool-types'] } } },
        { if: { properties: { resource: { const: 'countries' } } }, then: { properties: { payload: updatePayloadSchemas.countries } } },
        { if: { properties: { resource: { const: 'cities' } } }, then: { properties: { payload: updatePayloadSchemas.cities } } },
        { if: { properties: { resource: { const: 'actions' } } }, then: { properties: { payload: updatePayloadSchemas.actions } } },
        { if: { properties: { resource: { const: 'objects' } } }, then: { properties: { payload: updatePayloadSchemas.objects } } },
        { if: { properties: { resource: { const: 'responsibilities' } } }, then: { properties: { payload: updatePayloadSchemas.responsibilities } } },
        { if: { properties: { resource: { const: 'formats' } } }, then: { properties: { payload: updatePayloadSchemas.formats } } },
        { if: { properties: { resource: { const: 'statuses' } } }, then: { properties: { payload: updatePayloadSchemas.statuses } } },
        { if: { properties: { resource: { const: 'tools' } } }, then: { properties: { payload: updatePayloadSchemas.tools } } },
        { if: { properties: { resource: { const: 'shifts' } } }, then: { properties: { payload: updatePayloadSchemas.shifts } } },
        { if: { properties: { resource: { const: 'currencies' } } }, then: { properties: { payload: updatePayloadSchemas.currencies } } },
        { if: { properties: { resource: { const: 'rates' } } }, then: { properties: { payload: updatePayloadSchemas.rates } } },
        { if: { properties: { resource: { const: 'levels' } } }, then: { properties: { payload: updatePayloadSchemas.levels } } },
      ]
    }
  },
  // Essential specialized tools that are not covered by unified ones
  {
    name: 'get_term_types',
    description: 'Get all term types',
    inputSchema: {
      type: 'object',
      properties: {
        page: { type: 'number', description: 'Page number (default: 1)' },
        limit: { type: 'number', description: 'Number of term types per page (default: 10)' },
        search: { type: 'string', description: 'Search by term type name or description' }
      }
    }
  },
  {
    name: 'find_existing_responsibility_terms',
    description: 'Find existing Actions and Objects by language to check what terms already exist. Use this BEFORE adding new terms to responsibilities.',
    inputSchema: {
      type: 'object',
      properties: {
        language_id: { type: 'number', description: 'Language ID - REQUIRED. Use get_languages to find language ID.' },
        term_type_id: { type: 'number', description: 'Term type ID - REQUIRED. Use get_term_types to find term type ID.' },
        action_id: { type: 'number', description: 'Action ID - REQUIRED. Use get_actions to find action ID.' },
        object_id: { type: 'number', description: 'Object ID - REQUIRED. Use get_objects to find object ID.' },
        search: { type: 'string', description: 'Search term (optional). Use to filter specific action-object combinations.' }
      },
      required: ['language_id', 'term_type_id', 'action_id', 'object_id']
    }
  },
  {
    name: 'create_term',
    description: 'Create a new individual term using API token authentication. Terms can exist independently and be linked to term groups. IMPORTANT: When creating AI-generated terms, ALWAYS include aiMetadata with ai_generated=true, ai_model (e.g., "gpt-4o-mini"), and ai_generation_date for proper tracking. Only the created term’s AI metadata is affected.',
    inputSchema: {
      type: 'object',
      properties: {
        value: { type: 'string', description: 'Term value - REQUIRED' },
        description: { type: 'string', description: 'Term description (optional)' },
        language_id: { type: 'number', description: 'Language ID - REQUIRED. Use get_languages to find language ID' },
        term_type_id: { type: 'number', description: 'Term type ID - REQUIRED. Use get_term_types to find term type ID' },
        status_id: { type: 'number', description: 'Status ID (optional). Use get_statuses to find status ID' },
        term_group_id: { type: 'number', description: 'Term group ID (optional). If provided, term will be linked to this group' },
        aiMetadata: { type: 'object', description: 'AI metadata for tracking AI-generated content (optional)', properties: { ...aiTermProps } }
      },
      allOf: aiTermConditional,
      required: ['value', 'language_id', 'term_type_id', 'term_group_id']
    }
  },
  {
    name: 'update_term',
    description: 'Update an existing individual term using API token authentication. IMPORTANT: Send aiMetadata only when you intend to change AI fields for this term; omitting aiMetadata leaves existing AI fields unchanged. Recommended: include ai_generated=true, ai_model, ai_generation_date. Supports version tracking and term group relation management.',
    inputSchema: {
      type: 'object',
      properties: {
        termId: { type: 'string', description: 'Term ID (REQUIRED)' },
        value: { type: 'string', description: 'Term value (optional)' },
        description: { type: 'string', description: 'Term description (optional)' },
        language_id: { type: 'number', description: 'Language ID (optional). Use get_languages to find language ID' },
        term_type_id: { type: 'number', description: 'Term type ID (optional). Use get_term_types to find term type ID' },
        status_id: { type: 'number', description: 'Status ID (optional). Use get_statuses to find status ID' },
        term_group_id: { type: 'number', description: 'Term group ID (optional). For creating/updating group relation' },
        aiMetadata: { type: 'object', description: 'AI metadata updates (optional)', properties: { ...aiTermProps } }
      },
      allOf: aiTermConditional,
      required: ['termId', 'term_group_id']
    }
  },
];

export { tools };
