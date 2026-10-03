"use client";

import Link from "next/link";
import { useProfile } from "@/hooks/useProfile";
import ProfileView from "./ProfileView";
import SectionNav from "./SectionNav";
import ThemeToggle from "./ThemeToggle";

export default function DynamicProfilePage() {
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
        <Link href="/" className="brand">
          <span className="brand-mark" />
          {profile.name.split(" ")[0]}
        </Link>
        <SectionNav />
        <div className="nav-actions">
          <ThemeToggle />
          <button className="btn btn-secondary btn-icon" onClick={refresh} title="Refresh profile">
            ↻
          </button>
          <Link href="/admin" className="btn btn-secondary">
            Edit
          </Link>
          <a href={`mailto:${profile.email}`} className="btn btn-accent">
            Hire Me
          </a>
        </div>
      </nav>

      <main className="container">
        <ProfileView profile={profile} />
      </main>
    </>
  );
}
