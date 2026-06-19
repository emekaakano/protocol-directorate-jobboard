import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ARCHIVE_DAYS } from "@/lib/constants";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { searchParams } = new URL(request.url);
  const fromParam = searchParams.get("from");
  const toParam = searchParams.get("to");
  const format = searchParams.get("format") ?? "csv"; // "csv" | "json"

  if (!fromParam || !toParam) {
    return new Response("Missing from or to parameters", { status: 400 });
  }

  const from = new Date(fromParam);
  const to = new Date(toParam);
  to.setHours(23, 59, 59, 999);

  if (isNaN(from.getTime()) || isNaN(to.getTime()) || from > to) {
    return new Response("Invalid date range", { status: 400 });
  }

  const listings = await prisma.jobListing.findMany({
    where: { postDate: { gte: from, lte: to } },
    select: { postDate: true, deletedAt: true },
  });

  const now = Date.now();
  const archiveMs = ARCHIVE_DAYS * 86400000;
  const soonMs = 7 * 86400000;

  const totalPosts = listings.length;
  const archivedByAdmin = listings.filter((l) => l.deletedAt !== null).length;
  const live = listings.filter((l) => l.deletedAt === null);
  const active = live.filter((l) => now - l.postDate.getTime() < archiveMs).length;
  const autoExpired = live.filter((l) => now - l.postDate.getTime() >= archiveMs).length;
  const expiringSoon = live.filter((l) => {
    const age = now - l.postDate.getTime();
    return age < archiveMs && age >= archiveMs - soonMs;
  }).length;

  const stats = [
    { label: "Total Posts", count: totalPosts },
    { label: "Active Listings", count: active },
    { label: "Auto-Expired (30-day archive)", count: autoExpired },
    { label: "Archived by Admin", count: archivedByAdmin },
    { label: "Expiring Soon (≤7 days)", count: expiringSoon },
  ];

  const generatedAt = new Date().toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });
  const periodFrom = from.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const periodTo = new Date(toParam).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  if (format === "json") {
    return Response.json({ generatedAt, periodFrom, periodTo, stats });
  }

  // Default: CSV
  const csv = [
    `Protocol Directorate JobBoard — Activity Report`,
    `Generated: ${generatedAt}`,
    `Period: ${periodFrom} to ${periodTo}`,
    ``,
    `Metric,Count`,
    ...stats.map((s) => `${s.label},${s.count}`),
  ].join("\r\n");

  const filename = `pdjb-report-${fromParam}-to-${toParam}.csv`;
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
