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
  getActions, getAction, createAction, updateAction
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
  update_action: updateAction
};

export default toolHandlers;
