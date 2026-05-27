// ============================================
// SOLAR BHARAT — Mock Data for Charts & UI
// ============================================

// 7-day energy generation data (kWh)
export const weeklyEnergyData = [
  { day: 'Mon', generated: 18.5, consumed: 12.3, exported: 6.2 },
  { day: 'Tue', generated: 22.1, consumed: 14.1, exported: 8.0 },
  { day: 'Wed', generated: 15.3, consumed: 13.8, exported: 1.5 },
  { day: 'Thu', generated: 25.8, consumed: 11.9, exported: 13.9 },
  { day: 'Fri', generated: 28.2, consumed: 15.7, exported: 12.5 },
  { day: 'Sat', generated: 30.1, consumed: 18.2, exported: 11.9 },
  { day: 'Sun', generated: 27.4, consumed: 16.5, exported: 10.9 },
];

// Monthly savings data (INR)
export const monthlySavingsData = [
  { month: 'Jan', savings: 3200, bill: 4800 },
  { month: 'Feb', savings: 3800, bill: 4200 },
  { month: 'Mar', savings: 4500, bill: 3500 },
  { month: 'Apr', savings: 5200, bill: 2800 },
  { month: 'May', savings: 5800, bill: 2200 },
  { month: 'Jun', savings: 5100, bill: 2900 },
  { month: 'Jul', savings: 4200, bill: 3800 },
  { month: 'Aug', savings: 4600, bill: 3400 },
  { month: 'Sep', savings: 5000, bill: 3000 },
  { month: 'Oct', savings: 5400, bill: 2600 },
  { month: 'Nov', savings: 4800, bill: 3200 },
  { month: 'Dec', savings: 3600, bill: 4400 },
];

// Yearly energy production (kWh)
export const yearlyProductionData = [
  { month: 'Jan', production: 520 },
  { month: 'Feb', production: 580 },
  { month: 'Mar', production: 720 },
  { month: 'Apr', production: 850 },
  { month: 'May', production: 920 },
  { month: 'Jun', production: 780 },
  { month: 'Jul', production: 650 },
  { month: 'Aug', production: 700 },
  { month: 'Sep', production: 800 },
  { month: 'Oct', production: 860 },
  { month: 'Nov', production: 680 },
  { month: 'Dec', production: 540 },
];

// Energy source distribution
export const energySourceData = [
  { name: 'Solar', value: 72, color: '#F59E0B' },
  { name: 'Grid', value: 20, color: '#3B82F6' },
  { name: 'Battery', value: 8, color: '#10B981' },
];

// System health metrics
export const systemHealthData = [
  { name: 'Panel Efficiency', value: 94, fill: '#F59E0B' },
  { name: 'Inverter Status', value: 98, fill: '#10B981' },
  { name: 'Battery Health', value: 87, fill: '#3B82F6' },
  { name: 'Grid Sync', value: 100, fill: '#8B5CF6' },
];

// Admin — User growth data
export const userGrowthData = [
  { month: 'Jan', users: 12400, newUsers: 1200 },
  { month: 'Feb', users: 15200, newUsers: 2800 },
  { month: 'Mar', users: 19800, newUsers: 4600 },
  { month: 'Apr', users: 24100, newUsers: 4300 },
  { month: 'May', users: 30500, newUsers: 6400 },
  { month: 'Jun', users: 35200, newUsers: 4700 },
  { month: 'Jul', users: 38900, newUsers: 3700 },
  { month: 'Aug', users: 42100, newUsers: 3200 },
  { month: 'Sep', users: 45800, newUsers: 3700 },
  { month: 'Oct', users: 48200, newUsers: 2400 },
  { month: 'Nov', users: 50100, newUsers: 1900 },
  { month: 'Dec', users: 52400, newUsers: 2300 },
];

// Admin — Revenue data
export const revenueData = [
  { month: 'Jan', revenue: 245000 },
  { month: 'Feb', revenue: 312000 },
  { month: 'Mar', revenue: 428000 },
  { month: 'Apr', revenue: 389000 },
  { month: 'May', revenue: 520000 },
  { month: 'Jun', revenue: 478000 },
  { month: 'Jul', revenue: 540000 },
  { month: 'Aug', revenue: 612000 },
  { month: 'Sep', revenue: 580000 },
  { month: 'Oct', revenue: 650000 },
  { month: 'Nov', revenue: 720000 },
  { month: 'Dec', revenue: 690000 },
];

