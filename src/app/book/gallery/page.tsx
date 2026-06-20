"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Images } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getAllMedia, getSiteGalleryPhotos } from "@/lib/media";
import PageHero from "@/components/ui/PageHero";

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
    <div className="space-y-5">
      <PageHero
        title={t.photoGallery.title}
        subtitle={t.photoGallery.subtitle}
        icon={Images}
        compact
      />

      <div className="px-3 sm:px-5 md:px-8">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold border-t-transparent" />
          </div>
        ) : photos.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl py-16 text-center"
          >
            <Images className="mx-auto mb-3 h-10 w-10 text-gold/40" />
            <p className="font-serif text-lg text-navy/45">{t.photoGallery.noPhotos}</p>
            <p className="mt-2 text-sm text-navy/35">{t.photoGallery.addPhotosHint}</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 gap-x-5 gap-y-5 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-6 md:grid-cols-4 md:gap-x-8 md:gap-y-7 lg:grid-cols-5">
            {photos.map((src, i) => (
              <motion.figure
                key={`${src}-${i}`}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.03 }}
                className="overflow-hidden rounded-xl border border-gold/20 bg-white shadow-sm"
              >
                <div className="relative aspect-square w-full overflow-hidden">
                  <Image
                    src={src}
                    alt={`${t.photoGallery.title} ${i + 1}`}
                    fill
                    className="object-cover object-center transition-transform duration-500 hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  />
                </div>
              </motion.figure>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
