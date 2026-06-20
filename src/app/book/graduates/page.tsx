"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Heart, Search, Users } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getAllStudents } from "@/lib/students";
import PageHero from "@/components/ui/PageHero";
import {
  ACADEMIC_DEPARTMENTS,
  DEPARTMENT_OTHER,
  FELLOWSHIP_DEPARTMENTS,
  studentMatchesFellowshipDepartment,
} from "@/lib/constants";
import type { Student } from "@/lib/types";
import StudentCard from "@/components/StudentCard";
import StudentModal from "@/components/StudentModal";

const STUDENTS_PER_PAGE = 8;

export default function GraduatesPage() {
  const { t } = useLanguage();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [fellowshipFilter, setFellowshipFilter] = useState("");
  const [academicFilter, setAcademicFilter] = useState("");
  const [nameQuery, setNameQuery] = useState("");

  useEffect(() => {
    getAllStudents()
      .then(setStudents)
      .catch(() => setStudents([]))
      .finally(() => setLoading(false));
  }, []);

  const filteredStudents = useMemo(() => {
    const query = nameQuery.trim().toLowerCase();

    return students.filter((s) => {
      if (query && !s.fullName?.toLowerCase().includes(query)) return false;
      if (fellowshipFilter) {
        if (fellowshipFilter === DEPARTMENT_OTHER) {
          if (
            FELLOWSHIP_DEPARTMENTS.includes(
              s.fellowshipDepartment as (typeof FELLOWSHIP_DEPARTMENTS)[number]
            )
          ) {
            return false;
          }
        } else if (!studentMatchesFellowshipDepartment(s.fellowshipDepartment, fellowshipFilter)) {
          return false;
        }
      }
      if (academicFilter) {
        if (academicFilter === DEPARTMENT_OTHER) {
          if (
            ACADEMIC_DEPARTMENTS.includes(
              s.academicDepartment as (typeof ACADEMIC_DEPARTMENTS)[number]
            )
          ) {
            return false;
          }
        } else if (s.academicDepartment !== academicFilter) {
          return false;
        }
      }
      return true;
    });
  }, [students, fellowshipFilter, academicFilter, nameQuery]);

  const studentPages = useMemo(() => {
    const pages: Student[][] = [];
    for (let i = 0; i < filteredStudents.length; i += STUDENTS_PER_PAGE) {
      pages.push(filteredStudents.slice(i, i + STUDENTS_PER_PAGE));
    }
    return pages;
  }, [filteredStudents]);

  return (
    <div className="space-y-2">
      <PageHero
        title={t.gallery.title}
        icon={Users}
        compact
      />

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
            placeholder={t.gallery.searchPlaceholder}
            className="input-field min-w-0 flex-1 py-1.5 text-xs sm:text-sm"
          />
        </label>

        <div className="mt-1.5 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4 sm:gap-y-2">
          <label className="flex min-w-0 flex-1 items-center gap-2 sm:max-w-[14rem]">
            <Heart className="h-3.5 w-3.5 shrink-0 text-gold" aria-hidden />
            <span className="sr-only">{t.gallery.filterFellowship}</span>
            <select
              value={fellowshipFilter}
              onChange={(e) => setFellowshipFilter(e.target.value)}
              className="select-field w-full min-w-0"
            >
              <option value="">{t.gallery.filterFellowship}: {t.gallery.all}</option>
              {FELLOWSHIP_DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
              <option value={DEPARTMENT_OTHER}>{t.profile.otherDepartment}</option>
            </select>
          </label>

          <label className="flex min-w-0 flex-1 items-center gap-2 sm:max-w-[14rem]">
            <GraduationCap className="h-3.5 w-3.5 shrink-0 text-gold" aria-hidden />
            <span className="sr-only">{t.gallery.filterAcademic}</span>
            <select
              value={academicFilter}
              onChange={(e) => setAcademicFilter(e.target.value)}
              className="select-field w-full min-w-0"
            >
              <option value="">{t.gallery.filterAcademic}: {t.gallery.all}</option>
              {ACADEMIC_DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
              <option value={DEPARTMENT_OTHER}>{t.profile.otherDepartment}</option>
            </select>
          </label>

          <span className="text-[10px] font-medium text-navy/40">
            {filteredStudents.length}
          </span>
        </div>
      </motion.div>

      <div>
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold border-t-transparent" />
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="py-10 text-center">
            <p className="font-serif text-lg text-navy/40">{t.gallery.noResults}</p>
          </div>
        ) : (
          <div className="max-h-[min(calc(100dvh-9.5rem),900px)] overflow-y-auto overscroll-y-contain px-1 sm:px-2">
            <div className="space-y-4 pb-2">
              {studentPages.map((pageStudents, pageIndex) => (
                <div
                  key={pageIndex}
                  className="grid grid-cols-4 gap-x-2 gap-y-2 sm:gap-x-3 sm:gap-y-3 md:gap-x-4 md:gap-y-4"
                >
                  {pageStudents.map((student, index) => (
                    <StudentCard
                      key={student.id}
                      student={student}
                      index={index}
                      compact
                      onClick={() => setSelectedStudent(student)}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        <StudentModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      </div>
    </div>
  );
}
