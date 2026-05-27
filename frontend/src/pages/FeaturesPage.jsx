import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiOutlineBuildingOffice,
  HiOutlineDocumentText,
  HiOutlineCalculator,
  HiOutlineChartBar,
  HiOutlineCpuChip,
  HiOutlineBanknotes,
  HiOutlineArrowRight,
  HiOutlineBolt,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineSparkles,
  HiOutlineSun,
} from 'react-icons/hi2';
import { FEATURES } from '../utils/constants';

/* ─── Icon resolver ─── */
const iconMap = {
  HiOutlineBuildingOffice: HiOutlineBuildingOffice,
  HiOutlineDocumentText: HiOutlineDocumentText,
  HiOutlineCalculator: HiOutlineCalculator,
  HiOutlineChartBar: HiOutlineChartBar,
  HiOutlineCpuChip: HiOutlineCpuChip,
  HiOutlineBankNotes: HiOutlineBanknotes,
  HiOutlineBanknotes: HiOutlineBanknotes,
};

const getIcon = (name) => iconMap[name] || HiOutlineBolt;

/* ─── Animation variants ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
};

/* ─── Extended feature data for showcases ─── */
const showcaseFeatures = [
  {
    ...FEATURES[0],
    detail:
      'Our advanced AI uses satellite imagery and deep learning models to analyze your rooftop in seconds. It detects roof orientation, available area, shadow patterns from nearby structures and trees, and recommends the optimal panel layout for maximum energy harvest.',
    mockType: 'rooftop',
  },
  {
    ...FEATURES[1],
    detail:
      'Upload any electricity bill — our OCR engine extracts tariff data, usage patterns, and seasonal variations automatically. The AI then builds a comprehensive consumption profile and projects your monthly savings with solar.',
    mockType: 'bill',
  },
  {
    ...FEATURES[2],
    detail:
      'Our interactive calculator factors in your location, roof size, local tariffs, and government subsidies to deliver precise cost estimates, ROI calculations, and payback timelines — customized specifically for your situation.',
    mockType: 'calculator',
  },
  {
    ...FEATURES[3],
    detail:
      'Track your solar system\'s real-time performance with a beautiful analytics dashboard. Monitor energy generation, consumption patterns, grid export data, and use predictive analytics to forecast future output based on weather patterns.',
    mockType: 'analytics',
  },
];

/* ─── Comparison table data ─── */
const comparisons = [
  { feature: 'AI-Powered Analysis', solar: true, traditional: false },
  { feature: 'Real-time Monitoring', solar: true, traditional: false },
  { feature: 'Subsidy Assistance', solar: true, traditional: false },
  { feature: 'Instant ROI Calculation', solar: true, traditional: false },
  { feature: 'Satellite Roof Analysis', solar: true, traditional: false },
  { feature: 'AI Chatbot Support', solar: true, traditional: false },
  { feature: 'Setup Cost', solar: 'Free', traditional: '₹5,000+' },
  { feature: 'Report Generation', solar: 'Instant', traditional: '2-3 Weeks' },
  { feature: 'Accuracy', solar: '95%+', traditional: '~70%' },
];

/* ═══════════════════════════════════════
   MOCK UI PREVIEWS
   ═══════════════════════════════════════ */
function MockRooftop() {
  return (
    <div className="glass p-5 space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-3 h-3 rounded-full bg-red-400" />
        <div className="w-3 h-3 rounded-full bg-yellow-400" />
        <div className="w-3 h-3 rounded-full bg-green-400" />
        <span className="text-xs text-navy-400 ml-2 font-mono">rooftop-analysis.ai</span>
      </div>
      <div className="bg-navy-100/60 dark:bg-navy-700/40 rounded-xl p-4 relative overflow-hidden">
        {/* Roof shape mockup */}
        <div className="grid grid-cols-4 gap-1.5">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              className={`h-8 rounded ${i < 8 ? 'bg-solar-500/60' : 'bg-navy-300/30 dark:bg-navy-600/30'}`}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * i }}
            />
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs font-mono text-green-500">✓ 8 panels optimal</span>
          <span className="text-xs font-mono text-solar-500">92% efficiency</span>
        </div>
      </div>
      <div className="flex gap-2">
        <div className="flex-1 bg-green-500/10 rounded-lg p-2 text-center">
          <p className="text-xs text-navy-500 dark:text-navy-400">Area</p>
          <p className="font-mono text-sm font-bold text-navy-800 dark:text-navy-100">450 sq.ft</p>
        </div>
        <div className="flex-1 bg-solar-500/10 rounded-lg p-2 text-center">
          <p className="text-xs text-navy-500 dark:text-navy-400">Capacity</p>
          <p className="font-mono text-sm font-bold text-navy-800 dark:text-navy-100">3.2 kW</p>
        </div>
        <div className="flex-1 bg-blue-500/10 rounded-lg p-2 text-center">
          <p className="text-xs text-navy-500 dark:text-navy-400">Shade</p>
          <p className="font-mono text-sm font-bold text-navy-800 dark:text-navy-100">Low</p>
        </div>
      </div>
    </div>
  );
}

