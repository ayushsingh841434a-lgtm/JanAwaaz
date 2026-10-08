import { PrismaClient, Category, ReportStatus, Priority } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const DEMO_PASSWORD = "JanAwaaz123!";

const CITIES = [
  { city: "Delhi", state: "Delhi", district: "New Delhi", lat: 28.6139, lng: 77.2090 },
  { city: "Kanpur", state: "Uttar Pradesh", district: "Kanpur Nagar", lat: 26.4499, lng: 80.3319 },
  { city: "Lucknow", state: "Uttar Pradesh", district: "Lucknow", lat: 26.8467, lng: 80.9462 },
  { city: "Mumbai", state: "Maharashtra", district: "Mumbai", lat: 19.076, lng: 72.8777 },
  { city: "Bengaluru", state: "Karnataka", district: "Bengaluru Urban", lat: 12.9716, lng: 77.5946 },
  { city: "Patna", state: "Bihar", district: "Patna", lat: 25.5941, lng: 85.1376 },
  { city: "Kolkata", state: "West Bengal", district: "Kolkata", lat: 22.5726, lng: 88.3639 },
  { city: "Chennai", state: "Tamil Nadu", district: "Chennai", lat: 13.0827, lng: 80.2707 },
  { city: "Hyderabad", state: "Telangana", district: "Hyderabad", lat: 17.385, lng: 78.4867 },
] as const;

// Deterministic pseudo-random for stable demo data
function seeded(n: number) {
  let x = n * 2654435761 % 4294967296;
  return () => {
    x ^= x << 13; x ^= x >>> 17; x ^= x << 5;
    return ((x >>> 0) % 1000) / 1000;
  };
}

const REPORT_TEMPLATES: { category: Category; title: string; description: string }[] = [
  { category: "WATER", title: "No water supply for 4 days", description: "Hamare area mein 4 din se paani nahi aa raha hai. Tanker bhi time par nahi aata. 200+ families pareshaan hain." },
  { category: "WATER", title: "Contaminated tap water", description: "Nal se ganda paani aa raha hai, smell bhi hai. Bachche bimar pad rahe hain. Kripya testing karwayein." },
  { category: "ROADS", title: "Large potholes on main road", description: "Main road par bade-bade gaddhe hain. Baarish mein paani bhar jata hai, do accidents ho chuke hain." },
  { category: "ROADS", title: "Broken footpath near market", description: "Market ke paas footpath toota hua hai, buzurgon ko chalne mein dikkat hoti hai." },
  { category: "ELECTRICITY", title: "Frequent power cuts in evening", description: "Shaam ko 6-10 baje roz bijli jaati hai. Bachchon ki padhai affect ho rahi hai." },
  { category: "ELECTRICITY", title: "Street lights not working", description: "Gali ki street lights 2 hafte se band hain. Raat mein andhera rehta hai, safety concern hai." },
  { category: "GARBAGE", title: "Garbage not collected for a week", description: "Ek hafte se kachra nahi uthaya gaya. Dher lag gaya hai, badboo aur machchhar badh gaye hain." },
  { category: "GARBAGE", title: "Overflowing dustbins near school", description: "School ke paas dustbin overflow ho rahe hain. Bachchon ke health ka sawal hai." },
  { category: "DRAINAGE", title: "Blocked drain causing waterlogging", description: "Naali block hai, halki baarish mein hi paani gharo mein ghus jata hai." },
  { category: "HEALTHCARE", title: "Long queues at health centre", description: "Sarkari health centre mein doctor time par nahi aate. Mareez ghanto wait karte hain." },
  { category: "EDUCATION", title: "School building needs repair", description: "Sarkari school ki chhat se paani tapakta hai. Bachche baarish mein bheegte hain." },
  { category: "TRANSPORT", title: "Bus stop shelter broken", description: "Bus stop ka shed toota hai, dhoop-baarish mein yatri pareshaan hote hain." },
  { category: "ENVIRONMENT", title: "Illegal garbage burning", description: "Khaali plot mein roz kachra jalaya jata hai. Dhuaan pure mohalle mein failta hai." },
  { category: "PUBLIC_SERVICES", title: "Delay in caste certificate", description: "Caste certificate ke liye 2 mahine se chakkar kaat rahe hain, koi clear jawab nahi milta." },
  { category: "SAFETY", title: "Open manhole on footpath", description: "Footpath par khula manhole hai, raat mein dikhai nahi deta. Bahut khatarnak hai." },
  { category: "DOCUMENTATION", title: "Ration card name correction pending", description: "Ration card mein naam ki spelling galat hai, correction ke liye apply kiya tha, abhi tak pending hai." },
];

