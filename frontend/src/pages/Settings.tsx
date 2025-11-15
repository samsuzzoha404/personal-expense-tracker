import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { CURRENCIES, DATE_FORMATS, DEFAULT_MONTHLY_BUDGET, STORAGE_KEYS } from "@/constants";
import { Wallet, User as UserIcon, DollarSign, Save, Trash2, Settings as SettingsIcon, AlertTriangle } from "lucide-react";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
});

const budgetSchema = z.object({
  monthlyBudget: z.number().min(1, "Budget must be at least $1"),
});

type ProfileFormData = z.infer<typeof profileSchema>;
type BudgetFormData = z.infer<typeof budgetSchema>;

const Settings = () => {
  const { user, updateUser } = useAuth();
  const [currency, setCurrency] = useState(CURRENCIES[0].code);
  const [dateFormat, setDateFormat] = useState(DATE_FORMATS[0].value);
  const [isSaving, setIsSaving] = useState(false);

  // Profile form
  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  // Budget form
  const budgetForm = useForm<BudgetFormData>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      monthlyBudget: DEFAULT_MONTHLY_BUDGET,
    },
  });

  // Load settings from localStorage
  useEffect(() => {
    const settings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (settings) {
      try {
        const parsed = JSON.parse(settings);
        setCurrency(parsed.currency || CURRENCIES[0].code);
        setDateFormat(parsed.dateFormat || DATE_FORMATS[0].value);
      } catch (error) {
        console.error("Error loading settings:", error);
      }
    }

    // Load budget from MongoDB
    const loadBudget = async () => {
      if (!user?.id) return;
      try {
        const { budgetService } = await import("@/services/budgetService");
        const total = await budgetService.getTotalMonthlyBudget(user.id);
        budgetForm.setValue("monthlyBudget", total);
      } catch (error) {
        console.error("Error loading budgets:", error);
      }
    };
    
    loadBudget();
  }, [user, budgetForm]);

  const onProfileSubmit = async (data: ProfileFormData) => {
    setIsSaving(true);
    try {
      updateUser({ name: data.name, email: data.email });
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const onBudgetSubmit = async (data: BudgetFormData) => {
    if (!user?.id) {
      toast.error("User not authenticated");
      return;
    }

    setIsSaving(true);
    try {
      // Import budget service dynamically
      const { budgetService } = await import("@/services/budgetService");
      
      // First, get all existing budgets
      const existingBudgets = await budgetService.getAllBudgets(user.id);
      
      // Delete all existing monthly budgets
      for (const budget of existingBudgets.filter(b => b.period === "monthly")) {
        await budgetService.deleteBudget(budget.id, user.id);
      }
      
      // Create new total monthly budget
      await budgetService.createBudget(user.id, {
        category: "Total",
        amount: data.monthlyBudget,
        period: "monthly",
      });
      
      toast.success("Budget updated successfully");
    } catch (error) {
      console.error("Error updating budget:", error);
      toast.error("Failed to update budget");
    } finally {
      setIsSaving(false);
    }
  };

  const saveSettings = () => {
    const settings = {
      userId: user?.id,
      currency,
      dateFormat,
      theme: "system",
      notifications: true,
    };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    toast.success("Settings saved successfully");
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 top-1/4 -left-48 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute w-96 h-96 bottom-1/4 -right-48 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>

      <div className="relative z-10 p-4 md:p-8 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <div className="p-3 bg-gradient-primary rounded-xl">
            <SettingsIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">Settings</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your account and preferences
            </p>
          </div>
        </motion.div>

        {/* Profile Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <UserIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">Profile</h2>
                <p className="text-sm text-muted-foreground">Update your personal information</p>
              </div>
            </div>

          {/* Profile Picture */}
          {user?.avatar && (
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.avatar} alt={user.name || "User"} />
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-foreground">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                {user.avatar && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Profile picture from Google Account
                  </p>
                )}
              </div>
            </div>
          )}

          <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  {...profileForm.register("name")}
                  placeholder="John Doe"
                />
                {profileForm.formState.errors.name && (
                  <p className="text-sm text-destructive">
                    {profileForm.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...profileForm.register("email")}
                  placeholder="you@example.com"
                />
                {profileForm.formState.errors.email && (
                  <p className="text-sm text-destructive">
                    {profileForm.formState.errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <Button type="submit" disabled={isSaving} className="gap-2 gradient-primary hover-glow">
              <Save className="h-4 w-4" />
              {isSaving ? "Saving..." : "Save Profile"}
            </Button>
          </form>
          </Card>
        </motion.div>

        {/* Budget Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-success rounded-lg">
                <Wallet className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">Monthly Budget</h2>
                <p className="text-sm text-muted-foreground">Set your monthly spending limit</p>
              </div>
            </div>

          <form onSubmit={budgetForm.handleSubmit(onBudgetSubmit)} className="space-y-4">
            <div className="max-w-md space-y-2">
              <Label htmlFor="monthlyBudget">Monthly Budget Amount</Label>
              <Input
                id="monthlyBudget"
                type="number"
                step="0.01"
                {...budgetForm.register("monthlyBudget", { valueAsNumber: true })}
                placeholder="2000.00"
              />
              {budgetForm.formState.errors.monthlyBudget && (
                <p className="text-sm text-destructive">
                  {budgetForm.formState.errors.monthlyBudget.message}
                </p>
              )}
            </div>

            <Button type="submit" disabled={isSaving} className="gap-2 bg-success hover:bg-success/90 hover-glow">
              <Save className="h-4 w-4" />
              {isSaving ? "Saving..." : "Save Budget"}
            </Button>
          </form>
          </Card>
        </motion.div>

        {/* Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-warning rounded-lg">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">Preferences</h2>
                <p className="text-sm text-muted-foreground">Customize your app experience</p>
              </div>
            </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger id="currency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map((curr) => (
                      <SelectItem key={curr.code} value={curr.code}>
                        {curr.symbol} - {curr.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateFormat">Date Format</Label>
                <Select value={dateFormat} onValueChange={setDateFormat}>
                  <SelectTrigger id="dateFormat">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DATE_FORMATS.map((format) => (
                      <SelectItem key={format.value} value={format.value}>
                        {format.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={saveSettings} className="gap-2 bg-warning hover:bg-warning/90 hover-glow">
              <Save className="h-4 w-4" />
              Save Preferences
            </Button>
          </div>
          </Card>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 bg-card/80 backdrop-blur-sm border-2 border-destructive/50 hover:border-destructive transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-destructive rounded-lg">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-destructive">Danger Zone</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Irreversible actions - proceed with caution
                </p>
              </div>
            </div>

            <Separator className="my-4 bg-destructive/20" />

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-lg bg-destructive/5 border border-destructive/20">
                <div>
                  <p className="font-medium text-foreground flex items-center gap-2">
                    <Trash2 className="h-4 w-4" />
                    Clear all transactions
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Remove all transaction history from your account
                  </p>
                </div>
                <Button
                  variant="destructive"
                  className="hover-glow whitespace-nowrap"
                  onClick={() => {
                    if (confirm("Are you sure? This cannot be undone!")) {
                      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify([]));
                      toast.success("All transactions cleared");
                      window.location.reload();
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Data
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;
