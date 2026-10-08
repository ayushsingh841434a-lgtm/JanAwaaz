"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Send, Mic, MicOff, Copy, Check, ThumbsUp, ThumbsDown, Bot,
  User as UserIcon, Plus, Languages, FileText, X, Loader2, AlertTriangle,
  Sparkles, ExternalLink,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/provider";
import { useAIRequest } from "@/hooks/useAIRequest";
import { isLang, LANGUAGES } from "@/lib/i18n/dictionaries";
import { useToast } from "./Toast";
import { InfoTypeBadge } from "./StatusBadge";
import { cn } from "@/lib/utils";
import { get } from "@/lib/api-client";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  metadata?: {
    infoType?: string;
    detectedCategory?: string;
    sources?: { label: string; note?: string }[];
    suggestedActions?: { label: string; action: string; payload?: Record<string, string> }[];
    piiDetected?: boolean;
  };
}

interface Draft {
  subject: string;
  body: string;
  sections: { label: string; value: string }[];
}

/** Minimal markdown renderer: bold, quotes, lists, headings, hr, line breaks. */
export function RichText({ text }: { text: string }) {
  const blocks = text.split(/\n{2,}/);
  return (
    <div className="space-y-2.5 text-[14px] leading-relaxed">
      {blocks.map((block, i) => {
        const b = block.trim();
        if (!b) return null;
        if (/^---+$/.test(b)) return <hr key={i} className="border-ink-900/10" />;
        if (b.startsWith("> ")) {
          return (
            <blockquote key={i} className="rounded-r-xl border-l-4 border-saffron-400 bg-saffron-50 px-3 py-2 text-[13px] italic">
              <Inline text={b.slice(2)} />
            </blockquote>
          );
        }
        const lines = b.split("\n");
        const isList = lines.every((l) => /^\s*(•|-|\*|\d+\.)\s/.test(l));
        if (isList) {
          return (
            <ul key={i} className="space-y-1.5">
              {lines.map((l, j) => (
                <li key={j} className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-saffron-500" />
                  <span><Inline text={l.replace(/^\s*(•|-|\*|\d+\.)\s/, "")} /></span>
                </li>
              ))}
            </ul>
          );
        }
        return <p key={i}><Inline text={b} /></p>;
      })}
    </div>
  );
}

function Inline({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("**") && p.endsWith("**") ? (
          <strong key={i} className="font-semibold">{p.slice(2, -2)}</strong>
        ) : (
          <span key={i}>{p}</span>
        )
      )}
    </>
  );
}

