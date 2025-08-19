#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { API_TOKEN, API_BASE_URL } from './config.js';
import { tools } from './tools.js';
import toolHandlers from './handlers.js';

// Validation
if (!API_TOKEN) {
  console.error('Error: API_TOKEN environment variable is required');
  process.exit(1);
}

if (!API_BASE_URL) {
  console.error('Error: API_BASE_URL environment variable is required');
  process.exit(1);
}

// Main server setup using official MCP SDK
const server = new Server(
  {
    name: "libs-mcp-service",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Handle tool calls with proper function approach
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: tools,
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  try {
    const handler = toolHandlers[name];
    if (!handler) {
      throw new Error(`Unknown tool: ${name}`);
    }

    let result;
    
    // Use function approach for tool handling
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
      case "get_term_types":
        result = await handler(args);
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
      case "get_actions":
        result = await handler(args);
        break;
      case "get_action":
        result = await handler(args.actionId);
        break;
      case "create_action":
        result = await handler(args);
        break;
      case "update_action":
        const { actionId, ...actionUpdateData } = args;
        result = await handler(actionId, actionUpdateData);
        break;
      case "get_objects":
        result = await handler(args);
        break;
      case "get_object":
        result = await handler(args.objectId);
        break;
      case "create_object":
        result = await handler(args);
        break;
      case "update_object":
        const { objectId, ...objectUpdateData } = args;
        result = await handler(objectId, objectUpdateData);
        break;
      case "get_formats":
        result = await handler(args);
        break;
      case "get_format":
        result = await handler(args.formatId);
        break;
      case "create_format":
        result = await handler(args);
        break;
      case "update_format":
        const { formatId, ...formatUpdateData } = args;
        result = await handler(formatId, formatUpdateData);
        break;
      case "get_responsibilities":
        result = await handler(args);
        break;
      case "get_responsibility":
        result = await handler(args.responsibilityId);
        break;
      case "create_responsibility":
        result = await handler(args);
        break;
      case "update_responsibility":
        const { responsibilityId, ...responsibilityUpdateData } = args;
        result = await handler(responsibilityId, responsibilityUpdateData);
        break;
      case "find_existing_responsibility_terms":
        result = await handler(args);
        break;
      default:
        throw new Error(`Unhandled tool: ${name}`);
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    console.error("Tool execution error:", error.message);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            { error: { message: error.message, type: "tool_error" } },
            null,
            2
          ),
        },
      ],
    };
  }
});

// Start the server
const transport = new StdioServerTransport();
await server.connect(transport);
