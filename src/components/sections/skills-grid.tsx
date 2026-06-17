"use client";

import { skills } from "@/data/user-data";
import { useStaggerChildren } from "@/hooks/use-gsap";
import Image from "next/image";

/**
 * Skills grid with premium pill design and hover physics.
 * Uses consistent radius language with the rest of the portfolio.
 */
export function SkillsGrid() {
  const gridRef = useStaggerChildren({ y: 15, stagger: 0.03, duration: 0.5 });

  return (
    <div ref={gridRef as React.RefObject<HTMLDivElement>} className="relative pt-6 pb-2">
      <div className="flex flex-wrap gap-2 w-full">
        {skills.map((skill, index) => (
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
            <Image
              src={`https://cdn.simpleicons.org/${skill.icon}/71717a`}
              alt={skill.name}
              width={14}
              height={14}
              loading="lazy"
              className="h-3.5 w-3.5 opacity-80"
              unoptimized
            />
            <span
              className="text-[12px] font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              {skill.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
