"use client";

import { LanguageProvider } from "@/lib/i18n/provider";
import type { Lang } from "@/lib/i18n/dictionaries";
import { ToastProvider } from "./Toast";

export function Providers({ children, initialLang }: { children: React.ReactNode; initialLang: Lang }) {
  return (
    <LanguageProvider initialLang={initialLang}>
      <ToastProvider>{children}</ToastProvider>
    </LanguageProvider>
  );
}
