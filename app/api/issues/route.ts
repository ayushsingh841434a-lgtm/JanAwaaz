import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireRole, getSessionUser } from "@/lib/auth";
import { ok, fail, zodError, parseJson } from "@/lib/api-utils";

const createSchema = z.object({
  title: z.string().min(4).max(160),
  category: z.enum(["WATER","ROADS","ELECTRICITY","GARBAGE","DRAINAGE","EDUCATION","HEALTHCARE","TRANSPORT","ENVIRONMENT","PUBLIC_SERVICES","EMPLOYMENT","INFRASTRUCTURE","DOCUMENTATION","SAFETY","RIGHTS","OTHER"]),
  state: z.string().min(2).max(60),
  district: z.string().min(2).max(60),
  city: z.string().max(60).optional(),
  description: z.string().min(20).max(8000),
  background: z.string().min(20).max(8000),
  concerns: z.string().min(10).max(8000),
  officialResponse: z.string().max(8000).optional(),
  status: z.enum(["UNVERIFIED","REPORTED","UNDER_REVIEW","ACTION_PENDING","DISPUTED","RESOLVED"]).optional(),
});

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 80);
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const category = searchParams.get("category");
  const state = searchParams.get("state");
  const q = searchParams.get("q");
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") ?? "12", 10)));

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (category) where.category = category;
  if (state) where.state = { contains: state, mode: "insensitive" };
  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
    ];
  }

  const [total, issues] = await Promise.all([
    prisma.publicIssue.count({ where }),
    prisma.publicIssue.findMany({ where, orderBy: { publishedAt: "desc" }, skip: (page - 1) * limit, take: limit }),
  ]);
  return ok({ issues, total, page, limit });
}

/** Curated public issues are created by ADMIN only (moderation before aggregation). */
export async function POST(req: Request) {
  const auth = await requireRole(["ADMIN"]);
  if ("response" in auth) return auth.response;

  const body = await parseJson(req);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return zodError(parsed.error);

  const slug = `${slugify(parsed.data.title)}-${Date.now().toString(36)}`;
  const issue = await prisma.publicIssue.create({
    data: { ...parsed.data, slug, sources: [] },
  });

  const user = await getSessionUser(auth.session);
  await prisma.auditLog.create({
    data: { actorId: user?.id, action: "ISSUE_CREATE", entityType: "PublicIssue", entityId: issue.id, meta: { slug } },
  });

  return ok({ slug: issue.slug }, 201);
}
