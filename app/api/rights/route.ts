import { prisma } from "@/lib/db";
import { ok } from "@/lib/api-utils";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const articles = await prisma.rightArticle.findMany({
    where: category ? { category: category as never } : undefined,
    orderBy: { slug: "asc" },
  });
  return ok({ articles });
}
