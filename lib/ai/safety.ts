// ─── JanAwaaz AI: privacy + safety guardrails ────────────────────────────────
// - Detects sensitive personal data (Aadhaar, phone, OTP, bank, passwords)
// - Masks it for display
// - Refuses unsafe requests (violence, illegal activity, political persuasion,
//   personal data about others, protest operational facilitation)

export interface PIIDetection {
  found: boolean;
  types: string[];
  masked: string;
}

const PII_PATTERNS: { type: string; re: RegExp; mask: string }[] = [
  { type: "Aadhaar number", re: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, mask: "XXXX-XXXX-$last4" },
  { type: "phone number", re: /(\+91[\s-]?)?\b[6-9]\d{9}\b/g, mask: "+91-XXXXXX-$last4" },
  { type: "OTP", re: /\botp\b[^.\n]{0,30}?(\d{4,8})/gi, mask: "OTP [hidden]" },
  { type: "bank account", re: /\b(account|a\/c|x\/x)\b[^.\n]{0,30}?(\d{9,18})/gi, mask: "account [hidden]" },
  { type: "password", re: /\b(password|paasword)\s*(is|:)?\s*\S+/gi, mask: "password [hidden]" },
];

export function detectPII(text: string): PIIDetection {
  const types: string[] = [];
  let masked = text;
  for (const p of PII_PATTERNS) {
    if (p.re.test(masked)) {
      types.push(p.type);
      p.re.lastIndex = 0;
      masked = masked.replace(p.re, (m) => {
        if (p.type === "Aadhaar number") return `XXXX-XXXX-${m.replace(/\D/g, "").slice(-4)}`;
        if (p.type === "phone number") return `+91-XXXXXX-${m.replace(/\D/g, "").slice(-4)}`;
        return p.mask;
      });
    }
    p.re.lastIndex = 0;
  }
  return { found: types.length > 0, types, masked };
}

export type UnsafeKind =
  | "violence" | "illegal" | "political" | "personal_data" | "protest_ops" | null;

// Script-aware word boundaries (JS \b only handles ASCII).
const B = String.raw`(?:^|[\s.,!?;:'"()\-])`;
const E = String.raw`(?=[\s.,!?;:'"()\-]|$)`;
const wx = (pat: string) => new RegExp(`${B}(?:${pat})${E}`, "i");

const UNSAFE_PATTERNS: { kind: Exclude<UnsafeKind, null>; re: RegExp }[] = [
  { kind: "violence", re: wx(String.raw`kill|murder|bomb|attack|assault|beat up|harm|hurt|violence|हिंसा|मार डाल|कत्ल`) },
  { kind: "illegal", re: wx(String.raw`bribe|रिश्वत|hack|fraud|fake (id|document|certificate)|smuggl|evade (tax|police)|illegal`) },
  { kind: "political", re: wx(String.raw`vote for|campaign for|support (bjp|congress|aap|party)|defeat|elect|चुनाव प्रचार|वोट दें`) },
  { kind: "personal_data", re: wx(String.raw`phone number.{0,20}(of|ka)|address.{0,20}(of|ka)|aadhaar.{0,20}(of|ka)`) },
  { kind: "protest_ops", re: wx(String.raw`how to (block|evade|escape|dodge)|avoid police|burn (tires|tyres)`) },
];

export function detectUnsafe(text: string): UnsafeKind {
  for (const p of UNSAFE_PATTERNS) {
    if (p.re.test(text)) return p.kind;
  }
  return null;
}

export const SAFE_COMPLETIONS: Record<Exclude<UnsafeKind, null>, { en: string; hi: string }> = {
  violence: {
    en: "I can't help with anything involving violence or harm to people or property. If you or someone nearby is in immediate danger, please contact emergency services (112) right away. For civic concerns, I'm here to help you use lawful channels — reporting, grievance portals, and peaceful petition.",
    hi: "हिंसा या किसी को नुकसान पहुंचाने वाली किसी भी चीज़ में मैं मदद नहीं कर सकता। अगर आप या आसपास कोई तत्काल खतरे में है, तो कृपया तुरंत आपातकालीन सेवा (112) से संपर्क करें। Civic चिंताओं के लिए मैं आपकी मदद के लिए हूं — रिपोर्टिंग, grievance portal और शांतिपूर्ण petition जैसे कानूनी माध्यमों से।",
  },
  illegal: {
    en: "I can't help with illegal activity — including bribery, fraud, fake documents, or evading authorities. If you've witnessed corruption, the lawful path is to report it through official anti-corruption helplines or grievance portals with evidence. I can help you draft that complaint.",
    hi: "मैं गैरकानूनी गतिविधि में मदद नहीं कर सकता — रिश्वत, धोखाधड़ी, नकली दस्तावेज़ या अधिकारियों से बचना इसमें शामिल है। अगर आपने भ्रष्टाचार देखा है, तो कानूनी रास्ता है — official anti-corruption helpline या grievance portal पर सबूत के साथ रिपोर्ट करें। मैं वह complaint draft करने में मदद कर सकता हूं।",
  },
  political: {
    en: "JanAwaaz is politically neutral — I don't campaign for or against any party, candidate, or ideology. I can still help you with civic information: how to register as a voter, how polling works, or how to raise a civic issue lawfully.",
    hi: "JanAwaaz politically neutral है — मैं किसी party, candidate या विचारधारा के लिए प्रचार नहीं करता। मैं civic जानकारी में मदद कर सकता हूं: voter registration कैसे करें, मतदान कैसे होता है, या civic मुद्दा कानूनी रूप से कैसे उठाएं।",
  },
  personal_data: {
    en: "I can't share or look up anyone's private personal information — phone numbers, addresses, or identity details. If you need to contact a public office, I can guide you to the official directory or grievance portal of that department.",
    hi: "मैं किसी की निजी व्यक्तिगत जानकारी — फोन नंबर, पता या पहचान विवरण — शेयर या खोज नहीं सकता। अगर आपको किसी public office से संपर्क करना है, तो मैं उस विभाग की official directory या grievance portal तक पहुंचने में मार्गदर्शन कर सकता हूं।",
  },
  protest_ops: {
    en: "I can't provide operational instructions for protests, blockades, or evading authorities. What I can do: explain your rights around peaceful assembly, how to seek permissions lawfully, and how to submit petitions or grievances through official channels.",
    hi: "मैं protest, blockade या अधिकारियों से बचने के operational निर्देश नहीं दे सकता। मैं यह कर सकता हूं: शांतिपूर्ण सभा के आपके अधिकार समझाना, कानूनी रूप से permission कैसे लें, और official channels से petition या grievance कैसे दें।",
  },
};
