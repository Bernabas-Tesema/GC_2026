export const EVENT_SLUGS = [
  "worship-wudase",
  "worship-maranata",
  "ajora-trip",
  "graduates-training",
  "gc-conference",
  "gc-dinner",
] as const;

export type EventSlug = (typeof EVENT_SLUGS)[number];

export function isEventSlug(slug: string): slug is EventSlug {
  return (EVENT_SLUGS as readonly string[]).includes(slug);
}

/** Card cover: public/events/{slug}/cover.jpg — add gallery photos as 1.jpg, 2.jpg, … */
export const EVENT_COVER_IMAGE = (slug: EventSlug) =>
  `/events/${slug}/cover.jpg`;

export const EVENT_GALLERY_PHOTOS: Record<EventSlug, string[]> = {
  "worship-wudase": [],
  "worship-maranata": [],
  "ajora-trip": [],
  "graduates-training": [],
  "gc-conference": [],
  "gc-dinner": [],
};
