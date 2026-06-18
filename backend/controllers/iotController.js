import IoTDevice from '../models/IoTDevice.js';
import IoTReading from '../models/IoTReading.js';
import { generateLiveReading, generateDailyReadings, generateDailyStats } from '../services/iotSimulatorService.js';
import { asyncHandler, sendSuccess, ApiError } from '../utils/helpers.js';
import { HTTP_STATUS } from '../utils/constants.js';

/**
 * @desc    Get all IoT devices for the authenticated user.
 *          Auto-creates a demo inverter device if user has none.
 * @route   GET /api/iot/devices
 * @access  Private
 */
export const getDevices = asyncHandler(async (req, res) => {
  let devices = await IoTDevice.find({ userId: req.user._id, isActive: true })
    .sort({ createdAt: -1 });

  // Auto-provision a demo device if user has no devices
  if (devices.length === 0) {
    const demoDevice = await IoTDevice.create({
      userId: req.user._id,
      deviceId: `SB-INV-${req.user._id.toString().slice(-6)}`,
      name: 'Solar Inverter (Demo)',
      type: 'inverter',
      systemCapacity: 5,
      status: 'online',
    });
    devices = [demoDevice];
  }

  sendSuccess(res, { devices });
});

/**
 * @desc    Get a real-time simulated reading for a specific device
 * @route   GET /api/iot/devices/:deviceId/live
 * @access  Private
 */
export const getLiveReading = asyncHandler(async (req, res) => {
  const device = await IoTDevice.findOne({
    deviceId: req.params.deviceId,
    userId: req.user._id,
    isActive: true,
  });

  if (!device) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Device not found');
  }

  const reading = generateLiveReading(device.systemCapacity);

  // Update device last seen timestamp
  device.lastSeen = new Date();
  await device.save();

  sendSuccess(res, {
    device: {
      deviceId: device.deviceId,
      name: device.name,
      type: device.type,
      status: device.status,
      systemCapacity: device.systemCapacity,
    },
    reading,
  });
});

/**
 * @desc    Get historical readings for a device (today / week / month)
 * @route   GET /api/iot/devices/:deviceId/readings?range=today|week|month
 * @access  Private
 */
export const getDeviceReadings = asyncHandler(async (req, res) => {
  const device = await IoTDevice.findOne({
    deviceId: req.params.deviceId,
    userId: req.user._id,
    isActive: true,
  });

  if (!device) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Device not found');
  }

  const range = req.query.range || 'today';
  let data;

  switch (range) {
    case 'today': {
      data = generateDailyReadings(device.systemCapacity, new Date());
      break;
    }

    case 'week': {
      data = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const stats = generateDailyStats(device.systemCapacity);
        data.push({
          date: date.toISOString().split('T')[0],
          ...stats,
        });
      }
      break;
    }

    case 'month': {
      data = [];
      for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const stats = generateDailyStats(device.systemCapacity);
        data.push({
          date: date.toISOString().split('T')[0],
          ...stats,
        });
      }
      break;
    }

    default:
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Invalid range. Use today, week, or month.');
  }

  sendSuccess(res, { range, readings: data });
});

/**
 * @desc    Get daily statistics summary for a device
 * @route   GET /api/iot/devices/:deviceId/stats
 * @access  Private
 */
export const getDailyStats = asyncHandler(async (req, res) => {
  const device = await IoTDevice.findOne({
    deviceId: req.params.deviceId,
    userId: req.user._id,
    isActive: true,
  });

  if (!device) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Device not found');
  }

  const stats = generateDailyStats(device.systemCapacity);

  sendSuccess(res, {
    device: {
      deviceId: device.deviceId,
      name: device.name,
      systemCapacity: device.systemCapacity,
    },
    stats,
  });
});

/**
 * @desc    Register a new IoT device
 * @route   POST /api/iot/devices
 * @access  Private
 */
export const registerDevice = asyncHandler(async (req, res) => {
  const { deviceId, name, type, systemCapacity, location } = req.body;

  if (!deviceId || !name) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'deviceId and name are required');
  }

  // Check for duplicate deviceId
  const existing = await IoTDevice.findOne({ deviceId });
  if (existing) {
    throw new ApiError(HTTP_STATUS.CONFLICT, 'A device with this ID already exists');
  }

  const device = await IoTDevice.create({
    userId: req.user._id,
    deviceId,
    name,
    type: type || 'inverter',
    systemCapacity: systemCapacity || 5,
    location,
  });

  sendSuccess(res, { device }, 'Device registered successfully', HTTP_STATUS.CREATED);
});
