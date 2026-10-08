// ─── JanAwaaz AI: civic problem category classifier ──────────────────────────
// Keyword-based, multilingual (English + Hindi/Devanagari + Hinglish).
// Scores each category; returns the best match with a confidence level.

export type CategoryKey =
  | "WATER" | "ROADS" | "ELECTRICITY" | "GARBAGE" | "DRAINAGE" | "EDUCATION"
  | "HEALTHCARE" | "TRANSPORT" | "ENVIRONMENT" | "PUBLIC_SERVICES" | "EMPLOYMENT"
  | "INFRASTRUCTURE" | "DOCUMENTATION" | "SAFETY" | "RIGHTS" | "OTHER";

const KEYWORDS: Record<Exclude<CategoryKey, "OTHER">, string[]> = {
  WATER: ["water", "paani", "pani", "पानी", "jal", "जल", "tap", "नल", "tanker", "टैंकर", "supply", "सप्लाई", "pipeline", "पाइपलाइन", "handpump", "हैंडपंप", "borewell", "tubewell", "contaminat", "गंदा", "ganda", "drinking", "पेयजल", "sewage leak"],
  ROADS: ["road", "सड़क", "sadak", "pothole", "गड्ढा", "gaddha", "gaddhe", "footpath", "फुटपाथ", "street", "गली", "gali", "highway", "हाईवे", "bridge", "पुल", "flyover", "speed breaker", "repair", "टूटी सड़क", "tooti sadak", "pavement", "divier", "zebra"],
  ELECTRICITY: ["electricity", "bijli", "बिजली", "power cut", "बिजली कट", "light", "बत्ती", "transformer", "ट्रांसफार्मर", "meter", "मीटर", "bill", "बिल", "wire", "तार", "voltage", "वोल्टेज", "street light", "स्ट्रीट लाइट", "discom", "load shedding"],
  GARBAGE: ["garbage", "kachra", "कचरा", "waste", "कूड़ा", "dustbin", "डस्टबिन", "safai", "सफाई", "cleaning", "litter", "dumping", "कूड़ेदान", "sanitation", "sweep"],
  DRAINAGE: ["drain", "नाली", "naali", "drainage", "sewer", "सीवर", "waterlog", "जलभराव", "flood", "बाढ़", "clog", "block", "overflow", "manhole", "मैनहोल", "stormwater"],
  EDUCATION: ["school", "स्कूल", "teacher", "शिक्षक", "teacher", "student", "छात्र", "विद्यार्थी", "college", "कॉलेज", "admission", "दाखिला", "exam", "परीक्षा", "mid-day meal", "scholarship", "छात्रवृत्ति", "classroom"],
  HEALTHCARE: ["hospital", "अस्पताल", "doctor", "डॉक्टर", "dawai", "दवाई", "medicine", "clinic", "क्लीनिक", "health", "स्वास्थ्य", "vaccin", "टीका", "ambulance", "एम्बुलेंस", "dengue", "fever", "बुखार", "dispensary"],
  TRANSPORT: ["bus", "बस", "train", "ट्रेन", "metro", "मेट्रो", "auto", "ऑटो", "traffic", "ट्रैफिक", "signal", "सिग्नल", "parking", "पार्किंग", "roadways", "conductor", "ticket", "टिकट", "overcrowd"],
  ENVIRONMENT: ["pollution", "प्रदूषण", "pradushan", "air quality", "aqi", "smog", "धुआं", "dhuaan", "burning", "जलाना", "tree", "पेड़", "cutting", "noise", "शोर", "dust", "धूल", "green", "हरियाली", "plastic"],
  PUBLIC_SERVICES: ["certificate", "प्रमाणपत्र", "ration", "राशन", "pension", "पेंशन", "office", "कार्यालय", "delay", "देरी", "bribe", "रिश्वत", "corruption", "भ्रष्टाचार", "application", "आवेदन", "token", "queue", "लंबी लाइन", "counter", "sarkari daftar"],
  EMPLOYMENT: ["job", "नौकरी", "naukri", "rozgar", "रोजगार", "mgnrega", "मनरेगा", "wage", "मजदूरी", "majdoori", "unemploy", "बेरोजगार", "vacancy", "भर्ती", "recruit", "labour", "मजदूर", "contract"],
  INFRASTRUCTURE: ["building", "इमारत", "construction", "निर्माण", "park", "पार्क", "playground", "मैदान", "community hall", "toilet", "शौचालय", "public toilet", "sulabh", "encroach", "अतिक्रमण", "boundary wall"],
  DOCUMENTATION: ["document", "दस्तावेज़", "aadhaar", "आधार", "pan card", "पैन कार्ड", "voter", "वोटर", "passport", "पासपोर्ट", "license", "लाइसेंस", "registration", "पंजीकरण", "correction", "सुधार", "name change", "khata", "mutation", "registry"],
  SAFETY: ["safety", "सुरक्षा", "suraksha", "unsafe", "असुरक्षित", "theft", "चोरी", "harass", "छेड़छाड़", "stalking", "dark", "अंधेरा", "cctv", "police", "पुलिस", "patrol", "women safety", "eve teasing", "snatching"],
  RIGHTS: ["right", "अधिकार", "adhikaar", "rti", "सूचना का अधिकार", "fundamental", "मौलिक", "constitution", "संविधान", "discriminat", "भेदभाव", "petition", "याचिका", "grievance", "शिकायत", "legal", "कानूनी", "court", "कोर्ट", "lawyer", "वकील"],
};

