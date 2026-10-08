// ─── JanAwaaz multilingual dictionaries ───────────────────────────────────────
// 13 supported languages. Selecting a language changes the entire interface:
// navigation, forms, reports, AI assistant, issue pages, rights info,
// notifications, drafts, explanations, accessibility text and help content.
// To add a language: add its code to `Lang`, metadata in `LANGUAGES`, and a
// full `Dict` below.
import { transliterateDictionary } from "./transliteration";

export type Lang =
  | "en" | "hi" | "hi-Latn" | "bn" | "te" | "mr" | "ta" | "gu"
  | "kn" | "ml" | "pa" | "or" | "as" | "ur";

export const LANGUAGES: { code: Lang; label: string; native: string }[] = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "hi-Latn", label: "Hinglish", native: "Hinglish" },
  { code: "bn", label: "Bengali", native: "বাংলা" },
  { code: "te", label: "Telugu", native: "తెలుగు" },
  { code: "mr", label: "Marathi", native: "मराठी" },
  { code: "ta", label: "Tamil", native: "தமிழ்" },
  { code: "gu", label: "Gujarati", native: "ગુજરાતી" },
  { code: "kn", label: "Kannada", native: "ಕನ್ನಡ" },
  { code: "ml", label: "Malayalam", native: "മലയാളം" },
  { code: "pa", label: "Punjabi", native: "ਪੰਜਾਬੀ" },
  { code: "or", label: "Odia", native: "ଓଡ଼ିଆ" },
  { code: "as", label: "Assamese", native: "অসমীয়া" },
  { code: "ur", label: "Urdu", native: "اردو" },
];

export interface Dict {
  nav: {
    home: string; explore: string; report: string; map: string; issues: string;
    rights: string; ai: string; dashboard: string; language: string;
    notifications: string; reportProblem: string; profile: string; myReports: string;
    saved: string; privacy: string; logout: string; login: string; register: string;
  };
  hero: {
    badge: string; title: string; subtitle: string; reportBtn: string;
    exploreBtn: string; seeHappening: string; trust1: string; trust2: string; trust3: string;
  };
  stats: {
    title: string; subtitle: string; reports: string; underReview: string;
    resolved: string; states: string; languages: string; demoNote: string;
  };
  langSection: { title: string; subtitle: string; note: string };
  happening: { title: string; subtitle: string; viewMap: string };
  reportCta: { title: string; subtitle: string; start: string; categoriesNote: string };
  evidence: { title: string; subtitle: string };
  privacy: {
    title: string; subtitle: string; statement: string;
    cards: { t: string; d: string }[];
  };
  rights: { title: string; subtitle: string; disclaimer: string; viewAll: string };
  issuesSection: { title: string; subtitle: string; viewAll: string };
  emotion: { headline: string; text1: string; text2: string; cta: string };
  footer: {
    tagline: string; platform: string; resources: string; languages: string;
    rights: string; help: string; faq: string; privacy: string; terms: string; madeIn: string;
  };
  ai: {
    title: string; subtitle: string; placeholder: string; empty1: string; empty2: string;
    warning: string; createReport: string; copy: string; copied: string; send: string;
    thinking: string; disclaimer: string; newChat: string; suggestions: string[];
  };
  track: { title: string; subtitle: string; enterId: string; trackBtn: string };
  common: {
    search: string; searchPh: string; all: string; viewAll: string; learnMore: string;
    loading: string; retry: string; cancel: string; save: string; edit: string;
    submit: string; back: string; next: string; close: string; optional: string; required: string;
  };
  status: Record<string, string>;
  category: Record<string, string>;
}

// ─── English ──────────────────────────────────────────────────────────────────
export const en: Dict = {
  nav: {
    home: "Home", explore: "Explore", report: "Report", map: "India Map",
    issues: "Public Issues", rights: "Know Your Rights", ai: "AI Assistant",
    dashboard: "Dashboard", language: "Language", notifications: "Notifications",
    reportProblem: "Report a Problem", profile: "Profile", myReports: "My Reports",
    saved: "Saved Issues", privacy: "Privacy", logout: "Logout",
    login: "Login", register: "Sign Up",
  },
  hero: {
    badge: "For every citizen of India",
    title: "Every voice. Everywhere. One India.",
    subtitle: "See what is happening in your area. Report a problem, understand your rights, and find a path toward a solution.",
    reportBtn: "Report a Problem", exploreBtn: "Explore India",
    seeHappening: "See What's Happening",
    trust1: "Privacy First", trust2: "Multilingual", trust3: "Citizen Focused",
  },
  stats: {
    title: "India Speaks. JanAwaaz Listens.",
    subtitle: "Citizens across the country are reporting issues, tracking progress and finding solutions — together.",
    reports: "Citizen Reports", underReview: "Issues Under Review", resolved: "Issues Resolved",
    states: "States Covered", languages: "Languages Supported",
    demoNote: "DEMO DATA — NOT LIVE GOVERNMENT STATISTICS",
  },
  langSection: {
    title: "Every voice, in every language.",
    subtitle: "Every language in India matters. Use the language you feel most comfortable speaking.",
    note: "Your selected language applies across navigation, forms, reports, AI Assistant, rights information and notifications.",
  },
  happening: {
    title: "What is happening across India?",
    subtitle: "See reported issues by area, the concerns people have raised, and their current status.",
    viewMap: "Open Interactive Map",
  },
  reportCta: {
    title: "Have a problem? Report it.",
    subtitle: "Report a civic problem in your area in about two minutes. Add photo or video evidence and track its progress.",
    start: "Start Report",
    categoriesNote: "16 categories • Photo/video evidence • Progress tracking",
  },
  evidence: {
    title: "Support your report with evidence.",
    subtitle: "Add a photo, video, document, or voice note. Your evidence remains secure and private.",
  },
  privacy: {
    title: "Your privacy is your right.",
    subtitle: "Make public problems visible without exposing citizens' identities.",
    statement: "“Make public problems visible without exposing citizens' identities.”",
    cards: [
      { t: "Secure Data", d: "Your data is encrypted and stored securely." },
      { t: "Privacy Protection", d: "Personal details are never shown publicly." },
      { t: "No Public Identity", d: "Reports show issues, not your identity." },
      { t: "No Unnecessary Tracking", d: "We don't track you beyond what's needed." },
      { t: "Secure Evidence", d: "Evidence is visible only to you and authorised officers." },
    ],
  },
  rights: {
    title: "Understand your rights.",
    subtitle: "Learn what you can do, which process applies, and how to follow up on a complaint in clear language.",
    disclaimer: "This information is for general awareness and is not a substitute for professional legal advice.",
    viewAll: "View all rights",
  },
  issuesSection: {
    title: "Public Issues & Movements",
    subtitle: "Verified aur reported public issues — background, concerns, official response aur current status ke saath.",
    viewAll: "View all issues",
  },
  emotion: {
    headline: "India is more than a country. It is a shared responsibility.",
    text1: "“A student's voice, a farmer's problem, a worker's hardship, and a family's needs all deserve to be heard.”",
    text2: "“Technology matters when it makes people's lives better.”",
    cta: "Raise Your Voice Responsibly",
  },
  footer: {
    tagline: "Every voice. Everywhere. One India.",
    platform: "Platform", resources: "Resources", languages: "Languages",
    rights: "Know Your Rights", help: "Help", faq: "FAQ",
    privacy: "Privacy", terms: "Terms",
    madeIn: "Made with technology for citizens of India.",
  },
  ai: {
    title: "JanAwaaz AI",
    subtitle: "Ask a question, understand your options, and choose a path forward.",
    placeholder: "Type your question…",
    empty1: "Hello! I’m JanAwaaz AI.",
    empty2: "I can help you understand a civic problem, find information, and identify a useful next step.",
    warning: "Please do not share passwords, OTPs, Aadhaar numbers, bank details or other highly sensitive personal information in chat.",
    createReport: "Create Report", copy: "Copy", copied: "Copied", send: "Send",
    thinking: "Thinking…",
    disclaimer: "JanAwaaz AI provides civic information, not legal advice. Verify important claims.",
    newChat: "New Chat",
    suggestions: [
      "Mere area ki problem report karni hai.",
      "Meri complaint ka status samajhna hai.",
      "Road/Water/Electricity complaint kaise kare?",
      "RTI kya hota hai?",
      "Mere paas ek government notice hai, samjha do.",
      "Government scheme ke baare mein batao.",
    ],
  },
  track: {
    title: "Track your complaint.",
    subtitle: "Enter your report ID (for example, JA-10001) to view its status.",
    enterId: "Report ID", trackBtn: "Track",
  },
  common: {
    search: "Search", searchPh: "Search reports, issues, rights…", all: "All",
    viewAll: "View all", learnMore: "Learn more", loading: "Loading…",
    retry: "Retry", cancel: "Cancel", save: "Save", edit: "Edit",
    submit: "Submit", back: "Back", next: "Next", close: "Close",
    optional: "Optional", required: "Required",
  },
  status: {
    REPORTED: "Reported", AUTHORITY_IDENTIFIED: "Authority Identified",
    SUBMITTED: "Submitted", ACKNOWLEDGED: "Acknowledged",
    UNDER_REVIEW: "Under Review", ACTION_TAKEN: "Action Taken",
    RESOLVED: "Resolved", REJECTED: "Rejected",
  },
  category: {
    WATER: "Water Supply", ROADS: "Roads", ELECTRICITY: "Electricity",
    GARBAGE: "Garbage", DRAINAGE: "Drainage", EDUCATION: "Education",
    HEALTHCARE: "Healthcare", TRANSPORT: "Transport", ENVIRONMENT: "Environment",
    PUBLIC_SERVICES: "Public Services", EMPLOYMENT: "Employment",
    INFRASTRUCTURE: "Infrastructure", DOCUMENTATION: "Documentation",
    SAFETY: "Public Safety", RIGHTS: "Rights / Civic Process", OTHER: "Other",
  },
};

// ─── Hindi ────────────────────────────────────────────────────────────────────
export const hi: Dict = {
  nav: {
    home: "होम", explore: "एक्सप्लोर", report: "रिपोर्ट", map: "भारत मानचित्र",
    issues: "जन मुद्दे", rights: "अपने अधिकार जानें", ai: "AI सहायक",
    dashboard: "डैशबोर्ड", language: "भाषा", notifications: "सूचनाएं",
    reportProblem: "समस्या रिपोर्ट करें", profile: "प्रोफाइल", myReports: "मेरी रिपोर्ट्स",
    saved: "सेव किए मुद्दे", privacy: "प्राइवेसी", logout: "लॉगआउट",
    login: "लॉगिन", register: "साइन अप",
  },
  hero: {
    badge: "भारत के हर नागरिक के लिए",
    title: "हर आवाज़। हर जगह। एक इंडिया।",
    subtitle: "आपके इलाके में क्या हो रहा है? जानिए। अपनी समस्या रिपोर्ट कीजिए। अपने अधिकार समझिए। और समाधान तक पहुंचने का रास्ता देखिए।",
    reportBtn: "समस्या रिपोर्ट करें", exploreBtn: "इंडिया एक्सप्लोर करें",
    seeHappening: "देखें क्या हो रहा है",
    trust1: "प्राइवेसी फर्स्ट", trust2: "बहुभाषी", trust3: "नागरिक केंद्रित",
  },
  stats: {
    title: "इंडिया बोलता है। जनआवाज़ सुनता है।",
    subtitle: "देश भर के नागरिक मुद्दे रिपोर्ट कर रहे हैं, प्रगति ट्रैक कर रहे हैं और मिलकर समाधान खोज रहे हैं।",
    reports: "नागरिक रिपोर्ट्स", underReview: "समीक्षाधीन मुद्दे", resolved: "समाधान हुए मुद्दे",
    states: "कवर किए राज्य", languages: "समर्थित भाषाएं",
    demoNote: "डेमो डेटा — लाइव सरकारी आंकड़े नहीं",
  },
  langSection: {
    title: "अपनी भाषा में अपनी बात।",
    subtitle: "भारत की हर भाषा महत्वपूर्ण है। जनआवाज़ पर आप वही भाषा इस्तेमाल करें जिसमें आप सहज हैं।",
    note: "आपकी चुनी भाषा नेविगेशन, फॉर्म, रिपोर्ट, AI सहायक, अधिकार जानकारी और सूचनाओं — हर जगह लागू होती है।",
  },
  happening: {
    title: "भारत में क्या चल रहा है?",
    subtitle: "एक जगह से देखिए — किस इलाके में क्या मुद्दा है, लोग कौन सी चिंता उठा रहे हैं और वर्तमान स्थिति क्या है।",
    viewMap: "इंटरैक्टिव मानचित्र खोलें",
  },
  reportCta: {
    title: "समस्या है? रिपोर्ट करो।",
    subtitle: "अपने इलाके की civic समस्या 2 मिनट में रिपोर्ट करें। फोटो या वीडियो सबूत के साथ — और प्रगति ट्रैक करें।",
    start: "रिपोर्ट शुरू करें",
    categoriesNote: "16 श्रेणियां • फोटो/वीडियो सबूत • प्रगति ट्रैकिंग",
  },
  evidence: {
    title: "सिर्फ बात नहीं — सबूत भी।",
    subtitle: "फोटो, वीडियो, दस्तावेज़ या वॉइस नोट के साथ अपनी रिपोर्ट को मज़बूत बनाएं। आपका सबूत सुरक्षित और प्राइवेट रहता है।",
  },
  privacy: {
    title: "आपकी प्राइवेसी, आपका हक़।",
    subtitle: "सार्वजनिक समस्या को दिखाना है — नागरिक की निजी पहचान को नहीं।",
    statement: "“सार्वजनिक समस्या को दिखाना है — नागरिक की निजी पहचान को नहीं।”",
    cards: [
      { t: "सुरक्षित डेटा", d: "आपका डेटा एन्क्रिप्टेड और सुरक्षित रखा जाता है।" },
      { t: "प्राइवेसी सुरक्षा", d: "निजी जानकारी कभी सार्वजनिक नहीं दिखाई जाती।" },
      { t: "कोई सार्वजनिक पहचान नहीं", d: "रिपोर्ट में मुद्दा दिखता है, आपकी पहचान नहीं।" },
      { t: "बिना ज़रूरत ट्रैकिंग नहीं", d: "ज़रूरत से ज़्यादा हम आपको ट्रैक नहीं करते।" },
      { t: "सुरक्षित सबूत", d: "सबूत सिर्फ आपको और अधिकृत अधिकारियों को दिखता है।" },
    ],
  },
  rights: {
    title: "अपने अधिकार समझिए।",
    subtitle: "सरल भाषा में जानिए — आप क्या कर सकते हैं, कौन सी प्रक्रिया लागू होती है, और शिकायत का फॉलो-अप कैसे करें।",
    disclaimer: "यह जानकारी सामान्य जागरूकता के लिए है और पेशेवर कानूनी सलाह का विकल्प नहीं है।",
    viewAll: "सभी अधिकार देखें",
  },
  issuesSection: {
    title: "जन मुद्दे और आंदोलन",
    subtitle: "सत्यापित और रिपोर्ट किए गए जन मुद्दे — पृष्ठभूमि, चिंताओं, आधिकारिक जवाब और वर्तमान स्थिति के साथ।",
    viewAll: "सभी मुद्दे देखें",
  },
  emotion: {
    headline: "इंडिया सिर्फ एक देश नहीं। हम सबकी ज़िम्मेदारी है।",
    text1: "“एक छात्र की आवाज़, एक किसान की समस्या, एक मज़दूर की परेशानी, एक परिवार की ज़रूरत — हर genuine concern महत्वपूर्ण है।”",
    text2: "“टेक्नोलॉजी तभी meaningful है जब वह लोगों के काम आए।”",
    cta: "ज़िम्मेदारी से अपनी आवाज़ उठाएं",
  },
  footer: {
    tagline: "हर आवाज़। हर जगह। एक इंडिया।",
    platform: "प्लेटफॉर्म", resources: "संसाधन", languages: "भाषाएं",
    rights: "अपने अधिकार जानें", help: "मदद", faq: "सामान्य प्रश्न",
    privacy: "प्राइवेसी", terms: "नियम व शर्तें",
    madeIn: "भारत के नागरिकों के लिए टेक्नोलॉजी के साथ निर्मित।",
  },
  ai: {
    title: "जनआवाज़ AI",
    subtitle: "अपनी भाषा में पूछिए। समझिए। सही रास्ता चुनिए।",
    placeholder: "अपना सवाल लिखें… (हिंदी, English या अपनी भाषा में)",
    empty1: "नमस्ते! मैं जनआवाज़ AI हूं।",
    empty2: "आपकी समस्या समझने, जानकारी खोजने और अगला कदम समझने में मैं आपकी मदद कर सकता हूं।",
    warning: "कृपया चैट में पासवर्ड, OTP, आधार नंबर, बैंक विवरण या अन्य अत्यंत संवेदनशील निजी जानकारी साझा न करें।",
    createReport: "रिपोर्ट बनाएं", copy: "कॉपी", copied: "कॉपी हुआ", send: "भेजें",
    thinking: "सोच रहा हूं…",
    disclaimer: "जनआवाज़ AI civic जानकारी देता है — कानूनी सलाह नहीं। महत्वपूर्ण दावों की पुष्टि करें।",
    newChat: "नई चैट",
    suggestions: [
      "मेरे इलाके की समस्या रिपोर्ट करनी है।",
      "मेरी शिकायत का स्टेटस समझना है।",
      "सड़क/पानी/बिजली की शिकायत कैसे करें?",
      "RTI क्या होता है?",
      "मेरे पास एक सरकारी नोटिस है, समझा दो।",
      "सरकारी योजना के बारे में बताओ।",
    ],
  },
  track: {
    title: "आपकी शिकायत कहां तक पहुंची?",
    subtitle: "अपना रिपोर्ट ID (जैसे JA-10001) डालकर लाइव स्टेटस देखें।",
    enterId: "रिपोर्ट ID", trackBtn: "ट्रैक करें",
  },
  common: {
    search: "खोजें", searchPh: "रिपोर्ट, मुद्दे, अधिकार खोजें…", all: "सभी",
    viewAll: "सभी देखें", learnMore: "और जानें", loading: "लोड हो रहा…",
    retry: "पुनः प्रयास", cancel: "रद्द करें", save: "सेव करें", edit: "एडिट",
    submit: "सबमिट", back: "पीछे", next: "आगे", close: "बंद करें",
    optional: "वैकल्पिक", required: "आवश्यक",
  },
  status: {
    REPORTED: "रिपोर्ट किया", AUTHORITY_IDENTIFIED: "प्राधिकरण पहचाना",
    SUBMITTED: "जमा किया", ACKNOWLEDGED: "स्वीकार किया",
    UNDER_REVIEW: "समीक्षाधीन", ACTION_TAKEN: "कार्रवाई हुई",
    RESOLVED: "समाधान हुआ", REJECTED: "खारिज",
  },
  category: {
    WATER: "जल आपूर्ति", ROADS: "सड़कें", ELECTRICITY: "बिजली",
    GARBAGE: "कचरा", DRAINAGE: "जल निकासी", EDUCATION: "शिक्षा",
    HEALTHCARE: "स्वास्थ्य", TRANSPORT: "परिवहन", ENVIRONMENT: "पर्यावरण",
    PUBLIC_SERVICES: "लोक सेवाएं", EMPLOYMENT: "रोज़गार",
    INFRASTRUCTURE: "बुनियादी ढांचा", DOCUMENTATION: "दस्तावेज़ीकरण",
    SAFETY: "जन सुरक्षा", RIGHTS: "अधिकार / नागरिक प्रक्रिया", OTHER: "अन्य",
  },
};

