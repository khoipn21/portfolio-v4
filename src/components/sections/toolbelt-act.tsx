'use client';

import { SkillsGrid } from './skills-grid';
import { GithubGraph } from './github-graph';
import { useScrubbedTextReveal } from '@/hooks/use-cinematic-gsap';

/**
 * ACT IV — Toolbelt.
 * A scrubbed word-reveal headline leads into the skills inventory and GitHub
 * activity. Reuses the existing SkillsGrid + GithubGraph; the act wrapper just
 * adds the chapter label, cinematic headline, and pacing.
 */
export function ToolbeltAct() {
  const revealRef = useScrubbedTextReveal({ mode: 'words', yPercent: 110, stagger: 0.05 });

  return (
    <section id="act-4" className="relative w-full py-[14vh]" aria-label="Skills and tooling">
      <div className="cinema-container">
        <p className="act-label">
          <span className="act-num">ACT IV</span> &nbsp;TOOLBELT
        </p>

        <div ref={revealRef as React.RefObject<HTMLDivElement>} className="mt-6">
          <h2 className="display-xl" style={{ color: 'var(--text-primary)' }}>
            <span className="reveal-mask">
              <span data-reveal-text>The tools I reach for</span>
            </span>
            <span className="reveal-mask">
              <span data-reveal-text>when something needs to ship.</span>
            </span>
          </h2>
        </div>

        <p className="lead mt-6">
          A working stack honed across product, freelance, and open-source work. Frontend, backend,
          data, and the ops in between.
        </p>

        <div className="mt-14">
          <SkillsGrid />
        </div>

        <div className="mt-16">
          <GithubGraph />
        </div>
      </div>
    </section>
  );
}
