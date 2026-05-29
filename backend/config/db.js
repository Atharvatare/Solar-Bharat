import mongoose from 'mongoose';
import config from './config.js';
import logger from '../utils/logger.js';
import User from '../models/User.js';
import { seedMemoryDB } from '../utils/memorySeeder.js';

let mongod = null;

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    logger.info('=> Using existing database connection');
    return;
  }

  const isVercel = process.env.VERCEL || process.env.NODE_ENV === 'production';
  const mongoUri = config.mongoUri || process.env.MONGO_URI;
  
  const isPlaceholder = !mongoUri || 
                        mongoUri.includes('xxxxx') || 
                        mongoUri.includes('your_username') || 
                        mongoUri.includes('your_password') ||
                        mongoUri.includes('<username>') ||
                        mongoUri.includes('your_cluster');

  if (isPlaceholder) {
    if (isVercel) {
      logger.error('❌ CRITICAL: MongoDB URI is missing or set to a placeholder in Vercel environment variables.');
      return; // DO NOT THROW, IT CRASHES VERCEL SERVERLESS. Just return. Requests will fail gracefully.
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

      isConnected = conn.connections[0].readyState;
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
    const conn = await mongoose.connect(mongoUri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    isConnected = conn.connections[0].readyState;
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
    
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
      // Again, do not throw. Let the connection fail gracefully so Vercel doesn't return 500 on cold start
      return;
    }

    logger.warn('⚠️ Falling back to dynamic In-Memory MongoDB Server due to Atlas connection failure...');
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      mongod = await MongoMemoryServer.create();
      const inMemoryUri = mongod.getUri();
      
      const conn = await mongoose.connect(inMemoryUri, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });

      isConnected = conn.connections[0].readyState;
      await seedMemoryDB();
    } catch (inMemError) {
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

