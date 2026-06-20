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

  const activeBtn =
    "chocolate-nav-active rounded-full px-3 py-1 text-xs font-semibold text-white shadow-sm";
  const inactiveCover =
    "rounded-full px-3 py-1 text-xs font-medium text-white/80 transition-all hover:-translate-y-0.5 chocolate-hover chocolate-hover-cover hover:text-white";
  const inactiveLight =
    "rounded-full px-3 py-1 text-xs font-medium text-navy/65 transition-all hover:-translate-y-0.5 chocolate-hover hover:text-navy";

  return (
    <div
      className={`flex items-center justify-center rounded-full border p-0.5 ${
        isCover
          ? "border-white/25 bg-navy/40 backdrop-blur-sm"
          : "border-[#6b4423]/25 bg-cream shadow-sm"
      } ${className || "w-full"}`}
    >
      <button
        onClick={() => toggle("en")}
        className={language === "en" ? activeBtn : isCover ? inactiveCover : inactiveLight}
      >
        EN
      </button>
      <button
        onClick={() => toggle("am")}
        className={language === "am" ? activeBtn : isCover ? inactiveCover : inactiveLight}
      >
        አማ
      </button>
    </div>
  );
}
