import {
  // Department functions
  getDepartments, getDepartment, createDepartment, updateDepartment,
  // Profession functions
  getProfessions, getProfession, createProfession, updateProfession,
  // Status functions
  getStatuses, getStatus, createStatus, updateStatus,
  // Language functions
  getLanguages, getLanguage, createLanguage, updateLanguage,
  // Term Type functions
  getTermTypes,
  // Tool Type functions
  getToolTypes, getToolType, createToolType, updateToolType,
  // Tool functions
  getTools, getTool, createTool, updateTool,
  // Action functions
  getActions, getAction, createAction, updateAction,
  // Object functions
  getObjects, getObject, createObject, updateObject,
  // Format functions
  getFormats, getFormat, createFormat, updateFormat,
  // Responsibility functions
  getResponsibilities, getResponsibility, createResponsibility, updateResponsibility,
  findExistingResponsibilityTerms,
  // Country functions
  getCountries, getCountry, createCountry, updateCountry,
  // City functions
  getCities, getCity, createCity, updateCity,
  // Industry functions
  getIndustries, getIndustry, createIndustry, updateIndustry,
  // Sub-Industry functions
  getSubIndustries, getSubIndustry, createSubIndustry, updateSubIndustry,
  // Individual Terms functions
  createTerm, updateTerm
} from './entities.js';

// UA/RU/EN resource aliases
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
  // statuses
  'статус': 'statuses', 'статуси': 'statuses', 'статусы': 'statuses', 'status': 'statuses', 'statuses': 'statuses',
  // countries
  'країна': 'countries', 'країни': 'countries', 'страна': 'countries', 'страны': 'countries', 'country': 'countries', 'countries': 'countries',
  // cities
  'місто': 'cities', 'міста': 'cities', 'город': 'cities', 'города': 'cities', 'city': 'cities', 'cities': 'cities',
  // industries
  'індустрія': 'industries', 'індустрії': 'industries', 'индустрия': 'industries', 'индустрии': 'industries', 'industry': 'industries', 'industries': 'industries',
  // sub-industries
  'субіндустрія': 'sub_industries', 'субіндустрії': 'sub_industries', 'субиндустрия': 'sub_industries', 'субиндустрии': 'sub_industries', 'sub-industry': 'sub_industries', 'sub-industries': 'sub_industries',
  // tools
  'інструмент': 'tools', 'інструменти': 'tools', 'инструмент': 'tools', 'инструменты': 'tools', 'tool': 'tools', 'tools': 'tools',
  // tool types
  'тип інструменту': 'tool-types', 'типи інструментів': 'tool-types', 'тип инструмента': 'tool-types', 'типы инструментов': 'tool-types', 'tool type': 'tool-types', 'tool types': 'tool-types',
  // term types
  'тип терміну': 'term-types', 'типи термінів': 'term-types', 'тип термина': 'term-types', 'типы терминов': 'term-types', 'term type': 'term-types', 'term types': 'term-types',
  // actions
  'дія': 'actions', 'дії': 'actions', 'действие': 'actions', 'действия': 'actions', 'action': 'actions', 'actions': 'actions',
  // objects
  'обʼєкт': 'objects', 'объект': 'objects', 'объекты': 'objects', 'objects': 'objects', 'object': 'objects', 'обʼєкти': 'objects',
  // formats
  'формат': 'formats', 'формати': 'formats', 'форматы': 'formats', 'format': 'formats', 'formats': 'formats',
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

// Unified resource map
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
  statuses: {
    list: getStatuses,
    get: getStatus,
    create: createStatus,
    update: updateStatus,
  },
  countries: {
    list: getCountries,
    get: getCountry,
    create: createCountry,
    update: updateCountry,
  },
  cities: {
    list: getCities,
    get: getCity,
    create: createCity,
    update: updateCity,
  },
  industries: {
    list: getIndustries,
    get: getIndustry,
    create: createIndustry,
    update: updateIndustry,
  },
  'sub_industries': {
    list: getSubIndustries,
    get: getSubIndustry,
    create: createSubIndustry,
    update: updateSubIndustry,
  },
  tools: {
    list: getTools,
    get: getTool,
    create: createTool,
    update: updateTool,
  },
  'tool-types': {
    list: getToolTypes,
    get: getToolType,
    create: createToolType,
    update: updateToolType,
  },
  'term-types': {
    list: getTermTypes,
  },
  actions: {
    list: getActions,
    get: getAction,
    create: createAction,
    update: updateAction,
  },
  objects: {
    list: getObjects,
    get: getObject,
    create: createObject,
    update: updateObject,
  },
  formats: {
    list: getFormats,
    get: getFormat,
    create: createFormat,
    update: updateFormat,
  },
  responsibilities: {
    list: getResponsibilities,
    get: getResponsibility,
    create: createResponsibility,
    update: updateResponsibility,
  },
};

export async function list({ resource, ...params }) {
  const r = resolveResource(resource);
  const fn = RESOURCE_MAP[r]?.list;
  if (!fn) throw new Error(`List not supported for ${r}`);
  
  // Auto-add light mode parameters
  const modeRaw = process.env.MODE || 'standard';
  const mode = ['light', 'standard'].includes(modeRaw) ? modeRaw : 'standard';
  
  const effectiveParams = mode === 'light' 
    ? { ...params, all: true, isShort: true }
    : params;
    
  return await fn(effectiveParams);
}

