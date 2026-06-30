'use client';

import { useState } from 'react';
import { openSourcePRs } from '@/data/blogs-data';
import { useStaggerChildren } from '@/hooks/use-gsap';

type FilterType = 'merged' | 'open' | 'closed';

/**
 * Open source contributions with Double-Bezel architecture.
 * Filter toggle with sliding pill animation.
 */
export function OpenSourceContributions() {
  const [filterType, setFilterType] = useState<FilterType>('merged');
  const listRef = useStaggerChildren({ y: 15, stagger: 0.08 });

  const filteredPRs = openSourcePRs.filter((pr) => pr.state === filterType);

  const stateColors: Record<string, { dot: string; glow: string }> = {
    merged: {
      dot: 'bg-purple-500',
      glow: 'shadow-[0_0_8px_rgba(168,85,247,0.4)]',
    },
    open: {
      dot: 'bg-emerald-500',
      glow: 'shadow-[0_0_8px_rgba(16,185,129,0.4)]',
    },
    closed: {
      dot: 'bg-rose-500',
      glow: 'shadow-[0_0_8px_rgba(244,63,94,0.4)]',
    },
  };

  return (
    <div className="flex w-full flex-col">
      <div className="relative flex flex-col justify-between gap-4 py-2 sm:flex-row sm:items-center">
        <h2
          className="text-[18px] font-bold tracking-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          Open Source Contributions
        </h2>

        {/* Filter Toggle - Premium pill design */}
        <div className="relative z-20 flex items-center gap-2">
          <div
            className="relative grid w-fit grid-cols-3 rounded-full border p-1 select-none"
            style={{
              background: 'var(--bg-card)',
              borderColor: 'var(--border-accent)',
              boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.03)',
            }}
          >
            {/* Sliding Pill */}
            <div
              className="absolute top-1 bottom-1 left-1 w-[calc((100%-8px)/3)] rounded-full transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
              style={{
                background: 'var(--accent-primary)',
                opacity: 0.15,
                transform: `translateX(${
                  filterType === 'merged' ? '0%' : filterType === 'open' ? '100%' : '200%'
                })`,
              }}
            />

            {(['merged', 'open', 'closed'] as FilterType[]).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className="relative z-10 rounded-full px-3 py-1.5 text-center text-[12px] font-medium capitalize transition-colors duration-300"
                style={{
                  color: filterType === type ? 'var(--text-primary)' : 'var(--text-tertiary)',
                }}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom line */}
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
        <div className="grid-dot pointer-events-none absolute bottom-0 -left-4 z-20 h-[2px] w-[2px] -translate-x-1/2 translate-y-1/2" />
        <div className="grid-dot pointer-events-none absolute -right-4 bottom-0 z-20 h-[2px] w-[2px] translate-x-1/2 translate-y-1/2" />
      </div>

      <div
        ref={listRef as React.RefObject<HTMLDivElement>}
        className="relative flex flex-col gap-2 pt-4 pb-2"
      >
        {filteredPRs.length > 0 ? (
          filteredPRs.map((pr, idx) => {
            const colors = stateColors[pr.state] || stateColors.merged;

            return (
              <a
                key={idx}
                href={pr.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block"
              >
                {/* Double-Bezel: Outer Shell */}
                <div
                  className="rounded-[0.875rem] p-[1.5px] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
                  style={{ background: 'var(--border-accent)' }}
                >
                  {/* Double-Bezel: Inner Core */}
                  <div
                    className="rounded-[calc(0.875rem-1.5px)] p-4 transition-all duration-500 group-hover:-translate-y-0.5"
                    style={{
                      background: 'var(--bg-card)',
                      boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.03)',
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-2.5 w-2.5 shrink-0 rounded-full ${colors.dot} ${colors.glow}`}
                      />
                      <div className="min-w-0 flex-1">
                        <h3
                          className="truncate text-[14px] font-medium transition-colors duration-300 group-hover:text-[var(--accent-primary)]"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          {pr.title}
                        </h3>
                        <p className="mt-0.5 text-[12px]" style={{ color: 'var(--text-muted)' }}>
                          {pr.repository} · {pr.date}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            );
          })
        ) : (
          <div className="py-8 text-center text-[13px]" style={{ color: 'var(--text-muted)' }}>
            No {filterType} pull requests found.
          </div>
        )}
      </div>
    </div>
  );
}
