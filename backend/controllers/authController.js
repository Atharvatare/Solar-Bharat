import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import TokenBlacklist from '../models/TokenBlacklist.js';
import config from '../config/config.js';
import { asyncHandler, sendSuccess, ApiError, sanitizeUser } from '../utils/helpers.js';
import { HTTP_STATUS } from '../utils/constants.js';
import { sendWelcomeNotification } from '../services/notificationService.js';
import {
  sendVerificationEmail, sendPasswordResetEmail,
  sendLoginAlertEmail, sendAccountLockedEmail,
} from '../services/emailService.js';
import {
  createSession, invalidateSessionByToken,
  invalidateAllSessions, getActiveSessions,
  invalidateSession, validateSession,
} from '../services/sessionService.js';
import logger from '../utils/logger.js';

// =============================================
// HELPERS
// =============================================

/**
 * Generate token pair, create session, set cookie, send response
 */
const sendTokenResponse = async (user, statusCode, res, req, message) => {
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  // Save refresh token in user document
  user.refreshToken = refreshToken;
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  // Create a tracked session
  await createSession(user._id, refreshToken, req);

  // Set httpOnly cookie for refresh token
  const cookieOptions = {
    expires: new Date(Date.now() + config.jwt.cookieExpire * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: config.env === 'production',
    sameSite: config.env === 'production' ? 'strict' : 'lax',
    path: '/api/auth',
  };

  return res
    .status(statusCode)
    .cookie('refreshToken', refreshToken, cookieOptions)
    .json({
      success: true,
      message: message || (statusCode === 201 ? 'Registration successful' : 'Login successful'),
      data: {
        user: sanitizeUser(user),
        accessToken,
        refreshToken,
        expiresIn: config.jwt.expire,
      },
    });
};

// =============================================
// PUBLIC ENDPOINTS
// =============================================

/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(HTTP_STATUS.CONFLICT, 'An account with this email already exists.');
  }

  // Create user
  const user = await User.create({ name, email, password, phone });

  // Generate email verification token
  const verificationToken = user.generateEmailVerificationToken();
  await user.save({ validateBeforeSave: false });

  // Send verification email (non-blocking)
  try {
    await sendVerificationEmail(email, name, verificationToken);
  } catch (err) {
    logger.warn(`Verification email failed for ${email}: ${err.message}`);
  }

  // Send welcome notification
  try {
    await sendWelcomeNotification(user._id, name);
  } catch (err) {
    logger.warn(`Welcome notification failed: ${err.message}`);
  }

  logger.info(`New user registered: ${email}`);
  await sendTokenResponse(user, HTTP_STATUS.CREATED, res, req, 'Registration successful. Please verify your email.');
});

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user with security fields
  const user = await User.findOne({ email }).select('+password +loginAttempts +lockUntil');
  if (!user) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Invalid email or password.');
  }

  // Check if account is locked
  if (user.isLocked()) {
    const remaining = Math.ceil((user.lockUntil - Date.now()) / 60000);
    throw new ApiError(
      HTTP_STATUS.TOO_MANY_REQUESTS,
      `Account temporarily locked due to too many failed attempts. Try again in ${remaining} minutes.`
    );
  }

  if (!user.isActive) {
    throw new ApiError(HTTP_STATUS.FORBIDDEN, 'Account has been deactivated. Contact support.');
  }

  // Verify password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    // Increment failed attempts
    await user.incrementLoginAttempts();

    // Check if this triggers a lock
    const updatedUser = await User.findById(user._id).select('+loginAttempts +lockUntil');
    if (updatedUser.isLocked()) {
      const lockMinutes = Math.ceil(config.security.lockDuration / 60000);
      try {
        await sendAccountLockedEmail(email, user.name, lockMinutes);
      } catch (e) { /* non-critical */ }
      throw new ApiError(
        HTTP_STATUS.TOO_MANY_REQUESTS,
        `Account locked for ${lockMinutes} minutes due to ${config.security.maxLoginAttempts} failed attempts.`
      );
    }

    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Invalid email or password.');
  }

  // Successful login — reset attempts
  await user.resetLoginAttempts();

  // Send login alert email (non-blocking)
  try {
    const { parseDevice } = await import('../services/sessionService.js');
    const device = parseDevice(req);
    await sendLoginAlertEmail(email, user.name, device);
  } catch (e) { /* non-critical */ }

  logger.info(`User logged in: ${email}`);
  await sendTokenResponse(user, HTTP_STATUS.OK, res, req);
});

