import { isLang, type Lang } from "./dictionaries";

export interface LanguageCandidates {
  manual?: string | null;
  account?: string | null;
  stored?: string | null;
  browser?: string | null;
}

export function resolveLanguagePreference(
  candidates: LanguageCandidates,
  fallback: Lang = "en",
): Lang {
  for (const candidate of [candidates.manual, candidates.account, candidates.stored]) {
    if (candidate && isLang(candidate)) return candidate;
  }
  return languageFromBrowser(candidates.browser) ?? fallback;
}

export function languageFromBrowser(value: string | null | undefined): Lang | null {
  if (!value) return null;
  const normalized = value.toLowerCase();
  if (normalized === "hi-latn" || normalized === "hi-latn-in") return "hi-Latn";
  const language = normalized.split("-")[0];
  return isLang(language) ? language : null;
}

export function languageDirection(lang: Lang): "ltr" | "rtl" {
  return lang === "ur" ? "rtl" : "ltr";
}
