// ─── JanAwaaz AI: conversation engine ────────────────────────────────────────
// Rule-based civic assistant: understands Hindi, Hinglish and English,
// classifies problems, asks smart follow-ups, drafts complaints, explains
// processes from the verified knowledge base, and stays neutral & safe.

import { classifyProblem, extractLocation, detectInputLang, type CategoryKey } from "./classifier";
import { detectPII, detectUnsafe, SAFE_COMPLETIONS } from "./safety";
import { findKnowledge } from "./knowledge";
import { generateDraft } from "./drafts";
import { isLang, type Lang } from "@/lib/i18n/dictionaries";
import { respondLocalized } from "./localized";
import type { VerifiedLocation } from "@/lib/locations/match";

export type InfoType = "verified" | "ai" | "reported" | "user" | "disputed";

export interface SuggestedAction {
  label: string;
  action: "create_report" | "open_draft" | "open_rights" | "open_issues" | "track" | "new_chat";
  payload?: Record<string, string>;
}

export interface AIResponse {
  text: string;
  infoType: InfoType;
  language: Lang;
  detectedCategory?: CategoryKey;
  suggestedActions?: SuggestedAction[];
  sources?: { label: string; note?: string }[];
  needsInfo?: string[];
  warning?: string;
}

type Intent =
  | "greeting" | "report_problem" | "status_check" | "draft" | "rti"
  | "grievance" | "scheme" | "notice" | "rights" | "public_issue"
  | "thanks" | "help" | "privacy" | "consumer" | "fallback";

// Word-boundary helper that works for Latin + Devanagari + other scripts
// (JS \b only understands ASCII word chars, so we use explicit boundaries).
const B = String.raw`(?:^|[\s.,!?;:'"()\-])`;
const E = String.raw`(?=[\s.,!?;:'"()\-]|$)`;
const wx = (pat: string, flags = "i") => new RegExp(`${B}(?:${pat})${E}`, flags);

const INTENT_PATTERNS: { intent: Intent; re: RegExp }[] = [
  { intent: "greeting", re: new RegExp(`^(?:namaste|namaskar|hello|hi|hey|sat sri akal|vanakkam|kem cho|namaskaram)${E}`, "i") },
  { intent: "status_check", re: wx(String.raw`status|stithi|स्थिति|kahan tak|कहां तक|meri (complaint|shikayat|report)|मेरी (शिकायत|रिपोर्ट)|track|ट्रैक`) },
  { intent: "draft", re: wx(String.raw`draft (bana|likh|taiyaar)|complaint (likh|bana)|application likh|पत्र लिख|शिकायत पत्र|application format|format`) },
  { intent: "rti", re: wx(String.raw`rti|सूचना का अधिकार|right to information`) },
  { intent: "grievance", re: wx(String.raw`grievance|cpgrams|pgportal|jansunwai|जनसुनवाई|lok shikayat|शिकायत पोर्टल`) },
  { intent: "scheme", re: wx(String.raw`yojana|योजना|scheme|सरकारी योजना`) },
  { intent: "notice", re: wx(String.raw`notice|नोटिस|notis|circular|परिपत्र|order aaya|आदेश`) },
  { intent: "consumer", re: wx(String.raw`consumer|उपभोक्ता|defective|खराब सामान|warranty|वारंटी`) },
  { intent: "rights", re: wx(String.raw`adhikaar|अधिकार|rights|hak|हक़|fundamental|मौलिक अधिकार|kanoon|कानून`) },
  { intent: "public_issue", re: wx(String.raw`andolan|आंदोलन|protest|dharna|धरना|rally|रैली|movement|morcha|मोर्चा|strike|हड़ताल`) },
  { intent: "report_problem", re: wx(String.raw`report karna|रिपोर्ट कर|complaint karna|शिकायत कर|shikayat|problem hain?|समस्या है|dikkat hain?|दिक्कत|pareshaani|परेशानी|kharab hain?|खराब है|nahi aa raha?|नहीं आ रहा|band hain?|बंद है`) },
  { intent: "thanks", re: wx(String.raw`thanks|thank you|dhanyavad|धन्यवाद|shukriya|शुक्रिया`) },
  { intent: "privacy", re: wx(String.raw`privacy|गोपनीयता|gopniyata|data (safe|secure)|mera data|personal (info|data)`) },
  { intent: "help", re: wx(String.raw`help|मदद|madad|sahayata|सहायता|kaise (use|kaam)|how (to|does)|kya kar sakte`) },
];

