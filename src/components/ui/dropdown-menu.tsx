"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface DropdownMenuContextValue {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  close: () => void;
}

const DropdownMenuContext = React.createContext<DropdownMenuContextValue | null>(null);

function useDropdownMenu() {
  const context = React.useContext(DropdownMenuContext);
  if (!context) {
    throw new Error("DropdownMenu components must be used within a DropdownMenu");
  }
  return context;
}

export interface DropdownMenuProps {
  children: React.ReactNode;
}

function DropdownMenu({ children }: DropdownMenuProps) {
  const [open, setOpen] = React.useState(false);
  const close = React.useCallback(() => setOpen(false), []);

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen, close }}>
      <div className="relative inline-block text-left">{children}</div>
    </DropdownMenuContext.Provider>
  );
}

export interface DropdownMenuTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const DropdownMenuTrigger = React.forwardRef<HTMLButtonElement, DropdownMenuTriggerProps>(
  ({ className, onClick, children, ...props }, ref) => {
    const { open, setOpen } = useDropdownMenu();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      setOpen((prev) => !prev);
      onClick?.(e);
    };

    return (
      <button
        ref={ref}
        className={cn("inline-flex items-center", className)}
        onClick={handleClick}
        aria-expanded={open}
        aria-haspopup="menu"
        type="button"
        {...props}
      >
        {children}
      </button>
    );
  }
);
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

export interface DropdownMenuContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  align?: "left" | "right";
  sideOffset?: number;
}

const DropdownMenuContent = React.forwardRef<HTMLDivElement, DropdownMenuContentProps>(
  ({ className, align = "right", children, ...props }, ref) => {
    const { open, close } = useDropdownMenu();
    const contentRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      if (!open) return;

      const handleClickOutside = (e: MouseEvent) => {
        if (contentRef.current && !contentRef.current.closest(".relative")?.contains(e.target as Node)) {
          close();
        }
      };

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") close();
      };

      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("keydown", handleEscape);
      };
    }, [open, close]);

    if (!open) return null;

    return (
      <div
        ref={contentRef}
        role="menu"
        className={cn(
          "absolute z-50 mt-1 min-w-[180px] overflow-hidden rounded-md border border-gray-200 bg-white py-1 shadow-lg animate-slide-down",
          align === "right" ? "right-0" : "left-0",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
DropdownMenuContent.displayName = "DropdownMenuContent";

export interface DropdownMenuItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  destructive?: boolean;
}

const DropdownMenuItem = React.forwardRef<HTMLButtonElement, DropdownMenuItemProps>(
  ({ className, destructive = false, onClick, children, ...props }, ref) => {
    const { close } = useDropdownMenu();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
      close();
    };

    return (
      <button
        ref={ref}
        role="menuitem"
        className={cn(
          "flex w-full items-center px-3 py-2 text-sm transition-colors hover:bg-gray-100 focus:bg-gray-100 focus:outline-none",
          destructive ? "text-red-600 hover:bg-red-50" : "text-gray-700",
          className
        )}
        onClick={handleClick}
        type="button"
        {...props}
      >
        {children}
      </button>
    );
  }
);
DropdownMenuItem.displayName = "DropdownMenuItem";

function DropdownMenuSeparator({ className }: { className?: string }) {
  return (
    <div
      role="separator"
      className={cn("my-1 h-px bg-gray-200", className)}
    />
  );
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
};
