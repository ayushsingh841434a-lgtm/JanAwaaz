"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell, ChevronDown, Globe, Menu, X, User, FileText, Bookmark,
  Shield, LogOut, LayoutDashboard, Sparkles,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/provider";
import { LANGUAGES } from "@/lib/i18n/dictionaries";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { get, patch } from "@/lib/api-client";
import { ChatUI } from "./ChatUI";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label="JanAwaaz home">
      <span className="relative flex h-9 w-9 items-center justify-center">
        {/* Ashoka-chakra-inspired mark */}
        <svg viewBox="0 0 40 40" className="h-9 w-9" aria-hidden="true">
          <circle cx="20" cy="20" r="17" fill="none" stroke="#2456d6" strokeWidth="3" />
          <circle cx="20" cy="20" r="4" fill="#e06a0a" />
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i * Math.PI) / 6;
            return (
              <line
                key={i}
                x1={Number((20 + 6 * Math.cos(a)).toFixed(3))}
                y1={Number((20 + 6 * Math.sin(a)).toFixed(3))}
                x2={Number((20 + 15 * Math.cos(a)).toFixed(3))}
                y2={Number((20 + 15 * Math.sin(a)).toFixed(3))}
                stroke="#2456d6" strokeWidth="1.6"
              />
            );
          })}
        </svg>
        <span className="absolute -bottom-0.5 left-1/2 h-1.5 w-8 -translate-x-1/2 rounded-full bg-gradient-to-r from-saffron-500 via-white to-leaf-500 shadow-sm" />
      </span>
      {!compact && (
        <span className="text-xl font-extrabold tracking-tight text-ink-900">
          Jan<span className="text-saffron-600">Awaaz</span>
        </span>
      )}
    </Link>
  );
}

