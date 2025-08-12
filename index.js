#!/usr/bin/env node

import readline from 'readline';
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

// MCP Server implementation (functional approach)
function sendResponse(id, result) {
  const response = {
    jsonrpc: '2.0',
    id,
    result
  };
  console.log(JSON.stringify(response));
}

function sendError(id, error) {
  const response = {
    jsonrpc: '2.0',
    id,
    error: {
      code: -32603,
      message: error.message || 'Internal error'
    }
  };
  console.log(JSON.stringify(response));
}

async function handleRequest(request) {
  try {
    const { id, method, params } = request;

    switch (method) {
      case 'initialize':
        sendResponse(id, {
          protocolVersion: '2024-11-05',
          capabilities: {
            tools: {}
          },
          serverInfo: {
            name: 'libs-mcp-service',
            version: '1.0.0'
          }
        });
        break;

      case 'tools/list':
        sendResponse(id, {
          tools: tools
        });
        break;

      case 'tools/call':
        const { name, arguments: args } = params;

        try {
          const handler = toolHandlers[name];
          if (!handler) {
            throw new Error(`Unknown tool: ${name}`);
          }

          let result;

          // Dynamic dispatch based on tool name
          switch (name) {
            // Department cases
            case 'get_departments': result = await handler(args); break;
            case 'get_department': result = await handler(args.departmentId); break;
            case 'create_department': result = await handler(args); break;
            case 'update_department': const { departmentId, ...departmentUpdateData } = args; result = await handler(departmentId, departmentUpdateData); break;
            case 'delete_department': result = await handler(args.departmentId); break;

            // Profession cases
            case 'get_professions': result = await handler(args); break;
            case 'get_profession': result = await handler(args.professionId); break;
            case 'create_profession': result = await handler(args); break;
            case 'update_profession': const { professionId, ...professionUpdateData } = args; result = await handler(professionId, professionUpdateData); break;
            case 'delete_profession': result = await handler(args.professionId); break;

            // Status cases
            case 'get_statuses': result = await handler(args); break;
            case 'get_status': result = await handler(args.statusId); break;
            case 'create_status': result = await handler(args); break;
            case 'update_status': const { statusId, ...statusUpdateData } = args; result = await handler(statusId, statusUpdateData); break;
            case 'delete_status': result = await handler(args.statusId); break;

            // Language cases
            case 'get_languages': result = await handler(args); break;
            case 'get_language': result = await handler(args.languageId); break;
            case 'create_language': result = await handler(args); break;
            case 'update_language': const { languageId, ...languageUpdateData } = args; result = await handler(languageId, languageUpdateData); break;
            case 'delete_language': result = await handler(args.languageId); break;

            // Tool Type cases
            case 'get_tool_types': result = await handler(args); break;
            case 'get_tool_type': result = await handler(args.toolTypeId); break;
            case 'create_tool_type': result = await handler(args); break;
            case 'update_tool_type': const { toolTypeId, ...toolTypeUpdateData } = args; result = await handler(toolTypeId, toolTypeUpdateData); break;
            case 'delete_tool_type': result = await handler(args.toolTypeId); break;

            // Tool cases
            case 'get_tools': result = await handler(args); break;
            case 'get_tool': result = await handler(args.toolId); break;
            case 'create_tool': result = await handler(args); break;
            case 'update_tool': const { toolId, ...toolUpdateData } = args; result = await handler(toolId, toolUpdateData); break;
            case 'delete_tool': result = await handler(args.toolId); break;

            default:
              throw new Error(`Unhandled tool: ${name}`);
          }

          sendResponse(id, {
            content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
          });
        } catch (error) {
          console.error('Tool execution error:', error.message);
          sendResponse(id, {
            content: [{ type: 'text', text: JSON.stringify({ error: { message: error.message, type: 'tool_error' } }, null, 2) }]
          });
        }
        break;

      default:
        sendError(id, { message: `Unknown method: ${method}` });
    }
  } catch (error) {
    console.error('Request handling error:', error.message);
    sendError(id, error);
  }
}

// Main server loop
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on('line', (line) => {
  try {
    const request = JSON.parse(line);
    handleRequest(request);
  } catch (error) {
    console.error('Failed to parse JSON:', error.message);
  }
});

rl.on('close', () => {
  process.exit(0);
});
