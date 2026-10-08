import type { Metadata } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Navbar, BottomNav, FloatingAI } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { isLang, type Lang } from "@/lib/i18n/dictionaries";
import { languageDirection } from "@/lib/i18n/preference";

export const metadata: Metadata = {
  title: "JanAwaaz — Every voice. Everywhere. One India.",
  description:
    "JanAwaaz is a civic-tech platform for citizens of India: report local problems, understand your rights, follow complaint progress, and access reliable civic information — in your language.",
  keywords: ["civic tech", "India", "complaint", "grievance", "RTI", "citizen", "JanAwaaz"],
  openGraph: {
    title: "JanAwaaz — Every voice. Everywhere. One India.",
    description: "Know the issue. Raise your voice. Find the way forward.",
    type: "website",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const store = await cookies();
  const cookieLang = store.get("ja_lang")?.value;
  const lang: Lang = cookieLang && isLang(cookieLang) ? cookieLang : "en";

  return (
    <html lang={lang} dir={languageDirection(lang)}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:bg-ink-900 focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <Providers initialLang={lang}>
          <Navbar />
          <main id="main" className="min-h-screen pt-[68px]">
            {children}
          </main>
          <Footer />
          <FloatingAI />
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}
