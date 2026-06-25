/**
 * Security Middleware — Phase 13 Hardened
 * Production-grade request protection layer
 */

// ============================================
// 1. BODY SANITIZATION — Strip XSS/injection vectors
// ============================================
export const sanitizeBody = (req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    req.body = deepSanitize(req.body);
  }
  if (req.query && typeof req.query === 'object') {
    req.query = deepSanitize(req.query);
  }
  next();
};

function deepSanitize(obj) {
  if (typeof obj === 'string') {
    return obj
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/on\w+\s*=\s*"[^"]*"/gi, '')
      .replace(/on\w+\s*=\s*'[^']*'/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
      .replace(/<embed[^>]*>/gi, '')
      .replace(/<link[^>]*>/gi, '')
      .trim();
  }
  if (Array.isArray(obj)) return obj.map(deepSanitize);
  if (obj && typeof obj === 'object') {
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      if (!key.startsWith('$') && !key.includes('.') && !key.startsWith('__')) {
        sanitized[key] = deepSanitize(value);
      }
    }
    return sanitized;
  }
  return obj;
}

// ============================================
// 2. SECURITY HEADERS — Defense-in-depth HTTP headers
// ============================================
export const securityHeaders = (req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
  res.setHeader('X-DNS-Prefetch-Control', 'off');
  res.setHeader('X-Download-Options', 'noopen');
  res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
  res.removeHeader('X-Powered-By');
  res.removeHeader('Server');
  next();
};

// ============================================
// 3. BLOCK SUSPICIOUS PATTERNS — WAF-lite
// ============================================
export const blockSuspicious = (req, res, next) => {
  const suspiciousPatterns = [
    /\.\.\//,                    // Path traversal
    /%2e%2e/i,                   // Encoded path traversal
    /<script/i,                  // Script injection
    /union\s+select/i,           // SQL injection
    /\$where/i,                  // NoSQL injection
    /\$regex/i,                  // NoSQL regex injection
    /\$gt|\$lt|\$ne|\$in/i,     // NoSQL operator injection
    /eval\s*\(/i,                // eval() injection
    /function\s*\(/i,            // Function constructor
    /require\s*\(/i,             // require() injection
    /child_process/i,            // Command injection
    /\/etc\/passwd/i,            // File read attempt
    /\/proc\/self/i,             // Process info leak
  ];

  const fullUrl = req.originalUrl;
  const bodyStr = req.body ? JSON.stringify(req.body) : '';
  const combined = fullUrl + bodyStr;

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(combined)) {
      console.warn(`[SECURITY] Blocked suspicious request: ${req.method} ${req.originalUrl} from ${req.ip}`);
      return res.status(403).json({
        success: false,
        message: 'Request blocked by security policy.',
      });
    }
  }

  next();
};

// ============================================
// 4. PAYLOAD SIZE GUARD — Prevent oversized requests
// ============================================
export const payloadGuard = (req, res, next) => {
  const contentLength = parseInt(req.headers['content-length'] || '0', 10);
  const MAX_PAYLOAD = 10 * 1024 * 1024; // 10MB

  if (contentLength > MAX_PAYLOAD) {
    return res.status(413).json({
      success: false,
      message: 'Request payload too large.',
    });
  }
  next();
};

// ============================================
// 5. API FINGERPRINT — Add request tracking ID
// ============================================
export const requestFingerprint = (req, res, next) => {
  const requestId = `sb-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
  req.requestId = requestId;
  res.setHeader('X-Request-Id', requestId);
  next();
};

// ============================================
// 6. AUDIT LOG — Mutation & error tracking
// ============================================
export const auditLog = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const log = {
      id: req.requestId || '-',
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userId: req.user?._id?.toString() || 'anon',
      userAgent: (req.headers['user-agent'] || '').substring(0, 100),
    };

    // Log mutations and errors for audit trail
    if (req.method !== 'GET' || res.statusCode >= 400) {
      if (res.statusCode >= 500) {
        console.error('[AUDIT:ERROR]', JSON.stringify(log));
      } else if (res.statusCode >= 400) {
        console.warn('[AUDIT:WARN]', JSON.stringify(log));
      } else {
        // Mutations (POST/PUT/DELETE) logged at info level in production
        if (process.env.NODE_ENV !== 'production' || req.method === 'DELETE') {
          console.info('[AUDIT:MUTATION]', JSON.stringify(log));
        }
      }
    }
  });

  next();
};

// ============================================
// 7. SENSITIVE DATA MASK — Prevent leakage in responses
// ============================================
export const maskSensitiveData = (req, res, next) => {
  const originalJson = res.json.bind(res);
  res.json = (data) => {
    if (data && typeof data === 'object') {
      data = maskObject(data);
    }
    return originalJson(data);
  };
  next();
};

function maskObject(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const sensitive = ['password', 'refreshToken', 'apiKey', 'secret', '__v'];
  const masked = Array.isArray(obj) ? [...obj] : { ...obj };
  for (const key of Object.keys(masked)) {
    if (sensitive.includes(key)) {
      delete masked[key];
    } else if (typeof masked[key] === 'object' && masked[key] !== null) {
      masked[key] = maskObject(masked[key]);
    }
  }
  return masked;
}
