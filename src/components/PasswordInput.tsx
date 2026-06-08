"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  id?: string;
}

export default function PasswordInput({
  value,
  onChange,
  required = true,
  id,
}: PasswordInputProps) {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        id={id}
        type={visible ? "text" : "password"}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-navy/15 bg-white py-2.5 pr-11 pl-4 text-navy outline-none transition-colors focus:border-gold focus:ring-2 focus:ring-gold/20"
      />
      <button
        type="button"
        onClick={() => setVisible((prev) => !prev)}
        className="absolute top-1/2 right-3 -translate-y-1/2 text-navy/40 transition-colors hover:text-navy"
        aria-label={visible ? t.auth.hidePassword : t.auth.showPassword}
      >
        {visible ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}