// Recent activity
export const recentActivity = [
  {
    id: 1,
    type: 'energy',
    title: 'Daily energy target met',
    description: 'Generated 28.2 kWh today, exceeding target by 15%',
    time: '2 hours ago',
    icon: '⚡',
  },
  {
    id: 2,
    type: 'savings',
    title: 'Monthly savings milestone',
    description: 'Total savings crossed ₹50,000 this year',
    time: '1 day ago',
    icon: '💰',
  },
  {
    id: 3,
    type: 'maintenance',
    title: 'Panel cleaning reminder',
    description: 'Scheduled panel cleaning in 3 days',
    time: '2 days ago',
    icon: '🔧',
  },
  {
    id: 4,
    type: 'subsidy',
    title: 'Subsidy status updated',
    description: 'PM Surya Ghar subsidy application approved',
    time: '3 days ago',
    icon: '📋',
  },
  {
    id: 5,
    type: 'system',
    title: 'System update available',
    description: 'Inverter firmware v2.4.1 is available',
    time: '5 days ago',
    icon: '🔄',
  },
];

// Notifications
export const notifications = [
  {
    id: 1,
    title: 'Energy Peak!',
    message: 'Your system generated 30.1 kWh yesterday — a new record!',
    time: '5 min ago',
    read: false,
    type: 'success',
  },
  {
    id: 2,
    title: 'Bill Analysis Ready',
    message: 'Your June electricity bill analysis is ready to view.',
    time: '1 hour ago',
    read: false,
    type: 'info',
  },
  {
    id: 3,
    title: 'Maintenance Due',
    message: 'Panel cleaning recommended before monsoon season.',
    time: '3 hours ago',
    read: true,
    type: 'warning',
  },
  {
    id: 4,
    title: 'Subsidy Approved',
    message: 'Your ₹78,000 subsidy under PM Surya Ghar has been approved!',
    time: '1 day ago',
    read: true,
    type: 'success',
  },
];

// Solar calculator defaults
export const calculatorDefaults = {
  roofArea: 500,
  monthlyBill: 5000,
  electricityRate: 8,
  sunlightHours: 5.5,
  panelEfficiency: 20,
  systemLoss: 14,
  panelCostPerWatt: 40,
  subsidyPercent: 40,
};

// Admin — Recent registrations
export const recentRegistrations = [
  { id: 1, name: 'Vikram Mehta', email: 'vikram@email.com', location: 'Pune', date: '2024-12-20', status: 'active' },
  { id: 2, name: 'Sunita Devi', email: 'sunita@email.com', location: 'Jaipur', date: '2024-12-19', status: 'active' },
  { id: 3, name: 'Mohd Farhan', email: 'farhan@email.com', location: 'Hyderabad', date: '2024-12-18', status: 'pending' },
  { id: 4, name: 'Kavita Nair', email: 'kavita@email.com', location: 'Kochi', date: '2024-12-17', status: 'active' },
  { id: 5, name: 'Amit Ghosh', email: 'amit@email.com', location: 'Kolkata', date: '2024-12-16', status: 'active' },
];

// Bill upload history
export const billHistory = [
  { id: 1, filename: 'electricity_bill_nov.pdf', date: '2024-11-15', amount: 4200, status: 'analyzed', savings: 3100 },
  { id: 2, filename: 'electricity_bill_oct.pdf', date: '2024-10-14', amount: 3800, status: 'analyzed', savings: 2900 },
  { id: 3, filename: 'electricity_bill_sep.pdf', date: '2024-09-12', amount: 5100, status: 'analyzed', savings: 3800 },
  { id: 4, filename: 'electricity_bill_aug.pdf', date: '2024-08-10', amount: 4600, status: 'analyzed', savings: 3400 },
];

// AI Chat sample messages
export const sampleChatMessages = [
  {
    id: 1,
    role: 'assistant',
    content: 'Hello! I\'m your Solar Bharat AI assistant. I can help you with solar energy questions, system recommendations, subsidy information, and more. How can I help you today?',
    timestamp: '10:00 AM',
  },
];

// Quick chat suggestions
export const chatSuggestions = [
  'What solar subsidies am I eligible for?',
  'How much can I save with a 5kW system?',
  'When should I clean my solar panels?',
  'What is net metering?',
  'Best solar panel brands in India?',
  'How does the monsoon affect solar output?',
];

// Hourly energy data for analytics
export const hourlyEnergyData = [
  { hour: '6AM', generated: 0.2, consumed: 1.1 },
  { hour: '7AM', generated: 0.8, consumed: 1.5 },
  { hour: '8AM', generated: 2.1, consumed: 2.0 },
  { hour: '9AM', generated: 3.5, consumed: 1.8 },
  { hour: '10AM', generated: 4.8, consumed: 1.5 },
  { hour: '11AM', generated: 5.2, consumed: 1.3 },
  { hour: '12PM', generated: 5.5, consumed: 2.1 },
  { hour: '1PM', generated: 5.3, consumed: 2.5 },
  { hour: '2PM', generated: 4.9, consumed: 2.0 },
  { hour: '3PM', generated: 4.2, consumed: 1.8 },
  { hour: '4PM', generated: 3.1, consumed: 2.2 },
  { hour: '5PM', generated: 1.8, consumed: 2.8 },
  { hour: '6PM', generated: 0.5, consumed: 3.2 },
  { hour: '7PM', generated: 0.0, consumed: 3.5 },
];
