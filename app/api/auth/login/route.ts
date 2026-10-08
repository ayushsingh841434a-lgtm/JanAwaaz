import { z } from "zod";
import { prisma } from "@/lib/db";
import { verifyPassword, signToken, setAuthCookie } from "@/lib/auth";
import { ok, fail, zodError, parseJson } from "@/lib/api-utils";
import { cookies } from "next/headers";
import { isLang } from "@/lib/i18n/dictionaries";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: Request) {
  const body = await parseJson(req);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) return zodError(parsed.error);

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
  if (!user || !(await verifyPassword(parsed.data.password, user.passwordHash))) {
    return fail("Invalid email or password.", 401);
  }

  const token = await signToken({ sub: user.id, email: user.email, role: user.role, name: user.name });
  const res = ok({ id: user.id, name: user.name, email: user.email, role: user.role, language: user.language });
  setAuthCookie(res, token);
  const cookieStore = await cookies();
  const manualLanguage = cookieStore.get("ja_lang_source")?.value === "manual"
    ? cookieStore.get("ja_lang")?.value
    : null;
  const selectedLanguage = manualLanguage && isLang(manualLanguage) ? manualLanguage : user.language;
  res.cookies.set("ja_lang", selectedLanguage, {
    httpOnly: false, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 365,
  });
  res.cookies.set("ja_lang_source", manualLanguage && isLang(manualLanguage) ? "manual" : "account", {
    httpOnly: false, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 365,
  });
  return res;
}
