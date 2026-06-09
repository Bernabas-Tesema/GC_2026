"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Images } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  EVENT_COVER_IMAGE,
  EVENT_GALLERY_PHOTOS,
  isEventSlug,
} from "@/lib/events";
import BookFooter from "@/components/BookFooter";

export default function EventGalleryPage() {
  const params = useParams();
  const slugParam = params.slug;
  const slug = typeof slugParam === "string" ? slugParam : slugParam?.[0];
  const { t } = useLanguage();

  if (!slug || !isEventSlug(slug)) {
    notFound();
  }

  const event = t.home.events.find((e) => e.slug === slug);
  if (!event) {
    notFound();
  }

  const photos = EVENT_GALLERY_PHOTOS[slug];

  return (
    <div className="flex min-h-[calc(100dvh-4rem)] w-full flex-col">
      <motion.header
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full border-b border-gold/25 bg-gradient-to-r from-navy via-navy-light to-burgundy px-4 py-5 text-white sm:px-6 md:px-8 md:py-6"
      >
        <Link
          href="/book"
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-gold-light hover:text-gold hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          {t.events.backToHome}
        </Link>
        <div className="text-center">
          <h1 className="font-serif text-2xl font-bold md:text-3xl">{event.name}</h1>
          <p className="mt-1 text-sm text-white/75 md:text-base">{event.desc}</p>
        </div>
      </motion.header>

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="flex w-full flex-1 flex-col"
      >
        <div className="flex w-full items-center gap-2 border-b border-gold/20 bg-white/60 px-4 py-3 sm:px-6 md:px-8">
          <Images className="h-5 w-5 shrink-0 text-gold" />
          <h2 className="font-serif text-lg font-bold text-navy">{t.events.galleryTitle}</h2>
        </div>

        <div className="w-full flex-1 px-2 py-4 sm:px-4 md:px-6 md:py-6">
          {photos.length > 0 ? (
            <div className="grid w-full grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
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
              coverSrc={EVENT_COVER_IMAGE(slug)}
              noPhotosLabel={t.events.noPhotos}
              addPhotosHint={t.events.addPhotosHint.replace("{slug}", slug)}
            />
          )}
        </div>
      </motion.section>

      <BookFooter />
    </div>
  );
}

function EventGalleryPlaceholder({
  eventName,
  coverSrc,
  noPhotosLabel,
  addPhotosHint,
}: {
  eventName: string;
  coverSrc: string;
  noPhotosLabel: string;
  addPhotosHint: string;
}) {
  const [coverError, setCoverError] = useState(false);

  return (
    <div className="flex min-h-[50vh] w-full flex-col justify-center space-y-4">
      <div className="relative aspect-[21/9] w-full overflow-hidden border-y border-gold/20 bg-white">
        {!coverError ? (
          <Image
            src={coverSrc}
            alt={eventName}
            fill
            className="object-cover object-center"
            sizes="100vw"
            onError={() => setCoverError(true)}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-6 text-center">
            <Images className="h-12 w-12 text-navy/25" />
            <p className="font-serif text-xl font-bold text-navy/40 md:text-2xl">
              {eventName}
            </p>
          </div>
        )}
      </div>
      <p className="text-center text-sm text-navy/50">{noPhotosLabel}</p>
      <p className="text-center font-mono text-xs text-navy/35">{addPhotosHint}</p>
    </div>
  );
}
