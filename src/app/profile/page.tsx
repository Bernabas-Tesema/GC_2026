"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  GraduationCap,
  HandHeart,
  Loader2,
  Mail,
  MessageSquareQuote,
  Phone,
  Save,
  User,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import IconLabel from "@/components/IconLabel";
import { useLanguage } from "@/contexts/LanguageContext";
import { saveStudent } from "@/lib/students";
import {
  ACADEMIC_DEPARTMENTS,
  FELLOWSHIP_DEPARTMENTS,
} from "@/lib/constants";
import Navbar from "@/components/Navbar";
import PhotoUpload from "@/components/PhotoUpload";

export default function ProfilePage() {
  const { user, student, loading: authLoading, refreshStudent } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [academicDepartment, setAcademicDepartment] = useState("");
  const [fellowshipDepartment, setFellowshipDepartment] = useState("");
  const [lastWords, setLastWords] = useState("");
  const [largePhotoUrl, setLargePhotoUrl] = useState("");
  const [smallPhotoUrl, setSmallPhotoUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (student) {
      setFullName(student.fullName);
      setPhone(student.phone);
      setAcademicDepartment(student.academicDepartment);
      setFellowshipDepartment(student.fellowshipDepartment);
      setLastWords(student.lastWords);
      setLargePhotoUrl(student.largePhotoUrl);
      setSmallPhotoUrl(student.smallPhotoUrl);
    } else if (user) {
      setFullName(user.displayName || "");
    }
  }, [student, user]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (
      !fullName ||
      !phone ||
      !academicDepartment ||
      !fellowshipDepartment ||
      !largePhotoUrl ||
      !smallPhotoUrl
    ) {
      setError(t.profile.required);
      return;
    }

    setSaving(true);
    setError("");

    try {
      await saveStudent(user.uid, {
        fullName,
        email: user.email || "",
        phone,
        academicDepartment,
        fellowshipDepartment,
        lastWords,
        largePhotoUrl,
        smallPhotoUrl,
      });
      await refreshStudent();
      router.push("/book");
    } catch {
      setError(t.common.error);
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-navy/60">{t.common.loading}</p>
      </div>
    );
  }

  return (
    <main className="book-surface min-h-screen pt-16">
      <Navbar variant="light" />

      <div className="mx-auto max-w-3xl px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-8 text-center">
            <h1 className="font-serif text-3xl font-bold text-navy">
              {t.profile.title}
            </h1>
            <p className="mt-2 text-navy/60">{t.profile.subtitle}</p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="book-page space-y-6 rounded-2xl border border-gold/20 p-6 md:p-8 book-shadow"
          >
            <div className="grid gap-6 md:grid-cols-2">
              <PhotoUpload
                label={t.profile.largePhoto}
                value={largePhotoUrl}
                onChange={setLargePhotoUrl}
                aspect="portrait"
              />
              <PhotoUpload
                label={t.profile.smallPhoto}
                value={smallPhotoUrl}
                onChange={setSmallPhotoUrl}
                aspect="square"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <IconLabel icon={User}>{t.profile.fullName} *</IconLabel>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-lg border border-navy/15 bg-white px-4 py-2.5 text-navy outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
                />
              </div>

              <div>
                <IconLabel icon={Mail}>{t.profile.email}</IconLabel>
                <input
                  type="email"
                  disabled
                  value={user?.email || ""}
                  className="w-full rounded-lg border border-navy/15 bg-white px-4 py-2.5 text-navy/60"
                />
              </div>

              <div>
                <IconLabel icon={Phone}>{t.profile.phone} *</IconLabel>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-lg border border-navy/15 bg-white px-4 py-2.5 text-navy outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
                />
              </div>

              <div>
                <IconLabel icon={GraduationCap}>
                  {t.profile.academicDept} *
                </IconLabel>
                <select
                  required
                  value={academicDepartment}
                  onChange={(e) => setAcademicDepartment(e.target.value)}
                  className="w-full rounded-lg border border-navy/15 bg-white px-4 py-2.5 text-navy outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
                >
                  <option value="">{t.profile.selectDepartment}</option>
                  {ACADEMIC_DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <IconLabel icon={HandHeart}>
                  {t.profile.fellowshipDept} *
                </IconLabel>
                <select
                  required
                  value={fellowshipDepartment}
                  onChange={(e) => setFellowshipDepartment(e.target.value)}
                  className="w-full rounded-lg border border-navy/15 bg-white px-4 py-2.5 text-navy outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
                >
                  <option value="">{t.profile.selectDepartment}</option>
                  {FELLOWSHIP_DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <IconLabel icon={MessageSquareQuote}>
                  {t.profile.lastWords}
                </IconLabel>
                <textarea
                  rows={4}
                  value={lastWords}
                  onChange={(e) => setLastWords(e.target.value)}
                  placeholder={t.profile.lastWordsPlaceholder}
                  className="w-full resize-none rounded-lg border border-navy/15 bg-white px-4 py-2.5 text-navy outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
                />
              </div>
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-navy py-3 font-semibold text-white transition-colors hover:bg-navy-light disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  {t.profile.saving}
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  {t.profile.save}
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </main>
  );
}
