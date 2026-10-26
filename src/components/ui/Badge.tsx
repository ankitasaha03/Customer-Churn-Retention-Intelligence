import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "critical" | "high" | "moderate" | "healthy" | "outline" | "cyan" | "indigo";
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = "default",
  children,
  ...props
}) => {
  const variantStyles = {
    default: "bg-slate-800 text-slate-200 border-slate-700",
    critical: "bg-rose-500/15 text-rose-400 border-rose-500/30",
    high: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    moderate: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
    healthy: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    outline: "bg-transparent text-slate-300 border-slate-700",
    cyan: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
    indigo: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
