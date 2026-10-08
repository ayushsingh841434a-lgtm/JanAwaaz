import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { ok, fail } from "@/lib/api-utils";
import { readFile } from "fs/promises";
import { join } from "path";

/** Serve evidence only to: the reporter, jurisdiction authority, or admin. */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  if (!session) return fail("Not authenticated", 401);

  const ev = await prisma.evidence.findUnique({
    where: { id },
    include: { report: { select: { userId: true, state: true, district: true } } },
  });
  if (!ev) return fail("Not found", 404);

  const me = await prisma.user.findUnique({ where: { id: session.sub } });
  if (!me) return fail("Not authenticated", 401);

  const allowed =
    me.role === "ADMIN" ||
    ev.report.userId === me.id ||
    (me.role === "AUTHORITY" &&
      (!me.jurisdictionState || me.jurisdictionState === ev.report.state) &&
      (!me.jurisdictionDistrict || me.jurisdictionDistrict === ev.report.district));

  if (!allowed) return fail("Forbidden", 403);

  const uploadDir = process.env.UPLOAD_DIR ?? "./uploads";
  try {
    const data = await readFile(join(uploadDir, ev.storageKey));
    return new Response(new Uint8Array(data), {
      headers: {
        "Content-Type": ev.mimeType,
        "Content-Disposition": `inline; filename="${encodeURIComponent(ev.fileName)}"`,
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch {
    return fail("File unavailable", 410);
  }
}