const STATUS_FLOW: ReportStatus[] = [
  "REPORTED", "AUTHORITY_IDENTIFIED", "SUBMITTED", "ACKNOWLEDGED", "UNDER_REVIEW", "ACTION_TAKEN", "RESOLVED",
];

const RIGHTS_ARTICLES = [
  {
    slug: "water-rights", category: "WATER" as Category,
    title: { en: "Right to Safe Drinking Water", hi: "Swachh Peyjal ka Adhikaar" },
    summary: {
      en: "Access to safe drinking water is recognised as part of the right to life. Municipal bodies and water boards are responsible for regular, safe supply in their jurisdiction.",
      hi: "Swachh peyjal ka adhikaar jeevan ke adhikaar ka hissa mana gaya hai. Nagar nikay aur water board apne kshetra mein niyamit, surakshit supply ke liye zimmedar hain.",
    },
    actions: [
      { en: "Report supply failure or contamination to your local water board / municipal corporation.", hi: "Supply band hone ya paani ganda aane par apne local water board / nagar nigam ko report karein." },
      { en: "Ask for a complaint number and expected resolution time in writing.", hi: "Complaint number aur samadhan ki sambhavit time-limit likhit mein maangein." },
      { en: "If unresolved, escalate through the state public grievance portal or CPGRAMS.", hi: "Samadhan na ho to state public grievance portal ya CPGRAMS par escalate karein." },
      { en: "Keep dated photos and copies of every complaint you file.", hi: "Har complaint ki dated photos aur copies sambhal kar rakhein." },
    ],
    process: [
      { en: "File a complaint with the local water authority (online portal, helpline or office).", hi: "Local water authority ke paas complaint file karein (online portal, helpline ya office)." },
      { en: "Note the complaint/reference number and follow up after the stated timeline.", hi: "Complaint/reference number note karein aur di gayi time-limit ke baad follow up karein." },
      { en: "Escalate to the grievance redressal officer if there is no response.", hi: "Jawab na mile to grievance redressal officer ke paas escalate karein." },
      { en: "Track progress and keep JanAwaaz updated with the outcome.", hi: "Pragati track karein aur JanAwaaz par outcome update karein." },
    ],
    sources: [{ label: "Your municipal corporation / water board website", note: "Find the official grievance section" }, { label: "CPGRAMS (pgportal.gov.in)", note: "Centralised public grievance portal — verify the address on the official site" }],
  },
  {
    slug: "road-rights", category: "ROADS" as Category,
    title: { en: "Roads & Public Infrastructure", hi: "Sadak aur Public Infrastructure" },
    summary: {
      en: "Citizens can demand safe, motorable roads and footpaths. Responsibility usually lies with the municipal corporation, PWD, or NHAI depending on the road.",
      hi: "Nagrik surakshit sadak aur footpath ki maang kar sakte hain. Sadak ke prakar ke hisaab se zimmedari nagar nigam, PWD ya NHAI ki hoti hai.",
    },
    actions: [
      { en: "Identify who maintains the road: municipal road, PWD road, or highway.", hi: "Pehchanein sadak ka rakh-rakhav kaun karta hai: nagar nigam, PWD ya highway authority." },
      { en: "Report potholes, broken footpaths or missing signage with photos and location.", hi: "Gaddhe, toote footpath ya missing sign-board ki photo aur location ke saath report karein." },
      { en: "Mark urgent safety hazards (open manholes, collapsed stretches) as high priority.", hi: "Khatarnak sthitiyon (khule manhole, dhabi sadak) ko high priority batayein." },
      { en: "Follow up in writing if no action is taken within the promised time.", hi: "Vaada kiye gaye samay mein kaam na ho to likhit mein follow up karein." },
    ],
    process: [
      { en: "File the complaint with the correct road-owning authority.", hi: "Sahi road-owning authority ke paas complaint file karein." },
      { en: "Attach geotagged photos showing the exact spot.", hi: "Sahi jagah dikhati geotagged photos lagayein." },
      { en: "Escalate through the grievance portal if the timeline lapses.", hi: "Time-limit nikal jaye to grievance portal par escalate karein." },
      { en: "For highways, use the highway authority's official helpline/portal.", hi: "Highway ke liye highway authority ke official helpline/portal ka upyog karein." },
    ],
    sources: [{ label: "Municipal corporation / PWD website of your state", note: "Check the road maintenance section" }],
  },
  {
    slug: "education-rights", category: "EDUCATION" as Category,
    title: { en: "Right to Education", hi: "Shiksha ka Adhikaar" },
    summary: {
      en: "Every child aged 6–14 has a fundamental right to free and compulsory education. Schools must meet basic infrastructure and teacher norms.",
      hi: "6–14 saal ke har bachche ko muft aur anivarya shiksha ka maulik adhikaar hai. Schoolon mein buniyadi infrastructure aur teacher norms poore hone chahiye.",
    },
    actions: [
      { en: "Report missing teachers, broken classrooms or denial of admission to the education department.", hi: "Teacher ki kami, toote classroom ya admission se inkaar ki report education department ko dein." },
      { en: "School management committees can raise infrastructure issues formally.", hi: "School management committee infrastructure ke mudde aupchaarik roop se utha sakti hai." },
      { en: "Keep copies of applications and receipts for every request.", hi: "Har aavedan ki copy aur receipt sambhal kar rakhein." },
      { en: "Escalate to the district education officer if the school does not act.", hi: "School kaarravaai na kare to district education officer ke paas escalate karein." },
    ],
    process: [
      { en: "Write to the school head with the specific problem and date.", hi: "School head ko specific problem aur date ke saath likhein." },
      { en: "If unresolved in 15–30 days, approach the block/district education office.", hi: "15–30 din mein samadhan na ho to block/district education office jayein." },
      { en: "Use the state grievance portal for formal escalation.", hi: "Aupchaarik escalation ke liye state grievance portal ka upyog karein." },
      { en: "Track the complaint number until closure.", hi: "Closure tak complaint number track karein." },
    ],
    sources: [{ label: "Department of School Education of your state", note: "See the RTE/grievance section" }],
  },
  {
    slug: "employment-rights", category: "EMPLOYMENT" as Category,
    title: { en: "Employment & Livelihood Schemes", hi: "Rozgar aur Aajeevika Yojanaen" },
    summary: {
      en: "Rural households can demand guaranteed wage employment under MGNREGA. Job cards, muster rolls and timely wages are legal entitlements — not favours.",
      hi: "Gramin parivar MGNREGA ke tahat guaranteed mazdoori ki maang kar sakte hain. Job card, muster roll aur samay par mazdoori kanooni haq hai.",
    },
    actions: [
      { en: "Demand work in writing; keep a dated copy of the application.", hi: "Kaam ki maang likhit mein karein; aavedan ki dated copy rakhein." },
      { en: "Check muster rolls and wage payments for your name.", hi: "Apne naam ke liye muster roll aur wage payment check karein." },
      { en: "Report delayed wages or missing entries to the programme officer.", hi: "Delayed wages ya missing entry ki report programme officer ko dein." },
      { en: "Use the scheme's official helpline/portal for escalation.", hi: "Escalation ke liye scheme ke official helpline/portal ka upyog karein." },
    ],
    process: [
      { en: "Apply for a job card at the gram panchayat if you don't have one.", hi: "Job card na ho to gram panchayat mein aavedan karein." },
      { en: "Demand work; work must be provided within 15 days of demand.", hi: "Kaam maangein; maang ke 15 din ke andar kaam milna chahiye." },
      { en: "Wages must be paid within 15 days of work completion.", hi: "Kaam poora hone ke 15 din ke andar mazdoori milni chahiye." },
      { en: "Raise grievances on the scheme portal with your job card number.", hi: "Job card number ke saath scheme portal par grievance uthayein." },
    ],
    sources: [{ label: "MGNREGA official portal of your state", note: "Verify the portal address officially" }],
  },
  {
    slug: "public-service-rights", category: "PUBLIC_SERVICES" as Category,
    title: { en: "Public Services & Timely Delivery", hi: "Public Sevayein aur Samaybaddh Delivery" },
    summary: {
      en: "Many states guarantee time-bound delivery of citizen services (certificates, licences). If the timeline lapses, you can appeal to the designated appellate authority.",
      hi: "Kai rajya nagrik sevaon (certificate, licence) ki samaybaddh delivery ki guarantee dete hain. Time-limit nikalne par appellate authority ke paas appeal kar sakte hain.",
    },
    actions: [
      { en: "Apply through the official portal and save the acknowledgement number.", hi: "Official portal se apply karein aur acknowledgement number save karein." },
      { en: "Note the legally notified timeline for your service.", hi: "Apni seva ki notified time-limit note karein." },
      { en: "File a first appeal if the timeline lapses without reason.", hi: "Bina kaaran time-limit nikal jaye to first appeal file karein." },
      { en: "Keep every receipt, SMS and acknowledgement safe.", hi: "Har receipt, SMS aur acknowledgement surakshit rakhein." },
    ],
    process: [
      { en: "Submit the application with complete documents.", hi: "Poore documents ke saath aavedan jama karein." },
      { en: "Track status using the acknowledgement number.", hi: "Acknowledgement number se status track karein." },
      { en: "File an appeal on delay; a second appeal lies above that.", hi: "Deri par appeal file karein; uske upar second appeal ka pravdhaan hai." },
      { en: "Escalate to the grievance portal if appeals fail.", hi: "Appeal fail ho to grievance portal par escalate karein." },
    ],
    sources: [{ label: "Your state's citizen service / e-district portal", note: "Check notified timelines there" }],
  },
  {
    slug: "consumer-rights", category: "RIGHTS" as Category,
    title: { en: "Consumer Rights", hi: "Upbhokta Adhikaar" },
    summary: {
      en: "Consumers are protected against defective goods, deficient services and unfair trade practices. Complaints can be filed online with the consumer commission.",
      hi: "Upbhokta kharab samaan, kami wali seva aur unfair trade practices se surakshit hain. Consumer commission mein online complaint file ki ja sakti hai.",
    },
    actions: [
      { en: "First complain to the seller/service provider in writing.", hi: "Pehle seller/service provider ko likhit mein complaint karein." },
      { en: "Keep bills, warranties and all communication as evidence.", hi: "Bill, warranty aur saari communication evidence ke roop mein rakhein." },
      { en: "File on the national consumer helpline portal if unresolved.", hi: "Samadhan na ho to national consumer helpline portal par file karein." },
      { en: "Approach the consumer commission for higher-value disputes.", hi: "Bade vivadon ke liye consumer commission jayein." },
    ],
    process: [
      { en: "Send a written notice to the opposite party with a 15-day deadline.", hi: "Virodhi paksh ko 15 din ki deadline ke saath likhit notice bhejein." },
      { en: "File the consumer complaint with evidence and fee.", hi: "Evidence aur fee ke saath consumer complaint file karein." },
      { en: "Attend hearings or authorise a representative.", hi: "Sunvai mein upasthit ho ya pratinidhi authorize karein." },
      { en: "Appeals lie to higher commissions within limitation.", hi: "Time-limit ke andar higher commission mein appeal ho sakti hai." },
    ],
    sources: [{ label: "National Consumer Helpline (official portal)", note: "Verify the portal address officially" }],
  },
  {
    slug: "environment-rights", category: "ENVIRONMENT" as Category,
    title: { en: "Environment & Clean Surroundings", hi: "Paryavaran aur Swachh Vatavaran" },
    summary: {
      en: "Citizens can seek action against pollution — garbage burning, illegal dumping, noise or industrial emissions — through pollution control boards and municipal bodies.",
      hi: "Nagrik pradushan — kachra jalana, illegal dumping, shor ya industrial emission — ke khilaf pollution control board aur nagar nikay se kaarravaai ki maang kar sakte hain.",
    },
    actions: [
      { en: "Report pollution with photos, date, time and exact location.", hi: "Photo, date, time aur sahi location ke saath pradushan report karein." },
      { en: "Approach the State Pollution Control Board for industrial/air/water pollution.", hi: "Industrial/air/water pollution ke liye State Pollution Control Board jayein." },
      { en: "Use municipal helplines for garbage burning and dumping.", hi: "Kachra jalane/dumping ke liye municipal helpline ka upyog karein." },
      { en: "Escalate on the grievance portal if there is no action.", hi: "Kaarravaai na ho to grievance portal par escalate karein." },
    ],
    process: [
      { en: "Document the violation with dated evidence.", hi: "Dated evidence ke saath violation document karein." },
      { en: "File with the correct board/authority and take a reference number.", hi: "Sahi board/authority ke paas file karein aur reference number lein." },
      { en: "Follow up after the stated inspection timeline.", hi: "Inspection ki time-limit ke baad follow up karein." },
      { en: "Escalate formally if the violation continues.", hi: "Violation jaari rahe to aupchaarik escalate karein." },
    ],
    sources: [{ label: "State Pollution Control Board website", note: "See the complaint section" }],
  },
  {
    slug: "peaceful-participation", category: "RIGHTS" as Category,
    title: { en: "Peaceful Civic Participation", hi: "Shantipurn Nagrik Bhagidari" },
    summary: {
      en: "Citizens have the right to assemble peacefully, express views, and petition authorities. Participation must remain lawful, non-violent and respectful of others' rights.",
      hi: "Nagrikon ko shantipurn roop se ikattha hone, vichar vyakt karne aur authorities ko petition dene ka adhikaar hai. Bhagidari kanooni, ahinsak aur doosron ke adhikaaron ka samman karti honi chahiye.",
    },
    actions: [
      { en: "Express concerns through lawful channels: petitions, grievance portals, public hearings.", hi: "Chintaon ko kanooni madhyamon se vyakt karein: petition, grievance portal, public hearing." },
      { en: "Check local permissions required for public gatherings in advance.", hi: "Public gathering ke liye aavashyak local permission pehle se check karein." },
      { en: "Keep participation peaceful; do not block emergency services or hospitals.", hi: "Bhagidari shantipurn rakhein; emergency sevaon ya hospital ka rasta na rokein." },
      { en: "Document events factually; do not spread unverified claims.", hi: "Ghatnaon ko tathyatmak roop se document karein; unverified daave na failayein." },
    ],
    process: [
      { en: "Draft a clear memorandum stating the issue and the specific ask.", hi: "Issue aur specific maang batata spasht memorandum taiyaar karein." },
      { en: "Submit it to the concerned authority and keep a stamped copy.", hi: "Sambandhit authority ko submit karein aur stamped copy rakhein." },
      { en: "Seek written acknowledgement and a response timeline.", hi: "Likhit acknowledgement aur jawab ki time-limit maangein." },
      { en: "Follow up through RTI or grievance portals if needed.", hi: "Zaroorat ho to RTI ya grievance portal se follow up karein." },
    ],
    sources: [{ label: "District administration website", note: "See permissions and public hearing notices" }],
  },
];

