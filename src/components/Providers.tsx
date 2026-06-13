"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ManagerAuthProvider } from "@/contexts/ManagerAuthContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <AuthProvider>
        <ManagerAuthProvider>{children}</ManagerAuthProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
