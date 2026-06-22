"use client";

import { FormEvent, useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { LogIn, Lock, Mail } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useManagerAuth } from "@/contexts/ManagerAuthContext";
import IconLabel from "@/components/IconLabel";
import PasswordInput from "@/components/PasswordInput";
import { useLanguage } from "@/contexts/LanguageContext";
import { getClientAuth } from "@/lib/firebase";
import { getAuthErrorKey } from "@/lib/authErrors";
import { isValidManagerCredentials, isManagerEmail } from "@/lib/admin";
import { getStudentByUid, isStudentProfileComplete } from "@/lib/students";
import AuthShell from "@/components/ui/AuthShell";
import Button from "@/components/ui/Button";

function LoginForm() {
  const { login } = useAuth();
  const { login: managerLogin, isManager, loading: managerLoading } = useManagerAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (managerLoading) return;
    if (isManager) router.replace("/managers");
  }, [isManager, managerLoading, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const normalizedEmail = email.trim();

      if (isValidManagerCredentials(normalizedEmail, password)) {
        await managerLogin(normalizedEmail, password);
        router.push("/managers");
        return;
      }

      if (isManagerEmail(normalizedEmail)) {
        setError(t.auth.managerWrongPassword);
        return;
      }

      await login(normalizedEmail, password);

      let profile = null;
      try {
        const auth = getClientAuth();
        if (auth.currentUser) {
          profile = await getStudentByUid(auth.currentUser.uid);
        }
      } catch (profileErr) {
        console.error("Profile load after login:", profileErr);
      }

      if (isStudentProfileComplete(profile)) {
        router.push(searchParams.get("next") ?? "/book");
      } else {
        router.push("/profile");
      }
    } catch (err) {
      const key = getAuthErrorKey(err, "login") as keyof typeof t.auth;
      setError(t.auth[key] ?? t.auth.loginError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title={t.auth.loginTitle}
      subtitle={t.auth.siteSubtitle}
    >
      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        <div>
          <IconLabel icon={Mail}>{t.auth.email}</IconLabel>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field mt-1.5"
          />
        </div>

        <div>
          <div className="mb-1.5 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <IconLabel icon={Lock} className="mb-0">
              {t.auth.password}
            </IconLabel>
            <Link
              href="/forgot-password"
              className="text-xs font-medium text-gold hover:underline sm:text-right"
            >
              {t.auth.forgotPassword}
            </Link>
          </div>
          <PasswordInput value={password} onChange={setPassword} />
        </div>

        {error && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-600 sm:px-4 sm:py-3">
            {error}
          </p>
        )}

        <Button type="submit" fullWidth loading={loading} className="auth-touch-target">
          <LogIn className="h-5 w-5 shrink-0" />
          {t.auth.loginButton}
        </Button>
      </form>

      <div className="mt-4 flex items-center gap-3 sm:mt-[9px] sm:gap-[7px]">
        <div className="h-px flex-1 bg-navy/10" />
        <p className="shrink-0 text-[11px] text-navy/40 sm:text-xs">{t.auth.noAccount}</p>
        <div className="h-px flex-1 bg-navy/10" />
      </div>

      <Link
        href="/signup"
        className="btn-secondary auth-touch-target mt-4 flex w-full items-center justify-center gap-2 sm:mt-[7px]"
      >
        {t.nav.signup}
      </Link>
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
