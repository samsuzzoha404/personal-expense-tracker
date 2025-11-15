import { ReactNode } from "react";
import { DollarSign } from "lucide-react";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-1 text-4xl font-bold">
            <span className="text-foreground">Expen</span>
            <DollarSign className="h-8 w-8 text-primary" />
            <span className="text-foreground">e</span>
          </div>
        </div>
        
        <div className="bg-card rounded-lg shadow-xl p-8 border border-border">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
