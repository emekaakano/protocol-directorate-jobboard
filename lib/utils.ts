import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ARCHIVE_DAYS } from "./constants";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatSalary(min: number | null, max: number | null): string {
  if (!min && !max) return "Salary not specified";
  const fmt = (n: number) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(n);
  if (min && max) return `${fmt(min)} – ${fmt(max)}`;
  if (min) return `From ${fmt(min)}`;
  return `Up to ${fmt(max!)}`;
}

export function isExpired(postDate: Date | string): boolean {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - ARCHIVE_DAYS);
  return new Date(postDate) < cutoff;
}

export function daysUntilExpiry(postDate: Date | string): number {
  const expiry = new Date(postDate);
  expiry.setDate(expiry.getDate() + ARCHIVE_DAYS);
  const diff = expiry.getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength).trimEnd() + "…";
}
