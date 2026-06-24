import { normalizeImageFile } from "./imageUpload";
import { parseJsonResponse } from "./parseJsonResponse";

const CLOUDINARY_FOLDER = "gc-2026-yearbook";

function getCloudinaryConfig() {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error(
      "Cloudinary is not configured. Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET."
    );
  }

  return { cloudName, uploadPreset };
}

/** Upload directly to Cloudinary (avoids Vercel's ~4.5 MB API body limit). */
export async function uploadPhotoToCloudinary(file: File): Promise<string> {
  const uploadFile = await normalizeImageFile(file);
  const { cloudName, uploadPreset } = getCloudinaryConfig();

  const formData = new FormData();
  formData.append("file", uploadFile);
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", CLOUDINARY_FOLDER);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: formData }
  );

  const data = await parseJsonResponse<{
    secure_url?: string;
    error?: { message?: string };
  }>(response);

  if (!response.ok) {
    throw new Error(data.error?.message ?? "Upload failed");
  }

  if (!data.secure_url) {
    throw new Error("Upload failed");
  }

  return data.secure_url;
}