function detectIntent(text: string): Intent {
  for (const p of INTENT_PATTERNS) {
    if (p.re.test(text)) return p.intent;
  }
  return "fallback";
}

export interface EngineContext {
  message: string;
  preferredLang?: string;
  userName?: string;
  verifiedLocation?: VerifiedLocation | null;
  locationLookupComplete?: boolean;
  /** When the API resolved a report for status_check */
  reportContext?: {
    publicId: string; status: string; category: string; title: string; city: string;
    history: { toStatus: string; createdAt: string }[];
    officialResponse?: string;
  } | null;
  history?: { role: string; content: string }[];
}

const T = {
  en: {
    greeting: (name?: string) => `Hello${name ? ` ${name}` : ""}! I’m JanAwaaz AI.\n\nI can help you understand a civic problem, find information, and decide what to do next. You can ask me questions in English, Hindi, or Hinglish.\n\nHow can I help you today?`,
    piiWarning: (types: string[]) => `⚠️ Your message appears to contain **${types.join(", ")}**. For your safety, do not share passwords, one-time passcodes, Aadhaar numbers, or bank details in chat. Sensitive values have been masked from display.`,
    askLocation: (cat: string) => `I understand that this may be a **${cat}** civic issue.\n\nI can help you report it. Please share the **area, city, or a nearby public place** (for example, "Kalyanpur, Lucknow"). Do not share your full home address.`,
    askSpecificArea: (location: string) => `I found an official match for **${location}**. Which **ward, neighbourhood, or nearby public place** in this city or district is affected? Do not share your full home address.`,
    askDescription: (cat: string) => `This appears to be a **${cat}** issue.\n\nPlease explain **what is happening, when it started, and who is affected**. More detail will help me prepare a clearer complaint draft.`,
    confirmProblem: (cat: string, loc?: string) => `I’ve classified this as a **${cat}** issue${loc && loc !== "mentioned-area" ? ` in **${loc}**` : ""}.\n\nYou can change the category if needed. Select **Create Report** to preview a complaint draft. Nothing will be submitted until you review and confirm it.`,
    statusNeedId: `I need your **report ID** (for example, JA-10001) to check its status. You received this ID after submitting the report, and you can also find it on your dashboard.\n\nPlease send your report ID.`,
    statusUnknown: (id: string) => `I couldn’t find a report with ID **${id}**. Please check the ID in **My Reports** on your dashboard, or create a new report.`,
    draftNeedInfo: `I need a little more information to prepare a complaint draft:\n\n1. **What is the problem?** (Please describe it in 2–3 lines.)\n2. **Where is it?** (Area or city.)\n3. **When did it begin?**\n\nShare these details and I’ll prepare a draft.`,
    thanks: `You’re welcome! 🙏\n\nRemember: “Every voice. Everywhere. One India.” I’m here if you have another civic question.`,
    help: `I can help you with:\n\n• **Reporting a problem** — identifying a category and preparing a draft\n• **Checking a complaint’s status**\n• **RTI, public grievances, and government schemes**\n• **Understanding a government notice**\n• **Your rights** — available options and applicable processes\n• **Public issues** — with neutral, factual information\n\nAsk your question in the language you prefer.`,
    privacyAns: `Your privacy matters:\n\n• Your **personal details** (such as phone number, email, Aadhaar, and full address) are not shown publicly\n• Public pages show **aggregated issue information**\n• Evidence is visible only to you and **authorised officers**\n• Your precise location is never shown publicly\n\nWe do not promise absolute anonymity. Records required for lawful purposes are stored securely.`,
    fallback: `I want to understand your question so I can help. Could you share a little more detail?\n\nYou could ask:\n• "How do I report a water problem in my area?"\n• "What is RTI?"\n• "How can I check my complaint status?"\n• "Can you explain this government notice?"`,
    publicIssue: `I can provide **neutral, factual** information about a public issue or movement:\n\n• What has been reported, where, and when\n• Background and key concerns\n• Verified information and official responses\n• Current reported status and reliable sources\n• Lawful civic and grievance options\n\nI do not identify or track individuals, and I do not present unverified claims as facts. Which city or issue would you like to learn about? You can also browse curated topics on the **Public Issues** page.`,
    noticeShort: `Paste the **text of the government notice** here. I can explain it in three parts:\n\n1. **Original** — preserved as written\n2. **Plain-language explanation** — what it means\n3. **Next steps** — actions and deadlines to note\n\nThe original document remains unchanged, and the explanation is clearly labelled as AI-generated.`,
    rightsShort: `For general information about **your rights**, visit **Know Your Rights**. It includes plain-language guides about water, roads, education, employment, public services, consumer issues, the environment, and peaceful civic participation.\n\n> "This information is for general awareness and is not a substitute for professional legal advice."\n\nIf you have a specific question, such as the right to water or RTI, tell me more.`,
  },
  hi: {
    greeting: (name?: string) => `नमस्कार${name ? ` ${name}` : ""}! मैं जनआवाज़ का सहायक हूं।\n\nमैं नागरिक समस्याओं को समझने, जानकारी खोजने और अगले कदम तय करने में आपकी सहायता कर सकता हूं।\n\nआज मैं आपकी किस प्रकार सहायता करूं?`,
    piiWarning: (types: string[]) => `⚠️ मैंने आपके message में **${types.join(", ")}** detect किया है। कृपया password, OTP, आधार नंबर या bank details चैट में share न करें — मैंने उन्हें display से mask कर दिया है। बिना sensitive details के आप अपनी बात जारी रख सकते हैं।`,
    askLocation: (cat: string) => `समझ गया — यह **${cat}** से संबंधित civic issue लग रहा है।\n\nमैं इस समस्या को report करने में आपकी मदद कर सकता हूं। कृपया **इलाका/शहर या nearest public location** बता दें (जैसे "कल्याणपुर, लखनऊ")। आपका exact घर का पता देने की ज़रूरत नहीं है।`,
    askSpecificArea: (location: string) => `**${location}** का आधिकारिक स्थान मिल गया है। कृपया बताएं कि इस शहर/जिले में समस्या किस **वार्ड, मोहल्ले या नज़दीकी सार्वजनिक स्थान** पर है। पूरा घर का पता साझा न करें।`,
    askDescription: (cat: string) => `यह **${cat}** category का issue लग रहा है।\n\nथोड़ा detail में बताएं — **क्या समस्या है, कब से है, और किसको affect कर रही है?** जितना clear बताएंगे, उतनी strong complaint draft बनेगी।`,
    confirmProblem: (cat: string, loc?: string) => `समझ गया। मैंने इस समस्या को **${cat}** category में classify किया है${loc && loc !== "mentioned-area" ? `, location: **${loc}**` : ""}।\n\nअगर category गलत लगे तो आप उसे edit कर सकते हैं। नीचे **Create Report** दबाकर आप इसका professional complaint draft देख सकते हैं — कुछ भी automatically submit नहीं होगा, आपको पहले preview और confirm करना होगा।`,
    statusNeedId: `आपकी complaint का status बताने के लिए मुझे **report ID** चाहिए (जैसे JA-10001)। यह ID report submit करने के बाद मिली होगी, और आपके dashboard पर भी दिखती है।\n\nकृपया अपना report ID भेजें।`,
    statusUnknown: (id: string) => `मुझे **${id}** ID की कोई report नहीं मिली। कृपया ID दोबारा check करें — यह dashboard पर "My Reports" में दिखता है। या आप नई report create कर सकते हैं।`,
    draftNeedInfo: `Professional complaint draft बनाने के लिए मुझे थोड़ी और जानकारी चाहिए:\n\n1. **समस्या क्या है?** (2-3 lines में detail)\n2. **Location** — इलाका/शहर\n3. **कब से** यह समस्या है?\n\nये तीनों भेज दें, मैं तुरंत draft तैयार कर दूंगा।`,
    thanks: `मदद करके बहुत खुशी हुई! 🙏\n\nयाद रहे — "हर आवाज़। हर जगह। एक इंडिया।" अगर और कोई civic सवाल हो, मैं यहीं हूं।`,
    help: `मैं आपकी इन चीज़ों में मदद कर सकता हूं:\n\n• **Problem report करना** — category detect करके, draft बनाकर\n• **Complaint का status** समझना\n• **RTI, public grievance, government schemes** की जानकारी\n• **Government notice** को सरल भाषा में समझना\n• **Rights** — आप क्या कर सकते हैं, कौनसी process apply होती है\n• **Public issues** की neutral जानकारी\n\nबस अपनी भाषा में पूछिए!`,
    privacyAns: `आपकी privacy हमारी priority है:\n\n• आपकी **personal details (phone, email, Aadhaar, exact address)** कभी public नहीं दिखाई जातीं\n• Public pages पर सिर्फ **aggregated issue information** दिखती है\n• Evidence सिर्फ आपको और **authorised officers** को दिखता है\n• आपकी exact location कभी public नहीं होती\n\nएक बात साफ रहे: हम absolute anonymity का वादा नहीं करते — कानूनी कार्रवाई के लिए ज़रूरी records secure तरीके से रखे जाते हैं।`,
    fallback: `मैं समझना चाहता हूं ताकि सही मदद कर सकूं। क्या आप थोड़ा और detail में बता सकते हैं?\n\nआप इनमें से कुछ पूछ सकते हैं:\n• "मेरे इलाके में पानी नहीं आ रहा, complaint कहां करें?"\n• "RTI क्या होता है?"\n• "मेरी complaint का status क्या है?"\n• "एक government notice समझा दो।"`,
    publicIssue: `किसी public issue या movement के बारे में मैं **neutral, factual** जानकारी दे सकता हूं:\n\n• क्या report किया गया है, कहां और कब\n• Background और main concerns\n• Available verified information और official response\n• Current reported status और reliable sources\n• Lawful civic/grievance options\n\nमैं किसी individual को identify या track नहीं करता, और unverified दावों को fact की तरह present नहीं करता। बताइए — किस city/issue के बारे में जानना है? आप **Public Issues** page पर curated issues भी देख सकते हैं।`,
    noticeShort: `कोई government notice समझने के लिए उसका **text यहां paste कर दें**। मैं उसे 3 हिस्सों में समझाऊंगा:\n\n1. **Original** — जैसा लिखा है (preserved)\n2. **Simple Explanation** — इसका मतलब आसान भाषा में\n3. **आगे क्या करना है** — ज़रूरी action और deadline\n\nOriginal document हमेशा preserved रहता है, और AI explanation clearly label होता है।`,
    rightsShort: `**आपके अधिकारों** के बारे में general जानकारी के लिए **Know Your Rights** page देखें — पानी, सड़क, शिक्षा, रोज़गार, लोक सेवा, उपभोक्ता, पर्यावरण और शांतिपूर्ण भागीदारी पर सरल भाषा में guides हैं।\n\n> "यह जानकारी सामान्य जागरूकता के लिए है, पेशेवर कानूनी सलाह का विकल्प नहीं है।"\n\nकिसी specific अधिकार के बारे में पूछना हो तो बताएं — जैसे "पानी का अधिकार" या "RTI"।`,
  },
} as const;

