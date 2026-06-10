import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { getClientDb } from "./firebase";
import type { Student } from "./types";

const STUDENTS_COLLECTION = "students";

export function getStudentInitial(fullName?: string): string {
  const name = fullName?.trim();
  return name ? name.charAt(0).toUpperCase() : "?";
}

/** Main gallery/department photo — large first, then small. */
export function getStudentPrimaryPhoto(student: Pick<Student, "largePhotoUrl" | "smallPhotoUrl">): string {
  return student.largePhotoUrl || student.smallPhotoUrl || "";
}

/** Second photo when both uploads differ (e.g. small inset on card). */
export function getStudentSecondaryPhoto(student: Pick<Student, "largePhotoUrl" | "smallPhotoUrl">): string {
  const { largePhotoUrl, smallPhotoUrl } = student;
  if (largePhotoUrl && smallPhotoUrl && largePhotoUrl !== smallPhotoUrl) {
    return smallPhotoUrl;
  }
  return "";
}

export function isCompleteStudent(student: Student): boolean {
  return Boolean(student.fullName?.trim());
}

export async function getStudentByUid(uid: string): Promise<Student | null> {
  const db = getClientDb();
  const q = query(collection(db, STUDENTS_COLLECTION), where("uid", "==", uid));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const docSnap = snapshot.docs[0];
  return { id: docSnap.id, ...docSnap.data() } as Student;
}

export async function getAllStudents(): Promise<Student[]> {
  const db = getClientDb();
  const snapshot = await getDocs(collection(db, STUDENTS_COLLECTION));
  return snapshot.docs
    .map((d) => ({ id: d.id, ...d.data() }) as Student)
    .filter(isCompleteStudent)
    .sort((a, b) => a.fullName.localeCompare(b.fullName));
}

export async function saveStudent(
  uid: string,
  data: Omit<Student, "id" | "uid" | "createdAt" | "updatedAt">
): Promise<void> {
  const db = getClientDb();
  const existing = await getStudentByUid(uid);
  const now = new Date().toISOString();

  if (existing) {
    await setDoc(doc(db, STUDENTS_COLLECTION, existing.id), {
      ...data,
      uid,
      createdAt: existing.createdAt,
      updatedAt: now,
    });
    return;
  }

  const newRef = doc(collection(db, STUDENTS_COLLECTION));
  await setDoc(newRef, {
    ...data,
    uid,
    createdAt: now,
    updatedAt: now,
  });
}

export async function getStudentById(id: string): Promise<Student | null> {
  const db = getClientDb();
  const docSnap = await getDoc(doc(db, STUDENTS_COLLECTION, id));
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data() } as Student;
}

import { deleteDoc } from "firebase/firestore";

/** Delete a student document by Firestore doc id (admin only). */
export async function deleteStudent(id: string): Promise<void> {
  const db = getClientDb();
  await deleteDoc(doc(db, STUDENTS_COLLECTION, id));
}

/** Admin creates/updates a student record directly (no Firebase Auth uid required). */
export async function adminSaveStudent(
  data: Omit<Student, "id" | "createdAt" | "updatedAt"> & { id?: string }
): Promise<string> {
  const db = getClientDb();
  const now = new Date().toISOString();
  if (data.id) {
    const ref = doc(db, STUDENTS_COLLECTION, data.id);
    const existing = await getDoc(ref);
    await setDoc(ref, {
      ...data,
      createdAt: existing.exists() ? existing.data().createdAt : now,
      updatedAt: now,
    });
    return data.id;
  }
  const newRef = doc(collection(db, STUDENTS_COLLECTION));
  await setDoc(newRef, { ...data, createdAt: now, updatedAt: now });
  return newRef.id;
}
