import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Try both token keys - adminToken (old) and token (new)
    const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('API Request with token:', config.url);
    } else {
      console.log('API Request without token:', config.url);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminData');
      localStorage.removeItem('isLoggedIn');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Admin authentication API calls
export const adminAPI = {
  // Login admin
  login: async (credentials) => {
    try {
      const response = await api.post('/admin/login', credentials);
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      console.error('Response data:', error.response?.data);
      throw error.response?.data || { message: 'Network error occurred' };
    }
  },

  // Get admin profile
  getProfile: async () => {
    try {
      const response = await api.get('/admin/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch profile' };
    }
  },

  // Update admin profile
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/admin/profile', profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update profile' };
    }
  },

  // Change password
  changePassword: async (passwordData) => {
    try {
      const response = await api.put('/admin/change-password', passwordData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to change password' };
    }
  },

  // Logout
  logout: async () => {
    try {
      const response = await api.post('/admin/logout');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to logout' };
    }
  },

  // Forgot password
  forgotPassword: async (email) => {
    try {
      const response = await api.post('/admin/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to send reset email' };
    }
  },

  // Verify OTP
  verifyOTP: async (otpData) => {
    try {
      const response = await api.post('/admin/verify-otp', otpData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to verify OTP' };
    }
  },

  // Reset password
  resetPassword: async (resetData) => {
    try {
      const response = await api.post('/admin/reset-password', resetData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to reset password' };
    }
  }
};

// Dashboard API calls
export const dashboardAPI = {
  // Get dashboard overview
  getOverview: async () => {
    try {
      const response = await api.get('/admin/dashboard/overview');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch dashboard data' };
    }
  },

  // Get financial reports
  getFinancialReports: async () => {
    try {
      const response = await api.get('/admin/dashboard/financial-reports');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch financial reports' };
    }
  },

  // Get referral analytics
  getReferralAnalytics: async () => {
    try {
      const response = await api.get('/admin/dashboard/referral-analytics');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch referral analytics' };
    }
  },

  // Get system health
  getSystemHealth: async () => {
    try {
      const response = await api.get('/admin/dashboard/system-health');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch system health' };
    }
  }
};

// Client management API calls
export const clientAPI = {
  // Get all clients
  getAllClients: async (params = {}) => {
    try {
      const response = await api.get('/admin/clients', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch clients' };
    }
  },

  // Get client details
  getClientDetails: async (clientId) => {
    try {
      const response = await api.get(`/admin/clients/${clientId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch client details' };
    }
  },

  // Update client status
  updateClientStatus: async (clientId, status) => {
    try {
      const response = await api.put(`/admin/clients/${clientId}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update client status' };
    }
  },

  // Update client details
  updateClient: async (clientId, updateData) => {
    try {
      const response = await api.put(`/admin/clients/${clientId}`, updateData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update client' };
    }
  },

  // Delete client
  deleteClient: async (clientId) => {
    try {
      const response = await api.delete(`/admin/clients/${clientId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete client' };
    }
  },

  // Get client documents
  getClientDocuments: async (clientId) => {
    try {
      const response = await api.get(`/admin/clients/${clientId}/documents`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch client documents' };
    }
  }
};

export default api; 