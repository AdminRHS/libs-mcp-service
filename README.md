# Libs MCP Service

A Model Context Protocol (MCP) service for integration with external platforms. This service provides CRUD operations for various entities through a standardized MCP interface using the official MCP SDK.

## Quick Setup

### Configuration

Add the following to your MCP configuration:

```json
{
  "mcpServers": {
    "libs-mcp-service": {
      "command": "npx",
      "args": ["github:AdminRHS/libs-mcp-service"],
      "env": {
        "API_TOKEN": "your_actual_token_here",
        "API_BASE_URL": "https://libs.anyemp.com"
      }
    }
  }
}
```

**Important**: Replace `your_actual_token_here` with your real API token from the external platform.

### Environment Variables

| Variable | Required | Description | Default |
|----------|----------|-------------|---------|
| `API_TOKEN` | Yes | Authentication token for the external platform | - |
| `API_BASE_URL` | Yes | Base URL for the external API | - |

### API Environments

- **Production**: `https://libs.anyemp.com` - Main microservice for libraries
- **Development**: `https://libdev.anyemp.com` - Test environment for developers (recommended for development and testing)

**Note**: For development and testing, it's recommended to use the development environment (`https://libdev.anyemp.com`) to avoid affecting production data.

## Features

- **CRUD Operations**: Create, read, update, and delete entities
- **Search & Pagination**: Get entities with search and pagination support
- **Official MCP SDK**: Full Model Context Protocol compliance using `@modelcontextprotocol/sdk`
- **Multiple Entity Types**: Support for departments, professions, statuses, languages, tool types, and tools
- **Standalone**: Runs as a standalone Node.js process
- **Easy Deployment**: Executable via npx without local installation

## Prerequisites

- Node.js 18.0.0 or higher
- API token from your external platform

## Manual Installation (Optional)

### Option 1: Direct npx execution

```bash
npx github:AdminRHS/libs-mcp-service
```

### Option 2: Local installation

```bash
npm install -g github:AdminRHS/libs-mcp-service
libs-mcp-service
```

## Available Tools

The service provides 37 tools across 10 entity types:

### Departments
- `get_departments` - List all departments with pagination and search
- `get_department` - Get a specific department by ID
- `create_department` - Create a new department
- `update_department` - Update an existing department

### Professions
- `get_professions` - List all professions with pagination and search
- `get_profession` - Get a specific profession by ID
- `create_profession` - Create a new profession
- `update_profession` - Update an existing profession

### Statuses
- `get_statuses` - List all statuses with pagination and search
- `get_status` - Get a specific status by ID
- `create_status` - Create a new status
- `update_status` - Update an existing status

### Languages
- `get_languages` - List all languages with pagination and search
- `get_language` - Get a specific language by ID
- `create_language` - Create a new language
- `update_language` - Update an existing language

### Term Types
- `get_term_types` - List all term types with pagination and search (GET only, no CRUD operations)

### Tool Types
- `get_tool_types` - List all tool types with pagination and search
- `get_tool_type` - Get a specific tool type by ID
- `create_tool_type` - Create a new tool type
- `update_tool_type` - Update an existing tool type

### Tools
- `get_tools` - List all tools with pagination and search
- `get_tool` - Get a specific tool by ID
- `create_tool` - Create a new tool
- `update_tool` - Update an existing tool

### Actions
- `get_actions` - List all actions with pagination and search
- `get_action` - Get a specific action by ID
- `create_action` - Create a new action
- `update_action` - Update an existing action

### Objects
- `get_objects` - List all objects with pagination and search
- `get_object` - Get a specific object by ID
- `create_object` - Create a new object with complex term structure
- `update_object` - Update an existing object with format relationships

### Formats
- `get_formats` - List all formats with pagination and search
- `get_format` - Get a specific format by ID
- `create_format` - Create a new format
- `update_format` - Update an existing format

## Common Parameters

Most list operations support these parameters:
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Number of items per page (default: 10)
- `search` (string, optional): Search by name or description

Create operations require:
- `name` (string, required): Entity name
- `description` (string, required): Entity description

Update operations require:
- `[entityId]` (string, required): Entity ID
- `name` (string, optional): Entity name
- `description` (string, optional): Entity description

## API Endpoints

The service expects the following REST API endpoints on your external platform:

- `GET /api/token/departments` - List departments (with query parameters: page, limit, search)
- `GET /api/token/departments/:id` - Get specific department
- `POST /api/token/departments` - Create department
- `PUT /api/token/departments/:id` - Update department
- `DELETE /api/token/departments/:id` - Delete department

Similar patterns for other entities:
- `/api/token/professions`
- `/api/token/statuses`
- `/api/token/languages`
- `/api/token/tool-types`
- `/api/token/tools`
- `/api/token/actions`
- `/api/token/objects`
- `/api/token/formats`

All requests include the `Authorization: Bearer <API_TOKEN>` header.

