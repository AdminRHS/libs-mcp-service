# Responsibility Model Description

## Overview

The **Responsibility** model represents job responsibilities that link specific **Actions** with **Objects**. It's a core component of the job description system that defines what actions professionals perform on specific objects or systems.

## Core Concept

A Responsibility is essentially a **"Action + Object"** combination with multilingual support through the Term System. For example:
- **Action**: "Manage" + **Object**: "Database Systems" = **Responsibility**: "Manage Database Systems"
- **Action**: "Develop" + **Object**: "Web Applications" = **Responsibility**: "Develop Web Applications"

## Model Definition

### Core Fields

```javascript
{
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  action_id: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
    references: { model: 'actions', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  object_id: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
    references: { model: 'objects', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  term_group_id: { 
    type: DataTypes.INTEGER, 
    allowNull: true,
    references: { model: 'term_groups', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  }
}
```

### Relationships

1. **Belongs to Action** (`action_id`)
   - Foreign key to `actions.id`
   - Cascade on update/delete
   - Required field

2. **Belongs to Object** (`object_id`)
   - Foreign key to `objects.id`
   - Cascade on update/delete
   - Required field

3. **Belongs to TermGroup** (`term_group_id`)
   - Foreign key to `term_groups.id`
   - Cascade on update, SET NULL on delete
   - Optional field (for multilingual support)

## Complex Creation Process

### Frontend Data Structure

The frontend sends data in this format:

```javascript
const formData = {
  action_id: 1,                    // Required: ID of existing Action
  object_id: 2,                    // Required: ID of existing Object
  mainTerm: {                      // Required: Main term for the responsibility
    value: "Manage Database Systems",
    description: "Responsible for managing and maintaining database systems",
    language_id: 1,                // Required: Language ID
    term_type_id: 1,               // Required: Term type ID (usually 1 for "main")
    status_id: 1                   // Optional: Status ID
  },
  terms: [                         // Optional: Additional terms in other languages
    {
      value: "Управлять системами баз данных",
      description: "Отвечает за управление и обслуживание систем баз данных",
      language_id: 2,              // Russian language
      term_type_id: 2,             // Additional term type
      status_id: 1
    }
  ]
};
```

### Backend Processing Steps

1. **Validation**:
   - Check if `action_id` and `object_id` exist
   - Verify uniqueness of `action_id + object_id` combination
   - Parse JSON strings for `mainTerm` and `terms`

2. **Create Responsibility**:
   ```javascript
   const responsibility = await Responsibility.create({
     action_id: action_id,
     object_id: object_id
   });
   ```

3. **Create TermGroup**:
   ```javascript
   const termGroupData = {
     mainTerm: {
       value: mainTerm?.value || `Responsibility ${responsibility.id}`,
       description: mainTerm?.description || '',
       language_id: mainTerm?.language_id || 1,
       status_id: mainTerm?.status_id || null,
       created_by: userId
     },
     terms: terms,
     entity_type: 'responsibility',
     entity_id: responsibility.id
   };
   
   const termGroup = await termsService.createTermGroup(termGroupData);
   ```

4. **Link TermGroup**:
   ```javascript
   await responsibility.update({ term_group_id: termGroup.id });
   ```

## MCP Instructions

### Available MCP Functions

**Note**: Currently, there are **NO dedicated MCP functions** for Responsibilities. You must use direct REST API calls.

### Required Fields for Creating the Simplest Responsibility

#### Responsibility Model:
```javascript
{
  action_id: 1,        // Required: Must reference existing Action
  object_id: 2,        // Required: Must reference existing Object
  term_group_id: null  // Auto-generated during creation
}
```

#### Term Model (for mainTerm):
```javascript
{
  value: "Manage Database Systems",     // Required: Responsibility name
  description: "Description here",      // Optional: Detailed description
  language_id: 1,                       // Required: Language ID (1 = English)
  term_type_id: 1,                      // Required: Term type ID (1 = "main")
  status_id: 1,                         // Optional: Status ID (1 = "Active")
  entity_type_id: null,                 // Auto-generated
  created_by: "user_id"                 // Auto-generated
}
```

#### TermGroup Model:
```javascript
{
  name: "Responsibility 1",             // Auto-generated
  main_term_id: 1,                      // Auto-generated (links to main Term)
  description: "Description here",      // Optional: From mainTerm.description
  status_id: 1,                         // Optional: From mainTerm.status_id
  created_by: "user_id",                // Auto-generated
  icon: null,                           // Not used for responsibilities
  entity_type: "responsibility",        // Auto-generated
  entity_id: 1                          // Auto-generated (links to Responsibility)
}
```

### Default Values

- **Language ID**: 1 (English)
- **Term Type ID**: 1 (main)
- **Status ID**: 1 (Active) - if available
- **Entity Type**: "responsibility" (auto-generated)

## API Endpoints

### REST API Endpoints

#### **GET** `/api/responsibilities`
- **Description**: Get all responsibilities with pagination
- **Parameters**:
  - `page` (default: 1)
  - `limit` (default: 10)
  - `language_ids` (optional: filter by languages)
  - `action_id` (optional: filter by action)
  - `object_id` (optional: filter by object)
  - `filters` (optional: JSON string with additional filters)
  - `all` (optional: if "true", returns all without pagination)

