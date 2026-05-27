import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  HiOutlineEnvelope,
  HiOutlinePhone,
  HiOutlineMapPin,
  HiOutlineClock,
  HiOutlinePaperAirplane,
  HiOutlineSun,
} from 'react-icons/hi2';
import {
  FiTwitter,
  FiLinkedin,
  FiGithub,
  FiInstagram,
  FiYoutube,
} from 'react-icons/fi';

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

/* ─── Contact info data ─── */
const contactInfo = [
  {
    icon: HiOutlineEnvelope,
    title: 'Email Us',
    detail: 'hello@solarbharat.in',
    sub: 'We reply within 24 hours',
    color: 'bg-solar-500/10 text-solar-500',
  },
  {
    icon: HiOutlinePhone,
    title: 'Call Us',
    detail: '+91 80-4567-8900',
    sub: 'Mon–Sat, 9 AM – 6 PM IST',
    color: 'bg-green-500/10 text-green-500',
  },
  {
    icon: HiOutlineMapPin,
    title: 'Visit Us',
    detail: '42, MG Road, Koramangala',
    sub: 'Bangalore, Karnataka 560034',
    color: 'bg-blue-500/10 text-blue-500',
  },
  {
    icon: HiOutlineClock,
    title: 'Working Hours',
    detail: 'Mon – Sat: 9 AM – 6 PM',
    sub: 'Sunday: Closed',
    color: 'bg-purple-500/10 text-purple-500',
  },
];

const socialLinks = [
  { icon: FiTwitter, href: '#', label: 'Twitter', hoverColor: 'hover:text-blue-400' },
  { icon: FiLinkedin, href: '#', label: 'LinkedIn', hoverColor: 'hover:text-blue-600' },
  { icon: FiGithub, href: '#', label: 'GitHub', hoverColor: 'hover:text-navy-800 dark:hover:text-white' },
  { icon: FiInstagram, href: '#', label: 'Instagram', hoverColor: 'hover:text-pink-500' },
  { icon: FiYoutube, href: '#', label: 'YouTube', hoverColor: 'hover:text-red-500' },
];

const subjectOptions = [
  'General Inquiry',
  'Solar Installation',
  'Technical Support',
  'Partnership',
  'Feedback',
  'Media & Press',
];

/* ════════════════════════════════════════
   HERO
   ════════════════════════════════════════ */
function ContactHero() {
  return (
    <section className="relative overflow-hidden bg-hero-light dark:bg-hero pt-32 pb-20 md:pt-40 md:pb-28">
      <div className="absolute top-20 right-1/4 w-72 h-72 rounded-full bg-solar-500/10 dark:bg-solar-500/5 blur-3xl" />
      <div className="absolute bottom-10 left-1/3 w-56 h-56 rounded-full bg-blue-500/8 dark:bg-blue-500/5 blur-3xl" />

      <div className="page-container relative z-10 text-center">
        <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
          <motion.span
            variants={fadeUp}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-solar-500/10 text-solar-600 dark:text-solar-400 border border-solar-500/20 mb-6"
          >
            <HiOutlineEnvelope className="text-solar-500" />
            Contact Us
          </motion.span>

          <motion.h1
            variants={fadeUp}
            custom={1}
            className="font-display text-4xl md:text-6xl font-bold mb-6"
          >
            <span className="text-navy-900 dark:text-white">Get in </span>
            <span className="text-solar-gradient">Touch</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            custom={2}
            className="text-lg md:text-xl text-navy-600 dark:text-navy-300 max-w-2xl mx-auto leading-relaxed"
          >
            Have questions about solar energy or our platform? Our team is here to help you every step of the way.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════
   CONTACT FORM
   ════════════════════════════════════════ */
function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success('Message sent successfully! We\'ll get back to you soon.', {
      duration: 4000,
      icon: '🌞',
    });

    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    setIsLoading(false);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="glass p-6 md:p-8 space-y-5"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUp}
    >
      <h3 className="font-display text-2xl font-bold text-navy-900 dark:text-white mb-2">
        Send us a Message
      </h3>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-navy-700 dark:text-navy-300 mb-1.5">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className="input-solar"
            placeholder="Rahul Sharma"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-navy-700 dark:text-navy-300 mb-1.5">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="input-solar"
            placeholder="rahul@example.com"
            required
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-navy-700 dark:text-navy-300 mb-1.5">
            Phone Number
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            className="input-solar"
            placeholder="+91 98765 43210"
          />
        </div>
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-navy-700 dark:text-navy-300 mb-1.5">
            Subject
          </label>
          <select
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="input-solar appearance-none cursor-pointer"
          >
            <option value="">Select a topic</option>
            {subjectOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-navy-700 dark:text-navy-300 mb-1.5">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          value={formData.message}
          onChange={handleChange}
          className="input-solar resize-none"
          placeholder="Tell us how we can help you..."
          required
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="btn-primary w-full inline-flex items-center justify-center gap-2 text-lg disabled:opacity-70 disabled:cursor-not-allowed"
        aria-label="Submit contact form"
      >
        {isLoading ? (
          <>
            <motion.div
              className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            Sending...
          </>
        ) : (
          <>
            <HiOutlinePaperAirplane className="text-lg" />
            Send Message
          </>
        )}
      </button>
    </motion.form>
  );
}

