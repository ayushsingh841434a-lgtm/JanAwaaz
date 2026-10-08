// ─── JanAwaaz AI: verified civic knowledge base ──────────────────────────────
// General, stable civic knowledge in English + Hindi. Never invents
// departments, phone numbers, emails, URLs or officials. Where an official
// portal is genuinely well-established (CPGRAMS, RTI Online), it is named
// with a "verify the address on the official site" note.

export interface KnowledgeEntry {
  id: string;
  infoType: "verified" | "ai";
  title: { en: string; hi: string };
  body: { en: string; hi: string };
  sources: { label: string; note?: string }[];
}

export const KNOWLEDGE: KnowledgeEntry[] = [
  {
    id: "rti",
    infoType: "verified",
    title: { en: "What is RTI?", hi: "RTI kya hota hai?" },
    body: {
      en: `**RTI (Right to Information)** lets any Indian citizen ask for information from public authorities — records, decisions, and the reasons behind them.

**How it generally works:**
1. Write a clear, specific question (one subject per application works best).
2. File it with the concerned department's Public Information Officer — many departments accept online applications on the RTI online portal.
3. A small application fee applies (with exemptions for Below Poverty Line applicants).
4. The reply usually comes within 30 days.
5. If there's no reply, you can file a **first appeal** with the senior officer, then approach the Information Commission.

**Good to know:** RTI is for *information* — it doesn't resolve a complaint by itself, but the information you get can strengthen a grievance or appeal.`,
      hi: `**RTI (सूचना का अधिकार)** हर भारतीय नागरिक को public authorities से जानकारी मांगने का हक देता है — records, फैसले और उनके पीछे के कारण।

**प्रक्रिया (सामान्य):**
1. स्पष्ट, specific सवाल लिखें (एक application में एक विषय सबसे अच्छा रहता है)।
2. संबंधित विभाग के Public Information Officer के पास file करें — कई विभाग RTI online portal पर online application लेते हैं।
3. छोटी application fee लगती है (BPL आवेदकों के लिए छूट है)।
4. जवाब आमतौर पर 30 दिन के अंदर आता है।
5. जवाब न आए तो senior officer के पास **first appeal** करें, फिर Information Commission जा सकते हैं।

**जानने योग्य:** RTI *जानकारी* के लिए है — यह खुद complaint का समाधान नहीं करता, लेकिन मिली जानकारी आपकी grievance या appeal को मज़बूत बना सकती है।`,
    },
    sources: [
      { label: "RTI online portal", note: "Verify the portal address on the official government site" },
      { label: "Your department's RTI section", note: "Each public authority publishes its PIO list" },
    ],
  },
  {
    id: "public-grievance",
    infoType: "verified",
    title: { en: "Public Grievance — how it works", hi: "Public Grievance — प्रक्रिया क्या है?" },
    body: {
      en: `A **public grievance** is a formal complaint to the government about a service failure, delay, or misconduct by a public authority.

**The usual path:**
1. **First, complain locally** — to the municipal office, department helpline, or online portal that owns the problem.
2. **Note the complaint/reference number** and the promised timeline.
3. **Escalate if unresolved** — central government matters can go to **CPGRAMS** (the Centralised Public Grievance Redress and Monitoring System); states have their own grievance portals.
4. **Track and follow up** — every grievance gets a registration number you can track.

**Tips:** Be specific (what, where, since when), attach evidence, keep copies of everything, and never share OTPs or passwords on any portal.`,
      hi: `**Public grievance** सरकार को एक औपचारिक शिकायत है — सेवा में कमी, देरी या public authority के दुराचार के बारे में।

**सामान्य रास्ता:**
1. **पहले local स्तर पर complaint करें** — municipal office, department helpline या उस समस्या के online portal पर।
2. **Complaint/reference number** और promised timeline note करें।
3. **समाधान न हो तो escalate करें** — केंद्र सरकार के मामलों के लिए **CPGRAMS** (Centralised Public Grievance Redress and Monitoring System); राज्यों के अपने grievance portal हैं।
4. **Track और follow up करें** — हर grievance को registration number मिलता है।

**Tips:** Specific रहें (क्या, कहां, कब से), सबूत लगाएं, हर चीज़ की copy रखें, और किसी भी portal पर OTP या password कभी शेयर न करें।`,
    },
    sources: [
      { label: "CPGRAMS portal", note: "Verify the portal address on the official government site" },
      { label: "Your state's public grievance portal", note: "Search your state name + grievance portal" },
    ],
  },
  {
    id: "water-complaint",
    infoType: "ai",
    title: { en: "Water supply complaint — process", hi: "पानी की शिकायत — प्रक्रिया" },
    body: {
      en: `**If your area has no water or the water is contaminated:**

1. **Contact your local water board / municipal corporation** — most have a helpline and an online complaint portal. Report the area, street, and since when.
2. **Ask for a complaint number** and the expected resolution time.
3. **For contamination**, mention it explicitly and ask for water-quality testing.
4. **If tankers are promised**, ask for the schedule in writing.
5. **No action?** Escalate on your state's public grievance portal or CPGRAMS.

⚠️ I don't have your city's verified helpline number in my current data — please check the official website of your municipal corporation / water board for the correct number. Never trust numbers forwarded on social media.`,
      hi: `**अगर आपके इलाके में पानी नहीं आ रहा या पानी गंदा है:**

1. **अपने local water board / नगर निगम से संपर्क करें** — ज़्यादातर के पास helpline और online complaint portal है। Area, गली और कब से — बताएं।
2. **Complaint number** और expected resolution time मांगें।
3. **पानी गंदा है तो** स्पष्ट बताएं और water-quality testing की मांग करें।
4. **Tanker का वादा हो** तो schedule लिखित में मांगें।
5. **कार्रवाई न हो?** State public grievance portal या CPGRAMS पर escalate करें।

⚠️ मेरे current data में आपके शहर का verified helpline number नहीं है — सही नंबर के लिए अपने नगर निगम / water board की official website देखें। Social media पर forward हुए नंबरों पर भरोसा न करें।`,
    },
    sources: [{ label: "Your municipal corporation / water board website", note: "Find the official grievance section" }],
  },
  {
    id: "electricity-complaint",
    infoType: "ai",
    title: { en: "Electricity complaint — process", hi: "बिजली की शिकायत — प्रक्रिया" },
    body: {
      en: `**For power cuts, faulty meters, or billing issues:**

1. **Contact your electricity distribution company (DISCOM)** — the name is printed on your bill. Most DISCOMs have a 24×7 helpline and an online portal/app.
2. **Keep your consumer/account number ready** (from the bill) — it speeds things up.
3. **For outages**, report the area and whether neighbours are affected too.
4. **For wrong bills**, pay the undisputed amount if possible and dispute the rest in writing.
5. **Unresolved?** Every DISCOM has a Consumer Grievance Redressal Forum; above that, the Electricity Ombudsman.

⚠️ Use only the helpline printed on your official bill or the DISCOM's official website.`,
      hi: `**बिजली कटौती, खराब मीटर या billing समस्या के लिए:**

1. **अपनी बिजली distribution company (DISCOM) से संपर्क करें** — नाम आपके बिल पर छपा होता है। ज़्यादातर DISCOM का 24×7 helpline और online portal/app है।
2. **Consumer/account number तैयार रखें** (बिल से) — काम तेज़ होता है।
3. **बिजली गुल होने पर** area बताएं और पड़ोसियों को भी असर है या नहीं।
4. **गलत बिल पर** संभव हो तो सही राशि भरें और बाकी का लिखित में dispute करें।
5. **समाधान न हो?** हर DISCOM का Consumer Grievance Redressal Forum है; उसके ऊपर Electricity Ombudsman।

⚠️ सिर्फ अपने official bill या DISCOM की official website पर छपे helpline का ही उपयोग करें।`,
    },
    sources: [{ label: "Your DISCOM's official website / bill", note: "Helpline is printed on the bill" }],
  },
  {
    id: "road-complaint",
    infoType: "ai",
    title: { en: "Road complaint — process", hi: "सड़क की शिकायत — प्रक्रिया" },
    body: {
      en: `**For potholes, broken footpaths, or damaged roads:**

1. **Identify who owns the road** — municipal roads → municipal corporation; district/state roads → PWD; national highways → the highway authority.
2. **Report with photos and exact location** (landmark + area). Geotagged photos help a lot.
3. **Mark safety hazards as urgent** — open manholes, collapsed stretches, missing signage at night.
4. **Take a complaint number** and follow up after the stated timeline.
5. **No action?** Escalate on the grievance portal with your earlier reference number.

On JanAwaaz you can also file this directly — I'll help you draft it.`,
      hi: `**गड्ढों, टूटे फुटपाथ या खराब सड़कों के लिए:**

1. **पहचानें सड़क किसकी है** — municipal road → नगर निगम; district/state road → PWD; national highway → highway authority।
2. **Photo और सही location के साथ report करें** (landmark + area)। Geotagged photo बहुत मदद करती है।
3. **खतरनाक स्थितियों को urgent बताएं** — खुले मैनहोल, धंसी सड़क, रात में missing sign-board।
4. **Complaint number लें** और बताई गई timeline के बाद follow up करें।
5. **कार्रवाई न हो?** पहले वाले reference number के साथ grievance portal पर escalate करें।

JanAwaaz पर आप इसे सीधे file भी कर सकते हैं — मैं draft करने में मदद करूंगा।`,
    },
    sources: [{ label: "Municipal corporation / PWD website of your state", note: "Check the road maintenance section" }],
  },
  {
    id: "garbage-complaint",
    infoType: "ai",
    title: { en: "Garbage complaint — process", hi: "कचरे की शिकायत — प्रक्रिया" },
    body: {
      en: `**If garbage isn't collected or bins overflow:**

1. **Report to your municipal corporation's sanitation department** — helpline, app, or online portal with your ward/area name.
2. **Mention since when** and attach a dated photo.
3. **For garbage burning**, report it as an air-pollution violation too.
4. **Ask for the collection schedule** for your street.
5. **No action?** Escalate on the grievance portal; repeated violations can also go to the State Pollution Control Board.`,
      hi: `**अगर कचरा नहीं उठ रहा या dustbin overflow हो रहे हैं:**

1. **नगर निगम के sanitation department को report करें** — helpline, app या online portal पर ward/area का नाम बताएं।
2. **कब से** बताएं और dated photo लगाएं।
3. **कचरा जलाया जा रहा हो** तो air-pollution violation के रूप में भी report करें।
4. **अपनी गली का collection schedule** मांगें।
5. **कार्रवाई न हो?** Grievance portal पर escalate करें; बार-बार के उल्लंघन State Pollution Control Board को भी बताए जा सकते हैं।`,
    },
    sources: [{ label: "Your municipal corporation's sanitation section", note: "See the official website" }],
  },
  {
    id: "scheme-general",
    infoType: "ai",
    title: { en: "Government schemes — how to get reliable info", hi: "सरकारी योजनाएं — सही जानकारी कैसे पाएं" },
    body: {
      en: `I don't maintain a live database of every scheme's current status — schemes change, and details vary by state. Here's how to get **reliable** information:

1. **Identify the exact scheme name** and whether it's central or state-run.
2. **Read the official scheme page** — look for eligibility, documents required, and how to apply.
3. **Beware of forwards** — no genuine scheme asks for OTPs, "registration fees" via UPI links, or bank passwords.
4. **Apply only on official portals** or at designated government offices / Common Service Centres.
5. **Track your application number** and keep receipts.

Tell me the scheme name and your state — I'll explain the general process and what to verify officially.`,
      hi: `मेरे पास हर scheme की live database नहीं है — scheme बदलती रहती हैं और विवरण राज्य के हिसाब से अलग होते हैं। **भरोसेमंद** जानकारी ऐसे पाएं:

1. **Scheme का सही नाम** पहचानें — central है या state-run।
2. **Official scheme page** पढ़ें — eligibility, ज़रूरी documents और apply करने का तरीका देखें।
3. **Forward से सावधान** — कोई genuine scheme OTP, UPI link से "registration fee" या bank password नहीं मांगती।
4. **सिर्फ official portal** या designated सरकारी office / Common Service Centre पर apply करें।
5. **Application number track करें** और receipts रखें।

मुझे scheme का नाम और अपना राज्य बताएं — मैं general process समझाऊंगा और क्या officially verify करना है, बताऊंगा।`,
    },
    sources: [{ label: "Official scheme portal / state department site", note: "Verify the portal address officially" }],
  },
  {
    id: "notice-guide",
    infoType: "ai",
    title: { en: "How to read a government notice", hi: "सरकारी नोटिस कैसे पढ़ें" },
    body: {
      en: `**Simple Explanation framework** — for any government notice, look for these 5 things:

1. **Who sent it** — department name, office address, officer's designation, date, and reference number.
2. **Who it's for** — is your name/address on it, or is it a general public notice?
3. **What it says** — the core demand or information, in one or two sentences.
4. **What you must do** — any action required, with the **deadline**.
5. **What happens if you don't** — penalties or consequences mentioned.

**Next steps:** Note the deadline first. Keep the original safe. If action is needed, respond in writing before the deadline and keep a copy. For legal/financial notices with big consequences, consider consulting a qualified professional.

📎 **Paste the notice text here** and I'll break it down into: *original → what it means in simple language → what you may need to do next.*`,
      hi: `**Simple Explanation framework** — किसी भी सरकारी नोटिस में ये 5 चीज़ें देखें:

1. **किसने भेजा** — विभाग का नाम, office का पता, officer का पद, date और reference number।
2. **किसके लिए है** — आपका नाम/पता है, या यह general public notice है?
3. **क्या कहा गया** — मुख्य मांग या जानकारी, एक-दो वाक्यों में।
4. **आपको क्या करना है** — कोई कार्रवाई ज़रूरी है, **deadline** के साथ।
5. **न करने पर क्या होगा** — बताई गई penalty या परिणाम।

**अगले कदम:** पहले deadline note करें। Original संभाल कर रखें। कार्रवाई ज़रूरी हो तो deadline से पहले लिखित में जवाब दें और copy रखें। बड़े कानूनी/वित्तीय परिणाम वाले नोटिस के लिए qualified professional से सलाह लें।

📎 **नोटिस का text यहां paste करें** और मैं इसे तोड़कर समझाऊंगा: *original → सरल भाषा में मतलब → आगे आपको क्या करना चाहिए।*`,
    },
    sources: [],
  },
  {
    id: "consumer-general",
    infoType: "verified",
    title: { en: "Consumer complaint — process", hi: "उपभोक्ता शिकायत — प्रक्रिया" },
    body: {
      en: `**For defective products or deficient services:**

1. **Complain to the seller/provider in writing first** — give them ~15 days.
2. **Keep bills, warranty cards, and all communication** as evidence.
3. **If unresolved**, file on the **National Consumer Helpline** portal.
4. **For higher-value disputes**, the District/State/National Consumer Commissions hear cases based on claim value.
5. **Limitation:** complaints should generally be filed within 2 years of the cause of action.

This is general information, not legal advice.`,
      hi: `**खराब सामान या कमी वाली सेवा के लिए:**

1. **पहले seller/provider को लिखित में complaint करें** — ~15 दिन का समय दें।
2. **Bill, warranty card और सारी communication** सबूत के तौर पर रखें।
3. **समाधान न हो** तो **National Consumer Helpline** portal पर file करें।
4. **बड़े विवादों** के लिए District/State/National Consumer Commission claim value के हिसाब से सुनवाई करते हैं।
5. **Time-limit:** शिकायत आमतौर पर कारण के 2 साल के अंदर file करनी चाहिए।

यह सामान्य जानकारी है, कानूनी सलाह नहीं।`,
    },
    sources: [{ label: "National Consumer Helpline (official portal)", note: "Verify the portal address officially" }],
  },
];

export function findKnowledge(id: string): KnowledgeEntry | undefined {
  return KNOWLEDGE.find((k) => k.id === id);
}
