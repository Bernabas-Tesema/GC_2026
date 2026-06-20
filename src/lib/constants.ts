export const FELLOWSHIP_DEPARTMENTS = [
  "Education Department",
  "Academics",
  "Love Sharing",
  "Choirs",
  "Digital Strategy",
  "Nathanim",
  "Prayer",
  "Evangelism",
  "Literature",
  "Fund",
] as const;

export const ACADEMIC_DEPARTMENTS = [
  "Computer Science",
  "Software Engineering",
  "Civil Engineering",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Accounting",
  "Management",
  "Nursing",
  "Agriculture",
  "Medicine",
  "Pharmacy",
  "Architecture",
  "Economics",
  "Law",
  "Natural Resources Management",
  "Water Resources and Irrigation Engineering",
  "Urban Planning",
  "Statistics",
  "Biology",
  "Chemistry",
  "Physics",
  "Mathematics",
] as const;

export const DEPARTMENT_OTHER = "Other";

/** Map common misspellings / custom entries to a fellowship department. */
const FELLOWSHIP_DEPARTMENT_ALIASES: Record<string, (typeof FELLOWSHIP_DEPARTMENTS)[number]> = {
  choirs: "Choirs",
  choir: "Choirs",
  chiors: "Choirs",
  chior: "Choirs",
  "choir department": "Choirs",
  "education dept": "Education Department",
  "education": "Education Department",
  "digital media": "Digital Strategy",
  "love share": "Love Sharing",
  "loves sharing": "Love Sharing",
};

function fellowshipDepartmentKey(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

/** Resolve stored fellowship department to a canonical list value when possible. */
export function normalizeFellowshipDepartment(value: string): string {
  const trimmed = value?.trim() ?? "";
  if (!trimmed || trimmed === DEPARTMENT_OTHER) return trimmed;

  const exact = FELLOWSHIP_DEPARTMENTS.find((dept) => dept === trimmed);
  if (exact) return exact;

  const ci = FELLOWSHIP_DEPARTMENTS.find(
    (dept) => dept.toLowerCase() === trimmed.toLowerCase()
  );
  if (ci) return ci;

  const alias = FELLOWSHIP_DEPARTMENT_ALIASES[fellowshipDepartmentKey(trimmed)];
  if (alias) return alias;

  return trimmed;
}

export function studentMatchesFellowshipDepartment(
  studentDepartment: string,
  department: string
): boolean {
  return normalizeFellowshipDepartment(studentDepartment) === department;
}

export function fellowshipDepartmentSlug(department: string): string {
  return department
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export const SITE_BRAND_NAME = "GC ቤንሃናን";

export const SITE_LOGO_PATH = "/gc-logo.png";

/** Telegram group — set NEXT_PUBLIC_TELEGRAM_GROUP_URL in .env.local */
export const TELEGRAM_GROUP_URL =
  process.env.NEXT_PUBLIC_TELEGRAM_GROUP_URL || "https://t.me/+FbUY4vJBUcc0YTQ0";

export const INSTAGRAM_URL =
  process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://www.instagram.com/amuecsf/";

export const YOUTUBE_URL =
  process.env.NEXT_PUBLIC_YOUTUBE_URL || "https://www.youtube.com/@amuecsf";

export const FELLOWSHIP_NAME = {
  en: "Arba Minch University Christian Fellowship",
  am: "አርባ ምንጭ ዩኒቨርሲቲ ክርስትያን ፌሎውሺፕ",
};

export const GRADUATION_YEAR = "2026";

/** Max profile photo uploads per student (large + small combined). */
export const MAX_STUDENT_PHOTO_UPLOADS = 4;
