// Tool definitions for all entities
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
    description: 'Create a new department',
    inputSchema: {
      type: 'object',
      properties: {
        mainTerm: {
          type: 'object',
          description: 'Main term for the department (REQUIRED)',
          properties: {
            value: { type: 'string', description: 'Term value (department name) - REQUIRED' },
            description: { type: 'string', description: 'Term description (optional)' },
            language_id: { type: 'number', description: 'Language ID - REQUIRED. Use get_languages to find language ID. English is recommended as primary language' },
            term_type_id: { type: 'number', description: 'Term type ID - REQUIRED. Use get_term_types to find term type ID. "main" is recommended as primary term type' },
            status_id: { type: 'number', description: 'Status ID - optional. Use get_statuses to find status ID' }
          },
          required: ['value', 'language_id', 'term_type_id']
        },
        terms: {
          type: 'array',
          description: 'Additional terms for the department (optional)',
          items: {
            type: 'object',
            properties: {
              value: { type: 'string', description: 'Term value - REQUIRED' },
              description: { type: 'string', description: 'Term description (optional)' },
              language_id: { type: 'number', description: 'Language ID - REQUIRED' },
              term_type_id: { type: 'number', description: 'Term type ID - REQUIRED' },
              status_id: { type: 'number', description: 'Status ID (optional)' }
            },
            required: ['value', 'language_id', 'term_type_id']
          }
        },
        color: { type: 'string', description: 'Department color (optional, default: "#1976d2")' },
      },
      required: ['mainTerm']
    }
  },
  {
    name: 'update_department',
    description: 'Update an existing department',
    inputSchema: {
      type: 'object',
      properties: {
        departmentId: { type: 'string', description: 'Department ID (REQUIRED)' },
        mainTerm: {
          type: 'object',
          description: 'Main term for the department (REQUIRED)',
          properties: {
            value: { type: 'string', description: 'Term value (department name) - REQUIRED' },
            description: { type: 'string', description: 'Term description (optional)' },
            language_id: { type: 'number', description: 'Language ID - REQUIRED. Use get_languages to find language ID. English is recommended as primary language' },
            term_type_id: { type: 'number', description: 'Term type ID - REQUIRED. Use get_term_types to find term type ID. "main" is recommended as primary term type' },
            status_id: { type: 'number', description: 'Status ID - optional. Use get_statuses to find status ID' }
          },
          required: ['value', 'language_id', 'term_type_id']
        },
        terms: {
          type: 'array',
          description: 'Additional terms for the department (optional)',
          items: {
            type: 'object',
            properties: {
              value: { type: 'string', description: 'Term value - REQUIRED' },
              description: { type: 'string', description: 'Term description (optional)' },
              language_id: { type: 'number', description: 'Language ID - REQUIRED' },
              term_type_id: { type: 'number', description: 'Term type ID - REQUIRED' },
              status_id: { type: 'number', description: 'Status ID (optional)' }
            },
            required: ['value', 'language_id', 'term_type_id']
          }
        },
        color: { type: 'string', description: 'Department color (optional)' },
      },
      required: ['departmentId', 'mainTerm']
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
    description: 'Create a new profession',
    inputSchema: {
      type: 'object',
      properties: {
        mainTerm: {
          type: 'object',
          description: 'Main term for the profession (REQUIRED)',
          properties: {
            value: { type: 'string', description: 'Term value (profession name) - REQUIRED' },
            description: { type: 'string', description: 'Term description (optional)' },
            language_id: { type: 'number', description: 'Language ID - REQUIRED. Use get_languages to find language ID. English is recommended as primary language' },
            term_type_id: { type: 'number', description: 'Term type ID - REQUIRED. Use get_term_types to find term type ID. "main" is recommended as primary term type' },
            status_id: { type: 'number', description: 'Status ID - optional. Use get_statuses to find status ID' }
          },
          required: ['value', 'language_id', 'term_type_id']
        },
        terms: {
          type: 'array',
          description: 'Additional terms for the profession (optional)',
          items: {
            type: 'object',
            properties: {
              value: { type: 'string', description: 'Term value - REQUIRED' },
              description: { type: 'string', description: 'Term description (optional)' },
              language_id: { type: 'number', description: 'Language ID - REQUIRED' },
              term_type_id: { type: 'number', description: 'Term type ID - REQUIRED' },
              status_id: { type: 'number', description: 'Status ID (optional)' }
            },
            required: ['value', 'language_id', 'term_type_id']
          }
        },
        department_id: { type: 'number', description: 'Department ID (optional)' },
        tool_ids: { type: 'array', description: 'Array of tool IDs (optional)', items: { type: 'number' } }
      },
      required: ['mainTerm']
    }
  },
  {
    name: 'update_profession',
    description: 'Update an existing profession',
    inputSchema: {
      type: 'object',
      properties: {
        professionId: { type: 'string', description: 'Profession ID (REQUIRED)' },
        mainTerm: {
          type: 'object',
          description: 'Main term for the profession (REQUIRED)',
          properties: {
            value: { type: 'string', description: 'Term value (profession name) - REQUIRED' },
            description: { type: 'string', description: 'Term description (optional)' },
            language_id: { type: 'number', description: 'Language ID - REQUIRED. Use get_languages to find language ID. English is recommended as primary language' },
            term_type_id: { type: 'number', description: 'Term type ID - REQUIRED. Use get_term_types to find term type ID. "main" is recommended as primary term type' },
            status_id: { type: 'number', description: 'Status ID - optional. Use get_statuses to find status ID' }
          },
          required: ['value', 'language_id', 'term_type_id']
        },
        terms: {
          type: 'array',
          description: 'Additional terms for the profession (optional)',
          items: {
            type: 'object',
            properties: {
              value: { type: 'string', description: 'Term value - REQUIRED' },
              description: { type: 'string', description: 'Term description (optional)' },
              language_id: { type: 'number', description: 'Language ID - REQUIRED' },
              term_type_id: { type: 'number', description: 'Term type ID - REQUIRED' },
              status_id: { type: 'number', description: 'Status ID (optional)' }
            },
            required: ['value', 'language_id', 'term_type_id']
          }
        },
        department_id: { type: 'number', description: 'Department ID (optional)' },
        tool_ids: { type: 'array', description: 'Array of tool IDs (optional)', items: { type: 'number' } }
      },
      required: ['professionId', 'mainTerm']
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
    description: 'Create a new language',
    inputSchema: {
      type: 'object',
      properties: {
        mainTerm: {
          type: 'object',
          description: 'Main term for the language (REQUIRED)',
          properties: {
            value: { type: 'string', description: 'Term value (language name) - REQUIRED' },
            description: { type: 'string', description: 'Term description (optional)' },
            language_id: { type: 'number', description: 'Language ID - REQUIRED. Use get_languages to find language ID. English is recommended as primary language' },
            term_type_id: { type: 'number', description: 'Term type ID - REQUIRED. Use get_term_types to find term type ID. "main" is recommended as primary term type' },
            status_id: { type: 'number', description: 'Status ID - optional. Use get_statuses to find status ID' }
          },
          required: ['value', 'language_id', 'term_type_id']
        },
        terms: {
          type: 'array',
          description: 'Additional terms for the language (optional)',
          items: {
            type: 'object',
            properties: {
              value: { type: 'string', description: 'Term value - REQUIRED' },
              description: { type: 'string', description: 'Term description (optional)' },
              language_id: { type: 'number', description: 'Language ID - REQUIRED' },
              term_type_id: { type: 'number', description: 'Term type ID - REQUIRED' },
              status_id: { type: 'number', description: 'Status ID (optional)' }
            },
            required: ['value', 'language_id', 'term_type_id']
          }
        },
        iso2: { type: 'string', description: 'ISO 2-letter language code (REQUIRED)' },
        iso3: { type: 'string', description: 'ISO 3-letter language code (REQUIRED)' }
      },
      required: ['mainTerm', 'iso2', 'iso3']
    }
  },
  {
    name: 'update_language',
    description: 'Update an existing language',
    inputSchema: {
      type: 'object',
      properties: {
        languageId: { type: 'string', description: 'Language ID (REQUIRED)' },
        mainTerm: {
          type: 'object',
          description: 'Main term for the language (REQUIRED)',
          properties: {
            value: { type: 'string', description: 'Term value (language name) - REQUIRED' },
            description: { type: 'string', description: 'Term description (optional)' },
            language_id: { type: 'number', description: 'Language ID - REQUIRED. Use get_languages to find language ID. English is recommended as primary language' },
            term_type_id: { type: 'number', description: 'Term type ID - REQUIRED. Use get_term_types to find term type ID. "main" is recommended as primary term type' },
            status_id: { type: 'number', description: 'Status ID - optional. Use get_statuses to find status ID' }
          },
          required: ['value', 'language_id', 'term_type_id']
        },
        terms: {
          type: 'array',
          description: 'Additional terms for the language (optional)',
          items: {
            type: 'object',
            properties: {
              value: { type: 'string', description: 'Term value - REQUIRED' },
              description: { type: 'string', description: 'Term description (optional)' },
              language_id: { type: 'number', description: 'Language ID - REQUIRED' },
              term_type_id: { type: 'number', description: 'Term type ID - REQUIRED' },
              status_id: { type: 'number', description: 'Status ID (optional)' }
            },
            required: ['value', 'language_id', 'term_type_id']
          }
        },
        iso2: { type: 'string', description: 'ISO 2-letter language code (REQUIRED)' },
        iso3: { type: 'string', description: 'ISO 3-letter language code (REQUIRED)' }
      },
      required: ['languageId', 'mainTerm', 'iso2', 'iso3']
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
    description: 'Create a new action',
    inputSchema: {
      type: 'object',
      properties: {
        mainTerm: {
          type: 'object',
          description: 'Main term for the action (REQUIRED)',
          properties: {
            value: { type: 'string', description: 'Term value (action name) - REQUIRED' },
            description: { type: 'string', description: 'Term description (optional)' },
            language_id: { type: 'number', description: 'Language ID - REQUIRED. Use get_languages to find language ID. English is recommended as primary language' },
            term_type_id: { type: 'number', description: 'Term type ID - REQUIRED. Use get_term_types to find term type ID. "main" is recommended as primary term type' },
            status_id: { type: 'number', description: 'Status ID - optional. Use get_statuses to find status ID' }
          },
          required: ['value', 'language_id', 'term_type_id']
        },
        terms: {
          type: 'array',
          description: 'Additional terms for the action (optional)',
          items: {
            type: 'object',
            properties: {
              value: { type: 'string', description: 'Term value - REQUIRED' },
              description: { type: 'string', description: 'Term description (optional)' },
              language_id: { type: 'number', description: 'Language ID - REQUIRED' },
              term_type_id: { type: 'number', description: 'Term type ID - REQUIRED' },
              status_id: { type: 'number', description: 'Status ID (optional)' }
            },
            required: ['value', 'language_id', 'term_type_id']
          }
        }
      },
      required: ['mainTerm']
    }
  },
  {
    name: 'update_action',
    description: 'Update an existing action. Use this tool to add new terms (similar, translations) to actions for responsibility synchronization. When adding responsibility similar terms like "Build Applications", parse it to extract "Build" and add this as similar term to the corresponding action. This maintains consistency between responsibilities and their component actions.',
    inputSchema: {
      type: 'object',
      properties: {
        actionId: { type: 'string', description: 'Action ID (REQUIRED)' },
        mainTerm: {
          type: 'object',
          description: 'Main term for the action (REQUIRED)',
          properties: {
            value: { type: 'string', description: 'Term value (action name) - REQUIRED' },
            description: { type: 'string', description: 'Term description (optional)' },
            language_id: { type: 'number', description: 'Language ID - REQUIRED. Use get_languages to find language ID. English is recommended as primary language' },
            term_type_id: { type: 'number', description: 'Term type ID - REQUIRED. Use get_term_types to find term type ID. "main" is recommended as primary term type' },
            status_id: { type: 'number', description: 'Status ID - optional. Use get_statuses to find status ID' }
          },
          required: ['value', 'language_id', 'term_type_id']
        },
        terms: {
          type: 'array',
          description: 'Additional terms for the action (optional)',
          items: {
            type: 'object',
            properties: {
              value: { type: 'string', description: 'Term value - REQUIRED' },
              description: { type: 'string', description: 'Term description (optional)' },
              language_id: { type: 'number', description: 'Language ID - REQUIRED' },
              term_type_id: { type: 'number', description: 'Term type ID - REQUIRED' },
              status_id: { type: 'number', description: 'Status ID (optional)' }
            },
            required: ['value', 'language_id', 'term_type_id']
          }
        }
      },
      required: ['actionId', 'mainTerm']
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
    description: 'Create a new object',
    inputSchema: {
      type: 'object',
      properties: {
        mainTerm: {
          type: 'object',
          description: 'Main term for the object (REQUIRED)',
          properties: {
            value: { type: 'string', description: 'Term value (object name) - REQUIRED' },
            description: { type: 'string', description: 'Term description (optional)' },
            language_id: { type: 'number', description: 'Language ID - REQUIRED. Use get_languages to find language ID. English is recommended as primary language' },
            term_type_id: { type: 'number', description: 'Term type ID - REQUIRED. Use get_term_types to find term type ID. "main" is recommended as primary term type' },
            status_id: { type: 'number', description: 'Status ID - optional. Use get_statuses to find status ID' }
          },
          required: ['value', 'language_id', 'term_type_id']
        },
        terms: {
          type: 'array',
          description: 'Additional terms for the object (optional)',
          items: {
            type: 'object',
            properties: {
              value: { type: 'string', description: 'Term value - REQUIRED' },
              description: { type: 'string', description: 'Term description (optional)' },
              language_id: { type: 'number', description: 'Language ID - REQUIRED' },
              term_type_id: { type: 'number', description: 'Term type ID - REQUIRED' },
              status_id: { type: 'number', description: 'Status ID (optional)' }
            },
            required: ['value', 'language_id', 'term_type_id']
          }
        },
        format_ids: { type: 'array', description: 'Array of format IDs (optional)', items: { type: 'number' } }
      },
      required: ['mainTerm']
    }
  },
  {
    name: 'update_object',
    description: 'Update an existing object. Use this tool to add new terms (similar, translations) to objects for responsibility synchronization. When adding responsibility similar terms like "Build Applications", parse it to extract "Applications" part and add corresponding terms to the object if needed. This maintains consistency between responsibilities and their component objects.',
    inputSchema: {
      type: 'object',
      properties: {
        objectId: { type: 'string', description: 'Object ID (REQUIRED)' },
        mainTerm: {
          type: 'object',
          description: 'Main term for the object (REQUIRED)',
          properties: {
            value: { type: 'string', description: 'Term value (object name) - REQUIRED' },
            description: { type: 'string', description: 'Term description (optional)' },
            language_id: { type: 'number', description: 'Language ID - REQUIRED. Use get_languages to find language ID. English is recommended as primary language' },
            term_type_id: { type: 'number', description: 'Term type ID - REQUIRED. Use get_term_types to find term type ID. "main" is recommended as primary term type' },
            status_id: { type: 'number', description: 'Status ID - optional. Use get_statuses to find status ID' }
          },
          required: ['value', 'language_id', 'term_type_id']
        },
        terms: {
          type: 'array',
          description: 'Additional terms for the object (optional)',
          items: {
            type: 'object',
            properties: {
              value: { type: 'string', description: 'Term value - REQUIRED' },
              description: { type: 'string', description: 'Term description (optional)' },
              language_id: { type: 'number', description: 'Language ID - REQUIRED' },
              term_type_id: { type: 'number', description: 'Term type ID - REQUIRED' },
              status_id: { type: 'number', description: 'Status ID (optional)' }
            },
            required: ['value', 'language_id', 'term_type_id']
          }
        },
        format_ids: { type: 'array', description: 'Array of format IDs (optional)', items: { type: 'number' } }
      },
      required: ['objectId', 'mainTerm']
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
    description: 'Create a new responsibility. Value should be combination of action and object names. Use find_existing_responsibility_terms to check for existing main terms, similar terms, and translations. When creating similar terms or translations, use find_existing_responsibility_terms to check existing terms, then use update_action and update_object to add corresponding terms to maintain consistency across all entities.',
    inputSchema: {
      type: 'object',
      properties: {
        action_id: { type: 'number', description: 'Action ID - REQUIRED. Use get_actions to find action ID' },
        object_id: { type: 'number', description: 'Object ID - REQUIRED. Use get_objects to find object ID' },
        mainTerm: {
          type: 'object',
          description: 'Main term for the responsibility (REQUIRED). Value should be combination of action and object names. Use find_existing_responsibility_terms to check for existing main terms, similar terms, and translations when changing language_id or term_type_id.',
          properties: {
            value: { type: 'string', description: 'Term value (responsibility name) - REQUIRED. Should be combination of action and object names (e.g., "Accept Ads", "Add Backgrounds"). Can be edited by user but should match action_id + object_id combination.' },
            description: { type: 'string', description: 'Term description (optional)' },
            language_id: { type: 'number', description: 'Language ID - REQUIRED. Use get_languages to find language ID. When changed, use find_existing_responsibility_terms to check for existing main terms, similar terms, and translations.' },
            term_type_id: { type: 'number', description: 'Term type ID - REQUIRED. Use get_term_types to find term type ID. When changed, use find_existing_responsibility_terms to check for existing main terms, similar terms, and translations.' },
            status_id: { type: 'number', description: 'Status ID - optional. Use get_statuses to find status ID' }
          },
          required: ['value', 'language_id', 'term_type_id']
        },
        terms: {
          type: 'array',
          description: 'Additional terms for the responsibility (optional but recommended). Include main terms, similar terms, and translations. All term types are important for comprehensive responsibility definition.',
          items: {
            type: 'object',
            properties: {
              value: { type: 'string', description: 'Term value - REQUIRED. Should follow action + object combination pattern for consistency across all term types.' },
              description: { type: 'string', description: 'Term description (optional)' },
              language_id: { type: 'number', description: 'Language ID - REQUIRED. Use different languages for translations.' },
              term_type_id: { type: 'number', description: 'Term type ID - REQUIRED. Use different types for main, similar, and translation terms.' },
              status_id: { type: 'number', description: 'Status ID (optional)' }
            },
            required: ['value', 'language_id', 'term_type_id']
          }
        }
      },
      required: ['action_id', 'object_id', 'mainTerm']
    }
  },
  {
    name: 'update_responsibility',
    description: 'Update an existing responsibility. Value should be combination of action and object names. Use find_existing_responsibility_terms to check for existing main terms, similar terms, and translations. When adding similar terms or translations, use find_existing_responsibility_terms to check existing terms, then use update_action and update_object to add corresponding terms to maintain consistency across all entities.',
    inputSchema: {
      type: 'object',
      properties: {
        responsibilityId: { type: 'string', description: 'Responsibility ID (REQUIRED)' },
        action_id: { type: 'number', description: 'Action ID - optional. Use get_actions to find action ID' },
        object_id: { type: 'number', description: 'Object ID - optional. Use get_objects to find object ID' },
        mainTerm: {
          type: 'object',
          description: 'Main term for the responsibility (REQUIRED). Value should be combination of action and object names. Use find_existing_responsibility_terms to check for existing main terms, similar terms, and translations when changing language_id or term_type_id.',
          properties: {
            value: { type: 'string', description: 'Term value (responsibility name) - REQUIRED. Should be combination of action and object names (e.g., "Accept Ads", "Add Backgrounds"). Can be edited by user but should match action_id + object_id combination.' },
            description: { type: 'string', description: 'Term description (optional)' },
            language_id: { type: 'number', description: 'Language ID - REQUIRED. Use get_languages to find language ID. When changed, use find_existing_responsibility_terms to check for existing main terms, similar terms, and translations.' },
            term_type_id: { type: 'number', description: 'Term type ID - REQUIRED. Use get_term_types to find term type ID. When changed, use find_existing_responsibility_terms to check for existing main terms, similar terms, and translations.' },
            status_id: { type: 'number', description: 'Status ID - optional. Use get_statuses to find status ID' }
          },
          required: ['value', 'language_id', 'term_type_id']
        },
        terms: {
          type: 'array',
          description: 'Additional terms for the responsibility (optional but recommended). Include main terms, similar terms, and translations. All term types are important for comprehensive responsibility definition.',
          items: {
            type: 'object',
            properties: {
              value: { type: 'string', description: 'Term value - REQUIRED. Should follow action + object combination pattern for consistency across all term types.' },
              description: { type: 'string', description: 'Term description (optional)' },
              language_id: { type: 'number', description: 'Language ID - REQUIRED. Use different languages for translations.' },
              term_type_id: { type: 'number', description: 'Term type ID - REQUIRED. Use different types for main, similar, and translation terms.' },
              status_id: { type: 'number', description: 'Status ID (optional)' }
            },
            required: ['value', 'language_id', 'term_type_id']
          }
        }
      },
      required: ['responsibilityId', 'mainTerm']
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
  }
];

export { tools };
