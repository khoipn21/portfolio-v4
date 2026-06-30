'use client';

import { openSourcePRs } from '@/data/blogs-data';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

type FilterType = 'merged' | 'open' | 'closed';

export default function PullRequestsPage() {
  const [filterType, setFilterType] = useState<FilterType>('merged');

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
    <div
      className="relative min-h-[100dvh] w-full overflow-x-hidden transition-colors duration-300"
      style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
    >
      <div className="mx-auto max-w-3xl px-4 py-12">
        {/* Back link */}
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1.5 text-[13px] font-medium transition-colors duration-200"
          style={{ color: 'var(--text-tertiary)' }}
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to home
        </Link>

        <h1
          className="mb-2 text-[28px] font-bold tracking-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          Pull Requests
        </h1>
        <p className="mb-8 text-[14px]" style={{ color: 'var(--text-tertiary)' }}>
          My open source contributions and pull requests.
        </p>

        {/* Filter Toggle */}
        <div className="mb-8 flex items-center gap-2">
          <div
            className="relative grid w-fit grid-cols-3 rounded-[6px] border p-1 select-none"
            style={{
              background: 'var(--bg-card)',
              borderColor: 'var(--border-accent)',
            }}
          >
            <div
              className="absolute top-1 bottom-1 left-1 w-[calc((100%-8px)/3)] rounded-[4px] border transition-transform duration-300 ease-[cubic-bezier(0.33,1,0.68,1)]"
              style={{
                background: 'var(--bg-secondary)',
                borderColor: 'var(--border-secondary)',
                transform: `translateX(${
                  filterType === 'merged' ? '0%' : filterType === 'open' ? '100%' : '200%'
                })`,
              }}
            />

            {(['merged', 'open', 'closed'] as FilterType[]).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className="relative z-10 px-4 py-2 text-center text-[13px] font-medium capitalize transition-colors duration-200"
                style={{
                  color: filterType === type ? 'var(--text-primary)' : 'var(--text-tertiary)',
                }}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* PR List */}
        <div className="space-y-2">
          {filteredPRs.length > 0 ? (
            filteredPRs.map((pr, idx) => {
              const colors = stateColors[pr.state] || stateColors.merged;

              return (
                <a
                  key={idx}
                  href={pr.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block rounded-lg border p-4 transition-all duration-200"
                  style={{
                    background: 'var(--bg-card)',
                    borderColor: 'var(--border-accent)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-primary)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-accent)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-1 h-3 w-3 shrink-0 rounded-full ${colors.dot} ${colors.glow}`}
                    />
                    <div className="min-w-0 flex-1">
                      <h3
                        className="mb-1 text-[15px] font-semibold transition-colors"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {pr.title}
                      </h3>
                      <div
                        className="flex items-center gap-3 text-[12px]"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        <span>{pr.repository}</span>
                        <span>·</span>
                        <span>{pr.date}</span>
                        <span>·</span>
                        <span className="capitalize">{pr.state}</span>
                      </div>
                    </div>
                  </div>
                </a>
              );
            })
          ) : (
            <div className="py-12 text-center text-[14px]" style={{ color: 'var(--text-muted)' }}>
              No {filterType} pull requests found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
