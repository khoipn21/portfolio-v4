'use client';

import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { Search, Command, CornerDownLeft, ArrowUp, ArrowDown } from 'lucide-react';
import { useLenis } from 'lenis/react';

interface CommandItem {
  id: string;
  label: string;
  hint: string;
  group: 'acts' | 'pages' | 'external';
  action: () => void;
}

const GROUP_LABELS: Record<string, string> = {
  acts: 'Acts',
  pages: 'Pages',
  external: 'External',
};

/**
 * Command palette (Ctrl+K / Cmd+K).
 * Adapted to the 5-act cinema structure: jump to acts, navigate routes,
 * open external links. Search-filtered, arrow-key navigable, Enter to select.
 *
 * Performance: solid semi-opaque overlay instead of backdrop-blur (the
 * video backgrounds in Act I/V make backdrop-filter extremely expensive).
 * CSS keyframe entry (transform + opacity only) — no GSAP, no jank.
 */
export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const lenis = useLenis();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => setMounted(true), []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K' || e.code === 'KeyK')) {
      e.preventDefault();
      e.stopPropagation();
      setOpen((prev) => !prev);
    }
    if (e.key === 'Escape') setOpen(false);
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [handleKeyDown]);

  // Reset + focus input on open; lock Lenis scroll while open
  useEffect(() => {
    if (open) {
      /* eslint-disable react-hooks/set-state-in-effect */
      setQuery('');
      setActiveIndex(0);
      /* eslint-enable react-hooks/set-state-in-effect */
      requestAnimationFrame(() => inputRef.current?.focus());
      lenis?.stop();
    } else {
      lenis?.start();
    }
  }, [open, lenis]);

  const commands: CommandItem[] = useMemo(() => {
    const scrollToAct = (id: string) => {
      const el = document.getElementById(id);
      if (el && lenis) lenis.scrollTo(el, { offset: 0, duration: 1.2 });
      else if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    return [
      {
        id: 'act-1',
        label: 'Opening',
        hint: 'Act I',
        group: 'acts',
        action: () => scrollToAct('act-1'),
      },
      {
        id: 'act-2',
        label: 'The Work',
        hint: 'Act II',
        group: 'acts',
        action: () => scrollToAct('act-2'),
      },
      {
        id: 'act-3',
        label: 'Builds',
        hint: 'Act III',
        group: 'acts',
        action: () => scrollToAct('act-3'),
      },
      {
        id: 'act-4',
        label: 'Toolbelt',
        hint: 'Act IV',
        group: 'acts',
        action: () => scrollToAct('act-4'),
      },
      {
        id: 'act-5',
        label: 'Transmission',
        hint: 'Act V',
        group: 'acts',
        action: () => scrollToAct('act-5'),
      },
      {
        id: 'projects',
        label: 'All Projects',
        hint: '/projects',
        group: 'pages',
        action: () => router.push('/projects'),
      },
      {
        id: 'experience',
        label: 'Full Experience',
        hint: '/experience',
        group: 'pages',
        action: () => router.push('/experience'),
      },
      {
        id: 'resume',
        label: 'Resume',
        hint: '/resume',
        group: 'pages',
        action: () => router.push('/resume'),
      },
      {
        id: 'contact',
        label: 'Contact',
        hint: '/contact',
        group: 'pages',
        action: () => router.push('/contact'),
      },
      {
        id: 'github',
        label: 'GitHub',
        hint: 'External',
        group: 'external',
        action: () => window.open('https://github.com/khoipn21', '_blank'),
      },
      {
        id: 'linkedin',
        label: 'LinkedIn',
        hint: 'External',
        group: 'external',
        action: () => window.open('https://linkedin.com/in/khoipn21', '_blank'),
      },
      {
        id: 'email',
        label: 'Send an Email',
        hint: 'External',
        group: 'external',
        action: () => window.open('mailto:khoingoc456@gmail.com'),
      },
    ];
  }, [lenis, router]);

  const filtered = useMemo(() => {
    if (!query.trim()) return commands;
    const q = query.toLowerCase();
    return commands.filter(
      (c) => c.label.toLowerCase().includes(q) || c.hint.toLowerCase().includes(q)
    );
  }, [commands, query]);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    setActiveIndex((prev) => Math.min(prev, Math.max(0, filtered.length - 1)));
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [filtered]);

  // Grouped view preserving flat indices for keyboard nav
  const grouped = useMemo(() => {
    const map = new Map<string, { cmd: CommandItem; flatIndex: number }[]>();
    filtered.forEach((cmd, i) => {
      const arr = map.get(cmd.group) ?? [];
      arr.push({ cmd, flatIndex: i });
      map.set(cmd.group, arr);
    });
    return map;
  }, [filtered]);

  const handlePanelKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((prev) => Math.min(prev + 1, filtered.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const cmd = filtered[activeIndex];
        if (cmd) {
          cmd.action();
          setOpen(false);
        }
      }
    },
    [filtered, activeIndex]
  );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Open command menu (Ctrl+K)"
        className="flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-[11px] transition-colors duration-200"
        style={{
          color: 'var(--text-tertiary)',
          borderColor: 'var(--border-accent)',
          background: 'var(--bg-card)',
        }}
      >
        <Search className="h-3 w-3" />
        <span className="hidden sm:inline">Search</span>
        <kbd
          className="hidden items-center gap-0.5 rounded px-1 py-0.5 font-mono text-[9px] sm:inline-flex"
          style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}
        >
          <Command className="h-2.5 w-2.5" />K
        </kbd>
      </button>

      {open &&
        mounted &&
        createPortal(
          <div
            className="cmd-overlay fixed inset-0 z-[300] flex items-start justify-center pt-[18vh]"
            onClick={() => setOpen(false)}
            data-lenis-prevent
          >
            {/* Solid overlay — no backdrop-blur (too expensive over video bg) */}
            <div
              className="absolute inset-0"
              style={{ background: 'color-mix(in srgb, var(--bg-primary) 75%, transparent)' }}
            />
            <div
              className="cmd-panel relative mx-4 w-full max-w-lg overflow-hidden rounded-[1.25rem] border"
              style={{
                background: 'var(--bg-card)',
                borderColor: 'var(--border-secondary)',
                boxShadow: 'var(--shadow-lg)',
              }}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={handlePanelKeyDown}
            >
              {/* Search input */}
              <div
                className="flex items-center gap-3 border-b px-5 py-4"
                style={{ borderColor: 'var(--border-accent)' }}
              >
                <Search className="h-4 w-4 shrink-0" style={{ color: 'var(--text-muted)' }} />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search acts, pages, links..."
                  className="flex-1 bg-transparent text-[15px] outline-none placeholder:text-[var(--text-muted)]"
                  style={{ color: 'var(--text-primary)' }}
                />
                <kbd
                  className="hidden shrink-0 items-center gap-0.5 rounded px-1.5 py-0.5 font-mono text-[9px] sm:inline-flex"
                  style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}
                >
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <div className="max-h-[50vh] overflow-y-auto p-2">
                {filtered.length === 0 && (
                  <div
                    className="px-4 py-8 text-center text-[13px]"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    No results for &quot;{query}&quot;
                  </div>
                )}
                {['acts', 'pages', 'external'].map((group) => {
                  const items = grouped.get(group as CommandItem['group']);
                  if (!items?.length) return null;
                  return (
                    <div key={group} className="mb-1">
                      <div className="px-3 py-2">
                        <span className="act-label">{GROUP_LABELS[group]}</span>
                      </div>
                      {items.map(({ cmd, flatIndex }) => {
                        const isActive = flatIndex === activeIndex;
                        return (
                          <button
                            key={cmd.id}
                            onClick={() => {
                              cmd.action();
                              setOpen(false);
                            }}
                            onMouseEnter={() => setActiveIndex(flatIndex)}
                            className="flex w-full items-center justify-between gap-3 rounded-[0.5rem] px-3 py-2.5 text-left text-[14px] transition-colors duration-100"
                            style={{
                              background: isActive ? 'var(--bg-secondary)' : 'transparent',
                              color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                            }}
                          >
                            <span className="font-medium">{cmd.label}</span>
                            <span
                              className="eyebrow shrink-0"
                              style={{ color: 'var(--text-muted)' }}
                            >
                              {cmd.hint}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
              </div>

              {/* Footer hints */}
              <div
                className="flex items-center justify-between border-t px-5 py-3"
                style={{ borderColor: 'var(--border-accent)' }}
              >
                <div className="flex items-center gap-4">
                  <span
                    className="flex items-center gap-1 text-[10px]"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    <ArrowUp className="h-3 w-3" />
                    <ArrowDown className="h-3 w-3" />
                    Navigate
                  </span>
                  <span
                    className="flex items-center gap-1 text-[10px]"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    <CornerDownLeft className="h-3 w-3" />
                    Open
                  </span>
                </div>
                <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                  {filtered.length} results
                </span>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
