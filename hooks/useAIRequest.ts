"use client";

import { useCallback } from "react";
import { useLanguage, type Lang } from "@/lib/i18n/provider";
import { post } from "@/lib/api-client";

type AIEndpoint = "/api/ai/chat" | "/api/ai/draft";

export function useAIRequest() {
  const { lang } = useLanguage();

  return useCallback(
    <T,>(endpoint: AIEndpoint, payload: Record<string, unknown>, requestedLanguage: Lang = lang) =>
      post<T>(endpoint, { ...payload, language: requestedLanguage }),
    [lang],
  );
}
