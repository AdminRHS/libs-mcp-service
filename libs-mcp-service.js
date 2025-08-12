#!/usr/bin/env node

// index.js
import readline from "readline";

// config.js
var API_TOKEN = process.env.API_TOKEN;
var API_BASE_URL = process.env.API_BASE_URL;
if (!API_TOKEN) {
  console.error("Error: API_TOKEN environment variable is required");
  process.exit(1);
}
if (!API_BASE_URL) {
  console.error("Error: API_BASE_URL environment variable is required");
  process.exit(1);
}

// tools.js
var tools = [
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

// api.js
async function makeRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}/token/${endpoint}`;
  const defaultOptions = {
    headers: {
      "Authorization": `Bearer ${API_TOKEN}`,
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

// entities.js
async function getDepartments(params = {}) {
  const { page = 1, limit = 10, search = "" } = params;
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...search && { search }
  });
  return await makeRequest(`departments?${queryParams}`);
}
async function getDepartment(departmentId) {
  return await makeRequest(`departments/${departmentId}`);
}
async function createDepartment(data) {
  return await makeRequest("departments", {
    method: "POST",
    body: JSON.stringify(data)
  });
}
async function updateDepartment(departmentId, data) {
  return await makeRequest(`departments/${departmentId}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });
}
async function deleteDepartment(departmentId) {
  return await makeRequest(`departments/${departmentId}`, {
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
  return await makeRequest(`professions?${queryParams}`);
}
async function getProfession(professionId) {
  return await makeRequest(`professions/${professionId}`);
}
async function createProfession(data) {
  return await makeRequest("professions", {
    method: "POST",
    body: JSON.stringify(data)
  });
}
async function updateProfession(professionId, data) {
  return await makeRequest(`professions/${professionId}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });
}
async function deleteProfession(professionId) {
  return await makeRequest(`professions/${professionId}`, {
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
  return await makeRequest(`statuses?${queryParams}`);
}
async function getStatus(statusId) {
  return await makeRequest(`statuses/${statusId}`);
}
async function createStatus(data) {
  return await makeRequest("statuses", {
    method: "POST",
    body: JSON.stringify(data)
  });
}
async function updateStatus(statusId, data) {
  return await makeRequest(`statuses/${statusId}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });
}
async function deleteStatus(statusId) {
  return await makeRequest(`statuses/${statusId}`, {
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
  return await makeRequest(`languages?${queryParams}`);
}
async function getLanguage(languageId) {
  return await makeRequest(`languages/${languageId}`);
}
async function createLanguage(data) {
  return await makeRequest("languages", {
    method: "POST",
    body: JSON.stringify(data)
  });
}
async function updateLanguage(languageId, data) {
  return await makeRequest(`languages/${languageId}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });
}
async function deleteLanguage(languageId) {
  return await makeRequest(`languages/${languageId}`, {
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
  return await makeRequest(`tool-types?${queryParams}`);
}
async function getToolType(toolTypeId) {
  return await makeRequest(`tool-types/${toolTypeId}`);
}
async function createToolType(data) {
  return await makeRequest("tool-types", {
    method: "POST",
    body: JSON.stringify(data)
  });
}
async function updateToolType(toolTypeId, data) {
  return await makeRequest(`tool-types/${toolTypeId}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });
}
async function deleteToolType(toolTypeId) {
  return await makeRequest(`tool-types/${toolTypeId}`, {
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
  return await makeRequest(`tools?${queryParams}`);
}
async function getTool(toolId) {
  return await makeRequest(`tools/${toolId}`);
}
async function createTool(data) {
  return await makeRequest("tools", {
    method: "POST",
    body: JSON.stringify(data)
  });
}
async function updateTool(toolId, data) {
  return await makeRequest(`tools/${toolId}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });
}
async function deleteTool(toolId) {
  return await makeRequest(`tools/${toolId}`, {
    method: "DELETE"
  });
}

// handlers.js
var toolHandlers = {
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
var handlers_default = toolHandlers;

// index.js
if (!API_TOKEN) {
  console.error("Error: API_TOKEN environment variable is required");
  process.exit(1);
}
if (!API_BASE_URL) {
  console.error("Error: API_BASE_URL environment variable is required");
  process.exit(1);
}
function sendResponse(id2, result) {
  const response = {
    jsonrpc: "2.0",
    id: id2,
    result
  };
  console.log(JSON.stringify(response));
}
function sendError(id2, error) {
  const response = {
    jsonrpc: "2.0",
    id: id2,
    error: {
      code: -32603,
      message: error.message || "Internal error"
    }
  };
  console.log(JSON.stringify(response));
}
async function handleRequest(request) {
  try {
    const { id: id2, method, params } = request;
    switch (method) {
      case "initialize":
        sendResponse(id2, {
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
        sendResponse(id2, {
          tools
        });
        break;
      case "tools/call":
        const { name, arguments: args } = params;
        try {
          const handler = handlers_default[name];
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
              throw new Error(`Unhandled tool: ${name}`);
          }
          sendResponse(id2, result);
        } catch (error) {
          sendError(id2, error);
        }
        break;
      default:
        sendError(id2, { message: `Unknown method: ${method}` });
    }
  } catch (error) {
    sendError(id, error);
  }
}
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});
rl.on("line", (line) => {
  try {
    const request = JSON.parse(line);
    handleRequest(request);
  } catch (error) {
    console.error("Failed to parse JSON:", error.message);
  }
});
rl.on("close", () => {
  process.exit(0);
});
