import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { JobForm } from "@/components/admin/JobForm";
import { updateListing } from "@/lib/actions";

interface Props {
  params: { id: string };
}

export default async function EditJobPage({ params }: Props) {
  const listing = await prisma.jobListing.findUnique({
    where: { id: params.id, deletedAt: null },
  });

  if (!listing) notFound();

  // Bind the listing ID into the action so useFormState receives (prevState, formData)
  const updateAction = updateListing.bind(null, listing.id);

  return (
    <JobForm
      action={updateAction}
      heading="Edit Listing"
      submitLabel="Save Changes"
      defaultValues={{
        title: listing.title,
        company: listing.company,
        location: listing.location,
        type: listing.type,
        description: listing.description,
        requirements: listing.requirements,
        salaryMin: listing.salaryMin,
        salaryMax: listing.salaryMax,
        contactEmail: listing.contactEmail,
      }}
    />
  );
}
