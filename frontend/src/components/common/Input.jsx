import { useState, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiEye, HiEyeSlash } from 'react-icons/hi2';
import { cn } from '../../utils/helpers';

export default function Input({
  label,
  type = 'text',
  value,
  onChange,
  error,
  icon: Icon,
  className,
  required = false,
  disabled = false,
  name,
  ...rest
}) {
  const id = useId();
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;
  const isFilled = value !== undefined && value !== null && String(value).length > 0;
  const isFloating = focused || isFilled;

  return (
    <div className={cn('relative w-full', className)}>
      {/* Leading icon */}
      {Icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none text-navy-400 dark:text-navy-500">
          <Icon className="w-5 h-5" />
        </div>
      )}

      {/* Input */}
      <input
        id={id}
        name={name}
        type={inputType}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        disabled={disabled}
        required={required}
        placeholder=" "
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(
          'input-solar peer w-full',
          'pt-5 pb-2',
          Icon && 'pl-12',
          isPassword && 'pr-12',
          error && 'border-red-500 dark:border-red-500 focus:ring-red-500/50 focus:border-red-500',
          disabled && 'opacity-50 cursor-not-allowed',
        )}
        {...rest}
      />

      {/* Floating label */}
      <label
        htmlFor={id}
        className={cn(
          'absolute transition-all duration-200 pointer-events-none select-none',
          'text-navy-400 dark:text-navy-500',
          Icon ? 'left-12' : 'left-4',
          isFloating
            ? 'top-2 text-xs font-medium text-solar-500 dark:text-solar-400'
            : 'top-1/2 -translate-y-1/2 text-base',
          error && isFloating && 'text-red-500 dark:text-red-400',
        )}
      >
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>

      {/* Password toggle */}
      {isPassword && (
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setShowPassword(prev => !prev)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-navy-400 dark:text-navy-500 hover:text-solar-500 dark:hover:text-solar-400 transition-colors"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <HiEyeSlash className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
        </button>
      )}

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.p
            id={`${id}-error`}
            role="alert"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="mt-1.5 text-sm text-red-500 dark:text-red-400 flex items-center gap-1"
          >
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 10-2 0v4a1 1 0 102 0V6zm-1 8a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
