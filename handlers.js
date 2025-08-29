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
