"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { getAllStudents, getStudentPrimaryPhoto } from "@/lib/students";
import { FELLOWSHIP_DEPARTMENTS } from "@/lib/constants";
import type { Student } from "@/lib/types";

function DepartmentsContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  const activeDept =
    FELLOWSHIP_DEPARTMENTS.find((d) => d === searchParams.get("dept")) ??
    FELLOWSHIP_DEPARTMENTS[0];

  useEffect(() => {
    getAllStudents()
      .then(setStudents)
      .catch(() => setStudents([]))
      .finally(() => setLoading(false));
  }, []);

  const departmentStudents = useMemo(
    () => students.filter((s) => s.fellowshipDepartment === activeDept),
    [students, activeDept]
  );

  const departmentMemories = useMemo(() => {
    return departmentStudents
      .map((student) => ({
        id: student.id,
        name: student.fullName || "Student",
        primaryPhoto: getStudentPrimaryPhoto(student),
      }))
      .filter((entry) => entry.primaryPhoto);
  }, [departmentStudents]);

  return (
    <div className="space-y-4">
      <motion.header
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-gold/20 py-2 text-center"
      >
        <h1 className="font-serif text-sm font-bold text-navy md:text-base">
          {t.departments.title}
        </h1>
        <p className="mt-0.5 text-[10px] text-navy/60 md:text-xs">
          {t.departments.subtitle}
        </p>
        <p className="mt-1 text-xs font-medium text-navy">{activeDept}</p>
      </motion.header>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold border-t-transparent" />
        </div>
      ) : (
        <motion.div
          key={activeDept}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="mb-2 text-center font-serif text-sm font-bold text-navy">
            {t.departments.memories}
          </h3>
          {departmentMemories.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-8 gap-y-6 px-2 sm:grid-cols-2 sm:gap-x-10 sm:px-4 md:grid-cols-3 md:gap-x-11 lg:grid-cols-4 lg:gap-x-12">
              {departmentMemories.map(({ id, name, primaryPhoto }, i) => (
                <motion.figure
                  key={id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="overflow-hidden rounded-xl border border-gold/20 bg-white"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={primaryPhoto}
                      alt={name}
                      fill
                      className="object-cover object-center transition-transform hover:scale-105"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />

                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/85 via-navy/50 to-transparent px-2 pt-8 pb-2">
                      <figcaption className="line-clamp-2 text-center font-serif text-xs font-bold text-white md:text-sm">
                        {name}
                      </figcaption>
                    </div>
                  </div>
                </motion.figure>
              ))}
            </div>
          ) : (
            <p className="py-10 text-center text-sm text-navy/50">
              {t.departments.noPhotos}
            </p>
          )}
        </motion.div>
      )}
    </div>
  );
}

export default function DepartmentsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold border-t-transparent" />
        </div>
      }
    >
      <DepartmentsContent />
    </Suspense>
  );
}
