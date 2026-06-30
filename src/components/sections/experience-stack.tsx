'use client';

import { Building2, MapPin } from 'lucide-react';
import { experiences } from '@/data/user-data';
import { useStickyStack } from '@/hooks/use-cinematic-gsap';

/**
 * ACT II — The Work.
 * Sticky stacking chapter-cards. Each experience is a full chapter card that
 * sticks near the top; as the next card scrolls up to cover it, the current
 * one recedes (scale down + dim) via useStickyStack. The scroll itself is the
 * disclosure — no click needed (Podium-style emergence).
 */
export function ExperienceStack() {
  const stackRef = useStickyStack({ selector: '[data-stack-card]', scale: 0.95, dim: 0.55 });

  return (
    <section id="act-2" className="relative w-full" aria-label="Work experience">
      {/* Act intro */}
      <div className="cinema-container pt-[14vh] pb-[8vh]">
        <p className="act-label">
          <span className="act-num">ACT II</span> &nbsp;THE WORK
        </p>
        <h2 className="display-xl mt-6" style={{ color: 'var(--text-primary)' }}>
          Where I&apos;ve put in the hours.
        </h2>
        <p className="lead mt-5">
          Three chapters of shipping software — from outsourced product work to freelance builds.
        </p>
      </div>

      {/* Stacking chapters */}
      <div
        ref={stackRef as React.RefObject<HTMLDivElement>}
        className="cinema-container flex flex-col gap-6 pb-[18vh]"
      >
        {experiences.map((exp, i) => (
          <article
            key={i}
            data-stack-card
            className="sticky top-[8vh] rounded-[1.5rem] p-7 md:p-10"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-secondary)',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="eyebrow">
                Chapter {String(i + 1).padStart(2, '0')} · {exp.period}
              </span>
              {exp.current && (
                <span
                  className="flex items-center gap-1.5 text-[11px] font-medium tracking-[0.2em] uppercase"
                  style={{ color: 'var(--accent-primary)' }}
                >
                  <span
                    className="h-1.5 w-1.5 animate-pulse rounded-full"
                    style={{ background: 'var(--accent-primary)' }}
                  />
                  Now
                </span>
              )}
            </div>

            <h3 className="display-lg mt-5" style={{ color: 'var(--text-primary)' }}>
              {exp.role}
            </h3>

            <div
              className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[14px]"
              style={{ color: 'var(--text-tertiary)' }}
            >
              <span className="flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5" style={{ color: 'var(--accent-primary)' }} />
                {exp.company}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                {exp.location}
              </span>
            </div>

            <ul className="mt-6 space-y-2.5">
              {exp.description.map((desc, j) => (
                <li
                  key={j}
                  className="flex gap-3 text-[14px] leading-relaxed md:text-[15px]"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <span
                    className="mt-2 h-1 w-1 shrink-0 rounded-full"
                    style={{ background: 'var(--accent-primary)' }}
                  />
                  <span>{desc}</span>
                </li>
              ))}
            </ul>

            <div className="mt-7 flex flex-wrap gap-1.5">
              {exp.tech.map((t) => (
                <span
                  key={t}
                  className="rounded-full px-2.5 py-1 text-[11px] font-medium"
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
          </article>
        ))}
      </div>
    </section>
  );
}
