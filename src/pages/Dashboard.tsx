import { useEffect, useState } from "react";
import { Plus, Wallet, TrendingUp, DollarSign, ArrowUpRight, ArrowDownRight, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import SummaryCard from "@/components/dashboard/SummaryCard";
import TransactionItem from "@/components/dashboard/TransactionItem";
import { AddExpenseDialog } from "@/components/dashboard/AddExpenseDialog";
import { useAuth } from "@/contexts/AuthContext";
import { useTransactions } from "@/contexts/TransactionContext";
import { dashboardService } from "@/services/dashboardService";
import { DashboardSummary } from "@/types";
import { formatCurrency } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const CHART_COLORS = ['#5B9CFF', '#A78BFA', '#EC4899', '#F59E0B', '#10B981', '#EF4444'];

const Dashboard = () => {
  const { user } = useAuth();
  const { transactions } = useTransactions();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadDashboardData = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const data = await dashboardService.getDashboardSummary(user.id);
      setSummary(data);
    } catch (error) {
      console.error("Error loading dashboard:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, transactions]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </motion.div>
      </div>
    );
  }

  const chartData = summary?.transactionsByCategory.slice(0, 6).map((cat, index) => ({
    category: cat.category,
    amount: cat.amount,
    fill: CHART_COLORS[index % CHART_COLORS.length],
  })) || [];

  const budgetPercentage = summary
    ? Math.round((summary.totalExpenses / summary.monthlyBudget) * 100)
    : 0;

  const budgetVariant = budgetPercentage >= 90 ? "destructive" : budgetPercentage >= 70 ? "default" : "success";

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 -top-48 -left-48 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute w-96 h-96 -bottom-48 -right-48 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>

      <div className="relative z-10 p-4 md:p-8 space-y-6 md:space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              Dashboard
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Welcome back, <span className="text-primary font-medium">{user?.name || "User"}</span>! 👋
            </p>
          </div>
          <AddExpenseDialog>
            <Button size="lg" className="gradient-primary hover-glow gap-2 w-full sm:w-auto group">
              <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform" />
              Add Transaction
            </Button>
          </AddExpenseDialog>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <SummaryCard
            title="Total Spent (Month)"
            amount={formatCurrency(summary?.totalExpenses || 0)}
            icon={Wallet}
            variant="default"
            index={0}
          />
          <SummaryCard
            title="Monthly Budget"
            amount={formatCurrency(summary?.monthlyBudget || 0)}
            icon={TrendingUp}
            variant={budgetVariant}
            index={1}
          />
          <SummaryCard
            title="Budget Remaining"
            amount={formatCurrency(summary?.budgetRemaining || 0)}
            icon={DollarSign}
            variant={summary && summary.budgetRemaining > 0 ? "success" : "destructive"}
            index={2}
          />
        </div>

        {/* Budget Progress */}
        {summary && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-4 md:p-6 bg-card/80 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Budget Usage</h3>
                    <p className="text-2xl font-bold mt-1">{budgetPercentage}%</p>
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
                    budgetPercentage >= 90 ? 'bg-destructive/10 text-destructive' :
                    budgetPercentage >= 70 ? 'bg-yellow-500/10 text-yellow-500' :
                    'bg-success/10 text-success'
                  }`}>
                    {budgetPercentage >= 90 ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
                    <span className="text-sm font-medium">
                      {budgetPercentage >= 90 ? 'High' : budgetPercentage >= 70 ? 'Medium' : 'Good'}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-secondary/50 rounded-full h-4 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(budgetPercentage, 100)}%` }}
                    transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
                    className={`h-4 rounded-full transition-all relative overflow-hidden ${
                      budgetPercentage >= 90
                        ? "gradient-destructive"
                        : budgetPercentage >= 70
                        ? "gradient-warning"
                        : "gradient-success"
                    }`}
                  >
                    <div className="absolute inset-0 shimmer"></div>
                  </motion.div>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Spent: {formatCurrency(summary.totalExpenses)}</span>
                  <span>Budget: {formatCurrency(summary.monthlyBudget)}</span>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Main Content - Charts and Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Bar Chart Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-4 md:p-6 bg-card/80 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all h-full">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h2 className="text-lg md:text-xl font-semibold text-foreground">
                  Top Expenses
                </h2>
                <div className="p-2 bg-primary/10 rounded-lg">
                  <TrendingDown className="w-5 h-5 text-primary" />
                </div>
              </div>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis
                      dataKey="category"
                      stroke="hsl(var(--muted-foreground))"
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "0.5rem",
                        color: "hsl(var(--foreground))",
                      }}
                      formatter={(value: number) => formatCurrency(value)}
                    />
                    <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex flex-col items-center justify-center text-muted-foreground">
                  <Wallet className="w-12 h-12 mb-4 opacity-50" />
                  <p className="text-center">No expense data available.<br />Add your first transaction!</p>
                </div>
              )}
            </Card>
          </motion.div>

          {/* Recent Transactions Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-4 md:p-6 bg-card/80 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all h-full">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h2 className="text-lg md:text-xl font-semibold text-foreground">
                  Recent Transactions
                </h2>
                <div className="p-2 bg-primary/10 rounded-lg">
                  <ArrowUpRight className="w-5 h-5 text-primary" />
                </div>
              </div>
              {summary && summary.recentTransactions.length > 0 ? (
                <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                  {summary.recentTransactions.map((transaction, index) => (
                    <motion.div
                      key={transaction.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.05 }}
                    >
                      <TransactionItem
                        description={transaction.description}
                        category={transaction.category}
                        amount={`${transaction.type === "expense" ? "-" : "+"}${formatCurrency(transaction.amount)}`}
                      />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
                  <TrendingUp className="w-12 h-12 mb-4 opacity-50" />
                  <p className="text-center">No transactions yet.<br />Start tracking your expenses!</p>
                </div>
              )}
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: hsl(var(--secondary));
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: hsl(var(--primary));
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--primary) / 0.8);
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
