"use client";

import { useRef } from "react";
import { projects } from "@/data/user-data";
import { ExternalLink, ChevronRight, ArrowUpRight } from "lucide-react";
import { SiGithub } from "react-icons/si";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

// All cards equal size
const gridLayouts = [
  { colSpan: "", rowSpan: "", height: "h-48" },
  { colSpan: "", rowSpan: "", height: "h-48" },
  { colSpan: "", rowSpan: "", height: "h-48" },
  { colSpan: "", rowSpan: "", height: "h-48" },
  { colSpan: "", rowSpan: "", height: "h-48" },
];

export function ProjectsGrid() {
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (prefersReduced || !gridRef.current) return;

      const cards = gridRef.current.querySelectorAll(".project-card");
      if (!cards.length) return;

      // Staggered entrance animation - cards appear from different directions
      cards.forEach((card, i) => {
        const direction = i % 3 === 0 ? -30 : i % 3 === 1 ? 0 : 30;
        const delay = i * 0.08;

        gsap.fromTo(
          card,
          {
            autoAlpha: 0,
            y: 40,
            x: direction,
            scale: 0.95,
            rotation: direction > 0 ? 2 : direction < 0 ? -2 : 0,
          },
          {
            autoAlpha: 1,
            y: 0,
            x: 0,
            scale: 1,
            rotation: 0,
            duration: 0.8,
            delay,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          },
        );
      });
    },
    { scope: gridRef },
  );

  return (
    <div
      ref={gridRef}
      className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 auto-rows-auto"
    >
      {projects.map((project, i) => {
        const layout = gridLayouts[i % gridLayouts.length];
        const isFeatured = i === 0;

        return (
          <div
            key={project.slug}
            className={`project-card group relative ${layout.colSpan} ${layout.rowSpan}`}
          >
            {/* Double-Bezel: Outer Shell */}
            <Link
              href={`/projects/${project.slug}`}
              className="block rounded-[1.25rem] p-[2px] h-full transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:shadow-lg"
              style={{
                background: "var(--border-accent)",
                boxShadow: "var(--shadow-sm)",
              }}
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
                  className={`relative overflow-hidden ${layout.height}`}
                  style={{ background: "var(--gradient-hero)" }}
                >
                  {project.slug === "murmur-chatapp" ? (
                    /* Special banner for murmur chatapp */
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]">
                      <div className="absolute inset-0 opacity-10">
                        <div
                          className="absolute inset-0"
                          style={{
                            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)`,
                            backgroundSize: "30px 30px",
                          }}
                        />
                      </div>
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                        <div className="relative w-12 h-12 mb-3">
                          <Image
                            src="/images/murmur-logo.png"
                            alt="Murmur Logo"
                            fill
                            className="object-contain"
                            sizes="48px"
                          />
                        </div>
                        <span className="text-[11px] font-mono uppercase tracking-widest text-white/60">
                          Real-time Chat
                        </span>
                      </div>
                    </div>
                  ) : project.image ? (
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
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

                  {/* Hover overlay with accent glow */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center"
                    style={{
                      background:
                        "color-mix(in srgb, var(--bg-primary) 85%, transparent)",
                    }}
                  >
                    <div
                      className="flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-sm"
                      style={{
                        borderColor: "var(--accent-primary)",
                        background:
                          "color-mix(in srgb, var(--accent-primary) 10%, transparent)",
                        color: "var(--accent-primary)",
                      }}
                    >
                      <span className="text-[12px] font-medium">
                        View Project
                      </span>
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Featured badge for first project */}
                  {isFeatured && (
                    <div
                      className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider backdrop-blur-sm"
                      style={{
                        background:
                          "color-mix(in srgb, var(--accent-primary) 15%, transparent)",
                        color: "var(--accent-primary)",
                        border: "1px solid var(--accent-primary)",
                      }}
                    >
                      Featured
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3
                      className="text-[15px] font-semibold transition-colors duration-300 group-hover:text-[var(--accent-primary)]"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {project.title}
                    </h3>
                    <div className="flex items-center gap-2 shrink-0">
                      {project.github && (
                        <button
                          type="button"
                          className="transition-all duration-300 hover:scale-110"
                          style={{ color: "var(--text-muted)" }}
                          title="View on GitHub"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            window.open(
                              project.github,
                              "_blank",
                              "noopener,noreferrer",
                            );
                          }}
                        >
                          <SiGithub className="w-4 h-4" />
                        </button>
                      )}
                      {project.live && (
                        <button
                          type="button"
                          className="transition-all duration-300 hover:scale-110"
                          style={{ color: "var(--text-muted)" }}
                          title="View live"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            window.open(
                              project.live,
                              "_blank",
                              "noopener,noreferrer",
                            );
                          }}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
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
                    {project.tech.slice(0, isFeatured ? 6 : 4).map((t) => (
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
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
