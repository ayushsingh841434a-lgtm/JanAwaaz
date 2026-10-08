import { prisma } from "@/lib/db";
import { requireAuth, getSessionUser } from "@/lib/auth";
import { ok, fail } from "@/lib/api-utils";
import { mkdir, writeFile } from "fs/promises";
import { join, extname } from "path";
import { randomUUID } from "crypto";

const ALLOWED: Record<string, "PHOTO" | "VIDEO" | "DOCUMENT" | "VOICE"> = {
  "image/jpeg": "PHOTO", "image/png": "PHOTO", "image/webp": "PHOTO", "image/gif": "PHOTO",
  "video/mp4": "VIDEO", "video/webm": "VIDEO", "video/quicktime": "VIDEO",
  "application/pdf": "DOCUMENT",
  "application/msword": "DOCUMENT",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "DOCUMENT",
  "text/plain": "DOCUMENT",
  "audio/mpeg": "VOICE", "audio/wav": "VOICE", "audio/webm": "VOICE", "audio/mp4": "VOICE", "audio/ogg": "VOICE",
};

const PII_RE = [
  /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/, // possible Aadhaar-like sequence in filename
  /(\+91[\s-]?)?\b[6-9]\d{9}\b/, // phone-like sequence
];

/** Secure evidence upload: type + size validated, stored outside public dir. */
export async function POST(req: Request) {
  const auth = await requireAuth();
  if ("response" in auth) return auth.response;
  const user = await getSessionUser(auth.session);
  if (!user) return fail("Not authenticated", 401);

  const form = await req.formData();
  const reportId = String(form.get("reportId") ?? "");
  const caption = String(form.get("caption") ?? "").slice(0, 200);
  const files = form.getAll("files").filter((f): f is File => f instanceof File);

  if (!reportId) return fail("reportId is required", 422);
  const report = await prisma.report.findUnique({ where: { id: reportId } });
  if (!report || report.userId !== user.id) return fail("Report not found", 404);
  if (files.length === 0) return fail("No files provided", 422);
  if (files.length > 6) return fail("Maximum 6 files per upload", 422);

  const maxMb = parseInt(process.env.MAX_UPLOAD_MB ?? "25", 10);
  const uploadDir = process.env.UPLOAD_DIR ?? "./uploads";
  await mkdir(uploadDir, { recursive: true });

  const saved: { id: string; fileName: string; kind: string }[] = [];
  for (const file of files) {
    const kind = ALLOWED[file.type];
    if (!kind) return fail(`File type not allowed: ${file.type || file.name}`, 422);
    if (file.size > maxMb * 1024 * 1024) {
      return fail(`"${file.name}" exceeds the ${maxMb} MB limit`, 422);
    }
    if (file.size === 0) return fail(`"${file.name}" is empty`, 422);

    // Basic privacy scan on the file name
    const piiFlags: string[] = [];
    if (PII_RE.some((re) => re.test(file.name))) piiFlags.push("possible-pii-in-filename");

    const key = `${randomUUID()}${extname(file.name).slice(0, 10)}`;
    const buf = Buffer.from(await file.arrayBuffer());
    await writeFile(join(uploadDir, key), buf);

    const ev = await prisma.evidence.create({
      data: {
        reportId, fileName: file.name.slice(0, 200), mimeType: file.type,
        size: file.size, storageKey: key, kind, piiFlags,
        caption: caption || undefined,
      },
    });
    saved.push({ id: ev.id, fileName: ev.fileName, kind: ev.kind });
  }

  return ok({ uploaded: saved }, 201);
}
