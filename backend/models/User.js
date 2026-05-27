import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import { USER_ROLES } from '../utils/constants.js';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // Don't return password by default
    },
    phone: {
      type: String,
      trim: true,
      match: [/^[+]?91?\s?[6-9]\d{9}$/, 'Please provide a valid Indian phone number'],
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.USER,
    },
    avatar: {
      type: String,
      default: null,
    },
    location: {
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      pincode: { type: String, trim: true },
      address: { type: String, trim: true },
    },
    solarSystem: {
      installed: { type: Boolean, default: false },
      capacity: { type: Number, default: 0 }, // kW
      panels: { type: Number, default: 0 },
      installedDate: { type: Date },
      inverterModel: { type: String },
      vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
    },
    preferences: {
      notifications: {
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: true },
        sms: { type: Boolean, default: false },
      },
      language: { type: String, default: 'en' },
      currency: { type: String, default: 'INR' },
      units: { type: String, default: 'kWh' },
    },
    refreshToken: {
      type: String,
      select: false,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    emailVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index for search performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ 'location.state': 1 });
userSchema.index({ createdAt: -1 });

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate access token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { id: this._id, role: this.role },
    config.jwt.secret,
    { expiresIn: config.jwt.expire }
  );
};

// Generate refresh token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { id: this._id },
    config.jwt.refreshSecret,
    { expiresIn: config.jwt.refreshExpire }
  );
};

// Virtual: full location string
userSchema.virtual('fullLocation').get(function () {
  const parts = [this.location?.city, this.location?.state].filter(Boolean);
  return parts.join(', ') || 'Not specified';
});

const User = mongoose.model('User', userSchema);
export default User;
