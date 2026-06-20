"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  GraduationCap,
  HandHeart,
  Mail,
  MessageSquareQuote,
  Phone,
  Save,
  User,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import IconLabel from "@/components/IconLabel";
import DepartmentSelect from "@/components/DepartmentSelect";
import { useLanguage } from "@/contexts/LanguageContext";
import { getClientAuth } from "@/lib/firebase";
import { isStudentProfileComplete, saveStudent } from "@/lib/students";
import {
  ACADEMIC_DEPARTMENTS,
  FELLOWSHIP_DEPARTMENTS,
  normalizeFellowshipDepartment,
} from "@/lib/constants";
import Navbar from "@/components/Navbar";
import PhotoUpload from "@/components/PhotoUpload";
import PageHero from "@/components/ui/PageHero";
import Button from "@/components/ui/Button";
import { getPhotoUploadCount } from "@/lib/photoUploadLimit";

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
  const [coverPhotoUrl, setCoverPhotoUrl] = useState("");
  const [photoUploadCount, setPhotoUploadCount] = useState(0);
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
      setCoverPhotoUrl(
        student.coverPhotoUrl || student.largePhotoUrl || student.smallPhotoUrl || ""
      );
    } else if (user) {
      setFullName(user.displayName || "");
    }
  }, [student, user]);

  useEffect(() => {
    if (!user) return;
    getPhotoUploadCount(user.uid)
      .then(setPhotoUploadCount)
      .catch(() => setPhotoUploadCount(0));
  }, [user]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (
      !isStudentProfileComplete({
        id: "",
        uid: user.uid,
        fullName,
        email: user.email || "",
        phone,
        academicDepartment,
        fellowshipDepartment,
        lastWords,
        largePhotoUrl,
        smallPhotoUrl,
        coverPhotoUrl,
        createdAt: "",
        updatedAt: "",
      })
    ) {
      setError(t.profile.required);
      return;
    }

    setSaving(true);
    setError("");

    if (!getClientAuth().currentUser) {
      setError(t.auth.loginError);
      setSaving(false);
      return;
    }

    try {
      await saveStudent(user.uid, {
        fullName,
        email: user.email || "",
        phone,
        academicDepartment,
        fellowshipDepartment: normalizeFellowshipDepartment(fellowshipDepartment),
        lastWords,
        largePhotoUrl,
        smallPhotoUrl,
        coverPhotoUrl: coverPhotoUrl || largePhotoUrl || smallPhotoUrl,
      });
      await refreshStudent();
      router.push("/book");
    } catch {
      setError(t.profile.saveFailed);
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

      <div className="mx-auto max-w-3xl space-y-6 px-3 py-8 sm:px-4 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <PageHero title={t.profile.title} subtitle={t.profile.subtitle} icon={User} />

          {!authLoading && !student && (
            <p className="rounded-xl border border-amber-200/80 bg-amber-50/90 px-4 py-3 text-center text-sm text-amber-800 shadow-sm">
              {t.profile.completeRequired}
            </p>
          )}

          <form onSubmit={handleSubmit} className="glass-card space-y-6 rounded-3xl p-4 sm:p-6 md:p-8">
            <div className="grid gap-6 sm:grid-cols-2">
              <PhotoUpload
                label={t.profile.largePhoto}
                value={largePhotoUrl}
                onChange={(url) => {
                  setLargePhotoUrl(url);
                  setCoverPhotoUrl((c) => c || url);
                }}
                aspect="portrait"
                userId={user?.uid}
                uploadCount={photoUploadCount}
                onUploadCountChange={setPhotoUploadCount}
              />
              <PhotoUpload
                label={t.profile.smallPhoto}
                value={smallPhotoUrl}
                onChange={(url) => {
                  setSmallPhotoUrl(url);
                  setCoverPhotoUrl((c) => c || url);
                }}
                aspect="square"
                userId={user?.uid}
                uploadCount={photoUploadCount}
                onUploadCountChange={setPhotoUploadCount}
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <IconLabel icon={User}>{t.profile.fullName} *</IconLabel>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="input-field"
                />
              </div>

              <div>
                <IconLabel icon={Mail}>{t.profile.email}</IconLabel>
                <input
                  type="email"
                  disabled
                  value={user?.email || ""}
                  className="input-field text-navy/60"
                />
              </div>

              <div>
                <IconLabel icon={Phone}>{t.profile.phone} *</IconLabel>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input-field"
                />
              </div>

              <div className="sm:col-span-2">
                <DepartmentSelect
                  label={t.profile.academicDept}
                  icon={GraduationCap}
                  options={ACADEMIC_DEPARTMENTS}
                  value={academicDepartment}
                  onChange={setAcademicDepartment}
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <DepartmentSelect
                  label={t.profile.fellowshipDept}
                  icon={HandHeart}
                  options={FELLOWSHIP_DEPARTMENTS}
                  value={fellowshipDepartment}
                  onChange={setFellowshipDepartment}
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <IconLabel icon={MessageSquareQuote}>
                  {t.profile.lastWords}
                </IconLabel>
                <textarea
                  rows={4}
                  value={lastWords}
                  onChange={(e) => setLastWords(e.target.value)}
                  placeholder={t.profile.lastWordsPlaceholder}
                  className="input-field resize-none"
                />
              </div>
            </div>

            {error && (
              <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </p>
            )}

            <Button type="submit" fullWidth loading={saving}>
              <Save className="h-5 w-5" />
              {saving ? t.profile.saving : t.profile.save}
            </Button>
          </form>
        </motion.div>
      </div>
    </main>
  );
}
