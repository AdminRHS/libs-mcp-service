import { API_TOKEN, API_BASE_URL } from './config.js';

// API functions
async function makeRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}/api/token/${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'X-API-Key': API_TOKEN,
      'Content-Type': 'application/json',
      ...options.headers
    }
  };

  try {
    const response = await fetch(url, { ...defaultOptions, ...options });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Request failed:', error.message);
    throw error;
  }
}

export { makeRequest };
