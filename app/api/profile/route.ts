import { NextRequest, NextResponse } from "next/server";
import { getProfile, saveProfile, Profile } from "@/lib/profile";

export async function GET() {
  try {
    const profile = await getProfile();
    return NextResponse.json(profile);
  } catch {
    return NextResponse.json({ error: "Failed to load profile" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const profile: Profile = await request.json();
    await saveProfile(profile);
    return NextResponse.json({ success: true, profile });
  } catch {
    return NextResponse.json({ error: "Failed to save profile" }, { status: 500 });
  }
}
