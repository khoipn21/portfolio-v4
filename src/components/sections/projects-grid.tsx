'use client';

import { useRef } from 'react';
import { projects } from '@/data/user-data';
import { ExternalLink, ChevronRight, ArrowUpRight } from 'lucide-react';
import { SiGithub } from 'react-icons/si';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

// All cards equal size
const gridLayouts = [
  { colSpan: '', rowSpan: '', height: 'h-48' },
  { colSpan: '', rowSpan: '', height: 'h-48' },
  { colSpan: '', rowSpan: '', height: 'h-48' },
  { colSpan: '', rowSpan: '', height: 'h-48' },
  { colSpan: '', rowSpan: '', height: 'h-48' },
];

export function ProjectsGrid() {
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced || !gridRef.current) return;

      const cards = gridRef.current.querySelectorAll('.project-card');
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
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 90%',
              toggleActions: 'play none none none',
            },
          }
        );
      });
    },
    { scope: gridRef }
  );

  return (
    <div ref={gridRef} className="grid auto-rows-auto grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
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
              className="block h-full rounded-[1.25rem] p-[2px] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:shadow-lg"
              style={{
                background: 'var(--border-accent)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              {/* Double-Bezel: Inner Core */}
              <div
                className="flex h-full flex-col overflow-hidden rounded-[calc(1.25rem-2px)] transition-all duration-500 group-hover:-translate-y-1"
                style={{
                  background: 'var(--bg-card)',
                  boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.05)',
                }}
              >
                {/* Project image area */}
                <div
                  className={`relative overflow-hidden ${layout.height}`}
                  style={{ background: 'var(--gradient-hero)' }}
                >
                  {project.slug === 'murmur-chatapp' ? (
                    /* Special banner for murmur chatapp */
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]">
                      <div className="absolute inset-0 opacity-10">
                        <div
                          className="absolute inset-0"
                          style={{
                            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)`,
                            backgroundSize: '30px 30px',
                          }}
                        />
                      </div>
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                        <div className="relative mb-3 h-12 w-12">
                          <Image
                            src="/images/murmur-logo.png"
                            alt="Murmur Logo"
                            fill
                            className="object-contain"
                            sizes="48px"
                          />
                        </div>
                        <span className="font-mono text-[11px] tracking-widest text-white/60 uppercase">
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
                          backgroundSize: '20px 20px',
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span
                          className="font-mono text-[11px] tracking-widest uppercase"
                          style={{ color: 'var(--text-muted)' }}
                        >
                          {project.title}
                        </span>
                      </div>
                    </>
                  )}

                  {/* Hover overlay with accent glow */}
                  <div
                    className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-500 group-hover:opacity-100"
                    style={{
                      background: 'color-mix(in srgb, var(--bg-primary) 85%, transparent)',
                    }}
                  >
                    <div
                      className="flex items-center gap-2 rounded-full border px-4 py-2 backdrop-blur-sm"
                      style={{
                        borderColor: 'var(--accent-primary)',
                        background: 'color-mix(in srgb, var(--accent-primary) 10%, transparent)',
                        color: 'var(--accent-primary)',
                      }}
                    >
                      <span className="text-[12px] font-medium">View Project</span>
                      <ArrowUpRight className="h-4 w-4" />
                    </div>
                  </div>

                  {/* Featured badge for first project */}
                  {isFeatured && (
                    <div
                      className="absolute top-3 left-3 rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase backdrop-blur-sm"
                      style={{
                        background: 'color-mix(in srgb, var(--accent-primary) 15%, transparent)',
                        color: 'var(--accent-primary)',
                        border: '1px solid var(--accent-primary)',
                      }}
                    >
                      Featured
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <h3
                      className="text-[15px] font-semibold transition-colors duration-300 group-hover:text-[var(--accent-primary)]"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {project.title}
                    </h3>
                    <div className="flex shrink-0 items-center gap-2">
                      {project.github && (
                        <button
                          type="button"
                          className="transition-all duration-300 hover:scale-110"
                          style={{ color: 'var(--text-muted)' }}
                          aria-label={`View ${project.title} on GitHub`}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            window.open(project.github, '_blank', 'noopener,noreferrer');
                          }}
                        >
                          <SiGithub className="h-4 w-4" />
                        </button>
                      )}
                      {project.live && (
                        <button
                          type="button"
                          className="transition-all duration-300 hover:scale-110"
                          style={{ color: 'var(--text-muted)' }}
                          aria-label={`View ${project.title} live demo`}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            window.open(project.live, '_blank', 'noopener,noreferrer');
                          }}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <p
                    className="mb-3 line-clamp-2 text-[13px] leading-relaxed"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {project.description}
                  </p>

                  <ul className="mb-3 space-y-1">
                    {project.highlights.slice(0, 2).map((h, j) => (
                      <li
                        key={j}
                        className="flex gap-1.5 text-[12px] leading-snug"
                        style={{ color: 'var(--text-tertiary)' }}
                      >
                        <ChevronRight
                          className="mt-0.5 h-3 w-3 shrink-0"
                          style={{ color: 'var(--accent-primary)' }}
                        />
                        <span className="line-clamp-1">{h}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto flex flex-wrap gap-1.5">
                    {project.tech.slice(0, isFeatured ? 6 : 4).map((t) => (
                      <span
                        key={t}
                        className="rounded-full border px-2 py-0.5 text-[10px] font-medium transition-all duration-300 hover:scale-105"
                        style={{
                          borderColor: 'var(--border-accent)',
                          color: 'var(--text-tertiary)',
                          background: 'var(--bg-secondary)',
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
