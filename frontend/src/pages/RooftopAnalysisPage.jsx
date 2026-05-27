import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineMapPin,
  HiOutlineGlobeAlt,
  HiOutlineSun,
  HiOutlineBolt,
  HiOutlineClock,
  HiOutlineSquare3Stack3D,
  HiOutlineCheckCircle,
  HiOutlineArrowPath,
} from 'react-icons/hi2';

const analysisSteps = [
  'Locating address...',
  'Fetching satellite imagery...',
  'Analyzing roof structure...',
  'Calculating solar potential...',
];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function RooftopAnalysisPage() {
  const [address, setAddress] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const handleAnalyze = () => {
    if (!address.trim()) return;
    setAnalyzing(true);
    setProgress(0);
    setCurrentStep(0);
    setShowResults(false);
  };

  useEffect(() => {
    if (!analyzing) return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setAnalyzing(false);
          setShowResults(true);
          return 100;
        }
        const next = prev + 1.5;
        setCurrentStep(Math.min(Math.floor(next / 25), 3));
        return next;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [analyzing]);

  const resultCards = [
    { label: 'Usable Area', value: '420 sq ft', sub: 'of 500 total', icon: HiOutlineSquare3Stack3D, color: 'text-solar-500' },
    { label: 'Sun Hours', value: '5.8 hrs/day', sub: 'annual average', icon: HiOutlineSun, color: 'text-yellow-500' },
    { label: 'Panel Capacity', value: '14 panels', sub: 'optimal placement', icon: HiOutlineBolt, color: 'text-blue-500' },
    { label: 'Est. Output', value: '7,200 kWh/yr', sub: 'annual generation', icon: HiOutlineClock, color: 'text-emerald-500' },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item}>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-navy-900 dark:text-white">
          AI Rooftop Analysis
        </h1>
        <p className="text-navy-500 dark:text-navy-400 mt-1">Discover your solar potential</p>
      </motion.div>

      {/* Address Input */}
      <motion.div variants={item} className="glass p-6 rounded-2xl">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <HiOutlineMapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-400" />
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
              placeholder="Enter your address or pincode"
              className="input-solar pl-12"
            />
          </div>
          <button onClick={() => setAddress('Andheri West, Mumbai 400053')}
            className="btn-ghost flex items-center gap-2 whitespace-nowrap text-sm">
            <HiOutlineGlobeAlt className="w-5 h-5" /> Use Current Location
          </button>
          <button onClick={handleAnalyze} className="btn-primary whitespace-nowrap"
            disabled={!address.trim() || analyzing}>
            {analyzing ? <HiOutlineArrowPath className="w-5 h-5 animate-spin" /> : 'Analyze Rooftop'}
          </button>
        </div>
      </motion.div>

      {/* Loading State */}
      <AnimatePresence>
        {analyzing && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="glass p-6 rounded-2xl">
            {/* Satellite Scan */}
            <div className="relative w-full h-48 bg-navy-800/50 dark:bg-navy-900/60 rounded-xl overflow-hidden mb-6">
              <div className="absolute inset-0 grid grid-cols-8 grid-rows-4">
                {Array.from({ length: 32 }).map((_, i) => (
                  <div key={i} className="border border-navy-700/20" />
                ))}
              </div>
              <motion.div
                className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-solar-500 to-transparent"
                animate={{ top: ['0%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-sm text-solar-400 font-mono animate-pulse">Scanning satellite imagery...</p>
              </div>
            </div>
            {/* Steps */}
            <div className="space-y-3">
              {analysisSteps.map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  {i <= currentStep ? (
                    <HiOutlineCheckCircle className={`w-5 h-5 flex-shrink-0 ${i < currentStep ? 'text-emerald-500' : 'text-solar-500 animate-pulse'}`} />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-navy-300 dark:border-navy-600 flex-shrink-0" />
                  )}
                  <span className={`text-sm ${i <= currentStep ? 'text-navy-900 dark:text-white font-medium' : 'text-navy-400'}`}>{step}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <AnimatePresence>
        {showResults && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Roof Visualization */}
            <div className="glass p-6 rounded-2xl">
              <h3 className="text-lg font-semibold text-navy-900 dark:text-white mb-4">Roof Visualization</h3>
              <div className="relative w-full h-64 bg-navy-800/40 dark:bg-navy-900/60 rounded-xl overflow-hidden">
                {/* Grid overlay */}
                <div className="absolute inset-0 grid grid-cols-10 grid-rows-6">
                  {Array.from({ length: 60 }).map((_, i) => (
                    <div key={i} className="border border-navy-700/10" />
                  ))}
                </div>
                {/* Roof outline */}
                <div className="absolute top-8 left-1/2 -translate-x-1/2 w-3/4 h-4/5 border-2 border-navy-400/50 rounded-lg">
                  {/* Solar panels */}
                  <div className="grid grid-cols-4 gap-1.5 p-3 h-full">
                    {Array.from({ length: 14 }).map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className="bg-solar-500/25 border border-solar-500/40 rounded-sm"
                      />
                    ))}
                  </div>
                </div>
                {/* Compass */}
                <div className="absolute top-3 right-3 w-10 h-10 rounded-full bg-navy-800/60 border border-navy-600/50 flex items-center justify-center">
                  <span className="text-xs font-bold text-solar-400">N</span>
                </div>
                {/* Label */}
                <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-solar-500/20 border border-solar-500/30">
                  <span className="text-xs font-medium text-solar-400">14 panels · 5.6kW capacity</span>
                </div>
              </div>
            </div>

            {/* Result Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {resultCards.map((card, i) => (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass p-5 rounded-2xl text-center"
                >
                  <card.icon className={`w-8 h-8 ${card.color} mx-auto mb-2`} />
                  <p className="text-xl font-bold font-mono text-navy-900 dark:text-white">{card.value}</p>
                  <p className="text-xs text-navy-500 dark:text-navy-400 mt-1">{card.sub}</p>
                  <p className="text-sm font-medium text-navy-700 dark:text-navy-300 mt-2">{card.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Detailed Analysis */}
            <div className="glass p-6 rounded-2xl space-y-5">
              <h3 className="text-lg font-semibold text-navy-900 dark:text-white">Detailed Analysis</h3>
              {[
                { label: 'Roof Orientation', value: 'South-facing (optimal)', badge: 'Excellent', badgeColor: 'success' },
                { label: 'Shading Analysis', value: 'Minimal shading — 92% exposure', progress: 92 },
                { label: 'Roof Tilt', value: '15° (near optimal 12-15°)', badge: 'Good', badgeColor: 'info' },
                { label: 'Structural Assessment', value: 'Suitable for solar installation', badge: 'Approved', badgeColor: 'success' },
              ].map((d) => (
                <div key={d.label} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-3 border-b border-navy-100 dark:border-navy-800 last:border-0">
                  <div>
                    <p className="text-sm text-navy-500 dark:text-navy-400">{d.label}</p>
                    <p className="font-medium text-navy-900 dark:text-white">{d.value}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {d.progress && (
                      <div className="w-32 h-2 bg-navy-200 dark:bg-navy-700 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-emerald-500 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${d.progress}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                        />
                      </div>
                    )}
                    {d.badge && (
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        d.badgeColor === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'
                      }`}>
                        {d.badge}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Recommendations */}
            <div className="glass p-6 rounded-2xl gradient-border">
              <h3 className="text-lg font-semibold text-navy-900 dark:text-white mb-3">Our Recommendation</h3>
              <div className="grid grid-cols-3 gap-4 mb-4">
                {[
                  { label: 'System Size', value: '5.6 kW' },
                  { label: 'Estimated Cost', value: '₹2.2L' },
                  { label: 'Payback Period', value: '3.8 years' },
                ].map((r) => (
                  <div key={r.label} className="text-center p-3 rounded-xl bg-navy-50 dark:bg-navy-800/50">
                    <p className="text-xs text-navy-500">{r.label}</p>
                    <p className="text-lg font-bold text-navy-900 dark:text-white mt-1">{r.value}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <Link to="/dashboard/calculator" className="btn-primary">Proceed to Calculator</Link>
                <button className="btn-outline">Get Expert Consultation</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
