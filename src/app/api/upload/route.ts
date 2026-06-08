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
        { error: "Cloudinary is not configured" },
        { status: 500 }
      );
    }

    const uploadData = new FormData();
    uploadData.append("file", file);
    uploadData.append("upload_preset", uploadPreset);
    uploadData.append("folder", "gc-2026-yearbook");

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: uploadData,
      }
    );

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json(
        { error: "Upload failed", details: error },
        { status: 500 }
      );
    }

    const result = await response.json();
    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
