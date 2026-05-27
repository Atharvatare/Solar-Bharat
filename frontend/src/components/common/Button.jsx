import { motion } from 'framer-motion';
import { cn } from '../../utils/helpers';

const sizeClasses = {
  sm: 'px-4 py-2 text-sm gap-1.5',
  md: 'px-6 py-3 text-base gap-2',
  lg: 'px-8 py-4 text-lg gap-2.5',
};

const variantClasses = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  outline: 'btn-outline',
  ghost: 'btn-ghost',
};

function Spinner({ size }) {
  const dim = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5';
  return (
    <svg
      className={cn(dim, 'animate-spin')}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  className,
  icon: Icon,
  loading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  type = 'button',
  ...rest
}) {
  const isDisabled = disabled || loading;

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      whileHover={isDisabled ? {} : { scale: 1.02, boxShadow: '0 8px 30px rgba(245, 158, 11, 0.18)' }}
      whileTap={isDisabled ? {} : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={cn(
        'relative inline-flex items-center justify-center font-semibold',
        'select-none cursor-pointer',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-solar-500/60 focus-visible:ring-offset-2',
        'dark:focus-visible:ring-offset-navy-900',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        isDisabled && 'opacity-50 cursor-not-allowed pointer-events-none',
        className,
      )}
      aria-disabled={isDisabled}
      aria-busy={loading}
      {...rest}
    >
      {loading && <Spinner size={size} />}
      {!loading && Icon && (
        <Icon className={size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'} />
      )}
      <span>{children}</span>
    </motion.button>
  );
}
