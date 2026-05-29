import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineGlobeAlt } from 'react-icons/hi2';

function AnimatedNumber({ value, duration = 1500 }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;
    const step = value / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= value) {
        setDisplay(value);
        clearInterval(timer);
      } else {
        setDisplay(Math.round(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{display.toLocaleString()}</span>;
}

function CircularProgress({ percentage, size = 140, strokeWidth = 10, color = '#10B981' }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      {/* Background ring */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-navy-200 dark:text-navy-700"
      />
      {/* Progress ring */}
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      />
    </svg>
  );
}

export default function CarbonTracker({
  co2SavedKg = 1704,
  targetKg = 2500,
  className,
}) {
  const percentage = Math.min(Math.round((co2SavedKg / targetKg) * 100), 100);
  const treesEquivalent = Math.round(co2SavedKg / 21);
  const kmSaved = Math.round(co2SavedKg / 0.21); // avg car emits 0.21 kg CO2 per km

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass p-6 rounded-2xl ${className || ''}`}
    >
      <div className="flex items-center gap-2 mb-5">
        <HiOutlineGlobeAlt className="w-5 h-5 text-emerald-500" />
        <h3 className="text-base font-display font-semibold text-navy-900 dark:text-white">
          Carbon Impact
        </h3>
      </div>

      {/* Circular Progress */}
      <div className="flex flex-col items-center mb-5">
        <div className="relative">
          <CircularProgress percentage={percentage} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold font-mono text-navy-900 dark:text-white">
              <AnimatedNumber value={co2SavedKg} />
            </span>
            <span className="text-xs text-navy-500 dark:text-navy-400 font-medium">kg CO₂</span>
          </div>
        </div>
        <p className="text-sm text-navy-500 dark:text-navy-400 mt-3">
          <span className="font-semibold text-emerald-500">{percentage}%</span> of yearly goal ({targetKg.toLocaleString()} kg)
        </p>
      </div>

      {/* Equivalents */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-xl bg-emerald-500/10 text-center">
          <p className="text-2xl mb-1">🌳</p>
          <p className="text-lg font-bold font-mono text-navy-900 dark:text-white">
            <AnimatedNumber value={treesEquivalent} />
          </p>
          <p className="text-xs text-navy-500 dark:text-navy-400">Trees Equivalent</p>
        </div>
        <div className="p-3 rounded-xl bg-blue-500/10 text-center">
          <p className="text-2xl mb-1">🚗</p>
          <p className="text-lg font-bold font-mono text-navy-900 dark:text-white">
            <AnimatedNumber value={kmSaved} />
          </p>
          <p className="text-xs text-navy-500 dark:text-navy-400">km Driving Saved</p>
        </div>
      </div>
    </motion.div>
  );
}
