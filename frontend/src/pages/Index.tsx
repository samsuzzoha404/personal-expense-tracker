import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Wallet,
  TrendingUp,
  PieChart,
  Shield,
  Smartphone,
  Zap,
  BarChart3,
  Target,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  LogOut,
  Settings,
  LayoutDashboard,
  User,
} from "lucide-react";

const Index = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const features = [
    {
      icon: Wallet,
      title: "Smart Expense Tracking",
      description: "Effortlessly track every transaction with our intuitive interface and smart categorization.",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: BarChart3,
      title: "Visual Analytics",
      description: "Understand your spending patterns with beautiful charts and insightful analytics.",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: Target,
      title: "Budget Goals",
      description: "Set realistic budgets and track your progress towards financial freedom.",
      gradient: "from-orange-500 to-red-500",
    },
    {
      icon: TrendingUp,
      title: "Real-time Insights",
      description: "Get instant feedback on your financial health with live dashboard updates.",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your financial data is encrypted and stored securely with Firebase authentication.",
      gradient: "from-indigo-500 to-blue-500",
    },
    {
      icon: Smartphone,
      title: "Responsive Design",
      description: "Access your finances anywhere, anytime with our mobile-friendly interface.",
      gradient: "from-pink-500 to-rose-500",
    },
  ];

  const stats = [
    { label: "Active Users", value: "10K+", icon: Sparkles },
    { label: "Transactions Tracked", value: "1M+", icon: Zap },
    { label: "Money Saved", value: "$50M+", icon: TrendingUp },
    { label: "Average Rating", value: "4.9★", icon: CheckCircle2 },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 -top-48 -left-48 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute w-96 h-96 -bottom-48 -right-48 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-border/50 backdrop-blur-lg bg-background/50">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-1.5 sm:gap-2"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/10 border-2 border-primary/30 flex items-center justify-center hover:scale-105 transition-transform">
                <Wallet className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </div>
              <span className="text-base sm:text-xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                ExpenseFlow
              </span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-1.5 sm:gap-2 md:gap-3"
            >
              <ThemeToggle />
              {user ? (
                <>
                  <Link to="/dashboard">
                    <Button variant="ghost" size="sm" className="gap-1.5 sm:gap-2 h-9 sm:h-10 text-sm sm:text-base px-2 sm:px-3">
                      <LayoutDashboard className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span className="hidden xs:inline">Dashboard</span>
                    </Button>
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-accent transition-colors cursor-pointer">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={user?.avatar} alt={user?.name || "User"} />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {user?.name?.charAt(0).toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium hidden sm:inline">
                          {user?.name || "User"}
                        </span>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/settings")}>
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" size="lg">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button size="lg" className="gradient-primary">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-3 sm:px-4 pt-12 sm:pt-16 md:pt-20 pb-16 sm:pb-24 md:pb-32">
        <div className="max-w-5xl mx-auto text-center space-y-5 sm:space-y-6 md:space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs sm:text-sm font-medium"
          >
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Your Financial Journey Starts Here</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight px-2 sm:px-0"
          >
            Master Your Money with{" "}
            <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Smart Tracking
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4 sm:px-0"
          >
            Take control of your finances with our intelligent expense tracker. 
            Visualize spending, set budgets, and achieve your financial goals with ease.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col xs:flex-row gap-3 sm:gap-4 justify-center items-stretch xs:items-center px-4 sm:px-0"
          >
            <Link to="/signup" className="w-full xs:w-auto">
              <Button size="lg" className="gradient-primary text-sm sm:text-base md:text-lg px-6 sm:px-8 py-5 sm:py-6 hover-glow group w-full xs:w-auto">
                Start Free Today
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/login" className="w-full xs:w-auto">
              <Button size="lg" variant="outline" className="text-sm sm:text-base md:text-lg px-6 sm:px-8 py-5 sm:py-6 w-full xs:w-auto">
                <PieChart className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                View Demo
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 pt-8 sm:pt-10 md:pt-12 px-2 sm:px-0"
          >
            {stats.map((stat, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-1.5 sm:gap-2 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-card/50 backdrop-blur-sm border border-border/50"
              >
                <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                <div className="text-2xl sm:text-3xl font-bold">{stat.value}</div>
                <div className="text-xs sm:text-sm text-muted-foreground text-center">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 container mx-auto px-3 sm:px-4 py-12 sm:py-16 md:py-20">
        <div className="text-center space-y-3 sm:space-y-4 mb-10 sm:mb-12 md:mb-16 px-2 sm:px-0">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl xs:text-3xl sm:text-4xl md:text-5xl font-bold"
          >
            Everything You Need to{" "}
            <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              Succeed
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-2 sm:px-0"
          >
            Powerful features designed to help you achieve your financial goals
          </motion.p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 px-2 sm:px-0">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-4 sm:p-5 md:p-6 h-full hover-glow bg-card/50 backdrop-blur-sm border-border/50 group cursor-pointer">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-1.5 sm:mb-2">{feature.title}</h3>
                <p className="text-sm sm:text-base text-muted-foreground">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 container mx-auto px-3 sm:px-4 py-12 sm:py-16 md:py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-2xl sm:rounded-3xl p-8 sm:p-10 md:p-12 lg:p-16 text-center mx-2 sm:mx-0"
        >
          <div className="absolute inset-0 gradient-animated opacity-90"></div>
          <div className="relative z-10 space-y-4 sm:space-y-5 md:space-y-6">
            <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-white px-2 sm:px-0">
              Ready to Transform Your Finances?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-2xl mx-auto px-4 sm:px-0">
              Join thousands of users who have taken control of their financial future
            </p>
            <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 justify-center items-stretch xs:items-center pt-2 sm:pt-4 px-4 sm:px-0">
              <Link to="/signup" className="w-full xs:w-auto">
                <Button size="lg" variant="secondary" className="text-sm sm:text-base md:text-lg px-6 sm:px-8 py-5 sm:py-6 bg-white text-primary hover:bg-white/90 w-full xs:w-auto">
                  Create Free Account
                  <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 backdrop-blur-lg bg-background/50 mt-12 sm:mt-16 md:mt-20">
        <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary/10 border-2 border-primary/30 flex items-center justify-center">
                <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </div>
              <span className="font-semibold text-sm sm:text-base">ExpenseFlow</span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground text-center">
              © 2025 ExpenseFlow. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
