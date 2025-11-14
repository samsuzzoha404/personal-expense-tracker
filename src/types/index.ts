// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Transaction Types
export interface Transaction {
  id: string;
  userId: string;
  description: string;
  amount: number;
  category: string;
  date: Date;
  type: 'expense' | 'income';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TransactionFormData {
  description: string;
  amount: number;
  category: string;
  date: Date;
  type: 'expense' | 'income';
  notes?: string;
}

// Budget Types
export interface Budget {
  id: string;
  userId: string;
  category: string;
  amount: number;
  period: 'monthly' | 'weekly' | 'yearly';
  createdAt: Date;
  updatedAt: Date;
}

export interface BudgetFormData {
  category: string;
  amount: number;
  period: 'monthly' | 'weekly' | 'yearly';
}

// Category Types
export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: 'expense' | 'income';
}

// Dashboard Summary Types
export interface DashboardSummary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  budgetRemaining: number;
  monthlyBudget: number;
  transactionsByCategory: CategorySummary[];
  recentTransactions: Transaction[];
}

export interface CategorySummary {
  category: string;
  amount: number;
  percentage: number;
  budget?: number;
}

// Filter Types
export interface TransactionFilters {
  startDate?: Date;
  endDate?: Date;
  category?: string;
  type?: 'expense' | 'income' | 'all';
  minAmount?: number;
  maxAmount?: number;
  searchQuery?: string;
}

// Settings Types
export interface UserSettings {
  userId: string;
  currency: string;
  dateFormat: string;
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Form State Types
export interface FormState {
  isSubmitting: boolean;
  error: string | null;
  success: boolean;
}
