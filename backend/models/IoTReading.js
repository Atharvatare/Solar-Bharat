import mongoose from 'mongoose';

const iotReadingSchema = new mongoose.Schema(
  {
    deviceId: {
      type: String,
      required: true,
      index: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
    // Electrical measurements
    voltage: { type: Number },       // Volts (V)
    current: { type: Number },       // Amps (A)
    power: { type: Number },         // Watts (W)
    energy: { type: Number },        // Cumulative kWh
    frequency: { type: Number },     // Hz

    // Environmental
    temperature: { type: Number },   // °C (panel temperature)
    ambientTemp: { type: Number },   // °C (ambient)
    irradiance: { type: Number },    // W/m²
    humidity: { type: Number },      // %

    // Derived
    efficiency: { type: Number },    // %
    powerFactor: { type: Number },   // 0-1
  },
  {
    timestamps: false, // We use our own timestamp
    // Auto-delete readings older than 90 days to save storage
    expireAfterSeconds: 90 * 24 * 60 * 60,
  }
);

// Compound index for efficient time-range queries per device
iotReadingSchema.index({ deviceId: 1, timestamp: -1 });

// TTL index for auto-cleanup
iotReadingSchema.index({ timestamp: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

const IoTReading = mongoose.model('IoTReading', iotReadingSchema);
export default IoTReading;
