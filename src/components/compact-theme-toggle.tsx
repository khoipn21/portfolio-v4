'use client';

import { useTheme } from 'next-themes';
import { useSyncExternalStore } from 'react';
import { Leaf, Moon, Sun } from '@/components/icons';

const THEMES = [
  { value: 'dark', label: 'Dark' },
  { value: 'light', label: 'Light' },
  { value: 'mint', label: 'Mint' },
] as const;

const subscribe = () => () => {};

export function CompactThemeToggle({ className = '' }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );

  const index = Math.max(
    0,
    THEMES.findIndex((t) => t.value === theme)
  );
  const current = THEMES[index];
  const next = THEMES[(index + 1) % THEMES.length];

  return (
    <button
      type="button"
      className={`theme-control ${className}`}
      disabled={!mounted}
      aria-label={
        mounted ? `Color theme: ${current.label}. Switch to ${next.label}` : 'Color theme'
      }
      title={mounted ? `Switch to ${next.label} theme` : undefined}
      onClick={() => setTheme(next.value)}
    >
      <Moon aria-hidden="true" size={20} />
      <Sun aria-hidden="true" size={20} />
      <Leaf aria-hidden="true" size={20} />
    </button>
  );
}