// ─── Bengali (বাংলা) ─────────────────────────────────────────────────────────
export const bn: Dict = {
  nav: {
    home: "হোম", explore: "এক্সপ্লোর", report: "রিপোর্ট", map: "ভারত মানচিত্র",
    issues: "জনসমস্যা", rights: "অধিকার জানুন", ai: "AI সহায়ক",
    dashboard: "ড্যাশবোর্ড", language: "ভাষা", notifications: "বিজ্ঞপ্তি",
    reportProblem: "সমস্যা রিপোর্ট করুন", profile: "প্রোফাইল", myReports: "আমার রিপোর্ট",
    saved: "সংরক্ষিত বিষয়", privacy: "গোপনীয়তা", logout: "লগআউট",
    login: "লগইন", register: "সাইন আপ",
  },
  hero: {
    badge: "ভারতের প্রতিটি নাগরিকের জন্য",
    title: "হর আওয়াজ। হর জাগাহ। এক ইন্ডিয়া।",
    subtitle: "আপনার এলাকায় কী হচ্ছে? জানুন। আপনার সমস্যা রিপোর্ট করুন। আপনার অধিকার বুঝুন। আর সমাধানের পথ দেখুন।",
    reportBtn: "সমস্যা রিপোর্ট করুন", exploreBtn: "ইন্ডিয়া এক্সপ্লোর করুন",
    seeHappening: "দেখুন কী হচ্ছে",
    trust1: "গোপনীয়তা প্রথম", trust2: "বহুভাষিক", trust3: "নাগরিক কেন্দ্রিক",
  },
  stats: {
    title: "ইন্ডিয়া বলছে। জনআওয়াজ শুনছে।",
    subtitle: "দেশজুড়ে নাগরিকরা সমস্যা রিপোর্ট করছেন, অগ্রগতি ট্র্যাক করছেন এবং একসাথে সমাধান খুঁজছেন।",
    reports: "নাগরিক রিপোর্ট", underReview: "পর্যালোচনাধীন বিষয়", resolved: "সমাধান হওয়া বিষয়",
    states: "কভার করা রাজ্য", languages: "সমর্থিত ভাষা",
    demoNote: "ডেমো ডেটা — লাইভ সরকারি পরিসংখ্যান নয়",
  },
  langSection: {
    title: "আপনার ভাষায় আপনার কথা।",
    subtitle: "ভারতের প্রতিটি ভাষা গুরুত্বপূর্ণ। জনআওয়াজে আপনি সেই ভাষাই ব্যবহার করুন যাতে আপনি স্বচ্ছন্দ।",
    note: "আপনার নির্বাচিত ভাষা নেভিগেশন, ফর্ম, রিপোর্ট, AI সহায়ক, অধিকারের তথ্য ও বিজ্ঞপ্তি — সর্বত্র প্রযোজ্য।",
  },
  happening: {
    title: "ভারতে কী চলছে?",
    subtitle: "এক জায়গা থেকে দেখুন — কোন এলাকায় কী সমস্যা, মানুষ কোন উদ্বেগ তুলছেন এবং বর্তমান অবস্থা কী।",
    viewMap: "ইন্টারঅ্যাক্টিভ মানচিত্র খুলুন",
  },
  reportCta: {
    title: "সমস্যা আছে? রিপোর্ট করুন।",
    subtitle: "আপনার এলাকার civic সমস্যা ২ মিনিটে রিপোর্ট করুন। ছবি বা ভিডিও প্রমাণসহ — আর অগ্রগতি ট্র্যাক করুন।",
    start: "রিপোর্ট শুরু করুন",
    categoriesNote: "১৬টি বিভাগ • ছবি/ভিডিও প্রমাণ • অগ্রগতি ট্র্যাকিং",
  },
  evidence: {
    title: "শুধু কথা নয় — প্রমাণও।",
    subtitle: "ছবি, ভিডিও, নথি বা ভয়েস নোট দিয়ে আপনার রিপোর্ট শক্তিশালী করুন। আপনার প্রমাণ নিরাপদ ও ব্যক্তিগত থাকে।",
  },
  privacy: {
    title: "আপনার গোপনীয়তা, আপনার অধিকার।",
    subtitle: "জনসমস্যাকে দৃশ্যমান করতে হবে — নাগরিকের ব্যক্তিগত পরিচয়কে নয়।",
    statement: "“জনসমস্যাকে দৃশ্যমান করতে হবে — নাগরিকের ব্যক্তিগত পরিচয়কে নয়।”",
    cards: [
      { t: "নিরাপদ ডেটা", d: "আপনার ডেটা এনক্রিপ্ট করে নিরাপদে রাখা হয়।" },
      { t: "গোপনীয়তা সুরক্ষা", d: "ব্যক্তিগত তথ্য কখনো প্রকাশ্যে দেখানো হয় না।" },
      { t: "প্রকাশ্য পরিচয় নয়", d: "রিপোর্টে সমস্যা দেখায়, আপনার পরিচয় নয়।" },
      { t: "অপ্রয়োজনীয় ট্র্যাকিং নয়", d: "প্রয়োজনের বেশি আমরা আপনাকে ট্র্যাক করি না।" },
      { t: "নিরাপদ প্রমাণ", d: "প্রমাণ শুধু আপনি ও অনুমোদিত কর্মকর্তারা দেখতে পান।" },
    ],
  },
  rights: {
    title: "আপনার অধিকার বুঝুন।",
    subtitle: "সহজ ভাষায় জানুন — আপনি কী করতে পারেন, কোন প্রক্রিয়া প্রযোজ্য, আর অভিযোগের ফলো-আপ কীভাবে করবেন।",
    disclaimer: "এই তথ্য সাধারণ সচেতনতার জন্য, পেশাদার আইনি পরামর্শের বিকল্প নয়।",
    viewAll: "সব অধিকার দেখুন",
  },
  issuesSection: {
    title: "জনসমস্যা ও আন্দোলন",
    subtitle: "যাচাইকৃত ও রিপোর্ট করা জনসমস্যা — পটভূমি, উদ্বেগ, সরকারি জবাব ও বর্তমান অবস্থাসহ।",
    viewAll: "সব বিষয় দেখুন",
  },
  emotion: {
    headline: "ইন্ডিয়া শুধু একটি দেশ নয়। এ আমাদের সবার দায়িত্ব।",
    text1: "“এক ছাত্রের আওয়াজ, এক কৃষকের সমস্যা, এক শ্রমিকের কষ্ট, এক পরিবারের প্রয়োজন — প্রতিটি genuine উদ্বেগ গুরুত্বপূর্ণ।”",
    text2: "“প্রযুক্তি তখনই অর্থবহ যখন তা মানুষের কাজে আসে।”",
    cta: "দায়িত্বের সাথে আওয়াজ তুলুন",
  },
  footer: {
    tagline: "হর আওয়াজ। হর জাগাহ। এক ইন্ডিয়া।",
    platform: "প্ল্যাটফর্ম", resources: "রিসোর্স", languages: "ভাষা",
    rights: "অধিকার জানুন", help: "সাহায্য", faq: "সাধারণ প্রশ্ন",
    privacy: "গোপনীয়তা", terms: "শর্তাবলী",
    madeIn: "ভারতের নাগরিকদের জন্য প্রযুক্তি দিয়ে তৈরি।",
  },
  ai: {
    title: "জনআওয়াজ AI",
    subtitle: "আপনার ভাষায় জিজ্ঞাসা করুন। বুঝুন। সঠিক পথ বেছে নিন।",
    placeholder: "আপনার প্রশ্ন লিখুন… (বাংলা, হিন্দি বা ইংরেজিতে)",
    empty1: "নমস্কার! আমি জনআওয়াজ AI।",
    empty2: "আপনার সমস্যা বুঝতে, তথ্য খুঁজতে ও পরবর্তী পদক্ষেপ বুঝতে আমি সাহায্য করতে পারি।",
    warning: "চ্যাটে পাসওয়ার্ড, OTP, আধার নম্বর, ব্যাঙ্কের তথ্য বা অন্য অত্যন্ত সংবেদনশীল ব্যক্তিগত তথ্য শেয়ার করবেন না।",
    createReport: "রিপোর্ট তৈরি করুন", copy: "কপি", copied: "কপি হয়েছে", send: "পাঠান",
    thinking: "ভাবছি…",
    disclaimer: "জনআওয়াজ AI civic তথ্য দেয় — আইনি পরামর্শ নয়। গুরুত্বপূর্ণ দাবি যাচাই করুন।",
    newChat: "নতুন চ্যাট",
    suggestions: [
      "আমার এলাকার সমস্যা রিপোর্ট করতে চাই।",
      "আমার অভিযোগের স্ট্যাটাস বুঝতে চাই।",
      "রাস্তা/পানি/বিদ্যুতের অভিযোগ কীভাবে করব?",
      "RTI কী?",
      "আমার কাছে একটি সরকারি নোটিশ আছে, বুঝিয়ে দিন।",
      "সরকারি প্রকল্প সম্পর্কে বলুন।",
    ],
  },
  track: {
    title: "আপনার অভিযোগ কোথায় পৌঁছেছে?",
    subtitle: "আপনার রিপোর্ট ID (যেমন JA-10001) দিয়ে লাইভ স্ট্যাটাস দেখুন।",
    enterId: "রিপোর্ট ID", trackBtn: "ট্র্যাক করুন",
  },
  common: {
    search: "খুঁজুন", searchPh: "রিপোর্ট, বিষয়, অধিকার খুঁজুন…", all: "সব",
    viewAll: "সব দেখুন", learnMore: "আরও জানুন", loading: "লোড হচ্ছে…",
    retry: "আবার চেষ্টা", cancel: "বাতিল", save: "সংরক্ষণ", edit: "সম্পাদনা",
    submit: "জমা দিন", back: "পেছনে", next: "পরবর্তী", close: "বন্ধ করুন",
    optional: "ঐচ্ছিক", required: "আবশ্যক",
  },
  status: {
    REPORTED: "রিপোর্ট করা", AUTHORITY_IDENTIFIED: "কর্তৃপক্ষ চিহ্নিত",
    SUBMITTED: "জমা দেওয়া", ACKNOWLEDGED: "গৃহীত",
    UNDER_REVIEW: "পর্যালোচনাধীন", ACTION_TAKEN: "পদক্ষেপ নেওয়া",
    RESOLVED: "সমাধান", REJECTED: "খারিজ",
  },
  category: {
    WATER: "পানি সরবরাহ", ROADS: "রাস্তা", ELECTRICITY: "বিদ্যুৎ",
    GARBAGE: "আবর্জনা", DRAINAGE: "নিকাশি", EDUCATION: "শিক্ষা",
    HEALTHCARE: "স্বাস্থ্য", TRANSPORT: "পরিবহন", ENVIRONMENT: "পরিবেশ",
    PUBLIC_SERVICES: "জনসেবা", EMPLOYMENT: "কর্মসংস্থান",
    INFRASTRUCTURE: "অবকাঠামো", DOCUMENTATION: "নথিপত্র",
    SAFETY: "জননিরাপত্তা", RIGHTS: "অধিকার / নাগরিক প্রক্রিয়া", OTHER: "অন্যান্য",
  },
};

// ─── Telugu (తెలుగు) ─────────────────────────────────────────────────────────
export const te: Dict = {
  nav: {
    home: "హోమ్", explore: "అన్వేషించండి", report: "రిపోర్ట్", map: "భారత మ్యాప్",
    issues: "ప్రజా సమస్యలు", rights: "హక్కులు తెలుసుకోండి", ai: "AI సహాయకుడు",
    dashboard: "డాష్‌బోర్డ్", language: "భాష", notifications: "నోటిఫికేషన్లు",
    reportProblem: "సమస్యను రిపోర్ట్ చేయండి", profile: "ప్రొఫైల్", myReports: "నా రిపోర్టులు",
    saved: "సేవ్ చేసిన అంశాలు", privacy: "గోప్యత", logout: "లాగ్అవుట్",
    login: "లాగిన్", register: "సైన్ అప్",
  },
  hero: {
    badge: "భారతదేశ ప్రతి పౌరుడి కోసం",
    title: "హర్ ఆవాజ్. హర్ జగహ్. ఏక్ ఇండియా.",
    subtitle: "మీ ప్రాంతంలో ఏం జరుగుతోంది? తెలుసుకోండి. మీ సమస్యను రిపోర్ట్ చేయండి. మీ హక్కులను అర్థం చేసుకోండి. పరిష్కారానికి దారి చూడండి.",
    reportBtn: "సమస్యను రిపోర్ట్ చేయండి", exploreBtn: "ఇండియాను అన్వేషించండి",
    seeHappening: "ఏం జరుగుతోందో చూడండి",
    trust1: "గోప్యతే ముందు", trust2: "బహుభాషా", trust3: "పౌర కేంద్రిత",
  },
  stats: {
    title: "ఇండియా మాట్లాడుతోంది. జనఆవాజ్ వింటోంది.",
    subtitle: "దేశవ్యాప్తంగా పౌరులు సమస్యలను రిపోర్ట్ చేస్తున్నారు, పురోగతిని ట్రాక్ చేస్తున్నారు, కలిసి పరిష్కారాలు కనుగొంటున్నారు.",
    reports: "పౌర రిపోర్టులు", underReview: "సమీక్షలోని అంశాలు", resolved: "పరిష్కారమైన అంశాలు",
    states: "కవర్ చేసిన రాష్ట్రాలు", languages: "మద్దతు ఉన్న భాషలు",
    demoNote: "డెమో డేటా — ప్రత్యక్ష ప్రభుత్వ గణాంకాలు కావు",
  },
  langSection: {
    title: "మీ భాషలో మీ మాట.",
    subtitle: "భారతదేశంలోని ప్రతి భాష ముఖ్యమైనదే. జనఆవాజ్‌లో మీకు సౌకర్యమైన భాషనే వాడండి.",
    note: "మీరు ఎంచుకున్న భాష నావిగేషన్, ఫారమ్‌లు, రిపోర్టులు, AI సహాయకుడు, హక్కుల సమాచారం, నోటిఫికేషన్లలో వర్తిస్తుంది.",
  },
  happening: {
    title: "భారతదేశంలో ఏం జరుగుతోంది?",
    subtitle: "ఒకే చోట చూడండి — ఏ ప్రాంతంలో ఏ సమస్య ఉంది, ప్రజలు ఏ ఆందోళన వ్యక్తం చేస్తున్నారు, ప్రస్తుత స్థితి ఏమిటి.",
    viewMap: "ఇంటరాక్టివ్ మ్యాప్ తెరవండి",
  },
  reportCta: {
    title: "సమస్య ఉందా? రిపోర్ట్ చేయండి.",
    subtitle: "మీ ప్రాంత civic సమస్యను 2 నిమిషాల్లో రిపోర్ట్ చేయండి. ఫోటో లేదా వీడియో ఆధారాలతో — పురోగతిని ట్రాక్ చేయండి.",
    start: "రిపోర్ట్ ప్రారంభించండి",
    categoriesNote: "16 విభాగాలు • ఫోటో/వీడియో ఆధారాలు • పురోగతి ట్రాకింగ్",
  },
  evidence: {
    title: "మాటలు మాత్రమే కాదు — ఆధారాలు కూడా.",
    subtitle: "ఫోటో, వీడియో, పత్రం లేదా వాయిస్ నోట్‌తో మీ రిపోర్టును బలపరచండి. మీ ఆధారాలు సురక్షితంగా, ప్రైవేట్‌గా ఉంటాయి.",
  },
  privacy: {
    title: "మీ గోప్యత, మీ హక్కు.",
    subtitle: "ప్రజా సమస్యను కనిపించేలా చేయాలి — పౌరుడి వ్యక్తిగత గుర్తింపును కాదు.",
    statement: "“ప్రజా సమస్యను కనిపించేలా చేయాలి — పౌరుడి వ్యక్తిగత గుర్తింపును కాదు.”",
    cards: [
      { t: "సురక్షిత డేటా", d: "మీ డేటా ఎన్‌క్రిప్ట్ చేసి సురక్షితంగా నిల్వ చేయబడుతుంది." },
      { t: "గోప్యతా రక్షణ", d: "వ్యక్తిగత వివరాలు ఎప్పుడూ బహిరంగంగా చూపబడవు." },
      { t: "బహిరంగ గుర్తింపు లేదు", d: "రిపోర్టుల్లో సమస్య కనిపిస్తుంది, మీ గుర్తింపు కాదు." },
      { t: "అనవసర ట్రాకింగ్ లేదు", d: "అవసరానికి మించి మిమ్మల్ని ట్రాక్ చేయము." },
      { t: "సురక్షిత ఆధారాలు", d: "ఆధారాలు మీకు, అధీకృత అధికారులకు మాత్రమే కనిపిస్తాయి." },
    ],
  },
  rights: {
    title: "మీ హక్కులు తెలుసుకోండి.",
    subtitle: "సరళ భాషలో తెలుసుకోండి — మీరు ఏమి చేయవచ్చు, ఏ ప్రక్రియ వర్తిస్తుంది, ఫిర్యాదును ఎలా ఫాలో-అప్ చేయాలి.",
    disclaimer: "ఈ సమాచారం సాధారణ అవగాహన కోసం; వృత్తిపరమైన న్యాయ సలహాకు ప్రత్యామ్నాయం కాదు.",
    viewAll: "అన్ని హక్కులు చూడండి",
  },
  issuesSection: {
    title: "ప్రజా సమస్యలు & ఉద్యమాలు",
    subtitle: "ధృవీకరించిన, రిపోర్ట్ చేయబడిన ప్రజా సమస్యలు — నేపథ్యం, ఆందోళనలు, అధికారిక స్పందన, ప్రస్తుత స్థితితో.",
    viewAll: "అన్ని అంశాలు చూడండి",
  },
  emotion: {
    headline: "ఇండియా ఒక దేశం మాత్రమే కాదు. మనందరి బాధ్యత.",
    text1: "“ఒక విద్యార్థి గొంతు, ఒక రైతు సమస్య, ఒక కార్మికుడి కష్టం, ఒక కుటుంబ అవసరం — ప్రతి genuine ఆందోళన ముఖ్యమైనదే.”",
    text2: "“సాంకేతికత ప్రజలకు ఉపయోగపడినప్పుడే అర్థవంతం.”",
    cta: "బాధ్యతగా మీ గొంతు వినిపించండి",
  },
  footer: {
    tagline: "హర్ ఆవాజ్. హర్ జగహ్. ఏక్ ఇండియా.",
    platform: "ప్లాట్‌ఫారమ్", resources: "వనరులు", languages: "భాషలు",
    rights: "హక్కులు తెలుసుకోండి", help: "సహాయం", faq: "తరచూ అడిగే ప్రశ్నలు",
    privacy: "గోప్యత", terms: "నిబంధనలు",
    madeIn: "భారత పౌరుల కోసం సాంకేతికతతో రూపొందించబడింది.",
  },
  ai: {
    title: "జనఆవాజ్ AI",
    subtitle: "మీ భాషలో అడగండి. అర్థం చేసుకోండి. సరైన దారి ఎంచుకోండి.",
    placeholder: "మీ ప్రశ్న రాయండి… (తెలుగు, హిందీ లేదా ఇంగ్లీషులో)",
    empty1: "నమస్తే! నేను జనఆవాజ్ AI ని.",
    empty2: "మీ సమస్యను అర్థం చేసుకోవడంలో, సమాచారం వెతకడంలో, తదుపరి అడుగు తెలుసుకోవడంలో నేను సహాయపడగలను.",
    warning: "దయచేసి చాట్‌లో పాస్‌వర్డ్‌లు, OTPలు, ఆధార్ నంబర్లు, బ్యాంక్ వివరాలు లేదా ఇతర అత్యంత సున్నితమైన వ్యక్తిగత సమాచారాన్ని పంచుకోవద్దు.",
    createReport: "రిపోర్ట్ సృష్టించండి", copy: "కాపీ", copied: "కాపీ అయింది", send: "పంపండి",
    thinking: "ఆలోచిస్తున్నాను…",
    disclaimer: "జనఆవాజ్ AI civic సమాచారం ఇస్తుంది — న్యాయ సలహా కాదు. ముఖ్యమైన విషయాలను ధృవీకరించండి.",
    newChat: "కొత్త చాట్",
    suggestions: [
      "మా ప్రాంత సమస్యను రిపోర్ట్ చేయాలి.",
      "నా ఫిర్యాదు స్థితి తెలుసుకోవాలి.",
      "రోడ్డు/నీరు/విద్యుత్ ఫిర్యాదు ఎలా చేయాలి?",
      "RTI అంటే ఏమిటి?",
      "నా దగ్గర ప్రభుత్వ నోటీసు ఉంది, వివరించండి.",
      "ప్రభుత్వ పథకం గురించి చెప్పండి.",
    ],
  },
  track: {
    title: "మీ ఫిర్యాదు ఎంతవరకు వచ్చింది?",
    subtitle: "మీ రిపోర్ట్ ID (ఉదా. JA-10001) ఇచ్చి లైవ్ స్థితి చూడండి.",
    enterId: "రిపోర్ట్ ID", trackBtn: "ట్రాక్ చేయండి",
  },
  common: {
    search: "వెతకండి", searchPh: "రిపోర్టులు, అంశాలు, హక్కులు వెతకండి…", all: "అన్నీ",
    viewAll: "అన్నీ చూడండి", learnMore: "మరింత తెలుసుకోండి", loading: "లోడ్ అవుతోంది…",
    retry: "మళ్లీ ప్రయత్నించండి", cancel: "రద్దు", save: "సేవ్", edit: "సవరించు",
    submit: "సమర్పించు", back: "వెనుకకు", next: "తర్వాత", close: "మూసివేయి",
    optional: "ఐచ్ఛికం", required: "తప్పనిసరి",
  },
  status: {
    REPORTED: "రిపోర్ట్ చేయబడింది", AUTHORITY_IDENTIFIED: "అధికారం గుర్తించబడింది",
    SUBMITTED: "సమర్పించబడింది", ACKNOWLEDGED: "స్వీకరించబడింది",
    UNDER_REVIEW: "సమీక్షలో ఉంది", ACTION_TAKEN: "చర్య తీసుకోబడింది",
    RESOLVED: "పరిష్కరించబడింది", REJECTED: "తిరస్కరించబడింది",
  },
  category: {
    WATER: "నీటి సరఫరా", ROADS: "రోడ్లు", ELECTRICITY: "విద్యుత్",
    GARBAGE: "చెత్త", DRAINAGE: "డ్రైనేజీ", EDUCATION: "విద్య",
    HEALTHCARE: "ఆరోగ్యం", TRANSPORT: "రవాణా", ENVIRONMENT: "పర్యావరణం",
    PUBLIC_SERVICES: "ప్రజా సేవలు", EMPLOYMENT: "ఉపాధి",
    INFRASTRUCTURE: "మౌలిక సదుపాయాలు", DOCUMENTATION: "పత్రాలు",
    SAFETY: "ప్రజా భద్రత", RIGHTS: "హక్కులు / పౌర ప్రక్రియ", OTHER: "ఇతర",
  },
};

