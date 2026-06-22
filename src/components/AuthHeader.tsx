"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import BrandTitle from "@/components/BrandTitle";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AuthHeader() {
  const { t } = useLanguage();

  return (
    <header className="fixed top-0 right-0 left-0 z-50 border-b border-paper-edge/80 bg-paper/95 pt-[env(safe-area-inset-top,0px)] backdrop-blur-md shadow-sm">
      <div className="flex items-center gap-2 px-3 py-2.5 sm:px-4 sm:py-2.5">
        <BrandTitle variant="light" asLink className="min-w-0 shrink" />
        <div className="ml-auto flex shrink-0 items-center gap-2">
          <Link
            href="/"
            className="inline-flex min-h-10 items-center gap-1 rounded-full border border-navy/12 px-2.5 py-1.5 text-[11px] font-medium text-navy/70 transition-colors hover:border-gold/40 hover:text-navy sm:px-3 sm:text-xs"
          >
            <ArrowLeft className="h-3.5 w-3.5 shrink-0 text-gold" />
            {t.nav.home}
          </Link>
          <LanguageSwitcher variant="light" className="w-auto shrink-0" />
        </div>
      </div>
    </header>
  );
}
