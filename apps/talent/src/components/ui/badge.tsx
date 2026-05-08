import { cn } from "@/lib/utils";
import { type HTMLAttributes } from "react";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | "outline";
}

function Badge({ className, variant = "default", children, ...props }: BadgeProps) {
  const variants = {
    default: "bg-slate-800 text-slate-300 border-slate-700",
    primary: "bg-blue-900/50 text-blue-300 border-blue-800",
    secondary: "bg-emerald-900/50 text-emerald-300 border-emerald-800",
    success: "bg-emerald-900/50 text-emerald-300 border-emerald-800",
    warning: "bg-amber-900/50 text-amber-300 border-amber-800",
    danger: "bg-red-900/50 text-red-300 border-red-800",
    outline: "bg-transparent text-slate-300 border-slate-600",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-md border",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export { Badge };
