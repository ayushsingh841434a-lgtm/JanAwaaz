import { z } from "zod";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { ok, fail, zodError, parseJson } from "@/lib/api-utils";
import { respond } from "@/lib/ai/engine";
import { detectPII } from "@/lib/ai/safety";
import { cookies } from "next/headers";
import { randomUUID } from "crypto";
import { isLang } from "@/lib/i18n/dictionaries";
import { findVerifiedLocation } from "@/lib/locations/match";

const chatSchema = z.object({
  message: z.string().min(1).max(4000),
  conversationId: z.string().optional(),
  language: z.string().max(7).refine(isLang, "Unsupported language").optional(),
});

// Simple in-memory rate limit: 30 messages / hour / session. (Use Redis in production.)
const bucket = new Map<string, number[]>();
function rateLimited(key: string): boolean {
  const now = Date.now();
  const arr = (bucket.get(key) ?? []).filter((t) => now - t < 3_600_000);
  if (arr.length >= 30) return false;
  arr.push(now);
  bucket.set(key, arr);
  return true;
}

async function sessionKey(): Promise<string> {
  const store = await cookies();
  let key = store.get("ja_session")?.value;
  if (!key) key = randomUUID();
  return key;
}

export async function POST(req: Request) {
  const body = await parseJson(req);
  const parsed = chatSchema.safeParse(body);
  if (!parsed.success) return zodError(parsed.error);

  const key = await sessionKey();
  if (!rateLimited(key)) {
    return fail("You're sending messages too quickly. Please wait a little while.", 429);
  }

  const session = await getSession();
  const userId = session?.sub ?? null;
  const userName = session?.name;
  const languageCookie = (await cookies()).get("ja_lang")?.value;
  const language = parsed.data.language ?? (languageCookie && isLang(languageCookie) ? languageCookie : "en");

  // Find or create conversation
  let conversation = parsed.data.conversationId
    ? await prisma.conversation.findFirst({
        where: { id: parsed.data.conversationId, OR: [{ sessionKey: key }, ...(userId ? [{ userId }] : [])] },
      })
    : null;
  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: {
        userId, sessionKey: key, language,
        title: parsed.data.message.slice(0, 60),
      },
    });
  }

  const pii = detectPII(parsed.data.message);
  await prisma.chatMessage.create({
    data: {
      conversationId: conversation.id,
      role: "user",
      content: parsed.data.message,
      metadata: { piiDetected: pii.found, piiTypes: pii.types, masked: pii.masked },
    },
  });

  // Status-check enrichment: only for public reports or the user's own reports
  let reportContext: Parameters<typeof respond>[0]["reportContext"] = null;
  const idMatch = parsed.data.message.match(/\bJA-\d+\b/i);
  if (idMatch) {
    const report = await prisma.report.findUnique({
      where: { publicId: idMatch[0].toUpperCase() },
      include: {
        statusHistory: { orderBy: { createdAt: "asc" } },
        responses: { orderBy: { createdAt: "desc" }, take: 1 },
      },
    });
    if (report && (report.isPublic || report.userId === userId)) {
      reportContext = {
        publicId: report.publicId,
        status: report.status,
        category: report.category,
        title: report.title,
        city: report.city,
        history: report.statusHistory.map((h) => ({ toStatus: h.toStatus, createdAt: h.createdAt.toISOString() })),
        officialResponse: report.responses[0]?.content,
      };
    }
  }

  const history = await prisma.chatMessage.findMany({
    where: { conversationId: conversation.id },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  const verifiedLocation = await findVerifiedLocation(parsed.data.message);
  const reply = respond({
    message: parsed.data.message,
    preferredLang: language,
    userName,
    verifiedLocation,
    locationLookupComplete: true,
    reportContext,
    history: history.reverse().map((h) => ({ role: h.role, content: h.content })),
  });

  await prisma.chatMessage.create({
    data: {
      conversationId: conversation.id,
      role: "assistant",
      content: reply.text,
      metadata: {
        infoType: reply.infoType,
        detectedCategory: reply.detectedCategory,
        sources: reply.sources ?? [],
        suggestedActions: reply.suggestedActions ?? [],
        language: reply.language,
      } as unknown as Prisma.InputJsonValue,
    },
  });

  const res = ok({
    conversationId: conversation.id,
    reply: reply.text,
    infoType: reply.infoType,
    language: reply.language,
    detectedCategory: reply.detectedCategory,
    suggestedActions: reply.suggestedActions ?? [],
    sources: reply.sources ?? [],
    needsInfo: reply.needsInfo,
    warning: reply.warning,
    piiMasked: pii.found ? pii.masked : undefined,
  });
  // Persist anonymous session key
  res.cookies.set("ja_session", key, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 90 });
  return res;
}

/** Fetch conversation history (owner or same anonymous session only). */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const conversationId = searchParams.get("conversationId");
  if (!conversationId) return fail("conversationId required", 422);

  const key = await sessionKey();
  const session = await getSession();
  const conversation = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      OR: [{ sessionKey: key }, ...(session?.sub ? [{ userId: session.sub }] : [])],
    },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });
  if (!conversation) return fail("Not found", 404);

  return ok({
    id: conversation.id,
    language: conversation.language,
    messages: conversation.messages.map((m) => ({
      id: m.id, role: m.role, content: m.content,
      metadata: m.metadata, createdAt: m.createdAt,
    })),
  });
}
