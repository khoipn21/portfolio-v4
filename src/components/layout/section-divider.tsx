"use client";

import { type ReactNode } from "react";
import { AnimatedLine } from "./animated-line";

interface SectionDividerProps {
  title: string;
  id: string;
  children: ReactNode;
  showTopLine?: boolean;
  viewAllHref?: string;
  viewAllLabel?: string;
}

/**
 * Reusable section wrapper with blueprint-style dotted dividers,
 * intersection dots, and optional "View All" button.
 * Each horizontal line animates in via GSAP on scroll.
 */
export function SectionDivider({
  title,
  id,
  children,
  showTopLine = true,
  viewAllHref,
  viewAllLabel = "View All",
}: SectionDividerProps) {
  return (
    <div id={id} className="mt-6 flex flex-col relative z-10 scroll-mt-24">
      {/* Top line */}
      {showTopLine && (
        <>
          <AnimatedLine className="absolute top-0 left-0 right-0 h-0 pointer-events-none overflow-visible">
            <div
              className="absolute top-0 left-[-100vw] right-[-100vw] h-0 border-t pointer-events-none"
              style={{
                borderColor: "var(--grid-line)",
                maskImage:
                  "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
                WebkitMaskImage:
                  "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
              }}
            />
          </AnimatedLine>
          <div className="absolute top-0 -left-4 w-[2px] h-[2px] grid-dot -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20" />
          <div className="absolute top-0 -right-4 w-[2px] h-[2px] grid-dot translate-x-1/2 -translate-y-1/2 pointer-events-none z-20" />
        </>
      )}

      {/* Section header */}
      <div className="py-2 relative">
        <h2 className="text-[18px] font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
          {title}
        </h2>
        <AnimatedLine className="absolute bottom-0 left-0 right-0 h-0 pointer-events-none overflow-visible">
          <div
            className="absolute bottom-0 left-[-100vw] right-[-100vw] h-0 border-b pointer-events-none"
            style={{
              borderColor: "var(--grid-line)",
              maskImage:
                "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
              WebkitMaskImage:
                "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
            }}
          />
        </AnimatedLine>
        <div className="absolute bottom-0 -left-4 w-[2px] h-[2px] grid-dot -translate-x-1/2 translate-y-1/2 pointer-events-none z-20" />
        <div className="absolute bottom-0 -right-4 w-[2px] h-[2px] grid-dot translate-x-1/2 translate-y-1/2 pointer-events-none z-20" />
      </div>

      {/* Content */}
      <div className="block mt-0">{children}</div>

      {/* View All link */}
      {viewAllHref && (
        <div
          className="py-4 px-4 -mx-4 flex justify-center relative transition-colors cursor-pointer rounded-b-lg mt-0"
          style={{ background: "transparent" }}
        >
          <AnimatedLine className="absolute bottom-0 left-0 right-0 h-0 pointer-events-none overflow-visible">
            <div
              className="absolute bottom-0 left-[-100vw] right-[-100vw] h-0 border-b pointer-events-none"
              style={{
                borderColor: "var(--grid-line)",
                maskImage:
                  "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
                WebkitMaskImage:
                  "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
              }}
            />
          </AnimatedLine>
          <div className="absolute bottom-0 left-0 w-[2px] h-[2px] grid-dot -translate-x-1/2 translate-y-1/2 pointer-events-none z-20" />
          <div className="absolute bottom-0 right-0 w-[2px] h-[2px] grid-dot translate-x-1/2 translate-y-1/2 pointer-events-none z-20" />
          <a
            href={viewAllHref}
            className="relative group block"
          >
            <div
              className="absolute -inset-[5px] border rounded-[11px] pointer-events-none transition-colors duration-300"
              style={{ borderColor: "var(--border-accent)" }}
            />
            <div
              className="relative flex items-center gap-1.5 px-4 py-2 rounded-[6px] text-[13px] font-medium transition-all duration-300 border"
              style={{
                background: "var(--bg-card)",
                borderColor: "var(--border-accent)",
                color: "var(--text-secondary)",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              {viewAllLabel}
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 transition-colors" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="7" y1="17" x2="17" y2="7"></line>
                <polyline points="7 7 17 7 17 17"></polyline>
              </svg>
            </div>
          </a>
        </div>
      )}
    </div>
  );
}
