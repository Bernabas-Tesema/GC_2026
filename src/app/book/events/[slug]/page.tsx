"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Images } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  EVENT_GALLERY_PHOTOS,
  isEventSlug,
} from "@/lib/events";
import { getAllMedia } from "@/lib/media";

export default function EventGalleryPage() {
  const params = useParams();
  const slugParam = params.slug;
  const slug = typeof slugParam === "string" ? slugParam : slugParam?.[0];
  const { t } = useLanguage();
  const [media, setMedia] = useState<Record<string, string>>({});

  useEffect(() => {
    getAllMedia().then(setMedia).catch(() => {});
  }, []);

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

  const photos = firestorePhotos.length > 0 ? firestorePhotos : staticPhotos;

  // Cover: Firestore first, fallback to static file
  const coverSrc = media[`event-cover:${slug}`];

  return (
    <div className="flex w-full flex-col">
      <motion.header
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full border-b border-gold/25 bg-gradient-to-r from-navy via-navy-light to-burgundy px-3 py-1.5 text-white sm:px-4"
      >
        <Link
          href="/book"
          className="mb-0.5 inline-flex items-center gap-1 text-[10px] font-medium text-gold-light hover:text-gold hover:underline sm:text-xs"
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
        <div className="flex w-full items-center gap-1 border-b border-gold/20 bg-white/60 px-3 py-1 sm:px-4">
          <Images className="h-3.5 w-3.5 shrink-0 text-gold" />
          <h2 className="font-serif text-xs font-bold text-navy">{t.events.galleryTitle}</h2>
        </div>

        <div className="w-full flex-1 px-4 py-3 sm:px-6 md:px-8 md:py-4">
          {photos.length > 0 ? (
            <div className="grid w-full grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3 sm:gap-x-8 sm:gap-y-5 md:grid-cols-4 md:gap-x-10 md:gap-y-6 lg:grid-cols-5 lg:gap-x-11 lg:gap-y-7 xl:grid-cols-6 xl:gap-x-12">
              {photos.map((src, i) => (
                <motion.figure
                  key={src}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="overflow-hidden rounded-lg border border-gold/20 bg-white shadow-sm"
                >
                  <div className="relative aspect-square w-full overflow-hidden">
                    <Image
                      src={src}
                      alt={`${event.name} ${i + 1}`}
                      fill
                      className="object-cover object-center transition-transform hover:scale-105"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    />
                  </div>
                </motion.figure>
              ))}
            </div>
          ) : (
            <EventGalleryPlaceholder
              eventName={event.name}
              coverSrc={coverSrc}
            />
          )}
        </div>
      </motion.section>
    </div>
  );
}

function EventGalleryPlaceholder({
  eventName,
  coverSrc,
}: {
  eventName: string;
  coverSrc?: string;
}) {
  const [coverError, setCoverError] = useState(false);
  const showCover = Boolean(coverSrc) && !coverError;

  if (!showCover) return null;

  return (
    <div className="w-full">
      <div className="relative aspect-[21/9] w-full overflow-hidden border-y border-gold/20 bg-white">
        <Image
          src={coverSrc!}
          alt={eventName}
          fill
          className="object-cover object-center"
          sizes="100vw"
          onError={() => setCoverError(true)}
        />
      </div>
    </div>
  );
}
