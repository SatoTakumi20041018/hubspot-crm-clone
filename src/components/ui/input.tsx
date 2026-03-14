import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

const inputVariants = cva(
  "flex w-full rounded-[4px] border bg-white px-3 py-2 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[rgba(0,0,0,0.38)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border-[rgba(0,0,0,0.11)] focus-visible:ring-[#2f7579] focus-visible:border-[#2f7579]",
        search:
          "border-[rgba(0,0,0,0.11)] pl-10 focus-visible:ring-[#2f7579] focus-visible:border-[#2f7579]",
      },
      error: {
        true: "border-[#d9002b] focus-visible:ring-[#d9002b] focus-visible:border-[#d9002b]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  label?: string;
  error?: boolean;
  errorMessage?: string;
  helperText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, error, label, errorMessage, helperText, id, ...props }, ref) => {
    const inputId = id || React.useId();

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-sm font-medium text-[#1f1f1f]"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {variant === "search" && (
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[rgba(0,0,0,0.38)]" />
          )}
          <input
            id={inputId}
            className={cn(inputVariants({ variant, error, className }))}
            ref={ref}
            aria-invalid={error || undefined}
            aria-describedby={
              errorMessage
                ? `${inputId}-error`
                : helperText
                  ? `${inputId}-helper`
                  : undefined
            }
            {...props}
          />
        </div>
        {error && errorMessage && (
          <p id={`${inputId}-error`} className="mt-1 text-sm text-[#d9002b]" role="alert">
            {errorMessage}
          </p>
        )}
        {!error && helperText && (
          <p id={`${inputId}-helper`} className="mt-1 text-sm text-[rgba(0,0,0,0.62)]">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input, inputVariants };
