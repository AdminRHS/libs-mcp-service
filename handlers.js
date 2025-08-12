const {
  // Department functions
  getDepartments, getDepartment, createDepartment, updateDepartment, deleteDepartment,
  // Profession functions
  getProfessions, getProfession, createProfession, updateProfession, deleteProfession,
  // Status functions
  getStatuses, getStatus, createStatus, updateStatus, deleteStatus,
  // Language functions
  getLanguages, getLanguage, createLanguage, updateLanguage, deleteLanguage,
  // Tool Type functions
  getToolTypes, getToolType, createToolType, updateToolType, deleteToolType,
  // Tool functions
  getTools, getTool, createTool, updateTool, deleteTool
} = require('./entities.js');

// Tool handlers mapping
const toolHandlers = {
  // Department handlers
  get_departments: getDepartments,
  get_department: getDepartment,
  create_department: createDepartment,
  update_department: updateDepartment,
  delete_department: deleteDepartment,
  
  // Profession handlers
  get_professions: getProfessions,
  get_profession: getProfession,
  create_profession: createProfession,
  update_profession: updateProfession,
  delete_profession: deleteProfession,
  
  // Status handlers
  get_statuses: getStatuses,
  get_status: getStatus,
  create_status: createStatus,
  update_status: updateStatus,
  delete_status: deleteStatus,
  
  // Language handlers
  get_languages: getLanguages,
  get_language: getLanguage,
  create_language: createLanguage,
  update_language: updateLanguage,
  delete_language: deleteLanguage,
  
  // Tool Type handlers
  get_tool_types: getToolTypes,
  get_tool_type: getToolType,
  create_tool_type: createToolType,
  update_tool_type: updateToolType,
  delete_tool_type: deleteToolType,
  
  // Tool handlers
  get_tools: getTools,
  get_tool: getTool,
  create_tool: createTool,
  update_tool: updateTool,
  delete_tool: deleteTool
};

module.exports = toolHandlers;
