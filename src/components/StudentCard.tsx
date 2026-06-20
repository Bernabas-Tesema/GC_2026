"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Student } from "@/lib/types";
import {
  getStudentInitial,
  getStudentPrimaryPhoto,
} from "@/lib/students";

interface StudentCardProps {
  student: Student;
  onClick: () => void;
  index?: number;
  compact?: boolean;
}

export default function StudentCard({
  student,
  onClick,
  index = 0,
  compact = false,
}: StudentCardProps) {
  const { t } = useLanguage();
  const coverPhoto = getStudentPrimaryPhoto(student);

  return (
    <motion.button
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.45, ease: "easeOut" }}
      onClick={onClick}
      className={`group flex w-full cursor-pointer flex-col overflow-hidden text-left transition-all duration-300 ${
        compact
          ? "card-box rounded-lg hover:-translate-y-0.5"
          : "card-box rounded-2xl hover:-translate-y-2"
      }`}
    >
      <div
        className={`relative w-full overflow-hidden bg-gradient-to-br from-paper to-paper-warm ${
          compact ? "aspect-[4/5]" : "aspect-[5/6]"
        }`}
      >
        {coverPhoto ? (
          <Image
            src={coverPhoto}
            alt={student.fullName || "Student"}
            fill
            className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
            sizes={compact ? "(max-width: 768px) 25vw, 20vw" : "(max-width: 768px) 50vw, 25vw"}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span
              className={`font-serif font-bold text-navy/15 ${
                compact ? "text-3xl" : "text-5xl"
              }`}
            >
              {getStudentInitial(student.fullName)}
            </span>
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/5" />
        {compact && (
          <div className="absolute inset-x-0 bottom-0 chocolate-overlay px-1.5 pt-6 pb-1.5">
            <h3 className="line-clamp-2 text-center font-serif text-[10px] font-bold leading-tight text-white sm:text-[11px]">
              {student.fullName || "Student"}
            </h3>
          </div>
        )}
      </div>

      {!compact && (
        <div className="space-y-1.5 px-3 py-3 sm:px-4 sm:py-3.5">
          <h3 className="line-clamp-2 text-center font-serif text-sm font-bold text-navy sm:text-base">
            {student.fullName || "Student"}
          </h3>
          {student.lastWords && (
            <p className="line-clamp-3 text-center text-[11px] leading-relaxed text-navy/55 sm:text-xs">
              <span className="sr-only">{t.gallery.lastWords}: </span>
              &ldquo;{student.lastWords}&rdquo;
            </p>
          )}
        </div>
      )}
    </motion.button>
  );
}
