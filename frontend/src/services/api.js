import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('solar-bharat-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      if (status === 401) {
        localStorage.removeItem('solar-bharat-token');
        localStorage.removeItem('solar-bharat-user');
        window.location.href = '/login';
      }
      return Promise.reject(data?.message || 'Something went wrong');
    }
    return Promise.reject('Network error. Please try again.');
  }
);

// API endpoint helpers
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  getProfile: () => api.get('/auth/profile'),
};

export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getEnergyData: (period) => api.get(`/dashboard/energy?period=${period}`),
  getRecentActivity: () => api.get('/dashboard/activity'),
};

export const billAPI = {
  upload: (formData) => api.post('/bills/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getAnalysis: (id) => api.get(`/bills/${id}/analysis`),
  getHistory: () => api.get('/bills/history'),
};

export const solarAPI = {
  calculate: (params) => api.post('/solar/calculate', params),
  getRooftopAnalysis: (params) => api.post('/solar/rooftop-analysis', params),
};

export const chatAPI = {
  sendMessage: (message) => api.post('/chat/message', { message }),
  getHistory: () => api.get('/chat/history'),
};

export const adminAPI = {
  getOverview: () => api.get('/admin/overview'),
  getUsers: (params) => api.get('/admin/users', { params }),
  getSystemHealth: () => api.get('/admin/health'),
};

export default api;
