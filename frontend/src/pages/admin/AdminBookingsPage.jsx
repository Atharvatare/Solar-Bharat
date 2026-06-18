import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineCalendarDays, HiOutlineMapPin } from 'react-icons/hi2';
import Badge from '../../components/common/Badge';

const demoBookings = [
  { id: 1, number: 'SB-B-01001', customer: 'Vikram Desai', type: 'site_survey', date: '2026-06-20', timeSlot: 'morning', status: 'confirmed', vendor: 'SunPower India', city: 'Mumbai' },
  { id: 2, number: 'SB-B-01002', customer: 'Neha Gupta', type: 'installation', date: '2026-06-22', timeSlot: 'morning', status: 'scheduled', vendor: 'GreenSolar Tech', city: 'Delhi' },
  { id: 3, number: 'SB-B-01003', customer: 'Arjun Nair', type: 'maintenance', date: '2026-06-25', timeSlot: 'afternoon', status: 'confirmed', vendor: 'BharatSolar Corp', city: 'Bangalore' },
  { id: 4, number: 'SB-B-01004', customer: 'Meera Jain', type: 'installation', date: '2026-06-15', timeSlot: 'morning', status: 'completed', vendor: 'SunPower India', city: 'Ahmedabad' },
  { id: 5, number: 'SB-B-01005', customer: 'Suresh Kumar', type: 'repair', date: '2026-06-18', timeSlot: 'evening', status: 'cancelled', vendor: 'EcoWatt Solutions', city: 'Chennai' },
  { id: 6, number: 'SB-B-01006', customer: 'Divya Sharma', type: 'site_survey', date: '2026-06-28', timeSlot: 'afternoon', status: 'scheduled', vendor: 'RayStar Energy', city: 'Jaipur' },
];

const typeColors = { site_survey: 'info', installation: 'success', maintenance: 'warning', repair: 'error', inspection: 'neutral' };
const typeLabels = { site_survey: 'Site Survey', installation: 'Installation', maintenance: 'Maintenance', repair: 'Repair', inspection: 'Inspection' };
const statusColors = { requested: 'neutral', scheduled: 'info', confirmed: 'success', in_progress: 'warning', completed: 'success', cancelled: 'error', rescheduled: 'warning' };
const timeSlotLabels = { morning: '9 AM – 12 PM', afternoon: '1 PM – 4 PM', evening: '4 PM – 7 PM' };

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

export default function AdminBookingsPage() {
  const [activeFilter, setActiveFilter] = useState('All');
  const filters = ['All', 'scheduled', 'confirmed', 'completed', 'cancelled'];
  const filtered = activeFilter === 'All' ? demoBookings : demoBookings.filter(b => b.status === activeFilter);

  const stats = [
    { label: 'Total', value: demoBookings.length, color: 'text-blue-500' },
    { label: 'Scheduled', value: demoBookings.filter(b => b.status === 'scheduled').length, color: 'text-indigo-500' },
    { label: 'Confirmed', value: demoBookings.filter(b => b.status === 'confirmed').length, color: 'text-emerald-500' },
    { label: 'Completed', value: demoBookings.filter(b => b.status === 'completed').length, color: 'text-green-500' },
    { label: 'Cancelled', value: demoBookings.filter(b => b.status === 'cancelled').length, color: 'text-red-500' },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-navy-900 dark:text-white">Bookings</h1>
          <p className="text-navy-500 dark:text-navy-400 mt-1">Installation scheduling & management</p>
        </div>
        <button className="btn-primary flex items-center gap-2 text-sm"><HiOutlineCalendarDays className="w-4 h-4" /> New Booking</button>
      </motion.div>

      {/* Stats */}
      <motion.div variants={item} className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {stats.map(s => (
          <div key={s.label} className="glass p-4 rounded-xl text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-sm text-navy-500 dark:text-navy-400">{s.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div variants={item} className="flex gap-2 overflow-x-auto pb-2">
        {filters.map(f => (
          <button key={f} onClick={() => setActiveFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap capitalize transition-all ${activeFilter === f ? 'bg-solar-500 text-white shadow-md' : 'bg-navy-100 dark:bg-navy-800 text-navy-600 dark:text-navy-400'}`}>
            {f}
          </button>
        ))}
      </motion.div>

      {/* Bookings Table */}
      <motion.div variants={item} className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-navy-200 dark:border-navy-700">
                {['Booking #', 'Customer', 'Type', 'Date', 'Time Slot', 'Status', 'Vendor', 'Location'].map(h => (
                  <th key={h} className="py-3 px-4 text-xs font-semibold text-navy-500 dark:text-navy-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((b, i) => (
                <tr key={b.id} className={`border-b border-navy-100 dark:border-navy-800 hover:bg-navy-50 dark:hover:bg-navy-800/40 transition-colors ${i % 2 === 0 ? 'bg-navy-50/50 dark:bg-navy-800/20' : ''}`}>
                  <td className="py-3 px-4 font-mono text-sm font-medium text-solar-600 dark:text-solar-400">{b.number}</td>
                  <td className="py-3 px-4 text-sm font-medium text-navy-900 dark:text-white">{b.customer}</td>
                  <td className="py-3 px-4"><Badge variant={typeColors[b.type]} size="sm">{typeLabels[b.type]}</Badge></td>
                  <td className="py-3 px-4 text-sm text-navy-600 dark:text-navy-400">{b.date}</td>
                  <td className="py-3 px-4 text-xs text-navy-500">{timeSlotLabels[b.timeSlot]}</td>
                  <td className="py-3 px-4"><Badge variant={statusColors[b.status]} dot size="sm">{b.status}</Badge></td>
                  <td className="py-3 px-4 text-sm text-navy-600 dark:text-navy-400">{b.vendor}</td>
                  <td className="py-3 px-4 text-sm text-navy-500 flex items-center gap-1"><HiOutlineMapPin className="w-3.5 h-3.5" />{b.city}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
