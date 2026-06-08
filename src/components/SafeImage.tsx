"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";

interface SafeImageProps extends Omit<ImageProps, "onError"> {
  fallback: React.ReactNode;
}

export default function SafeImage({
  fallback,
  alt,
  src,
  fill,
  className,
  sizes,
  ...props
}: SafeImageProps) {
  const [error, setError] = useState(false);
  const isLocalAsset = typeof src === "string" && src.startsWith("/");

  if (error) {
    return <>{fallback}</>;
  }

  if (isLocalAsset) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={
          fill
            ? `absolute inset-0 h-full w-full ${className ?? ""}`
            : className
        }
        onError={() => setError(true)}
      />
    );
  }

  return (
    <Image
      {...props}
      src={src}
      alt={alt}
      fill={fill}
      className={className}
      sizes={sizes}
      onError={() => setError(true)}
    />
  );
}
