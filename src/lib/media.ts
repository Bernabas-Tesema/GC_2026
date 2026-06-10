/**
 * siteMedia Firestore collection
 * Each document ID is a "slot" key, value is the uploaded URL.
 *
 * Slot key format:
 *   event-cover:{slug}          → event cover photo
 *   event-gallery:{slug}:{n}    → event gallery photo at index n
 *   gc-committee:1              → first GC committee photo
 *   gc-committee:2              → second GC committee photo
 *   leaders:{name}              → leader photo
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
    default:              return dest.type;
  }
}
