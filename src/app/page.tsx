"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { BookOpen, ChevronRight, LogIn, Shield, UserPlus } from "lucide-react";
import { GRADUATION_YEAR } from "@/lib/constants";
import Navbar from "@/components/Navbar";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useManagerAuth } from "@/contexts/ManagerAuthContext";

export default function CoverPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { isManager } = useManagerAuth();
  const isLoggedIn = Boolean(user) || isManager;

  return (
    <main className="relative h-screen w-full overflow-hidden bg-[#050a14]">
      <Navbar variant="cover" />

      {/* ── Animated gradient mesh background ── */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Base dark layer */}
        <div className="absolute inset-0 bg-[#050a14]" />

        {/* Glowing orbs */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(37,99,235,0.45) 0%, transparent 70%)" }}
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-40 -right-20 h-[600px] w-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(29,78,216,0.4) 0%, transparent 70%)" }}
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.35, 0.2] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className="absolute top-1/2 left-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(96,165,250,0.2) 0%, transparent 70%)" }}
        />

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Top shine */}
        <div
          className="absolute inset-x-0 top-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(96,165,250,0.5), transparent)" }}
        />
      </div>

      {/* ── Decorative corner brackets ── */}
      <div className="pointer-events-none absolute inset-0 z-10">
        <div className="absolute top-[72px] left-6 h-10 w-10 border-t border-l border-blue-400/30 md:left-10 md:h-14 md:w-14" />
        <div className="absolute top-[72px] right-6 h-10 w-10 border-t border-r border-blue-400/30 md:right-10 md:h-14 md:w-14" />
        <div className="absolute bottom-6 left-6 h-10 w-10 border-b border-l border-blue-400/30 md:left-10 md:h-14 md:w-14" />
        <div className="absolute right-6 bottom-6 h-10 w-10 border-r border-b border-blue-400/30 md:right-10 md:h-14 md:w-14" />
      </div>

      {/* ── Main content ── */}
      <div className="relative z-10 flex h-full flex-col items-center justify-between px-6 pt-24 pb-10 md:px-16 md:pt-28 md:pb-14">

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex flex-1 flex-col items-center justify-center gap-7 text-center md:gap-9"
        >
          {/* Logo medallion */}
          <motion.div
            initial={{ scale: 0, rotate: -15 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 160, damping: 14 }}
            className="relative"
          >
            {/* Pulsing ring */}
            <motion.div
              animate={{ scale: [1, 1.18, 1], opacity: [0.5, 0.0, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
              className="absolute inset-0 rounded-full border border-blue-400/50"
              style={{ margin: "-12px" }}
            />
            <div
              className="relative flex h-24 w-24 items-center justify-center rounded-full border border-blue-400/30 md:h-32 md:w-32"
              style={{
                background: "linear-gradient(135deg, rgba(37,99,235,0.2), rgba(15,23,42,0.8))",
                boxShadow: "0 0 60px rgba(37,99,235,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
                backdropFilter: "blur(12px)",
              }}
            >
              <Image
                src="/logo.svg"
                alt="Fellowship Logo"
                width={64}
                height={64}
                className="relative opacity-90 md:h-[72px] md:w-[72px]"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
              <span className="absolute font-serif text-3xl font-bold text-white/90 drop-shadow-lg md:text-4xl">
                ✝
              </span>
            </div>
          </motion.div>

          {/* Text block */}
          <div className="space-y-3 md:space-y-4">
            <motion.p
              initial={{ opacity: 0, letterSpacing: "0.3em" }}
              animate={{ opacity: 1, letterSpacing: "0.2em" }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-[11px] font-semibold uppercase tracking-[0.3em] text-blue-400/70 md:text-xs"
            >
              Arba Minch University
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.52 }}
              className="font-serif text-4xl font-bold text-white drop-shadow-lg md:text-6xl lg:text-7xl"
            >
              {t.cover.subtitle}
            </motion.h1>

            {/* Year — large display number */}
            <motion.div
              initial={{ opacity: 0, scale: 0.75 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.68, type: "spring", stiffness: 100 }}
            >
              <p
                className="font-serif font-black leading-none tracking-tight text-transparent md:text-[120px] lg:text-[150px]"
                style={{
                  fontSize: "clamp(72px, 18vw, 150px)",
                  background: "linear-gradient(135deg, #93c5fd 0%, #3b82f6 40%, #1d4ed8 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  filter: "drop-shadow(0 0 40px rgba(59,130,246,0.5))",
                }}
              >
                {GRADUATION_YEAR}
              </p>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.82 }}
              className="text-[11px] font-medium uppercase tracking-[0.25em] text-blue-300/60 md:text-xs"
            >
              {t.cover.year}
            </motion.p>
          </div>

          {/* Tagline with thin divider lines */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.95 }}
            className="flex items-center gap-4"
          >
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-blue-400/40 md:w-20" />
            <p className="text-xs italic text-white/40 md:text-sm">{t.cover.tagline}</p>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-blue-400/40 md:w-20" />
          </motion.div>
        </motion.div>

        {/* ── CTA buttons ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="flex w-full max-w-sm flex-col items-center gap-4"
        >
          {isLoggedIn ? (
            <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center lg:hidden">
              {isManager ? (
                <Link
                  href="/managers"
                  className="group inline-flex flex-1 items-center justify-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-blue-500/30 hover:-translate-y-0.5 sm:flex-none"
                  style={{ background: "linear-gradient(135deg, #1d4ed8, #2563eb)" }}
                >
                  <Shield className="h-4 w-4" />
                  Managers
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/book"
                    className="group inline-flex flex-1 items-center justify-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-blue-500/30 hover:-translate-y-0.5 sm:flex-none"
                    style={{ background: "linear-gradient(135deg, #1d4ed8, #2563eb)" }}
                  >
                    <BookOpen className="h-4 w-4" />
                    {t.cover.openBook}
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link
                    href="/profile"
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-white/15 px-8 py-3.5 text-sm font-semibold text-white/80 backdrop-blur-sm transition-all hover:border-white/30 hover:text-white sm:flex-none"
                  >
                    {t.nav.myProfile}
                  </Link>
                </>
              )}
            </div>
          ) : (
            <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center lg:hidden">
              <Link
                href="/login"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-white/15 px-8 py-3.5 text-sm font-semibold text-white/80 backdrop-blur-sm transition-all hover:border-white/30 hover:text-white sm:flex-none"
              >
                <LogIn className="h-4 w-4" />
                {t.nav.login}
              </Link>
              <Link
                href="/signup"
                className="group inline-flex flex-1 items-center justify-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-blue-500/30 hover:-translate-y-0.5 sm:flex-none"
                style={{ background: "linear-gradient(135deg, #1d4ed8, #2563eb)" }}
              >
                <UserPlus className="h-4 w-4" />
                {t.nav.signup}
              </Link>
            </div>
          )}

          <p className="flex items-center gap-2 text-[11px] text-white/20">
            <span className="h-px w-8 bg-white/15" />
            {t.cover.flipHint}
            <span className="h-px w-8 bg-white/15" />
          </p>
        </motion.div>
      </div>
    </main>
  );
}
