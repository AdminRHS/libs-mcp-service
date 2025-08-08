# Libs MCP Service

A minimal Model Context Protocol (MCP) service for integration with external platforms. This service provides CRUD operations for entities through a standardized MCP interface.

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
        "API_BASE_URL": "https://your-api-domain.com"
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
| `API_BASE_URL` | No | Base URL for the external API | `https://api.example.com` |

## Features

- **CRUD Operations**: Create, read, update, and delete entities
- **Search & Pagination**: Get entities with search and pagination support
- **MCP Protocol**: Full Model Context Protocol compliance
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

### get_entities
Retrieve all entities with optional pagination and search.

**Parameters:**
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Number of entities per page (default: 10)
- `search` (string, optional): Search by entity name or description

### get_entity
Retrieve a specific entity by ID.

**Parameters:**
- `entityId` (string, required): Entity ID

### create_entity
Create a new entity.

**Parameters:**
- `name` (string, required): Entity name
- `description` (string, required): Entity description
- `type` (string, optional): Entity type

### update_entity
Update an existing entity.

**Parameters:**
- `entityId` (string, required): Entity ID
- `name` (string, optional): Entity name
- `description` (string, optional): Entity description
- `type` (string, optional): Entity type

### delete_entity
Delete an entity.

**Parameters:**
- `entityId` (string, required): Entity ID

## API Endpoints

The service expects the following REST API endpoints on your external platform:

- `GET /entities` - List entities (with query parameters: page, limit, search)
- `GET /entities/:id` - Get specific entity
- `POST /entities` - Create entity
- `PUT /entities/:id` - Update entity
- `DELETE /entities/:id` - Delete entity

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

### Testing

The service can be tested by sending JSON-RPC requests to stdin:

```bash
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}' | API_TOKEN=test_token node libs-mcp-service.js
```

## Error Handling

The service includes comprehensive error handling:

- Missing API token results in immediate exit
- HTTP errors are properly formatted and returned
- Invalid JSON-RPC requests are handled gracefully
- Tool errors include detailed error messages

## Security Notes

- **API Token**: Never commit your actual API token to version control
- **Environment Variables**: Use environment variables for sensitive configuration
- **HTTPS**: Ensure your API_BASE_URL uses HTTPS in production

## Troubleshooting

### Common Issues

1. **"API_TOKEN environment variable is required"**
   - Ensure the API_TOKEN environment variable is set
   - Check your MCP client configuration

2. **"HTTP error! status: 401"**
   - Verify your API token is valid
   - Check if the token has expired

3. **"HTTP error! status: 404"**
   - Verify the API_BASE_URL is correct
   - Check if the API endpoints exist

4. **Service not starting**
   - Ensure Node.js 18+ is installed
   - Check if all dependencies are available

### Debug Mode

To enable debug logging, set the `DEBUG` environment variable:

```bash
DEBUG=* npx github:AdminRHS/libs-mcp-service
```

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
