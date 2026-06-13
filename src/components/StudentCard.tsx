"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { Student } from "@/lib/types";
import {
  getStudentInitial,
  getStudentPrimaryPhoto,
} from "@/lib/students";

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
  const coverPhoto = getStudentPrimaryPhoto(student);

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
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-paper">
        {coverPhoto ? (
          <Image
            src={coverPhoto}
            alt={student.fullName || "Student"}
            fill
            className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-paper to-paper-warm">
            <span className="font-serif text-5xl font-bold text-navy/20">
              {getStudentInitial(student.fullName)}
            </span>
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/90 via-navy/50 to-transparent px-2 pt-10 pb-2">
          <h3 className="line-clamp-2 text-center font-serif text-xs font-bold text-white sm:text-sm">
            {student.fullName || "Student"}
          </h3>
        </div>
      </div>
    </motion.button>
  );
}
