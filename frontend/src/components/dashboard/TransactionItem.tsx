import { Badge } from "@/components/ui/badge";

interface TransactionItemProps {
  description: string;
  category: string;
  amount: string;
}

const TransactionItem = ({ description, category, amount }: TransactionItemProps) => {
  const isNegative = amount.startsWith("-");

  return (
    <div className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-muted/50 transition-all border border-border/40 hover:border-primary/30 hover:shadow-sm group">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">{description}</p>
        <div className="flex items-center gap-2 mt-1.5">
          <Badge variant="outline" className="text-xs font-medium bg-muted/50">
            {category}
          </Badge>
        </div>
      </div>
      <div className="ml-4 flex-shrink-0">
        <p
          className={`text-sm font-bold ${
            isNegative ? "text-destructive" : "text-success"
          }`}
        >
          {amount}
        </p>
      </div>
    </div>
  );
};

export default TransactionItem;
