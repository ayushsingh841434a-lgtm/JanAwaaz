import { prisma } from "@/lib/db";
import { requireRole, getSessionUser } from "@/lib/auth";
import { ok, fail } from "@/lib/api-utils";

/** Authority dashboard data — strictly scoped to the officer's jurisdiction. */
export async function GET(req: Request) {
  const auth = await requireRole(["AUTHORITY", "ADMIN"]);
  if ("response" in auth) return auth.response;
  const user = await getSessionUser(auth.session);
  if (!user) return fail("Not authenticated", 401);

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const category = searchParams.get("category");
  const q = searchParams.get("q");
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") ?? "15", 10)));

  const scope: Record<string, unknown> = {};
  if (user.role === "AUTHORITY") {
    if (user.jurisdictionState) scope.state = user.jurisdictionState;
    if (user.jurisdictionDistrict) scope.district = user.jurisdictionDistrict;
  }

  const where: Record<string, unknown> = { ...scope };
  if (status) where.status = status;
  if (category) where.category = category;
  if (q) {
    where.OR = [
      { publicId: { contains: q, mode: "insensitive" } },
      { title: { contains: q, mode: "insensitive" } },
      { city: { contains: q, mode: "insensitive" } },
    ];
  }

  const [counts, total, reports] = await Promise.all([
    prisma.report.groupBy({ by: ["status"], where: scope, _count: true }),
    prisma.report.count({ where }),
    prisma.report.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        user: { select: { name: true } },
        _count: { select: { evidence: true, responses: true } },
      },
    }),
  ]);

  const byStatus: Record<string, number> = {};
  for (const c of counts) byStatus[c.status] = c._count;

  return ok({
    jurisdiction: { state: user.jurisdictionState, district: user.jurisdictionDistrict, department: user.department },
    counts: {
      new: byStatus.REPORTED ?? 0,
      assigned: (byStatus.AUTHORITY_IDENTIFIED ?? 0) + (byStatus.SUBMITTED ?? 0) + (byStatus.ACKNOWLEDGED ?? 0),
      pending: byStatus.UNDER_REVIEW ?? 0,
      actionTaken: byStatus.ACTION_TAKEN ?? 0,
      resolved: byStatus.RESOLVED ?? 0,
    },
    reports: reports.map((r) => ({
      publicId: r.publicId, title: r.title, category: r.category, status: r.status,
      priority: r.priority, city: r.city, area: r.area, district: r.district,
      reporterName: r.user.name, evidenceCount: r._count.evidence,
      responseCount: r._count.responses, createdAt: r.createdAt, updatedAt: r.updatedAt,
    })),
    total, page, limit,
  });
}
