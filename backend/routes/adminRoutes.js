import { Router } from 'express';
import {
  getAdminDashboard, getAllBills, getPlatformAnalytics,
  createVendor, getVendors, createProduct, getProducts,
  broadcastNotification,
} from '../controllers/adminController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/roleCheck.js';

const router = Router();

// All admin routes require auth + admin role
router.use(protect, authorize('admin'));

router.get('/dashboard', getAdminDashboard);
router.get('/analytics', getPlatformAnalytics);
router.get('/bills', getAllBills);

// Vendor management
router.get('/vendors', getVendors);
router.post('/vendors', createVendor);

// Product management
router.get('/products', getProducts);
router.post('/products', createProduct);

// Broadcast
router.post('/notifications/broadcast', broadcastNotification);

export default router;
