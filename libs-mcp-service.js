#!/usr/bin/env node
var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// config.js
var require_config = __commonJS({
  "config.js"(exports2, module2) {
    var API_TOKEN2 = process.env.API_TOKEN;
    var API_BASE_URL2 = process.env.API_BASE_URL;
    if (!API_TOKEN2) {
      console.error("Error: API_TOKEN environment variable is required");
      process.exit(1);
    }
    if (!API_BASE_URL2) {
      console.error("Error: API_BASE_URL environment variable is required");
      process.exit(1);
    }
    module2.exports = {
      API_TOKEN: API_TOKEN2,
      API_BASE_URL: API_BASE_URL2
    };
  }
});

// tools.js
var require_tools = __commonJS({
  "tools.js"(exports2, module2) {
    var tools2 = [
      // Department tools
      {
        name: "get_departments",
        description: "Get all departments",
        inputSchema: {
          type: "object",
          properties: {
            page: { type: "number", description: "Page number (default: 1)" },
            limit: { type: "number", description: "Number of departments per page (default: 10)" },
            search: { type: "string", description: "Search by department name or description" }
          }
        }
      },
      {
        name: "get_department",
        description: "Get a specific department by ID",
        inputSchema: {
          type: "object",
          properties: {
            departmentId: { type: "string", description: "Department ID" }
          },
          required: ["departmentId"]
        }
      },
      {
        name: "create_department",
        description: "Create a new department",
        inputSchema: {
          type: "object",
          properties: {
            name: { type: "string", description: "Department name" },
            description: { type: "string", description: "Department description" }
          },
          required: ["name", "description"]
        }
      },
      {
        name: "update_department",
        description: "Update an existing department",
        inputSchema: {
          type: "object",
          properties: {
            departmentId: { type: "string", description: "Department ID" },
            name: { type: "string", description: "Department name" },
            description: { type: "string", description: "Department description" }
          },
          required: ["departmentId"]
        }
      },
      {
        name: "delete_department",
        description: "Delete a department",
        inputSchema: {
          type: "object",
          properties: {
            departmentId: { type: "string", description: "Department ID" }
          },
          required: ["departmentId"]
        }
      },
      // Profession tools
      {
        name: "get_professions",
        description: "Get all professions",
        inputSchema: {
          type: "object",
          properties: {
            page: { type: "number", description: "Page number (default: 1)" },
            limit: { type: "number", description: "Number of professions per page (default: 10)" },
            search: { type: "string", description: "Search by profession name or description" }
          }
        }
      },
      {
        name: "get_profession",
        description: "Get a specific profession by ID",
        inputSchema: {
          type: "object",
          properties: {
            professionId: { type: "string", description: "Profession ID" }
          },
          required: ["professionId"]
        }
      },
      {
        name: "create_profession",
        description: "Create a new profession",
        inputSchema: {
          type: "object",
          properties: {
            name: { type: "string", description: "Profession name" },
            description: { type: "string", description: "Profession description" }
          },
          required: ["name", "description"]
        }
      },
      {
        name: "update_profession",
        description: "Update an existing profession",
        inputSchema: {
          type: "object",
          properties: {
            professionId: { type: "string", description: "Profession ID" },
            name: { type: "string", description: "Profession name" },
            description: { type: "string", description: "Profession description" }
          },
          required: ["professionId"]
        }
      },
      {
        name: "delete_profession",
        description: "Delete a profession",
        inputSchema: {
          type: "object",
          properties: {
            professionId: { type: "string", description: "Profession ID" }
          },
          required: ["professionId"]
        }
      },
      // Status tools
      {
        name: "get_statuses",
        description: "Get all statuses",
        inputSchema: {
          type: "object",
          properties: {
            page: { type: "number", description: "Page number (default: 1)" },
            limit: { type: "number", description: "Number of statuses per page (default: 10)" },
            search: { type: "string", description: "Search by status name or description" }
          }
        }
      },
      {
        name: "get_status",
        description: "Get a specific status by ID",
        inputSchema: {
          type: "object",
          properties: {
            statusId: { type: "string", description: "Status ID" }
          },
          required: ["statusId"]
        }
      },
      {
        name: "create_status",
        description: "Create a new status",
        inputSchema: {
          type: "object",
          properties: {
            name: { type: "string", description: "Status name" },
            description: { type: "string", description: "Status description" }
          },
          required: ["name", "description"]
        }
      },
      {
        name: "update_status",
        description: "Update an existing status",
        inputSchema: {
          type: "object",
          properties: {
            statusId: { type: "string", description: "Status ID" },
            name: { type: "string", description: "Status name" },
            description: { type: "string", description: "Status description" }
          },
          required: ["statusId"]
        }
      },
      {
        name: "delete_status",
        description: "Delete a status",
        inputSchema: {
          type: "object",
          properties: {
            statusId: { type: "string", description: "Status ID" }
          },
          required: ["statusId"]
        }
      },
      // Priority tools
      {
        name: "get_priorities",
        description: "Get all priorities",
        inputSchema: {
          type: "object",
          properties: {
            page: { type: "number", description: "Page number (default: 1)" },
            limit: { type: "number", description: "Number of priorities per page (default: 10)" },
            search: { type: "string", description: "Search by priority name or description" }
          }
        }
      },
      {
        name: "get_priority",
        description: "Get a specific priority by ID",
        inputSchema: {
          type: "object",
          properties: {
            priorityId: { type: "string", description: "Priority ID" }
          },
          required: ["priorityId"]
        }
      },
      {
        name: "create_priority",
        description: "Create a new priority",
        inputSchema: {
          type: "object",
          properties: {
            name: { type: "string", description: "Priority name" },
            description: { type: "string", description: "Priority description" }
          },
          required: ["name", "description"]
        }
      },
      {
        name: "update_priority",
        description: "Update an existing priority",
        inputSchema: {
          type: "object",
          properties: {
            priorityId: { type: "string", description: "Priority ID" },
            name: { type: "string", description: "Priority name" },
            description: { type: "string", description: "Priority description" }
          },
          required: ["priorityId"]
        }
      },
      {
        name: "delete_priority",
        description: "Delete a priority",
        inputSchema: {
          type: "object",
          properties: {
            priorityId: { type: "string", description: "Priority ID" }
          },
          required: ["priorityId"]
        }
      },
      // Language tools
      {
        name: "get_languages",
        description: "Get all languages",
        inputSchema: {
          type: "object",
          properties: {
            page: { type: "number", description: "Page number (default: 1)" },
            limit: { type: "number", description: "Number of languages per page (default: 10)" },
            search: { type: "string", description: "Search by language name or description" }
          }
        }
      },
      {
        name: "get_language",
        description: "Get a specific language by ID",
        inputSchema: {
          type: "object",
          properties: {
            languageId: { type: "string", description: "Language ID" }
          },
          required: ["languageId"]
        }
      },
      {
        name: "create_language",
        description: "Create a new language",
        inputSchema: {
          type: "object",
          properties: {
            name: { type: "string", description: "Language name" },
            description: { type: "string", description: "Language description" }
          },
          required: ["name", "description"]
        }
      },
      {
        name: "update_language",
        description: "Update an existing language",
        inputSchema: {
          type: "object",
          properties: {
            languageId: { type: "string", description: "Language ID" },
            name: { type: "string", description: "Language name" },
            description: { type: "string", description: "Language description" }
          },
          required: ["languageId"]
        }
      },
      {
        name: "delete_language",
        description: "Delete a language",
        inputSchema: {
          type: "object",
          properties: {
            languageId: { type: "string", description: "Language ID" }
          },
          required: ["languageId"]
        }
      },
      // Tool Type tools
      {
        name: "get_tool_types",
        description: "Get all tool types",
        inputSchema: {
          type: "object",
          properties: {
            page: { type: "number", description: "Page number (default: 1)" },
            limit: { type: "number", description: "Number of tool types per page (default: 10)" },
            search: { type: "string", description: "Search by tool type name or description" }
          }
        }
      },
      {
        name: "get_tool_type",
        description: "Get a specific tool type by ID",
        inputSchema: {
          type: "object",
          properties: {
            toolTypeId: { type: "string", description: "Tool Type ID" }
          },
          required: ["toolTypeId"]
        }
      },
      {
        name: "create_tool_type",
        description: "Create a new tool type",
        inputSchema: {
          type: "object",
          properties: {
            name: { type: "string", description: "Tool Type name" },
            description: { type: "string", description: "Tool Type description" }
          },
          required: ["name", "description"]
        }
      },
      {
        name: "update_tool_type",
        description: "Update an existing tool type",
        inputSchema: {
          type: "object",
          properties: {
            toolTypeId: { type: "string", description: "Tool Type ID" },
            name: { type: "string", description: "Tool Type name" },
            description: { type: "string", description: "Tool Type description" }
          },
          required: ["toolTypeId"]
        }
      },
      {
        name: "delete_tool_type",
        description: "Delete a tool type",
        inputSchema: {
          type: "object",
          properties: {
            toolTypeId: { type: "string", description: "Tool Type ID" }
          },
          required: ["toolTypeId"]
        }
      },
      // Tool tools
      {
        name: "get_tools",
        description: "Get all tools",
        inputSchema: {
          type: "object",
          properties: {
            page: { type: "number", description: "Page number (default: 1)" },
            limit: { type: "number", description: "Number of tools per page (default: 10)" },
            search: { type: "string", description: "Search by tool name or description" }
          }
        }
      },
      {
        name: "get_tool",
        description: "Get a specific tool by ID",
        inputSchema: {
          type: "object",
          properties: {
            toolId: { type: "string", description: "Tool ID" }
          },
          required: ["toolId"]
        }
      },
      {
        name: "create_tool",
        description: "Create a new tool",
        inputSchema: {
          type: "object",
          properties: {
            name: { type: "string", description: "Tool name" },
            description: { type: "string", description: "Tool description" }
          },
          required: ["name", "description"]
        }
      },
      {
        name: "update_tool",
        description: "Update an existing tool",
        inputSchema: {
          type: "object",
          properties: {
            toolId: { type: "string", description: "Tool ID" },
            name: { type: "string", description: "Tool name" },
            description: { type: "string", description: "Tool description" }
          },
          required: ["toolId"]
        }
      },
      {
        name: "delete_tool",
        description: "Delete a tool",
        inputSchema: {
          type: "object",
          properties: {
            toolId: { type: "string", description: "Tool ID" }
          },
          required: ["toolId"]
        }
      }
    ];
    module2.exports = tools2;
  }
});

