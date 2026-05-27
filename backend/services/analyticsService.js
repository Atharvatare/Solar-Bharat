import Analytics from '../models/Analytics.js';

/**
 * Get dashboard summary for a user
 */
export const getUserDashboardSummary = async (userId, period = '30d') => {
  const periodDays = period === '7d' ? 7 : period === '90d' ? 90 : period === '1y' ? 365 : 30;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - periodDays);

  const analytics = await Analytics.find({
    userId,
    date: { $gte: startDate },
  }).sort({ date: -1 });

  if (!analytics.length) {
    return getDefaultDashboardSummary();
  }

  const totals = analytics.reduce(
    (acc, entry) => ({
      generated: acc.generated + (entry.energy?.generated || 0),
      consumed: acc.consumed + (entry.energy?.consumed || 0),
      exported: acc.exported + (entry.energy?.exported || 0),
      savings: acc.savings + (entry.financial?.savings || 0),
      co2Offset: acc.co2Offset + (entry.environmental?.co2Offset || 0),
    }),
    { generated: 0, consumed: 0, exported: 0, savings: 0, co2Offset: 0 }
  );

  const avgEfficiency =
    analytics.reduce((sum, e) => sum + (e.system?.panelEfficiency || 0), 0) / analytics.length;

  return {
    energy: {
      totalGenerated: Math.round(totals.generated * 10) / 10,
      totalConsumed: Math.round(totals.consumed * 10) / 10,
      totalExported: Math.round(totals.exported * 10) / 10,
      selfConsumptionRate: totals.generated
        ? Math.round(((totals.generated - totals.exported) / totals.generated) * 100)
        : 0,
    },
    financial: {
      totalSavings: Math.round(totals.savings),
      averageDailySavings: Math.round(totals.savings / periodDays),
    },
    environmental: {
      co2Offset: Math.round(totals.co2Offset),
      treesEquivalent: Math.round(totals.co2Offset / 22),
    },
    system: {
      avgEfficiency: Math.round(avgEfficiency * 10) / 10,
    },
    period: periodDays,
    dataPoints: analytics.length,
  };
};

/**
 * Get admin platform summary
 */
export const getAdminDashboardSummary = async () => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const allAnalytics = await Analytics.find({ date: { $gte: thirtyDaysAgo } });

  const totalGenerated = allAnalytics.reduce((sum, a) => sum + (a.energy?.generated || 0), 0);
  const totalSavings = allAnalytics.reduce((sum, a) => sum + (a.financial?.savings || 0), 0);
  const totalCo2 = allAnalytics.reduce((sum, a) => sum + (a.environmental?.co2Offset || 0), 0);

  return {
    platform: {
      totalEnergyGenerated: Math.round(totalGenerated),
      totalSavings: Math.round(totalSavings),
      totalCo2Offset: Math.round(totalCo2),
    },
  };
};

/**
 * Default summary when no analytics data exists
 */
const getDefaultDashboardSummary = () => ({
  energy: { totalGenerated: 0, totalConsumed: 0, totalExported: 0, selfConsumptionRate: 0 },
  financial: { totalSavings: 0, averageDailySavings: 0 },
  environmental: { co2Offset: 0, treesEquivalent: 0 },
  system: { avgEfficiency: 0 },
  period: 30,
  dataPoints: 0,
});

export default { getUserDashboardSummary, getAdminDashboardSummary };
