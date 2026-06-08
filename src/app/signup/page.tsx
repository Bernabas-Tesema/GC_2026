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
import Navbar from "@/components/Navbar";
import { SITE_BRAND_NAME } from "@/lib/constants";

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
          <div className="book-page rounded-2xl border border-gold/20 p-8 book-shadow">
            <h1 className="mb-2 text-center font-serif text-3xl font-bold text-navy">
              {t.auth.signupTitle}
            </h1>
            <p className="mb-8 text-center text-sm text-navy/60">
              {SITE_BRAND_NAME}
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <IconLabel icon={Mail}>{t.auth.email}</IconLabel>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-navy/15 bg-white px-4 py-2.5 text-navy outline-none transition-colors focus:border-gold focus:ring-2 focus:ring-gold/20"
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
                <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-navy py-3 font-semibold text-white transition-colors hover:bg-navy-light disabled:opacity-50"
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

            <p className="mt-6 text-center text-sm text-navy/60">
              {t.auth.hasAccount}{" "}
              <Link href="/login" className="font-medium text-gold hover:underline">
                {t.nav.login}
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