// api.js
var require_api = __commonJS({
  "api.js"(exports2, module2) {
    var { API_TOKEN: API_TOKEN2, API_BASE_URL: API_BASE_URL2 } = require_config();
    async function makeRequest(endpoint, options = {}) {
      const url = `${API_BASE_URL2}${endpoint}`;
      const defaultOptions = {
        headers: {
          "Authorization": `Bearer ${API_TOKEN2}`,
          "Content-Type": "application/json",
          ...options.headers
        }
      };
      try {
        const response = await fetch(url, { ...defaultOptions, ...options });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
      } catch (error) {
        console.error("Request failed:", error.message);
        throw error;
      }
    }
    module2.exports = {
      makeRequest
    };
  }
});

// entities.js
var require_entities = __commonJS({
  "entities.js"(exports2, module2) {
    var { makeRequest } = require_api();
    async function getDepartments(params = {}) {
      const { page = 1, limit = 10, search = "" } = params;
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...search && { search }
      });
      return await makeRequest(`/department?${queryParams}`);
    }
    async function getDepartment(departmentId) {
      return await makeRequest(`/department/${departmentId}`);
    }
    async function createDepartment(data) {
      return await makeRequest("/department", {
        method: "POST",
        body: JSON.stringify(data)
      });
    }
    async function updateDepartment(departmentId, data) {
      return await makeRequest(`/department/${departmentId}`, {
        method: "PUT",
        body: JSON.stringify(data)
      });
    }
    async function deleteDepartment(departmentId) {
      return await makeRequest(`/department/${departmentId}`, {
        method: "DELETE"
      });
    }
    async function getProfessions(params = {}) {
      const { page = 1, limit = 10, search = "" } = params;
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...search && { search }
      });
      return await makeRequest(`/profession?${queryParams}`);
    }
    async function getProfession(professionId) {
      return await makeRequest(`/profession/${professionId}`);
    }
    async function createProfession(data) {
      return await makeRequest("/profession", {
        method: "POST",
        body: JSON.stringify(data)
      });
    }
    async function updateProfession(professionId, data) {
      return await makeRequest(`/profession/${professionId}`, {
        method: "PUT",
        body: JSON.stringify(data)
      });
    }
    async function deleteProfession(professionId) {
      return await makeRequest(`/profession/${professionId}`, {
        method: "DELETE"
      });
    }
    async function getStatuses(params = {}) {
      const { page = 1, limit = 10, search = "" } = params;
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...search && { search }
      });
      return await makeRequest(`/status?${queryParams}`);
    }
    async function getStatus(statusId) {
      return await makeRequest(`/status/${statusId}`);
    }
    async function createStatus(data) {
      return await makeRequest("/status", {
        method: "POST",
        body: JSON.stringify(data)
      });
    }
    async function updateStatus(statusId, data) {
      return await makeRequest(`/status/${statusId}`, {
        method: "PUT",
        body: JSON.stringify(data)
      });
    }
    async function deleteStatus(statusId) {
      return await makeRequest(`/status/${statusId}`, {
        method: "DELETE"
      });
    }
    async function getPriorities(params = {}) {
      const { page = 1, limit = 10, search = "" } = params;
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...search && { search }
      });
      return await makeRequest(`/priority?${queryParams}`);
    }
    async function getPriority(priorityId) {
      return await makeRequest(`/priority/${priorityId}`);
    }
    async function createPriority(data) {
      return await makeRequest("/priority", {
        method: "POST",
        body: JSON.stringify(data)
      });
    }
    async function updatePriority(priorityId, data) {
      return await makeRequest(`/priority/${priorityId}`, {
        method: "PUT",
        body: JSON.stringify(data)
      });
    }
    async function deletePriority(priorityId) {
      return await makeRequest(`/priority/${priorityId}`, {
        method: "DELETE"
      });
    }
    async function getLanguages(params = {}) {
      const { page = 1, limit = 10, search = "" } = params;
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...search && { search }
      });
      return await makeRequest(`/language?${queryParams}`);
    }
    async function getLanguage(languageId) {
      return await makeRequest(`/language/${languageId}`);
    }
    async function createLanguage(data) {
      return await makeRequest("/language", {
        method: "POST",
        body: JSON.stringify(data)
      });
    }
    async function updateLanguage(languageId, data) {
      return await makeRequest(`/language/${languageId}`, {
        method: "PUT",
        body: JSON.stringify(data)
      });
    }
    async function deleteLanguage(languageId) {
      return await makeRequest(`/language/${languageId}`, {
        method: "DELETE"
      });
    }
    async function getToolTypes(params = {}) {
      const { page = 1, limit = 10, search = "" } = params;
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...search && { search }
      });
      return await makeRequest(`/tool-type?${queryParams}`);
    }
    async function getToolType(toolTypeId) {
      return await makeRequest(`/tool-type/${toolTypeId}`);
    }
    async function createToolType(data) {
      return await makeRequest("/tool-type", {
        method: "POST",
        body: JSON.stringify(data)
      });
    }
    async function updateToolType(toolTypeId, data) {
      return await makeRequest(`/tool-type/${toolTypeId}`, {
        method: "PUT",
        body: JSON.stringify(data)
      });
    }
    async function deleteToolType(toolTypeId) {
      return await makeRequest(`/tool-type/${toolTypeId}`, {
        method: "DELETE"
      });
    }
    async function getTools(params = {}) {
      const { page = 1, limit = 10, search = "" } = params;
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...search && { search }
      });
      return await makeRequest(`/tools?${queryParams}`);
    }
    async function getTool(toolId) {
      return await makeRequest(`/tools/${toolId}`);
    }
    async function createTool(data) {
      return await makeRequest("/tools", {
        method: "POST",
        body: JSON.stringify(data)
      });
    }
    async function updateTool(toolId, data) {
      return await makeRequest(`/tools/${toolId}`, {
        method: "PUT",
        body: JSON.stringify(data)
      });
    }
    async function deleteTool(toolId) {
      return await makeRequest(`/tools/${toolId}`, {
        method: "DELETE"
      });
    }
    module2.exports = {
      // Department functions
      getDepartments,
      getDepartment,
      createDepartment,
      updateDepartment,
      deleteDepartment,
      // Profession functions
      getProfessions,
      getProfession,
      createProfession,
      updateProfession,
      deleteProfession,
      // Status functions
      getStatuses,
      getStatus,
      createStatus,
      updateStatus,
      deleteStatus,
      // Priority functions
      getPriorities,
      getPriority,
      createPriority,
      updatePriority,
      deletePriority,
      // Language functions
      getLanguages,
      getLanguage,
      createLanguage,
      updateLanguage,
      deleteLanguage,
      // Tool Type functions
      getToolTypes,
      getToolType,
      createToolType,
      updateToolType,
      deleteToolType,
      // Tool functions
      getTools,
      getTool,
      createTool,
      updateTool,
      deleteTool
    };
  }
});

