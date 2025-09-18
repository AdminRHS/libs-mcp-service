import { makeRequest } from './api.js';

// Light-mode helpers
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
  Object.entries(rest).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      query.set(key, typeof value === 'boolean' ? String(value) : String(value));
    }
  });
  if (isLight()) {
    if (!query.has('all')) query.set('all', 'true');
    if (!query.has('isShort')) query.set('isShort', 'true');
  }
  return query;
}

// Department functions
async function getDepartments(params = {}) {
  const query = buildListQuery(params);
  return await makeRequest(`departments?${query}`);
}

async function getDepartment(departmentId, opts = {}) {
  const data = await makeRequest(`departments/${departmentId}`);
  return data;
}

async function createDepartment(data) {
  return await makeRequest('departments', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

async function updateDepartment(departmentId, data) {
  const { preserveExistingTerms = true, ...updateData } = data;
  
  if (preserveExistingTerms) {
    const existingDept = await getDepartment(departmentId);
    const existingTerms = existingDept.terms || [];
    
    if (data.terms) {
      const newTerms = data.terms;
      const mergedTerms = [...existingTerms];
      
      newTerms.forEach(newTerm => {
        const existingIndex = mergedTerms.findIndex(t => t.id === newTerm.id);
        if (existingIndex >= 0) {
          mergedTerms[existingIndex] = { ...mergedTerms[existingIndex], ...newTerm };
        } else {
          mergedTerms.push(newTerm);
        }
      });
      
      updateData.terms = mergedTerms;
    } else {
      updateData.terms = existingTerms;
    }
  }
  
  return await makeRequest(`departments/${departmentId}`, {
    method: 'PUT',
    body: JSON.stringify(updateData)
  });
}

// Profession functions
async function getProfessions(params = {}) {
  const query = buildListQuery(params);
  return await makeRequest(`professions?${query}`);
}

async function getProfession(professionId, opts = {}) {
  const data = await makeRequest(`professions/${professionId}`);
  return data;
}

async function createProfession(data) {
  return await makeRequest('professions', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

async function updateProfession(professionId, data) {
  const { preserveExistingTerms = true, ...updateData } = data;
  
  if (preserveExistingTerms) {
    const existingProf = await getProfession(professionId);
    const existingTerms = existingProf.terms || [];
    
    if (data.terms) {
      const newTerms = data.terms;
      const mergedTerms = [...existingTerms];
      
      newTerms.forEach(newTerm => {
        const existingIndex = mergedTerms.findIndex(t => t.id === newTerm.id);
        if (existingIndex >= 0) {
          mergedTerms[existingIndex] = { ...mergedTerms[existingIndex], ...newTerm };
        } else {
          mergedTerms.push(newTerm);
        }
      });
      
      updateData.terms = mergedTerms;
    } else {
      updateData.terms = existingTerms;
    }
  }
  
  return await makeRequest(`professions/${professionId}`, {
    method: 'PUT',
    body: JSON.stringify(updateData)
  });
}

// Status functions
async function getStatuses(params = {}) {
  const query = buildListQuery(params);
  return await makeRequest(`statuses?${query}`);
}

async function getStatus(statusId, opts = {}) {
  const data = await makeRequest(`statuses/${statusId}`);
  return data;
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
  const query = buildListQuery(params);
  return await makeRequest(`languages?${query}`);
}

async function getLanguage(languageId, opts = {}) {
  const data = await makeRequest(`languages/${languageId}`);
  return data;
}

async function createLanguage(data) {
  return await makeRequest('languages', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

async function updateLanguage(languageId, data) {
  const { preserveExistingTerms = true, ...updateData } = data;
  
  if (preserveExistingTerms) {
    const existingLanguage = await getLanguage(languageId);
    const existingTerms = existingLanguage.terms || [];
    
    if (data.terms) {
      const newTerms = data.terms;
      const mergedTerms = [...existingTerms];
      
      newTerms.forEach(newTerm => {
        const existingIndex = mergedTerms.findIndex(t => t.id === newTerm.id);
        if (existingIndex >= 0) {
          mergedTerms[existingIndex] = { ...mergedTerms[existingIndex], ...newTerm };
        } else {
          mergedTerms.push(newTerm);
        }
      });
      
      updateData.terms = mergedTerms;
    } else {
      updateData.terms = existingTerms;
    }
  }
  
  return await makeRequest(`languages/${languageId}`, {
    method: 'PUT',
    body: JSON.stringify(updateData)
  });
}

// Term Type functions
async function getTermTypes(params = {}) {
  const query = buildListQuery(params);
  return await makeRequest(`term-types?${query}`);
}

// Country functions
async function getCountries(params = {}) {
  const query = buildListQuery(params);
  return await makeRequest(`countries?${query}`);
}

async function getCountry(countryId, opts = {}) {
  const data = await makeRequest(`countries/${countryId}`);
  if (isLight() && opts.isShort !== false) return { id: data?.id, name: data?.name };
  return data;
}

async function createCountry(data) {
  return await makeRequest('countries', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

async function updateCountry(countryId, data) {
  const { preserveExistingTerms = true, ...updateData } = data;
  
  if (preserveExistingTerms) {
    const existingCountry = await getCountry(countryId);
    const existingTerms = existingCountry.terms || [];
    
    if (data.terms) {
      const newTerms = data.terms;
      const mergedTerms = [...existingTerms];
      
      newTerms.forEach(newTerm => {
        const existingIndex = mergedTerms.findIndex(t => t.id === newTerm.id);
        if (existingIndex >= 0) {
          mergedTerms[existingIndex] = { ...mergedTerms[existingIndex], ...newTerm };
        } else {
          mergedTerms.push(newTerm);
        }
      });
      
      updateData.terms = mergedTerms;
    } else {
      updateData.terms = existingTerms;
    }
  }
  
  return await makeRequest(`countries/${countryId}`, {
    method: 'PUT',
    body: JSON.stringify(updateData)
  });
}

// Tool Type functions
async function getToolTypes(params = {}) {
  const query = buildListQuery(params);
  return await makeRequest(`tool-types?${query}`);
}

async function getToolType(toolTypeId, opts = {}) {
  const data = await makeRequest(`tool-types/${toolTypeId}`);
  if (isLight() && opts.isShort !== false) return { id: data?.id, name: data?.name };
  return data;
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
  const query = buildListQuery(params);
  return await makeRequest(`tools?${query}`);
}

async function getTool(toolId, opts = {}) {
  const data = await makeRequest(`tools/${toolId}`);
  return data;
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
  const query = buildListQuery(params);
  return await makeRequest(`actions?${query}`);
}

async function getAction(actionId, opts = {}) {
  const data = await makeRequest(`actions/${actionId}`);
  if (isLight() && opts.isShort !== false) return { id: data?.id, name: data?.name };
  return data;
}

async function createAction(data) {
  return await makeRequest('actions', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

async function updateAction(actionId, data) {
  const { preserveExistingTerms = true, ...updateData } = data;
  
  if (preserveExistingTerms) {
    const existingAction = await getAction(actionId);
    const existingTerms = existingAction.terms || [];
    
    if (data.terms) {
      const newTerms = data.terms;
      const mergedTerms = [...existingTerms];
      
      newTerms.forEach(newTerm => {
        const existingIndex = mergedTerms.findIndex(t => t.id === newTerm.id);
        if (existingIndex >= 0) {
          mergedTerms[existingIndex] = { ...mergedTerms[existingIndex], ...newTerm };
        } else {
          mergedTerms.push(newTerm);
        }
      });
      
      updateData.terms = mergedTerms;
    } else {
      updateData.terms = existingTerms;
    }
  }
  
  return await makeRequest(`actions/${actionId}`, {
    method: 'PUT',
    body: JSON.stringify(updateData)
  });
}

// Object functions
async function getObjects(params = {}) {
  const query = buildListQuery(params);
  return await makeRequest(`objects?${query}`);
}

async function getObject(objectId, opts = {}) {
  const data = await makeRequest(`objects/${objectId}`);
  if (isLight() && opts.isShort !== false) return { id: data?.id, name: data?.name };
  return data;
}

async function createObject(data) {
  return await makeRequest('objects', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

async function updateObject(objectId, data) {
  const { preserveExistingTerms = true, ...updateData } = data;
  
  if (preserveExistingTerms) {
    const existingObject = await getObject(objectId);
    const existingTerms = existingObject.terms || [];
    
    if (data.terms) {
      const newTerms = data.terms;
      const mergedTerms = [...existingTerms];
      
      newTerms.forEach(newTerm => {
        const existingIndex = mergedTerms.findIndex(t => t.id === newTerm.id);
        if (existingIndex >= 0) {
          mergedTerms[existingIndex] = { ...mergedTerms[existingIndex], ...newTerm };
        } else {
          mergedTerms.push(newTerm);
        }
      });
      
      updateData.terms = mergedTerms;
    } else {
      updateData.terms = existingTerms;
    }
  }
  
  return await makeRequest(`objects/${objectId}`, {
    method: 'PUT',
    body: JSON.stringify(updateData)
  });
}

// Format functions
async function getFormats(params = {}) {
  const query = buildListQuery(params);
  return await makeRequest(`formats?${query}`);
}

async function getFormat(formatId, opts = {}) {
  const data = await makeRequest(`formats/${formatId}`);
  if (isLight() && opts.isShort !== false) return { id: data?.id, name: data?.name };
  return data;
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

async function getResponsibility(responsibilityId, opts = {}) {
  const data = await makeRequest(`responsibilities/${responsibilityId}`);
  if (isLight() && opts.isShort !== false) return { id: data?.id, name: data?.name };
  return data;
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

async function findExistingSkillTerms(params = {}) {
  const { language_id, term_type_id, responsibility_id, tool_id, search = '' } = params;
  const queryParams = new URLSearchParams({
    language_id: language_id.toString(),
    term_type_id: term_type_id.toString(),
    responsibility_id: responsibility_id.toString(),
    tool_id: tool_id.toString(),
    ...(search && { search })
  });
  
  return await makeRequest(`skills/find-existing-terms?${queryParams}`);
}

// City functions
async function getCities(params = {}) {
  const query = buildListQuery(params);
  return await makeRequest(`cities?${query}`);
}

async function getCity(cityId, opts = {}) {
  const data = await makeRequest(`cities/${cityId}`);
  if (isLight() && opts.isShort !== false) return { id: data?.id, name: data?.name };
  return data;
}

async function createCity(data) {
  return await makeRequest('cities', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

async function updateCity(cityId, data) {
  const { preserveExistingTerms = true, ...updateData } = data;
  
  if (preserveExistingTerms) {
    const existingCity = await getCity(cityId);
    const existingTerms = existingCity.terms || [];
    
    if (data.terms) {
      const newTerms = data.terms;
      const mergedTerms = [...existingTerms];
      
      newTerms.forEach(newTerm => {
        const existingIndex = mergedTerms.findIndex(t => t.id === newTerm.id);
        if (existingIndex >= 0) {
          mergedTerms[existingIndex] = { ...mergedTerms[existingIndex], ...newTerm };
        } else {
          mergedTerms.push(newTerm);
        }
      });
      
      updateData.terms = mergedTerms;
    } else {
      updateData.terms = existingTerms;
    }
  }
  
  return await makeRequest(`cities/${cityId}`, {
    method: 'PUT',
    body: JSON.stringify(updateData)
  });
}

// Industry functions
async function getIndustries(params = {}) {
  const query = buildListQuery(params);
  return await makeRequest(`industries?${query}`);
}

async function getIndustry(industryId, opts = {}) {
  const data = await makeRequest(`industries/${industryId}`);
  if (isLight() && opts.isShort !== false) return { id: data?.id, name: data?.name };
  return data;
}

async function createIndustry(data) {
  return await makeRequest('industries', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

async function updateIndustry(industryId, data) {
  const { preserveExistingTerms = true, ...updateData } = data;
  
  if (preserveExistingTerms) {
    const existingIndustry = await getIndustry(industryId);
    const existingTerms = existingIndustry.terms || [];
    
    if (data.terms) {
      const newTerms = data.terms;
      const mergedTerms = [...existingTerms];
      
      newTerms.forEach(newTerm => {
        const existingIndex = mergedTerms.findIndex(t => t.id === newTerm.id);
        if (existingIndex >= 0) {
          mergedTerms[existingIndex] = { ...mergedTerms[existingIndex], ...newTerm };
        } else {
          mergedTerms.push(newTerm);
        }
      });
      
      updateData.terms = mergedTerms;
    } else {
      updateData.terms = existingTerms;
    }
  }
  
  return await makeRequest(`industries/${industryId}`, {
    method: 'PUT',
    body: JSON.stringify(updateData)
  });
}

// Sub-Industry functions
async function getSubIndustries(params = {}) {
  const query = buildListQuery(params);
  return await makeRequest(`sub-industries?${query}`);
}

async function getSubIndustry(subIndustryId, opts = {}) {
  const data = await makeRequest(`sub-industries/${subIndustryId}`);
  if (isLight() && opts.isShort !== false) return { id: data?.id, name: data?.name };
  return data;
}

async function createSubIndustry(data) {
  return await makeRequest('sub-industries', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

async function updateSubIndustry(subIndustryId, data) {
  const { preserveExistingTerms = true, ...updateData } = data;
  
  if (preserveExistingTerms) {
    const existingSubIndustry = await getSubIndustry(subIndustryId);
    const existingTerms = existingSubIndustry.terms || [];
    
    if (data.terms) {
      const newTerms = data.terms;
      const mergedTerms = [...existingTerms];
      
      newTerms.forEach(newTerm => {
        const existingIndex = mergedTerms.findIndex(t => t.id === newTerm.id);
        if (existingIndex >= 0) {
          mergedTerms[existingIndex] = { ...mergedTerms[existingIndex], ...newTerm };
        } else {
          mergedTerms.push(newTerm);
        }
      });
      
      updateData.terms = mergedTerms;
    } else {
      updateData.terms = existingTerms;
    }
  }
  
  return await makeRequest(`sub-industries/${subIndustryId}`, {
    method: 'PUT',
    body: JSON.stringify(updateData)
  });
}

// Shift functions
async function getShifts(params = {}) {
  const query = buildListQuery(params);
  return await makeRequest(`shifts?${query}`);
}

async function getShift(shiftId, opts = {}) {
  const data = await makeRequest(`shifts/${shiftId}`);
  return data;
}

async function createShift(data) {
  return await makeRequest('shifts', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

async function updateShift(shiftId, data) {
  return await makeRequest(`shifts/${shiftId}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

// Currency functions
async function getCurrencies(params = {}) {
  const query = buildListQuery(params);
  return await makeRequest(`currencies?${query}`);
}

async function getCurrency(currencyId, opts = {}) {
  const data = await makeRequest(`currencies/${currencyId}`);
  return data;
}

async function createCurrency(data) {
  return await makeRequest('currencies', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

async function updateCurrency(currencyId, data) {
  return await makeRequest(`currencies/${currencyId}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

// Level functions
async function getLevels(params = {}) {
  const query = buildListQuery(params);
  return await makeRequest(`levels?${query}`);
}

async function getLevel(levelId, opts = {}) {
  const data = await makeRequest(`levels/${levelId}`);
  return data;
}

async function createLevel(data) {
  return await makeRequest('levels', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

async function updateLevel(levelId, data) {
  const { preserveExistingTerms = true, ...updateData } = data;
  
  if (preserveExistingTerms) {
    const existingLevel = await getLevel(levelId);
    const existingTerms = existingLevel.terms || [];
    const existingMainTerm = existingLevel.mainTerm || {};
    
    // Merge existing terms with new ones
    const mergedTerms = [...existingTerms];
    if (updateData.terms) {
      updateData.terms.forEach(newTerm => {
        const existingIndex = mergedTerms.findIndex(t => t.id === newTerm.id);
        if (existingIndex >= 0) {
          mergedTerms[existingIndex] = { ...mergedTerms[existingIndex], ...newTerm };
        } else {
          mergedTerms.push(newTerm);
        }
      });
    }
    
    updateData.terms = mergedTerms;
    
    // Preserve mainTerm if not provided
    if (!updateData.mainTerm && existingMainTerm) {
      updateData.mainTerm = existingMainTerm;
    }
  }
  
  return await makeRequest(`levels/${levelId}`, {
    method: 'PUT',
    body: JSON.stringify(updateData)
  });
}

// Rate functions
async function getRates(params = {}) {
  const query = buildListQuery(params);
  return await makeRequest(`rates?${query}`);
}

async function getRate(rateId, opts = {}) {
  const data = await makeRequest(`rates/${rateId}`);
  return data;
}

async function createRate(data) {
  return await makeRequest('rates', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

async function updateRate(rateId, data) {
  return await makeRequest(`rates/${rateId}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

// Position functions
async function getPositions(params = {}) {
  const query = buildListQuery(params);
  return await makeRequest(`positions?${query}`);
}

async function getPosition(positionId, opts = {}) {
  const data = await makeRequest(`positions/${positionId}`);
  return data;
}

async function createPosition(data) {
  return await makeRequest('positions', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

async function updatePosition(positionId, data) {
  const { preserveExistingTerms = true, ...updateData } = data;
  
  if (preserveExistingTerms) {
    const existingPosition = await getPosition(positionId);
    const existingTerms = existingPosition.terms || [];
    const existingMainTerm = existingPosition.mainTerm || {};
    
    // Merge existing terms with new ones
    const mergedTerms = [...existingTerms];
    if (updateData.terms) {
      updateData.terms.forEach(newTerm => {
        const existingIndex = mergedTerms.findIndex(t => t.id === newTerm.id);
        if (existingIndex >= 0) {
          mergedTerms[existingIndex] = { ...mergedTerms[existingIndex], ...newTerm };
        } else {
          mergedTerms.push(newTerm);
        }
      });
    }
    
    updateData.terms = mergedTerms;
    
    // Preserve mainTerm if not provided
    if (!updateData.mainTerm && existingMainTerm) {
      updateData.mainTerm = existingMainTerm;
    }
  }
  
  return await makeRequest(`positions/${positionId}`, {
    method: 'PUT',
    body: JSON.stringify(updateData)
  });
}

// Skills functions
async function getSkills(params = {}) {
  const query = buildListQuery(params);
  return await makeRequest(`skills?${query}`);
}

async function getSkill(skillId, opts = {}) {
  const data = await makeRequest(`skills/${skillId}`);
  return data;
}

async function createSkill(data) {
  return await makeRequest('skills', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

async function updateSkill(skillId, data) {
  const { preserveExistingTerms = true, ...updateData } = data;
  
  if (preserveExistingTerms) {
    const existingSkill = await getSkill(skillId);
    const existingTerms = existingSkill.terms || [];
    const existingMainTerm = existingSkill.mainTerm || {};
    
    // Merge existing terms with new ones
    const mergedTerms = [...existingTerms];
    if (updateData.terms) {
      updateData.terms.forEach(newTerm => {
        const existingIndex = mergedTerms.findIndex(t => t.id === newTerm.id);
        if (existingIndex >= 0) {
          mergedTerms[existingIndex] = { ...mergedTerms[existingIndex], ...newTerm };
        } else {
          mergedTerms.push(newTerm);
        }
      });
      updateData.terms = mergedTerms;
    }
    
    // Preserve mainTerm if not provided
    if (!updateData.mainTerm && existingMainTerm) {
      updateData.mainTerm = existingMainTerm;
    }
  }
  
  return await makeRequest(`skills/${skillId}`, {
    method: 'PUT',
    body: JSON.stringify(updateData)
  });
}

// Individual Terms functions
async function createTerm(data) {
  return await makeRequest('terms', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

async function updateTerm(termId, data) {
  return await makeRequest(`terms/${termId}`, {
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
  getSubIndustries, getSubIndustry, createSubIndustry, updateSubIndustry,
  // Shift functions
  getShifts, getShift, createShift, updateShift,
  // Currency functions
  getCurrencies, getCurrency, createCurrency, updateCurrency,
  // Level functions
  getLevels, getLevel, createLevel, updateLevel,
  // Position functions
  getPositions, getPosition, createPosition, updatePosition,
  // Skills functions
  getSkills, getSkill, createSkill, updateSkill,
  findExistingSkillTerms,
  // Rate functions
  getRates, getRate, createRate, updateRate,
  // Individual Terms functions
  createTerm, updateTerm,
};
