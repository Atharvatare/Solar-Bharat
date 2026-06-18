import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineDocumentText, HiOutlineCurrencyRupee } from 'react-icons/hi2';
import Badge from '../../components/common/Badge';

const demoQuotations = [
  { id: 1, number: 'SB-Q-01001', customer: 'Vikram Desai', systemSize: 5, panelType: 'Mono PERC', totalCost: 375000, subsidy: 150000, netCost: 225000, status: 'sent', validUntil: '2026-07-15', savings: 48000 },
  { id: 2, number: 'SB-Q-01002', customer: 'Neha Gupta', systemSize: 3, panelType: 'Mono PERC', totalCost: 225000, subsidy: 90000, netCost: 135000, status: 'accepted', validUntil: '2026-07-10', savings: 28800 },
  { id: 3, number: 'SB-Q-01003', customer: 'Arjun Nair', systemSize: 10, panelType: 'Bifacial', totalCost: 750000, subsidy: 300000, netCost: 450000, status: 'draft', validUntil: '2026-07-20', savings: 96000 },
  { id: 4, number: 'SB-Q-01004', customer: 'Meera Jain', systemSize: 8, panelType: 'Mono PERC', totalCost: 600000, subsidy: 240000, netCost: 360000, status: 'rejected', validUntil: '2026-06-30', savings: 76800 },
  { id: 5, number: 'SB-Q-01005', customer: 'Divya Sharma', systemSize: 15, panelType: 'Bifacial', totalCost: 1125000, subsidy: 450000, netCost: 675000, status: 'sent', validUntil: '2026-07-25', savings: 144000 },
  { id: 6, number: 'SB-Q-01006', customer: 'Pooja Reddy', systemSize: 2, panelType: 'Polycrystalline', totalCost: 140000, subsidy: 56000, netCost: 84000, status: 'expired', validUntil: '2026-05-30', savings: 19200 },
];

const statusColors = { draft: 'neutral', sent: 'info', viewed: 'info', accepted: 'success', rejected: 'error', expired: 'warning' };
const statusFilters = ['All', 'draft', 'sent', 'accepted', 'rejected', 'expired'];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

export default function AdminQuotationsPage() {
  const [activeFilter, setActiveFilter] = useState('All');
  const filtered = activeFilter === 'All' ? demoQuotations : demoQuotations.filter(q => q.status === activeFilter);

  const stats = [
    { label: 'Total', value: demoQuotations.length, amount: demoQuotations.reduce((s, q) => s + q.netCost, 0), color: 'text-blue-500' },
    { label: 'Sent', value: demoQuotations.filter(q => q.status === 'sent').length, amount: demoQuotations.filter(q => q.status === 'sent').reduce((s, q) => s + q.netCost, 0), color: 'text-indigo-500' },
    { label: 'Accepted', value: demoQuotations.filter(q => q.status === 'accepted').length, amount: demoQuotations.filter(q => q.status === 'accepted').reduce((s, q) => s + q.netCost, 0), color: 'text-emerald-500' },
    { label: 'Expired', value: demoQuotations.filter(q => q.status === 'expired').length, amount: demoQuotations.filter(q => q.status === 'expired').reduce((s, q) => s + q.netCost, 0), color: 'text-yellow-500' },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-navy-900 dark:text-white">Quotations</h1>
          <p className="text-navy-500 dark:text-navy-400 mt-1">Manage solar system quotations</p>
        </div>
        <button className="btn-primary flex items-center gap-2 text-sm"><HiOutlineDocumentText className="w-4 h-4" /> New Quotation</button>
      </motion.div>

      {/* Stats */}
      <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="glass p-4 rounded-xl">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-sm text-navy-500 dark:text-navy-400">{s.label}</p>
            <p className="text-xs text-navy-400 mt-1 flex items-center gap-0.5"><HiOutlineCurrencyRupee className="w-3 h-3" />{(s.amount / 100000).toFixed(1)}L value</p>
          </div>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div variants={item} className="flex gap-2 overflow-x-auto pb-2">
        {statusFilters.map(f => (
          <button key={f} onClick={() => setActiveFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap capitalize transition-all ${activeFilter === f ? 'bg-solar-500 text-white shadow-md' : 'bg-navy-100 dark:bg-navy-800 text-navy-600 dark:text-navy-400'}`}>
            {f}
          </button>
        ))}
      </motion.div>

      {/* Quotations Table */}
      <motion.div variants={item} className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-navy-200 dark:border-navy-700">
                {['Quote #', 'Customer', 'System', 'Total Cost', 'Subsidy', 'Net Cost', 'Status', 'Valid Until', 'Annual Savings'].map(h => (
                  <th key={h} className="py-3 px-4 text-xs font-semibold text-navy-500 dark:text-navy-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((q, i) => (
                <tr key={q.id} className={`border-b border-navy-100 dark:border-navy-800 hover:bg-navy-50 dark:hover:bg-navy-800/40 transition-colors ${i % 2 === 0 ? 'bg-navy-50/50 dark:bg-navy-800/20' : ''}`}>
                  <td className="py-3 px-4 font-mono text-sm font-medium text-solar-600 dark:text-solar-400">{q.number}</td>
                  <td className="py-3 px-4 text-sm font-medium text-navy-900 dark:text-white">{q.customer}</td>
                  <td className="py-3 px-4 text-sm text-navy-600 dark:text-navy-400">{q.systemSize} kW · {q.panelType}</td>
                  <td className="py-3 px-4 text-sm text-navy-600 dark:text-navy-400">₹{q.totalCost.toLocaleString()}</td>
                  <td className="py-3 px-4 text-sm text-emerald-600 dark:text-emerald-400">-₹{q.subsidy.toLocaleString()}</td>
                  <td className="py-3 px-4 text-sm font-bold text-navy-900 dark:text-white">₹{q.netCost.toLocaleString()}</td>
                  <td className="py-3 px-4"><Badge variant={statusColors[q.status]} dot size="sm">{q.status}</Badge></td>
                  <td className="py-3 px-4 text-xs text-navy-500">{q.validUntil}</td>
                  <td className="py-3 px-4 text-sm text-emerald-600 dark:text-emerald-400">₹{q.savings.toLocaleString()}/yr</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
