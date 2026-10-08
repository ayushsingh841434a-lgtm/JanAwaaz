import { z } from "zod";
import { prisma } from "@/lib/db";
import { hashPassword, signToken, setAuthCookie, getSessionUser, getSession } from "@/lib/auth";
import { ok, fail, zodError, parseJson } from "@/lib/api-utils";
import { NextResponse } from "next/server";
import { isLang } from "@/lib/i18n/dictionaries";
import { cookies } from "next/headers";

const registerSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email().max(120),
  password: z.string().min(8).max(72),
  language: z.string().max(7).refine(isLang, "Unsupported language").optional(),
  state: z.string().max(60).optional(),
  district: z.string().max(60).optional(),
});

export async function POST(req: Request) {
  const body = await parseJson(req);
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) return zodError(parsed.error);
  const { name, email, password, language, state, district } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (existing) return fail("An account with this email already exists.", 409);

  const user = await prisma.user.create({
    data: {
      name, email: email.toLowerCase(),
      passwordHash: await hashPassword(password),
      role: "CITIZEN",
      language: language ?? "en",
      state, district,
    },
  });

  const token = await signToken({ sub: user.id, email: user.email, role: user.role, name: user.name });
  const res = ok({ id: user.id, name: user.name, email: user.email, role: user.role, language: user.language }, 201);
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

export async function GET() {
  const session = await getSession();
  const user = await getSessionUser(session);
  if (!user) return fail("Not authenticated", 401);
  return ok({ id: user.id, name: user.name, email: user.email, role: user.role, language: user.language, state: user.state, district: user.district });
}
