#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { API_TOKEN, API_BASE_URL } from './config.js';
import { tools } from './tools.js';
import { list as unifiedList, get as unifiedGet, create as unifiedCreate, update as unifiedUpdate, findExistingResponsibilityTerms, getTermTypes, createTerm, updateTerm } from './handlers.js';
import { handleError, formatMCPError, APIError } from './src/errors.js';
import { rateLimiter } from './src/rateLimit.js';

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
  const modeRaw = process.env.MODE || 'standard';
  const allowedModes = ['light', 'standard'];
  const mode = allowedModes.includes(modeRaw) ? modeRaw : 'standard';
  if (!allowedModes.includes(modeRaw)) {
    console.warn('MODE must be "light" or "standard"; defaulting to "standard"');
  }
  const base = tools;
  const filtered = mode === 'light'
    ? base.filter(t => ['list','get','create','update'].includes(t.name))
    : base;
  return { tools: filtered };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const clientId = request?.params?.$clientId || 'default-client';
  if (!rateLimiter.isAllowed(clientId)) {
    const err = new APIError('Rate limit exceeded', 429, { clientId });
    return formatMCPError(err);
  }
  
  try {
    let result;
    
    // Use function approach for tool handling
    switch (name) {
      // unified tools
      case 'list':
        result = await unifiedList(args);
        break;
      case 'get':
        result = await unifiedGet(args);
        break;
      case 'create':
        result = await unifiedCreate(args);
        break;
      case 'update':
        result = await unifiedUpdate(args);
        break;
      // essential specialized tools
      case 'get_term_types':
        result = await getTermTypes(args);
        break;
      case 'find_existing_responsibility_terms':
        result = await findExistingResponsibilityTerms(args);
        break;
      case 'create_term':
        result = await createTerm(args);
        break;
      case 'update_term':
        result = await updateTerm(args.termId, args);
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
    const handled = handleError(error, { tool: name, args });
    return formatMCPError(handled);
  }
});

// Start the server
const transport = new StdioServerTransport();
await server.connect(transport);
