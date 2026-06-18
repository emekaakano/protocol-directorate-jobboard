import { Briefcase } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-jb-text">Job Listings</h1>
        <p className="mt-1 text-jb-text-muted">
          Browse open positions — auto-archived after 30 days.
        </p>
      </div>

      <EmptyState
        icon={Briefcase}
        title="No listings yet"
        description="Check back soon — new positions are added regularly."
      />
    </div>
  );
}
