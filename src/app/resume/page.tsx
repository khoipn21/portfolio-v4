'use client';

import { experiences, education, userData } from '@/data/user-data';
import { ArrowLeft, Download, MapPin, Calendar, Mail, Phone, Globe } from 'lucide-react';
import { SiGithub } from 'react-icons/si';
import Link from 'next/link';
import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '@/lib/text-split';

gsap.registerPlugin(ScrollTrigger);

export default function ResumePage() {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion() || !contentRef.current) return;

    const ctx = gsap.context(() => {
      const sections = contentRef.current?.querySelectorAll('.resume-section');
      if (sections) {
        gsap.fromTo(
          sections,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.1,
            duration: 0.6,
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
  }, []);

  return (
    <div className="relative min-h-[100dvh] w-full overflow-x-hidden bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <div className="cinema-container py-12">
        {/* Top bar */}
        <div className="mb-10 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[12px] font-medium tracking-[0.15em] uppercase transition-colors duration-200"
            style={{ color: 'var(--text-muted)' }}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Home
          </Link>
          <a
            href="https://cdn.khoipn.com/resume/KhoiPham_Resume.pdf"
            download
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full px-4 py-2 text-[12px] font-medium transition-all duration-300 hover:scale-[1.03]"
            style={{
              background: 'var(--accent-primary)',
              color: 'white',
            }}
          >
            <Download className="h-3.5 w-3.5" />
            Download PDF
          </a>
        </div>

        {/* Resume card */}
        <div
          className="rounded-[1.5rem] border p-8 sm:p-12"
          style={{
            background: 'var(--bg-card)',
            borderColor: 'var(--border-secondary)',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          <div ref={contentRef}>
            {/* Header */}
            <div className="resume-section mb-10">
              <p className="act-label mb-5">
                <span className="act-num">ACT VI</span> &nbsp;DOSSIER
              </p>
              <h1 className="display-lg" style={{ color: 'var(--text-primary)' }}>
                {userData.name}
              </h1>
              <p className="lead mt-3">{userData.headline}</p>

              {/* Contact strip */}
              <div
                className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[12px]"
                style={{ color: 'var(--text-muted)' }}
              >
                <a
                  href={`mailto:${userData.email}`}
                  className="flex items-center gap-1.5 transition-colors duration-200 hover:underline"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  <Mail className="h-3 w-3" />
                  {userData.email}
                </a>
                <span style={{ color: 'var(--border-primary)' }}>·</span>
                <span className="flex items-center gap-1.5">
                  <Phone className="h-3 w-3" />
                  {userData.phone}
                </span>
                <span style={{ color: 'var(--border-primary)' }}>·</span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3 w-3" />
                  {userData.location}
                </span>
                <span style={{ color: 'var(--border-primary)' }}>·</span>
                <a
                  href={userData.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 transition-colors duration-200 hover:underline"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  <SiGithub className="h-3 w-3" />
                  {userData.githubUsername}
                </a>
                <span style={{ color: 'var(--border-primary)' }}>·</span>
                <a
                  href={userData.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 transition-colors duration-200 hover:underline"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  <Globe className="h-3 w-3" />
                  portfolio.khoipn.com
                </a>
              </div>
            </div>

            {/* About */}
            <section className="resume-section mb-10">
              <h2
                className="mb-3 text-[14px] font-semibold tracking-[0.1em] uppercase"
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
            <section className="resume-section mb-10">
              <h2
                className="mb-4 text-[14px] font-semibold tracking-[0.1em] uppercase"
                style={{ color: 'var(--accent-primary)' }}
              >
                Technical Skills
              </h2>
              <div className="grid grid-cols-1 gap-4 text-[13px] sm:grid-cols-2">
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
            <section className="resume-section mb-10">
              <h2
                className="mb-5 text-[14px] font-semibold tracking-[0.1em] uppercase"
                style={{ color: 'var(--accent-primary)' }}
              >
                Work Experience
              </h2>
              <div className="space-y-7">
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
                          <span
                            className="mt-1.5 h-1 w-1 shrink-0 rounded-full"
                            style={{ background: 'var(--accent-primary)' }}
                          />
                          <span>{desc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* Education */}
            <section className="resume-section">
              <h2
                className="mb-5 text-[14px] font-semibold tracking-[0.1em] uppercase"
                style={{ color: 'var(--accent-primary)' }}
              >
                Education
              </h2>
              <div className="space-y-4">
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
    </div>
  );
}
