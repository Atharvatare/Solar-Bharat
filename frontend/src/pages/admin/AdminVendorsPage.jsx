import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  HiOutlineBuildingStorefront, HiOutlineCheckBadge, HiOutlineXMark,
  HiOutlineStar, HiOutlineMapPin, HiOutlinePhone,
} from 'react-icons/hi2';
import Badge from '../../components/common/Badge';

const demoVendors = [
  { id: 1, companyName: 'SunPower India Pvt Ltd', contact: { name: 'Rohit Sharma', email: 'rohit@sunpower.in', phone: '+91 9876543210' }, city: 'Mumbai', state: 'Maharashtra', services: ['installation', 'supply', 'maintenance'], rating: 4.8, reviews: 124, projects: 340, verified: true, status: 'active' },
  { id: 2, companyName: 'GreenSolar Technologies', contact: { name: 'Priya Patel', email: 'priya@greensolar.com', phone: '+91 9876543211' }, city: 'Ahmedabad', state: 'Gujarat', services: ['installation', 'consulting'], rating: 4.5, reviews: 89, projects: 210, verified: true, status: 'active' },
  { id: 3, companyName: 'EcoWatt Solutions', contact: { name: 'Amit Verma', email: 'amit@ecowatt.in', phone: '+91 9876543212' }, city: 'Delhi', state: 'Delhi', services: ['supply', 'financing'], rating: 4.2, reviews: 56, projects: 120, verified: false, status: 'pending' },
  { id: 4, companyName: 'BharatSolar Corp', contact: { name: 'Kavita Singh', email: 'kavita@bharatsolar.com', phone: '+91 9876543213' }, city: 'Pune', state: 'Maharashtra', services: ['installation', 'maintenance', 'supply'], rating: 4.7, reviews: 178, projects: 450, verified: true, status: 'active' },
  { id: 5, companyName: 'RayStar Energy', contact: { name: 'Deepak Joshi', email: 'deepak@raystar.in', phone: '+91 9876543214' }, city: 'Jaipur', state: 'Rajasthan', services: ['installation', 'consulting', 'financing'], rating: 3.9, reviews: 34, projects: 75, verified: false, status: 'suspended' },
];

const filters = ['All', 'Active', 'Pending', 'Suspended'];
const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

export default function AdminVendorsPage() {
  const [activeFilter, setActiveFilter] = useState('All');
  const filtered = activeFilter === 'All' ? demoVendors : demoVendors.filter(v => v.status === activeFilter.toLowerCase());

  const stats = [
    { label: 'Total Vendors', value: demoVendors.length, color: 'text-blue-500' },
    { label: 'Active', value: demoVendors.filter(v => v.status === 'active').length, color: 'text-emerald-500' },
    { label: 'Pending', value: demoVendors.filter(v => v.status === 'pending').length, color: 'text-yellow-500' },
    { label: 'Suspended', value: demoVendors.filter(v => v.status === 'suspended').length, color: 'text-red-500' },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-navy-900 dark:text-white">Vendor Management</h1>
          <p className="text-navy-500 dark:text-navy-400 mt-1">Manage solar installation vendors</p>
        </div>
        <button className="btn-primary flex items-center gap-2 text-sm"><HiOutlineBuildingStorefront className="w-4 h-4" /> Add Vendor</button>
      </motion.div>

      {/* Stats */}
      <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="glass p-4 rounded-xl text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-sm text-navy-500 dark:text-navy-400">{s.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div variants={item} className="flex gap-2">
        {filters.map(f => (
          <button key={f} onClick={() => setActiveFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeFilter === f ? 'bg-solar-500 text-white shadow-md' : 'bg-navy-100 dark:bg-navy-800 text-navy-600 dark:text-navy-400 hover:bg-navy-200 dark:hover:bg-navy-700'}`}>
            {f}
          </button>
        ))}
      </motion.div>

      {/* Vendor Cards */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map(v => (
          <motion.div key={v.id} variants={item} className="glass p-5 rounded-2xl hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-navy-900 dark:text-white">{v.companyName}</h3>
                  {v.verified && <HiOutlineCheckBadge className="w-5 h-5 text-blue-500" />}
                </div>
                <p className="text-sm text-navy-500 dark:text-navy-400 flex items-center gap-1 mt-1">
                  <HiOutlineMapPin className="w-4 h-4" /> {v.city}, {v.state}
                </p>
              </div>
              <Badge variant={v.status === 'active' ? 'success' : v.status === 'pending' ? 'warning' : 'error'} dot size="sm">{v.status}</Badge>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <HiOutlinePhone className="w-4 h-4 text-navy-400" />
              <span className="text-sm text-navy-600 dark:text-navy-400">{v.contact.name} · {v.contact.phone}</span>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-3">
              {v.services.map(s => <span key={s} className="px-2 py-0.5 rounded-full bg-solar-100 dark:bg-solar-900/30 text-solar-700 dark:text-solar-300 text-xs font-medium capitalize">{s}</span>)}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-navy-200 dark:border-navy-700">
              <div className="flex items-center gap-1">
                <HiOutlineStar className="w-4 h-4 text-yellow-500" />
                <span className="font-semibold text-navy-900 dark:text-white text-sm">{v.rating}</span>
                <span className="text-xs text-navy-500">({v.reviews})</span>
              </div>
              <span className="text-sm text-navy-500">{v.projects} projects</span>
              <div className="flex gap-2">
                {!v.verified && <button className="text-xs px-3 py-1 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition">Verify</button>}
                <button className="text-xs px-3 py-1 rounded-lg bg-navy-200 dark:bg-navy-700 text-navy-700 dark:text-navy-300 hover:bg-navy-300 dark:hover:bg-navy-600 transition">Edit</button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
