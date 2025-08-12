// Configuration
const API_TOKEN = process.env.API_TOKEN;
const API_BASE_URL = process.env.API_BASE_URL;

// Validation
if (!API_TOKEN) {
  console.error('Error: API_TOKEN environment variable is required');
  process.exit(1);
}

if (!API_BASE_URL) {
  console.error('Error: API_BASE_URL environment variable is required');
  process.exit(1);
}

export { API_TOKEN, API_BASE_URL };
