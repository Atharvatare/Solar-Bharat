import { motion } from 'framer-motion';
import ComposedChartWidget from '../charts/ComposedChartWidget';
import {
  HiOutlineBanknotes,
  HiOutlineCheckCircle,
  HiOutlineArrowTrendingUp,
} from 'react-icons/hi2';

// Generate 25-year ROI projection data
function generateROIData(systemCostLakhs = 2.5, subsidyLakhs = 0.78, annualSavingsLakhs = 0.6) {
  const finalCost = systemCostLakhs - subsidyLakhs;
  const data = [];
  let cumulative = 0;

  for (let year = 1; year <= 25; year++) {
    const yearSavings = annualSavingsLakhs * (1 + 0.03 * (year - 1)); // 3% tariff increase
    cumulative += yearSavings;
    data.push({
      year: `Y${year}`,
      annualSavings: parseFloat((yearSavings * 100000).toFixed(0)),
      cumulativeSavings: parseFloat((cumulative * 100000).toFixed(0)),
      investment: parseFloat((finalCost * 100000).toFixed(0)),
    });
  }

  return data;
}

export default function ROIProjectionCard({
  systemCost = 2.5,
  subsidy = 0.78,
  annualSavings = 0.6,
  className,
}) {
  const finalCost = systemCost - subsidy;
  const paybackYears = (finalCost / annualSavings).toFixed(1);
  const data = generateROIData(systemCost, subsidy, annualSavings);

  // Find break-even index
  const breakEvenIndex = data.findIndex((d) => d.cumulativeSavings >= d.investment);

  // Total lifetime savings
  const lifetimeSavings = data[data.length - 1]?.cumulativeSavings || 0;
  const roi = ((lifetimeSavings - finalCost * 100000) / (finalCost * 100000) * 100).toFixed(0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass p-6 rounded-2xl ${className || ''}`}
    >
      <div className="flex items-center gap-2 mb-1">
        <HiOutlineBanknotes className="w-5 h-5 text-solar-500" />
        <h3 className="text-base font-display font-semibold text-navy-900 dark:text-white">
          ROI Projection (25 Years)
        </h3>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-3 gap-3 mb-5 mt-4">
        <div className="p-3 rounded-xl bg-solar-500/10 text-center">
          <HiOutlineCheckCircle className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
          <p className="text-lg font-bold font-mono text-navy-900 dark:text-white">{paybackYears} yrs</p>
          <p className="text-xs text-navy-500 dark:text-navy-400">Payback Period</p>
        </div>
        <div className="p-3 rounded-xl bg-emerald-500/10 text-center">
          <HiOutlineArrowTrendingUp className="w-5 h-5 text-solar-500 mx-auto mb-1" />
          <p className="text-lg font-bold font-mono text-navy-900 dark:text-white">{roi}%</p>
          <p className="text-xs text-navy-500 dark:text-navy-400">Total ROI</p>
        </div>
        <div className="p-3 rounded-xl bg-blue-500/10 text-center">
          <HiOutlineBanknotes className="w-5 h-5 text-blue-500 mx-auto mb-1" />
          <p className="text-lg font-bold font-mono text-navy-900 dark:text-white">₹{(lifetimeSavings / 100000).toFixed(1)}L</p>
          <p className="text-xs text-navy-500 dark:text-navy-400">Lifetime Savings</p>
        </div>
      </div>

      {/* Chart — show first 10 years for readability */}
      <ComposedChartWidget
        data={data.slice(0, 10)}
        bars={[
          { dataKey: 'annualSavings', color: '#F59E0B', name: 'Annual Savings (₹)' },
        ]}
        lines={[
          { dataKey: 'cumulativeSavings', color: '#10B981', name: 'Cumulative Savings (₹)' },
          { dataKey: 'investment', color: '#EF4444', name: 'Investment Cost (₹)' },
        ]}
        xAxisKey="year"
        height={260}
        breakEvenIndex={breakEvenIndex}
      />
    </motion.div>
  );
}
