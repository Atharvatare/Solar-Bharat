import mongoose from 'mongoose';
import config from './config.js';
import logger from '../utils/logger.js';

// ============================================
// MongoDB Connection — Vercel Serverless Safe
// ============================================
// Key design decisions:
// 1. Connection caching — reuse across serverless invocations
// 2. No mongodb-memory-server — it's a devDependency, unavailable on Vercel
// 3. Never throw or process.exit — let requests fail gracefully
// ============================================

let cached = global._mongooseCache;

if (!cached) {
  cached = global._mongooseCache = { conn: null, promise: null };
}

const connectDB = async () => {
  // If we already have a connection, reuse it
  if (cached.conn) {
    return cached.conn;
  }

  // If a connection attempt is already in progress, wait for it
  if (cached.promise) {
    cached.conn = await cached.promise;
    return cached.conn;
  }

  const mongoUri = config.mongoUri || process.env.MONGO_URI;

  // Check if URI is missing or is a placeholder
  const isPlaceholder = !mongoUri ||
    mongoUri.includes('xxxxx') ||
    mongoUri.includes('your_username') ||
    mongoUri.includes('your_password') ||
    mongoUri.includes('<username>') ||
    mongoUri.includes('your_cluster');

  if (isPlaceholder) {
    logger.error('❌ MONGO_URI is missing or set to a placeholder. Please configure it in Vercel Environment Variables.');
    logger.error('   Go to: Vercel Dashboard → Your Backend Project → Settings → Environment Variables');
    return null;
  }

  try {
    cached.promise = mongoose.connect(mongoUri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    cached.conn = await cached.promise;
    logger.info(`✅ MongoDB Connected: ${cached.conn.connection.host}`);
    return cached.conn;
  } catch (error) {
    logger.error(`❌ MongoDB connection failed: ${error.message}`);
    cached.promise = null; // Reset so next request can retry
    return null;
  }
};

export default connectDB;
