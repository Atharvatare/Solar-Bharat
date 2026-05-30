import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiOutlineEye,
  HiOutlineRocketLaunch,
  HiOutlineSun,
  HiOutlineUsers,
  HiOutlineCpuChip,
  HiOutlineGlobeAlt,
  HiOutlineArrowRight,
  HiOutlineBolt,
  HiOutlineAcademicCap,
  HiOutlineHeart,
  HiOutlineSparkles,
} from 'react-icons/hi2';

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

const scaleUp = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5 },
  },
};

/* ─── Data ─── */
const teamMembers = [
  {
    name: 'Atharva Tare',
    role: 'Founder & Developer',
    initials: 'AT',
    bio: 'Final-year Electrical Engineering student passionate about renewable energy and AI. Built Solar Bharat as a solo project to make solar energy accessible to every Indian household using cutting-edge AI technology.',
    gradient: 'from-solar-400 to-orange-500',
    linkedin: 'https://www.linkedin.com/in/atharva-tare-68331028b',
    roles: ['Founder', 'Full-Stack Developer', 'AI Engineer'],
  },
];

const milestones = [
  {
    year: '2026',
    quarter: 'Q1',
    title: 'Solar Bharat Conceived',
    description: 'Atharva Tare envisioned a platform that combines AI with solar energy to help Indian households go green effortlessly.',
    icon: HiOutlineRocketLaunch,
  },
  {
    year: '2026',
    quarter: 'Q2',
    title: 'Platform Built & Launched',
    description: 'Full-stack platform deployed with React, Node.js, MongoDB, and Vercel. Features include AI bill analysis, rooftop detection, and solar calculator.',
    icon: HiOutlineCpuChip,
  },
  {
    year: '2026',
    quarter: 'Q2',
    title: 'AI Engine Integrated',
    description: 'Google Gemini Vision API integrated for intelligent electricity bill OCR and AI-powered rooftop analysis with shadow detection.',
    icon: HiOutlineSparkles,
  },
  {
    year: '2026',
    quarter: 'Q3',
    title: 'Going Live',
    description: 'Solar Bharat goes live with interactive maps, real-time weather data, analytics dashboards, and AI recommendations for every user.',
    icon: HiOutlineGlobeAlt,
  },
];

const partners = [
  'NTPC Solar',
  'Tata Power',
  'Adani Green',
  'SECI India',
  'ReNew Power',
  'Vikram Solar',
];

/* ════════════════════════════════════════
   HERO
   ════════════════════════════════════════ */
function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-hero-light dark:bg-hero pt-32 pb-20 md:pt-40 md:pb-28">
      {/* Ambient decoration */}
      <div className="absolute top-20 right-1/4 w-72 h-72 rounded-full bg-solar-500/10 dark:bg-solar-500/5 blur-3xl" />
      <div className="absolute bottom-10 left-1/4 w-64 h-64 rounded-full bg-blue-500/10 dark:bg-blue-500/5 blur-3xl" />

      <div className="page-container relative z-10 text-center">
        <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
          <motion.span
            variants={fadeUp}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-solar-500/10 text-solar-600 dark:text-solar-400 border border-solar-500/20 mb-6"
          >
            <HiOutlineSun className="text-solar-500" />
            Our Story
          </motion.span>

          <motion.h1
            variants={fadeUp}
            custom={1}
            className="font-display text-4xl md:text-6xl font-bold mb-6"
          >
            <span className="text-navy-900 dark:text-white">About </span>
            <span className="text-solar-gradient">Solar Bharat</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            custom={2}
            className="text-lg md:text-xl text-navy-600 dark:text-navy-300 max-w-3xl mx-auto leading-relaxed"
          >
            We&apos;re on a mission to make solar energy accessible, affordable, and intelligent for every Indian household.
            By combining cutting-edge AI with deep domain expertise, we&apos;re transforming how India adopts renewable energy.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════
   VISION & MISSION
   ════════════════════════════════════════ */
