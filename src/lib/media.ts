/**
 * siteMedia Firestore collection
 * Each document ID is a "slot" key, value is the uploaded URL.
 *
 * Slot key format:
 *   event-cover:{slug}          → event cover photo
 *   event-gallery:{slug}:{n}    → event gallery photo at index n
 *   gc-committee:1              → first GC committee photo
 *   gc-committee:2              → second GC committee photo
 *   leaders:{n}                 → leader message photo
 *   site-gallery:{n}            → fellowship photo gallery slot
 */

import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { getClientDb } from "./firebase";

const MEDIA_COLLECTION = "siteMedia";

export async function setMediaSlot(slot: string, url: string): Promise<void> {
  const db = getClientDb();
  await setDoc(doc(db, MEDIA_COLLECTION, slot), { url, updatedAt: new Date().toISOString() });
}

export async function deleteMediaSlot(slot: string): Promise<void> {
  const db = getClientDb();
  await deleteDoc(doc(db, MEDIA_COLLECTION, slot));
}

export async function getAllMedia(): Promise<Record<string, string>> {
  const db = getClientDb();
  const snap = await getDocs(collection(db, MEDIA_COLLECTION));
  const result: Record<string, string> = {};
  snap.docs.forEach((d) => {
    result[d.id] = (d.data() as { url: string }).url;
  });
  return result;
}

/** Derive the slot key for a given upload destination */
export function buildSlotKey(dest: {
  type: string;
  slug?: string;
  studentId?: string;
  index?: number;
}): string {
  switch (dest.type) {
    case "event-cover":   return `event-cover:${dest.slug}`;
    case "event-gallery": return `event-gallery:${dest.slug}:${dest.index ?? 0}`;
    case "gc-committee":  return `gc-committee:${dest.index ?? 1}`;
    case "leaders":       return `leaders:${dest.index ?? 1}`;
    case "site-gallery":  return `site-gallery:${dest.index ?? 1}`;
    default:              return dest.type;
  }
}

export function getSiteGalleryPhotos(media: Record<string, string>): string[] {
  return Object.entries(media)
    .filter(([key]) => key.startsWith("site-gallery:"))
    .sort(([a], [b]) => {
      const ai = parseInt(a.split(":")[1] ?? "0", 10);
      const bi = parseInt(b.split(":")[1] ?? "0", 10);
      return ai - bi;
    })
    .map(([, url]) => url);
}

export type MediaEntry = {
  slot: string;
  url: string;
  label: string;
  category: string;
};

/** Human-readable label for a siteMedia slot key */
export function parseMediaSlotLabel(slot: string): string {
  if (slot.startsWith("event-cover:")) {
    return `Event cover — ${slot.slice("event-cover:".length)}`;
  }
  if (slot.startsWith("event-gallery:")) {
    const [, slug, index] = slot.split(":");
    return `Event gallery — ${slug} #${index ?? "?"}`;
  }
  if (slot.startsWith("gc-committee:")) {
    return `GC Committee group photo — slot ${slot.split(":")[1] ?? "?"}`;
  }
  if (slot.startsWith("leaders:")) {
    const index = slot.split(":")[1];
    if (index === "1") return "Leader message photo — Fellowship Leader";
    if (index === "2") return "Leader message photo — GC Committee Rep";
    return `Leader message photo — slot ${index ?? "?"}`;
  }
  if (slot.startsWith("site-gallery:")) {
    return `Photo gallery — #${slot.split(":")[1] ?? "?"}`;
  }
  return slot;
}

export function listMediaEntries(media: Record<string, string>): MediaEntry[] {
  return Object.entries(media)
    .map(([slot, url]) => ({
      slot,
      url,
      label: parseMediaSlotLabel(slot),
      category: slot.split(":")[0] ?? slot,
    }))
    .sort((a, b) => a.slot.localeCompare(b.slot, undefined, { numeric: true }));
}

const MEDIA_CATEGORY_ORDER = [
  "event-cover",
  "event-gallery",
  "gc-committee",
  "leaders",
  "site-gallery",
] as const;

export function groupMediaEntries(
  entries: MediaEntry[]
): { category: string; title: string; items: MediaEntry[] }[] {
  const titles: Record<string, string> = {
    "event-cover": "Event covers",
    "event-gallery": "Event gallery photos",
    "gc-committee": "GC Committee",
    leaders: "Leader message photos",
    "site-gallery": "Photo gallery",
  };

  const byCategory = new Map<string, MediaEntry[]>();
  for (const entry of entries) {
    const list = byCategory.get(entry.category) ?? [];
    list.push(entry);
    byCategory.set(entry.category, list);
  }

  const groups: { category: string; title: string; items: MediaEntry[] }[] = [];
  for (const category of MEDIA_CATEGORY_ORDER) {
    const items = byCategory.get(category);
    if (items?.length) {
      groups.push({ category, title: titles[category] ?? category, items });
      byCategory.delete(category);
    }
  }
  for (const [category, items] of byCategory) {
    groups.push({ category, title: titles[category] ?? category, items });
  }
  return groups;
}
