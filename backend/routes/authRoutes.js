import { Router } from 'express';
import {
  register, login, logout, logoutAll, refreshToken, getMe,
  changePassword, forgotPassword, resetPassword,
  verifyEmail, resendVerification, getSessions, revokeSession,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import validate from '../middleware/validate.js';
import {
  registerValidator, loginValidator, forgotPasswordValidator,
  resetPasswordValidator, changePasswordValidator,
} from '../validators/authValidator.js';

const router = Router();

// ============================================
// PUBLIC ROUTES
// ============================================
router.post('/register', authLimiter, registerValidator, validate, register);
router.post('/login', authLimiter, loginValidator, validate, login);
router.post('/refresh', refreshToken);
router.post('/forgot-password', authLimiter, forgotPasswordValidator, validate, forgotPassword);
router.put('/reset-password/:token', resetPasswordValidator, validate, resetPassword);
router.get('/verify-email/:token', verifyEmail);

// ============================================
// PROTECTED ROUTES (require authentication)
// ============================================
router.use(protect);

router.get('/me', getMe);
router.post('/logout', logout);
router.post('/logout-all', logoutAll);
router.post('/resend-verification', resendVerification);
router.put('/change-password', changePasswordValidator, validate, changePassword);

// Session management
router.get('/sessions', getSessions);
router.delete('/sessions/:sessionId', revokeSession);

export default router;
