"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Camera, ImageIcon, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import IconLabel from "@/components/IconLabel";
import { MAX_STUDENT_PHOTO_UPLOADS } from "@/lib/constants";
import {
  getPhotoUploadCount,
  isPhotoUploadLimitReached,
  recordStudentPhotoUpload,
} from "@/lib/photoUploadLimit";
import { parseJsonResponse } from "@/lib/parseJsonResponse";

interface PhotoUploadProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  aspect?: "square" | "portrait";
  fullWidth?: boolean;
  /** When set, enforces the student photo upload limit. */
  userId?: string;
  uploadCount?: number;
  onUploadCountChange?: (count: number) => void;
}

export default function PhotoUpload({
  label,
  value,
  onChange,
  aspect = "portrait",
  fullWidth = false,
  userId,
  uploadCount = 0,
  onUploadCountChange,
}: PhotoUploadProps) {
  const { t } = useLanguage();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const enforceLimit = Boolean(userId);
  const limitReached = enforceLimit && isPhotoUploadLimitReached(uploadCount);
  const remaining = Math.max(0, MAX_STUDENT_PHOTO_UPLOADS - uploadCount);

  const handleUpload = async (file: File) => {
    if (enforceLimit && userId) {
      const count = await getPhotoUploadCount(userId);
      if (isPhotoUploadLimitReached(count)) {
        onUploadCountChange?.(count);
        setError(t.profile.uploadLimitReached);
        return;
      }
    }

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await parseJsonResponse<{ url?: string; error?: string; details?: string }>(
        response
      );

      if (!response.ok) {
        throw new Error(data.details ?? data.error ?? "Upload failed");
      }

      if (!data.url) {
        throw new Error("Upload failed");
      }

      if (enforceLimit && userId) {
        const nextCount = await recordStudentPhotoUpload(userId);
        onUploadCountChange?.(nextCount);
      }

      onChange(data.url);
    } catch (err) {
      if (err instanceof Error && err.message === "UPLOAD_LIMIT_REACHED") {
        onUploadCountChange?.(MAX_STUDENT_PHOTO_UPLOADS);
        setError(t.profile.uploadLimitReached);
      } else {
        setError(err instanceof Error ? err.message : t.common.error);
      }
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const previewClass = fullWidth
    ? "aspect-[3/4] w-full max-w-sm mx-auto sm:max-w-md"
    : aspect === "square"
      ? "aspect-square w-full max-w-[min(100%,16rem)] mx-auto sm:max-w-none"
      : "aspect-[3/4] w-full max-w-[min(100%,14rem)] mx-auto sm:max-w-none";

  const LabelIcon = aspect === "square" ? Camera : ImageIcon;

  return (
    <div className="flex w-full min-w-0 flex-col space-y-2">
      <IconLabel icon={LabelIcon} className="text-sm sm:text-base">
        {label}
      </IconLabel>

      <button
        type="button"
        onClick={() => !uploading && !limitReached && inputRef.current?.click()}
        disabled={uploading || limitReached}
        aria-label={value ? t.profile.changePhoto : t.profile.uploadPhoto}
        className={`relative touch-manipulation overflow-hidden rounded-xl border-2 border-dashed border-gold/40 bg-paper transition-colors hover:border-gold/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/30 disabled:cursor-not-allowed disabled:opacity-60 ${previewClass}`}
      >
        {value ? (
          <Image
            src={value}
            alt={label}
            fill
            className="object-contain object-center p-1"
            sizes="(max-width: 640px) 80vw, 240px"
          />
        ) : (
          <div className="flex h-full min-h-[140px] flex-col items-center justify-center gap-2 p-4 text-navy/40 sm:min-h-0">
            <Camera className="h-8 w-8 sm:h-10 sm:w-10" />
            <span className="px-2 text-center text-xs sm:text-sm">{t.profile.uploadPhoto}</span>
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80">
            <Loader2 className="h-8 w-8 animate-spin text-gold" />
          </div>
        )}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
        }}
      />

      {enforceLimit && (
        <p className="text-xs leading-relaxed text-navy/50 sm:text-sm">
          {limitReached
            ? t.profile.uploadLimitReached
            : t.profile.uploadsRemaining
                .replace("{remaining}", String(remaining))
                .replace("{max}", String(MAX_STUDENT_PHOTO_UPLOADS))}
        </p>
      )}

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading || limitReached}
        className="flex w-full min-h-11 touch-manipulation items-center justify-center gap-2 rounded-lg border border-gold/40 px-4 py-2.5 text-sm font-medium text-navy transition-colors hover:bg-gold/10 disabled:opacity-50 sm:w-auto sm:min-h-0 sm:py-2"
      >
        <Camera className="h-4 w-4 shrink-0 text-gold" />
        {value ? t.profile.changePhoto : t.profile.uploadPhoto}
      </button>

      {error && <p className="text-sm leading-relaxed text-red-600">{error}</p>}
    </div>
  );
}
