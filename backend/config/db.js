import mongoose from 'mongoose';
import config from './config.js';
import logger from '../utils/logger.js';
import User from '../models/User.js';
import { seedMemoryDB } from '../utils/memorySeeder.js';

let mongod = null;

const connectDB = async () => {
  const isVercel = process.env.VERCEL || process.env.NODE_ENV === 'production';
  
  const isPlaceholder = !config.mongoUri || 
                        config.mongoUri.includes('xxxxx') || 
                        config.mongoUri.includes('your_username') || 
                        config.mongoUri.includes('your_password') ||
                        config.mongoUri.includes('<username>') ||
                        config.mongoUri.includes('your_cluster');

  if (isPlaceholder) {
    if (isVercel) {
      logger.error('❌ CRITICAL: MongoDB URI is missing or set to a placeholder in Vercel environment variables.');
      logger.error('Please configure the MONGO_URI environment variable in your Vercel Project Settings.');
      throw new Error('Database is not configured. Please set the MONGO_URI environment variable in Vercel.');
    }

    logger.warn('⚠️ Detected MongoDB placeholder URI. Falling back to dynamic In-Memory MongoDB Server...');
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      mongod = await MongoMemoryServer.create();
      const inMemoryUri = mongod.getUri();
      logger.info(`🚀 Starting In-Memory MongoDB at URI: ${inMemoryUri}`);
      
      const conn = await mongoose.connect(inMemoryUri, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });

      logger.info(`❇️ In-Memory MongoDB Connected: ${conn.connection.host}`);
      
      // Automatically seed the in-memory database
      await seedMemoryDB();
      return;
    } catch (inMemError) {
      logger.error(`❌ Failed to start In-Memory MongoDB: ${inMemError.message}`);
      process.exit(1);
    }
  }

  try {
    const conn = await mongoose.connect(config.mongoUri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    logger.info(`MongoDB Connected: ${conn.connection.host}`);
    
    // Connection event handlers
    mongoose.connection.on('error', (err) => {
      logger.error(`MongoDB connection error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected. Attempting reconnection...');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected');
    });

    // Check and auto-seed if the database is empty (important for first-time production deployments!)
    try {
      const userCount = await User.countDocuments();
      if (userCount === 0) {
        logger.info('🌱 Database is empty. Automatically seeding initial users, products, and mock data...');
        await seedMemoryDB();
      }
    } catch (seedErr) {
      logger.error(`⚠️ Auto-seeding check failed: ${seedErr.message}`);
    }

  } catch (error) {
    logger.error(`MongoDB connection failed: ${error.message}`);
    
    if (isVercel) {
      throw error;
    }

    logger.warn('⚠️ Falling back to dynamic In-Memory MongoDB Server due to Atlas connection failure...');
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      mongod = await MongoMemoryServer.create();
      const inMemoryUri = mongod.getUri();
      logger.info(`🚀 Starting In-Memory MongoDB at URI: ${inMemoryUri}`);
      
      const conn = await mongoose.connect(inMemoryUri, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });

      logger.info(`❇️ In-Memory MongoDB Connected: ${conn.connection.host}`);
      
      // Automatically seed the in-memory database
      await seedMemoryDB();
    } catch (inMemError) {
      logger.error(`❌ Failed to start In-Memory MongoDB fallback: ${inMemError.message}`);
      process.exit(1);
    }
  }
};

// Graceful shutdown handling for MongoMemoryServer
process.on('SIGTERM', async () => {
  if (mongod) {
    logger.info('Stopping In-Memory MongoDB...');
    await mongoose.disconnect();
    await mongod.stop();
    logger.info('In-Memory MongoDB stopped.');
  }
});

export default connectDB;

