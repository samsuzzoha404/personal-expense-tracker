import { DashboardSummary } from "@/types";
import { transactionService } from "./transactionService";
import { budgetService } from "./budgetService";
import { calculateDashboardSummary } from "@/lib/utils";

export const dashboardService = {
  // Get dashboard summary
  getDashboardSummary: async (userId: string): Promise<DashboardSummary> => {
    try {
      const [transactions, monthlyBudget] = await Promise.all([
        transactionService.getAllTransactions(userId),
        budgetService.getTotalMonthlyBudget(userId),
      ]);

      return calculateDashboardSummary(transactions, monthlyBudget);
    } catch (error) {
      console.error("Error fetching dashboard summary:", error);
      throw error;
    }
  },
};
