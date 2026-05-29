import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import path from 'path';
import { fileURLToPath } from 'url';

import config from './config/config.js';
import connectDB from './config/db.js';
import logger from './utils/logger.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import errorHandler, { notFound } from './middleware/errorHandler.js';
import { sanitizeBody, securityHeaders, blockSuspicious, auditLog } from './middleware/security.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import billRoutes from './routes/billRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import solarRoutes from './routes/solarRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// ES module dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express
const app = express();

// ============================================
// TRUST PROXY (for rate limiting behind reverse proxy)
// ============================================
app.set('trust proxy', 1);

// ============================================
// SECURITY MIDDLEWARE (Phase 3 — Hardened)
// ============================================

// Custom security headers
app.use(securityHeaders);

// Helmet — set security HTTP headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'blob:'],
      connectSrc: ["'self'", config.corsOrigin],
    },
  },
}));

// CORS — Allow frontend origin
const allowedOrigins = [
  config.corsOrigin,
  'https://solar-bharat.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, server-to-server)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Temporarily allow all for debugging
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['X-Total-Count'],
  maxAge: 600,
}));

// Cookie parser (for refresh token cookies)
app.use(cookieParser());

// Rate limiting
app.use('/api/', apiLimiter);

// Sanitize data — prevent NoSQL injection
app.use(mongoSanitize({ replaceWith: '_' }));

// Prevent HTTP param pollution
app.use(hpp({
  whitelist: ['sort', 'page', 'limit', 'status', 'role', 'category'],
}));

// ============================================
// BODY PARSING (must come BEFORE blockSuspicious)
// ============================================

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// These middleware need req.body to be parsed first
app.use(sanitizeBody);
app.use(blockSuspicious);

// Audit log for mutations and errors
app.use(auditLog);

// ============================================
// LOGGING
// ============================================

if (config.env === 'development') {
  app.use(morgan('dev'));
}

// ============================================
// STATIC FILES
// ============================================

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ============================================
// API ROUTES
// ============================================

// Ensure DB is connected before handling routes (critical for serverless)
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/bills', billRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/solar', solarRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

// ============================================
// HEALTH CHECK
// ============================================

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Solar Bharat API is running ☀️',
    environment: config.env,
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`,
    security: {
      helmet: true,
      cors: true,
      rateLimiting: true,
      inputSanitization: true,
      tokenBlacklist: true,
      sessionManagement: true,
    },
  });
});

// ============================================
// API DOCUMENTATION ENDPOINT
// ============================================

app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Solar Bharat API v2.0 — Secure Edition',
    version: '2.0.0',
    documentation: '/api/docs',
    endpoints: {
      auth: {
        base: '/api/auth',
        public: ['POST /register', 'POST /login', 'POST /refresh', 'POST /forgot-password', 'PUT /reset-password/:token', 'GET /verify-email/:token'],
        protected: ['GET /me', 'POST /logout', 'POST /logout-all', 'POST /resend-verification', 'PUT /change-password', 'GET /sessions', 'DELETE /sessions/:id'],
      },
      users: '/api/users — User management (profile, preferences)',
      bills: '/api/bills — Bill upload & analysis',
      dashboard: '/api/dashboard — Dashboard analytics',
      solar: '/api/solar — Solar calculator & rooftop analysis',
      chat: '/api/chat — AI chatbot',
      notifications: '/api/notifications — User notifications',
      admin: '/api/admin — Admin panel (admin only)',
      health: '/api/health — Health check',
    },
    security: {
      authentication: 'Bearer JWT (access + refresh tokens)',
      authorization: 'Role-based access control (user, admin, vendor)',
      encryption: 'bcrypt (12 rounds) for passwords',
      tokenExpiry: { access: config.jwt.expire, refresh: config.jwt.refreshExpire },
      rateLimits: { api: '100/15min', auth: '10/15min', upload: '20/hr', chat: '30/min' },
      features: [
        'Token blacklisting on logout',
        'Refresh token rotation',
        'Session tracking with device info',
        'Login attempt lockout (5 attempts → 30 min lock)',
        'Email verification',
        'NoSQL injection protection',
        'XSS sanitization',
        'HPP protection',
        'Suspicious request blocking',
      ],
    },
  });
});

// ============================================
// ERROR HANDLING
// ============================================

app.use(notFound);
app.use(errorHandler);

// ============================================
// START SERVER
// ============================================

// ============================================
// START SERVER OR EXPORT FOR VERCEL
// ============================================

// START SERVER OR EXPORT FOR VERCEL
// ============================================

// Only run app.listen and background intervals if NOT in Vercel serverless environment
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {

  const server = app.listen(config.port, () => {
    logger.info(`
  ╔═══════════════════════════════════════════════════╗
  ║                                                   ║
  ║   ☀️  Solar Bharat API Server v2.0                 ║
  ║   🔒 Secure Edition (Phase 3)                     ║
  ║                                                   ║
  ║   Environment : ${config.env.padEnd(32)}║
  ║   Port        : ${String(config.port).padEnd(32)}║
  ║   URL         : ${config.appUrl.padEnd(32)}║
  ║   Health      : ${(config.appUrl + '/api/health').padEnd(32)}║
  ║   Docs        : ${(config.appUrl + '/api').padEnd(32)}║
  ║                                                   ║
  ║   Security Stack:                                 ║
  ║   ✅ Helmet + CORS + Rate Limiting                ║
  ║   ✅ JWT Blacklist + Session Tracking             ║
  ║   ✅ Login Lockout + Email Verification           ║
  ║   ✅ XSS + NoSQL Injection Protection             ║
  ║                                                   ║
  ╚═══════════════════════════════════════════════════╝
    `);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err) => {
    logger.error(`Unhandled Rejection: ${err.message}`);
    server.close(() => process.exit(1));
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    logger.info('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
      logger.info('Process terminated.');
    });
  });
}

// Export the app for Vercel serverless functions
export default app;
