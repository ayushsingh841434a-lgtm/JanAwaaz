"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FileText, Bookmark, User as UserIcon, Plus, MapPin, Loader2, Bell,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/provider";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/Toast";
import { StatusBadge } from "@/components/StatusBadge";
import { Reveal } from "@/components/Reveal";
import { get, patch, post } from "@/lib/api-client";
import { LANGUAGES, isLang } from "@/lib/i18n/dictionaries";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const { dict, lang, setLang, tCategory } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const search = useSearchParams();
  const [tab, setTab] = useState(search.get("tab") ?? "reports");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [profile, setProfile] = useState({ name: "", phone: "", state: "", district: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push("/login?next=/dashboard"); return; }
    if (user.role === "AUTHORITY" || user.role === "ADMIN") { router.push("/authority"); return; }
    Promise.all([
      get<any>("/api/user/profile").catch(() => null),
      get<any>("/api/notifications").catch(() => ({ notifications: [] })),
    ]).then(([p, n]) => {
      setData(p);
      setNotifications(n.notifications ?? []);
      if (p?.user) setProfile({ name: p.user.name ?? "", phone: p.user.phone ?? "", state: p.user.state ?? "", district: p.user.district ?? "" });
      setLoading(false);
    });
  }, [authLoading, user, router]);

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await patch("/api/user/profile", profile);
      toast("Profile updated");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed", "error");
    } finally {
      setSaving(false);
    }
  };

  const changeLang = (l: string) => {
    if (!isLang(l)) return;
    setLang(l);
  };

  if (authLoading || loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="skeleton h-10 w-64 rounded-full" />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton h-40 rounded-3xl" />)}
        </div>
      </div>
    );
  }

  if (!user || !data) return null;

  const tabs = [
    { id: "reports", label: dict.nav.myReports, icon: FileText },
    { id: "saved", label: dict.nav.saved, icon: Bookmark },
    { id: "notifications", label: dict.nav.notifications, icon: Bell },
    { id: "profile", label: dict.nav.profile, icon: UserIcon },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Reveal>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-ink-900">Namaste, {user.name.split(" ")[0]} 🙏</h1>
            <p className="mt-1 text-ink-500">{dict.nav.dashboard} — {data.reportCount} reports filed</p>
          </div>
          <Link href="/report" className="inline-flex items-center gap-2 rounded-2xl bg-saffron-600 px-5 py-3 font-bold text-white shadow-soft transition hover:bg-saffron-700">
            <Plus className="h-4 w-4" /> {dict.nav.reportProblem}
          </Link>
        </div>
      </Reveal>

      <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-bold transition",
              tab === t.id ? "bg-ink-900 text-white shadow-soft" : "border border-ink-900/10 bg-white text-ink-600 hover:border-saffron-300"
            )}
          >
            <t.icon className="h-4 w-4" /> {t.label}
            {t.id === "notifications" && notifications.filter((n) => !n.read).length > 0 && (
              <span className="rounded-full bg-saffron-600 px-2 py-0.5 text-[10px] font-bold text-white">
                {notifications.filter((n) => !n.read).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* My Reports */}
      {tab === "reports" && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.recentReports.length === 0 ? (
            <div className="col-span-full rounded-3xl border border-dashed border-ink-900/20 bg-white/60 px-6 py-14 text-center">
              <p className="text-4xl">📢</p>
              <p className="mt-3 font-bold text-ink-900">No reports yet</p>
              <p className="mt-1 text-sm text-ink-500">Your voice matters — report your first civic issue.</p>
              <Link href="/report" className="mt-4 inline-block rounded-2xl bg-saffron-600 px-6 py-3 font-bold text-white hover:bg-saffron-700">
                {dict.reportCta.start}
              </Link>
            </div>
          ) : (
            data.recentReports.map((r: any, i: number) => (
              <Reveal key={r.id} delay={Math.min(i, 8) * 40}>
                <Link href={`/track/${r.publicId}`} className="block h-full rounded-3xl border border-ink-900/10 bg-white p-5 shadow-soft transition hover:-translate-y-1 hover:shadow-lift">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono text-[13px] font-black text-chakra-700">{r.publicId}</span>
                    <StatusBadge status={r.status} />
                  </div>
                  <p className="mt-2 font-bold text-ink-900">{r.title}</p>
                  <p className="mt-1 text-[12px] font-semibold text-ink-400">{tCategory(r.category)}</p>
                  <div className="mt-3 flex items-center gap-4 text-[12px] text-ink-400">
                    <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{r.city}</span>
                    <span>📎 {r._count.evidence}</span>
                    <span>🏛️ {r._count.responses}</span>
                  </div>
                </Link>
              </Reveal>
            ))
          )}
        </div>
      )}

      {/* Saved issues */}
      {tab === "saved" && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {data.savedIssues.length === 0 ? (
            <p className="col-span-full rounded-3xl border border-dashed border-ink-900/20 bg-white/60 px-6 py-14 text-center text-ink-500">
              No saved issues yet. Browse <Link href="/issues" className="font-bold text-saffron-700 hover:underline">Public Issues</Link> and save the ones you follow.
            </p>
          ) : (
            data.savedIssues.map((is: any) => (
              <Link key={is.id} href={`/issues/${is.slug}`} className="rounded-3xl border border-ink-900/10 bg-white p-5 shadow-soft transition hover:-translate-y-1 hover:shadow-lift">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-bold text-ink-900">{is.title}</p>
                  <StatusBadge status={is.status} />
                </div>
                <p className="mt-1.5 line-clamp-2 text-sm text-ink-500">{is.description}</p>
              </Link>
            ))
          )}
        </div>
      )}

      {/* Notifications */}
      {tab === "notifications" && (
        <div className="mt-6 space-y-2.5">
          {notifications.length === 0 ? (
            <p className="rounded-3xl border border-dashed border-ink-900/20 bg-white/60 px-6 py-14 text-center text-ink-500">
              No notifications yet. You'll be notified on status changes and official responses.
            </p>
          ) : (
            notifications.map((n: any) => (
              <Link
                key={n.id}
                href={n.link ?? "/dashboard"}
                className={cn("block rounded-2xl border p-4 transition hover:shadow-soft", n.read ? "border-ink-900/10 bg-white" : "border-saffron-300 bg-saffron-50")}
              >
                <p className="text-sm font-bold text-ink-900">{n.title}</p>
                <p className="mt-0.5 text-[13px] text-ink-600">{n.body}</p>
                <p className="mt-1 text-[11px] text-ink-400">{new Date(n.createdAt).toLocaleString("en-IN")}</p>
              </Link>
            ))
          )}
        </div>
      )}

      {/* Profile */}
      {tab === "profile" && (
        <form onSubmit={saveProfile} className="mt-6 max-w-xl space-y-4 rounded-3xl border border-ink-900/10 bg-white p-6 shadow-soft">
          <div>
            <label htmlFor="p-name" className="mb-1.5 block text-sm font-bold text-ink-700">Name</label>
            <input id="p-name" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="w-full rounded-2xl border border-ink-900/15 bg-cream-50 px-4 py-3 outline-none focus:border-saffron-400" />
          </div>
          <div>
            <label htmlFor="p-phone" className="mb-1.5 block text-sm font-bold text-ink-700">Phone <span className="font-normal text-ink-400">(private — never shown publicly)</span></label>
            <input id="p-phone" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className="w-full rounded-2xl border border-ink-900/15 bg-cream-50 px-4 py-3 outline-none focus:border-saffron-400" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="p-state" className="mb-1.5 block text-sm font-bold text-ink-700">State</label>
              <input id="p-state" value={profile.state} onChange={(e) => setProfile({ ...profile, state: e.target.value })} className="w-full rounded-2xl border border-ink-900/15 bg-cream-50 px-4 py-3 outline-none focus:border-saffron-400" />
            </div>
            <div>
              <label htmlFor="p-district" className="mb-1.5 block text-sm font-bold text-ink-700">District</label>
              <input id="p-district" value={profile.district} onChange={(e) => setProfile({ ...profile, district: e.target.value })} className="w-full rounded-2xl border border-ink-900/15 bg-cream-50 px-4 py-3 outline-none focus:border-saffron-400" />
            </div>
          </div>
          <div>
            <label htmlFor="p-lang" className="mb-1.5 block text-sm font-bold text-ink-700">{dict.nav.language}</label>
            <select id="p-lang" value={lang} onChange={(e) => changeLang(e.target.value)} className="w-full rounded-2xl border border-ink-900/15 bg-cream-50 px-4 py-3 outline-none focus:border-saffron-400">
              {LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.native} — {l.label}</option>)}
            </select>
          </div>
          <button type="submit" disabled={saving} className="flex items-center gap-2 rounded-2xl bg-ink-900 px-6 py-3 font-bold text-white hover:bg-ink-800 disabled:opacity-50">
            {saving && <Loader2 className="h-4 w-4 animate-spin" />} {dict.common.save}
          </button>
        </form>
      )}
    </div>
  );
}
