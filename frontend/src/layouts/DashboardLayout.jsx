import { useState, useRef, useEffect, useMemo } from 'react';
import { NavLink, Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineHome,
  HiOutlineChartBar,
  HiOutlineCalculator,
  HiOutlineDocumentArrowUp,
  HiOutlineDocumentArrowDown,
  HiOutlineBuildingOffice,
  HiOutlineCpuChip,
  HiOutlineCog6Tooth,
  HiOutlineShieldCheck,
  HiOutlineUsers,
  HiOutlineBars3,
  HiXMark,
  HiOutlineChevronLeft,
  HiOutlineArrowRightOnRectangle,
  HiOutlineMagnifyingGlass,
  HiOutlineChevronRight,
  HiOutlineSun,
} from 'react-icons/hi2';
import ThemeToggle from '../components/ui/ThemeToggle';
import NotificationBell from '../components/ui/NotificationBell';
import { useAuth } from '../hooks/useAuth';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { DASHBOARD_LINKS } from '../utils/constants';

/* ─── Icon Map ─── */
const ICON_MAP = {
  HiOutlineHome,
  HiOutlineChartBar,
  HiOutlineCalculator,
  HiOutlineDocumentArrowUp,
  HiOutlineDocumentArrowDown,
  HiOutlineBuildingOffice,
  HiOutlineCpuChip,
  HiOutlineCog6Tooth,
  HiOutlineShieldCheck,
  HiOutlineUsers,
  HiOutlineSun,
};

/* ─── Sun Logo SVG (compact) ─── */
function SunLogo({ className = 'w-8 h-8' }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <circle cx="24" cy="24" r="10" className="fill-solar-500" />
      <g className="stroke-solar-400" strokeWidth="2.5" strokeLinecap="round">
        <line x1="24" y1="2" x2="24" y2="9" />
        <line x1="24" y1="39" x2="24" y2="46" />
        <line x1="2" y1="24" x2="9" y2="24" />
        <line x1="39" y1="24" x2="46" y2="24" />
        <line x1="8.4" y1="8.4" x2="13.3" y2="13.3" />
        <line x1="34.7" y1="34.7" x2="39.6" y2="39.6" />
        <line x1="8.4" y1="39.6" x2="13.3" y2="34.7" />
        <line x1="34.7" y1="13.3" x2="39.6" y2="8.4" />
      </g>
    </svg>
  );
}

