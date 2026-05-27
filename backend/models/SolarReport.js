import mongoose from 'mongoose';
import { REPORT_STATUS, PANEL_TYPES } from '../utils/constants.js';

const solarReportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    reportType: {
      type: String,
      enum: ['calculator', 'rooftop_analysis', 'bill_based'],
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(REPORT_STATUS),
      default: REPORT_STATUS.PENDING,
    },
    // Input parameters
    inputs: {
      roofArea: { type: Number },               // sq ft
      monthlyBill: { type: Number },             // INR
      electricityRate: { type: Number },          // INR per unit
      sunlightHours: { type: Number },
      location: {
        city: String,
        state: String,
        latitude: Number,
        longitude: Number,
        pincode: String,
      },
      panelType: {
        type: String,
        enum: Object.values(PANEL_TYPES),
        default: PANEL_TYPES.MONOCRYSTALLINE,
      },
      includeSubsidy: { type: Boolean, default: true },
      monthlyConsumption: { type: Number },      // kWh
    },
    // Calculated results
    results: {
      systemSize: { type: Number, default: 0 },             // kW
      numberOfPanels: { type: Number, default: 0 },
      totalCost: { type: Number, default: 0 },               // INR
      costAfterSubsidy: { type: Number, default: 0 },
      subsidyAmount: { type: Number, default: 0 },
      annualGeneration: { type: Number, default: 0 },        // kWh
      annualSavings: { type: Number, default: 0 },           // INR
      monthlySavings: { type: Number, default: 0 },
      paybackPeriod: { type: Number, default: 0 },           // years
      lifetimeSavings: { type: Number, default: 0 },         // 25 years
      co2OffsetPerYear: { type: Number, default: 0 },        // kg
      treesEquivalent: { type: Number, default: 0 },
      roi: { type: Number, default: 0 },                     // percentage
    },
    // Rooftop analysis specific
    rooftopAnalysis: {
      usableArea: { type: Number },             // sq ft
      roofOrientation: { type: String },
      roofTilt: { type: Number },                // degrees
      shadingFactor: { type: Number },           // % (0-100)
      structuralSuitability: { type: String, enum: ['suitable', 'marginal', 'unsuitable'] },
      estimatedOutput: { type: Number },         // kWh per year
    },
    // Monthly projection data
    monthlyProjection: [{
      month: String,
      generation: Number,
      savings: Number,
    }],
    // ROI projection
    roiProjection: [{
      year: Number,
      cumulativeSavings: Number,
      netBenefit: Number,
    }],
  },
  {
    timestamps: true,
  }
);

solarReportSchema.index({ userId: 1, createdAt: -1 });
solarReportSchema.index({ reportType: 1 });

const SolarReport = mongoose.model('SolarReport', solarReportSchema);
export default SolarReport;