export async function get({ resource, id, isShort }) {
  const r = resolveResource(resource);
  const fn = RESOURCE_MAP[r]?.get;
  if (!fn) throw new Error(`Get not supported for ${r}`);
  return await fn(id, { isShort });
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
  let effectivePayload = payload;
  // Merge with existing terms to always send FULL terms array when applicable
  if (shouldMergeTerms(r)) {
    effectivePayload = await mergePayloadWithExisting(r, id, effectivePayload);
    // Downstream updaters that also merge can skip their internal merge
    effectivePayload = { preserveExistingTerms: false, ...effectivePayload };
  }
  return await fn(id, effectivePayload);
}

// Re-export essential specialized handlers for direct routing
export { getTermTypes, findExistingResponsibilityTerms, createTerm, updateTerm };

// Tool handlers mapping
const toolHandlers = {
  // Department handlers
  get_departments: getDepartments,
  get_department: getDepartment,
  create_department: createDepartment,
  update_department: updateDepartment,
  
  // Profession handlers
  get_professions: getProfessions,
  get_profession: getProfession,
  create_profession: createProfession,
  update_profession: updateProfession,
  
  // Status handlers
  get_statuses: getStatuses,
  get_status: getStatus,
  create_status: createStatus,
  update_status: updateStatus,
  
  // Language handlers
  get_languages: getLanguages,
  get_language: getLanguage,
  create_language: createLanguage,
  update_language: updateLanguage,
  
  // Term Type handlers
  get_term_types: getTermTypes,
  
  // Tool Type handlers
  get_tool_types: getToolTypes,
  get_tool_type: getToolType,
  create_tool_type: createToolType,
  update_tool_type: updateToolType,
  
  // Tool handlers
  get_tools: getTools,
  get_tool: getTool,
  create_tool: createTool,
  update_tool: updateTool,
  
  // Action handlers
  get_actions: getActions,
  get_action: getAction,
  create_action: createAction,
  update_action: updateAction,
  
  // Object handlers
  get_objects: getObjects,
  get_object: getObject,
  create_object: createObject,
  update_object: updateObject,
  
  // Format handlers
  get_formats: getFormats,
  get_format: getFormat,
  create_format: createFormat,
  update_format: updateFormat,
  
  // Country handlers
  get_countries: getCountries,
  get_country: getCountry,
  create_country: createCountry,
  update_country: updateCountry,

  // City handlers
  get_cities: getCities,
  get_city: getCity,
  create_city: createCity,
  update_city: updateCity,

  // Industry handlers
  get_industries: getIndustries,
  get_industry: getIndustry,
  create_industry: createIndustry,
  update_industry: updateIndustry,

  // Sub-Industry handlers
  get_sub_industries: getSubIndustries,
  get_sub_industry: getSubIndustry,
  create_sub_industry: createSubIndustry,
  update_sub_industry: updateSubIndustry,

  // Responsibility handlers
  get_responsibilities: getResponsibilities,
  get_responsibility: getResponsibility,
  create_responsibility: createResponsibility,
  update_responsibility: updateResponsibility,
  find_existing_responsibility_terms: findExistingResponsibilityTerms,

  // Individual Terms handlers
  create_term: createTerm,
  update_term: updateTerm,

};

export default toolHandlers;

// --- Merge helpers for updates ---
const TERM_MANAGED_RESOURCES = new Set([
  'departments','professions','languages','countries','cities',
  'industries','sub_industries','actions','objects','responsibilities','formats'
]);

function shouldMergeTerms(resourceKey) {
  return TERM_MANAGED_RESOURCES.has(resourceKey);
}

async function mergePayloadWithExisting(resourceKey, id, incoming) {
  const getFn = RESOURCE_MAP[resourceKey]?.get;
  if (!getFn) return incoming;
  const existing = await getFn(id, { isShort: false });
  const merged = { ...existing, ...incoming };

  // mainTerm: keep incoming if provided, else use existing
  if (incoming && Object.prototype.hasOwnProperty.call(incoming, 'mainTerm')) {
    merged.mainTerm = incoming.mainTerm || existing.mainTerm;
  } else if (existing.mainTerm) {
    merged.mainTerm = existing.mainTerm;
  }

  // terms: if provided, merge by id; else keep existing
  if (Array.isArray(incoming?.terms)) {
    const existingTerms = Array.isArray(existing.terms) ? existing.terms : [];
    const mergedTerms = [...existingTerms];
    for (const newTerm of incoming.terms) {
      const idx = newTerm && newTerm.id != null ? mergedTerms.findIndex(t => t.id === newTerm.id) : -1;
      if (idx >= 0) {
        mergedTerms[idx] = { ...mergedTerms[idx], ...newTerm };
      } else {
        mergedTerms.push(newTerm);
      }
    }
    merged.terms = mergedTerms;
  } else if (Array.isArray(existing.terms)) {
    merged.terms = existing.terms;
  }

  // Strip fields that backend may not accept on update (like id on root level)
  delete merged.id;
  return merged;
}
