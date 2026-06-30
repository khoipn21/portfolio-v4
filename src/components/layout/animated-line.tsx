'use client';

import { useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

interface AnimatedLineProps {
  children: ReactNode;
  className?: string;
}

/**
 * Wraps a horizontal dotted line and reveals it with a GSAP
 * scaleX animation when it scrolls into view.
 *
 * The inner line scales from 0 → 1 (left-origin) so dots
 * appear to draw themselves across the viewport.
 */
export function AnimatedLine({ children, className }: AnimatedLineProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced || !ref.current) return;

      const line = ref.current.querySelector('.animated-line-inner');
      if (!line) return;

      gsap.fromTo(
        line,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 92%',
            toggleActions: 'play none none none',
          },
        }
      );
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={className}>
      <div className="animated-line-inner" style={{ transformOrigin: 'left center' }}>
        {children}
      </div>
    </div>
  );
}
