import { Router } from 'express';
import {
  register, login, logout, refreshToken, getMe,
  changePassword, forgotPassword, resetPassword,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import validate from '../middleware/validate.js';
import {
  registerValidator, loginValidator, forgotPasswordValidator,
  resetPasswordValidator, changePasswordValidator,
} from '../validators/authValidator.js';

const router = Router();

router.post('/register', authLimiter, registerValidator, validate, register);
router.post('/login', authLimiter, loginValidator, validate, login);
router.post('/refresh', refreshToken);
router.post('/forgot-password', authLimiter, forgotPasswordValidator, validate, forgotPassword);
router.put('/reset-password/:token', resetPasswordValidator, validate, resetPassword);

// Protected routes
router.use(protect);
router.post('/logout', logout);
router.get('/me', getMe);
router.put('/change-password', changePasswordValidator, validate, changePassword);

export default router;
