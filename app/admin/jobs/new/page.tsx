import { JobForm } from "@/components/admin/JobForm";
import { createListing } from "@/lib/actions";

export default function NewJobPage() {
  return (
    <JobForm
      action={createListing}
      heading="Post a New Job"
      submitLabel="Post Job"
    />
  );
}
