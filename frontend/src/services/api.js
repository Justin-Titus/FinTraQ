import axios from 'axios';
import { getAccessToken, setAccessToken, clearAccessToken } from './token';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_BASE = `${BACKEND_URL}/api`;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Authorization header from in-memory token
api.interceptors.request.use((config) => {
  const token = getAccessToken && getAccessToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let pendingRequests = [];

function subscribeTokenRefresh(cb) {
  pendingRequests.push(cb);
}

function onRefreshed(newToken) {
  pendingRequests.forEach((cb) => cb(newToken));
  pendingRequests = [];
}

// Handle 401 by attempting refresh once
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const url = originalRequest?.url || '';
    // Do not try to auto-refresh for auth endpoints themselves to avoid loops
    if (url.includes('/auth/refresh-token') || url.includes('/auth/login') || url.includes('/auth/register') || url.includes('/auth/logout') || url.includes('/auth/me')) {
      return Promise.reject(error);
    }
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const refreshResponse = await api.post('/auth/refresh-token', {}, { withCredentials: true });
          const newToken = refreshResponse.data?.accessToken;
          if (newToken) {
            setAccessToken && setAccessToken(newToken);
            onRefreshed(newToken);
          } else {
            clearAccessToken && clearAccessToken();
          }
        } catch (e) {
          clearAccessToken && clearAccessToken();
          onRefreshed(null);
          throw error;
        } finally {
          isRefreshing = false;
        }
      }

      return new Promise((resolve, reject) => {
        subscribeTokenRefresh((token) => {
          if (token) {
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            resolve(api(originalRequest));
          } else {
            reject(error);
          }
        });
      });
    }
    return Promise.reject(error);
  }
);

// Categories API
export const categoriesAPI = {
  getAll: async () => {
    const response = await api.get('/categories/');
    return response.data;
  },
  
  create: async (categoryData) => {
    const response = await api.post('/categories/', categoryData);
    return response.data;
  },
  
  delete: async (categoryId) => {
    const response = await api.delete(`/categories/${categoryId}`);
    return response.data;
  }
};

// Transactions API
export const transactionsAPI = {
  getAll: async (month = null) => {
    const params = month ? { month } : {};
    const response = await api.get('/transactions/', { params });
    
    // Map backend response to frontend format
    return response.data.map(transaction => ({
      id: transaction.id,
      type: transaction.transaction_type,
      amount: transaction.amount,
      category: transaction.category,
      description: transaction.description,
      date: transaction.transaction_date
    }));
  },
  
  create: async (transactionData) => {
    // Map frontend field names to backend field names
    const backendData = {
      transaction_type: transactionData.type,
      amount: transactionData.amount,
      category: transactionData.category,
      description: transactionData.description
    };
    const response = await api.post('/transactions/', backendData);
    
    // Map backend response back to frontend format
    const transaction = response.data;
    return {
      id: transaction.id,
      type: transaction.transaction_type,
      amount: transaction.amount,
      category: transaction.category,
      description: transaction.description,
      date: transaction.transaction_date
    };
  },
  
  delete: async (transactionId) => {
    const response = await api.delete(`/transactions/${transactionId}`);
    return response.data;
  },
  
  getSummary: async (month) => {
    const response = await api.get(`/transactions/summary/${month}`);
    const summary = response.data;
    return {
      totalIncome: summary.total_income,
      totalExpenses: summary.total_expenses,
      balance: summary.balance
    };
  }
};

// Utility function to handle API errors
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    return error.response.data?.detail || error.response.data?.error || 'Server error occurred';
  } else if (error.request) {
    // Request was made but no response received
    return 'Network error - please check your connection';
  } else {
    // Something else happened
    return error.message || 'An unexpected error occurred';
  }
};

export default api;

// Also export auth helpers for convenience
export const authAPI = {
  register: (data) => api.post('/auth/register', data, { withCredentials: true }),
  login: (data) => api.post('/auth/login', data, { withCredentials: true }),
  refresh: () => api.post('/auth/refresh-token', {}, { withCredentials: true }),
  logout: () => api.post('/auth/logout', {}, { withCredentials: true }),
  me: () => api.get('/auth/me'),
};