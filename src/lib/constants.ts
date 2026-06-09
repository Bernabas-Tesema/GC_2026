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

export const SITE_BRAND_NAME = "GC ቤንሃናን";

export const SITE_LOGO_PATH = "/gc-logo.png";

/** Telegram group — set NEXT_PUBLIC_TELEGRAM_GROUP_URL in .env.local */
export const TELEGRAM_GROUP_URL =
  process.env.NEXT_PUBLIC_TELEGRAM_GROUP_URL || "https://t.me/+FbUY4vJBUcc0YTQ0";

export const FELLOWSHIP_NAME = {
  en: "Arba Minch University Christian Fellowship",
  am: "አርባ ምንጭ ዩኒቨርሲቲ ክርስትያን ፌሎውሺፕ",
};

export const GRADUATION_YEAR = "2026";
