import { motion, AnimatePresence } from 'framer-motion';
import { HiSun, HiMoon } from 'react-icons/hi2';
import { useTheme } from '../../hooks/useTheme';

const iconVariants = {
  initial: { opacity: 0, rotate: -90, scale: 0.5 },
  animate: { opacity: 1, rotate: 0, scale: 1 },
  exit: { opacity: 0, rotate: 90, scale: 0.5 },
};

export default function ThemeToggle({ className }) {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      className={`
        relative inline-flex items-center justify-center
        w-10 h-10 rounded-full
        bg-navy-100 dark:bg-navy-800
        hover:bg-solar-100 dark:hover:bg-navy-700
        text-solar-500 dark:text-solar-400
        transition-colors duration-200
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-solar-500/60
        ${className || ''}
      `}
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <AnimatePresence mode="wait" initial={false}>
        {darkMode ? (
          <motion.span
            key="moon"
            variants={iconVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="absolute"
          >
            <HiMoon className="w-5 h-5" />
          </motion.span>
        ) : (
          <motion.span
            key="sun"
            variants={iconVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="absolute"
          >
            <HiSun className="w-5 h-5" />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
