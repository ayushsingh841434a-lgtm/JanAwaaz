"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search, MapPin, CalendarDays, Paperclip, SlidersHorizontal } from "lucide-react";
import { useLanguage } from "@/lib/i18n/provider";
import { StatusBadge } from "@/components/StatusBadge";
import { Reveal } from "@/components/Reveal";
import { get } from "@/lib/api-client";
import { CATEGORIES } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface Report {
  publicId: string; category: string; title: string; description: string;
  state: string; district: string; city: string; area: string | null;
  status: string; evidenceCount: number; createdAt: string;
}

function Skeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-3xl border border-ink-900/10 bg-white p-6">
          <div className="skeleton h-5 w-2/3 rounded-full" />
          <div className="skeleton mt-3 h-4 w-full rounded-full" />
          <div className="skeleton mt-2 h-4 w-5/6 rounded-full" />
          <div className="skeleton mt-4 h-8 w-1/3 rounded-full" />
        </div>
      ))}
    </div>
  );
}

export default function ExplorePage() {
  const { dict, tCategory } = useLanguage();
  const searchParams = useSearchParams();
  const [reports, setReports] = useState<Report[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const [category, setCategory] = useState(searchParams.get("category") ?? "");
  const [city, setCity] = useState(searchParams.get("city") ?? "");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const qs = new URLSearchParams({ page: String(page), limit: "12" });
      if (q) qs.set("q", q);
      if (category) qs.set("category", category);
      if (city) qs.set("city", city);
      if (status) qs.set("status", status);
      const d = await get<{ reports: Report[]; total: number }>(`/api/reports?${qs}`);
      setReports(d.reports);
      setTotal(d.total);
    } catch {
      setReports([]);
    } finally {
      setLoading(false);
    }
  }, [q, category, city, status, page]);

  useEffect(() => { fetchReports(); }, [fetchReports]);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchReports();
  };

  const selectCls = "rounded-xl border border-ink-900/15 bg-white px-3 py-2.5 text-sm font-semibold text-ink-700 outline-none focus:border-saffron-400";

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <Reveal>
        <h1 className="text-3xl font-extrabold text-ink-900 md:text-4xl">{dict.nav.explore}</h1>
        <p className="mt-2 max-w-2xl text-ink-600">
          Citizen-reported civic issues across India — aggregated and privacy-safe. No reporter identities are shown.
        </p>
      </Reveal>

      {/* Search + filters */}
      <Reveal delay={80}>
        <form onSubmit={submitSearch} className="mt-6 rounded-3xl border border-ink-900/10 bg-white p-4 shadow-soft md:p-5">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
              <label htmlFor="explore-q" className="sr-only">{dict.common.search}</label>
              <input
                id="explore-q"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={dict.common.searchPh}
                className="w-full rounded-2xl border border-ink-900/15 bg-cream-50 py-3 pl-11 pr-4 text-[15px] outline-none transition focus:border-saffron-400"
              />
            </div>
            <button type="submit" className="rounded-2xl bg-ink-900 px-6 font-bold text-white transition hover:bg-ink-800">
              {dict.common.search}
            </button>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-ink-400" />
            <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }} className={selectCls} aria-label="Category">
              <option value="">{dict.common.all} categories</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{tCategory(c)}</option>)}
            </select>
            <input
              value={city} onChange={(e) => { setCity(e.target.value); setPage(1); }}
              placeholder="City" className={cn(selectCls, "w-32")}
              aria-label="City"
            />
            <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className={selectCls} aria-label="Status">
              <option value="">{dict.common.all} statuses</option>
              {["REPORTED", "UNDER_REVIEW", "ACTION_TAKEN", "RESOLVED"].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            {(q || category || city || status) && (
              <button
                type="button"
                onClick={() => { setQ(""); setCategory(""); setCity(""); setStatus(""); setPage(1); }}
                className="text-sm font-bold text-saffron-700 hover:underline"
              >
                Clear
              </button>
            )}
          </div>
        </form>
      </Reveal>

      {/* Results */}
      <div className="mt-8">
        {!loading && (
          <p className="mb-4 text-sm font-semibold text-ink-500" role="status">
            {total} report{total === 1 ? "" : "s"} found
          </p>
        )}
        {loading ? <Skeleton /> : reports.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-ink-900/20 bg-white/60 px-6 py-16 text-center">
            <p className="text-4xl">🔍</p>
            <p className="mt-3 font-bold text-ink-900">No reports found</p>
            <p className="mt-1 text-sm text-ink-500">Try a different search — or be the first to report this issue.</p>
            <Link href="/report" className="mt-4 inline-block rounded-2xl bg-saffron-600 px-6 py-3 font-bold text-white hover:bg-saffron-700">
              {dict.nav.reportProblem}
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {reports.map((r, i) => (
              <Reveal key={r.publicId} delay={Math.min(i, 8) * 50}>
                <Link
                  href={`/track/${r.publicId}`}
                  className="group block h-full rounded-3xl border border-ink-900/10 bg-white p-5 shadow-soft transition hover:-translate-y-1 hover:shadow-lift"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="rounded-full bg-cream-200 px-3 py-1 text-[11px] font-bold text-ink-700">
                      {tCategory(r.category)}
                    </span>
                    <StatusBadge status={r.status} />
                  </div>
                  <p className="mt-3 font-bold leading-snug text-ink-900 group-hover:text-saffron-700">{r.title}</p>
                  <p className="mt-1.5 line-clamp-2 text-[13px] text-ink-500">{r.description}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-ink-400">
                    <span className="inline-flex items-center gap-1 font-mono font-bold text-chakra-700">{r.publicId}</span>
                    <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{r.city}{r.area ? `, ${r.area}` : ""}</span>
                    <span className="inline-flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" />{new Date(r.createdAt).toLocaleDateString("en-IN")}</span>
                    {r.evidenceCount > 0 && <span className="inline-flex items-center gap-1"><Paperclip className="h-3.5 w-3.5" />{r.evidenceCount}</span>}
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        )}

        {/* Pagination */}
        {total > 12 && (
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-xl border border-ink-900/15 bg-white px-4 py-2 text-sm font-bold disabled:opacity-40"
            >
              {dict.common.back}
            </button>
            <span className="text-sm font-semibold text-ink-500">Page {page} of {Math.ceil(total / 12)}</span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= Math.ceil(total / 12)}
              className="rounded-xl border border-ink-900/15 bg-white px-4 py-2 text-sm font-bold disabled:opacity-40"
            >
              {dict.common.next}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
