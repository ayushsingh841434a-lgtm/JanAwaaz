"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, LogIn } from "lucide-react";
import { useLanguage } from "@/lib/i18n/provider";
import { useToast } from "@/components/Toast";
import { post } from "@/lib/api-client";

export default function LoginPage() {
  const { dict } = useLanguage();
  const { toast } = useToast();
  const router = useRouter();
  const search = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await post<{ role: string }>("/api/auth/login", { email, password });
      toast("Welcome back!");
      const next = search.get("next");
      if (next) router.push(next);
      else if (data.role === "AUTHORITY" || data.role === "ADMIN") router.push("/authority");
      else router.push("/dashboard");
      router.refresh();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Login failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-14 sm:px-6">
      <div className="rounded-[2rem] border border-ink-900/10 bg-white p-8 shadow-lift">
        <p className="text-4xl">🇮🇳</p>
        <h1 className="mt-3 text-2xl font-extrabold text-ink-900">{dict.nav.login}</h1>
        <p className="mt-1 text-sm text-ink-500">Har Awaaz. Har Jagah. Ek India.</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-bold text-ink-700">Email</label>
            <input
              id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-ink-900/15 bg-cream-50 px-4 py-3 text-[15px] outline-none transition focus:border-saffron-400"
              placeholder="you@example.in" autoComplete="email"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-bold text-ink-700">Password</label>
            <input
              id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-ink-900/15 bg-cream-50 px-4 py-3 text-[15px] outline-none transition focus:border-saffron-400"
              placeholder="••••••••" autoComplete="current-password"
            />
          </div>
          <button
            type="submit" disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-saffron-600 py-3.5 font-bold text-white shadow-soft transition hover:bg-saffron-700 disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <LogIn className="h-5 w-5" />}
            {dict.nav.login}
          </button>
        </form>
        <p className="mt-5 text-center text-sm text-ink-500">
          No account?{" "}
          <Link href="/register" className="font-bold text-saffron-700 hover:underline">{dict.nav.register}</Link>
        </p>
        <div className="mt-6 rounded-2xl bg-cream-100 p-4 text-[12px] leading-relaxed text-ink-500">
          <p className="font-bold text-ink-700">Demo accounts (password: JanAwaaz123!)</p>
          <p className="mt-1 font-mono">priya@janaawaaz.local — citizen</p>
          <p className="font-mono">delhi.officer@janaawaaz.local — authority</p>
          <p className="font-mono">admin@janaawaaz.local — admin</p>
        </div>
      </div>
    </div>
  );
}
