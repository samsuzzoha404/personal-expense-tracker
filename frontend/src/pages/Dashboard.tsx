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

      <div className="relative z-10 p-3 sm:p-4 md:p-6 lg:p-8 space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col xs:flex-row items-stretch xs:items-center justify-between gap-3 sm:gap-4"
        >
          <div className="space-y-1">
            <h1 className="text-2xl xs:text-3xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent tracking-tight">
              Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Welcome back, <span className="text-primary font-semibold">{user?.name || "User"}</span>! 👋
            </p>
          </div>
          <AddExpenseDialog>
            <Button size="lg" className="gradient-primary hover-glow gap-2 w-full xs:w-auto group shadow-lg shadow-primary/20 h-11 sm:h-12">
              <Plus className="h-4 w-4 sm:h-5 sm:w-5 group-hover:rotate-90 transition-transform" />
              <span className="text-sm sm:text-base">Add Transaction</span>
            </Button>
          </AddExpenseDialog>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
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
            <Card className="p-4 sm:p-5 md:p-6 bg-card backdrop-blur-sm border border-border/60 hover:border-primary/40 hover:shadow-xl transition-all">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-2 xs:gap-0">
                  <div className="space-y-1">
                    <h3 className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wide">Budget Usage</h3>
                    <p className="text-2xl sm:text-3xl font-bold tracking-tight">{budgetPercentage}%</p>
                  </div>
                  <div className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl border-2 ${
                    budgetPercentage >= 90 ? 'bg-destructive/10 text-destructive border-destructive/20' :
                    budgetPercentage >= 70 ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                    'bg-success/10 text-success border-success/20'
                  }`}>
                    {budgetPercentage >= 90 ? <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4" /> : <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />}
                    <span className="text-xs sm:text-sm font-semibold">
                      {budgetPercentage >= 90 ? 'High' : budgetPercentage >= 70 ? 'Medium' : 'Good'}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-secondary rounded-full h-4 sm:h-5 overflow-hidden border border-border/40 shadow-inner">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(budgetPercentage, 100)}%` }}
                    transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
                    className={`h-4 sm:h-5 rounded-full transition-all relative overflow-hidden shadow-md ${
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
                <div className="flex justify-between text-xs sm:text-sm font-medium pt-1 sm:pt-2">
                  <div className="space-y-0.5">
                    <p className="text-[10px] xs:text-xs text-muted-foreground uppercase tracking-wide">Spent</p>
                    <p className="text-foreground text-xs sm:text-sm">{formatCurrency(summary.totalExpenses)}</p>
                  </div>
                  <div className="space-y-0.5 text-right">
                    <p className="text-[10px] xs:text-xs text-muted-foreground uppercase tracking-wide">Budget</p>
                    <p className="text-foreground text-xs sm:text-sm">{formatCurrency(summary.monthlyBudget)}</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Main Content - Charts and Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
          {/* Bar Chart Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-3 sm:p-4 md:p-5 lg:p-6 bg-card backdrop-blur-sm border border-border/60 hover:border-primary/40 hover:shadow-xl transition-all h-full">
              <div className="flex items-center justify-between mb-4 sm:mb-5 md:mb-6">
                <div className="space-y-0.5 sm:space-y-1">
                  <h2 className="text-base sm:text-lg md:text-xl font-bold text-foreground tracking-tight">
                    Top Expenses
                  </h2>
                  <p className="text-[10px] xs:text-xs text-muted-foreground">Your highest spending categories</p>
                </div>
                <div className="p-2 sm:p-2.5 md:p-3 bg-gradient-to-br from-destructive/10 to-destructive/5 rounded-lg sm:rounded-xl border border-destructive/20">
                  <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-destructive" />
                </div>
              </div>
              {chartData.length > 0 ? (
                <div className="bg-gradient-to-br from-muted/30 to-muted/10 rounded-lg p-2 sm:p-3 md:p-4 border border-border/40 overflow-x-auto">
                  <ResponsiveContainer width="100%" height={250} className="sm:!h-[280px] md:!h-[300px]">
                    <BarChart data={chartData} margin={{ top: 10, right: 5, left: -10, bottom: 60 }}>
                      <defs>
                        {chartData.map((entry, index) => (
                          <linearGradient key={`gradient-${index}`} id={`colorGradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={entry.fill} stopOpacity={0.9} />
                            <stop offset="95%" stopColor={entry.fill} stopOpacity={0.6} />
                          </linearGradient>
                        ))}
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.2} vertical={false} />
                      <XAxis
                        dataKey="category"
                        stroke="hsl(var(--muted-foreground))"
                        tick={{ fill: "hsl(var(--foreground))", fontSize: 10, fontWeight: 500 }}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        axisLine={{ stroke: "hsl(var(--border))", strokeWidth: 1 }}
                      />
                      <YAxis
                        stroke="hsl(var(--muted-foreground))"
                        tick={{ fill: "hsl(var(--foreground))", fontSize: 10, fontWeight: 500 }}
                        axisLine={{ stroke: "hsl(var(--border))", strokeWidth: 1 }}
                        tickFormatter={(value) => `$${value}`}
                        width={40}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "0.5rem",
                          color: "hsl(var(--foreground))",
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                          padding: "8px",
                          fontSize: "12px",
                        }}
                        formatter={(value: number) => [formatCurrency(value), "Amount"]}
                        labelStyle={{ fontWeight: 600, marginBottom: "4px", fontSize: "11px" }}
                      />
                      <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} maxBarSize={50}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={`url(#colorGradient-${index})`} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[250px] sm:h-[280px] md:h-[300px] flex flex-col items-center justify-center text-muted-foreground bg-muted/20 rounded-lg border border-dashed border-border px-4">
                  <div className="p-3 sm:p-4 bg-muted/40 rounded-full mb-3 sm:mb-4">
                    <Wallet className="w-10 h-10 sm:w-12 sm:h-12 opacity-50" />
                  </div>
                  <p className="text-center font-medium text-sm sm:text-base">No expense data available.</p>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1 text-center">Add your first transaction to see insights!</p>
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
            <Card className="p-3 sm:p-4 md:p-5 lg:p-6 bg-card backdrop-blur-sm border border-border/60 hover:border-primary/40 hover:shadow-xl transition-all h-full">
              <div className="flex items-center justify-between mb-4 sm:mb-5 md:mb-6">
                <div className="space-y-0.5 sm:space-y-1">
                  <h2 className="text-base sm:text-lg md:text-xl font-bold text-foreground tracking-tight">
                    Recent Transactions
                  </h2>
                  <p className="text-[10px] xs:text-xs text-muted-foreground">Your latest financial activity</p>
                </div>
                <div className="p-2 sm:p-2.5 md:p-3 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg sm:rounded-xl border border-primary/20">
                  <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                </div>
              </div>
              {summary && summary.recentTransactions.length > 0 ? (
                <div className="space-y-1.5 sm:space-y-2 max-h-[250px] sm:max-h-[280px] md:max-h-[300px] overflow-y-auto custom-scrollbar pr-1 sm:pr-2">
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
                <div className="flex flex-col items-center justify-center h-[180px] sm:h-[200px] text-muted-foreground bg-muted/20 rounded-lg border border-dashed border-border px-4">
                  <div className="p-3 sm:p-4 bg-muted/40 rounded-full mb-3 sm:mb-4">
                    <TrendingUp className="w-10 h-10 sm:w-12 sm:h-12 opacity-50" />
                  </div>
                  <p className="text-center font-medium text-sm sm:text-base">No transactions yet.</p>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1 text-center">Start tracking your expenses!</p>
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
