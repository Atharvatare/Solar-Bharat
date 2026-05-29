import axios from 'axios';

// =============================================
// SECURE API CLIENT — Solar Bharat
// =============================================
// ⚠️ SECURITY: All API keys and secrets are stored on the BACKEND only.
// The frontend NEVER touches third-party APIs directly.
// All requests route through our own Express backend which acts as a secure proxy.
// =============================================

// If VITE_API_URL is missing, automatically use the Vercel backend URL in production
const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://solar-bharat-at.vercel.app/api' : 'http://localhost:5000/api');

console.log('🔌 Solar Bharat API connecting to:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest', // CSRF-like protection
  },
  withCredentials: true, // Send cookies (refresh token)
});

// =============================================
// TOKEN MANAGEMENT (secure in-memory + localStorage)
// =============================================

const TOKEN_KEY = 'solar-bharat-token';
const REFRESH_KEY = 'solar-bharat-refresh';
const USER_KEY = 'solar-bharat-user';

export const tokenManager = {
  getAccessToken: () => localStorage.getItem(TOKEN_KEY),
  getRefreshToken: () => localStorage.getItem(REFRESH_KEY),

  setTokens: (accessToken, refreshToken) => {
    localStorage.setItem(TOKEN_KEY, accessToken);
    if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken);
  },

  setUser: (user) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  getUser: () => {
    try {
      const saved = localStorage.getItem(USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  },

  clearAll: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
  },

  // Check if access token is expired (without verifying signature — that's server-side)
  isTokenExpired: () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  },
};

// =============================================
// REQUEST INTERCEPTOR — Attach token + auto-refresh
// =============================================

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });
  failedQueue = [];
};

api.interceptors.request.use(
  async (config) => {
    const token = tokenManager.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// =============================================
// RESPONSE INTERCEPTOR — Auto-refresh on 401 + error formatting
// =============================================

api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and we haven't already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue this request until refresh completes
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = tokenManager.getRefreshToken();

      if (refreshToken) {
        try {
          // Call refresh endpoint directly (bypass interceptors)
          const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          }, { withCredentials: true });

          const newAccessToken = data.data.accessToken;
          const newRefreshToken = data.data.refreshToken;

          tokenManager.setTokens(newAccessToken, newRefreshToken);
          processQueue(null, newAccessToken);

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          tokenManager.clearAll();
          window.location.href = '/login?session=expired';
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      } else {
        tokenManager.clearAll();
        window.location.href = '/login?session=expired';
      }
    }

    // Format error response
    if (error.response) {
      const { data } = error.response;
      return Promise.reject({
        message: data?.message || 'Something went wrong',
        errors: data?.errors || [],
        status: error.response.status,
      });
    }

    return Promise.reject({
      message: 'Network error. Please check your connection.',
      errors: [],
      status: 0,
    });
  }
);

// =============================================
// API ENDPOINTS — All route through OUR backend
// No third-party API keys are exposed here
// =============================================

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  logoutAll: () => api.post('/auth/logout-all'),
  refresh: (refreshToken) => api.post('/auth/refresh', { refreshToken }),
  getMe: () => api.get('/auth/me'),
  changePassword: (data) => api.put('/auth/change-password', data),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.put(`/auth/reset-password/${token}`, { password }),
  verifyEmail: (token) => api.get(`/auth/verify-email/${token}`),
  resendVerification: () => api.post('/auth/resend-verification'),
  getSessions: () => api.get('/auth/sessions'),
  revokeSession: (sessionId) => api.delete(`/auth/sessions/${sessionId}`),
};

export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  updatePreferences: (preferences) => api.put('/users/preferences', { preferences }),
  updateSolarSystem: (data) => api.put('/users/solar-system', data),
  deleteAccount: () => api.delete('/users/account'),
};

export const dashboardAPI = {
  getSummary: (period) => api.get(`/dashboard/summary?period=${period || '30d'}`),
  getAnalytics: (params) => api.get('/dashboard/analytics', { params }),
  getWeeklyEnergy: () => api.get('/dashboard/energy/weekly'),
  getMonthlySavings: () => api.get('/dashboard/savings/monthly'),
};

export const billAPI = {
  upload: (formData) => api.post('/bills/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getAll: (params) => api.get('/bills', { params }),
  getById: (id) => api.get(`/bills/${id}`),
  delete: (id) => api.delete(`/bills/${id}`),
};

export const solarAPI = {
  calculate: (params) => api.post('/solar/calculate', params),
  rooftopAnalysis: (params) => api.post('/solar/rooftop-analysis', params),
  analyzeBill: (formData) => api.post('/solar/analyze-bill', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getReports: (params) => api.get('/solar/reports', { params }),
  getReport: (id) => api.get(`/solar/reports/${id}`),
  deleteReport: (id) => api.delete(`/solar/reports/${id}`),
};

export const chatAPI = {
  sendMessage: (message, sessionId) => api.post('/chat/message', { message, sessionId }),
  getSessions: () => api.get('/chat/sessions'),
  getSession: (sessionId) => api.get(`/chat/sessions/${sessionId}`),
  deleteSession: (sessionId) => api.delete(`/chat/sessions/${sessionId}`),
  clearHistory: () => api.delete('/chat/history'),
};

export const notificationAPI = {
  getAll: (params) => api.get('/notifications', { params }),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  delete: (id) => api.delete(`/notifications/${id}`),
};

export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getAnalytics: () => api.get('/admin/analytics'),
  getBills: (params) => api.get('/admin/bills', { params }),
  getUsers: (params) => api.get('/users', { params }),
  updateUserRole: (id, role) => api.put(`/users/${id}/role`, { role }),
  toggleUserStatus: (id) => api.put(`/users/${id}/status`),
  getVendors: (params) => api.get('/admin/vendors', { params }),
  createVendor: (data) => api.post('/admin/vendors', data),
  getProducts: (params) => api.get('/admin/products', { params }),
  createProduct: (data) => api.post('/admin/products', data),
  broadcast: (data) => api.post('/admin/notifications/broadcast', data),
};

export default api;
