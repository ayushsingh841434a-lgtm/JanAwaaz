"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { MapPin, CalendarDays, Bookmark, ArrowLeft, ExternalLink } from "lucide-react";
import { StatusBadge, InfoTypeBadge } from "@/components/StatusBadge";
import { Reveal } from "@/components/Reveal";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/Toast";
import { get, post } from "@/lib/api-client";
import { cn } from "@/lib/utils";

export default function IssueDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { user } = useAuth();
  const { toast } = useToast();
  const [issue, setIssue] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    get<any>(`/api/issues/${slug}`)
      .then(setIssue)
      .catch(() => setIssue(null))
      .finally(() => setLoading(false));
  }, [slug]);

  const toggleSave = async () => {
    if (!user) { toast("Please log in to save issues", "info"); return; }
    try {
      const d = await post<{ saved: boolean }>(`/api/issues/${slug}/save`);
      setSaved(d.saved);
      toast(d.saved ? "Issue saved" : "Removed from saved");
    } catch { toast("Failed", "error"); }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <div className="skeleton h-8 w-2/3 rounded-full" />
        <div className="skeleton mt-4 h-4 w-full rounded-full" />
        <div className="skeleton mt-2 h-4 w-5/6 rounded-full" />
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <p className="text-xl font-bold text-ink-900">Issue not found</p>
        <Link href="/issues" className="mt-4 inline-block text-saffron-700 hover:underline">← Back to issues</Link>
      </div>
    );
  }

  const sections = [
    { label: "📝 Background", body: issue.background, type: "reported" },
    { label: "🗣️ Concerns / Demands", body: issue.concerns, type: "reported" },
    { label: "🏛️ Official Response", body: issue.officialResponse, type: "verified" },
    { label: "📊 Current Status", body: null, type: null },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <Reveal>
        <Link href="/issues" className="inline-flex items-center gap-1.5 text-sm font-bold text-ink-500 hover:text-saffron-700">
          <ArrowLeft className="h-4 w-4" /> Back to issues
        </Link>
        <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="flex items-center gap-1.5 text-sm font-bold text-ink-500">
              <MapPin className="h-4 w-4 text-saffron-600" /> {issue.city ?? issue.district}, {issue.state}
              <span className="ml-2 inline-flex items-center gap-1 text-ink-400"><CalendarDays className="h-3.5 w-3.5" />{new Date(issue.publishedAt).toLocaleDateString("en-IN")}</span>
            </p>
            <h1 className="mt-2 text-3xl font-extrabold text-ink-900 md:text-4xl">{issue.title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={issue.status} />
            <button
              onClick={toggleSave}
              aria-pressed={saved}
              aria-label="Save issue"
              className={cn("rounded-xl border p-2.5 transition", saved ? "border-saffron-400 bg-saffron-50 text-saffron-700" : "border-ink-900/15 text-ink-400 hover:border-saffron-300")}
            >
              <Bookmark className={cn("h-4 w-4", saved && "fill-current")} />
            </button>
          </div>
        </div>
        <p className="mt-4 rounded-3xl border border-ink-900/10 bg-white p-6 text-[15px] leading-relaxed text-ink-700 shadow-soft">
          {issue.description}
        </p>
      </Reveal>

      <div className="mt-6 space-y-4">
        {sections.map((s, i) => (
          <Reveal key={s.label} delay={i * 60}>
            <div className="rounded-3xl border border-ink-900/10 bg-white p-6 shadow-soft">
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-bold text-ink-900">{s.label}</h2>
                {s.type && <InfoTypeBadge type={s.type} />}
              </div>
              {s.body ? (
                <p className="mt-2 text-[14px] leading-relaxed text-ink-600">{s.body}</p>
              ) : s.label.includes("Status") ? (
                <div className="mt-3 flex flex-wrap items-center gap-4">
                  <StatusBadge status={issue.status} />
                  <span className="text-sm text-ink-500">📊 {issue.reportCount} reports • 📎 {issue.evidenceCount} evidence files</span>
                </div>
              ) : (
                <p className="mt-2 text-sm italic text-ink-400">No official response published yet.</p>
              )}
            </div>
          </Reveal>
        ))}

        {issue.sources?.length > 0 && (
          <Reveal>
            <div className="rounded-3xl border border-chakra-200 bg-chakra-50 p-6">
              <h2 className="font-bold text-chakra-900">🔎 Sources</h2>
              <ul className="mt-2 space-y-1.5">
                {issue.sources.map((src: any, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-[13px] text-chakra-800">
                    <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    <span><strong>{src.label}</strong>{src.note ? ` — ${src.note}` : ""}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        )}

        {issue.reports?.length > 0 && (
          <Reveal>
            <div className="rounded-3xl border border-ink-900/10 bg-white p-6 shadow-soft">
              <h2 className="font-bold text-ink-900">Linked citizen reports <span className="text-sm font-normal text-ink-400">(identities kept private)</span></h2>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {issue.reports.map((r: any) => (
                  <Link key={r.publicId} href={`/track/${r.publicId}`} className="rounded-2xl bg-cream-50 p-3.5 transition hover:bg-cream-100">
                    <p className="font-mono text-[12px] font-bold text-chakra-700">{r.publicId}</p>
                    <p className="mt-0.5 truncate text-sm font-semibold text-ink-900">{r.title}</p>
                    <p className="text-[12px] text-ink-400">{r.city}{r.area ? `, ${r.area}` : ""}</p>
                  </Link>
                ))}
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </div>
  );
}
