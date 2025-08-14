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
            language_id: { type: 'number', description: 'Language ID - REQUIRED. Use get_languages to find English language ID (typically 57)' },
            term_type_id: { type: 'number', description: 'Term type ID - REQUIRED. Use get_term_types to find "main" term type ID (typically 1)' },
            status_id: { type: 'number', description: 'Status ID - optional. Use get_statuses to find "Active" status ID (typically 1)' }
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
            language_id: { type: 'number', description: 'Language ID - REQUIRED. Use get_languages to find English language ID (typically 57)' },
            term_type_id: { type: 'number', description: 'Term type ID - REQUIRED. Use get_term_types to find "main" term type ID (typically 1)' },
            status_id: { type: 'number', description: 'Status ID - optional. Use get_statuses to find "Active" status ID (typically 1)' }
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
            language_id: { type: 'number', description: 'Language ID - REQUIRED. Use get_languages to find English language ID (typically 57)' },
            term_type_id: { type: 'number', description: 'Term type ID - REQUIRED. Use get_term_types to find "main" term type ID (typically 1)' },
            status_id: { type: 'number', description: 'Status ID - optional. Use get_statuses to find "Active" status ID (typically 1)' }
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
        department_id: { type: 'number', description: 'Department ID (optional)' }
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
            language_id: { type: 'number', description: 'Language ID - REQUIRED. Use get_languages to find English language ID (typically 57)' },
            term_type_id: { type: 'number', description: 'Term type ID - REQUIRED. Use get_term_types to find "main" term type ID (typically 1)' },
            status_id: { type: 'number', description: 'Status ID - optional. Use get_statuses to find "Active" status ID (typically 1)' }
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
        department_id: { type: 'number', description: 'Department ID (optional)' }
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
        name: { type: 'string', description: 'Language name' },
        description: { type: 'string', description: 'Language description' }
      },
      required: ['name']
    }
  },
  {
    name: 'update_language',
    description: 'Update an existing language',
    inputSchema: {
      type: 'object',
      properties: {
        languageId: { type: 'string', description: 'Language ID' },
        name: { type: 'string', description: 'Language name' },
        description: { type: 'string', description: 'Language description' }
      },
      required: ['languageId']
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
  }
];

export { tools };
