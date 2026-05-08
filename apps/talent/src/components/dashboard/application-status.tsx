import { cn } from "@/lib/utils";
import { CheckCircle, Clock, XCircle, FileText, AlertCircle } from "lucide-react";

type ApplicationStatus =
  | "pending_review"
  | "approved"
  | "rejected"
  | "draft"
  | null;

interface ApplicationStatusProps {
  status: ApplicationStatus;
}

const statusConfig = {
  draft: {
    icon: FileText,
    title: "Profile Draft",
    description:
      "Your profile is saved as a draft. Complete all required fields and submit for review.",
    className: "border-slate-700 bg-slate-800/50",
    iconColor: "#94a3b8",
    badge: "Draft",
    badgeClass: "bg-slate-700 text-slate-300",
  },
  pending_review: {
    icon: Clock,
    title: "Under Review",
    description:
      "Your profile is being reviewed by our team. This usually takes 2-5 business days.",
    className: "border-amber-800/50 bg-amber-900/10",
    iconColor: "#F59E0B",
    badge: "Pending Review",
    badgeClass: "bg-amber-900/50 text-amber-300",
  },
  approved: {
    icon: CheckCircle,
    title: "Profile Approved",
    description:
      "Congratulations! Your profile is live and visible to companies on the platform.",
    className: "border-emerald-800/50 bg-emerald-900/10",
    iconColor: "#10B981",
    badge: "Approved",
    badgeClass: "bg-emerald-900/50 text-emerald-300",
  },
  rejected: {
    icon: XCircle,
    title: "Profile Not Approved",
    description:
      "Your profile needs some updates before it can be approved. Please check the feedback and resubmit.",
    className: "border-red-800/50 bg-red-900/10",
    iconColor: "#EF4444",
    badge: "Not Approved",
    badgeClass: "bg-red-900/50 text-red-300",
  },
};

export function ApplicationStatus({ status }: ApplicationStatusProps) {
  if (!status) return null;

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={cn("rounded-xl border p-5 flex items-start gap-4", config.className)}>
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: `${config.iconColor}20` }}
      >
        <Icon className="w-5 h-5" style={{ color: config.iconColor }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-sm font-semibold text-slate-100">
            {config.title}
          </h3>
          <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", config.badgeClass)}>
            {config.badge}
          </span>
        </div>
        <p className="text-sm text-slate-400 mt-1">{config.description}</p>
      </div>
      {status === "rejected" && (
        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
      )}
    </div>
  );
}
