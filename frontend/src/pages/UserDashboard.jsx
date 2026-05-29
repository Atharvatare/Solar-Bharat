import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiOutlineBolt,
  HiOutlineBanknotes,
  HiOutlineGlobeAlt,
  HiOutlineHeart,
  HiOutlineDocumentArrowUp,
  HiOutlineCalculator,
  HiOutlineCpuChip,
  HiOutlineChartBar,
  HiOutlineBuildingOffice,
  HiOutlineQuestionMarkCircle,
} from 'react-icons/hi2';
import StatCard from '../components/dashboard/StatCard';
import AreaChartWidget from '../components/charts/AreaChartWidget';
import BarChartWidget from '../components/charts/BarChartWidget';
import PieChartWidget from '../components/charts/PieChartWidget';
import LivePulseIndicator from '../components/dashboard/LivePulseIndicator';
import WeatherWidget from '../components/dashboard/WeatherWidget';
import CarbonTracker from '../components/dashboard/CarbonTracker';
import { useAuth } from '../hooks/useAuth';
import { getGreeting } from '../utils/helpers';
import {
  weeklyEnergyData,
  monthlySavingsData,
  recentActivity,
  energySourceData,
} from '../utils/mockData';

const statCards = [
  { title: 'Energy Generated', value: '167.4 kWh', change: 12.5, changeLabel: 'vs last week', icon: HiOutlineBolt, iconColor: 'text-solar-500', trend: 'up' },
  { title: 'Money Saved', value: '₹5,200', change: 8.3, changeLabel: 'vs last month', icon: HiOutlineBanknotes, iconColor: 'text-emerald-500', trend: 'up' },
  { title: 'CO₂ Reduced', value: '142 kg', change: 15.2, changeLabel: 'this month', icon: HiOutlineGlobeAlt, iconColor: 'text-blue-500', trend: 'up' },
  { title: 'System Health', value: '94%', change: -1.2, changeLabel: 'efficiency', icon: HiOutlineHeart, iconColor: 'text-purple-500', trend: 'down' },
];

const quickActions = [
  { name: 'Upload Bill', icon: HiOutlineDocumentArrowUp, path: '/dashboard/bill-upload', color: 'text-solar-500' },
  { name: 'Calculator', icon: HiOutlineCalculator, path: '/dashboard/calculator', color: 'text-emerald-500' },
  { name: 'AI Chat', icon: HiOutlineCpuChip, path: '/dashboard/ai-chat', color: 'text-blue-500' },
  { name: 'Analytics', icon: HiOutlineChartBar, path: '/dashboard/analytics', color: 'text-purple-500' },
  { name: 'Rooftop', icon: HiOutlineBuildingOffice, path: '/dashboard/rooftop', color: 'text-orange-500' },
  { name: 'Support', icon: HiOutlineQuestionMarkCircle, path: '/dashboard/settings', color: 'text-pink-500' },
];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function UserDashboard() {
  const { user } = useAuth();
  const [period] = useState('7d');
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Welcome Header */}
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-display font-bold text-navy-900 dark:text-white">
              {getGreeting()}, {user?.name?.split(' ')[0] || 'User'} 👋
            </h1>
            <LivePulseIndicator />
          </div>
          <p className="text-navy-500 dark:text-navy-400 mt-1">{today}</p>
        </div>
        <Link to="/dashboard/bill-upload" className="btn-primary inline-flex items-center gap-2 w-fit">
          <HiOutlineDocumentArrowUp className="w-5 h-5" />
          Upload Bill
        </Link>
      </motion.div>

      {/* Stat Cards */}
      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <StatCard key={stat.title} {...stat} index={index} />
        ))}
      </motion.div>

      {/* Charts Row */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass p-6 rounded-2xl">
          <AreaChartWidget
            data={weeklyEnergyData}
            dataKey="generated"
            xAxisKey="day"
            title="Energy Generation (7-Day)"
            color="#F59E0B"
            height={280}
            gradientFill
          />
        </div>
        <div className="glass p-6 rounded-2xl">
          <BarChartWidget
            data={monthlySavingsData}
            bars={[
              { dataKey: 'savings', color: '#F59E0B', name: 'Savings' },
              { dataKey: 'bill', color: '#64748b', name: 'Bill' },
            ]}
            xAxisKey="month"
            title="Monthly Savings vs Bills"
            height={280}
          />
        </div>
      </motion.div>

      {/* Activity + Donut */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 glass p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-navy-900 dark:text-white mb-4">Recent Activity</h3>
          <div className="space-y-1">
            {recentActivity.map((act, i) => (
              <div key={act.id}>
                <div className="flex items-start gap-3 py-3">
                  <span className="text-2xl flex-shrink-0 mt-0.5">{act.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-navy-900 dark:text-white text-sm">{act.title}</p>
                    <p className="text-sm text-navy-500 dark:text-navy-400 truncate">{act.description}</p>
                  </div>
                  <span className="text-xs text-navy-400 dark:text-navy-500 whitespace-nowrap flex-shrink-0">{act.time}</span>
                </div>
                {i < recentActivity.length - 1 && <div className="border-b border-navy-100 dark:border-navy-700/50" />}
              </div>
            ))}
          </div>
          <button className="mt-4 text-sm text-solar-500 hover:text-solar-600 font-medium transition-colors">
            View All Activity →
          </button>
        </div>

        {/* Energy Source Donut */}
        <div className="glass p-6 rounded-2xl">
          <PieChartWidget
            data={energySourceData}
            title="Energy Sources"
            centerLabel="72% Solar"
            height={250}
          />
        </div>
      </motion.div>

      {/* System Health + Quick Actions */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeatherWidget />
        <CarbonTracker />

        <div className="glass p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-navy-900 dark:text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {quickActions.map((action) => (
              <Link
                key={action.name}
                to={action.path}
                className="group flex flex-col items-center gap-2 p-4 rounded-xl
                  bg-navy-50 dark:bg-navy-800/50 hover:bg-solar-500/10 dark:hover:bg-solar-500/10
                  border border-transparent hover:border-solar-500/20
                  transition-all duration-200"
              >
                <action.icon className={`w-7 h-7 ${action.color} group-hover:scale-110 transition-transform`} />
                <span className="text-sm font-medium text-navy-700 dark:text-navy-300">{action.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