// handlers.js
var require_handlers = __commonJS({
  "handlers.js"(exports2, module2) {
    var {
      // Department functions
      getDepartments,
      getDepartment,
      createDepartment,
      updateDepartment,
      deleteDepartment,
      // Profession functions
      getProfessions,
      getProfession,
      createProfession,
      updateProfession,
      deleteProfession,
      // Status functions
      getStatuses,
      getStatus,
      createStatus,
      updateStatus,
      deleteStatus,
      // Priority functions
      getPriorities,
      getPriority,
      createPriority,
      updatePriority,
      deletePriority,
      // Language functions
      getLanguages,
      getLanguage,
      createLanguage,
      updateLanguage,
      deleteLanguage,
      // Tool Type functions
      getToolTypes,
      getToolType,
      createToolType,
      updateToolType,
      deleteToolType,
      // Tool functions
      getTools,
      getTool,
      createTool,
      updateTool,
      deleteTool
    } = require_entities();
    var toolHandlers2 = {
      // Department handlers
      get_departments: getDepartments,
      get_department: getDepartment,
      create_department: createDepartment,
      update_department: updateDepartment,
      delete_department: deleteDepartment,
      // Profession handlers
      get_professions: getProfessions,
      get_profession: getProfession,
      create_profession: createProfession,
      update_profession: updateProfession,
      delete_profession: deleteProfession,
      // Status handlers
      get_statuses: getStatuses,
      get_status: getStatus,
      create_status: createStatus,
      update_status: updateStatus,
      delete_status: deleteStatus,
      // Priority handlers
      get_priorities: getPriorities,
      get_priority: getPriority,
      create_priority: createPriority,
      update_priority: updatePriority,
      delete_priority: deletePriority,
      // Language handlers
      get_languages: getLanguages,
      get_language: getLanguage,
      create_language: createLanguage,
      update_language: updateLanguage,
      delete_language: deleteLanguage,
      // Tool Type handlers
      get_tool_types: getToolTypes,
      get_tool_type: getToolType,
      create_tool_type: createToolType,
      update_tool_type: updateToolType,
      delete_tool_type: deleteToolType,
      // Tool handlers
      get_tools: getTools,
      get_tool: getTool,
      create_tool: createTool,
      update_tool: updateTool,
      delete_tool: deleteTool
    };
    module2.exports = toolHandlers2;
  }
});

