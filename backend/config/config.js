import dotenv from 'dotenv';
dotenv.config();

const config = {
  // Server
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 5000,
  
  // Database
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/solar-bharat',
  
  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'default_jwt_secret_change_me',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'default_refresh_secret_change_me',
    expire: process.env.JWT_EXPIRE || '15m',
    refreshExpire: process.env.JWT_REFRESH_EXPIRE || '7d',
    cookieExpire: 7, // days
  },
  
  // CORS
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  
  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,
  },
  
  // File Upload
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 10 * 1024 * 1024,
    path: process.env.UPLOAD_PATH || './uploads',
  },
  
  // Logging
  logLevel: process.env.LOG_LEVEL || 'debug',
  
  // App
  appName: process.env.APP_NAME || 'Solar Bharat',
  appUrl: process.env.APP_URL || 'http://localhost:5000',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',

  // Security (Phase 3)
  security: {
    maxLoginAttempts: parseInt(process.env.MAX_LOGIN_ATTEMPTS, 10) || 5,
    lockDuration: parseInt(process.env.LOCK_DURATION_MS, 10) || 30 * 60 * 1000, // 30 min
    sessionTimeout: parseInt(process.env.SESSION_TIMEOUT_MS, 10) || 24 * 60 * 60 * 1000, // 24 hr
    maxActiveSessions: parseInt(process.env.MAX_ACTIVE_SESSIONS, 10) || 5,
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS, 10) || 12,
    emailVerificationExpiry: 24 * 60 * 60 * 1000, // 24 hours
    passwordResetExpiry: 60 * 60 * 1000, // 1 hour
  },

  // Email (Phase 3 — simulated in dev, real SMTP in production)
  email: {
    host: process.env.EMAIL_HOST || '',
    port: parseInt(process.env.EMAIL_PORT, 10) || 587,
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASS || '',
    from: process.env.EMAIL_FROM || 'noreply@solarbharat.com',
  },
};

export default config;
