"use client";

import { useEffect, useState } from "react";
import { Profile } from "@/lib/profile";
import AnimatedSection from "./AnimatedSection";
import CountUp from "./CountUp";
import TypingText from "./TypingText";
import ExperienceAccordion from "./ExperienceAccordion";
import SkillExplorer from "./SkillExplorer";
import ExportPdfButton from "./ExportPdfButton";
import PhotoUpload from "./PhotoUpload";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function linkedinLabel(url: string) {
  return url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "") || "LinkedIn";
}

function LinkedInIcon() {
  return (
    <svg className="linkedin-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8.5h4V24h-4V8.5zM8.5 8.5h3.8v2.1h.05c.53-1 1.84-2.1 3.79-2.1 4.05 0 4.8 2.67 4.8 6.14V24h-4v-7.7c0-1.84-.03-4.2-2.56-4.2-2.56 0-2.95 2-2.95 4.06V24h-4V8.5z"
      />
    </svg>
  );
}

export default function ProfileView({
  profile,
  layout = "default",
  editablePhoto = false,
  onPhotoChange,
}: {
  profile: Profile;
  layout?: "default" | "ad";
  editablePhoto?: boolean;
  onPhotoChange?: (photo: string) => void;
}) {
  const typingTexts = profile.tagline
    ? profile.tagline.split("·").map((t) => t.trim())
    : [profile.title];
  const [photoError, setPhotoError] = useState(false);
  const showPhoto = profile.photo && !photoError;

  useEffect(() => {
    setPhotoError(false);
  }, [profile.photo]);

  return (
    <div className={layout === "ad" ? "profile-ad" : undefined}>
      <section className="hero hero--split hero--animated">
        <div className="hero-photo">
          {editablePhoto && onPhotoChange ? (
            <PhotoUpload
              photo={profile.photo}
              name={profile.name}
              onPhotoChange={(photo) => {
                setPhotoError(false);
                onPhotoChange(photo);
              }}
              variant="compact"
              fill
            />
          ) : showPhoto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.photo}
              alt={profile.name}
              className="hero-photo-img"
              onError={() => setPhotoError(true)}
            />
          ) : (
            <div className="hero-photo-fallback">{getInitials(profile.name)}</div>
          )}
        </div>

        <div className="hero-copy">
          <h1 className="hero-name">
            Hello! I&apos;m
            <span>{profile.name}</span>
          </h1>
          <p className="title">{profile.title}</p>

          {profile.tagline && (
            <p className="tagline">
              <TypingText texts={typingTexts} />
            </p>
          )}

          <div className="hero-cta">
            <ExportPdfButton profile={profile} className="btn btn-accent" label="Download CV" />
            <a href={`mailto:${profile.email}`} className="btn btn-accent">
              Hire Me
            </a>
          </div>

          <div className="contact-row">
            <a href={`mailto:${profile.email}`} className="contact-chip">
              {profile.email}
            </a>
            <a href={`tel:${profile.phone.replace(/\s/g, "")}`} className="contact-chip">
              {profile.phone}
            </a>
            <span className="contact-chip">{profile.location}</span>
            {profile.linkedin && (
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="contact-chip contact-chip--link">
                <LinkedInIcon />
                {linkedinLabel(profile.linkedin)}
              </a>
            )}
          </div>
        </div>
      </section>

      {profile.stats && profile.stats.length > 0 && (
        <AnimatedSection id="stats" className="section" delay={100}>
          <h2 className="section-title">Impact</h2>
          <div className="stats-grid">
            {profile.stats.map((stat, i) => (
              <div key={stat.id} className="stat-card" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="stat-value">
                  <CountUp value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                </div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </AnimatedSection>
      )}

      <AnimatedSection id="about" className="section" delay={150}>
        <h2 className="section-title">About Me</h2>
        <div className="about-split">
          <div className="card card--glow">
            <p className="summary-text">{profile.summary}</p>
            <a href={`mailto:${profile.email}`} className="btn btn-accent about-hire">
              Hire Me
            </a>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection id="experience" className="section" delay={200}>
        <h2 className="section-title">My Experience</h2>
        <ExperienceAccordion experience={profile.experience} />
      </AnimatedSection>

      <AnimatedSection id="skills" className="section" delay={250}>
        <h2 className="section-title">Technical Skills</h2>
        <SkillExplorer skills={profile.skills} />
      </AnimatedSection>

      <AnimatedSection id="strengths" className="section" delay={300}>
        <h2 className="section-title">My Strengths</h2>
        <div className="strengths-grid">
          {profile.strengths.map((s, i) => (
            <span key={s} className="strength-pill strength-pill--animated" style={{ animationDelay: `${i * 60}ms` }}>
              {s}
            </span>
          ))}
        </div>
      </AnimatedSection>

      <AnimatedSection id="education" className="section" delay={350}>
        <h2 className="section-title">Education</h2>
        <div className="card">
          {profile.education.map((edu, i) => (
            <div key={edu.id} className="edu-item edu-item--animated" style={{ animationDelay: `${i * 80}ms` }}>
              <div>
                <div className="edu-degree">{edu.degree}</div>
                <div className="edu-institution">
                  {edu.institution}
                  {edu.details && ` · ${edu.details}`}
                </div>
              </div>
              <span className="edu-year">{edu.year}</span>
            </div>
          ))}
        </div>
      </AnimatedSection>

      <section className="contact-banner" id="contact">
        <div>
          <p className="contact-banner-kicker">Contact Me</p>
          <h2>Say hello!</h2>
        </div>
        <div className="contact-banner-links">
          <a href={`mailto:${profile.email}`} className="contact-banner-mail">
            {profile.email}
          </a>
          {profile.linkedin && (
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-banner-mail"
            >
              <LinkedInIcon />
              {linkedinLabel(profile.linkedin)}
            </a>
          )}
        </div>
        <a href={`mailto:${profile.email}`} className="btn btn-dark">
          Hire Me
        </a>
      </section>
    </div>
  );
}
