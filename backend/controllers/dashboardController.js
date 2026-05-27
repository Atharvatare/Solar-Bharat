import Analytics from '../models/Analytics.js';
import Bill from '../models/Bill.js';
import SolarReport from '../models/SolarReport.js';
import { asyncHandler, sendSuccess, getPagination } from '../utils/helpers.js';
import { getUserDashboardSummary } from '../services/analyticsService.js';

/**
 * @desc    Get dashboard summary
 * @route   GET /api/dashboard/summary
 * @access  Private
 */
export const getDashboardSummary = asyncHandler(async (req, res) => {
  const period = req.query.period || '30d';
  const summary = await getUserDashboardSummary(req.user._id, period);

  // Also get bill count and report count
  const [billCount, reportCount] = await Promise.all([
    Bill.countDocuments({ userId: req.user._id }),
    SolarReport.countDocuments({ userId: req.user._id }),
  ]);

  sendSuccess(res, {
    ...summary,
    counts: { bills: billCount, reports: reportCount },
  });
});

/**
 * @desc    Get energy analytics data
 * @route   GET /api/dashboard/analytics
 * @access  Private
 */
export const getAnalytics = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const period = req.query.period || '30d';
  
  const periodDays = period === '7d' ? 7 : period === '90d' ? 90 : period === '1y' ? 365 : 30;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - periodDays);

  const [data, total] = await Promise.all([
    Analytics.find({ userId: req.user._id, date: { $gte: startDate } })
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit),
    Analytics.countDocuments({ userId: req.user._id, date: { $gte: startDate } }),
  ]);

  sendSuccess(res, { analytics: data, total, period: periodDays });
});

/**
 * @desc    Get weekly energy data
 * @route   GET /api/dashboard/energy/weekly
 * @access  Private
 */
export const getWeeklyEnergy = asyncHandler(async (req, res) => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const data = await Analytics.find({
    userId: req.user._id,
    date: { $gte: sevenDaysAgo },
    period: 'daily',
  }).sort({ date: 1 });

  // If no real data, generate sample data
  if (data.length === 0) {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const sampleData = days.map((day) => ({
      day,
      generated: Math.round(18 + Math.random() * 12),
      consumed: Math.round(12 + Math.random() * 10),
    }));
    return sendSuccess(res, { weeklyEnergy: sampleData, isSample: true });
  }

  const weeklyEnergy = data.map((d) => ({
    day: d.date.toLocaleDateString('en-US', { weekday: 'short' }),
    generated: d.energy.generated,
    consumed: d.energy.consumed,
  }));

  sendSuccess(res, { weeklyEnergy, isSample: false });
});

/**
 * @desc    Get monthly savings trend
 * @route   GET /api/dashboard/savings/monthly
 * @access  Private
 */
export const getMonthlySavings = asyncHandler(async (req, res) => {
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

  const data = await Analytics.aggregate([
    {
      $match: {
        userId: req.user._id,
        date: { $gte: twelveMonthsAgo },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: '$date' },
          month: { $month: '$date' },
        },
        savings: { $sum: '$financial.savings' },
        bill: { $sum: '$financial.gridCost' },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  // If no real data, return sample
  if (data.length === 0) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const sampleData = months.map((month) => ({
      month,
      savings: Math.round(3000 + Math.random() * 3000),
      bill: Math.round(1000 + Math.random() * 2000),
    }));
    return sendSuccess(res, { monthlySavings: sampleData, isSample: true });
  }

  const monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlySavings = data.map((d) => ({
    month: monthNames[d._id.month],
    savings: Math.round(d.savings),
    bill: Math.round(d.bill),
  }));

  sendSuccess(res, { monthlySavings, isSample: false });
});
