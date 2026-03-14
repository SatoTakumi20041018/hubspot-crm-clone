import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-[4px] px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-[#cfcccb] text-[#1f1f1f]",
        success: "bg-[#b9cdbe] text-[#00823a]",
        warning: "bg-[#ece6d9] text-[#8a6d00]",
        danger: "bg-[#fcc6b1] text-[#d9002b]",
        info: "bg-[#b2e9eb] text-[#2f7579]",
        purple: "bg-[#d7cdfc] text-[#5b3fc9]",
        orange: "bg-[#fcc6b1] text-[#ff4800]",
        pink: "bg-[#fbdbe9] text-[#b3295a]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <span
        className={cn(badgeVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge";

export { Badge, badgeVariants };