// ─── Marathi (मराठी) ─────────────────────────────────────────────────────────
export const mr: Dict = {
  nav: {
    home: "होम", explore: "एक्सप्लोर", report: "रिपोर्ट", map: "भारत नकाशा",
    issues: "जनमुद्दे", rights: "हक्क जाणून घ्या", ai: "AI सहाय्यक",
    dashboard: "डॅशबोर्ड", language: "भाषा", notifications: "सूचना",
    reportProblem: "समस्या रिपोर्ट करा", profile: "प्रोफाइल", myReports: "माझे रिपोर्ट्स",
    saved: "सेव्ह केलेले मुद्दे", privacy: "प्रायव्हसी", logout: "लॉगआउट",
    login: "लॉगिन", register: "साइन अप",
  },
  hero: {
    badge: "भारताच्या प्रत्येक नागरिकासाठी",
    title: "हर आवाज। हर जगह। एक इंडिया।",
    subtitle: "तुमच्या भागात काय चाललंय? जाणून घ्या. तुमची समस्या रिपोर्ट करा. तुमचे हक्क समजून घ्या. आणि समाधानाचा मार्ग पाहा.",
    reportBtn: "समस्या रिपोर्ट करा", exploreBtn: "इंडिया एक्सप्लोर करा",
    seeHappening: "काय चाललंय ते पाहा",
    trust1: "प्रायव्हसी प्रथम", trust2: "बहुभाषिक", trust3: "नागरिक केंद्रीत",
  },
  stats: {
    title: "इंडिया बोलतंय. जनआवाज ऐकतंय.",
    subtitle: "देशभरातील नागरिक समस्या रिपोर्ट करत आहेत, प्रगती ट्रॅक करत आहेत आणि एकत्र समाधान शोधत आहेत.",
    reports: "नागरिक रिपोर्ट्स", underReview: "समीक्षाधीन मुद्दे", resolved: "सोडवलेले मुद्दे",
    states: "समाविष्ट राज्ये", languages: "समर्थित भाषा",
    demoNote: "डेमो डेटा — थेट सरकारी आकडेवारी नाही",
  },
  langSection: {
    title: "आपल्या भाषेत आपलं म्हणणं.",
    subtitle: "भारताची प्रत्येक भाषा महत्त्वाची आहे. जनआवाजवर तुम्हाला सोयीस्कर असलेलीच भाषा वापरा.",
    note: "तुमची निवडलेली भाषा नेव्हिगेशन, फॉर्म, रिपोर्ट्स, AI सहाय्यक, हक्क माहिती आणि सूचनांमध्ये लागू होते.",
  },
  happening: {
    title: "भारतात काय चाललंय?",
    subtitle: "एकाच ठिकाणाहून पाहा — कोणत्या भागात कोणता मुद्दा आहे, लोक कोणती चिंता मांडत आहेत आणि सद्यस्थिती काय आहे.",
    viewMap: "इंटरॅक्टिव्ह नकाशा उघडा",
  },
  reportCta: {
    title: "समस्या आहे? रिपोर्ट करा.",
    subtitle: "तुमच्या भागातील civic समस्या 2 मिनिटांत रिपोर्ट करा. फोटो किंवा व्हिडिओ पुराव्यासह — आणि प्रगती ट्रॅक करा.",
    start: "रिपोर्ट सुरू करा",
    categoriesNote: "16 श्रेणी • फोटो/व्हिडिओ पुरावे • प्रगती ट्रॅकिंग",
  },
  evidence: {
    title: "फक्त बोलणं नाही — पुरावाही.",
    subtitle: "फोटो, व्हिडिओ, कागदपत्र किंवा व्हॉइस नोटसह तुमचा रिपोर्ट भक्कम करा. तुमचा पुरावा सुरक्षित आणि खाजगी राहतो.",
  },
  privacy: {
    title: "तुमची प्रायव्हसी, तुमचा हक्क.",
    subtitle: "सार्वजनिक समस्या दिसली पाहिजे — नागरिकाची वैयक्तिक ओळख नाही.",
    statement: "“सार्वजनिक समस्या दिसली पाहिजे — नागरिकाची वैयक्तिक ओळख नाही.”",
    cards: [
      { t: "सुरक्षित डेटा", d: "तुमचा डेटा एन्क्रिप्ट करून सुरक्षित ठेवला जातो." },
      { t: "प्रायव्हसी संरक्षण", d: "वैयक्तिक माहिती कधीही सार्वजनिक दाखवली जात नाही." },
      { t: "सार्वजनिक ओळख नाही", d: "रिपोर्टमध्ये मुद्दा दिसतो, तुमची ओळख नाही." },
      { t: "विनाकारण ट्रॅकिंग नाही", d: "गरजेपेक्षा जास्त आम्ही तुम्हाला ट्रॅक करत नाही." },
      { t: "सुरक्षित पुरावे", d: "पुरावे फक्त तुम्हाला आणि अधिकृत अधिकाऱ्यांना दिसतात." },
    ],
  },
  rights: {
    title: "तुमचे हक्क समजून घ्या.",
    subtitle: "सोप्या भाषेत जाणून घ्या — तुम्ही काय करू शकता, कोणती प्रक्रिया लागू होते आणि तक्रारीचा फॉलो-अप कसा करावा.",
    disclaimer: "ही माहिती सर्वसाधारण जागरूकतेसाठी आहे; व्यावसायिक कायदेशीर सल्ल्याचा पर्याय नाही.",
    viewAll: "सर्व हक्क पाहा",
  },
  issuesSection: {
    title: "जनमुद्दे आणि चळवळी",
    subtitle: "पडताळलेले आणि रिपोर्ट केलेले जनमुद्दे — पार्श्वभूमी, चिंता, अधिकृत प्रतिसाद आणि सद्यस्थितीसह.",
    viewAll: "सर्व मुद्दे पाहा",
  },
  emotion: {
    headline: "इंडिया फक्त एक देश नाही. ही आपल्या सगळ्यांची जबाबदारी आहे.",
    text1: "“एका विद्यार्थ्याचा आवाज, एका शेतकऱ्याची समस्या, एका कामगाराचं दुःख, एका कुटुंबाची गरज — प्रत्येक genuine चिंता महत्त्वाची आहे.”",
    text2: "“तंत्रज्ञान तेव्हाच अर्थपूर्ण जेव्हा ते लोकांच्या कामी येतं.”",
    cta: "जबाबदारीने आवाज उठवा",
  },
  footer: {
    tagline: "हर आवाज। हर जगह। एक इंडिया।",
    platform: "प्लॅटफॉर्म", resources: "संसाधने", languages: "भाषा",
    rights: "हक्क जाणून घ्या", help: "मदत", faq: "सामान्य प्रश्न",
    privacy: "प्रायव्हसी", terms: "अटी",
    madeIn: "भारताच्या नागरिकांसाठी तंत्रज्ञानाने तयार केले.",
  },
  ai: {
    title: "जनआवाज AI",
    subtitle: "आपल्या भाषेत विचारा. समजून घ्या. योग्य मार्ग निवडा.",
    placeholder: "तुमचा प्रश्न लिहा… (मराठी, हिंदी किंवा इंग्रजीत)",
    empty1: "नमस्ते! मी जनआवाज AI आहे.",
    empty2: "तुमची समस्या समजून घेण्यात, माहिती शोधण्यात आणि पुढचं पाऊल समजण्यात मी मदत करू शकतो.",
    warning: "कृपया चॅटमध्ये पासवर्ड, OTP, आधार क्रमांक, बँक तपशील किंवा इतर अत्यंत संवेदनशील वैयक्तिक माहिती शेअर करू नका.",
    createReport: "रिपोर्ट तयार करा", copy: "कॉपी", copied: "कॉपी झालं", send: "पाठवा",
    thinking: "विचार करतोय…",
    disclaimer: "जनआवाज AI civic माहिती देतो — कायदेशीर सल्ला नाही. महत्त्वाचे दावे पडताळून घ्या.",
    newChat: "नवीन चॅट",
    suggestions: [
      "माझ्या भागातील समस्या रिपोर्ट करायची आहे.",
      "माझ्या तक्रारीची स्थिती समजून घ्यायची आहे.",
      "रस्ता/पाणी/वीज तक्रार कशी करावी?",
      "RTI म्हणजे काय?",
      "माझ्याकडे एक सरकारी नोटीस आहे, समजावून सांगा.",
      "सरकारी योजनेबद्दल सांगा.",
    ],
  },
  track: {
    title: "तुमची तक्रार कुठपर्यंत पोहोचली?",
    subtitle: "तुमचा रिपोर्ट ID (उदा. JA-10001) टाकून थेट स्थिती पाहा.",
    enterId: "रिपोर्ट ID", trackBtn: "ट्रॅक करा",
  },
  common: {
    search: "शोधा", searchPh: "रिपोर्ट्स, मुद्दे, हक्क शोधा…", all: "सर्व",
    viewAll: "सर्व पाहा", learnMore: "अधिक जाणून घ्या", loading: "लोड होत आहे…",
    retry: "पुन्हा प्रयत्न", cancel: "रद्द करा", save: "सेव्ह करा", edit: "एडिट",
    submit: "सबमिट", back: "मागे", next: "पुढे", close: "बंद करा",
    optional: "ऐच्छिक", required: "आवश्यक",
  },
  status: {
    REPORTED: "रिपोर्ट केलं", AUTHORITY_IDENTIFIED: "प्राधिकरण ओळखलं",
    SUBMITTED: "सादर केलं", ACKNOWLEDGED: "स्वीकारलं",
    UNDER_REVIEW: "समीक्षाधीन", ACTION_TAKEN: "कारवाई झाली",
    RESOLVED: "निराकरण", REJECTED: "फेटाळलं",
  },
  category: {
    WATER: "पाणीपुरवठा", ROADS: "रस्ते", ELECTRICITY: "वीज",
    GARBAGE: "कचरा", DRAINAGE: "गटार", EDUCATION: "शिक्षण",
    HEALTHCARE: "आरोग्य", TRANSPORT: "वाहतूक", ENVIRONMENT: "पर्यावरण",
    PUBLIC_SERVICES: "लोकसेवा", EMPLOYMENT: "रोजगार",
    INFRASTRUCTURE: "पायाभूत सुविधा", DOCUMENTATION: "कागदपत्रे",
    SAFETY: "जनसुरक्षा", RIGHTS: "हक्क / नागरिक प्रक्रिया", OTHER: "इतर",
  },
};

// ─── Tamil (தமிழ்) ───────────────────────────────────────────────────────────
export const ta: Dict = {
  nav: {
    home: "முகப்பு", explore: "ஆராயுங்கள்", report: "புகார்", map: "இந்திய வரைபடம்",
    issues: "பொது பிரச்சினைகள்", rights: "உரிமைகளை அறியுங்கள்", ai: "AI உதவியாளர்",
    dashboard: "டாஷ்போர்டு", language: "மொழி", notifications: "அறிவிப்புகள்",
    reportProblem: "பிரச்சினையை புகாரளிக்கவும்", profile: "சுயவிவரம்", myReports: "என் புகார்கள்",
    saved: "சேமித்தவை", privacy: "தனியுரிமை", logout: "வெளியேறு",
    login: "உள்நுழை", register: "பதிவு செய்க",
  },
  hero: {
    badge: "இந்தியாவின் ஒவ்வொரு குடிமகனுக்காகவும்",
    title: "ஹர் ஆவாஜ். ஹர் ஜகஹ். ஏக் இந்தியா.",
    subtitle: "உங்கள் பகுதியில் என்ன நடக்கிறது? தெரிந்துகொள்ளுங்கள். உங்கள் பிரச்சினையை புகாரளியுங்கள். உங்கள் உரிமைகளை புரிந்துகொள்ளுங்கள். தீர்வுக்கான வழியை பாருங்கள்.",
    reportBtn: "பிரச்சினையை புகாரளிக்கவும்", exploreBtn: "இந்தியாவை ஆராயுங்கள்",
    seeHappening: "என்ன நடக்கிறது பாருங்கள்",
    trust1: "தனியுரிமை முதலில்", trust2: "பன்மொழி", trust3: "குடிமகன் மையம்",
  },
  stats: {
    title: "இந்தியா பேசுகிறது. ஜன்ஆவாஜ் கேட்கிறது.",
    subtitle: "நாடு முழுவதும் குடிமக்கள் பிரச்சினைகளை புகாரளித்து, முன்னேற்றத்தை கண்காணித்து, ஒன்றாக தீர்வு காண்கிறார்கள்.",
    reports: "குடிமக்கள் புகார்கள்", underReview: "மதிப்பாய்வில் உள்ளவை", resolved: "தீர்க்கப்பட்டவை",
    states: "உள்ளடக்கிய மாநிலங்கள்", languages: "ஆதரிக்கப்படும் மொழிகள்",
    demoNote: "டெமோ தரவு — நேரடி அரசு புள்ளிவிவரம் அல்ல",
  },
  langSection: {
    title: "உங்கள் மொழியில் உங்கள் குரல்.",
    subtitle: "இந்தியாவின் ஒவ்வொரு மொழியும் முக்கியம். ஜன்ஆவாஜில் உங்களுக்கு வசதியான மொழியையே பயன்படுத்துங்கள்.",
    note: "நீங்கள் தேர்ந்த மொழி வழிசெலுத்தல், படிவங்கள், புகார்கள், AI உதவியாளர், உரிமை தகவல், அறிவிப்புகள் அனைத்திலும் பொருந்தும்.",
  },
  happening: {
    title: "இந்தியாவில் என்ன நடக்கிறது?",
    subtitle: "ஒரே இடத்தில் பாருங்கள் — எந்த பகுதியில் என்ன பிரச்சினை, மக்கள் என்ன கவலை எழுப்புகிறார்கள், தற்போதைய நிலை என்ன.",
    viewMap: "ஊடாடும் வரைபடத்தை திறக்கவும்",
  },
  reportCta: {
    title: "பிரச்சினை இருக்கிறதா? புகாரளியுங்கள்.",
    subtitle: "உங்கள் பகுதி civic பிரச்சினையை 2 நிமிடங்களில் புகாரளியுங்கள். புகைப்படம்/வீடியோ ஆதாரத்துடன் — முன்னேற்றத்தை கண்காணியுங்கள்.",
    start: "புகாரை தொடங்குங்கள்",
    categoriesNote: "16 பிரிவுகள் • புகைப்படம்/வீடியோ ஆதாரம் • முன்னேற்ற கண்காணிப்பு",
  },
  evidence: {
    title: "வெறும் பேச்சு மட்டுமல்ல — ஆதாரமும்.",
    subtitle: "புகைப்படம், வீடியோ, ஆவணம் அல்லது குரல் குறிப்புடன் உங்கள் புகாரை வலுப்படுத்துங்கள். உங்கள் ஆதாரம் பாதுகாப்பாக, தனிப்பட்டதாக இருக்கும்.",
  },
  privacy: {
    title: "உங்கள் தனியுரிமை, உங்கள் உரிமை.",
    subtitle: "பொது பிரச்சினை தெரிய வேண்டும் — குடிமகனின் தனிப்பட்ட அடையாளம் அல்ல.",
    statement: "“பொது பிரச்சினை தெரிய வேண்டும் — குடிமகனின் தனிப்பட்ட அடையாளம் அல்ல.”",
    cards: [
      { t: "பாதுகாப்பான தரவு", d: "உங்கள் தரவு குறியாக்கம் செய்து பாதுகாப்பாக சேமிக்கப்படுகிறது." },
      { t: "தனியுரிமை பாதுகாப்பு", d: "தனிப்பட்ட விவரங்கள் ஒருபோதும் பொதுவில் காட்டப்படாது." },
      { t: "பொது அடையாளம் இல்லை", d: "புகார்களில் பிரச்சினை தெரியும், உங்கள் அடையாளம் அல்ல." },
      { t: "தேவையற்ற கண்காணிப்பு இல்லை", d: "தேவைக்கு மேல் உங்களை கண்காணிக்க மாட்டோம்." },
      { t: "பாதுகாப்பான ஆதாரம்", d: "ஆதாரம் உங்களுக்கும் அங்கீகரிக்கப்பட்ட அதிகாரிகளுக்கும் மட்டுமே தெரியும்." },
    ],
  },
  rights: {
    title: "உங்கள் உரிமைகளை புரிந்துகொள்ளுங்கள்.",
    subtitle: "எளிய மொழியில் தெரிந்துகொள்ளுங்கள் — நீங்கள் என்ன செய்யலாம், எந்த நடைமுறை பொருந்தும், புகாரை எப்படி தொடர்வது.",
    disclaimer: "இந்த தகவல் பொது விழிப்புணர்வுக்காக; தொழில்முறை சட்ட ஆலோசனைக்கு மாற்று அல்ல.",
    viewAll: "அனைத்து உரிமைகளையும் பார்க்கவும்",
  },
  issuesSection: {
    title: "பொது பிரச்சினைகள் & இயக்கங்கள்",
    subtitle: "சரிபார்க்கப்பட்ட, புகாரளிக்கப்பட்ட பொது பிரச்சினைகள் — பின்னணி, கவலைகள், அதிகாரப்பூர்வ பதில், தற்போதைய நிலையுடன்.",
    viewAll: "அனைத்தையும் பார்க்கவும்",
  },
  emotion: {
    headline: "இந்தியா ஒரு நாடு மட்டுமல்ல. நம் அனைவரின் பொறுப்பு.",
    text1: "“ஒரு மாணவரின் குரல், ஒரு விவசாயியின் பிரச்சினை, ஒரு தொழிலாளியின் துயரம், ஒரு குடும்பத்தின் தேவை — ஒவ்வொரு genuine கவலையும் முக்கியம்.”",
    text2: "“தொழில்நுட்பம் மக்களுக்கு பயன்படும்போதுதான் அர்த்தமுள்ளது.”",
    cta: "பொறுப்புடன் குரல் கொடுங்கள்",
  },
  footer: {
    tagline: "ஹர் ஆவாஜ். ஹர் ஜகஹ். ஏக் இந்தியா.",
    platform: "தளம்", resources: "வளங்கள்", languages: "மொழிகள்",
    rights: "உரிமைகளை அறியுங்கள்", help: "உதவி", faq: "அடிக்கடி கேள்விகள்",
    privacy: "தனியுரிமை", terms: "விதிமுறைகள்",
    madeIn: "இந்திய குடிமக்களுக்காக தொழில்நுட்பத்துடன் உருவாக்கப்பட்டது.",
  },
  ai: {
    title: "ஜன்ஆவாஜ் AI",
    subtitle: "உங்கள் மொழியில் கேளுங்கள். புரிந்துகொள்ளுங்கள். சரியான வழியை தேர்வு செய்யுங்கள்.",
    placeholder: "உங்கள் கேள்வியை எழுதுங்கள்… (தமிழ், இந்தி அல்லது ஆங்கிலத்தில்)",
    empty1: "வணக்கம்! நான் ஜன்ஆவாஜ் AI.",
    empty2: "உங்கள் பிரச்சினையை புரிந்துகொள்ள, தகவல் தேட, அடுத்த படியை அறிய நான் உதவ முடியும்.",
    warning: "அரட்டையில் கடவுச்சொற்கள், OTPகள், ஆதார் எண்கள், வங்கி விவரங்கள் அல்லது மிக முக்கிய தனிப்பட்ட தகவல்களை பகிர வேண்டாம்.",
    createReport: "புகார் உருவாக்கு", copy: "நகல்", copied: "நகலெடுக்கப்பட்டது", send: "அனுப்பு",
    thinking: "யோசிக்கிறேன்…",
    disclaimer: "ஜன்ஆவாஜ் AI civic தகவல் தருகிறது — சட்ட ஆலோசனை அல்ல. முக்கிய கூற்றுகளை சரிபார்க்கவும்.",
    newChat: "புதிய அரட்டை",
    suggestions: [
      "என் பகுதி பிரச்சினையை புகாரளிக்க வேண்டும்.",
      "என் புகாரின் நிலையை தெரிந்துகொள்ள வேண்டும்.",
      "சாலை/தண்ணீர்/மின்சார புகார் எப்படி செய்வது?",
      "RTI என்றால் என்ன?",
      "என்னிடம் அரசு அறிவிப்பு உள்ளது, விளக்குங்கள்.",
      "அரசு திட்டம் பற்றி சொல்லுங்கள்.",
    ],
  },
  track: {
    title: "உங்கள் புகார் எங்கே சென்றது?",
    subtitle: "உங்கள் புகார் ID (எ.கா. JA-10001) கொடுத்து நேரடி நிலையை பாருங்கள்.",
    enterId: "புகார் ID", trackBtn: "கண்காணிக்கவும்",
  },
  common: {
    search: "தேடுக", searchPh: "புகார்கள், பிரச்சினைகள், உரிமைகள் தேடுக…", all: "அனைத்தும்",
    viewAll: "அனைத்தும் பார்க்க", learnMore: "மேலும் அறிய", loading: "ஏற்றுகிறது…",
    retry: "மீண்டும் முயற்சி", cancel: "ரத்து", save: "சேமி", edit: "திருத்து",
    submit: "சமர்ப்பி", back: "பின்னால்", next: "அடுத்து", close: "மூடுக",
    optional: "விருப்பம்", required: "தேவை",
  },
  status: {
    REPORTED: "புகாரளிக்கப்பட்டது", AUTHORITY_IDENTIFIED: "அதிகாரம் அடையாளம்",
    SUBMITTED: "சமர்ப்பிக்கப்பட்டது", ACKNOWLEDGED: "ஏற்கப்பட்டது",
    UNDER_REVIEW: "மதிப்பாய்வில்", ACTION_TAKEN: "நடவடிக்கை எடுக்கப்பட்டது",
    RESOLVED: "தீர்க்கப்பட்டது", REJECTED: "நிராகரிக்கப்பட்டது",
  },
  category: {
    WATER: "குடிநீர் விநியோகம்", ROADS: "சாலைகள்", ELECTRICITY: "மின்சாரம்",
    GARBAGE: "குப்பை", DRAINAGE: "வடிகால்", EDUCATION: "கல்வி",
    HEALTHCARE: "சுகாதாரம்", TRANSPORT: "போக்குவரத்து", ENVIRONMENT: "சுற்றுச்சூழல்",
    PUBLIC_SERVICES: "பொது சேவைகள்", EMPLOYMENT: "வேலைவாய்ப்பு",
    INFRASTRUCTURE: "உள்கட்டமைப்பு", DOCUMENTATION: "ஆவணங்கள்",
    SAFETY: "பொது பாதுகாப்பு", RIGHTS: "உரிமைகள் / குடிமை நடைமுறை", OTHER: "மற்றவை",
  },
};

