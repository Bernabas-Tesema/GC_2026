"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Building2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getDepartmentStudents } from "@/lib/students";
import {
  FELLOWSHIP_DEPARTMENTS,
  fellowshipDepartmentSlug,
  studentMatchesFellowshipDepartment,
} from "@/lib/constants";
import type { Student } from "@/lib/types";
import PageHero from "@/components/ui/PageHero";
import StudentPhotoFrame from "@/components/StudentPhotoFrame";

type DepartmentSection = {
  dept: (typeof FELLOWSHIP_DEPARTMENTS)[number];
  members: Student[];
};

function buildDepartmentSections(
  students: Student[],
  selectedDept: string
): DepartmentSection[] {
  const departments = selectedDept
    ? FELLOWSHIP_DEPARTMENTS.filter((dept) => dept === selectedDept)
    : [...FELLOWSHIP_DEPARTMENTS];

  return departments
    .map((dept) => ({
      dept,
      members: students.filter((student) =>
        studentMatchesFellowshipDepartment(student.fellowshipDepartment, dept)
      ),
    }))
    .filter((section) => section.members.length > 0);
}

function DepartmentPhotoGrid({
  members,
}: {
  members: Student[];
}) {
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-3 sm:grid-cols-3 sm:gap-x-4 sm:gap-y-4 md:grid-cols-4 md:gap-x-5">
      {members.map((student, i) => (
          <motion.figure
            key={student.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.03 }}
            className="overflow-hidden rounded-lg card-box"
          >
            <StudentPhotoFrame
              student={student}
              insetSize="sm"
              showNameOverlay
              className="aspect-square"
            />
          </motion.figure>
      ))}
    </div>
  );
}

export default function DepartmentsPage() {
  const { t } = useLanguage();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState("");

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
  }, [loading]);

  useEffect(() => {
    if (!selectedDepartment || loading) return;
    const id = fellowshipDepartmentSlug(selectedDepartment);
    window.requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [selectedDepartment, loading]);

  const departmentSections = useMemo(
    () => buildDepartmentSections(students, selectedDepartment),
    [students, selectedDepartment]
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
        <label className="flex w-full min-w-0 items-center gap-2 text-[11px] text-navy">
          <Building2 className="h-3.5 w-3.5 shrink-0 text-gold" aria-hidden />
          <span className="sr-only">{t.departments.selectDepartment}</span>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="select-field w-full min-w-0"
          >
            <option value="">{t.departments.selectDepartment}</option>
            {FELLOWSHIP_DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
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