export interface Classification {
  category: CategoryKey;
  confidence: "high" | "medium" | "low";
  score: number;
}

export function classifyProblem(text: string): Classification {
  const t = ` ${text.toLowerCase()} `;
  let best: CategoryKey = "OTHER";
  let bestScore = 0;

  for (const [cat, words] of Object.entries(KEYWORDS) as [Exclude<CategoryKey, "OTHER">, string[]][]) {
    let score = 0;
    for (const w of words) {
      if (t.includes(w.toLowerCase())) score += w.length > 5 ? 2 : 1;
    }
    if (score > bestScore) {
      bestScore = score;
      best = cat;
    }
  }

  const confidence: Classification["confidence"] =
    bestScore >= 6 ? "high" : bestScore >= 3 ? "medium" : bestScore > 0 ? "low" : "low";

  return { category: bestScore > 0 ? best : "OTHER", confidence, score: bestScore };
}

/** Very light location extraction: known cities + "in/near/mein" patterns. */
const KNOWN_PLACES = [
  "delhi", "kanpur", "lucknow", "mumbai", "bengaluru", "bangalore", "patna",
  "kolkata", "chennai", "hyderabad", "jaipur", "ahmedabad", "pune", "surat",
  "nagpur", "indore", "bhopal", "agra", "varanasi", "meerut", "kalyanpur",
];

export function extractLocation(text: string): string | null {
  const t = text.toLowerCase();
  for (const place of KNOWN_PLACES) {
    if (t.includes(place)) return place.charAt(0).toUpperCase() + place.slice(1);
  }
  // "in X", "mein X", "near X", "ke paas X" patterns — reject durations ("5 din")
  const m = t.match(/(?:\bin\b|\bnear\b|\bmein\b|\bmain\b|\bke paas\b|\bat\b)\s+([a-z\u0900-\u097F]+(?:\s+[a-z\u0900-\u097F]+){0,2})/);
  if (m && m[1]) {
    const cap = m[1].trim();
    if (cap.length > 2 && !/^\d/.test(cap) && !/^(my|mere|mera|the|yeh|yah|hamare|hamara)\b/.test(cap)) {
      return cap;
    }
  }
  // Generic area words without a name → no usable location (we'll ask)
  return null;
}

/** Detect the script/language of user input for response language choice. */
export function detectInputLang(text: string): "hi" | "other-devanagari" | "en" {
  if (/[\u0900-\u097F]/.test(text)) return "hi";
  return "en";
}
