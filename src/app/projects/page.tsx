'use client';

import { projects } from '@/data/user-data';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { SiGithub } from 'react-icons/si';
import Link from 'next/link';
import Image from 'next/image';
import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '@/lib/text-split';

gsap.registerPlugin(ScrollTrigger);

export default function ProjectsPage() {
  const gridRef = useRef<HTMLDivElement>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (prefersReducedMotion() || !gridRef.current) return;

    const ctx = gsap.context(() => {
      const cards = gridRef.current?.querySelectorAll('.project-card');
      if (cards) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.08,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 88%',
              toggleActions: 'play none none none',
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
    <div className="relative min-h-[100dvh] w-full overflow-x-hidden bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <div className="cinema-container py-12">
        {/* Back link */}
        <Link
          href="/"
          className="mb-10 inline-flex items-center gap-2 text-[12px] font-medium tracking-[0.15em] uppercase transition-colors duration-200"
          style={{ color: 'var(--text-muted)' }}
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Home
        </Link>

        {/* Chapter header */}
        <p className="act-label mb-6">
          <span className="act-num">ACT III</span> &nbsp;BUILDS
        </p>
        <h1 className="display-xl" style={{ color: 'var(--text-primary)' }}>
          All projects.
        </h1>
        <p className="lead mt-5">
          A collection of work across e-commerce, proptech, ed-tech, and developer tools.
        </p>

        {/* Projects Grid */}
        <div ref={gridRef} className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
          {projects.map((project) => {
            const hasImage = project.image && !imageErrors[project.slug];
            const isMurmur = project.slug === 'murmur-chatapp';

            return (
              <Link
                key={project.slug}
                href={`/projects/${project.slug}`}
                className="project-card group block overflow-hidden rounded-[1.25rem] border transition-all duration-500 hover:scale-[1.01]"
                style={{
                  background: 'var(--bg-card)',
                  borderColor: 'var(--border-secondary)',
                  boxShadow: 'var(--shadow-md)',
                }}
              >
                {/* Image Section */}
                <div className="relative h-48 overflow-hidden">
                  {isMurmur ? (
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
                        <div className="relative mb-2 h-12 w-12">
                          <Image
                            src="/images/murmur-logo.png"
                            alt="Murmur Logo"
                            fill
                            className="object-contain"
                            sizes="48px"
                          />
                        </div>
                        <span className="font-mono text-[10px] tracking-widest text-white/60 uppercase">
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
                      style={{ background: 'var(--gradient-hero)' }}
                    >
                      <div
                        className="absolute inset-0 opacity-[0.04]"
                        style={{
                          backgroundImage: `radial-gradient(circle at 1px 1px, var(--text-primary) 1px, transparent 0)`,
                          backgroundSize: '20px 20px',
                        }}
                      />
                      <span
                        className="font-mono text-[13px] tracking-widest uppercase"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        {project.title}
                      </span>
                    </div>
                  )}
                  {/* Gradient fade at bottom of image */}
                  <div
                    className="absolute inset-x-0 bottom-0 h-16"
                    style={{
                      background: `linear-gradient(to top, var(--bg-card), transparent)`,
                    }}
                  />
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <h2
                      className="text-[18px] font-semibold tracking-tight"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {project.title}
                    </h2>
                    <div className="flex shrink-0 items-center gap-2">
                      {project.github && (
                        <button
                          type="button"
                          className="opacity-60 transition-opacity duration-200 hover:opacity-100"
                          style={{ color: 'var(--text-tertiary)' }}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            window.open(project.github, '_blank', 'noopener,noreferrer');
                          }}
                        >
                          <SiGithub className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <p
                    className="mb-5 text-[13px] leading-relaxed"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {project.description}
                  </p>

                  {/* Highlights */}
                  <ul className="mb-5 space-y-2">
                    {project.highlights.slice(0, 2).map((h, j) => (
                      <li
                        key={j}
                        className="flex gap-2 text-[12px] leading-snug"
                        style={{ color: 'var(--text-tertiary)' }}
                      >
                        <ChevronRight
                          className="mt-0.5 h-3 w-3 shrink-0"
                          style={{ color: 'var(--accent-primary)' }}
                        />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Tech tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {project.tech.slice(0, 4).map((t) => (
                      <span
                        key={t}
                        className="rounded-full px-2.5 py-1 text-[10px] font-medium"
                        style={{
                          border: '1px solid var(--border-accent)',
                          color: 'var(--text-tertiary)',
                          background: 'var(--bg-secondary)',
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
