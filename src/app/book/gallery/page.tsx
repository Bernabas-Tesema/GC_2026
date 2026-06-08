"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getAllStudents } from "@/lib/students";
import {
  ACADEMIC_DEPARTMENTS,
  FELLOWSHIP_DEPARTMENTS,
} from "@/lib/constants";
import type { Student } from "@/lib/types";
import StudentCard from "@/components/StudentCard";
import StudentModal from "@/components/StudentModal";
import BookFooter from "@/components/BookFooter";

const STUDENTS_PER_PAGE = 3;

export default function GalleryPage() {
  const { t } = useLanguage();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [fellowshipFilter, setFellowshipFilter] = useState("");
  const [academicFilter, setAcademicFilter] = useState("");
  const [nameQuery, setNameQuery] = useState("");
  const [page, setPage] = useState(0);

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
      if (fellowshipFilter && s.fellowshipDepartment !== fellowshipFilter)
        return false;
      if (academicFilter && s.academicDepartment !== academicFilter)
        return false;
      return true;
    });
  }, [students, fellowshipFilter, academicFilter, nameQuery]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredStudents.length / STUDENTS_PER_PAGE)
  );

  const pagedStudents = useMemo(() => {
    const start = page * STUDENTS_PER_PAGE;
    return filteredStudents.slice(start, start + STUDENTS_PER_PAGE);
  }, [filteredStudents, page]);

  useEffect(() => {
    setPage(0);
  }, [fellowshipFilter, academicFilter, nameQuery]);

  useEffect(() => {
    if (page > totalPages - 1) {
      setPage(Math.max(0, totalPages - 1));
    }
  }, [page, totalPages]);

  return (
    <div className="space-y-2">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="sticky top-16 z-20 -mx-4 space-y-2 border-b border-gold/20 bg-paper/95 px-4 py-3 backdrop-blur-sm md:-mx-8 md:px-8 lg:-mx-10 lg:px-10"
      >
        <label className="flex w-full items-center gap-2 text-[11px] text-navy md:text-xs">
          <span className="sr-only">{t.gallery.searchName}</span>
          <Search className="h-4 w-4 shrink-0 text-gold" aria-hidden />
          <input
            type="search"
            value={nameQuery}
            onChange={(e) => setNameQuery(e.target.value)}
            placeholder={t.gallery.searchPlaceholder}
            className="min-w-0 flex-1 rounded-md border border-navy/15 bg-white px-3 py-1.5 text-[11px] text-navy outline-none placeholder:text-navy/40 focus:border-gold md:text-xs"
          />
        </label>

        <div className="flex flex-col gap-1.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4 sm:gap-y-1">
          <label className="flex items-center gap-1.5 text-[11px] text-navy md:text-xs">
            <span className="shrink-0 font-medium text-navy/70">
              {t.gallery.filterFellowship}:
            </span>
            <select
              value={fellowshipFilter}
              onChange={(e) => setFellowshipFilter(e.target.value)}
              className="min-w-0 flex-1 rounded-md border border-navy/15 bg-white px-2 py-1 text-[11px] text-navy outline-none focus:border-gold sm:flex-none sm:min-w-[140px] md:text-xs"
            >
              <option value="">{t.gallery.all}</option>
              {FELLOWSHIP_DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-center gap-1.5 text-[11px] text-navy md:text-xs">
            <span className="shrink-0 font-medium text-navy/70">
              {t.gallery.filterAcademic}:
            </span>
            <select
              value={academicFilter}
              onChange={(e) => setAcademicFilter(e.target.value)}
              className="min-w-0 flex-1 rounded-md border border-navy/15 bg-white px-2 py-1 text-[11px] text-navy outline-none focus:border-gold sm:flex-none sm:min-w-[140px] md:text-xs"
            >
              <option value="">{t.gallery.all}</option>
              {ACADEMIC_DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </label>

          <span className="text-[11px] text-navy/50 md:text-xs">
            {filteredStudents.length} {t.gallery.title.toLowerCase()}
          </span>
        </div>
      </motion.div>

      <div className="pt-2">
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="h-7 w-7 animate-spin rounded-full border-4 border-gold border-t-transparent" />
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="py-8 text-center text-sm text-navy/50">
          {t.gallery.noResults}
        </div>
      ) : (
        <div className="flex items-center gap-2 md:gap-3">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            aria-label={t.common.previous}
            className="nav-btn-hover flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-gold bg-white text-navy shadow-sm transition-colors hover:bg-gold/10 disabled:cursor-not-allowed disabled:opacity-30 md:h-12 md:w-12"
          >
            <ChevronLeft className="h-6 w-6 md:h-7 md:w-7" />
          </button>

          <div className="grid min-h-0 flex-1 grid-cols-3 gap-3 md:gap-4">
            {pagedStudents.map((student, index) => (
              <StudentCard
                key={student.id}
                student={student}
                index={index}
                onClick={() => setSelectedStudent(student)}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            aria-label={t.common.next}
            className="nav-btn-hover flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-gold bg-white text-navy shadow-sm transition-colors hover:bg-gold/10 disabled:cursor-not-allowed disabled:opacity-30 md:h-12 md:w-12"
          >
            <ChevronRight className="h-6 w-6 md:h-7 md:w-7" />
          </button>
        </div>
      )}

      {!loading && filteredStudents.length > 0 && (
        <p className="text-center text-[11px] text-navy/45">
          {page + 1} / {totalPages}
        </p>
      )}

      <StudentModal
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
      />

      <BookFooter />
      </div>
    </div>
  );
}
