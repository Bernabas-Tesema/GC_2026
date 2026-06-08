"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Facebook,
  Instagram,
  MessageCircle,
  Sparkles,
  Youtube,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import BookFooter from "@/components/BookFooter";

const socialLinks = [
  { icon: Facebook, label: "Facebook", href: "#" },
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Youtube, label: "YouTube", href: "#" },
  { icon: MessageCircle, label: "Telegram", href: "#" },
];

export default function BookHomePage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-full bg-white px-2 py-4 md:px-4 md:py-5">
      <div className="mx-auto max-w-4xl space-y-8 bg-white">
        <SpeechSection
          title={t.home.gcCommitteeTitle}
          name={t.home.berketName}
          role={t.home.berketRole}
          speech={t.home.berketSpeech}
          delay={0.04}
        />
        <SpeechSection
          title={t.home.leaderTitle}
          name={t.home.semagagnName}
          role={t.home.semagagnRole}
          speech={t.home.semagagnSpeech}
          delay={0.08}
        />

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="border-t border-navy/10 pt-8"
        >
          <div className="mb-5 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-gold" />
            <div>
              <h2 className="font-serif text-lg font-bold text-navy">
                {t.home.programsTitle}
              </h2>
              <p className="text-xs text-navy/55">{t.home.programsSubtitle}</p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {t.home.programs.map((program, i) => (
              <ProgramPhotoCard key={i} program={program} index={i} />
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
          className="border-t border-navy/10 pt-8 text-center"
        >
          <h2 className="font-serif text-lg font-bold text-navy">
            {t.home.socialsTitle}
          </h2>
          <p className="mt-1 text-xs text-navy/55">{t.home.socialsSubtitle}</p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            {socialLinks.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="nav-btn-hover inline-flex items-center gap-2 rounded-full border border-gold/40 px-5 py-2.5 text-sm font-medium text-navy hover:bg-gold/10"
              >
                <Icon className="h-4 w-4 text-gold" />
                {label}
              </a>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="border-t border-navy/10 pt-8"
        >
          <h2 className="mb-4 text-center font-serif text-lg font-bold text-navy">
            {t.home.gcCommitteePhotoTitle}
          </h2>
          <GcCommitteePhoto
            label={t.home.gcCommitteePhotoTitle}
            imageSrc="/gc-committee.jpg"
          />
        </motion.section>

        <BookFooter />
      </div>
    </div>
  );
}

function SpeechSection({
  title,
  name,
  role,
  speech,
  delay,
}: {
  title: string;
  name: string;
  role: string;
  speech: string;
  delay: number;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="border-b border-navy/10 pb-8"
    >
      <p className="text-[10px] font-semibold tracking-wider text-gold uppercase">
        {title}
      </p>
      <h2 className="mt-1 font-serif text-xl font-bold text-navy">{name}</h2>
      <p className="text-sm text-navy/55">{role}</p>
      <div className="mt-4 space-y-3">
        {speech.split("\n\n").map((paragraph, i) => (
          <p key={i} className="text-sm leading-relaxed text-navy/75">
            {paragraph}
          </p>
        ))}
      </div>
    </motion.section>
  );
}

type Program = {
  season: string;
  name: string;
  desc: string;
  image: string;
  color: string;
};

function ProgramPhotoCard({
  program,
  index,
}: {
  program: Program;
  index: number;
}) {
  const [imgError, setImgError] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.04 * index }}
      className="group overflow-hidden rounded-lg"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
        {!imgError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={program.image}
            alt={program.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div
            className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${program.color}`}
          >
            <span className="font-serif text-2xl font-bold text-white/90">
              {program.season}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent" />
        <span className="absolute top-3 left-3 rounded-full bg-gold px-3 py-1 text-xs font-bold text-navy">
          {program.season}
        </span>
        <h3 className="absolute right-3 bottom-3 left-3 font-serif text-base font-bold text-white">
          {program.name}
        </h3>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-navy/65">{program.desc}</p>
    </motion.article>
  );
}

function GcCommitteePhoto({
  label,
  imageSrc,
}: {
  label: string;
  imageSrc: string;
}) {
  const [error, setError] = useState(false);

  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg bg-navy/5">
      {!error ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageSrc}
          alt={label}
          className="h-full w-full object-cover"
          onError={() => setError(true)}
        />
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-2 bg-navy/5 p-8 text-center">
          <span className="font-serif text-2xl font-bold text-navy/30">GC</span>
          <p className="text-sm text-navy/45">{label}</p>
        </div>
      )}
    </div>
  );
}
