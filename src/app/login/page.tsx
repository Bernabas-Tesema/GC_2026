"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { motion } from "framer-motion";
import { Loader2, Lock, LogIn, Mail } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import IconLabel from "@/components/IconLabel";
import PasswordInput from "@/components/PasswordInput";
import { useLanguage } from "@/contexts/LanguageContext";
import { getAuthErrorKey } from "@/lib/authErrors";
import Navbar from "@/components/Navbar";

function LoginForm() {
  const { login } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      const next = searchParams.get("next");
      router.push(next ?? "/book");
    } catch (err) {
      const key = getAuthErrorKey(err, "login") as keyof typeof t.auth;
      setError(t.auth[key] ?? t.auth.loginError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="book-surface min-h-screen pt-16">
      <Navbar variant="light" />

      <div className="flex min-h-screen items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Decorative top accent */}
          <div className="mb-6 flex flex-col items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-gold/40 bg-white shadow-md">
              <span className="font-serif text-xl text-gold">✝</span>
            </div>
            <h1 className="font-serif text-2xl font-bold text-navy sm:text-3xl">
              {t.auth.loginTitle}
            </h1>
            <p className="text-sm text-navy/50">GC ቤንሃናን · Yearbook 2026</p>
          </div>

          <div className="book-page rounded-3xl border border-gold/20 p-6 sm:p-8 book-shadow">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <IconLabel icon={Mail}>{t.auth.email}</IconLabel>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-navy/15 bg-white px-4 py-3 text-navy outline-none transition-all focus:border-gold focus:ring-2 focus:ring-gold/20 placeholder:text-navy/30"
                />
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <IconLabel icon={Lock} className="mb-0">
                    {t.auth.password}
                  </IconLabel>
                  <Link
                    href="/forgot-password"
                    className="text-xs font-medium text-gold hover:text-gold-dark hover:underline"
                  >
                    {t.auth.forgotPassword}
                  </Link>
                </div>
                <PasswordInput value={password} onChange={setPassword} />
              </div>

              {error && (
                <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl py-3.5 font-semibold text-white shadow-md transition-all hover:shadow-lg disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, #0f172a, #1e3a8a)" }}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    {t.common.loading}
                  </>
                ) : (
                  <>
                    <LogIn className="h-5 w-5" />
                    {t.auth.loginButton}
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-navy/10" />
              <p className="text-xs text-navy/40">{t.auth.noAccount}</p>
              <div className="h-px flex-1 bg-navy/10" />
            </div>

            <Link
              href="/signup"
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gold/40 py-3 text-sm font-semibold text-navy transition-all hover:bg-gold/8 hover:border-gold"
            >
              {t.nav.signup}
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}