# Skills Model Description for MCP Integration

## Full Skills Model Description

### Core Fields
- **id**: Primary key (INTEGER, auto-increment)
- **responsibility_id**: Foreign key to Responsibility model (INTEGER, REQUIRED)
- **tool_id**: Foreign key to Tool model (INTEGER, REQUIRED)
- **term_group_id**: Foreign key to TermGroup model (INTEGER, nullable)

### Relationships
- **Belongs to Responsibility**: `responsibility_id` → `responsibilities.id`
- **Belongs to Tool**: `tool_id` → `tools.id`
- **Belongs to TermGroup**: `term_group_id` → `term_groups.id` (for multilingual support)

## Important: Skills as Junction Entity

**CRITICAL**: Skills in this project are **NOT** standalone entities with types and levels. Instead, they represent the **relationship between Responsibilities and Tools**.

### What Skills Actually Are:
- **Skills** = **Responsibility** + **Tool** combination
- Each skill represents a specific tool used for a specific responsibility
- The skill name/description comes from the TermGroup system
- No skill types, levels, or categories exist in the database

### Real Database Structure:
```javascript
{
  id: INTEGER,                    // Primary key, auto-increment
  responsibility_id: INTEGER,      // REQUIRED - Foreign key to Responsibility
  tool_id: INTEGER,              // REQUIRED - Foreign key to Tool
  term_group_id: INTEGER         // Optional - Foreign key to TermGroup
}
```

## MCP Instructions for Skills Operations

### Available MCP Functions for Skills:

1. **Get all skills**:
   ```javascript
   mcp_libs-mcp-service_list({
     resource: "skills",
     page: 1,           // Page number (default: 1)
     limit: 10,         // Number of skills per page (default: 10)
     search: "search",  // Search by skill name or description
     responsibility_id: 1, // Filter by responsibility
     tool_id: 1         // Filter by tool
   })
   ```

2. **Get specific skill**:
   ```javascript
   mcp_libs-mcp-service_get({
     resource: "skills",
     id: "skill_id_here"
   })
   ```

3. **Create new skill**:
   ```javascript
   mcp_libs-mcp-service_create({
     resource: "skills",
     payload: {
       mainTerm: {
         value: "JavaScript Development",        // REQUIRED
         description: "Using JavaScript for web development", // Optional
         language_id: 1,                        // REQUIRED
         term_type_id: 1,                       // REQUIRED
         aiMetadata: {
           ai_generated: true,
           ai_model: "gpt-4o-mini",
           ai_generation_date: "2024-01-01T00:00:00Z"
         }
       },
       responsibility_id: 1,                // REQUIRED - Responsibility ID
       tool_id: 2                          // REQUIRED - Tool ID
     }
   })
   ```

4. **Update existing skill**:
   ```javascript
   mcp_libs-mcp-service_update({
     resource: "skills",
     id: "skill_id_here",
     payload: {
       mainTerm: {
         value: "Advanced JavaScript Development", // REQUIRED
         description: "Advanced JavaScript techniques", // Optional
         language_id: 1,                        // REQUIRED
         term_type_id: 1,                       // REQUIRED
         aiMetadata: {
           ai_generated: true,
           ai_model: "gpt-4o-mini",
           ai_generation_date: "2024-01-01T00:00:00Z"
         }
       },
       responsibility_id: 1,                // REQUIRED - Responsibility ID
       tool_id: 2                          // REQUIRED - Tool ID
     }
   })
   ```

### Important Notes for MCP Usage:

1. **Required Fields**: `mainTerm`, `responsibility_id`, and `tool_id` are required for creation/update
2. **Skills are Relationships**: Skills represent the connection between a responsibility and a tool
3. **No Skill Types/Levels**: The project doesn't have skill types, levels, or categories
4. **TermGroup Integration**: Skills use TermGroup for multilingual names and descriptions
5. **Internal Processing**: The backend automatically:
   - Creates the necessary TermGroup
   - Creates the main term with the provided name
   - Links the skill to the specified responsibility and tool
   - Sets up language, status, and term type relationships

