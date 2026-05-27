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
};

export default config;