/* ─── User Avatar (initials) ─── */
function UserAvatar({ name, size = 'md' }) {
  const initials = name
    ? name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : '?';

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-xl bg-gradient-to-br from-solar-400 to-solar-600
        flex items-center justify-center text-white font-bold shadow-lg shadow-solar-500/20 flex-shrink-0`}
    >
      {initials}
    </div>
  );
}

/* ─── Sidebar ─── */
function Sidebar({ collapsed, setCollapsed }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      className="fixed left-0 top-0 bottom-0 z-40 flex flex-col
        bg-white/80 dark:bg-navy-900/80 backdrop-blur-2xl
        border-r border-navy-200/40 dark:border-navy-700/40"
    >
      {/* Logo + Toggle */}
      <div className="h-[72px] flex items-center justify-between px-4 border-b border-navy-200/30 dark:border-navy-700/30">
        <Link to="/dashboard" className="flex items-center gap-2.5 overflow-hidden" aria-label="Dashboard Home">
          <motion.div whileHover={{ rotate: 20 }} transition={{ type: 'spring', stiffness: 260 }}>
            <SunLogo className="w-8 h-8 flex-shrink-0" />
          </motion.div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="font-display font-bold text-lg tracking-tight whitespace-nowrap overflow-hidden"
              >
                <span className="text-solar-500">Solar</span>{' '}
                <span className="text-navy-900 dark:text-white">Bharat</span>
              </motion.span>
            )}
          </AnimatePresence>
        </Link>

        <motion.button
          whileTap={{ scale: 0.85 }}
          animate={{ rotate: collapsed ? 180 : 0 }}
          onClick={() => setCollapsed(!collapsed)}
          className="w-7 h-7 flex items-center justify-center rounded-lg
            text-navy-400 hover:text-navy-600 dark:hover:text-navy-200
            hover:bg-navy-100 dark:hover:bg-navy-800
            transition-colors cursor-pointer flex-shrink-0"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <HiOutlineChevronLeft className="text-sm" />
        </motion.button>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 overflow-y-auto no-scrollbar px-3 py-4 space-y-1" aria-label="Dashboard navigation">
        {DASHBOARD_LINKS.map((link) => {
          const IconComponent = ICON_MAP[link.icon] || HiOutlineHome;
          return (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === '/dashboard'}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 rounded-xl transition-all duration-200
                 ${collapsed ? 'justify-center px-3 py-3' : 'px-4 py-3'}
                 ${
                   isActive
                     ? 'bg-solar-500/12 text-solar-600 dark:text-solar-400 font-medium'
                     : 'text-navy-500 dark:text-navy-400 hover:bg-navy-100/60 dark:hover:bg-navy-800/60 hover:text-navy-700 dark:hover:text-navy-200'
                 }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Active left accent */}
                  {isActive && (
                    <motion.span
                      layoutId="sidebar-active"
                      className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full bg-solar-500"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                  <IconComponent className="text-xl flex-shrink-0" />
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        className="text-sm whitespace-nowrap overflow-hidden"
                      >
                        {link.name}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {/* Tooltip when collapsed */}
                  {collapsed && (
                    <div
                      className="absolute left-full ml-3 px-3 py-1.5 rounded-lg
                        bg-navy-900 dark:bg-navy-700 text-white text-xs font-medium
                        opacity-0 invisible group-hover:opacity-100 group-hover:visible
                        transition-all duration-200 whitespace-nowrap z-50 pointer-events-none
                        shadow-lg"
                    >
                      {link.name}
                      <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-navy-900 dark:border-r-navy-700" />
                    </div>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User Info + Logout */}
      <div className="px-3 pb-4 pt-2 border-t border-navy-200/30 dark:border-navy-700/30 space-y-2">
        {/* User info */}
        <div className={`flex items-center gap-3 p-2 rounded-xl ${collapsed ? 'justify-center' : ''}`}>
          <UserAvatar name={user?.name} size="sm" />
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden min-w-0"
              >
                <p className="text-sm font-medium text-navy-900 dark:text-white truncate">
                  {user?.name || 'User'}
                </p>
                <p className="text-[11px] text-navy-400 dark:text-navy-500 capitalize truncate">
                  {user?.role || 'user'}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Logout */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className={`flex items-center gap-3 w-full rounded-xl transition-all duration-200 cursor-pointer
            text-navy-500 dark:text-navy-400 hover:bg-red-500/10 hover:text-red-500
            ${collapsed ? 'justify-center px-3 py-3' : 'px-4 py-3'}`}
          aria-label="Logout"
        >
          <HiOutlineArrowRightOnRectangle className="text-xl flex-shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm font-medium"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.aside>
  );
}

/* ─── Mobile Bottom Nav ─── */
function MobileBottomNav() {
  /* Show only the first 5 links on the bottom bar */
  const mobileLinks = DASHBOARD_LINKS.slice(0, 5);

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 h-16 flex items-center justify-around
        bg-white/90 dark:bg-navy-900/90 backdrop-blur-xl
        border-t border-navy-200/40 dark:border-navy-700/40
        safe-area-bottom"
      aria-label="Mobile navigation"
    >
      {mobileLinks.map((link) => {
        const IconComponent = ICON_MAP[link.icon] || HiOutlineHome;
        return (
          <NavLink
            key={link.path}
            to={link.path}
            end={link.path === '/dashboard'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors duration-200
               ${
                 isActive
                   ? 'text-solar-500'
                   : 'text-navy-400 dark:text-navy-500'
               }`
            }
          >
            <IconComponent className="text-xl" />
            <span className="text-[10px] font-medium leading-none">{link.name.split(' ')[0]}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}

