import { NextRequest, NextResponse } from "next/server";
import { getProfile, saveProfile } from "@/lib/profile";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 5 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("photo") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Only JPEG, PNG, WebP, and GIF allowed" }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File must be under 5MB" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const photo = `data:${file.type};base64,${Buffer.from(bytes).toString("base64")}`;

    const profile = await getProfile();
    profile.photo = photo;
    await saveProfile(profile);

    return NextResponse.json({ success: true, photo });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const profile = await getProfile();
    profile.photo = "";
    await saveProfile(profile);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to remove photo" }, { status: 500 });
  }
}