type Lang2 = "en" | "hi";

function resolveLang(ctx: EngineContext, message: string): Lang {
  if (ctx.preferredLang && isLang(ctx.preferredLang)) return ctx.preferredLang;
  if (detectInputLang(message) === "hi") return "hi";
  return "en";
}

const CATEGORY_LABEL_HI: Record<string, string> = {
  WATER: "जल आपूर्ति", ROADS: "सड़क", ELECTRICITY: "बिजली", GARBAGE: "कचरा",
  DRAINAGE: "जल निकासी", EDUCATION: "शिक्षा", HEALTHCARE: "स्वास्थ्य",
  TRANSPORT: "परिवहन", ENVIRONMENT: "पर्यावरण", PUBLIC_SERVICES: "लोक सेवाएं",
  EMPLOYMENT: "रोज़गार", INFRASTRUCTURE: "बुनियादी ढांचा", DOCUMENTATION: "दस्तावेज़",
  SAFETY: "जन सुरक्षा", RIGHTS: "अधिकार / नागरिक प्रक्रिया", OTHER: "अन्य",
};
const CATEGORY_LABEL_EN: Record<string, string> = {
  WATER: "Water Supply", ROADS: "Roads", ELECTRICITY: "Electricity", GARBAGE: "Garbage",
  DRAINAGE: "Drainage", EDUCATION: "Education", HEALTHCARE: "Healthcare",
  TRANSPORT: "Transport", ENVIRONMENT: "Environment", PUBLIC_SERVICES: "Public Services",
  EMPLOYMENT: "Employment", INFRASTRUCTURE: "Infrastructure", DOCUMENTATION: "Documentation",
  SAFETY: "Public Safety", RIGHTS: "Rights / Civic Process", OTHER: "Other",
};

