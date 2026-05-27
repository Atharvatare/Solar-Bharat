import User from '../models/User.js';
import Bill from '../models/Bill.js';
import SolarReport from '../models/SolarReport.js';
import Analytics from '../models/Analytics.js';
import Notification from '../models/Notification.js';
import ChatHistory from '../models/ChatHistory.js';
import Product from '../models/Product.js';
import Vendor from '../models/Vendor.js';
import { asyncHandler, sendSuccess, sendPaginated, ApiError, getPagination, sanitizeUser } from '../utils/helpers.js';
import { HTTP_STATUS } from '../utils/constants.js';
import { getAdminDashboardSummary } from '../services/analyticsService.js';

/**
 * @desc    Get admin dashboard overview
 * @route   GET /api/admin/dashboard
 * @access  Private/Admin
 */
export const getAdminDashboard = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    activeUsers,
    totalBills,
    totalReports,
    totalVendors,
    totalProducts,
    recentUsers,
    platformSummary,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ isActive: true }),
    Bill.countDocuments(),
    SolarReport.countDocuments(),
    Vendor.countDocuments(),
    Product.countDocuments(),
    User.find().select('-password -refreshToken').sort({ createdAt: -1 }).limit(5),
    getAdminDashboardSummary(),
  ]);

  // User growth (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const userGrowth = await User.aggregate([
    { $match: { createdAt: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  sendSuccess(res, {
    stats: { totalUsers, activeUsers, totalBills, totalReports, totalVendors, totalProducts },
    recentUsers: recentUsers.map(sanitizeUser),
    userGrowth,
    platform: platformSummary,
  });
});

/**
 * @desc    Get all bills (admin)
 * @route   GET /api/admin/bills
 * @access  Private/Admin
 */
export const getAllBills = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = {};

  if (req.query.status) filter.status = req.query.status;

  const [bills, total] = await Promise.all([
    Bill.find(filter).populate('userId', 'name email').sort({ createdAt: -1 }).skip(skip).limit(limit),
    Bill.countDocuments(filter),
  ]);

  sendPaginated(res, bills, { page, limit, total });
});

/**
 * @desc    Get platform analytics (admin)
 * @route   GET /api/admin/analytics
 * @access  Private/Admin
 */
export const getPlatformAnalytics = asyncHandler(async (req, res) => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    totalEnergy,
    totalSavings,
    billsByStatus,
    reportsByType,
  ] = await Promise.all([
    Analytics.aggregate([
      { $match: { date: { $gte: thirtyDaysAgo } } },
      { $group: { _id: null, total: { $sum: '$energy.generated' } } },
    ]),
    Analytics.aggregate([
      { $match: { date: { $gte: thirtyDaysAgo } } },
      { $group: { _id: null, total: { $sum: '$financial.savings' } } },
    ]),
    Bill.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    SolarReport.aggregate([
      { $group: { _id: '$reportType', count: { $sum: 1 } } },
    ]),
  ]);

  sendSuccess(res, {
    totalEnergy: totalEnergy[0]?.total || 0,
    totalSavings: totalSavings[0]?.total || 0,
    billsByStatus,
    reportsByType,
  });
});

/**
 * @desc    Manage vendors (CRUD)
 * @route   POST /api/admin/vendors
 * @access  Private/Admin
 */
export const createVendor = asyncHandler(async (req, res) => {
  const vendor = await Vendor.create(req.body);
  sendSuccess(res, { vendor }, 'Vendor created', HTTP_STATUS.CREATED);
});

/**
 * @desc    Get all vendors
 * @route   GET /api/admin/vendors
 * @access  Private/Admin
 */
export const getVendors = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = {};
  if (req.query.status) filter.status = req.query.status;

  const [vendors, total] = await Promise.all([
    Vendor.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Vendor.countDocuments(filter),
  ]);

  sendPaginated(res, vendors, { page, limit, total });
});

/**
 * @desc    Manage products (CRUD)
 * @route   POST /api/admin/products
 * @access  Private/Admin
 */
export const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  sendSuccess(res, { product }, 'Product created', HTTP_STATUS.CREATED);
});

/**
 * @desc    Get all products
 * @route   GET /api/admin/products
 * @access  Private/Admin
 */
export const getProducts = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = {};
  if (req.query.category) filter.category = req.query.category;

  const [products, total] = await Promise.all([
    Product.find(filter).populate('vendorId', 'companyName').sort({ createdAt: -1 }).skip(skip).limit(limit),
    Product.countDocuments(filter),
  ]);

  sendPaginated(res, products, { page, limit, total });
});

/**
 * @desc    Send system-wide notification
 * @route   POST /api/admin/notifications/broadcast
 * @access  Private/Admin
 */
export const broadcastNotification = asyncHandler(async (req, res) => {
  const { title, message, type } = req.body;

  if (!title || !message) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Title and message are required');
  }

  const users = await User.find({ isActive: true }).select('_id');
  const notifications = users.map((user) => ({
    userId: user._id,
    type: type || 'system',
    title,
    message,
  }));

  await Notification.insertMany(notifications);

  sendSuccess(res, { recipientCount: users.length }, `Notification sent to ${users.length} users`);
});
