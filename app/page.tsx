import { prisma } from "@/lib/prisma";
import { JobListings } from "@/components/jobs/JobListings";

export default async function HomePage() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const listings = await prisma.jobListing.findMany({
    where: { deletedAt: null, postDate: { gte: thirtyDaysAgo } },
    orderBy: { postDate: "desc" },
    select: {
      id: true,
      title: true,
      company: true,
      location: true,
      type: true,
      description: true,
      salaryMin: true,
      salaryMax: true,
      postDate: true,
      applicationDeadline: true,
    },
  });

  const serialized = listings.map((l) => ({
    ...l,
    postDate: l.postDate.toISOString(),
    applicationDeadline: l.applicationDeadline?.toISOString() ?? null,
  }));

  return <JobListings listings={serialized} />;
}
