import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineMagnifyingGlass,
  HiOutlinePencilSquare,
  HiOutlineNoSymbol,
  HiOutlineCheckCircle,
  HiOutlineUsers,
  HiOutlineUserPlus,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineShieldCheck,
  HiOutlineFunnel,
} from 'react-icons/hi2';

/* ─── Animation Variants ─── */
const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

/* ─── Demo Data ─── */
const demoUsers = [
  { id: 1, name: 'Rajesh Kumar', email: 'rajesh@example.com', role: 'admin', status: 'active', joined: '2024-01-15', phone: '+91 98765 43210' },
  { id: 2, name: 'Priya Sharma', email: 'priya@example.com', role: 'vendor', status: 'active', joined: '2024-02-20', phone: '+91 87654 32109' },
  { id: 3, name: 'Amit Patel', email: 'amit@example.com', role: 'user', status: 'active', joined: '2024-03-10', phone: '+91 76543 21098' },
  { id: 4, name: 'Sunita Reddy', email: 'sunita@example.com', role: 'user', status: 'inactive', joined: '2024-03-25', phone: '+91 65432 10987' },
  { id: 5, name: 'Vikram Singh', email: 'vikram@example.com', role: 'vendor', status: 'active', joined: '2024-04-05', phone: '+91 54321 09876' },
  { id: 6, name: 'Ananya Gupta', email: 'ananya@example.com', role: 'user', status: 'active', joined: '2024-04-18', phone: '+91 43210 98765' },
  { id: 7, name: 'Deepak Joshi', email: 'deepak@example.com', role: 'admin', status: 'active', joined: '2024-05-02', phone: '+91 32109 87654' },
  { id: 8, name: 'Kavitha Nair', email: 'kavitha@example.com', role: 'user', status: 'inactive', joined: '2024-05-15', phone: '+91 21098 76543' },
  { id: 9, name: 'Rahul Verma', email: 'rahul@example.com', role: 'vendor', status: 'active', joined: '2024-06-01', phone: '+91 10987 65432' },
  { id: 10, name: 'Meera Iyer', email: 'meera@example.com', role: 'user', status: 'active', joined: '2024-06-08', phone: '+91 09876 54321' },
];

const filters = ['All', 'Active', 'Inactive', 'Admin', 'Vendor', 'User'];

const roleBadge = {
  admin: 'bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-400',
  vendor: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400',
  user: 'bg-navy-100 text-navy-600 dark:bg-navy-700/50 dark:text-navy-300',
};

const avatarColors = [
  'from-solar-400 to-solar-600',
  'from-blue-400 to-blue-600',
  'from-emerald-400 to-emerald-600',
  'from-purple-400 to-purple-600',
  'from-pink-400 to-pink-600',
  'from-cyan-400 to-cyan-600',
];

