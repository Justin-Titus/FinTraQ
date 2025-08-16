import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_BASE = `${BACKEND_URL}/api`;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

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