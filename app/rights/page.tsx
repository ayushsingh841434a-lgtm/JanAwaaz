"use client";

import { useEffect, useState } from "react";
import { Scale, ExternalLink, ChevronDown } from "lucide-react";
import { useLanguage } from "@/lib/i18n/provider";
import { Reveal } from "@/components/Reveal";
import { get } from "@/lib/api-client";
import { cn } from "@/lib/utils";

const t = (v: any, lang: string) =>
  typeof v === "object" ? (v[lang] ?? v.en ?? "") : (v ?? "");

export default function RightsPage() {
  const { dict, lang, tCategory } = useLanguage();
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<string | null>(null);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    setLoading(true);
    get<{ articles: any[] }>(`/api/rights${filter ? `?category=${filter}` : ""}`)
      .then((d) => { setArticles(d.articles); setOpen(d.articles[0]?.slug ?? null); })
      .catch(() => setArticles([]))
      .finally(() => setLoading(false));
  }, [filter]);

  const categories = ["WATER", "ROADS", "EDUCATION", "EMPLOYMENT", "PUBLIC_SERVICES", "ENVIRONMENT", "RIGHTS", "SAFETY"];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <Reveal>
        <h1 className="text-3xl font-extrabold text-ink-900 md:text-4xl">{dict.rights.title}</h1>
        <p className="mt-2 max-w-2xl text-ink-600">{dict.rights.subtitle}</p>
      </Reveal>

      <div className="mt-6 flex flex-wrap gap-2">
        <button
          onClick={() => setFilter("")}
          className={cn("rounded-full px-4 py-2 text-[13px] font-bold transition", !filter ? "bg-ink-900 text-white" : "border border-ink-900/10 bg-white text-ink-600 hover:border-saffron-300")}
        >
          {dict.common.all}
        </button>
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={cn("rounded-full px-4 py-2 text-[13px] font-bold transition", filter === c ? "bg-ink-900 text-white" : "border border-ink-900/10 bg-white text-ink-600 hover:border-saffron-300")}
          >
            {tCategory(c)}
          </button>
        ))}
      </div>

      <div className="mt-8 space-y-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-3xl border border-ink-900/10 bg-white p-6">
              <div className="skeleton h-6 w-1/2 rounded-full" />
              <div className="skeleton mt-3 h-4 w-full rounded-full" />
            </div>
          ))
        ) : (
          articles.map((a, i) => {
            const isOpen = open === a.slug;
            return (
              <Reveal key={a.slug} delay={Math.min(i, 5) * 50}>
                <div className="overflow-hidden rounded-3xl border border-ink-900/10 bg-white shadow-soft">
                  <button
                    onClick={() => setOpen(isOpen ? null : a.slug)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center gap-4 p-5 text-left transition hover:bg-cream-50 md:p-6"
                  >
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-chakra-50 text-2xl">⚖️</span>
                    <span className="flex-1">
                      <span className="block text-lg font-extrabold text-ink-900">{t(a.title, lang)}</span>
                      <span className="mt-0.5 block text-[13px] text-ink-500 line-clamp-1">{t(a.summary, lang)}</span>
                    </span>
                    <ChevronDown className={cn("h-5 w-5 shrink-0 text-ink-400 transition", isOpen && "rotate-180")} />
                  </button>
                  {isOpen && (
                    <div className="bubble-in border-t border-ink-900/10 p-5 md:p-6">
                      <p className="text-[15px] leading-relaxed text-ink-700">{t(a.summary, lang)}</p>
                      <div className="mt-5 grid gap-5 md:grid-cols-2">
                        <div className="rounded-2xl bg-leaf-50 p-5">
                          <h3 className="font-bold text-leaf-800">✅ {lang === "hi" ? "आप क्या कर सकते हैं" : "What you can do"}</h3>
                          <ul className="mt-2.5 space-y-2">
                            {(a.actions as any[]).map((x, j) => (
                              <li key={j} className="flex gap-2 text-[13.5px] text-leaf-900">
                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-leaf-500" /> {t(x, lang)}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="rounded-2xl bg-chakra-50 p-5">
                          <h3 className="font-bold text-chakra-800">📋 {lang === "hi" ? "प्रक्रिया" : "Process"}</h3>
                          <ol className="mt-2.5 space-y-2">
                            {(a.process as any[]).map((x, j) => (
                              <li key={j} className="flex gap-2.5 text-[13.5px] text-chakra-900">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-chakra-600 text-[11px] font-bold text-white">{j + 1}</span>
                                {t(x, lang)}
                              </li>
                            ))}
                          </ol>
                        </div>
                      </div>
                      {(a.sources as any[])?.length > 0 && (
                        <div className="mt-4">
                          <h3 className="text-sm font-bold text-ink-700">🔎 Official sources</h3>
                          <ul className="mt-1.5 space-y-1">
                            {(a.sources as any[]).map((s: any, j: number) => (
                              <li key={j} className="flex items-start gap-1.5 text-[13px] text-ink-500">
                                <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                                <span><strong>{s.label}</strong>{s.note ? ` — ${s.note}` : ""}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Reveal>
            );
          })
        )}
      </div>

      <Reveal className="mt-8 rounded-2xl bg-amber-50 px-5 py-4 text-[13px] text-amber-900">
        <Scale className="mr-1.5 inline h-4 w-4" />
        {dict.rights.disclaimer}
      </Reveal>
    </div>
  );
}
