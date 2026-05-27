import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineEnvelope, HiOutlineLockClosed } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { isValidEmail } from '../utils/helpers';

/* ── animation variants ─────────────────────────────────── */

const containerVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: -24,
    transition: { duration: 0.3 },
  },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

const childVariant = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

/* ── animated checkmark SVG ─────────────────────────────── */

function AnimatedCheckmark() {
  return (
    <div className="relative mx-auto w-20 h-20">
      {/* glow ring */}
      <motion.div
        className="absolute inset-0 rounded-full bg-green-500/20"
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.3, 1] }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      />

      <svg viewBox="0 0 80 80" className="w-20 h-20 relative z-10">
        {/* circle */}
        <motion.circle
          cx="40"
          cy="40"
          r="36"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          className="text-green-500"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
        {/* check */}
        <motion.path
          d="M24 42 L34 52 L56 30"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          className="text-green-500"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.4, delay: 0.5, ease: 'easeOut' }}
        />
      </svg>
    </div>
  );
}

/* ── main component ─────────────────────────────────────── */

export default function ForgotPasswordPage() {
  const [stage, setStage] = useState('request'); // 'request' | 'sent'
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setLoading(false);
    toast.success('Reset link sent!');
    setStage('sent');
  };

  const handleResend = async () => {
    toast.loading('Re-sending…', { id: 'resend' });
    await new Promise((resolve) => setTimeout(resolve, 1200));
    toast.success('Reset link re-sent!', { id: 'resend' });
  };

  return (
    <div className="w-full flex items-center justify-center px-4 py-8 min-h-[calc(100vh-4rem)]">
      <AnimatePresence mode="wait">
        {stage === 'request' ? (
          /* ── REQUEST STATE ─────────────────────────────── */
          <motion.div
            key="request"
            className="glass-strong w-full max-w-md p-8 shadow-glass-light dark:shadow-glass"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              className="flex flex-col items-center"
              variants={stagger}
              initial="hidden"
              animate="visible"
            >
              {/* Icon */}
              <motion.div
                className="w-16 h-16 rounded-full bg-gradient-to-br from-solar-400 to-solar-600 solar-glow flex items-center justify-center mb-6"
                variants={childVariant}
              >
                <HiOutlineLockClosed className="w-7 h-7 text-white" />
              </motion.div>

              {/* Title */}
              <motion.h1
                className="font-display text-3xl font-bold text-navy-900 dark:text-white text-center"
                variants={childVariant}
              >
                Forgot Password?
              </motion.h1>
              <motion.p
                className="mt-2 text-navy-500 dark:text-navy-400 text-center max-w-xs"
                variants={childVariant}
              >
                No worries, we&apos;ll send you reset instructions
              </motion.p>

              {/* Form */}
              <motion.form
                onSubmit={handleSubmit}
                className="w-full mt-8 space-y-5"
                noValidate
                variants={childVariant}
              >
                <div>
                  <label htmlFor="reset-email" className="sr-only">
                    Email address
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-400 dark:text-navy-500 pointer-events-none">
                      <HiOutlineEnvelope className="w-5 h-5" />
                    </span>
                    <input
                      id="reset-email"
                      type="email"
                      placeholder="Email address"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError('');
                      }}
                      aria-invalid={!!error}
                      aria-describedby={error ? 'reset-email-error' : undefined}
                      className={`input-solar pl-12 ${
                        error
                          ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500'
                          : ''
                      }`}
                    />
                  </div>
                  {error && (
                    <p
                      id="reset-email-error"
                      className="mt-1.5 text-sm text-red-500"
                    >
                      {error}
                    </p>
                  )}
                </div>

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
                      Sending…
                    </>
                  ) : (
                    'Send Reset Link'
                  )}
                </motion.button>
              </motion.form>

              {/* Back to login */}
              <motion.div className="mt-6" variants={childVariant}>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-solar-500 hover:text-solar-600 dark:hover:text-solar-400 transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                    />
                  </svg>
                  Back to Login
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        ) : (
          /* ── SENT STATE ────────────────────────────────── */
          <motion.div
            key="sent"
            className="glass-strong w-full max-w-md p-8 shadow-glass-light dark:shadow-glass"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              className="flex flex-col items-center"
              variants={stagger}
              initial="hidden"
              animate="visible"
            >
              {/* Animated Checkmark */}
              <motion.div variants={childVariant} className="mb-6">
                <AnimatedCheckmark />
              </motion.div>

              {/* Title */}
              <motion.h1
                className="font-display text-3xl font-bold text-navy-900 dark:text-white text-center"
                variants={childVariant}
              >
                Check Your Email
              </motion.h1>
              <motion.p
                className="mt-3 text-navy-500 dark:text-navy-400 text-center max-w-xs leading-relaxed"
                variants={childVariant}
              >
                We sent a password reset link to{' '}
                <span className="font-semibold text-navy-700 dark:text-navy-200">
                  {email}
                </span>
              </motion.p>

              {/* Resend */}
              <motion.p
                className="mt-6 text-sm text-navy-500 dark:text-navy-400 text-center"
                variants={childVariant}
              >
                Didn&apos;t receive the email?{' '}
                <button
                  type="button"
                  onClick={handleResend}
                  className="font-semibold text-solar-500 hover:text-solar-600 dark:hover:text-solar-400 transition-colors underline underline-offset-2"
                >
                  Click to resend
                </button>
              </motion.p>

              {/* Back to Login */}
              <motion.div className="mt-8 w-full" variants={childVariant}>
                <motion.div
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.985 }}
                >
                  <Link
                    to="/login"
                    className="btn-primary w-full flex items-center justify-center"
                  >
                    Back to Login
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
