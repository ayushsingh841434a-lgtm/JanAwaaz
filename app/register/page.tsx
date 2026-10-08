"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, UserPlus } from "lucide-react";
import { useLanguage } from "@/lib/i18n/provider";
import { useToast } from "@/components/Toast";
import { post } from "@/lib/api-client";

export default function RegisterPage() {
  const { dict, lang } = useLanguage();
  const { toast } = useToast();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", state: "", district: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await post("/api/auth/register", { ...form, language: lang });
      toast("Account created. Welcome to JanAwaaz!");
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Registration failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const inputCls =
    "w-full rounded-2xl border border-ink-900/15 bg-cream-50 px-4 py-3 text-[15px] outline-none transition focus:border-saffron-400";

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-14 sm:px-6">
      <div className="rounded-[2rem] border border-ink-900/10 bg-white p-8 shadow-lift">
        <p className="text-4xl">🙏</p>
        <h1 className="mt-3 text-2xl font-extrabold text-ink-900">{dict.nav.register}</h1>
        <p className="mt-1 text-sm text-ink-500">Join citizens raising their voice responsibly.</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-bold text-ink-700">
              Full name <span className="text-saffron-600">*</span>
            </label>
            <input id="name" required value={form.name} onChange={set("name")} className={inputCls} autoComplete="name" />
          </div>
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-bold text-ink-700">
              Email <span className="text-saffron-600">*</span>
            </label>
            <input id="email" type="email" required value={form.email} onChange={set("email")} className={inputCls} placeholder="you@example.in" autoComplete="email" />
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-bold text-ink-700">
              Password <span className="text-saffron-600">*</span>
            </label>
            <input
              id="password" type="password" required minLength={8} value={form.password}
              onChange={set("password")} className={inputCls} placeholder="Min 8 characters" autoComplete="new-password"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="state" className="mb-1.5 block text-sm font-bold text-ink-700">State</label>
              <input id="state" value={form.state} onChange={set("state")} className={inputCls} />
            </div>
            <div>
              <label htmlFor="district" className="mb-1.5 block text-sm font-bold text-ink-700">District</label>
              <input id="district" value={form.district} onChange={set("district")} className={inputCls} />
            </div>
          </div>
          <p className="rounded-2xl bg-leaf-50 px-4 py-3 text-[12px] text-leaf-800">
            🔒 {lang === "hi" ? "आपकी निजी जानकारी कभी सार्वजनिक नहीं दिखाई जाती।" : "Your personal details are never shown publicly."}
          </p>
          <button
            type="submit" disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-saffron-600 py-3.5 font-bold text-white shadow-soft transition hover:bg-saffron-700 disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <UserPlus className="h-5 w-5" />}
            {dict.nav.register}
          </button>
        </form>
        <p className="mt-5 text-center text-sm text-ink-500">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-saffron-700 hover:underline">{dict.nav.login}</Link>
        </p>
      </div>
    </div>
  );
}
