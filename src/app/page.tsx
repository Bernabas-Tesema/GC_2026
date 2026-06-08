"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { BookOpen, ChevronRight, LogIn, UserPlus } from "lucide-react";
import { GRADUATION_YEAR } from "@/lib/constants";
import Navbar from "@/components/Navbar";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";

export default function CoverPage() {
  const { t } = useLanguage();
  const { user } = useAuth();

  return (
    <main className="relative h-screen w-full overflow-hidden">
      <Navbar variant="cover" />

      {/* Full-screen book cover */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-light via-navy to-burgundy">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c9a227' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Decorative corners */}
        <div className="absolute top-6 left-6 h-12 w-12 border-t-2 border-l-2 border-gold/50 md:top-10 md:left-10 md:h-16 md:w-16" />
        <div className="absolute top-6 right-6 h-12 w-12 border-t-2 border-r-2 border-gold/50 md:top-10 md:right-10 md:h-16 md:w-16" />
        <div className="absolute bottom-6 left-6 h-12 w-12 border-b-2 border-l-2 border-gold/50 md:bottom-10 md:left-10 md:h-16 md:w-16" />
        <div className="absolute right-6 bottom-6 h-12 w-12 border-r-2 border-b-2 border-gold/50 md:right-10 md:bottom-10 md:h-16 md:w-16" />

        <div className="relative flex h-full flex-col items-center justify-between px-6 pt-24 pb-10 md:px-12 md:pt-28 md:pb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-1 flex-col items-center justify-center space-y-8 text-center md:space-y-10"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="relative flex h-28 w-28 items-center justify-center rounded-full border-2 border-gold bg-white/10 backdrop-blur-sm md:h-36 md:w-36"
            >
              <Image
                src="/logo.svg"
                alt="Fellowship Logo"
                width={80}
                height={80}
                className="opacity-90 md:h-24 md:w-24"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                }}
              />
              <span className="absolute font-serif text-4xl font-bold text-gold md:text-5xl">
                ✝
              </span>
            </motion.div>

            <div className="space-y-2 md:space-y-3">
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="font-serif text-3xl font-bold text-white md:text-5xl lg:text-6xl"
              >
                {t.cover.title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-gradient-gold font-serif text-2xl font-semibold md:text-4xl lg:text-5xl"
              >
                {t.cover.subtitle}
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="pt-1 font-serif text-5xl font-bold tracking-wider text-gold md:text-7xl lg:text-8xl"
              >
                {GRADUATION_YEAR}
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.75 }}
                className="text-base text-white/70 md:text-lg"
              >
                {t.cover.year}
              </motion.p>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="max-w-lg text-base text-white/60 italic md:text-lg"
            >
              {t.cover.tagline}
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="flex w-full max-w-md flex-col items-center gap-4"
          >
            {user ? (
              <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
                <Link
                  href="/book"
                  className="group inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-gold px-8 py-3.5 font-semibold text-navy shadow-lg transition-all hover:bg-gold-light hover:shadow-xl sm:flex-none"
                >
                  <BookOpen className="h-5 w-5" />
                  {t.cover.openBook}
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/profile"
                  className="inline-flex flex-1 items-center justify-center rounded-full border-2 border-white/50 px-8 py-3.5 font-semibold text-white transition-colors hover:bg-white/10 sm:flex-none"
                >
                  {t.nav.myProfile}
                </Link>
              </div>
            ) : (
              <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
                <Link
                  href="/login"
                  className="nav-btn-hover inline-flex flex-1 items-center justify-center gap-2 rounded-full border-2 border-white/50 px-8 py-3.5 font-semibold text-white hover:bg-white/10 sm:flex-none"
                >
                  <LogIn className="h-5 w-5" />
                  {t.nav.login}
                </Link>
                <Link
                  href="/signup"
                  className="nav-btn-hover inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-gold px-8 py-3.5 font-semibold text-navy shadow-lg hover:bg-gold-light hover:shadow-xl sm:flex-none"
                >
                  <UserPlus className="h-5 w-5" />
                  {t.nav.signup}
                </Link>
              </div>
            )}

            <p className="text-xs text-white/40">{t.cover.flipHint}</p>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
