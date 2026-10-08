import { prisma } from "@/lib/db";
import { ok } from "@/lib/api-utils";

/** Public civic dashboard stats. Demo data — labelled as such in the UI. */
export async function GET() {
  const [reports, underReview, resolved, states] = await Promise.all([
    prisma.report.count(),
    prisma.report.count({ where: { status: { in: ["SUBMITTED", "ACKNOWLEDGED", "UNDER_REVIEW", "ACTION_TAKEN"] } } }),
    prisma.report.count({ where: { status: "RESOLVED" } }),
    prisma.report.groupBy({ by: ["state"] }),
  ]);

  // Category breakdown for charts
  const byCategory = await prisma.report.groupBy({ by: ["category"], _count: true, orderBy: { _count: { category: "desc" } } });
  const byStatus = await prisma.report.groupBy({ by: ["status"], _count: true });
  const byCity = await prisma.report.groupBy({ by: ["city"], _count: true, orderBy: { _count: { city: "desc" } }, take: 9 });

  return ok({
    reports,
    underReview,
    resolved,
    states: states.length,
    languages: 13,
    byCategory: byCategory.map((c) => ({ category: c.category, count: c._count })),
    byStatus: byStatus.map((s) => ({ status: s.status, count: s._count })),
    byCity: byCity.map((c) => ({ city: c.city, count: c._count })),
  });
}
