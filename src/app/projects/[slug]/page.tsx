"use client";

import { projects } from "@/data/user-data";
import { ExternalLink, ArrowLeft, ChevronRight } from "lucide-react";
import { SiGithub } from "react-icons/si";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ProjectDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return (
      <div
        className="min-h-[100dvh] flex items-center justify-center"
        style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}
      >
        <div className="text-center">
          <h1 className="text-[24px] font-bold mb-4">Project not found</h1>
          <Link href="/projects" className="text-[14px]" style={{ color: "var(--accent-primary)" }}>
            ← Back to projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-[100dvh] w-full relative overflow-x-hidden transition-colors duration-300"
      style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}
    >
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Back link */}
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 mb-8 text-[13px] font-medium transition-colors duration-200"
          style={{ color: "var(--text-tertiary)" }}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to projects
        </Link>

        {/* Project image placeholder */}
        <div
          className="relative h-56 rounded-xl overflow-hidden mb-8"
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
            <span className="text-[16px] font-mono uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
              {project.title}
            </span>
          </div>
        </div>

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-[28px] font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
              {project.title}
            </h1>
            <p className="text-[15px] mt-2 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              {project.description}
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-medium border transition-colors duration-200"
                style={{
                  background: "var(--bg-card)",
                  borderColor: "var(--border-accent)",
                  color: "var(--text-secondary)",
                }}
              >
                <SiGithub className="w-3.5 h-3.5" />
                Source
              </a>
            )}
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-medium border transition-colors duration-200"
                style={{
                  background: "var(--accent-primary)",
                  borderColor: "var(--accent-primary)",
                  color: "white",
                }}
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Live
              </a>
            )}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mb-8">
          <h2 className="text-[16px] font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
            Tech Stack
          </h2>
          <div className="flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <span
                key={t}
                className="px-3 py-1.5 rounded-full text-[12px] font-medium border"
                style={{
                  borderColor: "var(--border-accent)",
                  color: "var(--text-secondary)",
                  background: "var(--bg-secondary)",
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Key Highlights */}
        <div>
          <h2 className="text-[16px] font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
            Key Highlights
          </h2>
          <ul className="space-y-3">
            {project.highlights.map((h, j) => (
              <li
                key={j}
                className="flex gap-2 text-[14px] leading-relaxed p-3 rounded-lg border"
                style={{
                  color: "var(--text-secondary)",
                  background: "var(--bg-card)",
                  borderColor: "var(--border-accent)",
                }}
              >
                <ChevronRight className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "var(--accent-primary)" }} />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
