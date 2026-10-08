import { getSession, getSessionUser } from "@/lib/auth";
import { ok, fail } from "@/lib/api-utils";

export async function GET() {
  const session = await getSession();
  const user = await getSessionUser(session);
  if (!user) return fail("Not authenticated", 401);
  const { passwordHash: _ph, ...safe } = user;
  return ok(safe);
}