export function ChatUI({ compact = false, onClose }: { compact?: boolean; onClose?: () => void }) {
  const { dict, lang, setLang } = useLanguage();
  const requestAI = useAIRequest();
  const { toast } = useToast();
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [listening, setListening] = useState(false);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [draftLang, setDraftLang] = useState(lang);
  const [draftMeta, setDraftMeta] = useState({ category: "OTHER", description: "", location: "" });
  const [editingDraft, setEditingDraft] = useState(false);
  const [draftText, setDraftText] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Record<string, "up" | "down">>({});
  const scrollRef = useRef<HTMLDivElement>(null);
  const recogRef = useRef<any>(null);
  const latestLang = useRef(lang);
  latestLang.current = lang;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  const send = useCallback(async (text: string) => {
    const msg = text.trim();
    if (!msg || sending) return;
    setSending(true);
    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: "user", content: msg };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    try {
      const payload = {
        message: msg,
        conversationId: conversationId ?? undefined,
      };
      let data = await requestAI<{
        conversationId: string; reply: string; infoType: string; language: string;
        detectedCategory?: string; suggestedActions: ChatMessage["metadata"] extends infer M ? any : never;
        sources: { label: string; note?: string }[]; needsInfo?: string[]; warning?: string;
      }>("/api/ai/chat", payload, latestLang.current);
      if (data.language !== latestLang.current) {
        data = await requestAI<typeof data>("/api/ai/chat", payload, latestLang.current);
      }
      if (data.language !== latestLang.current) {
        throw new Error("The assistant response did not match the selected language.");
      }
      setConversationId(data.conversationId);
      const aiMsg: ChatMessage = {
        id: `a-${Date.now()}`, role: "assistant", content: data.reply,
        metadata: {
          infoType: data.infoType, detectedCategory: data.detectedCategory,
          sources: data.sources, suggestedActions: data.suggestedActions,
        },
      };
      setMessages((m) => [...m, aiMsg]);
      if (data.warning) toast(data.warning, "info");
    } catch (e) {
      setMessages((m) => [...m, {
        id: `e-${Date.now()}`, role: "assistant",
        content: dict.common.retry,
        metadata: { infoType: "ai" },
      }]);
    } finally {
      setSending(false);
    }
  }, [sending, conversationId, lang, toast, requestAI]);

  const newChat = () => {
    setMessages([]);
    setConversationId(null);
    setDraft(null);
  };

  const copyText = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      toast(dict.ai.copied);
      setTimeout(() => setCopiedId(null), 1500);
    } catch { toast("Copy failed", "error"); }
  };

  // ── Voice input (Web Speech API) ──
  const toggleListening = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      toast("Voice input is not supported in this browser. Please type instead.", "error");
      return;
    }
    if (listening) {
      recogRef.current?.stop();
      setListening(false);
      return;
    }
    const recog = new SR();
    const speechLocales: Record<string, string> = {
      en: "en-IN", hi: "hi-IN", "hi-Latn": "hi-IN", bn: "bn-IN", te: "te-IN", mr: "mr-IN",
      ta: "ta-IN", gu: "gu-IN", kn: "kn-IN", ml: "ml-IN", pa: "pa-IN",
      or: "or-IN", as: "as-IN", ur: "ur-IN",
    };
    recog.lang = speechLocales[lang];
    recog.interimResults = true;
    recog.onresult = (e: any) => {
      const transcript = Array.from(e.results).map((r: any) => r[0].transcript).join("");
      setInput(transcript); // user reviews & edits before sending
    };
    recog.onend = () => setListening(false);
    recog.onerror = () => { setListening(false); toast("Voice input failed. Please type instead.", "error"); };
    recogRef.current = recog;
    recog.start();
    setListening(true);
  };

  // ── Draft modal ──
  const openDraft = async (category: string, description: string, location: string) => {
    try {
      setDraftLang(lang);
      const data = await requestAI<{ draft: Draft }>("/api/ai/draft", {
        category, description, location,
      });
      setDraft(data.draft);
      setDraftText(data.draft.body);
      setDraftMeta({ category, description, location });
      setEditingDraft(false);
    } catch { toast("Could not generate draft", "error"); }
  };

  const translateDraft = async (next: typeof lang) => {
    try {
      const data = await requestAI<{ draft: Draft }>("/api/ai/draft", {
        category: draftMeta.category, description: draftMeta.description,
        location: draftMeta.location,
      }, next);
      setDraft(data.draft);
      setDraftText(data.draft.body);
      setDraftLang(next);
      setEditingDraft(false);
    } catch { toast("Translation failed", "error"); }
  };

  const createReportFromDraft = () => {
    const prefill = {
      category: draftMeta.category,
      title: draft?.subject ?? "",
      description: editingDraft ? draftText : (draft?.body ?? ""),
      city: draftMeta.location,
    };
    try { localStorage.setItem("ja_report_prefill", JSON.stringify(prefill)); } catch {}
    setDraft(null);
    onClose?.();
    router.push("/report");
  };

  const handleAction = (a: { label: string; action: string; payload?: Record<string, string> }) => {
    if (a.action === "create_report" || a.action === "open_draft") {
      const p = a.payload ?? {};
      if (p.description) openDraft(p.category ?? "OTHER", p.description, p.location ?? "");
      else { onClose?.(); router.push("/report"); }
    } else if (a.action === "open_rights") { onClose?.(); router.push("/rights"); }
    else if (a.action === "open_issues") { onClose?.(); router.push("/issues"); }
    else if (a.action === "track" && a.payload?.id) { onClose?.(); router.push(`/track/${a.payload.id}`); }
  };

  return (
    <div className={cn("flex flex-col overflow-hidden bg-white", compact ? "h-full" : "h-[calc(100vh-220px)] min-h-[480px] rounded-3xl shadow-lift")}>
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-ink-900/10 bg-gradient-to-r from-ink-900 to-chakra-800 px-4 py-3 text-white">
        <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-saffron-400 to-saffron-600 shadow-glow-saffron">
          <Bot className="h-5 w-5 text-white" />
          <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-ink-900 bg-leaf-400" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold">{dict.ai.title}</p>
          <p className="text-[11px] text-white/70">{dict.ai.subtitle}</p>
        </div>
        <button onClick={newChat} title={dict.ai.newChat} className="rounded-xl p-2 hover:bg-white/10" aria-label={dict.ai.newChat}>
          <Plus className="h-4 w-4" />
        </button>
        {onClose && (
          <button onClick={onClose} className="rounded-xl p-2 hover:bg-white/10" aria-label={dict.common.close}>
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Privacy warning */}
      <div className="flex items-start gap-2 bg-amber-50 px-4 py-2 text-[11px] text-amber-900">
        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        <span>{dict.ai.warning}</span>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="nice-scroll flex-1 space-y-4 overflow-y-auto bg-cream-50 px-4 py-4 pattern-jaali">
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-saffron-400 to-saffron-600 shadow-glow-saffron animate-float-slow">
              <Sparkles className="h-7 w-7 text-white" />
            </div>
            <p className="text-lg font-bold text-ink-900">{dict.ai.empty1}</p>
            <p className="mt-1 max-w-sm text-sm text-ink-600">{dict.ai.empty2}</p>
            <div className="mt-5 grid w-full max-w-md gap-2">
              {dict.ai.suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => send(s)}
                  className="rounded-2xl border border-ink-900/10 bg-white px-4 py-2.5 text-left text-[13px] text-ink-700 shadow-soft transition hover:-translate-y-0.5 hover:border-saffron-300 hover:shadow-lift"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m) => (
          <div key={m.id} className={cn("bubble-in flex gap-2.5", m.role === "user" ? "flex-row-reverse" : "")}>
            <div className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl",
              m.role === "user" ? "bg-chakra-600" : "bg-gradient-to-br from-saffron-400 to-saffron-600"
            )}>
              {m.role === "user" ? <UserIcon className="h-4 w-4 text-white" /> : <Bot className="h-4 w-4 text-white" />}
            </div>
            <div className={cn("max-w-[85%] space-y-2", m.role === "user" ? "items-end" : "items-start")}>
              <div className={cn(
                "rounded-2xl px-4 py-3 shadow-soft",
                m.role === "user"
                  ? "rounded-tr-md bg-chakra-600 text-white"
                  : "rounded-tl-md border border-ink-900/10 bg-white text-ink-900"
              )}>
                {m.role === "assistant" ? <RichText text={m.content} /> : <p className="text-[14px] leading-relaxed">{m.content}</p>}
              </div>

              {m.role === "assistant" && (
                <div className="flex flex-wrap items-center gap-2">
                  {m.metadata?.infoType && <InfoTypeBadge type={m.metadata.infoType} />}
                  {m.metadata?.sources && m.metadata.sources.length > 0 && (
                    <div className="w-full space-y-1.5">
                      {m.metadata.sources.map((s, i) => (
                        <div key={i} className="flex items-start gap-2 rounded-xl border border-chakra-200 bg-chakra-50 px-3 py-2 text-[12px]">
                          <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0 text-chakra-600" />
                          <div>
                            <p className="font-semibold text-chakra-800">{s.label}</p>
                            {s.note && <p className="text-chakra-700/80">{s.note}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {m.metadata?.suggestedActions && m.metadata.suggestedActions.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {m.metadata.suggestedActions.map((a, i) => (
                        <button
                          key={i}
                          onClick={() => handleAction(a)}
                          className="inline-flex items-center gap-1.5 rounded-full bg-saffron-600 px-3.5 py-1.5 text-[12px] font-semibold text-white shadow-soft transition hover:bg-saffron-700"
                        >
                          {(a.action === "create_report" || a.action === "open_draft") && <FileText className="h-3.5 w-3.5" />}
                          {a.label}
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => copyText(m.content, m.id)}
                      title={dict.ai.copy}
                      className="rounded-lg p-1.5 text-ink-500 hover:bg-ink-900/5"
                      aria-label={dict.ai.copy}
                    >
                      {copiedId === m.id ? <Check className="h-3.5 w-3.5 text-leaf-600" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                    <button
                      onClick={() => { setFeedback((f) => ({ ...f, [m.id]: "up" })); toast("Thanks for your feedback!", "info"); }}
                      className={cn("rounded-lg p-1.5 hover:bg-ink-900/5", feedback[m.id] === "up" ? "text-leaf-600" : "text-ink-400")}
                      aria-label="Helpful"
                    >
                      <ThumbsUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => { setFeedback((f) => ({ ...f, [m.id]: "down" })); toast("Thanks — we'll keep improving.", "info"); }}
                      className={cn("rounded-lg p-1.5 hover:bg-ink-900/5", feedback[m.id] === "down" ? "text-saffron-600" : "text-ink-400")}
                      aria-label="Not helpful"
                    >
                      <ThumbsDown className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {sending && (
          <div className="bubble-in flex gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-saffron-400 to-saffron-600">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-md border border-ink-900/10 bg-white px-4 py-3 shadow-soft">
              {[0, 1, 2].map((i) => (
                <span key={i} className="h-2 w-2 rounded-full bg-saffron-500 animate-typing" style={{ animationDelay: `${i * 0.18}s` }} />
              ))}
              <span className="ml-1 text-[12px] text-ink-500">{dict.ai.thinking}</span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-ink-900/10 bg-white px-3 pb-3 pt-2">
        <div className="mb-2 flex items-center justify-between px-1">
          <p className="text-[11px] text-ink-500">{dict.ai.disclaimer}</p>
          <label className="flex items-center gap-1 text-[11px] text-ink-500">
            <Languages className="h-3.5 w-3.5" />
            <select
              value={lang}
              onChange={(e) => {
                      if (isLang(e.target.value)) setLang(e.target.value);
                    }}
                    className="rounded-lg border border-ink-900/10 bg-cream-50 px-1.5 py-0.5 text-[11px]"
                    aria-label={dict.nav.language}
                  >
                    {LANGUAGES.map((language) => (
                      <option key={language.code} value={language.code}>{language.native}</option>
                    ))}
                  </select>
          </label>
        </div>
        <form
          onSubmit={(e) => { e.preventDefault(); send(input); }}
          className="flex items-end gap-2"
        >
          <button
            type="button"
            onClick={toggleListening}
            title="Voice input"
            aria-label="Voice input"
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border transition",
              listening ? "border-red-300 bg-red-50 text-red-600 animate-pulse-dot" : "border-ink-900/10 bg-cream-50 text-ink-600 hover:border-saffron-300"
            )}
          >
            {listening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </button>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); }
            }}
            placeholder={dict.ai.placeholder}
            rows={1}
            aria-label={dict.ai.placeholder}
            className="max-h-32 min-h-[44px] flex-1 resize-none rounded-2xl border border-ink-900/10 bg-cream-50 px-4 py-3 text-[14px] outline-none transition placeholder:text-ink-400 focus:border-saffron-400"
          />
          <button
            type="submit"
            disabled={sending || !input.trim()}
            aria-label={dict.ai.send}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-saffron-600 text-white shadow-soft transition hover:bg-saffron-700 disabled:opacity-40"
          >
            {sending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </button>
        </form>
        {listening && (
          <p className="mt-1.5 px-1 text-[11px] text-red-600">
            🎤 Listening… speak now, then review the transcript before sending.
          </p>
        )}
      </div>

      {/* Draft modal */}
      {draft && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-ink-950/60 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Complaint draft">
          <div className="bubble-in flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-lift">
            <div className="flex items-center justify-between border-b border-ink-900/10 px-5 py-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-saffron-600" />
                <h3 className="font-bold text-ink-900">Complaint Draft — Preview</h3>
              </div>
              <button onClick={() => setDraft(null)} className="rounded-xl p-2 hover:bg-ink-900/5" aria-label={dict.common.close}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="nice-scroll flex-1 overflow-y-auto px-5 py-4">
              {editingDraft ? (
                <textarea
                  value={draftText}
                  onChange={(e) => setDraftText(e.target.value)}
                  rows={14}
                  className="w-full rounded-2xl border border-ink-900/15 bg-cream-50 p-4 text-[14px] leading-relaxed outline-none focus:border-saffron-400"
                />
              ) : (
                <RichText text={draft.body} />
              )}
              <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-[12px] text-amber-900">
                Nothing has been submitted. Review, edit or translate — then confirm to create the report.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 border-t border-ink-900/10 px-5 py-4">
              <button
                onClick={() => setEditingDraft((e) => !e)}
                className="rounded-xl border border-ink-900/15 px-4 py-2 text-sm font-semibold text-ink-700 hover:bg-cream-100"
              >
                {editingDraft ? "Preview" : dict.common.edit}
              </button>
              <label className="flex items-center gap-2 rounded-xl border border-ink-900/15 px-3 py-2 text-sm font-semibold text-ink-700">
                <Languages className="h-4 w-4" />
                <select
                  value={draftLang}
                  onChange={(e) => {
                    if (isLang(e.target.value)) void translateDraft(e.target.value);
                  }}
                  className="max-w-32 bg-transparent"
                  aria-label={dict.nav.language}
                >
                  {LANGUAGES.map((language) => (
                    <option key={language.code} value={language.code}>{language.native}</option>
                  ))}
                </select>
              </label>
              <button
                onClick={() => copyText(editingDraft ? draftText : draft.body, "draft")}
                className="rounded-xl border border-ink-900/15 px-4 py-2 text-sm font-semibold text-ink-700 hover:bg-cream-100"
              >
                {dict.ai.copy}
              </button>
              <div className="flex-1" />
              <button
                onClick={createReportFromDraft}
                className="rounded-xl bg-saffron-600 px-5 py-2 text-sm font-bold text-white shadow-soft hover:bg-saffron-700"
              >
                {dict.ai.createReport}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
