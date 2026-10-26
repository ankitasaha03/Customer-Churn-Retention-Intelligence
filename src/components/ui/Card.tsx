import React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: "none" | "rose" | "cyan" | "indigo" | "emerald";
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, glow = "none", children, ...props }, ref) => {
    const glowClasses = {
      none: "",
      rose: "glow-rose border-rose-500/20",
      cyan: "glow-cyan border-cyan-500/20",
      indigo: "glow-indigo border-indigo-500/20",
      emerald: "glow-emerald border-emerald-500/20",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md shadow-xl transition-all duration-200",
          glowClasses[glow],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-5 border-b border-slate-800/80 flex flex-col gap-1.5", className)} {...props} />
  )
);
CardHeader.displayName = "CardHeader";

export const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-base font-semibold text-slate-100 tracking-tight", className)} {...props} />
  )
);
CardTitle.displayName = "CardTitle";

export const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-xs text-slate-400", className)} {...props} />
  )
);
CardDescription.displayName = "CardDescription";

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-5", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-4 border-t border-slate-800/80 bg-slate-950/30 flex items-center justify-between", className)} {...props} />
  )
);
CardFooter.displayName = "CardFooter";
