"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin, FileBarChart } from "lucide-react";
import { useLanguage } from "@/lib/i18n/provider";
import { StatusBadge } from "@/components/StatusBadge";
import { Reveal } from "@/components/Reveal";
import { get } from "@/lib/api-client";

export default function IssuesPage() {
  const { dict } = useLanguage();
  const [issues, setIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  useEffect(() => {
    setLoading(true);
    get<{ issues: any[] }>(`/api/issues${status ? `?status=${status}` : ""}`)
      .then((d) => setIssues(d.issues))
      .catch(() => setIssues([]))
      .finally(() => setLoading(false));
  }, [status]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <Reveal>
        <h1 className="text-3xl font-extrabold text-ink-900 md:text-4xl">{dict.issuesSection.title}</h1>
        <p className="mt-2 max-w-2xl text-ink-600">{dict.issuesSection.subtitle}</p>
        <p className="mt-3 inline-block rounded-full bg-amber-50 px-4 py-1.5 text-[12px] font-bold text-amber-800">
          🟢 Verified &nbsp; 🔵 Reported &nbsp; 🟡 Unverified &nbsp; 🟠 Disputed — unverified information is never presented as fact.
        </p>
      </Reveal>

      <div className="mt-6 flex flex-wrap gap-2">
        {["", "REPORTED", "UNDER_REVIEW", "ACTION_PENDING", "DISPUTED", "RESOLVED", "UNVERIFIED"].map((s) => (
          <button
            key={s || "all"}
            onClick={() => setStatus(s)}
            className={`rounded-full px-4 py-2 text-[13px] font-bold transition ${status === s ? "bg-ink-900 text-white shadow-soft" : "bg-white text-ink-600 border border-ink-900/10 hover:border-saffron-300"}`}
          >
            {s || dict.common.all}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-3xl border border-ink-900/10 bg-white p-6">
              <div className="skeleton h-5 w-1/3 rounded-full" />
              <div className="skeleton mt-3 h-6 w-3/4 rounded-full" />
              <div className="skeleton mt-2 h-4 w-full rounded-full" />
              <div className="skeleton mt-2 h-4 w-5/6 rounded-full" />
            </div>
          ))
        ) : issues.length === 0 ? (
          <p className="col-span-2 rounded-3xl border border-dashed border-ink-900/20 bg-white/60 px-6 py-14 text-center text-ink-500">
            No public issues in this filter yet.
          </p>
        ) : (
          issues.map((is, i) => (
            <Reveal key={is.slug} delay={Math.min(i, 6) * 60}>
              <Link href={`/issues/${is.slug}`} className="group block h-full rounded-3xl border border-ink-900/10 bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-lift">
                <div className="flex items-start justify-between gap-3">
                  <p className="flex items-center gap-1.5 text-[13px] font-bold text-ink-500">
                    <MapPin className="h-4 w-4 text-saffron-600" /> {is.city ?? is.district}, {is.state}
                  </p>
                  <StatusBadge status={is.status} />
                </div>
                <h2 className="mt-3 text-xl font-extrabold text-ink-900 group-hover:text-saffron-700">{is.title}</h2>
                <p className="mt-2 line-clamp-3 text-sm text-ink-600">{is.description}</p>
                <div className="mt-4 flex items-center gap-4 text-[13px] font-semibold text-ink-500">
                  <span className="inline-flex items-center gap-1.5"><FileBarChart className="h-4 w-4" /> {is.reportCount} reports</span>
                  <span>📎 {is.evidenceCount} evidence</span>
                  <span className="ml-auto text-saffron-700 group-hover:underline">{dict.common.learnMore} →</span>
                </div>
              </Link>
            </Reveal>
          ))
        )}
      </div>
    </div>
  );
}
