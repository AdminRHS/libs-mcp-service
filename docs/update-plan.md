## Міграція на 4 універсальні інструменти + light‑режим

- **ENV режим**: `MODE=light|standard`
- **Універсальні інструменти**: `list`, `get`, `create`, `update`
- **Light‑поведінка**:
  - `list`: автододає `all=true`, `iShort=true` (якщо не передано інакше)
  - `get`: повертає тільки `{ id, name }` при `MODE=light` або `iShort=true`
- **Резолв ресурсів з UA/RU/EN** через мапу синонімів

### 1) `entities.js`
Додай хелпери та застосуй їх у всіх list‑ендпоінтах; в одиничних `get_*` — коротка проекція в light.

```js
function isLight() {
  return process.env.MODE === 'light';
}

function buildListQuery(params = {}) {
  const { page = 1, limit = 10, search = '', ...rest } = params;
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    ...(search && { search })
  });
  Object.entries(rest).forEach(([k, v]) => {
    if (v !== undefined && v !== null) query.set(k, typeof v === 'boolean' ? String(v) : String(v));
  });
  if (isLight()) {
    if (!query.has('all')) query.set('all', 'true');
    if (!query.has('iShort')) query.set('iShort', 'true');
  }
  return query;
}

// Приклад використання у списках:
async function getDepartments(params = {}) {
  const query = buildListQuery(params);
  return await makeRequest(`departments?${query}`);
}

// Приклад проекції для одиничного:
async function getDepartment(departmentId, opts = {}) {
  const data = await makeRequest(`departments/${departmentId}`);
  if (isLight() && opts.iShort !== false) return { id: data?.id, name: data?.name };
  return data;
}
```

Застосуй `buildListQuery` до всіх `get_*` списків (`get_professions`, `get_languages`, …) і `{ id, name }` проекцію для всіх одиничних `get_*`.

### 2) `handlers.js`
Додай резолвер ресурсів і роутинг для універсальних інструментів.

```js
const ALIASES = {
  // departments
  'департамент': 'departments', 'департаменти': 'departments', 'відділ': 'departments', 'відділи': 'departments',
  'отдел': 'departments', 'отделы': 'departments', 'department': 'departments', 'departments': 'departments',
  // professions
  'професія': 'professions', 'професії': 'professions', 'профессия': 'professions', 'профессии': 'professions',
  'profession': 'professions', 'professions': 'professions',
  // languages
  'мова': 'languages', 'мови': 'languages', 'язык': 'languages', 'языки': 'languages',
  'language': 'languages', 'languages': 'languages',
  // додай інші сутності за потреби…
};

function resolveResource(input) {
  if (!input) throw new Error('Resource is required');
  const key = String(input).toLowerCase().trim();
  const canonical = ALIASES[key] || null;
  if (!canonical) {
    const known = [...new Set(Object.values(ALIASES))].sort();
    throw new Error(`Unknown resource "${input}". Try one of: ${known.join(', ')}`);
  }
  return canonical;
}

const RESOURCE_MAP = {
  departments: {
    list: getDepartments,
    get: getDepartment,
    create: createDepartment,
    update: updateDepartment,
  },
  professions: {
    list: getProfessions,
    get: getProfession,
    create: createProfession,
    update: updateProfession,
  },
  languages: {
    list: getLanguages,
    get: getLanguage,
    create: createLanguage,
    update: updateLanguage,
  },
  // ... інші сутності
};

export async function list({ resource, ...params }) {
  const r = resolveResource(resource);
  const fn = RESOURCE_MAP[r]?.list;
  if (!fn) throw new Error(`List not supported for ${r}`);
  return await fn(params);
}

export async function get({ resource, id, iShort }) {
  const r = resolveResource(resource);
  const fn = RESOURCE_MAP[r]?.get;
  if (!fn) throw new Error(`Get not supported for ${r}`);
  // передаємо iShort як опцію, щоб одиничні get могли робити коротку проекцію
  return await fn(id, { iShort });
}

export async function create({ resource, payload }) {
  const r = resolveResource(resource);
  const fn = RESOURCE_MAP[r]?.create;
  if (!fn) throw new Error(`Create not supported for ${r}`);
  return await fn(payload);
}

export async function update({ resource, id, payload }) {
  const r = resolveResource(resource);
  const fn = RESOURCE_MAP[r]?.update;
  if (!fn) throw new Error(`Update not supported for ${r}`);
  return await fn(id, payload);
}
```

### 3) `tools.js`
Додай 4 універсальні інструменти (короткі схеми, мінімум токенів). У light‑режимі можеш приховати легасі інструменти, показуючи тільки ці.

```js
{
  name: 'list',
  description: 'List entities (supports UA/RU/EN resource names)',
  inputSchema: {
    type: 'object',
    properties: {
      resource: { type: 'string', description: 'Entity name or synonym (e.g., департаменти | отделы | departments)' },
      page: { type: 'number' },
      limit: { type: 'number' },
      search: { type: 'string' },
      all: { type: 'string', enum: ['true','false'] },
      iShort: { type: 'string', enum: ['true','false'] },
    },
    required: ['resource']
  }
},
{
  name: 'get',
  description: 'Get single entity by ID (short form in light mode)',
  inputSchema: {
    type: 'object',
    properties: {
      resource: { type: 'string' },
      id: { type: 'string' },
      iShort: { type: 'string', enum: ['true','false'] },
    },
    required: ['resource', 'id']
  }
},
{
  name: 'create',
  description: 'Create entity with payload',
  inputSchema: {
    type: 'object',
    properties: {
      resource: { type: 'string' },
      payload: { type: 'object' },
    },
    required: ['resource', 'payload']
  }
},
{
  name: 'update',
  description: 'Update entity by ID with payload',
  inputSchema: {
    type: 'object',
    properties: {
      resource: { type: 'string' },
      id: { type: 'string' },
      payload: { type: 'object' },
    },
    required: ['resource', 'id', 'payload']
  }
}
```

### 4) `index.js`
Додай роутинг нових інструментів і (опційно) фільтрацію списку інструментів за режимом.

```js
import * as unified from './handlers.js';

server.setRequestHandler(ListToolsRequestSchema, async () => {
  const mode = process.env.MODE || 'standard';
  const base = tools;
  // Опція: у light показати лише універсальні
  const filtered = mode === 'light'
    ? base.filter(t => ['list','get','create','update'].includes(t.name)) // або тільки ['list','get']
    : base;
  return { tools: filtered };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  let result;
  switch (name) {
    case 'list': result = await unified.list(args); break;
    case 'get': result = await unified.get(args); break;
    case 'create': result = await unified.create(args); break;
    case 'update': result = await unified.update(args); break;
    // залиш решту кейсів на час міграції
    default: /* існуючий роутинг */ ;
  }
  return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
});
```

### 5) Тести
- UA/RU резолв:
  - `list({ resource: 'департаменти' })` → `departments`
  - `get({ resource: 'отдел', id: 1 })` → `departments/1`
- Light режим:
  - `MODE=light` → `list` додає `all=true`, `iShort=true`; `get` повертає `{ id, name }`.

### 6) Міграція
- Показуй лише універсальні інструменти у light‑режимі.
- Поступово переведи клієнтів; легасі інструменти можна видалити пізніше.