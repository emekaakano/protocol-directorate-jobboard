import Link from "next/link";
import { PlusCircle, Pencil, Trash2, AlertTriangle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatDate, daysUntilExpiry, isExpired } from "@/lib/utils";
import type { JobType } from "@/lib/types";

export default async function AdminDashboardPage() {
  const allListings = await prisma.jobListing.findMany({
    where: { deletedAt: null },
    orderBy: { postDate: "desc" },
  });

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const active = allListings.filter((l) => !isExpired(l.postDate));
  const expired = allListings.filter((l) => isExpired(l.postDate));
  const expiringSoon = active.filter((l) => daysUntilExpiry(l.postDate) <= 7);

  const thisMonthStart = new Date();
  thisMonthStart.setDate(1);
  thisMonthStart.setHours(0, 0, 0, 0);
  const thisMonth = allListings.filter((l) => l.postDate >= thisMonthStart);

  const stats = [
    { label: "Active Listings", value: active.length, color: "text-jb-success" },
    { label: "Expiring in 7 Days", value: expiringSoon.length, color: "text-jb-warning" },
    { label: "Archived This Cycle", value: expired.length, color: "text-jb-text-muted" },
    { label: "Posted This Month", value: thisMonth.length, color: "text-jb-primary" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Demo banner */}
      <div className="mb-6 flex items-center gap-3 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
        <AlertTriangle size={16} className="shrink-0" />
        <span>
          <strong>Demo mode</strong> — this page is publicly visible. Authentication
          and route protection coming in Phase 2.
        </span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap mb-8">
        <div>
          <h1 className="text-3xl font-black text-jb-text">Admin Dashboard</h1>
          <p className="mt-1 text-jb-text-muted">Manage job listings</p>
        </div>
        <Link href="/admin/jobs/new">
          <Button>
            <PlusCircle size={16} />
            Post New Job
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-8">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl bg-white p-5 ring-1 ring-jb-border shadow-sm"
          >
            <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
            <p className="mt-1 text-xs text-jb-text-muted">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Listings table */}
      <div className="rounded-2xl bg-white ring-1 ring-jb-border shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-jb-border flex items-center justify-between">
          <h2 className="font-semibold text-jb-text">All Listings</h2>
          <span className="text-sm text-jb-text-muted">{allListings.length} total</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-jb-border bg-slate-50">
                <th className="px-6 py-3 text-left font-medium text-jb-text-muted">Role</th>
                <th className="px-6 py-3 text-left font-medium text-jb-text-muted hidden md:table-cell">Type</th>
                <th className="px-6 py-3 text-left font-medium text-jb-text-muted hidden lg:table-cell">Posted</th>
                <th className="px-6 py-3 text-left font-medium text-jb-text-muted">Status</th>
                <th className="px-6 py-3 text-right font-medium text-jb-text-muted">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-jb-border">
              {allListings.map((listing) => {
                const days = daysUntilExpiry(listing.postDate);
                const expired = isExpired(listing.postDate);
                const expiring = !expired && days <= 7;

                return (
                  <tr key={listing.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-jb-text">{listing.title}</p>
                      <p className="text-xs text-jb-text-muted mt-0.5">{listing.company}</p>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <Badge jobType={listing.type as JobType} />
                    </td>
                    <td className="px-6 py-4 text-jb-text-muted hidden lg:table-cell">
                      {formatDate(listing.postDate)}
                    </td>
                    <td className="px-6 py-4">
                      {expired ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500">
                          Archived
                        </span>
                      ) : expiring ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-jb-warning-light px-2.5 py-0.5 text-xs font-medium text-jb-warning">
                          {days}d left
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-jb-success-light px-2.5 py-0.5 text-xs font-medium text-jb-success">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/jobs/${listing.id}/edit`}>
                          <button className="flex h-8 w-8 items-center justify-center rounded-lg text-jb-text-muted hover:bg-jb-primary-light hover:text-jb-primary transition-colors">
                            <Pencil size={14} />
                          </button>
                        </Link>
                        <button className="flex h-8 w-8 items-center justify-center rounded-lg text-jb-text-muted hover:bg-jb-danger-light hover:text-jb-danger transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
