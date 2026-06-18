"use client";

import { projects } from "@/data/user-data";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { SiGithub } from "react-icons/si";
import Link from "next/link";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ProjectsPage() {
  const gridRef = useRef<HTMLDivElement>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gridRef.current?.querySelectorAll(".project-card");
      if (cards) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.1,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  const handleImageError = (slug: string) => {
    setImageErrors((prev) => ({ ...prev, [slug]: true }));
  };

  return (
    <div
      className="min-h-[100dvh] w-full relative overflow-x-hidden transition-colors duration-300"
      style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}
    >
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 mb-8 text-[13px] font-medium transition-colors duration-200"
          style={{ color: "var(--text-tertiary)" }}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to home
        </Link>

        <h1 className="text-[28px] font-bold tracking-tight mb-2" style={{ color: "var(--text-primary)" }}>
          Projects
        </h1>
        <p className="text-[14px] mb-8" style={{ color: "var(--text-tertiary)" }}>
          A collection of my work across different domains and technologies.
        </p>

        {/* Projects Grid */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => {
            const hasImage = project.image && !imageErrors[project.slug];
            const isMurmur = project.slug === "murmur-chatapp";

            return (
              <Link
                key={project.slug}
                href={`/projects/${project.slug}`}
                className="project-card group block rounded-xl border overflow-hidden transition-all duration-300 hover:scale-[1.01]"
                style={{
                  background: "var(--bg-card)",
                  borderColor: "var(--border-accent)",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                {/* Image Section */}
                <div className="relative h-44 overflow-hidden">
                  {isMurmur ? (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]">
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0" style={{
                          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)`,
                          backgroundSize: "30px 30px",
                        }} />
                      </div>
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                        <div className="relative w-12 h-12 mb-2">
                          <Image
                            src="/images/murmur-logo.png"
                            alt="Murmur Logo"
                            fill
                            className="object-contain"
                            sizes="48px"
                          />
                        </div>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-white/60">
                          Real-time Chat
                        </span>
                      </div>
                    </div>
                  ) : hasImage ? (
                    <Image
                      src={project.image!}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      onError={() => handleImageError(project.slug)}
                    />
                  ) : (
                    <div
                      className="absolute inset-0 flex items-center justify-center"
                      style={{ background: "var(--gradient-hero)" }}
                    >
                      <div
                        className="absolute inset-0 opacity-[0.04]"
                        style={{
                          backgroundImage: `radial-gradient(circle at 1px 1px, var(--text-primary) 1px, transparent 0)`,
                          backgroundSize: "20px 20px",
                        }}
                      />
                      <span className="text-[13px] font-mono uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                        {project.title}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h2 className="text-[17px] font-semibold" style={{ color: "var(--text-primary)" }}>
                      {project.title}
                    </h2>
                    <div className="flex items-center gap-2 shrink-0">
                      {project.github && (
                        <button
                          type="button"
                          className="transition-colors duration-200"
                          style={{ color: "var(--text-muted)" }}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            window.open(project.github, "_blank", "noopener,noreferrer");
                          }}
                        >
                          <SiGithub className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-[13px] leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>
                    {project.description}
                  </p>

                  {/* Highlights */}
                  <ul className="space-y-1.5 mb-4">
                    {project.highlights.slice(0, 2).map((h, j) => (
                      <li key={j} className="flex gap-1.5 text-[12px] leading-snug" style={{ color: "var(--text-tertiary)" }}>
                        <ChevronRight className="w-3 h-3 mt-0.5 shrink-0" style={{ color: "var(--accent-primary)" }} />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Tech tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {project.tech.slice(0, 4).map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded-full text-[10px] font-medium border"
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
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
