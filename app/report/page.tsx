"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft, ArrowRight, CheckCircle2, Loader2, Sparkles, MapPin,
  FileText, Camera, ClipboardCheck, Bot,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/provider";
import { useAIRequest } from "@/hooks/useAIRequest";
import { useToast } from "@/components/Toast";
import { useAuth } from "@/hooks/useAuth";
import { EvidenceUploader } from "@/components/EvidenceUploader";
import { post } from "@/lib/api-client";
import { CATEGORIES } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { LocationSelector } from "@/components/LocationSelector";

const CATEGORY_EMOJI: Record<string, string> = {
  WATER: "💧", ROADS: "🛣️", ELECTRICITY: "💡", GARBAGE: "🗑️", DRAINAGE: "🚰",
  EDUCATION: "🏫", HEALTHCARE: "🏥", TRANSPORT: "🚍", ENVIRONMENT: "🌱",
  PUBLIC_SERVICES: "🏛️", EMPLOYMENT: "💼", INFRASTRUCTURE: "🏗️",
  DOCUMENTATION: "📄", SAFETY: "🛡️", RIGHTS: "⚖️", OTHER: "📢",
};

const STEPS = ["Category", "Description", "Location", "Evidence", "Review", "Submit"];

interface FormState {
  category: string;
  title: string;
  description: string;
  state: string;
  district: string;
  city: string;
  area: string;
  subDistrict: string;
  block: string;
  ward: string;
  locationId: string;
  settlementId: string;
  stateId: string;
  districtId: string;
  subDistrictId: string;
  blockId: string;
  wardId: string;
  settlementType: "COUNTRY" | "STATE" | "DIVISION" | "DISTRICT" | "SUB_DISTRICT" | "BLOCK" | "VILLAGE" | "CITY" | "TOWN" | "MUNICIPAL_BODY" | "WARD" | "";
  latitude: string;
  longitude: string;
  landmark: string;
  priority: string;
}

const EMPTY: FormState = {
  category: "", title: "", description: "",
  state: "", district: "", city: "", area: "", subDistrict: "", block: "", ward: "",
  locationId: "", settlementId: "", stateId: "", districtId: "", subDistrictId: "", blockId: "", wardId: "", settlementType: "",
  latitude: "", longitude: "",
  landmark: "",
  priority: "MEDIUM",
};

