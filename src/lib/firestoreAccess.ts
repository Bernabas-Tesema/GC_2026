import { signInAnonymously } from "firebase/auth";
import { getClientAuth } from "@/lib/firebase";

let anonymousAttempted = false;

/** Best-effort Firebase sign-in for Firestore writes (managers panel). */
export async function ensureFirestoreWriteAccess(): Promise<boolean> {
  const auth = getClientAuth();
  if (auth.currentUser) return true;

  if (anonymousAttempted) return false;
  anonymousAttempted = true;

  try {
    await signInAnonymously(auth);
    return true;
  } catch {
    return false;
  }
}