function VisionMission() {
  return (
    <section className="section-spacing">
      <div className="page-container">
        <motion.div
          className="grid md:grid-cols-2 gap-6 md:gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={staggerContainer}
        >
          {/* Vision */}
          <motion.div variants={fadeUp} className="glass p-8 md:p-10 group hover:shadow-card-hover dark:hover:shadow-solar-lg transition-all duration-300">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-solar-400/20 to-solar-600/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <HiOutlineEye className="text-2xl text-solar-500" />
            </div>
            <h3 className="font-display text-2xl font-bold text-navy-900 dark:text-white mb-4">Our Vision</h3>
            <p className="text-navy-600 dark:text-navy-300 leading-relaxed">
              A solar-powered India where every rooftop generates clean energy. We envision a future where AI makes solar adoption
              as simple as ordering online — eliminating guesswork, reducing costs, and accelerating India&apos;s transition to
              100% renewable energy by 2040.
            </p>
          </motion.div>

          {/* Mission */}
          <motion.div variants={fadeUp} custom={1} className="glass p-8 md:p-10 group hover:shadow-card-hover dark:hover:shadow-solar-lg transition-all duration-300">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400/20 to-purple-600/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <HiOutlineRocketLaunch className="text-2xl text-blue-500" />
            </div>
            <h3 className="font-display text-2xl font-bold text-navy-900 dark:text-white mb-4">Our Mission</h3>
            <p className="text-navy-600 dark:text-navy-300 leading-relaxed">
              To empower 10 million Indian households with AI-driven solar intelligence. We build tools that analyze rooftops,
              predict energy output, navigate government subsidies, and connect homeowners with trusted installers — making the
              switch to solar effortless and rewarding.
            </p>
          </motion.div>
        </motion.div>

        {/* Core Values Row */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {[
            { icon: HiOutlineSparkles, label: 'Innovation', color: 'text-solar-500' },
            { icon: HiOutlineHeart, label: 'Sustainability', color: 'text-green-500' },
            { icon: HiOutlineAcademicCap, label: 'Transparency', color: 'text-blue-500' },
            { icon: HiOutlineUsers, label: 'Community', color: 'text-purple-500' },
          ].map((value, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              custom={i}
              className="glass p-5 text-center hover:shadow-card-hover dark:hover:shadow-solar-lg transition-all duration-300"
            >
              <value.icon className={`text-2xl ${value.color} mx-auto mb-2`} />
              <span className="text-sm font-semibold text-navy-800 dark:text-navy-100">{value.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════
   TEAM
   ════════════════════════════════════════ */
function TeamSection() {
  const founder = teamMembers[0];
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
            <span className="text-navy-900 dark:text-white">Meet the </span>
            <span className="text-solar-gradient">Builder</span>
          </h2>
          <p className="text-navy-500 dark:text-navy-400 text-lg max-w-xl mx-auto">
            The passionate mind behind India&apos;s AI-powered solar revolution
          </p>
        </motion.div>

        <motion.div
          className="max-w-lg mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <motion.div
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            className="glass overflow-hidden group"
          >
            {/* Gradient top strip */}
            <div className={`h-28 bg-gradient-to-r ${founder.gradient} relative`}>
              <div className="absolute inset-0 bg-black/10" />
            </div>

            <div className="px-8 pb-8 -mt-12 relative text-center">
              {/* Avatar */}
              <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${founder.gradient} flex items-center justify-center text-white font-bold text-2xl shadow-lg ring-4 ring-white dark:ring-navy-800 mx-auto mb-5`}>
                {founder.initials}
              </div>

              <h3 className="font-display text-2xl font-bold text-navy-900 dark:text-white">
                {founder.name}
              </h3>
              <p className="text-sm text-solar-600 dark:text-solar-400 font-semibold mb-3">
                {founder.role}
              </p>

              {/* Role badges */}
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {founder.roles.map((role) => (
                  <span key={role} className="px-3 py-1 rounded-full text-xs font-medium bg-solar-500/10 text-solar-600 dark:text-solar-400 border border-solar-500/20">
                    {role}
                  </span>
                ))}
              </div>

              <p className="text-sm text-navy-500 dark:text-navy-400 leading-relaxed mb-5">
                {founder.bio}
              </p>

              {/* LinkedIn */}
              <a
                href={founder.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0A66C2] text-white text-sm font-semibold hover:bg-[#004182] transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                Connect on LinkedIn
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════
   MILESTONES TIMELINE
   ════════════════════════════════════════ */
function MilestonesTimeline() {
  return (
    <section className="section-spacing">
      <div className="page-container">
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
            <span className="text-navy-900 dark:text-white">Our </span>
            <span className="text-solar-gradient">Journey</span>
          </h2>
          <p className="text-navy-500 dark:text-navy-400 text-lg max-w-xl mx-auto">
            Key milestones in our mission to solarize India
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          {/* Vertical center line */}
          <div className="absolute left-4 md:left-1/2 md:-translate-x-0.5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-solar-400 via-solar-500 to-solar-600 opacity-30" />

          {milestones.map((milestone, i) => {
            const isLeft = i % 2 === 0;
            const Icon = milestone.icon;

            return (
              <motion.div
                key={i}
                className={`relative flex items-start mb-12 last:mb-0 ${
                  isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                } flex-row`}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                variants={fadeUp}
                custom={i}
              >
                {/* Timeline node */}
                <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-br from-solar-400 to-solar-600 flex items-center justify-center z-10 shadow-lg shadow-solar-500/25">
                  <div className="w-3 h-3 rounded-full bg-white" />
                </div>

                {/* Content card */}
                <div className={`ml-14 md:ml-0 md:w-[calc(50%-2rem)] ${isLeft ? 'md:pr-8 md:text-right' : 'md:pl-8 md:text-left'}`}>
                  <div className="glass p-6 hover:shadow-card-hover dark:hover:shadow-solar-lg transition-all duration-300">
                    <div className={`flex items-center gap-3 mb-3 ${isLeft ? 'md:justify-end' : 'md:justify-start'}`}>
                      <div className="w-10 h-10 rounded-xl bg-solar-500/10 flex items-center justify-center shrink-0">
                        <Icon className="text-xl text-solar-500" />
                      </div>
                      <span className="font-mono text-sm font-bold text-solar-600 dark:text-solar-400">
                        {milestone.year} {milestone.quarter}
                      </span>
                    </div>
                    <h3 className="font-display text-lg font-semibold text-navy-900 dark:text-white mb-2">
                      {milestone.title}
                    </h3>
                    <p className="text-sm text-navy-500 dark:text-navy-400 leading-relaxed">
                      {milestone.description}
                    </p>
                  </div>
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
   PARTNERS
   ════════════════════════════════════════ */
function PartnersSection() {
  return (
    <section className="section-spacing bg-navy-50/50 dark:bg-navy-900/40">
      <div className="page-container">
        <motion.div
          className="text-center mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
            <span className="text-navy-900 dark:text-white">Our </span>
            <span className="text-solar-gradient">Partners</span>
          </h2>
          <p className="text-navy-500 dark:text-navy-400 text-lg max-w-xl mx-auto">
            Trusted by India&apos;s leading energy companies
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {partners.map((partner, i) => (
            <motion.div
              key={i}
              variants={scaleUp}
              className="glass p-6 flex items-center justify-center h-24 hover:shadow-card-hover dark:hover:shadow-solar-lg hover:border-solar-500/30 transition-all duration-300 group"
            >
              <span className="font-display font-semibold text-sm md:text-base text-navy-500 dark:text-navy-400 group-hover:text-solar-600 dark:group-hover:text-solar-400 transition-colors text-center">
                {partner}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════
   CTA
   ════════════════════════════════════════ */
function AboutCTA() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      <div className="absolute inset-0 bg-gradient-to-br from-solar-500 via-solar-600 to-solar-700" />

      {/* Floating particles */}
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
            Join the Solar Revolution
          </motion.h2>
          <motion.p variants={fadeUp} custom={1} className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8">
            Be part of India&apos;s largest AI-powered solar community and start saving from day one.
          </motion.p>
          <motion.div variants={fadeUp} custom={2}>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg bg-white text-solar-700 hover:bg-navy-50 shadow-xl hover:shadow-2xl active:scale-[0.98] transition-all duration-200"
            >
              Get Started Today
              <HiOutlineArrowRight />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════
   ABOUT PAGE (default export)
   ════════════════════════════════════════ */
export default function AboutPage() {
  return (
    <main>
      <AboutHero />
      <VisionMission />
      <TeamSection />
      <MilestonesTimeline />
      <PartnersSection />
      <AboutCTA />
    </main>
  );
}
