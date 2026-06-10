"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Phone, GraduationCap, Heart, BookOpen } from "lucide-react";
import type { Student } from "@/lib/types";
import {
  getStudentInitial,
  getStudentPrimaryPhoto,
  getStudentSecondaryPhoto,
} from "@/lib/students";
import { useLanguage } from "@/contexts/LanguageContext";

interface StudentModalProps {
  student: Student | null;
  onClose: () => void;
}

export default function StudentModal({ student, onClose }: StudentModalProps) {
  const { t } = useLanguage();
  const primaryPhoto = student ? getStudentPrimaryPhoto(student) : "";
  const secondaryPhoto = student ? getStudentSecondaryPhoto(student) : "";

  const [showSecondary, setShowSecondary] = useState(false);
  const mainPhoto = showSecondary ? secondaryPhoto : primaryPhoto;
  const thumbPhoto = showSecondary ? primaryPhoto : secondaryPhoto;

  return (
    <AnimatePresence onExitComplete={() => setShowSecondary(false)}>
      {student && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex backdrop-blur-md"
          style={{ background: "rgba(15,31,61,0.72)" }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            // Full page on every screen size — col on mobile, row on sm+
            className="book-page relative flex h-full w-full flex-col sm:flex-row book-shadow"
          >
            {/* ── Close button ── */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 z-30 rounded-full bg-white/90 p-2
                         shadow-md ring-1 ring-navy/10 transition-all
                         hover:bg-white hover:scale-110 active:scale-95
                         sm:top-4 sm:right-4"
            >
              <X className="h-5 w-5 text-navy" />
            </button>

            {/* ══ PHOTO PANEL ══
                Mobile : top 45% of screen height
                sm+    : left 42% of screen width, full height            */}
            <div className="relative w-full overflow-hidden bg-navy/5
                            [height:45dvh]
                            sm:h-full sm:w-[42%] sm:[height:auto]">

              {/* Main photo — crossfades on switch, object-contain = full picture */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={mainPhoto}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  {mainPhoto ? (
                    <Image
                      src={mainPhoto}
                      alt={student.fullName || "Student"}
                      fill
                      className="object-contain"
                      sizes="(max-width: 640px) 100vw, 42vw"
                      priority
                    />
                  ) : (
                    <span className="font-serif text-7xl font-bold text-navy/15">
                      {getStudentInitial(student.fullName)}
                    </span>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Edge fade — bottom on mobile, right on sm+ */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10
                              h-10 bg-gradient-to-t from-paper/40 to-transparent
                              sm:inset-y-0 sm:inset-x-auto sm:right-0
                              sm:h-auto sm:w-10 sm:bg-gradient-to-l" />

              {/* Thumbnail swap button */}
              {secondaryPhoto && primaryPhoto && (
                <button
                  onClick={() => setShowSecondary((v) => !v)}
                  aria-label="Switch photo"
                  className="group absolute bottom-4 left-4 z-20 overflow-hidden
                             rounded-2xl border-2 border-white shadow-xl
                             ring-1 ring-gold/30 transition-all duration-200
                             hover:scale-105 hover:ring-2 hover:ring-gold active:scale-95"
                  style={{ width: 60, height: 60 }}
                >
                  <Image
                    src={thumbPhoto}
                    alt="Switch photo"
                    fill
                    className="object-cover object-top"
                    sizes="60px"
                  />
                  <div className="absolute inset-0 flex items-center justify-center
                                  rounded-2xl bg-navy/40 opacity-0 transition-opacity
                                  duration-200 group-hover:opacity-100">
                    <svg className="h-5 w-5 text-white drop-shadow"
                      viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                  </div>
                </button>
              )}
            </div>

            {/* ══ DETAILS PANEL ══
                Mobile : remaining height below photo, scrollable
                sm+    : right column, full height, scrollable             */}
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">

              {/* Sticky header band */}
              <div
                className="shrink-0 px-5 py-4 sm:px-8 sm:py-6"
                style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #2563eb 100%)" }}
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold/80">
                  Class of 2026
                </p>
                <h2 className="mt-1 font-serif text-xl font-bold leading-tight
                               text-white sm:text-2xl lg:text-3xl">
                  {student.fullName || "Student"}
                </h2>
                <div className="mt-2.5 h-0.5 w-10 rounded-full bg-gold/70" />
              </div>

              {/* Scrollable info */}
              <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-8 sm:py-7">
                <div className="space-y-3 sm:space-y-4">

                  {/* Academic dept */}
                  <div className="flex items-start gap-3 rounded-2xl border
                                  border-gold/20 bg-white/60 p-4 shadow-sm">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center
                                    rounded-xl bg-gold/10">
                      <GraduationCap className="h-5 w-5 text-gold" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold uppercase tracking-widest
                                    text-navy/40">
                        {t.gallery.academicDept}
                      </p>
                      <p className="mt-0.5 text-sm font-semibold leading-snug text-navy
                                    sm:text-base lg:text-lg">
                        {student.academicDepartment}
                      </p>
                    </div>
                  </div>

                  {/* Fellowship dept */}
                  <div className="flex items-start gap-3 rounded-2xl border
                                  border-burgundy/15 bg-white/60 p-4 shadow-sm">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center
                                    rounded-xl bg-burgundy/10">
                      <Heart className="h-5 w-5 text-burgundy" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold uppercase tracking-widest
                                    text-navy/40">
                        {t.gallery.fellowshipDept}
                      </p>
                      <p className="mt-0.5 text-sm font-semibold leading-snug text-navy
                                    sm:text-base lg:text-lg">
                        {student.fellowshipDepartment}
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  {student.phone && (
                    <div className="flex items-center gap-3 rounded-2xl border
                                    border-navy/10 bg-white/60 px-4 py-3.5 shadow-sm">
                      <Phone className="h-5 w-5 shrink-0 text-gold" />
                      <span className="text-sm font-medium text-navy/75
                                       sm:text-base lg:text-lg">
                        {student.phone}
                      </span>
                    </div>
                  )}

                  {/* Last words */}
                  {student.lastWords && (
                    <div className="relative rounded-2xl border border-gold/25
                                    bg-white/60 px-5 pb-6 pt-8 shadow-sm">
                      <span className="absolute top-2 left-4 select-none font-serif
                                       text-5xl leading-none text-gold/20">
                        &ldquo;
                      </span>
                      <div className="mb-2 flex items-center gap-1.5">
                        <BookOpen className="h-3.5 w-3.5 text-gold" />
                        <p className="text-[10px] font-semibold uppercase
                                      tracking-widest text-gold">
                          {t.gallery.lastWords}
                        </p>
                      </div>
                      <p className="font-serif text-sm italic leading-relaxed
                                    text-navy/75 sm:text-base lg:text-lg">
                        {student.lastWords}
                      </p>
                      <span className="absolute right-4 bottom-1 select-none
                                       font-serif text-5xl leading-none text-gold/20">
                        &rdquo;
                      </span>
                    </div>
                  )}

                </div>
              </div>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
