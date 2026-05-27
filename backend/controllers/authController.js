import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import config from '../config/config.js';
import { asyncHandler, sendSuccess, ApiError, sanitizeUser } from '../utils/helpers.js';
import { HTTP_STATUS } from '../utils/constants.js';
import { sendWelcomeNotification } from '../services/notificationService.js';
import logger from '../utils/logger.js';

// Helper: generate tokens and set cookie
const sendTokenResponse = async (user, statusCode, res) => {
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  // Save refresh token to DB
  user.refreshToken = refreshToken;
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  const cookieOptions = {
    expires: new Date(Date.now() + config.jwt.cookieExpire * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: config.env === 'production',
    sameSite: 'strict',
  };

  return res
    .status(statusCode)
    .cookie('refreshToken', refreshToken, cookieOptions)
    .json({
      success: true,
      message: statusCode === 201 ? 'Registration successful' : 'Login successful',
      data: {
        user: sanitizeUser(user),
        accessToken,
        refreshToken,
      },
    });
};

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
    throw new ApiError(HTTP_STATUS.CONFLICT, 'User with this email already exists');
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    phone,
  });

  // Send welcome notification
  try {
    await sendWelcomeNotification(user._id, user.name);
  } catch (err) {
    logger.warn(`Failed to send welcome notification: ${err.message}`);
  }

  logger.info(`New user registered: ${email}`);
  await sendTokenResponse(user, HTTP_STATUS.CREATED, res);
});

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user and include password
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Invalid email or password');
  }

  if (!user.isActive) {
    throw new ApiError(HTTP_STATUS.FORBIDDEN, 'Account has been deactivated. Contact support.');
  }

  // Check password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Invalid email or password');
  }

  logger.info(`User logged in: ${email}`);
  await sendTokenResponse(user, HTTP_STATUS.OK, res);
});

/**
 * @desc    Refresh access token
 * @route   POST /api/auth/refresh
 * @access  Public (with refresh token)
 */
export const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken: token } = req.body;

  if (!token) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Refresh token is required');
  }

  // Verify refresh token
  let decoded;
  try {
    decoded = jwt.verify(token, config.jwt.refreshSecret);
  } catch (err) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Invalid or expired refresh token');
  }

  // Find user with matching refresh token
  const user = await User.findById(decoded.id).select('+refreshToken');
  if (!user || user.refreshToken !== token) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Invalid refresh token');
  }

  // Generate new tokens
  const newAccessToken = user.generateAccessToken();
  const newRefreshToken = user.generateRefreshToken();

  user.refreshToken = newRefreshToken;
  await user.save({ validateBeforeSave: false });

  sendSuccess(res, {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  }, 'Token refreshed successfully');
});

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Private
 */
export const logout = asyncHandler(async (req, res) => {
  // Clear refresh token from DB
  await User.findByIdAndUpdate(req.user._id, { refreshToken: null });

  res
    .cookie('refreshToken', '', { expires: new Date(0), httpOnly: true })
    .json({ success: true, message: 'Logged out successfully' });
});

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
 * @desc    Change password
 * @route   PUT /api/auth/change-password
 * @access  Private
 */
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Current password is incorrect');
  }

  user.password = newPassword;
  await user.save();

  logger.info(`Password changed for user: ${user.email}`);
  sendSuccess(res, null, 'Password changed successfully');
});

/**
 * @desc    Forgot password
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    // Don't reveal if email exists
    return sendSuccess(res, null, 'If an account exists with this email, a reset link has been sent.');
  }

  // Generate reset token (in production, send via email)
  const resetToken = jwt.sign({ id: user._id }, config.jwt.secret, { expiresIn: '1h' });
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpire = Date.now() + 60 * 60 * 1000;
  await user.save({ validateBeforeSave: false });

  logger.info(`Password reset requested for: ${email}`);
  sendSuccess(res, { resetToken }, 'Password reset token generated. In production, this is sent via email.');
});

/**
 * @desc    Reset password
 * @route   PUT /api/auth/reset-password/:token
 * @access  Public
 */
export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  // Verify token
  let decoded;
  try {
    decoded = jwt.verify(token, config.jwt.secret);
  } catch (err) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Invalid or expired reset token');
  }

  const user = await User.findOne({
    _id: decoded.id,
    resetPasswordToken: token,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Invalid or expired reset token');
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  logger.info(`Password reset for: ${user.email}`);
  sendSuccess(res, null, 'Password reset successful. You can now log in with your new password.');
});