// ─── Gujarati (ગુજરાતી) ─────────────────────────────────────────────────────
export const gu: Dict = {
  nav: {
    home: "હોમ", explore: "એક્સપ્લોર", report: "રિપોર્ટ", map: "ભારત નકશો",
    issues: "જન મુદ્દા", rights: "હકો જાણો", ai: "AI સહાયક",
    dashboard: "ડેશબોર્ડ", language: "ભાષા", notifications: "સૂચનાઓ",
    reportProblem: "સમસ્યા રિપોર્ટ કરો", profile: "પ્રોફાઇલ", myReports: "મારા રિપોર્ટ્સ",
    saved: "સેવ કરેલા મુદ્દા", privacy: "પ્રાઇવસી", logout: "લોગઆઉટ",
    login: "લોગિન", register: "સાઇન અપ",
  },
  hero: {
    badge: "ભારતના દરેક નાગરિક માટે",
    title: "હર આવાજ. હર જગહ. એક ઇન્ડિયા.",
    subtitle: "તમારા વિસ્તારમાં શું ચાલી રહ્યું છે? જાણો. તમારી સમસ્યા રિપોર્ટ કરો. તમારા હકો સમજો. અને ઉકેલનો રસ્તો જુઓ.",
    reportBtn: "સમસ્યા રિપોર્ટ કરો", exploreBtn: "ઇન્ડિયા એક્સપ્લોર કરો",
    seeHappening: "શું ચાલી રહ્યું છે તે જુઓ",
    trust1: "પ્રાઇવસી પ્રથમ", trust2: "બહુભાષી", trust3: "નાગરિક કેન્દ્રિત",
  },
  stats: {
    title: "ઇન્ડિયા બોલે છે. જનઆવાજ સાંભળે છે.",
    subtitle: "દેશભરના નાગરિકો સમસ્યાઓ રિપોર્ટ કરી રહ્યા છે, પ્રગતિ ટ્રેક કરી રહ્યા છે અને સાથે મળીને ઉકેલ શોધી રહ્યા છે.",
    reports: "નાગરિક રિપોર્ટ્સ", underReview: "સમીક્ષા હેઠળના મુદ્દા", resolved: "ઉકેલાયેલા મુદ્દા",
    states: "આવરી લેવાયેલા રાજ્યો", languages: "સમર્થિત ભાષાઓ",
    demoNote: "ડેમો ડેટા — લાઇવ સરકારી આંકડા નથી",
  },
  langSection: {
    title: "તમારી ભાષામાં તમારી વાત.",
    subtitle: "ભારતની દરેક ભાષા મહત્વની છે. જનઆવાજ પર તમને અનુકૂળ હોય તે જ ભાષા વાપરો.",
    note: "તમારી પસંદ કરેલી ભાષા નેવિગેશન, ફોર્મ, રિપોર્ટ, AI સહાયક, હક્કોની માહિતી અને સૂચનાઓમાં લાગુ પડે છે.",
  },
  happening: {
    title: "ભારતમાં શું ચાલી રહ્યું છે?",
    subtitle: "એક જ જગ્યાએથી જુઓ — કયા વિસ્તારમાં કયો મુદ્દો છે, લોકો કઈ ચિંતા ઉઠાવી રહ્યા છે અને વર્તમાન સ્થિતિ શું છે.",
    viewMap: "ઇન્ટરેક્ટિવ નકશો ખોલો",
  },
  reportCta: {
    title: "સમસ્યા છે? રિપોર્ટ કરો.",
    subtitle: "તમારા વિસ્તારની civic સમસ્યા 2 મિનિટમાં રિપોર્ટ કરો. ફોટો કે વિડિયો પુરાવા સાથે — અને પ્રગતિ ટ્રેક કરો.",
    start: "રિપોર્ટ શરૂ કરો",
    categoriesNote: "16 શ્રેણીઓ • ફોટો/વિડિયો પુરાવા • પ્રગતિ ટ્રેકિંગ",
  },
  evidence: {
    title: "ફક્ત વાત નહીં — પુરાવા પણ.",
    subtitle: "ફોટો, વિડિયો, દસ્તાવેજ કે વોઇસ નોટ સાથે તમારો રિપોર્ટ મજબૂત બનાવો. તમારા પુરાવા સુરક્ષિત અને ખાનગી રહે છે.",
  },
  privacy: {
    title: "તમારી પ્રાઇવસી, તમારો હક.",
    subtitle: "જાહેર સમસ્યા દેખાવી જોઈએ — નાગરિકની અંગત ઓળખ નહીં.",
    statement: "“જાહેર સમસ્યા દેખાવી જોઈએ — નાગરિકની અંગત ઓળખ નહીં.”",
    cards: [
      { t: "સુરક્ષિત ડેટા", d: "તમારો ડેટા એન્ક્રિપ્ટ કરીને સુરક્ષિત રાખવામાં આવે છે." },
      { t: "પ્રાઇવસી સુરક્ષા", d: "અંગત માહિતી ક્યારેય જાહેરમાં બતાવાતી નથી." },
      { t: "જાહેર ઓળખ નહીં", d: "રિપોર્ટમાં મુદ્દો દેખાય છે, તમારી ઓળખ નહીં." },
      { t: "બિનજરૂરી ટ્રેકિંગ નહીં", d: "જરૂર કરતાં વધુ અમે તમને ટ્રેક કરતા નથી." },
      { t: "સુરક્ષિત પુરાવા", d: "પુરાવા ફક્ત તમને અને અધિકૃત અધિકારીઓને દેખાય છે." },
    ],
  },
  rights: {
    title: "તમારા હકો સમજો.",
    subtitle: "સરળ ભાષામાં જાણો — તમે શું કરી શકો, કઈ પ્રક્રિયા લાગુ પડે, અને ફરિયાદનો ફોલો-અપ કેવી રીતે કરવો.",
    disclaimer: "આ માહિતી સામાન્ય જાગૃતિ માટે છે; વ્યાવસાયિક કાનૂની સલાહનો વિકલ્પ નથી.",
    viewAll: "બધા હકો જુઓ",
  },
  issuesSection: {
    title: "જન મુદ્દા અને આંદોલનો",
    subtitle: "ચકાસાયેલા અને રિપોર્ટ કરાયેલા જન મુદ્દા — પૃષ્ઠભૂમિ, ચિંતાઓ, સત્તાવાર પ્રતિભાવ અને વર્તમાન સ્થિતિ સાથે.",
    viewAll: "બધા મુદ્દા જુઓ",
  },
  emotion: {
    headline: "ઇન્ડિયા ફક્ત એક દેશ નથી. આપણા સૌની જવાબદારી છે.",
    text1: "“એક વિદ્યાર્થીનો અવાજ, એક ખેડૂતની સમસ્યા, એક મજૂરની તકલીફ, એક પરિવારની જરૂર — દરેક genuine ચિંતા મહત્વની છે.”",
    text2: "“ટેકનોલોજી ત્યારે જ અર્થપૂર્ણ જ્યારે તે લોકોના કામ આવે.”",
    cta: "જવાબદારીથી તમારો અવાજ ઉઠાવો",
  },
  footer: {
    tagline: "હર આવાજ. હર જગહ. એક ઇન્ડિયા.",
    platform: "પ્લેટફોર્મ", resources: "સંસાધનો", languages: "ભાષાઓ",
    rights: "હકો જાણો", help: "મદદ", faq: "સામાન્ય પ્રશ્નો",
    privacy: "પ્રાઇવસી", terms: "નિયમો",
    madeIn: "ભારતના નાગરિકો માટે ટેકનોલોજીથી બનાવેલ.",
  },
  ai: {
    title: "જનઆવાજ AI",
    subtitle: "તમારી ભાષામાં પૂછો. સમજો. સાચો રસ્તો પસંદ કરો.",
    placeholder: "તમારો પ્રશ્ન લખો… (ગુજરાતી, હિન્દી કે અંગ્રેજીમાં)",
    empty1: "નમસ્તે! હું જનઆવાજ AI છું.",
    empty2: "તમારી સમસ્યા સમજવામાં, માહિતી શોધવામાં અને આગળનું પગલું સમજવામાં હું મદદ કરી શકું.",
    warning: "કૃપા કરીને ચેટમાં પાસવર્ડ, OTP, આધાર નંબર, બેંક વિગતો કે અન્ય અત્યંત સંવેદનશીલ અંગત માહિતી શેર ન કરો.",
    createReport: "રિપોર્ટ બનાવો", copy: "કોપી", copied: "કોપી થયું", send: "મોકલો",
    thinking: "વિચારી રહ્યો છું…",
    disclaimer: "જનઆવાજ AI civic માહિતી આપે છે — કાનૂની સલાહ નહીં. મહત્વના દાવાઓ ચકાસો.",
    newChat: "નવી ચેટ",
    suggestions: [
      "મારા વિસ્તારની સમસ્યા રિપોર્ટ કરવી છે.",
      "મારી ફરિયાદનું સ્ટેટસ સમજવું છે.",
      "રસ્તા/પાણી/વીજળીની ફરિયાદ કેવી રીતે કરવી?",
      "RTI એટલે શું?",
      "મારી પાસે સરકારી નોટિસ છે, સમજાવો.",
      "સરકારી યોજના વિશે જણાવો.",
    ],
  },
  track: {
    title: "તમારી ફરિયાદ ક્યાં પહોંચી?",
    subtitle: "તમારો રિપોર્ટ ID (જેમ કે JA-10001) નાખીને લાઇવ સ્ટેટસ જુઓ.",
    enterId: "રિપોર્ટ ID", trackBtn: "ટ્રેક કરો",
  },
  common: {
    search: "શોધો", searchPh: "રિપોર્ટ, મુદ્દા, હકો શોધો…", all: "બધા",
    viewAll: "બધા જુઓ", learnMore: "વધુ જાણો", loading: "લોડ થઈ રહ્યું…",
    retry: "ફરી પ્રયાસ", cancel: "રદ કરો", save: "સેવ કરો", edit: "એડિટ",
    submit: "સબમિટ", back: "પાછળ", next: "આગળ", close: "બંધ કરો",
    optional: "વૈકલ્પિક", required: "જરૂરી",
  },
  status: {
    REPORTED: "રિપોર્ટ કરાયું", AUTHORITY_IDENTIFIED: "સત્તા ઓળખાઈ",
    SUBMITTED: "સબમિટ થયું", ACKNOWLEDGED: "સ્વીકારાયું",
    UNDER_REVIEW: "સમીક્ષા હેઠળ", ACTION_TAKEN: "કાર્યવાહી થઈ",
    RESOLVED: "ઉકેલાયું", REJECTED: "નકારાયું",
  },
  category: {
    WATER: "પાણી પુરવઠો", ROADS: "રસ્તા", ELECTRICITY: "વીજળી",
    GARBAGE: "કચરો", DRAINAGE: "ગટર", EDUCATION: "શિક્ષણ",
    HEALTHCARE: "આરોગ્ય", TRANSPORT: "પરિવહન", ENVIRONMENT: "પર્યાવરણ",
    PUBLIC_SERVICES: "જાહેર સેવાઓ", EMPLOYMENT: "રોજગાર",
    INFRASTRUCTURE: "માળખાગત સુવિધા", DOCUMENTATION: "દસ્તાવેજો",
    SAFETY: "જાહેર સલામતી", RIGHTS: "હકો / નાગરિક પ્રક્રિયા", OTHER: "અન્ય",
  },
};

// ─── Kannada (ಕನ್ನಡ) ─────────────────────────────────────────────────────────
export const kn: Dict = {
  nav: {
    home: "ಮುಖಪುಟ", explore: "ಅನ್ವೇಷಿಸಿ", report: "ವರದಿ", map: "ಭಾರತ ನಕ್ಷೆ",
    issues: "ಸಾರ್ವಜನಿಕ ಸಮಸ್ಯೆಗಳು", rights: "ಹಕ್ಕುಗಳನ್ನು ತಿಳಿಯಿರಿ", ai: "AI ಸಹಾಯಕ",
    dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್", language: "ಭಾಷೆ", notifications: "ಅಧಿಸೂಚನೆಗಳು",
    reportProblem: "ಸಮಸ್ಯೆಯನ್ನು ವರದಿ ಮಾಡಿ", profile: "ಪ್ರೊಫೈಲ್", myReports: "ನನ್ನ ವರದಿಗಳು",
    saved: "ಉಳಿಸಿದ ವಿಷಯಗಳು", privacy: "ಗೌಪ್ಯತೆ", logout: "ಲಾಗ್‌ಔಟ್",
    login: "ಲಾಗಿನ್", register: "ಸೈನ್ ಅಪ್",
  },
  hero: {
    badge: "ಭಾರತದ ಪ್ರತಿಯೊಬ್ಬ ನಾಗರಿಕನಿಗಾಗಿ",
    title: "ಹರ್ ಆವಾಜ್. ಹರ್ ಜಗಹ್. ಏಕ್ ಇಂಡಿಯಾ.",
    subtitle: "ನಿಮ್ಮ ಪ್ರದೇಶದಲ್ಲಿ ಏನು ನಡೆಯುತ್ತಿದೆ? ತಿಳಿಯಿರಿ. ನಿಮ್ಮ ಸಮಸ್ಯೆಯನ್ನು ವರದಿ ಮಾಡಿ. ನಿಮ್ಮ ಹಕ್ಕುಗಳನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ. ಪರಿಹಾರದ ದಾರಿಯನ್ನು ನೋಡಿ.",
    reportBtn: "ಸಮಸ್ಯೆಯನ್ನು ವರದಿ ಮಾಡಿ", exploreBtn: "ಇಂಡಿಯಾವನ್ನು ಅನ್ವೇಷಿಸಿ",
    seeHappening: "ಏನು ನಡೆಯುತ್ತಿದೆ ನೋಡಿ",
    trust1: "ಗೌಪ್ಯತೆಗೆ ಮೊದಲ ಆದ್ಯತೆ", trust2: "ಬಹುಭಾಷಾ", trust3: "ನಾಗರಿಕ ಕೇಂದ್ರಿತ",
  },
  stats: {
    title: "ಇಂಡಿಯಾ ಮಾತನಾಡುತ್ತಿದೆ. ಜನಆವಾಜ್ ಕೇಳುತ್ತಿದೆ.",
    subtitle: "ದೇಶಾದ್ಯಂತ ನಾಗರಿಕರು ಸಮಸ್ಯೆಗಳನ್ನು ವರದಿ ಮಾಡುತ್ತಿದ್ದಾರೆ, ಪ್ರಗತಿಯನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡುತ್ತಿದ್ದಾರೆ, ಒಟ್ಟಾಗಿ ಪರಿಹಾರ ಕಂಡುಕೊಳ್ಳುತ್ತಿದ್ದಾರೆ.",
    reports: "ನಾಗರಿಕ ವರದಿಗಳು", underReview: "ಪರಿಶೀಲನೆಯಲ್ಲಿರುವ ವಿಷಯಗಳು", resolved: "ಪರಿಹರಿಸಿದ ವಿಷಯಗಳು",
    states: "ಒಳಗೊಂಡ ರಾಜ್ಯಗಳು", languages: "ಬೆಂಬಲಿತ ಭಾಷೆಗಳು",
    demoNote: "ಡೆಮೋ ಡೇಟಾ — ನೇರ ಸರ್ಕಾರಿ ಅಂಕಿಅಂಶಗಳಲ್ಲ",
  },
  langSection: {
    title: "ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ ನಿಮ್ಮ ಮಾತು.",
    subtitle: "ಭಾರತದ ಪ್ರತಿಯೊಂದು ಭಾಷೆಯೂ ಮುಖ್ಯ. ಜನಆವಾಜ್‌ನಲ್ಲಿ ನಿಮಗೆ ಅನುಕೂಲವಾದ ಭಾಷೆಯನ್ನೇ ಬಳಸಿ.",
    note: "ನೀವು ಆಯ್ಕೆ ಮಾಡಿದ ಭಾಷೆ ನ್ಯಾವಿಗೇಷನ್, ಫಾರ್ಮ್‌ಗಳು, ವರದಿಗಳು, AI ಸಹಾಯಕ, ಹಕ್ಕುಗಳ ಮಾಹಿತಿ, ಅಧಿಸೂಚನೆಗಳಲ್ಲಿ ಅನ್ವಯವಾಗುತ್ತದೆ.",
  },
  happening: {
    title: "ಭಾರತದಲ್ಲಿ ಏನು ನಡೆಯುತ್ತಿದೆ?",
    subtitle: "ಒಂದೇ ಸ್ಥಳದಿಂದ ನೋಡಿ — ಯಾವ ಪ್ರದೇಶದಲ್ಲಿ ಯಾವ ಸಮಸ್ಯೆ ಇದೆ, ಜನರು ಯಾವ ಕಳವಳ ವ್ಯಕ್ತಪಡಿಸುತ್ತಿದ್ದಾರೆ, ಪ್ರಸ್ತುತ ಸ್ಥಿತಿ ಏನು.",
    viewMap: "ಇಂಟರಾಕ್ಟಿವ್ ನಕ್ಷೆ ತೆರೆಯಿರಿ",
  },
  reportCta: {
    title: "ಸಮಸ್ಯೆ ಇದೆಯೇ? ವರದಿ ಮಾಡಿ.",
    subtitle: "ನಿಮ್ಮ ಪ್ರದೇಶದ civic ಸಮಸ್ಯೆಯನ್ನು 2 ನಿಮಿಷಗಳಲ್ಲಿ ವರದಿ ಮಾಡಿ. ಫೋಟೋ ಅಥವಾ ವೀಡಿಯೋ ಸಾಕ್ಷ್ಯದೊಂದಿಗೆ — ಪ್ರಗತಿಯನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ.",
    start: "ವರದಿ ಪ್ರಾರಂಭಿಸಿ",
    categoriesNote: "16 ವರ್ಗಗಳು • ಫೋಟೋ/ವೀಡಿಯೋ ಸಾಕ್ಷ್ಯ • ಪ್ರಗತಿ ಟ್ರ್ಯಾಕಿಂಗ್",
  },
  evidence: {
    title: "ಮಾತು ಮಾತ್ರವಲ್ಲ — ಸಾಕ್ಷ್ಯವೂ.",
    subtitle: "ಫೋಟೋ, ವೀಡಿಯೋ, ದಾಖಲೆ ಅಥವಾ ಧ್ವನಿ ಟಿಪ್ಪಣಿಯೊಂದಿಗೆ ನಿಮ್ಮ ವರದಿಯನ್ನು ಬಲಪಡಿಸಿ. ನಿಮ್ಮ ಸಾಕ್ಷ್ಯ ಸುರಕ್ಷಿತವಾಗಿ, ಖಾಸಗಿಯಾಗಿ ಇರುತ್ತದೆ.",
  },
  privacy: {
    title: "ನಿಮ್ಮ ಗೌಪ್ಯತೆ, ನಿಮ್ಮ ಹಕ್ಕು.",
    subtitle: "ಸಾರ್ವಜನಿಕ ಸಮಸ್ಯೆ ಕಾಣಬೇಕು — ನಾಗರಿಕನ ವೈಯಕ್ತಿಕ ಗುರುತಲ್ಲ.",
    statement: "“ಸಾರ್ವಜನಿಕ ಸಮಸ್ಯೆ ಕಾಣಬೇಕು — ನಾಗರಿಕನ ವೈಯಕ್ತಿಕ ಗುರುತಲ್ಲ.”",
    cards: [
      { t: "ಸುರಕ್ಷಿತ ಡೇಟಾ", d: "ನಿಮ್ಮ ಡೇಟಾವನ್ನು ಎನ್‌ಕ್ರಿಪ್ಟ್ ಮಾಡಿ ಸುರಕ್ಷಿತವಾಗಿ ಸಂಗ್ರಹಿಸಲಾಗುತ್ತದೆ." },
      { t: "ಗೌಪ್ಯತಾ ರಕ್ಷಣೆ", d: "ವೈಯಕ್ತಿಕ ವಿವರಗಳನ್ನು ಎಂದಿಗೂ ಸಾರ್ವಜನಿಕವಾಗಿ ತೋರಿಸಲಾಗುವುದಿಲ್ಲ." },
      { t: "ಸಾರ್ವಜನಿಕ ಗುರುತಿಲ್ಲ", d: "ವರದಿಗಳಲ್ಲಿ ಸಮಸ್ಯೆ ಕಾಣುತ್ತದೆ, ನಿಮ್ಮ ಗುರುತಲ್ಲ." },
      { t: "ಅನಗತ್ಯ ಟ್ರ್ಯಾಕಿಂಗ್ ಇಲ್ಲ", d: "ಅಗತ್ಯಕ್ಕಿಂತ ಹೆಚ್ಚು ನಿಮ್ಮನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡುವುದಿಲ್ಲ." },
      { t: "ಸುರಕ್ಷಿತ ಸಾಕ್ಷ್ಯ", d: "ಸಾಕ್ಷ್ಯವು ನಿಮಗೆ ಮತ್ತು ಅಧಿಕೃತ ಅಧಿಕಾರಿಗಳಿಗೆ ಮಾತ್ರ ಕಾಣುತ್ತದೆ." },
    ],
  },
  rights: {
    title: "ನಿಮ್ಮ ಹಕ್ಕುಗಳನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ.",
    subtitle: "ಸರಳ ಭಾಷೆಯಲ್ಲಿ ತಿಳಿಯಿರಿ — ನೀವು ಏನು ಮಾಡಬಹುದು, ಯಾವ ಪ್ರಕ್ರಿಯೆ ಅನ್ವಯವಾಗುತ್ತದೆ, ದೂರನ್ನು ಹೇಗೆ ಫಾಲೋ-ಅಪ್ ಮಾಡುವುದು.",
    disclaimer: "ಈ ಮಾಹಿತಿ ಸಾಮಾನ್ಯ ಜಾಗೃತಿಗಾಗಿ; ವೃತ್ತಿಪರ ಕಾನೂನು ಸಲಹೆಗೆ ಪರ್ಯಾಯವಲ್ಲ.",
    viewAll: "ಎಲ್ಲಾ ಹಕ್ಕುಗಳನ್ನು ನೋಡಿ",
  },
  issuesSection: {
    title: "ಸಾರ್ವಜನಿಕ ಸಮಸ್ಯೆಗಳು & ಚಳವಳಿಗಳು",
    subtitle: "ಪರಿಶೀಲಿಸಿದ ಮತ್ತು ವರದಿಯಾದ ಸಾರ್ವಜನಿಕ ಸಮಸ್ಯೆಗಳು — ಹಿನ್ನೆಲೆ, ಕಳವಳಗಳು, ಅಧಿಕೃತ ಪ್ರತಿಕ್ರಿಯೆ, ಪ್ರಸ್ತುತ ಸ್ಥಿತಿಯೊಂದಿಗೆ.",
    viewAll: "ಎಲ್ಲಾ ವಿಷಯಗಳನ್ನು ನೋಡಿ",
  },
  emotion: {
    headline: "ಇಂಡಿಯಾ ಕೇವಲ ಒಂದು ದೇಶವಲ್ಲ. ನಮ್ಮೆಲ್ಲರ ಜವಾಬ್ದಾರಿ.",
    text1: "“ಒಬ್ಬ ವಿದ್ಯಾರ್ಥಿಯ ಧ್ವನಿ, ಒಬ್ಬ ರೈತನ ಸಮಸ್ಯೆ, ಒಬ್ಬ ಕಾರ್ಮಿಕನ ಸಂಕಟ, ಒಂದು ಕುಟುಂಬದ ಅಗತ್ಯ — ಪ್ರತಿಯೊಂದು genuine ಕಳವಳವೂ ಮುಖ್ಯ.”",
    text2: "“ತಂತ್ರಜ್ಞಾನವು ಜನರಿಗೆ ಉಪಯೋಗವಾದಾಗಲೇ ಅರ್ಥಪೂರ್ಣ.”",
    cta: "ಜವಾಬ್ದಾರಿಯಿಂದ ನಿಮ್ಮ ಧ್ವನಿ ಎತ್ತಿ",
  },
  footer: {
    tagline: "ಹರ್ ಆವಾಜ್. ಹರ್ ಜಗಹ್. ಏಕ್ ಇಂಡಿಯಾ.",
    platform: "ಪ್ಲಾಟ್‌ಫಾರ್ಮ್", resources: "ಸಂಪನ್ಮೂಲಗಳು", languages: "ಭಾಷೆಗಳು",
    rights: "ಹಕ್ಕುಗಳನ್ನು ತಿಳಿಯಿರಿ", help: "ಸಹಾಯ", faq: "ಸಾಮಾನ್ಯ ಪ್ರಶ್ನೆಗಳು",
    privacy: "ಗೌಪ್ಯತೆ", terms: "ನಿಯಮಗಳು",
    madeIn: "ಭಾರತದ ನಾಗರಿಕರಿಗಾಗಿ ತಂತ್ರಜ್ಞಾನದೊಂದಿಗೆ ನಿರ್ಮಿಸಲಾಗಿದೆ.",
  },
  ai: {
    title: "ಜನಆವಾಜ್ AI",
    subtitle: "ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ ಕೇಳಿ. ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ. ಸರಿಯಾದ ದಾರಿ ಆರಿಸಿ.",
    placeholder: "ನಿಮ್ಮ ಪ್ರಶ್ನೆ ಬರೆಯಿರಿ… (ಕನ್ನಡ, ಹಿಂದಿ ಅಥವಾ ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ)",
    empty1: "ನಮಸ್ತೆ! ನಾನು ಜನಆವಾಜ್ AI.",
    empty2: "ನಿಮ್ಮ ಸಮಸ್ಯೆಯನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು, ಮಾಹಿತಿ ಹುಡುಕಲು, ಮುಂದಿನ ಹೆಜ್ಜೆ ತಿಳಿಯಲು ನಾನು ಸಹಾಯ ಮಾಡಬಲ್ಲೆ.",
    warning: "ದಯವಿಟ್ಟು ಚಾಟ್‌ನಲ್ಲಿ ಪಾಸ್‌ವರ್ಡ್‌ಗಳು, OTPಗಳು, ಆಧಾರ್ ಸಂಖ್ಯೆಗಳು, ಬ್ಯಾಂಕ್ ವಿವರಗಳು ಅಥವಾ ಇತರ ಅತ್ಯಂತ ಸೂಕ್ಷ್ಮ ವೈಯಕ್ತಿಕ ಮಾಹಿತಿಯನ್ನು ಹಂಚಿಕೊಳ್ಳಬೇಡಿ.",
    createReport: "ವರದಿ ರಚಿಸಿ", copy: "ನಕಲಿಸಿ", copied: "ನಕಲಿಸಲಾಗಿದೆ", send: "ಕಳುಹಿಸಿ",
    thinking: "ಯೋಚಿಸುತ್ತಿದ್ದೇನೆ…",
    disclaimer: "ಜನಆವಾಜ್ AI civic ಮಾಹಿತಿ ನೀಡುತ್ತದೆ — ಕಾನೂನು ಸಲಹೆಯಲ್ಲ. ಪ್ರಮುಖ ಹೇಳಿಕೆಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.",
    newChat: "ಹೊಸ ಚಾಟ್",
    suggestions: [
      "ನಮ್ಮ ಪ್ರದೇಶದ ಸಮಸ್ಯೆಯನ್ನು ವರದಿ ಮಾಡಬೇಕು.",
      "ನನ್ನ ದೂರಿನ ಸ್ಥಿತಿಯನ್ನು ತಿಳಿಯಬೇಕು.",
      "ರಸ್ತೆ/ನೀರು/ವಿದ್ಯುತ್ ದೂರು ಹೇಗೆ ನೀಡುವುದು?",
      "RTI ಎಂದರೇನು?",
      "ನನ್ನ ಬಳಿ ಸರ್ಕಾರಿ ನೋಟಿಸ್ ಇದೆ, ವಿವರಿಸಿ.",
      "ಸರ್ಕಾರಿ ಯೋಜನೆಯ ಬಗ್ಗೆ ತಿಳಿಸಿ.",
    ],
  },
  track: {
    title: "ನಿಮ್ಮ ದೂರು ಎಲ್ಲಿಗೆ ತಲುಪಿದೆ?",
    subtitle: "ನಿಮ್ಮ ವರದಿ ID (ಉದಾ. JA-10001) ನೀಡಿ ನೇರ ಸ್ಥಿತಿ ನೋಡಿ.",
    enterId: "ವರದಿ ID", trackBtn: "ಟ್ರ್ಯಾಕ್ ಮಾಡಿ",
  },
  common: {
    search: "ಹುಡುಕಿ", searchPh: "ವರದಿಗಳು, ವಿಷಯಗಳು, ಹಕ್ಕುಗಳನ್ನು ಹುಡುಕಿ…", all: "ಎಲ್ಲಾ",
    viewAll: "ಎಲ್ಲಾ ನೋಡಿ", learnMore: "ಇನ್ನಷ್ಟು ತಿಳಿಯಿರಿ", loading: "ಲೋಡ್ ಆಗುತ್ತಿದೆ…",
    retry: "ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ", cancel: "ರದ್ದುಮಾಡಿ", save: "ಉಳಿಸಿ", edit: "ಸಂಪಾದಿಸಿ",
    submit: "ಸಲ್ಲಿಸಿ", back: "ಹಿಂದೆ", next: "ಮುಂದೆ", close: "ಮುಚ್ಚಿ",
    optional: "ಐಚ್ಛಿಕ", required: "ಅಗತ್ಯ",
  },
  status: {
    REPORTED: "ವರದಿಯಾಗಿದೆ", AUTHORITY_IDENTIFIED: "ಪ್ರಾಧಿಕಾರ ಗುರುತಿಸಲಾಗಿದೆ",
    SUBMITTED: "ಸಲ್ಲಿಸಲಾಗಿದೆ", ACKNOWLEDGED: "ಸ್ವೀಕರಿಸಲಾಗಿದೆ",
    UNDER_REVIEW: "ಪರಿಶೀಲನೆಯಲ್ಲಿದೆ", ACTION_TAKEN: "ಕ್ರಮ ಕೈಗೊಳ್ಳಲಾಗಿದೆ",
    RESOLVED: "ಪರಿಹರಿಸಲಾಗಿದೆ", REJECTED: "ತಿರಸ್ಕರಿಸಲಾಗಿದೆ",
  },
  category: {
    WATER: "ನೀರು ಸರಬರಾಜು", ROADS: "ರಸ್ತೆಗಳು", ELECTRICITY: "ವಿದ್ಯುತ್",
    GARBAGE: "ಕಸ", DRAINAGE: "ಚರಂಡಿ", EDUCATION: "ಶಿಕ್ಷಣ",
    HEALTHCARE: "ಆರೋಗ್ಯ", TRANSPORT: "ಸಾರಿಗೆ", ENVIRONMENT: "ಪರಿಸರ",
    PUBLIC_SERVICES: "ಸಾರ್ವಜನಿಕ ಸೇವೆಗಳು", EMPLOYMENT: "ಉದ್ಯೋಗ",
    INFRASTRUCTURE: "ಮೂಲಸೌಕರ್ಯ", DOCUMENTATION: "ದಾಖಲಾತಿ",
    SAFETY: "ಸಾರ್ವಜನಿಕ ಸುರಕ್ಷತೆ", RIGHTS: "ಹಕ್ಕುಗಳು / ನಾಗರಿಕ ಪ್ರಕ್ರಿಯೆ", OTHER: "ಇತರೆ",
  },
};

