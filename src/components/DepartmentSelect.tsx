"use client";

import { useEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { ChevronDown } from "lucide-react";
import IconLabel from "@/components/IconLabel";
import { useLanguage } from "@/contexts/LanguageContext";
import { DEPARTMENT_OTHER } from "@/lib/constants";

type DepartmentSelectProps = {
  label: string;
  icon: LucideIcon;
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
};

export function resolveDepartmentSelect(
  storedValue: string,
  options: readonly string[]
): { select: string; custom: string } {
  if (!storedValue) return { select: "", custom: "" };
  if (options.includes(storedValue)) return { select: storedValue, custom: "" };
  return { select: DEPARTMENT_OTHER, custom: storedValue };
}

export default function DepartmentSelect({
  label,
  icon,
  options,
  value,
  onChange,
  required = false,
}: DepartmentSelectProps) {
  const { t } = useLanguage();
  const { select, custom } = resolveDepartmentSelect(value, options);
  const isOther = select === DEPARTMENT_OTHER;
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const displayLabel =
    select === ""
      ? t.profile.selectDepartment
      : select === DEPARTMENT_OTHER
        ? custom.trim() || t.profile.otherDepartment
        : select;

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleSelectChange = (next: string) => {
    setOpen(false);
    if (next === DEPARTMENT_OTHER) {
      onChange(custom.trim() || DEPARTMENT_OTHER);
      return;
    }
    onChange(next);
  };

  const handleCustomChange = (next: string) => {
    onChange(next.trim() ? next : DEPARTMENT_OTHER);
  };

  return (
    <div ref={rootRef} className="relative space-y-2">
      <IconLabel icon={icon}>
        {label}
        {required ? " *" : ""}
      </IconLabel>

      {required && (
        <input
          tabIndex={-1}
          aria-hidden
          className="pointer-events-none absolute h-0 w-0 opacity-0"
          value={select}
          required
          onChange={() => {}}
        />
      )}

      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-navy/15 bg-white px-4 py-2.5 text-left text-navy outline-none transition-colors focus:border-gold focus:ring-2 focus:ring-gold/20"
      >
        <span className={select ? "text-navy" : "text-navy/45"}>{displayLabel}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-gold transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute left-0 right-0 top-full z-50 mt-1 max-h-56 overflow-y-auto rounded-lg border border-navy/15 bg-white py-1 shadow-lg"
        >
          {options.map((dept) => (
            <li key={dept} role="option" aria-selected={select === dept}>
              <button
                type="button"
                onClick={() => handleSelectChange(dept)}
                className={`w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-gold/10 ${
                  select === dept ? "bg-gold/15 font-semibold text-navy" : "text-navy/80"
                }`}
              >
                {dept}
              </button>
            </li>
          ))}
          <li role="option" aria-selected={select === DEPARTMENT_OTHER}>
            <button
              type="button"
              onClick={() => handleSelectChange(DEPARTMENT_OTHER)}
              className={`w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-gold/10 ${
                select === DEPARTMENT_OTHER
                  ? "bg-gold/15 font-semibold text-navy"
                  : "text-navy/80"
              }`}
            >
              {t.profile.otherDepartment}
            </button>
          </li>
        </ul>
      )}

      {isOther && (
        <input
          type="text"
          required={required}
          value={custom}
          onChange={(e) => handleCustomChange(e.target.value)}
          placeholder={t.profile.otherDepartmentPlaceholder}
          className="w-full rounded-lg border border-navy/15 bg-white px-4 py-2.5 text-navy outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
        />
      )}
    </div>
  );
}