## Development

### Building the Service

```bash
npm install
npm run build
```

This creates the bundled `libs-mcp-service.js` file that includes all dependencies.

### Running in Development Mode

```bash
npm run dev
```

## Error Handling

The service includes comprehensive error handling using the official MCP SDK:

- **Configuration Errors**: Missing API token or base URL results in immediate exit
- **HTTP Errors**: API request failures are properly formatted and returned
- **Tool Errors**: Invalid tool calls include detailed error messages
- **MCP Protocol Errors**: Handled automatically by the official SDK
- **Response Format**: All errors follow proper MCP content structure

## Security Notes

- **API Token**: Never commit your actual API token to version control
- **Environment Variables**: Use environment variables for sensitive configuration
- **HTTPS**: Ensure your API_BASE_URL uses HTTPS in production
- **Bearer Token**: Uses Authorization header with Bearer token for authentication

## Troubleshooting

### Common Issues

1. **"API_TOKEN environment variable is required"**
   - Ensure the API_TOKEN environment variable is set
   - Check your MCP client configuration

2. **"API_BASE_URL environment variable is required"**
   - Ensure the API_BASE_URL environment variable is set
   - Verify the URL format is correct

3. **"HTTP error! status: 401"**
   - Verify your API token is valid
   - Check if the token has expired

4. **"HTTP error! status: 404"**
   - Verify the API_BASE_URL is correct
   - Check if the API endpoints exist

5. **Service not starting**
   - Ensure Node.js 18+ is installed
   - Check if all dependencies are available

### Debug Mode

To enable debug logging, set the `DEBUG` environment variable:

```bash
DEBUG=* npx github:AdminRHS/libs-mcp-service
```

## Testing Status

The service has been thoroughly tested with the following results:

### ✅ Tested Entities (10 out of 10)

| Entity | CRUD Operations | Permissions | Schema | Status |
|--------|----------------|-------------|--------|--------|
| **Departments** | ✅ Create, Read, Update | ✅ GET allowed, POST blocked (403) | ✅ Corrected | ✅ Complete |
| **Professions** | ✅ Create, Read, Update | ✅ GET allowed, POST blocked (403) | ✅ Simplified | ✅ Complete |
| **Statuses** | ✅ Create, Read, Update | ✅ GET allowed, POST/PUT blocked (403) | ✅ Corrected | ✅ Complete |
| **Tool Types** | ✅ Create, Read, Update | ✅ GET allowed, POST/PUT blocked (403) | ✅ Corrected | ✅ Complete |
| **Tools** | ✅ Create, Read, Update | ✅ GET allowed, POST/PUT blocked (403) | ✅ Enhanced | ✅ Complete |
| **Actions** | ✅ Create, Read, Update | ✅ GET allowed, POST/PUT blocked (403) | ✅ Complex term structure | ✅ Complete |
| **Objects** | ✅ Create, Read, Update | ✅ GET/POST/PUT blocked (403) | ✅ Complex term structure + formats | ✅ Complete |
| **Formats** | ✅ Create, Read, Update | ✅ GET/POST/PUT allowed | ✅ Simple structure | ✅ Complete |
| **Languages** | ✅ Create, Read, Update | ✅ GET allowed, POST/PUT blocked (403) | ✅ Complex term structure | ✅ Complete |

### Key Testing Results

- **Schema Corrections**: Fixed schemas for Statuses, Tool Types, and Tools to match actual API structure
- **Permission Testing**: All entities properly restrict write operations (403 Forbidden)
- **Relationship Testing**: Tools successfully tested with toolTypeIds relationships, Objects tested with format relationships
- **Complex Term Structure**: Actions and Objects successfully tested with mainTerm and terms array
- **Format Relationships**: Objects successfully tested with many-to-many format relationships
- **Simple Format Model**: Formats successfully tested with minimal structure (name field only)
- **Error Handling**: Proper validation and error responses confirmed

### Testing Complete

All 10 entity types have been thoroughly tested and are fully functional:

- **Languages**: ✅ CRUD operations, permissions, and schema validation completed
- **Complex Term Structure**: ✅ Successfully tested with mainTerm, terms array, and multiple translations
- **Permission System**: ✅ All entities properly implement security restrictions
- **Schema Validation**: ✅ All schemas match actual API structure

## Architecture

The service uses a modular architecture:

- **`index.js`** - Main MCP server using official SDK
- **`config.js`** - Environment configuration
- **`api.js`** - HTTP request utilities
- **`entities.js`** - CRUD operations for all entities
- **`tools.js`** - MCP tool definitions
- **`handlers.js`** - Tool handler mappings

## License

MIT License - see LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `npm run build` to update the bundled file
5. Commit both source and bundled files
6. Submit a pull request

## Support

For issues and questions:
- Create an issue on GitHub
- Check the troubleshooting section above
- Verify your API token and base URL configuration
