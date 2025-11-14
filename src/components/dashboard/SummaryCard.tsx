import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { AnimatedCounter } from "./AnimatedCounter";

interface SummaryCardProps {
  title: string;
  amount: string;
  icon: LucideIcon;
  variant?: "default" | "success" | "destructive";
  index?: number;
}

const SummaryCard = ({ title, amount, icon: Icon, variant = "default", index = 0 }: SummaryCardProps) => {
  const getGradientClass = () => {
    if (variant === "success") return "gradient-success";
    if (variant === "destructive") return "gradient-destructive";
    return "gradient-primary";
  };

  const getAmountColor = () => {
    if (variant === "success") return "text-success";
    if (variant === "destructive") return "text-destructive";
    return "text-foreground";
  };

  // Extract numeric value from amount string (remove $ and commas)
  const numericValue = parseFloat(amount.replace(/[$,]/g, ''));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="relative group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-xl blur-xl group-hover:blur-2xl transition-all opacity-0 group-hover:opacity-100"></div>
      <Card className="relative p-6 bg-card/80 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-full blur-3xl"></div>
        
        <div className="relative flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <p className="text-sm text-muted-foreground font-medium tracking-wide">{title}</p>
            <p className={`text-3xl md:text-4xl font-bold ${getAmountColor()}`}>
              {!isNaN(numericValue) ? (
                <>
                  $<AnimatedCounter value={numericValue} />
                </>
              ) : (
                amount
              )}
            </p>
          </div>
          <motion.div
            className={`p-4 ${getGradientClass()} rounded-xl shadow-lg`}
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <Icon className="h-6 w-6 text-white" />
          </motion.div>
        </div>

        {/* Subtle shine effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      </Card>
    </motion.div>
  );
};

export default SummaryCard;
