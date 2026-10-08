# 🇮🇳 JanAwaaz — Har Awaaz. Har Jagah. Ek India.

**JanAwaaz** is a premium, production-ready, full-stack civic-tech platform for citizens of India.

> “We love India. We care about its people. We listen to every voice.”

Citizens can **understand public issues, ask questions, report local problems, learn their rights, discover official processes, follow complaint progress, and access reliable civic information** — in **13 Indian languages**.

JanAwaaz is **politically neutral** and citizen-focused. It is not a political party website, election campaign, or propaganda platform.

---

## ✨ Highlights

- 🎬 **Cinematic hero** with generated 16:9 artwork, floating particles, scroll reveals, animated counters
- 🌐 **13 languages** — Hindi, English, Bengali, Telugu, Marathi, Tamil, Gujarati, Kannada, Malayalam, Punjabi, Odia, Assamese, Urdu — changing the *entire* interface
- 🤖 **JanAwaaz AI** — 24×7 multilingual civic assistant: problem classification (16 categories), smart follow-ups, professional complaint drafts, notice explainer, status explainer, voice input, PII detection, safety guardrails
- 📢 **Report flow** — Category → Description → Location → Evidence → Review → Submit, with AI assist and offline draft autosave
- 📎 **Evidence system** — photo/video/document/voice upload with type + size validation, client-side image compression, private serving
- 🗺️ **Interactive India map** — Leaflet heatmap with city-level aggregation (privacy-safe)
- 📊 **Public issues** — moderated, aggregated issues with verified/reported/unverified/disputed labels
- ⚖️ **Know Your Rights** — 8 guides in English + Hindi with processes and official sources
- 📍 **Complaint tracking** — public timeline (Report → … → Resolved) + official responses
- 🏛️ **Authority dashboard** — jurisdiction-scoped RBAC, status updates, official responses, audit trail
- 🔐 **Privacy-first** — no public identities, aggregated public data, secure evidence, PII masking
- 📱 **Mobile-first** — bottom navigation, floating AI button, responsive everywhere
- ♿ **Accessible** — skip link, ARIA labels, focus states, reduced-motion support

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4 |
| Backend | Next.js API routes, Prisma 6 ORM |
| Database | PostgreSQL 16 |
| Auth | bcryptjs + jose JWT in HTTP-only cookies, role-based (CITIZEN / AUTHORITY / ADMIN) |
| Maps | Leaflet + react-leaflet (OpenStreetMap tiles) |
| AI | Rule-based civic engine (`lib/ai/`) — intents, multilingual classifier, draft generator, knowledge base, safety/PII |
| Validation | zod |

---

## 🚀 Quick Start (VS Code)

Open this folder directly in VS Code. No absolute paths are used anywhere.

```bash
# 1. Install dependencies
npm install

# 2. Start PostgreSQL
docker compose up -d

# 3. Configure environment
cp .env.example .env
# Edit .env — set a long random JWT_SECRET

# 4. Run database migrations + seed demo data
npx prisma migrate dev --name init
npx prisma db seed

# 5. Start the dev server
npm run dev
```

Open **http://localhost:3000** 🎉

### Verify before handoff

```bash
npx tsc --noEmit        # TypeScript type-check
npx prisma validate     # Prisma schema validation
npm run build           # production build
```

---

## 🔑 Demo Accounts

Password for all demo accounts: **`JanAwaaz123!`**

| Email | Role | Access |
|---|---|---|
| `admin@janaawaaz.local` | ADMIN | Everything |
| `delhi.officer@janaawaaz.local` | AUTHORITY | Delhi jurisdiction console |
| `mumbai.officer@janaawaaz.local` | AUTHORITY | Mumbai jurisdiction console |
| `priya@janaawaaz.local` | CITIZEN | Report, track, AI chat |
| `rahul@janaawaaz.local` | CITIZEN | Report, track, AI chat |
| `anita@janaawaaz.local` | CITIZEN | Report, track, AI chat |

> Demo statistics on the landing page are labelled **“DEMO DATA — NOT LIVE GOVERNMENT STATISTICS”** and are never presented as real.

---

## 🗂️ Project Structure

```
janaawaaz/
├── app/
│   ├── page.tsx                  # Landing (hero, stats, languages, map teaser, …)
│   ├── layout.tsx                # Root layout + providers
│   ├── login/  register/         # Auth pages
│   ├── explore/                  # Browse public reports (search + filters)
│   ├── report/                   # Multi-step report flow
│   ├── map/                      # Interactive India heatmap
│   ├── issues/  issues/[slug]/   # Public issues & movements
│   ├── rights/                   # Know Your Rights
│   ├── ai-assistant/             # Dedicated AI chat page
│   ├── dashboard/                # Citizen dashboard
│   ├── authority/                # Authority console (RBAC)
│   ├── track/[id]/               # Public complaint tracking
│   └── api/                      # 20+ API routes (see below)
├── components/
│   ├── Navbar.tsx                # Sticky nav, language, notifications, user menu, bottom nav, floating AI
│   ├── ChatUI.tsx                # Full AI chat (bubbles, voice, drafts, sources, feedback)
│   ├── IndiaMap.tsx              # Leaflet heatmap
│   ├── EvidenceUploader.tsx      # Drag/drop uploader with compression
│   ├── Timeline.tsx              # Complaint status timeline
│   └── …
├── lib/
│   ├── ai/                       # JanAwaaz AI engine
│   │   ├── engine.ts             # Intent detection + response generation (EN/HI)
│   │   ├── classifier.ts         # Multilingual problem classifier + location extraction
│   │   ├── knowledge.ts          # Verified civic knowledge base (RTI, grievance, processes)
│   │   ├── drafts.ts             # Professional complaint draft generator
│   │   └── safety.ts             # PII detection/masking + unsafe-request guardrails
│   ├── i18n/                     # 13-language dictionaries + provider
│   ├── auth.ts  db.ts  reports.ts  api-client.ts  …
├── prisma/
│   ├── schema.prisma             # 14 models
│   └── seed.ts                   # Demo users, rights, issues, 36 reports
├── public/images/                # Generated hero + section artwork
├── types/  hooks/  utils/         # Re-export shims (flat convention)
├── docker-compose.yml            # PostgreSQL 16
└── .env.example                  # Placeholder env (real .env never shipped)
```

