"use client";

import { skills } from "@/data/user-data";
import { useStaggerChildren } from "@/hooks/use-gsap";
import { useState } from "react";

// Icons that are black and need inversion in dark mode
const BLACK_ICONS = new Set([
  "devicon:github",
  "devicon:express",
  "devicon:nextjs",
  "simple-icons:tanstack",
  "simple-icons:mantine",
  "simple-icons:greensock",
]);

/**
 * Skills grid with premium pill design and hover physics.
 * Uses Iconify CDN for comprehensive icon support.
 * Black icons adapt to dark/light mode via CSS.
 */
export function SkillsGrid() {
  const gridRef = useStaggerChildren({ y: 15, stagger: 0.03, duration: 0.5 });
  const [failedIcons, setFailedIcons] = useState<Set<string>>(new Set());

  const handleIconError = (icon: string) => {
    setFailedIcons((prev) => new Set(prev).add(icon));
  };

  return (
    <div ref={gridRef as React.RefObject<HTMLDivElement>} className="relative pt-6 pb-2">
      <div className="flex flex-wrap gap-2 w-full">
        {skills.map((skill, index) => {
          const iconFailed = failedIcons.has(skill.icon);
          const iconUrl = `https://api.iconify.design/${skill.icon}.svg`;
          const needsInversion = BLACK_ICONS.has(skill.icon);

          return (
            <div
              key={index}
              className="grow flex items-center justify-center gap-2 px-3.5 py-2 rounded-full transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] cursor-default hover:scale-[1.05]"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-accent)",
                boxShadow: "inset 0 1px 1px rgba(255,255,255,0.03)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--border-primary)";
                e.currentTarget.style.boxShadow = "0 2px 8px var(--accent-glow)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border-accent)";
                e.currentTarget.style.boxShadow = "inset 0 1px 1px rgba(255,255,255,0.03)";
              }}
            >
              {!iconFailed ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={iconUrl}
                  alt=""
                  role="presentation"
                  width={14}
                  height={14}
                  className={`h-3.5 w-3.5 opacity-80${needsInversion ? " skill-icon-invert" : ""}`}
                  loading="lazy"
                  decoding="async"
                  onError={() => handleIconError(skill.icon)}
                />
              ) : (
                <div
                  className="h-3.5 w-3.5 rounded-sm opacity-60"
                  style={{ background: "var(--accent-primary)" }}
                />
              )}
              <span
                className="text-[12px] font-medium"
                style={{ color: "var(--text-secondary)" }}
              >
                {skill.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
