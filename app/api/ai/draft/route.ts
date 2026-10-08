import { z } from "zod";
import { ok, zodError, parseJson } from "@/lib/api-utils";
import { generateDraft } from "@/lib/ai/drafts";
import { CATEGORIES } from "@/lib/utils";
import { isLang, type Lang } from "@/lib/i18n/dictionaries";
import { cookies } from "next/headers";

const draftSchema = z.object({
  category: z.enum(CATEGORIES).optional(),
  description: z.string().min(10).max(5000),
  location: z.string().max(160).optional(),
  duration: z.string().max(120).optional(),
  name: z.string().max(80).optional(),
  language: z.string().refine((value): value is Lang => isLang(value)).optional(),
});

/** Generate a professional complaint draft. Preview only — never auto-submits. */
export async function POST(req: Request) {
  const body = await parseJson(req);
  const parsed = draftSchema.safeParse(body);
  if (!parsed.success) return zodError(parsed.error);

  const cookieLanguage = (await cookies()).get("ja_lang")?.value;
  const language = parsed.data.language ?? (cookieLanguage && isLang(cookieLanguage) ? cookieLanguage : "en");
  const draft = generateDraft({
    category: parsed.data.category ?? "OTHER",
    description: parsed.data.description,
    location: parsed.data.location,
    duration: parsed.data.duration,
    name: parsed.data.name,
    language,
  });

  return ok({ draft, infoType: "user" });
}
