import { cn } from "@/lib/utils";
import { JOB_TYPE_COLORS, JOB_TYPE_LABELS } from "@/lib/constants";
import type { JobType } from "@/lib/types";

interface BadgeProps {
  children?: React.ReactNode;
  jobType?: JobType;
  variant?: "default" | "success" | "warning" | "danger" | "muted";
  className?: string;
}

const variantClasses = {
  default: "bg-jb-primary-light text-jb-primary-dark",
  success: "bg-jb-success-light text-jb-success",
  warning: "bg-jb-warning-light text-jb-warning",
  danger: "bg-jb-danger-light text-jb-danger",
  muted: "bg-slate-100 text-slate-600",
};

export function Badge({ children, jobType, variant = "default", className }: BadgeProps) {
  const colors = jobType ? JOB_TYPE_COLORS[jobType] : null;
  const label = jobType ? JOB_TYPE_LABELS[jobType] : null;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        colors ? `${colors.bg} ${colors.text}` : variantClasses[variant],
        className
      )}
    >
      {children ?? label}
    </span>
  );
}
