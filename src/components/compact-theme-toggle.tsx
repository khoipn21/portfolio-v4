'use client';

import { useTheme } from 'next-themes';
import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

export function CompactThemeToggle({ className = '' }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );

  return (
    <label className={`theme-control ${className}`}>
      <span className="sr-only">Color theme</span>
      <select
        value={mounted ? theme : 'light'}
        disabled={!mounted}
        onChange={(event) => setTheme(event.target.value)}
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="mint">Mint</option>
      </select>
    </label>
  );
}
