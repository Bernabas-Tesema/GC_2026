"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useManagerAuth } from "@/contexts/ManagerAuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { isStudentProfileComplete } from "@/lib/students";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, student, loading } = useAuth();
  const { isManager, loading: managerLoading } = useManagerAuth();
  const { t } = useLanguage();
  const router = useRouter();

  const profileComplete = isStudentProfileComplete(student);

  useEffect(() => {
    if (loading || managerLoading) return;

    if (isManager) {
      router.push("/managers");
      return;
    }

    if (!user) {
      router.push("/login");
      return;
    }

    if (!profileComplete) {
      router.push("/profile");
    }
  }, [user, student, loading, managerLoading, isManager, router, profileComplete]);

  if (loading || managerLoading) {
    return (
      <div className="book-surface flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gold border-t-transparent" />
          <p className="text-navy/60">{t.common.loading}</p>
        </div>
      </div>
    );
  }

  if (isManager || !user || !profileComplete) return null;

  return <>{children}</>;
}
