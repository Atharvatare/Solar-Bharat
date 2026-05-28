import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiOutlineUser,
  HiOutlineEnvelope,
  HiOutlinePhone,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeSlash,
} from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { isValidEmail, getPasswordStrength } from '../utils/helpers';

const formVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const stagger = {
  visible: {
    transition: { staggerChildren: 0.07 },
  },
};

const childVariant = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

/* Shared input wrapper moved OUTSIDE to prevent re-mounting and losing focus */
const InputField = ({
  id,
  name,
  type = 'text',
  placeholder,
  icon: Icon,
  value,
  onChange,
  autoComplete,
  prefix,
  toggleShow,
  showState,
  error,
}) => (
  <motion.div variants={childVariant}>
    <label htmlFor={id} className="sr-only">
      {placeholder}
    </label>
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-400 dark:text-navy-500 pointer-events-none">
        <Icon className="w-5 h-5" />
      </span>

      {prefix && (
        <span className="absolute left-12 top-1/2 -translate-y-1/2 text-sm font-medium text-navy-500 dark:text-navy-400 pointer-events-none select-none">
          {prefix}
        </span>
      )}

      <input
        id={id}
        name={name}
        type={toggleShow !== undefined ? (showState ? 'text' : 'password') : type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`input-solar ${prefix ? 'pl-[5.5rem]' : 'pl-12'} ${
          toggleShow !== undefined ? 'pr-12' : ''
        } ${
          error
            ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500'
            : ''
        }`}
      />

      {toggleShow !== undefined && (
        <button
          type="button"
          onClick={toggleShow}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-navy-400 dark:text-navy-500 hover:text-solar-500 transition-colors"
          aria-label={showState ? 'Hide password' : 'Show password'}
        >
          {showState ? (
            <HiOutlineEyeSlash className="w-5 h-5" />
          ) : (
            <HiOutlineEye className="w-5 h-5" />
          )}
        </button>
      )}
    </div>
    {error && (
      <p id={`${id}-error`} className="mt-1.5 text-sm text-red-500">
        {error}
      </p>
    )}
  </motion.div>
);

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, loading } = useAuth();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errors, setErrors] = useState({});

  const passwordStrength =
    form.password.length > 0 ? getPasswordStrength(form.password) : null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(form.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!form.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Enter a valid 10-digit Indian mobile number';
    }

    if (!form.password) {
      newErrors.password = 'Password is required';
    } else if (form.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!termsAccepted) {
      newErrors.terms = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await register({
        name: form.name,
        email: form.email,
        phone: `+91 ${form.phone}`,
      });
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <motion.div
      className="w-full flex items-center justify-center px-4 py-8 min-h-[calc(100vh-4rem)]"
      initial="hidden"
      animate="visible"
      variants={stagger}
    >
      <motion.div
        className="glass-strong w-full max-w-lg p-8 shadow-glass-light dark:shadow-glass"
        variants={formVariants}
      >
        {/* Header */}
        <motion.div className="text-center mb-8" variants={childVariant}>
          <h1 className="font-display text-3xl font-bold text-navy-900 dark:text-white">
            Create Account
          </h1>
          <p className="mt-2 text-navy-500 dark:text-navy-400">
            Start your solar journey today
          </p>
        </motion.div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <InputField
            id="name"
            name="name"
            placeholder="Full Name"
            icon={HiOutlineUser}
            value={form.name}
            onChange={handleChange}
            autoComplete="name"
            error={errors.name}
          />

          <InputField
            id="email"
            name="email"
            type="email"
            placeholder="Email address"
            icon={HiOutlineEnvelope}
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
            error={errors.email}
          />

          <InputField
            id="phone"
            name="phone"
            type="tel"
            placeholder="Mobile number"
            icon={HiOutlinePhone}
            value={form.phone}
            onChange={handleChange}
            autoComplete="tel-national"
            prefix="+91"
            error={errors.phone}
          />

          {/* Password */}
          <InputField
            id="password"
            name="password"
            placeholder="Password"
            icon={HiOutlineLockClosed}
            value={form.password}
            onChange={handleChange}
            autoComplete="new-password"
            toggleShow={() => setShowPassword((v) => !v)}
            showState={showPassword}
            error={errors.password}
          />

          {/* Password Strength Meter */}
          {passwordStrength && (
            <motion.div
              className="space-y-1.5 -mt-2"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
            >
              <div className="h-1.5 w-full bg-navy-100 dark:bg-navy-700 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${passwordStrength.color}`}
                  initial={{ width: 0 }}
                  animate={{ width: passwordStrength.width }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                />
              </div>
              <p className="text-xs text-navy-500 dark:text-navy-400">
                Strength:{' '}
                <span
                  className={`font-semibold ${
                    passwordStrength.label === 'Weak'
                      ? 'text-red-500'
                      : passwordStrength.label === 'Fair'
                      ? 'text-orange-500'
                      : passwordStrength.label === 'Good'
                      ? 'text-yellow-500'
                      : passwordStrength.label === 'Strong'
                      ? 'text-green-500'
                      : 'text-emerald-500'
                  }`}
                >
                  {passwordStrength.label}
                </span>
              </p>
            </motion.div>
          )}

          {/* Confirm Password */}
          <InputField
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm Password"
            icon={HiOutlineLockClosed}
            value={form.confirmPassword}
            onChange={handleChange}
            autoComplete="new-password"
            toggleShow={() => setShowConfirm((v) => !v)}
            showState={showConfirm}
            error={errors.confirmPassword}
          />

          {/* Terms */}
          <motion.div variants={childVariant}>
            <label className="flex items-start gap-3 cursor-pointer select-none group">
              <span className="relative flex items-center justify-center mt-0.5">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => {
                    setTermsAccepted(e.target.checked);
                    if (errors.terms)
                      setErrors((prev) => ({ ...prev, terms: '' }));
                  }}
                  className="peer sr-only"
                />
                <span className="w-5 h-5 rounded-md border-2 border-navy-300 dark:border-navy-600 bg-white dark:bg-navy-800 peer-checked:border-solar-500 peer-checked:bg-solar-500 transition-all duration-200 flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
                    viewBox="0 0 12 10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 5l3 3 7-7" />
                  </svg>
                </span>
              </span>
              <span className="text-sm text-navy-600 dark:text-navy-400 leading-snug">
                I agree to the{' '}
                <Link
                  to="/terms"
                  className="font-medium text-solar-500 hover:text-solar-600 dark:hover:text-solar-400 transition-colors underline underline-offset-2"
                >
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link
                  to="/privacy"
                  className="font-medium text-solar-500 hover:text-solar-600 dark:hover:text-solar-400 transition-colors underline underline-offset-2"
                >
                  Privacy Policy
                </Link>
              </span>
            </label>
            {errors.terms && (
              <p className="mt-1.5 text-sm text-red-500">{errors.terms}</p>
            )}
          </motion.div>

          {/* Submit */}
          <motion.div variants={childVariant}>
            <motion.button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
            >
              {loading ? (
                <>
                  <svg
                    className="w-5 h-5 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
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
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  Creating Account…
                </>
              ) : (
                'Create Account'
              )}
            </motion.button>
          </motion.div>
        </form>

        {/* Footer */}
        <motion.p
          className="mt-8 text-center text-sm text-navy-500 dark:text-navy-400"
          variants={childVariant}
        >
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-solar-500 hover:text-solar-600 dark:hover:text-solar-400 transition-colors"
          >
            Sign in
          </Link>
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
