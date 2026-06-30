'use client';

import { useEffect, useRef, useState } from 'react';
import { userData } from '@/data/user-data';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { prefersReducedMotion } from '@/lib/text-split';

gsap.registerPlugin(ScrollTrigger);

interface Day {
  date: string;
  level: number;
  count: number;
  weekday: number;
  weekIndex: number;
}

interface HeatmapData {
  total: number;
  activeDays: number;
  currentStreak: number;
  longestStreak: number;
  weeks: number;
  days: Day[];
  monthLabels: { weekIndex: number; label: string }[];
}

const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

type Status = 'idle' | 'loading' | 'error' | 'ready';

/**
 * Custom GitHub contribution heatmap.
 * Fetches from /api/github-contributions (Route Handler that scrapes the
 * GitHub contributions page). Renders a theme-aware CSS Grid heatmap with
 * a GSAP scrubbed column-by-column reveal on scroll.
 */
export function GithubGraph() {
  const [status, setStatus] = useState<Status>('idle');
  const [data, setData] = useState<HeatmapData | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const fetchedRef = useRef(false);

  // Lazy fetch — only fires when the section scrolls into view
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    let cancelled = false;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || fetchedRef.current) return;
        fetchedRef.current = true;
        observer.disconnect();
        setStatus('loading');

        (async () => {
          try {
            const res = await fetch('/api/github-contributions');
            if (!res.ok) throw new Error('fetch failed');
            const json = await res.json();
            if (cancelled) return;
            if (json.error) throw new Error(json.error);
            setData(json as HeatmapData);
            setStatus('ready');
          } catch {
            if (!cancelled) setStatus('error');
          }
        })();
      },
      { rootMargin: '300px 0px' }
    );

    observer.observe(el);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, []);

  // Auto-play reveal — cells cascade column-by-column when the grid enters view
  useGSAP(
    () => {
      if (prefersReducedMotion() || !gridRef.current) return;
      const cells = gridRef.current.querySelectorAll('[data-gh-cell]');
      if (!cells.length) return;

      gsap.set(cells, { scale: 0, opacity: 0 });
      gsap.to(cells, {
        scale: 1,
        opacity: 1,
        ease: 'back.out(1.4)',
        duration: 0.4,
        stagger: { each: 0.006, from: 'start' },
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    },
    { scope: gridRef, dependencies: [status] }
  );

  // Build column-major cell array for grid-auto-flow: column
  const cells: (Day | null)[] = [];
  if (data) {
    const map = new Map<string, Day>();
    for (const d of data.days) map.set(`${d.weekIndex}-${d.weekday}`, d);
    for (let w = 0; w < data.weeks; w++) {
      for (let d = 0; d < 7; d++) {
        cells.push(map.get(`${w}-${d}`) ?? null);
      }
    }
  }

  const stats = data
    ? [
        { label: 'Contributions', value: data.total.toLocaleString() },
        { label: 'Current streak', value: `${data.currentStreak}d` },
        { label: 'Longest streak', value: `${data.longestStreak}d` },
      ]
    : [];

  return (
    <div ref={sectionRef} className="relative">
      <div className="mb-6 flex items-baseline justify-between gap-4">
        <h3 className="display-md" style={{ color: 'var(--text-primary)' }}>
          GitHub Activity
        </h3>
        <a
          href={`https://github.com/${userData.githubUsername}`}
          target="_blank"
          rel="noopener noreferrer"
          className="eyebrow transition-opacity hover:opacity-70"
          style={{ color: 'var(--accent-primary)' }}
        >
          @{userData.githubUsername}
        </a>
      </div>

      {status === 'ready' && data && (
        <div className="mb-8 flex gap-8">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col gap-1">
              <span className="display-lg" style={{ color: 'var(--text-primary)' }}>
                {s.value}
              </span>
              <span className="eyebrow" style={{ color: 'var(--text-muted)' }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      )}

      {status === 'loading' && (
        <div
          className="overflow-hidden rounded-[1rem] border p-6"
          style={{ borderColor: 'var(--border-secondary)', background: 'var(--bg-card)' }}
        >
          <div className="flex gap-2">
            <div className="flex flex-col gap-[3px]">
              {DAY_LABELS.map((d, i) => (
                <div key={i} className="h-[11px] w-6" />
              ))}
            </div>
            <div
              className="grid opacity-30"
              style={{
                gridAutoFlow: 'column',
                gridTemplateRows: 'repeat(7, 11px)',
                gridAutoColumns: '11px',
                gap: '3px',
              }}
            >
              {Array.from({ length: 7 * 53 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[11px] w-[11px] animate-pulse rounded-[2px]"
                  style={{ background: 'var(--gh-level-0)' }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div
          className="rounded-[1rem] border p-8 text-center"
          style={{ borderColor: 'var(--border-secondary)', background: 'var(--bg-card)' }}
        >
          <p className="lead mb-4" style={{ color: 'var(--text-secondary)' }}>
            Contribution data is temporarily unavailable.
          </p>
          <a
            href={`https://github.com/${userData.githubUsername}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-medium transition-all duration-300 hover:scale-[1.03]"
            style={{ background: 'var(--accent-primary)', color: 'white' }}
          >
            View GitHub profile
          </a>
        </div>
      )}

      {status === 'ready' && data && (
        <div
          className="overflow-hidden rounded-[1rem] border p-6"
          style={{ borderColor: 'var(--border-secondary)', background: 'var(--bg-card)' }}
        >
          <div ref={gridRef} className="overflow-x-auto">
            {/* Month labels */}
            <div className="relative mb-2 h-4" style={{ marginLeft: '28px' }}>
              {data.monthLabels.map((m, i) => (
                <span
                  key={i}
                  className="absolute text-[10px] font-medium"
                  style={{
                    left: `calc(${m.weekIndex} * (var(--gh-cell-size, 11px) + var(--gh-cell-gap, 3px)))`,
                    color: 'var(--text-muted)',
                  }}
                >
                  {m.label}
                </span>
              ))}
            </div>

            {/* Grid: day labels + cells */}
            <div className="flex gap-2">
              <div className="flex flex-col gap-[3px]">
                {DAY_LABELS.map((label, i) => (
                  <div key={i} className="flex h-[11px] items-center">
                    <span
                      className="text-[10px] font-medium"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {label}
                    </span>
                  </div>
                ))}
              </div>

              <div
                className="grid"
                style={{
                  gridAutoFlow: 'column',
                  gridTemplateRows: `repeat(7, var(--gh-cell-size, 11px))`,
                  gridAutoColumns: `var(--gh-cell-size, 11px)`,
                  gap: 'var(--gh-cell-gap, 3px)',
                }}
              >
                {cells.map((cell, i) => (
                  <div
                    key={i}
                    data-gh-cell
                    data-level={cell?.level ?? 0}
                    className="gh-cell"
                    style={{
                      width: 'var(--gh-cell-size, 11px)',
                      height: 'var(--gh-cell-size, 11px)',
                    }}
                    title={
                      cell
                        ? `${cell.count} contribution${cell.count === 1 ? '' : 's'} on ${cell.date}`
                        : ''
                    }
                  />
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="mt-4 flex items-center justify-end gap-2">
              <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                Less
              </span>
              {[0, 1, 2, 3, 4].map((l) => (
                <div
                  key={l}
                  className="gh-cell"
                  data-level={l}
                  style={{
                    width: 'var(--gh-cell-size, 11px)',
                    height: 'var(--gh-cell-size, 11px)',
                  }}
                />
              ))}
              <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                More
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
