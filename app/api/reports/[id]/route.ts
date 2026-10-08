import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAuth, getSessionUser } from "@/lib/auth";
import { ok, fail, zodError, parseJson } from "@/lib/api-utils";
import { changeReportStatus } from "@/lib/reports";
import { publicReportShape, REPORT_STATUSES } from "@/lib/utils";

const statusSchema = z.object({
  status: z.enum([...REPORT_STATUSES, "REJECTED"] as [string, ...string[]]),
  note: z.string().max(2000).optional(),
});

/** Public-safe detail by publicId (e.g. JA-10001). */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const report = await prisma.report.findUnique({
    where: { publicId: id.toUpperCase() },
    include: {
      _count: { select: { evidence: true } },
      statusHistory: { orderBy: { createdAt: "asc" } },
      responses: { orderBy: { createdAt: "desc" }, take: 5, include: { authority: { select: { name: true, department: true } } } },
    },
  });
  if (!report || !report.isPublic) return fail("Report not found", 404);

  return ok({
    ...publicReportShape(report),
    timeline: report.statusHistory,
    responses: report.responses.map((r) => ({
      content: r.content,
      createdAt: r.createdAt,
      authorityName: r.authority.name,
      department: r.authority.department,
    })),
  });
}

/** Status update — AUTHORITY (own jurisdiction) or ADMIN only. */
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth();
  if ("response" in auth) return auth.response;
  const user = await getSessionUser(auth.session);
  if (!user || (user.role !== "AUTHORITY" && user.role !== "ADMIN")) {
    return fail("Forbidden", 403);
  }

  const { id } = await params;
  const body = await parseJson(req);
  const parsed = statusSchema.safeParse(body);
  if (!parsed.success) return zodError(parsed.error);

  const report = await prisma.report.findUnique({ where: { publicId: id.toUpperCase() } });
  if (!report) return fail("Report not found", 404);

  // Jurisdiction-based access control for AUTHORITY role
  if (user.role === "AUTHORITY") {
    const inJurisdiction =
      (!user.jurisdictionState || user.jurisdictionState === report.state) &&
      (!user.jurisdictionDistrict || user.jurisdictionDistrict === report.district);
    if (!inJurisdiction) return fail("Report is outside your jurisdiction", 403);
  }

  const updated = await changeReportStatus(report.id, parsed.data.status as never, {
    note: parsed.data.note,
    actorId: user.id,
  });

  await prisma.auditLog.create({
    data: {
      actorId: user.id, action: "REPORT_STATUS_CHANGE",
      entityType: "Report", entityId: report.id,
      meta: { publicId: report.publicId, toStatus: parsed.data.status },
    },
  });

  return ok({ publicId: updated!.publicId, status: updated!.status });
}
