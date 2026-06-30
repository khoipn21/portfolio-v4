'use client';

import { TopNavbar } from '@/components/layout/top-navbar';
import { ScrollProgress } from '@/components/layout/scroll-progress';
import { RightNavbar } from '@/components/layout/right-navbar';
import { HeroScene } from '@/components/sections/hero-scene';
import { ExperienceStack } from '@/components/sections/experience-stack';
import { ProjectsFilmstrip } from '@/components/sections/projects-filmstrip';
import { ToolbeltAct } from '@/components/sections/toolbelt-act';
import { ContactAct } from '@/components/sections/contact-act';

/**
 * Home — a 5-act cinematic scroll story (Lenis + GSAP ScrollTrigger, no 3D).
 *  I  Opening      — pinned hero, char-reveal name, CRT scanlines/grain
 *  II The Work     — sticky stacking experience chapters
 *  III Builds      — pinned horizontal projects filmstrip (snap)
 *  IV Toolbelt     — scrubbed word reveal + skills + GitHub
 *  V  Transmission — quote + contact, CRT finale
 */
export default function Home() {
  return (
    <div className="relative min-h-[100dvh] w-full overflow-x-hidden bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <ScrollProgress />
      <TopNavbar />
      <RightNavbar />

      <main>
        {/* ACT I — Opening */}
        <HeroScene />
        {/* ACT II — The Work */}
        <ExperienceStack />
        {/* ACT III — Builds */}
        <ProjectsFilmstrip />
        {/* ACT IV — Toolbelt */}
        <ToolbeltAct />
        {/* ACT V — Transmission */}
        <ContactAct />
      </main>
    </div>
  );
}
