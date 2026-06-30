'use client';

import { experiences, education } from '@/data/user-data';
import { Building2, MapPin, Calendar, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useStickyStack } from '@/hooks/use-cinematic-gsap';

export default function ExperiencePage() {
  const stackRef = useStickyStack({ selector: '[data-exp-card]', scale: 0.96, dim: 0.5 });

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
          <span className="act-num">ACT II</span> &nbsp;THE WORK
        </p>
        <h1 className="display-xl" style={{ color: 'var(--text-primary)' }}>
          Where I&apos;ve put in the hours.
        </h1>
        <p className="lead mt-5">
          Three chapters of shipping software, from outsourced product work to freelance builds.
        </p>
      </div>

      {/* Stacking experience cards */}
      <div
        ref={stackRef as React.RefObject<HTMLDivElement>}
        className="cinema-container flex flex-col gap-6 pb-16"
      >
        {experiences.map((exp, i) => (
          <article
            key={i}
            data-exp-card
            className="sticky top-[8vh] rounded-[1.5rem] p-7 md:p-10"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-secondary)',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            {/* Chapter marker */}
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

            {/* Role & company */}
            <h2 className="display-lg mt-5" style={{ color: 'var(--text-primary)' }}>
              {exp.role}
            </h2>
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

            {/* Description */}
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

            {/* Tech tags */}
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

      {/* Education section */}
      <div className="cinema-container pb-20">
        <h2
          className="mb-6 text-[14px] font-semibold tracking-[0.1em] uppercase"
          style={{ color: 'var(--text-tertiary)' }}
        >
          Education
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {education.map((edu, i) => (
            <div
              key={i}
              className="rounded-[1.25rem] border p-6"
              style={{
                background: 'var(--bg-card)',
                borderColor: 'var(--border-secondary)',
              }}
            >
              <h3 className="text-[16px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                {edu.school}
              </h3>
              <p className="mt-1 text-[14px]" style={{ color: 'var(--text-secondary)' }}>
                {edu.major}
                {edu.note && (
                  <span className="ml-2 text-[12px]" style={{ color: 'var(--accent-primary)' }}>
                    ({edu.note})
                  </span>
                )}
              </p>
              <div
                className="mt-3 flex flex-wrap items-center gap-3 text-[12px]"
                style={{ color: 'var(--text-muted)' }}
              >
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {edu.period}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {edu.location}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
