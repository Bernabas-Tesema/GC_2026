"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MessageSquareQuote, Sparkles, Users, UsersRound } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getAllMedia } from "@/lib/media";
import BookFooter from "@/components/BookFooter";
import PageHero from "@/components/ui/PageHero";
import am from "@/messages/am.json";

const leaderMessages = am.home;

type HomeSectionTone = "paper" | "white" | "warm" | "navy";

function HomeSection({
  children,
  tone = "paper",
  className = "",
}: {
  children: React.ReactNode;
  tone?: HomeSectionTone;
  className?: string;
}) {
  return (
    <section className={`home-section home-section-${tone} ${className}`.trim()}>
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

  const gcPhoto = media["gc-committee:1"] || "/gcccc.jpg";
  const berketPhoto = media["leaders:2"] || "/bek.JPG";
  const semagegnPhoto = media["leaders:1"];

  return (
    <div className="-mx-4 font-sans sm:-mx-6 md:-mx-10 lg:-mx-14">
      <div className="home-section-inner mb-2 px-4 sm:px-6 md:px-10 lg:px-14">
        <PageHero
          title={t.home.welcome}
          subtitle={t.cover.tagline}
          icon={Users}
          compact
          titleFont="sans"
        />
      </div>

      <HomeSection tone="paper" className="relative overflow-hidden !bg-transparent">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/g2.jpg"
            alt=""
            className="h-full w-full scale-105 object-cover object-[center_30%] blur-xl"
          />
          <div className="absolute inset-0 bg-cream/75" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 w-full max-w-6xl"
        >
          <div className="mb-4 overflow-hidden rounded-xl border border-gold/20 bg-cream/90 shadow-md sm:mb-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/g2.jpg"
              alt={t.home.gcCommitteePhotoTitle}
              className="block h-auto max-h-44 w-full object-cover object-top sm:max-h-56 sm:object-contain md:max-h-72 lg:max-h-none"
            />
          </div>

          <div className="grid w-full grid-cols-1 items-start gap-5 md:grid-cols-2 md:gap-6 lg:gap-8">
          <LeaderMessageCard
            title={leaderMessages.leaderTitle}
            name={leaderMessages.semagagnName}
            role={leaderMessages.semagagnRole}
            speech={leaderMessages.semagagnSpeech}
            photoSrc={semagegnPhoto}
            delay={0.1}
            variant="committee"
            parallel
          />
          <LeaderMessageCard
            title={leaderMessages.gcCommitteeTitle}
            name={leaderMessages.berketName}
            role={leaderMessages.berketRole}
            speech={leaderMessages.berketSpeech}
            photoSrc={berketPhoto}
            delay={0.15}
            variant="committee"
            parallel
            className="md:relative md:z-10 md:-translate-y-1 md:shadow-xl"
          />
          </div>
        </motion.div>
      </HomeSection>

      <HomeSection tone="white">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
        >
          <div className="mb-3 inline-flex max-w-full items-center gap-2 rounded-lg chocolate-box px-3 py-1.5">
            <div className="min-w-0">
              <h2 className="text-sm font-bold leading-tight text-white sm:text-base">
                {t.home.eventsTitle}
              </h2>
              <p className="text-[10px] leading-snug text-amber-100/80 sm:text-xs">
                {t.home.eventsSubtitle}
              </p>
            </div>
            <Sparkles className="h-3.5 w-3.5 shrink-0 text-amber-200" aria-hidden />
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

      <HomeSection tone="warm">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full"
        >
          <h2 className="mb-4 text-center text-lg font-bold text-navy md:text-xl">
            {t.home.gcCommitteePhotoTitle}
          </h2>

          <div className="-mx-4 sm:-mx-6 md:-mx-10 lg:-mx-14">
            <GcCommitteePhoto
              label={t.home.gcCommitteePhotoTitle}
              imageSrc={gcPhoto}
            />
          </div>
        </motion.div>
      </HomeSection>

      <HomeSection tone="paper">
        <BookFooter includeSocials />
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
  parallel = false,
  className = "",
}: {
  title: string;
  name: string;
  role: string;
  speech: string;
  photoSrc?: string;
  delay?: number;
  variant?: "leader" | "committee";
  parallel?: boolean;
  className?: string;
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
      className={`flex flex-col rounded-3xl border shadow-lg ${className} ${
        isCommittee
          ? "border-gold/25 bg-cream/90 backdrop-blur-md"
          : "glass-card border-gold/20"
      }`}
    >
      <div
        className={`flex shrink-0 items-center gap-1.5 px-4 py-2 sm:px-5 ${
          isCommittee
            ? "border-b border-gold/20 bg-cream/80 backdrop-blur-sm"
            : "border-b border-gold/15"
        }`}
        style={
          isCommittee
            ? undefined
            : { background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #2563eb 100%)" }
        }
      >
        <h3
          className={`min-w-0 flex-1 text-xs font-bold sm:text-sm ${
            isCommittee ? "text-navy" : "text-white"
          }`}
        >
          {title}
        </h3>
        <MessageSquareQuote
          className={`h-3.5 w-3.5 shrink-0 ${
            isCommittee ? "text-chocolate-light" : "text-gold-light"
          }`}
          aria-hidden
        />
      </div>

      <div className={`flex flex-col ${parallel ? "px-4 py-4 sm:px-5 sm:py-5" : "px-5 py-6 sm:px-6 sm:py-7"}`}>
        {isCommittee ? (
          <div className={`flex shrink-0 items-center ${parallel ? "gap-3" : "gap-4 sm:gap-5"}`}>
            <div
              className={`relative shrink-0 overflow-hidden rounded-2xl border-2 border-gold/30 bg-paper shadow-md ${
                parallel ? "h-20 w-20 sm:h-24 sm:w-24" : "h-24 w-24 sm:h-28 sm:w-28"
              }`}
            >
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
                  <span className="text-4xl font-bold text-gold/50">
                    {name.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            <div className="min-w-0 text-left">
              <p className={`font-bold text-navy ${parallel ? "text-base sm:text-lg" : "text-lg sm:text-xl"}`}>
                {name}
              </p>
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-chocolate-light">
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
                    <span className="text-4xl font-bold text-gold/50">
                      {name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-5 text-center">
              <p className="text-lg font-bold text-navy sm:text-xl">{name}</p>
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-chocolate-light">
                {role}
              </p>
            </div>
          </>
        )}

        <div
          className={`mt-4 space-y-3 border-t border-gold/15 pt-4 ${
            isCommittee ? "text-left" : "text-center"
          }`}
        >
          {paragraphs.map((para, i) => {
            const isSignature = i === paragraphs.length - 1 && paragraphs.length > 1;

            return (
              <p
                key={i}
                className={`leading-relaxed whitespace-pre-line text-navy/75 ${
                  parallel ? "text-xs sm:text-sm" : "sm:text-[15px]"
                } ${isSignature ? "text-left not-italic text-navy/80" : "text-justify"}`}
              >
                {para}
              </p>
            );
          })}
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
        className="group card-box flex h-full flex-col hover:-translate-y-2"
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-cream sm:aspect-[3/2]">
          {showImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageSrc}
              alt={event.name}
              className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 border border-dashed border-gold/30 bg-gradient-to-br from-paper to-paper-warm px-6 text-center">
              <span className="text-xl font-bold text-navy/35 md:text-2xl">
                {event.name}
              </span>
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 chocolate-overlay pt-16" />
          <h3 className="absolute right-4 bottom-4 left-4 text-lg font-bold text-white drop-shadow-md md:text-xl">
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
    <div className="w-full overflow-hidden bg-cream">
      {!error ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageSrc}
          alt={label}
          className="block h-44 w-full object-cover object-[center_40%] sm:h-56 md:h-72 lg:h-96 xl:h-[28rem]"
          onError={() => setError(true)}
        />
      ) : (
        <div className="flex min-h-32 w-full flex-col items-center justify-center gap-2 bg-cream py-8 text-center">
          <UsersRound className="h-8 w-8 text-gold/35" />
          <p className="text-sm font-bold text-navy/40">{label}</p>
        </div>
      )}
    </div>
  );
}
