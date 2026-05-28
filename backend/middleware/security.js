/**
 * Security Middleware — Additional request hardening
 * Complements helmet, hpp, and mongoSanitize
 */

/**
 * Sanitize request body — strip dangerous HTML/script tags from string fields
 */
export const sanitizeBody = (req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    req.body = deepSanitize(req.body);
  }
  next();
};

/**
 * Recursively sanitize all string values in an object
 */
function deepSanitize(obj) {
  if (typeof obj === 'string') {
    return obj
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') // Remove iframes
      .replace(/on\w+\s*=\s*"[^"]*"/gi, '')   // Remove inline event handlers
      .replace(/on\w+\s*=\s*'[^']*'/gi, '')
      .replace(/javascript:/gi, '')             // Remove javascript: protocol
      .trim();
  }
  if (Array.isArray(obj)) {
    return obj.map(deepSanitize);
  }
  if (obj && typeof obj === 'object') {
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      // Block $ and . prefix keys (NoSQL injection vectors)
      if (!key.startsWith('$') && !key.includes('.')) {
        sanitized[key] = deepSanitize(value);
      }
    }
    return sanitized;
  }
  return obj;
}

/**
 * Add security fingerprint headers to responses
 */
export const securityHeaders = (req, res, next) => {
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  // XSS Protection
  res.setHeader('X-XSS-Protection', '1; mode=block');
  // Referrer policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  // Permissions policy
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  // Remove server identity
  res.removeHeader('X-Powered-By');
  next();
};

/**
 * Block suspicious request patterns
 */
export const blockSuspicious = (req, res, next) => {
  const suspiciousPatterns = [
    /\.\.\//,           // Path traversal
    /%2e%2e/i,          // Encoded path traversal
    /<script/i,         // Script injection in URL
    /union\s+select/i,  // SQL injection
    /\$where/i,         // NoSQL injection
    /\$regex/i,         // NoSQL regex injection
  ];

  const fullUrl = req.originalUrl + (req.body ? JSON.stringify(req.body) : '');

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(fullUrl)) {
      return res.status(403).json({
        success: false,
        message: 'Suspicious request blocked.',
      });
    }
  }

  next();
};

/**
 * Log API request metadata (for audit trail)
 */
export const auditLog = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const log = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userId: req.user?._id?.toString() || 'anonymous',
    };

    // Only log mutations and errors for audit
    if (req.method !== 'GET' || res.statusCode >= 400) {
      // In production, write to audit log file or service
      if (res.statusCode >= 400) {
        console.warn('[AUDIT]', JSON.stringify(log));
      }
    }
  });

  next();
};
