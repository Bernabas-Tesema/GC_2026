import { LucideIcon } from "lucide-react";

interface IconLabelProps {
  icon: LucideIcon;
  children: React.ReactNode;
  className?: string;
  iconClassName?: string;
}

export default function IconLabel({
  icon: Icon,
  children,
  className = "",
  iconClassName = "text-gold",
}: IconLabelProps) {
  return (
    <span
      className={`mb-1.5 flex items-center gap-2 text-sm font-medium text-navy ${className}`}
    >
      <Icon className={`h-4 w-4 shrink-0 ${iconClassName}`} />
      {children}
    </span>
  );
}
