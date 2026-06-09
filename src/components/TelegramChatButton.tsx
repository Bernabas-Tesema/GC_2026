"use client";

import { MessageCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { TELEGRAM_GROUP_URL } from "@/lib/constants";

type TelegramChatButtonProps = {
  variant?: "cover" | "light";
};

export default function TelegramChatButton({
  variant = "light",
}: TelegramChatButtonProps) {
  const { t } = useLanguage();
  const isCover = variant === "cover";

  return (
    <a
      href={TELEGRAM_GROUP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`nav-btn-hover inline-flex max-w-[11rem] shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-xs font-semibold shadow-sm transition-colors sm:max-w-none sm:gap-2 sm:px-3 sm:py-2 sm:text-sm ${
        isCover
          ? "border-gold/60 bg-navy/80 text-white hover:bg-navy"
          : "border-gold bg-navy text-white hover:bg-navy-light"
      }`}
      aria-label={t.common.chatWithBenhanan}
    >
      <MessageCircle className="h-4 w-4 shrink-0 text-gold" />
      <span className="truncate">{t.common.chatWithBenhanan}</span>
    </a>
  );
}
