import { prisma } from "@/lib/db";
import { ok, fail } from "@/lib/api-utils";

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const issue = await prisma.publicIssue.findUnique({
    where: { slug },
    include: {
      reports: {
        where: { isPublic: true },
        take: 8,
        orderBy: { createdAt: "desc" },
        select: { publicId: true, title: true, city: true, area: true, status: true, category: true, createdAt: true },
      },
    },
  });
  if (!issue) return fail("Issue not found", 404);
  return ok(issue);
}
