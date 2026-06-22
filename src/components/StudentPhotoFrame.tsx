"use client";

import { useEffect, useState } from "react";
import {
  getStudentInitial,
  getStudentPrimaryPhoto,
  getStudentSecondaryPhoto,
} from "@/lib/students";
import type { Student } from "@/lib/types";
import SafeImage from "@/components/SafeImage";

type StudentPhotoFrameProps = {
  student: Pick<Student, "fullName" | "coverPhotoUrl" | "largePhotoUrl" | "smallPhotoUrl">;
  /** sm = card/grid thumbnails, md = modal */
  insetSize?: "sm" | "md";
  showNameOverlay?: boolean;
  className?: string;
  imageClassName?: string;
};

export default function StudentPhotoFrame({
  student,
  insetSize = "sm",
  showNameOverlay = false,
  className = "",
  imageClassName = "",
}: StudentPhotoFrameProps) {
  const name = student.fullName || "Student";
  const primaryPhoto = getStudentPrimaryPhoto(student);
  const secondaryPhoto = getStudentSecondaryPhoto(student);
  const initial = getStudentInitial(student.fullName);
  const [secondaryBroken, setSecondaryBroken] = useState(false);

  useEffect(() => {
    setSecondaryBroken(false);
  }, [secondaryPhoto]);

  const insetClass =
    insetSize === "md"
      ? "bottom-3 right-3 h-14 w-14 sm:bottom-4 sm:right-4 sm:h-16 sm:w-16 md:h-[4.5rem] md:w-[4.5rem]"
      : "bottom-6 right-2 h-12 w-12 sm:bottom-7 sm:right-2.5 sm:h-14 sm:w-14";

  const insetBorderClass = insetSize === "md" ? "border-2 sm:border-[3px]" : "border-2";

  const initialFallback = (
    <div className="flex h-full w-full items-center justify-center">
      <span className="font-serif text-3xl font-bold text-navy/15 sm:text-4xl">
        {initial}
      </span>
    </div>
  );

  return (
    <div className={`relative overflow-hidden bg-gradient-to-br from-paper to-paper-warm ${className}`}>
      {primaryPhoto ? (
        <SafeImage
          src={primaryPhoto}
          alt={name}
          fill
          className={`object-contain object-center ${imageClassName}`}
          sizes={
            insetSize === "md"
              ? "(max-width: 640px) 100vw, 42vw"
              : "(max-width: 768px) 50vw, 25vw"
          }
          fallback={initialFallback}
        />
      ) : (
        initialFallback
      )}

      {secondaryPhoto && (
        <div className={`absolute z-20 ${insetClass}`} aria-hidden>
          <div
            className={`relative h-full w-full overflow-hidden rounded-full border-white bg-paper shadow-md ring-1 ring-gold/40 ${insetBorderClass}`}
          >
            {secondaryBroken ? (
              <span className="flex h-full w-full items-center justify-center font-serif text-sm font-bold text-navy/40">
                {initial}
              </span>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={secondaryPhoto}
                src={secondaryPhoto}
                alt=""
                className="h-full w-full object-contain object-center"
                loading="lazy"
                decoding="async"
                onError={() => setSecondaryBroken(true)}
              />
            )}
          </div>
        </div>
      )}

      {showNameOverlay && (
        <div className="absolute inset-x-0 bottom-0 z-10 chocolate-overlay px-1.5 pt-7 pb-1.5 sm:px-2 sm:pb-2">
          <p className="line-clamp-2 text-center font-serif text-[10px] font-bold text-white sm:text-xs">
            {name}
          </p>
        </div>
      )}
    </div>
  );
}
