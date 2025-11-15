import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from "date-fns";
import { Transaction, CategorySummary, DashboardSummary } from "@/types";
import { DEFAULT_CURRENCY } from "@/constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Currency Formatting
export function formatCurrency(amount: number, currencyCode: string = DEFAULT_CURRENCY.code): string {
  const currency = DEFAULT_CURRENCY; // You can extend this to get currency by code
  return `${currency.symbol}${Math.abs(amount).toFixed(2)}`;
}

// Date Formatting
export function formatDate(date: Date | string, formatStr: string = "MMM dd, yyyy"): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, formatStr);
}

// Calculate percentage
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

// Get date range for current month
export function getCurrentMonthRange() {
  const now = new Date();
  return {
    start: startOfMonth(now),
    end: endOfMonth(now),
  };
}

// Get date range for current week
export function getCurrentWeekRange() {
  const now = new Date();
  return {
    start: startOfWeek(now),
    end: endOfWeek(now),
  };
}

// Filter transactions by date range
export function filterTransactionsByDateRange(
  transactions: Transaction[],
  startDate?: Date,
  endDate?: Date
): Transaction[] {
  return transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    if (startDate && transactionDate < startDate) return false;
    if (endDate && transactionDate > endDate) return false;
    return true;
  });
}

// Calculate total for transactions
export function calculateTotal(transactions: Transaction[]): number {
  return transactions.reduce((sum, transaction) => {
    if (transaction.type === "expense") {
      return sum - transaction.amount;
    }
    return sum + transaction.amount;
  }, 0);
}

// Calculate expenses total
export function calculateExpenses(transactions: Transaction[]): number {
  return transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
}

// Calculate income total
export function calculateIncome(transactions: Transaction[]): number {
  return transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
}

// Group transactions by category
export function groupByCategory(transactions: Transaction[]): CategorySummary[] {
  const grouped = transactions.reduce((acc, transaction) => {
    const category = transaction.category;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += transaction.amount;
    return acc;
  }, {} as Record<string, number>);

  const total = Object.values(grouped).reduce((sum, amount) => sum + amount, 0);

  return Object.entries(grouped)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: calculatePercentage(amount, total),
    }))
    .sort((a, b) => b.amount - a.amount);
}

// Calculate dashboard summary
export function calculateDashboardSummary(
  transactions: Transaction[],
  monthlyBudget: number = 2000
): DashboardSummary {
  const monthRange = getCurrentMonthRange();
  const monthTransactions = filterTransactionsByDateRange(
    transactions,
    monthRange.start,
    monthRange.end
  );

  const totalExpenses = calculateExpenses(monthTransactions);
  const totalIncome = calculateIncome(monthTransactions);
  const balance = totalIncome - totalExpenses;
  const budgetRemaining = monthlyBudget - totalExpenses;

  const expenseTransactions = monthTransactions.filter((t) => t.type === "expense");
  const transactionsByCategory = groupByCategory(expenseTransactions);

  // Get recent transactions (last 5)
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return {
    totalIncome,
    totalExpenses,
    balance,
    budgetRemaining,
    monthlyBudget,
    transactionsByCategory,
    recentTransactions,
  };
}

// Generate unique ID
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Validate email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Export transactions to CSV
export function exportToCSV(transactions: Transaction[]): void {
  const headers = ["Date", "Description", "Category", "Type", "Amount", "Notes"];
  const rows = transactions.map((t) => [
    formatDate(t.date),
    t.description,
    t.category,
    t.type,
    t.amount.toString(),
    t.notes || "",
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `transactions-${formatDate(new Date(), "yyyy-MM-dd")}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
