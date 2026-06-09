"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ChevronRight,
  Quote,
  Sparkles,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import BookFooter from "@/components/BookFooter";

const LEADERS = [
  {
    titleKey: "gcCommitteeTitle" as const,
    nameKey: "berketName" as const,
    roleKey: "berketRole" as const,
    speechKey: "berketSpeech" as const,
    photo: "/leaders/berket.jpg",
    initials: "EB",
    accent: "burgundy" as const,
    photoSide: "left" as const,
    delay: 0.04,
  },
  {
    titleKey: "leaderTitle" as const,
    nameKey: "semagagnName" as const,
    roleKey: "semagagnRole" as const,
    speechKey: "semagagnSpeech" as const,
    photo: "/leaders/semagegn.jpg",
    initials: "S",
    accent: "navy" as const,
    photoSide: "right" as const,
    delay: 0.1,
  },
];

export default function BookHomePage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-full w-full py-2 md:py-4">
      <div className="w-full space-y-10">
        <div className="space-y-8">
          {LEADERS.map((leader) => (
            <LeaderMessageCard
              key={leader.nameKey}
              title={t.home[leader.titleKey]}
              name={t.home[leader.nameKey]}
              role={t.home[leader.roleKey]}
              speech={t.home[leader.speechKey]}
              photo={leader.photo}
              initials={leader.initials}
              accent={leader.accent}
              photoSide={leader.photoSide}
              delay={leader.delay}
            />
          ))}
        </div>

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
          className="section-card w-full"
        >
          <div className="section-header flex items-center gap-3">
            <Sparkles className="h-5 w-5 shrink-0 text-gold" />
            <div>
              <h2 className="font-serif text-lg font-bold">{t.home.eventsTitle}</h2>
              <p className="text-xs text-white/70">{t.home.eventsSubtitle}</p>
            </div>
          </div>
          <div className="section-body grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {t.home.events.map((event, i) => (
              <EventPhotoCard key={event.slug} event={event} index={i} viewGallery={t.events.viewGallery} />
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="section-card w-full overflow-hidden"
        >
          <div className="section-header bg-gradient-to-r from-burgundy to-navy text-center">
            <h2 className="font-serif text-lg font-bold">
              {t.home.gcCommitteePhotoTitle}
            </h2>
          </div>
          <GcCommitteePhoto
            label={t.home.gcCommitteePhotoTitle}
            imageSrc="/gc-committee.jpg"
          />
        </motion.section>

        <BookFooter includeSocials />
      </div>
    </div>
  );
}

function LeaderMessageCard({
  title,
  name,
  role,
  speech,
  photo,
  initials,
  accent,
  photoSide,
  delay,
}: {
  title: string;
  name: string;
  role: string;
  speech: string;
  photo: string;
  initials: string;
  accent: "navy" | "burgundy";
  photoSide: "left" | "right";
  delay: number;
}) {
  const headerGradient =
    accent === "burgundy"
      ? "from-burgundy via-burgundy/90 to-navy"
      : "from-navy via-navy-light to-burgundy/80";

  const photoFirst = photoSide === "left";

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45 }}
      className="section-card w-full overflow-hidden"
    >
      <div className={`section-header bg-gradient-to-r ${headerGradient}`}>
        <div className="flex items-center gap-2">
          <Quote className="h-4 w-4 shrink-0 text-gold-light" />
          <p className="text-[11px] font-semibold tracking-[0.18em] text-gold-light uppercase">
            {title}
          </p>
        </div>
      </div>

      <div
        className={`section-body flex w-full flex-col gap-4 py-4 ${
          photoFirst ? "md:flex-row" : "md:flex-row-reverse"
        } md:items-start md:gap-6`}
      >
        <LeaderPhoto
          name={name}
          role={role}
          photo={photo}
          initials={initials}
        />

        <div className="min-w-0 flex-1">
          <h2 className="font-serif text-xl font-bold text-navy sm:text-2xl">{name}</h2>
          <p className="mt-0.5 text-sm font-medium text-gold">{role}</p>
          <div className="mt-1 h-px w-12 bg-gold/60" />
          <div className="mt-5 space-y-4">
            {speech.split("\n\n").map((paragraph, i) => (
              <p
                key={i}
                className="text-sm leading-[1.75] text-navy/75 md:text-[15px]"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function LeaderPhoto({
  name,
  role,
  photo,
  initials,
}: {
  name: string;
  role: string;
  photo: string;
  initials: string;
}) {
  const [error, setError] = useState(false);

  return (
    <div className="mx-auto shrink-0 md:mx-0">
      <div className="relative">
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-gold/60 via-gold/30 to-gold/10" />
        <div className="relative h-32 w-32 overflow-hidden rounded-2xl border-2 border-white shadow-lg sm:h-36 sm:w-36 md:h-40 md:w-40">
          {!error ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photo}
              alt={name}
              className="h-full w-full object-contain object-top"
              onError={() => setError(true)}
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center border border-dashed border-gold/30 bg-white p-4 text-center">
              <span className="font-serif text-4xl font-bold text-navy/25">
                {initials}
              </span>
              <p className="mt-2 text-[10px] leading-tight text-navy/45">
                Add photo:
                <br />
                <span className="font-mono text-navy/35">{photo}</span>
              </p>
            </div>
          )}
        </div>
      </div>
      <p className="mt-3 text-center text-xs text-navy/45 md:hidden">{role}</p>
    </div>
  );
}

type EventCard = {
  slug: string;
  name: string;
  desc: string;
  image: string;
};

function EventPhotoCard({
  event,
  index,
  viewGallery,
}: {
  event: EventCard;
  index: number;
  viewGallery: string;
}) {
  const [imgError, setImgError] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.04 * index }}
    >
      <Link
        href={`/book/events/${event.slug}`}
        className="group block overflow-hidden rounded-xl border border-gold/20 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
      >
        <div className="relative aspect-[2/1] overflow-hidden bg-white">
          {!imgError ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={event.image}
              alt={event.name}
              className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center border border-dashed border-gold/30 bg-white px-4 text-center">
              <span className="font-serif text-lg font-bold text-navy/35">
                {event.name}
              </span>
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/85 via-navy/40 to-transparent pt-10" />
          <h3 className="absolute right-3 bottom-3 left-3 font-serif text-base font-bold text-white drop-shadow-sm">
            {event.name}
          </h3>
        </div>
        <div className="flex items-center justify-between gap-2 px-3 py-2.5">
          <p className="text-xs leading-relaxed text-navy/65">{event.desc}</p>
          <span className="inline-flex shrink-0 items-center gap-0.5 text-xs font-semibold text-gold">
            {viewGallery}
            <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </Link>
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
    <div className="relative aspect-[32/9] w-full overflow-hidden bg-white">
      {!error ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageSrc}
          alt={label}
          className="h-full w-full object-cover object-[center_25%]"
          onError={() => setError(true)}
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 border border-dashed border-gold/30 bg-white p-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed border-gold/40 bg-white">
            <span className="font-serif text-2xl font-bold text-navy/25">GC</span>
          </div>
          <p className="text-sm font-medium text-navy/50">{label}</p>
          <p className="text-xs text-navy/35">Add photo: public/gc-committee.jpg</p>
        </div>
      )}
    </div>
  );
}