#### **GET** `/api/responsibilities/:id`
- **Description**: Get responsibility by ID
- **Response**: Full responsibility with Action, Object, and TermGroup data

#### **POST** `/api/responsibilities`
- **Description**: Create new responsibility
- **Content-Type**: `application/json`
- **Body**:
  ```json
  {
    "action_id": 1,
    "object_id": 2,
    "mainTerm": {
      "value": "Manage Database Systems",
      "description": "Responsible for managing database systems",
      "language_id": 1,
      "term_type_id": 1,
      "status_id": 1
    },
    "terms": [
      {
        "value": "Управлять базами данных",
        "description": "Отвечает за управление базами данных",
        "language_id": 2,
        "term_type_id": 2,
        "status_id": 1
      }
    ]
  }
  ```

#### **PUT** `/api/responsibilities/:id`
- **Description**: Update existing responsibility
- **Content-Type**: `application/json`
- **Body**: Same as POST

#### **DELETE** `/api/responsibilities/:id`
- **Description**: Delete responsibility
- **Note**: Will cascade delete related TermGroup and Terms

#### **GET** `/api/responsibilities/terms`
- **Description**: Get all terms from all responsibilities
- **Parameters**: Same as getAll + sorting options

#### **GET** `/api/responsibilities/find-existing-terms`
- **Description**: Find existing Actions and Objects by language
- **Parameters**:
  - `language_id` (required)
  - `search` (optional: search term)

### Token API Endpoints

#### **GET** `/api/token/responsibilities`
- **Authentication**: API Token required
- **Scope**: `responsibilities:read`

#### **POST** `/api/token/responsibilities`
- **Authentication**: API Token required
- **Scope**: `responsibilities:write`

#### **PUT** `/api/token/responsibilities/:id`
- **Authentication**: API Token required
- **Scope**: `responsibilities:write`

#### **DELETE** `/api/token/responsibilities/:id`
- **Authentication**: API Token required
- **Scope**: `responsibilities:write`

## Complete Field Reference

### Responsibility Model Fields:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | INTEGER | Auto | Primary key, auto-increment |
| `action_id` | INTEGER | Yes | Foreign key to actions.id |
| `object_id` | INTEGER | Yes | Foreign key to objects.id |
| `term_group_id` | INTEGER | No | Foreign key to term_groups.id |

### Term Model Fields (for mainTerm):
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | INTEGER | Auto | Primary key, auto-increment |
| `value` | STRING | Yes | Responsibility name |
| `description` | TEXT | No | Detailed description |
| `language_id` | INTEGER | Yes | Foreign key to languages.id |
| `term_type_id` | INTEGER | Yes | Foreign key to term_types.id |
| `status_id` | SMALLINT | No | Foreign key to statuses.id |
| `entity_type_id` | INTEGER | Auto | Foreign key to entity_types.id |
| `created_by` | STRING | Auto | User ID who created the term |

### TermGroup Model Fields:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | INTEGER | Auto | Primary key, auto-increment |
| `name` | STRING | Auto | Auto-generated name |
| `main_term_id` | INTEGER | Auto | Foreign key to terms.id (main term) |
| `description` | TEXT | No | Description from main term |
| `status_id` | SMALLINT | No | Foreign key to statuses.id |
| `created_by` | STRING | Auto | User ID who created the group |
| `icon` | STRING | No | Icon path (not used for responsibilities) |
| `entity_type` | STRING | Auto | Always "responsibility" |
| `entity_id` | INTEGER | Auto | Foreign key to responsibilities.id |

### Related Model Fields:

#### Action Model:
| Field | Type | Description |
|-------|------|-------------|
| `id` | INTEGER | Primary key |
| `term_group_id` | INTEGER | Links to TermGroup for multilingual support |

#### Object Model:
| Field | Type | Description |
|-------|------|-------------|
| `id` | INTEGER | Primary key |
| `term_group_id` | INTEGER | Links to TermGroup for multilingual support |

#### Language Model:
| Field | Type | Description |
|-------|------|-------------|
| `id` | INTEGER | Primary key |
| `iso2` | STRING(2) | ISO 2-letter code (en, ru, etc.) |
| `iso3` | STRING(3) | ISO 3-letter code (eng, rus, etc.) |

#### TermType Model:
| Field | Type | Description |
|-------|------|-------------|
| `id` | INTEGER | Primary key |
| `name` | STRING | Type name (main, synonym, etc.) |

#### Status Model:
| Field | Type | Description |
|-------|------|-------------|
| `id` | SMALLINT | Primary key |
| `name` | STRING(50) | Status name (Active, Inactive, etc.) |
| `color` | STRING(50) | Color code for UI |

## Validation Rules

### Required Fields:
- `action_id` - Must reference existing Action
- `object_id` - Must reference existing Object
- `mainTerm.value` - Responsibility name cannot be empty
- `mainTerm.language_id` - Must reference existing Language
- `mainTerm.term_type_id` - Must reference existing TermType

