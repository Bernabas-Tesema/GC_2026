"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, Lock, LogIn, Mail } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import IconLabel from "@/components/IconLabel";
import PasswordInput from "@/components/PasswordInput";
import { useLanguage } from "@/contexts/LanguageContext";
import { getAuthErrorKey } from "@/lib/authErrors";
import Navbar from "@/components/Navbar";

export default function LoginPage() {
  const { login } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
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
      router.push("/book");
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
          <div className="book-page rounded-2xl border border-gold/20 p-8 book-shadow">
            <h1 className="mb-8 text-center font-serif text-3xl font-bold text-navy">
              {t.auth.loginTitle}
            </h1>

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
                <div className="mb-1.5 flex items-center justify-between">
                  <IconLabel icon={Lock} className="mb-0">
                    {t.auth.password}
                  </IconLabel>
                  <Link
                    href="/forgot-password"
                    className="text-xs font-medium text-gold hover:underline"
                  >
                    {t.auth.forgotPassword}
                  </Link>
                </div>
                <PasswordInput
                  value={password}
                  onChange={setPassword}
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
                    <LogIn className="h-5 w-5" />
                    {t.auth.loginButton}
                  </>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-navy/60">
              {t.auth.noAccount}{" "}
              <Link href="/signup" className="font-medium text-gold hover:underline">
                {t.nav.signup}
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
