import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string;
    positive?: boolean;
  };
  icon: LucideIcon;
  iconColor?: string;
  description?: string;
  className?: string;
}

export function StatsCard({
  title,
  value,
  change,
  icon: Icon,
  iconColor = "#1B4FD8",
  description,
  className,
}: StatsCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-slate-800 bg-slate-900 p-5",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-slate-400 truncate">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          {change && (
            <p
              className={cn(
                "text-xs mt-1 font-medium",
                change.positive ? "text-emerald-400" : "text-red-400"
              )}
            >
              {change.positive ? "↑" : "↓"} {change.value}
            </p>
          )}
          {description && (
            <p className="text-xs text-slate-500 mt-1">{description}</p>
          )}
        </div>
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ml-3"
          style={{ backgroundColor: `${iconColor}20` }}
        >
          <Icon className="w-5 h-5" style={{ color: iconColor }} />
        </div>
      </div>
    </div>
  );
}
