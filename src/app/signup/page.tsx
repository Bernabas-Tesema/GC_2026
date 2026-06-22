"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { KeyRound, Lock, Mail, UserPlus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import IconLabel from "@/components/IconLabel";
import PasswordInput from "@/components/PasswordInput";
import { useLanguage } from "@/contexts/LanguageContext";
import { getAuthErrorKey } from "@/lib/authErrors";
import { isManagerEmail } from "@/lib/admin";
import AuthShell from "@/components/ui/AuthShell";
import Button from "@/components/ui/Button";

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
    <AuthShell title={t.auth.signupTitle} subtitle={t.auth.siteSubtitle}>
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

        <div>
          <IconLabel icon={Lock}>{t.auth.password}</IconLabel>
          <PasswordInput value={password} onChange={setPassword} />
        </div>

        <div>
          <IconLabel icon={KeyRound}>{t.auth.confirmPassword}</IconLabel>
          <PasswordInput value={confirmPassword} onChange={setConfirmPassword} />
        </div>

        {error && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-600 sm:px-4 sm:py-3">
            {error}
          </p>
        )}

        <Button type="submit" fullWidth loading={loading} className="auth-touch-target min-h-11 md:min-h-0">
          <UserPlus className="h-5 w-5 shrink-0" />
          {t.auth.signupButton}
        </Button>
      </form>

      <div className="mt-4 flex items-center gap-3 sm:mt-5 md:mt-3">
        <div className="h-px flex-1 bg-navy/10" />
        <p className="shrink-0 text-[11px] text-navy/40 sm:text-xs">{t.auth.hasAccount}</p>
        <div className="h-px flex-1 bg-navy/10" />
      </div>

      <Link
        href="/login"
        className="btn-secondary auth-touch-target mt-3 flex min-h-11 w-full items-center justify-center gap-2 md:mt-2.5 md:min-h-0"
      >
        {t.nav.login}
      </Link>
    </AuthShell>
  );
}