export function LanguageSelector({ compact = false }: { compact?: boolean }) {
  const { lang, setLang, dict } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const current = LANGUAGES.find((l) => l.code === lang);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-xl border border-ink-900/10 bg-white/80 px-3 py-2 text-sm font-semibold text-ink-700 shadow-soft transition hover:border-saffron-300"
        aria-label={dict.nav.language}
        aria-expanded={open}
      >
        <Globe className="h-4 w-4 text-saffron-600" />
        {!compact && <span>{current?.native}</span>}
        <ChevronDown className={cn("h-3.5 w-3.5 transition", open && "rotate-180")} />
      </button>
      {open && (
        <div className="bubble-in absolute right-0 z-50 mt-2 max-h-80 w-52 overflow-y-auto rounded-2xl border border-ink-900/10 bg-white p-1.5 shadow-lift nice-scroll">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => { setLang(l.code); setOpen(false); }}
              className={cn(
                "flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition",
                l.code === lang ? "bg-saffron-50 font-bold text-saffron-700" : "text-ink-700 hover:bg-cream-100"
              )}
            >
              <span>{l.native}</span>
              <span className="text-xs text-ink-400">{l.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function NotificationsBell() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [unread, setUnread] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    get<{ notifications: any[]; unread: number }>("/api/notifications")
      .then((d) => { setItems(d.notifications); setUnread(d.unread); })
      .catch(() => {});
  }, [user]);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  if (!user) return null;

  const markAll = async () => {
    await patch("/api/notifications", { all: true }).catch(() => {});
    setUnread(0);
    setItems((xs) => xs.map((x) => ({ ...x, read: true })));
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative rounded-xl border border-ink-900/10 bg-white/80 p-2.5 text-ink-700 shadow-soft transition hover:border-saffron-300"
        aria-label="Notifications"
        aria-expanded={open}
      >
        <Bell className="h-4.5 w-4.5" />
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-saffron-600 px-1 text-[10px] font-bold text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>
      {open && (
        <div className="bubble-in absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-ink-900/10 bg-white shadow-lift">
          <div className="flex items-center justify-between border-b border-ink-900/10 px-4 py-3">
            <p className="text-sm font-bold text-ink-900">Notifications</p>
            {unread > 0 && (
              <button onClick={markAll} className="text-xs font-semibold text-saffron-700 hover:underline">
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto nice-scroll">
            {items.length === 0 && (
              <p className="px-4 py-8 text-center text-sm text-ink-400">No notifications yet.</p>
            )}
            {items.map((n) => (
              <Link
                key={n.id}
                href={n.link ?? "/dashboard"}
                onClick={() => setOpen(false)}
                className={cn("block border-b border-ink-900/5 px-4 py-3 transition hover:bg-cream-50", !n.read && "bg-saffron-50/60")}
              >
                <p className="text-[13px] font-semibold text-ink-900">{n.title}</p>
                <p className="mt-0.5 text-[12px] text-ink-600">{n.body}</p>
                <p className="mt-1 text-[11px] text-ink-400">{new Date(n.createdAt).toLocaleString("en-IN")}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function UserMenu() {
  const { user, logout } = useAuth();
  const { dict } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  if (!user) {
    return (
      <div className="hidden items-center gap-2 md:flex">
        <Link href="/login" className="rounded-xl px-4 py-2 text-sm font-semibold text-ink-700 transition hover:bg-cream-100">
          {dict.nav.login}
        </Link>
        <Link href="/register" className="rounded-xl bg-ink-900 px-4 py-2 text-sm font-bold text-white shadow-soft transition hover:bg-ink-800">
          {dict.nav.register}
        </Link>
      </div>
    );
  }

  const items = [
    { href: "/dashboard", icon: LayoutDashboard, label: dict.nav.dashboard },
    { href: "/dashboard", icon: FileText, label: dict.nav.myReports },
    { href: "/dashboard?tab=saved", icon: Bookmark, label: dict.nav.saved },
    { href: "/dashboard?tab=profile", icon: User, label: dict.nav.profile },
    { href: "/rights", icon: Shield, label: dict.nav.privacy },
  ];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-xl border border-ink-900/10 bg-white/80 py-1.5 pl-1.5 pr-3 shadow-soft transition hover:border-saffron-300"
        aria-expanded={open}
        aria-label={dict.nav.profile}
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-chakra-500 to-ink-800 text-sm font-bold text-white">
          {user.name.charAt(0).toUpperCase()}
        </span>
        <ChevronDown className={cn("h-4 w-4 text-ink-500 transition", open && "rotate-180")} />
      </button>
      {open && (
        <div className="bubble-in absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-ink-900/10 bg-white py-1.5 shadow-lift">
          <p className="border-b border-ink-900/10 px-4 py-2.5 text-sm">
            <span className="block font-bold text-ink-900">{user.name}</span>
            <span className="block truncate text-xs text-ink-400">{user.email}</span>
          </p>
          {items.map((it) => (
            <Link
              key={it.label}
              href={it.href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink-700 transition hover:bg-cream-50"
            >
              <it.icon className="h-4 w-4 text-ink-400" />
              {it.label}
            </Link>
          ))}
          <button
            onClick={logout}
            className="flex w-full items-center gap-2.5 border-t border-ink-900/10 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
            {dict.nav.logout}
          </button>
        </div>
      )}
    </div>
  );
}

export function Navbar() {
  const { dict } = useLanguage();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "/", label: dict.nav.home },
    { href: "/explore", label: dict.nav.explore },
    { href: "/report", label: dict.nav.report },
    { href: "/map", label: dict.nav.map },
    { href: "/issues", label: dict.nav.issues },
    { href: "/rights", label: dict.nav.rights },
    { href: "/ai-assistant", label: dict.nav.ai },
    { href: "/dashboard", label: dict.nav.dashboard },
  ];

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-all duration-300",
        scrolled ? "glass border-b border-ink-900/10 shadow-soft" : "bg-transparent"
      )}
    >
      {/* Tricolor hairline */}
      <div className="h-1 bg-gradient-to-r from-saffron-500 via-white to-leaf-500" aria-hidden="true" />
      <nav className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6" aria-label="Main navigation">
        <Logo />
        <div className="ml-4 hidden flex-1 items-center gap-1 lg:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "rounded-xl px-3 py-2 text-[13.5px] font-semibold transition",
                pathname === l.href
                  ? "bg-saffron-50 text-saffron-700"
                  : "text-ink-600 hover:bg-ink-900/5 hover:text-ink-900"
              )}
            >
              {l.label}
            </Link>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="hidden sm:block"><LanguageSelector /></div>
          <NotificationsBell />
          <Link
            href="/report"
            className="hidden items-center gap-1.5 rounded-xl bg-saffron-600 px-4 py-2.5 text-sm font-bold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-saffron-700 hover:shadow-glow-saffron md:inline-flex"
          >
            <Sparkles className="h-4 w-4" />
            {dict.nav.reportProblem}
          </Link>
          <UserMenu />
          <button
            className="rounded-xl p-2.5 text-ink-700 hover:bg-ink-900/5 lg:hidden"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="bubble-in border-t border-ink-900/10 bg-white/95 px-4 py-3 backdrop-blur-xl lg:hidden">
          <div className="grid gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "rounded-xl px-3 py-2.5 text-sm font-semibold",
                  pathname === l.href ? "bg-saffron-50 text-saffron-700" : "text-ink-700 hover:bg-cream-100"
                )}
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-2 flex items-center gap-2 border-t border-ink-900/10 pt-3 sm:hidden">
              <LanguageSelector />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export function BottomNav() {
  const { dict } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();

  const items = [
    { href: "/", label: dict.nav.home, icon: "🏠" },
    { href: "/explore", label: dict.nav.explore, icon: "🔎" },
    { href: "/ai-assistant", label: "AI", icon: "🤖" },
    { href: "/report", label: dict.nav.report, icon: "📢" },
    { href: "/map", label: dict.nav.map, icon: "🗺️" },
  ];

  // Hide on the AI page itself (it has its own input) — keep visible elsewhere
  if (pathname === "/ai-assistant") return null;

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-ink-900/10 bg-white/92 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden"
      aria-label="Mobile navigation"
    >
      <div className="grid grid-cols-5">
        {items.map((it) => {
          const active = pathname === it.href;
          return (
            <button
              key={it.href}
              onClick={() => router.push(it.href)}
              className={cn(
                "flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-semibold transition",
                active ? "text-saffron-700" : "text-ink-400"
              )}
              aria-current={active ? "page" : undefined}
            >
              <span className="text-xl leading-none">{it.icon}</span>
              {it.label}
              {active && <span className="mt-0.5 h-1 w-6 rounded-full bg-saffron-500" />}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export function FloatingAI() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  if (pathname === "/ai-assistant") return null;

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="group fixed bottom-20 right-4 z-40 flex items-center gap-2 rounded-full bg-gradient-to-r from-ink-900 to-chakra-700 py-3 pl-4 pr-5 text-sm font-bold text-white shadow-lift transition hover:-translate-y-1 hover:shadow-glow-saffron md:bottom-8 md:right-8"
          aria-label="Ask JanAwaaz AI"
        >
          <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-saffron-400 to-saffron-600">
            🤖
            <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-leaf-400 animate-pulse-dot" />
          </span>
          <span className="hidden sm:inline">Ask JanAwaaz AI</span>
        </button>
      )}
      {open && (
        <div className="fixed inset-x-3 bottom-20 z-50 md:inset-x-auto md:bottom-8 md:right-8 md:w-[420px]">
          <div className="bubble-in overflow-hidden rounded-3xl shadow-lift">
            <div className="h-[70vh] max-h-[620px] md:h-[560px]">
              <ChatUI compact onClose={() => setOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
