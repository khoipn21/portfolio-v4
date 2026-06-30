'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, ArrowRight } from 'lucide-react';
import { SiGithub } from 'react-icons/si';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { projects } from '@/data/user-data';
import { prefersReducedMotion } from '@/lib/text-split';

gsap.registerPlugin(ScrollTrigger);

/**
 * ACT III — Builds.
 * Pinned horizontal filmstrip: an intro panel, one panel per project, and an
 * outro "view all" panel slide sideways as you scroll. Inner content reveals
 * are tied to the horizontal tween via containerAnimation.
 *
 * Touch fallback: no pin — native overflow-x scroll with CSS scroll-snap.
 */
export function ProjectsFilmstrip() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !sectionRef.current) return;
      const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

      const section = sectionRef.current;
      const track = section.querySelector('[data-filmstrip-track]') as HTMLElement | null;
      if (!track) return;

      if (isTouch) {
        track.style.overflowX = 'auto';
        track.style.scrollSnapType = 'x mandatory';
        return;
      }

      const getScrollAmount = () => Math.max(0, track.scrollWidth - section.offsetWidth);
      const panels = track.querySelectorAll('[data-filmstrip-panel]');

      const tween = gsap.to(track, {
        x: () => -getScrollAmount(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${getScrollAmount()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          snap: {
            snapTo: 1 / Math.max(1, panels.length - 1),
            duration: 0.5,
            ease: 'power2.inOut',
          },
        },
      });

      // Inner content reveals tied to horizontal progress
      panels.forEach((panel) => {
        const content = panel.querySelector('[data-panel-content]');
        if (!content) return;
        gsap.fromTo(
          content,
          { autoAlpha: 0.3, y: 30 },
          {
            autoAlpha: 1,
            y: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: panel,
              containerAnimation: tween,
              start: 'left 85%',
              end: 'left 35%',
              scrub: true,
            },
          }
        );
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="act-3"
      className="relative w-full overflow-hidden"
      aria-label="Selected projects"
    >
      <div
        data-filmstrip-track
        className="flex h-[100dvh] items-stretch gap-6 px-[5vw] will-change-transform"
      >
        {/* Intro panel */}
        <div
          data-filmstrip-panel
          className="flex w-[82vw] max-w-[560px] shrink-0 snap-start items-center"
        >
          <div data-panel-content className="flex flex-col">
            <p className="act-label mb-6">
              <span className="act-num">ACT III</span> &nbsp;BUILDS
            </p>
            <h2 className="display-xl" style={{ color: 'var(--text-primary)' }}>
              Selected work, scrolled sideways.
            </h2>
            <p className="lead mt-6">
              A few products I&apos;ve shipped across e-commerce, proptech, ed-tech, and fintech.
            </p>
          </div>
        </div>

        {projects.map((project) => (
          <article
            key={project.slug}
            data-filmstrip-panel
            className="relative flex w-[86vw] max-w-[680px] shrink-0 snap-start flex-col overflow-hidden rounded-[1.25rem]"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-secondary)',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <div className="relative h-[42%] min-h-[180px] w-full overflow-hidden">
              <Image
                src={project.image ?? '/images/project-study.png'}
                alt={`${project.title} preview`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 86vw, 680px"
              />
            </div>
            <div data-panel-content className="flex flex-1 flex-col gap-3 p-6">
              <h3 className="display-md" style={{ color: 'var(--text-primary)' }}>
                {project.title}
              </h3>
              <p
                className="line-clamp-3 text-[14px] leading-relaxed"
                style={{ color: 'var(--text-secondary)' }}
              >
                {project.description}
              </p>
              <div className="mt-auto flex flex-wrap gap-1.5 pt-3">
                {project.tech.slice(0, 5).map((t) => (
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
              <div className="flex items-center justify-between pt-4">
                <Link
                  href={`/projects/${project.slug}`}
                  className="group flex items-center gap-1.5 text-[13px] font-medium transition-colors"
                  style={{ color: 'var(--text-primary)' }}
                >
                  View case
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <div className="flex items-center gap-3">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${project.title} on GitHub`}
                      className="opacity-70 transition-opacity hover:opacity-100"
                      style={{ color: 'var(--text-tertiary)' }}
                    >
                      <SiGithub className="h-4 w-4" />
                    </a>
                  )}
                  {project.live && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${project.title} live demo`}
                      className="opacity-70 transition-opacity hover:opacity-100"
                      style={{ color: 'var(--text-tertiary)' }}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </article>
        ))}

        {/* Outro panel */}
        <div
          data-filmstrip-panel
          className="flex w-[82vw] max-w-[560px] shrink-0 snap-start items-center"
        >
          <div data-panel-content className="flex flex-col gap-5">
            <p className="eyebrow">Not the finish line</p>
            <h2 className="display-lg" style={{ color: 'var(--text-primary)' }}>
              There&apos;s more where this came from.
            </h2>
            <Link
              href="/projects"
              className="group inline-flex w-fit items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-medium transition-all duration-300 hover:scale-[1.03]"
              style={{ background: 'var(--accent-primary)', color: 'white' }}
            >
              View all projects
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
