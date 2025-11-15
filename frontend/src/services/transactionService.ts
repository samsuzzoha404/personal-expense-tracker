import { Transaction, TransactionFormData, TransactionFilters } from "@/types";
import api from "./api";

// MongoDB Transaction type
interface MongoTransaction {
  _id: string;
  userId: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string;
  notes?: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

// Helper function to convert MongoDB transaction to app Transaction type
const convertMongoTransaction = (mongoTx: MongoTransaction): Transaction => {
  return {
    id: mongoTx._id,
    userId: mongoTx.userId,
    type: mongoTx.type,
    amount: mongoTx.amount,
    category: mongoTx.category,
    description: mongoTx.description || "",
    notes: mongoTx.notes || undefined,
    date: new Date(mongoTx.date),
    createdAt: new Date(mongoTx.createdAt),
    updatedAt: new Date(mongoTx.updatedAt),
  };
};

// CRUD Operations using MongoDB backend
export const transactionService = {
  // Get all transactions for a user
  getAllTransactions: async (userId: string): Promise<Transaction[]> => {
    try {
      console.log('📡 Fetching transactions for userId:', userId);
      const mongoTransactions = await api.transactions.getAll(userId);
      console.log('✅ Received transactions:', mongoTransactions.length);
      return mongoTransactions.map(convertMongoTransaction);
    } catch (error) {
      console.error("❌ Error fetching transactions:", error);
      throw new Error("Failed to fetch transactions from server");
    }
  },

  // Get transaction by ID
  getTransactionById: async (id: string, userId: string): Promise<Transaction | null> => {
    try {
      const mongoTransaction = await api.transactions.getById(id, userId);
      return mongoTransaction ? convertMongoTransaction(mongoTransaction) : null;
    } catch (error) {
      console.error("Error fetching transaction:", error);
      return null;
    }
  },

  // Create new transaction
  createTransaction: async (
    userId: string,
    data: TransactionFormData
  ): Promise<Transaction> => {
    try {
      console.log('🔍 Creating transaction with userId:', userId);
      console.log('📝 Transaction data:', data);
      
      const mongoTransaction = await api.transactions.create({
        userId,
        type: data.type,
        amount: data.amount,
        category: data.category,
        description: data.description || "",
        notes: data.notes,
        date: data.date.toISOString(),
      });
      
      console.log('✅ Transaction created:', mongoTransaction);
      return convertMongoTransaction(mongoTransaction);
    } catch (error) {
      console.error("❌ Error creating transaction:", error);
      throw new Error("Failed to create transaction");
    }
  },

  // Update transaction
  updateTransaction: async (
    id: string,
    userId: string,
    data: Partial<TransactionFormData>
  ): Promise<Transaction> => {
    try {
      const updateData: {
        type?: "income" | "expense";
        amount?: number;
        category?: string;
        description?: string;
        notes?: string;
        date?: string;
      } = {};
      
      if (data.type !== undefined) updateData.type = data.type;
      if (data.amount !== undefined) updateData.amount = data.amount;
      if (data.category !== undefined) updateData.category = data.category;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.notes !== undefined) updateData.notes = data.notes;
      if (data.date !== undefined) updateData.date = data.date.toISOString();

      const mongoTransaction = await api.transactions.update(id, userId, updateData);
      return convertMongoTransaction(mongoTransaction);
    } catch (error) {
      console.error("Error updating transaction:", error);
      throw new Error("Failed to update transaction");
    }
  },

  // Delete transaction
  deleteTransaction: async (id: string, userId: string): Promise<void> => {
    try {
      await api.transactions.delete(id, userId);
    } catch (error) {
      console.error("Error deleting transaction:", error);
      throw new Error("Failed to delete transaction");
    }
  },

  // Filter transactions
  filterTransactions: async (
    userId: string,
    filters: TransactionFilters
  ): Promise<Transaction[]> => {
    try {
      // Build API filters
      const apiFilters: {
        category?: string;
        startDate?: string;
        endDate?: string;
      } = {};
      
      if (filters.category) {
        apiFilters.category = filters.category;
      }
      
      if (filters.startDate) {
        apiFilters.startDate = filters.startDate.toISOString();
      }
      
      if (filters.endDate) {
        apiFilters.endDate = filters.endDate.toISOString();
      }

      // Get filtered transactions from API
      const transactions = await api.transactions.getAll(userId, apiFilters);
      let convertedTransactions = transactions.map(convertMongoTransaction);

      // Apply client-side filters that API doesn't support
      if (filters.type && filters.type !== "all") {
        convertedTransactions = convertedTransactions.filter(
          (t) => t.type === filters.type
        );
      }

      if (filters.minAmount !== undefined) {
        convertedTransactions = convertedTransactions.filter(
          (t) => t.amount >= filters.minAmount!
        );
      }

      if (filters.maxAmount !== undefined) {
        convertedTransactions = convertedTransactions.filter(
          (t) => t.amount <= filters.maxAmount!
        );
      }

      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        convertedTransactions = convertedTransactions.filter(
          (t) =>
            t.description.toLowerCase().includes(query) ||
            t.category.toLowerCase().includes(query) ||
            t.notes?.toLowerCase().includes(query)
        );
      }

      return convertedTransactions;
    } catch (error) {
      console.error("Error filtering transactions:", error);
      throw new Error("Failed to filter transactions");
    }
  },

  // Get transaction statistics
  getStats: async (userId: string, startDate?: Date, endDate?: Date): Promise<{
    totalIncome: number;
    totalExpenses: number;
    balance: number;
    categoryBreakdown: Record<string, number>;
  }> => {
    try {
      const filters: {
        startDate?: string;
        endDate?: string;
      } = {};
      if (startDate) filters.startDate = startDate.toISOString();
      if (endDate) filters.endDate = endDate.toISOString();
      
      return await api.transactions.getStats(userId, filters);
    } catch (error) {
      console.error("Error fetching stats:", error);
      throw new Error("Failed to fetch statistics");
    }
  },
};
