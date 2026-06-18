import type { JobType } from "./types";

export const ARCHIVE_DAYS = 30;
export const PAGE_SIZE = 12;

export const JOB_TYPE_LABELS: Record<JobType, string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACT: "Contract",
  INTERNSHIP: "Internship",
  REMOTE: "Remote",
};

export const JOB_TYPE_COLORS: Record<
  JobType,
  { bg: string; text: string; border: string }
> = {
  FULL_TIME: {
    bg: "bg-jb-primary-light",
    text: "text-jb-primary-dark",
    border: "border-jb-primary/20",
  },
  PART_TIME: {
    bg: "bg-violet-50",
    text: "text-violet-700",
    border: "border-violet-200",
  },
  CONTRACT: {
    bg: "bg-jb-warning-light",
    text: "text-jb-warning",
    border: "border-amber-200",
  },
  INTERNSHIP: {
    bg: "bg-jb-success-light",
    text: "text-jb-success",
    border: "border-emerald-200",
  },
  REMOTE: {
    bg: "bg-slate-100",
    text: "text-slate-600",
    border: "border-slate-200",
  },
};

export const JOB_TYPE_OPTIONS = Object.entries(JOB_TYPE_LABELS).map(
  ([value, label]) => ({ value: value as JobType, label })
);

export const AUDIT_ACTIONS = {
  LOGIN: "admin.login",
  LOGOUT: "admin.logout",
  CREATE_LISTING: "listing.create",
  UPDATE_LISTING: "listing.update",
  DELETE_LISTING: "listing.delete",
} as const;
