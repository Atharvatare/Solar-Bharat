// Format number with commas
export function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toLocaleString('en-IN');
}

// Format currency in INR
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format date
export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// Format relative time
export function timeAgo(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now - date) / 1000);

  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
    }
  }
  return 'just now';
}

// Validate email
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Validate phone (Indian)
export function isValidPhone(phone) {
  return /^[+]?91?\s?[6-9]\d{4}\s?\d{5}$/.test(phone.replace(/\s/g, ''));
}

// Password strength checker
export function getPasswordStrength(password) {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z\d]/.test(password)) score++;

  if (score <= 1) return { label: 'Weak', color: 'bg-red-500', width: '20%' };
  if (score === 2) return { label: 'Fair', color: 'bg-orange-500', width: '40%' };
  if (score === 3) return { label: 'Good', color: 'bg-yellow-500', width: '60%' };
  if (score === 4) return { label: 'Strong', color: 'bg-green-500', width: '80%' };
  return { label: 'Very Strong', color: 'bg-emerald-500', width: '100%' };
}

// Truncate text
export function truncate(str, maxLength = 100) {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '...';
}

// Generate greeting based on time
export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

// Debounce function
export function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// Class name helper
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
