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
import { formatSalary, formatDate, daysUntilExpiry, isExpired } from "@/lib/utils";
import type { JobType } from "@/lib/types";

interface Props {
  params: { id: string };
}

export default async function JobDetailPage({ params }: Props) {
  const listing = await prisma.jobListing.findUnique({
    where: { id: params.id, deletedAt: null },
  });

  if (!listing || isExpired(listing.postDate)) notFound();

  const days = daysUntilExpiry(listing.postDate);
  const expiringSoon = days <= 5;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-jb-text-muted hover:text-jb-text transition-colors"
      >
        <ArrowLeft size={16} />
        Back to listings
      </Link>

      <div className="rounded-2xl bg-white p-8 ring-1 ring-jb-border shadow-sm">
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
          <p className="text-sm leading-relaxed text-jb-text-muted whitespace-pre-line">
            {listing.description}
          </p>
        </div>

        {/* Requirements */}
        <div className="mt-8">
          <h2 className="mb-3 text-base font-bold text-jb-text">
            Requirements
          </h2>
          <p className="text-sm leading-relaxed text-jb-text-muted whitespace-pre-line">
            {listing.requirements}
          </p>
        </div>

        {/* Apply */}
        <div className="mt-8 rounded-xl bg-jb-primary-light p-5 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="font-semibold text-jb-text">Interested in this role?</p>
            <p className="text-sm text-jb-text-muted mt-0.5">
              Send your CV and cover letter to{" "}
              <span className="font-medium text-jb-primary">
                {listing.contactEmail}
              </span>
            </p>
          </div>
          <a href={`mailto:${listing.contactEmail}?subject=Application: ${listing.title}`}>
            <Button>
              <Mail size={16} />
              Apply via Email
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
