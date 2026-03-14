import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-[8px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-[#ff4800] text-white hover:bg-[#c93700] active:bg-[#9f2800] focus-visible:ring-[#2f7579]",
        secondary:
          "bg-[#f8f5ee] text-[#1f1f1f] hover:bg-[#ece6d9] focus-visible:ring-[#2f7579]",
        outline:
          "border border-[rgba(0,0,0,0.11)] bg-white text-[#1f1f1f] hover:bg-[#fcfcfa] focus-visible:ring-[#2f7579]",
        ghost:
          "text-[#1f1f1f] hover:bg-[#f8f5ee] focus-visible:ring-[#2f7579]",
        destructive:
          "bg-[#d9002b] text-white hover:bg-[#b30024] focus-visible:ring-[#d9002b]",
      },
      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading = false, disabled, children, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
