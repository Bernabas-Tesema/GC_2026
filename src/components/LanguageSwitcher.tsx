"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import type { Language } from "@/lib/types";

interface LanguageSwitcherProps {
  variant?: "cover" | "light";
  className?: string;
}

export default function LanguageSwitcher({
  variant = "cover",
  className = "",
}: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage();
  const isCover = variant === "cover";

  const toggle = (lang: Language) => setLanguage(lang);

  return (
    <div
      className={`flex items-center justify-center rounded-full border p-0.5 ${
        isCover
          ? "border-gold/30 bg-white/10"
          : "border-paper-edge bg-white shadow-sm"
      } ${className || "w-full"}`}
    >
      <button
        onClick={() => toggle("en")}
        className={`rounded-full px-3 py-1 text-xs font-medium transition-all hover:-translate-y-0.5 ${
          language === "en"
            ? "bg-gold text-navy shadow-sm"
            : isCover
              ? "text-white/80 hover:bg-white/10 hover:text-white"
              : "text-navy/60 hover:bg-navy/5 hover:text-navy"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => toggle("am")}
        className={`rounded-full px-3 py-1 text-xs font-medium transition-all hover:-translate-y-0.5 ${
          language === "am"
            ? "bg-gold text-navy shadow-sm"
            : isCover
              ? "text-white/80 hover:bg-white/10 hover:text-white"
              : "text-navy/60 hover:bg-navy/5 hover:text-navy"
        }`}
      >
        አማ
      </button>
    </div>
  );
}
