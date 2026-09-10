'use client';

import { useRef, type ReactNode } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

export function PortfolioMotion({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add(
        '(prefers-reduced-motion: no-preference)',
        () => {
          const root = scope.current;
          if (!root) return;
          root.querySelectorAll<HTMLElement>('[data-panel-reveal]').forEach((element) => {
            SplitText.create(element, {
              type: 'lines,words,chars',
              aria: element.matches('[aria-hidden="true"]') ? 'none' : 'auto',
              autoSplit: true,
              linesClass: 'reveal-line',
              charsClass: 'kinetic-char',
              mask: 'lines',
              onSplit(split) {
                return gsap.from(split.chars, {
                  yPercent: 115,
                  rotationX: -70,
                  rotation: 5,
                  transformOrigin: '50% 100%',
                  duration: 0.95,
                  stagger: { amount: 0.55, from: 'start' },
                  ease: 'power3.out',
                  scrollTrigger: { trigger: element, start: 'top 95%', once: true },
                });
              },
            });
          });
          root.querySelectorAll<HTMLElement>('.work-entry').forEach((entry, index) => {
            const preview = entry.querySelector('.work-preview');
            const node = entry.querySelector('.work-node');
            const timeline = gsap.timeline({
              scrollTrigger: { trigger: entry, start: 'top 85%', once: true },
              defaults: { duration: 1, ease: 'power3.out' },
            });
            if (preview)
              timeline.from(
                preview,
                { x: index % 2 ? '-2%' : '2%', y: 20, clearProps: 'transform' },
                0
              );
            if (node) timeline.from(node, { scale: 0.65, duration: 0.6 }, 0.15);
          });
          const illustration = root.querySelector<HTMLElement>('[data-approach-illustration]');
          if (illustration) {
            gsap.from(illustration, {
              y: 24,
              duration: 1,
              ease: 'power3.out',
              clearProps: 'transform',
              scrollTrigger: { trigger: illustration, start: 'top 90%', once: true },
            });
          }
        },
        scope
      );
      let disposed = false;
      document.fonts.ready.then(() => {
        if (!disposed) ScrollTrigger.refresh();
      });
      return () => {
        disposed = true;
        media.revert();
      };
    },
    { scope }
  );
  return <div ref={scope}>{children}</div>;
}