### Unique Constraints:
- **Combination**: `action_id + object_id` must be unique
- **TermGroup**: Each responsibility can have only one TermGroup
- **MainTerm**: Each TermGroup can have only one MainTerm

### Business Rules:
- Action and Object must exist before creating Responsibility
- Responsibility cannot be created without both Action and Object
- TermGroup is automatically created and linked
- Additional terms are optional but must have valid language_id and term_type_id

## Error Handling

### Common Errors:

1. **400 Bad Request**:
   - `Invalid action_id or object_id` - Action or Object doesn't exist
   - `Responsibility for this action-object combination already exists` - Duplicate combination
   - `Неверный формат данных` - Invalid JSON format

2. **500 Internal Server Error**:
   - Database connection issues
   - TermGroup creation failures
   - Unexpected server errors

### Error Response Format:
```json
{
  "error": "Error message here",
  "details": "Additional error details if available"
}
```

## Common Use Cases

### 1. Creating Basic Responsibility
```javascript
// Minimal responsibility creation
const responsibility = {
  action_id: 1,  // "Manage"
  object_id: 2,  // "Database Systems"
  mainTerm: {
    value: "Manage Database Systems",
    description: "Responsible for managing and maintaining database systems",
    language_id: 1,  // English
    term_type_id: 1  // Main term
  }
};
```

### 2. Multilingual Responsibility
```javascript
// Responsibility with multiple language terms
const responsibility = {
  action_id: 3,  // "Develop"
  object_id: 4,  // "Web Applications"
  mainTerm: {
    value: "Develop Web Applications",
    description: "Create and maintain web applications",
    language_id: 1,  // English
    term_type_id: 1  // Main term
  },
  terms: [
    {
      value: "Разрабатывать веб-приложения",
      description: "Создавать и поддерживать веб-приложения",
      language_id: 2,  // Russian
      term_type_id: 2  // Additional term
    }
  ]
};
```

### 3. Job Description Integration
```javascript
// Multiple responsibilities for a job description
const responsibilities = [
  {
    action_id: 1,  // "Manage"
    object_id: 2,  // "Database Systems"
    mainTerm: { value: "Manage Database Systems", language_id: 1, term_type_id: 1 }
  },
  {
    action_id: 3,  // "Develop"
    object_id: 4,  // "Web Applications"
    mainTerm: { value: "Develop Web Applications", language_id: 1, term_type_id: 1 }
  },
  {
    action_id: 5,  // "Monitor"
    object_id: 6,  // "System Performance"
    mainTerm: { value: "Monitor System Performance", language_id: 1, term_type_id: 1 }
  }
];
```

## Advantages

1. **Structured Approach**: Clear separation of Actions and Objects
2. **Multilingual Support**: Full internationalization through Term System
3. **Reusability**: Actions and Objects can be reused across multiple responsibilities
4. **Consistency**: Standardized format for job descriptions
5. **Flexibility**: Easy to add new languages and terms
6. **Validation**: Built-in validation for data integrity
7. **Scalability**: Efficient database design with proper relationships

## Current Status and Future Considerations

### Current Implementation:
- ✅ **Full CRUD operations** via REST API
- ✅ **Multilingual support** through Term System
- ✅ **Frontend interface** with form validation
- ✅ **Token API support** for external integrations
- ✅ **Pagination and filtering** for large datasets
- ✅ **Unique constraint** on action-object combinations
- ✅ **Cascade operations** for data integrity

### Potential Enhancements:
- 🔄 **MCP Functions**: Add dedicated MCP functions for easier AI integration
- 🔄 **Bulk Operations**: Support for creating multiple responsibilities at once
- 🔄 **Templates**: Pre-defined responsibility templates for common job roles
- 🔄 **Analytics**: Usage statistics and popular combinations
- 🔄 **Versioning**: Track changes to responsibilities over time
- 🔄 **Approval Workflow**: Multi-step approval process for new responsibilities

### Integration Points:
- **Profession Model**: Responsibilities can be linked to specific professions
- **Job Descriptions**: Responsibilities form the core of job descriptions
- **AI Validation**: Integration with AI validation service for quality checks
- **Reporting**: Export responsibilities for HR and recruitment systems

## Examples

### Common Responsibility Examples:

1. **Software Development**:
   - Action: "Develop" + Object: "Web Applications"
   - Action: "Maintain" + Object: "Legacy Systems"
   - Action: "Debug" + Object: "Software Issues"

2. **Database Management**:
   - Action: "Manage" + Object: "Database Systems"
   - Action: "Optimize" + Object: "Query Performance"
   - Action: "Backup" + Object: "Data"

3. **Project Management**:
   - Action: "Lead" + Object: "Development Teams"
   - Action: "Coordinate" + Object: "Project Activities"
   - Action: "Monitor" + Object: "Project Progress"

4. **Quality Assurance**:
   - Action: "Test" + Object: "Software Applications"
   - Action: "Review" + Object: "Code Quality"
   - Action: "Validate" + Object: "User Requirements"

This comprehensive model provides a robust foundation for managing job responsibilities in a multilingual, scalable system that integrates seamlessly with the broader job description and professional development ecosystem.
