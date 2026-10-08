"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight, MapPin, ShieldCheck, Languages, Users, Sparkles,
  FileText, Camera, Lock, Scale, Newspaper, Bot, Search, ChevronRight,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/provider";
import { LANGUAGES } from "@/lib/i18n/dictionaries";
import { Reveal } from "@/components/Reveal";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { StatusBadge } from "@/components/StatusBadge";
import { get } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import { getHomeContent } from "@/lib/i18n/home-content";

function SectionHead({ eyebrow, title, subtitle, dark = false }: {
  eyebrow: string; title: string; subtitle?: string; dark?: boolean;
}) {
  return (
    <Reveal className="mx-auto max-w-3xl text-center">
      <p className={cn(
        "inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[12px] font-bold uppercase tracking-widest",
        dark ? "bg-white/10 text-saffron-300" : "bg-saffron-100 text-saffron-700"
      )}>
        {eyebrow}
      </p>
      <h2 className={cn("mt-4 text-3xl font-extrabold tracking-tight md:text-[2.75rem] md:leading-[1.15]", dark ? "text-white" : "text-ink-900")}>
        {title}
      </h2>
      {subtitle && (
        <p className={cn("mt-4 text-[15px] leading-relaxed md:text-base", dark ? "text-white/70" : "text-ink-600")}>
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}

/* ─── HERO ─── */
function Hero() {
  const { dict, lang } = useLanguage();
  const home = getHomeContent(lang);
  return (
    <section className="relative overflow-hidden" aria-label="Hero">
      {/* ambient gradients */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-saffron-200/50 blur-3xl animate-float-slower" />
        <div className="absolute -right-24 top-40 h-80 w-80 rounded-full bg-leaf-200/40 blur-3xl animate-float-slow" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-chakra-200/40 blur-3xl animate-float-slower" />
        <div className="absolute inset-0 pattern-jaali opacity-60" />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 pt-10 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:pb-24 lg:pt-16">
        {/* Copy */}
        <div>
          <p className="rise inline-flex items-center gap-2 rounded-full border border-saffron-200 bg-white/80 px-4 py-1.5 text-[12px] font-bold text-saffron-700 shadow-soft backdrop-blur" style={{ "--rise-delay": "0ms" } as React.CSSProperties}>
            <span className="text-base">🇮🇳</span> {dict.hero.badge}
          </p>
          <h1
            className="rise mt-5 font-display text-[2.6rem] font-black leading-[1.08] tracking-tight text-ink-900 sm:text-6xl lg:text-[4.2rem]"
            style={{ "--rise-delay": "90ms" } as React.CSSProperties}
          >
            {dict.hero.title}
          </h1>
          <p className="rise mt-5 max-w-xl text-[15px] leading-relaxed text-ink-600 md:text-lg" style={{ "--rise-delay": "180ms" } as React.CSSProperties}>
            {dict.hero.subtitle}
          </p>
          <div className="rise mt-8 flex flex-wrap items-center gap-3" style={{ "--rise-delay": "270ms" } as React.CSSProperties}>
            <Link
              href="/report"
              className="group inline-flex items-center gap-2 rounded-2xl bg-saffron-600 px-6 py-3.5 text-[15px] font-bold text-white shadow-glow-saffron transition hover:-translate-y-0.5 hover:bg-saffron-700"
            >
              🟧 {dict.hero.reportBtn}
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 rounded-2xl border-2 border-ink-900/15 bg-white/70 px-6 py-3.5 text-[15px] font-bold text-ink-900 backdrop-blur transition hover:-translate-y-0.5 hover:border-chakra-400"
            >
              🔵 {dict.hero.exploreBtn}
            </Link>
            <Link href="/map" className="inline-flex items-center gap-1 px-2 py-3 text-[14px] font-bold text-chakra-700 hover:underline">
              {dict.hero.seeHappening} <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="rise mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[13px] font-semibold text-ink-500" style={{ "--rise-delay": "360ms" } as React.CSSProperties}>
            <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-leaf-600" /> {dict.hero.trust1}</span>
            <span className="inline-flex items-center gap-1.5"><Languages className="h-4 w-4 text-chakra-600" /> {dict.hero.trust2}</span>
            <span className="inline-flex items-center gap-1.5"><Users className="h-4 w-4 text-saffron-600" /> {dict.hero.trust3}</span>
          </div>
        </div>

        {/* Visual */}
        <div className="rise relative" style={{ "--rise-delay": "220ms" } as React.CSSProperties}>
          <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-saffron-300/40 via-white/0 to-leaf-300/40 blur-2xl" aria-hidden="true" />
          <div className="relative overflow-hidden rounded-[2rem] shadow-lift ring-1 ring-ink-900/10">
            <Image
              src="/images/hero.jpg"
              alt="Diverse Indian citizens — student, farmer, woman professional, worker, senior citizen — standing together with hope"
              width={1280}
              height={720}
              priority
              className="aspect-video w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950/45 via-transparent to-transparent" aria-hidden="true" />
            {/* floating glass cards */}
            <div className="glass absolute left-4 top-4 rounded-2xl px-4 py-2.5 shadow-soft animate-float-slow">
              <p className="text-[11px] font-bold uppercase tracking-wide text-ink-500">{home.livePulse}</p>
              <p className="text-sm font-extrabold text-ink-900">JA-10234 • <span className="text-amber-600">{home.underReview}</span></p>
            </div>
            <div className="glass absolute bottom-4 right-4 rounded-2xl px-4 py-2.5 shadow-soft animate-float-slower">
              <p className="text-[11px] font-bold uppercase tracking-wide text-ink-500">{home.citizenVoices}</p>
              <p className="text-sm font-extrabold text-ink-900"><span className="text-leaf-600">●</span> 12,480+ {home.reports}</p>
            </div>
          </div>
          {/* orbiting chakra ring */}
          <div className="absolute -right-6 -top-6 hidden h-28 w-28 opacity-70 lg:block animate-spin-slow" aria-hidden="true">
            <svg viewBox="0 0 100 100" className="h-full w-full">
              <circle cx="50" cy="50" r="44" fill="none" stroke="#2456d6" strokeWidth="2" strokeDasharray="6 8" />
              <circle cx="50" cy="50" r="30" fill="none" stroke="#e06a0a" strokeWidth="1.5" strokeDasharray="4 6" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── STATS ─── */
function Stats() {
  const { dict, lang } = useLanguage();
  const [stats, setStats] = useState({ reports: 0, underReview: 0, resolved: 0, states: 0, languages: 13 });

  useEffect(() => {
    get<{ reports: number; underReview: number; resolved: number; states: number; languages: number }>("/api/stats")
      .then((d) => setStats(d))
      .catch(() => {});
  }, []);

  const cards = [
    { value: stats.reports, suffix: "+", label: dict.stats.reports, color: "text-saffron-600", bg: "bg-saffron-50" },
    { value: stats.underReview, suffix: "", label: dict.stats.underReview, color: "text-chakra-600", bg: "bg-chakra-50" },
    { value: stats.resolved, suffix: "", label: dict.stats.resolved, color: "text-leaf-600", bg: "bg-leaf-50" },
    { value: stats.states, suffix: "", label: dict.stats.states, color: "text-ink-700", bg: "bg-cream-200" },
    { value: stats.languages, suffix: "", label: dict.stats.languages, color: "text-saffron-700", bg: "bg-saffron-50" },
  ];

  return (
    <section className="relative border-y border-ink-900/10 bg-white/70 py-14 backdrop-blur" aria-label="Statistics">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHead eyebrow={getHomeContent(lang).civicDashboard} title={dict.stats.title} subtitle={dict.stats.subtitle} />
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-5">
          {cards.map((c, i) => (
            <Reveal key={c.label} delay={i * 70}>
              <div className={cn("rounded-3xl p-5 text-center shadow-soft transition hover:-translate-y-1 hover:shadow-lift", c.bg)}>
                <p className={cn("text-3xl font-black md:text-4xl", c.color)}>
                  <AnimatedCounter to={c.value} suffix={c.suffix} />
                </p>
                <p className="mt-1.5 text-[13px] font-semibold text-ink-600">{c.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-6 text-center text-[11px] font-bold uppercase tracking-widest text-ink-400">
          ⚠️ {dict.stats.demoNote}
        </p>
      </div>
    </section>
  );
}

/* ─── MULTILINGUAL ─── */
function Multilingual() {
  const { dict, lang, setLang } = useLanguage();
  return (
    <section className="relative overflow-hidden py-20" aria-label="Languages">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute left-1/2 top-0 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-saffron-200/60 via-white to-leaf-200/60 blur-3xl animate-gradient-pan" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHead eyebrow="🌐 Multilingual India" title={dict.langSection.title} subtitle={dict.langSection.subtitle} />
        <Reveal className="mx-auto mt-10 max-w-4xl">
          <div className="rounded-[2rem] border border-ink-900/10 bg-white/80 p-6 shadow-lift backdrop-blur md:p-8">
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4">
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLang(l.code)}
                  className={cn(
                    "group rounded-2xl border px-4 py-3.5 text-center transition hover:-translate-y-0.5",
                    lang === l.code
                      ? "border-saffron-400 bg-gradient-to-br from-saffron-50 to-saffron-100 shadow-glow-saffron"
                      : "border-ink-900/10 bg-white hover:border-saffron-300 hover:shadow-soft"
                  )}
                  aria-pressed={lang === l.code}
                >
                  <span className={cn("block text-lg font-bold", lang === l.code ? "text-saffron-700" : "text-ink-900")}>{l.native}</span>
                  <span className="block text-[11px] text-ink-400">{l.label}</span>
                </button>
              ))}
            </div>
            <p className="mt-5 text-center text-[13px] text-ink-500">{dict.langSection.note}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─── WHAT'S HAPPENING ─── */
const SPOTLIGHT_CITIES = [
  { city: "Delhi", tone: "bg-orange-100 text-orange-800" },
  { city: "Mumbai", tone: "bg-chakra-100 text-chakra-800" },
  { city: "Bengaluru", tone: "bg-chakra-100 text-chakra-800" },
  { city: "Chennai", tone: "bg-amber-100 text-amber-800" },
  { city: "Patna", tone: "bg-stone-200 text-stone-700" },
  { city: "Hyderabad", tone: "bg-leaf-100 text-leaf-800" },
];

function Happening() {
  const { dict, lang } = useLanguage();
  const home = getHomeContent(lang);
  return (
    <section className="relative bg-ink-950 py-20 text-white" aria-label="What's happening">
      <div className="pattern-jaali-light absolute inset-0" aria-hidden="true" />
      <div className="absolute -top-24 right-1/4 h-72 w-72 rounded-full bg-saffron-500/15 blur-3xl" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHead dark eyebrow={`🗺️ ${home.livePulse}`} title={dict.happening.title} subtitle={dict.happening.subtitle} />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SPOTLIGHT_CITIES.map((c, i) => (
            <Reveal key={c.city} delay={i * 60}>
              <Link
                href={`/explore?city=${encodeURIComponent(c.city)}`}
                className="group block rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur transition hover:-translate-y-1 hover:border-saffron-400/40 hover:bg-white/10"
              >
                <div className="flex items-center justify-between">
                  <p className="flex items-center gap-2 text-lg font-extrabold">
                    <MapPin className="h-5 w-5 text-saffron-400" /> {c.city}
                  </p>
                  <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-bold", c.tone)}>{i === 5 ? home.resolved : home.active}</span>
                </div>
                <p className="mt-2 text-sm text-white/70">{home.issues[i]}</p>
                <p className="mt-3 inline-flex items-center gap-1 text-[13px] font-bold text-saffron-300 group-hover:underline">
                  {home.viewReports} <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-10 text-center">
          <Link
            href="/map"
            className="inline-flex items-center gap-2 rounded-2xl bg-saffron-600 px-7 py-3.5 font-bold text-white shadow-glow-saffron transition hover:-translate-y-0.5 hover:bg-saffron-500"
          >
            🗺️ {dict.happening.viewMap}
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

/* ─── REPORT CTA ─── */
const CATEGORY_EMOJI: Record<string, string> = {
  WATER: "💧", ROADS: "🛣️", ELECTRICITY: "💡", GARBAGE: "🗑️", DRAINAGE: "🚰",
  EDUCATION: "🏫", HEALTHCARE: "🏥", TRANSPORT: "🚍", ENVIRONMENT: "🌱",
  PUBLIC_SERVICES: "🏛️", EMPLOYMENT: "💼", INFRASTRUCTURE: "🏗️",
  DOCUMENTATION: "📄", SAFETY: "🛡️", RIGHTS: "⚖️", OTHER: "📢",
};

function ReportCTA() {
  const { dict, tCategory } = useLanguage();
  const cats = ["WATER", "ROADS", "ELECTRICITY", "GARBAGE", "EDUCATION", "HEALTHCARE", "ENVIRONMENT", "TRANSPORT", "PUBLIC_SERVICES", "EMPLOYMENT"];
  return (
    <section className="relative overflow-hidden py-20" aria-label="Report a problem">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white via-saffron-50/60 to-white" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <p className="inline-flex items-center gap-2 rounded-full bg-saffron-100 px-4 py-1.5 text-[12px] font-bold uppercase tracking-widest text-saffron-700">
              📢 Report
            </p>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-ink-900 md:text-[2.75rem] md:leading-[1.15]">
              {dict.reportCta.title}
            </h2>
            <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-ink-600 md:text-base">{dict.reportCta.subtitle}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {cats.map((c) => (
                <Link
                  key={c}
                  href={`/report?category=${c}`}
                  className="rounded-full border border-ink-900/10 bg-white px-3.5 py-1.5 text-[13px] font-semibold text-ink-700 shadow-soft transition hover:-translate-y-0.5 hover:border-saffron-300 hover:text-saffron-700"
                >
                  {CATEGORY_EMOJI[c]} {tCategory(c)}
                </Link>
              ))}
            </div>
            <p className="mt-4 text-[12px] font-semibold text-ink-400">{dict.reportCta.categoriesNote}</p>
            <Link
              href="/report"
              className="group mt-6 inline-flex items-center gap-2 rounded-2xl bg-ink-900 px-7 py-3.5 font-bold text-white shadow-lift transition hover:-translate-y-0.5 hover:bg-ink-800"
            >
              {dict.reportCta.start} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
          </Reveal>
          <Reveal delay={120}>
            <div className="rounded-[2rem] border border-ink-900/10 bg-white p-6 shadow-lift md:p-8">
              {["Category", "Description", "Location", "Evidence", "Review", "Submit"].map((s, i) => (
                <div key={s} className="flex items-center gap-4">
                  <span className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                    i === 0 ? "bg-saffron-600 text-white shadow-glow-saffron" : "bg-cream-200 text-ink-500"
                  )}>
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <p className={cn("text-sm font-bold", i === 0 ? "text-ink-900" : "text-ink-500")}>{s}</p>
                    {i < 5 && <div className="my-1.5 h-px bg-ink-900/10" />}
                  </div>
                  {i === 0 && <span className="rounded-full bg-leaf-100 px-2.5 py-1 text-[11px] font-bold text-leaf-700">AI assisted</span>}
                </div>
              ))}
              <div className="mt-5 rounded-2xl bg-chakra-50 p-4 text-[13px] text-chakra-800">
                <span className="font-bold">🤖 JanAwaaz AI</span> helps classify your problem, asks only what's needed, and drafts a professional complaint — you always review before submitting.
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ─── EVIDENCE ─── */
function Evidence() {
  const { dict } = useLanguage();
  const items = [
    { icon: "📸", label: "Photo" }, { icon: "🎥", label: "Video" },
    { icon: "📄", label: "Document" }, { icon: "🎤", label: "Voice" },
  ];
  return (
    <section className="border-y border-ink-900/10 bg-white/70 py-20 backdrop-blur" aria-label="Evidence">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHead eyebrow="📹 Evidence" title={dict.evidence.title} subtitle={dict.evidence.subtitle} />
        <div className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-4 md:grid-cols-4">
          {items.map((it, i) => (
            <Reveal key={it.label} delay={i * 70}>
              <div className="group rounded-3xl border border-ink-900/10 bg-cream-50 p-6 text-center shadow-soft transition hover:-translate-y-1 hover:shadow-lift">
                <p className="text-4xl transition group-hover:scale-110">{it.icon}</p>
                <p className="mt-2 text-sm font-bold text-ink-900">{it.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mx-auto mt-8 max-w-3xl text-center">
          <p className="inline-flex flex-wrap items-center justify-center gap-2 rounded-2xl bg-leaf-50 px-5 py-3 text-[13px] font-semibold text-leaf-800">
            <Lock className="h-4 w-4" />
            Size limits • Type validation • Privacy scanning • Secure storage — labelled as "Submitted Evidence", never as proof of crime.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ─── AI PROMO ─── */
function AIPromo() {
  const { dict } = useLanguage();
  const feats = ["Problem classification", "Smart follow-ups", "Complaint drafts", "Notice explainer", "Status explainer", "Multilingual voice"];
  return (
    <section className="relative overflow-hidden py-20" aria-label="AI Assistant">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-ink-900 via-chakra-800 to-ink-900 p-8 shadow-lift md:p-14">
          <div className="pattern-jaali-light absolute inset-0" aria-hidden="true" />
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-saffron-500/25 blur-3xl animate-float-slow" aria-hidden="true" />
          <div className="relative grid items-center gap-10 lg:grid-cols-2">
            <Reveal>
              <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-[12px] font-bold uppercase tracking-widest text-saffron-300">
                🤖 JanAwaaz AI — 24×7
              </p>
              <h2 className="mt-4 text-3xl font-extrabold text-white md:text-4xl">{dict.ai.title}</h2>
              <p className="mt-3 text-white/70">{dict.ai.subtitle}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {feats.map((f) => (
                  <span key={f} className="rounded-full bg-white/10 px-3.5 py-1.5 text-[13px] font-semibold text-white/85">
                    {f}
                  </span>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/ai-assistant" className="inline-flex items-center gap-2 rounded-2xl bg-saffron-600 px-6 py-3.5 font-bold text-white shadow-glow-saffron transition hover:-translate-y-0.5 hover:bg-saffron-500">
                  <Bot className="h-5 w-5" /> Chat with AI
                </Link>
                <span className="inline-flex items-center gap-2 rounded-2xl border border-white/20 px-5 py-3 text-sm font-semibold text-white/70">
                  <Sparkles className="h-4 w-4 text-saffron-300" /> Hindi • Hinglish • 13 languages
                </span>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="space-y-3">
                <div className="bubble-in ml-auto max-w-sm rounded-2xl rounded-tr-md bg-white/10 p-4 text-sm text-white backdrop-blur">
                  "Hamare village mein 5 din se paani nahi aa raha, complaint kaha karein?"
                </div>
                <div className="bubble-in max-w-sm rounded-2xl rounded-tl-md bg-white p-4 text-sm text-ink-900 shadow-lift">
                  <p className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold text-saffron-700"><Bot className="h-3.5 w-3.5" /> JanAwaaz AI <span className="rounded-full bg-chakra-100 px-2 py-0.5 text-[10px] text-chakra-700">🔵 AI Explanation</span></p>
                  Samajh gaya. Ye water-supply related civic issue lag raha hai. Main aapko complaint process samajhne mein help kar sakta hoon. Aapka village aur district ka naam kya hai?
                </div>
                <div className="bubble-in ml-auto max-w-sm rounded-2xl rounded-tr-md bg-white/10 p-4 text-sm text-white backdrop-blur">
                  "Kalyanpur, Lucknow"
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── PRIVACY ─── */
function Privacy() {
  const { dict } = useLanguage();
  const icons = ["🔒", "🛡️", "👤", "📍", "📄"];
  return (
    <section className="relative overflow-hidden bg-ink-950 py-20 text-white" aria-label="Privacy">
      <div className="pattern-jaali-light absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHead dark eyebrow="🔐 Privacy" title={dict.privacy.title} subtitle={dict.privacy.subtitle} />
        <Reveal className="mx-auto mt-8 max-w-3xl text-center">
          <p className="font-display text-xl italic leading-relaxed text-saffron-200 md:text-2xl">{dict.privacy.statement}</p>
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {dict.privacy.cards.map((c, i) => (
            <Reveal key={c.t} delay={i * 60}>
              <div className="h-full rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur transition hover:-translate-y-1 hover:border-leaf-400/40">
                <p className="text-3xl">{icons[i]}</p>
                <p className="mt-3 font-bold">{c.t}</p>
                <p className="mt-1.5 text-[13px] text-white/60">{c.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── RIGHTS + ISSUES PREVIEWS ─── */
function RightsPreview() {
  const { dict } = useLanguage();
  const [articles, setArticles] = useState<any[]>([]);
  useEffect(() => {
    get<{ articles: any[] }>("/api/rights").then((d) => setArticles(d.articles.slice(0, 4))).catch(() => {});
  }, []);
  const t = (v: any) => (typeof v === "object" ? (v.en ?? "") : v);
  return (
    <section className="py-20" aria-label="Know your rights">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHead eyebrow="⚖️ Rights" title={dict.rights.title} subtitle={dict.rights.subtitle} />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {articles.map((a, i) => (
            <Reveal key={a.slug} delay={i * 60}>
              <Link href="/rights" className="group block h-full rounded-3xl border border-ink-900/10 bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-lift">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-chakra-50 text-xl">⚖️</span>
                <p className="mt-4 font-bold text-ink-900 group-hover:text-chakra-700">{t(a.title)}</p>
                <p className="mt-2 line-clamp-3 text-[13px] text-ink-500">{t(a.summary)}</p>
                <p className="mt-3 inline-flex items-center gap-1 text-[13px] font-bold text-saffron-700">{dict.common.learnMore} <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" /></p>
              </Link>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-8 rounded-2xl bg-amber-50 px-5 py-4 text-center text-[13px] text-amber-900">
          ⚠️ {dict.rights.disclaimer}
        </Reveal>
        <Reveal className="mt-6 text-center">
          <Link href="/rights" className="inline-flex items-center gap-2 rounded-2xl border-2 border-ink-900/15 px-6 py-3 font-bold text-ink-900 transition hover:border-saffron-400 hover:text-saffron-700">
            <Scale className="h-4 w-4" /> {dict.rights.viewAll}
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

function IssuesPreview() {
  const { dict } = useLanguage();
  const [issues, setIssues] = useState<any[]>([]);
  useEffect(() => {
    get<{ issues: any[] }>("/api/issues?limit=3").then((d) => setIssues(d.issues)).catch(() => {});
  }, []);
  return (
    <section className="border-y border-ink-900/10 bg-white/70 py-20 backdrop-blur" aria-label="Public issues">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHead eyebrow="📢 Public Issues" title={dict.issuesSection.title} subtitle={dict.issuesSection.subtitle} />
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {issues.map((is, i) => (
            <Reveal key={is.slug} delay={i * 70}>
              <Link href={`/issues/${is.slug}`} className="group block h-full rounded-3xl border border-ink-900/10 bg-cream-50 p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-lift">
                <div className="flex items-start justify-between gap-2">
                  <p className="flex items-center gap-1.5 text-[12px] font-bold text-ink-500"><MapPin className="h-3.5 w-3.5" /> {is.city}, {is.state}</p>
                  <StatusBadge status={is.status} />
                </div>
                <p className="mt-3 font-bold text-ink-900 group-hover:text-saffron-700">{is.title}</p>
                <p className="mt-2 line-clamp-3 text-[13px] text-ink-500">{is.description}</p>
                <p className="mt-3 text-[12px] font-semibold text-ink-400">📊 {is.reportCount} reports • 📎 {is.evidenceCount} evidence files</p>
              </Link>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-8 text-center">
          <Link href="/issues" className="inline-flex items-center gap-2 rounded-2xl bg-ink-900 px-6 py-3 font-bold text-white shadow-soft transition hover:bg-ink-800">
            <Newspaper className="h-4 w-4" /> {dict.issuesSection.viewAll}
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

/* ─── TRACK CTA ─── */
function TrackCTA() {
  const { dict } = useLanguage();
  const [id, setId] = useState("");
  return (
    <section className="py-20" aria-label="Track complaint">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] border border-ink-900/10 bg-white p-8 shadow-lift md:p-12">
            <div className="pattern-jaali absolute inset-0 opacity-50" aria-hidden="true" />
            <div className="relative text-center">
              <p className="inline-flex items-center gap-2 rounded-full bg-chakra-100 px-4 py-1.5 text-[12px] font-bold uppercase tracking-widest text-chakra-700">
                📍 Tracking
              </p>
              <h2 className="mt-4 text-3xl font-extrabold text-ink-900 md:text-4xl">{dict.track.title}</h2>
              <p className="mx-auto mt-3 max-w-xl text-ink-600">{dict.track.subtitle}</p>
              <form
                onSubmit={(e) => { e.preventDefault(); if (id.trim()) window.location.href = `/track/${id.trim().toUpperCase()}`; }}
                className="mx-auto mt-6 flex max-w-md gap-2"
              >
                <label htmlFor="track-id" className="sr-only">{dict.track.enterId}</label>
                <input
                  id="track-id"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  placeholder="JA-10001"
                  className="min-w-0 flex-1 rounded-2xl border-2 border-ink-900/15 bg-cream-50 px-5 py-3.5 font-mono text-lg font-bold uppercase tracking-wider outline-none transition placeholder:text-ink-300 focus:border-saffron-400"
                />
                <button type="submit" className="flex items-center gap-2 rounded-2xl bg-saffron-600 px-6 py-3.5 font-bold text-white shadow-soft transition hover:bg-saffron-700">
                  <Search className="h-4 w-4" /> {dict.track.trackBtn}
                </button>
              </form>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─── EMOTIONAL ─── */
function Emotion() {
  const { dict } = useLanguage();
  return (
    <section className="relative overflow-hidden" aria-label="Our promise">
      <Image
        src="/images/emotion.jpg"
        alt="Indian landscape at dusk with citizens walking together toward the light"
        width={1280}
        height={720}
        className="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink-950/80 via-ink-950/55 to-ink-950/85" aria-hidden="true" />
      <div className="relative mx-auto max-w-4xl px-4 py-28 text-center sm:px-6 md:py-36">
        <Reveal>
          <div className="mx-auto mb-6 h-1 w-24 rounded-full bg-gradient-to-r from-saffron-500 via-white to-leaf-500" aria-hidden="true" />
          <h2 className="font-display text-3xl font-black leading-tight text-white md:text-5xl">
            {dict.emotion.headline}
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-[15px] italic leading-relaxed text-white/80 md:text-lg">{dict.emotion.text1}</p>
          <p className="mx-auto mt-4 max-w-2xl text-[15px] italic leading-relaxed text-saffron-200 md:text-lg">{dict.emotion.text2}</p>
          <Link
            href="/report"
            className="group mt-10 inline-flex items-center gap-2 rounded-2xl bg-saffron-600 px-8 py-4 text-[15px] font-bold text-white shadow-glow-saffron transition hover:-translate-y-0.5 hover:bg-saffron-500"
          >
            {dict.emotion.cta} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <Multilingual />
      <Happening />
      <ReportCTA />
      <Evidence />
      <AIPromo />
      <Privacy />
      <RightsPreview />
      <IssuesPreview />
      <TrackCTA />
      <Emotion />
    </>
  );
}
