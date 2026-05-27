import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiBell } from 'react-icons/hi2';
import { notifications as mockNotifications } from '../../utils/mockData';
import { cn } from '../../utils/helpers';

const typeDotColor = {
  success: 'bg-emerald-500',
  info: 'bg-blue-500',
  warning: 'bg-amber-500',
  error: 'bg-red-500',
};

const dropdownVariants = {
  hidden: { opacity: 0, y: -8, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 400, damping: 26 },
  },
  exit: {
    opacity: 0,
    y: -6,
    scale: 0.96,
    transition: { duration: 0.15 },
  },
};

export default function NotificationBell({ count: externalCount }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(mockNotifications);
  const ref = useRef(null);

  const unreadCount = externalCount ?? items.filter((n) => !n.read).length;

  // Close on outside click
  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const markAsRead = (id) => {
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const markAllRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="relative" ref={ref}>
      {/* Bell button */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className="relative p-2 rounded-full text-navy-500 dark:text-navy-400 hover:bg-navy-100 dark:hover:bg-navy-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-solar-500/60"
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
        aria-expanded={open}
      >
        <HiBell className="w-5 h-5" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-4.5 h-4.5 min-w-[18px] px-1 text-[10px] font-bold text-white bg-red-500 rounded-full ring-2 ring-white dark:ring-navy-900"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute right-0 mt-2 w-80 sm:w-96 glass-strong shadow-2xl rounded-2xl overflow-hidden z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-navy-200/30 dark:border-navy-700/40">
              <h3 className="text-sm font-display font-semibold text-navy-900 dark:text-white">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-xs font-medium text-solar-500 hover:text-solar-600 dark:hover:text-solar-400 transition-colors"
                >
                  Mark all read
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-80 overflow-y-auto no-scrollbar divide-y divide-navy-200/20 dark:divide-navy-700/30">
              {items.length === 0 ? (
                <div className="py-10 text-center text-sm text-navy-400 dark:text-navy-500">
                  No notifications
                </div>
              ) : (
                items.map((n) => (
                  <motion.button
                    key={n.id}
                    onClick={() => markAsRead(n.id)}
                    className={cn(
                      'w-full flex items-start gap-3 px-5 py-4 text-left transition-colors',
                      'hover:bg-navy-50/60 dark:hover:bg-navy-800/40',
                      !n.read && 'bg-solar-50/40 dark:bg-solar-500/5',
                    )}
                  >
                    {/* Type dot */}
                    <span
                      className={cn(
                        'w-2.5 h-2.5 mt-1.5 rounded-full flex-shrink-0',
                        typeDotColor[n.type] || 'bg-navy-400',
                      )}
                      aria-hidden="true"
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          'text-sm font-medium truncate',
                          n.read
                            ? 'text-navy-600 dark:text-navy-300'
                            : 'text-navy-900 dark:text-white',
                        )}
                      >
                        {n.title}
                      </p>
                      <p className="mt-0.5 text-xs text-navy-500 dark:text-navy-400 line-clamp-2">
                        {n.message}
                      </p>
                      <p className="mt-1 text-[11px] text-navy-400 dark:text-navy-500">
                        {n.time}
                      </p>
                    </div>
                    {/* Unread indicator */}
                    {!n.read && (
                      <span className="w-2 h-2 mt-2 rounded-full bg-solar-500 flex-shrink-0" />
                    )}
                  </motion.button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
