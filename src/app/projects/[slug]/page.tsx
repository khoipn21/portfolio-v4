"use client";

import { projects } from "@/data/user-data";
import { ExternalLink, ArrowLeft, ChevronRight } from "lucide-react";
import { SiGithub } from "react-icons/si";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Special banner component for murmur chatapp
function Murmurbanner() {
  const bubbles = [
    { width: 73, height: 49, left: 10, top: 20 },
    { width: 76, height: 46, left: 25, top: 45 },
    { width: 87, height: 48, left: 40, top: 70 },
    { width: 95, height: 31, left: 55, top: 20 },
    { width: 98, height: 31, left: 70, top: 45 },
    { width: 73, height: 35, left: 85, top: 70 },
  ];

  return (
    <div className="relative w-full h-56 rounded-xl overflow-hidden mb-8 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)`,
          backgroundSize: "30px 30px",
        }} />
      </div>
      <div className="absolute inset-0 overflow-hidden">
        {bubbles.map((bubble, i) => (
          <div
            key={i}
            className="absolute rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10"
            style={{
              width: `${bubble.width}px`,
              height: `${bubble.height}px`,
              left: `${bubble.left}%`,
              top: `${bubble.top}%`,
              animation: `float ${3 + i}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6">
        <div className="relative w-16 h-16 mb-4">
          <Image
            src="/images/murmur-logo.png"
            alt="Murmur Chatapp Logo"
            fill
            className="object-contain drop-shadow-2xl"
            sizes="64px"
          />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 text-center">
          Murmur Chatapp
        </h1>
        <p className="text-sm text-white/70 text-center">
          Real-time messaging platform with WebSocket
        </p>
      </div>
    </div>
  );
}

export default function ProjectDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const project = projects.find((p) => p.slug === slug);

  const contentRef = useRef<HTMLDivElement>(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (!project || !contentRef.current) return;

    const ctx = gsap.context(() => {
      const sections = contentRef.current?.querySelectorAll(".animate-section");
      if (sections) {
        sections.forEach((section) => {
          gsap.fromTo(
            section,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power2.out",
              scrollTrigger: {
                trigger: section,
                start: "top 85%",
                toggleActions: "play none none none",
              },
            }
          );
        });
      }
    }, contentRef);

    return () => ctx.revert();
  }, [project]);

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

  const hasImage = project.image && !imageError;
  const isMurmur = project.slug === "murmur-chatapp";

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

        {/* Project Image */}
        {isMurmur ? (
          <Murmurbanner />
        ) : (
          <div className="relative h-56 rounded-xl overflow-hidden mb-8" style={{ background: "var(--gradient-hero)" }}>
            {hasImage ? (
              <Image
                src={project.image!}
                alt={project.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 768px"
                onError={() => setImageError(true)}
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
                  <span className="text-[16px] font-mono uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                    {project.title}
                  </span>
                </div>
              </>
            )}
          </div>
        )}

        {/* Header */}
        <div ref={contentRef}>
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
          <div className="animate-section mb-8">
            <h2 className="text-[16px] font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
              Tech Stack
            </h2>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="tech-tag px-3 py-1.5 rounded-full text-[12px] font-medium border"
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
          <div className="animate-section">
            <h2 className="text-[16px] font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
              Key Highlights
            </h2>
            <ul className="space-y-3">
              {project.highlights.map((h, j) => (
                <li
                  key={j}
                  className="highlight-card flex gap-2 text-[14px] leading-relaxed p-3 rounded-lg border"
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
    </div>
  );
}
