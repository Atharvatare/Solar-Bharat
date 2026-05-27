// ============================================
// SOLAR BHARAT — App-wide Constants
// ============================================

export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  VENDOR: 'vendor',
};

export const BILL_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  ANALYZED: 'analyzed',
  FAILED: 'failed',
};

export const REPORT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
};

export const NOTIFICATION_TYPES = {
  ENERGY: 'energy',
  SAVINGS: 'savings',
  MAINTENANCE: 'maintenance',
  SUBSIDY: 'subsidy',
  SYSTEM: 'system',
  BILLING: 'billing',
  WELCOME: 'welcome',
};

export const PANEL_TYPES = {
  MONOCRYSTALLINE: 'monocrystalline',
  POLYCRYSTALLINE: 'polycrystalline',
  THIN_FILM: 'thin_film',
};

export const PRODUCT_CATEGORIES = {
  SOLAR_PANEL: 'solar_panel',
  INVERTER: 'inverter',
  BATTERY: 'battery',
  MOUNTING: 'mounting',
  ACCESSORIES: 'accessories',
};

export const VENDOR_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
  SUSPENDED: 'suspended',
};

export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Puducherry', 'Chandigarh',
];

export const SOLAR_CONSTANTS = {
  AVG_SUNLIGHT_HOURS: 5.5,
  PANEL_WATT_RATING: 400,    // watts per panel
  COST_PER_WATT: 40,          // INR per watt
  SUBSIDY_PERCENT: 40,        // government subsidy %
  SYSTEM_LOSS: 14,             // % system losses
  CO2_PER_KWH: 0.82,          // kg CO2 offset per kWh
  PANEL_LIFETIME_YEARS: 25,
  DEGRADATION_RATE: 0.5,      // % per year
};

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE: 422,
  TOO_MANY_REQUESTS: 429,
  SERVER_ERROR: 500,
};
