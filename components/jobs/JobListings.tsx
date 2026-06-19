"use client";

import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import { JobCard, type ListingCardData } from "./JobCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Briefcase } from "lucide-react";
import { JOB_TYPE_LABELS } from "@/lib/constants";
import type { JobType } from "@/lib/types";
import { cn } from "@/lib/utils";

const ALL_TYPES = [
  { value: "", label: "All" },
  ...Object.entries(JOB_TYPE_LABELS).map(([value, label]) => ({ value, label })),
];

interface JobListingsProps {
  listings: ListingCardData[];
}

export function JobListings({ listings }: JobListingsProps) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<JobType | "">("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return listings.filter((l) => {
      const matchesSearch =
        !q ||
        l.title.toLowerCase().includes(q) ||
        l.company.toLowerCase().includes(q) ||
        l.location.toLowerCase().includes(q);
      const matchesType = !typeFilter || l.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [listings, search, typeFilter]);

  return (
    <div>
      {/* Hero */}
      <div className="bg-white border-b border-jb-border">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-black text-jb-text">
            Find Your Next Role
          </h1>
          <p className="mt-2 text-jb-text-muted">
            {listings.length} active listing{listings.length !== 1 ? "s" : ""} ·
            auto-archived after 30 days
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
        {/* Type filter pills */}
        <div className="flex flex-wrap gap-2 mb-7">
          {ALL_TYPES.map((t) => (
            <button
              key={t.value}
              onClick={() => setTypeFilter(t.value as JobType | "")}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                typeFilter === t.value
                  ? "bg-jb-primary text-white"
                  : "bg-white border border-jb-border text-jb-text-muted hover:border-jb-primary hover:text-jb-primary"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Results count */}
        {(search || typeFilter) && (
          <p className="mb-4 text-sm text-jb-text-muted">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            {search && (
              <>
                {" "}
                for <span className="font-medium text-jb-text">&ldquo;{search}&rdquo;</span>
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
                onClick={() => {
                  setSearch("");
                  setTypeFilter("");
                }}
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
