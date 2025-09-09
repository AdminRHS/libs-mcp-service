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
        "API_BASE_URL": "https://libs.anyemp.com",
        "MODE": "light"
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
| `MODE` | No | UI mode: `light` (minimal) or `standard` (full). Affects tool list and response shape | `standard` |

### API Environments

- **Production**: `https://libs.anyemp.com` - Main microservice for libraries
- **Development**: `https://libdev.anyemp.com` - Recommended for development and testing

**Recommendation**: Use the development environment for testing to avoid affecting production data.

## ✨ Features

- **🏢 Official MCP SDK**: Full MCP compliance using `@modelcontextprotocol/sdk`
- **🔧 Universal Tools**: `list`, `get`, `create`, `update` for all 20+ entity types
- **⚡ Performance**: Response caching with TTL and smart invalidation
- **🛡️ Security**: Rate limiting, request size caps, and bearer token authentication
- **🔄 Smart Updates**: Automatic term preservation in update operations
- **🤖 AI Metadata**: Comprehensive tracking for AI-generated content
- **📱 Dual Modes**: Light mode for minimal UIs, standard mode for full functionality
- **🚀 Easy Deployment**: Executable via npx without local installation

## 🎛️ Modes

Configure behavior with the `MODE` environment variable:

### Light Mode (`MODE=light`)
- **Same tool list**: All tools available (no filtering)
- **Auto-optimization**: List operations automatically add `all=true` and `isShort=true` parameters
- **Reduced responses**: Single `get` operations return `{ id, name }` format
- **Perfect for**: Claude, ChatGPT, and other token-conscious clients

### Standard Mode (`MODE=standard`)
- **Full tool list**: All available tools shown
- **Complete responses**: Full entity payloads in all operations
- **Manual control**: Explicit parameters required for optimization
- **Perfect for**: Development and full-featured applications

## 🛠️ Available Tools

### Universal Tools (All Entities)
- **`list`** — List entities with pagination and search
- **`get`** — Fetch single entity by ID
- **`create`** — Create new entity with AI metadata support
- **`update`** — Update entity with automatic term preservation

### Essential Specialized Tools
- **`get_term_types`** — Retrieve available term types
- **`find_existing_responsibility_terms`** — Check existing action-object term combinations
- **`create_term`** — Create individual terms with AI metadata
- **`update_term`** — Update individual terms with AI metadata

AI metadata behavior:
- Create: include `aiMetadata` only for the term(s) you want marked/recorded as AI-generated; others remain unchanged.
- Update: include `aiMetadata` only for term(s) you intend to change; omitting it leaves existing AI fields as-is.

### Supported Entities (20 Types)
- **Core**: Departments, Professions, Languages, Countries, Cities
- **Content**: Actions, Objects, Responsibilities, Formats  
- **Organization**: Industries, Sub-Industries, Tools, Tool Types
- **System**: Statuses, Term Types, Individual Terms
- **Management**: Shifts, Currencies, Rates, Levels

## 📚 Common Usage Patterns

### List Entities with Search
```javascript
// List departments with search
{
  "resource": "departments",
  "search": "engineering", 
  "limit": 5
}
```

### Create Entity with AI Metadata
```javascript
// Create department with AI tracking
{
  "resource": "departments",
  "payload": {
    "mainTerm": {
      "value": "Data Science",
      "language_id": 1,
      "term_type_id": 1,
      "aiMetadata": {
        "ai_generated": true,
        "ai_model": "gpt-4o",
        "ai_confidence_score": 9.5
      }
    }
  }
}
```

### Update with Term Preservation
```javascript
// Update preserves existing terms automatically
{
  "resource": "departments", 
  "id": "123",
  "payload": {
    "mainTerm": {
      "value": "Updated Name",
      "language_id": 1,
      "term_type_id": 1
    }
    // Existing terms automatically preserved
  }
}
```

## 🏗️ Architecture

### Core Components
- **`index.js`** - Main MCP server with official SDK integration
- **`config.js`** - Environment validation and configuration
- **`api.js`** - HTTP client with caching, timeouts, and error handling
- **`entities.js`** - CRUD operations for all 16 entity types
- **`tools.js`** - MCP tool definitions with JSON Schema validation
- **`handlers.js`** - Tool handler mappings and routing

### Advanced Features
- **`src/errors.js`** - Structured error handling with MCP formatting
- **`src/cache.js`** - Response caching with TTL and smart invalidation
- **`src/rateLimit.js`** - Fixed-window rate limiting per client

### Build System
- **`libs-mcp-service.js`** - Bundled executable (530KB) for npx deployment

## 🧪 Testing Status

### ✅ Comprehensive Testing Complete (20/20 Entities)

| Entity Category | Entities | Status | Features Tested |
|----------------|----------|--------|-----------------|
| **Core** | Departments, Professions, Languages | ✅ Complete | CRUD, AI metadata, term preservation |
| **Geography** | Countries, Cities | ✅ Complete | Complex terms, ISO codes, coordinates |
| **Content** | Actions, Objects, Responsibilities | ✅ Complete | Term relationships, format linking |
| **Organization** | Industries, Sub-Industries | ✅ Complete | Parent-child relationships |
| **System** | Tools, Tool Types, Formats | ✅ Complete | Many-to-many relationships |
| **Meta** | Statuses, Term Types, Terms | ✅ Complete | Individual term management |
| **Management** | Shifts, Currencies, Rates, Levels | ✅ Complete | Time, financial, and position management |

