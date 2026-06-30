'use client';

import { useEffect, useRef } from 'react';

interface CrtOverlayProps {
  /** "hero" = subtle scanlines + grain + vignette; "finale" = stronger scanline collapse. */
  variant?: 'hero' | 'finale';
  className?: string;
}

/**
 * CRT scanline + grain + vignette overlay. Used ONLY on Act I (hero) and
 * Act V (finale) per the hybrid aesthetic decision.
 *
 * Purely decorative: aria-hidden, pointer-events-none, fixed to the section
 * via absolute inset-0 (caller positions the relative parent).
 * Theme-aware + reduced-motion: hidden entirely when reduced motion is set.
 */
export function CrtOverlay({ variant = 'hero', className = '' }: CrtOverlayProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      ref.current.style.display = 'none';
    }
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`crt-overlay crt-overlay--${variant} pointer-events-none absolute inset-0 ${className}`}
    />
  );
}
