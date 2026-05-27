import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiOutlineEnvelope,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeSlash,
} from 'react-icons/hi2';
import { FcGoogle } from 'react-icons/fc';
import { FiGithub } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { isValidEmail } from '../utils/helpers';

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
    transition: { staggerChildren: 0.08 },
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

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loading } = useAuth();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(form.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!form.password) {
      newErrors.password = 'Password is required';
    } else if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await login(form.email, form.password);
      toast.success('Welcome back! Redirecting…');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err?.message || 'Login failed. Please try again.');
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
        className="glass-strong w-full max-w-md p-8 shadow-glass-light dark:shadow-glass"
        variants={formVariants}
      >
        {/* Header */}
        <motion.div className="text-center mb-8" variants={childVariant}>
          <h1 className="font-display text-3xl font-bold text-navy-900 dark:text-white">
            Welcome Back
          </h1>
          <p className="mt-2 text-navy-500 dark:text-navy-400">
            Sign in to your Solar Bharat account
          </p>
        </motion.div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Email */}
          <motion.div variants={childVariant}>
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-400 dark:text-navy-500 pointer-events-none">
                <HiOutlineEnvelope className="w-5 h-5" />
              </span>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Email address"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
                className={`input-solar pl-12 ${
                  errors.email
                    ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500'
                    : ''
                }`}
              />
            </div>
            {errors.email && (
              <p id="email-error" className="mt-1.5 text-sm text-red-500">
                {errors.email}
              </p>
            )}
          </motion.div>

          {/* Password */}
          <motion.div variants={childVariant}>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-400 dark:text-navy-500 pointer-events-none">
                <HiOutlineLockClosed className="w-5 h-5" />
              </span>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                autoComplete="current-password"
                value={form.password}
                onChange={handleChange}
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? 'password-error' : undefined}
                className={`input-solar pl-12 pr-12 ${
                  errors.password
                    ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500'
                    : ''
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-navy-400 dark:text-navy-500 hover:text-solar-500 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <HiOutlineEyeSlash className="w-5 h-5" />
                ) : (
                  <HiOutlineEye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p id="password-error" className="mt-1.5 text-sm text-red-500">
                {errors.password}
              </p>
            )}
          </motion.div>

          {/* Remember me + Forgot password */}
          <motion.div
            className="flex items-center justify-between"
            variants={childVariant}
          >
            <label className="flex items-center gap-2 cursor-pointer select-none group">
              <span className="relative flex items-center justify-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
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
              <span className="text-sm text-navy-600 dark:text-navy-400 group-hover:text-navy-900 dark:group-hover:text-navy-200 transition-colors">
                Remember me
              </span>
            </label>
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-solar-500 hover:text-solar-600 dark:hover:text-solar-400 transition-colors"
            >
              Forgot Password?
            </Link>
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
                  Signing In…
                </>
              ) : (
                'Sign In'
              )}
            </motion.button>
          </motion.div>
        </form>

        {/* Divider */}
        <motion.div
          className="flex items-center gap-4 my-6"
          variants={childVariant}
        >
          <div className="flex-1 h-px bg-navy-200 dark:bg-navy-700" />
          <span className="text-xs text-navy-400 dark:text-navy-500 whitespace-nowrap">
            or continue with
          </span>
          <div className="flex-1 h-px bg-navy-200 dark:bg-navy-700" />
        </motion.div>

        {/* Social Login */}
        <motion.div
          className="grid grid-cols-2 gap-3"
          variants={childVariant}
        >
          <motion.button
            type="button"
            className="btn-ghost flex items-center justify-center gap-2 border border-navy-200 dark:border-navy-700 text-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => toast('Google login coming soon!', { icon: '🚧' })}
            aria-label="Sign in with Google"
          >
            <FcGoogle className="w-5 h-5" />
            Google
          </motion.button>
          <motion.button
            type="button"
            className="btn-ghost flex items-center justify-center gap-2 border border-navy-200 dark:border-navy-700 text-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => toast('GitHub login coming soon!', { icon: '🚧' })}
            aria-label="Sign in with GitHub"
          >
            <FiGithub className="w-5 h-5" />
            GitHub
          </motion.button>
        </motion.div>

        {/* Footer */}
        <motion.p
          className="mt-8 text-center text-sm text-navy-500 dark:text-navy-400"
          variants={childVariant}
        >
          Don&apos;t have an account?{' '}
          <Link
            to="/register"
            className="font-semibold text-solar-500 hover:text-solar-600 dark:hover:text-solar-400 transition-colors"
          >
            Create one
          </Link>
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
