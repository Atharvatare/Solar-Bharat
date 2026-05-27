import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  HiOutlineUsers,
  HiOutlineCpuChip,
  HiOutlineCurrencyRupee,
  HiOutlineExclamationTriangle,
  HiOutlineArrowPath,
  HiOutlineShieldCheck,
  HiOutlineInformationCircle,
} from 'react-icons/hi2';
import StatCard from '../components/dashboard/StatCard';
import AreaChartWidget from '../components/charts/AreaChartWidget';
import BarChartWidget from '../components/charts/BarChartWidget';
import Badge from '../components/common/Badge';
import { userGrowthData, revenueData, recentRegistrations } from '../utils/mockData';
import { formatDate } from '../utils/helpers';

const adminStats = [
  { title: 'Total Users', value: '52,400', change: 4.8, changeLabel: 'this month', icon: HiOutlineUsers, iconColor: 'text-blue-500', trend: 'up' },
  { title: 'Active Systems', value: '3,200', change: 6.2, changeLabel: 'this quarter', icon: HiOutlineCpuChip, iconColor: 'text-emerald-500', trend: 'up' },
  { title: 'Revenue', value: '₹6.9L', change: 12.1, changeLabel: 'vs last month', icon: HiOutlineCurrencyRupee, iconColor: 'text-solar-500', trend: 'up' },
  { title: 'Active Alerts', value: '7', change: -3, changeLabel: 'resolved today', icon: HiOutlineExclamationTriangle, iconColor: 'text-red-500', trend: 'down' },
];

const alerts = [
  { type: 'warning', icon: HiOutlineExclamationTriangle, title: 'Panel Maintenance Due', description: '12 systems have pending panel cleaning schedules in Mumbai region.', time: '2 hours ago', color: 'border-yellow-500' },
  { type: 'info', icon: HiOutlineArrowPath, title: 'Firmware Update Available', description: 'Inverter firmware v2.4.1 ready for deployment across 340 systems.', time: '5 hours ago', color: 'border-blue-500' },
  { type: 'success', icon: HiOutlineShieldCheck, title: 'Subsidy Batch Processed', description: '28 PM Surya Ghar applications approved and processed successfully.', time: '1 day ago', color: 'border-emerald-500' },
];

const periods = ['Today', 'Week', 'Month', 'Year'];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function AdminDashboard() {
  const [activePeriod, setActivePeriod] = useState('Month');

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-navy-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="text-navy-500 dark:text-navy-400 mt-1">Platform Overview</p>
        </div>
        <div className="flex items-center gap-1 p-1 rounded-xl bg-navy-100 dark:bg-navy-800/60">
          {periods.map((p) => (
            <button
              key={p}
              onClick={() => setActivePeriod(p)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
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

      {/* Stat Cards */}
      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {adminStats.map((stat, index) => (
          <StatCard key={stat.title} {...stat} index={index} />
        ))}
      </motion.div>

      {/* Charts */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass p-6 rounded-2xl">
          <AreaChartWidget
            data={userGrowthData}
            dataKey="users"
            xAxisKey="month"
            title="User Growth"
            color="#3B82F6"
            height={280}
            gradientFill
          />
        </div>
        <div className="glass p-6 rounded-2xl">
          <BarChartWidget
            data={revenueData}
            bars={[{ dataKey: 'revenue', color: '#F59E0B', name: 'Revenue (₹)' }]}
            xAxisKey="month"
            title="Monthly Revenue"
            height={280}
          />
        </div>
      </motion.div>

      {/* Recent Registrations Table */}
      <motion.div variants={item} className="glass p-6 rounded-2xl overflow-hidden">
        <h3 className="text-lg font-semibold text-navy-900 dark:text-white mb-4">Recent Registrations</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-navy-200 dark:border-navy-700">
                {['Name', 'Email', 'Location', 'Date', 'Status'].map((h) => (
                  <th key={h} className="py-3 px-4 text-xs font-semibold text-navy-500 dark:text-navy-400 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentRegistrations.map((reg, i) => (
                <tr
                  key={reg.id}
                  className={`border-b border-navy-100 dark:border-navy-800 hover:bg-navy-50 dark:hover:bg-navy-800/40 transition-colors ${
                    i % 2 === 0 ? 'bg-navy-50/50 dark:bg-navy-800/20' : ''
                  }`}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-solar-400 to-solar-600 flex items-center justify-center text-white text-xs font-bold">
                        {reg.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="font-medium text-navy-900 dark:text-white text-sm">{reg.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-navy-600 dark:text-navy-400">{reg.email}</td>
                  <td className="py-3 px-4 text-sm text-navy-600 dark:text-navy-400">{reg.location}</td>
                  <td className="py-3 px-4 text-sm text-navy-600 dark:text-navy-400">{formatDate(reg.date)}</td>
                  <td className="py-3 px-4">
                    <Badge variant={reg.status === 'active' ? 'success' : 'warning'} dot size="sm">
                      {reg.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* System Alerts */}
      <motion.div variants={item}>
        <h3 className="text-lg font-semibold text-navy-900 dark:text-white mb-4">System Alerts</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {alerts.map((alert, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`glass p-5 rounded-2xl border-l-4 ${alert.color}`}
            >
              <div className="flex items-start gap-3">
                <alert.icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                  alert.type === 'warning' ? 'text-yellow-500' :
                  alert.type === 'info' ? 'text-blue-500' : 'text-emerald-500'
                }`} />
                <div>
                  <h4 className="font-semibold text-navy-900 dark:text-white text-sm">{alert.title}</h4>
                  <p className="text-sm text-navy-500 dark:text-navy-400 mt-1">{alert.description}</p>
                  <p className="text-xs text-navy-400 dark:text-navy-500 mt-2">{alert.time}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
