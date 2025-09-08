/**
 * Base error with JSON serialization support and standard fields.
 */
export class BaseError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
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

/**
 * Represents an HTTP/API error with status code and optional context.
 */
export class APIError extends BaseError {
  constructor(message, statusCode = 500, context) {
    super(message);
    this.statusCode = statusCode;
    this.code = 'API_ERROR';
    this.context = context;
  }
}

/**
 * Thrown when operations exceed the configured timeout.
 */
export class TimeoutError extends BaseError {
  constructor(message, timeout) {
    super(message);
    this.statusCode = 408;
    this.code = 'TIMEOUT_ERROR';
    this.context = { timeout };
  }
}

/**
 * Emitted when rate limits are exceeded; includes retry metadata.
 */
export class RateLimitError extends BaseError {
  constructor(message, retryAfter) {
    super(message);
    this.statusCode = 429;
    this.code = 'RATE_LIMIT_ERROR';
    this.context = { retryAfter };
  }
}

/**
 * Normalizes any thrown value into a typed error with context.
 * @param {unknown} error
 * @param {Object} [context]
 * @returns {BaseError}
 */
export function handleError(error, context) {
  if (error instanceof BaseError) {
    return error;
  }

  if (error && typeof error === 'object') {
    const message = error.message || String(error);

    if (message.includes('timeout')) {
      return new TimeoutError(message, context?.timeout ?? 30000);
    }

    if (message.includes('status: 404')) {
      return new APIError(message, 404, context);
    }

    if (message.includes('status: 401')) {
      return new APIError('Authentication failed', 401, context);
    }

    if (message.includes('status: 403')) {
      return new APIError('Access forbidden', 403, context);
    }

    const statusMatch = message.match(/status:\s*(\d+)/);
    const status = statusMatch ? parseInt(statusMatch[1], 10) : 500;
    return new APIError(message, status, context);
  }

  return new APIError(error ? String(error) : 'Unknown error occurred', 500, { originalError: error, ...context });
}

/**
 * Formats an error object into an MCP-compatible response payload.
 * @param {unknown} error
 * @returns {{ content: Array<{type: string, text: string}> }}
 */
export function formatMCPError(error) {
  const safe = error instanceof BaseError ? error : handleError(error);
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({
          error: {
            message: safe.message,
            code: safe.code,
            type: safe.name,
            statusCode: safe.statusCode,
            context: safe.context
          }
        }, null, 2)
      }
    ]
  };
}


