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

export const MANAGER_CREDENTIALS = {
  email: "bernabastesemagedore@gmail.com",
  password: "Bern@2024",
} as const;

export function getManagerEmails(): string[] {
  const fromEnv = (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  return [...new Set([MANAGER_CREDENTIALS.email.toLowerCase(), ...fromEnv])];
}

export function isManagerEmail(email: string): boolean {
  return getManagerEmails().includes(email.trim().toLowerCase());
}

export function isValidManagerCredentials(email: string, password: string): boolean {
  return (
    email.trim().toLowerCase() === MANAGER_CREDENTIALS.email.toLowerCase() &&
    password === MANAGER_CREDENTIALS.password
  );
}

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
