"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MessageSquareQuote, Sparkles, Users, UsersRound } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getAllMedia } from "@/lib/media";
import BookFooter from "@/components/BookFooter";
import PageHero from "@/components/ui/PageHero";

type HomeSectionTone = "paper" | "white" | "warm" | "navy";

function HomeSection({
  children,
  tone = "paper",
}: {
  children: React.ReactNode;
  tone?: HomeSectionTone;
}) {
  return (
    <section className={`home-section home-section-${tone}`}>
      <div className="home-section-inner">{children}</div>
    </section>
  );
}

export default function BookHomePage() {
  const { t } = useLanguage();
  const [media, setMedia] = useState<Record<string, string>>({});

  useEffect(() => {
    getAllMedia().then(setMedia).catch(() => {});
  }, []);

  const gcPhoto = media["gc-committee:1"] || "/gc-committee.jpg";
  const berketPhoto = media["leaders:2"] || "/bek.JPG";

  return (
    <div className="-mx-4 sm:-mx-6 md:-mx-10 lg:-mx-14">
      <div className="home-section-inner mb-4 px-4 sm:px-6 md:px-10 lg:px-14">
        <PageHero
          title={t.home.welcome}
          subtitle={t.cover.tagline}
          icon={Users}
          compact
        />
      </div>

      <HomeSection tone="paper">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl"
        >
          <LeaderMessageCard
            title={t.home.gcCommitteeTitle}
            name={t.home.berketName}
            role={t.home.berketRole}
            speech={t.home.berketSpeech}
            photoSrc={berketPhoto}
            delay={0.1}
            variant="committee"
          />
        </motion.div>
      </HomeSection>

      <HomeSection tone="white">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
        >
          <div className="mb-5 flex items-center gap-3 border-b border-gold/20 pb-3">
            <div className="rounded-xl bg-gold/10 p-2">
              <Sparkles className="h-5 w-5 text-gold" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-navy md:text-xl">
                {t.home.eventsTitle}
              </h2>
              <p className="text-xs text-navy/60 md:text-sm">{t.home.eventsSubtitle}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-x-10 md:gap-y-10">
            {t.home.events.map((event, i) => (
              <EventPhotoCard
                key={event.slug}
                event={event}
                index={i}
                media={media}
              />
            ))}
          </div>
        </motion.div>
      </HomeSection>

      <div className="home-section-inner">
        <BookFooter includeSocials />
      </div>

      <HomeSection tone="warm">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mx-auto w-full max-w-6xl"
        >
          <h2 className="mb-4 text-center font-serif text-lg font-bold text-navy md:text-xl">
            {t.home.gcCommitteePhotoTitle}
          </h2>

          <GcCommitteePhoto
            label={t.home.gcCommitteePhotoTitle}
            imageSrc={gcPhoto}
          />
        </motion.div>
      </HomeSection>
    </div>
  );
}

