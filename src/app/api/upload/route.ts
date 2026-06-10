import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      return NextResponse.json(
        {
          error: "Cloudinary is not configured",
          hint: "Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in .env.local",
        },
        { status: 500 }
      );
    }

    const uploadData = new FormData();
    uploadData.append("file", file);
    uploadData.append("upload_preset", uploadPreset);
    uploadData.append("folder", "gc-2026-yearbook");

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: "POST", body: uploadData }
    );

    const body = await response.text();

    if (!response.ok) {
      console.error("[upload] Cloudinary error:", response.status, body);
      let parsed: Record<string, unknown> = {};
      try { parsed = JSON.parse(body); } catch { /* not json */ }
      return NextResponse.json(
        {
          error: "Cloudinary upload failed",
          status: response.status,
          // surface the cloudinary error message directly
          details: (parsed?.error as { message?: string })?.message ?? body,
        },
        { status: 500 }
      );
    }

    const result = JSON.parse(body);
    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (err) {
    console.error("[upload] Unexpected error:", err);
    return NextResponse.json(
      { error: "Upload failed", details: String(err) },
      { status: 500 }
    );
  }
}
