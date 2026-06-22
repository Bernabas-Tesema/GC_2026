"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
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
  isValidDepartmentValue,
  MAX_LAST_WORDS,
  normalizeFellowshipDepartment,
} from "@/lib/constants";
import { countWords, limitToMaxWords } from "@/lib/lastWords";
import { uploadPhotoToCloudinary } from "@/lib/uploadPhoto";
import Navbar from "@/components/Navbar";
import PhotoUpload from "@/components/PhotoUpload";
import PageHero from "@/components/ui/PageHero";
import Button from "@/components/ui/Button";

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
  const [largePhotoFile, setLargePhotoFile] = useState<File | null>(null);
  const [smallPhotoFile, setSmallPhotoFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const largeBlobRef = useRef<string | null>(null);
  const smallBlobRef = useRef<string | null>(null);

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
      setLastWords(limitToMaxWords(student.lastWords));
      setLargePhotoUrl(student.largePhotoUrl);
      setSmallPhotoUrl(student.smallPhotoUrl);
      setCoverPhotoUrl(
        student.coverPhotoUrl || student.largePhotoUrl || student.smallPhotoUrl || ""
      );
      setLargePhotoFile(null);
      setSmallPhotoFile(null);
    } else if (user) {
      setFullName(user.displayName || "");
    }
  }, [student, user]);

  useEffect(() => {
    return () => {
      if (largeBlobRef.current) URL.revokeObjectURL(largeBlobRef.current);
      if (smallBlobRef.current) URL.revokeObjectURL(smallBlobRef.current);
    };
  }, []);

  const handleLargePick = (file: File, preview: string) => {
    if (largeBlobRef.current) URL.revokeObjectURL(largeBlobRef.current);
    largeBlobRef.current = preview.startsWith("blob:") ? preview : null;
    setLargePhotoFile(file);
    setLargePhotoUrl(preview);
    setCoverPhotoUrl((c) => c || preview);
  };

  const handleSmallPick = (file: File, preview: string) => {
    if (smallBlobRef.current) URL.revokeObjectURL(smallBlobRef.current);
    smallBlobRef.current = preview.startsWith("blob:") ? preview : null;
    setSmallPhotoFile(file);
    setSmallPhotoUrl(preview);
    setCoverPhotoUrl((c) => c || preview);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (
      !isValidDepartmentValue(academicDepartment) ||
      !isValidDepartmentValue(fellowshipDepartment)
    ) {
      setError(t.profile.required);
      return;
    }

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
      let finalLarge = largePhotoUrl;
      let finalSmall = smallPhotoUrl;

      if (largePhotoFile) {
        finalLarge = await uploadPhotoToCloudinary(largePhotoFile);
      }
      if (smallPhotoFile) {
        finalSmall = await uploadPhotoToCloudinary(smallPhotoFile);
      }

      await saveStudent(user.uid, {
        fullName,
        email: user.email || "",
        phone,
        academicDepartment,
        fellowshipDepartment: normalizeFellowshipDepartment(fellowshipDepartment),
        lastWords: limitToMaxWords(lastWords),
        largePhotoUrl: finalLarge,
        smallPhotoUrl: finalSmall,
        coverPhotoUrl: coverPhotoUrl || finalLarge || finalSmall,
      });

      setLargePhotoFile(null);
      setSmallPhotoFile(null);
      setLargePhotoUrl(finalLarge);
      setSmallPhotoUrl(finalSmall);

      await refreshStudent();
      router.push("/book");
    } catch (err) {
      setError(err instanceof Error ? err.message : t.profile.saveFailed);
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
    <main className="book-surface min-h-screen pt-[calc(4rem+env(safe-area-inset-top,0px))]">
      <Navbar variant="light" />

      <div className="mx-auto w-full max-w-lg space-y-6 px-4 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom,0px))] sm:px-5 sm:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <PageHero title={t.profile.title} subtitle={t.profile.subtitle} icon={User} compact />

          {!authLoading && !student && (
            <p className="rounded-xl border border-amber-200/80 bg-amber-50/90 px-4 py-3 text-center text-sm text-amber-800 shadow-sm">
              {t.profile.completeRequired}
            </p>
          )}

          <form onSubmit={handleSubmit} noValidate className="glass-card space-y-5 rounded-2xl p-4 sm:space-y-6 sm:rounded-3xl sm:p-5">
            <div className="grid grid-cols-1 gap-5 min-[520px]:grid-cols-2 min-[520px]:items-start sm:gap-6">
              <PhotoUpload
                label={t.profile.largePhoto}
                previewUrl={largePhotoUrl}
                onPick={handleLargePick}
                aspect="portrait"
                disabled={saving}
              />
              <PhotoUpload
                label={t.profile.smallPhoto}
                previewUrl={smallPhotoUrl}
                onPick={handleSmallPick}
                aspect="square"
                disabled={saving}
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
                  onChange={(e) => setLastWords(limitToMaxWords(e.target.value))}
                  placeholder={t.profile.lastWordsPlaceholder}
                  className="input-field resize-none"
                />
                <p
                  className={`mt-1.5 text-right text-xs ${
                    countWords(lastWords) >= MAX_LAST_WORDS
                      ? "font-medium text-chocolate"
                      : "text-navy/45"
                  }`}
                >
                  {t.profile.lastWordsLimit
                    .replace("{count}", String(countWords(lastWords)))
                    .replace("{max}", String(MAX_LAST_WORDS))}
                </p>
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
