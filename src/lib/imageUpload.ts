/** File input accept string — includes iPhone HEIC/HEIF explicitly. */
export const ACCEPTED_IMAGE_INPUT =
  "image/*,.heic,.heif,image/heic,image/heif";

export function isHeicFile(file: File): boolean {
  const name = file.name.toLowerCase();
  if (name.endsWith(".heic") || name.endsWith(".heif")) return true;
  const type = file.type.toLowerCase();
  return type === "image/heic" || type === "image/heif";
}

/** Convert HEIC/HEIF to JPEG for browser preview and upload. Other formats pass through. */
export async function normalizeImageFile(file: File): Promise<File> {
  if (!isHeicFile(file)) return file;

  const heic2any = (await import("heic2any")).default;
  const result = await heic2any({
    blob: file,
    toType: "image/jpeg",
    quality: 0.9,
  });

  const blob = Array.isArray(result) ? result[0] : result;
  const baseName = file.name.replace(/\.(heic|heif)$/i, "") || "photo";
  return new File([blob], `${baseName}.jpg`, {
    type: "image/jpeg",
    lastModified: file.lastModified,
  });
}

/** Normalize image (HEIC → JPEG) and return a preview blob URL. */
export async function prepareImageForUpload(
  file: File
): Promise<{ file: File; previewUrl: string }> {
  const normalized = await normalizeImageFile(file);
  return { file: normalized, previewUrl: URL.createObjectURL(normalized) };
}