function MockBill() {
  return (
    <div className="glass p-5 space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-3 h-3 rounded-full bg-red-400" />
        <div className="w-3 h-3 rounded-full bg-yellow-400" />
        <div className="w-3 h-3 rounded-full bg-green-400" />
        <span className="text-xs text-navy-400 ml-2 font-mono">bill-analyzer.ai</span>
      </div>
      <div className="bg-navy-100/60 dark:bg-navy-700/40 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-navy-600 dark:text-navy-300">Monthly Usage</span>
          <span className="text-xs font-mono text-solar-500">Auto-detected</span>
        </div>
        {/* Bar chart mockup */}
        <div className="flex items-end gap-1.5 h-20 mb-3">
          {[60, 75, 45, 80, 55, 90, 70, 85, 50, 65, 78, 88].map((h, i) => (
            <motion.div
              key={i}
              className="flex-1 rounded-t bg-gradient-to-t from-solar-500 to-solar-400 opacity-80"
              initial={{ height: 0 }}
              whileInView={{ height: `${h}%` }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 * i, duration: 0.5 }}
            />
          ))}
        </div>
        <div className="text-[10px] text-navy-400 flex justify-between">
          <span>Jan</span><span>Jun</span><span>Dec</span>
        </div>
      </div>
      <div className="flex gap-2">
        <div className="flex-1 bg-red-500/10 rounded-lg p-2 text-center">
          <p className="text-xs text-navy-500 dark:text-navy-400">Current</p>
          <p className="font-mono text-sm font-bold text-red-500">₹3,800</p>
        </div>
        <div className="flex-1 bg-green-500/10 rounded-lg p-2 text-center">
          <p className="text-xs text-navy-500 dark:text-navy-400">With Solar</p>
          <p className="font-mono text-sm font-bold text-green-500">₹400</p>
        </div>
      </div>
    </div>
  );
}

function MockCalculator() {
  return (
    <div className="glass p-5 space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-3 h-3 rounded-full bg-red-400" />
        <div className="w-3 h-3 rounded-full bg-yellow-400" />
        <div className="w-3 h-3 rounded-full bg-green-400" />
        <span className="text-xs text-navy-400 ml-2 font-mono">solar-calculator.ai</span>
      </div>
      <div className="space-y-3">
        <div>
          <label className="text-xs text-navy-500 dark:text-navy-400 mb-1 block">Roof Area (sq.ft)</label>
          <div className="h-9 rounded-lg bg-navy-100/80 dark:bg-navy-700/50 border border-navy-200 dark:border-navy-600 flex items-center px-3">
            <span className="text-sm font-mono text-navy-700 dark:text-navy-200">500</span>
          </div>
        </div>
        <div>
          <label className="text-xs text-navy-500 dark:text-navy-400 mb-1 block">Monthly Bill (₹)</label>
          <div className="h-9 rounded-lg bg-navy-100/80 dark:bg-navy-700/50 border border-navy-200 dark:border-navy-600 flex items-center px-3">
            <span className="text-sm font-mono text-navy-700 dark:text-navy-200">4,200</span>
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-r from-solar-500/10 to-green-500/10 rounded-xl p-4 space-y-2">
        <div className="flex justify-between">
          <span className="text-xs text-navy-500 dark:text-navy-400">System Size</span>
          <span className="text-xs font-mono font-bold text-navy-800 dark:text-navy-100">4.0 kW</span>
        </div>
        <div className="flex justify-between">
          <span className="text-xs text-navy-500 dark:text-navy-400">Total Cost</span>
          <span className="text-xs font-mono font-bold text-navy-800 dark:text-navy-100">₹2,40,000</span>
        </div>
        <div className="flex justify-between">
          <span className="text-xs text-navy-500 dark:text-navy-400">Subsidy</span>
          <span className="text-xs font-mono font-bold text-green-500">-₹78,000</span>
        </div>
        <div className="border-t border-navy-200/30 dark:border-navy-700/40 pt-2 flex justify-between">
          <span className="text-xs font-semibold text-navy-600 dark:text-navy-300">Payback</span>
          <span className="text-xs font-mono font-bold text-solar-500">3.2 years</span>
        </div>
      </div>
    </div>
  );
}

