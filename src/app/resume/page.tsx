"use client";

import { experiences, education, skills, userData } from "@/data/user-data";
import { ArrowLeft, Download, MapPin, Calendar, Mail, Phone, Globe } from "lucide-react";
import { SiGithub } from "react-icons/si";
import Link from "next/link";

export default function ResumePage() {
  return (
    <div
      className="min-h-[100dvh] w-full relative overflow-x-hidden transition-colors duration-300"
      style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}
    >
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Back link */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium transition-colors duration-200"
            style={{ color: "var(--text-tertiary)" }}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to home
          </Link>
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-medium border transition-colors duration-200"
            style={{
              background: "var(--bg-card)",
              borderColor: "var(--border-accent)",
              color: "var(--text-secondary)",
            }}
            onClick={() => window.print()}
          >
            <Download className="w-3.5 h-3.5" />
            Download PDF
          </button>
        </div>

        {/* Resume content */}
        <div
          className="rounded-xl border p-8 sm:p-12"
          style={{
            background: "var(--bg-card)",
            borderColor: "var(--border-accent)",
            boxShadow: "var(--shadow-md)",
          }}
        >
          {/* Header */}
          <div className="text-center mb-8 pb-8 border-b" style={{ borderColor: "var(--border-accent)" }}>
            <h1 className="text-[32px] font-bold tracking-tight mb-2" style={{ color: "var(--text-primary)" }}>
              {userData.name}
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-3 text-[13px]" style={{ color: "var(--text-tertiary)" }}>
              <a href={`mailto:${userData.email}`} className="flex items-center gap-1 hover:underline">
                <Mail className="w-3 h-3" />
                {userData.email}
              </a>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3" />
                {userData.phone}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {userData.location}
              </span>
              <span>•</span>
              <a href={userData.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:underline">
                <SiGithub className="w-3 h-3" />
                {userData.githubUsername}
              </a>
              <span>•</span>
              <a href={userData.portfolio} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:underline">
                <Globe className="w-3 h-3" />
                portfolio.khoipn.id.vn
              </a>
            </div>
          </div>

          {/* About */}
          <section className="mb-8">
            <h2 className="text-[18px] font-bold tracking-tight mb-3 uppercase" style={{ color: "var(--accent-primary)" }}>
              About Me
            </h2>
            <p className="text-[14px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Software engineer focused on React, Next.js, React Native, and TypeScript for e-commerce and proptech products. Strong in authentication, RBAC, API integration, multilingual UX, real-time features, and portal-based web/mobile applications.
            </p>
          </section>

          {/* Skills */}
          <section className="mb-8">
            <h2 className="text-[18px] font-bold tracking-tight mb-3 uppercase" style={{ color: "var(--accent-primary)" }}>
              Technical Skills
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[13px]">
              <div>
                <span className="font-semibold" style={{ color: "var(--text-primary)" }}>Frontend: </span>
                <span style={{ color: "var(--text-secondary)" }}>HTML5, CSS, TypeScript, React, Next.js, React Native, TailwindCSS, Mantine, TanStack Router/Query, Zustand, Jotai</span>
              </div>
              <div>
                <span className="font-semibold" style={{ color: "var(--text-primary)" }}>Backend: </span>
                <span style={{ color: "var(--text-secondary)" }}>NodeJS (ExpressJS), Golang (Gin, Gorilla-WebSocket), REST API integration</span>
              </div>
              <div>
                <span className="font-semibold" style={{ color: "var(--text-primary)" }}>Database: </span>
                <span style={{ color: "var(--text-secondary)" }}>MySQL, PostgreSQL, MongoDB, Redis</span>
              </div>
              <div>
                <span className="font-semibold" style={{ color: "var(--text-primary)" }}>Cloud & DevOps: </span>
                <span style={{ color: "var(--text-secondary)" }}>AWS EC2, AWS S3, Docker, Nginx</span>
              </div>
            </div>
          </section>

          {/* Experience */}
          <section className="mb-8">
            <h2 className="text-[18px] font-bold tracking-tight mb-4 uppercase" style={{ color: "var(--accent-primary)" }}>
              Work Experience
            </h2>
            <div className="space-y-6">
              {experiences.map((exp, i) => (
                <div key={i}>
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-2">
                    <div>
                      <h3 className="text-[15px] font-semibold" style={{ color: "var(--text-primary)" }}>
                        {exp.role}
                      </h3>
                      <p className="text-[14px] font-medium" style={{ color: "var(--accent-primary)" }}>
                        {exp.company}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-[12px] shrink-0" style={{ color: "var(--text-muted)" }}>
                      <Calendar className="w-3 h-3" />
                      {exp.period}
                    </div>
                  </div>
                  <ul className="space-y-1.5 ml-4">
                    {exp.description.map((desc, j) => (
                      <li key={j} className="flex gap-2 text-[13px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                        <span style={{ color: "var(--text-muted)" }}>–</span>
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
            <h2 className="text-[18px] font-bold tracking-tight mb-4 uppercase" style={{ color: "var(--accent-primary)" }}>
              Education
            </h2>
            <div className="space-y-3">
              {education.map((edu, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
                  <div>
                    <h3 className="text-[15px] font-semibold" style={{ color: "var(--text-primary)" }}>
                      {edu.school}
                    </h3>
                    <p className="text-[13px]" style={{ color: "var(--text-secondary)" }}>
                      {edu.major}
                      {edu.note && (
                        <span className="ml-1 text-[12px]" style={{ color: "var(--accent-primary)" }}>
                          ({edu.note})
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-[12px] shrink-0" style={{ color: "var(--text-muted)" }}>
                    <Calendar className="w-3 h-3" />
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
