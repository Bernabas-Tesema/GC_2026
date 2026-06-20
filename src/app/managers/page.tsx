"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  ChevronDown,
  Edit2,
  FolderOpen,
  Image as ImageIcon,
  Loader2,
  LogOut,
  Plus,
  Shield,
  Trash2,
  Upload,
  Users,
  X,
} from "lucide-react";
import { useManagerAuth } from "@/contexts/ManagerAuthContext";
import { ensureFirestoreWriteAccess } from "@/lib/firestoreAccess";
import {
  getAllStudents,
  adminSaveStudent,
  deleteStudent,
} from "@/lib/students";
import { setMediaSlot, buildSlotKey, getAllMedia, deleteMediaSlot, listMediaEntries, groupMediaEntries } from "@/lib/media";
import {
  ACADEMIC_DEPARTMENTS,
  FELLOWSHIP_DEPARTMENTS,
  GRADUATION_YEAR,
  SITE_BRAND_NAME,
} from "@/lib/constants";
import { EVENT_SLUGS } from "@/lib/events";
import type { EventSlug } from "@/lib/events";
import { parseJsonResponse } from "@/lib/parseJsonResponse";
import type { Student } from "@/lib/types";
import Navbar from "@/components/Navbar";
import DepartmentSelect from "@/components/DepartmentSelect";
import { GraduationCap, HandHeart } from "lucide-react";

// ─────────────────────────────────────────
// Upload destinations
// ─────────────────────────────────────────
type UploadDest =
  | { type: "student-large"; studentId: string }
  | { type: "student-small"; studentId: string }
  | { type: "event-cover"; slug: string }
  | { type: "event-gallery"; slug: string }
  | { type: "gc-committee" }
  | { type: "leaders" }
  | { type: "site-gallery" };

function destLabel(dest: UploadDest): string {
  switch (dest.type) {
    case "student-large": return "Student — large photo";
    case "student-small": return "Student — small photo";
    case "event-cover":   return `Event cover — ${dest.slug}`;
    case "event-gallery": return `Event gallery — ${dest.slug}`;
    case "gc-committee":  return "GC Committee group photo";
    case "leaders":       return "Leader message photo";
    case "site-gallery":  return "Photo gallery";
  }
}

// ─────────────────────────────────────────
// Blank student template
// ─────────────────────────────────────────
const BLANK_STUDENT: Omit<Student, "id" | "createdAt" | "updatedAt"> = {
  uid: "",
  fullName: "",
  email: "",
  phone: "",
  academicDepartment: "",
  fellowshipDepartment: "",
  lastWords: "",
  largePhotoUrl: "",
  smallPhotoUrl: "",
};

// ─────────────────────────────────────────
// Tabs
// ─────────────────────────────────────────
type Tab = "users" | "upload";

