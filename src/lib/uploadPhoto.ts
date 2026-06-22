import { normalizeImageFile } from "./imageUpload";
import { parseJsonResponse } from "./parseJsonResponse";

/** Upload a file to Cloudinary via the app API. Throws on failure. */
export async function uploadPhotoToCloudinary(file: File): Promise<string> {
  const uploadFile = await normalizeImageFile(file);
  const formData = new FormData();
  formData.append("file", uploadFile);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const data = await parseJsonResponse<{ url?: string; error?: string; details?: string }>(
    response
  );

  if (!response.ok) {
    throw new Error(data.details ?? data.error ?? "Upload failed");
  }

  if (!data.url) {
    throw new Error("Upload failed");
  }

  return data.url;
}
