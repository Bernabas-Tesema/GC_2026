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
  const resolved = resolveDepartmentSelect(value, options);
  const [pendingSelect, setPendingSelect] = useState<string | null>(null);
  const select = pendingSelect ?? resolved.select;
  const custom = resolved.custom;
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
    setPendingSelect(null);
  }, [value]);

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
    setPendingSelect(next);
    if (next === DEPARTMENT_OTHER) {
      onChange(custom.trim());
      return;
    }
    onChange(next);
  };

  const handleCustomChange = (next: string) => {
    onChange(next.trim());
  };

  return (
    <div ref={rootRef} className="relative min-w-0 w-full space-y-2">
      <IconLabel icon={icon}>
        {label}
        {required ? " *" : ""}
      </IconLabel>

      {/* Native select on phones — avoids custom list overflowing the screen */}
      <select
        value={select}
        onChange={(e) => handleSelectChange(e.target.value)}
        required={required && !isOther}
        className="select-field w-full min-w-0 max-w-full md:hidden"
      >
        <option value="">{t.profile.selectDepartment}</option>
        {options.map((dept) => (
          <option key={dept} value={dept}>
            {dept}
          </option>
        ))}
        <option value={DEPARTMENT_OTHER}>{t.profile.otherDepartment}</option>
      </select>

      {/* Custom dropdown on tablet/desktop */}
      <div className="relative hidden min-w-0 md:block">
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
          className="flex w-full min-w-0 items-center justify-between gap-2 rounded-lg border border-navy/15 bg-cream px-3 py-2.5 text-left text-navy outline-none transition-colors focus:border-gold focus:ring-2 focus:ring-gold/20 lg:px-4"
        >
          <span className={`min-w-0 flex-1 truncate ${select ? "text-navy" : "text-navy/45"}`}>
            {displayLabel}
          </span>
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-gold transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>

        {open && (
          <ul
            role="listbox"
            className="absolute left-0 right-0 top-full z-50 mt-1 max-h-[min(14rem,50dvh)] w-full max-w-full overflow-x-hidden overflow-y-auto overscroll-contain rounded-lg border border-navy/15 bg-white py-1 shadow-lg"
          >
            {options.map((dept) => (
              <li key={dept} role="option" aria-selected={select === dept}>
                <button
                  type="button"
                  onClick={() => handleSelectChange(dept)}
                  className={`w-full min-w-0 px-3 py-2 text-left text-sm leading-snug break-words whitespace-normal transition-colors hover:bg-gold/10 lg:px-4 lg:py-2.5 ${
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
                className={`w-full min-w-0 px-3 py-2 text-left text-sm leading-snug break-words whitespace-normal transition-colors hover:bg-gold/10 lg:px-4 lg:py-2.5 ${
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
      </div>

      {isOther && (
        <input
          type="text"
          required={required}
          value={custom}
          onChange={(e) => handleCustomChange(e.target.value)}
          placeholder={t.profile.otherDepartmentPlaceholder}
          className="w-full min-w-0 max-w-full rounded-lg border border-navy/15 bg-white px-3 py-2.5 text-navy outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 sm:px-4"
        />
      )}
    </div>
  );
}
