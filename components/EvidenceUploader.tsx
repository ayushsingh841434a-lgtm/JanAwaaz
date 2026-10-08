"use client";

import { useRef, useState } from "react";
import { UploadCloud, X, FileImage, FileVideo, FileText, Mic, Loader2 } from "lucide-react";
import { useToast } from "./Toast";
import { cn } from "@/lib/utils";

const MAX_MB = 25;

function kindIcon(type: string) {
  if (type.startsWith("image/")) return FileImage;
  if (type.startsWith("video/")) return FileVideo;
  if (type.startsWith("audio/")) return Mic;
  return FileText;
}

/** Compress an image client-side (max 1600px, JPEG 0.82) to save bandwidth. */
async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/") || file.type === "image/gif") return file;
  try {
    const bitmap = await createImageBitmap(file);
    const max = 1600;
    const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
    if (scale >= 1) return file;
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/jpeg", 0.82));
    if (!blob) return file;
    return new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), { type: "image/jpeg" });
  } catch {
    return file;
  }
}

export function EvidenceUploader({ reportId, onDone }: { reportId: string; onDone?: () => void }) {
  const { toast } = useToast();
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = async (list: FileList | null) => {
    if (!list) return;
    const next: File[] = [];
    for (const f of Array.from(list)) {
      if (f.size > MAX_MB * 1024 * 1024) {
        toast(`"${f.name}" exceeds the ${MAX_MB} MB limit`, "error");
        continue;
      }
      next.push(f.type.startsWith("image/") ? await compressImage(f) : f);
    }
    setFiles((prev) => [...prev, ...next].slice(0, 6));
  };

  const upload = async () => {
    if (files.length === 0) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append("reportId", reportId);
      files.forEach((f) => form.append("files", f));
      const res = await fetch("/api/evidence", { method: "POST", body: form });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      toast(`${json.data.uploaded.length} file(s) uploaded securely`);
      setFiles([]);
      onDone?.();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); addFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "cursor-pointer rounded-3xl border-2 border-dashed p-8 text-center transition",
          drag ? "border-saffron-500 bg-saffron-50" : "border-ink-900/15 bg-cream-50 hover:border-saffron-300"
        )}
        role="button"
        aria-label="Upload evidence"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter") inputRef.current?.click(); }}
      >
        <UploadCloud className="mx-auto h-10 w-10 text-saffron-600" />
        <p className="mt-3 font-bold text-ink-900">📸 Photo &nbsp; 🎥 Video &nbsp; 📄 Document &nbsp; 🎤 Voice</p>
        <p className="mt-1 text-sm text-ink-500">Drag & drop or click to choose — max {MAX_MB} MB per file, 6 files max</p>
        <p className="mt-1 text-[12px] text-ink-400">Images are compressed on your device to save data. Files are private to you & authorised officers.</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((f, i) => {
            const Icon = kindIcon(f.type);
            return (
              <div key={i} className="flex items-center gap-3 rounded-2xl border border-ink-900/10 bg-white px-3 py-2.5">
                <Icon className="h-5 w-5 shrink-0 text-chakra-600" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink-900">{f.name}</p>
                  <p className="text-xs text-ink-400">{(f.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <button
                  onClick={() => setFiles((p) => p.filter((_, j) => j !== i))}
                  className="rounded-lg p-1.5 text-ink-400 hover:bg-red-50 hover:text-red-600"
                  aria-label={`Remove ${f.name}`}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            );
          })}
          <button
            onClick={upload}
            disabled={uploading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-ink-900 py-3 text-sm font-bold text-white shadow-soft transition hover:bg-ink-800 disabled:opacity-50"
          >
            {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <UploadCloud className="h-5 w-5" />}
            {uploading ? "Uploading securely…" : `Upload ${files.length} file${files.length > 1 ? "s" : ""}`}
          </button>
        </div>
      )}
    </div>
  );
}
