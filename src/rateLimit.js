/**
 * Fixed-window request rate limiter keyed by client ID.
 */
export class RateLimiter {
  constructor(config) {
    this.requests = new Map();
    this.maxRequests = config.maxRequests;
    this.windowMs = config.windowMs;
  }

  /**
   * Determines if a client is allowed to proceed and records the request.
   * @param {string} clientId
   * @returns {boolean}
   */
  isAllowed(clientId) {
    const now = Date.now();
    const info = this.requests.get(clientId) || { requests: [], blocked: 0 };

    info.requests = info.requests.filter(time => now - time < this.windowMs);

    if (info.requests.length >= this.maxRequests) {
      info.blocked++;
      this.requests.set(clientId, info);
      return false;
    }

    info.requests.push(now);
    this.requests.set(clientId, info);
    return true;
  }

  /**
   * Returns stats for a specific client or aggregate totals.
   * @param {string} [clientId]
   */
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

export const rateLimiter = new RateLimiter({
  maxRequests: 60,
  windowMs: 60000
});