function LeaderMessageCard({
  title,
  name,
  role,
  speech,
  photoSrc,
  delay = 0,
  variant = "leader",
}: {
  title: string;
  name: string;
  role: string;
  speech: string;
  photoSrc?: string;
  delay?: number;
  variant?: "leader" | "committee";
}) {
  const [imgError, setImgError] = useState(false);
  const showPhoto = Boolean(photoSrc) && !imgError;
  const paragraphs = speech.split("\n\n").filter(Boolean);
  const isCommittee = variant === "committee";

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`flex h-full flex-col overflow-hidden rounded-3xl border shadow-lg ${
        isCommittee
          ? "min-h-0 border-gold/25 bg-gradient-to-b from-white via-paper to-paper-warm shadow-gold/10"
          : "min-h-[28rem] sm:min-h-[32rem] glass-card border-blue-200/30"
      }`}
    >
      <div
        className="flex shrink-0 items-center gap-2.5 px-5 py-4 sm:px-6"
        style={{
          background: isCommittee
            ? "linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #3b82f6 100%)"
            : "linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #2563eb 100%)",
        }}
      >
        <MessageSquareQuote className="h-4 w-4 shrink-0 text-gold-light" />
        <h3 className="font-serif text-sm font-bold text-white sm:text-base">{title}</h3>
      </div>

      <div className="flex flex-1 flex-col px-5 py-6 sm:px-6 sm:py-7">
        {isCommittee ? (
          <div className="flex shrink-0 items-center gap-4 sm:gap-5">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border-2 border-gold/30 bg-paper shadow-md sm:h-28 sm:w-28">
              {showPhoto ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={photoSrc}
                  alt={name}
                  className="h-full w-full object-cover object-center"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-paper to-paper-warm">
                  <span className="font-serif text-4xl font-bold text-gold/50">
                    {name.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            <div className="min-w-0 text-left">
              <p className="font-serif text-lg font-bold text-navy sm:text-xl">{name}</p>
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-gold">
                {role}
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="mx-auto shrink-0">
              <div className="relative h-28 w-28 overflow-hidden rounded-2xl border-2 border-gold/30 bg-paper shadow-md sm:h-32 sm:w-32">
                {showPhoto ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={photoSrc}
                    alt={name}
                    className="h-full w-full object-cover object-center"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-paper to-paper-warm">
                    <span className="font-serif text-4xl font-bold text-gold/50">
                      {name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-5 text-center">
              <p className="font-serif text-lg font-bold text-navy sm:text-xl">{name}</p>
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-gold">
                {role}
              </p>
            </div>
          </>
        )}

        <div
          className={`mt-5 flex-1 space-y-4 border-t border-gold/15 pt-5 ${
            isCommittee ? "text-left" : "text-center"
          }`}
        >
          {paragraphs.map((para, i) => (
            <p
              key={i}
              className={`leading-relaxed text-navy/75 sm:text-[15px] ${
                i === 0 ? "font-medium text-navy/90" : ""
              } ${i === paragraphs.length - 1 ? "font-serif italic text-navy/65" : ""}`}
            >
              {para}
            </p>
          ))}
        </div>
      </div>
    </motion.article>
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
  media,
}: {
  event: EventCard;
  index: number;
  media: Record<string, string>;
}) {
  const [imgError, setImgError] = useState(false);
  const imageSrc = media[`event-cover:${event.slug}`];
  const showImage = Boolean(imageSrc) && !imgError;

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index }}
      className="h-full"
    >
      <Link
        href={`/book/events/${event.slug}`}
        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-blue-200/40 bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:border-gold/35 hover:shadow-xl hover:shadow-blue-500/10"
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-white sm:aspect-[3/2]">
          {showImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageSrc}
              alt={event.name}
              className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 border border-dashed border-gold/30 bg-gradient-to-br from-paper to-white px-6 text-center">
              <span className="font-serif text-xl font-bold text-navy/35 md:text-2xl">
                {event.name}
              </span>
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/90 via-navy/45 to-transparent pt-16" />
          <h3 className="absolute right-4 bottom-4 left-4 font-serif text-lg font-bold text-white drop-shadow-md md:text-xl">
            {event.name}
          </h3>
        </div>
        {event.desc && (
          <p className="line-clamp-2 px-4 py-3 text-sm leading-relaxed text-navy/60">
            {event.desc}
          </p>
        )}
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
    <div className="relative mx-auto aspect-[4/1] w-full max-w-6xl overflow-hidden rounded-xl bg-paper/40 sm:aspect-[5/1]">
      {!error ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageSrc}
          alt={label}
          className="h-full w-full object-cover object-center"
          onError={() => setError(true)}
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-center">
          <UsersRound className="h-8 w-8 text-gold/35" />
          <p className="font-serif text-sm font-bold text-navy/40">{label}</p>
        </div>
      )}
    </div>
  );
}
