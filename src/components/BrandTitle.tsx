import Image from "next/image";
import Link from "next/link";
import { SITE_BRAND_NAME, SITE_LOGO_PATH } from "@/lib/constants";

type BrandTitleProps = {
  variant?: "cover" | "light";
  asLink?: boolean;
  className?: string;
  centered?: boolean;
};

export default function BrandTitle({
  variant = "light",
  asLink = false,
  className = "",
  centered = false,
}: BrandTitleProps) {
  const textClass = variant === "cover" ? "text-white" : "text-navy";
  const logoFrameClass =
    variant === "cover"
      ? "bg-paper shadow-md ring-1 ring-gold/40"
      : "bg-paper ring-1 ring-gold/25";

  const wrapperClass = [
    "inline-flex items-center gap-2.5 sm:gap-3",
    centered ? "justify-center" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      <span
        className={`flex shrink-0 items-center justify-center rounded-xl p-1.5 sm:p-2 ${logoFrameClass}`}
      >
        <Image
          src={SITE_LOGO_PATH}
          alt=""
          width={56}
          height={56}
          className="h-10 w-10 object-contain sm:h-12 sm:w-12 md:h-14 md:w-14"
          priority
        />
      </span>
      <span
        className={`font-serif text-base font-bold sm:text-lg md:text-xl ${textClass}`}
      >
        {SITE_BRAND_NAME}
      </span>
    </>
  );

  if (asLink) {
    return (
      <Link href="/" className={`${wrapperClass} shrink-0`}>
        {content}
      </Link>
    );
  }

  return <div className={wrapperClass}>{content}</div>;
}
