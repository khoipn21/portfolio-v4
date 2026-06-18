"use client";

import { userData } from "@/data/user-data";
import { GridLines } from "@/components/layout/grid-lines";
import { TopNavbar } from "@/components/layout/top-navbar";
import { ScrollProgress } from "@/components/layout/scroll-progress";
import { RightNavbar } from "@/components/layout/right-navbar";
import { Banner } from "@/components/sections/banner";
import { ProfileHeader } from "@/components/sections/profile-header";
import { SocialLinks } from "@/components/sections/social-links";
import { SectionDivider } from "@/components/layout/section-divider";
import { ExperienceList } from "@/components/sections/experience-list";
import { ProjectsGrid } from "@/components/sections/projects-grid";
import { GithubGraph } from "@/components/sections/github-graph";
// import { OpenSourceContributions } from "@/components/sections/open-source-contributions";
import { SkillsGrid } from "@/components/sections/skills-grid";
// import { BlogList } from "@/components/sections/blog-list";
import { FooterBackground } from "@/components/sections/footer-background";
import { Calendar, Mail } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-[100dvh] w-full relative overflow-x-hidden transition-colors duration-300 bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* Scroll Progress */}
      <ScrollProgress />

      {/* Navigation */}
      <TopNavbar />
      <RightNavbar />

      {/* Blueprint grid lines */}
      <GridLines />

      {/* Banner */}
      <Banner />

      {/* Profile Header */}
      <ProfileHeader />

      {/* Main Content */}
      <main className="ml-0 mr-0 md:ml-[15%] md:mr-[15%] lg:ml-[30%] lg:mr-[30%] pt-[calc(22vh+160px)] lg:pt-[calc(22vh+112px)] pb-0 px-4 flex flex-col z-10 relative min-h-[100dvh]">
        {/* Bio */}
        <p
          className="text-[14px] sm:text-[15px] leading-relaxed mt-4"
          style={{ color: "var(--text-secondary)" }}
        >
          {userData.bio}
        </p>

        {/* Highlights */}
        <ul
          className="text-[14px] sm:text-[15px] leading-relaxed mt-4 pl-4"
          style={{ color: "var(--text-secondary)" }}
        >
          {userData.highlights.map((h, i) => (
            <li key={i} className="flex gap-1.5">
              <span>•</span>
              <span>{h}</span>
            </li>
          ))}
        </ul>

        {/* Action Buttons - Button-in-Button pattern (high-end visual design) */}
        <div className="flex flex-wrap items-center gap-3 mt-5">
          {/* Primary CTA with nested icon circle */}
          <Link
            href={`mailto:${userData.email}`}
            className="group flex items-center gap-2 pl-4 pr-1.5 py-1.5 rounded-full text-[12px] font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-[1.03] active:scale-[0.98]"
            style={{
              background: "var(--accent-primary)",
              color: "white",
            }}
          >
            <Calendar className="w-3.5 h-3.5" />
            Book an intro call
            {/* Button-in-Button: nested icon circle */}
            <span
              className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-[1px]"
              style={{
                background: "rgba(255,255,255,0.2)",
              }}
            >
              <svg
                viewBox="0 0 24 24"
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                aria-hidden="true"
              >
                <line x1="7" y1="17" x2="17" y2="7"></line>
                <polyline points="7 7 17 7 17 17"></polyline>
              </svg>
            </span>
          </Link>
          {/* Secondary CTA */}
          <Link
            href={`mailto:${userData.email}`}
            className="group flex items-center gap-2 pl-4 pr-1.5 py-1.5 rounded-full text-[12px] font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] border hover:scale-[1.03] active:scale-[0.98]"
            style={{
              background: "var(--bg-card)",
              borderColor: "var(--border-accent)",
              color: "var(--text-tertiary)",
            }}
          >
            <Mail className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
            Send an email
            {/* Button-in-Button: nested icon circle */}
            <span
              className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-[1px]"
              style={{
                background: "var(--bg-secondary)",
              }}
            >
              <svg
                viewBox="0 0 24 24"
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                aria-hidden="true"
              >
                <line x1="7" y1="17" x2="17" y2="7"></line>
                <polyline points="7 7 17 7 17 17"></polyline>
              </svg>
            </span>
          </Link>
        </div>

        {/* Socials */}
        <SocialLinks />

        {/* Experiences */}
        <SectionDivider
          title="Experiences"
          id="experience"
          viewAllHref="/experience"
        >
          <div className="relative pt-6">
            <ExperienceList />
          </div>
        </SectionDivider>

        {/* Projects - Staggered Grid */}
        <SectionDivider title="Projects" id="projects" viewAllHref="/projects">
          <div className="relative pt-6">
            <ProjectsGrid />
          </div>
        </SectionDivider>

        {/* GitHub Graph */}
        <GithubGraph />

        {/* Open Source Contributions - temporarily hidden */}
        {/* <div id="opensource" className="scroll-mt-24">
          <OpenSourceContributions />
        </div> */}

        {/* Skills */}
        <SectionDivider title="Skills & Technologies" id="skills">
          <SkillsGrid />
        </SectionDivider>

        {/* Blogs - temporarily hidden */}
        {/* <SectionDivider title="Blogs" id="blogs" viewAllHref="#" viewAllLabel="View on Medium">
          <BlogList />
        </SectionDivider> */}

        {/* Quote */}
        <div className="mt-12 flex flex-col items-center justify-center relative py-12">
          <div className="max-w-[480px] w-full flex flex-col items-center">
            <h3
              className="text-[16px] font-medium text-center leading-relaxed mb-6 italic"
              style={{ color: "var(--text-tertiary)" }}
            >
              &quot;Do so much work that it would be unreasonable
              <br className="hidden md:block" /> for you to not be
              successful.&quot;
            </h3>
            <div
              className="flex items-center gap-3 text-[10px] font-medium tracking-[0.2em] uppercase"
              style={{ color: "var(--text-muted)" }}
            >
              <div
                className="w-4 h-[1px]"
                style={{ background: "var(--border-secondary)" }}
              />
              ALEX HORMOZI
              <div
                className="w-4 h-[1px]"
                style={{ background: "var(--border-secondary)" }}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex-grow w-[calc(100%+32px)] -mx-4 h-[300px] relative mt-4">
          <FooterBackground />
        </div>
      </main>
    </div>
  );
}
