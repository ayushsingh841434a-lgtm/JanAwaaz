import type { Lang } from "./dictionaries";

type SpotlightCopy = {
  livePulse: string;
  viewReports: string;
  active: string;
  resolved: string;
  underReview: string;
  citizenVoices: string;
  reports: string;
  civicDashboard: string;
  issues: [string, string, string, string, string, string];
};

const CONTENT: Record<Lang, SpotlightCopy> = {
  en: {
    livePulse: "Live Pulse", viewReports: "View reports", active: "Active", resolved: "Resolved",
    underReview: "Under Review", citizenVoices: "Citizen voices", reports: "reports",
    civicDashboard: "Civic Dashboard",
    issues: ["Winter air quality concerns", "Suburban train crowding", "Outer-area water supply", "Monsoon drainage & waterlogging", "Road repair delays", "Street lighting"],
  },
  hi: {
    livePulse: "ताज़ा स्थिति", viewReports: "रिपोर्ट देखें", active: "सक्रिय", resolved: "हल हो गया",
    underReview: "समीक्षाधीन", citizenVoices: "नागरिकों की आवाज़", reports: "रिपोर्ट",
    civicDashboard: "नागरिक डैशबोर्ड",
    issues: ["सर्दियों में वायु गुणवत्ता की चिंता", "उपनगरीय ट्रेन में भीड़", "बाहरी इलाकों में जलापूर्ति", "मानसून में जलनिकासी और जलभराव", "सड़क मरम्मत में देरी", "स्ट्रीट लाइट"],
  },
  "hi-Latn": {
    livePulse: "Taaza sthiti", viewReports: "Reports dekhein", active: "Jaari", resolved: "Suljha hua",
    underReview: "Jaanch jaari", citizenVoices: "Nagrikon ki awaaz", reports: "reports",
    civicDashboard: "Nagrik dashboard",
    issues: ["Sardiyon mein hawa ki quality ki chinta", "Suburban train mein bheed", "Baahari ilaakon mein paani ki supply", "Monsoon mein drainage aur waterlogging", "Sadak repair mein deri", "Street lights"],
  },
  bn: {
    livePulse: "সাম্প্রতিক পরিস্থিতি", viewReports: "রিপোর্ট দেখুন", active: "চলমান", resolved: "সমাধান হয়েছে",
    underReview: "পর্যালোচনাধীন", citizenVoices: "নাগরিকদের কণ্ঠ", reports: "টি রিপোর্ট",
    civicDashboard: "নাগরিক ড্যাশবোর্ড",
    issues: ["শীতকালে বায়ুর মান নিয়ে উদ্বেগ", "লোকাল ট্রেনে অতিরিক্ত ভিড়", "শহরতলিতে জল সরবরাহ", "বর্ষায় নিকাশি ও জল জমার সমস্যা", "রাস্তা মেরামতে দেরি", "রাস্তার আলো"],
  },
  te: {
    livePulse: "తాజా పరిస్థితి", viewReports: "నివేదికలను చూడండి", active: "పరిష్కారం కాలేదు", resolved: "పరిష్కరించబడింది",
    underReview: "పరిశీలనలో ఉంది", citizenVoices: "పౌరుల గొంతుకలు", reports: "నివేదికలు",
    civicDashboard: "పౌర డ్యాష్‌బోర్డ్",
    issues: ["శీతాకాలంలో గాలి నాణ్యతపై ఆందోళనలు", "సబర్బన్ రైళ్లలో రద్దీ", "పరిసర ప్రాంతాల్లో నీటి సరఫరా", "వర్షాకాలంలో మురుగునీటి పారుదల, నీటి నిల్వ", "రోడ్డు మరమ్మతుల్లో జాప్యం", "వీధి దీపాలు"],
  },
  mr: {
    livePulse: "सद्यस्थिती", viewReports: "अहवाल पाहा", active: "सुरू", resolved: "सुटले",
    underReview: "पुनरावलोकन सुरू", citizenVoices: "नागरिकांचे आवाज", reports: "अहवाल",
    civicDashboard: "नागरी डॅशबोर्ड",
    issues: ["हिवाळ्यातील हवेच्या गुणवत्तेबद्दल चिंता", "उपनगरीय रेल्वेतील गर्दी", "बाहेरील भागातील पाणीपुरवठा", "पावसाळ्यातील जलनिस्सारण आणि पाणी साचणे", "रस्ता दुरुस्तीला विलंब", "रस्त्यावरील दिवे"],
  },
  ta: {
    livePulse: "தற்போதைய நிலை", viewReports: "புகார்களைக் காண்க", active: "நடைபெறுகிறது", resolved: "தீர்க்கப்பட்டது",
    underReview: "ஆய்வில் உள்ளது", citizenVoices: "குடிமக்களின் குரல்கள்", reports: "புகார்கள்",
    civicDashboard: "குடிமக்கள் பலகை",
    issues: ["குளிர்காலக் காற்றுத் தரம் குறித்த கவலை", "புறநகர் ரயில்களில் கூட்ட நெரிசல்", "வெளிப்புறப் பகுதிகளில் குடிநீர் விநியோகம்", "மழைக்கால வடிகால் மற்றும் நீர் தேக்கம்", "சாலைப் பழுதுபார்ப்பில் தாமதம்", "தெரு விளக்குகள்"],
  },
  gu: {
    livePulse: "હાલની સ્થિતિ", viewReports: "અહેવાલો જુઓ", active: "ચાલુ", resolved: "ઉકેલાયું",
    underReview: "સમીક્ષા હેઠળ", citizenVoices: "નાગરિકોના અવાજ", reports: "અહેવાલ",
    civicDashboard: "નાગરિક ડેશબોર્ડ",
    issues: ["શિયાળામાં હવાની ગુણવત્તા અંગે ચિંતા", "ઉપનગરીય ટ્રેનોમાં ભીડ", "બહારના વિસ્તારોમાં પાણી પુરવઠો", "ચોમાસામાં ગટર અને પાણી ભરાવાની સમસ્યા", "રસ્તા સમારકામમાં વિલંબ", "શેરીની લાઇટ"],
  },
  kn: {
    livePulse: "ಇತ್ತೀಚಿನ ಸ್ಥಿತಿ", viewReports: "ವರದಿಗಳನ್ನು ನೋಡಿ", active: "ಪ್ರಗತಿಯಲ್ಲಿದೆ", resolved: "ಪರಿಹರಿಸಲಾಗಿದೆ",
    underReview: "ಪರಿಶೀಲನೆಯಲ್ಲಿದೆ", citizenVoices: "ನಾಗರಿಕರ ಧ್ವನಿಗಳು", reports: "ವರದಿಗಳು",
    civicDashboard: "ನಾಗರಿಕರ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    issues: ["ಚಳಿಗಾಲದ ಗಾಳಿಯ ಗುಣಮಟ್ಟದ ಚಿಂತೆಗಳು", "ಉಪನಗರ ರೈಲುಗಳಲ್ಲಿನ ಜನದಟ್ಟಣೆ", "ಹೊರವಲಯದ ನೀರು ಪೂರೈಕೆ", "ಮಳೆಗಾಲದ ಚರಂಡಿ ಮತ್ತು ನೀರು ನಿಲ್ಲುವಿಕೆ", "ರಸ್ತೆ ದುರಸ್ತಿಯಲ್ಲಿ ವಿಳಂಬ", "ಬೀದಿ ದೀಪಗಳು"],
  },
  ml: {
    livePulse: "നിലവിലെ സ്ഥിതി", viewReports: "റിപ്പോർട്ടുകൾ കാണുക", active: "നടന്നുകൊണ്ടിരിക്കുന്നു", resolved: "പരിഹരിച്ചു",
    underReview: "പരിശോധനയിൽ", citizenVoices: "പൗരന്മാരുടെ ശബ്ദങ്ങൾ", reports: "റിപ്പോർട്ടുകൾ",
    civicDashboard: "പൗര ഡാഷ്ബോർഡ്",
    issues: ["ശൈത്യകാലത്തെ വായു ഗുണനിലവാര ആശങ്കകൾ", "സബർബൻ ട്രെയിനുകളിലെ തിരക്ക്", "പുറമ്പോക്കുകളിലെ ജലവിതരണം", "മൺസൂൺ കാലത്തെ അഴുക്കുചാലും വെള്ളക്കെട്ടും", "റോഡ് അറ്റകുറ്റപ്പണിയിലെ കാലതാമസം", "തെരുവ് വിളക്കുകൾ"],
  },
  pa: {
    livePulse: "ਮੌਜੂਦਾ ਸਥਿਤੀ", viewReports: "ਰਿਪੋਰਟਾਂ ਵੇਖੋ", active: "ਜਾਰੀ", resolved: "ਹੱਲ ਹੋ ਗਿਆ",
    underReview: "ਸਮੀਖਿਆ ਅਧੀਨ", citizenVoices: "ਨਾਗਰਿਕਾਂ ਦੀਆਂ ਆਵਾਜ਼ਾਂ", reports: "ਰਿਪੋਰਟਾਂ",
    civicDashboard: "ਨਾਗਰਿਕ ਡੈਸ਼ਬੋਰਡ",
    issues: ["ਸਰਦੀਆਂ ਵਿੱਚ ਹਵਾ ਦੀ ਗੁਣਵੱਤਾ ਬਾਰੇ ਚਿੰਤਾ", "ਉਪਨਗਰੀ ਰੇਲਾਂ ਵਿੱਚ ਭੀੜ", "ਬਾਹਰੀ ਇਲਾਕਿਆਂ ਵਿੱਚ ਪਾਣੀ ਦੀ ਸਪਲਾਈ", "ਮਾਨਸੂਨ ਦੌਰਾਨ ਨਿਕਾਸੀ ਅਤੇ ਪਾਣੀ ਖੜ੍ਹਨ ਦੀ ਸਮੱਸਿਆ", "ਸੜਕ ਮੁਰੰਮਤ ਵਿੱਚ ਦੇਰੀ", "ਗਲੀ ਦੀਆਂ ਬੱਤੀਆਂ"],
  },
  or: {
    livePulse: "ସାମ୍ପ୍ରତିକ ସ୍ଥିତି", viewReports: "ରିପୋର୍ଟ ଦେଖନ୍ତୁ", active: "ଚାଲୁ ଅଛି", resolved: "ସମାଧାନ ହୋଇଛି",
    underReview: "ସମୀକ୍ଷାଧୀନ", citizenVoices: "ନାଗରିକଙ୍କ ସ୍ୱର", reports: "ରିପୋର୍ଟ",
    civicDashboard: "ନାଗରିକ ଡ୍ୟାସବୋର୍ଡ",
    issues: ["ଶୀତଦିନେ ବାୟୁର ଗୁଣବତ୍ତା ନେଇ ଚିନ୍ତା", "ଉପନଗରୀୟ ଟ୍ରେନରେ ଭିଡ଼", "ବାହାର ଅଞ୍ଚଳରେ ଜଳ ଯୋଗାଣ", "ବର୍ଷା ଋତୁରେ ନାଳ ଓ ଜଳବନ୍ଦୀ ସମସ୍ୟା", "ରାସ୍ତା ମରାମତିରେ ବିଳମ୍ବ", "ରାସ୍ତା ଆଲୋକ"],
  },
  as: {
    livePulse: "শেহতীয়া অৱস্থা", viewReports: "প্ৰতিবেদন চাওক", active: "চলি আছে", resolved: "সমাধান হৈছে",
    underReview: "পৰ্যালোচনাধীন", citizenVoices: "নাগৰিকৰ কণ্ঠ", reports: "টা প্ৰতিবেদন",
    civicDashboard: "নাগৰিক ডেশ্বব'ৰ্ড",
    issues: ["শীতকালত বায়ুৰ গুণমানক লৈ উদ্বেগ", "উপনগৰীয় ৰে'লত ভিৰ", "চহৰৰ বাহিৰৰ অঞ্চলত পানীৰ যোগান", "বৰ্ষাকালত নলা আৰু পানী জমা হোৱা সমস্যা", "পথ মেৰামতিত পলম", "পথৰ লাইট"],
  },
  ur: {
    livePulse: "تازہ ترین صورتحال", viewReports: "رپورٹس دیکھیں", active: "جاری", resolved: "حل ہو گیا",
    underReview: "زیرِ جائزہ", citizenVoices: "شہریوں کی آوازیں", reports: "رپورٹس",
    civicDashboard: "شہری ڈیش بورڈ",
    issues: ["سردیوں میں ہوا کے معیار سے متعلق تشویش", "مضافاتی ٹرینوں میں بھیڑ", "بیرونی علاقوں میں پانی کی فراہمی", "مون سون میں نکاسی اور پانی جمع ہونے کا مسئلہ", "سڑک کی مرمت میں تاخیر", "گلی کی روشنیاں"],
  },
};

export function getHomeContent(lang: Lang): SpotlightCopy {
  return CONTENT[lang];
}
