"use server";

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { jobListingSchema } from "@/lib/schemas";

export type ActionState = {
  errors?: Record<string, string[]>;
  message?: string;
} | null;

function parseFormData(formData: FormData) {
  const salaryMinRaw = formData.get("salaryMin") as string;
  const salaryMaxRaw = formData.get("salaryMax") as string;
  return {
    title: formData.get("title") as string,
    company: formData.get("company") as string,
    location: formData.get("location") as string,
    type: formData.get("type") as string,
    description: formData.get("description") as string,
    requirements: formData.get("requirements") as string,
    salaryMin: salaryMinRaw === "" ? null : salaryMinRaw,
    salaryMax: salaryMaxRaw === "" ? null : salaryMaxRaw,
    applicationDeadline: formData.get("applicationDeadline") as string,
    howToApply: formData.get("howToApply") as string,
  };
}

export async function createListing(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const parsed = jobListingSchema.safeParse(parseFormData(formData));
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
  }

  const { applicationDeadline, howToApply, ...rest } = parsed.data;
  const isEmail = (v: string) => !v.startsWith("http") && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const listing = await prisma.jobListing.create({
    data: {
      ...rest,
      howToApply,
      contactEmail: isEmail(howToApply) ? howToApply : "",
      applicationDeadline: applicationDeadline ? new Date(applicationDeadline) : null,
      adminId: session.user.id,
    },
  });

  await prisma.auditLog.create({
    data: {
      adminId: session.user.id,
      action: "listing.create",
      details: `Created: "${listing.title}" at ${listing.company}`,
    },
  });

  redirect("/admin");
}

// Use .bind(null, id) in the edit page to pre-apply the listing ID
export async function updateListing(
  id: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const parsed = jobListingSchema.safeParse(parseFormData(formData));
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
  }

  const { applicationDeadline, howToApply, ...rest } = parsed.data;
  const isEmail = (v: string) => !v.startsWith("http") && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const listing = await prisma.jobListing.update({
    where: { id, deletedAt: null },
    data: {
      ...rest,
      howToApply,
      contactEmail: isEmail(howToApply) ? howToApply : "",
      applicationDeadline: applicationDeadline ? new Date(applicationDeadline) : null,
    },
  });

  await prisma.auditLog.create({
    data: {
      adminId: session.user.id,
      action: "listing.update",
      details: `Updated: "${listing.title}"`,
    },
  });

  redirect("/admin");
}

export async function deleteListing(id: string): Promise<void> {
  const session = await getServerSession(authOptions);
  if (!session) return;

  const listing = await prisma.jobListing.update({
    where: { id, deletedAt: null },
    data: { deletedAt: new Date() },
  });

  await prisma.auditLog.create({
    data: {
      adminId: session.user.id,
      action: "listing.delete",
      details: `Deleted: "${listing.title}" at ${listing.company}`,
    },
  });
}
