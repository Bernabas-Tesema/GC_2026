"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { GraduationCap, Heart } from "lucide-react";
import type { Student } from "@/lib/types";
import {
  getStudentInitial,
  getStudentPrimaryPhoto,
  getStudentSecondaryPhoto,
} from "@/lib/students";
import { useLanguage } from "@/contexts/LanguageContext";

interface StudentCardProps {
  student: Student;
  onClick: () => void;
  index?: number;
}

export default function StudentCard({
  student,
  onClick,
  index = 0,
}: StudentCardProps) {
  const { t } = useLanguage();
  const primaryPhoto = getStudentPrimaryPhoto(student);
  const secondaryPhoto = getStudentSecondaryPhoto(student);

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      onClick={onClick}
      className="group w-full cursor-pointer overflow-hidden rounded-2xl border border-gold/25 bg-white text-left shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-gold/50"
      style={{
        boxShadow: "0 4px 20px -6px rgba(15,31,61,0.1)",
      }}
    >
      {/* Photo area — 3:4 aspect ratio, fills fully without cropping */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-paper">
        {primaryPhoto ? (
          <Image
            src={primaryPhoto}
            alt={student.fullName || "Student"}
            fill
            className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-paper to-paper-warm">
            <span className="font-serif text-5xl font-bold text-navy/20">
              {getStudentInitial(student.fullName)}
            </span>
          </div>
        )}

        {/* Gradient overlay at bottom on hover */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-navy/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {secondaryPhoto && (
          <div className="absolute right-2 bottom-2 h-11 w-11 overflow-hidden rounded-full border-2 border-white shadow-lg ring-1 ring-gold/30">
            <Image
              src={secondaryPhoto}
              alt=""
              fill
              className="object-cover object-center"
              sizes="56px"
            />
          </div>
        )}
      </div>

      {/* Info area */}
      <div className="space-y-2.5 p-4 sm:p-5">
        <h3 className="line-clamp-1 font-serif text-base font-bold text-navy">
          {student.fullName || "Student"}
        </h3>
        <div className="space-y-1.5 text-[11px] text-navy/60">
          <p className="flex items-center gap-1.5">
            <GraduationCap className="h-3 w-3 shrink-0 text-gold" />
            <span className="line-clamp-1">{student.academicDepartment}</span>
          </p>
          <p className="flex items-center gap-1.5">
            <Heart className="h-3 w-3 shrink-0 text-burgundy" />
            <span className="line-clamp-1">{student.fellowshipDepartment}</span>
          </p>
        </div>
        {student.lastWords && (
          <p className="line-clamp-1 text-xs italic text-navy/45">
            &ldquo;{student.lastWords}&rdquo;
          </p>
        )}
        <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-gold transition-gap group-hover:gap-1">
          {t.gallery.viewProfile}
          <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
        </span>
      </div>
    </motion.button>
  );
}
