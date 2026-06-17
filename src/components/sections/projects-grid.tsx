"use client";

import { useRef, useCallback } from "react";
import { projects } from "@/data/user-data";
import { ExternalLink, ChevronRight, ArrowUpRight } from "lucide-react";
import { SiGithub } from "react-icons/si";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

/**
 * Stagger layout map per card index.
 * Creates an asymmetric bento-grid feel with varying row/col spans.
 *
 * Desktop (3-col):
 *   [0] 2col 2row  | [1] 1col 1row
 *   [0]            | [2] 1col 1row
 *   [3] 2col 1row  | [4] 1col 1row
 *
 * Mobile: single column, all cards equal height.
 */
const GRID_MAP = [
  { colSpan: "md:col-span-2", rowSpan: "md:row-span-2" },
  { colSpan: "md:col-span-1", rowSpan: "md:row-span-1" },
  { colSpan: "md:col-span-1", rowSpan: "md:row-span-1" },
  { colSpan: "md:col-span-2", rowSpan: "md:row-span-1" },
  { colSpan: "md:col-span-1", rowSpan: "md:row-span-1" },
];

export function ProjectsGrid() {
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (prefersReduced || !gridRef.current) return;

      const cards = gridRef.current.querySelectorAll(".project-card");
      if (!cards.length) return;

      // Determine column count for center-outward stagger
      const computedStyle = getComputedStyle(gridRef.current);
      const colCount = computedStyle
        .getPropertyValue("grid-template-columns")
        .split(" ").length;
      const middleCol = Math.floor(colCount / 2);

      // Assign each card a column position for delay calculation
      cards.forEach((card, i) => {
        const colIndex = i % colCount;
        const delay = Math.abs(colIndex - middleCol) * 0.12;

        gsap.fromTo(
          card,
          {
            y: 80,
            autoAlpha: 0,
            scale: 0.95,
          },
          {
            y: 0,
            autoAlpha: 1,
            scale: 1,
            duration: 0.8,
            delay,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    },
    { scope: gridRef }
  );

  return (
    <div
      ref={gridRef}
      className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full auto-rows-[minmax(200px,auto)]"
    >
      {projects.map((project, i) => {
        const layout = GRID_MAP[i] ?? GRID_MAP[GRID_MAP.length - 1];
        const isLarge = i === 0;

        return (
          <div
            key={project.slug}
            className={`project-card group relative ${layout.colSpan} ${layout.rowSpan}`}
          >
            {/* Double-Bezel: Outer Shell */}
            <div
              className="rounded-[1.25rem] p-[2px] h-full transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
              style={{ background: "var(--border-accent)" }}
            >
              {/* Double-Bezel: Inner Core */}
              <div
                className="rounded-[calc(1.25rem-2px)] overflow-hidden h-full flex flex-col transition-all duration-500 group-hover:-translate-y-1"
                style={{
                  background: "var(--bg-card)",
                  boxShadow: "inset 0 1px 1px rgba(255,255,255,0.05)",
                }}
              >
                {/* Project image area */}
                <div
                  className={`relative overflow-hidden ${isLarge ? "h-48 md:h-full min-h-[180px]" : "h-36"}`}
                  style={{ background: "var(--gradient-hero)" }}
                >
                  {project.image ? (
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105"
                      sizes="(min-width: 768px) 66vw, 100vw"
                    />
                  ) : (
                    <>
                      <div
                        className="absolute inset-0 opacity-[0.04]"
                        style={{
                          backgroundImage: `radial-gradient(circle at 1px 1px, var(--text-primary) 1px, transparent 0)`,
                          backgroundSize: "20px 20px",
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span
                          className="text-[11px] font-mono uppercase tracking-widest"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {project.title}
                        </span>
                      </div>
                    </>
                  )}

                  {/* Hover overlay */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center"
                    style={{
                      background: "color-mix(in srgb, var(--bg-primary) 80%, transparent)",
                    }}
                  >
                    <ArrowUpRight
                      className="w-7 h-7"
                      style={{ color: "var(--accent-primary)" }}
                    />
                  </div>
                </div>

                {/* Content - only visible when not the large hero card, or on mobile */}
                <div className={`p-5 flex flex-col flex-1 ${isLarge ? "md:hidden" : ""}`}>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3
                      className="text-[15px] font-semibold transition-colors duration-300 group-hover:text-[var(--accent-primary)]"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {project.title}
                    </h3>
                    <div className="flex items-center gap-2 shrink-0">
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="transition-all duration-300 hover:scale-110"
                          style={{ color: "var(--text-muted)" }}
                          title="View on GitHub"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <SiGithub className="w-4 h-4" />
                        </a>
                      )}
                      {project.live && (
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="transition-all duration-300 hover:scale-110"
                          style={{ color: "var(--text-muted)" }}
                          title="View live"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>

                  <p
                    className="text-[13px] leading-relaxed mb-3 line-clamp-2"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {project.description}
                  </p>

                  <ul className="space-y-1 mb-3">
                    {project.highlights.slice(0, 2).map((h, j) => (
                      <li
                        key={j}
                        className="flex gap-1.5 text-[12px] leading-snug"
                        style={{ color: "var(--text-tertiary)" }}
                      >
                        <ChevronRight
                          className="w-3 h-3 mt-0.5 shrink-0"
                          style={{ color: "var(--accent-primary)" }}
                        />
                        <span className="line-clamp-1">{h}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    {project.tech.slice(0, isLarge ? 6 : 4).map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded-full text-[10px] font-medium border transition-all duration-300 hover:scale-105"
                        style={{
                          borderColor: "var(--border-accent)",
                          color: "var(--text-tertiary)",
                          background: "var(--bg-secondary)",
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Large card: overlay content on image (desktop only) */}
                {isLarge && (
                  <div className="hidden md:flex absolute inset-0 flex-col justify-end p-5 z-10 pointer-events-none">
                    <div
                      className="absolute inset-0"
                      style={{
                        background: "linear-gradient(to top, color-mix(in srgb, var(--bg-primary) 90%, transparent) 0%, transparent 60%)",
                      }}
                    />
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-2 pointer-events-auto">
                        <h3
                          className="text-[16px] font-semibold transition-colors duration-300 group-hover:text-[var(--accent-primary)]"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {project.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          {project.github && (
                            <a
                              href={project.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="transition-all duration-300 hover:scale-110"
                              style={{ color: "var(--text-muted)" }}
                              title="View on GitHub"
                            >
                              <SiGithub className="w-4 h-4" />
                            </a>
                          )}
                          {project.live && (
                            <a
                              href={project.live}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="transition-all duration-300 hover:scale-110"
                              style={{ color: "var(--text-muted)" }}
                              title="View live"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </div>
                      <p
                        className="text-[13px] leading-relaxed mb-2 line-clamp-2"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5 pointer-events-auto">
                        {project.tech.slice(0, 5).map((t) => (
                          <span
                            key={t}
                            className="px-2 py-0.5 rounded-full text-[10px] font-medium border"
                            style={{
                              borderColor: "var(--border-accent)",
                              color: "var(--text-tertiary)",
                              background: "color-mix(in srgb, var(--bg-secondary) 80%, transparent)",
                            }}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