// ─── Malayalam (മലയാളം) ─────────────────────────────────────────────────────
export const ml: Dict = {
  nav: {
    home: "ഹോം", explore: "പര്യവേക്ഷണം", report: "റിപ്പോർട്ട്", map: "ഇന്ത്യ മാപ്പ്",
    issues: "പൊതു പ്രശ്നങ്ങൾ", rights: "അവകാശങ്ങൾ അറിയുക", ai: "AI സഹായി",
    dashboard: "ഡാഷ്ബോർഡ്", language: "ഭാഷ", notifications: "അറിയിപ്പുകൾ",
    reportProblem: "പ്രശ്നം റിപ്പോർട്ട് ചെയ്യുക", profile: "പ്രൊഫൈൽ", myReports: "എന്റെ റിപ്പോർട്ടുകൾ",
    saved: "സേവ് ചെയ്തവ", privacy: "സ്വകാര്യത", logout: "ലോഗൗട്ട്",
    login: "ലോഗിൻ", register: "സൈൻ അപ്പ്",
  },
  hero: {
    badge: "ഇന്ത്യയിലെ ഓരോ പൗരനും വേണ്ടി",
    title: "ഹർ ആവാസ്. ഹർ ജഗഹ്. ഏക് ഇന്ത്യ.",
    subtitle: "നിങ്ങളുടെ പ്രദേശത്ത് എന്താണ് നടക്കുന്നത്? അറിയുക. നിങ്ങളുടെ പ്രശ്നം റിപ്പോർട്ട് ചെയ്യുക. നിങ്ങളുടെ അവകാശങ്ങൾ മനസ്സിലാക്കുക. പരിഹാരത്തിലേക്കുള്ള വഴി കാണുക.",
    reportBtn: "പ്രശ്നം റിപ്പോർട്ട് ചെയ്യുക", exploreBtn: "ഇന്ത്യ പര്യവേക്ഷണം ചെയ്യുക",
    seeHappening: "എന്താണ് നടക്കുന്നതെന്ന് കാണുക",
    trust1: "സ്വകാര്യത ആദ്യം", trust2: "ബഹുഭാഷാ", trust3: "പൗര കേന്ദ്രീകൃത",
  },
  stats: {
    title: "ഇന്ത്യ സംസാരിക്കുന്നു. ജനആവാസ് കേൾക്കുന്നു.",
    subtitle: "രാജ്യമെമ്പാടുമുള്ള പൗരന്മാർ പ്രശ്നങ്ങൾ റിപ്പോർട്ട് ചെയ്യുന്നു, പുരോഗതി ട്രാക്ക് ചെയ്യുന്നു, ഒരുമിച്ച് പരിഹാരം കണ്ടെത്തുന്നു.",
    reports: "പൗര റിപ്പോർട്ടുകൾ", underReview: "അവലോകനത്തിലുള്ളവ", resolved: "പരിഹരിച്ചവ",
    states: "ഉൾപ്പെട്ട സംസ്ഥാനങ്ങൾ", languages: "പിന്തുണയ്ക്കുന്ന ഭാഷകൾ",
    demoNote: "ഡെമോ ഡാറ്റ — തത്സമയ സർക്കാർ കണക്കുകളല്ല",
  },
  langSection: {
    title: "നിങ്ങളുടെ ഭാഷയിൽ നിങ്ങളുടെ കാര്യം.",
    subtitle: "ഇന്ത്യയിലെ ഓരോ ഭാഷയും പ്രധാനമാണ്. ജനആവാസിൽ നിങ്ങൾക്ക് സുഖകരമായ ഭാഷ തന്നെ ഉപയോഗിക്കുക.",
    note: "നിങ്ങൾ തിരഞ്ഞെടുത്ത ഭാഷ നാവിഗേഷൻ, ഫോമുകൾ, റിപ്പോർട്ടുകൾ, AI സഹായി, അവകാശ വിവരങ്ങൾ, അറിയിപ്പുകൾ എന്നിവയിൽ ബാധകമാണ്.",
  },
  happening: {
    title: "ഇന്ത്യയിൽ എന്താണ് നടക്കുന്നത്?",
    subtitle: "ഒരിടത്ത് നിന്ന് കാണുക — ഏത് പ്രദേശത്ത് എന്ത് പ്രശ്നമുണ്ട്, ആളുകൾ എന്ത് ആശങ്കയാണ് ഉന്നയിക്കുന്നത്, നിലവിലെ സ്ഥിതി എന്താണ്.",
    viewMap: "ഇന്ററാക്ടീവ് മാപ്പ് തുറക്കുക",
  },
  reportCta: {
    title: "പ്രശ്നമുണ്ടോ? റിപ്പോർട്ട് ചെയ്യൂ.",
    subtitle: "നിങ്ങളുടെ പ്രദേശത്തെ civic പ്രശ്നം 2 മിനിറ്റിൽ റിപ്പോർട്ട് ചെയ്യുക. ഫോട്ടോ/വീഡിയോ തെളിവുകളോടെ — പുരോഗതി ട്രാക്ക് ചെയ്യുക.",
    start: "റിപ്പോർട്ട് തുടങ്ങുക",
    categoriesNote: "16 വിഭാഗങ്ങൾ • ഫോട്ടോ/വീഡിയോ തെളിവുകൾ • പുരോഗതി ട്രാക്കിംഗ്",
  },
  evidence: {
    title: "വെറും വാക്കല്ല — തെളിവും.",
    subtitle: "ഫോട്ടോ, വീഡിയോ, രേഖ അല്ലെങ്കിൽ വോയ്സ് നോട്ട് ഉപയോഗിച്ച് നിങ്ങളുടെ റിപ്പോർട്ട് ശക്തമാക്കുക. നിങ്ങളുടെ തെളിവുകൾ സുരക്ഷിതവും സ്വകാര്യവുമായിരിക്കും.",
  },
  privacy: {
    title: "നിങ്ങളുടെ സ്വകാര്യത, നിങ്ങളുടെ അവകാശം.",
    subtitle: "പൊതു പ്രശ്നം കാണേണ്ടത് — പൗരന്റെ വ്യക്തിഗത തിരിച്ചറിയൽ അല്ല.",
    statement: "“പൊതു പ്രശ്നം കാണേണ്ടത് — പൗരന്റെ വ്യക്തിഗത തിരിച്ചറിയൽ അല്ല.”",
    cards: [
      { t: "സുരക്ഷിത ഡാറ്റ", d: "നിങ്ങളുടെ ഡാറ്റ എൻക്രിപ്റ്റ് ചെയ്ത് സുരക്ഷിതമായി സൂക്ഷിക്കുന്നു." },
      { t: "സ്വകാര്യതാ സംരക്ഷണം", d: "വ്യക്തിഗത വിവരങ്ങൾ ഒരിക്കലും പരസ്യമായി കാണിക്കില്ല." },
      { t: "പരസ്യ തിരിച്ചറിയലില്ല", d: "റിപ്പോർട്ടുകളിൽ പ്രശ്നം കാണും, നിങ്ങളുടെ തിരിച്ചറിയലല്ല." },
      { t: "അനാവശ്യ ട്രാക്കിംഗില്ല", d: "ആവശ്യത്തിലധികം നിങ്ങളെ ട്രാക്ക് ചെയ്യില്ല." },
      { t: "സുരക്ഷിത തെളിവുകൾ", d: "തെളിവുകൾ നിങ്ങൾക്കും അധികാരப்பெற்ற ഉദ്യോഗസ്ഥർക്കും മാത്രം കാണാം." },
    ],
  },
  rights: {
    title: "നിങ്ങളുടെ അവകാശങ്ങൾ മനസ്സിലാക്കുക.",
    subtitle: "ലളിത ഭാഷയിൽ അറിയുക — നിങ്ങൾക്ക് എന്ത് ചെയ്യാം, ഏത് നടപടിക്രമമാണ് ബാധകം, പരാതി എങ്ങനെ ഫോളോ-അപ്പ് ചെയ്യാം.",
    disclaimer: "ഈ വിവരം പൊതു അവബോധത്തിന്; പ്രൊഫഷണൽ നിയമോപദേശത്തിന് പകരമല്ല.",
    viewAll: "എല്ലാ അവകാശങ്ങളും കാണുക",
  },
  issuesSection: {
    title: "പൊതു പ്രശ്നങ്ങളും പ്രസ്ഥാനങ്ങളും",
    subtitle: "പരിശോധിച്ചതും റിപ്പോർട്ട് ചെയ്തതുമായ പൊതു പ്രശ്നങ്ങൾ — പശ്ചാത്തലം, ആശങ്കകൾ, ഔദ്യോഗിക പ്രതികരണം, നിലവിലെ സ്ഥിതി എന്നിവയോടെ.",
    viewAll: "എല്ലാം കാണുക",
  },
  emotion: {
    headline: "ഇന്ത്യ വെറുമൊരു രാജ്യമല്ല. നമ്മളെല്ലാവരുടെയും ഉത്തരവാദിത്തമാണ്.",
    text1: "“ഒരു വിദ്യാർത്ഥിയുടെ ശബ്ദം, ഒരു കർഷകന്റെ പ്രശ്നം, ഒരു തൊഴിലാളിയുടെ വിഷമം, ഒരു കുടുംബത്തിന്റെ ആവശ്യം — ഓരോ genuine ആശങ്കയും പ്രധാനമാണ്.”",
    text2: "“സാങ്കേതികവിദ്യ ആളുകൾക്ക് ഉപകാരപ്പെടുമ്പോഴാണ് അർത്ഥവത്താകുന്നത്.”",
    cta: "ഉത്തരവാദിത്തത്തോടെ ശബ്ദമുയർത്തുക",
  },
  footer: {
    tagline: "ഹർ ആവാസ്. ഹർ ജഗഹ്. ഏക് ഇന്ത്യ.",
    platform: "പ്ലാറ്റ്ഫോം", resources: "വിഭവങ്ങൾ", languages: "ഭാഷകൾ",
    rights: "അവകാശങ്ങൾ അറിയുക", help: "സഹായം", faq: "പതിവ് ചോദ്യങ്ങൾ",
    privacy: "സ്വകാര്യത", terms: "നിബന്ധനകൾ",
    madeIn: "ഇന്ത്യൻ പൗരന്മാർക്കായി സാങ്കേതികവിദ്യയോടെ നിർമ്മിച്ചത്.",
  },
  ai: {
    title: "ജനആവാസ് AI",
    subtitle: "നിങ്ങളുടെ ഭാഷയിൽ ചോദിക്കൂ. മനസ്സിലാക്കൂ. ശരിയായ വഴി തിരഞ്ഞെടുക്കൂ.",
    placeholder: "നിങ്ങളുടെ ചോദ്യം എഴുതൂ… (മലയാളം, ഹിന്ദി അല്ലെങ്കിൽ ഇംഗ്ലീഷിൽ)",
    empty1: "നമസ്കാരം! ഞാൻ ജനആവാസ് AI ആണ്.",
    empty2: "നിങ്ങളുടെ പ്രശ്നം മനസ്സിലാക്കാനും വിവരം കണ്ടെത്താനും അടുത്ത പടി അറിയാനും എനിക്ക് സഹായിക്കാനാകും.",
    warning: "ദയവായി ചാറ്റിൽ പാസ്‌വേഡുകൾ, OTPകൾ, ആധാർ നമ്പറുകൾ, ബാങ്ക് വിവരങ്ങൾ അല്ലെങ്കിൽ മറ്റ് അതീവ സെൻസിറ്റീവ് വ്യക്തിഗത വിവരങ്ങൾ പങ്കിടരുത്.",
    createReport: "റിപ്പോർട്ട് ഉണ്ടാക്കുക", copy: "പകർത്തുക", copied: "പകർത്തി", send: "അയയ്ക്കുക",
    thinking: "ആലോചിക്കുന്നു…",
    disclaimer: "ജനആവാസ് AI civic വിവരം നൽകുന്നു — നിയമോപദേശമല്ല. പ്രധാന അവകാശവാദങ്ങൾ പരിശോധിക്കുക.",
    newChat: "പുതിയ ചാറ്റ്",
    suggestions: [
      "എന്റെ പ്രദേശത്തെ പ്രശ്നം റിപ്പോർട്ട് ചെയ്യണം.",
      "എന്റെ പരാതിയുടെ സ്ഥിതി അറിയണം.",
      "റോഡ്/വെള്ളം/വൈദ്യുതി പരാതി എങ്ങനെ നൽകാം?",
      "RTI എന്താണ്?",
      "എന്റെ കൈയിൽ ഒരു സർക്കാർ നോട്ടീസ് ഉണ്ട്, വിശദീകരിക്കൂ.",
      "സർക്കാർ പദ്ധതിയെക്കുറിച്ച് പറയൂ.",
    ],
  },
  track: {
    title: "നിങ്ങളുടെ പരാതി എവിടെയെത്തി?",
    subtitle: "നിങ്ങളുടെ റിപ്പോർട്ട് ID (ഉദാ. JA-10001) നൽകി തത്സമയ സ്ഥിതി കാണുക.",
    enterId: "റിപ്പോർട്ട് ID", trackBtn: "ട്രാക്ക് ചെയ്യുക",
  },
  common: {
    search: "തിരയുക", searchPh: "റിപ്പോർട്ടുകൾ, പ്രശ്നങ്ങൾ, അവകാശങ്ങൾ തിരയുക…", all: "എല്ലാം",
    viewAll: "എല്ലാം കാണുക", learnMore: "കൂടുതൽ അറിയുക", loading: "ലോഡ് ചെയ്യുന്നു…",
    retry: "വീണ്ടും ശ്രമിക്കുക", cancel: "റദ്ദാക്കുക", save: "സേവ്", edit: "തിരുത്തുക",
    submit: "സമർപ്പിക്കുക", back: "പിന്നോട്ട്", next: "അടുത്തത്", close: "അടയ്ക്കുക",
    optional: "ഓപ്ഷണൽ", required: "ആവശ്യം",
  },
  status: {
    REPORTED: "റിപ്പോർട്ട് ചെയ്തു", AUTHORITY_IDENTIFIED: "അധികാരി തിരിച്ചറിഞ്ഞു",
    SUBMITTED: "സമർപ്പിച്ചു", ACKNOWLEDGED: "അംഗീകരിച്ചു",
    UNDER_REVIEW: "അവലോകനത്തിൽ", ACTION_TAKEN: "നടപടി എടുത്തു",
    RESOLVED: "പരിഹരിച്ചു", REJECTED: "നിരസിച്ചു",
  },
  category: {
    WATER: "കുടിവെള്ള വിതരണം", ROADS: "റോഡുകൾ", ELECTRICITY: "വൈദ്യുതി",
    GARBAGE: "മാലിന്യം", DRAINAGE: "ഡ്രെയിനേജ്", EDUCATION: "വിദ്യാഭ്യാസം",
    HEALTHCARE: "ആരോഗ്യം", TRANSPORT: "ഗതാഗതം", ENVIRONMENT: "പരിസ്ഥിതി",
    PUBLIC_SERVICES: "പൊതു സേവനങ്ങൾ", EMPLOYMENT: "തൊഴിൽ",
    INFRASTRUCTURE: "അടിസ്ഥാന സൗകര്യം", DOCUMENTATION: "രേഖകൾ",
    SAFETY: "പൊതു സുരക്ഷ", RIGHTS: "അവകാശങ്ങൾ / പൗര നടപടി", OTHER: "മറ്റുള്ളവ",
  },
};

