import fs from "fs/promises";
import path from "path";

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  highlights: string[];
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  year: string;
  details: string;
}

export interface Profile {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  photo?: string;
  summary: string;
  experience: Experience[];
  skills: Record<string, string[]>;
  strengths: string[];
  education: Education[];
}

const PROFILE_PATH = path.join(process.cwd(), "data", "profile.json");

export async function getProfile(): Promise<Profile> {
  const data = await fs.readFile(PROFILE_PATH, "utf-8");
  return JSON.parse(data) as Profile;
}

export async function saveProfile(profile: Profile): Promise<void> {
  await fs.writeFile(PROFILE_PATH, JSON.stringify(profile, null, 2), "utf-8");
}
