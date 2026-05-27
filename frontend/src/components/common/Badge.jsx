import { cn } from '../../utils/helpers';

const variantStyles = {
  success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
  warning: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
  error: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400',
  info: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400',
  neutral: 'bg-navy-100 text-navy-600 dark:bg-navy-700/50 dark:text-navy-300',
};

const dotColors = {
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  error: 'bg-red-500',
  info: 'bg-blue-500',
  neutral: 'bg-navy-400 dark:bg-navy-500',
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
};

export default function Badge({
  variant = 'neutral',
  children,
  dot = false,
  size = 'sm',
  className,
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium select-none whitespace-nowrap',
        variantStyles[variant],
        sizeClasses[size],
        className,
      )}
    >
      {dot && (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full flex-shrink-0',
            dotColors[variant],
          )}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}
