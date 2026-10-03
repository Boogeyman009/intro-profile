"use client";

import Link from "next/link";
import { useProfile } from "@/hooks/useProfile";
import ProfileView from "./ProfileView";
import ExportPdfButton from "./ExportPdfButton";
import ThemeToggle from "./ThemeToggle";

export default function AdPage() {
  const { profile, loading, refresh } = useProfile();

  if (loading && !profile) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="loading-screen">
        <p>Could not load profile.</p>
        <button className="btn btn-primary" onClick={refresh}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <nav className="top-nav">
        <Link href="/" className="ad-nav-brand">
          Profile
        </Link>
        <div className="nav-actions">
          <ThemeToggle />
          <ExportPdfButton profile={profile} />
          <Link href="/" className="btn btn-secondary">
            Full resume
          </Link>
          <Link href="/admin" className="btn btn-secondary">
            ✏ Edit
          </Link>
        </div>
      </nav>
      <main className="container container--ad">
        <ProfileView profile={profile} layout="ad" />
      </main>
    </>
  );
}
