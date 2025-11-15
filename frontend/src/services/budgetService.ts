import { Budget, BudgetFormData } from "@/types";
import { DEFAULT_MONTHLY_BUDGET } from "@/constants";
import api from "./api";

// MongoDB Budget type
interface MongoBudget {
  _id: string;
  userId: string;
  category: string;
  amount: number;
  period: "monthly" | "weekly" | "yearly";
  createdAt: string;
  updatedAt: string;
}

// Helper function to convert MongoDB budget to app Budget type
const convertMongoBudget = (mongoBudget: MongoBudget): Budget => {
  return {
    id: mongoBudget._id,
    userId: mongoBudget.userId,
    category: mongoBudget.category,
    amount: mongoBudget.amount,
    period: mongoBudget.period,
    createdAt: new Date(mongoBudget.createdAt),
    updatedAt: new Date(mongoBudget.updatedAt),
  };
};

export const budgetService = {
  // Get all budgets for a user
  getAllBudgets: async (userId: string): Promise<Budget[]> => {
    try {
      console.log('📡 Fetching budgets for userId:', userId);
      const mongoBudgets = await api.budgets.getAll(userId);
      console.log('✅ Received budgets:', mongoBudgets.length);
      return mongoBudgets.map(convertMongoBudget);
    } catch (error) {
      console.error("❌ Error fetching budgets:", error);
      throw new Error("Failed to fetch budgets from server");
    }
  },

  // Get total monthly budget
  getTotalMonthlyBudget: async (userId: string): Promise<number> => {
    try {
      const response = await api.budgets.getTotalMonthly(userId);
      return response.total || DEFAULT_MONTHLY_BUDGET;
    } catch (error) {
      console.error("Error fetching total monthly budget:", error);
      return DEFAULT_MONTHLY_BUDGET;
    }
  },

  // Create new budget
  createBudget: async (userId: string, data: BudgetFormData): Promise<Budget> => {
    try {
      const mongoBudget = await api.budgets.create({
        userId,
        category: data.category,
        amount: data.amount,
        period: data.period,
      });
      return convertMongoBudget(mongoBudget);
    } catch (error) {
      console.error("Error creating budget:", error);
      throw new Error("Failed to create budget");
    }
  },

  // Update budget
  updateBudget: async (id: string, userId: string, data: Partial<BudgetFormData>): Promise<Budget> => {
    try {
      const updateData: {
        category?: string;
        amount?: number;
        period?: "monthly" | "weekly" | "yearly";
      } = {};
      
      if (data.category !== undefined) updateData.category = data.category;
      if (data.amount !== undefined) updateData.amount = data.amount;
      if (data.period !== undefined) updateData.period = data.period;

      const mongoBudget = await api.budgets.update(id, userId, updateData);
      return convertMongoBudget(mongoBudget);
    } catch (error) {
      console.error("Error updating budget:", error);
      throw new Error("Failed to update budget");
    }
  },

  // Delete budget
  deleteBudget: async (id: string, userId: string): Promise<void> => {
    try {
      await api.budgets.delete(id, userId);
    } catch (error) {
      console.error("Error deleting budget:", error);
      throw new Error("Failed to delete budget");
    }
  },
};

