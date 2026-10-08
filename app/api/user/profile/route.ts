import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAuth, getSessionUser } from "@/lib/auth";
import { ok, fail, zodError, parseJson } from "@/lib/api-utils";
import { isLang } from "@/lib/i18n/dictionaries";

export async function GET() {
  const auth = await requireAuth();
  if ("response" in auth) return auth.response;
  const user = await getSessionUser(auth.session);
  if (!user) return fail("Not authenticated", 401);

  const [reportCount, recentReports, savedIssues] = await Promise.all([
    prisma.report.count({ where: { userId: user.id } }),
    prisma.report.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { _count: { select: { evidence: true, responses: true } } },
    }),
    prisma.savedIssue.findMany({
      where: { userId: user.id },
      include: { issue: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const { passwordHash: _ph, ...safe } = user;
  return ok({ user: safe, reportCount, recentReports, savedIssues: savedIssues.map((s) => s.issue) });
}

const patchSchema = z.object({
  name: z.string().min(2).max(80).optional(),
  language: z.string().max(7).refine(isLang, "Unsupported language").optional(),
  phone: z.string().max(20).optional(),
  state: z.string().max(60).optional(),
  district: z.string().max(60).optional(),
});

export async function PATCH(req: Request) {
  const auth = await requireAuth();
  if ("response" in auth) return auth.response;

  const body = await parseJson(req);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return zodError(parsed.error);
  const user = await prisma.user.update({
    where: { id: auth.session.sub },
    data: parsed.data,
  });
  const { passwordHash: _ph, ...safe } = user;
  return ok(safe);
}
