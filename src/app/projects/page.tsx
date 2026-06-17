"use client";

import { projects } from "@/data/user-data";
import { ExternalLink, ArrowLeft, ChevronRight } from "lucide-react";
import { SiGithub } from "react-icons/si";
import Link from "next/link";

export default function ProjectsPage() {
  return (
    <div
      className="min-h-[100dvh] w-full relative overflow-x-hidden transition-colors duration-300"
      style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}
    >
      <div className="max-w-4xl mx-auto px-4 py-12">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              className="group block rounded-xl border overflow-hidden transition-all duration-300 hover:scale-[1.01]"
              style={{
                background: "var(--bg-card)",
                borderColor: "var(--border-accent)",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              {/* Image placeholder */}
              <div
                className="relative h-44 overflow-hidden"
                style={{ background: "var(--gradient-hero)" }}
              >
                <div
                  className="absolute inset-0 opacity-[0.04]"
                  style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, var(--text-primary) 1px, transparent 0)`,
                    backgroundSize: "20px 20px",
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[13px] font-mono uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                    {project.title}
                  </span>
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h2 className="text-[17px] font-semibold" style={{ color: "var(--text-primary)" }}>
                    {project.title}
                  </h2>
                  <div className="flex items-center gap-2 shrink-0">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="transition-colors duration-200"
                        style={{ color: "var(--text-muted)" }}
                      >
                        <SiGithub className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>

                <p className="text-[13px] leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>
                  {project.description}
                </p>

                {/* Highlights */}
                <ul className="space-y-1.5 mb-4">
                  {project.highlights.slice(0, 3).map((h, j) => (
                    <li key={j} className="flex gap-1.5 text-[12px] leading-snug" style={{ color: "var(--text-tertiary)" }}>
                      <ChevronRight className="w-3 h-3 mt-0.5 shrink-0" style={{ color: "var(--accent-primary)" }} />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>

                {/* Tech tags */}
                <div className="flex flex-wrap gap-1.5">
                  {project.tech.map((t) => (
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
          ))}
        </div>
      </div>
    </div>
  );
}