const PUBLIC_ISSUES = [
  {
    slug: "delhi-winter-air-quality", title: "Delhi Winter Air Quality Concerns", category: "ENVIRONMENT" as Category,
    state: "Delhi", district: "New Delhi", city: "Delhi", status: "ACTION_PENDING" as const,
    description: "Residents across Delhi report deteriorating air quality during winter months, raising health concerns especially for children, the elderly and outdoor workers.",
    background: "Seasonal factors combine with local emissions each winter. Authorities announce graded action plans and advisories when air quality worsens.",
    concerns: "Citizens raise concerns about children's health, outdoor work safety, and the effectiveness of enforcement against open burning and dust.",
    officialResponse: "Authorities state that graded response measures, smog advisories and enforcement drives are activated as per the season's action plan.",
    reportCount: 214, evidenceCount: 96,
    sources: [{ label: "Official air quality bulletins", note: "Check the CPCB/official AQI bulletins" }, { label: "Municipal advisories", note: "Verify on official websites" }],
  },
  {
    slug: "mumbai-suburban-train-crowding", title: "Mumbai Suburban Train Crowding", category: "TRANSPORT" as Category,
    state: "Maharashtra", district: "Mumbai", city: "Mumbai", status: "UNDER_REVIEW" as const,
    description: "Commuters report severe overcrowding on suburban locals during peak hours, raising safety and comfort concerns for daily passengers.",
    background: "Mumbai's suburban network carries millions daily. Peak-hour demand regularly exceeds comfortable capacity on several corridors.",
    concerns: "Passengers cite safety at doorways, delays, and inadequate frequency during rush hours.",
    officialResponse: "Railway authorities state that additional services and infrastructure upgrades are planned in phases.",
    reportCount: 186, evidenceCount: 74,
    sources: [{ label: "Railway press releases", note: "Verify on official railway portals" }],
  },
  {
    slug: "bengaluru-water-shortage", title: "Bengaluru Outer-Area Water Supply", category: "WATER" as Category,
    state: "Karnataka", district: "Bengaluru Urban", city: "Bengaluru", status: "ACTION_PENDING" as const,
    description: "Residents in several outer areas report irregular piped supply and dependence on tankers during dry months.",
    background: "Rapid growth has strained supply networks in peripheral layouts, where piped connections are still being extended.",
    concerns: "Citizens ask for predictable tanker schedules, faster pipeline extension and transparent supply timings.",
    officialResponse: "The water board states that augmentation projects and tanker scheduling improvements are underway.",
    reportCount: 158, evidenceCount: 61,
    sources: [{ label: "Water board notices", note: "Verify on the official water board website" }],
  },
  {
    slug: "chennai-monsoon-drainage", title: "Chennai Monsoon Drainage & Waterlogging", category: "DRAINAGE" as Category,
    state: "Tamil Nadu", district: "Chennai", city: "Chennai", status: "UNDER_REVIEW" as const,
    description: "Residents report waterlogging in low-lying neighbourhoods during heavy monsoon spells, affecting movement and homes.",
    background: "Intense rainfall periodically overwhelms storm drains in parts of the city; desilting drives are conducted before the monsoon.",
    concerns: "Citizens seek faster drain desilting, working pumping stations and early warnings for vulnerable streets.",
    officialResponse: "The municipal corporation states that desilting and pump deployment follow the monsoon preparedness plan.",
    reportCount: 142, evidenceCount: 58,
    sources: [{ label: "Municipal monsoon preparedness reports", note: "Verify on the official corporation website" }],
  },
  {
    slug: "patna-road-repair", title: "Patna Road Repair Delays", category: "ROADS" as Category,
    state: "Bihar", district: "Patna", city: "Patna", status: "REPORTED" as const,
    description: "Citizens report dug-up stretches and potholes remaining unattended for weeks in several localities.",
    background: "Utility digging followed by delayed resurfacing is a recurring complaint in growing urban stretches.",
    concerns: "Two-wheeler riders and pedestrians report the highest risk; residents want clear repair timelines.",
    officialResponse: null,
    reportCount: 97, evidenceCount: 33,
    sources: [{ label: "Citizen reports on JanAwaaz", note: "Reported information — verification pending" }],
  },
  {
    slug: "hyderabad-street-lighting", title: "Hyderabad Street Lighting Restoration", category: "ELECTRICITY" as Category,
    state: "Telangana", district: "Hyderabad", city: "Hyderabad", status: "RESOLVED" as const,
    description: "Residents reported non-functional street lights across several colonies, affecting night-time safety.",
    background: "A cluster of complaints in early 2026 pointed to fused lamps and faulty timers in multiple wards.",
    concerns: "Citizens highlighted women's safety and road visibility during night hours.",
    officialResponse: "The municipal corporation confirmed replacement of faulty fittings and restoration of timer-based switching across the reported wards.",
    reportCount: 64, evidenceCount: 21,
    sources: [{ label: "Municipal work completion notes", note: "As shared with complainants" }],
  },
];