// ─── Punjabi (ਪੰਜਾਬੀ) ───────────────────────────────────────────────────────
export const pa: Dict = {
  nav: {
    home: "ਹੋਮ", explore: "ਐਕਸਪਲੋਰ", report: "ਰਿਪੋਰਟ", map: "ਭਾਰਤ ਨਕਸ਼ਾ",
    issues: "ਲੋਕ ਮੁੱਦੇ", rights: "ਹੱਕ ਜਾਣੋ", ai: "AI ਸਹਾਇਕ",
    dashboard: "ਡੈਸ਼ਬੋਰਡ", language: "ਭਾਸ਼ਾ", notifications: "ਸੂਚਨਾਵਾਂ",
    reportProblem: "ਸਮੱਸਿਆ ਰਿਪੋਰਟ ਕਰੋ", profile: "ਪ੍ਰੋਫਾਈਲ", myReports: "ਮੇਰੀਆਂ ਰਿਪੋਰਟਾਂ",
    saved: "ਸੇਵ ਕੀਤੇ ਮੁੱਦੇ", privacy: "ਪਰਾਈਵੇਸੀ", logout: "ਲੌਗਆਉਟ",
    login: "ਲੌਗਿਨ", register: "ਸਾਈਨ ਅੱਪ",
  },
  hero: {
    badge: "ਭਾਰਤ ਦੇ ਹਰ ਨਾਗਰਿਕ ਲਈ",
    title: "ਹਰ ਆਵਾਜ਼। ਹਰ ਜਗ੍ਹਾ। ਇੱਕ ਇੰਡੀਆ।",
    subtitle: "ਤੁਹਾਡੇ ਇਲਾਕੇ ਵਿੱਚ ਕੀ ਹੋ ਰਿਹਾ ਹੈ? ਜਾਣੋ। ਆਪਣੀ ਸਮੱਸਿਆ ਰਿਪੋਰਟ ਕਰੋ। ਆਪਣੇ ਹੱਕ ਸਮਝੋ। ਅਤੇ ਹੱਲ ਦਾ ਰਸਤਾ ਵੇਖੋ।",
    reportBtn: "ਸਮੱਸਿਆ ਰਿਪੋਰਟ ਕਰੋ", exploreBtn: "ਇੰਡੀਆ ਐਕਸਪਲੋਰ ਕਰੋ",
    seeHappening: "ਵੇਖੋ ਕੀ ਹੋ ਰਿਹਾ ਹੈ",
    trust1: "ਪਰਾਈਵੇਸੀ ਪਹਿਲਾਂ", trust2: "ਬਹੁਭਾਸ਼ੀ", trust3: "ਨਾਗਰਿਕ ਕੇਂਦਰਿਤ",
  },
  stats: {
    title: "ਇੰਡੀਆ ਬੋਲਦਾ ਹੈ। ਜਨਆਵਾਜ਼ ਸੁਣਦਾ ਹੈ।",
    subtitle: "ਦੇਸ਼ ਭਰ ਦੇ ਨਾਗਰਿਕ ਮੁੱਦੇ ਰਿਪੋਰਟ ਕਰ ਰਹੇ ਹਨ, ਤਰੱਕੀ ਟਰੈਕ ਕਰ ਰਹੇ ਹਨ ਅਤੇ ਮਿਲ ਕੇ ਹੱਲ ਲੱਭ ਰਹੇ ਹਨ।",
    reports: "ਨਾਗਰਿਕ ਰਿਪੋਰਟਾਂ", underReview: "ਸਮੀਖਿਆ ਅਧੀਨ ਮੁੱਦੇ", resolved: "ਹੱਲ ਹੋਏ ਮੁੱਦੇ",
    states: "ਕਵਰ ਕੀਤੇ ਰਾਜ", languages: "ਸਮਰਥਿਤ ਭਾਸ਼ਾਵਾਂ",
    demoNote: "ਡੈਮੋ ਡੇਟਾ — ਲਾਈਵ ਸਰਕਾਰੀ ਅੰਕੜੇ ਨਹੀਂ",
  },
  langSection: {
    title: "ਆਪਣੀ ਭਾਸ਼ਾ ਵਿੱਚ ਆਪਣੀ ਗੱਲ।",
    subtitle: "ਭਾਰਤ ਦੀ ਹਰ ਭਾਸ਼ਾ ਮਹੱਤਵਪੂਰਨ ਹੈ। ਜਨਆਵਾਜ਼ 'ਤੇ ਉਹੀ ਭਾਸ਼ਾ ਵਰਤੋ ਜਿਸ ਵਿੱਚ ਤੁਸੀਂ ਸਹਿਜ ਹੋ।",
    note: "ਤੁਹਾਡੀ ਚੁਣੀ ਭਾਸ਼ਾ ਨੈਵੀਗੇਸ਼ਨ, ਫਾਰਮ, ਰਿਪੋਰਟਾਂ, AI ਸਹਾਇਕ, ਹੱਕਾਂ ਦੀ ਜਾਣਕਾਰੀ ਅਤੇ ਸੂਚਨਾਵਾਂ ਵਿੱਚ ਲਾਗੂ ਹੁੰਦੀ ਹੈ।",
  },
  happening: {
    title: "ਭਾਰਤ ਵਿੱਚ ਕੀ ਚੱਲ ਰਿਹਾ ਹੈ?",
    subtitle: "ਇੱਕ ਜਗ੍ਹਾ ਤੋਂ ਵੇਖੋ — ਕਿਸ ਇਲਾਕੇ ਵਿੱਚ ਕੀ ਮੁੱਦਾ ਹੈ, ਲੋਕ ਕਿਹੜੀ ਚਿੰਤਾ ਉਠਾ ਰਹੇ ਹਨ ਅਤੇ ਮੌਜੂਦਾ ਸਥਿਤੀ ਕੀ ਹੈ।",
    viewMap: "ਇੰਟਰਐਕਟਿਵ ਨਕਸ਼ਾ ਖੋਲ੍ਹੋ",
  },
  reportCta: {
    title: "ਸਮੱਸਿਆ ਹੈ? ਰਿਪੋਰਟ ਕਰੋ।",
    subtitle: "ਆਪਣੇ ਇਲਾਕੇ ਦੀ civic ਸਮੱਸਿਆ 2 ਮਿੰਟ ਵਿੱਚ ਰਿਪੋਰਟ ਕਰੋ। ਫੋਟੋ ਜਾਂ ਵੀਡੀਓ ਸਬੂਤ ਨਾਲ — ਅਤੇ ਤਰੱਕੀ ਟਰੈਕ ਕਰੋ।",
    start: "ਰਿਪੋਰਟ ਸ਼ੁਰੂ ਕਰੋ",
    categoriesNote: "16 ਸ਼੍ਰੇਣੀਆਂ • ਫੋਟੋ/ਵੀਡੀਓ ਸਬੂਤ • ਤਰੱਕੀ ਟਰੈਕਿੰਗ",
  },
  evidence: {
    title: "ਸਿਰਫ਼ ਗੱਲ ਨਹੀਂ — ਸਬੂਤ ਵੀ।",
    subtitle: "ਫੋਟੋ, ਵੀਡੀਓ, ਦਸਤਾਵੇਜ਼ ਜਾਂ ਵੌਇਸ ਨੋਟ ਨਾਲ ਆਪਣੀ ਰਿਪੋਰਟ ਮਜ਼ਬੂਤ ਬਣਾਓ। ਤੁਹਾਡਾ ਸਬੂਤ ਸੁਰੱਖਿਅਤ ਅਤੇ ਨਿੱਜੀ ਰਹਿੰਦਾ ਹੈ।",
  },
  privacy: {
    title: "ਤੁਹਾਡੀ ਪਰਾਈਵੇਸੀ, ਤੁਹਾਡਾ ਹੱਕ।",
    subtitle: "ਜਨਤਕ ਸਮੱਸਿਆ ਦਿਖਣੀ ਚਾਹੀਦੀ ਹੈ — ਨਾਗਰਿਕ ਦੀ ਨਿੱਜੀ ਪਛਾਣ ਨਹੀਂ।",
    statement: "“ਜਨਤਕ ਸਮੱਸਿਆ ਦਿਖਣੀ ਚਾਹੀਦੀ ਹੈ — ਨਾਗਰਿਕ ਦੀ ਨਿੱਜੀ ਪਛਾਣ ਨਹੀਂ।”",
    cards: [
      { t: "ਸੁਰੱਖਿਅਤ ਡੇਟਾ", d: "ਤੁਹਾਡਾ ਡੇਟਾ ਐਨਕ੍ਰਿਪਟ ਕਰਕੇ ਸੁਰੱਖਿਅਤ ਰੱਖਿਆ ਜਾਂਦਾ ਹੈ।" },
      { t: "ਪਰਾਈਵੇਸੀ ਸੁਰੱਖਿਆ", d: "ਨਿੱਜੀ ਜਾਣਕਾਰੀ ਕਦੇ ਜਨਤਕ ਨਹੀਂ ਦਿਖਾਈ ਜਾਂਦੀ।" },
      { t: "ਕੋਈ ਜਨਤਕ ਪਛਾਣ ਨਹੀਂ", d: "ਰਿਪੋਰਟ ਵਿੱਚ ਮੁੱਦਾ ਦਿਸਦਾ ਹੈ, ਤੁਹਾਡੀ ਪਛਾਣ ਨਹੀਂ।" },
      { t: "ਬੇਲੋੜੀ ਟਰੈਕਿੰਗ ਨਹੀਂ", d: "ਲੋੜ ਤੋਂ ਵੱਧ ਅਸੀਂ ਤੁਹਾਨੂੰ ਟਰੈਕ ਨਹੀਂ ਕਰਦੇ।" },
      { t: "ਸੁਰੱਖਿਅਤ ਸਬੂਤ", d: "ਸਬੂਤ ਸਿਰਫ਼ ਤੁਹਾਨੂੰ ਅਤੇ ਅਧਿਕਾਰਤ ਅਫ਼ਸਰਾਂ ਨੂੰ ਦਿਸਦਾ ਹੈ।" },
    ],
  },
  rights: {
    title: "ਆਪਣੇ ਹੱਕ ਸਮਝੋ।",
    subtitle: "ਸਰਲ ਭਾਸ਼ਾ ਵਿੱਚ ਜਾਣੋ — ਤੁਸੀਂ ਕੀ ਕਰ ਸਕਦੇ ਹੋ, ਕਿਹੜੀ ਪ੍ਰਕਿਰਿਆ ਲਾਗੂ ਹੁੰਦੀ ਹੈ, ਅਤੇ ਸ਼ਿਕਾਇਤ ਦਾ ਫਾਲੋ-ਅੱਪ ਕਿਵੇਂ ਕਰਨਾ ਹੈ।",
    disclaimer: "ਇਹ ਜਾਣਕਾਰੀ ਆਮ ਜਾਗਰੂਕਤਾ ਲਈ ਹੈ; ਪੇਸ਼ੇਵਰ ਕਾਨੂੰਨੀ ਸਲਾਹ ਦਾ ਬਦਲ ਨਹੀਂ।",
    viewAll: "ਸਾਰੇ ਹੱਕ ਵੇਖੋ",
  },
  issuesSection: {
    title: "ਲੋਕ ਮੁੱਦੇ ਅਤੇ ਅੰਦੋਲਨ",
    subtitle: "ਪ੍ਰਮਾਣਿਤ ਅਤੇ ਰਿਪੋਰਟ ਕੀਤੇ ਲੋਕ ਮੁੱਦੇ — ਪਿਛੋਕੜ, ਚਿੰਤਾਵਾਂ, ਅਧਿਕਾਰਤ ਜਵਾਬ ਅਤੇ ਮੌਜੂਦਾ ਸਥਿਤੀ ਨਾਲ।",
    viewAll: "ਸਾਰੇ ਮੁੱਦੇ ਵੇਖੋ",
  },
  emotion: {
    headline: "ਇੰਡੀਆ ਸਿਰਫ਼ ਇੱਕ ਦੇਸ਼ ਨਹੀਂ। ਇਹ ਸਾਡੀ ਸਭ ਦੀ ਜ਼ਿੰਮੇਵਾਰੀ ਹੈ।",
    text1: "“ਇੱਕ ਵਿਦਿਆਰਥੀ ਦੀ ਆਵਾਜ਼, ਇੱਕ ਕਿਸਾਨ ਦੀ ਸਮੱਸਿਆ, ਇੱਕ ਮਜ਼ਦੂਰ ਦੀ ਪਰੇਸ਼ਾਨੀ, ਇੱਕ ਪਰਿਵਾਰ ਦੀ ਲੋੜ — ਹਰ genuine ਚਿੰਤਾ ਮਹੱਤਵਪੂਰਨ ਹੈ।”",
    text2: "“ਤਕਨਾਲੋਜੀ ਤਦ ਹੀ ਅਰਥਪੂਰਨ ਜਦ ਉਹ ਲੋਕਾਂ ਦੇ ਕੰਮ ਆਵੇ।”",
    cta: "ਜ਼ਿੰਮੇਵਾਰੀ ਨਾਲ ਆਵਾਜ਼ ਉਠਾਓ",
  },
  footer: {
    tagline: "ਹਰ ਆਵਾਜ਼। ਹਰ ਜਗ੍ਹਾ। ਇੱਕ ਇੰਡੀਆ।",
    platform: "ਪਲੇਟਫਾਰਮ", resources: "ਸਰੋਤ", languages: "ਭਾਸ਼ਾਵਾਂ",
    rights: "ਹੱਕ ਜਾਣੋ", help: "ਮਦਦ", faq: "ਆਮ ਸਵਾਲ",
    privacy: "ਪਰਾਈਵੇਸੀ", terms: "ਨਿਯਮ",
    madeIn: "ਭਾਰਤ ਦੇ ਨਾਗਰਿਕਾਂ ਲਈ ਤਕਨਾਲੋਜੀ ਨਾਲ ਬਣਾਇਆ।",
  },
  ai: {
    title: "ਜਨਆਵਾਜ਼ AI",
    subtitle: "ਆਪਣੀ ਭਾਸ਼ਾ ਵਿੱਚ ਪੁੱਛੋ। ਸਮਝੋ। ਸਹੀ ਰਸਤਾ ਚੁਣੋ।",
    placeholder: "ਆਪਣਾ ਸਵਾਲ ਲਿਖੋ… (ਪੰਜਾਬੀ, ਹਿੰਦੀ ਜਾਂ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ)",
    empty1: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਜਨਆਵਾਜ਼ AI ਹਾਂ।",
    empty2: "ਤੁਹਾਡੀ ਸਮੱਸਿਆ ਸਮਝਣ, ਜਾਣਕਾਰੀ ਲੱਭਣ ਅਤੇ ਅਗਲਾ ਕਦਮ ਸਮਝਣ ਵਿੱਚ ਮੈਂ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ।",
    warning: "ਕਿਰਪਾ ਕਰਕੇ ਚੈਟ ਵਿੱਚ ਪਾਸਵਰਡ, OTP, ਆਧਾਰ ਨੰਬਰ, ਬੈਂਕ ਵੇਰਵੇ ਜਾਂ ਹੋਰ ਬਹੁਤ ਸੰਵੇਦਨਸ਼ੀਲ ਨਿੱਜੀ ਜਾਣਕਾਰੀ ਸਾਂਝੀ ਨਾ ਕਰੋ।",
    createReport: "ਰਿਪੋਰਟ ਬਣਾਓ", copy: "ਕਾਪੀ", copied: "ਕਾਪੀ ਹੋਇਆ", send: "ਭੇਜੋ",
    thinking: "ਸੋਚ ਰਿਹਾ ਹਾਂ…",
    disclaimer: "ਜਨਆਵਾਜ਼ AI civic ਜਾਣਕਾਰੀ ਦਿੰਦਾ ਹੈ — ਕਾਨੂੰਨੀ ਸਲਾਹ ਨਹੀਂ। ਮਹੱਤਵਪੂਰਨ ਦਾਅਵਿਆਂ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ।",
    newChat: "ਨਵੀਂ ਚੈਟ",
    suggestions: [
      "ਮੇਰੇ ਇਲਾਕੇ ਦੀ ਸਮੱਸਿਆ ਰਿਪੋਰਟ ਕਰਨੀ ਹੈ।",
      "ਮੇਰੀ ਸ਼ਿਕਾਇਤ ਦਾ ਸਟੇਟਸ ਸਮਝਣਾ ਹੈ।",
      "ਸੜਕ/ਪਾਣੀ/ਬਿਜਲੀ ਦੀ ਸ਼ਿਕਾਇਤ ਕਿਵੇਂ ਕਰੀਏ?",
      "RTI ਕੀ ਹੁੰਦਾ ਹੈ?",
      "ਮੇਰੇ ਕੋਲ ਇੱਕ ਸਰਕਾਰੀ ਨੋਟਿਸ ਹੈ, ਸਮਝਾਓ।",
      "ਸਰਕਾਰੀ ਸਕੀਮ ਬਾਰੇ ਦੱਸੋ।",
    ],
  },
  track: {
    title: "ਤੁਹਾਡੀ ਸ਼ਿਕਾਇਤ ਕਿੱਥੇ ਪਹੁੰਚੀ?",
    subtitle: "ਆਪਣਾ ਰਿਪੋਰਟ ID (ਜਿਵੇਂ JA-10001) ਪਾ ਕੇ ਲਾਈਵ ਸਟੇਟਸ ਵੇਖੋ।",
    enterId: "ਰਿਪੋਰਟ ID", trackBtn: "ਟਰੈਕ ਕਰੋ",
  },
  common: {
    search: "ਖੋਜੋ", searchPh: "ਰਿਪੋਰਟਾਂ, ਮੁੱਦੇ, ਹੱਕ ਖੋਜੋ…", all: "ਸਭ",
    viewAll: "ਸਭ ਵੇਖੋ", learnMore: "ਹੋਰ ਜਾਣੋ", loading: "ਲੋਡ ਹੋ ਰਿਹਾ…",
    retry: "ਮੁੜ ਕੋਸ਼ਿਸ਼", cancel: "ਰੱਦ ਕਰੋ", save: "ਸੇਵ ਕਰੋ", edit: "ਐਡਿਟ",
    submit: "ਸਬਮਿਟ", back: "ਪਿੱਛੇ", next: "ਅੱਗੇ", close: "ਬੰਦ ਕਰੋ",
    optional: "ਵਿਕਲਪਿਕ", required: "ਲੋੜੀਂਦਾ",
  },
  status: {
    REPORTED: "ਰਿਪੋਰਟ ਕੀਤਾ", AUTHORITY_IDENTIFIED: "ਅਥਾਰਟੀ ਪਛਾਣੀ",
    SUBMITTED: "ਜਮ੍ਹਾਂ ਕੀਤਾ", ACKNOWLEDGED: "ਸਵੀਕਾਰ ਕੀਤਾ",
    UNDER_REVIEW: "ਸਮੀਖਿਆ ਅਧੀਨ", ACTION_TAKEN: "ਕਾਰਵਾਈ ਹੋਈ",
    RESOLVED: "ਹੱਲ ਹੋਇਆ", REJECTED: "ਰੱਦ",
  },
  category: {
    WATER: "ਪਾਣੀ ਸਪਲਾਈ", ROADS: "ਸੜਕਾਂ", ELECTRICITY: "ਬਿਜਲੀ",
    GARBAGE: "ਕੂੜਾ", DRAINAGE: "ਡਰੇਨੇਜ", EDUCATION: "ਸਿੱਖਿਆ",
    HEALTHCARE: "ਸਿਹਤ", TRANSPORT: "ਆਵਾਜਾਈ", ENVIRONMENT: "ਵਾਤਾਵਰਣ",
    PUBLIC_SERVICES: "ਲੋਕ ਸੇਵਾਵਾਂ", EMPLOYMENT: "ਰੁਜ਼ਗਾਰ",
    INFRASTRUCTURE: "ਬੁਨਿਆਦੀ ਢਾਂਚਾ", DOCUMENTATION: "ਦਸਤਾਵੇਜ਼",
    SAFETY: "ਲੋਕ ਸੁਰੱਖਿਆ", RIGHTS: "ਹੱਕ / ਨਾਗਰਿਕ ਪ੍ਰਕਿਰਿਆ", OTHER: "ਹੋਰ",
  },
};

