'use client';

import { experiences, education, userData } from '@/data/user-data';
import { ArrowLeft, Download, MapPin, Calendar, Mail, Phone, Globe } from 'lucide-react';
import { SiGithub } from 'react-icons/si';
import Link from 'next/link';

export default function ResumePage() {
  return (
    <div
      className="relative min-h-[100dvh] w-full overflow-x-hidden transition-colors duration-300"
      style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
    >
      <div className="mx-auto max-w-3xl px-4 py-12">
        {/* Back link */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium transition-colors duration-200"
            style={{ color: 'var(--text-tertiary)' }}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to home
          </Link>
          <a
            href="https://cdn.khoipn.com/resume/KhoiPham_Resume.pdf"
            download
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-[12px] font-medium transition-colors duration-200"
            style={{
              background: 'var(--bg-card)',
              borderColor: 'var(--border-accent)',
              color: 'var(--text-secondary)',
            }}
          >
            <Download className="h-3.5 w-3.5" />
            Download PDF
          </a>
        </div>

        {/* Resume content */}
        <div
          className="rounded-xl border p-8 sm:p-12"
          style={{
            background: 'var(--bg-card)',
            borderColor: 'var(--border-accent)',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          {/* Header */}
          <div
            className="mb-8 border-b pb-8 text-center"
            style={{ borderColor: 'var(--border-accent)' }}
          >
            <h1
              className="mb-2 text-[32px] font-bold tracking-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              {userData.name}
            </h1>
            <div
              className="flex flex-wrap items-center justify-center gap-3 text-[13px]"
              style={{ color: 'var(--text-tertiary)' }}
            >
              <a
                href={`mailto:${userData.email}`}
                className="flex items-center gap-1 hover:underline"
              >
                <Mail className="h-3 w-3" />
                {userData.email}
              </a>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                {userData.phone}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {userData.location}
              </span>
              <span>•</span>
              <a
                href={userData.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:underline"
              >
                <SiGithub className="h-3 w-3" />
                {userData.githubUsername}
              </a>
              <span>•</span>
              <a
                href={userData.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:underline"
              >
                <Globe className="h-3 w-3" />
                portfolio.khoipn.com
              </a>
            </div>
          </div>

          {/* About */}
          <section className="mb-8">
            <h2
              className="mb-3 text-[18px] font-bold tracking-tight uppercase"
              style={{ color: 'var(--accent-primary)' }}
            >
              About Me
            </h2>
            <p className="text-[14px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Software engineer focused on React, Next.js, React Native, and TypeScript for
              e-commerce and proptech products. Strong in authentication, RBAC, API integration,
              multilingual UX, real-time features, and portal-based web/mobile applications.
            </p>
          </section>

          {/* Skills */}
          <section className="mb-8">
            <h2
              className="mb-3 text-[18px] font-bold tracking-tight uppercase"
              style={{ color: 'var(--accent-primary)' }}
            >
              Technical Skills
            </h2>
            <div className="grid grid-cols-1 gap-3 text-[13px] sm:grid-cols-2">
              <div>
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Frontend:{' '}
                </span>
                <span style={{ color: 'var(--text-secondary)' }}>
                  HTML5, CSS, TypeScript, React, Next.js, React Native, TailwindCSS, Mantine,
                  TanStack Router/Query, Zustand, Jotai
                </span>
              </div>
              <div>
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Backend:{' '}
                </span>
                <span style={{ color: 'var(--text-secondary)' }}>
                  NodeJS (ExpressJS), Golang (Gin, Gorilla-WebSocket), REST API integration
                </span>
              </div>
              <div>
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Database:{' '}
                </span>
                <span style={{ color: 'var(--text-secondary)' }}>
                  MySQL, PostgreSQL, MongoDB, Redis
                </span>
              </div>
              <div>
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Cloud & DevOps:{' '}
                </span>
                <span style={{ color: 'var(--text-secondary)' }}>
                  AWS EC2, AWS S3, Docker, Nginx
                </span>
              </div>
            </div>
          </section>

          {/* Experience */}
          <section className="mb-8">
            <h2
              className="mb-4 text-[18px] font-bold tracking-tight uppercase"
              style={{ color: 'var(--accent-primary)' }}
            >
              Work Experience
            </h2>
            <div className="space-y-6">
              {experiences.map((exp, i) => (
                <div key={i}>
                  <div className="mb-2 flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3
                        className="text-[15px] font-semibold"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {exp.role}
                      </h3>
                      <p
                        className="text-[14px] font-medium"
                        style={{ color: 'var(--accent-primary)' }}
                      >
                        {exp.company}
                      </p>
                    </div>
                    <div
                      className="flex shrink-0 items-center gap-2 text-[12px]"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      <Calendar className="h-3 w-3" />
                      {exp.period}
                    </div>
                  </div>
                  <ul className="ml-4 space-y-1.5">
                    {exp.description.map((desc, j) => (
                      <li
                        key={j}
                        className="flex gap-2 text-[13px] leading-relaxed"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        <span style={{ color: 'var(--text-muted)' }}>–</span>
                        <span>{desc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Education */}
          <section>
            <h2
              className="mb-4 text-[18px] font-bold tracking-tight uppercase"
              style={{ color: 'var(--accent-primary)' }}
            >
              Education
            </h2>
            <div className="space-y-3">
              {education.map((edu, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between"
                >
                  <div>
                    <h3
                      className="text-[15px] font-semibold"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {edu.school}
                    </h3>
                    <p className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>
                      {edu.major}
                      {edu.note && (
                        <span
                          className="ml-1 text-[12px]"
                          style={{ color: 'var(--accent-primary)' }}
                        >
                          ({edu.note})
                        </span>
                      )}
                    </p>
                  </div>
                  <div
                    className="flex shrink-0 items-center gap-2 text-[12px]"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    <Calendar className="h-3 w-3" />
                    {edu.period}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