// index.js
var readline = require("readline");
var { API_TOKEN, API_BASE_URL } = require_config();
var tools = require_tools();
var toolHandlers = require_handlers();
if (!API_TOKEN) {
  console.error("Error: API_TOKEN environment variable is required");
  process.exit(1);
}
if (!API_BASE_URL) {
  console.error("Error: API_BASE_URL environment variable is required");
  process.exit(1);
}
function sendResponse(id, result) {
  const response = {
    jsonrpc: "2.0",
    id,
    result
  };
  console.log(JSON.stringify(response));
}
function sendError(id, error) {
  const response = {
    jsonrpc: "2.0",
    id,
    error: {
      code: -32603,
      message: error.message || "Internal error"
    }
  };
  console.log(JSON.stringify(response));
}
async function handleRequest(request) {
  try {
    const { id, method, params } = request;
    switch (method) {
      case "initialize":
        sendResponse(id, {
          protocolVersion: "2024-11-05",
          capabilities: {
            tools: {}
          },
          serverInfo: {
            name: "libs-mcp-service",
            version: "1.0.0"
          }
        });
        break;
      case "tools/list":
        sendResponse(id, {
          tools
        });
        break;
      case "tools/call":
        const { name, arguments: args } = params;
        try {
          const handler = toolHandlers[name];
          if (!handler) {
            throw new Error(`Unknown tool: ${name}`);
          }
          let result;
          switch (name) {
            case "get_departments":
              result = await handler(args);
              break;
            case "get_department":
              result = await handler(args.departmentId);
              break;
            case "create_department":
              result = await handler(args);
              break;
            case "update_department":
              const { departmentId, ...departmentUpdateData } = args;
              result = await handler(departmentId, departmentUpdateData);
              break;
            case "delete_department":
              result = await handler(args.departmentId);
              break;
            case "get_professions":
              result = await handler(args);
              break;
            case "get_profession":
              result = await handler(args.professionId);
              break;
            case "create_profession":
              result = await handler(args);
              break;
            case "update_profession":
              const { professionId, ...professionUpdateData } = args;
              result = await handler(professionId, professionUpdateData);
              break;
            case "delete_profession":
              result = await handler(args.professionId);
              break;
            case "get_statuses":
              result = await handler(args);
              break;
            case "get_status":
              result = await handler(args.statusId);
              break;
            case "create_status":
              result = await handler(args);
              break;
            case "update_status":
              const { statusId, ...statusUpdateData } = args;
              result = await handler(statusId, statusUpdateData);
              break;
            case "delete_status":
              result = await handler(args.statusId);
              break;
            case "get_priorities":
              result = await handler(args);
              break;
            case "get_priority":
              result = await handler(args.priorityId);
              break;
            case "create_priority":
              result = await handler(args);
              break;
            case "update_priority":
              const { priorityId, ...priorityUpdateData } = args;
              result = await handler(priorityId, priorityUpdateData);
              break;
            case "delete_priority":
              result = await handler(args.priorityId);
              break;
            case "get_languages":
              result = await handler(args);
              break;
            case "get_language":
              result = await handler(args.languageId);
              break;
            case "create_language":
              result = await handler(args);
              break;
            case "update_language":
              const { languageId, ...languageUpdateData } = args;
              result = await handler(languageId, languageUpdateData);
              break;
            case "delete_language":
              result = await handler(args.languageId);
              break;
            case "get_tool_types":
              result = await handler(args);
              break;
            case "get_tool_type":
              result = await handler(args.toolTypeId);
              break;
            case "create_tool_type":
              result = await handler(args);
              break;
            case "update_tool_type":
              const { toolTypeId, ...toolTypeUpdateData } = args;
              result = await handler(toolTypeId, toolTypeUpdateData);
              break;
            case "delete_tool_type":
              result = await handler(args.toolTypeId);
              break;
            case "get_tools":
              result = await handler(args);
              break;
            case "get_tool":
              result = await handler(args.toolId);
              break;
            case "create_tool":
              result = await handler(args);
              break;
            case "update_tool":
              const { toolId, ...toolUpdateData } = args;
              result = await handler(toolId, toolUpdateData);
              break;
            case "delete_tool":
              result = await handler(args.toolId);
              break;
            default:
              throw new Error(`Unknown tool: ${name}`);
          }
          sendResponse(id, {
            content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
          });
        } catch (error) {
          sendResponse(id, {
            content: [{ type: "text", text: JSON.stringify({ error: { message: error.message, type: "tool_error" } }, null, 2) }]
          });
        }
        break;
      case "notifications/cancel":
        break;
      default:
        sendError(id, new Error(`Unknown method: ${method}`));
    }
  } catch (error) {
    sendError(request.id, error);
  }
}
async function run() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });
  rl.on("line", async (line) => {
    try {
      const request = JSON.parse(line);
      await handleRequest(request);
    } catch (error) {
      console.error("Error parsing request:", error.message);
    }
  });
  rl.on("close", () => {
    process.exit(0);
  });
}
process.on("SIGINT", () => {
  process.exit(0);
});
process.on("SIGTERM", () => {
  process.exit(0);
});
run().catch((error) => {
  console.error("Service error:", error);
  process.exit(1);
});