/**
 * @desc    Verify email address
 * @route   GET /api/auth/verify-email/:token
 * @access  Public
 */
export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;

  // Hash the token to compare with DB
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpire: { $gt: Date.now() },
  }).select('+emailVerificationToken +emailVerificationExpire');

  if (!user) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Invalid or expired verification token.');
  }

  // Mark email as verified
  user.emailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpire = undefined;
  await user.save({ validateBeforeSave: false });

  logger.info(`Email verified: ${user.email}`);
  sendSuccess(res, { emailVerified: true }, 'Email verified successfully! Your account is now fully activated.');
});

/**
 * @desc    Resend verification email
 * @route   POST /api/auth/resend-verification
 * @access  Private
 */
export const resendVerification = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user.emailVerified) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Email is already verified.');
  }

  const verificationToken = user.generateEmailVerificationToken();
  await user.save({ validateBeforeSave: false });

  await sendVerificationEmail(user.email, user.name, verificationToken);

  sendSuccess(res, null, 'Verification email sent. Please check your inbox.');
});

/**
 * @desc    Refresh access token using refresh token
 * @route   POST /api/auth/refresh
 * @access  Public (with valid refresh token)
 */
export const refreshToken = asyncHandler(async (req, res) => {
  // Get refresh token from body or cookie
  const token = req.body.refreshToken || req.cookies?.refreshToken;

  if (!token) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Refresh token is required.');
  }

  // Verify refresh token signature
  let decoded;
  try {
    decoded = jwt.verify(token, config.jwt.refreshSecret, { issuer: 'solar-bharat' });
  } catch (err) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Invalid or expired refresh token.');
  }

  // Validate session is still active
  const session = await validateSession(token);
  if (!session) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Session expired or invalid. Please log in again.');
  }

  // Find user with matching refresh token
  const user = await User.findById(decoded.id).select('+refreshToken');
  if (!user || user.refreshToken !== token) {
    // Token reuse detected — potential attack, invalidate all sessions
    await invalidateAllSessions(decoded.id);
    logger.warn(`Token reuse detected for user ${decoded.id} — all sessions invalidated`);
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Token reuse detected. All sessions revoked for security.');
  }

  // Generate new token pair (rotate refresh token)
  const newAccessToken = user.generateAccessToken();
  const newRefreshToken = user.generateRefreshToken();

  // Update session with new refresh token
  session.refreshToken = newRefreshToken;
  session.lastActivity = new Date();
  await session.save();

  // Update user's refresh token
  user.refreshToken = newRefreshToken;
  await user.save({ validateBeforeSave: false });

  // Set new cookie
  const cookieOptions = {
    expires: new Date(Date.now() + config.jwt.cookieExpire * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: config.env === 'production',
    sameSite: config.env === 'production' ? 'strict' : 'lax',
    path: '/api/auth',
  };

  res.cookie('refreshToken', newRefreshToken, cookieOptions);

  sendSuccess(res, {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    expiresIn: config.jwt.expire,
  }, 'Token refreshed successfully.');
});

// =============================================
// PROTECTED ENDPOINTS (require auth)
// =============================================

/**
 * @desc    Get current user
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  sendSuccess(res, { user: sanitizeUser(user) });
});

/**
 * @desc    Logout user (invalidate current session + blacklist token)
 * @route   POST /api/auth/logout
 * @access  Private
 */
export const logout = asyncHandler(async (req, res) => {
  // Blacklist the current access token
  try {
    const decoded = jwt.decode(req.token);
    await TokenBlacklist.create({
      token: req.token,
      userId: req.user._id,
      reason: 'logout',
      expiresAt: new Date(decoded.exp * 1000), // Auto-cleanup when token naturally expires
    });
  } catch (e) {
    logger.warn(`Token blacklist failed: ${e.message}`);
  }

  // Invalidate session by refresh token
  const user = await User.findById(req.user._id).select('+refreshToken');
  if (user?.refreshToken) {
    await invalidateSessionByToken(user.refreshToken);
  }

  // Clear refresh token from user
  user.refreshToken = null;
  await user.save({ validateBeforeSave: false });

  // Clear cookie
  res.cookie('refreshToken', '', { expires: new Date(0), httpOnly: true, path: '/api/auth' });

  sendSuccess(res, null, 'Logged out successfully.');
});

