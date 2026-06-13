"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { isValidManagerCredentials } from "@/lib/admin";

const SESSION_KEY = "gc-manager-auth";

interface ManagerAuthContextValue {
  isManager: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const ManagerAuthContext = createContext<ManagerAuthContextValue | null>(null);

export function ManagerAuthProvider({ children }: { children: React.ReactNode }) {
  const [isManager, setIsManager] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsManager(sessionStorage.getItem(SESSION_KEY) === "1");
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    if (!isValidManagerCredentials(email, password)) {
      throw new Error("invalid-credentials");
    }

    sessionStorage.setItem(SESSION_KEY, "1");
    setIsManager(true);
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    setIsManager(false);
  }, []);

  const value = useMemo(
    () => ({ isManager, loading, login, logout }),
    [isManager, loading, login, logout]
  );

  return (
    <ManagerAuthContext.Provider value={value}>
      {children}
    </ManagerAuthContext.Provider>
  );
}

export function useManagerAuth() {
  const context = useContext(ManagerAuthContext);
  if (!context) {
    throw new Error("useManagerAuth must be used within ManagerAuthProvider");
  }
  return context;
}
