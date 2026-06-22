"use client";

import Image from "next/image";
import { INSTAGRAM_URL, YOUTUBE_URL } from "@/lib/constants";

const socialLinks = [
  {
    href: YOUTUBE_URL,
    label: "YouTube",
    src: "/social/youtube.png",
  },
  {
    href: INSTAGRAM_URL,
    label: "Instagram",
    src: "/social/instagram.png",
  },
] as const;

type SocialMediaIconsProps = {
  size?: "sm" | "md";
  className?: string;
};

export default function SocialMediaIcons({
  size = "md",
  className = "",
}: SocialMediaIconsProps) {
  const box =
    size === "sm"
      ? "h-9 w-9 sm:h-10 sm:w-10"
      : "h-11 w-11 sm:h-12 sm:w-12";
  const img = size === "sm" ? 22 : 26;

  return (
    <div
      className={`flex flex-wrap items-center justify-center gap-3 sm:gap-4 ${className}`.trim()}
    >
      {socialLinks.map(({ href, label, src }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className={`social-icon-link inline-flex ${box} items-center justify-center rounded-xl border border-gold/35 bg-paper/95 p-1.5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-gold/60 hover:bg-gold/5 hover:shadow-md`}
        >
          <Image
            src={src}
            alt=""
            width={img}
            height={img}
            className="h-auto w-auto max-h-full max-w-full object-contain"
          />
        </a>
      ))}
    </div>
  );
}
