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
      className="group w-full cursor-pointer overflow-hidden rounded-2xl border border-gold/20 bg-white text-left shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-white">
        {primaryPhoto ? (
          <Image
            src={primaryPhoto}
            alt={student.fullName || "Student"}
            fill
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 33vw, 20vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center border border-dashed border-gold/30 bg-white text-3xl font-serif text-navy/25">
            {getStudentInitial(student.fullName)}
          </div>
        )}

        {secondaryPhoto && (
          <div className="absolute right-2 bottom-2 h-11 w-11 overflow-hidden rounded-full border-2 border-gold shadow-md">
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

      <div className="space-y-1.5 p-3">
        <h3 className="line-clamp-1 font-serif text-base font-bold text-navy">
          {student.fullName || "Student"}
        </h3>
        <div className="space-y-0.5 text-[11px] text-navy/60">
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
          <p className="line-clamp-1 text-xs italic text-navy/50">
            &ldquo;{student.lastWords}&rdquo;
          </p>
        )}
        <span className="inline-block text-[11px] font-medium text-gold">
          {t.gallery.viewProfile} →
        </span>
      </div>
    </motion.button>
  );
}
