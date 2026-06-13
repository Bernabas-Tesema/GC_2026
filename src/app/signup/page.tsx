"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { KeyRound, Loader2, Lock, Mail, UserPlus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import IconLabel from "@/components/IconLabel";
import PasswordInput from "@/components/PasswordInput";
import { useLanguage } from "@/contexts/LanguageContext";
import { getAuthErrorKey } from "@/lib/authErrors";
import { isManagerEmail } from "@/lib/admin";
import Navbar from "@/components/Navbar";

export default function SignupPage() {
  const { signup } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError(t.auth.passwordTooShort);
      return;
    }

    if (password !== confirmPassword) {
      setError(t.auth.passwordMismatch);
      return;
    }

    if (isManagerEmail(email.trim())) {
      setError(t.auth.managerUseLogin);
      return;
    }

    setLoading(true);

    try {
      await signup(email, password);
      router.push("/profile");
    } catch (err) {
      const key = getAuthErrorKey(err, "signup") as keyof typeof t.auth;
      setError(t.auth[key] ?? t.auth.signupError);
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
              {t.auth.signupTitle}
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
                <IconLabel icon={Lock}>{t.auth.password}</IconLabel>
                <PasswordInput value={password} onChange={setPassword} />
              </div>

              <div>
                <IconLabel icon={KeyRound}>{t.auth.confirmPassword}</IconLabel>
                <PasswordInput
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                />
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
                    <UserPlus className="h-5 w-5" />
                    {t.auth.signupButton}
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-navy/10" />
              <p className="text-xs text-navy/40">{t.auth.hasAccount}</p>
              <div className="h-px flex-1 bg-navy/10" />
            </div>

            <Link
              href="/login"
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gold/40 py-3 text-sm font-semibold text-navy transition-all hover:bg-gold/8 hover:border-gold"
            >
              {t.nav.login}
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
