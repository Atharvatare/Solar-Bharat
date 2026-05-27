import { motion } from 'framer-motion';
import { HiArrowTrendingUp, HiArrowTrendingDown } from 'react-icons/hi2';
import { cn } from '../../utils/helpers';

export default function StatCard({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  iconColor = 'text-solar-500',
  trend,
  className,
  index = 0,
}) {
  const isPositive = trend === 'up' || (trend === undefined && change > 0);

  const iconBgMap = {
    'text-solar-500': 'bg-solar-100 dark:bg-solar-500/15',
    'text-emerald-500': 'bg-emerald-100 dark:bg-emerald-500/15',
    'text-blue-500': 'bg-blue-100 dark:bg-blue-500/15',
    'text-purple-500': 'bg-purple-100 dark:bg-purple-500/15',
    'text-red-500': 'bg-red-100 dark:bg-red-500/15',
    'text-cyan-500': 'bg-cyan-100 dark:bg-cyan-500/15',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        delay: index * 0.08,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{
        y: -3,
        boxShadow: '0 0 20px rgba(245,158,11,0.12), 0 8px 24px rgba(0,0,0,0.08)',
      }}
      className={cn(
        'glass p-6 flex flex-col gap-4 cursor-default',
        className,
      )}
    >
      {/* Top row: icon + title */}
      <div className="flex items-center justify-between">
        {Icon && (
          <div
            className={cn(
              'flex items-center justify-center w-11 h-11 rounded-xl',
              iconBgMap[iconColor] || 'bg-solar-100 dark:bg-solar-500/15',
            )}
          >
            <Icon className={cn('w-5 h-5', iconColor)} />
          </div>
        )}
        <span className="text-xs font-medium text-navy-400 dark:text-navy-500 uppercase tracking-wider text-right">
          {title}
        </span>
      </div>

      {/* Value */}
      <div className="text-2xl sm:text-3xl font-mono font-bold text-navy-900 dark:text-white tracking-tight">
        {value}
      </div>

      {/* Change row */}
      {change !== undefined && (
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              'inline-flex items-center gap-0.5 text-sm font-semibold',
              isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400',
            )}
          >
            {isPositive ? (
              <HiArrowTrendingUp className="w-4 h-4" />
            ) : (
              <HiArrowTrendingDown className="w-4 h-4" />
            )}
            {Math.abs(change)}%
          </span>
          {changeLabel && (
            <span className="text-xs text-navy-400 dark:text-navy-500">
              {changeLabel}
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
}
