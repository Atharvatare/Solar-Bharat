import { Router } from 'express';
import {
  getAdminDashboard, getAllBills, getPlatformAnalytics,
  createVendor, getVendors, updateVendor, deleteVendor, verifyVendor,
  createProduct, getProducts, updateProduct, deleteProduct,
  broadcastNotification,
  getUsers, updateUser, deleteUser,
  getQuotations, createQuotation, updateQuotation,
  getLeads, createLead, updateLead,
  getBookings, createBooking, updateBooking,
} from '../controllers/adminController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/roleCheck.js';

const router = Router();

// All admin routes require auth + admin role
router.use(protect, authorize('admin'));

// Dashboard & Analytics
router.get('/dashboard', getAdminDashboard);
router.get('/analytics', getPlatformAnalytics);
router.get('/bills', getAllBills);

// Users
router.get('/users', getUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Vendors
router.get('/vendors', getVendors);
router.post('/vendors', createVendor);
router.put('/vendors/:id', updateVendor);
router.delete('/vendors/:id', deleteVendor);
router.put('/vendors/:id/verify', verifyVendor);

// Products
router.get('/products', getProducts);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

// Quotations
router.get('/quotations', getQuotations);
router.post('/quotations', createQuotation);
router.put('/quotations/:id', updateQuotation);

// Leads
router.get('/leads', getLeads);
router.post('/leads', createLead);
router.put('/leads/:id', updateLead);

// Bookings
router.get('/bookings', getBookings);
router.post('/bookings', createBooking);
router.put('/bookings/:id', updateBooking);

// Broadcast
router.post('/notifications/broadcast', broadcastNotification);

export default router;
