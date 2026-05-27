import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
    },
    energy: {
      generated: { type: Number, default: 0 },        // kWh
      consumed: { type: Number, default: 0 },
      exported: { type: Number, default: 0 },
      imported: { type: Number, default: 0 },
      selfConsumed: { type: Number, default: 0 },
    },
    financial: {
      savings: { type: Number, default: 0 },           // INR
      earnings: { type: Number, default: 0 },           // from net metering
      gridCost: { type: Number, default: 0 },
    },
    environmental: {
      co2Offset: { type: Number, default: 0 },          // kg
      treesEquivalent: { type: Number, default: 0 },
    },
    system: {
      panelEfficiency: { type: Number, default: 0 },    // percentage
      inverterEfficiency: { type: Number, default: 0 },
      batteryLevel: { type: Number, default: 0 },       // percentage
      peakOutput: { type: Number, default: 0 },          // kW
      uptime: { type: Number, default: 100 },            // percentage
    },
    weather: {
      condition: { type: String },
      temperature: { type: Number },
      sunlightHours: { type: Number },
      cloudCover: { type: Number },
    },
    hourlyData: [{
      hour: { type: Number, min: 0, max: 23 },
      generated: { type: Number, default: 0 },
      consumed: { type: Number, default: 0 },
    }],
    period: {
      type: String,
      enum: ['daily', 'weekly', 'monthly'],
      default: 'daily',
    },
  },
  {
    timestamps: true,
  }
);

analyticsSchema.index({ userId: 1, date: -1 });
analyticsSchema.index({ userId: 1, period: 1, date: -1 });

const Analytics = mongoose.model('Analytics', analyticsSchema);
export default Analytics;
