"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { dictionaries, getDict, isLang, type Dict, type Lang } from "./dictionaries";
import { languageDirection, languageFromBrowser, resolveLanguagePreference } from "./preference";

const STORAGE_KEYS = ["janaawaaz_lang", "ja_lang"] as const;
const SOURCE_KEYS = ["janaawaaz_lang_source", "ja_lang_source"] as const;

function readCookie(name: string): string | null {
  const prefix = `${name}=`;
  const entry = document.cookie.split("; ").find((part) => part.startsWith(prefix));
  return entry ? decodeURIComponent(entry.slice(prefix.length)) : null;
}

function readStorageValue(keys: readonly string[]): string | null {
  for (const key of keys) {
    try {
      const value = window.localStorage.getItem(key);
      if (value) return value;
    } catch {
      // Continue checking the remaining keys when storage access is unavailable.
    }
  }
  return null;
}

function readStoredLanguage(): Lang | null {
  const stored = readStorageValue([...STORAGE_KEYS]);
  return stored && isLang(stored) ? stored : null;
}

function readStoredSource(): "manual" | "account" | "browser" | null {
  for (const key of SOURCE_KEYS) {
    const stored = readStorageValue([key]);
    if (stored === "manual" || stored === "account" || stored === "browser") return stored;
    const cookie = readCookie(key);
    if (cookie === "manual" || cookie === "account" || cookie === "browser") return cookie;
  }
  return null;
}

function persistLanguage(lang: Lang, source: "manual" | "account" | "browser"): void {
  try {
    for (const key of STORAGE_KEYS) {
      window.localStorage.setItem(key, lang);
    }
    for (const key of SOURCE_KEYS) {
      window.localStorage.setItem(key, source);
    }
  } catch (error) {
    console.error("Unable to persist the selected language in browser storage.", error);
  }
  for (const key of STORAGE_KEYS) {
    document.cookie = `${key}=${encodeURIComponent(lang)}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
  }
  for (const key of SOURCE_KEYS) {
    document.cookie = `${key}=${source}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
  }
}

interface LanguageContextValue {
  lang: Lang;
  dict: Dict;
  setLang: (l: Lang) => void;
  /** Translate a status enum value, e.g. t.status("UNDER_REVIEW") */
  tStatus: (s: string) => string;
  /** Translate a category enum value, e.g. tCategory("WATER") */
  tCategory: (c: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children, initialLang }: { children: React.ReactNode; initialLang: Lang }) {
  const [lang, setLangState] = useState<Lang>(initialLang);
  const manualSelectionVersion = useRef(0);

  useEffect(() => {
    let active = true;
    const requestVersion = manualSelectionVersion.current;
    const stored = readStoredLanguage();
    const source = readStoredSource();
    const manualSelection = source === "manual";

    if (manualSelection && stored) {
      setLangState(stored);
      return () => {
        active = false;
      };
    }

    const browserLang = languageFromBrowser(navigator.language);
    const localLang = resolveLanguagePreference({ stored, browser: browserLang }, initialLang);
    setLangState(localLang);

    void fetch("/api/auth/me", { cache: "no-store" })
      .then(async (response) => {
        if (!active || manualSelection || manualSelectionVersion.current !== requestVersion || !response.ok) return;
        const result = await response.json();
        const accountLang = result?.data?.language;
        if (typeof accountLang !== "string" || !isLang(accountLang)) return;
        const resolved = resolveLanguagePreference({ account: accountLang, stored, browser: browserLang }, initialLang);
        setLangState(resolved);
        persistLanguage(resolved, "account");
      })
      .catch((error: unknown) => {
        console.error("Unable to load the signed-in account language.", error);
      });
    return () => {
      active = false;
    };
  }, [initialLang]);

  const setLang = useCallback((l: Lang) => {
    manualSelectionVersion.current += 1;
    setLangState(l);
    persistLanguage(l, "manual");
    document.documentElement.lang = l;
    document.documentElement.dir = languageDirection(l);

    void fetch("/api/user/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ language: l }),
    }).then((response) => {
      if (!response.ok && response.status !== 401) {
        console.error(`Unable to save language preference (HTTP ${response.status}).`);
      }
    }).catch((error: unknown) => {
      console.error("Unable to save language preference to the account.", error);
    });
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = languageDirection(lang);
  }, [lang]);

  const dict = getDict(lang);
  const tStatus = useCallback(
    (s: string) => dict.status[s] ?? `[MISSING TRANSLATION: status.${s}]`,
    [dict],
  );
  const tCategory = useCallback(
    (c: string) => dict.category[c] ?? `[MISSING TRANSLATION: category.${c}]`,
    [dict],
  );

  return (
    <LanguageContext.Provider value={{ lang, dict, setLang, tStatus, tCategory }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
}

export { dictionaries };
export type { Lang };
