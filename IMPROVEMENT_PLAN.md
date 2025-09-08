# Libs MCP Service - Comprehensive Improvement Plan

## 📋 **Overview**

This document outlines practical improvements for the libs-mcp-service project. The current codebase is well-structured and production-ready, with proper environment validation and comprehensive JSON Schema validation already implemented.

## 🎯 **Implementation Priority**

### **🔥 High Priority**
1. Improve Error Handling — DONE

### **⚡ Medium Priority**
2. Implement Response Caching — DONE
3. Add Rate Limiting — DONE

### **📈 Low Priority**
4. Add Unit Tests
5. Code Quality Tools
6. Security Enhancements — MINIMAL DONE
7. Add JSDoc Comments — DONE
8. Monitoring & Observability

---

## 🔥 **HIGH PRIORITY IMPROVEMENTS**

### 1. **Improve Error Handling** — COMPLETED

**Result**: Implemented structured errors, timeouts, and MCP-formatted responses.
**Files**: `src/errors.js`, `api.js`, `index.js`

#### **Implementation Steps:**

**Create `src/errors.js`:**
```javascript
export class BaseError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      context: this.context,
      stack: this.stack
    };
  }
}

export class APIError extends BaseError {
  constructor(message, statusCode = 500, context) {
    super(message);
    this.statusCode = statusCode;
    this.code = 'API_ERROR';
    this.context = context;
  }
}

export class TimeoutError extends BaseError {
  constructor(message, timeout) {
    super(message);
    this.statusCode = 408;
    this.code = 'TIMEOUT_ERROR';
    this.context = { timeout };
  }
}

export class RateLimitError extends BaseError {
  constructor(message, retryAfter) {
    super(message);
    this.statusCode = 429;
    this.code = 'RATE_LIMIT_ERROR';
    this.context = { retryAfter };
  }
}

// Error handler utility
export function handleError(error, context) {
  if (error instanceof BaseError) {
    return error;
  }

  if (error instanceof Error) {
    // Convert known error patterns to specific error types
    if (error.message.includes('timeout')) {
      return new TimeoutError(error.message, 30000);
    }
    
    if (error.message.includes('status: 404')) {
      return new APIError(error.message, 404, context);
    }
    
    if (error.message.includes('status: 401')) {
      return new APIError('Authentication failed', 401, context);
    }
    
    if (error.message.includes('status: 403')) {
      return new APIError('Access forbidden', 403, context);
    }

    // Generic API error
    const statusMatch = error.message.match(/status: (\d+)/);
    const status = statusMatch ? parseInt(statusMatch[1]) : 500;
    return new APIError(error.message, status, context);
  }

  // Unknown error type
  return new APIError(
    error ? String(error) : 'Unknown error occurred',
    500,
    { originalError: error, ...context }
  );
}

// Error response formatter for MCP
export function formatMCPError(error) {
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify({
          error: {
            message: error.message,
            code: error.code,
            type: error.name,
            statusCode: error.statusCode,
            context: error.context
          }
        }, null, 2)
      }
    ]
  };
}
```

**Update `api.js` with timeout handling:**
```javascript
import { APIError, TimeoutError, handleError } from './errors.js';

export async function makeRequest(endpoint, options = {}) {
  const method = options.method || 'GET';
  const timeout = options.timeout || 30000;
  
  // Create abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const url = `${API_BASE_URL}/api/token/${endpoint}`;
    
    const response = await fetch(url, {
      method,
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json',
        ...options.headers
      },
      body: options.body,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `HTTP error! status: ${response.status}`;
      
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorMessage;
      } catch {
        // Use default error message if JSON parsing fails
      }
      
      throw new APIError(errorMessage, response.status, {
        endpoint,
        method,
        responseBody: errorText
      });
    }
    
    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw new TimeoutError(`Request timeout after ${timeout}ms`, timeout);
    }
    
    const handledError = handleError(error, { endpoint, method });
    throw handledError;
  }
}
```

**Update `index.js` with better error responses:**
```javascript
import { handleError, formatMCPError } from './errors.js';

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  try {
    let result;
    
    switch (name) {
      case 'list':
        result = await unifiedList(args);
        break;
      case 'get':
        result = await unifiedGet(args);
        break;
      // ... other cases
      default:
        throw new Error(`Unhandled tool: ${name}`);
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    const handledError = handleError(error, { tool: name, args });
    return formatMCPError(handledError);
  }
});
```

**Benefits:**
- Better error context for debugging
- Timeout handling for stuck requests
- Structured error responses
- HTTP status code detection

