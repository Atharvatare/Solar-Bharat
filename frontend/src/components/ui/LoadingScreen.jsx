import { motion } from 'framer-motion';

function SunLogo() {
  return (
    <svg
      viewBox="0 0 120 120"
      className="w-24 h-24 md:w-32 md:h-32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Rays */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = i * 30;
        const rad = (angle * Math.PI) / 180;
        const x1 = 60 + 34 * Math.cos(rad);
        const y1 = 60 + 34 * Math.sin(rad);
        const x2 = 60 + 48 * Math.cos(rad);
        const y2 = 60 + 48 * Math.sin(rad);
        return (
          <motion.line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#F59E0B"
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ opacity: 0.3, pathLength: 0 }}
            animate={{ opacity: [0.3, 1, 0.3], pathLength: 1 }}
            transition={{
              opacity: { repeat: Infinity, duration: 2, delay: i * 0.12 },
              pathLength: { duration: 0.6, delay: i * 0.05 },
            }}
          />
        );
      })}
      {/* Core circle */}
      <motion.circle
        cx="60"
        cy="60"
        r="22"
        fill="url(#sunGrad)"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      />
      <defs>
        <radialGradient id="sunGrad" cx="0.4" cy="0.35" r="0.65">
          <stop offset="0%" stopColor="#FCD34D" />
          <stop offset="100%" stopColor="#F59E0B" />
        </radialGradient>
      </defs>
    </svg>
  );
}

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-navy-950 overflow-hidden">
      {/* Glow rings */}
      <div className="relative flex items-center justify-center">
        <motion.div
          className="absolute w-40 h-40 md:w-56 md:h-56 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(245,158,11,0.18) 0%, transparent 70%)',
          }}
          animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-56 h-56 md:w-72 md:h-72 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)',
          }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut', delay: 0.4 }}
        />

        {/* Sun SVG */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
        >
          <SunLogo />
        </motion.div>
      </div>

      {/* Brand text */}
      <motion.div
        className="mt-8 text-center"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <h1 className="text-2xl md:text-3xl font-display font-bold text-white tracking-tight">
          Solar{' '}
          <span className="text-solar-gradient bg-gradient-to-r from-solar-400 to-solar-500 bg-clip-text text-transparent">
            Bharat
          </span>
        </h1>
        <motion.p
          className="mt-2 text-sm text-navy-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          AI-Powered Renewable Energy
        </motion.p>
      </motion.div>

      {/* Loading bar */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1 bg-navy-900"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-solar-400 via-solar-500 to-solar-600 rounded-full"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 2.2, ease: [0.4, 0, 0.2, 1] }}
        />
      </motion.div>
    </div>
  );
}
