'use client';

import { useLenis } from 'lenis/react';
import { useChapterActive } from '@/hooks/use-cinematic-gsap';

const ACTS = [
  { id: 'act-1', label: 'Opening' },
  { id: 'act-2', label: 'The Work' },
  { id: 'act-3', label: 'Builds' },
  { id: 'act-4', label: 'Toolbelt' },
  { id: 'act-5', label: 'Transmission' },
] as const;

const dottedLineMask =
  'repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 6px)';

/**
 * ACT chapter rail — five ticks for the five acts. Active tick follows
 * scroll via useChapterActive (ScrollTrigger-based, robust with pinned
 * scenes). Clicking a tick smooth-scrolls via Lenis.
 */
export function RightNavbar() {
  const activeId = useChapterActive(ACTS.map((a) => a.id));
  const lenis = useLenis();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el && lenis) {
      lenis.scrollTo(el, { offset: 0, duration: 1.4 });
    } else if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed top-1/2 right-5 z-50 hidden -translate-y-1/2 flex-col items-end gap-4 lg:flex">
      {/* Vertical dotted rail */}
      <div
        className="pointer-events-none absolute top-0 right-[5px] bottom-0 w-0 border-r"
        style={{
          borderColor: 'var(--border-accent)',
          maskImage: dottedLineMask,
          WebkitMaskImage: dottedLineMask,
        }}
      />

      {ACTS.map((act) => {
        const isActive = activeId === act.id;
        return (
          <a
            key={act.id}
            href={`#${act.id}`}
            onClick={(e) => handleClick(e, act.id)}
            className="group relative flex items-center gap-3"
            aria-label={act.label}
            aria-current={isActive ? 'true' : undefined}
          >
            <span
              className="translate-x-2 text-[10px] font-medium tracking-[0.1em] uppercase opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
              style={{ color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)' }}
            >
              {act.label}
            </span>
            <div
              className="relative z-10 h-[10px] w-[10px] rounded-full border-2 transition-all duration-300"
              style={{
                borderColor: isActive ? 'var(--accent-primary)' : 'var(--border-primary)',
                background: isActive ? 'var(--accent-primary)' : 'var(--bg-primary)',
                boxShadow: isActive ? '0 0 8px var(--accent-glow)' : 'none',
              }}
            />
          </a>
        );
      })}
    </div>
  );
}
