import { prisma } from "@/lib/db";
import { ok } from "@/lib/api-utils";
import { KNOWLEDGE } from "@/lib/ai/knowledge";

/** Hinglish → English concept map for semantic-ish search. */
const CONCEPT_MAP: [RegExp, string[]][] = [
  [/paani|pani|पानी|jal/i, ["water", "पानी", "supply"]],
  [/bijli|बिजली|power|light/i, ["electricity", "बिजली"]],
  [/sadak|सड़क|road|gaddha|गड्ढा/i, ["road", "सड़क"]],
  [/kachra|कचरा|garbage|safai/i, ["garbage", "कचरा"]],
  [/naali|नाली|drain|सीवर/i, ["drain", "नाली"]],
  [/aspatal|अस्पताल|hospital|doctor/i, ["hospital", "अस्पताल"]],
  [/school|स्कूल|teacher|शिक्षक/i, ["school", "स्कूल"]],
  [/pradushan|प्रदूषण|pollution|dhuaan/i, ["pollution", "प्रदूषण"]],
  [/rti|सूचना/i, ["rti"]],
  [/yojana|योजना|scheme/i, ["scheme", "योजना"]],
  [/adhikaar|अधिकार|rights|hak/i, ["rights", "अधिकार"]],
  [/naukri|नौकरी|rozgar|रोजगार|job/i, ["employment", "रोजगार"]],
];

/** Intelligent multilingual search across reports, issues, rights and AI knowledge. */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") ?? "").trim();
  if (!q) return ok({ reports: [], issues: [], rights: [], knowledge: [] });

  // Expand the query with mapped concepts so "mere gaon me pani ki dikkat",
  // "water problem" and "পানির সমস্যা" hit the same civic concept.
  const expansions = new Set<string>([q]);
  for (const [re, words] of CONCEPT_MAP) {
    if (re.test(q)) words.forEach((w) => expansions.add(w));
  }
  const terms = [...expansions];

  const orFor = (fields: string[]) =>
    terms.flatMap((t) => fields.map((f) => ({ [f]: { contains: t, mode: "insensitive" as const } })));

  const [reports, issues, rights] = await Promise.all([
    prisma.report.findMany({
      where: { isPublic: true, OR: orFor(["title", "description", "city", "area"]) },
      take: 8, orderBy: { createdAt: "desc" },
      select: { publicId: true, title: true, city: true, status: true, category: true, createdAt: true },
    }),
    prisma.publicIssue.findMany({
      where: { OR: orFor(["title", "description"]) },
      take: 6, orderBy: { publishedAt: "desc" },
    }),
    prisma.rightArticle.findMany({ take: 20 }),
  ]);

  const knowledge = KNOWLEDGE.filter((k) =>
    terms.some(
      (t) =>
        k.title.en.toLowerCase().includes(t.toLowerCase()) ||
        k.title.hi.includes(t) ||
        k.body.en.toLowerCase().includes(t.toLowerCase())
    )
  ).slice(0, 4);

  const matchedRights = rights.filter((r) => {
    const hay = JSON.stringify(r.title) + JSON.stringify(r.summary);
    return terms.some((t) => hay.toLowerCase().includes(t.toLowerCase()));
  }).slice(0, 4);

  return ok({ reports, issues, rights: matchedRights, knowledge, expandedTerms: terms.slice(0, 6) });
}
