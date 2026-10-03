"use client";

import { useState } from "react";
import { Experience } from "@/lib/profile";

export default function ExperienceAccordion({ experience }: { experience: Experience[] }) {
  const [openId, setOpenId] = useState(experience[0]?.id ?? "");

  return (
    <div className="exp-accordion">
      {experience.map((exp, index) => {
        const isOpen = openId === exp.id;

        return (
          <div
            key={exp.id}
            className={`exp-accordion-item ${isOpen ? "exp-accordion-item--open" : ""}`}
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <button
              className="exp-accordion-header"
              onClick={() => setOpenId(isOpen ? "" : exp.id)}
              aria-expanded={isOpen}
            >
              <div className="exp-accordion-left">
                <span className="exp-accordion-dot" />
                <div>
                  <div className="exp-role">{exp.role}</div>
                  <div className="exp-company">{exp.company}</div>
                </div>
              </div>
              <div className="exp-accordion-right">
                <span className="exp-period">{exp.period}</span>
                <span className={`exp-chevron ${isOpen ? "exp-chevron--open" : ""}`}>›</span>
              </div>
            </button>

            <div className={`exp-accordion-body ${isOpen ? "exp-accordion-body--open" : ""}`}>
              <ul className="exp-highlights">
                {exp.highlights.map((h, i) => (
                  <li key={i} style={{ animationDelay: `${i * 40}ms` }}>
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      })}
    </div>
  );
}
