"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Profile, Experience, Education, Stat } from "@/lib/profile";
import ProfileView from "./ProfileView";
import PhotoUpload from "./PhotoUpload";
import ThemeToggle from "./ThemeToggle";

export default function AdminEditor() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [toast, setToast] = useState("");

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then(setProfile);
  }, []);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  async function handleSave() {
    if (!profile) return;
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      if (res.ok) {
        showToast("Profile saved successfully!");
      } else {
        showToast("Failed to save profile.");
      }
    } catch {
      showToast("Failed to save profile.");
    }
    setSaving(false);
  }

  function updateField(field: keyof Profile, value: string) {
    if (!profile) return;
    setProfile({ ...profile, [field]: value });
  }

  function updateExperience(index: number, field: keyof Experience, value: string | string[]) {
    if (!profile) return;
    const updated = [...profile.experience];
    updated[index] = { ...updated[index], [field]: value };
    setProfile({ ...profile, experience: updated });
  }

  function addExperience() {
    if (!profile) return;
    const newExp: Experience = {
      id: Date.now().toString(),
      role: "",
      company: "",
      period: "",
      highlights: [""],
    };
    setProfile({ ...profile, experience: [...profile.experience, newExp] });
  }

  function removeExperience(index: number) {
    if (!profile) return;
    setProfile({
      ...profile,
      experience: profile.experience.filter((_, i) => i !== index),
    });
  }

  function updateHighlight(expIndex: number, hlIndex: number, value: string) {
    if (!profile) return;
    const updated = [...profile.experience];
    const highlights = [...updated[expIndex].highlights];
    highlights[hlIndex] = value;
    updated[expIndex] = { ...updated[expIndex], highlights };
    setProfile({ ...profile, experience: updated });
  }

  function addHighlight(expIndex: number) {
    if (!profile) return;
    const updated = [...profile.experience];
    updated[expIndex] = {
      ...updated[expIndex],
      highlights: [...updated[expIndex].highlights, ""],
    };
    setProfile({ ...profile, experience: updated });
  }

  function removeHighlight(expIndex: number, hlIndex: number) {
    if (!profile) return;
    const updated = [...profile.experience];
    updated[expIndex] = {
      ...updated[expIndex],
      highlights: updated[expIndex].highlights.filter((_, i) => i !== hlIndex),
    };
    setProfile({ ...profile, experience: updated });
  }

  function updateSkillCategory(category: string, value: string) {
    if (!profile) return;
    const items = value.split(",").map((s) => s.trim()).filter(Boolean);
    setProfile({ ...profile, skills: { ...profile.skills, [category]: items } });
  }

  function addSkillCategory() {
    if (!profile) return;
    const name = prompt("Category name (e.g. 'Programming & Frameworks'):");
    if (name) {
      setProfile({ ...profile, skills: { ...profile.skills, [name]: [] } });
    }
  }

  function removeSkillCategory(category: string) {
    if (!profile) return;
    const { [category]: _, ...rest } = profile.skills;
    setProfile({ ...profile, skills: rest });
  }

  function updateStrengths(value: string) {
    if (!profile) return;
    const items = value.split(",").map((s) => s.trim()).filter(Boolean);
    setProfile({ ...profile, strengths: items });
  }

  function updateEducation(index: number, field: keyof Education, value: string) {
    if (!profile) return;
    const updated = [...profile.education];
    updated[index] = { ...updated[index], [field]: value };
    setProfile({ ...profile, education: updated });
  }

  function addEducation() {
    if (!profile) return;
    const newEdu: Education = {
      id: Date.now().toString(),
      degree: "",
      institution: "",
      year: "",
      details: "",
    };
    setProfile({ ...profile, education: [...profile.education, newEdu] });
  }

  function removeEducation(index: number) {
    if (!profile) return;
    setProfile({
      ...profile,
      education: profile.education.filter((_, i) => i !== index),
    });
  }

  function updateStat(index: number, field: keyof Stat, value: string | number) {
    if (!profile) return;
    const stats = [...(profile.stats ?? [])];
    stats[index] = { ...stats[index], [field]: value };
    setProfile({ ...profile, stats });
  }

  function addStat() {
    if (!profile) return;
    const newStat: Stat = { id: Date.now().toString(), label: "", value: 0, suffix: "" };
    setProfile({ ...profile, stats: [...(profile.stats ?? []), newStat] });
  }

  function removeStat(index: number) {
    if (!profile) return;
    setProfile({
      ...profile,
      stats: (profile.stats ?? []).filter((_, i) => i !== index),
    });
  }

  if (!profile) {
    return (
      <div className="container" style={{ paddingTop: "4rem", textAlign: "center" }}>
        Loading profile...
      </div>
    );
  }

  return (
    <>
      <nav className="top-nav">
        <Link href="/" className="btn btn-secondary">
          ← View Profile
        </Link>
        <div className="nav-actions">
          <ThemeToggle />
          <button className="btn btn-secondary" onClick={() => setShowPreview((p) => !p)}>
            {showPreview ? "Hide Preview" : "Show Preview"}
          </button>
        </div>
      </nav>

      <div className={`admin-layout ${showPreview ? "admin-layout--split" : ""}`}>
        <main className="admin-editor">
          <div className="admin-header">
            <h1>Edit Profile</h1>
            <button className="btn btn-success" onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>

          <div className="admin-section">
          <h2>Basic Info</h2>
          <div className="card">
            <PhotoUpload
              photo={profile.photo}
              name={profile.name}
              onPhotoChange={(photo) => {
                setProfile({ ...profile, photo });
                showToast(photo ? "Photo updated!" : "Photo removed.");
              }}
            />
            <div className="form-row">
              <div className="form-group">
                <label>Full Name</label>
                <input value={profile.name} onChange={(e) => updateField("name", e.target.value)} />
              </div>
              <div className="form-group">
                <label>Title</label>
                <input value={profile.title} onChange={(e) => updateField("title", e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label>Tagline (typing animation, use · to separate)</label>
              <input
                value={profile.tagline ?? ""}
                onChange={(e) => updateField("tagline", e.target.value)}
                placeholder="Backend Engineering · System Design · CI/CD"
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Email</label>
                <input value={profile.email} onChange={(e) => updateField("email", e.target.value)} />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input value={profile.phone} onChange={(e) => updateField("phone", e.target.value)} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Location</label>
                <input value={profile.location} onChange={(e) => updateField("location", e.target.value)} />
              </div>
              <div className="form-group">
                <label>LinkedIn URL</label>
                <input value={profile.linkedin} onChange={(e) => updateField("linkedin", e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label>Professional Summary</label>
              <textarea
                value={profile.summary}
                onChange={(e) => updateField("summary", e.target.value)}
                rows={5}
              />
            </div>
          </div>
        </div>

        <div className="admin-section">
          <h2>Impact Stats</h2>
          {(profile.stats ?? []).map((stat, i) => (
            <div key={stat.id} className="item-card">
              <div className="item-card-header">
                <strong>Stat #{i + 1}</strong>
                <button className="btn btn-danger" onClick={() => removeStat(i)}>
                  Remove
                </button>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Label</label>
                  <input value={stat.label} onChange={(e) => updateStat(i, "label", e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Value</label>
                  <input
                    type="number"
                    value={stat.value}
                    onChange={(e) => updateStat(i, "value", Number(e.target.value))}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Prefix</label>
                  <input value={stat.prefix ?? ""} onChange={(e) => updateStat(i, "prefix", e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Suffix</label>
                  <input value={stat.suffix ?? ""} onChange={(e) => updateStat(i, "suffix", e.target.value)} placeholder="%, +, etc." />
                </div>
              </div>
            </div>
          ))}
          <button className="btn btn-add" onClick={addStat}>
            + Add Stat
          </button>
        </div>

        <div className="admin-section">
          <h2>Work Experience</h2>
          {profile.experience.map((exp, i) => (
            <div key={exp.id} className="item-card">
              <div className="item-card-header">
                <strong>Experience #{i + 1}</strong>
                <button className="btn btn-danger" onClick={() => removeExperience(i)}>
                  Remove
                </button>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Role</label>
                  <input value={exp.role} onChange={(e) => updateExperience(i, "role", e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Company</label>
                  <input value={exp.company} onChange={(e) => updateExperience(i, "company", e.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <label>Period</label>
                <input value={exp.period} onChange={(e) => updateExperience(i, "period", e.target.value)} />
              </div>
              <label style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600 }}>
                HIGHLIGHTS
              </label>
              {exp.highlights.map((hl, j) => (
                <div key={j} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <input
                    value={hl}
                    onChange={(e) => updateHighlight(i, j, e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <button className="btn btn-danger" onClick={() => removeHighlight(i, j)}>
                    ✕
                  </button>
                </div>
              ))}
              <button className="btn btn-add" onClick={() => addHighlight(i)}>
                + Add Highlight
              </button>
            </div>
          ))}
          <button className="btn btn-add" onClick={addExperience}>
            + Add Experience
          </button>
        </div>

        <div className="admin-section">
          <h2>Technical Skills</h2>
          {Object.entries(profile.skills).map(([category, items]) => (
            <div key={category} className="item-card">
              <div className="item-card-header">
                <strong>{category}</strong>
                <button className="btn btn-danger" onClick={() => removeSkillCategory(category)}>
                  Remove
                </button>
              </div>
              <div className="form-group">
                <label>Skills (comma-separated)</label>
                <input
                  value={items.join(", ")}
                  onChange={(e) => updateSkillCategory(category, e.target.value)}
                />
              </div>
            </div>
          ))}
          <button className="btn btn-add" onClick={addSkillCategory}>
            + Add Skill Category
          </button>
        </div>

        <div className="admin-section">
          <h2>Core Strengths</h2>
          <div className="card">
            <div className="form-group">
              <label>Strengths (comma-separated)</label>
              <textarea
                value={profile.strengths.join(", ")}
                onChange={(e) => updateStrengths(e.target.value)}
                rows={3}
              />
            </div>
          </div>
        </div>

        <div className="admin-section">
          <h2>Education</h2>
          {profile.education.map((edu, i) => (
            <div key={edu.id} className="item-card">
              <div className="item-card-header">
                <strong>Education #{i + 1}</strong>
                <button className="btn btn-danger" onClick={() => removeEducation(i)}>
                  Remove
                </button>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Degree</label>
                  <input
                    value={edu.degree}
                    onChange={(e) => updateEducation(i, "degree", e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Year</label>
                  <input
                    value={edu.year}
                    onChange={(e) => updateEducation(i, "year", e.target.value)}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Institution</label>
                  <input
                    value={edu.institution}
                    onChange={(e) => updateEducation(i, "institution", e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Details</label>
                  <input
                    value={edu.details}
                    onChange={(e) => updateEducation(i, "details", e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
          <button className="btn btn-add" onClick={addEducation}>
            + Add Education
          </button>
        </div>

          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <button className="btn btn-success" onClick={handleSave} disabled={saving} style={{ padding: "0.75rem 2rem" }}>
              {saving ? "Saving..." : "Save All Changes"}
            </button>
          </div>
        </main>

        {showPreview && (
          <aside className="live-preview">
            <div className="live-preview-header">
              <span>Live Preview</span>
              <span className="live-badge">Updating in real time</span>
            </div>
            <div className="live-preview-body">
              <ProfileView
                profile={profile}
                onPhotoChange={(photo) => setProfile({ ...profile, photo })}
              />
            </div>
          </aside>
        )}
      </div>

      {toast && <div className="toast">{toast}</div>}
    </>
  );
}
