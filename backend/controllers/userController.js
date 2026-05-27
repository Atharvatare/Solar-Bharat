import User from '../models/User.js';
import { asyncHandler, sendSuccess, sendPaginated, ApiError, sanitizeUser, getPagination } from '../utils/helpers.js';
import { HTTP_STATUS } from '../utils/constants.js';

/**
 * @desc    Get user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  sendSuccess(res, { user: sanitizeUser(user) });
});

/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const allowedFields = ['name', 'phone', 'location', 'avatar'];
  const updates = {};

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  });

  sendSuccess(res, { user: sanitizeUser(user) }, 'Profile updated successfully');
});

/**
 * @desc    Update user preferences
 * @route   PUT /api/users/preferences
 * @access  Private
 */
export const updatePreferences = asyncHandler(async (req, res) => {
  const { preferences } = req.body;

  const user = await User.findById(req.user._id);

  if (preferences) {
    user.preferences = { ...user.preferences.toObject(), ...preferences };
    await user.save({ validateBeforeSave: false });
  }

  sendSuccess(res, { preferences: user.preferences }, 'Preferences updated');
});

/**
 * @desc    Update solar system info
 * @route   PUT /api/users/solar-system
 * @access  Private
 */
export const updateSolarSystem = asyncHandler(async (req, res) => {
  const allowedFields = ['installed', 'capacity', 'panels', 'installedDate', 'inverterModel', 'vendorId'];
  const updates = {};

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[`solarSystem.${field}`] = req.body[field];
    }
  });

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  });

  sendSuccess(res, { solarSystem: user.solarSystem }, 'Solar system info updated');
});

/**
 * @desc    Delete user account
 * @route   DELETE /api/users/account
 * @access  Private
 */
export const deleteAccount = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { isActive: false });
  sendSuccess(res, null, 'Account deactivated successfully');
});

/**
 * @desc    Get all users (admin)
 * @route   GET /api/users
 * @access  Private/Admin
 */
export const getAllUsers = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const { role, search, status } = req.query;

  const filter = {};
  if (role) filter.role = role;
  if (status === 'active') filter.isActive = true;
  if (status === 'inactive') filter.isActive = false;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const [users, total] = await Promise.all([
    User.find(filter).select('-refreshToken').sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(filter),
  ]);

  sendPaginated(res, users.map(sanitizeUser), { page, limit, total });
});

/**
 * @desc    Get user by ID (admin)
 * @route   GET /api/users/:id
 * @access  Private/Admin
 */
export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'User not found');
  }
  sendSuccess(res, { user: sanitizeUser(user) });
});

/**
 * @desc    Update user role (admin)
 * @route   PUT /api/users/:id/role
 * @access  Private/Admin
 */
export const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true, runValidators: true }
  );

  if (!user) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'User not found');
  }

  sendSuccess(res, { user: sanitizeUser(user) }, 'User role updated');
});

/**
 * @desc    Toggle user active status (admin)
 * @route   PUT /api/users/:id/status
 * @access  Private/Admin
 */
export const toggleUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'User not found');
  }

  user.isActive = !user.isActive;
  await user.save({ validateBeforeSave: false });

  sendSuccess(res, { user: sanitizeUser(user) }, `User ${user.isActive ? 'activated' : 'deactivated'}`);
});