function catLabel(cat: string, lang: Lang2): string {
  return lang === "hi" ? (CATEGORY_LABEL_HI[cat] ?? cat) : (CATEGORY_LABEL_EN[cat] ?? cat);
}

const STATUS_EXPLAIN: Record<string, { en: string; hi: string }> = {
  REPORTED: { en: "Your report has been created and recorded.", hi: "आपकी report बन गई है और record हो गई है।" },
  AUTHORITY_IDENTIFIED: { en: "We've identified the likely responsible authority for your area.", hi: "आपके इलाके के लिए संभावित ज़िम्मेदार authority पहचान ली गई है।" },
  SUBMITTED: { en: "Your complaint has been submitted to the authority.", hi: "आपकी complaint authority को submit कर दी गई है।" },
  ACKNOWLEDGED: { en: "The authority has acknowledged your complaint.", hi: "Authority ने आपकी complaint स्वीकार कर ली है।" },
  UNDER_REVIEW: { en: "Your complaint is under review — the authority is examining it.", hi: "आपकी complaint समीक्षाधीन है — authority इसकी जांच कर रही है।" },
  ACTION_TAKEN: { en: "Action has been taken on the ground. Verification may follow.", hi: "ज़मीन पर कार्रवाई हो गई है। Verification आगे हो सकती है।" },
  RESOLVED: { en: "Your complaint is marked resolved. If the issue persists, you can reopen or file a fresh report.", hi: "आपकी complaint resolved mark हो गई है। अगर समस्या बनी है तो आप reopen कर सकते हैं या नई report file कर सकते हैं।" },
  REJECTED: { en: "This report was rejected with a reason recorded. You can edit and resubmit.", hi: "यह report कारण सहित reject कर दी गई थी। आप edit करके दोबारा submit कर सकते हैं।" },
};

