"use client";

import Link from "next/link";
import {
  Building2,
  Facebook,
  Home,
  Instagram,
  MessageCircle,
  User,
  Users,
  Youtube,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { SITE_BRAND_NAME, TELEGRAM_GROUP_URL } from "@/lib/constants";

const footerLinks = [
  { href: "/book", icon: Home, labelKey: "home" as const },
  { href: "/book/gallery", icon: Users, labelKey: "gallery" as const },
  { href: "/book/departments", icon: Building2, labelKey: "departments" as const },
  { href: "/profile", icon: User, labelKey: "myProfile" as const },
];

const socialLinks = [
  { icon: Facebook, label: "Facebook", href: "#" },
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Youtube, label: "YouTube", href: "#" },
  { icon: MessageCircle, label: "Telegram", href: TELEGRAM_GROUP_URL },
];

type BookFooterProps = {
  includeSocials?: boolean;
};

export default function BookFooter({ includeSocials = false }: BookFooterProps) {
  const { t } = useLanguage();

  if (includeSocials) {
    return (
      <footer className="section-card w-full overflow-hidden">
        <div className="section-body space-y-6 text-center">
          <div>
            <h2 className="font-serif text-lg font-bold text-navy">
              {t.home.socialsTitle}
            </h2>
            <p className="mt-1 text-sm text-navy/55">{t.home.socialsSubtitle}</p>

            <div className="mt-5 flex flex-col items-center gap-4">
              {/* Primary Telegram CTA */}
              <a
                href={TELEGRAM_GROUP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="nav-btn-hover inline-flex w-full max-w-sm items-center justify-center gap-2.5 rounded-2xl px-6 py-3.5 text-sm font-semibold text-white shadow-lg sm:text-base"
                style={{ background: "linear-gradient(135deg, #0f172a, #1e3a8a)" }}
              >
                <MessageCircle className="h-5 w-5 text-gold" />
                {t.common.chatWithBenhanan}
              </a>

              {/* Social icon links */}
              <div className="flex flex-wrap justify-center gap-2.5">
                {socialLinks.map(({ icon: Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="nav-btn-hover inline-flex items-center gap-2 rounded-full border border-gold/35 bg-cream/60 px-4 py-2 text-sm font-medium text-navy shadow-sm hover:border-gold hover:bg-gold/10 sm:px-5 sm:py-2.5"
                  >
                    <Icon className="h-4 w-4 text-gold" />
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Divider + copyright */}
          <div className="border-t border-gold/20 pt-5">
            <div className="mb-3 flex justify-center gap-1">
              {[...Array(3)].map((_, i) => (
                <span key={i} className="inline-block h-1 w-1 rounded-full bg-gold/40" />
              ))}
            </div>
            <p className="text-xs text-navy/40">
              {SITE_BRAND_NAME} · {t.home.footerTagline}
            </p>
          </div>
        </div>
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
            className="nav-btn-hover inline-flex items-center gap-1.5 rounded-full border border-gold/35 bg-paper/80 px-4 py-2 text-xs font-medium text-navy shadow-sm transition-colors hover:bg-gold/10 hover:border-gold/60 md:text-sm"
          >
            <Icon className="h-4 w-4 text-gold" />
            {t.nav[labelKey]}
          </Link>
        ))}
      </div>
      <div className="mt-6 flex flex-col items-center gap-1">
        <div className="flex gap-1">
          {[...Array(3)].map((_, i) => (
            <span key={i} className="inline-block h-1 w-1 rounded-full bg-gold/35" />
          ))}
        </div>
        <p className="text-xs text-navy/40">
          {SITE_BRAND_NAME} · {t.home.footerTagline}
        </p>
      </div>
    </footer>
  );
}