### Example Usage for Another AI:

```javascript
// Get all skills for a specific responsibility
const skills = await mcp_libs-mcp-service_list({
  resource: "skills",
  page: 1,
  limit: 50,
  responsibility_id: 1
});

// Create a new skill (responsibility + tool combination)
const newSkill = await mcp_libs-mcp-service_create({
  resource: "skills",
  payload: {
    mainTerm: {
      value: "React Development",
      description: "Building user interfaces with React",
      language_id: 1,
      term_type_id: 1,
      aiMetadata: {
        ai_generated: true,
        ai_model: "gpt-4o-mini",
        ai_generation_date: "2024-01-01T00:00:00Z"
      }
    },
    responsibility_id: 1,  // Frontend Development responsibility
    tool_id: 5            // React tool
  }
});

// Update a skill
const updatedSkill = await mcp_libs-mcp-service_update({
  resource: "skills",
  id: "123",
  payload: {
    mainTerm: {
      value: "Advanced React Development",
      description: "Advanced React patterns and techniques",
      language_id: 1,
      term_type_id: 1,
      aiMetadata: {
        ai_generated: true,
        ai_model: "gpt-4o-mini",
        ai_generation_date: "2024-01-01T00:00:00Z"
      }
    },
    responsibility_id: 1,
    tool_id: 5
  }
});
```

### Response Format

All MCP functions return JSON objects with the following structure:

```javascript
{
  success: true,
  data: {
    id: 1,
    name: "JavaScript Development",
    description: "Using JavaScript for web development",
    responsibility_id: 1,
    tool_id: 2,
    responsibility: {
      id: 1,
      name: "Frontend Development"
    },
    tool: {
      id: 2,
      name: "JavaScript",
      description: "Programming language"
    }
    // ... other fields managed internally
  },
  message: "Operation completed successfully"
}
```

## Complete Field Reference

### Skill Model Fields:
```javascript
{
  id: INTEGER,                    // Primary key, auto-increment
  responsibility_id: INTEGER,     // REQUIRED - Foreign key to Responsibility
  tool_id: INTEGER,              // REQUIRED - Foreign key to Tool
  term_group_id: INTEGER         // Optional - Foreign key to TermGroup
}
```

### Term Model Fields (for Main Term):
```javascript
{
  id: INTEGER,                    // Primary key, auto-increment
  value: STRING,                  // REQUIRED - Term value (skill name)
  description: TEXT,              // Nullable - Term description
  language_id: INTEGER,           // REQUIRED - Foreign key to Language
  term_type_id: INTEGER,          // REQUIRED - Foreign key to TermType
  status_id: SMALLINT,            // Nullable - Foreign key to Status
  entity_type_id: INTEGER,        // Nullable - Foreign key to EntityType
  created_by: STRING              // Nullable - User who created the term
}
```

### TermGroup Model Fields:
```javascript
{
  id: INTEGER,                    // Primary key, auto-increment
  name: STRING,                   // REQUIRED - Group name (from main term value)
  main_term_id: INTEGER,          // REQUIRED - Foreign key to main Term
  description: TEXT,               // Nullable - Group description
  status_id: SMALLINT,            // Nullable - Foreign key to Status
  created_by: STRING,             // Nullable - User who created the group
  icon: STRING,                   // Nullable - Path to icon file
  // AI fields (managed internally, not exposed in MCP)
  ai_generated: BOOLEAN,          // Default: false
  ai_model: STRING(100),          // Nullable
  ai_prompt_version: STRING(50),  // Nullable
  ai_generation_date: DATE,       // Nullable
  ai_tokens_used: INTEGER,        // Nullable
  ai_quality_score: DECIMAL(3,2), // Nullable
  ai_validation_status: ENUM,     // 'pending', 'approved', 'rejected', 'needs_review'
  ai_source_data: JSONB,          // Nullable
  ai_metadata: JSONB,             // Nullable
  ai_confidence_score: DECIMAL(3,2), // Nullable
  ai_human_reviewed: BOOLEAN,     // Default: false
  ai_human_reviewer: STRING(100), // Nullable
  ai_review_date: DATE,           // Nullable
  ai_version: INTEGER,            // Default: 1
  ai_batch_id: STRING(50),        // Nullable
  ai_edit_history: JSONB,         // Nullable
  ai_original_data: JSONB,        // Nullable
  ai_manual_overrides: JSONB,     // Nullable
  ai_market_validated: BOOLEAN,   // Default: false
  ai_validation_errors: JSONB     // Nullable
}
```