export function respond(ctx: EngineContext): AIResponse {
  const { message } = ctx;
  const lang = resolveLang(ctx, message);
  if (lang !== "en" && lang !== "hi") return respondLocalized(ctx, lang);
  const t = T[lang];
  const msg = message.trim();

  // 1. PII warning (non-blocking)
  const pii = detectPII(msg);
  const warning = pii.found ? t.piiWarning(pii.types) : undefined;

  // 2. Safety gate
  const unsafe = detectUnsafe(msg);
  if (unsafe) {
    return {
      text: (SAFE_COMPLETIONS[unsafe] as { en: string; hi: string })[lang],
      infoType: "ai", language: lang, warning,
    };
  }

  const intent = detectIntent(msg);

  const withWarning = (r: AIResponse): AIResponse => (warning ? { ...r, warning } : r);

  switch (intent) {
    case "greeting":
      return withWarning({
        text: t.greeting(ctx.userName), infoType: "ai", language: lang,
        suggestedActions: [
          { label: lang === "hi" ? "समस्या रिपोर्ट करें" : "Report a problem", action: "create_report" },
          { label: lang === "hi" ? "RTI क्या है?" : "What is RTI?", action: "new_chat" },
        ],
      });

    case "thanks":
      return withWarning({ text: t.thanks, infoType: "ai", language: lang });

    case "help":
      return withWarning({ text: t.help, infoType: "ai", language: lang });

    case "privacy":
      return withWarning({ text: t.privacyAns, infoType: "verified", language: lang });

    case "rti":
    case "grievance":
    case "scheme":
    case "consumer": {
      const id = intent === "rti" ? "rti" : intent === "grievance" ? "public-grievance" : intent === "scheme" ? "scheme-general" : "consumer-general";
      const k = findKnowledge(id)!;
      return withWarning({
        text: k.body[lang], infoType: k.infoType, language: lang, sources: k.sources,
      });
    }

    case "notice": {
      // If the user pasted a long notice-like text, give the structured framework
      if (msg.length > 250) {
        const k = findKnowledge("notice-guide")!;
        return withWarning({
          text: `${k.body[lang]}\n\n---\n**${lang === "hi" ? "आपका document (preserved)" : "Your document (preserved)"}:**\n> ${msg.slice(0, 1200)}${msg.length > 1200 ? "…" : ""}\n\n*${lang === "hi" ? "ऊपर दिया गया breakdown एक AI explanation framework है — अंतिम व्याख्या के लिए original document और official source ही मान्य हैं।" : "The breakdown above is an AI explanation framework — for the final interpretation, the original document and official sources prevail."}*`,
          infoType: "ai", language: lang, sources: k.sources,
        });
      }
      return withWarning({ text: t.noticeShort, infoType: "ai", language: lang });
    }

    case "rights":
      return withWarning({
        text: t.rightsShort, infoType: "verified", language: lang,
        suggestedActions: [{ label: lang === "hi" ? "Know Your Rights खोलें" : "Open Know Your Rights", action: "open_rights" }],
      });

    case "public_issue":
      return withWarning({
        text: t.publicIssue, infoType: "ai", language: lang,
        suggestedActions: [{ label: lang === "hi" ? "Public Issues देखें" : "View Public Issues", action: "open_issues" }],
      });

    case "status_check": {
      const idMatch = msg.match(/\bJA-\d+\b/i);
      if (ctx.reportContext) {
        const r = ctx.reportContext;
        const expl = STATUS_EXPLAIN[r.status]?.[lang] ?? r.status;
        const timeline = r.history
          .map((h, i) => `${i + 1}. ${h.toStatus} — ${new Date(h.createdAt).toLocaleDateString(lang === "hi" ? "hi-IN" : "en-IN")}`)
          .join("\n");
        const official = r.officialResponse
          ? `\n\n**${lang === "hi" ? "Official Response (original)" : "Official Response (original)"}:**\n> ${r.officialResponse}\n\n*${lang === "hi" ? "JanAwaaz AI — सरल व्याख्या:" : "JanAwaaz AI — simple explanation:"} ${lang === "hi" ? "Authority ने आपकी complaint पर जवाब दिया है। ऊपर original text है; उसका मतलब है कि आपकी शिकायत पर ध्यान दिया गया है और आगे की कार्रवाई की जानकारी दी गई है।" : "The authority has responded to your complaint. The original text is above; it means your complaint has been noted and you are being informed of further action."}*`
          : "";
        return withWarning({
          text: `**${r.publicId}** — ${r.title}\n📍 ${r.city} • ${catLabel(r.category, lang)}\n\n**Current status: ${r.status}**\n${expl}\n\n**Timeline:**\n${timeline}${official}`,
          infoType: "verified", language: lang,
          suggestedActions: [{ label: lang === "hi" ? "Track Page खोलें" : "Open Track Page", action: "track", payload: { id: r.publicId } }],
        });
      }
      if (idMatch) {
        return withWarning({ text: t.statusUnknown(idMatch[0].toUpperCase()), infoType: "ai", language: lang });
      }
      return withWarning({ text: t.statusNeedId, infoType: "ai", language: lang, needsInfo: ["reportId"] });
    }

    case "draft": {
      const classification = classifyProblem(msg);
      const loc = ctx.locationLookupComplete
        ? ctx.verifiedLocation?.path.filter((part) => part !== "India").join(", ") ?? null
        : extractLocation(msg);
      if (ctx.locationLookupComplete && !ctx.verifiedLocation) {
        return withWarning({ text: t.draftNeedInfo, infoType: "ai", language: lang, needsInfo: ["location"] });
      }
      if (ctx.verifiedLocation && ctx.verifiedLocation.type !== "VILLAGE") {
        const location = ctx.verifiedLocation.path.filter((part) => part !== "India").join(", ");
        return withWarning({
          text: t.askSpecificArea(location), infoType: "ai", language: lang,
          detectedCategory: classification.category === "OTHER" ? undefined : classification.category,
          needsInfo: ["wardOrLocality"],
        });
      }
      if (msg.length < 40 || classification.category === "OTHER") {
        return withWarning({ text: t.draftNeedInfo, infoType: "ai", language: lang, needsInfo: ["description", "location", "duration"] });
      }
      const draft = generateDraft({
        category: classification.category, description: msg,
        location: loc ?? undefined, name: ctx.userName, language: lang,
      });
      return withWarning({
        text: `**${lang === "hi" ? "Complaint Draft (preview)" : "Complaint Draft (preview)"}** — ${catLabel(classification.category, lang)}\n\n${draft.body}\n\n*${lang === "hi" ? "यह सिर्फ preview है — कुछ भी submit नहीं हुआ है। आप edit, translate या copy कर सकते हैं, फिर confirm करके report बनाएं।" : "This is only a preview — nothing has been submitted. You can edit, translate or copy it, then confirm to create the report."}*`,
        infoType: "user", language: lang, detectedCategory: classification.category,
        suggestedActions: [
          { label: lang === "hi" ? "रिपोर्ट बनाएं" : "Create Report", action: "create_report", payload: { category: classification.category, description: msg, location: loc ?? "" } },
        ],
      });
    }

    case "report_problem":
    case "fallback": {
      const classification = classifyProblem(msg);
      // Explicit problem statements need only a weak signal; vague messages need more.
      const minScore = intent === "report_problem" ? 1 : 3;
      if (classification.category === "OTHER" || classification.score < minScore) {
        // Try knowledge match for process questions like "bijli ka complaint kaise karein"
        const processMap: [RegExp, string][] = [
          [/bijli|बिजली|electric/i, "electricity-complaint"],
          [/paani|pani|पानी|water/i, "water-complaint"],
          [/sadak|सड़क|road|गड्ढा|gaddha/i, "road-complaint"],
          [/kachra|कचरा|garbage|safai/i, "garbage-complaint"],
        ];
        for (const [re, kid] of processMap) {
          if (re.test(msg) && /kaise|कैसे|process|प्रक्रिया|kahan|कहां/.test(msg)) {
            const k = findKnowledge(kid)!;
            return withWarning({ text: k.body[lang], infoType: k.infoType, language: lang, sources: k.sources });
          }
        }
        return withWarning({ text: t.fallback, infoType: "ai", language: lang });
      }

      const loc = ctx.locationLookupComplete
        ? ctx.verifiedLocation?.path.filter((part) => part !== "India").join(", ") ?? null
        : extractLocation(msg);
      const label = catLabel(classification.category, lang);

      if (!loc) {
        return withWarning({
          text: t.askLocation(label), infoType: "ai", language: lang,
          detectedCategory: classification.category, needsInfo: ["location"],
        });
      }
      if (ctx.verifiedLocation && ctx.verifiedLocation.type !== "VILLAGE") {
        return withWarning({
          text: t.askSpecificArea(loc), infoType: "ai", language: lang,
          detectedCategory: classification.category, needsInfo: ["wardOrLocality"],
        });
      }
      if (msg.length < 30) {
        return withWarning({
          text: t.askDescription(label), infoType: "ai", language: lang,
          detectedCategory: classification.category, needsInfo: ["description"],
        });
      }
      return withWarning({
        text: t.confirmProblem(label, loc), infoType: "ai", language: lang,
        detectedCategory: classification.category,
        suggestedActions: [
          { label: lang === "hi" ? "रिपोर्ट बनाएं" : "Create Report", action: "create_report", payload: { category: classification.category, description: msg, location: loc === "mentioned-area" ? "" : loc } },
        ],
      });
    }
  }
}
