"use client";

import { Profile } from "@/lib/profile";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function ProfileView({ profile }: { profile: Profile }) {
  return (
    <>
      <section className="hero">
        <div className="avatar">
          {profile.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profile.photo} alt={profile.name} className="avatar-img" />
          ) : (
            getInitials(profile.name)
          )}
        </div>
        <h1>{profile.name}</h1>
        <p className="title">{profile.title}</p>
        <div className="contact-row">
          <span>✉ {profile.email}</span>
          <span>📞 {profile.phone}</span>
          <span>📍 {profile.location}</span>
          {profile.linkedin && (
            <span>
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                LinkedIn ↗
              </a>
            </span>
          )}
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">About</h2>
        <div className="card">
          <p className="summary-text">{profile.summary}</p>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Experience</h2>
        <div className="card">
          {profile.experience.map((exp) => (
            <div key={exp.id} className="exp-item">
              <div className="exp-header">
                <div>
                  <div className="exp-role">{exp.role}</div>
                  <div className="exp-company">{exp.company}</div>
                </div>
                <span className="exp-period">{exp.period}</span>
              </div>
              <ul className="exp-highlights">
                {exp.highlights.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Technical Skills</h2>
        <div className="card skills-grid">
          {Object.entries(profile.skills).map(([category, items]) => (
            <div key={category} className="skill-group">
              <h4>{category}</h4>
              <div className="tags">
                {items.map((skill) => (
                  <span key={skill} className="tag">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Core Strengths</h2>
        <div className="strengths-grid">
          {profile.strengths.map((s) => (
            <span key={s} className="strength-pill">
              {s}
            </span>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Education</h2>
        <div className="card">
          {profile.education.map((edu) => (
            <div key={edu.id} className="edu-item">
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
      </section>
    </>
  );
}