function MockAnalytics() {
  return (
    <div className="glass p-5 space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-3 h-3 rounded-full bg-red-400" />
        <div className="w-3 h-3 rounded-full bg-yellow-400" />
        <div className="w-3 h-3 rounded-full bg-green-400" />
        <span className="text-xs text-navy-400 ml-2 font-mono">energy-dashboard.ai</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-solar-500/10 rounded-lg p-3 text-center">
          <p className="text-[10px] text-navy-500 dark:text-navy-400">Generated</p>
          <p className="font-mono text-lg font-bold text-solar-500">14.2</p>
          <p className="text-[10px] text-navy-400">kWh today</p>
        </div>
        <div className="bg-green-500/10 rounded-lg p-3 text-center">
          <p className="text-[10px] text-navy-500 dark:text-navy-400">Saved</p>
          <p className="font-mono text-lg font-bold text-green-500">₹142</p>
          <p className="text-[10px] text-navy-400">today</p>
        </div>
      </div>
      <div className="bg-navy-100/60 dark:bg-navy-700/40 rounded-xl p-3">
        {/* Line chart mockup */}
        <svg viewBox="0 0 200 60" className="w-full h-16" fill="none">
          <motion.path
            d="M0 45 Q25 40 40 30 T80 20 T120 25 T160 15 T200 10"
            stroke="#F59E0B"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5 }}
          />
          <motion.path
            d="M0 50 Q25 48 40 42 T80 38 T120 35 T160 32 T200 28"
            stroke="#3B82F6"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: 0.3 }}
          />
        </svg>
        <div className="flex items-center gap-4 mt-1">
          <span className="flex items-center gap-1 text-[10px] text-navy-400">
            <span className="w-3 h-0.5 bg-solar-500 rounded" /> Generation
          </span>
          <span className="flex items-center gap-1 text-[10px] text-navy-400">
            <span className="w-3 h-0.5 bg-blue-500 rounded border-dashed" /> Predicted
          </span>
        </div>
      </div>
    </div>
  );
}

const mockComponents = {
  rooftop: MockRooftop,
  bill: MockBill,
  calculator: MockCalculator,
  analytics: MockAnalytics,
};

/* ════════════════════════════════════════
   HERO
   ════════════════════════════════════════ */
