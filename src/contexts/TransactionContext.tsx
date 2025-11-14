import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Transaction, TransactionFormData, TransactionFilters } from "@/types";
import { transactionService } from "@/services/transactionService";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

interface TransactionContextType {
  transactions: Transaction[];
  isLoading: boolean;
  addTransaction: (data: TransactionFormData) => Promise<void>;
  updateTransaction: (id: string, data: Partial<TransactionFormData>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  filterTransactions: (filters: TransactionFilters) => Promise<void>;
  refreshTransactions: () => Promise<void>;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error("useTransactions must be used within a TransactionProvider");
  }
  return context;
};

interface TransactionProviderProps {
  children: ReactNode;
}

export const TransactionProvider: React.FC<TransactionProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadTransactions = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const data = await transactionService.getAllTransactions(user.id);
      setTransactions(data);
    } catch (error) {
      console.error("Error loading transactions:", error);
      toast.error("Failed to load transactions");
    } finally {
      setIsLoading(false);
    }
  };

  // Load transactions when user is authenticated
  useEffect(() => {
    if (user?.id) {
      loadTransactions();
    } else {
      setTransactions([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const addTransaction = async (data: TransactionFormData): Promise<void> => {
    if (!user?.id) {
      console.error('❌ User not authenticated, user:', user);
      throw new Error("User not authenticated");
    }

    console.log('👤 Current user ID:', user.id);
    console.log('📤 Adding transaction for user:', user.id);
    
    setIsLoading(true);
    try {
      const newTransaction = await transactionService.createTransaction(user.id, data);
      setTransactions((prev) => [newTransaction, ...prev]);
      toast.success("Transaction added successfully");
    } catch (error) {
      console.error("Error adding transaction:", error);
      toast.error("Failed to add transaction");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateTransaction = async (
    id: string,
    data: Partial<TransactionFormData>
  ): Promise<void> => {
    if (!user?.id) throw new Error("User not authenticated");
    
    setIsLoading(true);
    try {
      const updatedTransaction = await transactionService.updateTransaction(id, user.id, data);
      setTransactions((prev) =>
        prev.map((t) => (t.id === id ? updatedTransaction : t))
      );
      toast.success("Transaction updated successfully");
    } catch (error) {
      console.error("Error updating transaction:", error);
      toast.error("Failed to update transaction");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTransaction = async (id: string): Promise<void> => {
    if (!user?.id) throw new Error("User not authenticated");
    
    setIsLoading(true);
    try {
      await transactionService.deleteTransaction(id, user.id);
      setTransactions((prev) => prev.filter((t) => t.id !== id));
      toast.success("Transaction deleted successfully");
    } catch (error) {
      console.error("Error deleting transaction:", error);
      toast.error("Failed to delete transaction");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const filterTransactions = async (filters: TransactionFilters): Promise<void> => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const filtered = await transactionService.filterTransactions(user.id, filters);
      setTransactions(filtered);
    } catch (error) {
      console.error("Error filtering transactions:", error);
      toast.error("Failed to filter transactions");
    } finally {
      setIsLoading(false);
    }
  };

  const refreshTransactions = async (): Promise<void> => {
    await loadTransactions();
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        isLoading,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        filterTransactions,
        refreshTransactions,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
