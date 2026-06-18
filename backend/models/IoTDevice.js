import mongoose from 'mongoose';

const iotDeviceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    deviceId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['inverter', 'meter', 'sensor', 'controller'],
      default: 'inverter',
    },
    status: {
      type: String,
      enum: ['online', 'offline', 'error', 'maintenance'],
      default: 'online',
    },
    systemCapacity: {
      type: Number, // kW
      default: 5,
    },
    location: {
      lat: Number,
      lng: Number,
      address: String,
    },
    firmware: {
      version: { type: String, default: '1.0.0' },
      lastUpdated: { type: Date, default: Date.now },
    },
    lastSeen: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

iotDeviceSchema.index({ userId: 1, isActive: 1 });
iotDeviceSchema.index({ deviceId: 1 });
iotDeviceSchema.index({ status: 1 });

const IoTDevice = mongoose.model('IoTDevice', iotDeviceSchema);
export default IoTDevice;
