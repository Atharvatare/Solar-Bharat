import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineUser,
  HiOutlineBellAlert,
  HiOutlineShieldCheck,
  HiOutlinePaintBrush,
  HiOutlineCamera,
  HiOutlineTrash,
  HiOutlineGlobeAlt,
  HiOutlineComputerDesktop,
  HiOutlineDevicePhoneMobile,
} from 'react-icons/hi2';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { getPasswordStrength } from '../utils/helpers';
import toast from 'react-hot-toast';

const tabs = [
  { id: 'profile', label: 'Profile', icon: HiOutlineUser },
  { id: 'notifications', label: 'Notifications', icon: HiOutlineBellAlert },
  { id: 'security', label: 'Security', icon: HiOutlineShieldCheck },
  { id: 'preferences', label: 'Preferences', icon: HiOutlinePaintBrush },
];

const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Jaipur', 'Kolkata', 'Ahmedabad', 'Lucknow'];

function Toggle({ enabled, onChange, disabled = false }) {
  return (
    <button
      onClick={() => !disabled && onChange(!enabled)}
      className={`relative w-12 h-7 rounded-full transition-colors duration-200 ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      } ${enabled ? 'bg-solar-500' : 'bg-navy-300 dark:bg-navy-600'}`}
    >
      <motion.div
        className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md"
        animate={{ left: enabled ? '26px' : '4px' }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </button>
  );
}

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

export default function SettingsPage() {
  const { user } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');

  // Profile
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location?.split(',')[0]?.trim() || 'Mumbai',
    bio: 'Solar enthusiast and clean energy advocate.',
  });

  // Notifications
  const [notifs, setNotifs] = useState({
    email: true, push: true, reports: true, reportFreq: 'weekly',
    maintenance: true, savings: true, system: true,
  });

  // Security
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });
  const strength = getPasswordStrength(passwords.newPass);

  // Preferences
  const [prefs, setPrefs] = useState({
    theme: darkMode ? 'dark' : 'light',
    language: 'English',
    layout: 'comfortable',
    units: 'kWh',
  });

  const sessions = [
    { browser: 'Chrome', device: 'Windows 11', ip: '192.168.1.xx', active: 'Active now', icon: HiOutlineComputerDesktop, current: true },
    { browser: 'Safari', device: 'iPhone 15', ip: '192.168.1.xx', active: '2 hours ago', icon: HiOutlineDevicePhoneMobile, current: false },
  ];

  const handleSaveProfile = () => { toast.success('Profile updated successfully!'); };
  const handleUpdatePassword = () => {
    if (!passwords.current || !passwords.newPass || !passwords.confirm) {
      toast.error('Please fill all password fields'); return;
    }
    if (passwords.newPass !== passwords.confirm) {
      toast.error('Passwords do not match'); return;
    }
    toast.success('Password updated successfully!');
    setPasswords({ current: '', newPass: '', confirm: '' });
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item}>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-navy-900 dark:text-white">Settings</h1>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div variants={item} className="flex gap-1 p-1 rounded-xl bg-navy-100 dark:bg-navy-800/60 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-white dark:bg-navy-700 text-solar-500 shadow-sm'
                : 'text-navy-600 dark:text-navy-400 hover:text-navy-900 dark:hover:text-white'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </motion.div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="glass p-6 rounded-2xl flex items-center gap-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-solar-400 to-solar-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                  {profile.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-semibold text-navy-900 dark:text-white">{profile.name}</h3>
                  <p className="text-sm text-navy-500 dark:text-navy-400">{profile.email}</p>
                  <div className="flex gap-2 mt-3">
                    <button className="px-3 py-1.5 text-xs font-medium rounded-lg bg-solar-500/10 text-solar-500 hover:bg-solar-500/20 transition-colors flex items-center gap-1">
                      <HiOutlineCamera className="w-3.5 h-3.5" /> Change Photo
                    </button>
                    <button className="px-3 py-1.5 text-xs font-medium rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors flex items-center gap-1">
                      <HiOutlineTrash className="w-3.5 h-3.5" /> Remove
                    </button>
                  </div>
                </div>
              </div>

              <div className="glass p-6 rounded-2xl space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-navy-700 dark:text-navy-300 block mb-1.5">Full Name</label>
                    <input value={profile.name} onChange={(e) => setProfile(p => ({...p, name: e.target.value}))} className="input-solar" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-navy-700 dark:text-navy-300 block mb-1.5">Email</label>
                    <input value={profile.email} onChange={(e) => setProfile(p => ({...p, email: e.target.value}))} className="input-solar" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-navy-700 dark:text-navy-300 block mb-1.5">Phone</label>
                    <input value={profile.phone} onChange={(e) => setProfile(p => ({...p, phone: e.target.value}))} className="input-solar" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-navy-700 dark:text-navy-300 block mb-1.5">Location</label>
                    <select value={profile.location} onChange={(e) => setProfile(p => ({...p, location: e.target.value}))} className="input-solar">
                      {cities.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-navy-700 dark:text-navy-300 block mb-1.5">Bio</label>
                  <textarea rows={3} value={profile.bio} onChange={(e) => setProfile(p => ({...p, bio: e.target.value}))} className="input-solar resize-none" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={handleSaveProfile} className="btn-primary text-sm">Save Changes</button>
                  <button className="btn-ghost text-sm">Cancel</button>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="glass p-6 rounded-2xl space-y-1">
              {[
                { key: 'email', title: 'Email Notifications', desc: 'Receive updates via email' },
                { key: 'push', title: 'Push Notifications', desc: 'Browser push notifications' },
                { key: 'reports', title: 'Energy Reports', desc: 'Periodic performance reports', extra: true },
                { key: 'maintenance', title: 'Maintenance Alerts', desc: 'Panel cleaning & service reminders' },
                { key: 'savings', title: 'Savings Milestones', desc: 'When you hit savings goals' },
                { key: 'system', title: 'System Alerts', desc: 'Critical system notifications', disabled: true },
              ].map((n) => (
                <div key={n.key} className="flex items-center justify-between py-4 border-b border-navy-100 dark:border-navy-800 last:border-0">
                  <div>
                    <p className="font-medium text-navy-900 dark:text-white text-sm">{n.title}</p>
                    <p className="text-xs text-navy-500 dark:text-navy-400 mt-0.5">{n.desc}</p>
                    {n.extra && notifs.reports && (
                      <div className="flex gap-2 mt-2">
                        {['weekly', 'monthly'].map((f) => (
                          <button key={f} onClick={() => setNotifs(p => ({...p, reportFreq: f}))}
                            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                              notifs.reportFreq === f ? 'bg-solar-500 text-white' : 'bg-navy-100 dark:bg-navy-700 text-navy-600 dark:text-navy-400'
                            }`}>
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <Toggle enabled={notifs[n.key]} onChange={(v) => setNotifs(p => ({...p, [n.key]: v}))} disabled={n.disabled} />
                </div>
              ))}
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="glass p-6 rounded-2xl space-y-4">
                <h3 className="font-semibold text-navy-900 dark:text-white">Change Password</h3>
                <input type="password" placeholder="Current Password" value={passwords.current}
                  onChange={(e) => setPasswords(p => ({...p, current: e.target.value}))} className="input-solar" />
                <div>
                  <input type="password" placeholder="New Password" value={passwords.newPass}
                    onChange={(e) => setPasswords(p => ({...p, newPass: e.target.value}))} className="input-solar" />
                  {passwords.newPass && (
                    <div className="mt-2">
                      <div className="w-full h-1.5 bg-navy-200 dark:bg-navy-700 rounded-full overflow-hidden">
                        <motion.div className={`h-full rounded-full ${strength.color}`} animate={{ width: strength.width }} />
                      </div>
                      <p className="text-xs text-navy-500 mt-1">Strength: {strength.label}</p>
                    </div>
                  )}
                </div>
                <input type="password" placeholder="Confirm New Password" value={passwords.confirm}
                  onChange={(e) => setPasswords(p => ({...p, confirm: e.target.value}))} className="input-solar" />
                <button onClick={handleUpdatePassword} className="btn-primary text-sm">Update Password</button>
              </div>

              <div className="glass p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-navy-900 dark:text-white">Two-Factor Authentication</h3>
                    <p className="text-sm text-navy-500 dark:text-navy-400 mt-1">Add an extra layer of security</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-navy-200 dark:bg-navy-700 text-navy-600 dark:text-navy-400">Not Enabled</span>
                </div>
                <button className="btn-outline text-sm">Enable 2FA</button>
              </div>

              <div className="glass p-6 rounded-2xl">
                <h3 className="font-semibold text-navy-900 dark:text-white mb-4">Active Sessions</h3>
                <div className="space-y-3">
                  {sessions.map((s, i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-navy-100 dark:border-navy-800 last:border-0">
                      <div className="flex items-center gap-3">
                        <s.icon className="w-5 h-5 text-navy-500" />
                        <div>
                          <p className="text-sm font-medium text-navy-900 dark:text-white">{s.browser} · {s.device}</p>
                          <p className="text-xs text-navy-500">{s.ip} · {s.active}</p>
                        </div>
                      </div>
                      {s.current ? (
                        <span className="px-2 py-1 rounded text-xs font-medium bg-emerald-500/10 text-emerald-500">Current</span>
                      ) : (
                        <button className="text-xs text-red-500 hover:text-red-600 font-medium">Revoke</button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="glass p-6 rounded-2xl space-y-6">
              {/* Theme */}
              <div>
                <h3 className="font-semibold text-navy-900 dark:text-white mb-3">Theme</h3>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'light', label: 'Light', preview: 'bg-white border-navy-200' },
                    { id: 'dark', label: 'Dark', preview: 'bg-navy-900 border-navy-700' },
                    { id: 'system', label: 'System', preview: 'bg-gradient-to-r from-white to-navy-900 border-navy-300' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setPrefs(p => ({...p, theme: t.id}));
                        if (t.id === 'dark' && !darkMode) toggleTheme();
                        if (t.id === 'light' && darkMode) toggleTheme();
                      }}
                      className={`p-4 rounded-xl border-2 transition-all text-center ${
                        prefs.theme === t.id
                          ? 'border-solar-500 bg-solar-500/5'
                          : 'border-navy-200 dark:border-navy-700 hover:border-navy-300'
                      }`}
                    >
                      <div className={`w-full h-12 rounded-lg border mb-2 ${t.preview}`} />
                      <p className="text-sm font-medium text-navy-900 dark:text-white">{t.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Language */}
              <div>
                <label className="text-sm font-medium text-navy-700 dark:text-navy-300 block mb-2">Language</label>
                <select value={prefs.language} onChange={(e) => setPrefs(p => ({...p, language: e.target.value}))} className="input-solar w-full max-w-xs">
                  {['English', 'Hindi', 'Tamil', 'Bengali', 'Marathi', 'Telugu', 'Gujarati'].map(l => (
                    <option key={l}>{l}</option>
                  ))}
                </select>
              </div>

              {/* Layout */}
              <div>
                <h3 className="text-sm font-medium text-navy-700 dark:text-navy-300 mb-3">Dashboard Layout</h3>
                <div className="flex gap-3">
                  {['compact', 'comfortable'].map((l) => (
                    <button key={l} onClick={() => setPrefs(p => ({...p, layout: l}))}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        prefs.layout === l ? 'bg-solar-500 text-white' : 'bg-navy-100 dark:bg-navy-700 text-navy-600 dark:text-navy-400'
                      }`}>
                      {l.charAt(0).toUpperCase() + l.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Data Units */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-navy-700 dark:text-navy-300">Data Units</p>
                  <p className="text-xs text-navy-400">kWh or MWh display</p>
                </div>
                <div className="flex gap-1 p-1 rounded-lg bg-navy-100 dark:bg-navy-800">
                  {['kWh', 'MWh'].map((u) => (
                    <button key={u} onClick={() => setPrefs(p => ({...p, units: u}))}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                        prefs.units === u ? 'bg-white dark:bg-navy-600 text-navy-900 dark:text-white shadow-sm' : 'text-navy-500'
                      }`}>
                      {u}
                    </button>
                  ))}
                </div>
              </div>

              {/* Currency */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-navy-700 dark:text-navy-300">Currency</p>
                  <p className="text-xs text-navy-400">Display currency</p>
                </div>
                <span className="text-sm font-medium text-navy-900 dark:text-white flex items-center gap-1">
                  <HiOutlineGlobeAlt className="w-4 h-4" /> INR (₹)
                </span>
              </div>

              <button onClick={() => toast.success('Preferences saved!')} className="btn-primary text-sm">Save Preferences</button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
