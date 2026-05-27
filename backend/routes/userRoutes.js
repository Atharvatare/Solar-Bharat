import { Router } from 'express';
import {
  getProfile, updateProfile, updatePreferences,
  updateSolarSystem, deleteAccount, getAllUsers,
  getUserById, updateUserRole, toggleUserStatus,
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/roleCheck.js';
import validate from '../middleware/validate.js';
import { updateProfileValidator, updatePreferencesValidator } from '../validators/userValidator.js';

const router = Router();

// All routes require authentication
router.use(protect);

// User profile routes
router.get('/profile', getProfile);
router.put('/profile', updateProfileValidator, validate, updateProfile);
router.put('/preferences', updatePreferencesValidator, validate, updatePreferences);
router.put('/solar-system', updateSolarSystem);
router.delete('/account', deleteAccount);

// Admin-only routes
router.get('/', authorize('admin'), getAllUsers);
router.get('/:id', authorize('admin'), getUserById);
router.put('/:id/role', authorize('admin'), updateUserRole);
router.put('/:id/status', authorize('admin'), toggleUserStatus);

export default router;
