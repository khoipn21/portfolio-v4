'use client';

import { experiences, education } from '@/data/user-data';
import { MapPin, Calendar, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ExperiencePage() {
  return (
    <div
      className="relative min-h-[100dvh] w-full overflow-x-hidden transition-colors duration-300"
      style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
    >
      <div className="mx-auto max-w-3xl px-4 py-12">
        {/* Back link */}
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1.5 text-[13px] font-medium transition-colors duration-200"
          style={{ color: 'var(--text-tertiary)' }}
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to home
        </Link>

        <h1
          className="mb-2 text-[28px] font-bold tracking-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          Experience
        </h1>
        <p className="mb-8 text-[14px]" style={{ color: 'var(--text-tertiary)' }}>
          My professional journey and work history.
        </p>

        {/* Work Experience */}
        <div className="space-y-0">
          {experiences.map((exp, i) => (
            <div key={i} className="border-b py-6" style={{ borderColor: 'var(--border-accent)' }}>
              <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2
                      className="text-[18px] font-semibold"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {exp.role}
                    </h2>
                    {exp.current && (
                      <span
                        className="rounded-full px-2 py-0.5 text-[10px] font-medium tracking-wider uppercase"
                        style={{
                          background: 'var(--accent-glow)',
                          color: 'var(--accent-primary)',
                        }}
                      >
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-[16px] font-medium" style={{ color: 'var(--accent-primary)' }}>
                    {exp.company}
                  </p>
                </div>
                <div
                  className="flex shrink-0 items-center gap-3 text-[13px]"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {exp.period}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {exp.location}
                  </span>
                </div>
              </div>

              <ul className="mt-3 space-y-2">
                {exp.description.map((desc, j) => (
                  <li
                    key={j}
                    className="flex gap-2 text-[14px] leading-relaxed"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    <span style={{ color: 'var(--text-muted)' }}>•</span>
                    <span>{desc}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex flex-wrap gap-2">
                {exp.tech.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border px-2.5 py-1 text-[11px] font-medium"
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
          ))}
        </div>

        {/* Education */}
        <h2
          className="mt-12 mb-4 text-[22px] font-bold tracking-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          Education
        </h2>
        <div className="space-y-4">
          {education.map((edu, i) => (
            <div
              key={i}
              className="rounded-lg border p-4"
              style={{
                background: 'var(--bg-card)',
                borderColor: 'var(--border-accent)',
              }}
            >
              <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3
                    className="text-[16px] font-semibold"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {edu.school}
                  </h3>
                  <p className="text-[14px]" style={{ color: 'var(--text-secondary)' }}>
                    {edu.major}
                    {edu.note && (
                      <span className="ml-2 text-[12px]" style={{ color: 'var(--accent-primary)' }}>
                        ({edu.note})
                      </span>
                    )}
                  </p>
                </div>
                <div
                  className="flex shrink-0 items-center gap-3 text-[12px]"
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
