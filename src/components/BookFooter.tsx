"use client";

import Link from "next/link";
import {
  Building2,
  Home,
  Images,
  Instagram,
  MessageCircle,
  User,
  Users,
  Youtube,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  INSTAGRAM_URL,
  SITE_BRAND_NAME,
  TELEGRAM_GROUP_URL,
  YOUTUBE_URL,
} from "@/lib/constants";

const footerLinks = [
  { href: "/book", icon: Home, labelKey: "home" as const },
  { href: "/book/graduates", icon: Users, labelKey: "graduates" as const },
  { href: "/book/departments", icon: Building2, labelKey: "departments" as const },
  { href: "/book/gallery", icon: Images, labelKey: "gallery" as const },
  { href: "/profile", icon: User, labelKey: "myProfile" as const },
];

const socialLinks = [
  { icon: Instagram, label: "Instagram", href: INSTAGRAM_URL },
  { icon: Youtube, label: "YouTube", href: YOUTUBE_URL },
  { icon: MessageCircle, label: "Telegram", href: TELEGRAM_GROUP_URL },
];

type BookFooterProps = {
  includeSocials?: boolean;
};

export default function BookFooter({ includeSocials = false }: BookFooterProps) {
  const { t } = useLanguage();

  if (includeSocials) {
    return (
      <footer className="border-t border-gold/20 pt-6 pb-4 text-center">
        <div>
          <h2 className="text-base font-bold text-navy md:text-lg">
            {t.home.socialsTitle}
          </h2>
          <p className="mt-1 text-xs text-navy/55 md:text-sm">{t.home.socialsSubtitle}</p>

          <div className="mt-4 flex flex-col items-center gap-3">
            <a
              href={TELEGRAM_GROUP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="nav-btn-hover btn-chat-chocolate inline-flex w-full max-w-sm items-center justify-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold sm:text-sm"
            >
              {t.common.chatWithBenhanan}
              <MessageCircle className="h-3.5 w-3.5 text-amber-200" aria-hidden />
            </a>

            <div className="flex flex-wrap justify-center gap-2">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nav-btn-hover inline-flex items-center gap-1 rounded-full border border-gold/35 bg-cream/80 px-2.5 py-1 text-[11px] font-medium text-navy hover:border-gold hover:bg-gold/10 sm:px-3 sm:text-xs"
                >
                  {label}
                  <Icon className="h-3.5 w-3.5 text-gold" aria-hidden />
                </a>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-5 border-t border-gold/15 pt-4 text-center text-xs text-navy/45">
          {SITE_BRAND_NAME} · {t.home.footerTagline}
        </p>
      </footer>
    );
  }

  return (
    <footer className="mt-4 border-t border-gold/20 pt-8">
      <p className="mb-4 text-center font-serif text-sm font-bold text-navy">
        {t.home.explorePages}
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {footerLinks.map(({ href, icon: Icon, labelKey }) => (
          <Link
            key={href}
            href={href}
            className="nav-btn-hover inline-flex items-center gap-1 rounded-full border border-gold/35 bg-paper/80 px-2.5 py-1 text-[11px] font-medium text-navy shadow-sm transition-colors hover:bg-gold/10 hover:border-gold/60 sm:px-3 sm:text-xs"
          >
            {t.nav[labelKey]}
            <Icon className="h-3.5 w-3.5 text-gold" aria-hidden />
          </Link>
        ))}
      </div>
      <div className="mt-4 pt-2 text-center">
        <p className="text-xs text-navy/40">
          {SITE_BRAND_NAME} · {t.home.footerTagline}
        </p>
      </div>
    </footer>
  );
}
