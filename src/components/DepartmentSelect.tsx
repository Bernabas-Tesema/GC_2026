"use client";

import type { LucideIcon } from "lucide-react";
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

  const handleSelectChange = (next: string) => {
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
    <div className="space-y-2">
      <IconLabel icon={icon}>
        {label}
        {required ? " *" : ""}
      </IconLabel>
      <select
        required={required}
        value={select}
        onChange={(e) => handleSelectChange(e.target.value)}
        className="w-full rounded-lg border border-navy/15 bg-white px-4 py-2.5 text-navy outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
      >
        <option value="">{t.profile.selectDepartment}</option>
        {options.map((dept) => (
          <option key={dept} value={dept}>
            {dept}
          </option>
        ))}
        <option value={DEPARTMENT_OTHER}>{t.profile.otherDepartment}</option>
      </select>
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
