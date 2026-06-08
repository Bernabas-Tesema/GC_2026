"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { GraduationCap, Heart, Phone } from "lucide-react";
import type { Student } from "@/lib/types";
import { getStudentInitial } from "@/lib/students";
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

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      onClick={onClick}
      className="group w-full cursor-pointer overflow-hidden rounded-2xl border border-gold/20 bg-white text-left shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-navy/5">
        {student.largePhotoUrl ? (
          <Image
            src={student.largePhotoUrl}
            alt={student.fullName || "Student"}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl font-serif text-gold/40">
            {getStudentInitial(student.fullName)}
          </div>
        )}

        {student.smallPhotoUrl && (
          <div className="absolute right-3 bottom-3 h-14 w-14 overflow-hidden rounded-full border-2 border-gold shadow-md">
            <Image
              src={student.smallPhotoUrl}
              alt=""
              fill
              className="object-cover"
              sizes="56px"
            />
          </div>
        )}
      </div>

      <div className="space-y-2 p-4">
        <h3 className="font-serif text-lg font-bold text-navy">
          {student.fullName || "Student"}
        </h3>
        <div className="space-y-1 text-xs text-navy/60">
          <p className="flex items-center gap-1.5">
            <GraduationCap className="h-3.5 w-3.5 shrink-0 text-gold" />
            {student.academicDepartment}
          </p>
          <p className="flex items-center gap-1.5">
            <Heart className="h-3.5 w-3.5 shrink-0 text-burgundy" />
            {student.fellowshipDepartment}
          </p>
          {student.phone && (
            <p className="flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 shrink-0" />
              {student.phone}
            </p>
          )}
        </div>
        {student.lastWords && (
          <p className="line-clamp-2 text-sm italic text-navy/50">
            &ldquo;{student.lastWords}&rdquo;
          </p>
        )}
        <span className="inline-block text-xs font-medium text-gold">
          {t.gallery.viewProfile} →
        </span>
      </div>
    </motion.button>
  );
}
