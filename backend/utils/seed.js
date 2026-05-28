import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import Product from '../models/Product.js';
import Vendor from '../models/Vendor.js';
import Session from '../models/Session.js';
import TokenBlacklist from '../models/TokenBlacklist.js';
import connectDB from '../config/db.js';

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();
    console.log('🌱 Starting seed...\n');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Notification.deleteMany({}),
      Product.deleteMany({}),
      Vendor.deleteMany({}),
      Session.deleteMany({}),
      TokenBlacklist.deleteMany({}),
    ]);
    console.log('🗑️  Cleared existing data');

    // Create admin user (email pre-verified)
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@solarbharat.com',
      password: 'Admin@123',
      phone: '9876543210',
      role: 'admin',
      isActive: true,
      emailVerified: true,
      location: { city: 'Mumbai', state: 'Maharashtra', pincode: '400001' },
    });
    console.log('👤 Admin created: admin@solarbharat.com / Admin@123');

    // Create demo user (email pre-verified)
    const user = await User.create({
      name: 'Rahul Sharma',
      email: 'user@solarbharat.com',
      password: 'User@123',
      phone: '9876543211',
      role: 'user',
      isActive: true,
      emailVerified: true,
      location: { city: 'Pune', state: 'Maharashtra', pincode: '411001' },
      solarSystem: {
        installed: true,
        capacity: 5,
        panels: 14,
        installedDate: new Date('2024-06-15'),
      },
    });
    console.log('👤 User created: user@solarbharat.com / User@123');

    // Create unverified user for testing
    const unverified = await User.create({
      name: 'New User',
      email: 'new@solarbharat.com',
      password: 'New@1234',
      phone: '9876543212',
      role: 'user',
      isActive: true,
      emailVerified: false,
      location: { city: 'Delhi', state: 'Delhi' },
    });
    console.log('👤 Unverified user created: new@solarbharat.com / New@1234');

    // Create sample vendor
    const vendor = await Vendor.create({
      companyName: 'SolarTech India Pvt Ltd',
      contactPerson: { name: 'Amit Patel', email: 'amit@solartech.in', phone: '9988776655' },
      address: { city: 'Pune', state: 'Maharashtra', pincode: '411045', street: 'Hinjewadi Phase 2' },
      registrationNumber: 'VND-2024-001',
      gstNumber: '27AABCS1429B1ZB',
      servicesOffered: ['installation', 'maintenance', 'supply'],
      serviceAreas: [{ state: 'Maharashtra', cities: ['Mumbai', 'Pune', 'Nagpur'] }],
      rating: { average: 4.5, count: 128 },
      completedProjects: 245,
      status: 'active',
      verified: true,
    });
    console.log('🏢 Vendor created: SolarTech India');

    // Create sample products
    const products = await Product.insertMany([
      {
        name: 'SolarMax 400W Mono Panel',
        category: 'solar_panel',
        brand: 'SolarMax',
        model: 'SM-400M',
        description: 'High-efficiency monocrystalline solar panel with 21% efficiency.',
        specifications: { wattage: 400, voltage: 40, efficiency: 21, warranty: 25, weight: 22 },
        pricing: { mrp: 18000, sellingPrice: 15500, discount: 14 },
        vendorId: vendor._id,
        rating: { average: 4.6, count: 89 },
        inStock: true,
      },
      {
        name: 'PowerGrid 5kW Inverter',
        category: 'inverter',
        brand: 'PowerGrid',
        model: 'PG-5000',
        description: 'Grid-tie string inverter with MPPT tracking and WiFi monitoring.',
        specifications: { wattage: 5000, voltage: 230, efficiency: 97, warranty: 10, weight: 15 },
        pricing: { mrp: 65000, sellingPrice: 55000, discount: 15 },
        vendorId: vendor._id,
        rating: { average: 4.4, count: 56 },
        inStock: true,
      },
      {
        name: 'EnergyVault 10kWh Battery',
        category: 'battery',
        brand: 'EnergyVault',
        model: 'EV-10LFP',
        description: 'Lithium iron phosphate battery with 6000+ cycle life.',
        specifications: { wattage: 10000, voltage: 48, efficiency: 95, warranty: 10, weight: 90 },
        pricing: { mrp: 180000, sellingPrice: 155000, discount: 14 },
        vendorId: vendor._id,
        rating: { average: 4.7, count: 34 },
        inStock: true,
      },
    ]);
    console.log(`📦 ${products.length} Products created`);

    // Create notifications for the verified user
    await Notification.insertMany([
      {
        userId: user._id,
        type: 'welcome',
        title: 'Welcome to Solar Bharat! ☀️',
        message: 'Hi Rahul, start by uploading your electricity bill for a personalized solar recommendation.',
        actionUrl: '/dashboard/bill-upload',
      },
      {
        userId: user._id,
        type: 'savings',
        title: '🎉 Savings Milestone!',
        message: "Congratulations! You've saved ₹25,000 with solar energy so far!",
        actionUrl: '/dashboard/analytics',
      },
      {
        userId: user._id,
        type: 'maintenance',
        title: 'Panel Cleaning Reminder',
        message: 'Your panels are due for cleaning. Regular maintenance ensures optimal performance.',
        read: false,
      },
    ]);
    console.log('🔔 Notifications created');

    console.log('\n✅ Seed completed successfully!');
    console.log('\n📋 Login credentials:');
    console.log('   Admin:      admin@solarbharat.com / Admin@123      (verified)');
    console.log('   User:       user@solarbharat.com  / User@123       (verified)');
    console.log('   Unverified: new@solarbharat.com   / New@1234       (unverified)\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    console.error(error);
    process.exit(1);
  }
};

seedData();
