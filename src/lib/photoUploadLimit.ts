import { doc, getDoc, runTransaction } from "firebase/firestore";
import { getClientDb } from "./firebase";
import { MAX_STUDENT_PHOTO_UPLOADS } from "./constants";

const PHOTO_UPLOAD_LIMITS = "photoUploadLimits";

export async function getPhotoUploadCount(uid: string): Promise<number> {
  const db = getClientDb();
  const snap = await getDoc(doc(db, PHOTO_UPLOAD_LIMITS, uid));
  return snap.exists() ? (snap.data().count as number) : 0;
}

export function isPhotoUploadLimitReached(count: number): boolean {
  return count >= MAX_STUDENT_PHOTO_UPLOADS;
}

/** Increment after a successful profile photo upload. Throws if limit reached. */
export async function recordStudentPhotoUpload(uid: string): Promise<number> {
  const db = getClientDb();
  const ref = doc(db, PHOTO_UPLOAD_LIMITS, uid);

  return runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    const count = snap.exists() ? (snap.data().count as number) : 0;

    if (count >= MAX_STUDENT_PHOTO_UPLOADS) {
      throw new Error("UPLOAD_LIMIT_REACHED");
    }

    const next = count + 1;
    tx.set(
      ref,
      { count: next, updatedAt: new Date().toISOString() },
      { merge: true }
    );
    return next;
  });
}