// ─── Odia (ଓଡ଼ିଆ) ──────────────────────────────────────────────────────────
export const or: Dict = {
  nav: {
    home: "ହୋମ୍", explore: "ଏକ୍ସପ୍ଲୋର୍", report: "ରିପୋର୍ଟ", map: "ଭାରତ ମାନଚିତ୍ର",
    issues: "ଜନ ପ୍ରସଙ୍ଗ", rights: "ଅଧିକାର ଜାଣନ୍ତୁ", ai: "AI ସହାୟକ",
    dashboard: "ଡ୍ୟାସବୋର୍ଡ", language: "ଭାଷା", notifications: "ବିଜ୍ଞପ୍ତି",
    reportProblem: "ସମସ୍ୟା ରିପୋର୍ଟ କରନ୍ତୁ", profile: "ପ୍ରୋଫାଇଲ୍", myReports: "ମୋ ରିପୋର୍ଟ",
    saved: "ସଞ୍ଚିତ ପ୍ରସଙ୍ଗ", privacy: "ଗୋପନୀୟତା", logout: "ଲଗଆଉଟ୍",
    login: "ଲଗଇନ୍", register: "ସାଇନ୍ ଅପ୍",
  },
  hero: {
    badge: "ଭାରତର ପ୍ରତ୍ୟେକ ନାଗରିକଙ୍କ ପାଇଁ",
    title: "ହର୍ ଆୱାଜ୍। ହର୍ ଜଗହ। ଏକ୍ ଇଣ୍ଡିଆ।",
    subtitle: "ଆପଣଙ୍କ ଅଞ୍ଚଳରେ କଣ ଘଟୁଛି? ଜାଣନ୍ତୁ। ଆପଣଙ୍କ ସମସ୍ୟା ରିପୋର୍ଟ କରନ୍ତୁ। ଆପଣଙ୍କ ଅଧିକାର ବୁଝନ୍ତୁ। ଆଉ ସମାଧାନର ରାସ୍ତା ଦେଖନ୍ତୁ।",
    reportBtn: "ସମସ୍ୟା ରିପୋର୍ଟ କରନ୍ତୁ", exploreBtn: "ଇଣ୍ଡିଆ ଏକ୍ସପ୍ଲୋର୍ କରନ୍ତୁ",
    seeHappening: "କଣ ଘଟୁଛି ଦେଖନ୍ତୁ",
    trust1: "ଗୋପନୀୟତା ପ୍ରଥମ", trust2: "ବହୁଭାଷୀ", trust3: "ନାଗରିକ କେନ୍ଦ୍ରିତ",
  },
  stats: {
    title: "ଇଣ୍ଡିଆ କହୁଛି। ଜନଆୱାଜ୍ ଶୁଣୁଛି।",
    subtitle: "ଦେଶସାରା ନାଗରିକମାନେ ସମସ୍ୟା ରିପୋର୍ଟ କରୁଛନ୍ତି, ଅଗ୍ରଗତି ଟ୍ରାକ୍ କରୁଛନ୍ତି ଏବଂ ମିଶି ସମାଧାନ ଖୋଜୁଛନ୍ତି।",
    reports: "ନାଗରିକ ରିପୋର୍ଟ", underReview: "ସମୀକ୍ଷାଧୀନ ପ୍ରସଙ୍ଗ", resolved: "ସମାଧାନ ହୋଇଥିବା ପ୍ରସଙ୍ଗ",
    states: "ଅନ୍ତର୍ଭୁକ୍ତ ରାଜ୍ୟ", languages: "ସମର୍ଥିତ ଭାଷା",
    demoNote: "ଡେମୋ ଡାଟା — ଲାଇଭ୍ ସରକାରୀ ପରିସଂଖ୍ୟାନ ନୁହେଁ",
  },
  langSection: {
    title: "ଆପଣଙ୍କ ଭାଷାରେ ଆପଣଙ୍କ କଥା।",
    subtitle: "ଭାରତର ପ୍ରତ୍ୟେକ ଭାଷା ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ। ଜନଆୱାଜରେ ଆପଣ ସହଜ ଥିବା ଭାଷା ହିଁ ବ୍ୟବହାର କରନ୍ତୁ।",
    note: "ଆପଣଙ୍କ ବଛା ଭାଷା ନାଭିଗେସନ୍, ଫର୍ମ, ରିପୋର୍ଟ, AI ସହାୟକ, ଅଧିକାର ସୂଚନା ଓ ବିଜ୍ଞପ୍ତିରେ ଲାଗୁ ହୁଏ।",
  },
  happening: {
    title: "ଭାରତରେ କଣ ଚାଲିଛି?",
    subtitle: "ଗୋଟିଏ ଜାଗାରୁ ଦେଖନ୍ତୁ — କେଉଁ ଅଞ୍ଚଳରେ କେଉଁ ପ୍ରସଙ୍ଗ ଅଛି, ଲୋକେ କେଉଁ ଚିନ୍ତା ଉଠାଉଛନ୍ତି ଏବଂ ବର୍ତ୍ତମାନ ସ୍ଥିତି କଣ।",
    viewMap: "ଇଣ୍ଟରାକ୍ଟିଭ୍ ମାନଚିତ୍ର ଖୋଲନ୍ତୁ",
  },
  reportCta: {
    title: "ସମସ୍ୟା ଅଛି? ରିପୋର୍ଟ କରନ୍ତୁ।",
    subtitle: "ଆପଣଙ୍କ ଅଞ୍ଚଳର civic ସମସ୍ୟା 2 ମିନିଟରେ ରିପୋର୍ଟ କରନ୍ତୁ। ଫଟୋ ବା ଭିଡିଓ ପ୍ରମାଣ ସହ — ଆଉ ଅଗ୍ରଗତି ଟ୍ରାକ୍ କରନ୍ତୁ।",
    start: "ରିପୋର୍ଟ ଆରମ୍ଭ କରନ୍ତୁ",
    categoriesNote: "16 ବର୍ଗ • ଫଟୋ/ଭିଡିଓ ପ୍ରମାଣ • ଅଗ୍ରଗତି ଟ୍ରାକିଂ",
  },
  evidence: {
    title: "କେବଳ କଥା ନୁହେଁ — ପ୍ରମାଣ ମଧ୍ୟ।",
    subtitle: "ଫଟୋ, ଭିଡିଓ, ଦଲିଲ ବା ଭଏସ୍ ନୋଟ୍ ସହ ଆପଣଙ୍କ ରିପୋର୍ଟକୁ ଦୃଢ଼ କରନ୍ତୁ। ଆପଣଙ୍କ ପ୍ରମାଣ ସୁରକ୍ଷିତ ଓ ଗୋପନୀୟ ରହେ।",
  },
  privacy: {
    title: "ଆପଣଙ୍କ ଗୋପନୀୟତା, ଆପଣଙ୍କ ଅଧିକାର।",
    subtitle: "ଜନ ସମସ୍ୟା ଦୃଶ୍ୟମାନ ହେବା ଦରକାର — ନାଗରିକଙ୍କ ବ୍ୟକ୍ତିଗତ ପରିଚୟ ନୁହେଁ।",
    statement: "“ଜନ ସମସ୍ୟା ଦୃଶ୍ୟମାନ ହେବା ଦରକାର — ନାଗରିକଙ୍କ ବ୍ୟକ୍ତିଗତ ପରିଚୟ ନୁହେଁ।”",
    cards: [
      { t: "ସୁରକ୍ଷିତ ଡାଟା", d: "ଆପଣଙ୍କ ଡାଟା ଏନକ୍ରିପ୍ଟ କରି ସୁରକ୍ଷିତ ରଖାଯାଏ।" },
      { t: "ଗୋପନୀୟତା ସୁରକ୍ଷା", d: "ବ୍ୟକ୍ତିଗତ ତଥ୍ୟ କେବେ ସାର୍ବଜନୀନ ଦେଖାଯାଏ ନାହିଁ।" },
      { t: "ସାର୍ବଜନୀନ ପରିଚୟ ନାହିଁ", d: "ରିପୋର୍ଟରେ ପ୍ରସଙ୍ଗ ଦେଖାଯାଏ, ଆପଣଙ୍କ ପରିଚୟ ନୁହେଁ।" },
      { t: "ଅନାବଶ୍ୟକ ଟ୍ରାକିଂ ନାହିଁ", d: "ଆବଶ୍ୟକତାଠୁ ଅଧିକ ଆମେ ଆପଣଙ୍କୁ ଟ୍ରାକ୍ କରୁନାହୁଁ।" },
      { t: "ସୁରକ୍ଷିତ ପ୍ରମାଣ", d: "ପ୍ରମାଣ କେବଳ ଆପଣଙ୍କୁ ଓ ଅଧିକୃତ ଅଧିକାରୀଙ୍କୁ ଦେଖାଯାଏ।" },
    ],
  },
  rights: {
    title: "ଆପଣଙ୍କ ଅଧିକାର ବୁଝନ୍ତୁ।",
    subtitle: "ସରଳ ଭାଷାରେ ଜାଣନ୍ତୁ — ଆପଣ କଣ କରିପାରିବେ, କେଉଁ ପ୍ରକ୍ରିୟା ଲାଗୁ ହୁଏ, ଆଉ ଅଭିଯୋଗର ଫଲୋ-ଅପ୍ କିପରି କରିବେ।",
    disclaimer: "ଏହି ସୂଚନା ସାଧାରଣ ସଚେତନତା ପାଇଁ; ବୃତ୍ତିଗତ ଆଇନଗତ ପରାମର୍ଶର ବିକଳ୍ପ ନୁହେଁ।",
    viewAll: "ସମସ୍ତ ଅଧିକାର ଦେଖନ୍ତୁ",
  },
  issuesSection: {
    title: "ଜନ ପ୍ରସଙ୍ଗ ଓ ଆନ୍ଦୋଳନ",
    subtitle: "ଯାଞ୍ଚିତ ଓ ରିପୋର୍ଟ ହୋଇଥିବା ଜନ ପ୍ରସଙ୍ଗ — ପୃଷ୍ଠଭୂମି, ଚିନ୍ତା, ସରକାରୀ ଉତ୍ତର ଓ ବର୍ତ୍ତମାନ ସ୍ଥିତି ସହ।",
    viewAll: "ସମସ୍ତ ପ୍ରସଙ୍ଗ ଦେଖନ୍ତୁ",
  },
  emotion: {
    headline: "ଇଣ୍ଡିଆ କେବଳ ଗୋଟିଏ ଦେଶ ନୁହେଁ। ଏହା ଆମ ସମସ୍ତଙ୍କ ଦାୟିତ୍ୱ।",
    text1: "“ଜଣେ ଛାତ୍ରଙ୍କ ସ୍ୱର, ଜଣେ ଚାଷୀଙ୍କ ସମସ୍ୟା, ଜଣେ ଶ୍ରମିକଙ୍କ କଷ୍ଟ, ଗୋଟିଏ ପରିବାରର ଆବଶ୍ୟକତା — ପ୍ରତ୍ୟେକ genuine ଚିନ୍ତା ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ।”",
    text2: "“ପ୍ରଯୁକ୍ତିବିଦ୍ୟା ସେତେବେଳେ ଅର୍ଥପୂର୍ଣ୍ଣ ଯେତେବେଳେ ତାହା ଲୋକଙ୍କ କାମରେ ଆସେ।”",
    cta: "ଦାୟିତ୍ୱର ସହ ଆପଣଙ୍କ ସ୍ୱର ଉଠାନ୍ତୁ",
  },
  footer: {
    tagline: "ହର୍ ଆୱାଜ୍। ହର୍ ଜଗହ। ଏକ୍ ଇଣ୍ଡିଆ।",
    platform: "ପ୍ଲାଟଫର୍ମ", resources: "ସମ୍ବଳ", languages: "ଭାଷା",
    rights: "ଅଧିକାର ଜାଣନ୍ତୁ", help: "ସହାୟତା", faq: "ସାଧାରଣ ପ୍ରଶ୍ନ",
    privacy: "ଗୋପନୀୟତା", terms: "ସର୍ତ୍ତାବଳୀ",
    madeIn: "ଭାରତର ନାଗରିକଙ୍କ ପାଇଁ ପ୍ରଯୁକ୍ତିବିଦ୍ୟା ସହ ନିର୍ମିତ।",
  },
  ai: {
    title: "ଜନଆୱାଜ୍ AI",
    subtitle: "ଆପଣଙ୍କ ଭାଷାରେ ପଚାରନ୍ତୁ। ବୁଝନ୍ତୁ। ସଠିକ୍ ରାସ୍ତା ବାଛନ୍ତୁ।",
    placeholder: "ଆପଣଙ୍କ ପ୍ରଶ୍ନ ଲେଖନ୍ତୁ… (ଓଡ଼ିଆ, ହିନ୍ଦୀ ବା ଇଂରାଜୀରେ)",
    empty1: "ନମସ୍କାର! ମୁଁ ଜନଆୱାଜ୍ AI।",
    empty2: "ଆପଣଙ୍କ ସମସ୍ୟା ବୁଝିବାରେ, ସୂଚନା ଖୋଜିବାରେ ଏବଂ ପରବର୍ତ୍ତୀ ପଦକ୍ଷେପ ବୁଝିବାରେ ମୁଁ ସାହାଯ୍ୟ କରିପାରିବି।",
    warning: "ଦୟାକରି ଚାଟରେ ପାସୱାର୍ଡ, OTP, ଆଧାର ନମ୍ବର, ବ୍ୟାଙ୍କ ବିବରଣୀ ବା ଅନ୍ୟ ଅତ୍ୟନ୍ତ ସମ୍ବେଦନଶୀଳ ବ୍ୟକ୍ତିଗତ ସୂଚନା ବାଣ୍ଟନ୍ତୁ ନାହିଁ।",
    createReport: "ରିପୋର୍ଟ ତିଆରି କରନ୍ତୁ", copy: "କପି", copied: "କପି ହେଲା", send: "ପଠାନ୍ତୁ",
    thinking: "ଭାବୁଛି…",
    disclaimer: "ଜନଆୱାଜ୍ AI civic ସୂଚନା ଦିଏ — ଆଇନଗତ ପରାମର୍ଶ ନୁହେଁ। ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ ଦାବି ଯାଞ୍ଚ କରନ୍ତୁ।",
    newChat: "ନୂଆ ଚାଟ୍",
    suggestions: [
      "ମୋ ଅଞ୍ଚଳର ସମସ୍ୟା ରିପୋର୍ଟ କରିବାର ଅଛି।",
      "ମୋ ଅଭିଯୋଗର ସ୍ଥିତି ବୁଝିବାର ଅଛି।",
      "ରାସ୍ତା/ପାଣି/ବିଜୁଳି ଅଭିଯୋଗ କିପରି କରିବି?",
      "RTI କଣ?",
      "ମୋ ପାଖରେ ଏକ ସରକାରୀ ନୋଟିସ୍ ଅଛି, ବୁଝାନ୍ତୁ।",
      "ସରକାରୀ ଯୋଜନା ବିଷୟରେ କୁହନ୍ତୁ।",
    ],
  },
  track: {
    title: "ଆପଣଙ୍କ ଅଭିଯୋଗ କେଉଁଠି ପହଞ୍ଚିଲା?",
    subtitle: "ଆପଣଙ୍କ ରିପୋର୍ଟ ID (ଯେପରି JA-10001) ଦେଇ ଲାଇଭ୍ ସ୍ଥିତି ଦେଖନ୍ତୁ।",
    enterId: "ରିପୋର୍ଟ ID", trackBtn: "ଟ୍ରାକ୍ କରନ୍ତୁ",
  },
  common: {
    search: "ଖୋଜନ୍ତୁ", searchPh: "ରିପୋର୍ଟ, ପ୍ରସଙ୍ଗ, ଅଧିକାର ଖୋଜନ୍ତୁ…", all: "ସମସ୍ତ",
    viewAll: "ସମସ୍ତ ଦେଖନ୍ତୁ", learnMore: "ଅଧିକ ଜାଣନ୍ତୁ", loading: "ଲୋଡ୍ ହେଉଛି…",
    retry: "ପୁଣି ଚେଷ୍ଟା", cancel: "ବାତିଲ୍", save: "ସେଭ୍", edit: "ଏଡିଟ୍",
    submit: "ଦାଖଲ", back: "ପଛକୁ", next: "ପରବର୍ତ୍ତୀ", close: "ବନ୍ଦ କରନ୍ତୁ",
    optional: "ଐଚ୍ଛିକ", required: "ଆବଶ୍ୟକ",
  },
  status: {
    REPORTED: "ରିପୋର୍ଟ ହେଲା", AUTHORITY_IDENTIFIED: "କର୍ତ୍ତୃପକ୍ଷ ଚିହ୍ନଟ",
    SUBMITTED: "ଦାଖଲ ହେଲା", ACKNOWLEDGED: "ଗ୍ରହଣ ହେଲା",
    UNDER_REVIEW: "ସମୀକ୍ଷାଧୀନ", ACTION_TAKEN: "କାର୍ଯ୍ୟାନୁଷ୍ଠାନ",
    RESOLVED: "ସମାଧାନ", REJECTED: "ଖାରଜ",
  },
  category: {
    WATER: "ଜଳ ଯୋଗାଣ", ROADS: "ରାସ୍ତା", ELECTRICITY: "ବିଦ୍ୟୁତ୍",
    GARBAGE: "ଅଳିଆ", DRAINAGE: "ଡ୍ରେନେଜ୍", EDUCATION: "ଶିକ୍ଷା",
    HEALTHCARE: "ସ୍ୱାସ୍ଥ୍ୟ", TRANSPORT: "ପରିବହନ", ENVIRONMENT: "ପରିବେଶ",
    PUBLIC_SERVICES: "ଜନ ସେବା", EMPLOYMENT: "ନିଯୁକ୍ତି",
    INFRASTRUCTURE: "ଭିତ୍ତିଭୂମି", DOCUMENTATION: "ଦଲିଲ",
    SAFETY: "ଜନ ସୁରକ୍ଷା", RIGHTS: "ଅଧିକାର / ନାଗରିକ ପ୍ରକ୍ରିୟା", OTHER: "ଅନ୍ୟ",
  },
};

