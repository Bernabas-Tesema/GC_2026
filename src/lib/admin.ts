import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { getClientDb } from "./firebase";

const ADMINS_COLLECTION = "admins";

/** Check if a uid is listed in the admins collection. */
export async function isAdmin(uid: string): Promise<boolean> {
  try {
    const db = getClientDb();
    const snap = await getDoc(doc(db, ADMINS_COLLECTION, uid));
    return snap.exists();
  } catch {
    return false;
  }
}

/** Add a uid to the admins collection. */
export async function addAdmin(uid: string, addedBy: string): Promise<void> {
  const db = getClientDb();
  await setDoc(doc(db, ADMINS_COLLECTION, uid), {
    uid,
    addedBy,
    createdAt: new Date().toISOString(),
  });
}

/** Remove a uid from the admins collection. */
export async function removeAdmin(uid: string): Promise<void> {
  const db = getClientDb();
  await deleteDoc(doc(db, ADMINS_COLLECTION, uid));
}

/** List all admin uids. */
export async function listAdmins(): Promise<string[]> {
  const db = getClientDb();
  const snap = await getDocs(collection(db, ADMINS_COLLECTION));
  return snap.docs.map((d) => d.id);
}
