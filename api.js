import { API_TOKEN, API_BASE_URL } from './config.js';
import { APIError, TimeoutError, handleError } from './src/errors.js';
import { apiCache, generateCacheKey, invalidateCacheByPrefix } from './src/cache.js';

/**
 * Makes an authenticated HTTP request to the backend API with timeout, caching, and error normalization.
 *
 * @param {string} endpoint - API endpoint path relative to token base (e.g., 'departments', 'cities/1').
 * @param {Object} [options] - Request options.
 * @param {string} [options.method='GET'] - HTTP method.
 * @param {Object} [options.headers] - Additional request headers.
 * @param {any} [options.body] - Request body (JSON.stringify-ed by caller).
 * @param {number} [options.timeout=30000] - Timeout in ms; aborts when exceeded.
 * @param {boolean} [options.skipCache=false] - For GET: bypass cache read/write when true.
 * @param {number} [options.cacheTtl] - For GET: custom TTL in ms; defaults to global cache TTL.
 * @param {Object} [options.query] - Optional query parts to include in cache key.
 * @param {Object} [options.cacheKeyExtras] - Extra key parts to disambiguate cache entries.
 * @returns {Promise<any>} Parsed JSON response.
 * @throws {APIError|TimeoutError} Normalized error with status and context.
 */
async function makeRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}/api/token/${endpoint}`;
  const method = options.method || 'GET';
  const timeout = options.timeout || 30000;
  const MAX_BODY_BYTES = 100 * 1024; // 100KB

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  const defaultOptions = {
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json',
      ...options.headers
    },
    body: options.body,
    method,
    signal: controller.signal
  };

  // Clamp body size to prevent accidental large payloads
  if (defaultOptions.body && typeof defaultOptions.body === 'string') {
    if (defaultOptions.body.length > MAX_BODY_BYTES) {
      throw new APIError('Request body too large', 413, {
        endpoint,
        method,
        maxBytes: MAX_BODY_BYTES
      });
    }
  }

  try {
    // Read from cache for GET if not explicitly skipped
    if (method === 'GET' && options.skipCache !== true) {
      const cacheKey = generateCacheKey(endpoint, { url, headers: defaultOptions.headers, query: options.query, extras: options.cacheKeyExtras });
      const cached = apiCache.get(cacheKey);
      if (cached) {
        clearTimeout(timeoutId);
        return cached;
      }
    }

    const response = await fetch(url, defaultOptions);

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorMessage;
      } catch {}

      throw new APIError(errorMessage, response.status, {
        endpoint,
        method,
        responseBody: errorText
      });
    }

    const data = await response.json();

    if (method === 'GET' && options.skipCache !== true) {
      const cacheKey = generateCacheKey(endpoint, { url, headers: defaultOptions.headers, query: options.query, extras: options.cacheKeyExtras });
      apiCache.set(cacheKey, data, options.cacheTtl);
    } else if (method !== 'GET') {
      // Targeted invalidation: drop cached collections and specific resource prefixes
      // Example endpoints: 'departments', 'departments/123'
      const topLevel = String(endpoint).split('/')[0];
      if (topLevel) {
        invalidateCacheByPrefix(`${API_BASE_URL}/api/token/${topLevel}`);
      }
    }

    return data;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      throw new TimeoutError(`Request timeout after ${timeout}ms`, timeout);
    }

    const handledError = handleError(error, { endpoint, method, timeout });
    throw handledError;
  }
}

export { makeRequest };