### Related Model Fields (for Reference):

#### Responsibility Model:
```javascript
{
  id: INTEGER,                    // Primary key, auto-increment
  action_id: INTEGER,             // Foreign key to Action
  object_id: INTEGER,             // Foreign key to Object
  term_group_id: INTEGER,         // Foreign key to TermGroup (nullable)
  // AI fields...
}
```

#### Tool Model:
```javascript
{
  id: INTEGER,                    // Primary key, auto-increment
  name: STRING(255),              // Tool name
  link: TEXT,                     // Tool URL
  description: TEXT,              // Tool description
  icon: STRING(255)               // Icon file path
}
```

#### Action Model:
```javascript
{
  id: INTEGER,                    // Primary key, auto-increment
  term_group_id: INTEGER,         // Foreign key to TermGroup (nullable)
  // AI fields...
}
```

#### Object Model:
```javascript
{
  id: INTEGER,                    // Primary key, auto-increment
  term_group_id: INTEGER,         // Foreign key to TermGroup (nullable)
  // AI fields...
}
```

### Default Values Used by Backend:
- **language_id**: 1 (usually English)
- **term_type_id**: 1 (usually "main" term type)
- **status_id**: 1 (usually "Active" status)
- **created_by**: "0" (if not provided)

### Relationships:
- **Skill** → **Responsibility** (via `responsibility_id`)
- **Skill** → **Tool** (via `tool_id`)
- **Skill** → **TermGroup** (via `term_group_id`)
- **TermGroup** → **Term** (via `main_term_id` for main term)
- **TermGroup** ↔ **Term** (many-to-many via `TermGroupRelation` for additional terms)
- **Term** → **Language** (via `language_id`)
- **Term** → **Status** (via `status_id`)
- **Term** → **TermType** (via `term_type_id`)
- **Responsibility** → **Action** (via `action_id`)
- **Responsibility** → **Object** (via `object_id`)

## Summary

The MCP service provides a **simplified abstraction** over the Skills relationship system. Skills represent the connection between Responsibilities and Tools, not standalone entities with types and levels.

### Key Points:
1. **Skills are Relationships**: Skills connect Responsibilities with Tools
2. **No Skill Types/Levels**: The project doesn't categorize skills by type or proficiency level
3. **TermGroup Integration**: Skills use TermGroup for multilingual names and descriptions
4. **Required Relationships**: Every skill must be linked to both a Responsibility and a Tool
5. **AI Integration**: Full AI content management capabilities through TermGroup
6. **Multi-language Support**: Full internationalization capabilities

### For AI Integration:
The MCP interface allows AI systems to create skills by specifying:
- The skill name/description (via mainTerm)
- Which responsibility it relates to (responsibility_id)
- Which tool is used (tool_id)

### What Skills Represent:
- **Skills** = **Responsibility** + **Tool** combinations
- Examples:
  - "JavaScript Development" = Frontend Development (responsibility) + JavaScript (tool)
  - "Database Design" = Backend Development (responsibility) + PostgreSQL (tool)
  - "UI Design" = Design (responsibility) + Figma (tool)

### Important Notes:
- Skills don't have independent types, levels, or categories
- The skill's "type" is determined by the responsibility it's linked to
- The skill's "tool" is determined by the tool it's linked to
- Skill names are managed through the TermGroup system for multilingual support