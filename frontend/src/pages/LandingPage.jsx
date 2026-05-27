import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  HiOutlineArrowRight,
  HiOutlinePlay,
  HiOutlineChevronDown,
  HiOutlineBuildingOffice,
  HiOutlineDocumentText,
  HiOutlineCalculator,
  HiOutlineChartBar,
  HiOutlineCpuChip,
  HiOutlineBanknotes,
  HiOutlineDocumentArrowUp,
  HiOutlineBolt,
  HiOutlineStar,
} from 'react-icons/hi2';
import { FiStar } from 'react-icons/fi';
import {
  APP_DESCRIPTION,
  STATS,
  FEATURES,
  TESTIMONIALS,
} from '../utils/constants';

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

/* ─── Reusable animation variants ─── */
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

/* ─── Animated Counter Hook ─── */
function useCountUp(target, duration = 2000, startOnView = false, isInView = true) {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isInView || hasAnimated.current) return;
    hasAnimated.current = true;

    const numericTarget =
      typeof target === 'string'
        ? parseInt(target.replace(/[^0-9]/g, ''), 10)
        : target;

    if (isNaN(numericTarget)) {
      setCount(0);
      return;
    }

    let start = 0;
    const increment = numericTarget / (duration / 16);
    let raf;

    const step = () => {
      start += increment;
      if (start >= numericTarget) {
        setCount(numericTarget);
        return;
      }
      setCount(Math.floor(start));
      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [isInView, target, duration]);

  return count;
}

/* ─── Stat Item ─── */
function StatItem({ label, value, suffix }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const animatedCount = useCountUp(value, 2000, true, isInView);

  const prefix = value.includes('M') ? '' : '';
  const unit = value.includes('M') ? 'M+' : value.includes('+') ? '+' : '';

  const formatCount = () => {
    if (value.includes('M')) {
      return `${animatedCount.toLocaleString()}M+`;
    }
    return animatedCount.toLocaleString() + (value.includes('+') ? '+' : '');
  };

  return (
    <motion.div
      ref={ref}
      className="flex flex-col items-center px-4 py-3 sm:py-0"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
    >
      <span className="font-mono text-3xl md:text-4xl font-bold text-solar-gradient">
        {formatCount()}
      </span>
      <span className="text-sm md:text-base text-navy-500 dark:text-navy-400 mt-1">
        {suffix ? `${label} (${suffix})` : label}
      </span>
    </motion.div>
  );
}

