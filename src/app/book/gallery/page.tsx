"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Images } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getAllMedia, getSiteGalleryPhotos } from "@/lib/media";
import PageHero from "@/components/ui/PageHero";

function GalleryPhotoCard({
  src,
  alt,
  index,
}: {
  src: string;
  alt: string;
  index: number;
}) {
  const [error, setError] = useState(false);
  if (error) return null;

  return (
    <motion.figure
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.45, ease: "easeOut" }}
      className="group card-box rounded-lg transition-all hover:-translate-y-0.5"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-gradient-to-br from-paper to-paper-warm">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 25vw, 20vw"
          onError={() => setError(true)}
        />
        <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/5" />
      </div>
    </motion.figure>
  );
}

export default function PhotoGalleryPage() {
  const { t } = useLanguage();
  const [photos, setPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllMedia()
      .then((media) => setPhotos(getSiteGalleryPhotos(media)))
      .catch(() => setPhotos([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-2">
      <PageHero title={t.photoGallery.title} icon={Images} compact />

      <div>
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold border-t-transparent" />
          </div>
        ) : photos.length === 0 ? (
          <div className="py-10 text-center">
            <Images className="mx-auto mb-3 h-8 w-8 text-gold/35" />
            <p className="font-serif text-lg text-navy/40">{t.photoGallery.noPhotos}</p>
            <p className="mt-2 text-sm text-navy/35">{t.photoGallery.addPhotosHint}</p>
          </div>
        ) : (
          <div className="max-h-[min(calc(100dvh-9.5rem),900px)] overflow-y-auto overscroll-y-contain px-1 sm:px-2">
            <div className="grid grid-cols-4 gap-x-2 gap-y-2 pb-2 sm:gap-x-3 sm:gap-y-3 md:gap-x-4 md:gap-y-4">
              {photos.map((src, i) => (
                <GalleryPhotoCard
                  key={`${src}-${i}`}
                  src={src}
                  alt={`${t.photoGallery.title} ${i + 1}`}
                  index={i}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
