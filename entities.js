import { makeRequest } from './api.js';

// Department functions
async function getDepartments(params = {}) {
  const { page = 1, limit = 10, search = '' } = params;
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search })
  });
  
  return await makeRequest(`departments?${queryParams}`);
}

async function getDepartment(departmentId) {
  return await makeRequest(`departments/${departmentId}`);
}

async function createDepartment(data) {
  return await makeRequest('departments', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

async function updateDepartment(departmentId, data) {
  return await makeRequest(`departments/${departmentId}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

async function deleteDepartment(departmentId) {
  return await makeRequest(`departments/${departmentId}`, {
    method: 'DELETE'
  });
}

// Profession functions
async function getProfessions(params = {}) {
  const { page = 1, limit = 10, search = '' } = params;
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search })
  });
  
  return await makeRequest(`professions?${queryParams}`);
}

async function getProfession(professionId) {
  return await makeRequest(`professions/${professionId}`);
}

async function createProfession(data) {
  return await makeRequest('professions', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

async function updateProfession(professionId, data) {
  return await makeRequest(`professions/${professionId}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

async function deleteProfession(professionId) {
  return await makeRequest(`professions/${professionId}`, {
    method: 'DELETE'
  });
}

// Status functions
async function getStatuses(params = {}) {
  const { page = 1, limit = 10, search = '' } = params;
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search })
  });
  
  return await makeRequest(`statuses?${queryParams}`);
}

async function getStatus(statusId) {
  return await makeRequest(`statuses/${statusId}`);
}

async function createStatus(data) {
  return await makeRequest('statuses', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

async function updateStatus(statusId, data) {
  return await makeRequest(`statuses/${statusId}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

async function deleteStatus(statusId) {
  return await makeRequest(`statuses/${statusId}`, {
    method: 'DELETE'
  });
}

// Language functions
async function getLanguages(params = {}) {
  const { page = 1, limit = 10, search = '' } = params;
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search })
  });
  
  return await makeRequest(`languages?${queryParams}`);
}

async function getLanguage(languageId) {
  return await makeRequest(`languages/${languageId}`);
}

async function createLanguage(data) {
  return await makeRequest('languages', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

async function updateLanguage(languageId, data) {
  return await makeRequest(`languages/${languageId}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

async function deleteLanguage(languageId) {
  return await makeRequest(`languages/${languageId}`, {
    method: 'DELETE'
  });
}

// Tool Type functions
async function getToolTypes(params = {}) {
  const { page = 1, limit = 10, search = '' } = params;
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search })
  });
  
  return await makeRequest(`tool-types?${queryParams}`);
}

async function getToolType(toolTypeId) {
  return await makeRequest(`tool-types/${toolTypeId}`);
}

async function createToolType(data) {
  return await makeRequest('tool-types', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

async function updateToolType(toolTypeId, data) {
  return await makeRequest(`tool-types/${toolTypeId}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

async function deleteToolType(toolTypeId) {
  return await makeRequest(`tool-types/${toolTypeId}`, {
    method: 'DELETE'
  });
}

// Tool functions
async function getTools(params = {}) {
  const { page = 1, limit = 10, search = '' } = params;
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search })
  });
  
  return await makeRequest(`tools?${queryParams}`);
}

async function getTool(toolId) {
  return await makeRequest(`tools/${toolId}`);
}

async function createTool(data) {
  return await makeRequest('tools', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

async function updateTool(toolId, data) {
  return await makeRequest(`tools/${toolId}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

async function deleteTool(toolId) {
  return await makeRequest(`tools/${toolId}`, {
    method: 'DELETE'
  });
}

export {
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
};
