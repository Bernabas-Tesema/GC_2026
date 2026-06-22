"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Building2,
  Home,
  Images,
  User,
  Users,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import SocialMediaIcons from "@/components/SocialMediaIcons";
import {
  DEVELOPER_NAME,
  DEVELOPER_PHOTO_PATH,
} from "@/lib/constants";

const footerLinks = [
  { href: "/book", icon: Home, labelKey: "home" as const },
  { href: "/book/graduates", icon: Users, labelKey: "graduates" as const },
  { href: "/book/departments", icon: Building2, labelKey: "departments" as const },
  { href: "/book/gallery", icon: Images, labelKey: "gallery" as const },
  { href: "/profile", icon: User, labelKey: "myProfile" as const },
];

type BookFooterProps = {
  includeSocials?: boolean;
};

function FooterCongratulations() {
  const { t } = useLanguage();

  return (
    <div className="mb-6 text-center">
      <div className="mx-auto flex max-w-lg items-center gap-2 px-2 sm:gap-4">
        <span
          className="h-px min-w-[1.5rem] flex-1 bg-gradient-to-r from-transparent to-gold/45"
          aria-hidden
        />
        <div className="shrink-0 px-1">
          <p className="font-serif text-xl font-bold leading-tight tracking-wide text-navy sm:text-2xl md:text-3xl">
            <span className="bg-gradient-to-r from-gold-dark via-gold to-gold-dark bg-clip-text text-transparent">
              {t.home.footerCongratulations}
            </span>
          </p>
          <p className="mt-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-navy/50 sm:text-xs">
            {t.home.footerCongratulationsLine}
          </p>
        </div>
        <span
          className="h-px min-w-[1.5rem] flex-1 bg-gradient-to-l from-transparent to-gold/45"
          aria-hidden
        />
      </div>
    </div>
  );
}

export default function BookFooter({ includeSocials = false }: BookFooterProps) {
  const { t } = useLanguage();

  if (includeSocials) {
    return (
      <footer className="border-t border-gold/20 pt-6 pb-4">
        <FooterCongratulations />

        <div className="text-center">
          <SocialMediaIcons className="mb-4" />
          <h2 className="text-base font-bold text-navy md:text-lg">
            {t.home.socialsTitle}
          </h2>
          <p className="mt-1.5 text-xs text-navy/55 sm:text-sm">
            {t.home.socialsSubtitle}
          </p>
        </div>

        <div className="mt-5 flex flex-col items-center gap-2">
          <Image
            src={DEVELOPER_PHOTO_PATH}
            alt={DEVELOPER_NAME}
            width={40}
            height={40}
            className="h-10 w-10 shrink-0 rounded-full border-2 border-gold/35 bg-white object-cover object-top shadow-sm"
          />
          <span className="text-xs font-semibold tracking-wide text-navy sm:text-sm">
            {DEVELOPER_NAME}
          </span>
        </div>
      </footer>
    );
  }

  return (
    <footer className="mt-4 border-t border-gold/20 pt-8">
      <FooterCongratulations />
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
            <Icon className="h-3.5 w-3.5 text-gold" aria-hidden />
            {t.nav[labelKey]}
          </Link>
        ))}
      </div>
    </footer>
  );
}
