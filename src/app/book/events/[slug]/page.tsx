"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Images, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  EVENT_GALLERY_PHOTOS,
  isEventSlug,
} from "@/lib/events";
import { getAllMedia } from "@/lib/media";

function EventGalleryPhoto({
  src,
  alt,
  index,
  onSelect,
}: {
  src: string;
  alt: string;
  index: number;
  onSelect: () => void;
}) {
  const [error, setError] = useState(false);
  if (error) return null;

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.04 }}
      onClick={onSelect}
      className="group card-box cursor-zoom-in rounded-xl text-left"
      aria-label={alt}
    >
      <div className="relative aspect-square w-full overflow-hidden">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          onError={() => setError(true)}
        />
      </div>
    </motion.button>
  );
}

function EventPhotoLightbox({
  photos,
  index,
  altPrefix,
  onClose,
  onPrev,
  onNext,
}: {
  photos: string[];
  index: number;
  altPrefix: string;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, onPrev, onNext]);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  const src = photos[index];
  const hasMultiple = photos.length > 1;

  const navButtonClass =
    "z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/90 font-serif text-xl leading-none text-navy shadow-md ring-1 ring-navy/10 transition-all hover:scale-105 hover:bg-white sm:static sm:h-12 sm:w-12 sm:translate-y-0 sm:text-3xl";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[rgba(15,31,61,0.94)] backdrop-blur-md sm:p-4"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-[max(0.75rem,env(safe-area-inset-top))] right-3 z-10 rounded-full bg-white/90 p-2 shadow-md ring-1 ring-navy/10 transition-all hover:bg-white sm:top-4 sm:right-4"
        aria-label="Close"
      >
        <X className="h-5 w-5 text-navy" />
      </button>

      <div
        className="relative flex h-full w-full items-center justify-center sm:h-auto sm:max-w-[min(96vw,1180px)] sm:gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        {hasMultiple && (
          <button
            type="button"
            onClick={onPrev}
            className={`absolute top-1/2 left-2 -translate-y-1/2 sm:left-auto ${navButtonClass}`}
            aria-label="Previous photo"
          >
            &lt;
          </button>
        )}

        <motion.div
          key={src}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.2 }}
          className="relative h-full w-full sm:h-[min(85dvh,820px)] sm:min-w-0 sm:flex-1"
        >
          <Image
            src={src}
            alt={`${altPrefix} ${index + 1}`}
            fill
            className="object-contain object-center"
            sizes="100vw"
            priority
          />
        </motion.div>

        {hasMultiple && (
          <button
            type="button"
            onClick={onNext}
            className={`absolute top-1/2 right-2 -translate-y-1/2 sm:right-auto ${navButtonClass}`}
            aria-label="Next photo"
          >
            &gt;
          </button>
        )}
      </div>

      {hasMultiple && (
        <p className="pointer-events-none absolute bottom-[max(0.75rem,env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 rounded-full bg-black/35 px-3 py-1 text-[11px] font-medium text-white/90 sm:bottom-4 sm:bg-white/90 sm:text-xs sm:text-navy/70 sm:shadow-sm">
          {index + 1} / {photos.length}
        </p>
      )}
    </motion.div>
  );
}

export default function EventGalleryPage() {
  const params = useParams();
  const slugParam = params.slug;
  const slug = typeof slugParam === "string" ? slugParam : slugParam?.[0];
  const { t } = useLanguage();
  const [media, setMedia] = useState<Record<string, string>>({});
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    getAllMedia().then(setMedia).catch(() => {});
  }, []);

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  if (!slug || !isEventSlug(slug)) notFound();
  const event = t.home.events.find((e) => e.slug === slug);
  if (!event) notFound();

  // Build photo list: Firestore slots first, fallback to static
  const staticPhotos = EVENT_GALLERY_PHOTOS[slug];
  const firestorePhotos = Object.entries(media)
    .filter(([k]) => k.startsWith(`event-gallery:${slug}:`))
    .sort(([a], [b]) => {
      const ai = parseInt(a.split(":")[2] ?? "0");
      const bi = parseInt(b.split(":")[2] ?? "0");
      return ai - bi;
    })
    .map(([, url]) => url);

  const galleryPhotos =
    firestorePhotos.length > 0 ? firestorePhotos : staticPhotos;

  const coverSrc = media[`event-cover:${slug}`] || event.image;
  const photos = coverSrc
    ? [coverSrc, ...galleryPhotos.filter((src) => src !== coverSrc)]
    : galleryPhotos;

  const showPrev = () => {
    setLightboxIndex((current) => {
      if (current === null || photos.length === 0) return current;
      return (current - 1 + photos.length) % photos.length;
    });
  };

  const showNext = () => {
    setLightboxIndex((current) => {
      if (current === null || photos.length === 0) return current;
      return (current + 1) % photos.length;
    });
  };

  return (
    <div className="flex w-full flex-col">
      <motion.header
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="chocolate-box w-full border-b border-white/10 px-3 py-1 sm:px-4"
      >
        <Link
          href="/book"
          className="mb-0.5 inline-flex items-center gap-1 text-[10px] font-medium text-amber-200 hover:text-white hover:underline sm:text-xs"
        >
          <ArrowLeft className="h-3 w-3" />
          {t.events.backToHome}
        </Link>
        <div className="text-center">
          <h1 className="font-serif text-sm font-bold leading-tight md:text-base">{event.name}</h1>
          <p className="mt-0.5 text-[10px] leading-snug text-white/75 md:text-xs">{event.desc}</p>
        </div>
      </motion.header>

      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.03 }}
        className="flex w-full flex-1 flex-col"
      >
        <div className="filter-box flex w-full items-center gap-1.5 rounded-none border-x-0 border-t-0 px-3 py-1 sm:px-4">
          <h2 className="min-w-0 flex-1 font-serif text-xs font-bold text-white">
            {t.events.galleryTitle}
          </h2>
          <Images className="h-3.5 w-3.5 shrink-0 text-amber-200" aria-hidden />
        </div>

        <div className="w-full flex-1 px-4 py-3 sm:px-6 md:px-8 md:py-4">
          {photos.length > 0 ? (
            <div className="grid w-full grid-cols-2 gap-x-5 gap-y-5 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-6 md:grid-cols-4 md:gap-x-8 md:gap-y-7 lg:grid-cols-5">
              {photos.map((src, i) => (
                <EventGalleryPhoto
                  key={`${src}-${i}`}
                  src={src}
                  alt={`${event.name} ${i + 1}`}
                  index={i}
                  onSelect={() => setLightboxIndex(i)}
                />
              ))}
            </div>
          ) : (
            <p className="py-12 text-center text-sm text-navy/45">{t.events.noPhotos}</p>
          )}
        </div>
      </motion.section>

      <AnimatePresence>
        {lightboxIndex !== null && photos[lightboxIndex] && (
          <EventPhotoLightbox
            photos={photos}
            index={lightboxIndex}
            altPrefix={event.name}
            onClose={closeLightbox}
            onPrev={showPrev}
            onNext={showNext}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
