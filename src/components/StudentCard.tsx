"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Student } from "@/lib/types";
import StudentPhotoFrame from "@/components/StudentPhotoFrame";

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
      <StudentPhotoFrame
        student={student}
        insetSize="sm"
        showNameOverlay={compact}
        className={`relative w-full ${
          compact ? "aspect-square" : "aspect-[5/6]"
        }`}
      />

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
