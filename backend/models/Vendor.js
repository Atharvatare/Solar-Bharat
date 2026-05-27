import mongoose from 'mongoose';
import { VENDOR_STATUS } from '../utils/constants.js';

const vendorSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    contactPerson: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
      country: { type: String, default: 'India' },
    },
    registrationNumber: {
      type: String,
      unique: true,
    },
    gstNumber: {
      type: String,
      trim: true,
    },
    servicesOffered: [{
      type: String,
      enum: ['installation', 'maintenance', 'supply', 'consulting', 'financing'],
    }],
    serviceAreas: [{
      state: String,
      cities: [String],
    }],
    rating: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0 },
    },
    completedProjects: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: Object.values(VENDOR_STATUS),
      default: VENDOR_STATUS.PENDING,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

vendorSchema.index({ status: 1, isActive: 1 });
vendorSchema.index({ 'address.state': 1 });
vendorSchema.index({ companyName: 'text' });

const Vendor = mongoose.model('Vendor', vendorSchema);
export default Vendor;
