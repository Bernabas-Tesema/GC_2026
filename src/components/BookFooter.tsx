"use client";

import Link from "next/link";
import {
  Building2,
  Home,
  MessageSquare,
  User,
  Users,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { SITE_BRAND_NAME } from "@/lib/constants";

const footerLinks = [
  { href: "/book", icon: Home, labelKey: "home" as const },
  { href: "/book/gc-speech", icon: MessageSquare, labelKey: "gcSpeech" as const },
  { href: "/book/gallery", icon: Users, labelKey: "gallery" as const },
  { href: "/book/departments", icon: Building2, labelKey: "departments" as const },
  { href: "/profile", icon: User, labelKey: "myProfile" as const },
];

export default function BookFooter() {
  const { t } = useLanguage();

  return (
    <footer className="mt-4 border-t border-navy/10 bg-white pt-8">
      <p className="mb-4 text-center font-serif text-sm font-bold text-navy">
        {t.home.explorePages}
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {footerLinks.map(({ href, icon: Icon, labelKey }) => (
          <Link
            key={href}
            href={href}
            className="nav-btn-hover inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-white px-4 py-2 text-xs font-medium text-navy shadow-sm transition-colors hover:bg-gold/10 md:text-sm"
          >
            <Icon className="h-4 w-4 text-gold" />
            {t.nav[labelKey]}
          </Link>
        ))}
      </div>
      <p className="mt-6 text-center text-xs text-navy/45">
        {SITE_BRAND_NAME} · {t.home.footerTagline}
      </p>
    </footer>
  );
}
