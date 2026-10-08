"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search, Inbox, ClipboardList, Hourglass, CheckCircle2, Flag,
  Paperclip, Send, X, ShieldCheck, MapPin,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/provider";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/Toast";
import { StatusBadge } from "@/components/StatusBadge";
import { Timeline } from "@/components/Timeline";
import { Reveal } from "@/components/Reveal";
import { get, patch, post } from "@/lib/api-client";
import { cn } from "@/lib/utils";

const NEXT_STATUS: Record<string, string[]> = {
  REPORTED: ["AUTHORITY_IDENTIFIED", "REJECTED"],
  AUTHORITY_IDENTIFIED: ["SUBMITTED", "REJECTED"],
  SUBMITTED: ["ACKNOWLEDGED", "REJECTED"],
  ACKNOWLEDGED: ["UNDER_REVIEW"],
  UNDER_REVIEW: ["ACTION_TAKEN"],
  ACTION_TAKEN: ["RESOLVED"],
  RESOLVED: [],
  REJECTED: ["REPORTED"],
};

export default function AuthorityPage() {
  const { tCategory } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const [stats, setStats] = useState<any>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [selected, setSelected] = useState<any>(null);
  const [detail, setDetail] = useState<any>(null);
  const [newStatus, setNewStatus] = useState("");
  const [note, setNote] = useState("");
  const [response, setResponse] = useState("");
  const [acting, setActing] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const qs = new URLSearchParams({ limit: "15" });
      if (q) qs.set("q", q);
      if (status) qs.set("status", status);
      if (category) qs.set("category", category);
      const d = await get<any>(`/api/authority/stats?${qs}`);
      setStats(d);
      setReports(d.reports);
      setTotal(d.total);
    } catch {
      toast("Failed to load dashboard", "error");
    } finally {
      setLoading(false);
    }
  }, [q, status, category, toast]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push("/login?next=/authority"); return; }
    if (user.role !== "AUTHORITY" && user.role !== "ADMIN") { router.push("/dashboard"); return; }
    fetchAll();
  }, [authLoading, user, router, fetchAll]);

  const openDetail = async (publicId: string) => {
    try {
      const d = await get<any>(`/api/reports/${publicId}`);
      setDetail(d);
      setSelected(publicId);
      setNewStatus("");
      setNote("");
      // fetch evidence list (authority can see metadata via reports? — use detail + separate call)
    } catch {
      toast("Failed to load report", "error");
    }
  };

  const updateStatus = async () => {
    if (!selected || !newStatus) return;
    setActing(true);
    try {
      await patch(`/api/reports/${selected}`, { status: newStatus, note: note || undefined });
      toast(`Status updated to ${newStatus}`);
      setSelected(null);
      setDetail(null);
      fetchAll();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Update failed", "error");
    } finally {
      setActing(false);
    }
  };

  const sendResponse = async () => {
    if (!selected || response.trim().length < 4) return;
    setActing(true);
    try {
      await post(`/api/reports/${selected}/respond`, { content: response.trim() });
      toast("Official response published");
      setResponse("");
      openDetail(selected);
      fetchAll();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Failed", "error");
    } finally {
      setActing(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="skeleton h-10 w-72 rounded-full" />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton h-28 rounded-3xl" />)}
        </div>
      </div>
    );
  }

  if (!user || !stats) return null;

  const cards = [
    { label: "New Reports", value: stats.counts.new, icon: Inbox, color: "text-chakra-600", bg: "bg-chakra-50" },
    { label: "Assigned", value: stats.counts.assigned, icon: ClipboardList, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Pending Review", value: stats.counts.pending, icon: Hourglass, color: "text-saffron-600", bg: "bg-saffron-50" },
    { label: "Action Taken", value: stats.counts.actionTaken, icon: Flag, color: "text-chakra-700", bg: "bg-chakra-50" },
    { label: "Resolved", value: stats.counts.resolved, icon: CheckCircle2, color: "text-leaf-600", bg: "bg-leaf-50" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <Reveal>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="inline-flex items-center gap-1.5 rounded-full bg-ink-900 px-3.5 py-1.5 text-[12px] font-bold text-white">
              <ShieldCheck className="h-3.5 w-3.5 text-leaf-400" /> {user.role === "ADMIN" ? "Admin" : "Authority"} Dashboard
            </p>
            <h1 className="mt-2 text-3xl font-extrabold text-ink-900">
              {stats.jurisdiction.department ?? "Grievance Cell"}
            </h1>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-500">
              <MapPin className="h-4 w-4" />
              Jurisdiction: {[stats.jurisdiction.district, stats.jurisdiction.state].filter(Boolean).join(", ") || "All India (admin)"}
            </p>
          </div>
        </div>
      </Reveal>

      {/* Stat cards */}
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-5">
        {cards.map((c, i) => (
          <Reveal key={c.label} delay={i * 50}>
            <div className={cn("rounded-3xl p-5 shadow-soft", c.bg)}>
              <c.icon className={cn("h-6 w-6", c.color)} />
              <p className="mt-2 text-3xl font-black text-ink-900">{c.value}</p>
              <p className="text-[13px] font-bold text-ink-600">{c.label}</p>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Filters */}
      <div className="mt-8 flex flex-wrap gap-2">
        <div className="relative min-w-52 flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            value={q} onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchAll()}
            placeholder="Search ID, title, city…"
            className="w-full rounded-2xl border border-ink-900/15 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-saffron-400"
            aria-label="Search reports"
          />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-2xl border border-ink-900/15 bg-white px-3 py-2.5 text-sm font-semibold" aria-label="Status filter">
          <option value="">All statuses</option>
          {Object.keys(NEXT_STATUS).map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-2xl border border-ink-900/15 bg-white px-3 py-2.5 text-sm font-semibold" aria-label="Category filter">
          <option value="">All categories</option>
          {["WATER","ROADS","ELECTRICITY","GARBAGE","DRAINAGE","EDUCATION","HEALTHCARE","TRANSPORT","ENVIRONMENT","PUBLIC_SERVICES"].map((c) => (
            <option key={c} value={c}>{tCategory(c)}</option>
          ))}
        </select>
        <button onClick={fetchAll} className="rounded-2xl bg-ink-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-ink-800">Apply</button>
      </div>

      {/* Report list */}
      <div className="mt-5 overflow-hidden rounded-3xl border border-ink-900/10 bg-white shadow-soft">
        <div className="hidden grid-cols-[110px_1fr_130px_130px_110px_90px] gap-3 border-b border-ink-900/10 bg-cream-100 px-5 py-3 text-[12px] font-bold uppercase tracking-wide text-ink-500 lg:grid">
          <span>ID</span><span>Title</span><span>Category</span><span>Status</span><span>Priority</span><span>Evidence</span>
        </div>
        {reports.map((r: any) => (
          <button
            key={r.publicId}
            onClick={() => openDetail(r.publicId)}
            className="grid w-full grid-cols-1 gap-2 border-b border-ink-900/5 px-5 py-4 text-left transition hover:bg-cream-50 sm:grid-cols-2 lg:grid-cols-[110px_1fr_130px_130px_110px_90px] lg:items-center lg:gap-3"
          >
            <span className="font-mono text-[13px] font-black text-chakra-700">{r.publicId}</span>
            <span>
              <span className="block truncate font-bold text-ink-900">{r.title}</span>
              <span className="text-[12px] text-ink-400">{r.city}{r.area ? `, ${r.area}` : ""} • {r.reporterName}</span>
            </span>
            <span className="text-[13px] font-semibold text-ink-600">{tCategory(r.category)}</span>
            <span><StatusBadge status={r.status} /></span>
            <span className={cn("text-[12px] font-bold", r.priority === "URGENT" ? "text-red-600" : r.priority === "HIGH" ? "text-saffron-600" : "text-ink-400")}>{r.priority}</span>
            <span className="inline-flex items-center gap-1 text-[13px] text-ink-500"><Paperclip className="h-3.5 w-3.5" />{r.evidenceCount}</span>
          </button>
        ))}
        {reports.length === 0 && (
          <p className="px-6 py-14 text-center text-ink-500">No reports match these filters in your jurisdiction.</p>
        )}
      </div>
      <p className="mt-3 text-sm text-ink-400">{total} report(s) in jurisdiction</p>

      {/* Detail drawer */}
      {detail && (
        <div className="fixed inset-0 z-[80] flex justify-end bg-ink-950/50 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Report detail">
          <div className="bubble-in flex h-full w-full max-w-2xl flex-col overflow-hidden bg-white shadow-lift">
            <div className="flex items-center justify-between border-b border-ink-900/10 px-6 py-4">
              <div>
                <p className="font-mono text-sm font-black text-chakra-700">{detail.publicId}</p>
                <h2 className="font-bold text-ink-900">{detail.title}</h2>
              </div>
              <button onClick={() => { setSelected(null); setDetail(null); }} className="rounded-xl p-2 hover:bg-ink-900/5" aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="nice-scroll flex-1 space-y-5 overflow-y-auto px-6 py-5">
              <div className="flex flex-wrap gap-2">
                <StatusBadge status={detail.status} />
                <span className="rounded-full bg-cream-200 px-3 py-1 text-[12px] font-bold">{tCategory(detail.category)}</span>
                <span className="rounded-full bg-cream-200 px-3 py-1 text-[12px] font-bold">{detail.priority}</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-ink-700">Description</h3>
                <p className="mt-1 text-[14px] text-ink-600">{detail.description}</p>
                <p className="mt-1 text-[12px] text-ink-400">📍 {detail.city}{detail.area ? `, ${detail.area}` : ""}, {detail.district}, {detail.state}</p>
              </div>
              <div>
                <h3 className="mb-3 text-sm font-bold text-ink-700">Status history (audit trail)</h3>
                <Timeline history={detail.timeline} current={detail.status} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-ink-700">Official responses ({detail.responses.length})</h3>
                {detail.responses.length === 0 && <p className="mt-1 text-[13px] text-ink-400">No responses yet.</p>}
                {detail.responses.map((r: any, i: number) => (
                  <blockquote key={i} className="mt-2 rounded-2xl border-l-4 border-leaf-400 bg-leaf-50 px-4 py-3 text-[13px] text-ink-700">
                    <p className="mb-1 text-[11px] font-bold text-ink-400">{r.authorityName} — {new Date(r.createdAt).toLocaleString("en-IN")}</p>
                    {r.content}
                  </blockquote>
                ))}
                <div className="mt-3">
                  <label htmlFor="off-resp" className="mb-1.5 block text-[13px] font-bold text-ink-700">Post official response</label>
                  <textarea
                    id="off-resp" value={response} onChange={(e) => setResponse(e.target.value)} rows={3}
                    placeholder="Write the official response… (published verbatim)"
                    className="w-full rounded-2xl border border-ink-900/15 bg-cream-50 px-4 py-3 text-sm outline-none focus:border-saffron-400"
                  />
                  <button onClick={sendResponse} disabled={acting || response.trim().length < 4} className="mt-2 inline-flex items-center gap-1.5 rounded-2xl bg-leaf-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-leaf-700 disabled:opacity-40">
                    <Send className="h-4 w-4" /> Publish response
                  </button>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold text-ink-700">Update status</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} className="rounded-2xl border border-ink-900/15 bg-white px-3 py-2.5 text-sm font-semibold" aria-label="New status">
                    <option value="">Select next status…</option>
                    {(NEXT_STATUS[detail.status] ?? []).map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <input
                    value={note} onChange={(e) => setNote(e.target.value)}
                    placeholder="Note (optional)" className="min-w-40 flex-1 rounded-2xl border border-ink-900/15 bg-cream-50 px-3 py-2.5 text-sm outline-none focus:border-saffron-400"
                  />
                  <button onClick={updateStatus} disabled={acting || !newStatus} className="rounded-2xl bg-ink-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-ink-800 disabled:opacity-40">
                    {acting ? "Updating…" : "Update"}
                  </button>
                </div>
                <p className="mt-1.5 text-[12px] text-ink-400">The citizen is notified automatically on every status change.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
