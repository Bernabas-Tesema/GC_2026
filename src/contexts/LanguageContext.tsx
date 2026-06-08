"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Language } from "@/lib/types";
import en from "@/messages/en.json";
import am from "@/messages/am.json";

type Messages = typeof en;

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Messages;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const messages: Record<Language, Messages> = { en, am };

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const saved = localStorage.getItem("gc-language") as Language | null;
    if (saved === "en" || saved === "am") {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("gc-language", lang);
  }, []);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t: messages[language],
    }),
    [language, setLanguage]
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
