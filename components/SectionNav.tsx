"use client";

import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "about", label: "About Me" },
  { id: "stats", label: "Impact" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "strengths", label: "Strengths" },
  { id: "education", label: "Education" },
];

export default function SectionNav() {
  const [active, setActive] = useState("about");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id);
        },
        { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <nav className="section-nav" aria-label="Profile sections">
      {SECTIONS.map(({ id, label }) => (
        <a
          key={id}
          href={`#${id}`}
          className={`section-nav-link ${active === id ? "section-nav-link--active" : ""}`}
        >
          {label}
        </a>
      ))}
    </nav>
  );
}
