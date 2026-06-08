"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Phone, GraduationCap, Heart } from "lucide-react";
import type { Student } from "@/lib/types";
import { getStudentInitial } from "@/lib/students";
import { useLanguage } from "@/contexts/LanguageContext";

interface StudentModalProps {
  student: Student | null;
  onClose: () => void;
}

export default function StudentModal({ student, onClose }: StudentModalProps) {
  const { t } = useLanguage();

  return (
    <AnimatePresence>
      {student && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy/60 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="book-page relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl book-shadow"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 rounded-full bg-white/90 p-2 shadow-md transition-colors hover:bg-white"
            >
              <X className="h-5 w-5 text-navy" />
            </button>

            <div className="relative aspect-[16/10] bg-navy/5">
              {student.largePhotoUrl ? (
                <Image
                  src={student.largePhotoUrl}
                  alt={student.fullName || "Student"}
                  fill
                  className="object-cover"
                  sizes="672px"
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center text-6xl font-serif text-gold/30">
                  {getStudentInitial(student.fullName)}
                </div>
              )}

              {student.smallPhotoUrl && (
                <div className="absolute -bottom-8 left-8 h-20 w-20 overflow-hidden rounded-full border-4 border-gold bg-white shadow-lg">
                  <Image
                    src={student.smallPhotoUrl}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
              )}
            </div>

            <div className="space-y-4 p-8 pt-12">
              <h2 className="font-serif text-3xl font-bold text-navy">
                {student.fullName || "Student"}
              </h2>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex items-start gap-2 rounded-lg bg-white/60 p-3">
                  <GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  <div>
                    <p className="text-xs font-medium text-navy/50">
                      {t.gallery.academicDept}
                    </p>
                    <p className="text-sm text-navy">
                      {student.academicDepartment}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2 rounded-lg bg-white/60 p-3">
                  <Heart className="mt-0.5 h-4 w-4 shrink-0 text-burgundy" />
                  <div>
                    <p className="text-xs font-medium text-navy/50">
                      {t.gallery.fellowshipDept}
                    </p>
                    <p className="text-sm text-navy">
                      {student.fellowshipDepartment}
                    </p>
                  </div>
                </div>
              </div>

              {student.phone && (
                <div className="flex items-center gap-2 text-sm text-navy/70">
                  <Phone className="h-4 w-4 text-gold" />
                  {student.phone}
                </div>
              )}

              {student.lastWords && (
                <div className="rounded-xl border-l-4 border-gold bg-white/60 p-5">
                  <p className="mb-2 text-xs font-semibold tracking-wide text-gold uppercase">
                    {t.gallery.lastWords}
                  </p>
                  <p className="font-serif text-lg leading-relaxed text-navy/80 italic">
                    &ldquo;{student.lastWords}&rdquo;
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
