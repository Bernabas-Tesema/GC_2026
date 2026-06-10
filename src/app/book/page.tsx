"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ChevronRight,
  Quote,
  Sparkles,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getAllMedia } from "@/lib/media";
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
  const [media, setMedia] = useState<Record<string, string>>({});

  useEffect(() => {
    getAllMedia().then(setMedia).catch(() => {});
  }, []);

  // GC committee photos: Firestore first, fallback to static
  const gcPhoto1 = media["gc-committee:1"] || "/gc-committee.jpg";
  const gcPhoto2 = media["gc-committee:2"] || "/gc-committe-2.jpg";

  return (
    <div className="min-h-full w-full py-4 md:py-6">
      <div className="w-full space-y-12">
        <div className="space-y-10">
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
          <div className="section-body grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-7">
            {t.home.events.map((event, i) => (
              <EventPhotoCard key={event.slug} event={event} index={i} viewGallery={t.events.viewGallery} media={media} />
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="section-card w-full overflow-hidden"
        >
          <div
            className="section-header text-center"
            style={{ background: "linear-gradient(135deg, #2563eb 0%, #1e3a8a 60%, #0f172a 100%)" }}
          >
            <h2 className="font-serif text-lg font-bold">
              {t.home.gcCommitteePhotoTitle}
            </h2>
          </div>

          <div className="section-body grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
            <GcCommitteePhoto label="GC Committee 2026" imageSrc={gcPhoto1} />
            <GcCommitteePhoto label="GC Committee 2026" imageSrc={gcPhoto2} />
          </div>
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
  const photoFirst = photoSide === "left";

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45 }}
      className="section-card w-full overflow-hidden"
    >
      <div
        className="section-header"
        style={{
          background:
            accent === "burgundy"
              ? "linear-gradient(135deg, #2563eb 0%, #1e3a8a 50%, #0f172a 100%)"
              : "linear-gradient(135deg, #0f172a 0%, #1e3a8a 55%, #2563eb 100%)",
        }}
      >
        <div className="flex items-center gap-2">
          <Quote className="h-4 w-4 shrink-0 text-gold-light" />
          <p className="text-[11px] font-semibold tracking-[0.18em] text-gold-light uppercase">
            {title}
          </p>
        </div>
      </div>

      <div
        className={`section-body flex w-full flex-col gap-5 py-5 ${
          photoFirst ? "md:flex-row" : "md:flex-row-reverse"
        } md:items-start md:gap-8`}
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
        <div className="absolute -inset-1 rounded-2xl bg-linear-to-br from-gold/60 via-gold/30 to-gold/10" />
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
  media,
}: {
  event: EventCard;
  index: number;
  viewGallery: string;
  media: Record<string, string>;
}) {
  const [imgError, setImgError] = useState(false);
  // Use Firestore cover if available, fallback to static event.image
  const imageSrc = media[`event-cover:${event.slug}`] || event.image;

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.04 * index }}
    >
      <Link
        href={`/book/events/${event.slug}`}
        className="group block overflow-hidden rounded-2xl border border-gold/20 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-gold/40"
      >
        <div className="relative aspect-2/1 overflow-hidden bg-white">
          {!imgError ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageSrc}
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
          <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-navy/85 via-navy/40 to-transparent pt-10" />
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
    <div className="overflow-hidden rounded-xl border border-gold/20 shadow-sm">
      <div className="w-full bg-paper">
        {!error ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageSrc}
            alt={label}
            className="h-auto w-full object-contain transition-transform duration-500 hover:scale-[1.02]"
            onError={() => setError(true)}
          />
        ) : (
          <div className="flex min-h-48 flex-col items-center justify-center gap-3 border border-dashed border-gold/30 bg-paper p-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-dashed border-gold/40">
              <span className="font-serif text-xl font-bold text-navy/25">GC</span>
            </div>
            <p className="text-sm font-medium text-navy/45">{label}</p>
            <p className="font-mono text-[10px] text-navy/30">{imageSrc}</p>
          </div>
        )}
      </div>
    </div>
  );
}