### API routes

```
POST /api/auth/register  POST /api/auth/login  POST /api/auth/logout  GET /api/auth/me
GET  /api/reports  POST /api/reports
GET  /api/reports/[id]  PATCH /api/reports/[id]  POST /api/reports/[id]/respond
POST /api/evidence  GET /api/evidence/[id]          # authenticated, private serving
GET  /api/issues  POST /api/issues                 # POST = admin only
GET  /api/issues/[slug]  POST /api/issues/[slug]/save
GET  /api/rights
POST /api/ai/chat  GET /api/ai/chat  POST /api/ai/draft
GET  /api/notifications  PATCH /api/notifications
GET  /api/stats  GET /api/map  GET /api/search
GET  /api/user/profile  PATCH /api/user/profile
GET  /api/authority/stats
```

All JSON responses use `{ success, data, error }`.

---

## 🗄️ Database Schema

**User** (CITIZEN/AUTHORITY/ADMIN, language, jurisdiction for officers) ·
**Report** (`JA-` public IDs, 16 categories, 8 statuses, area-level location) ·
**StatusHistory** (audit trail) · **Evidence** (private file metadata + PII flags) ·
**OfficialResponse** (verbatim) · **PublicIssue** (moderated aggregation) ·
**RightArticle** (EN/HI) · **Conversation** + **ChatMessage** (AI sessions) ·
**Notification** · **SavedIssue** · **AuditLog** · **Setting**

Migrations live in `prisma/migrations/` after `migrate dev`. Seed with `npx prisma db seed`.

---

## 🤖 JanAwaaz AI — how it works

No external LLM key is required. The engine (`lib/ai/`) is a transparent, rule-based civic assistant:

1. **PII scan** — Aadhaar/phone/OTP/bank patterns are masked; user is warned.
2. **Safety gate** — violence, illegal activity, political persuasion, personal-data requests and protest-operation instructions get safe completions.
3. **Intent detection** — greeting, report, status, draft, RTI, grievance, scheme, notice, rights, public issue, … in Hindi/Hinglish/English.
4. **Classification** — keyword scoring across 16 categories (EN + Devanagari + Hinglish).
5. **Smart follow-ups** — only asks for actually-missing info (location, details).
6. **Draft generation** — subject, description, location, duration, impact, requested action, evidence ref — **preview only, never auto-submitted**.
7. **Knowledge answers** — from a curated EN/HI base with 🟢 Verified / 🔵 AI Explanation / 🟡 Reported / ⚪ User / 🟠 Disputed labels and source cards.
8. **Authority guidance** — describes the *likely process*; never invents departments, phone numbers, emails, URLs or officials.

Swap-in point: replace `respond()` in `lib/ai/engine.ts` with an LLM call — the API contract (`AIResponse`) stays the same.

---

## 🔐 Security & Privacy Notes

- Passwords hashed with bcrypt (12 rounds); sessions are signed JWTs in HTTP-only cookies.
- Authority access is **jurisdiction-scoped** (state/district); admins see all.
- Evidence is stored **outside the public dir** and served only via an authenticated route.
- Public APIs return **privacy-safe shapes** — no names, phones, emails, or precise locations.
- AI chat has rate limiting (30 msgs/hour/session), PII masking, and audit-friendly storage.
- Before public deployment, add: rate limiting at the edge (Redis), CSRF tokens, an email provider for password reset, and object storage (S3) for evidence.

---

## 🌍 Adding a Language

1. Add the code to `Lang` and `LANGUAGES` in `lib/i18n/dictionaries.ts`
2. Add a full `Dict` object + register it in `dictionaries`
3. The `LanguageProvider` picks it up everywhere automatically (nav, forms, AI, rights, notifications…)

---

## ☁️ Deployment

**Vercel + hosted Postgres (e.g. Neon/Supabase):**

```bash
npm run build
# Set env vars in the host: DATABASE_URL, JWT_SECRET, NEXT_PUBLIC_SITE_URL
npx prisma migrate deploy
npx prisma db seed   # optional demo data
```

Set `UPLOAD_DIR` to a persistent volume, or plug in S3-compatible storage in `app/api/evidence/route.ts`.

---

## 📜 License & Neutrality

Built for demonstration. JanAwaaz is politically neutral and not affiliated with any political party, candidate, or government body. Sample content is demo data — verify important civic information against official sources.

🇮🇳 *Made with technology for citizens of India.*
