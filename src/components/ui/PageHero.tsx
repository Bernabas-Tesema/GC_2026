"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type PageHeroProps = {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  children?: ReactNode;
  compact?: boolean;
  titleFont?: "sans" | "serif";
};

export default function PageHero({
  title,
  subtitle,
  icon: Icon,
  children,
  compact = false,
  titleFont = "serif",
}: PageHeroProps) {
  const iconSize = compact ? "h-3.5 w-3.5" : "h-4 w-4";
  const titleFontClass = titleFont === "sans" ? "font-sans" : "font-serif";

  return (
    <motion.header
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`hero-band relative overflow-hidden rounded-lg ${
        compact ? "px-3 py-2 sm:px-4" : "px-4 py-2.5 sm:px-5 sm:py-3"
      }`}
    >
      <div className="relative flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 sm:gap-2">
            {Icon && <Icon className={`shrink-0 text-amber-200 ${iconSize}`} aria-hidden />}
            <h1
              className={`min-w-0 truncate font-bold text-white ${titleFontClass} ${
                compact ? "text-sm sm:text-base" : "text-base sm:text-lg"
              }`}
            >
              {title}
            </h1>
          </div>
          {subtitle && (
            <p
              className={`mt-0.5 line-clamp-2 text-amber-100/85 ${
                compact ? "text-[10px] leading-snug sm:text-xs" : "text-xs sm:text-sm"
              }`}
            >
              {subtitle}
            </p>
          )}
        </div>
        {children}
      </div>
    </motion.header>
  );
}
