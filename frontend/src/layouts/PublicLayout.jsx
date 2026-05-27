import { useState, useEffect } from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineBars3, HiXMark } from 'react-icons/hi2';
import { FiTwitter, FiLinkedin, FiInstagram, FiYoutube } from 'react-icons/fi';
import ThemeToggle from '../components/ui/ThemeToggle';
import { NAV_LINKS, FOOTER_LINKS, APP_NAME, APP_DESCRIPTION } from '../utils/constants';

/* ─── Sun Logo SVG ─── */
function SunLogo({ className = 'w-8 h-8' }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      aria-hidden="true"
    >
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

/* ─── Brand Logo Component ─── */
function BrandLogo() {
  return (
    <Link to="/" className="flex items-center gap-2.5 group" aria-label="Solar Bharat Home">
      <motion.div whileHover={{ rotate: 20 }} transition={{ type: 'spring', stiffness: 260 }}>
        <SunLogo className="w-9 h-9" />
      </motion.div>
      <span className="font-display font-bold text-xl tracking-tight">
        <span className="text-solar-500">Solar</span>{' '}
        <span className="text-navy-900 dark:text-white">Bharat</span>
      </span>
    </Link>
  );
}

/* ─── Navbar ─── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* Lock body scroll when mobile menu is open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const navLinkClass = ({ isActive }) =>
    `relative px-1 py-2 text-sm font-medium transition-colors duration-200
     ${isActive
       ? 'text-solar-500'
       : 'text-navy-600 dark:text-navy-300 hover:text-solar-500 dark:hover:text-solar-400'
     }`;

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 dark:bg-navy-900/80 backdrop-blur-xl shadow-lg shadow-navy-900/5 dark:shadow-navy-950/40'
          : 'bg-transparent'
      }`}
    >
      <nav className="page-container flex items-center justify-between h-[72px]" aria-label="Main navigation">
        {/* Logo */}
        <BrandLogo />

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.path} to={link.path} end={link.path === '/'} className={navLinkClass}>
              {({ isActive }) => (
                <>
                  {link.name}
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute left-0 -bottom-0.5 h-0.5 w-full rounded-full bg-solar-500"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Desktop Right */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle size="sm" />
          <Link to="/login" className="btn-ghost text-sm !px-4 !py-2">
            Login
          </Link>
          <Link to="/register" className="btn-primary text-sm !px-5 !py-2.5">
            Get Started
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle size="sm" />
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMobileOpen(true)}
            className="w-10 h-10 flex items-center justify-center rounded-xl
              text-navy-700 dark:text-navy-200 hover:bg-navy-100 dark:hover:bg-navy-800
              transition-colors cursor-pointer"
            aria-label="Open menu"
          >
            <HiOutlineBars3 className="text-2xl" />
          </motion.button>
        </div>
      </nav>

      {/* ─── Mobile Menu Overlay ─── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-navy-950/50 backdrop-blur-sm z-40"
              onClick={() => setMobileOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ y: '-100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '-100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed inset-x-0 top-0 z-50 glass-strong rounded-b-3xl shadow-2xl max-h-[85vh] overflow-y-auto"
            >
              <div className="page-container py-5">
                {/* Top bar */}
                <div className="flex items-center justify-between mb-8">
                  <BrandLogo />
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setMobileOpen(false)}
                    className="w-10 h-10 flex items-center justify-center rounded-xl
                      text-navy-700 dark:text-navy-200 hover:bg-navy-100 dark:hover:bg-navy-800
                      transition-colors cursor-pointer"
                    aria-label="Close menu"
                  >
                    <HiXMark className="text-2xl" />
                  </motion.button>
                </div>

                {/* Links */}
                <div className="flex flex-col gap-1 mb-8">
                  {NAV_LINKS.map((link, i) => (
                    <motion.div
                      key={link.path}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.05 * i }}
                    >
                      <NavLink
                        to={link.path}
                        end={link.path === '/'}
                        onClick={() => setMobileOpen(false)}
                        className={({ isActive }) =>
                          `block px-4 py-3.5 rounded-xl text-base font-medium transition-colors duration-200 ${
                            isActive
                              ? 'bg-solar-500/10 text-solar-500'
                              : 'text-navy-700 dark:text-navy-200 hover:bg-navy-100 dark:hover:bg-navy-800'
                          }`
                        }
                      >
                        {link.name}
                      </NavLink>
                    </motion.div>
                  ))}
                </div>

                {/* Auth buttons */}
                <div className="flex flex-col gap-3 pb-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="btn-ghost text-center"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileOpen(false)}
                    className="btn-primary text-center"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

/* ─── Footer ─── */
function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: FiTwitter, href: '#', label: 'Twitter / X' },
    { icon: FiLinkedin, href: '#', label: 'LinkedIn' },
    { icon: FiInstagram, href: '#', label: 'Instagram' },
    { icon: FiYoutube, href: '#', label: 'YouTube' },
  ];

  return (
    <footer className="bg-navy-900 text-navy-300" role="contentinfo">
      {/* Top wave separator */}
      <div className="w-full overflow-hidden leading-[0]">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-8 md:h-12">
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,
               250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,
               214.34,3V120H0V95.8C57.1,98.22,126.93,67.69,321.39,56.44Z"
            className="fill-navy-900"
          />
        </svg>
      </div>

      <div className="page-container pb-8">
        {/* Main grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 py-12 border-b border-navy-800">
          {/* Brand column — spans 2 on lg */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-5">
              <SunLogo className="w-8 h-8" />
              <span className="font-display font-bold text-xl tracking-tight text-white">
                <span className="text-solar-500">Solar</span> Bharat
              </span>
            </div>
            <p className="text-navy-400 text-sm leading-relaxed max-w-sm mb-6">
              {APP_DESCRIPTION}
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ y: -3, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 flex items-center justify-center rounded-xl
                    bg-navy-800 text-navy-400 hover:bg-solar-500 hover:text-white
                    transition-colors duration-200"
                  aria-label={social.label}
                >
                  <social.icon className="text-lg" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Link groups */}
          {Object.entries(FOOTER_LINKS).slice(0, 3).map(([group, links]) => (
            <div key={group}>
              <h4 className="font-display font-semibold text-white text-sm mb-4 tracking-wide uppercase">
                {group}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-sm text-navy-400 hover:text-solar-400 transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-sm text-navy-500">
          <p>© {currentYear} {APP_NAME}. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Made with <span className="text-lg" aria-label="sunshine">☀️</span> in India
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ─── Public Layout ─── */
function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default PublicLayout;
