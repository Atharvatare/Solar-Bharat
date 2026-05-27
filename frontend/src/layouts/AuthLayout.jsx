import { Link, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineArrowLeft } from 'react-icons/hi2';
import ThemeToggle from '../components/ui/ThemeToggle';
import { useMediaQuery } from '../hooks/useMediaQuery';

/* ─── Sun Logo SVG ─── */
function SunLogo({ className = 'w-8 h-8' }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <circle cx="24" cy="24" r="10" className="fill-solar-500" />
      <g className="stroke-solar-400" strokeWidth="2.5" strokeLinecap="round">
        <line x1="24" y1="2" x2="24" y2="9" />
        <line x1="24" y1="39" x2="24" y2="46" />
        <line x1="2" y1="24" x2="9" y2="24" />
        <line x1="39" y1="24" x2="46" y2="24" />
        <line x1="8.4" y1="8.4" x2="13.3" y2="13.3" />
        <line x1="34.7" y1="34.7" x2="39.6" y2="39.6" />
        <line x1="8.4" y1="39.6" x2="13.3" y2="34.7" />
        <line x1="34.7" y1="13.3" x2="39.6" y2="8.4" />
      </g>
    </svg>
  );
}

/* ─── Floating Particle Dot ─── */
function ParticleDot({ size, x, y, delay, duration }) {
  return (
    <motion.div
      className="absolute rounded-full bg-solar-400/20"
      style={{ width: size, height: size, left: `${x}%`, top: `${y}%` }}
      animate={{
        y: [0, -30, 0],
        x: [0, 15, 0],
        opacity: [0.2, 0.6, 0.2],
        scale: [1, 1.3, 1],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}

/* ─── Floating Solar Element ─── */
function FloatingSolarElement({ children, delay = 0, x = 0, y = 0 }) {
  return (
    <motion.div
      className="absolute"
      style={{ left: `${x}%`, top: `${y}%` }}
      animate={{
        y: [0, -20, 0],
        rotate: [0, 5, -5, 0],
      }}
      transition={{
        duration: 6,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Decorative Left Panel ─── */
function DecorativePanel() {
  const particles = [
    { size: 6, x: 15, y: 20, delay: 0, duration: 5 },
    { size: 4, x: 75, y: 15, delay: 1.2, duration: 6 },
    { size: 8, x: 60, y: 70, delay: 0.5, duration: 7 },
    { size: 5, x: 25, y: 80, delay: 2, duration: 5.5 },
    { size: 3, x: 80, y: 45, delay: 1.5, duration: 6.5 },
    { size: 7, x: 40, y: 35, delay: 0.8, duration: 5.8 },
    { size: 4, x: 10, y: 55, delay: 2.5, duration: 6.2 },
    { size: 5, x: 90, y: 85, delay: 1, duration: 7.2 },
    { size: 6, x: 50, y: 10, delay: 1.8, duration: 5.2 },
    { size: 3, x: 70, y: 60, delay: 0.3, duration: 6.8 },
    { size: 4, x: 35, y: 90, delay: 2.2, duration: 5.6 },
    { size: 5, x: 85, y: 30, delay: 0.7, duration: 7.5 },
  ];

  return (
    <div className="relative h-full w-full bg-hero-gradient overflow-hidden flex items-center justify-center">
      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-solar-500/10 via-transparent to-transparent" />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(245,158,11,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(245,158,11,0.5) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Floating particles */}
      {particles.map((p, i) => (
        <ParticleDot key={i} {...p} />
      ))}

      {/* Floating solar elements */}
      <FloatingSolarElement delay={0} x={12} y={18}>
        <div className="w-14 h-14 rounded-2xl bg-solar-500/10 border border-solar-500/20 backdrop-blur-sm" />
      </FloatingSolarElement>
      <FloatingSolarElement delay={1.5} x={78} y={22}>
        <div className="w-10 h-10 rounded-full bg-solar-400/15 border border-solar-400/20" />
      </FloatingSolarElement>
      <FloatingSolarElement delay={3} x={20} y={72}>
        <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/15 rotate-45" />
      </FloatingSolarElement>
      <FloatingSolarElement delay={2} x={72} y={75}>
        <div className="w-12 h-12 rounded-2xl bg-solar-500/8 border border-solar-500/15" />
      </FloatingSolarElement>
      <FloatingSolarElement delay={4} x={85} y={50}>
        <div className="w-6 h-6 rounded-full bg-solar-300/20 border border-solar-300/25" />
      </FloatingSolarElement>

      {/* Large glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-solar-500/5 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-blue-500/5 blur-3xl" />

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center text-center px-12 max-w-lg">
        {/* Animated logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
            className="mb-8"
          >
            <SunLogo className="w-20 h-20" />
          </motion.div>
        </motion.div>

        {/* Brand */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="font-display font-bold text-4xl mb-4"
        >
          <span className="text-solar-400">Solar</span>{' '}
          <span className="text-white">Bharat</span>
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-navy-300 text-lg leading-relaxed mb-6 font-light"
        >
          Power your future with{' '}
          <span className="text-solar-400 font-medium">AI-driven</span> solar intelligence
        </motion.p>

        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="w-20 h-0.5 rounded-full bg-gradient-to-r from-solar-500/0 via-solar-500 to-solar-500/0"
        />

        {/* Stats tease */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mt-10 flex items-center gap-8"
        >
          {[
            { value: '50K+', label: 'Users' },
            { value: '12M+', label: 'kWh' },
            { value: '8.5K', label: 'CO₂ tons' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-mono text-xl font-bold text-solar-400">{stat.value}</p>
              <p className="text-navy-400 text-xs mt-0.5">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

/* ─── Auth Layout ─── */
function AuthLayout() {
  const isMobile = useMediaQuery('(max-width: 1024px)');

  return (
    <div className="min-h-screen flex">
      {/* Left decorative panel — hidden on mobile */}
      {!isMobile && (
        <motion.div
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="hidden lg:block w-1/2 relative"
        >
          <DecorativePanel />
        </motion.div>
      )}

      {/* Right form panel */}
      <div
        className={`relative flex-1 flex flex-col min-h-screen
          ${isMobile
            ? 'bg-hero-gradient'
            : 'bg-navy-50 dark:bg-navy-950'
          }`}
      >
        {/* Mobile gradient overlay with particles */}
        {isMobile && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-gradient-radial from-solar-500/10 via-transparent to-transparent" />
            {[
              { size: 5, x: 10, y: 15, delay: 0, duration: 6 },
              { size: 4, x: 80, y: 20, delay: 1, duration: 5 },
              { size: 6, x: 30, y: 80, delay: 2, duration: 7 },
              { size: 3, x: 70, y: 70, delay: 0.5, duration: 6.5 },
              { size: 5, x: 50, y: 40, delay: 1.5, duration: 5.5 },
            ].map((p, i) => (
              <ParticleDot key={i} {...p} />
            ))}
          </div>
        )}

        {/* Top bar: home link (left) + theme toggle (right) */}
        <div className="relative z-10 flex items-center justify-between px-4 sm:px-6 pt-4 sm:pt-6">
          <motion.div
            initial={{ x: -12, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Link
              to="/"
              className={`flex items-center gap-2 text-sm font-medium transition-colors duration-200 group
                ${isMobile
                  ? 'text-navy-300 hover:text-solar-400'
                  : 'text-navy-500 dark:text-navy-400 hover:text-solar-500'
                }`}
            >
              <HiOutlineArrowLeft className="text-lg group-hover:-translate-x-0.5 transition-transform" />
              Back to Home
            </Link>
          </motion.div>

          <motion.div
            initial={{ x: 12, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <ThemeToggle size="sm" />
          </motion.div>
        </div>

        {/* Form content — centered */}
        <div className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 py-8">
          {isMobile ? (
            /* Mobile: glass card wrapper */
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="w-full max-w-md glass-strong p-6 sm:p-8 shadow-2xl"
            >
              {/* Mobile logo */}
              <div className="flex flex-col items-center mb-6">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
                >
                  <SunLogo className="w-12 h-12 mb-3" />
                </motion.div>
                <span className="font-display font-bold text-xl">
                  <span className="text-solar-500">Solar</span>{' '}
                  <span className="text-navy-900 dark:text-white">Bharat</span>
                </span>
              </div>
              <Outlet />
            </motion.div>
          ) : (
            /* Desktop: clean centered content */
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="w-full max-w-md"
            >
              <Outlet />
            </motion.div>
          )}
        </div>

        {/* Bottom decorative line */}
        <div className="relative z-10 flex justify-center pb-6">
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="w-16 h-0.5 rounded-full bg-gradient-to-r from-solar-500/0 via-solar-500/40 to-solar-500/0"
          />
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
