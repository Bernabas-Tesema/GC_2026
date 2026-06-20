import { signInAnonymously } from "firebase/auth";
import { getClientAuth } from "@/lib/firebase";

let anonymousAttempted = false;
let anonymousUnavailable = false;

/**
 * Prepares Firestore writes for managers and students.
 * Manager collections (students, siteMedia) use open rules — no Firebase login required.
 * Anonymous sign-in is only attempted when explicitly enabled and only once per session.
 */
export async function ensureFirestoreWriteAccess(): Promise<boolean> {
  const auth = getClientAuth();
  if (auth.currentUser) return true;

  // Open Firestore rules for students + siteMedia — managers can write without Firebase Auth.
  if (process.env.NEXT_PUBLIC_FIREBASE_ANONYMOUS_AUTH !== "true") {
    return true;
  }

  if (anonymousUnavailable) return false;

  if (anonymousAttempted) return false;
  anonymousAttempted = true;

  try {
    await signInAnonymously(auth);
    return true;
  } catch {
    anonymousUnavailable = true;
    return false;
  }
}
