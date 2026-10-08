"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { MapPin, CalendarDays, Paperclip, ArrowLeft, Bot } from "lucide-react";
import { useLanguage } from "@/lib/i18n/provider";
import { StatusBadge, InfoTypeBadge } from "@/components/StatusBadge";
import { Timeline } from "@/components/Timeline";
import { Reveal } from "@/components/Reveal";
import { get } from "@/lib/api-client";

export default function TrackPage() {
  const params = useParams();
  const id = (params.id as string)?.toUpperCase();
  const { dict, tCategory } = useLanguage();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    get<any>(`/api/reports/${id}`)
      .then(setReport)
      .catch(() => setReport(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <div className="skeleton h-8 w-1/2 rounded-full" />
        <div className="skeleton mt-6 h-64 w-full rounded-3xl" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <p className="text-5xl">🔍</p>
        <h1 className="mt-4 text-2xl font-extrabold text-ink-900">Report not found</h1>
        <p className="mt-2 text-ink-600">
          Please check the report ID — it looks like <span className="font-mono font-bold">JA-10001</span> and is shown on your dashboard after submitting.
        </p>
        <Link href="/" className="mt-6 inline-block rounded-2xl bg-saffron-600 px-6 py-3 font-bold text-white hover:bg-saffron-700">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <Reveal>
        <Link href="/explore" className="inline-flex items-center gap-1.5 text-sm font-bold text-ink-500 hover:text-saffron-700">
          <ArrowLeft className="h-4 w-4" /> {dict.nav.explore}
        </Link>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span className="rounded-2xl bg-ink-900 px-4 py-2 font-mono text-lg font-black tracking-widest text-white">
            {report.publicId}
          </span>
          <StatusBadge status={report.status} />
          <span className="rounded-full bg-cream-200 px-3 py-1 text-[12px] font-bold text-ink-700">
            {tCategory(report.category)}
          </span>
        </div>
        <h1 className="mt-4 text-2xl font-extrabold text-ink-900 md:text-3xl">{report.title}</h1>
        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-ink-500">
          <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4" />{report.city}{report.area ? `, ${report.area}` : ""}, {report.district}, {report.state}</span>
          <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-4 w-4" />{new Date(report.createdAt).toLocaleDateString("en-IN", { dateStyle: "long" })}</span>
          {report.evidenceCount > 0 && <span className="inline-flex items-center gap-1.5"><Paperclip className="h-4 w-4" />{report.evidenceCount} evidence files</span>}
        </div>
      </Reveal>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <Reveal delay={80}>
          <div className="rounded-3xl border border-ink-900/10 bg-white p-6 shadow-soft">
            <h2 className="mb-5 font-bold text-ink-900">{dict.track.title}</h2>
            <Timeline history={report.timeline} current={report.status} />
          </div>
        </Reveal>

        <div className="space-y-5">
          <Reveal delay={120}>
            <div className="rounded-3xl border border-ink-900/10 bg-white p-6 shadow-soft">
              <h2 className="font-bold text-ink-900">Problem description</h2>
              <p className="mt-2 text-[14px] leading-relaxed text-ink-600">{report.description}</p>
              <p className="mt-3 text-[12px] text-ink-400">🔒 Reporter identity is kept private on public pages.</p>
            </div>
          </Reveal>

          {report.responses?.map((r: any, i: number) => (
            <Reveal key={i} delay={140}>
              <div className="rounded-3xl border border-leaf-200 bg-leaf-50/60 p-6">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="font-bold text-ink-900">🏛️ Official Response</h2>
                  <InfoTypeBadge type="verified" />
                </div>
                <p className="text-[12px] text-ink-400">
                  {r.authorityName}{r.department ? ` • ${r.department}` : ""} — {new Date(r.createdAt).toLocaleDateString("en-IN")}
                </p>
                <blockquote className="mt-3 rounded-2xl border-l-4 border-leaf-400 bg-white px-4 py-3 text-[14px] text-ink-700">
                  {r.content}
                </blockquote>
                <div className="mt-3 rounded-2xl bg-white/70 px-4 py-3 text-[13px] text-ink-600">
                  <p className="flex items-center gap-1.5 font-bold text-chakra-700"><Bot className="h-4 w-4" /> JanAwaaz AI — Simple Explanation</p>
                  <p className="mt-1">Authority ne aapki complaint par jawab diya hai. Upar original text hai — iska matlab hai ki aapki shikayat par dhyan diya gaya hai aur aage ki kaarravaai ki jaankari di gayi hai.</p>
                </div>
              </div>
            </Reveal>
          ))}

          <Reveal delay={160}>
            <div className="rounded-3xl bg-ink-900 p-6 text-white">
              <h2 className="font-bold">🤖 Complaint ka status samajhna hai?</h2>
              <p className="mt-1 text-sm text-white/70">Ask JanAwaaz AI to explain this timeline in simple language.</p>
              <Link href="/ai-assistant" className="mt-3 inline-block rounded-2xl bg-saffron-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-saffron-500">
                Ask AI about {report.publicId}
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
