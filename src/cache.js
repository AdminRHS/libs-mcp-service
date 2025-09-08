/**
 * Simple in-memory TTL cache with LRU-like eviction (oldest access removed).
 */
export class SimpleCache {
  constructor(options = {}) {
    this.cache = new Map();
    this.ttl = options.ttl || 300000; // 5 minutes default
    this.maxSize = options.maxSize || 1000;
  }

  /**
   * Retrieve a value by key if not expired.
   * @param {string} key
   * @returns {any|null}
   */
  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    item.accessed = Date.now();
    return item.value;
  }

  /**
   * Store a value by key with TTL.
   * @param {string} key
   * @param {any} value
   * @param {number} [customTtl]
   */
  set(key, value, customTtl) {
    const ttl = customTtl || this.ttl;
    const expiry = Date.now() + ttl;
    if (this.cache.size >= this.maxSize) {
      this.evictOldest();
    }
    this.cache.set(key, { value, expiry, accessed: Date.now() });
  }

  /**
   * Clear the entire cache.
   */
  clear() {
    this.cache.clear();
  }

  /**
   * Get basic cache statistics.
   */
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      ttl: this.ttl
    };
  }

  /**
   * Remove the least recently accessed entry.
   */
  evictOldest() {
    let oldestKey = null;
    let oldestAccess = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (item.accessed < oldestAccess) {
        oldestAccess = item.accessed;
        oldestKey = key;
      }
    }
    if (oldestKey) this.cache.delete(oldestKey);
  }
}

export const apiCache = new SimpleCache({
  ttl: parseInt(process.env.CACHE_TTL_MS || '300000'),
  maxSize: parseInt(process.env.CACHE_MAX_SIZE || '1000')
});

/**
 * Generate a stable cache key that captures request variability.
 * @param {string} endpoint
 * @param {{url?: string, headers?: Object, query?: Object, extras?: Object}} params
 */
export function generateCacheKey(endpoint, params) {
  const { url, headers, query, extras } = params || {};
  const composed = {
    url: url || endpoint,
    headers: maskSensitiveHeaders(headers || {}),
    query: query || {},
    extras: extras || {}
  };
  return `${composed.url}:${JSON.stringify(composed)}`;
}

function maskSensitiveHeaders(hdrs) {
  const clone = { ...hdrs };
  if (clone.Authorization) {
    clone.Authorization = 'Bearer ***';
  }
  if (clone.authorization) {
    clone.authorization = 'Bearer ***';
  }
  return clone;
}

/**
 * Invalidate all cache entries whose key starts with a prefix.
 * @param {string} prefix
 */
export function invalidateCacheByPrefix(prefix) {
  for (const key of apiCache.cache.keys()) {
    if (key.startsWith(prefix)) {
      apiCache.cache.delete(key);
    }
  }
}

/**
 * Invalidate a single cache entry by exact key.
 * @param {string} key
 */
export function invalidateExactKey(key) {
  apiCache.cache.delete(key);
}


