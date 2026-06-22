"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  BookOpen,
  ChevronRight,
  LogIn,
  LogOut,
  Menu,
  MessageCircle,
  Shield,
  UserPlus,
  X,
} from "lucide-react";
import { GRADUATION_YEAR, SITE_LOGO_PATH, TELEGRAM_GROUP_URL } from "@/lib/constants";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import TelegramChatButton from "@/components/TelegramChatButton";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useManagerAuth } from "@/contexts/ManagerAuthContext";

export default function CoverPage() {
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const { isManager, logout: managerLogout } = useManagerAuth();
  const isLoggedIn = Boolean(user) || isManager;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    try {
      if (isManager) managerLogout();
      if (user) await logout();
    } catch {
      // Ignore sign-out errors; user can refresh if needed.
    } finally {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <main className="relative h-[100dvh] min-h-screen w-full overflow-hidden bg-cream pt-[env(safe-area-inset-top,0px)]">
      <div className="absolute top-[max(1rem,env(safe-area-inset-top,0px))] left-4 z-20 sm:left-6">
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <Link
            href="/"
            className="flex items-center justify-center rounded-xl border border-chocolate/20 bg-paper/90 p-1.5 shadow-sm backdrop-blur-sm transition-transform hover:-translate-y-0.5 sm:p-2"
            aria-label="GC Home"
          >
            <Image
              src={SITE_LOGO_PATH}
              alt="GC Logo"
              width={48}
              height={48}
              className="h-10 w-10 object-contain sm:h-11 sm:w-11"
              priority
            />
          </Link>
        </motion.div>
      </div>

      <div className="absolute top-[max(1rem,env(safe-area-inset-top,0px))] right-4 z-20 sm:right-6">
        <div className="hidden items-center gap-2 sm:flex">
          {isLoggedIn && (
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1 rounded-full border border-chocolate/25 bg-paper/90 px-3 py-1.5 text-xs font-medium text-navy/75 transition-colors chocolate-hover hover:text-navy"
            >
              <LogOut className="h-3.5 w-3.5 text-chocolate-light" />
              {t.nav.logout}
            </button>
          )}
          <TelegramChatButton variant="light" />
          <LanguageSwitcher variant="light" className="w-auto shrink-0" />
        </div>

        <div className="relative sm:hidden" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="nav-btn-hover flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-chocolate/25 bg-paper/90 p-2.5 text-navy chocolate-hover"
            aria-label="Menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-chocolate/20 bg-cream text-navy shadow-lg">
              <a
                href={TELEGRAM_GROUP_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-3 text-sm transition-colors chocolate-hover"
              >
                <MessageCircle className="h-4 w-4 text-chocolate-light" />
                {t.common.chatWithBenhanan}
              </a>

              {isLoggedIn ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-medium transition-colors chocolate-hover"
                >
                  <LogOut className="h-4 w-4 text-chocolate-light" />
                  {t.nav.logout}
                </button>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors chocolate-hover"
                  >
                    <LogIn className="h-4 w-4 text-chocolate-light" />
                    {t.nav.login}
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors chocolate-hover"
                  >
                    <UserPlus className="h-4 w-4 text-chocolate-light" />
                    {t.nav.signup}
                  </Link>
                </>
              )}

              <div className="border-t border-chocolate/15 px-4 py-3">
                <LanguageSwitcher variant="light" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Warm cream background ── */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-cream" />
        <div className="absolute inset-0 bg-gradient-to-b from-paper via-cream to-paper-warm" />

        <motion.div
          animate={{ scale: [1, 1.12, 1], opacity: [0.35, 0.5, 0.35] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(107,68,35,0.14) 0%, transparent 70%)" }}
        />
        <motion.div
          animate={{ scale: [1, 1.18, 1], opacity: [0.25, 0.4, 0.25] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-40 -right-20 h-[600px] w-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(74,44,42,0.12) 0%, transparent 70%)" }}
        />
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.15, 0.28, 0.15] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className="absolute top-1/2 left-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(245,239,230,0.9) 0%, transparent 70%)" }}
        />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(74,44,42,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(74,44,42,0.6) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div
          className="absolute inset-x-0 top-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(107,68,35,0.35), transparent)" }}
        />
      </div>

      {/* ── Decorative corner brackets ── */}
      <div className="pointer-events-none absolute inset-0 z-10">
        <div className="absolute top-6 left-6 h-10 w-10 border-t border-l border-chocolate-light/30 md:left-10 md:h-14 md:w-14" />
        <div className="absolute top-6 right-6 h-10 w-10 border-t border-r border-chocolate-light/30 md:right-10 md:h-14 md:w-14" />
        <div className="absolute bottom-6 left-6 h-10 w-10 border-b border-l border-chocolate-light/30 md:left-10 md:h-14 md:w-14" />
        <div className="absolute right-6 bottom-6 h-10 w-10 border-r border-b border-chocolate-light/30 md:right-10 md:h-14 md:w-14" />
      </div>

      {/* ── Main content ── */}
      <div className="relative z-10 flex h-full min-h-0 flex-col items-center gap-6 px-4 pt-8 pb-[max(1.5rem,env(safe-area-inset-bottom,0px))] sm:gap-8 sm:px-6 sm:pt-10 md:gap-10 md:px-16 md:pt-12 md:pb-8">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex min-h-0 w-full flex-1 flex-col items-center justify-center gap-3 text-center md:gap-5"
        >
          {/* Logo medallion */}
          <motion.div
            initial={{ scale: 0, rotate: -15 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 160, damping: 14 }}
            className="relative"
          >
            <motion.div
              animate={{ scale: [1, 1.18, 1], opacity: [0.45, 0.0, 0.45] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
              className="absolute inset-0 rounded-full border border-chocolate-light/40"
              style={{ margin: "-12px" }}
            />
            <div
              className="relative flex h-24 w-24 items-center justify-center rounded-full border-2 border-chocolate/25 bg-paper md:h-32 md:w-32"
              style={{
                boxShadow:
                  "0 0 40px rgba(107,68,35,0.18), inset 0 1px 0 rgba(255,255,255,0.85)",
              }}
            >
              <Image
                src="/logo.svg"
                alt="Fellowship Logo"
                width={64}
                height={64}
                className="relative opacity-90 md:h-[72px] md:w-[72px]"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <span className="absolute font-serif text-3xl font-bold text-chocolate drop-shadow-sm md:text-4xl">
                ✝
              </span>
            </div>
          </motion.div>

          {/* Text block */}
          <div className="space-y-2 md:space-y-3">
            <motion.p
              initial={{ opacity: 0, letterSpacing: "0.3em" }}
              animate={{ opacity: 1, letterSpacing: "0.2em" }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-[11px] font-semibold uppercase tracking-[0.3em] text-chocolate-light md:text-xs"
            >
              Arba Minch University
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.52 }}
              className="font-serif text-3xl font-bold text-navy drop-shadow-sm sm:text-4xl md:text-5xl lg:text-6xl"
            >
              {t.cover.subtitle}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, scale: 0.75 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.68, type: "spring", stiffness: 100 }}
            >
              <p
                className="font-serif font-black leading-none tracking-tight text-transparent"
                style={{
                  fontSize: "clamp(52px, 11vw, 112px)",
                  background: "linear-gradient(135deg, #6b4423 0%, #4a2c2a 45%, #2c1810 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  filter: "drop-shadow(0 4px 20px rgba(74,44,42,0.2))",
                }}
              >
                {GRADUATION_YEAR}
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* ── CTA buttons ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="w-full max-w-lg shrink-0 space-y-4 md:space-y-5"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.82 }}
            className="text-center text-[11px] font-medium uppercase tracking-[0.25em] text-chocolate/70 md:text-xs"
          >
            {t.cover.year}
          </motion.p>
          {isLoggedIn ? (
            <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
              {isManager ? (
                <Link
                  href="/managers"
                  className="group chocolate-box inline-flex flex-1 items-center justify-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-md sm:flex-none"
                >
                  <Shield className="h-4 w-4" />
                  Managers
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              ) : (
                <Link
                  href="/book"
                  className="group chocolate-box inline-flex w-full items-center justify-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-md sm:w-auto"
                >
                  <BookOpen className="h-4 w-4" />
                  {t.cover.openBook}
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              )}
            </div>
          ) : (
            <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/login"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-chocolate/30 bg-paper px-8 py-3.5 text-sm font-semibold text-navy shadow-sm transition-all chocolate-hover hover:-translate-y-0.5 sm:flex-none"
              >
                <LogIn className="h-4 w-4 text-chocolate-light" />
                {t.nav.login}
              </Link>
              <Link
                href="/signup"
                className="group chocolate-box inline-flex flex-1 items-center justify-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-md sm:flex-none"
              >
                <UserPlus className="h-4 w-4" />
                {t.nav.signup}
              </Link>
            </div>
          )}

          <p className="mt-3 flex items-center justify-center gap-2 text-[11px] text-navy/35">
            <span className="h-px w-8 bg-chocolate/15" />
            {t.cover.flipHint}
            <span className="h-px w-8 bg-chocolate/15" />
          </p>
        </motion.div>
      </div>
    </main>
  );
}
