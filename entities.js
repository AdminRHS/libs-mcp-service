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

// Term Type functions
async function getTermTypes(params = {}) {
  const { page = 1, limit = 10, search = '' } = params;
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search })
  });
  
  return await makeRequest(`term-types?${queryParams}`);
}

// Country functions
async function getCountries(params = {}) {
  const { page = 1, limit = 10, search = '' } = params;
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search })
  });
  return await makeRequest(`countries?${queryParams}`);
}

async function getCountry(countryId) {
  return await makeRequest(`countries/${countryId}`);
}

async function createCountry(data) {
  return await makeRequest('countries', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

async function updateCountry(countryId, data) {
  return await makeRequest(`countries/${countryId}`, {
    method: 'PUT',
    body: JSON.stringify(data)
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

// Action functions
async function getActions(params = {}) {
  const { page = 1, limit = 10, search = '' } = params;
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search })
  });
  
  return await makeRequest(`actions?${queryParams}`);
}

async function getAction(actionId) {
  return await makeRequest(`actions/${actionId}`);
}

async function createAction(data) {
  return await makeRequest('actions', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

async function updateAction(actionId, data) {
  return await makeRequest(`actions/${actionId}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

// Object functions
async function getObjects(params = {}) {
  const { page = 1, limit = 10, search = '' } = params;
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search })
  });
  
  return await makeRequest(`objects?${queryParams}`);
}

async function getObject(objectId) {
  return await makeRequest(`objects/${objectId}`);
}

async function createObject(data) {
  return await makeRequest('objects', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

async function updateObject(objectId, data) {
  return await makeRequest(`objects/${objectId}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

// Format functions
async function getFormats(params = {}) {
  const { page = 1, limit = 10, search = '' } = params;
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search })
  });
  
  return await makeRequest(`formats?${queryParams}`);
}

async function getFormat(formatId) {
  return await makeRequest(`formats/${formatId}`);
}

async function createFormat(data) {
  return await makeRequest('formats', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

async function updateFormat(formatId, data) {
  return await makeRequest(`formats/${formatId}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

// Responsibility functions
async function getResponsibilities(params = {}) {
  const { page = 1, limit = 10, search = '', language_ids, action_id, object_id, filters, all } = params;
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search }),
    ...(language_ids && { language_ids: JSON.stringify(language_ids) }),
    ...(action_id && { action_id: action_id.toString() }),
    ...(object_id && { object_id: object_id.toString() }),
    ...(filters && { filters }),
    ...(all && { all })
  });
  
  return await makeRequest(`responsibilities?${queryParams}`);
}

async function getResponsibility(responsibilityId) {
  return await makeRequest(`responsibilities/${responsibilityId}`);
}

async function createResponsibility(data) {
  return await makeRequest('responsibilities', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

async function updateResponsibility(responsibilityId, data) {
  return await makeRequest(`responsibilities/${responsibilityId}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

async function findExistingResponsibilityTerms(params = {}) {
  const { language_id, term_type_id, action_id, object_id, search = '' } = params;
  const queryParams = new URLSearchParams({
    language_id: language_id.toString(),
    term_type_id: term_type_id.toString(),
    action_id: action_id.toString(),
    object_id: object_id.toString(),
    ...(search && { search })
  });
  
  return await makeRequest(`responsibilities/find-existing-terms?${queryParams}`);
}

// City functions
async function getCities(params = {}) {
  const { page = 1, limit = 10, search = '' } = params;
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search })
  });
  return await makeRequest(`cities?${queryParams}`);
}

async function getCity(cityId) {
  return await makeRequest(`cities/${cityId}`);
}

async function createCity(data) {
  return await makeRequest('cities', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

async function updateCity(cityId, data) {
  return await makeRequest(`cities/${cityId}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

// Industry functions
async function getIndustries(params = {}) {
  const { page = 1, limit = 10, search = '' } = params;
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search })
  });
  return await makeRequest(`industries?${queryParams}`);
}

async function getIndustry(industryId) {
  return await makeRequest(`industries/${industryId}`);
}

async function createIndustry(data) {
  return await makeRequest('industries', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

async function updateIndustry(industryId, data) {
  return await makeRequest(`industries/${industryId}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

// Sub-Industry functions
async function getSubIndustries(params = {}) {
  const { page = 1, limit = 10, search = '', industry_id } = params;
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search }),
    ...(industry_id && { industry_id: industry_id.toString() })
  });
  return await makeRequest(`sub_industries?${queryParams}`);
}

async function getSubIndustry(subIndustryId) {
  return await makeRequest(`sub_industries/${subIndustryId}`);
}

async function createSubIndustry(data) {
  return await makeRequest('sub_industries', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

async function updateSubIndustry(subIndustryId, data) {
  return await makeRequest(`sub_industries/${subIndustryId}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

export {
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
  // Country functions
  getCountries, getCountry, createCountry, updateCountry,
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
  // City functions
  getCities, getCity, createCity, updateCity,
  // Industry functions
  getIndustries, getIndustry, createIndustry, updateIndustry,
  // Sub-Industry functions
  getSubIndustries, getSubIndustry, createSubIndustry, updateSubIndustry
};