/* ════════════════════════════════════════
   HERO SECTION
   ════════════════════════════════════════ */
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-hero-light dark:bg-hero">
      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
        style={{
          backgroundImage:
            'radial-gradient(circle, #F59E0B 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Ambient glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-solar-500/10 dark:bg-solar-500/5 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-blue-500/10 dark:bg-blue-500/5 blur-3xl" />

      <div className="page-container relative z-10 w-full py-20 md:py-0">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center min-h-[calc(100vh-80px)]">
          {/* Left — Text Content */}
          <motion.div
            className="flex flex-col gap-6 md:gap-8"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={fadeUp} custom={0}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-solar-500/10 text-solar-600 dark:text-solar-400 border border-solar-500/20">
                <HiOutlineBolt className="text-solar-500" />
                AI-Powered Solar Platform
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              custom={1}
              className="font-display text-5xl md:text-7xl font-bold leading-[1.08] tracking-tight"
            >
              <span className="text-navy-900 dark:text-white">
                Power Your Future with{' '}
              </span>
              <span className="text-solar-gradient">Solar Energy</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              custom={2}
              className="text-lg md:text-xl text-navy-600 dark:text-navy-300 max-w-xl leading-relaxed"
            >
              {APP_DESCRIPTION}
            </motion.p>

            <motion.div variants={fadeUp} custom={3} className="flex flex-wrap gap-4 mt-2">
              <Link to="/register" className="btn-primary inline-flex items-center gap-2 text-lg">
                Get Started Free
                <HiOutlineArrowRight className="text-lg" />
              </Link>
              <button className="btn-outline inline-flex items-center gap-2 text-lg" aria-label="Watch demo video">
                <HiOutlinePlay className="text-lg" />
                Watch Demo
              </button>
            </motion.div>

            <motion.div variants={fadeUp} custom={4} className="flex items-center gap-3 mt-2">
              <div className="flex -space-x-2">
                {['P', 'R', 'A', 'S'].map((initial, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-solar-400 to-solar-600 flex items-center justify-center text-xs font-bold text-white ring-2 ring-white dark:ring-navy-900"
                  >
                    {initial}
                  </div>
                ))}
              </div>
              <span className="text-sm text-navy-500 dark:text-navy-400">
                Join <strong className="text-navy-700 dark:text-navy-200">50,000+</strong> users already saving
              </span>
            </motion.div>
          </motion.div>

          {/* Right — Animated Solar Illustration */}
          <motion.div
            className="relative flex items-center justify-center lg:justify-end"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative w-80 h-80 md:w-[420px] md:h-[420px]">
              {/* Outer orbit ring */}
              <motion.div
                className="absolute inset-0 rounded-full border border-dashed border-solar-500/20 dark:border-solar-500/15"
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              />

              {/* Middle orbit ring */}
              <motion.div
                className="absolute inset-8 md:inset-12 rounded-full border border-dashed border-solar-500/30 dark:border-solar-500/20"
                animate={{ rotate: -360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              />

              {/* Inner orbit ring */}
              <div className="absolute inset-16 md:inset-24 rounded-full border border-solar-500/15 dark:border-solar-500/10" />

              {/* Central sun */}
              <motion.div
                className="absolute inset-0 m-auto w-28 h-28 md:w-36 md:h-36 rounded-full bg-gradient-to-br from-solar-400 via-solar-500 to-solar-600 solar-glow flex items-center justify-center"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <HiOutlineBolt className="text-4xl md:text-5xl text-white" />
              </motion.div>

              {/* Orbiting particles */}
              {[
                { size: 'w-6 h-6 md:w-8 md:h-8', orbitSize: 'inset-0', duration: 12, bg: 'bg-solar-400', startDeg: 0 },
                { size: 'w-5 h-5 md:w-6 md:h-6', orbitSize: 'inset-0', duration: 12, bg: 'bg-blue-400', startDeg: 120 },
                { size: 'w-4 h-4 md:w-5 md:h-5', orbitSize: 'inset-0', duration: 12, bg: 'bg-green-400', startDeg: 240 },
                { size: 'w-5 h-5 md:w-7 md:h-7', orbitSize: 'inset-8 md:inset-12', duration: 8, bg: 'bg-solar-300', startDeg: 60 },
                { size: 'w-4 h-4 md:w-5 md:h-5', orbitSize: 'inset-8 md:inset-12', duration: 8, bg: 'bg-purple-400', startDeg: 200 },
              ].map((particle, i) => (
                <motion.div
                  key={i}
                  className={`absolute ${particle.orbitSize}`}
                  animate={{ rotate: 360 }}
                  transition={{ duration: particle.duration, repeat: Infinity, ease: 'linear', delay: (particle.startDeg / 360) * particle.duration }}
                  style={{ transform: `rotate(${particle.startDeg}deg)` }}
                >
                  <div
                    className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 ${particle.size} ${particle.bg} rounded-full opacity-80 shadow-lg`}
                  />
                </motion.div>
              ))}

              {/* Floating mini panels */}
              <motion.div
                className="absolute -top-4 -right-4 md:top-2 md:right-0 glass p-3 md:p-4 rounded-xl shadow-lg"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <HiOutlineChartBar className="text-green-500 text-sm" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-navy-800 dark:text-navy-100">+23%</p>
                    <p className="text-[10px] text-navy-500 dark:text-navy-400">Efficiency</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="absolute -bottom-4 -left-4 md:bottom-4 md:left-0 glass p-3 md:p-4 rounded-xl shadow-lg"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-solar-500/20 flex items-center justify-center">
                    <HiOutlineBolt className="text-solar-500 text-sm" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-navy-800 dark:text-navy-100">₹4,200</p>
                    <p className="text-[10px] text-navy-500 dark:text-navy-400">Saved/mo</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="text-xs text-navy-400 dark:text-navy-500 uppercase tracking-widest">Scroll</span>
        <HiOutlineChevronDown className="text-xl text-navy-400 dark:text-navy-500" />
      </motion.div>
    </section>
  );
}

/* ════════════════════════════════════════
   STATS BAR
   ════════════════════════════════════════ */
function StatsBar() {
  return (
    <section className="relative -mt-12 z-20">
      <div className="page-container">
        <div className="glass-strong p-6 md:p-8 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x divide-navy-200/30 dark:divide-navy-700/40">
          {STATS.map((stat, i) => (
            <StatItem key={i} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════
   FEATURES GRID
   ════════════════════════════════════════ */
function FeaturesGrid() {
  return (
    <section className="section-spacing">
      <div className="page-container">
        <motion.div
          className="text-center mb-14"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
        >
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
            <span className="text-navy-900 dark:text-white">Everything You Need to </span>
            <span className="text-solar-gradient">Go Solar</span>
          </h2>
          <p className="text-navy-500 dark:text-navy-400 text-lg max-w-2xl mx-auto">
            Our comprehensive platform covers every aspect of your solar journey — from analysis to installation and beyond.
          </p>
        </motion.div>

        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
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
   HOW IT WORKS
   ════════════════════════════════════════ */
const steps = [
  {
    num: '01',
    title: 'Upload Your Bill',
    description:
      'Simply snap a photo or upload your electricity bill. Our system extracts all relevant data automatically.',
    icon: HiOutlineDocumentArrowUp,
  },
  {
    num: '02',
    title: 'AI Analyzes Your Roof',
    description:
      'Our AI engine analyzes your rooftop using satellite imagery, assessing orientation, shading, and optimal panel placement.',
    icon: HiOutlineCpuChip,
  },
  {
    num: '03',
    title: 'Go Solar & Save',
    description:
      'Get a personalised solar plan with accurate savings estimates, financing options, and government subsidy information.',
    icon: HiOutlineBolt,
  },
];

function HowItWorks() {
  return (
    <section className="section-spacing bg-navy-50/50 dark:bg-navy-900/40">
      <div className="page-container">
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
            <span className="text-navy-900 dark:text-white">How It </span>
            <span className="text-solar-gradient">Works</span>
          </h2>
          <p className="text-navy-500 dark:text-navy-400 text-lg max-w-xl mx-auto">
            Three simple steps to start your solar journey
          </p>
        </motion.div>

        <div className="relative grid md:grid-cols-3 gap-10 md:gap-6">
          {/* Connection line (desktop only) */}
          <div className="hidden md:block absolute top-16 left-[16.67%] right-[16.67%] h-0.5">
            <div className="w-full h-full bg-gradient-to-r from-solar-400 via-solar-500 to-solar-600 opacity-30 rounded-full" />
            <motion.div
              className="absolute top-0 h-full bg-gradient-to-r from-solar-400 to-solar-500 rounded-full"
              initial={{ width: '0%' }}
              whileInView={{ width: '100%' }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: 0.5 }}
            />
          </div>

          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={i}
                className="flex flex-col items-center text-center"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
              >
                <div className="relative mb-6">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-solar-400 to-solar-600 flex items-center justify-center shadow-lg shadow-solar-500/25 relative z-10">
                    <Icon className="text-3xl md:text-4xl text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-navy-900 dark:bg-white text-white dark:text-navy-900 flex items-center justify-center text-xs font-bold font-mono z-20">
                    {step.num}
                  </div>
                </div>
                <div className="glass p-6 w-full">
                  <h3 className="font-display text-xl font-semibold text-navy-900 dark:text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-navy-500 dark:text-navy-400 leading-relaxed text-sm">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════
   TESTIMONIALS
   ════════════════════════════════════════ */
function TestimonialsSection() {
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
            <span className="text-navy-900 dark:text-white">What Our </span>
            <span className="text-solar-gradient">Users Say</span>
          </h2>
          <p className="text-navy-500 dark:text-navy-400 text-lg max-w-xl mx-auto">
            Hear from real users who have transformed their energy with Solar Bharat
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {TESTIMONIALS.map((testimonial, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              custom={i}
              className="glass p-8 relative group hover:shadow-card-hover dark:hover:shadow-solar-lg transition-all duration-300"
            >
              {/* Background quote mark */}
              <div className="absolute top-4 right-6 text-7xl font-serif text-solar-500/10 dark:text-solar-500/5 leading-none select-none pointer-events-none">
                &ldquo;
              </div>

              <div className="relative z-10">
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, j) => (
                    <FiStar
                      key={j}
                      className="text-solar-500 fill-solar-500"
                    />
                  ))}
                </div>

                <p className="text-navy-700 dark:text-navy-200 leading-relaxed mb-6 italic">
                  &ldquo;{testimonial.content}&rdquo;
                </p>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-solar-400 to-solar-600 flex items-center justify-center text-white font-bold text-sm">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-navy-900 dark:text-white text-sm">
                      {testimonial.name}
                    </p>
                    <p className="text-xs text-navy-500 dark:text-navy-400">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════
   CTA SECTION
   ════════════════════════════════════════ */
function CTASection() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      {/* Solar gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-solar-500 via-solar-600 to-solar-700" />

      {/* Floating animated particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white/10"
          style={{
            width: 10 + Math.random() * 30,
            height: 10 + Math.random() * 30,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -40, 0],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 4 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
        />
      ))}

      <div className="page-container relative z-10 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.h2
            variants={fadeUp}
            className="font-display text-3xl md:text-5xl font-bold text-white mb-4"
          >
            Ready to Switch to Solar?
          </motion.h2>
          <motion.p
            variants={fadeUp}
            custom={1}
            className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8"
          >
            Join thousands of Indian households saving up to ₹5,000 per month on electricity. Start your free analysis today.
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
   LANDING PAGE (default export)
   ════════════════════════════════════════ */
export default function LandingPage() {
  return (
    <main>
      <HeroSection />
      <StatsBar />
      <FeaturesGrid />
      <HowItWorks />
      <TestimonialsSection />
      <CTASection />
    </main>
  );
}