/* ─── Mobile Sidebar Overlay ─── */
function MobileSidebarOverlay({ open, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-navy-950/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed left-0 top-0 bottom-0 w-[280px] z-50
              bg-white/95 dark:bg-navy-900/95 backdrop-blur-2xl
              border-r border-navy-200/40 dark:border-navy-700/40
              flex flex-col overflow-y-auto"
          >
            {/* Header */}
            <div className="h-[72px] flex items-center justify-between px-4 border-b border-navy-200/30 dark:border-navy-700/30">
              <Link to="/dashboard" className="flex items-center gap-2.5" onClick={onClose}>
                <SunLogo className="w-8 h-8" />
                <span className="font-display font-bold text-lg">
                  <span className="text-solar-500">Solar</span>{' '}
                  <span className="text-navy-900 dark:text-white">Bharat</span>
                </span>
              </Link>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-9 h-9 flex items-center justify-center rounded-xl
                  text-navy-600 dark:text-navy-300 hover:bg-navy-100 dark:hover:bg-navy-800
                  transition-colors cursor-pointer"
                aria-label="Close sidebar"
              >
                <HiXMark className="text-xl" />
              </motion.button>
            </div>

            {/* Links */}
            <nav className="flex-1 px-3 py-4 space-y-1">
              {DASHBOARD_LINKS.map((link, i) => {
                const IconComponent = ICON_MAP[link.icon] || HiOutlineHome;
                return (
                  <motion.div
                    key={link.path}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.03 * i }}
                  >
                    <NavLink
                      to={link.path}
                      end={link.path === '/dashboard'}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                         ${
                           isActive
                             ? 'bg-solar-500/12 text-solar-600 dark:text-solar-400 font-medium'
                             : 'text-navy-500 dark:text-navy-400 hover:bg-navy-100/60 dark:hover:bg-navy-800/60'
                         }`
                      }
                    >
                      <IconComponent className="text-xl flex-shrink-0" />
                      <span className="text-sm">{link.name}</span>
                    </NavLink>
                  </motion.div>
                );
              })}
            </nav>

            {/* User & Logout */}
            <div className="px-3 pb-4 pt-2 border-t border-navy-200/30 dark:border-navy-700/30 space-y-2">
              <div className="flex items-center gap-3 p-2 rounded-xl">
                <UserAvatar name={user?.name} size="sm" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-navy-900 dark:text-white truncate">
                    {user?.name || 'User'}
                  </p>
                  <p className="text-[11px] text-navy-400 capitalize truncate">
                    {user?.role || 'user'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl
                  text-navy-500 hover:bg-red-500/10 hover:text-red-500
                  transition-all duration-200 cursor-pointer"
              >
                <HiOutlineArrowRightOnRectangle className="text-xl" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ─── Top Bar ─── */
function TopBar({ sidebarWidth, onMobileMenuOpen }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /* Auto-focus search input when expanded */
  useEffect(() => {
    if (searchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [searchOpen]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const location = useLocation();
  const pageTitle = useMemo(() => {
    const match = DASHBOARD_LINKS.find((l) => l.path === location.pathname);
    return match?.name || 'Dashboard';
  }, [location.pathname]);

  return (
    <header
      style={{ left: isMobile ? 0 : sidebarWidth }}
      className="fixed top-0 right-0 z-30 h-[72px] flex items-center justify-between gap-4 px-4 md:px-6
        bg-white/80 dark:bg-navy-900/80 backdrop-blur-xl
        border-b border-navy-200/30 dark:border-navy-700/30
        transition-[left] duration-300"
    >
      {/* Left: hamburger (mobile) + title */}
      <div className="flex items-center gap-3 min-w-0">
        {isMobile && (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onMobileMenuOpen}
            className="w-10 h-10 flex items-center justify-center rounded-xl
              text-navy-600 dark:text-navy-300 hover:bg-navy-100 dark:hover:bg-navy-800
              transition-colors cursor-pointer"
            aria-label="Open menu"
          >
            <HiOutlineBars3 className="text-2xl" />
          </motion.button>
        )}
        <div className="min-w-0">
          <h1 className="text-lg font-display font-semibold text-navy-900 dark:text-white truncate">
            {pageTitle}
          </h1>
          {!isMobile && (
            <div className="flex items-center gap-1.5 text-xs text-navy-400">
              <Link to="/dashboard" className="hover:text-solar-500 transition-colors">
                Home
              </Link>
              {pageTitle !== 'Dashboard' && (
                <>
                  <HiOutlineChevronRight className="text-[10px]" />
                  <span className="text-navy-600 dark:text-navy-300">{pageTitle}</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right: search, notifications, theme, avatar */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Search */}
        <div className="relative">
          <AnimatePresence>
            {searchOpen && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: isMobile ? 160 : 220, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onBlur={() => { if (!searchQuery) setSearchOpen(false); }}
                  className="w-full h-10 pl-4 pr-3 rounded-xl text-sm
                    bg-navy-100/80 dark:bg-navy-800/80
                    text-navy-900 dark:text-white
                    placeholder:text-navy-400
                    focus:outline-none focus:ring-2 focus:ring-solar-500/50
                    transition-all"
                />
              </motion.div>
            )}
          </AnimatePresence>
          {!searchOpen && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => setSearchOpen(true)}
              className="w-10 h-10 flex items-center justify-center rounded-xl
                bg-navy-100 dark:bg-navy-800 text-navy-600 dark:text-navy-300
                hover:bg-navy-200 dark:hover:bg-navy-700
                transition-colors cursor-pointer"
              aria-label="Search"
            >
              <HiOutlineMagnifyingGlass className="text-xl" />
            </motion.button>
          )}
        </div>

        <NotificationBell />
        <ThemeToggle size="sm" />

        {/* User Dropdown */}
        <div className="relative" ref={userMenuRef}>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="cursor-pointer"
            aria-label="User menu"
          >
            <UserAvatar name={user?.name} size="sm" />
          </motion.button>

          <AnimatePresence>
            {userMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-14 w-56 glass-strong shadow-xl rounded-2xl overflow-hidden z-50"
              >
                {/* User info */}
                <div className="px-4 py-3 border-b border-navy-200/30 dark:border-navy-700/50">
                  <p className="text-sm font-medium text-navy-900 dark:text-white truncate">
                    {user?.name || 'User'}
                  </p>
                  <p className="text-xs text-navy-400 truncate">{user?.email || ''}</p>
                </div>

                <div className="py-1">
                  {[
                    { label: 'Profile', path: '/dashboard/settings' },
                    { label: 'Settings', path: '/dashboard/settings' },
                  ].map((item) => (
                    <Link
                      key={item.label}
                      to={item.path}
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-2.5 text-sm text-navy-600 dark:text-navy-300
                        hover:bg-navy-100/50 dark:hover:bg-navy-800/50 transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>

                <div className="border-t border-navy-200/30 dark:border-navy-700/50 py-1">
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-500
                      hover:bg-red-500/10 transition-colors cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

/* ─── Page Transition Wrapper ─── */
const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.2 } },
};

/* ─── Dashboard Layout ─── */
function DashboardLayout() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [collapsed, setCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();

  const sidebarWidth = isMobile ? 0 : collapsed ? 80 : 280;

  /* Close mobile sidebar on route change */
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-navy-50/50 dark:bg-navy-950">
      {/* Desktop Sidebar */}
      {!isMobile && <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />}

      {/* Mobile Sidebar Overlay */}
      {isMobile && (
        <MobileSidebarOverlay
          open={mobileSidebarOpen}
          onClose={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Top Bar */}
      <TopBar
        sidebarWidth={sidebarWidth}
        onMobileMenuOpen={() => setMobileSidebarOpen(true)}
      />

      {/* Main Content */}
      <main
        style={{ marginLeft: isMobile ? 0 : sidebarWidth }}
        className={`pt-[72px] transition-[margin-left] duration-300
          ${isMobile ? 'pb-20' : ''}
          min-h-screen`}
      >
        <div className="p-4 md:p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      {isMobile && <MobileBottomNav />}
    </div>
  );
}

export default DashboardLayout;
