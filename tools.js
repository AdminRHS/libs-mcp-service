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
const baseMainTermProps = {
  value: { type: 'string' },
  description: { type: 'string', description: 'Term description (optional)' },
  language_id: { type: 'number', description: 'Language ID - REQUIRED. Use get_languages to find language ID. English is recommended as primary language' },
  term_type_id: { type: 'number', description: 'Term type ID - REQUIRED. Use get_term_types to find term type ID. "main" is recommended as primary term type' },
  status_id: { type: 'number', description: 'Status ID - optional. Use get_statuses to find status ID' },
  aiMetadata: { type: 'object', properties: { ...aiTermProps } }
};

const baseTermItemProps = {
  value: { type: 'string' },
  description: { type: 'string', description: 'Term description (optional)' },
  language_id: { type: 'number', description: 'Language ID - REQUIRED' },
  term_type_id: { type: 'number', description: 'Term type ID - REQUIRED' },
  status_id: { type: 'number', description: 'Status ID (optional)' },
  aiMetadata: { type: 'object', properties: { ...aiTermProps } }
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
    required: ['value', 'language_id', 'term_type_id']
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
    required: ['value', 'language_id', 'term_type_id']
  };
}

const tools = [
  // Department tools
  {
    name: 'get_departments',
    description: 'Get all departments',
    inputSchema: {
      type: 'object',
      properties: {
        page: { type: 'number', description: 'Page number (default: 1)' },
        limit: { type: 'number', description: 'Number of departments per page (default: 10)' },
        search: { type: 'string', description: 'Search by department name or description' }
      }
    }
  },
  {
    name: 'get_department',
    description: 'Get a specific department by ID',
    inputSchema: {
      type: 'object',
      properties: {
        departmentId: { type: 'string', description: 'Department ID' }
      },
      required: ['departmentId']
    }
  },
  {
    name: 'create_department',
    description: 'Create a new department. Terms support AI metadata (set ai_generated=true and provide ai_model when generated by AI).',
    inputSchema: {
      type: 'object',
      properties: {
        mainTerm: buildMainTermSchema({ description: 'Main term for the department (REQUIRED)', valueDescription: 'Term value (department name) - REQUIRED' }),
        terms: { type: 'array', description: 'Additional terms for the department (optional)', items: buildTermItemSchema({ withId: false, overrides: { valueDescription: 'Term value - REQUIRED' } }) },
        color: { type: 'string', description: 'Department color (optional, default: "#1976d2")' },
      },
      required: ['mainTerm']
    }
  },
  {
    name: 'update_department',
    description: 'Update an existing department. WARNING: On any update (even color or other non-term fields), you MUST send the FULL terms array to avoid deletions. Terms support AI metadata (set ai_generated=true and provide ai_model when updated by AI).',
    inputSchema: {
      type: 'object',
      properties: {
        departmentId: { type: 'string', description: 'Department ID (REQUIRED)' },
        mainTerm: buildMainTermSchema({ description: 'Main term for the department (REQUIRED)', valueDescription: 'Term value (department name) - REQUIRED' }),
        terms: { type: 'array', description: 'Additional terms for the department (optional). MANDATORY on update: send the FULL terms array including all existing terms with id and required fields (value, language_id, term_type_id) to avoid unintended deletions. Only the targeted term(s) need updated fields; others must be sent unchanged.', items: buildTermItemSchema({ withId: true, overrides: { valueDescription: 'Term value - REQUIRED' } }) },
        color: { type: 'string', description: 'Department color (optional)' },
      },
      required: ['departmentId', 'mainTerm', 'terms']
    }
  },

  // Industry tools
  {
    name: 'get_industries',
    description: 'Get all industries',
    inputSchema: {
      type: 'object',
      properties: {
        page: { type: 'number', description: 'Page number (default: 1)' },
        limit: { type: 'number', description: 'Number of industries per page (default: 10)' },
        search: { type: 'string', description: 'Search by industry name or description' }
      }
    }
  },
  {
    name: 'get_industry',
    description: 'Get a specific industry by ID',
    inputSchema: {
      type: 'object',
      properties: {
        industryId: { type: 'string', description: 'Industry ID' }
      },
      required: ['industryId']
    }
  },
  {
    name: 'create_industry',
    description: 'Create a new industry. Terms support AI metadata (set ai_generated=true and provide ai_model when generated by AI).',
    inputSchema: {
      type: 'object',
      properties: {
        mainTerm: buildMainTermSchema({ description: 'Main term for the industry (REQUIRED)', valueDescription: 'Term value (industry name) - REQUIRED' }),
        terms: { type: 'array', description: 'Additional terms for the industry (optional)', items: buildTermItemSchema({ withId: false, overrides: { valueDescription: 'Term value - REQUIRED' } }) },
        description: { type: 'string', description: 'Industry description (stored in TermGroup.description)' },
        icon: { type: 'string', description: 'Optional icon URL/path stored in TermGroup.icon' },
        subIndustryIds: { type: 'array', description: 'Optional: link existing sub-industries to this industry', items: { type: 'number' } }
      },
      required: ['mainTerm']
    }
  },
  {
    name: 'update_industry',
    description: 'Update an existing industry. WARNING: On any update (even non-term fields), you MUST send the FULL terms array to avoid deletions. Terms support AI metadata (set ai_generated=true and provide ai_model when updated by AI).',
    inputSchema: {
      type: 'object',
      properties: {
        industryId: { type: 'string', description: 'Industry ID (REQUIRED)' },
        mainTerm: buildMainTermSchema({ description: 'Main term for the industry (REQUIRED)', valueDescription: 'Term value (industry name) - REQUIRED' }),
        terms: { type: 'array', description: 'Additional terms for the industry (optional). MANDATORY on update: send the FULL terms array including all existing terms with id and required fields (value, language_id, term_type_id) to avoid unintended deletions. Only the targeted term(s) need updated fields; others must be sent unchanged.', items: buildTermItemSchema({ withId: true, overrides: { valueDescription: 'Term value - REQUIRED' } }) },
        description: { type: 'string', description: 'Industry description (stored in TermGroup.description)' },
        icon: { type: 'string', description: 'Optional icon URL/path stored in TermGroup.icon' },
        subIndustryIds: { type: 'array', description: 'Optional: link existing sub-industries to this industry', items: { type: 'number' } }
      },
      required: ['industryId', 'mainTerm', 'terms']
    }
  },

  // Sub-Industry tools
  {
    name: 'get_sub_industries',
    description: 'Get all sub-industries',
    inputSchema: {
      type: 'object',
      properties: {
        page: { type: 'number', description: 'Page number (default: 1)' },
        limit: { type: 'number', description: 'Number of sub-industries per page (default: 10)' },
        search: { type: 'string', description: 'Search by sub-industry name or description' },
        industry_id: { type: 'number', description: 'Filter by parent Industry ID (optional)' }
      }
    }
  },
  {
    name: 'get_sub_industry',
    description: 'Get a specific sub-industry by ID',
    inputSchema: {
      type: 'object',
      properties: {
        subIndustryId: { type: 'string', description: 'Sub-Industry ID' }
      },
      required: ['subIndustryId']
    }
  },
  {
    name: 'create_sub_industry',
    description: 'Create a new sub-industry. Terms support AI metadata (set ai_generated=true and provide ai_model when generated by AI).',
    inputSchema: {
      type: 'object',
      properties: {
        industry_id: { type: 'number', description: 'Parent Industry ID (optional)' },
        mainTerm: buildMainTermSchema({ description: 'Main term for the sub-industry (REQUIRED)', valueDescription: 'Term value (sub-industry name) - REQUIRED' }),
        terms: { type: 'array', description: 'Additional terms for the sub-industry (optional)', items: buildTermItemSchema({ withId: false, overrides: { valueDescription: 'Term value - REQUIRED' } }) },
        description: { type: 'string', description: 'Sub-Industry description (stored in TermGroup.description)' }
      },
      required: ['mainTerm']
    }
  },
  {
    name: 'update_sub_industry',
    description: 'Update an existing sub-industry. WARNING: On any update (even non-term fields), you MUST send the FULL terms array to avoid deletions. Terms support AI metadata (set ai_generated=true and provide ai_model when updated by AI).',
    inputSchema: {
      type: 'object',
      properties: {
        subIndustryId: { type: 'string', description: 'Sub-Industry ID (REQUIRED)' },
        industry_id: { type: 'number', description: 'Parent Industry ID (optional)' },
        mainTerm: buildMainTermSchema({ description: 'Main term for the sub-industry (REQUIRED)', valueDescription: 'Term value (sub-industry name) - REQUIRED' }),
        terms: { type: 'array', description: 'Additional terms for the sub-industry (optional). MANDATORY on update: send the FULL terms array including all existing terms with id and required fields (value, language_id, term_type_id) to avoid unintended deletions. Only the targeted term(s) need updated fields; others must be sent unchanged.', items: buildTermItemSchema({ withId: true, overrides: { valueDescription: 'Term value - REQUIRED' } }) },
        description: { type: 'string', description: 'Sub-Industry description (stored in TermGroup.description)' }
      },
      required: ['subIndustryId', 'mainTerm', 'terms']
    }
  },

  // Profession tools
  {
    name: 'get_professions',
    description: 'Get all professions',
    inputSchema: {
      type: 'object',
      properties: {
        page: { type: 'number', description: 'Page number (default: 1)' },
        limit: { type: 'number', description: 'Number of professions per page (default: 10)' },
        search: { type: 'string', description: 'Search by profession name or description' }
      }
    }
  },
  {
    name: 'get_profession',
    description: 'Get a specific profession by ID',
    inputSchema: {
      type: 'object',
      properties: {
        professionId: { type: 'string', description: 'Profession ID' }
      },
      required: ['professionId']
    }
  },
  {
    name: 'create_profession',
    description: 'Create a new profession. Terms support AI metadata (set ai_generated=true and provide ai_model when generated by AI).',
    inputSchema: {
      type: 'object',
      properties: {
        mainTerm: buildMainTermSchema({ description: 'Main term for the profession (REQUIRED)', valueDescription: 'Term value (profession name) - REQUIRED' }),
        terms: { type: 'array', description: 'Additional terms for the profession (optional)', items: buildTermItemSchema({ withId: false, overrides: { valueDescription: 'Term value - REQUIRED' } }) },
        department_id: { type: 'number', description: 'Department ID (optional)' },
        tool_ids: { type: 'array', description: 'Array of tool IDs (optional)', items: { type: 'number' } }
      },
      required: ['mainTerm']
    }
  },
  {
    name: 'update_profession',
    description: 'Update an existing profession. WARNING: On any update (even non-term fields), you MUST send the FULL terms array to avoid deletions. Terms support AI metadata (set ai_generated=true and provide ai_model when updated by AI).',
    inputSchema: {
      type: 'object',
      properties: {
        professionId: { type: 'string', description: 'Profession ID (REQUIRED)' },
        mainTerm: buildMainTermSchema({ description: 'Main term for the profession (REQUIRED)', valueDescription: 'Term value (profession name) - REQUIRED' }),
        terms: { type: 'array', description: 'Additional terms for the profession (optional). MANDATORY on update: send the FULL terms array including all existing terms with id and required fields (value, language_id, term_type_id) to avoid unintended deletions. Only the targeted term(s) need updated fields; others must be sent unchanged.', items: buildTermItemSchema({ withId: true, overrides: { valueDescription: 'Term value - REQUIRED' } }) },
        department_id: { type: 'number', description: 'Department ID (optional)' },
        tool_ids: { type: 'array', description: 'Array of tool IDs (optional)', items: { type: 'number' } }
      },
      required: ['professionId', 'mainTerm', 'terms']
    }
  },

  // Status tools
  {
    name: 'get_statuses',
    description: 'Get all statuses',
    inputSchema: {
      type: 'object',
      properties: {
        page: { type: 'number', description: 'Page number (default: 1)' },
        limit: { type: 'number', description: 'Number of statuses per page (default: 10)' },
        search: { type: 'string', description: 'Search by status name or description' }
      }
    }
  },
  {
    name: 'get_status',
    description: 'Get a specific status by ID',
    inputSchema: {
      type: 'object',
      properties: {
        statusId: { type: 'string', description: 'Status ID' }
      },
      required: ['statusId']
    }
  },
  {
    name: 'create_status',
    description: 'Create a new status',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Status name' },
        color: { type: 'string', description: 'Status color (hex code)' }
      },
      required: ['name', 'color']
    }
  },
  {
    name: 'update_status',
    description: 'Update an existing status',
    inputSchema: {
      type: 'object',
      properties: {
        statusId: { type: 'string', description: 'Status ID' },
        name: { type: 'string', description: 'Status name' },
        color: { type: 'string', description: 'Status color (hex code)' }
      },
      required: ['statusId']
    }
  },

  // Language tools
  {
    name: 'get_languages',
    description: 'Get all languages',
    inputSchema: {
      type: 'object',
      properties: {
        page: { type: 'number', description: 'Page number (default: 1)' },
        limit: { type: 'number', description: 'Number of languages per page (default: 10)' },
        search: { type: 'string', description: 'Search by language name or description' }
      }
    }
  },
  {
    name: 'get_language',
    description: 'Get a specific language by ID',
    inputSchema: {
      type: 'object',
      properties: {
        languageId: { type: 'string', description: 'Language ID' }
      },
      required: ['languageId']
    }
  },
  {
    name: 'create_language',
    description: 'Create a new language. Terms support AI metadata (set ai_generated=true and provide ai_model when generated by AI).',
    inputSchema: {
      type: 'object',
      properties: {
        mainTerm: buildMainTermSchema({ description: 'Main term for the language (REQUIRED)', valueDescription: 'Term value (language name) - REQUIRED' }),
        terms: { type: 'array', description: 'Additional terms for the language (optional)', items: buildTermItemSchema({ withId: false, overrides: { valueDescription: 'Term value - REQUIRED' } }) },
        iso2: { type: 'string', description: 'ISO 2-letter language code (REQUIRED)' },
        iso3: { type: 'string', description: 'ISO 3-letter language code (REQUIRED)' }
      },
      required: ['mainTerm', 'iso2', 'iso3']
    }
  },
  {
    name: 'update_language',
    description: 'Update an existing language. WARNING: On any update (even non-term fields), you MUST send the FULL terms array to avoid deletions. Terms support AI metadata (set ai_generated=true and provide ai_model when updated by AI).',
    inputSchema: {
      type: 'object',
      properties: {
        languageId: { type: 'string', description: 'Language ID (REQUIRED)' },
        mainTerm: buildMainTermSchema({ description: 'Main term for the language (REQUIRED)', valueDescription: 'Term value (language name) - REQUIRED' }),
        terms: { type: 'array', description: 'Additional terms for the language (optional). MANDATORY on update: send the FULL terms array including all existing terms with id and required fields (value, language_id, term_type_id) to avoid unintended deletions. Only the targeted term(s) need updated fields; others must be sent unchanged.', items: buildTermItemSchema({ withId: true, overrides: { valueDescription: 'Term value - REQUIRED' } }) },
        iso2: { type: 'string', description: 'ISO 2-letter language code (REQUIRED)' },
        iso3: { type: 'string', description: 'ISO 3-letter language code (REQUIRED)' }
      },
      required: ['languageId', 'mainTerm', 'iso2', 'iso3', 'terms']
    }
  },

  // Term Type tools
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

  // Tool Type tools
  {
    name: 'get_tool_types',
    description: 'Get all tool types',
    inputSchema: {
      type: 'object',
      properties: {
        page: { type: 'number', description: 'Page number (default: 1)' },
        limit: { type: 'number', description: 'Number of tool types per page (default: 10)' },
        search: { type: 'string', description: 'Search by tool type name or description' }
      }
    }
  },
  {
    name: 'get_tool_type',
    description: 'Get a specific tool type by ID',
    inputSchema: {
      type: 'object',
      properties: {
        toolTypeId: { type: 'string', description: 'Tool Type ID' }
      },
      required: ['toolTypeId']
    }
  },
  {
    name: 'create_tool_type',
    description: 'Create a new tool type',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Tool Type name' }
      },
      required: ['name']
    }
  },
  {
    name: 'update_tool_type',
    description: 'Update an existing tool type',
    inputSchema: {
      type: 'object',
      properties: {
        toolTypeId: { type: 'string', description: 'Tool Type ID' },
        name: { type: 'string', description: 'Tool Type name' }
      },
      required: ['toolTypeId']
    }
  },

  // Tool tools
  {
    name: 'get_tools',
    description: 'Get all tools',
    inputSchema: {
      type: 'object',
      properties: {
        page: { type: 'number', description: 'Page number (default: 1)' },
        limit: { type: 'number', description: 'Number of tools per page (default: 10)' },
        search: { type: 'string', description: 'Search by tool name or description' }
      }
    }
  },
  {
    name: 'get_tool',
    description: 'Get a specific tool by ID',
    inputSchema: {
      type: 'object',
      properties: {
        toolId: { type: 'string', description: 'Tool ID' }
      },
      required: ['toolId']
    }
  },
  {
    name: 'create_tool',
    description: 'Create a new tool',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Tool name' },
        description: { type: 'string', description: 'Tool description' },
        link: { type: 'string', description: 'Tool URL/link (optional)' },
        toolTypeIds: { type: 'array', description: 'Array of tool type IDs (optional)', items: { type: 'number' } }
      },
      required: ['name']
    }
  },
  {
    name: 'update_tool',
    description: 'Update an existing tool',
    inputSchema: {
      type: 'object',
      properties: {
        toolId: { type: 'string', description: 'Tool ID' },
        name: { type: 'string', description: 'Tool name' },
        description: { type: 'string', description: 'Tool description' },
        link: { type: 'string', description: 'Tool URL/link (optional)' },
        toolTypeIds: { type: 'array', description: 'Array of tool type IDs (optional)', items: { type: 'number' } }
      },
      required: ['toolId']
    }
  },

  // Action tools
  {
    name: 'get_actions',
    description: 'Get all actions',
    inputSchema: {
      type: 'object',
      properties: {
        page: { type: 'number', description: 'Page number (default: 1)' },
        limit: { type: 'number', description: 'Number of actions per page (default: 10)' },
        search: { type: 'string', description: 'Search by action name' }
      }
    }
  },
  {
    name: 'get_action',
    description: 'Get a specific action by ID',
    inputSchema: {
      type: 'object',
      properties: {
        actionId: { type: 'string', description: 'Action ID' }
      },
      required: ['actionId']
    }
  },
  {
    name: 'create_action',
    description: 'Create a new action. Terms support AI metadata (set ai_generated=true and provide ai_model when generated by AI).',
    inputSchema: {
      type: 'object',
      properties: {
        mainTerm: buildMainTermSchema({ description: 'Main term for the action (REQUIRED)', valueDescription: 'Term value (action name) - REQUIRED' }),
        terms: { type: 'array', description: 'Additional terms for the action (optional)', items: buildTermItemSchema({ withId: false, overrides: { valueDescription: 'Term value - REQUIRED' } }) }
      },
      required: ['mainTerm']
    }
  },
  {
    name: 'update_action',
    description: 'Update an existing action. WARNING: On any update (even non-term fields), you MUST send the FULL terms array to avoid deletions. Use this tool to add new terms (similar, translations) to actions for responsibility synchronization. When adding responsibility similar terms like "Build Applications", parse it to extract "Build" and add this as similar term to the corresponding action. This maintains consistency between responsibilities and their component actions. Terms support AI metadata (set ai_generated=true and provide ai_model when updated by AI).',
    inputSchema: {
      type: 'object',
      properties: {
        actionId: { type: 'string', description: 'Action ID (REQUIRED)' },
        mainTerm: buildMainTermSchema({ description: 'Main term for the action (REQUIRED)', valueDescription: 'Term value (action name) - REQUIRED' }),
        terms: { type: 'array', description: 'Additional terms for the action (optional). MANDATORY on update: send the FULL terms array including all existing terms with id and required fields (value, language_id, term_type_id) to avoid unintended deletions. Only the targeted term(s) need updated fields; others must be sent unchanged.', items: buildTermItemSchema({ withId: true, overrides: { valueDescription: 'Term value - REQUIRED' } }) }
      },
      required: ['actionId', 'mainTerm', 'terms']
    }
  },

  // Object tools
  {
    name: 'get_objects',
    description: 'Get all objects',
    inputSchema: {
      type: 'object',
      properties: {
        page: { type: 'number', description: 'Page number (default: 1)' },
        limit: { type: 'number', description: 'Number of objects per page (default: 10)' },
        search: { type: 'string', description: 'Search by object name or description' }
      }
    }
  },
  {
    name: 'get_object',
    description: 'Get a specific object by ID',
    inputSchema: {
      type: 'object',
      properties: {
        objectId: { type: 'string', description: 'Object ID' }
      },
      required: ['objectId']
    }
  },
  {
    name: 'create_object',
    description: 'Create a new object. Terms support AI metadata (set ai_generated=true and provide ai_model when generated by AI).',
    inputSchema: {
      type: 'object',
      properties: {
        mainTerm: buildMainTermSchema({ description: 'Main term for the object (REQUIRED)', valueDescription: 'Term value (object name) - REQUIRED' }),
        terms: { type: 'array', description: 'Additional terms for the object (optional)', items: buildTermItemSchema({ withId: false, overrides: { valueDescription: 'Term value - REQUIRED' } }) },
        format_ids: { type: 'array', description: 'Array of format IDs (optional)', items: { type: 'number' } }
      },
      required: ['mainTerm']
    }
  },
  {
    name: 'update_object',
    description: 'Update an existing object. WARNING: On any update (even non-term fields), you MUST send the FULL terms array to avoid deletions. Use this tool to add new terms (similar, translations) to objects for responsibility synchronization. When adding responsibility similar terms like "Build Applications", parse it to extract "Applications" part and add corresponding terms to the object if needed. This maintains consistency between responsibilities and their component objects. Terms support AI metadata (set ai_generated=true and provide ai_model when updated by AI).',
    inputSchema: {
      type: 'object',
      properties: {
        objectId: { type: 'string', description: 'Object ID (REQUIRED)' },
        mainTerm: buildMainTermSchema({ description: 'Main term for the object (REQUIRED)', valueDescription: 'Term value (object name) - REQUIRED' }),
        terms: { type: 'array', description: 'Additional terms for the object (optional). MANDATORY on update: send the FULL terms array including all existing terms with id and required fields (value, language_id, term_type_id) to avoid unintended deletions. Only the targeted term(s) need updated fields; others must be sent unchanged.', items: buildTermItemSchema({ withId: true, overrides: { valueDescription: 'Term value - REQUIRED' } }) },
        format_ids: { type: 'array', description: 'Array of format IDs (optional)', items: { type: 'number' } }
      },
      required: ['objectId', 'mainTerm', 'terms']
    }
  },
  
  // Format tools
  {
    name: 'get_formats',
    description: 'Get all formats',
    inputSchema: {
      type: 'object',
      properties: {
        page: { type: 'number', description: 'Page number (default: 1)' },
        limit: { type: 'number', description: 'Number of formats per page (default: 10)' },
        search: { type: 'string', description: 'Search by format name' }
      }
    }
  },
  {
    name: 'get_format',
    description: 'Get a specific format by ID',
    inputSchema: {
      type: 'object',
      properties: {
        formatId: { type: 'string', description: 'Format ID' }
      },
      required: ['formatId']
    }
  },
  {
    name: 'create_format',
    description: 'Create a new format',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Format name - REQUIRED. Must be unique and between 2-100 characters' }
      },
      required: ['name']
    }
  },
  {
    name: 'update_format',
    description: 'Update an existing format',
    inputSchema: {
      type: 'object',
      properties: {
        formatId: { type: 'string', description: 'Format ID (REQUIRED)' },
        name: { type: 'string', description: 'Format name - REQUIRED. Must be unique and between 2-100 characters' }
      },
      required: ['formatId', 'name']
    }
  },
  
  // Country tools
  {
    name: 'get_countries',
    description: 'Get all countries',
    inputSchema: {
      type: 'object',
      properties: {
        page: { type: 'number', description: 'Page number (default: 1)' },
        limit: { type: 'number', description: 'Number of countries per page (default: 10)' },
        search: { type: 'string', description: 'Search by country name or description' }
      }
    }
  },
  {
    name: 'get_country',
    description: 'Get a specific country by ID',
    inputSchema: {
      type: 'object',
      properties: {
        countryId: { type: 'string', description: 'Country ID' }
      },
      required: ['countryId']
    }
  },
  {
    name: 'create_country',
    description: 'Create a new country. Terms support AI metadata (set ai_generated=true and provide ai_model when generated by AI).',
    inputSchema: {
      type: 'object',
      properties: {
        mainTerm: buildMainTermSchema({ description: 'Main term for the country (REQUIRED)', valueDescription: 'Term value (country name) - REQUIRED' }),
        terms: { type: 'array', description: 'Additional terms for the country (optional)', items: buildTermItemSchema({ withId: false, overrides: { valueDescription: 'Term value - REQUIRED' } }) },
        iso2: { type: 'string', description: 'ISO 2-letter country code (optional)' },
        iso3: { type: 'string', description: 'ISO 3-letter country code (optional)' },
        latitude: { type: 'string', description: 'Country latitude coordinate (optional)' },
        longitude: { type: 'string', description: 'Country longitude coordinate (optional)' }
      },
      required: ['mainTerm']
    }
  },
  {
    name: 'update_country',
    description: 'Update an existing country. WARNING: On any update (even non-term fields), you MUST send the FULL terms array to avoid deletions. Terms support AI metadata (set ai_generated=true and provide ai_model when updated by AI).',
    inputSchema: {
      type: 'object',
      properties: {
        countryId: { type: 'string', description: 'Country ID (REQUIRED)' },
        mainTerm: buildMainTermSchema({ description: 'Main term for the country (REQUIRED)', valueDescription: 'Term value (country name) - REQUIRED' }),
        terms: { type: 'array', description: 'Additional terms for the country (optional). MANDATORY on update: send the FULL terms array including all existing terms with id and required fields (value, language_id, term_type_id) to avoid unintended deletions. Only the targeted term(s) need updated fields; others must be sent unchanged.', items: buildTermItemSchema({ withId: true, overrides: { valueDescription: 'Term value - REQUIRED' } }) },
        iso2: { type: 'string', description: 'ISO 2-letter country code (optional)' },
        iso3: { type: 'string', description: 'ISO 3-letter country code (optional)' },
        latitude: { type: 'string', description: 'Country latitude coordinate (optional)' },
        longitude: { type: 'string', description: 'Country longitude coordinate (optional)' }
      },
      required: ['countryId', 'mainTerm', 'terms']
    }
  },

  // City tools
  {
    name: 'get_cities',
    description: 'Get all cities',
    inputSchema: {
      type: 'object',
      properties: {
        page: { type: 'number', description: 'Page number (default: 1)' },
        limit: { type: 'number', description: 'Number of cities per page (default: 10)' },
        search: { type: 'string', description: 'Search by city name or description' }
      }
    }
  },
  {
    name: 'get_city',
    description: 'Get a specific city by ID',
    inputSchema: {
      type: 'object',
      properties: {
        cityId: { type: 'string', description: 'City ID' }
      },
      required: ['cityId']
    }
  },
  {
    name: 'create_city',
    description: 'Create a new city. Terms support AI metadata (set ai_generated=true and provide ai_model when generated by AI).',
    inputSchema: {
      type: 'object',
      properties: {
        mainTerm: buildMainTermSchema({ description: 'Main term for the city (REQUIRED)', valueDescription: 'Term value (city name) - REQUIRED' }),
        terms: { type: 'array', description: 'Additional terms for the city (optional)', items: buildTermItemSchema({ withId: false, overrides: { valueDescription: 'Term value - REQUIRED' } }) },
        country_id: { type: 'number', description: 'Country ID (optional)' },
        latitude: { type: 'string', description: 'City latitude coordinate (optional)' },
        longitude: { type: 'string', description: 'City longitude coordinate (optional)' }
      },
      required: ['mainTerm']
    }
  },
  {
    name: 'update_city',
    description: 'Update an existing city. WARNING: On any update (even non-term fields), you MUST send the FULL terms array to avoid deletions. Terms support AI metadata (set ai_generated=true and provide ai_model when updated by AI).',
    inputSchema: {
      type: 'object',
      properties: {
        cityId: { type: 'string', description: 'City ID (REQUIRED)' },
        mainTerm: buildMainTermSchema({ description: 'Main term for the city (REQUIRED)', valueDescription: 'Term value (city name) - REQUIRED' }),
        terms: { type: 'array', description: 'Additional terms for the city (optional). MANDATORY on update: send the FULL terms array including all existing terms with id and required fields (value, language_id, term_type_id) to avoid unintended deletions. Only the targeted term(s) need updated fields; others must be sent unchanged.', items: buildTermItemSchema({ withId: true, overrides: { valueDescription: 'Term value - REQUIRED' } }) },
        country_id: { type: 'number', description: 'Country ID (optional)' },
        latitude: { type: 'string', description: 'City latitude coordinate (optional)' },
        longitude: { type: 'string', description: 'City longitude coordinate (optional)' }
      },
      required: ['cityId', 'mainTerm', 'terms']
    }
  },

  // Responsibility tools
  {
    name: 'get_responsibilities',
    description: 'Get all responsibilities',
    inputSchema: {
      type: 'object',
      properties: {
        page: { type: 'number', description: 'Page number (default: 1)' },
        limit: { type: 'number', description: 'Number of responsibilities per page (default: 10)' },
        search: { type: 'string', description: 'Search by responsibility name or description' },
        language_ids: { type: 'array', description: 'Filter by language IDs (optional)', items: { type: 'number' } },
        action_id: { type: 'number', description: 'Filter by action ID (optional)' },
        object_id: { type: 'number', description: 'Filter by object ID (optional)' },
        filters: { type: 'string', description: 'Additional filters as JSON string (optional)' },
        all: { type: 'string', description: 'If "true", returns all without pagination (optional)' }
      }
    }
  },
  {
    name: 'get_responsibility',
    description: 'Get a specific responsibility by ID',
    inputSchema: {
      type: 'object',
      properties: {
        responsibilityId: { type: 'string', description: 'Responsibility ID' }
      },
      required: ['responsibilityId']
    }
  },
  {
    name: 'create_responsibility',
    description: 'Create a new responsibility. Value should be combination of action and object names. Use find_existing_responsibility_terms to check for existing main terms, similar terms, and translations. When creating similar terms or translations, use find_existing_responsibility_terms to check existing terms, then use update_action and update_object to add corresponding terms to maintain consistency across all entities. Terms support AI metadata (set ai_generated=true and provide ai_model when generated by AI).',
    inputSchema: {
      type: 'object',
      properties: {
        action_id: { type: 'number', description: 'Action ID - REQUIRED. Use get_actions to find action ID' },
        object_id: { type: 'number', description: 'Object ID - REQUIRED. Use get_objects to find object ID' },
        mainTerm: buildMainTermSchema({ description: 'Main term for the responsibility (REQUIRED). Value should be combination of action and object names. Use find_existing_responsibility_terms to check for existing main terms, similar terms, and translations when changing language_id or term_type_id.', valueDescription: 'Term value (responsibility name) - REQUIRED. Should be combination of action and object names (e.g., "Accept Ads", "Add Backgrounds"). Can be edited by user but should match action_id + object_id combination.' }),
        terms: { type: 'array', description: 'Additional terms for the responsibility (optional but recommended). Include main terms, similar terms, and translations. All term types are important for comprehensive responsibility definition.', items: buildTermItemSchema({ withId: false, overrides: { valueDescription: 'Term value - REQUIRED. Should follow action + object combination pattern for consistency across all term types.' } }) }
      },
      required: ['action_id', 'object_id', 'mainTerm']
    }
  },
  {
    name: 'update_responsibility',
    description: 'Update an existing responsibility. WARNING: On any update (even non-term fields), you MUST send the FULL terms array to avoid deletions. Value should be combination of action and object names. Use find_existing_responsibility_terms to check for existing main terms, similar terms, and translations. When adding similar terms or translations, use find_existing_responsibility_terms to check existing terms, then use update_action and update_object to add corresponding terms to maintain consistency across all entities. Terms support AI metadata (set ai_generated=true and provide ai_model when updated by AI).',
    inputSchema: {
      type: 'object',
      properties: {
        responsibilityId: { type: 'string', description: 'Responsibility ID (REQUIRED)' },
        action_id: { type: 'number', description: 'Action ID - optional. Use get_actions to find action ID' },
        object_id: { type: 'number', description: 'Object ID - optional. Use get_objects to find object ID' },
        mainTerm: buildMainTermSchema({ description: 'Main term for the responsibility (REQUIRED). Value should be combination of action and object names. Use find_existing_responsibility_terms to check for existing main terms, similar terms, and translations when changing language_id or term_type_id.', valueDescription: 'Term value (responsibility name) - REQUIRED. Should be combination of action and object names (e.g., "Accept Ads", "Add Backgrounds"). Can be edited by user but should match action_id + object_id combination.' }),
        terms: { type: 'array', description: 'Additional terms for the responsibility (optional but recommended). Include main terms, similar terms, and translations. MANDATORY on update: send the FULL terms array including all existing terms with id and required fields (value, language_id, term_type_id) to avoid unintended deletions. Only the targeted term(s) need updated fields; others must be sent unchanged.', items: buildTermItemSchema({ withId: true, overrides: { valueDescription: 'Term value - REQUIRED. Should follow action + object combination pattern for consistency across all term types.' } }) }
      },
      required: ['responsibilityId', 'mainTerm', 'terms']
    }
  },
  {
    name: 'find_existing_responsibility_terms',
    description: 'Find existing Actions and Objects by language to check what terms already exist. Use this BEFORE adding new terms to responsibilities. Returns actions array with existing terms, objects array with existing terms, and needsUserChoice boolean. After checking existing terms, use update_action and update_object to add missing terms for synchronization. Workflow: 1) Use this tool to check existing terms, 2) Parse responsibility terms into action/object components, 3) Use update_action/update_object to add missing terms to maintain consistency.',
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
    description: 'Create a new individual term using API token authentication. Terms can exist independently and be linked to term groups. Supports AI metadata for tracking AI-generated content.',
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
      required: ['value', 'language_id', 'term_type_id']
    }
  },
  {
    name: 'update_term',
    description: 'Update an existing individual term using API token authentication. Supports AI metadata updates, version tracking, and term group relation management.',
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
      required: ['termId']
    }
  },



];

export { tools };
