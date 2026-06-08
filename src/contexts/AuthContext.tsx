"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import { getClientAuth } from "@/lib/firebase";
import { getStudentByUid } from "@/lib/students";
import type { Student } from "@/lib/types";

interface AuthContextValue {
  user: User | null;
  student: Student | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshStudent: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshStudent = useCallback(async () => {
    const auth = getClientAuth();
    if (!auth.currentUser) {
      setStudent(null);
      return;
    }
    try {
      const profile = await getStudentByUid(auth.currentUser.uid);
      setStudent(profile);
    } catch (error) {
      console.error("Failed to load student profile:", error);
      setStudent(null);
    }
  }, []);

  useEffect(() => {
    const auth = getClientAuth();
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const profile = await getStudentByUid(firebaseUser.uid);
          setStudent(profile);
        } catch (error) {
          console.error("Failed to load student profile:", error);
          setStudent(null);
        }
      } else {
        setStudent(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    await signInWithEmailAndPassword(getClientAuth(), email, password);
  }, []);

  const signup = useCallback(async (email: string, password: string) => {
    await createUserWithEmailAndPassword(getClientAuth(), email, password);
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    await sendPasswordResetEmail(getClientAuth(), email);
  }, []);

  const logout = useCallback(async () => {
    await signOut(getClientAuth());
    setStudent(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      student,
      loading,
      login,
      signup,
      resetPassword,
      logout,
      refreshStudent,
    }),
    [user, student, loading, login, signup, resetPassword, logout, refreshStudent]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
