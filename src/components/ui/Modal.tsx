"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: "md" | "lg" | "xl" | "2xl" | "drawer";
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = "lg",
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isDrawer = size === "drawer";

  const sizeStyles = {
    md: "max-w-md",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    "2xl": "max-w-5xl",
    drawer: "max-w-2xl w-full h-full rounded-none ml-auto",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={cn(
          "w-full bg-slate-900 border border-slate-800 text-slate-100 shadow-2xl relative flex flex-col overflow-hidden max-h-[96vh]",
          isDrawer
            ? "fixed right-0 top-0 bottom-0 h-full max-h-screen border-l border-slate-800 animate-in slide-in-from-right duration-300"
            : "rounded-xl",
          sizeStyles[size]
        )}
      >
        {(title || description) && (
          <div className="flex items-start justify-between p-6 border-b border-slate-800 bg-slate-950/40">
            <div>
              {title && <h2 className="text-xl font-bold tracking-tight text-white">{title}</h2>}
              {description && <p className="text-sm text-slate-400 mt-1">{description}</p>}
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
};
