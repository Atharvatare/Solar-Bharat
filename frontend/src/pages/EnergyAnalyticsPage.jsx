import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  HiOutlineBolt,
  HiOutlineArrowsRightLeft,
  HiOutlineArrowTrendingUp,
  HiOutlineChartPie,
  HiOutlineArrowDownTray,
} from 'react-icons/hi2';
import StatCard from '../components/dashboard/StatCard';
import AreaChartWidget from '../components/charts/AreaChartWidget';
import BarChartWidget from '../components/charts/BarChartWidget';
import PieChartWidget from '../components/charts/PieChartWidget';
import {
  hourlyEnergyData,
  monthlySavingsData,
  energySourceData,
} from '../utils/mockData';

const summaryStats = [
  { title: 'Total Generated', value: '4,280 kWh', change: 18.5, changeLabel: 'this month', icon: HiOutlineBolt, iconColor: 'text-solar-500', trend: 'up' },
  { title: 'Total Consumed', value: '2,850 kWh', change: -3.2, changeLabel: 'vs last month', icon: HiOutlineArrowsRightLeft, iconColor: 'text-blue-500', trend: 'down' },
  { title: 'Net Exported', value: '1,430 kWh', change: 22.1, changeLabel: 'to grid', icon: HiOutlineArrowTrendingUp, iconColor: 'text-emerald-500', trend: 'up' },
  { title: 'Self-Consumption', value: '66.6%', change: 4.8, changeLabel: 'efficiency', icon: HiOutlineChartPie, iconColor: 'text-purple-500', trend: 'up' },
];

const performanceMetrics = [
  { label: 'Peak Output', value: '5.5 kW', sub: 'at 12:30 PM today' },
  { label: 'Avg Daily Output', value: '22.8 kWh', sub: '+15% vs seasonal avg' },
  { label: 'Best Day', value: '32.1 kWh', sub: 'Dec 14, 2024' },
  { label: 'Worst Day', value: '8.2 kWh', sub: 'Nov 28, 2024 (cloudy)' },
  { label: 'Uptime', value: '99.7%', sub: 'Last 30 days' },
  { label: 'Efficiency', value: '94.2%', sub: 'Panel performance ratio' },
];

const periods = ['Today', '7 Days', '30 Days', '90 Days', 'Year'];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function EnergyAnalyticsPage() {
  const [activePeriod, setActivePeriod] = useState('30 Days');

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-navy-900 dark:text-white">
            Energy Analytics
          </h1>
          <p className="text-navy-500 dark:text-navy-400 mt-1">Monitor your solar system performance</p>
        </div>
        <div className="flex items-center gap-1 p-1 rounded-xl bg-navy-100 dark:bg-navy-800/60 overflow-x-auto no-scrollbar">
          {periods.map((p) => (
            <button
              key={p}
              onClick={() => setActivePeriod(p)}
              className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                activePeriod === p
                  ? 'bg-solar-500 text-white shadow-md'
                  : 'text-navy-600 dark:text-navy-400 hover:text-navy-900 dark:hover:text-white'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Summary Stats */}
      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryStats.map((stat, index) => (
          <StatCard key={stat.title} {...stat} index={index} />
        ))}
      </motion.div>

      {/* Main Chart */}
      <motion.div variants={item} className="glass p-6 rounded-2xl">
        <AreaChartWidget
          data={hourlyEnergyData}
          dataKey="generated"
          xAxisKey="hour"
          title="Energy Production vs Consumption"
          color="#F59E0B"
          height={350}
          gradientFill
        />
      </motion.div>

      {/* Comparison */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass p-6 rounded-2xl">
          <BarChartWidget
            data={monthlySavingsData}
            bars={[{ dataKey: 'savings', color: '#F59E0B', name: 'Savings (₹)' }]}
            xAxisKey="month"
            title="Monthly Savings Trend"
            height={280}
          />
        </div>
        <div className="glass p-6 rounded-2xl">
          <PieChartWidget
            data={energySourceData}
            title="Energy Mix"
            centerLabel="72% Solar"
            height={280}
          />
        </div>
      </motion.div>

      {/* Performance Metrics */}
      <motion.div variants={item} className="glass p-6 rounded-2xl">
        <h3 className="text-lg font-semibold text-navy-900 dark:text-white mb-4">System Performance</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {performanceMetrics.map((m) => (
            <div key={m.label} className="p-4 rounded-xl bg-navy-50 dark:bg-navy-800/50 text-center">
              <p className="text-xs text-navy-500 dark:text-navy-400 font-medium">{m.label}</p>
              <p className="text-xl font-bold font-mono text-navy-900 dark:text-white mt-1">{m.value}</p>
              <p className="text-xs text-navy-400 dark:text-navy-500 mt-1">{m.sub}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Export */}
      <motion.div variants={item} className="flex flex-wrap items-center gap-3">
        <button className="btn-primary flex items-center gap-2">
          <HiOutlineArrowDownTray className="w-5 h-5" />
          Download Report
        </button>
        <select className="input-solar w-auto">
          <option>PDF</option>
          <option>CSV</option>
          <option>Excel</option>
        </select>
      </motion.div>
    </motion.div>
  );
}
