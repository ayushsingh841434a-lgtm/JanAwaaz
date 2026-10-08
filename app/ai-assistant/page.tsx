"use client";

import { useLanguage } from "@/lib/i18n/provider";
import { ChatUI } from "@/components/ChatUI";
import { Reveal } from "@/components/Reveal";

export default function AIAssistantPage() {
  const { dict } = useLanguage();
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <Reveal>
        <h1 className="text-3xl font-extrabold text-ink-900 md:text-4xl">
          🤖 {dict.ai.title}
        </h1>
        <p className="mt-2 text-ink-600">{dict.ai.subtitle}</p>
      </Reveal>
      <Reveal delay={100} className="mt-6">
        <ChatUI />
      </Reveal>
    </div>
  );
}