/* ════════════════════════════════════════
   CONTACT INFO CARDS + SOCIAL
   ════════════════════════════════════════ */
function ContactInfoPanel() {
  return (
    <motion.div
      className="space-y-5"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={staggerContainer}
    >
      {contactInfo.map((info, i) => {
        const Icon = info.icon;
        return (
          <motion.div
            key={i}
            variants={fadeUp}
            custom={i}
            className="glass p-5 flex items-start gap-4 group hover:shadow-card-hover dark:hover:shadow-solar-lg transition-all duration-300"
          >
            <div className={`w-12 h-12 rounded-xl ${info.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
              <Icon className="text-xl" />
            </div>
            <div>
              <h4 className="font-semibold text-navy-900 dark:text-white mb-0.5">
                {info.title}
              </h4>
              <p className="text-sm text-navy-700 dark:text-navy-200 font-medium">
                {info.detail}
              </p>
              <p className="text-xs text-navy-500 dark:text-navy-400 mt-0.5">
                {info.sub}
              </p>
            </div>
          </motion.div>
        );
      })}

      {/* Social Links */}
      <motion.div variants={fadeUp} custom={4} className="glass p-5">
        <h4 className="font-semibold text-navy-900 dark:text-white mb-4">Follow Us</h4>
        <div className="flex items-center gap-3">
          {socialLinks.map((social, i) => {
            const SocialIcon = social.icon;
            return (
              <a
                key={i}
                href={social.href}
                aria-label={social.label}
                className={`w-10 h-10 rounded-xl bg-navy-100/80 dark:bg-navy-700/50 flex items-center justify-center text-navy-500 dark:text-navy-400 ${social.hoverColor} hover:bg-navy-200 dark:hover:bg-navy-600 transition-all duration-200`}
              >
                <SocialIcon className="text-lg" />
              </a>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ════════════════════════════════════════
   MAIN CONTENT SECTION
   ════════════════════════════════════════ */
function ContactContent() {
  return (
    <section className="section-spacing">
      <div className="page-container">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Form — takes 3 cols */}
          <div className="lg:col-span-3">
            <ContactForm />
          </div>
          {/* Info — takes 2 cols */}
          <div className="lg:col-span-2">
            <ContactInfoPanel />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════
   MAP PLACEHOLDER
   ════════════════════════════════════════ */
function MapPlaceholder() {
  return (
    <section className="pb-16 md:pb-24">
      <div className="page-container">
        <motion.div
          className="glass overflow-hidden"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <div className="relative h-64 md:h-80 bg-navy-100/60 dark:bg-navy-800/40 flex flex-col items-center justify-center">
            {/* Grid overlay */}
            <div
              className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06]"
              style={{
                backgroundImage:
                  'linear-gradient(#94a3b8 1px, transparent 1px), linear-gradient(90deg, #94a3b8 1px, transparent 1px)',
                backgroundSize: '30px 30px',
              }}
            />

            <motion.div
              className="relative z-10 flex flex-col items-center"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <div className="w-16 h-16 rounded-full bg-solar-500/20 flex items-center justify-center mb-4">
                <HiOutlineMapPin className="text-3xl text-solar-500" />
              </div>
              <h3 className="font-display text-lg font-semibold text-navy-700 dark:text-navy-200 mb-1">
                Map Integration Coming Soon
              </h3>
              <p className="text-sm text-navy-500 dark:text-navy-400">
                42, MG Road, Koramangala, Bangalore — 560034
              </p>
            </motion.div>

            {/* Decorative dots */}
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-solar-500/30"
                style={{
                  top: `${20 + Math.random() * 60}%`,
                  left: `${10 + Math.random() * 80}%`,
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════
   CONTACT PAGE (default export)
   ════════════════════════════════════════ */
export default function ContactPage() {
  return (
    <main>
      <ContactHero />
      <ContactContent />
      <MapPlaceholder />
    </main>
  );
}
