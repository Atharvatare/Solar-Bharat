// App-wide constants
export const APP_NAME = 'Solar Bharat';
export const APP_TAGLINE = 'AI-Powered Renewable Energy Platform';
export const APP_DESCRIPTION = 'India\'s smartest solar energy platform. Analyze your rooftop, calculate savings, and switch to solar with AI-driven insights.';

export const NAV_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Features', path: '/features' },
  { name: 'Marketplace', path: '/marketplace' },
  { name: 'Contact', path: '/contact' },
];

export const DASHBOARD_LINKS = [
  { name: 'Dashboard', path: '/dashboard', icon: 'HiOutlineHome' },
  { name: 'Energy Analytics', path: '/dashboard/analytics', icon: 'HiOutlineChartBar' },
  { name: 'Solar Calculator', path: '/dashboard/calculator', icon: 'HiOutlineCalculator' },
  { name: 'Bill Upload', path: '/dashboard/bill-upload', icon: 'HiOutlineDocumentArrowUp' },
  { name: 'Rooftop Analysis', path: '/dashboard/rooftop', icon: 'HiOutlineBuildingOffice' },
  { name: 'Solar Forecast', path: '/dashboard/forecast', icon: 'HiOutlineSun' },
  { name: 'IoT Monitor', path: '/dashboard/iot', icon: 'HiOutlineSignal' },
  { name: 'AI Assistant', path: '/dashboard/ai-chat', icon: 'HiOutlineCpuChip' },
  { name: 'Reports', path: '/dashboard/reports', icon: 'HiOutlineDocumentArrowDown' },
  { name: 'Settings', path: '/dashboard/settings', icon: 'HiOutlineCog6Tooth' },
];

export const ADMIN_LINKS = [
  { name: 'Admin Dashboard', path: '/admin', icon: 'HiOutlineShieldCheck' },
  { name: 'User Management', path: '/admin/users', icon: 'HiOutlineUsers' },
  { name: 'Vendor Management', path: '/admin/vendors', icon: 'HiOutlineBuildingStorefront' },
  { name: 'Products', path: '/admin/products', icon: 'HiOutlineCube' },
  { name: 'Leads & CRM', path: '/admin/leads', icon: 'HiOutlineFunnel' },
  { name: 'Quotations', path: '/admin/quotations', icon: 'HiOutlineDocumentText' },
  { name: 'Bookings', path: '/admin/bookings', icon: 'HiOutlineCalendarDays' },
];

export const STATS = [
  { label: 'Active Users', value: '50,000+', suffix: '' },
  { label: 'kWh Generated', value: '12M+', suffix: '' },
  { label: 'CO₂ Saved', value: '8,500', suffix: 'tons' },
  { label: 'Installations', value: '3,200+', suffix: '' },
];

export const FEATURES = [
  {
    title: 'AI Rooftop Analysis',
    description: 'Upload satellite images or enter your address. Our AI analyzes roof orientation, shading, and optimal panel placement.',
    icon: 'HiOutlineBuildingOffice',
  },
  {
    title: 'Smart Bill Analysis',
    description: 'Upload your electricity bills and let our AI predict your solar savings and optimal system size.',
    icon: 'HiOutlineDocumentText',
  },
  {
    title: 'Solar Calculator',
    description: 'Interactive calculator estimates costs, savings, ROI, and payback period customized for your location.',
    icon: 'HiOutlineCalculator',
  },
  {
    title: 'Energy Analytics',
    description: 'Real-time monitoring dashboard for your solar system\'s performance with predictive analytics.',
    icon: 'HiOutlineChartBar',
  },
  {
    title: 'AI Assistant',
    description: 'Get instant answers about solar energy, subsidies, maintenance, and more from our AI chatbot.',
    icon: 'HiOutlineCpuChip',
  },
  {
    title: 'Government Subsidies',
    description: 'Automatically check eligibility and apply for central and state solar subsidies in India.',
    icon: 'HiOutlineBankNotes',
  },
];

export const TESTIMONIALS = [
  {
    name: 'Priya Patel',
    role: 'Homeowner, Ahmedabad',
    content: 'Solar Bharat made going solar incredibly easy. The AI analysis was spot-on and I\'m saving ₹4,000 every month!',
    rating: 5,
  },
  {
    name: 'Rajesh Kumar',
    role: 'Business Owner, Delhi',
    content: 'The rooftop analysis tool is amazing. It accurately predicted our energy savings within 5% margin. Highly recommended!',
    rating: 5,
  },
  {
    name: 'Ananya Singh',
    role: 'Homeowner, Bangalore',
    content: 'From bill analysis to installation guidance, Solar Bharat handled everything. Best decision for our family!',
    rating: 5,
  },
];

export const FOOTER_LINKS = {
  Product: [
    { name: 'Features', path: '/features' },
    { name: 'Solar Calculator', path: '/dashboard/calculator' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'AI Assistant', path: '/dashboard/ai-chat' },
  ],
  Company: [
    { name: 'About Us', path: '/about' },
    { name: 'Careers', path: '/careers' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ],
  Resources: [
    { name: 'Documentation', path: '/docs' },
    { name: 'Solar Guide', path: '/guide' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Support', path: '/support' },
  ],
  Legal: [
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Terms of Service', path: '/terms' },
    { name: 'Cookie Policy', path: '/cookies' },
  ],
};