### Key Testing Results
- **✅ Schema Validation**: All entity schemas validated against actual API
- **✅ Permission Testing**: Proper 403 handling for restricted operations
- **✅ AI Metadata**: Comprehensive testing of AI tracking fields
- **✅ Term Preservation**: Smart update logic maintains existing terms
- **✅ Relationship Handling**: Complex entity relationships working correctly
- **✅ Error Handling**: Structured errors with proper MCP formatting

## 🔒 Security Features

- **🛡️ Bearer Authentication**: Secure API token handling
- **⏱️ Rate Limiting**: 60 requests/minute per client (configurable)
- **📏 Request Size Limits**: 100KB body size cap
- **🔐 Secret Masking**: Authorization headers masked in cache keys
- **⏰ Timeout Protection**: 30-second request timeouts with AbortController

## 📈 Performance Optimizations

- **💾 Response Caching**: 5-minute TTL with smart invalidation
- **🗂️ Cache Management**: Automatic prefix-based invalidation on writes
- **📦 Bundle Optimization**: Minified 530KB bundle with tree-shaking
- **⚡ Efficient Updates**: Term preservation reduces API calls

## 🚀 Installation & Deployment

### Option 1: Direct Execution (Recommended)
```bash
npx github:AdminRHS/libs-mcp-service
```

### Option 2: Global Installation
```bash
npm install -g github:AdminRHS/libs-mcp-service
libs-mcp-service
```

### Option 3: Development Mode
```bash
git clone https://github.com/AdminRHS/libs-mcp-service.git
cd libs-mcp-service
npm install
npm run dev
```

## 🔧 API Integration

The service expects RESTful endpoints following this pattern:

```
GET    /api/token/{entity}           # List with pagination
GET    /api/token/{entity}/:id       # Get by ID  
POST   /api/token/{entity}           # Create new
PUT    /api/token/{entity}/:id       # Update existing
DELETE /api/token/{entity}/:id       # Delete (where permitted)
```

All requests include `Authorization: Bearer <API_TOKEN>` header.

### Supported Endpoints
- `/api/token/departments` - Department management
- `/api/token/professions` - Profession management  
- `/api/token/languages` - Language and term management
- `/api/token/countries` - Country data with ISO codes
- `/api/token/cities` - City data with coordinates
- `/api/token/actions` - Action definitions with terms
- `/api/token/objects` - Object definitions with formats
- `/api/token/responsibilities` - Responsibility linking
- `/api/token/industries` - Industry classifications
- `/api/token/sub-industries` - Sub-industry definitions
- `/api/token/tools` - Tool management with types
- `/api/token/tool-types` - Tool type definitions
- `/api/token/formats` - Format specifications
- `/api/token/statuses` - Status management
- `/api/token/term-types` - Term type definitions
- `/api/token/terms` - Individual term management
- `/api/token/shifts` - Working time management
- `/api/token/currencies` - Currency management
- `/api/token/rates` - Rate management
- `/api/token/levels` - Position level management

## 🐛 Troubleshooting

### Common Issues

**❌ "API_TOKEN environment variable is required"**
- Verify API_TOKEN is set in your MCP client configuration
- Check for typos in environment variable names

**❌ "HTTP error! status: 401"**  
- Verify your API token is valid and not expired
- Ensure proper Bearer token format

**❌ "HTTP error! status: 403"**
- Normal behavior for write operations on most entities
- Only certain entities allow POST/PUT operations

**❌ "Rate limit exceeded"**
- Check if multiple clients are using same configuration

**❌ Service not starting**
- Ensure Node.js 18+ is installed
- Check network connectivity to API_BASE_URL

### Debug Mode

Enable detailed logging:
```bash
DEBUG=* npx github:AdminRHS/libs-mcp-service
```

### Health Check

Test connectivity:
```javascript
// Use 'list' tool with minimal parameters
{
  "resource": "term_types",
  "limit": 1
}
```

## 📊 Metrics & Monitoring

The service includes built-in metrics tracking:
- **Request counts** by tool and entity type
- **Error rates** with status code breakdown  
- **Cache hit/miss ratios** for performance monitoring
- **Rate limit statistics** per client
- **Response times** for performance analysis

## 🤖 AI Metadata Support

Comprehensive AI tracking for all terms and entities:

### Supported Fields
- `ai_generated` - Whether content was AI-generated
- `ai_model` - AI model used (e.g., "gpt-4o", "claude-3.5")
- `ai_confidence_score` - Confidence rating (0.00-9.99)
- `ai_quality_score` - Quality assessment (0.00-9.99)
- `ai_validation_status` - Review status ("pending", "approved", "rejected")
- `ai_human_reviewed` - Human review flag
- `ai_source_data` - Original source information
- `ai_metadata` - Additional AI-specific data

### Usage Examples
See `docs-models/AI_METADATA_GUIDE.md` for comprehensive examples and best practices.

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run `npm run build` to update the bundled file
5. Commit both source and bundled files
6. Submit a pull request

## 📞 Support

- **Issues**: Create an issue on GitHub
- **Documentation**: Check the `docs-models/` directory
- **API Questions**: Verify API_BASE_URL and token configuration
- **Performance**: Monitor cache hit rates and adjust TTL settings

---

**Status**: ✅ **Production Ready** - All 20 entities tested and validated

Built with ❤️ using the official Model Context Protocol SDK
