import { Category } from "@/types";
import {
  ShoppingCart,
  Coffee,
  Car,
  Home,
  Film,
  Heart,
  GraduationCap,
  Plane,
  Smartphone,
  Utensils,
  Zap,
  DollarSign,
  TrendingUp,
  Briefcase,
  Gift,
} from "lucide-react";

// Expense Categories
export const EXPENSE_CATEGORIES: Category[] = [
  { id: "1", name: "Food & Dining", icon: "Utensils", color: "#ef4444", type: "expense" },
  { id: "2", name: "Shopping", icon: "ShoppingCart", color: "#8b5cf6", type: "expense" },
  { id: "3", name: "Transportation", icon: "Car", color: "#3b82f6", type: "expense" },
  { id: "4", name: "Entertainment", icon: "Film", color: "#ec4899", type: "expense" },
  { id: "5", name: "Bills & Utilities", icon: "Zap", color: "#f59e0b", type: "expense" },
  { id: "6", name: "Housing", icon: "Home", color: "#10b981", type: "expense" },
  { id: "7", name: "Healthcare", icon: "Heart", color: "#ef4444", type: "expense" },
  { id: "8", name: "Education", icon: "GraduationCap", color: "#6366f1", type: "expense" },
  { id: "9", name: "Travel", icon: "Plane", color: "#06b6d4", type: "expense" },
  { id: "10", name: "Technology", icon: "Smartphone", color: "#64748b", type: "expense" },
  { id: "11", name: "Coffee & Drinks", icon: "Coffee", color: "#92400e", type: "expense" },
  { id: "12", name: "Other", icon: "DollarSign", color: "#6b7280", type: "expense" },
];

// Income Categories
export const INCOME_CATEGORIES: Category[] = [
  { id: "i1", name: "Salary", icon: "Briefcase", color: "#10b981", type: "income" },
  { id: "i2", name: "Freelance", icon: "TrendingUp", color: "#3b82f6", type: "income" },
  { id: "i3", name: "Investment", icon: "DollarSign", color: "#8b5cf6", type: "income" },
  { id: "i4", name: "Gift", icon: "Gift", color: "#ec4899", type: "income" },
  { id: "i5", name: "Other Income", icon: "DollarSign", color: "#6b7280", type: "income" },
];

// All Categories
export const ALL_CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

// Get category by name
export const getCategoryByName = (name: string): Category | undefined => {
  return ALL_CATEGORIES.find((cat) => cat.name === name);
};

// Get category color
export const getCategoryColor = (name: string): string => {
  return getCategoryByName(name)?.color || "#6b7280";
};

// Currency Settings
export const CURRENCIES = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "MYR", symbol: "RM", name: "Malaysian Ringgit" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
];

export const DEFAULT_CURRENCY = CURRENCIES[0];

// Date Formats
export const DATE_FORMATS = [
  { value: "MM/dd/yyyy", label: "MM/DD/YYYY" },
  { value: "dd/MM/yyyy", label: "DD/MM/YYYY" },
  { value: "yyyy-MM-dd", label: "YYYY-MM-DD" },
  { value: "MMM dd, yyyy", label: "MMM DD, YYYY" },
];

export const DEFAULT_DATE_FORMAT = DATE_FORMATS[0];

// Budget Periods
export const BUDGET_PERIODS = [
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];

// Transaction Types
export const TRANSACTION_TYPES = [
  { value: "expense", label: "Expense" },
  { value: "income", label: "Income" },
];

// Chart Colors
export const CHART_COLORS = [
  "#ef4444", "#8b5cf6", "#3b82f6", "#ec4899", "#f59e0b",
  "#10b981", "#6366f1", "#06b6d4", "#64748b", "#92400e",
];

// Default Budget Amount
export const DEFAULT_MONTHLY_BUDGET = 2000;

// Pagination
export const ITEMS_PER_PAGE = 10;

// Local Storage Keys
export const STORAGE_KEYS = {
  USER: "expense_tracker_user",
  TRANSACTIONS: "expense_tracker_transactions",
  BUDGETS: "expense_tracker_budgets",
  SETTINGS: "expense_tracker_settings",
  AUTH_TOKEN: "expense_tracker_auth_token",
};

// Validation Constants
export const VALIDATION = {
  MIN_AMOUNT: 0.01,
  MAX_AMOUNT: 1000000,
  MIN_PASSWORD_LENGTH: 6,
  MAX_PASSWORD_LENGTH: 50,
  MAX_DESCRIPTION_LENGTH: 200,
  MAX_NOTES_LENGTH: 500,
};
