"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Building2, Search } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getDepartmentStudents, getStudentInitial, getStudentPrimaryPhoto } from "@/lib/students";
import {
  FELLOWSHIP_DEPARTMENTS,
  fellowshipDepartmentSlug,
  studentMatchesFellowshipDepartment,
} from "@/lib/constants";
import type { Student } from "@/lib/types";
import PageHero from "@/components/ui/PageHero";

type DepartmentSection = {
  dept: (typeof FELLOWSHIP_DEPARTMENTS)[number];
  members: Student[];
};

function buildDepartmentSections(students: Student[], query: string): DepartmentSection[] {
  const q = query.trim().toLowerCase();

  return FELLOWSHIP_DEPARTMENTS.map((dept) => {
    const allMembers = students.filter((student) =>
      studentMatchesFellowshipDepartment(student.fellowshipDepartment, dept)
    );

    if (!q) {
      return { dept, members: allMembers };
    }

    const deptMatches = dept.toLowerCase().includes(q);
    const members = deptMatches
      ? allMembers
      : allMembers.filter((student) => student.fullName?.toLowerCase().includes(q));

    return { dept, members };
  }).filter((section) => section.members.length > 0);
}

function DepartmentPhotoGrid({
  members,
}: {
  members: Student[];
}) {
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-3 sm:grid-cols-3 sm:gap-x-4 sm:gap-y-4 md:grid-cols-4 md:gap-x-5">
      {members.map((student, i) => {
        const name = student.fullName || "Student";
        const primaryPhoto = getStudentPrimaryPhoto(student);
        const initial = getStudentInitial(student.fullName);

        return (
          <motion.figure
            key={student.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.03 }}
            className="overflow-hidden rounded-lg card-box"
          >
            <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-paper to-paper-warm">
              {primaryPhoto ? (
                <Image
                  src={primaryPhoto}
                  alt={name}
                  fill
                  className="object-cover object-center transition-transform hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <span className="font-serif text-3xl font-bold text-navy/15 sm:text-4xl">
                    {initial}
                  </span>
                </div>
              )}

              <div className="absolute inset-x-0 bottom-0 chocolate-overlay px-1.5 pt-7 pb-1.5 sm:px-2 sm:pb-2">
                <figcaption className="line-clamp-2 text-center font-serif text-[10px] font-bold text-white sm:text-xs">
                  {name}
                </figcaption>
              </div>
            </div>
          </motion.figure>
        );
      })}
    </div>
  );
}

export default function DepartmentsPage() {
  const { t } = useLanguage();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [nameQuery, setNameQuery] = useState("");

  useEffect(() => {
    getDepartmentStudents()
      .then(setStudents)
      .catch(() => setStudents([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (loading) return;
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    window.requestAnimationFrame(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [loading, nameQuery]);

  const departmentSections = useMemo(
    () => buildDepartmentSections(students, nameQuery),
    [students, nameQuery]
  );

  const totalMembers = useMemo(
    () => departmentSections.reduce((sum, section) => sum + section.members.length, 0),
    [departmentSections]
  );

  return (
    <div className="space-y-2">
      <PageHero title={t.departments.title} icon={Building2} compact />

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-12 z-20 filter-bar"
      >
        <label className="flex w-full items-center gap-2 text-[11px] text-navy">
          <span className="sr-only">{t.gallery.searchName}</span>
          <Search className="h-3.5 w-3.5 shrink-0 text-gold" aria-hidden />
          <input
            type="search"
            value={nameQuery}
            onChange={(e) => setNameQuery(e.target.value)}
            placeholder={t.departments.searchPlaceholder}
            className="input-field min-w-0 flex-1 py-1.5 text-xs sm:text-sm"
          />
        </label>
        <p className="mt-1 text-[10px] text-navy/45">
          {departmentSections.length} {t.nav.departments.toLowerCase()} · {totalMembers}{" "}
          {totalMembers === 1 ? "member" : "members"}
        </p>
      </motion.div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold border-t-transparent" />
        </div>
      ) : departmentSections.length === 0 ? (
        <p className="py-10 text-center text-sm text-navy/50">{t.departments.noResults}</p>
      ) : (
        <div className="max-h-[min(calc(100dvh-11rem),900px)] space-y-5 overflow-y-auto overscroll-y-contain pb-2 pr-1">
          {departmentSections.map(({ dept, members }) => (
            <section
              key={dept}
              id={fellowshipDepartmentSlug(dept)}
              className="scroll-mt-16"
            >
              <div className="mb-2 inline-flex max-w-full flex-wrap items-baseline gap-x-1 rounded-md chocolate-box px-2 py-1">
                <h2 className="font-serif text-[11px] font-bold text-white sm:text-xs">{dept}</h2>
                <span className="text-[10px] text-amber-100/75">
                  · {members.length} {members.length === 1 ? "member" : "members"}
                </span>
              </div>
              <DepartmentPhotoGrid members={members} />
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
