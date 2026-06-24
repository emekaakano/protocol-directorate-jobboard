import { notFound } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  Briefcase,
  Clock,
  Mail,
  ArrowLeft,
  CalendarDays,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatSalary, formatDate, daysUntilExpiry, daysUntilDate, isExpired } from "@/lib/utils";
import type { JobType } from "@/lib/types";

interface Props {
  params: { id: string };
}

export default async function JobDetailPage({ params }: Props) {
  const listing = await prisma.jobListing.findUnique({
    where: { id: params.id, deletedAt: null },
  });

  if (!listing || isExpired(listing.postDate)) notFound();

  const days = listing.applicationDeadline
    ? daysUntilDate(listing.applicationDeadline)
    : daysUntilExpiry(listing.postDate);
  const expiringSoon = days <= 7;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-jb-text-muted hover:text-jb-text transition-colors"
      >
        <ArrowLeft size={16} />
        Back to listings
      </Link>

      <div className="rounded-2xl bg-white p-5 sm:p-8 ring-1 ring-jb-border shadow-sm">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-black text-jb-text">{listing.title}</h1>
            <p className="mt-1 text-lg font-semibold text-jb-text-muted">
              {listing.company}
            </p>
          </div>
          <Badge jobType={listing.type as JobType} className="text-sm px-3 py-1" />
        </div>

        {/* Meta */}
        <div className="mt-5 flex flex-wrap gap-5 text-sm text-jb-text-muted border-t border-jb-border pt-5">
          <span className="flex items-center gap-1.5">
            <MapPin size={15} />
            {listing.location}
          </span>
          <span className="flex items-center gap-1.5">
            <Briefcase size={15} />
            {(listing.salaryMin || listing.salaryMax)
              ? formatSalary(listing.salaryMin, listing.salaryMax)
              : "Salary not specified"}
          </span>
          <span className="flex items-center gap-1.5">
            <CalendarDays size={15} />
            Posted {formatDate(listing.postDate)}
          </span>
          <span
            className={`flex items-center gap-1.5 ${
              expiringSoon ? "text-jb-danger font-semibold" : ""
            }`}
          >
            <Clock size={15} />
            {expiringSoon
              ? `Closing in ${days} day${days !== 1 ? "s" : ""}!`
              : `${days} days remaining`}
          </span>
        </div>

        {/* Description */}
        <div className="mt-8">
          <h2 className="mb-3 text-base font-bold text-jb-text">
            About this role
          </h2>
          <p className="text-sm leading-relaxed text-jb-text-muted whitespace-pre-line break-words">
            {listing.description}
          </p>
        </div>

        {/* Requirements */}
        <div className="mt-8">
          <h2 className="mb-3 text-base font-bold text-jb-text">
            Requirements
          </h2>
          <p className="text-sm leading-relaxed text-jb-text-muted whitespace-pre-line break-words">
            {listing.requirements}
          </p>
        </div>

        {/* Application deadline callout */}
        {listing.applicationDeadline && (
          <div className="mt-8 flex items-center gap-3 rounded-xl border border-jb-border bg-jb-muted px-5 py-4">
            <CalendarDays size={18} className="shrink-0 text-jb-text-muted" />
            <div>
              <span className="text-sm font-semibold text-jb-text">Application Deadline: </span>
              <span className="text-sm text-jb-text-muted">
                {new Date(listing.applicationDeadline).toLocaleDateString("en-GB", {
                  weekday: "long", day: "numeric", month: "long", year: "numeric",
                })}
              </span>
            </div>
          </div>
        )}

        {/* Apply */}
        {(() => {
          const apply = listing.howToApply;
          const isUrl = apply
            ? (() => { try { new URL(apply); return true; } catch { return false; } })()
            : false;
          const href = apply
            ? isUrl
              ? apply
              : `mailto:${apply}?subject=Application: ${listing.title}`
            : `mailto:${listing.contactEmail}?subject=Application: ${listing.title}`;
          const label = apply
            ? isUrl ? "Apply Now" : "Apply via Email"
            : "Apply via Email";

          return (
            <div className="mt-4 rounded-xl bg-jb-primary-light p-5 flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className="font-semibold text-jb-text">Interested in this role?</p>
                <p className="text-sm text-jb-text-muted mt-0.5">
                  {apply && isUrl
                    ? "Submit your application through the link below."
                    : <>Send your CV and cover letter to{" "}<span className="font-medium text-jb-primary">{apply ?? listing.contactEmail}</span></>
                  }
                </p>
              </div>
              <a href={href} target={isUrl ? "_blank" : undefined} rel={isUrl ? "noopener noreferrer" : undefined}>
                <Button>
                  <Mail size={16} />
                  {label}
                </Button>
              </a>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