/**
 * @desc    Logout from all devices
 * @route   POST /api/auth/logout-all
 * @access  Private
 */
export const logoutAll = asyncHandler(async (req, res) => {
  // Blacklist current access token
  try {
    const decoded = jwt.decode(req.token);
    await TokenBlacklist.create({
      token: req.token,
      userId: req.user._id,
      reason: 'security',
      expiresAt: new Date(decoded.exp * 1000),
    });
  } catch (e) { /* best effort */ }

  // Invalidate all sessions
  const count = await invalidateAllSessions(req.user._id);

  // Clear refresh token from user
  await User.findByIdAndUpdate(req.user._id, { refreshToken: null });

  res.cookie('refreshToken', '', { expires: new Date(0), httpOnly: true, path: '/api/auth' });

  logger.info(`User ${req.user.email} logged out from all devices (${count} sessions)`);
  sendSuccess(res, { sessionsRevoked: count }, 'Logged out from all devices successfully.');
});

/**
 * @desc    Get active sessions
 * @route   GET /api/auth/sessions
 * @access  Private
 */
export const getSessions = asyncHandler(async (req, res) => {
  const sessions = await getActiveSessions(req.user._id);
  sendSuccess(res, { sessions, count: sessions.length });
});

/**
 * @desc    Revoke a specific session
 * @route   DELETE /api/auth/sessions/:sessionId
 * @access  Private
 */
export const revokeSession = asyncHandler(async (req, res) => {
  const session = await invalidateSession(req.params.sessionId, req.user._id);
  if (!session) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Session not found.');
  }
  sendSuccess(res, null, 'Session revoked successfully.');
});

/**
 * @desc    Change password
 * @route   PUT /api/auth/change-password
 * @access  Private
 */
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Current password is incorrect.');
  }

  user.password = newPassword;
  await user.save();

  // Invalidate all other sessions (security — force re-login on other devices)
  await invalidateAllSessions(req.user._id);

  // Blacklist current token so user must re-login with new password
  try {
    const decoded = jwt.decode(req.token);
    await TokenBlacklist.create({
      token: req.token,
      userId: req.user._id,
      reason: 'password_change',
      expiresAt: new Date(decoded.exp * 1000),
    });
  } catch (e) { /* best effort */ }

  logger.info(`Password changed: ${user.email}`);
  sendSuccess(res, null, 'Password changed successfully. Please log in again on all devices.');
});

/**
 * @desc    Forgot password — sends reset email
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  // Always return success (don't reveal if email exists)
  if (!user) {
    return sendSuccess(res, null, 'If an account exists with this email, a password reset link has been sent.');
  }

  // Generate crypto reset token
  const resetToken = user.generateResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // Send reset email
  try {
    await sendPasswordResetEmail(email, user.name, resetToken);
  } catch (err) {
    // Rollback token if email fails
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    logger.error(`Password reset email failed: ${err.message}`);
    throw new ApiError(HTTP_STATUS.SERVER_ERROR, 'Failed to send reset email. Please try again.');
  }

  logger.info(`Password reset requested: ${email}`);
  sendSuccess(res, null, 'If an account exists with this email, a password reset link has been sent.');
});

/**
 * @desc    Reset password using token
 * @route   PUT /api/auth/reset-password/:token
 * @access  Public
 */
export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  // Hash the token to compare with DB
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  }).select('+resetPasswordToken +resetPasswordExpire');

  if (!user) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Invalid or expired reset token.');
  }

  // Set new password
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  // Invalidate all existing sessions
  await invalidateAllSessions(user._id);

  // Clear refresh token
  user.refreshToken = null;
  await user.save({ validateBeforeSave: false });

  logger.info(`Password reset completed: ${user.email}`);
  sendSuccess(res, null, 'Password reset successful. Please log in with your new password.');
});
