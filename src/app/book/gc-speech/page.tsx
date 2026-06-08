"use client";

import { motion } from "framer-motion";
import SafeImage from "@/components/SafeImage";
import { useLanguage } from "@/contexts/LanguageContext";
import BookFooter from "@/components/BookFooter";
import { SITE_BRAND_NAME } from "@/lib/constants";

export default function GCSpeechPage() {
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto max-w-3xl"
    >
      <div className="book-page overflow-hidden rounded-2xl border border-gold/30 book-shadow">
        {/* Header */}
        <div className="bg-gradient-to-r from-navy to-burgundy px-8 py-10 text-center">
          <div className="relative mx-auto mb-6 h-32 w-32 overflow-hidden rounded-full border-4 border-gold shadow-xl">
            <SafeImage
              src="/gc-benhanan.jpg"
              alt="GC ቤንሃናን"
              fill
              className="object-cover"
              sizes="128px"
              fallback={
                <div className="flex h-full items-center justify-center bg-navy-light font-serif text-4xl text-gold">
                  GC
                </div>
              }
            />
          </div>
          <h1 className="font-serif text-3xl font-bold text-white">
            {t.gcSpeech.title}
          </h1>
          <p className="mt-2 text-white/70">{t.gcSpeech.subtitle}</p>
        </div>

        {/* Speech content */}
        <div className="relative px-8 py-10 md:px-12">
          <div className="absolute top-6 left-6 font-serif text-6xl text-gold/20">
            &ldquo;
          </div>
          <div className="relative space-y-4">
            {t.gcSpeech.speech.split("\n\n").map((paragraph, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                className={`leading-relaxed text-navy/80 ${
                  i === t.gcSpeech.speech.split("\n\n").length - 1
                    ? "font-serif text-lg font-semibold text-navy"
                    : "text-base"
                }`}
              >
                {paragraph}
              </motion.p>
            ))}
          </div>
          <div className="absolute right-6 bottom-6 font-serif text-6xl text-gold/20">
            &rdquo;
          </div>
        </div>

        {/* Decorative footer */}
        <div className="border-t border-gold/20 bg-white/50 px-8 py-4 text-center">
          <p className="text-sm text-navy/40">{SITE_BRAND_NAME}</p>
        </div>
      </div>

      <BookFooter />
    </motion.div>
  );
}
