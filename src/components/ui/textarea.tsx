import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: boolean;
  errorMessage?: string;
  showCount?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, errorMessage, showCount = false, maxLength, id, value, defaultValue, onChange, ...props }, ref) => {
    const textareaId = id || React.useId();
    const [charCount, setCharCount] = React.useState(() => {
      const initial = (value ?? defaultValue ?? "") as string;
      return initial.length;
    });

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length);
      onChange?.(e);
    };

    // Sync with controlled value
    React.useEffect(() => {
      if (value !== undefined) {
        setCharCount((value as string).length);
      }
    }, [value]);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          className={cn(
            "flex min-h-[80px] w-full rounded-md border bg-white px-3 py-2 text-sm transition-colors placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50",
            error
              ? "border-red-500 focus-visible:ring-red-500"
              : "border-[rgba(0,0,0,0.11)] focus-visible:ring-[#2f7579] focus-visible:border-[#2f7579]",
            className
          )}
          maxLength={maxLength}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          aria-invalid={error || undefined}
          aria-describedby={errorMessage ? `${textareaId}-error` : undefined}
          {...props}
        />
        <div className="mt-1 flex items-center justify-between">
          {error && errorMessage ? (
            <p id={`${textareaId}-error`} className="text-sm text-red-600" role="alert">
              {errorMessage}
            </p>
          ) : (
            <span />
          )}
          {showCount && (
            <span className="text-xs text-gray-400">
              {charCount}
              {maxLength && `/${maxLength}`}
            </span>
          )}
        </div>
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
