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
        "rounded-lg border border-gray-200 bg-white p-6 shadow-sm",
        className
      )}
      {...props}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
        </div>
        {Icon && (
          <div className="rounded-lg bg-[#FFF1ED] p-2.5">
            <Icon className="h-5 w-5 text-[#FF7A59]" />
          </div>
        )}
      </div>
      {hasChange && (
        <div className="mt-3 flex items-center gap-1.5">
          <span
            className={cn(
              "inline-flex items-center gap-0.5 text-sm font-medium",
              isPositive ? "text-green-600" : "text-red-600"
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
            <span className="text-sm text-gray-500">{changeLabel}</span>
          )}
        </div>
      )}
    </div>
  );
}

export { StatsCard };
