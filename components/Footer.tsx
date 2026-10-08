"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/provider";
import { LANGUAGES } from "@/lib/i18n/dictionaries";
import { Logo } from "./Navbar";

export function Footer() {
  const { dict, setLang } = useLanguage();

  const platform = [
    { href: "/explore", label: dict.nav.explore },
    { href: "/report", label: dict.nav.report },
    { href: "/map", label: dict.nav.map },
    { href: "/issues", label: dict.nav.issues },
    { href: "/ai-assistant", label: dict.nav.ai },
  ];
  const resources = [
    { href: "/rights", label: dict.footer.rights },
    { href: "/rights", label: dict.footer.help },
    { href: "/rights", label: dict.footer.faq },
    { href: "/rights", label: dict.footer.privacy },
    { href: "/rights", label: dict.footer.terms },
  ];

  return (
    <footer className="relative overflow-hidden bg-ink-950 text-white">
      <div className="pattern-jaali-light absolute inset-0" aria-hidden="true" />
      <div className="absolute -top-32 left-1/4 h-64 w-64 rounded-full bg-saffron-500/15 blur-3xl" aria-hidden="true" />
      <div className="absolute -bottom-24 right-1/4 h-64 w-64 rounded-full bg-chakra-500/15 blur-3xl" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <div className="[&_span]:!text-white">
              <Logo />
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/70">
              {dict.footer.tagline}
            </p>
            <p className="mt-2 max-w-xs text-[13px] text-white/50">
              We love India. We care about its people. We listen to every voice.
            </p>
            <div className="mt-5 flex gap-2">
              {["LinkedIn", "X", "Instagram", "YouTube"].map((label) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  onClick={(e) => e.preventDefault()}
                  className="flex h-9 min-w-9 items-center justify-center rounded-xl bg-white/8 px-2.5 text-[11px] font-bold text-white/70 transition hover:bg-saffron-600 hover:text-white"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          <nav aria-label="Platform">
            <p className="mb-4 text-sm font-bold uppercase tracking-wider text-white/50">{dict.footer.platform}</p>
            <ul className="space-y-2.5">
              {platform.map((l) => (
                <li key={l.href + l.label}>
                  <Link href={l.href} className="text-sm text-white/70 transition hover:text-saffron-300">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Resources">
            <p className="mb-4 text-sm font-bold uppercase tracking-wider text-white/50">{dict.footer.resources}</p>
            <ul className="space-y-2.5">
              {resources.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-white/70 transition hover:text-saffron-300">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="mb-4 text-sm font-bold uppercase tracking-wider text-white/50">{dict.footer.languages}</p>
            <div className="flex flex-wrap gap-1.5">
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLang(l.code)}
                  className="rounded-lg bg-white/8 px-2.5 py-1.5 text-[12px] text-white/70 transition hover:bg-saffron-600 hover:text-white"
                >
                  {l.native}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center gap-3 border-t border-white/10 pt-6 text-center">
          <div className="h-1 w-40 rounded-full bg-gradient-to-r from-saffron-500 via-white to-leaf-500" aria-hidden="true" />
          <p className="text-sm text-white/60">🇮🇳 {dict.footer.madeIn}</p>
          <p className="text-[12px] text-white/40">
            JanAwaaz is a citizen platform. It is politically neutral and not affiliated with any political party or government body.
          </p>
        </div>
      </div>
    </footer>
  );
}
