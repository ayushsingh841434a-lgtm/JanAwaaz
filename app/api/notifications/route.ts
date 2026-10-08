import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { ok, zodError, parseJson } from "@/lib/api-utils";

export async function GET() {
  const auth = await requireAuth();
  if ("response" in auth) return auth.response;

  const [notifications, unread] = await Promise.all([
    prisma.notification.findMany({
      where: { userId: auth.session.sub },
      orderBy: { createdAt: "desc" },
      take: 30,
    }),
    prisma.notification.count({ where: { userId: auth.session.sub, read: false } }),
  ]);
  return ok({ notifications, unread });
}

const patchSchema = z.object({ ids: z.array(z.string()).max(50).optional(), all: z.boolean().optional() });

export async function PATCH(req: Request) {
  const auth = await requireAuth();
  if ("response" in auth) return auth.response;

  const body = await parseJson(req);
  const parsed = patchSchema.safeParse(body ?? {});
  if (!parsed.success) return zodError(parsed.error);

  if (parsed.data.all) {
    await prisma.notification.updateMany({ where: { userId: auth.session.sub, read: false }, data: { read: true } });
  } else if (parsed.data.ids) {
    await prisma.notification.updateMany({
      where: { userId: auth.session.sub, id: { in: parsed.data.ids } },
      data: { read: true },
    });
  }
  return ok({ ok: true });
}
