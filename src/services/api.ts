// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to handle API responses
async function handleResponse(response: Response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'An error occurred' }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
}

// Generic API request function
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    return await handleResponse(response);
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

export const api = {
  // Health check
  healthCheck: () => apiRequest('/health'),

  // Transaction endpoints
  transactions: {
    getAll: (userId: string, filters?: {
      category?: string;
      startDate?: string;
      endDate?: string;
    }) => {
      const params = new URLSearchParams({ userId });
      if (filters?.category) params.append('category', filters.category);
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);
      
      return apiRequest(`/transactions?${params.toString()}`);
    },

    getById: (id: string, userId: string) => {
      return apiRequest(`/transactions/${id}?userId=${userId}`);
    },

    create: (data: {
      userId: string;
      type: 'income' | 'expense';
      amount: number;
      category: string;
      description?: string;
      notes?: string;
      date: string;
    }) => {
      return apiRequest('/transactions', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    update: (id: string, userId: string, data: {
      type?: 'income' | 'expense';
      amount?: number;
      category?: string;
      description?: string;
      notes?: string;
      date?: string;
    }) => {
      return apiRequest(`/transactions/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ ...data, userId }),
      });
    },

    delete: (id: string, userId: string) => {
      return apiRequest(`/transactions/${id}?userId=${userId}`, {
        method: 'DELETE',
      });
    },

    getStats: (userId: string, filters?: {
      startDate?: string;
      endDate?: string;
    }) => {
      const params = new URLSearchParams({ userId });
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);
      
      return apiRequest(`/transactions/stats?${params.toString()}`);
    },
  },

  // Budget endpoints
  budgets: {
    getAll: (userId: string) => {
      return apiRequest(`/budgets?userId=${userId}`);
    },

    getById: (id: string, userId: string) => {
      return apiRequest(`/budgets/${id}?userId=${userId}`);
    },

    getTotalMonthly: (userId: string) => {
      return apiRequest(`/budgets/total?userId=${userId}`);
    },

    create: (data: {
      userId: string;
      category: string;
      amount: number;
      period: 'monthly' | 'weekly' | 'yearly';
    }) => {
      return apiRequest('/budgets', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    update: (id: string, userId: string, data: {
      category?: string;
      amount?: number;
      period?: 'monthly' | 'weekly' | 'yearly';
    }) => {
      return apiRequest(`/budgets/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ ...data, userId }),
      });
    },

    delete: (id: string, userId: string) => {
      return apiRequest(`/budgets/${id}?userId=${userId}`, {
        method: 'DELETE',
      });
    },
  },
};

export default api;
