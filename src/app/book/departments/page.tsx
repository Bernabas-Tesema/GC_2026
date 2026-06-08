"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { getAllStudents } from "@/lib/students";
import { FELLOWSHIP_DEPARTMENTS } from "@/lib/constants";
import type { Student } from "@/lib/types";
import BookFooter from "@/components/BookFooter";

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

  const departmentPhotos = useMemo(
    () =>
      departmentStudents
        .flatMap((s) => [s.largePhotoUrl, s.smallPhotoUrl])
        .filter(Boolean),
    [departmentStudents]
  );

  return (
    <div className="space-y-6">
      <motion.header
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="font-serif text-lg font-bold text-navy md:text-xl">
          {t.departments.title}
        </h1>
        <p className="mt-0.5 text-xs text-navy/60 md:text-sm">
          {t.departments.subtitle}
        </p>
        <p className="mt-2 text-sm font-medium text-navy">{activeDept}</p>
      </motion.header>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold border-t-transparent" />
        </div>
      ) : (
        <motion.div
          key={activeDept}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="mb-4 text-center font-serif text-lg font-bold text-navy">
            {t.departments.memories}
          </h3>
          {departmentPhotos.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
              {departmentPhotos.map((url, i) => (
                <motion.div
                  key={`${url}-${i}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="relative aspect-square overflow-hidden rounded-xl border border-gold/20"
                >
                  <Image
                    src={url}
                    alt={`${activeDept} memory`}
                    fill
                    className="object-cover transition-transform hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="py-10 text-center text-sm text-navy/50">
              {t.departments.noPhotos}
            </p>
          )}
        </motion.div>
      )}

      <BookFooter />
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
