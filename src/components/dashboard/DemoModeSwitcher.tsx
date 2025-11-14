import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Database, User } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

interface DemoModeSwitcherProps {
  onSwitchToDemo: () => void;
  onSwitchToReal: () => void;
  isDemoMode: boolean;
}

export function DemoModeSwitcher({ onSwitchToDemo, onSwitchToReal, isDemoMode }: DemoModeSwitcherProps) {
  const [open, setOpen] = useState(false);

  const handleSwitch = () => {
    if (isDemoMode) {
      onSwitchToReal();
      toast.success('Switched to your personal account');
    } else {
      onSwitchToDemo();
      toast.success('Switched to demo mode with sample data');
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={isDemoMode ? "default" : "outline"} size="sm" className="gap-2">
          {isDemoMode ? <Database className="h-4 w-4" /> : <User className="h-4 w-4" />}
          {isDemoMode ? 'Demo Mode' : 'View Demo Data'}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isDemoMode ? 'Exit Demo Mode?' : 'Enter Demo Mode?'}
          </DialogTitle>
          <DialogDescription className="space-y-4 pt-4">
            {isDemoMode ? (
              <>
                <p>You're currently viewing demo data with sample transactions.</p>
                <p className="text-sm">
                  Switch back to see your personal account and transactions.
                </p>
              </>
            ) : (
              <>
                <p>Demo mode lets you explore the app with pre-populated sample data.</p>
                <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
                  <p className="font-semibold">Demo account includes:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>50 sample transactions</li>
                    <li>Multiple categories</li>
                    <li>Income and expense data</li>
                    <li>Last 90 days of history</li>
                  </ul>
                </div>
                <p className="text-sm text-muted-foreground">
                  Note: Changes made in demo mode won't affect your real data.
                </p>
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-2 justify-end mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSwitch}>
            {isDemoMode ? 'Switch to My Account' : 'View Demo Data'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
