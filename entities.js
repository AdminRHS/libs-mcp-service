const { makeRequest } = require('./api.js');

// Department functions
async function getDepartments(params = {}) {
  const { page = 1, limit = 10, search = '' } = params;
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search })
  });
  
  return await makeRequest(`/department?${queryParams}`);
}

async function getDepartment(departmentId) {
  return await makeRequest(`/department/${departmentId}`);
}

async function createDepartment(data) {
  return await makeRequest('/department', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

async function updateDepartment(departmentId, data) {
  return await makeRequest(`/department/${departmentId}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

async function deleteDepartment(departmentId) {
  return await makeRequest(`/department/${departmentId}`, {
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
  
  return await makeRequest(`/profession?${queryParams}`);
}

async function getProfession(professionId) {
  return await makeRequest(`/profession/${professionId}`);
}

async function createProfession(data) {
  return await makeRequest('/profession', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

async function updateProfession(professionId, data) {
  return await makeRequest(`/profession/${professionId}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

async function deleteProfession(professionId) {
  return await makeRequest(`/profession/${professionId}`, {
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
  
  return await makeRequest(`/status?${queryParams}`);
}

async function getStatus(statusId) {
  return await makeRequest(`/status/${statusId}`);
}

async function createStatus(data) {
  return await makeRequest('/status', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

async function updateStatus(statusId, data) {
  return await makeRequest(`/status/${statusId}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

async function deleteStatus(statusId) {
  return await makeRequest(`/status/${statusId}`, {
    method: 'DELETE'
  });
}

// Priority functions
async function getPriorities(params = {}) {
  const { page = 1, limit = 10, search = '' } = params;
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search })
  });
  
  return await makeRequest(`/priority?${queryParams}`);
}

async function getPriority(priorityId) {
  return await makeRequest(`/priority/${priorityId}`);
}

async function createPriority(data) {
  return await makeRequest('/priority', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

async function updatePriority(priorityId, data) {
  return await makeRequest(`/priority/${priorityId}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

async function deletePriority(priorityId) {
  return await makeRequest(`/priority/${priorityId}`, {
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
  
  return await makeRequest(`/language?${queryParams}`);
}

async function getLanguage(languageId) {
  return await makeRequest(`/language/${languageId}`);
}

async function createLanguage(data) {
  return await makeRequest('/language', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

async function updateLanguage(languageId, data) {
  return await makeRequest(`/language/${languageId}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

async function deleteLanguage(languageId) {
  return await makeRequest(`/language/${languageId}`, {
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
  
  return await makeRequest(`/tool-type?${queryParams}`);
}

async function getToolType(toolTypeId) {
  return await makeRequest(`/tool-type/${toolTypeId}`);
}

async function createToolType(data) {
  return await makeRequest('/tool-type', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

async function updateToolType(toolTypeId, data) {
  return await makeRequest(`/tool-type/${toolTypeId}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

async function deleteToolType(toolTypeId) {
  return await makeRequest(`/tool-type/${toolTypeId}`, {
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
  
  return await makeRequest(`/tools?${queryParams}`);
}

async function getTool(toolId) {
  return await makeRequest(`/tools/${toolId}`);
}

async function createTool(data) {
  return await makeRequest('/tools', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

async function updateTool(toolId, data) {
  return await makeRequest(`/tools/${toolId}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

async function deleteTool(toolId) {
  return await makeRequest(`/tools/${toolId}`, {
    method: 'DELETE'
  });
}

module.exports = {
  // Department functions
  getDepartments, getDepartment, createDepartment, updateDepartment, deleteDepartment,
  // Profession functions
  getProfessions, getProfession, createProfession, updateProfession, deleteProfession,
  // Status functions
  getStatuses, getStatus, createStatus, updateStatus, deleteStatus,
  // Priority functions
  getPriorities, getPriority, createPriority, updatePriority, deletePriority,
  // Language functions
  getLanguages, getLanguage, createLanguage, updateLanguage, deleteLanguage,
  // Tool Type functions
  getToolTypes, getToolType, createToolType, updateToolType, deleteToolType,
  // Tool functions
  getTools, getTool, createTool, updateTool, deleteTool
};
