import { useState } from "react";
import { Plus, Search, Filter, Download, Edit, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { AddExpenseDialog } from "@/components/dashboard/AddExpenseDialog";
import { useTransactions } from "@/contexts/TransactionContext";
import { formatCurrency, formatDate, exportToCSV } from "@/lib/utils";
import { ALL_CATEGORIES } from "@/constants";
import { Transaction } from "@/types";

const Transactions = () => {
  const { transactions, deleteTransaction } = useTransactions();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);

  // Filter transactions
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory =
      filterCategory === "all" || transaction.category === filterCategory;
    
    const matchesType =
      filterType === "all" || transaction.type === filterType;

    return matchesSearch && matchesCategory && matchesType;
  });

  const handleDelete = async () => {
    if (transactionToDelete) {
      try {
        await deleteTransaction(transactionToDelete);
        setDeleteDialogOpen(false);
        setTransactionToDelete(null);
      } catch (error) {
        console.error("Error deleting transaction:", error);
      }
    }
  };

  const handleExport = () => {
    exportToCSV(filteredTransactions);
  };

  const openDeleteDialog = (id: string) => {
    setTransactionToDelete(id);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 top-1/4 -left-48 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute w-96 h-96 bottom-1/4 -right-48 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>

      <div className="relative z-10 p-3 sm:p-4 md:p-6 lg:p-8 space-y-4 sm:space-y-5 md:space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col xs:flex-row items-stretch xs:items-center justify-between gap-3 sm:gap-4"
        >
          <div>
            <h1 className="text-2xl xs:text-3xl sm:text-3xl md:text-4xl font-bold text-foreground">Transactions</h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              View and manage all your transactions
            </p>
          </div>
          <div className="flex gap-2 w-full xs:w-auto">
            <Button
              variant="outline"
              size="lg"
              className="gap-2 flex-1 xs:flex-none hover-glow h-11 sm:h-12"
              onClick={handleExport}
              disabled={filteredTransactions.length === 0}
            >
              <Download className="h-4 w-4" />
              <span className="text-sm sm:text-base">Export</span>
            </Button>
            <AddExpenseDialog>
              <Button size="lg" className="gradient-primary hover-glow gap-2 flex-1 xs:flex-none group h-11 sm:h-12">
                <Plus className="h-4 w-4 sm:h-5 sm:w-5 group-hover:rotate-90 transition-transform" />
                <span className="text-sm sm:text-base">Add</span>
              </Button>
            </AddExpenseDialog>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-3 sm:p-4 md:p-5 lg:p-6 bg-card/80 backdrop-blur-sm border-border/50">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {/* Search */}
              <div className="sm:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search transactions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-11 bg-secondary/50 border-border/50 focus:border-primary transition-all text-sm"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="h-11 bg-secondary/50 border-border/50 focus:border-primary text-sm">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {ALL_CATEGORIES.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Type Filter */}
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="h-11 bg-secondary/50 border-border/50 focus:border-primary text-sm">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="expense">Expenses</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Active Filters */}
            {(searchQuery || filterCategory !== "all" || filterType !== "all") && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="flex flex-wrap gap-1.5 sm:gap-2 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-border/50"
              >
                <span className="text-xs sm:text-sm text-muted-foreground">Active filters:</span>
                {searchQuery && (
                  <Badge variant="secondary" className="gap-1">
                    Search: {searchQuery}
                  </Badge>
                )}
                {filterCategory !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    Category: {filterCategory}
                  </Badge>
                )}
                {filterType !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    Type: {filterType === "expense" ? "Expenses" : "Income"}
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setFilterCategory("all");
                    setFilterType("all");
                  }}
                  className="h-6 px-2 text-xs hover:text-primary"
                >
                  Clear all
                </Button>
              </motion.div>
            )}
          </Card>
        </motion.div>

        {/* Transactions Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-card/80 backdrop-blur-sm border-border/50 overflow-hidden">
            <div className="overflow-x-auto -mx-[1px]">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-border/50">
                    <TableHead className="font-semibold text-xs sm:text-sm min-w-[100px]">Date</TableHead>
                    <TableHead className="font-semibold text-xs sm:text-sm min-w-[150px]">Description</TableHead>
                    <TableHead className="font-semibold text-xs sm:text-sm min-w-[120px]">Category</TableHead>
                    <TableHead className="font-semibold text-xs sm:text-sm min-w-[100px]">Type</TableHead>
                    <TableHead className="text-right font-semibold text-xs sm:text-sm min-w-[100px]">Amount</TableHead>
                    <TableHead className="text-right font-semibold text-xs sm:text-sm min-w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((transaction, index) => (
                      <motion.tr
                        key={transaction.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.05 }}
                        className="border-border/50 hover:bg-secondary/30 transition-colors"
                      >
                        <TableCell className="font-medium text-xs sm:text-sm whitespace-nowrap">
                          {formatDate(transaction.date, "MMM dd, yyyy")}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-xs sm:text-sm">{transaction.description}</p>
                            {transaction.notes && (
                              <p className="text-[10px] xs:text-xs text-muted-foreground mt-1 line-clamp-1">
                                {transaction.notes}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-primary/30 bg-primary/5 text-xs whitespace-nowrap">
                            {transaction.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              transaction.type === "expense" ? "destructive" : "default"
                            }
                            className={`text-xs whitespace-nowrap ${transaction.type === "income" ? "bg-success hover:bg-success/80" : ""}`}
                          >
                            {transaction.type === "expense" ? "Expense" : "Income"}
                          </Badge>
                        </TableCell>
                        <TableCell
                          className={`text-right font-semibold text-xs sm:text-sm whitespace-nowrap ${
                            transaction.type === "expense"
                              ? "text-destructive"
                              : "text-success"
                          }`}
                        >
                          {transaction.type === "expense" ? "-" : "+"}
                          {formatCurrency(transaction.amount)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openDeleteDialog(transaction.id)}
                              className="hover:bg-destructive/10 hover:text-destructive transition-colors h-8 w-8 p-0"
                            >
                              <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 px-4">
                        <div className="text-muted-foreground text-xs sm:text-sm">
                          {transactions.length === 0
                            ? "No transactions yet. Add your first transaction!"
                            : "No transactions match your filters."}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </motion.div>

        {/* Summary */}
        {filteredTransactions.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex justify-center sm:justify-end gap-4 text-xs sm:text-sm px-2"
          >
            <div className="text-muted-foreground text-center sm:text-right">
              Showing {filteredTransactions.length} of {transactions.length} transactions
            </div>
          </motion.div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Transaction</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this transaction? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Transactions;