export default function ReportPage() {
  const { dict, tCategory } = useLanguage();
  const requestAI = useAIRequest();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const search = useSearchParams();

  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [aiDetecting, setAiDetecting] = useState(false);
  const [aiCategory, setAiCategory] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [createdId, setCreatedId] = useState<string | null>(null);
  const [createdDbId, setCreatedDbId] = useState<string | null>(null);

  // Prefill: from AI chat (?from=ai localStorage), ?category=, or saved draft
  useEffect(() => {
    try {
      const prefill = localStorage.getItem("ja_report_prefill");
      if (prefill) {
        const p = JSON.parse(prefill);
        setForm((f) => ({
          ...f,
          category: p.category ?? f.category,
          title: (p.title ?? "").slice(0, 140),
          description: typeof p.description === "string" ? p.description.replace(/\*\*/g, "").slice(0, 5000) : f.description,
          city: p.city ?? f.city,
        }));
        localStorage.removeItem("ja_report_prefill");
        toast("Prefilled from your AI conversation", "info");
        return;
      }
      const cat = search.get("category");
      if (cat && (CATEGORIES as readonly string[]).includes(cat)) {
        setForm((f) => ({ ...f, category: cat }));
      }
      const draft = localStorage.getItem("ja_report_draft");
      if (draft) {
        setForm((f) => ({ ...f, ...JSON.parse(draft) }));
        toast("Restored your saved draft", "info");
      }
    } catch { /* ignore */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Offline-friendly autosave
  useEffect(() => {
    if (createdId) return;
    try { localStorage.setItem("ja_report_draft", JSON.stringify(form)); } catch {}
  }, [form, createdId]);

  const set = (k: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((f) => ({ ...f, [k]: e.target.value }));

  /** AI assist: classify the free-text description into a category. */
  const aiAssist = async () => {
    if (form.description.trim().length < 10) {
      toast("Please describe the problem in a few words first", "info");
      return;
    }
    setAiDetecting(true);
    try {
      const data = await requestAI<{ detectedCategory?: string; reply?: string }>("/api/ai/chat", {
        message: form.description.slice(0, 500),
      });
      if (data.detectedCategory && data.detectedCategory !== "OTHER") {
        setAiCategory(data.detectedCategory);
        setForm((f) => ({ ...f, category: f.category || data.detectedCategory! }));
        toast(`AI detected: ${tCategory(data.detectedCategory)} — you can change it`, "info");
      } else {
        toast("AI couldn't confidently classify this — please pick a category", "info");
      }
    } catch {
      toast("AI assist unavailable right now", "error");
    } finally {
      setAiDetecting(false);
    }
  };

  const canNext = () => {
    if (step === 0) return !!form.category;
    if (step === 1) return form.title.trim().length >= 4 && form.description.trim().length >= 10;
    if (step === 2) return form.state.trim().length >= 2 && form.district.trim().length >= 2 && form.city.trim().length >= 2;
    return true;
  };

  const submit = async () => {
    if (!user) {
      try { localStorage.setItem("ja_report_prefill", JSON.stringify(form)); } catch {}
      router.push("/login?next=/report");
      return;
    }
    setSubmitting(true);
    try {
      const data = await post<{ publicId: string; id: string }>("/api/reports", {
        category: form.category,
        title: form.title.trim(),
        description: form.description.trim(),
        state: form.state.trim(),
        district: form.district.trim(),
        city: form.city.trim(),
        area: form.area.trim() || undefined,
        subDistrict: form.subDistrict.trim() || undefined,
        block: form.block.trim() || undefined,
        ward: form.ward.trim() || undefined,
        locationId: form.locationId || undefined,
        stateId: form.stateId || undefined,
        districtId: form.districtId || undefined,
        subDistrictId: form.subDistrictId || undefined,
        blockId: form.blockId || undefined,
        wardId: form.wardId || undefined,
        settlementType: form.settlementType || undefined,
        latitude: form.latitude ? Number(form.latitude) : undefined,
        longitude: form.longitude ? Number(form.longitude) : undefined,
        landmark: form.landmark.trim() || undefined,
        priority: form.priority,
      });
      setCreatedId(data.publicId);
      setCreatedDbId(data.id);
      try { localStorage.removeItem("ja_report_draft"); } catch {}
      setStep(5);
      toast("Report submitted successfully!");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Submission failed", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = "w-full rounded-2xl border border-ink-900/15 bg-cream-50 px-4 py-3 text-[15px] outline-none transition focus:border-saffron-400";
  const labelCls = "mb-1.5 block text-sm font-bold text-ink-700";

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-extrabold text-ink-900 md:text-4xl">{dict.reportCta.title}</h1>
      <p className="mt-2 text-ink-600">{dict.reportCta.subtitle}</p>

      {/* Stepper */}
      <ol className="mt-8 flex items-center gap-1 overflow-x-auto pb-2" aria-label="Report steps">
        {STEPS.map((s, i) => (
          <li key={s} className="flex shrink-0 items-center gap-1.5">
            <span className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full text-[13px] font-bold transition",
              i < step ? "bg-leaf-500 text-white" : i === step ? "bg-saffron-600 text-white shadow-glow-saffron" : "bg-cream-200 text-ink-400"
            )}>
              {i < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
            </span>
            <span className={cn("mr-2 text-[12px] font-bold", i === step ? "text-ink-900" : "text-ink-400")}>{s}</span>
            {i < STEPS.length - 1 && <span className="mr-1 h-px w-6 bg-ink-900/15" />}
          </li>
        ))}
      </ol>

      <div className="mt-6 rounded-[2rem] border border-ink-900/10 bg-white p-6 shadow-lift md:p-8">
        {/* STEP 0 — Category */}
        {step === 0 && (
          <div>
            <h2 className="flex items-center gap-2 text-lg font-bold text-ink-900">
              <Sparkles className="h-5 w-5 text-saffron-600" /> Choose a category
            </h2>
            <p className="mt-1 text-sm text-ink-500">AI can detect it from your description — or pick manually.</p>
            <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setForm((f) => ({ ...f, category: c }))}
                  aria-pressed={form.category === c}
                  className={cn(
                    "rounded-2xl border p-4 text-center transition hover:-translate-y-0.5",
                    form.category === c
                      ? "border-saffron-400 bg-saffron-50 shadow-glow-saffron"
                      : "border-ink-900/10 bg-cream-50 hover:border-saffron-300"
                  )}
                >
                  <span className="text-2xl">{CATEGORY_EMOJI[c]}</span>
                  <span className={cn("mt-1.5 block text-[12px] font-bold", form.category === c ? "text-saffron-700" : "text-ink-700")}>
                    {tCategory(c)}
                  </span>
                </button>
              ))}
            </div>
            {aiCategory && form.category === aiCategory && (
              <p className="mt-3 rounded-xl bg-chakra-50 px-4 py-2.5 text-[13px] text-chakra-800">
                🤖 AI detected <strong>{tCategory(aiCategory)}</strong> — you can change it above.
              </p>
            )}
          </div>
        )}

        {/* STEP 1 — Description */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="flex items-center gap-2 text-lg font-bold text-ink-900">
              <FileText className="h-5 w-5 text-saffron-600" /> Describe the problem
            </h2>
            <div>
              <label htmlFor="r-title" className={labelCls}>Title <span className="text-saffron-600">*</span></label>
              <input id="r-title" value={form.title} onChange={set("title")} className={inputCls} placeholder="e.g. No water supply for 4 days in Shastri Nagar" maxLength={140} />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="r-desc" className={labelCls}>Description <span className="text-saffron-600">*</span></label>
                <button
                  onClick={aiAssist} disabled={aiDetecting}
                  className="inline-flex items-center gap-1.5 rounded-full bg-chakra-50 px-3.5 py-1.5 text-[12px] font-bold text-chakra-700 transition hover:bg-chakra-100 disabled:opacity-50"
                >
                  {aiDetecting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Bot className="h-3.5 w-3.5" />}
                  AI: detect category
                </button>
              </div>
              <textarea
                id="r-desc" value={form.description} onChange={set("description")} rows={5}
                className={inputCls} placeholder="Kya problem hai? Kab se hai? Kisko affect kar rahi hai? Apni bhasha mein likhein…"
                maxLength={5000}
              />
              <p className="mt-1 text-right text-[12px] text-ink-400">{form.description.length}/5000</p>
            </div>
            <div>
              <label htmlFor="r-priority" className={labelCls}>Priority</label>
              <select id="r-priority" value={form.priority} onChange={set("priority")} className={inputCls}>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent — safety hazard</option>
              </select>
            </div>
          </div>
        )}

        {/* STEP 2 — Location */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="flex items-center gap-2 text-lg font-bold text-ink-900">
              <MapPin className="h-5 w-5 text-saffron-600" /> Where is the problem?
            </h2>
            <p className="rounded-2xl bg-leaf-50 px-4 py-3 text-[13px] text-leaf-800">
              🔒 Only area-level location is needed. Never share your exact home address publicly.
            </p>
            <LocationSelector value={form} onChange={(location) => setForm((current) => ({ ...current, ...location }))} />
            <div>
              <label htmlFor="r-landmark" className={labelCls}>Nearest landmark <span className="text-ink-400">({dict.common.optional})</span></label>
              <input id="r-landmark" value={form.landmark} onChange={set("landmark")} className={inputCls} placeholder="e.g. Near bus stop" />
            </div>
          </div>
        )}

        {/* STEP 3 — Evidence (optional, after creation mostly) */}
        {step === 3 && (
          <div>
            <h2 className="flex items-center gap-2 text-lg font-bold text-ink-900">
              <Camera className="h-5 w-5 text-saffron-600" /> Evidence <span className="text-sm font-normal text-ink-400">({dict.common.optional})</span>
            </h2>
            <p className="mt-1 text-sm text-ink-500">
              You can attach evidence now after submitting, or skip — evidence can be added from your dashboard later.
            </p>
            <div className="mt-4 rounded-2xl bg-cream-100 p-5 text-center text-sm text-ink-500">
              📎 Evidence upload unlocks right after you submit the report.
            </div>
          </div>
        )}

        {/* STEP 4 — Review */}
        {step === 4 && (
          <div>
            <h2 className="flex items-center gap-2 text-lg font-bold text-ink-900">
              <ClipboardCheck className="h-5 w-5 text-saffron-600" /> Review & submit
            </h2>
            <dl className="mt-4 space-y-3 rounded-2xl bg-cream-50 p-5 text-sm">
              {[
                ["Category", `${CATEGORY_EMOJI[form.category] ?? ""} ${tCategory(form.category)}`],
                ["Title", form.title],
                ["Description", form.description],
                ["Location", [form.area, form.ward, form.city, form.block, form.subDistrict, form.district, form.state].filter(Boolean).join(", ")],
                ["Landmark", form.landmark || "—"],
                ["Priority", form.priority],
              ].map(([k, v]) => (
                <div key={k} className="grid grid-cols-[110px_1fr] gap-2">
                  <dt className="font-bold text-ink-500">{k}</dt>
                  <dd className="text-ink-900">{v}</dd>
                </div>
              ))}
            </dl>
            {!user && !authLoading && (
              <p className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-[13px] text-amber-900">
                You'll be asked to <Link href="/login?next=/report" className="font-bold underline">log in</Link> to submit — your draft is saved.
              </p>
            )}
          </div>
        )}

        {/* STEP 5 — Success */}
        {step === 5 && createdId && (
          <div className="text-center">
            <CheckCircle2 className="mx-auto h-16 w-16 text-leaf-500" />
            <h2 className="mt-4 text-2xl font-extrabold text-ink-900">Report submitted!</h2>
            <p className="mt-2 text-ink-600">Your report ID — save it to track progress:</p>
            <p className="mx-auto mt-3 inline-block rounded-2xl bg-ink-900 px-6 py-3 font-mono text-2xl font-black tracking-widest text-white">
              {createdId}
            </p>
            <div className="mt-6 text-left">
              <h3 className="mb-3 text-sm font-bold text-ink-700">Add evidence (optional)</h3>
              {createdDbId && <EvidenceUploader reportId={createdDbId} />}
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href={`/track/${createdId}`} className="rounded-2xl bg-saffron-600 px-6 py-3 font-bold text-white hover:bg-saffron-700">
                Track complaint
              </Link>
              <Link href="/dashboard" className="rounded-2xl border border-ink-900/15 px-6 py-3 font-bold text-ink-700 hover:bg-cream-100">
                Go to dashboard
              </Link>
            </div>
          </div>
        )}

        {/* Nav buttons */}
        {step < 5 && (
          <div className="mt-8 flex items-center justify-between">
            <button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="inline-flex items-center gap-1.5 rounded-2xl border border-ink-900/15 px-5 py-3 font-bold text-ink-700 transition hover:bg-cream-100 disabled:opacity-40"
            >
              <ArrowLeft className="h-4 w-4" /> {dict.common.back}
            </button>
            {step < 4 ? (
              <button
                onClick={() => canNext() && setStep((s) => s + 1)}
                disabled={!canNext()}
                className="inline-flex items-center gap-1.5 rounded-2xl bg-saffron-600 px-6 py-3 font-bold text-white shadow-soft transition hover:bg-saffron-700 disabled:opacity-40"
              >
                {dict.common.next} <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={submit}
                disabled={submitting}
                className="inline-flex items-center gap-1.5 rounded-2xl bg-leaf-600 px-6 py-3 font-bold text-white shadow-soft transition hover:bg-leaf-700 disabled:opacity-50"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                {dict.common.submit}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
