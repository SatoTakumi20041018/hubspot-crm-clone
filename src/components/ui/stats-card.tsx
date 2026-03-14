import * as React from "react";
import { ArrowUp, ArrowDown, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StatsCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: LucideIcon;
}

function StatsCard({
  label,
  value,
  change,
  changeLabel,
  icon: Icon,
  className,
  ...props
}: StatsCardProps) {
  const isPositive = change !== undefined && change >= 0;
  const hasChange = change !== undefined;

  return (
    <div
      className={cn(
        "rounded-[16px] border border-[rgba(0,0,0,0.11)] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)]",
        className
      )}
      {...props}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-[rgba(0,0,0,0.62)]">{label}</p>
          <p className="mt-1 text-2xl font-bold text-[#1f1f1f]">{value}</p>
        </div>
        {Icon && (
          <div className="rounded-[8px] bg-[#fcc6b1] p-2.5">
            <Icon className="h-5 w-5 text-[#ff4800]" />
          </div>
        )}
      </div>
      {hasChange && (
        <div className="mt-3 flex items-center gap-1.5">
          <span
            className={cn(
              "inline-flex items-center gap-0.5 text-sm font-medium",
              isPositive ? "text-[#00823a]" : "text-[#d9002b]"
            )}
          >
            {isPositive ? (
              <ArrowUp className="h-3.5 w-3.5" />
            ) : (
              <ArrowDown className="h-3.5 w-3.5" />
            )}
            {Math.abs(change)}%
          </span>
          {changeLabel && (
            <span className="text-sm text-[rgba(0,0,0,0.62)]">{changeLabel}</span>
          )}
        </div>
      )}
    </div>
  );
}

export { StatsCard };