const ITEMS_PER_PAGE = 5;

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [editingId, setEditingId] = useState(null);
  const [users, setUsers] = useState(demoUsers);
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    let result = users;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    }
    if (activeFilter !== 'All') {
      const f = activeFilter.toLowerCase();
      if (['active', 'inactive'].includes(f)) {
        result = result.filter(u => u.status === f);
      } else {
        result = result.filter(u => u.role === f);
      }
    }
    return result;
  }, [users, search, activeFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleRoleChange = (id, newRole) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, role: newRole } : u));
    setEditingId(null);
  };

  const toggleStatus = (id) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u));
  };

  const getInitials = (name) => name.split(' ').map(n => n[0]).join('').toUpperCase();

  const statCounts = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    admins: users.filter(u => u.role === 'admin').length,
    vendors: users.filter(u => u.role === 'vendor').length,
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-navy-900 dark:text-white">
            User Management
          </h1>
          <p className="text-navy-500 dark:text-navy-400 mt-1">Manage platform users, roles & permissions</p>
        </div>
        <button className="btn-primary inline-flex items-center gap-2 text-sm self-start">
          <HiOutlineUserPlus className="text-lg" />
          Add User
        </button>
      </motion.div>

      {/* Stats Row */}
      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: statCounts.total, icon: HiOutlineUsers, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Active', value: statCounts.active, icon: HiOutlineCheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Admins', value: statCounts.admins, icon: HiOutlineShieldCheck, color: 'text-purple-500', bg: 'bg-purple-500/10' },
          { label: 'Vendors', value: statCounts.vendors, icon: HiOutlineFunnel, color: 'text-solar-500', bg: 'bg-solar-500/10' },
        ].map(s => (
          <div key={s.label} className="glass p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl ${s.bg} flex items-center justify-center`}>
              <s.icon className={`text-xl ${s.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold font-mono text-navy-900 dark:text-white">{s.value}</p>
              <p className="text-xs text-navy-500 dark:text-navy-400">{s.label}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Search & Filters */}
      <motion.div variants={item} className="glass p-4 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
            className="input-solar pl-10"
          />
        </div>
        <div className="flex items-center gap-1 p-1 rounded-xl bg-navy-100 dark:bg-navy-800/60 flex-wrap">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => { setActiveFilter(f); setCurrentPage(1); }}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap ${
                activeFilter === f
                  ? 'bg-solar-500 text-white shadow-md'
                  : 'text-navy-600 dark:text-navy-400 hover:text-navy-900 dark:hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Table */}
      <motion.div variants={item} className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-navy-200 dark:border-navy-700">
                {['User', 'Email', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
                  <th key={h} className="py-3 px-4 text-xs font-semibold text-navy-500 dark:text-navy-400 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {paginated.map((user, i) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ delay: i * 0.04 }}
                    className={`border-b border-navy-100 dark:border-navy-800 hover:bg-navy-50 dark:hover:bg-navy-800/40 transition-colors ${
                      i % 2 === 0 ? 'bg-navy-50/50 dark:bg-navy-800/20' : ''
                    }`}
                  >
                    {/* Avatar + Name */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${avatarColors[user.id % avatarColors.length]} flex items-center justify-center text-white text-xs font-bold shadow-md`}>
                          {getInitials(user.name)}
                        </div>
                        <span className="font-medium text-navy-900 dark:text-white text-sm">{user.name}</span>
                      </div>
                    </td>
                    {/* Email */}
                    <td className="py-3 px-4 text-sm text-navy-600 dark:text-navy-400">{user.email}</td>
                    {/* Role */}
                    <td className="py-3 px-4">
                      {editingId === user.id ? (
                        <select
                          defaultValue={user.role}
                          onChange={e => handleRoleChange(user.id, e.target.value)}
                          onBlur={() => setEditingId(null)}
                          autoFocus
                          className="input-solar py-1 px-2 text-xs w-24"
                        >
                          <option value="admin">Admin</option>
                          <option value="vendor">Vendor</option>
                          <option value="user">User</option>
                        </select>
                      ) : (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${roleBadge[user.role]}`}>
                          {user.role}
                        </span>
                      )}
                    </td>
                    {/* Status */}
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium capitalize">
                        <span className={`w-2 h-2 rounded-full ${user.status === 'active' ? 'bg-emerald-500' : 'bg-red-400'}`} />
                        <span className={user.status === 'active' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}>
                          {user.status}
                        </span>
                      </span>
                    </td>
                    {/* Joined */}
                    <td className="py-3 px-4 text-sm text-navy-600 dark:text-navy-400">
                      {new Date(user.joined).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    {/* Actions */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingId(user.id)}
                          className="p-2 rounded-lg text-navy-500 dark:text-navy-400 hover:bg-solar-500/10 hover:text-solar-600 dark:hover:text-solar-400 transition-colors"
                          title="Edit role"
                        >
                          <HiOutlinePencilSquare className="text-base" />
                        </button>
                        <button
                          onClick={() => toggleStatus(user.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            user.status === 'active'
                              ? 'text-navy-500 dark:text-navy-400 hover:bg-red-500/10 hover:text-red-500'
                              : 'text-navy-500 dark:text-navy-400 hover:bg-emerald-500/10 hover:text-emerald-500'
                          }`}
                          title={user.status === 'active' ? 'Deactivate' : 'Activate'}
                        >
                          {user.status === 'active' ? <HiOutlineNoSymbol className="text-base" /> : <HiOutlineCheckCircle className="text-base" />}
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-navy-200 dark:border-navy-700">
          <p className="text-xs text-navy-500 dark:text-navy-400">
            Showing {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filtered.length)}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} users
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg text-navy-500 dark:text-navy-400 hover:bg-navy-100 dark:hover:bg-navy-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <HiOutlineChevronLeft className="text-sm" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                  currentPage === p
                    ? 'bg-solar-500 text-white shadow-md'
                    : 'text-navy-600 dark:text-navy-400 hover:bg-navy-100 dark:hover:bg-navy-800'
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg text-navy-500 dark:text-navy-400 hover:bg-navy-100 dark:hover:bg-navy-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <HiOutlineChevronRight className="text-sm" />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
