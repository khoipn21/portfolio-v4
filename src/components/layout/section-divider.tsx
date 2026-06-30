'use client';

import { type ReactNode } from 'react';
import { AnimatedLine } from './animated-line';

interface SectionDividerProps {
  title: string;
  id: string;
  children: ReactNode;
  showTopLine?: boolean;
  viewAllHref?: string;
  viewAllLabel?: string;
}

/**
 * Reusable section wrapper with blueprint-style dotted dividers,
 * intersection dots, and optional "View All" button.
 * Each horizontal line animates in via GSAP on scroll.
 */
export function SectionDivider({
  title,
  id,
  children,
  showTopLine = true,
  viewAllHref,
  viewAllLabel = 'View All',
}: SectionDividerProps) {
  return (
    <div id={id} className="relative z-10 mt-6 flex scroll-mt-24 flex-col">
      {/* Top line */}
      {showTopLine && (
        <>
          <AnimatedLine className="pointer-events-none absolute top-0 right-0 left-0 h-0 overflow-visible">
            <div
              className="pointer-events-none absolute top-0 right-[-100vw] left-[-100vw] h-0 border-t"
              style={{
                borderColor: 'var(--grid-line)',
                maskImage:
                  'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)',
                WebkitMaskImage:
                  'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)',
              }}
            />
          </AnimatedLine>
          <div className="grid-dot pointer-events-none absolute top-0 -left-4 z-20 h-[2px] w-[2px] -translate-x-1/2 -translate-y-1/2" />
          <div className="grid-dot pointer-events-none absolute top-0 -right-4 z-20 h-[2px] w-[2px] translate-x-1/2 -translate-y-1/2" />
        </>
      )}

      {/* Section header */}
      <div className="relative py-2">
        <h2
          className="text-[18px] font-bold tracking-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          {title}
        </h2>
        <AnimatedLine className="pointer-events-none absolute right-0 bottom-0 left-0 h-0 overflow-visible">
          <div
            className="pointer-events-none absolute right-[-100vw] bottom-0 left-[-100vw] h-0 border-b"
            style={{
              borderColor: 'var(--grid-line)',
              maskImage:
                'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)',
              WebkitMaskImage:
                'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)',
            }}
          />
        </AnimatedLine>
        <div className="grid-dot pointer-events-none absolute bottom-0 -left-4 z-20 h-[2px] w-[2px] -translate-x-1/2 translate-y-1/2" />
        <div className="grid-dot pointer-events-none absolute -right-4 bottom-0 z-20 h-[2px] w-[2px] translate-x-1/2 translate-y-1/2" />
      </div>

      {/* Content */}
      <div className="mt-0 block">{children}</div>

      {/* View All link */}
      {viewAllHref && (
        <div
          className="relative -mx-4 mt-0 flex cursor-pointer justify-center rounded-b-lg px-4 py-4 transition-colors"
          style={{ background: 'transparent' }}
        >
          <AnimatedLine className="pointer-events-none absolute right-0 bottom-0 left-0 h-0 overflow-visible">
            <div
              className="pointer-events-none absolute right-[-100vw] bottom-0 left-[-100vw] h-0 border-b"
              style={{
                borderColor: 'var(--grid-line)',
                maskImage:
                  'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)',
                WebkitMaskImage:
                  'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)',
              }}
            />
          </AnimatedLine>
          <div className="grid-dot pointer-events-none absolute bottom-0 left-0 z-20 h-[2px] w-[2px] -translate-x-1/2 translate-y-1/2" />
          <div className="grid-dot pointer-events-none absolute right-0 bottom-0 z-20 h-[2px] w-[2px] translate-x-1/2 translate-y-1/2" />
          <a href={viewAllHref} className="group relative block">
            <div
              className="pointer-events-none absolute -inset-[5px] rounded-[11px] border transition-colors duration-300"
              style={{ borderColor: 'var(--border-accent)' }}
            />
            <div
              className="relative flex items-center gap-1.5 rounded-[6px] border px-4 py-2 text-[13px] font-medium transition-all duration-300"
              style={{
                background: 'var(--bg-card)',
                borderColor: 'var(--border-accent)',
                color: 'var(--text-secondary)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              {viewAllLabel}
              <svg
                viewBox="0 0 24 24"
                className="h-3.5 w-3.5 transition-colors"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <line x1="7" y1="17" x2="17" y2="7"></line>
                <polyline points="7 7 17 7 17 17"></polyline>
              </svg>
            </div>
          </a>
        </div>
      )}
    </div>
  );
}
