import { Router } from 'express';
import {
  getDevices,
  getLiveReading,
  getDeviceReadings,
  getDailyStats,
  registerDevice,
} from '../controllers/iotController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

// All IoT routes require authentication
router.use(protect);

router.get('/devices', getDevices);
router.post('/devices', registerDevice);
router.get('/devices/:deviceId/live', getLiveReading);
router.get('/devices/:deviceId/readings', getDeviceReadings);
router.get('/devices/:deviceId/stats', getDailyStats);

export default router;