async function main() {
  console.log("Seeding JanAwaaz…");
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12);

  // ── Users ──
  const admin = await prisma.user.upsert({
    where: { email: "admin@janaawaaz.local" },
    update: {},
    create: { name: "JanAwaaz Admin", email: "admin@janaawaaz.local", passwordHash, role: "ADMIN", language: "en" },
  });
  const delhiOfficer = await prisma.user.upsert({
    where: { email: "delhi.officer@janaawaaz.local" },
    update: {},
    create: { name: "Delhi Grievance Officer", email: "delhi.officer@janaawaaz.local", passwordHash, role: "AUTHORITY", language: "en", jurisdictionState: "Delhi", jurisdictionDistrict: "New Delhi", department: "Municipal Grievance Cell" },
  });
  const mumbaiOfficer = await prisma.user.upsert({
    where: { email: "mumbai.officer@janaawaaz.local" },
    update: {},
    create: { name: "Mumbai Civic Officer", email: "mumbai.officer@janaawaaz.local", passwordHash, role: "AUTHORITY", language: "en", jurisdictionState: "Maharashtra", jurisdictionDistrict: "Mumbai", department: "Civic Services Cell" },
  });
  const citizens: { id: string; name: string }[] = [];
  const citizenSeed = [
    { name: "Priya Sharma", email: "priya@janaawaaz.local", language: "hi", state: "Delhi", district: "New Delhi" },
    { name: "Rahul Verma", email: "rahul@janaawaaz.local", language: "hi", state: "Uttar Pradesh", district: "Lucknow" },
    { name: "Anita Desai", email: "anita@janaawaaz.local", language: "en", state: "Maharashtra", district: "Mumbai" },
  ];
  for (const c of citizenSeed) {
    const u = await prisma.user.upsert({
      where: { email: c.email },
      update: {},
      create: { name: c.name, email: c.email, passwordHash, role: "CITIZEN", language: c.language, state: c.state, district: c.district },
    });
    citizens.push({ id: u.id, name: u.name });
  }

  // ── Rights articles ──
  for (const a of RIGHTS_ARTICLES) {
    await prisma.rightArticle.upsert({
      where: { slug: a.slug },
      update: { title: a.title, summary: a.summary, actions: a.actions, process: a.process, sources: a.sources },
      create: { slug: a.slug, category: a.category, title: a.title, summary: a.summary, actions: a.actions, process: a.process, sources: a.sources },
    });
  }

  // ── Public issues ──
  const issueRows: { id: string; slug: string }[] = [];
  for (const i of PUBLIC_ISSUES) {
    const row = await prisma.publicIssue.upsert({
      where: { slug: i.slug },
      update: { title: i.title, category: i.category, state: i.state, district: i.district, city: i.city, description: i.description, background: i.background, concerns: i.concerns, officialResponse: i.officialResponse, status: i.status, reportCount: i.reportCount, evidenceCount: i.evidenceCount, sources: i.sources },
      create: { slug: i.slug, title: i.title, category: i.category, state: i.state, district: i.district, city: i.city, description: i.description, background: i.background, concerns: i.concerns, officialResponse: i.officialResponse, status: i.status, reportCount: i.reportCount, evidenceCount: i.evidenceCount, sources: i.sources },
    });
    issueRows.push({ id: row.id, slug: row.slug });
  }

  // ── Reports (demo) ──
  await prisma.report.deleteMany({ where: { publicId: { startsWith: "JA-1" } } });
  let n = 10001;
  const areas = ["Shastri Nagar", "Gandhi Chowk", "Station Road", "Model Town", "Nehru Nagar", "Old Bazaar", "Civil Lines", "Rajaji Marg"];
  for (let ci = 0; ci < CITIES.length; ci++) {
    const c = CITIES[ci];
    const rand = seeded(ci + 7);
    const perCity = 4;
    for (let k = 0; k < perCity; k++) {
      const t = REPORT_TEMPLATES[Math.floor(rand() * REPORT_TEMPLATES.length)];
      const statusIdx = Math.min(Math.floor(rand() * STATUS_FLOW.length), STATUS_FLOW.length - 1);
      const status = STATUS_FLOW[statusIdx];
      const priority: Priority = rand() > 0.85 ? "HIGH" : rand() > 0.6 ? "MEDIUM" : "LOW";
      const citizen = citizens[Math.floor(rand() * citizens.length)];
      const area = areas[Math.floor(rand() * areas.length)];
      const jitter = () => (rand() - 0.5) * 0.12;
      const publicId = `JA-${n++}`;
      const linkedIssue = k === 0 ? issueRows.find((x) => x.slug.includes(c.city.toLowerCase().slice(0, 4)))?.id ?? null : null;
      const createdDaysAgo = Math.floor(rand() * 45) + 1;
      const createdAt = new Date(Date.now() - createdDaysAgo * 86400000);

      const report = await prisma.report.create({
        data: {
          publicId, userId: citizen.id, category: t.category,
          title: t.title, description: t.description,
          state: c.state, district: c.district, city: c.city, area,
          landmark: `Near ${area} bus stop`,
          latitude: c.lat + jitter(), longitude: c.lng + jitter(),
          status, priority, isPublic: true, issueId: linkedIssue,
          createdAt, updatedAt: new Date(createdAt.getTime() + statusIdx * 86400000),
        },
      });

      // Status history trail
      for (let s = 0; s <= statusIdx; s++) {
        await prisma.statusHistory.create({
          data: {
            reportId: report.id,
            fromStatus: s === 0 ? null : STATUS_FLOW[s - 1],
            toStatus: STATUS_FLOW[s],
            note: s === 0 ? "Report created by citizen" : undefined,
            createdAt: new Date(createdAt.getTime() + s * 86400000),
          },
        });
      }

      // Official response for some advanced reports
      if (statusIdx >= 3 && rand() > 0.4) {
        const officer = c.state === "Delhi" ? delhiOfficer : c.state === "Maharashtra" ? mumbaiOfficer : delhiOfficer;
        await prisma.officialResponse.create({
          data: {
            reportId: report.id, authorityId: officer.id,
            content: "Humne aapki complaint receive kar li hai. Sambandhit team ko site inspection ke liye bheja gaya hai. Kaarravaai ki update yahin di jayegi.",
            createdAt: new Date(createdAt.getTime() + 3 * 86400000),
          },
        });
      }
    }
  }
  await prisma.setting.upsert({ where: { key: "report_counter" }, update: { value: String(n) }, create: { key: "report_counter", value: String(n) } });

  // ── Notifications (demo) ──
  const sampleReport = await prisma.report.findFirst({ orderBy: { createdAt: "desc" } });
  if (sampleReport) {
    for (const citizen of citizens.slice(0, 2)) {
      await prisma.notification.create({
        data: {
          userId: citizen.id, type: "STATUS_CHANGE",
          title: "Complaint status updated",
          body: `Your report ${sampleReport.publicId} is now under review. You can track progress on your dashboard.`,
          link: `/track/${sampleReport.publicId}`,
        },
      });
    }
  }

  console.log("Seed complete.");
  console.log("Demo logins (password: JanAwaaz123!):");
  console.log("  admin@janaawaaz.local (ADMIN)");
  console.log("  delhi.officer@janaawaaz.local (AUTHORITY — Delhi)");
  console.log("  mumbai.officer@janaawaaz.local (AUTHORITY — Maharashtra/Mumbai)");
  console.log("  priya@janaawaaz.local / rahul@janaawaaz.local / anita@janaawaaz.local (CITIZEN)");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