// ─── Assamese (অসমীয়া) ──────────────────────────────────────────────────────
export const as: Dict = {
  nav: {
    home: "হোম", explore: "এক্সপ্ল’ৰ", report: "ৰিপ’ৰ্ট", map: "ভাৰত মানচিত্ৰ",
    issues: "জন সমস্যা", rights: "অধিকাৰ জানক", ai: "AI সহায়ক",
    dashboard: "ডেশ্ব’ৰ্ড", language: "ভাষা", notifications: "জাননী",
    reportProblem: "সমস্যা ৰিপ’ৰ্ট কৰক", profile: "প্ৰ’ফাইল", myReports: "মোৰ ৰিপ’ৰ্ট",
    saved: "সংৰক্ষিত বিষয়", privacy: "গোপনীয়তা", logout: "লগআউট",
    login: "লগইন", register: "চাইন আপ",
  },
  hero: {
    badge: "ভাৰতৰ প্ৰতিজন নাগৰিকৰ বাবে",
    title: "হৰ আৱাজ। হৰ জাগাহ। এক ইণ্ডিয়া।",
    subtitle: "আপোনাৰ এলেকাত কি হৈ আছে? জানক। আপোনাৰ সমস্যা ৰিপ’ৰ্ট কৰক। আপোনাৰ অধিকাৰ বুজক। আৰু সমাধানৰ বাট চাওক।",
    reportBtn: "সমস্যা ৰিপ’ৰ্ট কৰক", exploreBtn: "ইণ্ডিয়া এক্সপ্ল’ৰ কৰক",
    seeHappening: "কি হৈ আছে চাওক",
    trust1: "গোপনীয়তা প্ৰথম", trust2: "বহুভাষিক", trust3: "নাগৰিক কেন্দ্ৰিক",
  },
  stats: {
    title: "ইণ্ডিয়াই কৈ আছে। জনআৱাজে শুনি আছে।",
    subtitle: "দেশজুৰি নাগৰিকে সমস্যা ৰিপ’ৰ্ট কৰি আছে, অগ্ৰগতি ট্ৰেক কৰি আছে আৰু একেলগে সমাধান বিচাৰি আছে।",
    reports: "নাগৰিক ৰিপ’ৰ্ট", underReview: "পৰ্যালোচনাধীন বিষয়", resolved: "সমাধান হোৱা বিষয়",
    states: "সামৰি লোৱা ৰাজ্য", languages: "সমৰ্থিত ভাষা",
    demoNote: "ডেম’ ডেটা — লাইভ চৰকাৰী পৰিসংখ্যা নহয়",
  },
  langSection: {
    title: "আপোনাৰ ভাষাত আপোনাৰ কথা।",
    subtitle: "ভাৰতৰ প্ৰতিটো ভাষাই গুৰুত্বপূৰ্ণ। জনআৱাজত আপুনি স্বচ্ছন্দ হোৱা ভাষাটোৱেই ব্যৱহাৰ কৰক।",
    note: "আপোনাৰ বাছনি কৰা ভাষা নেভিগেশ্যন, ফৰ্ম, ৰিপ’ৰ্ট, AI সহায়ক, অধিকাৰ তথ্য আৰু জাননীত প্ৰযোজ্য।",
  },
  happening: {
    title: "ভাৰতত কি চলি আছে?",
    subtitle: "এক ঠাইৰ পৰা চাওক — কোন এলেকাত কি সমস্যা আছে, মানুহে কি উদ্বেগ তুলিছে আৰু বৰ্তমান অৱস্থা কি।",
    viewMap: "ইণ্টাৰেক্টিভ মানচিত্ৰ খোলক",
  },
  reportCta: {
    title: "সমস্যা আছে? ৰিপ’ৰ্ট কৰক।",
    subtitle: "আপোনাৰ এলেকাৰ civic সমস্যা ২ মিনিটত ৰিপ’ৰ্ট কৰক। ফটো বা ভিডিঅ’ প্ৰমাণসহ — আৰু অগ্ৰগতি ট্ৰেক কৰক।",
    start: "ৰিপ’ৰ্ট আৰম্ভ কৰক",
    categoriesNote: "১৬টা শ্ৰেণী • ফটো/ভিডিঅ’ প্ৰমাণ • অগ্ৰগতি ট্ৰেকিং",
  },
  evidence: {
    title: "শুধু কথা নহয় — প্ৰমাণো।",
    subtitle: "ফটো, ভিডিঅ’, নথি বা ভইচ ন’টেৰে আপোনাৰ ৰিপ’ৰ্ট শক্তিশালী কৰক। আপোনাৰ প্ৰমাণ নিৰাপদ আৰু ব্যক্তিগত থাকে।",
  },
  privacy: {
    title: "আপোনাৰ গোপনীয়তা, আপোনাৰ অধিকাৰ।",
    subtitle: "ৰাজহুৱা সমস্যা দৃশ্যমান হ’ব লাগে — নাগৰিকৰ ব্যক্তিগত পৰিচয় নহয়।",
    statement: "“ৰাজহুৱা সমস্যা দৃশ্যমান হ’ব লাগে — নাগৰিকৰ ব্যক্তিগত পৰিচয় নহয়।”",
    cards: [
      { t: "নিৰাপদ ডেটা", d: "আপোনাৰ ডেটা এনক্ৰিপ্ট কৰি নিৰাপদে ৰখা হয়।" },
      { t: "গোপনীয়তা সুৰক্ষা", d: "ব্যক্তিগত তথ্য কেতিয়াও ৰাজহুৱাকৈ দেখুওৱা নহয়।" },
      { t: "ৰাজহুৱা পৰিচয় নাই", d: "ৰিপ’ৰ্টত সমস্যা দেখা যায়, আপোনাৰ পৰিচয় নহয়।" },
      { t: "অপ্ৰয়োজনীয় ট্ৰেকিং নাই", d: "প্ৰয়োজনতকৈ বেছি আমি আপোনাক ট্ৰেক নকৰোঁ।" },
      { t: "নিৰাপদ প্ৰমাণ", d: "প্ৰমাণ কেৱল আপোনাক আৰু অনুমোদিত বিষয়াক দেখা যায়।" },
    ],
  },
  rights: {
    title: "আপোনাৰ অধিকাৰ বুজক।",
    subtitle: "সহজ ভাষাত জানক — আপুনি কি কৰিব পাৰে, কোন প্ৰক্ৰিয়া প্ৰযোজ্য, আৰু অভিযোগৰ ফ’ল’-আপ কেনেকৈ কৰিব।",
    disclaimer: "এই তথ্য সাধাৰণ সজাগতাৰ বাবে; পেছাদাৰী আইনী পৰামৰ্শৰ বিকল্প নহয়।",
    viewAll: "সকলো অধিকাৰ চাওক",
  },
  issuesSection: {
    title: "জন সমস্যা আৰু আন্দোলন",
    subtitle: "পৰীক্ষিত আৰু ৰিপ’ৰ্ট কৰা জন সমস্যা — পটভূমি, উদ্বেগ, চৰকাৰী সঁহাৰি আৰু বৰ্তমান অৱস্থাসহ।",
    viewAll: "সকলো বিষয় চাওক",
  },
  emotion: {
    headline: "ইণ্ডিয়া মাথোঁ এখন দেশ নহয়। এয়া আমাৰ সকলোৰে দায়িত্ব।",
    text1: "“এজন ছাত্ৰৰ মাত, এজন কৃষকৰ সমস্যা, এজন শ্ৰমিকৰ কষ্ট, এটা পৰিয়ালৰ প্ৰয়োজন — প্ৰতিটো genuine উদ্বেগ গুৰুত্বপূৰ্ণ।”",
    text2: "“প্ৰযুক্তি তেতিয়াহে অৰ্থপূৰ্ণ যেতিয়া সি মানুহৰ কামত আহে।”",
    cta: "দায়িত্বেৰে আপোনাৰ মাত তোলক",
  },
  footer: {
    tagline: "হৰ আৱাজ। হৰ জাগাহ। এক ইণ্ডিয়া।",
    platform: "প্লেটফৰ্ম", resources: "সম্পদ", languages: "ভাষা",
    rights: "অধিকাৰ জানক", help: "সহায়", faq: "সাধাৰণ প্ৰশ্ন",
    privacy: "গোপনীয়তা", terms: "চৰ্তাৱলী",
    madeIn: "ভাৰতৰ নাগৰিকৰ বাবে প্ৰযুক্তিৰে নিৰ্মিত।",
  },
  ai: {
    title: "জনআৱাজ AI",
    subtitle: "আপোনাৰ ভাষাত সুধক। বুজক। শুদ্ধ বাট বাছক।",
    placeholder: "আপোনাৰ প্ৰশ্ন লিখক… (অসমীয়া, হিন্দী বা ইংৰাজীত)",
    empty1: "নমস্কাৰ! মই জনআৱাজ AI।",
    empty2: "আপোনাৰ সমস্যা বুজাত, তথ্য বিচৰাত আৰু পৰৱৰ্তী পদক্ষেপ বুজাত মই সহায় কৰিব পাৰোঁ।",
    warning: "অনুগ্ৰহ কৰি চাটত পাছৱৰ্ড, OTP, আধাৰ নম্বৰ, বেংক বিৱৰণ বা অন্য অত্যন্ত সংবেদনশীল ব্যক্তিগত তথ্য ভাগ নকৰিব।",
    createReport: "ৰিপ’ৰ্ট বনাওক", copy: "কপি", copied: "কপি হ’ল", send: "পঠাওক",
    thinking: "ভাবি আছোঁ…",
    disclaimer: "জনআৱাজ AI civic তথ্য দিয়ে — আইনী পৰামৰ্শ নহয়। গুৰুত্বপূৰ্ণ দাবী পৰীক্ষা কৰক।",
    newChat: "নতুন চাট",
    suggestions: [
      "মোৰ এলেকাৰ সমস্যা ৰিপ’ৰ্ট কৰিব লাগে।",
      "মোৰ অভিযোগৰ স্থিতি বুজিব লাগে।",
      "ৰাস্তা/পানী/বিদ্যুৎ অভিযোগ কেনেকৈ কৰিম?",
      "RTI মানে কি?",
      "মোৰ হাতত এখন চৰকাৰী জাননী আছে, বুজাই দিয়ক।",
      "চৰকাৰী আঁচনিৰ বিষয়ে কওক।",
    ],
  },
  track: {
    title: "আপোনাৰ অভিযোগ ক’লৈ পালে?",
    subtitle: "আপোনাৰ ৰিপ’ৰ্ট ID (যেনে JA-10001) দি লাইভ স্থিতি চাওক।",
    enterId: "ৰিপ’ৰ্ট ID", trackBtn: "ট্ৰেক কৰক",
  },
  common: {
    search: "বিচাৰক", searchPh: "ৰিপ’ৰ্ট, বিষয়, অধিকাৰ বিচাৰক…", all: "সকলো",
    viewAll: "সকলো চাওক", learnMore: "অধিক জানক", loading: "ল’ড হৈ আছে…",
    retry: "পুনৰ চেষ্টা", cancel: "বাতিল", save: "ছে’ভ", edit: "সম্পাদনা",
    submit: "দাখিল", back: "পিছলৈ", next: "পৰৱৰ্তী", close: "বন্ধ কৰক",
    optional: "ঐচ্ছিক", required: "প্ৰয়োজনীয়",
  },
  status: {
    REPORTED: "ৰিপ’ৰ্ট কৰা", AUTHORITY_IDENTIFIED: "কৰ্তৃপক্ষ চিনাক্ত",
    SUBMITTED: "দাখিল", ACKNOWLEDGED: "গ্ৰহণ",
    UNDER_REVIEW: "পৰ্যালোচনাধীন", ACTION_TAKEN: "ব্যৱস্থা লোৱা",
    RESOLVED: "সমাধান", REJECTED: "খাৰিজ",
  },
  category: {
    WATER: "পানী যোগান", ROADS: "ৰাস্তা", ELECTRICITY: "বিদ্যুৎ",
    GARBAGE: "জাবৰ", DRAINAGE: "নলা", EDUCATION: "শিক্ষা",
    HEALTHCARE: "স্বাস্থ্য", TRANSPORT: "পৰিবহণ", ENVIRONMENT: "পৰিৱেশ",
    PUBLIC_SERVICES: "ৰাজহুৱা সেৱা", EMPLOYMENT: "নিয়োগ",
    INFRASTRUCTURE: "আন্তঃগাঁথনি", DOCUMENTATION: "নথিপত্ৰ",
    SAFETY: "ৰাজহুৱা সুৰক্ষা", RIGHTS: "অধিকাৰ / নাগৰিক প্ৰক্ৰিয়া", OTHER: "অন্য",
  },
};

// ─── Urdu (اردو) ─────────────────────────────────────────────────────────────
export const ur: Dict = {
  nav: {
    home: "ہوم", explore: "ایکسپلور", report: "رپورٹ", map: "بھارت کا نقشہ",
    issues: "عوامی مسائل", rights: "اپنے حقوق جانیں", ai: "AI اسسٹنٹ",
    dashboard: "ڈیش بورڈ", language: "زبان", notifications: "اطلاعات",
    reportProblem: "مسئلہ رپورٹ کریں", profile: "پروفائل", myReports: "میری رپورٹس",
    saved: "محفوظ شدہ مسائل", privacy: "پرائیویسی", logout: "لاگ آؤٹ",
    login: "لاگ اِن", register: "سائن اپ",
  },
  hero: {
    badge: "بھارت کے ہر شہری کے لیے",
    title: "ہر آواز۔ ہر جگہ۔ ایک انڈیا۔",
    subtitle: "آپ کے علاقے میں کیا ہو رہا ہے؟ جانیں۔ اپنا مسئلہ رپورٹ کریں۔ اپنے حقوق سمجھیں۔ اور حل تک پہنچنے کا راستہ دیکھیں۔",
    reportBtn: "مسئلہ رپورٹ کریں", exploreBtn: "انڈیا ایکسپلور کریں",
    seeHappening: "دیکھیں کیا ہو رہا ہے",
    trust1: "پرائیویسی پہلے", trust2: "کثیر لسانی", trust3: "شہری مرکوز",
  },
  stats: {
    title: "انڈیا بول رہا ہے۔ جن آواز سن رہا ہے۔",
    subtitle: "ملک بھر کے شہری مسائل رپورٹ کر رہے ہیں، پیش رفت ٹریک کر رہے ہیں اور مل کر حل تلاش کر رہے ہیں۔",
    reports: "شہری رپورٹس", underReview: "زیرِ جائزہ مسائل", resolved: "حل شدہ مسائل",
    states: "شامل ریاستیں", languages: "تعاون یافتہ زبانیں",
    demoNote: "ڈیمو ڈیٹا — براہِ راست سرکاری اعداد و شمار نہیں",
  },
  langSection: {
    title: "اپنی زبان میں اپنی بات۔",
    subtitle: "بھارت کی ہر زبان اہم ہے۔ جن آواز پر وہی زبان استعمال کریں جس میں آپ آرام دہ ہوں۔",
    note: "آپ کی منتخب زبان نیویگیشن، فارم، رپورٹس، AI اسسٹنٹ، حقوق کی معلومات اور اطلاعات میں لاگو ہوتی ہے۔",
  },
  happening: {
    title: "بھارت میں کیا چل رہا ہے؟",
    subtitle: "ایک جگہ سے دیکھیں — کس علاقے میں کیا مسئلہ ہے، لوگ کون سی تشویش اٹھا رہے ہیں اور موجودہ صورتحال کیا ہے۔",
    viewMap: "انٹرایکٹو نقشہ کھولیں",
  },
  reportCta: {
    title: "مسئلہ ہے؟ رپورٹ کرو۔",
    subtitle: "اپنے علاقے کا civic مسئلہ 2 منٹ میں رپورٹ کریں۔ تصویر یا ویڈیو ثبوت کے ساتھ — اور پیش رفت ٹریک کریں۔",
    start: "رپورٹ شروع کریں",
    categoriesNote: "16 زمرے • تصویر/ویڈیو ثبوت • پیش رفت ٹریکنگ",
  },
  evidence: {
    title: "صرف بات نہیں — ثبوت بھی۔",
    subtitle: "تصویر، ویڈیو، دستاویز یا وائس نوٹ کے ساتھ اپنی رپورٹ مضبوط بنائیں۔ آپ کا ثبوت محفوظ اور نجی رہتا ہے۔",
  },
  privacy: {
    title: "آپ کی پرائیویسی، آپ کا حق۔",
    subtitle: "عوامی مسئلہ نظر آنا چاہیے — شہری کی ذاتی شناخت نہیں۔",
    statement: "“عوامی مسئلہ نظر آنا چاہیے — شہری کی ذاتی شناخت نہیں۔”",
    cards: [
      { t: "محفوظ ڈیٹا", d: "آپ کا ڈیٹا انکرپٹ کر کے محفوظ رکھا جاتا ہے۔" },
      { t: "پرائیویسی تحفظ", d: "ذاتی معلومات کبھی عوامی طور پر نہیں دکھائی جاتیں۔" },
      { t: "کوئی عوامی شناخت نہیں", d: "رپورٹ میں مسئلہ نظر آتا ہے، آپ کی شناخت نہیں۔" },
      { t: "غیر ضروری ٹریکنگ نہیں", d: "ضرورت سے زیادہ ہم آپ کو ٹریک نہیں کرتے۔" },
      { t: "محفوظ ثبوت", d: "ثبوت صرف آپ کو اور مجاز افسران کو نظر آتا ہے۔" },
    ],
  },
  rights: {
    title: "اپنے حقوق سمجھیں۔",
    subtitle: "آسان زبان میں جانیں — آپ کیا کر سکتے ہیں، کون سا طریقہ کار لاگو ہوتا ہے، اور شکایت کا فالو اپ کیسے کریں۔",
    disclaimer: "یہ معلومات عام آگاہی کے لیے ہیں؛ پیشہ ورانہ قانونی مشورے کا متبادل نہیں۔",
    viewAll: "تمام حقوق دیکھیں",
  },
  issuesSection: {
    title: "عوامی مسائل و تحریکیں",
    subtitle: "تصدیق شدہ اور رپورٹ کردہ عوامی مسائل — پس منظر، تشویشات، سرکاری جواب اور موجودہ صورتحال کے ساتھ۔",
    viewAll: "تمام مسائل دیکھیں",
  },
  emotion: {
    headline: "انڈیا صرف ایک ملک نہیں۔ یہ ہم سب کی ذمہ داری ہے۔",
    text1: "“ایک طالب علم کی آواز، ایک کسان کا مسئلہ، ایک مزدور کی پریشانی، ایک خاندان کی ضرورت — ہر genuine تشویش اہم ہے۔”",
    text2: "“ٹیکنالوجی تبھی بامعنی ہے جب وہ لوگوں کے کام آئے۔”",
    cta: "ذمہ داری سے اپنی آواز اٹھائیں",
  },
  footer: {
    tagline: "ہر آواز۔ ہر جگہ۔ ایک انڈیا۔",
    platform: "پلیٹ فارم", resources: "وسائل", languages: "زبانیں",
    rights: "اپنے حقوق جانیں", help: "مدد", faq: "عام سوالات",
    privacy: "پرائیویسی", terms: "شرائط",
    madeIn: "بھارت کے شہریوں کے لیے ٹیکنالوجی کے ساتھ بنایا گیا۔",
  },
  ai: {
    title: "جن آواز AI",
    subtitle: "اپنی زبان میں پوچھیں۔ سمجھیں۔ صحیح راستہ چنیں۔",
    placeholder: "اپنا سوال لکھیں… (اردو، ہندی یا انگریزی میں)",
    empty1: "نمستے! میں جن آواز AI ہوں۔",
    empty2: "آپ کا مسئلہ سمجھنے، معلومات تلاش کرنے اور اگلا قدم سمجھنے میں میں مدد کر سکتا ہوں۔",
    warning: "براہ کرم چیٹ میں پاس ورڈ، OTP، آدھار نمبر، بینک تفصیلات یا دیگر انتہائی حساس ذاتی معلومات شیئر نہ کریں۔",
    createReport: "رپورٹ بنائیں", copy: "کاپی", copied: "کاپی ہو گیا", send: "بھیجیں",
    thinking: "سوچ رہا ہوں…",
    disclaimer: "جن آواز AI شہری معلومات دیتا ہے — قانونی مشورہ نہیں۔ اہم دعوؤں کی تصدیق کریں۔",
    newChat: "نئی چیٹ",
    suggestions: [
      "میرے علاقے کا مسئلہ رپورٹ کرنا ہے۔",
      "میری شکایت کا اسٹیٹس سمجھنا ہے۔",
      "سڑک/پانی/بجلی کی شکایت کیسے کریں؟",
      "RTI کیا ہوتا ہے؟",
      "میرے پاس ایک سرکاری نوٹس ہے، سمجھا دیں۔",
      "سرکاری اسکیم کے بارے میں بتائیں۔",
    ],
  },
  track: {
    title: "آپ کی شکایت کہاں پہنچی؟",
    subtitle: "اپنا رپورٹ ID (جیسے JA-10001) ڈال کر لائیو اسٹیٹس دیکھیں۔",
    enterId: "رپورٹ ID", trackBtn: "ٹریک کریں",
  },
  common: {
    search: "تلاش کریں", searchPh: "رپورٹس، مسائل، حقوق تلاش کریں…", all: "تمام",
    viewAll: "سب دیکھیں", learnMore: "مزید جانیں", loading: "لوڈ ہو رہا…",
    retry: "دوبارہ کوشش", cancel: "منسوخ", save: "محفوظ کریں", edit: "ترمیم",
    submit: "جمع کرائیں", back: "پیچھے", next: "آگے", close: "بند کریں",
    optional: "اختیاری", required: "لازمی",
  },
  status: {
    REPORTED: "رپورٹ ہوا", AUTHORITY_IDENTIFIED: "اتھارٹی شناخت",
    SUBMITTED: "جمع کرایا", ACKNOWLEDGED: "قبول کیا",
    UNDER_REVIEW: "زیرِ جائزہ", ACTION_TAKEN: "کارروائی ہوئی",
    RESOLVED: "حل ہوا", REJECTED: "مسترد",
  },
  category: {
    WATER: "پانی کی فراہمی", ROADS: "سڑکیں", ELECTRICITY: "بجلی",
    GARBAGE: "کوڑا", DRAINAGE: "نکاسی", EDUCATION: "تعلیم",
    HEALTHCARE: "صحت", TRANSPORT: "نقل و حمل", ENVIRONMENT: "ماحول",
    PUBLIC_SERVICES: "عوامی خدمات", EMPLOYMENT: "روزگار",
    INFRASTRUCTURE: "بنیادی ڈھانچہ", DOCUMENTATION: "دستاویزات",
    SAFETY: "عوامی تحفظ", RIGHTS: "حقوق / شہری عمل", OTHER: "دیگر",
  },
};

// ─── Registry ─────────────────────────────────────────────────────────────────
export const dictionaries: Record<Lang, Dict> = {
  en, hi, "hi-Latn": transliterateDictionary(hi), bn, te, mr, ta, gu, kn, ml, pa, or, as, ur,
};

export function isLang(code: string): code is Lang {
  return (Object.keys(dictionaries) as string[]).includes(code);
}

export function getDict(lang: Lang): Dict {
  return dictionaries[lang];
}
