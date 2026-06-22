"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, Mail, Send } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import IconLabel from "@/components/IconLabel";
import { useLanguage } from "@/contexts/LanguageContext";
import { getAuthErrorKey } from "@/lib/authErrors";
import AuthShell from "@/components/ui/AuthShell";

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (err) {
      const key = getAuthErrorKey(err, "reset") as keyof typeof t.auth;
      setError(t.auth[key] ?? t.auth.resetError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title={t.auth.forgotPasswordTitle}
      subtitle={t.auth.forgotPasswordSubtitle}
    >
      {success ? (
        <div className="space-y-4 sm:space-y-6">
          <p className="rounded-xl border border-green-200 bg-green-50 px-3 py-2.5 text-sm text-green-700 sm:px-4 sm:py-3">
            {t.auth.resetEmailSent}
          </p>
          <Link
            href="/login"
            className="inline-flex auth-touch-target min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-navy py-3 text-sm font-semibold text-white transition-colors hover:bg-navy-light md:min-h-0 md:py-2.5"
          >
            <ArrowLeft className="h-5 w-5 shrink-0" />
            {t.auth.backToLogin}
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div>
            <IconLabel icon={Mail}>{t.auth.email}</IconLabel>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field mt-1.5 min-h-11 text-base sm:text-sm"
            />
          </div>

          {error && (
            <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-600 sm:px-4 sm:py-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex auth-touch-target min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-navy py-3 text-sm font-semibold text-white transition-colors hover:bg-navy-light disabled:opacity-50 md:min-h-0 md:py-2.5"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 shrink-0 animate-spin" />
                {t.common.loading}
              </>
            ) : (
              <>
                <Send className="h-5 w-5 shrink-0" />
                {t.auth.sendResetLink}
              </>
            )}
          </button>
        </form>
      )}

      {!success && (
        <p className="mt-5 text-center text-sm text-navy/60 sm:mt-6">
          <Link
            href="/login"
            className="inline-flex min-h-11 items-center justify-center gap-1 font-medium text-gold hover:underline"
          >
            <ArrowLeft className="h-4 w-4 shrink-0" />
            {t.auth.backToLogin}
          </Link>
        </p>
      )}
    </AuthShell>
  );
}
