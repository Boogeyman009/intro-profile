"use client";

const CATEGORY_META: Record<string, { icon: string; color: string }> = {
  "Programming & Frameworks": { icon: "⌨", color: "#6366f1" },
  "Backend & System Design": { icon: "⚡", color: "#22d3ee" },
  "Cloud, DevOps & AI": { icon: "☁", color: "#a78bfa" },
  "Databases": { icon: "◫", color: "#34d399" },
  "Tools & Practices": { icon: "◈", color: "#fbbf24" },
};

function getMeta(category: string) {
  return CATEGORY_META[category] ?? { icon: "◆", color: "#818cf8" };
}

export default function SkillExplorer({ skills }: { skills: Record<string, string[]> }) {
  const categories = Object.keys(skills);

  return (
    <div className="skills-bento">
      {categories.map((category, catIndex) => {
        const { icon, color } = getMeta(category);
        const items = skills[category];

        return (
          <div
            key={category}
            className="skill-card"
            style={
              {
                "--skill-accent": color,
                animationDelay: `${catIndex * 80}ms`,
              } as React.CSSProperties
            }
          >
            <div className="skill-card-header">
              <span className="skill-card-icon">{icon}</span>
              <h4 className="skill-card-title">{category}</h4>
              <span className="skill-card-count">{items.length}</span>
            </div>

            <div className="skill-card-body">
              {items.map((skill, i) => (
                <span
                  key={skill}
                  className="skill-chip"
                  style={{ animationDelay: `${catIndex * 80 + i * 40}ms` }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
