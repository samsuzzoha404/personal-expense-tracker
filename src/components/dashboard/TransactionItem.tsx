import { Badge } from "@/components/ui/badge";

interface TransactionItemProps {
  description: string;
  category: string;
  amount: string;
}

const TransactionItem = ({ description, category, amount }: TransactionItemProps) => {
  const isNegative = amount.startsWith("-");

  return (
    <div className="flex items-center justify-between py-3 px-2 rounded-lg hover:bg-secondary/50 transition-colors border-b border-border last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{description}</p>
        <div className="flex items-center gap-2 mt-1">
          <Badge variant="outline" className="text-xs">
            {category}
          </Badge>
        </div>
      </div>
      <div className="ml-4">
        <p
          className={`text-sm font-semibold ${
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
