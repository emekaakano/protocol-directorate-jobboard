"use client";

import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import { JobCard, type ListingCardData } from "./JobCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Briefcase } from "lucide-react";
import { JOB_TYPE_LABELS } from "@/lib/constants";
import { daysUntilExpiry, daysUntilDate } from "@/lib/utils";
import type { JobType } from "@/lib/types";
import { cn } from "@/lib/utils";

type ActiveFilter = JobType | "recent" | "expiring" | "";

const TYPE_PILLS = [
  { value: "" as const, label: "All" },
  ...Object.entries(JOB_TYPE_LABELS).map(([value, label]) => ({ value: value as JobType, label })),
];

const QUICK_PILLS: { value: "recent" | "expiring"; label: string }[] = [
  { value: "recent", label: "Recent Jobs" },
  { value: "expiring", label: "About to Expire" },
];

interface JobListingsProps {
  listings: ListingCardData[];
}

export function JobListings({ listings }: JobListingsProps) {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>("");

  function toggleFilter(value: ActiveFilter) {
    setActiveFilter((prev) => (prev === value ? "" : value));
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    const now = Date.now();
    return listings.filter((l) => {
      const matchesSearch =
        !q ||
        l.title.toLowerCase().includes(q) ||
        l.company.toLowerCase().includes(q) ||
        l.location.toLowerCase().includes(q);
      const daysSincePosted = Math.floor((now - new Date(l.postDate).getTime()) / 86400000);
      const daysLeft = l.applicationDeadline
        ? daysUntilDate(l.applicationDeadline)
        : daysUntilExpiry(l.postDate);
      const matchesFilter =
        !activeFilter ? true :
        activeFilter === "recent" ? daysSincePosted <= 7 :
        activeFilter === "expiring" ? daysLeft <= 7 :
        l.type === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [listings, search, activeFilter]);

  function pillStyle(value: ActiveFilter) {
    const isActive = activeFilter === value;
    if (!isActive) {
      return "bg-white border border-jb-border text-jb-text-muted hover:border-jb-primary hover:text-jb-primary";
    }
    if (value === "expiring") return "bg-jb-danger text-white border border-jb-danger";
    if (value === "recent") return "bg-jb-success text-white border border-jb-success";
    return "bg-jb-primary text-white border border-jb-primary";
  }

  return (
    <div>
      {/* Hero */}
      <div className="bg-white border-b border-jb-border">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-black text-jb-text">Find Your Next Role</h1>
          <p className="mt-2 text-jb-text-muted">
            {listings.length} active listing{listings.length !== 1 ? "s" : ""} ·
            countdown based on application deadline
          </p>

          {/* Search */}
          <div className="mt-5 relative max-w-2xl">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-jb-text-muted"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by title, company or location…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-12 w-full rounded-2xl border border-jb-border bg-jb-muted pl-10 pr-10 text-sm text-jb-text placeholder:text-jb-text-muted focus:outline-none focus:ring-2 focus:ring-jb-primary focus:bg-white transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-jb-text-muted hover:text-jb-text"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Single filter row — type pills + quick filters */}
        <div className="flex flex-wrap items-center gap-2 mb-7">
          {TYPE_PILLS.map((t) => (
            <button
              key={t.value}
              onClick={() => toggleFilter(t.value)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                pillStyle(t.value)
              )}
            >
              {t.label}
            </button>
          ))}

          {/* Divider */}
          <span className="h-5 w-px bg-jb-border mx-1 self-center" aria-hidden />

          {QUICK_PILLS.map((q) => (
            <button
              key={q.value}
              onClick={() => toggleFilter(q.value)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                pillStyle(q.value)
              )}
            >
              {q.label}
            </button>
          ))}
        </div>

        {/* Results count */}
        {(search || activeFilter) && (
          <p className="mb-4 text-sm text-jb-text-muted">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            {search && (
              <>
                {" "}for{" "}
                <span className="font-medium text-jb-text">&ldquo;{search}&rdquo;</span>
              </>
            )}
          </p>
        )}

        {/* Grid */}
        {filtered.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="No listings match your search"
            description="Try different keywords or clear the filters."
            action={
              <button
                onClick={() => { setSearch(""); setActiveFilter(""); }}
                className="text-sm font-medium text-jb-primary hover:underline"
              >
                Clear filters
              </button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((listing) => (
              <JobCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
