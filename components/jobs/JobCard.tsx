import Link from "next/link";
import { MapPin, Clock } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatSalary, daysUntilExpiry } from "@/lib/utils";
import type { JobType } from "@/lib/types";

export interface ListingCardData {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  salaryMin: number | null;
  salaryMax: number | null;
  postDate: string;
  applicationDeadline: string | null;
}

function companyInitials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

const COMPANY_COLORS = [
  "bg-blue-600",
  "bg-violet-600",
  "bg-emerald-600",
  "bg-amber-600",
  "bg-rose-600",
  "bg-cyan-600",
  "bg-indigo-600",
  "bg-teal-600",
];

function companyColor(name: string): string {
  const idx =
    name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) %
    COMPANY_COLORS.length;
  return COMPANY_COLORS[idx];
}

export function JobCard({ listing }: { listing: ListingCardData }) {
  const days = daysUntilExpiry(listing.postDate);
  const expiringSoon = days <= 5;

  return (
    <Link
      href={`/jobs/${listing.id}`}
      className="group block rounded-2xl bg-white p-5 ring-1 ring-jb-border shadow-sm hover:shadow-md hover:ring-jb-primary/30 transition-all duration-200"
    >
      <div className="flex items-start gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white font-bold text-sm ${companyColor(listing.company)}`}
        >
          {companyInitials(listing.company)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h2 className="font-semibold text-jb-text group-hover:text-jb-primary transition-colors line-clamp-2 leading-snug">
              {listing.title}
            </h2>
            <Badge jobType={listing.type as JobType} className="shrink-0" />
          </div>
          <p className="mt-0.5 text-sm font-medium text-jb-text-muted">
            {listing.company}
          </p>
        </div>
      </div>

      <p className="mt-3 text-sm text-jb-text-muted line-clamp-2 leading-relaxed">
        {listing.description}
      </p>

      <div className="mt-4 flex items-center justify-between gap-3 text-xs text-jb-text-muted">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <MapPin size={12} className="shrink-0" />
            {listing.location}
          </span>
          {(listing.salaryMin || listing.salaryMax) && (
            <span className="hidden sm:block font-medium text-jb-text">
              {formatSalary(listing.salaryMin, listing.salaryMax)}
            </span>
          )}
        </div>

        {listing.applicationDeadline ? (
          <span className={`flex items-center gap-1 ${
            new Date(listing.applicationDeadline) <= new Date(Date.now() + 7 * 86400000)
              ? "text-jb-danger font-medium"
              : ""
          }`}>
            <Clock size={12} className="shrink-0" />
            Closes {new Date(listing.applicationDeadline).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
          </span>
        ) : (
          <span className={`flex items-center gap-1 ${expiringSoon ? "text-jb-danger font-medium" : ""}`}>
            <Clock size={12} className="shrink-0" />
            {expiringSoon ? `${days}d left` : `${days} days left`}
          </span>
        )}
      </div>
    </Link>
  );
}
