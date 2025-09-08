## MCP Light Mode and Universal Tools Migration - Session Summary

### Goals
- Simplify MCP usage for non-technical users with a light mode.
- Reduce token usage by shortening tool lists and responses.
- Consolidate many entity-specific tools into 4 universal tools.

### Decisions
- ENV-based mode: `MODE=light|standard`.
- Light mode behavior:
  - For list endpoints: default `all=true` and `iShort=true` if not provided.
  - For single get: return `{ id, name }` when in light mode or when `iShort=true`.
- Keep a single MCP; avoid duplicating servers.
- Introduce 4 universal tools: `list`, `get`, `create`, `update`.
- Resource resolution supports UA/RU/EN via synonyms map in handlers.
- Optionally hide legacy tools in `tools/list` when in light mode to further reduce tokens.

### Implementation Plan
- entities.js
  - Add `isLight()` helper to check `MODE`.
  - Add `buildListQuery(params)` to augment queries with `all=true` and `iShort=true` in light mode.
  - Apply `buildListQuery` across all list functions.
  - For single get functions, support optional short projection `{ id, name }` in light mode.

- handlers.js
  - Add `ALIASES` map: UA/RU/EN synonyms → canonical resource keys (e.g., `departments`).
  - `resolveResource(input)` normalizes and resolves to canonical key.
  - `RESOURCE_MAP` binds canonical resource → `{ list, get, create, update }` functions from `entities.js`.
  - Implement universal handlers: `list({ resource, ...params })`, `get({ resource, id, iShort })`, `create({ resource, payload })`, `update({ resource, id, payload })`.

- tools.js
  - Add 4 universal tools with minimal schemas:
    - list: `{ resource, page?, limit?, search?, all?, iShort? }`
    - get: `{ resource, id, iShort? }`
    - create: `{ resource, payload }`
    - update: `{ resource, id, payload }`
  - Keep descriptions concise to reduce token usage.

- index.js
  - Route `CallToolRequest` for `list|get|create|update` to the new handlers.
  - In `ListToolsRequest`, if `MODE=light`, optionally return only the universal tools.

### Light Mode Parameters
- Lists: `all=true`, `iShort=true` (automatically added unless explicitly provided).
- Single get: short projection `{ id, name }` in light mode or when `iShort=true`.

### UA/RU/EN Resource Resolution Examples
- "департаменти", "відділи", "отделы", "department(s)" → `departments`.
- Same pattern to be added for other entities (professions, languages, etc.).

### Migration Strategy
- Add universal tools and mode logic while keeping legacy tools for compatibility.
- In light mode, show only universal tools to reduce tokens.
- Migrate clients gradually; remove legacy tools later if desired.

### Rationale
- Single MCP keeps maintenance simple.
- Universal tools drastically reduce tool count and token overhead.
- Light mode ensures concise responses and efficient listings for non-technical flows.

### Next Steps
1) Implement `isLight()` and `buildListQuery()` in `entities.js` and apply.
2) Add `ALIASES`, `resolveResource`, `RESOURCE_MAP`, and universal handlers in `handlers.js`.
3) Add universal tools in `tools.js` and minimal descriptions.
4) Update routing in `index.js` and filter tools by mode in `tools/list`.
5) Test UA/RU/EN resource resolution and light behavior for departments, professions, languages.


### Additions From This Chat
- Environment variable renamed to `MODE` with validation: only 'light' or 'standard' (defaults to 'standard' with a warning when invalid). Code paths updated in `entities.js` and `index.js`.
- Tools consolidation finalized: kept only 4 universal tools (`list`, `get`, `create`, `update`) plus essential specials that cannot be expressed via universal ones:
  - `get_term_types`
  - `find_existing_responsibility_terms`
  - `create_term`
  - `update_term`
- Server routing in `index.js` updated to handle only the 4 universal tools and the essential specials listed above.
- Conditional JSON Schemas added to universal `create` and `update` tools: `payload` is validated per `resource` using `if/then` branches and existing term schema builders. Resources covered: `departments`, `professions`, `languages`, `industries`, `sub_industries`, `countries`, `cities`, `actions`, `objects`, `responsibilities`, `formats`.
- Light mode behavior implemented in `entities.js`: `buildListQuery` auto-adds `all=true` and `iShort=true` in light mode; single `get` returns `{ id, name }` when light or `iShort=true`.
- UA/RU/EN aliases resolver added in `handlers.js` and used by unified handlers.
- Tool listing: now returns universal tools; essential specials are also listed. In light mode we still filter to reduce noise where applicable.
- Tests: automated tests intentionally skipped per request; a manual checklist was documented.

