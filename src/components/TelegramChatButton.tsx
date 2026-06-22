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
      className={`nav-btn-hover btn-chat-chocolate inline-flex max-w-[11rem] shrink-0 items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold sm:max-w-none sm:gap-1.5 sm:px-2.5 sm:py-1.5 sm:text-xs ${
        isCover ? "border-white/25" : ""
      }`}
      aria-label={t.common.chatWithBenhanan}
    >
      <MessageCircle className="h-3.5 w-3.5 shrink-0 text-amber-200" aria-hidden />
      <span className="truncate">{t.common.chatWithBenhanan}</span>
    </a>
  );
}
