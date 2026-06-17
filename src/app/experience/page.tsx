"use client";

import { experiences, education } from "@/data/user-data";
import { MapPin, Calendar, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ExperiencePage() {
  return (
    <div
      className="min-h-[100dvh] w-full relative overflow-x-hidden transition-colors duration-300"
      style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}
    >
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 mb-8 text-[13px] font-medium transition-colors duration-200"
          style={{ color: "var(--text-tertiary)" }}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to home
        </Link>

        <h1 className="text-[28px] font-bold tracking-tight mb-2" style={{ color: "var(--text-primary)" }}>
          Experience
        </h1>
        <p className="text-[14px] mb-8" style={{ color: "var(--text-tertiary)" }}>
          My professional journey and work history.
        </p>

        {/* Work Experience */}
        <div className="space-y-0">
          {experiences.map((exp, i) => (
            <div
              key={i}
              className="py-6 border-b"
              style={{ borderColor: "var(--border-accent)" }}
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-4 mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-[18px] font-semibold" style={{ color: "var(--text-primary)" }}>
                      {exp.role}
                    </h2>
                    {exp.current && (
                      <span
                        className="px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider"
                        style={{
                          background: "var(--accent-glow)",
                          color: "var(--accent-primary)",
                        }}
                      >
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-[16px] font-medium" style={{ color: "var(--accent-primary)" }}>
                    {exp.company}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-[13px] shrink-0" style={{ color: "var(--text-muted)" }}>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {exp.period}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {exp.location}
                  </span>
                </div>
              </div>

              <ul className="space-y-2 mt-3">
                {exp.description.map((desc, j) => (
                  <li key={j} className="flex gap-2 text-[14px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    <span style={{ color: "var(--text-muted)" }}>•</span>
                    <span>{desc}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-2 mt-4">
                {exp.tech.map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-1 rounded-full text-[11px] font-medium border"
                    style={{
                      borderColor: "var(--border-accent)",
                      color: "var(--text-tertiary)",
                      background: "var(--bg-secondary)",
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
        <h2 className="text-[22px] font-bold tracking-tight mt-12 mb-4" style={{ color: "var(--text-primary)" }}>
          Education
        </h2>
        <div className="space-y-4">
          {education.map((edu, i) => (
            <div
              key={i}
              className="p-4 rounded-lg border"
              style={{
                background: "var(--bg-card)",
                borderColor: "var(--border-accent)",
              }}
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
                <div>
                  <h3 className="text-[16px] font-semibold" style={{ color: "var(--text-primary)" }}>
                    {edu.school}
                  </h3>
                  <p className="text-[14px]" style={{ color: "var(--text-secondary)" }}>
                    {edu.major}
                    {edu.note && (
                      <span className="ml-2 text-[12px]" style={{ color: "var(--accent-primary)" }}>
                        ({edu.note})
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-[12px] shrink-0" style={{ color: "var(--text-muted)" }}>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {edu.period}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
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
