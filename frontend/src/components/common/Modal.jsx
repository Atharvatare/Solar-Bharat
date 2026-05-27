import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiXMark } from 'react-icons/hi2';
import { cn } from '../../utils/helpers';

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 360, damping: 28 },
  },
  exit: {
    opacity: 0,
    y: 30,
    scale: 0.97,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
}) {
  const handleEscape = useCallback(
    (e) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleEscape]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="absolute inset-0 bg-navy-950/60 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Modal panel */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn(
              'relative w-full',
              sizeClasses[size],
              'glass-strong shadow-2xl',
              'max-h-[85vh] flex flex-col',
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-navy-200/30 dark:border-navy-700/40">
              <h2 className="text-lg font-display font-semibold text-navy-900 dark:text-white">
                {title}
              </h2>
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                className="p-1.5 rounded-lg text-navy-400 dark:text-navy-500 hover:bg-navy-100 dark:hover:bg-navy-800 hover:text-navy-600 dark:hover:text-navy-300 transition-colors"
                aria-label="Close modal"
              >
                <HiXMark className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 overflow-y-auto flex-1 no-scrollbar">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
