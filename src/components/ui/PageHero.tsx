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
};

export default function PageHero({
  title,
  subtitle,
  icon: Icon,
  children,
  compact = false,
}: PageHeroProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`hero-band relative overflow-hidden rounded-2xl ${
        compact ? "px-4 py-3 sm:px-6 sm:py-3.5" : "px-5 py-6 sm:px-8 sm:py-8"
      }`}
    >
      {!compact && (
        <>
          <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-10 left-1/4 h-24 w-24 rounded-full bg-blue-300/20 blur-xl" />
        </>
      )}

      <div
        className={`relative flex flex-col sm:flex-row sm:items-center sm:justify-between ${
          compact ? "gap-2" : "gap-4 sm:items-end"
        }`}
      >
        <div className={compact ? "space-y-0.5" : "space-y-2"}>
          {Icon && (
            <div
              className={`inline-flex rounded-xl bg-white/15 backdrop-blur-sm ${
                compact ? "mb-1 p-1" : "p-2"
              }`}
            >
              <Icon className={compact ? "h-4 w-4 text-gold-light" : "h-5 w-5 text-gold-light"} />
            </div>
          )}
          <h1
            className={`font-serif font-bold text-white ${
              compact ? "text-lg leading-tight sm:text-xl" : "text-2xl sm:text-3xl"
            }`}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              className={`max-w-xl text-blue-100/80 ${
                compact ? "text-xs leading-snug sm:text-sm" : "text-sm sm:text-base"
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
