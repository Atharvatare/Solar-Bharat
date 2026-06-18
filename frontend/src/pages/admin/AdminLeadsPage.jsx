import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineFunnel, HiOutlinePhone, HiOutlineEnvelope, HiOutlineCurrencyRupee } from 'react-icons/hi2';
import Badge from '../../components/common/Badge';

const demoLeads = [
  { id: 1, name: 'Vikram Desai', email: 'vikram@gmail.com', phone: '+91 9988776655', source: 'website', status: 'new', priority: 'high', systemSize: 5, estValue: 350000, followUp: '2026-06-20', city: 'Mumbai' },
  { id: 2, name: 'Neha Gupta', email: 'neha.gupta@yahoo.com', phone: '+91 9876543210', source: 'referral', status: 'contacted', priority: 'medium', systemSize: 3, estValue: 210000, followUp: '2026-06-22', city: 'Delhi' },
  { id: 3, name: 'Arjun Nair', email: 'arjun.n@outlook.com', phone: '+91 8765432109', source: 'social_media', status: 'qualified', priority: 'high', systemSize: 10, estValue: 700000, followUp: '2026-06-19', city: 'Bangalore' },
  { id: 4, name: 'Meera Jain', email: 'meera.j@gmail.com', phone: '+91 7654321098', source: 'advertisement', status: 'proposal', priority: 'urgent', systemSize: 8, estValue: 560000, followUp: '2026-06-18', city: 'Ahmedabad' },
  { id: 5, name: 'Suresh Kumar', email: 'suresh.k@gmail.com', phone: '+91 6543210987', source: 'partner', status: 'converted', priority: 'medium', systemSize: 4, estValue: 280000, followUp: null, city: 'Chennai' },
  { id: 6, name: 'Pooja Reddy', email: 'pooja.r@gmail.com', phone: '+91 9432109876', source: 'website', status: 'new', priority: 'low', systemSize: 2, estValue: 140000, followUp: '2026-06-25', city: 'Hyderabad' },
  { id: 7, name: 'Karan Mehta', email: 'karan.m@gmail.com', phone: '+91 8321098765', source: 'walk_in', status: 'lost', priority: 'medium', systemSize: 6, estValue: 420000, followUp: null, city: 'Pune' },
  { id: 8, name: 'Divya Sharma', email: 'divya.s@gmail.com', phone: '+91 7210987654', source: 'referral', status: 'negotiation', priority: 'high', systemSize: 15, estValue: 1050000, followUp: '2026-06-21', city: 'Jaipur' },
];

const statusColors = { new: 'info', contacted: 'neutral', qualified: 'warning', proposal: 'warning', negotiation: 'warning', converted: 'success', lost: 'error' };
const priorityColors = { low: 'neutral', medium: 'info', high: 'warning', urgent: 'error' };
const statusFilters = ['All', 'new', 'contacted', 'qualified', 'proposal', 'negotiation', 'converted', 'lost'];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

export default function AdminLeadsPage() {
  const [activeFilter, setActiveFilter] = useState('All');
  const filtered = activeFilter === 'All' ? demoLeads : demoLeads.filter(l => l.status === activeFilter);

  const pipelineStats = statusFilters.slice(1).map(s => ({
    label: s.charAt(0).toUpperCase() + s.slice(1),
    count: demoLeads.filter(l => l.status === s).length,
    value: demoLeads.filter(l => l.status === s).reduce((sum, l) => sum + l.estValue, 0),
  }));

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-navy-900 dark:text-white">Leads & CRM</h1>
          <p className="text-navy-500 dark:text-navy-400 mt-1">Manage your sales pipeline</p>
        </div>
        <button className="btn-primary flex items-center gap-2 text-sm"><HiOutlineFunnel className="w-4 h-4" /> Add Lead</button>
      </motion.div>

      {/* Pipeline Stats */}
      <motion.div variants={item} className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {pipelineStats.map(s => (
          <div key={s.label} className="glass p-3 rounded-xl text-center">
            <p className="text-xl font-bold text-navy-900 dark:text-white">{s.count}</p>
            <p className="text-xs text-navy-500 dark:text-navy-400 capitalize">{s.label}</p>
            <p className="text-xs text-solar-500 font-medium mt-1">₹{(s.value / 100000).toFixed(1)}L</p>
          </div>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div variants={item} className="flex gap-2 overflow-x-auto pb-2">
        {statusFilters.map(f => (
          <button key={f} onClick={() => setActiveFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all capitalize ${activeFilter === f ? 'bg-solar-500 text-white shadow-md' : 'bg-navy-100 dark:bg-navy-800 text-navy-600 dark:text-navy-400'}`}>
            {f}
          </button>
        ))}
      </motion.div>

      {/* Leads Table */}
      <motion.div variants={item} className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-navy-200 dark:border-navy-700">
                {['Name', 'Contact', 'Source', 'Status', 'Priority', 'System', 'Est. Value', 'Follow-up'].map(h => (
                  <th key={h} className="py-3 px-4 text-xs font-semibold text-navy-500 dark:text-navy-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead, i) => (
                <tr key={lead.id} className={`border-b border-navy-100 dark:border-navy-800 hover:bg-navy-50 dark:hover:bg-navy-800/40 transition-colors ${i % 2 === 0 ? 'bg-navy-50/50 dark:bg-navy-800/20' : ''}`}>
                  <td className="py-3 px-4">
                    <p className="font-medium text-navy-900 dark:text-white text-sm">{lead.name}</p>
                    <p className="text-xs text-navy-500">{lead.city}</p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-xs text-navy-600 dark:text-navy-400 flex items-center gap-1"><HiOutlineEnvelope className="w-3 h-3" />{lead.email}</p>
                    <p className="text-xs text-navy-500 flex items-center gap-1"><HiOutlinePhone className="w-3 h-3" />{lead.phone}</p>
                  </td>
                  <td className="py-3 px-4"><span className="text-xs capitalize text-navy-600 dark:text-navy-400">{lead.source.replace('_', ' ')}</span></td>
                  <td className="py-3 px-4"><Badge variant={statusColors[lead.status]} dot size="sm">{lead.status}</Badge></td>
                  <td className="py-3 px-4"><Badge variant={priorityColors[lead.priority]} size="sm">{lead.priority}</Badge></td>
                  <td className="py-3 px-4"><span className="text-sm font-medium text-navy-900 dark:text-white">{lead.systemSize} kW</span></td>
                  <td className="py-3 px-4"><span className="text-sm font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5"><HiOutlineCurrencyRupee className="w-3.5 h-3.5" />{(lead.estValue / 1000).toFixed(0)}K</span></td>
                  <td className="py-3 px-4"><span className="text-xs text-navy-500">{lead.followUp || '—'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
