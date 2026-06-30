'use client';

import { useRef, useEffect } from 'react';
import { useScrollVelocity } from '@/hooks/use-scroll-velocity';
import gsap from 'gsap';

/**
 * Thin accent-colored progress bar at the top of the viewport.
 * Width bound to scroll progress (0-100%).
 * Uses gsap.quickTo to avoid creating a new tween every frame.
 * Respects prefers-reduced-motion (static full-width).
 */
export function ScrollProgress() {
  const { progress } = useScrollVelocity();
  const barRef = useRef<HTMLDivElement>(null);
  const scaleToRef = useRef<ReturnType<typeof gsap.quickTo> | null>(null);

  // Initialize quickTo once
  useEffect(() => {
    if (!barRef.current) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      gsap.set(barRef.current, { scaleX: 1 });
      return;
    }

    // Create a reusable tween that gets updated, not recreated
    scaleToRef.current = gsap.quickTo(barRef.current, 'scaleX', {
      duration: 0.3,
      ease: 'power2.out',
    });
  }, []);

  // Update progress without creating new tweens
  useEffect(() => {
    scaleToRef.current?.(progress);
  }, [progress]);

  return (
    <div
      ref={barRef}
      className="pointer-events-none fixed top-0 left-0 z-[200] h-[2px] w-full origin-left"
      style={{
        background: 'var(--accent-primary)',
        transform: 'scaleX(0)',
      }}
    />
  );
}
