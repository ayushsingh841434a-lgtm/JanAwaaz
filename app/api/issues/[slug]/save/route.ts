import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { ok, fail } from "@/lib/api-utils";

/** Toggle save on a public issue (authenticated users). */
export async function POST(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const auth = await requireAuth();
  if ("response" in auth) return auth.response;

  const { slug } = await params;
  const issue = await prisma.publicIssue.findUnique({ where: { slug } });
  if (!issue) return fail("Issue not found", 404);

  const existing = await prisma.savedIssue.findUnique({
    where: { userId_issueId: { userId: auth.session.sub, issueId: issue.id } },
  });

  if (existing) {
    await prisma.savedIssue.delete({ where: { userId_issueId: { userId: auth.session.sub, issueId: issue.id } } });
    return ok({ saved: false });
  }
  await prisma.savedIssue.create({ data: { userId: auth.session.sub, issueId: issue.id } });
  return ok({ saved: true });
}
