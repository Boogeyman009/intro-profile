import Link from "next/link";
import { getProfile } from "@/lib/profile";
import ProfileView from "@/components/ProfileView";
import ExportPdfButton from "@/components/ExportPdfButton";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const profile = await getProfile();

  return (
    <>
      <nav className="top-nav nav-actions">
        <ExportPdfButton profile={profile} />
        <Link href="/admin" className="btn btn-secondary">
          ✏ Edit Profile
        </Link>
      </nav>
      <main className="container">
        <ProfileView profile={profile} />
      </main>
      <footer className="footer">
        Built with Next.js · Last updated {new Date().toLocaleDateString()}
      </footer>
    </>
  );
}
