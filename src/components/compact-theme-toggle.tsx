'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState, useRef } from 'react';
import { Moon, Sun, Leaf } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const themes = [
  { id: 'dark', label: 'Dark', icon: Moon },
  { id: 'light', label: 'Light', icon: Sun },
  { id: 'mint', label: 'Mint', icon: Leaf },
] as const;

/**
 * Compact single-icon theme toggle that cycles through themes on tap.
 * The icon does a quick spin + fade swap on each change (GSAP).
 * Used on small screens where the 3-pill switcher is too wide.
 */
export function CompactThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const iconRef = useRef<HTMLSpanElement>(null);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setMounted(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const currentIndex = themes.findIndex((t) => t.id === theme);
  const activeIndex = currentIndex === -1 ? 0 : currentIndex;

  // Spin + fade the icon whenever the theme changes
  useGSAP(
    () => {
      if (!mounted || !iconRef.current) return;
      gsap.fromTo(
        iconRef.current,
        { rotation: -90, autoAlpha: 0, scale: 0.6 },
        {
          rotation: 0,
          autoAlpha: 1,
          scale: 1,
          duration: 0.4,
          ease: 'back.out(1.7)',
        }
      );
    },
    { dependencies: [activeIndex, mounted] }
  );

  const handleClick = () => {
    const next = themes[(activeIndex + 1) % themes.length];
    setTheme(next.id);
  };

  if (!mounted) {
    return (
      <div
        className={`h-8 w-8 rounded-full border ${className ?? ''}`}
        style={{
          borderColor: 'var(--border-secondary)',
          background: 'var(--bg-secondary)',
        }}
      />
    );
  }

  const ActiveIcon = themes[activeIndex].icon;

  return (
    <button
      onClick={handleClick}
      className={`flex h-8 w-8 items-center justify-center rounded-full border transition-colors duration-200 ${className ?? ''}`}
      style={{
        borderColor: 'var(--border-secondary)',
        background: 'var(--bg-secondary)',
        color: 'var(--accent-primary)',
      }}
      aria-label={`Theme: ${themes[activeIndex].label}. Tap to switch.`}
      title={`Theme: ${themes[activeIndex].label}`}
    >
      <span ref={iconRef} className="flex items-center justify-center">
        <ActiveIcon className="h-3.5 w-3.5" />
      </span>
    </button>
  );
}
