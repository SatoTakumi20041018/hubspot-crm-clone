"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

function Modal({ open, onClose, children, className }: ModalProps) {
  React.useEffect(() => {
    if (!open) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Content */}
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative z-50 w-full max-w-lg rounded-lg border border-gray-200 bg-white shadow-xl animate-modal-in",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}

function ModalHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-start justify-between p-6 pb-0", className)}
      {...props}
    >
      <div className="flex-1">{children}</div>
    </div>
  );
}

export interface ModalCloseButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClose: () => void;
}

function ModalCloseButton({ onClose, className, ...props }: ModalCloseButtonProps) {
  return (
    <button
      type="button"
      onClick={onClose}
      className={cn(
        "absolute right-4 top-4 rounded-sm p-1 text-gray-400 transition-colors hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1",
        className
      )}
      aria-label="Close"
      {...props}
    >
      <X className="h-4 w-4" />
    </button>
  );
}

function ModalTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn("text-lg font-semibold text-gray-900", className)}
      {...props}
    />
  );
}

function ModalDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("mt-1 text-sm text-gray-500", className)}
      {...props}
    />
  );
}

function ModalBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-6", className)} {...props} />
  );
}

function ModalFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center justify-end gap-3 border-t border-gray-200 px-6 py-4",
        className
      )}
      {...props}
    />
  );
}

export { Modal, ModalHeader, ModalCloseButton, ModalTitle, ModalDescription, ModalBody, ModalFooter };