---

## ⚡ **MEDIUM PRIORITY IMPROVEMENTS**

### 2. **Implement Response Caching** — IN PROGRESS

**Goal**: Reduce API calls and improve performance

**Create `src/cache.js`:**
```javascript
export class SimpleCache { /* see repo implementation */ }
export const apiCache = new SimpleCache({ ttl: 300000, maxSize: 1000 });
export function generateCacheKey(endpoint, params) { /* includes url, headers, query, extras */ }
export function invalidateCacheByPrefix(prefix) { /* remove matching keys */ }
export function invalidateExactKey(key) { /* remove exact key */ }
```

**Integrate in `api.js`:**
```javascript
// GET: read/write cache with enhanced key
// non-GET: invalidate affected resource prefix, e.g. departments, professions
```

### 3. **Add Rate Limiting**

**Create `src/rateLimit.js`:** — DONE
```javascript
export class RateLimiter {
  constructor(config) {
    this.requests = new Map();
    this.maxRequests = config.maxRequests;
    this.windowMs = config.windowMs;
  }

  isAllowed(clientId) {
    const now = Date.now();
    const info = this.requests.get(clientId) || { requests: [], blocked: 0 };

    // Remove old requests outside the window
    info.requests = info.requests.filter(time => now - time < this.windowMs);

    // Check rate limit
    if (info.requests.length >= this.maxRequests) {
      info.blocked++;
      this.requests.set(clientId, info);
      console.warn(`Rate limit exceeded for ${clientId}`);
      return false;
    }

    // Add current request
    info.requests.push(now);
    this.requests.set(clientId, info);
    
    return true;
  }

  getStats(clientId) {
    if (clientId) {
      const info = this.requests.get(clientId);
      return {
        clientId,
        requests: info?.requests.length || 0,
        blocked: info?.blocked || 0
      };
    }

    return {
      totalClients: this.requests.size,
      totalBlocked: Array.from(this.requests.values()).reduce((sum, info) => sum + info.blocked, 0)
    };
  }
}

// Global rate limiter
export const rateLimiter = new RateLimiter({
  maxRequests: parseInt(process.env.MAX_REQUESTS_PER_MINUTE || '60'),
  windowMs: 60000 // 1 minute
});
```

**Integrate in `index.js`:** — DONE
```javascript
import { rateLimiter } from './src/rateLimit.js';
import { APIError } from './src/errors.js';

const clientId = request?.params?.$clientId || 'default-client';
if (!rateLimiter.isAllowed(clientId)) {
  const err = new APIError('Rate limit exceeded', 429, { clientId });
  return formatMCPError(err);
}
```

---

## 📈 **LOW PRIORITY IMPROVEMENTS**

### 4. **Add Unit Tests**

**Install testing dependencies:**
```bash
npm install --save-dev vitest @vitest/ui @vitest/coverage-v8 happy-dom
```

**Create `vitest.config.js`:**
```javascript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html']
    }
  }
});
```

### 5. **Add Code Quality Tools**

**Install linting and formatting tools:**
```bash
npm install --save-dev eslint prettier
```

**Create `.eslintrc.json`:**
```json
{
  "env": {
    "node": true,
    "es2022": true
  },
  "extends": ["eslint:recommended"],
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "rules": {
    "no-unused-vars": "error",
    "prefer-const": "error",
    "no-var": "error",
    "no-console": "warn"
  }
}
```

### 6. **Security Enhancements**
**Implemented minimal hardening for npx use:**
- Request body size cap (100KB) in `api.js` with 413 error.
- Masked `Authorization` when composing cache keys in `src/cache.js`.

### 7. **Add JSDoc Comments** — DONE

Added JSDoc across core modules:
- `api.js`: `makeRequest` parameters, behavior, and errors.
- `src/errors.js`: Error classes (`BaseError`, `APIError`, `TimeoutError`, `RateLimitError`), `handleError`, `formatMCPError`.
- `src/cache.js`: `SimpleCache`, `apiCache`, `generateCacheKey`, invalidation helpers.
- `src/rateLimit.js`: `RateLimiter`, `rateLimiter` and methods.

### 8. **Monitoring & Observability**

**Simple metrics tracking:**
```javascript
export class SimpleMetrics {
  constructor() {
    this.counters = new Map();
  }

  increment(metric) {
    this.counters.set(metric, (this.counters.get(metric) || 0) + 1);
  }

  getMetrics() {
    return Object.fromEntries(this.counters);
  }
}

export const metrics = new SimpleMetrics();
```

