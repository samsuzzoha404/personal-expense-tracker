import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, DollarSign, TrendingDown, TrendingUp, FileText, StickyNote, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useTransactions } from "@/contexts/TransactionContext";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, VALIDATION } from "@/constants";

const formSchema = z.object({
  description: z
    .string()
    .min(1, "Description is required")
    .max(VALIDATION.MAX_DESCRIPTION_LENGTH, `Description must be less than ${VALIDATION.MAX_DESCRIPTION_LENGTH} characters`),
  amount: z
    .number()
    .min(VALIDATION.MIN_AMOUNT, `Amount must be at least $${VALIDATION.MIN_AMOUNT}`)
    .max(VALIDATION.MAX_AMOUNT, `Amount must be less than $${VALIDATION.MAX_AMOUNT}`),
  category: z.string().min(1, "Category is required"),
  type: z.enum(["expense", "income"]),
  date: z.date(),
  notes: z
    .string()
    .max(VALIDATION.MAX_NOTES_LENGTH, `Notes must be less than ${VALIDATION.MAX_NOTES_LENGTH} characters`)
    .optional(),
});

type FormData = z.infer<typeof formSchema>;

interface AddExpenseDialogProps {
  children: React.ReactNode;
}

export const AddExpenseDialog = ({ children }: AddExpenseDialogProps) => {
  const [open, setOpen] = useState(false);
  const { addTransaction } = useTransactions();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      amount: 0,
      category: "",
      type: "expense",
      date: new Date(),
      notes: "",
    },
  });

  const selectedType = form.watch("type");
  const categories = selectedType === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  const onSubmit = async (data: FormData) => {
    try {
      await addTransaction({
        description: data.description,
        amount: data.amount,
        category: data.category,
        type: data.type,
        date: data.date,
        notes: data.notes,
      });
      form.reset();
      setOpen(false);
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header with Gradient */}
        <div className="bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10 p-4 sm:p-5 md:p-6 border-b border-border/50">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl font-bold flex items-center gap-1.5 sm:gap-2">
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </motion.div>
              Add New Transaction
            </DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              Track your financial activity with detailed information
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-4 sm:p-5 md:p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
              {/* Transaction Type - Enhanced with Toggle Style */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base font-semibold flex items-center gap-1.5 sm:gap-2">
                      <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                      Transaction Type
                    </FormLabel>
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.95 }}
                        onClick={() => field.onChange("expense")}
                        className={cn(
                          "flex items-center justify-center gap-1.5 sm:gap-2 p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all font-medium text-sm sm:text-base",
                          field.value === "expense"
                            ? "border-red-500 bg-red-500/10 text-red-600 dark:text-red-400"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5" />
                        Expense
                      </motion.button>
                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.95 }}
                        onClick={() => field.onChange("income")}
                        className={cn(
                          "flex items-center justify-center gap-1.5 sm:gap-2 p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all font-medium text-sm sm:text-base",
                          field.value === "income"
                            ? "border-green-500 bg-green-500/10 text-green-600 dark:text-green-400"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
                        Income
                      </motion.button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel className="font-semibold text-sm sm:text-base">Description</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., Grocery shopping" 
                          {...field}
                          className="h-10 sm:h-11 bg-secondary/50 text-sm sm:text-base"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Amount */}
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base">
                        <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                        Amount
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <DollarSign className="absolute left-2.5 sm:left-3 top-2.5 sm:top-3 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            className="h-10 sm:h-11 pl-8 sm:pl-10 bg-secondary/50 text-base sm:text-lg font-semibold"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Category */}
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-sm sm:text-base">Category</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-10 sm:h-11 bg-secondary/50 text-sm sm:text-base">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.name}>
                              <span className="flex items-center gap-2">
                                <span 
                                  className="w-3 h-3 rounded-full" 
                                  style={{ backgroundColor: category.color }}
                                />
                                {category.name}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Date */}
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="font-semibold flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base">
                      <CalendarIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                      Date
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full h-10 sm:h-11 pl-2.5 sm:pl-3 text-left font-normal bg-secondary/50 text-sm sm:text-base",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-3.5 w-3.5 sm:h-4 sm:w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Notes */}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base">
                      <StickyNote className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                      Notes (Optional)
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add any additional details..."
                        className="resize-none bg-secondary/50 min-h-[70px] sm:min-h-[80px] text-sm sm:text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Buttons */}
              <div className="flex gap-2 sm:gap-3 pt-3 sm:pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 h-10 sm:h-11 text-sm sm:text-base"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 h-10 sm:h-11 gradient-primary hover-glow font-semibold text-sm sm:text-base" 
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="mr-1.5 sm:mr-2"
                      >
                        <DollarSign className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </motion.div>
                      <span className="text-sm sm:text-base">Adding...</span>
                    </>
                  ) : (
                    "Add Transaction"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
