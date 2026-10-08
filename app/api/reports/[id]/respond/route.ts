import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAuth, getSessionUser } from "@/lib/auth";
import { ok, fail, zodError, parseJson } from "@/lib/api-utils";

const respondSchema = z.object({
  content: z.string().min(4).max(5000),
});

/** Authority posts an official response (original preserved verbatim). */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth();
  if ("response" in auth) return auth.response;
  const user = await getSessionUser(auth.session);
  if (!user || (user.role !== "AUTHORITY" && user.role !== "ADMIN")) {
    return fail("Forbidden", 403);
  }

  const { id } = await params;
  const body = await parseJson(req);
  const parsed = respondSchema.safeParse(body);
  if (!parsed.success) return zodError(parsed.error);

  const report = await prisma.report.findUnique({ where: { publicId: id.toUpperCase() } });
  if (!report) return fail("Report not found", 404);

  if (user.role === "AUTHORITY") {
    const inJurisdiction =
      (!user.jurisdictionState || user.jurisdictionState === report.state) &&
      (!user.jurisdictionDistrict || user.jurisdictionDistrict === report.district);
    if (!inJurisdiction) return fail("Report is outside your jurisdiction", 403);
  }

  const response = await prisma.officialResponse.create({
    data: { reportId: report.id, authorityId: user.id, content: parsed.data.content },
  });

  await prisma.notification.create({
    data: {
      userId: report.userId,
      type: "RESPONSE_RECEIVED",
      title: "Official response received",
      body: `The authority responded to your report ${report.publicId}.`,
      link: `/track/${report.publicId}`,
    },
  });

  return ok({ id: response.id }, 201);
}
