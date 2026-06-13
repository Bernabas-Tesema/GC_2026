"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getAllMedia } from "@/lib/media";
import BookFooter from "@/components/BookFooter";

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

  const gcPhoto1 = media["gc-committee:1"] || "/gc-committee.jpg";
  const gcPhoto2 = media["gc-committee:2"] || "/gc-committe-2.jpg";

  return (
    <div className="-mx-4 sm:-mx-6 md:-mx-10 lg:-mx-14">
      <HomeSection tone="white">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
        >
          <div className="mb-3 flex items-center gap-2 border-b border-gold/20 pb-1.5">
            <Sparkles className="h-4 w-4 shrink-0 text-gold" />
            <div>
              <h2 className="font-serif text-sm font-bold text-navy">{t.home.eventsTitle}</h2>
              <p className="text-[10px] text-navy/60 md:text-xs">{t.home.eventsSubtitle}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-y-8 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-8 lg:grid-cols-3 lg:gap-x-12 lg:gap-y-9">
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
          className="text-center"
        >
          <h2 className="mb-3 font-serif text-sm font-bold text-navy md:text-base">
            {t.home.gcCommitteePhotoTitle}
          </h2>
          <div className="flex w-full justify-between gap-6 sm:gap-10">
            <div className="min-w-0 w-[47%] sm:w-[45%]">
              <GcCommitteePhoto label="GC Committee 2026" imageSrc={gcPhoto1} />
            </div>
            <div className="min-w-0 w-[47%] sm:w-[45%]">
              <GcCommitteePhoto label="GC Committee 2026" imageSrc={gcPhoto2} />
            </div>
          </div>
        </motion.div>
      </HomeSection>

      <BookFooter includeSocials />
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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.04 * index }}
    >
      <Link
        href={`/book/events/${event.slug}`}
        className="group block overflow-hidden rounded-2xl border border-gold/20 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-gold/40"
      >
        <div className="relative aspect-2/1 overflow-hidden bg-white">
          {showImage ? (
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
    <div className="w-full overflow-hidden rounded-xl border border-gold/20 bg-white shadow-sm">
      <div className="relative aspect-[4/3] w-full overflow-hidden sm:aspect-[3/2]">
        {!error ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageSrc}
            alt={label}
            className="h-full w-full object-cover object-center transition-transform duration-500 hover:scale-[1.02]"
            onError={() => setError(true)}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 border border-dashed border-gold/30 bg-white p-4 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-dashed border-gold/40">
              <span className="font-serif text-lg font-bold text-navy/25">GC</span>
            </div>
            <p className="text-xs font-medium text-navy/45">{label}</p>
          </div>
        )}
      </div>
    </div>
  );
}