function FeaturesHero() {
  return (
    <section className="relative overflow-hidden bg-hero-light dark:bg-hero pt-32 pb-20 md:pt-40 md:pb-28">
      <div className="absolute top-20 left-1/3 w-72 h-72 rounded-full bg-solar-500/10 dark:bg-solar-500/5 blur-3xl" />
      <div className="absolute bottom-10 right-1/4 w-64 h-64 rounded-full bg-blue-500/8 dark:bg-blue-500/5 blur-3xl" />

      <div className="page-container relative z-10 text-center">
        <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
          <motion.span
            variants={fadeUp}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-solar-500/10 text-solar-600 dark:text-solar-400 border border-solar-500/20 mb-6"
          >
            <HiOutlineSparkles className="text-solar-500" />
            Platform Features
          </motion.span>

          <motion.h1
            variants={fadeUp}
            custom={1}
            className="font-display text-4xl md:text-6xl font-bold mb-6"
          >
            <span className="text-navy-900 dark:text-white">Powerful Features for </span>
            <span className="text-solar-gradient">Solar Excellence</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            custom={2}
            className="text-lg md:text-xl text-navy-600 dark:text-navy-300 max-w-3xl mx-auto leading-relaxed"
          >
            Everything you need to analyze, plan, install, and monitor your solar energy system — powered by state-of-the-art artificial intelligence.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════
   FEATURE SHOWCASES (alternating)
   ════════════════════════════════════════ */
function FeatureShowcases() {
  return (
    <section className="section-spacing">
      <div className="page-container space-y-24 md:space-y-32">
        {showcaseFeatures.map((feature, i) => {
          const isReversed = i % 2 !== 0;
          const IconComp = getIcon(feature.icon);
          const MockComp = mockComponents[feature.mockType];

          return (
            <motion.div
              key={i}
              className={`grid lg:grid-cols-2 gap-10 lg:gap-16 items-center ${isReversed ? 'lg:direction-rtl' : ''}`}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={staggerContainer}
            >
              {/* Text side */}
              <motion.div
                variants={fadeUp}
                className={`${isReversed ? 'lg:order-2' : 'lg:order-1'}`}
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-solar-400/20 to-solar-600/20 flex items-center justify-center mb-6">
                  <IconComp className="text-2xl text-solar-500" />
                </div>
                <h3 className="font-display text-2xl md:text-3xl font-bold text-navy-900 dark:text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-navy-600 dark:text-navy-300 leading-relaxed mb-6 text-lg">
                  {feature.detail}
                </p>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 text-solar-600 dark:text-solar-400 font-semibold hover:gap-3 transition-all"
                >
                  Learn more <HiOutlineArrowRight />
                </Link>
              </motion.div>

              {/* Mock UI side */}
              <motion.div
                variants={fadeUp}
                custom={1}
                className={`${isReversed ? 'lg:order-1' : 'lg:order-2'}`}
              >
                <MockComp />
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════
   FULL FEATURES GRID
   ════════════════════════════════════════ */
function FullFeaturesGrid() {
  return (
    <section className="section-spacing bg-navy-50/50 dark:bg-navy-900/40">
      <div className="page-container">
        <motion.div
          className="text-center mb-14"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
            <span className="text-navy-900 dark:text-white">All </span>
            <span className="text-solar-gradient">Features</span>
          </h2>
          <p className="text-navy-500 dark:text-navy-400 text-lg max-w-xl mx-auto">
            A comprehensive toolkit for your complete solar journey
          </p>
        </motion.div>

        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {FEATURES.map((feature, i) => {
            const IconComp = getIcon(feature.icon);
            return (
              <motion.div
                key={i}
                variants={fadeUp}
                custom={i}
                className="glass p-6 md:p-8 group hover:shadow-card-hover dark:hover:shadow-solar-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-solar-400/20 to-solar-600/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <IconComp className="text-2xl text-solar-500" />
                </div>
                <h3 className="font-display text-xl font-semibold text-navy-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-navy-500 dark:text-navy-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════
   COMPARISON TABLE
   ════════════════════════════════════════ */
function ComparisonTable() {
  return (
    <section className="section-spacing">
      <div className="page-container">
        <motion.div
          className="text-center mb-14"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
            <span className="text-solar-gradient">Solar Bharat</span>
            <span className="text-navy-900 dark:text-white"> vs Traditional</span>
          </h2>
          <p className="text-navy-500 dark:text-navy-400 text-lg max-w-xl mx-auto">
            See how our AI-powered platform compares to traditional solar consultation
          </p>
        </motion.div>

        <motion.div
          className="glass overflow-hidden max-w-3xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-navy-200/30 dark:border-navy-700/40">
                  <th className="text-left py-4 px-6 text-sm font-semibold text-navy-600 dark:text-navy-300">
                    Feature
                  </th>
                  <th className="text-center py-4 px-6">
                    <div className="inline-flex items-center gap-2 text-sm font-bold text-solar-600 dark:text-solar-400">
                      <HiOutlineSun className="text-lg" />
                      Solar Bharat
                    </div>
                  </th>
                  <th className="text-center py-4 px-6 text-sm font-semibold text-navy-500 dark:text-navy-400">
                    Traditional
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map((row, i) => (
                  <motion.tr
                    key={i}
                    className="border-b border-navy-100/50 dark:border-navy-700/30 last:border-0 hover:bg-solar-500/5 transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <td className="py-4 px-6 text-sm text-navy-700 dark:text-navy-200 font-medium">
                      {row.feature}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {typeof row.solar === 'boolean' ? (
                        <HiOutlineCheckCircle className="text-xl text-green-500 mx-auto" />
                      ) : (
                        <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                          {row.solar}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {typeof row.traditional === 'boolean' ? (
                        <HiOutlineXCircle className="text-xl text-red-400 mx-auto" />
                      ) : (
                        <span className="text-sm text-navy-500 dark:text-navy-400">
                          {row.traditional}
                        </span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════
   CTA
   ════════════════════════════════════════ */
function FeaturesCTA() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      <div className="absolute inset-0 bg-gradient-to-br from-solar-500 via-solar-600 to-solar-700" />

      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white/10"
          style={{
            width: 10 + Math.random() * 25,
            height: 10 + Math.random() * 25,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{ y: [0, -30, 0], opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 4 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2 }}
        />
      ))}

      <div className="page-container relative z-10 text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
          <motion.h2 variants={fadeUp} className="font-display text-3xl md:text-5xl font-bold text-white mb-4">
            Experience the Difference
          </motion.h2>
          <motion.p variants={fadeUp} custom={1} className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8">
            See for yourself why thousands of Indian homeowners trust Solar Bharat for their solar journey.
          </motion.p>
          <motion.div variants={fadeUp} custom={2}>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg bg-white text-solar-700 hover:bg-navy-50 shadow-xl hover:shadow-2xl active:scale-[0.98] transition-all duration-200"
            >
              Start Free Analysis
              <HiOutlineArrowRight />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════
   FEATURES PAGE (default export)
   ════════════════════════════════════════ */
export default function FeaturesPage() {
  return (
    <main>
      <FeaturesHero />
      <FeatureShowcases />
      <FullFeaturesGrid />
      <ComparisonTable />
      <FeaturesCTA />
    </main>
  );
}
