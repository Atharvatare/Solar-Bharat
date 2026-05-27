import mongoose from 'mongoose';
import { BILL_STATUS } from '../utils/constants.js';

const billSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    filename: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      enum: ['pdf', 'jpg', 'jpeg', 'png'],
      required: true,
    },
    fileSize: {
      type: Number, // bytes
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(BILL_STATUS),
      default: BILL_STATUS.PENDING,
    },
    analysis: {
      provider: { type: String, default: '' },              // electricity provider
      accountNumber: { type: String, default: '' },
      billingPeriod: {
        from: { type: Date },
        to: { type: Date },
      },
      totalAmount: { type: Number, default: 0 },            // INR
      unitsConsumed: { type: Number, default: 0 },           // kWh
      averageRate: { type: Number, default: 0 },             // INR per kWh
      peakUsageHours: { type: String, default: '' },
      sanctionedLoad: { type: Number, default: 0 },          // kW
      connectedLoad: { type: Number, default: 0 },           // kW
    },
    recommendation: {
      systemSize: { type: Number, default: 0 },              // kW
      estimatedPanels: { type: Number, default: 0 },
      estimatedSavings: { type: Number, default: 0 },        // INR per month
      estimatedCost: { type: Number, default: 0 },           // INR
      paybackPeriod: { type: Number, default: 0 },           // years
      co2Savings: { type: Number, default: 0 },              // kg per year
    },
    analyzedAt: {
      type: Date,
    },
    notes: {
      type: String,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);

billSchema.index({ userId: 1, createdAt: -1 });
billSchema.index({ status: 1 });

const Bill = mongoose.model('Bill', billSchema);
export default Bill;