export default function ManagersPage() {
  const router = useRouter();
  const { isManager, loading: managerLoading, logout: managerLogout } = useManagerAuth();
  const [tab, setTab] = useState<Tab>("users");

  useEffect(() => {
    if (!managerLoading && !isManager) {
      router.replace("/login?next=/managers");
      return;
    }
    if (isManager) {
      ensureFirestoreWriteAccess().catch(() => {});
    }
  }, [isManager, managerLoading, router]);

  if (managerLoading || !isManager) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  const handleLogout = () => {
    managerLogout();
    router.push("/login");
  };

  return (
    <main className="min-h-screen bg-cream">
      <Navbar variant="light" />

      <div className="mx-auto max-w-7xl px-4 pt-28 pb-12 sm:px-6 sm:pt-32 md:px-10">
        {/* ── Page header ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-2xl shadow-md"
              style={{ background: "linear-gradient(135deg,#0f172a,#1d4ed8)" }}
            >
              <Shield className="h-5 w-5 text-gold" />
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold text-navy sm:text-3xl">
                Managers (Committees)
              </h1>
              <p className="text-sm text-navy/50">
                {SITE_BRAND_NAME} · Admin Panel · {GRADUATION_YEAR}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="ml-auto flex items-center gap-1.5 rounded-full border border-navy/15 px-4 py-2 text-sm font-medium text-navy/70 transition-all hover:bg-red-50 hover:text-red-600 hover:border-red-200"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </motion.div>

        {/* ── Tabs ── */}
        <div className="mb-6 flex gap-2 rounded-2xl border border-gold/20 bg-white/70 p-1.5 w-fit shadow-sm">
          {(["users", "upload"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${
                tab === t
                  ? "text-white shadow-md"
                  : "text-navy/60 hover:text-navy"
              }`}
              style={
                tab === t
                  ? { background: "linear-gradient(135deg,#0f172a,#1e3a8a)" }
                  : {}
              }
            >
              {t === "users" ? <Users className="h-4 w-4" /> : <Upload className="h-4 w-4" />}
              {t === "users" ? "Users & Profiles" : "Upload Photos"}
            </button>
          ))}
        </div>

        {/* ── Tab content ── */}
        <AnimatePresence mode="wait">
          {tab === "users" ? (
            <motion.div key="users" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <UsersTab />
            </motion.div>
          ) : (
            <motion.div key="upload" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <UploadTab />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

// ═══════════════════════════════════════════════════════
// USERS TAB
// ═══════════════════════════════════════════════════════
function UsersTab() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [editStudent, setEditStudent] = useState<Partial<Student> | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Student | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");

  const load = () => {
    setLoading(true);
    getAllStudents()
      .then(setStudents)
      .catch(() => setStudents([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = students.filter((s) =>
    s.fullName.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async () => {
    if (!editStudent) return;
    setSaving(true);
    try {
      await ensureFirestoreWriteAccess();
      await adminSaveStudent({
        ...(BLANK_STUDENT),
        ...editStudent,
      } as Omit<Student, "createdAt" | "updatedAt"> & { id?: string });
      load();
      setEditStudent(null);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await ensureFirestoreWriteAccess();
      await deleteStudent(deleteTarget.id);
      load();
      setDeleteTarget(null);
    } catch (e) {
      console.error(e);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Top bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-navy/15 bg-white px-4 py-2.5 text-sm text-navy outline-none placeholder:text-navy/35 focus:border-gold focus:ring-2 focus:ring-gold/15 sm:max-w-xs"
        />
        <button
          onClick={() => setEditStudent({ ...BLANK_STUDENT })}
          className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg"
          style={{ background: "linear-gradient(135deg,#1d4ed8,#3b82f6)" }}
        >
          <Plus className="h-4 w-4" />
          Add Student
        </button>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total Students", value: students.length },
          { label: "With Photos",    value: students.filter((s) => s.largePhotoUrl).length },
          { label: "With Last Words", value: students.filter((s) => s.lastWords).length },
          { label: "Search Results", value: filtered.length },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-2xl border border-gold/20 bg-white/80 px-4 py-3 shadow-sm">
            <p className="text-xs font-medium text-navy/45">{label}</p>
            <p className="mt-0.5 font-serif text-2xl font-bold text-navy">{value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-7 w-7 animate-spin text-gold" />
        </div>
      ) : filtered.length === 0 ? (
        <p className="py-10 text-center font-serif text-navy/40">No students found.</p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gold/20 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gold/15 text-left text-[11px] font-semibold uppercase tracking-widest text-navy/45"
                  style={{ background: "linear-gradient(135deg,#0f172a08,#3b82f610)" }}>
                  <th className="px-4 py-3">Photo</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="hidden px-4 py-3 sm:table-cell">Email</th>
                  <th className="hidden px-4 py-3 md:table-cell">Academic Dept</th>
                  <th className="hidden px-4 py-3 lg:table-cell">Fellowship Dept</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy/5">
                {filtered.map((s) => (
                  <tr key={s.id} className="transition-colors hover:bg-gold/5">
                    <td className="px-4 py-3">
                      {s.largePhotoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={s.largePhotoUrl} alt="" className="h-10 w-10 rounded-xl object-cover" />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10 font-serif text-lg font-bold text-gold/60">
                          {s.fullName?.[0]?.toUpperCase() ?? "?"}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium text-navy">{s.fullName}</td>
                    <td className="hidden px-4 py-3 text-navy/55 sm:table-cell">{s.email || "—"}</td>
                    <td className="hidden px-4 py-3 text-navy/55 md:table-cell">{s.academicDepartment || "—"}</td>
                    <td className="hidden px-4 py-3 text-navy/55 lg:table-cell">{s.fellowshipDepartment || "—"}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditStudent({ ...s })}
                          className="rounded-lg border border-gold/30 p-2 text-gold transition-all hover:bg-gold/10"
                          title="Edit"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(s)}
                          className="rounded-lg border border-red-200 p-2 text-red-400 transition-all hover:bg-red-50"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit / Add modal */}
      <AnimatePresence>
        {editStudent !== null && (
          <StudentFormModal
            student={editStudent}
            onChange={setEditStudent}
            onSave={handleSave}
            onClose={() => setEditStudent(null)}
            saving={saving}
          />
        )}
      </AnimatePresence>

      {/* Delete confirm */}
      <AnimatePresence>
        {deleteTarget && (
          <ConfirmModal
            title="Delete Student"
            message={`Are you sure you want to delete "${deleteTarget.fullName}"? This cannot be undone.`}
            confirmLabel="Delete"
            danger
            loading={deleting}
            onConfirm={handleDelete}
            onCancel={() => setDeleteTarget(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────
// Student form modal
// ─────────────────────────────────────────
function StudentFormModal({
  student,
  onChange,
  onSave,
  onClose,
  saving,
}: {
  student: Partial<Student>;
  onChange: (s: Partial<Student>) => void;
  onSave: () => void;
  onClose: () => void;
  saving: boolean;
}) {
  const isNew = !student.id;

  const set = (field: keyof Student) => (val: string) =>
    onChange({ ...student, [field]: val });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md"
      style={{ background: "rgba(15,31,61,0.65)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        transition={{ type: "spring", stiffness: 280, damping: 26 }}
        onClick={(e) => e.stopPropagation()}
        className="book-page w-full max-w-2xl overflow-hidden rounded-3xl book-shadow"
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ background: "linear-gradient(135deg,#0f172a,#1e3a8a 60%,#1d4ed8)" }}
        >
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-gold" />
            <h2 className="font-serif text-lg font-bold text-white">
              {isNew ? "Add Student" : "Edit Student"}
            </h2>
          </div>
          <button onClick={onClose} className="rounded-full p-1.5 text-white/70 hover:bg-white/10 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[75vh] overflow-y-auto px-6 py-6">
          <div className="grid gap-4 sm:grid-cols-2">

            {/* Photos row */}
            <div className="sm:col-span-2">
              <div className="grid grid-cols-2 gap-4">
                <AdminPhotoUpload
                  label="Large Photo (portrait)"
                  value={student.largePhotoUrl ?? ""}
                  onChange={set("largePhotoUrl")}
                  aspect="3/4"
                />
                <AdminPhotoUpload
                  label="Small Photo (square)"
                  value={student.smallPhotoUrl ?? ""}
                  onChange={set("smallPhotoUrl")}
                  aspect="1/1"
                />
              </div>
            </div>

            <FieldInput label="Full Name *" value={student.fullName ?? ""} onChange={set("fullName")} />
            <FieldInput label="Email" value={student.email ?? ""} onChange={set("email")} type="email" />
            <FieldInput label="Phone" value={student.phone ?? ""} onChange={set("phone")} type="tel" />
            <FieldInput label="UID / No. (Firebase Auth UID or custom)" value={student.uid ?? ""} onChange={set("uid")} />

            <div className="sm:col-span-2">
              <DepartmentSelect
                label="Academic Department"
                icon={GraduationCap}
                options={ACADEMIC_DEPARTMENTS}
                value={student.academicDepartment ?? ""}
                onChange={set("academicDepartment")}
              />
            </div>
            <div className="sm:col-span-2">
              <DepartmentSelect
                label="Fellowship Department"
                icon={HandHeart}
                options={FELLOWSHIP_DEPARTMENTS}
                value={student.fellowshipDepartment ?? ""}
                onChange={set("fellowshipDepartment")}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold text-navy/60">Last Words / Message</label>
              <textarea
                rows={3}
                value={student.lastWords ?? ""}
                onChange={(e) => set("lastWords")(e.target.value)}
                className="w-full resize-none rounded-xl border border-navy/15 bg-white px-4 py-2.5 text-sm text-navy outline-none focus:border-gold focus:ring-2 focus:ring-gold/15"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-gold/15 px-6 py-4">
          <button onClick={onClose} className="rounded-xl border border-navy/15 px-5 py-2.5 text-sm font-medium text-navy hover:bg-navy/5">
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={saving || !student.fullName?.trim()}
            className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg disabled:opacity-50"
            style={{ background: "linear-gradient(135deg,#0f172a,#1e3a8a)" }}
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {saving ? "Saving…" : isNew ? "Add Student" : "Save Changes"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════
// UPLOAD TAB
// ═══════════════════════════════════════════════════════
function UploadTab() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [siteMedia, setSiteMedia] = useState<Record<string, string>>({});

  // Destination selector state
  const [destType, setDestType] = useState<UploadDest["type"]>("leaders");
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [selectedEventSlug, setSelectedEventSlug] = useState<EventSlug>(EVENT_SLUGS[0]);
  const [galleryIndex, setGalleryIndex] = useState(1); // for gallery / committee / leaders

  // Upload state
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<{ url: string; dest: string } | null>(null);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getAllStudents()
      .then(setStudents)
      .catch(() => setStudents([]))
      .finally(() => setLoadingStudents(false));
  }, []);

  const refreshSiteMedia = () => {
    getAllMedia().then(setSiteMedia).catch(() => setSiteMedia({}));
  };

  useEffect(() => {
    refreshSiteMedia();
  }, []);

  const buildDest = (): UploadDest => {
    switch (destType) {
      case "student-large": return { type: "student-large", studentId: selectedStudentId };
      case "student-small": return { type: "student-small", studentId: selectedStudentId };
      case "event-cover":   return { type: "event-cover",   slug: selectedEventSlug };
      case "event-gallery": return { type: "event-gallery", slug: selectedEventSlug };
      case "gc-committee":  return { type: "gc-committee" };
      case "leaders":       return { type: "leaders" };
      case "site-gallery":  return { type: "site-gallery" };
    }
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    setError("");
    setResult(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await parseJsonResponse<{ url?: string; error?: string; details?: string }>(res);
      if (!res.ok) throw new Error(data.details ?? data.error ?? "Upload failed");
      if (!data.url) throw new Error("Upload failed");

      const dest = buildDest();
      const url = data.url;

      await ensureFirestoreWriteAccess();

      // ── Persist URL to the right place ──────────────────
      if ((dest.type === "student-large" || dest.type === "student-small") && dest.studentId) {
        // Save directly to student's Firestore document
        const s = students.find((st) => st.id === dest.studentId);
        if (s) {
          const field = dest.type === "student-large" ? "largePhotoUrl" : "smallPhotoUrl";
          await adminSaveStudent({
            ...s,
            [field]: url,
            coverPhotoUrl: s.coverPhotoUrl || url,
          });
        }
      } else {
        // Save to siteMedia collection with a slot key
        const slot = buildSlotKey({
          type: dest.type,
          slug: "slug" in dest ? dest.slug : undefined,
          index: galleryIndex,
        });
        await setMediaSlot(slot, url);
      }
      // ────────────────────────────────────────────────────

      setResult({ url, dest: destLabel(dest) });
      refreshSiteMedia();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const needsStudent    = destType === "student-large" || destType === "student-small";
  const needsEvent      = destType === "event-cover"   || destType === "event-gallery";
  const needsIndex      = destType === "event-gallery" || destType === "gc-committee" || destType === "leaders" || destType === "site-gallery";

  const previewSlot =
    destType === "gc-committee" || destType === "leaders" || destType === "site-gallery"
      ? buildSlotKey({ type: destType, index: galleryIndex })
      : destType === "event-cover"
        ? buildSlotKey({ type: "event-cover", slug: selectedEventSlug })
        : destType === "event-gallery"
          ? buildSlotKey({ type: "event-gallery", slug: selectedEventSlug, index: galleryIndex })
          : null;
  const previewUrl = previewSlot ? siteMedia[previewSlot] : undefined;

  const handleDeleteSlot = async (slot: string) => {
    try {
      await ensureFirestoreWriteAccess();
      await deleteMediaSlot(slot);
      refreshSiteMedia();
      if (result && previewSlot === slot) setResult(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete photo.");
    }
  };

  const slotHint =
    destType === "gc-committee"
      ? "Use slot 1 for the GC Committee group photo on the home page"
      : destType === "leaders"
        ? "1 = Fellowship Leader message photo (Semagegn) · 2 = GC Committee message photo (Berket)"
        : destType === "site-gallery"
          ? "Photo position on Gallery page (1, 2, 3…)"
          : destType === "event-gallery"
          ? "Position in the event gallery grid"
          : null;

  return (
    <div className="space-y-6">
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Left: destination config */}
      <div className="space-y-5 rounded-3xl border border-gold/20 bg-white/80 p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <FolderOpen className="h-5 w-5 text-gold" />
          <h2 className="font-serif text-lg font-bold text-navy">Upload Destination</h2>
        </div>

        {/* Destination type picker */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-navy/45">
            Where to upload
          </label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {([
              { val: "student-large",  label: "Student Photo\n(Large)" },
              { val: "student-small",  label: "Student Photo\n(Small)" },
              { val: "event-cover",    label: "Event Cover" },
              { val: "event-gallery",  label: "Event Gallery" },
              { val: "gc-committee",   label: "GC Committee\nGroup Photo" },
              { val: "leaders",        label: "Leader Message\nPhoto" },
              { val: "site-gallery",   label: "Photo Gallery" },
            ] as const).map(({ val, label }) => (
              <button
                key={val}
                onClick={() => setDestType(val)}
                className={`rounded-xl border px-3 py-2.5 text-center text-xs font-semibold transition-all whitespace-pre-line ${
                  destType === val
                    ? "border-gold bg-gold/10 text-gold shadow-sm"
                    : "border-navy/10 text-navy/55 hover:border-gold/40 hover:text-navy"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Student selector */}
        {needsStudent && (
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-navy/45">
              Select Student
            </label>
            {loadingStudents ? (
              <div className="flex items-center gap-2 text-sm text-navy/50">
                <Loader2 className="h-4 w-4 animate-spin text-gold" /> Loading…
              </div>
            ) : (
              <div className="relative">
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-navy/15 bg-white px-4 py-2.5 pr-10 text-sm text-navy outline-none focus:border-gold"
                >
                  <option value="">— Choose a student —</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>{s.fullName}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/40" />
              </div>
            )}
          </div>
        )}

        {/* Event selector */}
        {needsEvent && (
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-navy/45">
              Select Event
            </label>
            <div className="relative">
              <select
                value={selectedEventSlug}
                onChange={(e) => setSelectedEventSlug(e.target.value as EventSlug)}
                className="w-full appearance-none rounded-xl border border-navy/15 bg-white px-4 py-2.5 pr-10 text-sm text-navy outline-none focus:border-gold"
              >
                {EVENT_SLUGS.map((slug) => (
                  <option key={slug} value={slug}>{slug}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/40" />
            </div>
          </div>
        )}

        {/* Index / position picker */}
        {needsIndex && (
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-navy/45">
              {destType === "event-gallery" ? "Gallery slot #" : "Photo slot #"}
            </label>
            <input
              type="number"
              min={1}
              max={50}
              value={galleryIndex}
              onChange={(e) => setGalleryIndex(Math.max(1, Number(e.target.value)))}
              className="w-24 rounded-xl border border-navy/15 bg-white px-4 py-2.5 text-sm text-navy outline-none focus:border-gold"
            />
            <p className="mt-1 text-[11px] text-navy/40">
              {slotHint}
            </p>
            {previewUrl && (
              <div className="mt-3 overflow-hidden rounded-xl border border-gold/25 bg-white">
                <div className="flex items-center justify-between border-b border-gold/15 px-3 py-1.5">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-navy/45">
                    Current photo in this slot
                  </p>
                  <button
                    type="button"
                    onClick={() => previewSlot && handleDeleteSlot(previewSlot)}
                    className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-2 py-0.5 text-[10px] font-semibold text-red-500 transition-colors hover:bg-red-50"
                  >
                    <Trash2 className="h-3 w-3" />
                    Delete
                  </button>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="Current upload preview"
                  className="max-h-40 w-full object-cover object-center"
                />
              </div>
            )}
          </div>
        )}

        {/* Event cover / gallery preview when slot index picker is hidden */}
        {!needsIndex && needsEvent && previewUrl && (
          <div className="overflow-hidden rounded-xl border border-gold/25 bg-white">
            <div className="flex items-center justify-between border-b border-gold/15 px-3 py-1.5">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-navy/45">
                Current photo in this slot
              </p>
              <button
                type="button"
                onClick={() => previewSlot && handleDeleteSlot(previewSlot)}
                className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-2 py-0.5 text-[10px] font-semibold text-red-500 transition-colors hover:bg-red-50"
              >
                <Trash2 className="h-3 w-3" />
                Delete
              </button>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Current upload preview"
              className="max-h-40 w-full object-cover object-center"
            />
          </div>
        )}

        {/* Summary */}
        <div className="rounded-xl border border-gold/25 bg-gold/5 px-4 py-3 text-sm">
          <p className="text-xs font-semibold uppercase tracking-widest text-gold/80">Uploading to</p>
          <p className="mt-0.5 font-medium text-navy">{destLabel(buildDest())}</p>
        </div>
      </div>

      {/* Right: upload area */}
      <div className="space-y-5 rounded-3xl border border-gold/20 bg-white/80 p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <Camera className="h-5 w-5 text-gold" />
          <h2 className="font-serif text-lg font-bold text-navy">Upload Photo</h2>
        </div>

        {/* Drop zone */}
        <div
          onClick={() => !uploading && inputRef.current?.click()}
          className={`flex min-h-48 cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
            uploading
              ? "border-gold/40 bg-gold/5"
              : "border-navy/20 hover:border-gold hover:bg-gold/5"
          }`}
        >
          {uploading ? (
            <>
              <Loader2 className="h-10 w-10 animate-spin text-gold" />
              <p className="text-sm font-medium text-navy/60">Uploading & saving…</p>
            </>
          ) : (
            <>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/10">
                <Upload className="h-7 w-7 text-gold" />
              </div>
              <div>
                <p className="font-semibold text-navy">Click to choose a photo</p>
                <p className="mt-0.5 text-xs text-navy/45">JPG, PNG, WEBP · max 10MB</p>
              </div>
            </>
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleUpload(file);
            e.target.value = "";
          }}
        />

        {error && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </p>
        )}

        {/* Result */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3 rounded-2xl border border-gold/25 bg-gold/5 p-4"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-gold">✓ Saved successfully</p>
            <p className="text-xs text-navy/55">→ {result.dest}</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={result.url} alt="uploaded" className="h-40 w-full rounded-xl object-contain bg-paper" />
            <button
              onClick={() => navigator.clipboard.writeText(result.url)}
              className="w-full rounded-xl border border-gold/30 px-4 py-2 text-xs font-medium text-navy hover:bg-gold/10 transition-colors"
            >
              Copy URL
            </button>
          </motion.div>
        )}
      </div>
    </div>

    <PostedPhotosPanel
      siteMedia={siteMedia}
      students={students}
      onRefreshSiteMedia={refreshSiteMedia}
      onRefreshStudents={() => {
        getAllStudents().then(setStudents).catch(() => setStudents([]));
      }}
    />
  </div>
  );
}

// ═══════════════════════════════════════════════════════
// POSTED PHOTOS PANEL
// ═══════════════════════════════════════════════════════
type DeleteMediaTarget =
  | { kind: "slot"; slot: string; label: string }
  | { kind: "student"; studentId: string; studentName: string; field: "largePhotoUrl" | "smallPhotoUrl" };

function PostedPhotosPanel({
  siteMedia,
  students,
  onRefreshSiteMedia,
  onRefreshStudents,
}: {
  siteMedia: Record<string, string>;
  students: Student[];
  onRefreshSiteMedia: () => void;
  onRefreshStudents: () => void;
}) {
  const [deleteTarget, setDeleteTarget] = useState<DeleteMediaTarget | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [filter, setFilter] = useState("");

  const mediaEntries = listMediaEntries(siteMedia);
  const filteredEntries = mediaEntries.filter(
    (entry) =>
      entry.label.toLowerCase().includes(filter.toLowerCase()) ||
      entry.slot.toLowerCase().includes(filter.toLowerCase())
  );
  const grouped = groupMediaEntries(filteredEntries);

  const studentPhotos = students.flatMap((student) => {
    const items: {
      id: string;
      studentId: string;
      studentName: string;
      field: "largePhotoUrl" | "smallPhotoUrl";
      label: string;
      url: string;
    }[] = [];
    if (student.largePhotoUrl) {
      items.push({
        id: `${student.id}-large`,
        studentId: student.id,
        studentName: student.fullName,
        field: "largePhotoUrl",
        label: `${student.fullName} — large photo`,
        url: student.largePhotoUrl,
      });
    }
    if (student.smallPhotoUrl) {
      items.push({
        id: `${student.id}-small`,
        studentId: student.id,
        studentName: student.fullName,
        field: "smallPhotoUrl",
        label: `${student.fullName} — small photo`,
        url: student.smallPhotoUrl,
      });
    }
    return items;
  }).filter(
    (item) =>
      item.label.toLowerCase().includes(filter.toLowerCase()) ||
      item.studentName.toLowerCase().includes(filter.toLowerCase())
  );

  const totalCount = mediaEntries.length + studentPhotos.length;

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await ensureFirestoreWriteAccess();
      if (deleteTarget.kind === "slot") {
        await deleteMediaSlot(deleteTarget.slot);
        onRefreshSiteMedia();
      } else {
        const student = students.find((s) => s.id === deleteTarget.studentId);
        if (student) {
          await adminSaveStudent({
            ...student,
            [deleteTarget.field]: "",
            ...(deleteTarget.field === "largePhotoUrl" && student.coverPhotoUrl === student.largePhotoUrl
              ? { coverPhotoUrl: student.smallPhotoUrl || "" }
              : {}),
          });
          onRefreshStudents();
        }
      }
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-5 rounded-3xl border border-gold/20 bg-white/80 p-6 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5 text-gold" aria-hidden />
          <div>
            <h2 className="font-serif text-lg font-bold text-navy">All Posted Photos</h2>
            <p className="text-xs text-navy/45">
              {totalCount} photo{totalCount === 1 ? "" : "s"} across site media and student profiles
            </p>
          </div>
        </div>
        <input
          type="search"
          placeholder="Search photos…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full rounded-xl border border-navy/15 bg-white px-4 py-2.5 text-sm text-navy outline-none placeholder:text-navy/35 focus:border-gold focus:ring-2 focus:ring-gold/15 sm:max-w-xs"
        />
      </div>

      {totalCount === 0 ? (
        <p className="py-8 text-center text-sm text-navy/45">No photos posted yet.</p>
      ) : (
        <div className="space-y-8">
          {grouped.map((group) => (
            <section key={group.category}>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-navy/45">
                {group.title} ({group.items.length})
              </h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {group.items.map((entry) => (
                  <PostedPhotoCard
                    key={entry.slot}
                    label={entry.label}
                    sublabel={entry.slot}
                    url={entry.url}
                    onDelete={() =>
                      setDeleteTarget({ kind: "slot", slot: entry.slot, label: entry.label })
                    }
                  />
                ))}
              </div>
            </section>
          ))}

          {studentPhotos.length > 0 && (
            <section>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-navy/45">
                Student profile photos ({studentPhotos.length})
              </h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {studentPhotos.map((item) => (
                  <PostedPhotoCard
                    key={item.id}
                    label={item.label}
                    sublabel="Student profile"
                    url={item.url}
                    onDelete={() =>
                      setDeleteTarget({
                        kind: "student",
                        studentId: item.studentId,
                        studentName: item.studentName,
                        field: item.field,
                      })
                    }
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      <AnimatePresence>
        {deleteTarget && (
          <ConfirmModal
            title="Delete photo?"
            message={
              deleteTarget.kind === "slot"
                ? `Remove "${deleteTarget.label}" from the site? This cannot be undone.`
                : `Remove ${deleteTarget.field === "largePhotoUrl" ? "large" : "small"} photo for "${deleteTarget.studentName}"?`
            }
            confirmLabel="Delete"
            danger
            loading={deleting}
            onConfirm={handleConfirmDelete}
            onCancel={() => setDeleteTarget(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function PostedPhotoCard({
  label,
  sublabel,
  url,
  onDelete,
}: {
  label: string;
  sublabel: string;
  url: string;
  onDelete: () => void;
}) {
  return (
    <article className="overflow-hidden rounded-2xl border border-gold/20 bg-white shadow-sm">
      <div className="relative aspect-[4/3] bg-paper">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={url} alt={label} className="h-full w-full object-cover object-center" />
        <button
          type="button"
          onClick={onDelete}
          className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-lg border border-red-200 bg-white/95 px-2 py-1 text-[10px] font-semibold text-red-500 shadow-sm transition-colors hover:bg-red-50"
        >
          <Trash2 className="h-3 w-3" />
          Delete
        </button>
      </div>
      <div className="space-y-0.5 px-3 py-2">
        <p className="line-clamp-2 text-xs font-semibold text-navy">{label}</p>
        <p className="truncate text-[10px] text-navy/40">{sublabel}</p>
      </div>
    </article>
  );
}

// ═══════════════════════════════════════════════════════
// Small reusable components
// ═══════════════════════════════════════════════════════

function FieldInput({
  label, value, onChange, type = "text",
}: {
  label: string; value: string; onChange: (v: string) => void; type?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-navy/60">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-navy/15 bg-white px-4 py-2.5 text-sm text-navy outline-none focus:border-gold focus:ring-2 focus:ring-gold/15"
      />
    </div>
  );
}

function AdminPhotoUpload({
  label, value, onChange, aspect,
}: {
  label: string; value: string; onChange: (url: string) => void; aspect: "3/4" | "1/1";
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await parseJsonResponse<{ url?: string; error?: string; details?: string }>(res);
      if (!res.ok) throw new Error(data.details ?? data.error ?? "Upload failed");
      if (!data.url) throw new Error("Upload failed");
      onChange(data.url);
    } catch (err) {
      console.error("AdminPhotoUpload error:", err);
      alert(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-1.5">
      <p className="text-[11px] font-semibold text-navy/55">{label}</p>
      <div
        onClick={() => !uploading && inputRef.current?.click()}
        className="relative cursor-pointer overflow-hidden rounded-xl border-2 border-dashed border-gold/30 bg-paper hover:border-gold transition-colors"
        style={{ aspectRatio: aspect }}
      >
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="h-full w-full object-contain" />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Camera className="h-6 w-6 text-navy/25" />
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80">
            <Loader2 className="h-6 w-6 animate-spin text-gold" />
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }}
      />
    </div>
  );
}

function ConfirmModal({
  title, message, confirmLabel, danger, loading, onConfirm, onCancel,
}: {
  title: string; message: string; confirmLabel: string;
  danger?: boolean; loading: boolean;
  onConfirm: () => void; onCancel: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md"
      style={{ background: "rgba(15,31,61,0.65)" }}
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.95, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="book-page w-full max-w-md rounded-3xl p-6 book-shadow"
      >
        <h2 className="font-serif text-xl font-bold text-navy">{title}</h2>
        <p className="mt-2 text-sm text-navy/65">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onCancel} className="rounded-xl border border-navy/15 px-5 py-2.5 text-sm font-medium text-navy hover:bg-navy/5">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-md disabled:opacity-50 ${
              danger ? "bg-red-500 hover:bg-red-600" : "bg-navy hover:bg-navy-light"
            }`}
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
