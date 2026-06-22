"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Camera, ImageIcon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import IconLabel from "@/components/IconLabel";

interface PhotoUploadProps {
  label: string;
  /** Preview URL — existing Cloudinary link or a local blob URL. */
  previewUrl: string;
  onPick: (file: File, previewUrl: string) => void;
  aspect?: "square" | "portrait";
  fullWidth?: boolean;
  disabled?: boolean;
}

export default function PhotoUpload({
  label,
  previewUrl,
  onPick,
  aspect = "portrait",
  fullWidth = false,
  disabled = false,
}: PhotoUploadProps) {
  const { t } = useLanguage();
  const inputRef = useRef<HTMLInputElement>(null);
  const blobUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
      }
    };
  }, []);

  const handleFile = (file: File) => {
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
    }
    const preview = URL.createObjectURL(file);
    blobUrlRef.current = preview;
    onPick(file, preview);
    if (inputRef.current) inputRef.current.value = "";
  };

  const previewClass = fullWidth
    ? "aspect-[3/4] w-full max-w-sm mx-auto sm:max-w-md"
    : aspect === "square"
      ? "aspect-square w-full max-w-[min(100%,16rem)] mx-auto sm:max-w-none"
      : "aspect-[3/4] w-full max-w-[min(100%,14rem)] mx-auto sm:max-w-none";

  const LabelIcon = aspect === "square" ? Camera : ImageIcon;
  const isBlob = previewUrl.startsWith("blob:");

  return (
    <div className="flex w-full min-w-0 flex-col space-y-2">
      <IconLabel icon={LabelIcon} className="text-sm sm:text-base">
        {label}
      </IconLabel>

      <button
        type="button"
        onClick={() => !disabled && inputRef.current?.click()}
        disabled={disabled}
        aria-label={previewUrl ? t.profile.changePhoto : t.profile.uploadPhoto}
        className={`relative touch-manipulation overflow-hidden rounded-xl border-2 border-dashed border-gold/40 bg-paper transition-colors hover:border-gold/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/30 disabled:cursor-not-allowed disabled:opacity-60 ${previewClass}`}
      >
        {previewUrl ? (
          isBlob ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt={label}
              className="absolute inset-0 h-full w-full object-contain object-center p-1"
            />
          ) : (
            <Image
              src={previewUrl}
              alt={label}
              fill
              className="object-contain object-center p-1"
              sizes="(max-width: 640px) 80vw, 240px"
            />
          )
        ) : (
          <div className="flex h-full min-h-[140px] flex-col items-center justify-center gap-2 p-4 text-navy/40 sm:min-h-0">
            <Camera className="h-8 w-8 sm:h-10 sm:w-10" />
            <span className="px-2 text-center text-xs sm:text-sm">{t.profile.uploadPhoto}</span>
          </div>
        )}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        disabled={disabled}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      <button
        type="button"
        onClick={() => !disabled && inputRef.current?.click()}
        disabled={disabled}
        className="flex w-full min-h-11 touch-manipulation items-center justify-center gap-2 rounded-lg border border-gold/40 px-4 py-2.5 text-sm font-medium text-navy transition-colors hover:bg-gold/10 disabled:opacity-50 sm:w-auto sm:min-h-0 sm:py-2"
      >
        <Camera className="h-4 w-4 shrink-0 text-gold" />
        {previewUrl ? t.profile.changePhoto : t.profile.uploadPhoto}
      </button>
    </div>
  );
}
