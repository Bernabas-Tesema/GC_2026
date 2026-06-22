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
        autoComplete="current-password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input-field min-h-11 pr-11 text-base sm:text-sm"
      />
      <button
        type="button"
        onClick={() => setVisible((prev) => !prev)}
        className="absolute top-1/2 right-3 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-navy/40 transition-colors hover:text-navy"
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
