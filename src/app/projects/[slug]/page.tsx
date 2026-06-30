'use client';

import { projects } from '@/data/user-data';
import { ExternalLink, ArrowLeft, ChevronRight } from 'lucide-react';
import { SiGithub } from 'react-icons/si';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '@/lib/text-split';

gsap.registerPlugin(ScrollTrigger);

export default function ProjectDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const project = projects.find((p) => p.slug === slug);

  const contentRef = useRef<HTMLDivElement>(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (!project || !contentRef.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const sections = contentRef.current?.querySelectorAll('.animate-section');
      if (sections) {
        gsap.fromTo(
          sections,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.12,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: contentRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, contentRef);

    return () => ctx.revert();
  }, [project]);

  if (!project) {
    return (
      <div
        className="flex min-h-[100dvh] items-center justify-center"
        style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
      >
        <div className="text-center">
          <h1 className="display-lg mb-4">Project not found</h1>
          <Link
            href="/projects"
            className="eyebrow transition-colors duration-200"
            style={{ color: 'var(--accent-primary)' }}
          >
            Back to projects
          </Link>
        </div>
      </div>
    );
  }

  const hasImage = project.image && !imageError;

  return (
    <div className="relative min-h-[100dvh] w-full overflow-x-hidden bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <div className="cinema-container py-12">
        {/* Back link */}
        <Link
          href="/projects"
          className="mb-10 inline-flex items-center gap-2 text-[12px] font-medium tracking-[0.15em] uppercase transition-colors duration-200"
          style={{ color: 'var(--text-muted)' }}
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Projects
        </Link>

        {/* Hero banner */}
        <div
          className="relative mb-10 h-64 overflow-hidden rounded-[1.5rem] md:h-80"
          style={{ background: 'var(--gradient-hero)' }}
        >
          {hasImage ? (
            <Image
              src={project.image!}
              alt={project.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 1440px"
              onError={() => setImageError(true)}
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
                  className="font-mono text-[16px] tracking-widest uppercase"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {project.title}
                </span>
              </div>
            </>
          )}
          {/* Gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to top, var(--bg-primary) 0%, transparent 50%)`,
            }}
          />
        </div>

        {/* Content */}
        <div ref={contentRef}>
          {/* Header */}
          <div className="mb-8">
            <p className="act-label mb-4">
              <span className="act-num">CASE STUDY</span>
            </p>
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="flex-1">
                <h1 className="display-lg" style={{ color: 'var(--text-primary)' }}>
                  {project.title}
                </h1>
                <p className="lead mt-4">{project.description}</p>
              </div>
              <div className="flex shrink-0 items-center gap-3 pt-2">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-full border px-4 py-2 text-[12px] font-medium transition-all duration-300 hover:scale-[1.03]"
                    style={{
                      background: 'var(--bg-card)',
                      borderColor: 'var(--border-secondary)',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    <SiGithub className="h-3.5 w-3.5" />
                    Source
                  </a>
                )}
                {project.live && (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-full px-4 py-2 text-[12px] font-medium transition-all duration-300 hover:scale-[1.03]"
                    style={{
                      background: 'var(--accent-primary)',
                      color: 'white',
                    }}
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Live
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="animate-section mb-10">
            <h2
              className="mb-4 text-[14px] font-semibold tracking-[0.1em] uppercase"
              style={{ color: 'var(--text-tertiary)' }}
            >
              Tech Stack
            </h2>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="rounded-full px-3 py-1.5 text-[12px] font-medium"
                  style={{
                    border: '1px solid var(--border-accent)',
                    color: 'var(--text-secondary)',
                    background: 'var(--bg-secondary)',
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Key Highlights */}
          <div className="animate-section">
            <h2
              className="mb-4 text-[14px] font-semibold tracking-[0.1em] uppercase"
              style={{ color: 'var(--text-tertiary)' }}
            >
              Key Highlights
            </h2>
            <ul className="space-y-3">
              {project.highlights.map((h, j) => (
                <li
                  key={j}
                  className="flex gap-3 rounded-[1rem] border p-5 text-[14px] leading-relaxed transition-all duration-300"
                  style={{
                    color: 'var(--text-secondary)',
                    background: 'var(--bg-card)',
                    borderColor: 'var(--border-secondary)',
                  }}
                >
                  <ChevronRight
                    className="mt-0.5 h-4 w-4 shrink-0"
                    style={{ color: 'var(--accent-primary)' }}
                  />
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
