import { dictionaries, type Lang } from "@/lib/i18n/dictionaries";

export interface DraftInput {
  category: string;
  description: string;
  location?: string;
  duration?: string;
  name?: string;
  language?: Lang;
}

export interface ComplaintDraft {
  subject: string;
  body: string;
  sections: { label: string; value: string }[];
}

type DraftCopy = {
  subject: (category: string, location: string) => string;
  labels: [string, string, string, string, string, string, string, string];
  duration: (value: string) => string;
  impact: string;
  action: string;
  evidence: string;
  locationPlaceholder: string;
  durationPlaceholder: string;
  namePlaceholder: string;
};

const COPY: Record<Lang, DraftCopy> = {
  en: {
    subject: (category, location) => `${category} issue in ${location} — complaint`,
    labels: ["Subject", "Original problem description", "Location", "Duration", "Impact", "Requested action", "Supporting evidence", "Complainant"],
    duration: (value) => `This issue has continued ${value}.`,
    impact: "This issue is causing difficulty for local residents.",
    action: "Please inspect this issue, take appropriate action, and share an update on the action taken.",
    evidence: "Relevant photos or documents may be attached.",
    locationPlaceholder: "[area/city]", durationPlaceholder: "[since when]", namePlaceholder: "[Your name]",
  },
  hi: {
    subject: (category, location) => `${location} में ${category} की समस्या — शिकायत`,
    labels: ["विषय", "मूल समस्या का विवरण", "स्थान", "अवधि", "प्रभाव", "अनुरोधित कार्रवाई", "सहायक साक्ष्य", "शिकायतकर्ता"],
    duration: (value) => `यह समस्या ${value} से बनी हुई है।`,
    impact: "इस समस्या से स्थानीय निवासियों को कठिनाई हो रही है।",
    action: "कृपया समस्या का निरीक्षण कर उचित कार्रवाई करें और की गई कार्रवाई की जानकारी दें।",
    evidence: "संबंधित तस्वीरें या दस्तावेज़ संलग्न किए जा सकते हैं।",
    locationPlaceholder: "[इलाका/शहर]", durationPlaceholder: "[कब से]", namePlaceholder: "[आपका नाम]",
  },
  "hi-Latn": {
    subject: (category, location) => `${location} mein ${category} ki samasya — shikayat`,
    labels: ["Vishay", "Samasya ka poora vivaran", "Jagah", "Avadhi", "Asar", "Maangi gayi karvaai", "Sahayak saboot", "Shikayatkarta"],
    duration: (value) => `Yeh samasya ${value} se jaari hai.`,
    impact: "Is samasya se ilaake ke rehne waalon ko dikkat ho rahi hai.",
    action: "Kripya samasya ki jaanch karke uchit karvaai karein aur ki gayi karvaai ki jaankari dein.",
    evidence: "Sambandhit tasveerein ya dastavez jode ja sakte hain.",
    locationPlaceholder: "[ilaaka/shehar]", durationPlaceholder: "[kab se]", namePlaceholder: "[aapka naam]",
  },
  bn: {
    subject: (category, location) => `${location} এলাকায় ${category} সংক্রান্ত সমস্যা — অভিযোগ`,
    labels: ["বিষয়", "সমস্যার মূল বিবরণ", "স্থান", "সময়কাল", "প্রভাব", "অনুরোধ করা পদক্ষেপ", "সহায়ক প্রমাণ", "অভিযোগকারী"],
    duration: (value) => `সমস্যাটি ${value} ধরে চলছে।`,
    impact: "এই সমস্যার কারণে এলাকার বাসিন্দারা অসুবিধায় পড়ছেন।",
    action: "অনুগ্রহ করে সমস্যাটি পরিদর্শন করে যথাযথ ব্যবস্থা নিন এবং কী পদক্ষেপ নেওয়া হয়েছে তা জানান।",
    evidence: "প্রাসঙ্গিক ছবি বা নথি সংযুক্ত করা যেতে পারে।",
    locationPlaceholder: "[এলাকা/শহর]", durationPlaceholder: "[কবে থেকে]", namePlaceholder: "[আপনার নাম]",
  },
  te: {
    subject: (category, location) => `${location}లో ${category} సమస్య — ఫిర్యాదు`,
    labels: ["విషయం", "సమస్య అసలు వివరణ", "ప్రాంతం", "వ్యవధి", "ప్రభావం", "కోరిన చర్య", "ఆధార పత్రాలు", "ఫిర్యాదుదారు"],
    duration: (value) => `ఈ సమస్య ${value} నుంచి కొనసాగుతోంది.`,
    impact: "ఈ సమస్య వల్ల స్థానిక నివాసితులు ఇబ్బందులు ఎదుర్కొంటున్నారు.",
    action: "దయచేసి సమస్యను పరిశీలించి తగిన చర్య తీసుకుని, తీసుకున్న చర్య వివరాలను తెలియజేయండి.",
    evidence: "సంబంధిత ఫోటోలు లేదా పత్రాలను జత చేయవచ్చు.",
    locationPlaceholder: "[ప్రాంతం/నగరం]", durationPlaceholder: "[ఎప్పటి నుంచి]", namePlaceholder: "[మీ పేరు]",
  },
  mr: {
    subject: (category, location) => `${location} येथील ${category} समस्या — तक्रार`,
    labels: ["विषय", "समस्येचे मूळ वर्णन", "ठिकाण", "कालावधी", "परिणाम", "विनंती केलेली कारवाई", "पूरक पुरावे", "तक्रारदार"],
    duration: (value) => `ही समस्या ${value} पासून सुरू आहे.`,
    impact: "या समस्येमुळे स्थानिक रहिवाशांना त्रास होत आहे.",
    action: "कृपया या समस्येची पाहणी करून योग्य ती कारवाई करा आणि केलेल्या कारवाईची माहिती द्या.",
    evidence: "संबंधित छायाचित्रे किंवा कागदपत्रे जोडता येतील.",
    locationPlaceholder: "[परिसर/शहर]", durationPlaceholder: "[कधीपासून]", namePlaceholder: "[तुमचे नाव]",
  },
  ta: {
    subject: (category, location) => `${location} பகுதியில் ${category} பிரச்சினை — புகார்`,
    labels: ["பொருள்", "பிரச்சினையின் அசல் விளக்கம்", "இடம்", "கால அளவு", "பாதிப்பு", "கோரப்படும் நடவடிக்கை", "ஆதார ஆவணங்கள்", "புகார்தாரர்"],
    duration: (value) => `இந்தப் பிரச்சினை ${value} முதல் நீடிக்கிறது.`,
    impact: "இந்தப் பிரச்சினையால் அப்பகுதி மக்கள் சிரமப்படுகின்றனர்.",
    action: "தயவுசெய்து பிரச்சினையை ஆய்வு செய்து உரிய நடவடிக்கை எடுத்து, எடுக்கப்பட்ட நடவடிக்கை குறித்து தெரிவிக்கவும்.",
    evidence: "தொடர்புடைய புகைப்படங்கள் அல்லது ஆவணங்களை இணைக்கலாம்.",
    locationPlaceholder: "[பகுதி/நகரம்]", durationPlaceholder: "[எப்போது முதல்]", namePlaceholder: "[உங்கள் பெயர்]",
  },
  gu: {
    subject: (category, location) => `${location}માં ${category}ની સમસ્યા — ફરિયાદ`,
    labels: ["વિષય", "સમસ્યાનું મૂળ વર્ણન", "સ્થળ", "સમયગાળો", "અસર", "વિનંતી કરેલી કાર્યવાહી", "સહાયક પુરાવા", "ફરિયાદી"],
    duration: (value) => `આ સમસ્યા ${value}થી ચાલુ છે.`,
    impact: "આ સમસ્યાને કારણે સ્થાનિક રહેવાસીઓને મુશ્કેલી પડી રહી છે.",
    action: "કૃપા કરીને સમસ્યાની તપાસ કરી યોગ્ય પગલાં લો અને કરેલી કાર્યવાહી વિશે જાણ કરો.",
    evidence: "સંબંધિત ફોટા અથવા દસ્તાવેજો જોડવામાં આવી શકે છે.",
    locationPlaceholder: "[વિસ્તાર/શહેર]", durationPlaceholder: "[ક્યારથી]", namePlaceholder: "[તમારું નામ]",
  },
  kn: {
    subject: (category, location) => `${location}ನಲ್ಲಿ ${category} ಸಮಸ್ಯೆ — ದೂರು`,
    labels: ["ವಿಷಯ", "ಸಮಸ್ಯೆಯ ಮೂಲ ವಿವರಣೆ", "ಸ್ಥಳ", "ಅವಧಿ", "ಪರಿಣಾಮ", "ಕೋರಿರುವ ಕ್ರಮ", "ಪೂರಕ ಸಾಕ್ಷ್ಯಗಳು", "ದೂರುದಾರರು"],
    duration: (value) => `ಈ ಸಮಸ್ಯೆ ${value}ರಿಂದ ಮುಂದುವರಿದಿದೆ.`,
    impact: "ಈ ಸಮಸ್ಯೆಯಿಂದ ಸ್ಥಳೀಯ ನಿವಾಸಿಗಳಿಗೆ ತೊಂದರೆಯಾಗುತ್ತಿದೆ.",
    action: "ದಯವಿಟ್ಟು ಸಮಸ್ಯೆಯನ್ನು ಪರಿಶೀಲಿಸಿ ಸೂಕ್ತ ಕ್ರಮ ಕೈಗೊಂಡು, ಕೈಗೊಂಡ ಕ್ರಮದ ಮಾಹಿತಿ ನೀಡಿ.",
    evidence: "ಸಂಬಂಧಿತ ಚಿತ್ರಗಳು ಅಥವಾ ದಾಖಲೆಗಳನ್ನು ಲಗತ್ತಿಸಬಹುದು.",
    locationPlaceholder: "[ಪ್ರದೇಶ/ನಗರ]", durationPlaceholder: "[ಯಾವಾಗಿನಿಂದ]", namePlaceholder: "[ನಿಮ್ಮ ಹೆಸರು]",
  },
  ml: {
    subject: (category, location) => `${location} പ്രദേശത്തെ ${category} പ്രശ്നം — പരാതി`,
    labels: ["വിഷയം", "പ്രശ്നത്തിന്റെ യഥാർത്ഥ വിവരണം", "സ്ഥലം", "കാലയളവ്", "പ്രഭാവം", "ആവശ്യപ്പെടുന്ന നടപടി", "പിന്തുണയ്ക്കുന്ന തെളിവുകൾ", "പരാതിക്കാരൻ"],
    duration: (value) => `ഈ പ്രശ്നം ${value} മുതൽ തുടരുന്നു.`,
    impact: "ഈ പ്രശ്നം പ്രദേശവാസികൾക്ക് ബുദ്ധിമുട്ടുണ്ടാക്കുന്നു.",
    action: "ദയവായി പ്രശ്നം പരിശോധിച്ച് ആവശ്യമായ നടപടി സ്വീകരിക്കുകയും സ്വീകരിച്ച നടപടിയുടെ വിവരം അറിയിക്കുകയും ചെയ്യുക.",
    evidence: "ബന്ധപ്പെട്ട ചിത്രങ്ങളോ രേഖകളോ ചേർക്കാം.",
    locationPlaceholder: "[പ്രദേശം/നഗരം]", durationPlaceholder: "[എപ്പോൾ മുതൽ]", namePlaceholder: "[നിങ്ങളുടെ പേര്]",
  },
  pa: {
    subject: (category, location) => `${location} ਵਿੱਚ ${category} ਦੀ ਸਮੱਸਿਆ — ਸ਼ਿਕਾਇਤ`,
    labels: ["ਵਿਸ਼ਾ", "ਸਮੱਸਿਆ ਦਾ ਅਸਲ ਵੇਰਵਾ", "ਥਾਂ", "ਮਿਆਦ", "ਅਸਰ", "ਮੰਗੀ ਗਈ ਕਾਰਵਾਈ", "ਸਹਾਇਕ ਸਬੂਤ", "ਸ਼ਿਕਾਇਤਕਰਤਾ"],
    duration: (value) => `ਇਹ ਸਮੱਸਿਆ ${value} ਤੋਂ ਜਾਰੀ ਹੈ।`,
    impact: "ਇਸ ਸਮੱਸਿਆ ਕਾਰਨ ਇਲਾਕੇ ਦੇ ਵਸਨੀਕਾਂ ਨੂੰ ਮੁਸ਼ਕਲ ਆ ਰਹੀ ਹੈ।",
    action: "ਕਿਰਪਾ ਕਰਕੇ ਸਮੱਸਿਆ ਦੀ ਜਾਂਚ ਕਰਕੇ ਢੁਕਵੀਂ ਕਾਰਵਾਈ ਕਰੋ ਅਤੇ ਕੀਤੀ ਕਾਰਵਾਈ ਬਾਰੇ ਜਾਣਕਾਰੀ ਦਿਓ।",
    evidence: "ਸਬੰਧਤ ਤਸਵੀਰਾਂ ਜਾਂ ਦਸਤਾਵੇਜ਼ ਨਾਲ ਲਗਾਏ ਜਾ ਸਕਦੇ ਹਨ।",
    locationPlaceholder: "[ਇਲਾਕਾ/ਸ਼ਹਿਰ]", durationPlaceholder: "[ਕਦੋਂ ਤੋਂ]", namePlaceholder: "[ਤੁਹਾਡਾ ਨਾਮ]",
  },
  or: {
    subject: (category, location) => `${location}ରେ ${category} ସମସ୍ୟା — ଅଭିଯୋଗ`,
    labels: ["ବିଷୟ", "ସମସ୍ୟାର ମୂଳ ବିବରଣୀ", "ସ୍ଥାନ", "ଅବଧି", "ପ୍ରଭାବ", "ଅନୁରୋଧ କରାଯାଇଥିବା ପଦକ୍ଷେପ", "ସହାୟକ ପ୍ରମାଣ", "ଅଭିଯୋଗକାରୀ"],
    duration: (value) => `ଏହି ସମସ୍ୟା ${value}ରୁ ଚାଲିଆସୁଛି।`,
    impact: "ଏହି ସମସ୍ୟା ଯୋଗୁଁ ସ୍ଥାନୀୟ ବାସିନ୍ଦାମାନେ ଅସୁବିଧା ଭୋଗୁଛନ୍ତି।",
    action: "ଦୟାକରି ସମସ୍ୟାଟି ଯାଞ୍ଚ କରି ଉପଯୁକ୍ତ ପଦକ୍ଷେପ ନିଅନ୍ତୁ ଏବଂ ନିଆଯାଇଥିବା ପଦକ୍ଷେପ ବିଷୟରେ ଜଣାନ୍ତୁ।",
    evidence: "ସମ୍ପୃକ୍ତ ଫଟୋ କିମ୍ବା ଦଲିଲ ସଂଲଗ୍ନ କରାଯାଇପାରିବ।",
    locationPlaceholder: "[ଅଞ୍ଚଳ/ସହର]", durationPlaceholder: "[କେବେଠାରୁ]", namePlaceholder: "[ଆପଣଙ୍କ ନାମ]",
  },
  as: {
    subject: (category, location) => `${location}ত ${category}ৰ সমস্যা — অভিযোগ`,
    labels: ["বিষয়", "সমস্যাৰ মূল বিৱৰণ", "স্থান", "সময়সীমা", "প্ৰভাৱ", "অনুৰোধ কৰা ব্যৱস্থা", "সহায়ক প্ৰমাণ", "অভিযোগকাৰী"],
    duration: (value) => `এই সমস্যাটো ${value}ৰ পৰা চলি আছে।`,
    impact: "এই সমস্যাৰ ফলত স্থানীয় বাসিন্দাসকলে অসুবিধাৰ সন্মুখীন হৈছে।",
    action: "অনুগ্ৰহ কৰি সমস্যাটো পৰীক্ষা কৰি উপযুক্ত ব্যৱস্থা লওক আৰু লোৱা ব্যৱস্থাৰ বিষয়ে জনাওক।",
    evidence: "প্ৰাসংগিক ফটো বা নথি সংলগ্ন কৰিব পাৰি।",
    locationPlaceholder: "[এলাকা/চহৰ]", durationPlaceholder: "[কেতিয়াৰ পৰা]", namePlaceholder: "[আপোনাৰ নাম]",
  },
  ur: {
    subject: (category, location) => `${location} میں ${category} کا مسئلہ — شکایت`,
    labels: ["موضوع", "مسئلے کی اصل تفصیل", "مقام", "مدت", "اثر", "درخواست کردہ کارروائی", "معاون ثبوت", "شکایت کنندہ"],
    duration: (value) => `یہ مسئلہ ${value} سے جاری ہے۔`,
    impact: "اس مسئلے سے علاقے کے رہائشیوں کو دشواری ہو رہی ہے۔",
    action: "براہِ کرم مسئلے کا جائزہ لے کر مناسب کارروائی کریں اور کی گئی کارروائی کی اطلاع دیں۔",
    evidence: "متعلقہ تصاویر یا دستاویزات منسلک کی جا سکتی ہیں۔",
    locationPlaceholder: "[علاقہ/شہر]", durationPlaceholder: "[کب سے]", namePlaceholder: "[آپ کا نام]",
  },
};

export function generateDraft(input: DraftInput): ComplaintDraft {
  const lang = input.language ?? "en";
  const copy = COPY[lang];
  const localizedCategory = dictionaries[lang].category[input.category]
    ?? dictionaries[lang].category.OTHER;
  const location = input.location?.trim() || copy.locationPlaceholder;
  const duration = input.duration?.trim() || copy.durationPlaceholder;
  const name = input.name?.trim() || copy.namePlaceholder;
  const subject = copy.subject(localizedCategory, location);
  const [subjectLabel, descriptionLabel, locationLabel, durationLabel, impactLabel, actionLabel, evidenceLabel, nameLabel] = copy.labels;
  const sections = [
    { label: subjectLabel, value: subject },
    { label: descriptionLabel, value: input.description.trim() },
    { label: locationLabel, value: location },
    { label: durationLabel, value: copy.duration(duration) },
    { label: impactLabel, value: copy.impact },
    { label: actionLabel, value: copy.action },
    { label: evidenceLabel, value: copy.evidence },
    { label: nameLabel, value: name },
  ];

  return {
    subject,
    body: sections.map((section) => `**${section.label}:** ${section.value}`).join("\n\n"),
    sections,
  };
}
