import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { getProfile, saveProfile } from "@/lib/profile";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
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

    await fs.mkdir(UPLOAD_DIR, { recursive: true });

    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const filename = `profile.${ext}`;
    const filepath = path.join(UPLOAD_DIR, filename);

    const bytes = await file.arrayBuffer();
    await fs.writeFile(filepath, Buffer.from(bytes));

    // Remove old profile photos with different extensions
    const existing = await fs.readdir(UPLOAD_DIR).catch(() => [] as string[]);
    for (const f of existing) {
      if (f.startsWith("profile.") && f !== filename) {
        await fs.unlink(path.join(UPLOAD_DIR, f)).catch(() => {});
      }
    }

    const photoUrl = `/uploads/${filename}?t=${Date.now()}`;
    const profile = await getProfile();
    profile.photo = photoUrl.split("?")[0];
    await saveProfile(profile);

    return NextResponse.json({ success: true, photo: photoUrl });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
