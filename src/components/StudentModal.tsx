"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Phone, GraduationCap, Heart, BookOpen } from "lucide-react";
import type { Student } from "@/lib/types";
import { getStudentInitial, getStudentPrimaryPhoto } from "@/lib/students";
import { useLanguage } from "@/contexts/LanguageContext";

interface StudentModalProps {
  student: Student | null;
  onClose: () => void;
}

function PanelPhoto({
  src,
  alt,
  initial,
}: {
  src: string;
  alt: string;
  initial: string;
}) {
  return (
    <div className="relative h-full min-h-[220px] w-full overflow-hidden rounded-3xl border-4 border-white bg-paper shadow-xl ring-2 ring-gold/30 sm:min-h-0">
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain object-center"
          sizes="(max-width: 640px) 100vw, 42vw"
          priority
        />
      ) : (
        <div className="flex h-full min-h-[220px] items-center justify-center sm:min-h-0">
          <span className="font-serif text-7xl font-bold text-navy/20 sm:text-8xl">
            {initial}
          </span>
        </div>
      )}
    </div>
  );
}

export default function StudentModal({ student, onClose }: StudentModalProps) {
  const { t } = useLanguage();
  const mainPhoto = student ? getStudentPrimaryPhoto(student) : "";

  return (
    <AnimatePresence>
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
            className="book-page relative flex h-full w-full flex-col sm:flex-row book-shadow"
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 z-30 rounded-full bg-white/90 p-2 shadow-md ring-1 ring-navy/10 transition-all hover:scale-110 hover:bg-white active:scale-95 sm:top-4 sm:right-4"
            >
              <X className="h-5 w-5 text-navy" />
            </button>

            <div className="relative flex w-full shrink-0 flex-col bg-navy/5 p-3 [height:48dvh] sm:h-full sm:w-[44%] sm:p-5">
              <div className="relative min-h-0 flex-1">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={mainPhoto}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.22 }}
                    className="absolute inset-0"
                  >
                    <PanelPhoto
                      src={mainPhoto}
                      alt={student.fullName || "Student"}
                      initial={getStudentInitial(student.fullName)}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-paper/50 to-transparent sm:inset-y-0 sm:right-0 sm:h-auto sm:w-10 sm:bg-gradient-to-l" />
            </div>

            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
              <div
                className="section-header shrink-0 px-5 py-4 sm:px-8 sm:py-6"
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold/80">
                  Class of 2026
                </p>
                <h2 className="mt-1 font-serif text-xl font-bold leading-tight text-white sm:text-2xl lg:text-3xl">
                  {student.fullName || "Student"}
                </h2>
                <div className="mt-2.5 h-0.5 w-10 rounded-full bg-gold/70" />
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-8 sm:py-7">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-start gap-3 rounded-2xl border border-gold/20 bg-paper p-4 shadow-sm">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold/10">
                      <GraduationCap className="h-5 w-5 text-gold" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-navy/40">
                        {t.gallery.academicDept}
                      </p>
                      <p className="mt-0.5 text-sm font-semibold leading-snug text-navy sm:text-base lg:text-lg">
                        {student.academicDepartment}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-2xl border border-gold/20 bg-paper p-4 shadow-sm">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-burgundy/10">
                      <Heart className="h-5 w-5 text-burgundy" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-navy/40">
                        {t.gallery.fellowshipDept}
                      </p>
                      <p className="mt-0.5 text-sm font-semibold leading-snug text-navy sm:text-base lg:text-lg">
                        {student.fellowshipDepartment}
                      </p>
                    </div>
                  </div>

                  {student.phone && (
                    <div className="flex items-center gap-3 rounded-2xl border border-gold/15 bg-paper px-4 py-3.5 shadow-sm">
                      <Phone className="h-5 w-5 shrink-0 text-gold" />
                      <span className="text-sm font-medium text-navy/75 sm:text-base lg:text-lg">
                        {student.phone}
                      </span>
                    </div>
                  )}

                  {student.lastWords && (
                    <div className="relative rounded-2xl border border-gold/25 bg-paper px-5 pb-6 pt-8 shadow-sm">
                      <span className="absolute top-2 left-4 select-none font-serif text-5xl leading-none text-gold/20">
                        &ldquo;
                      </span>
                      <div className="mb-2 flex items-center gap-1.5">
                        <BookOpen className="h-3.5 w-3.5 text-gold" />
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-gold">
                          {t.gallery.lastWords}
                        </p>
                      </div>
                      <p className="font-serif text-sm italic leading-relaxed text-navy/75 sm:text-base lg:text-lg">
                        {student.lastWords}
                      </p>
                      <span className="absolute right-4 bottom-1 select-none font-serif text-5xl leading-none text-gold/20">
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
