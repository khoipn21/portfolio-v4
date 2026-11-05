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
          root.querySelectorAll<HTMLElement>('[data-word-reveal]').forEach((element) => {
            SplitText.create(element, {
              type: 'words',
              wordsClass: 'reveal-word',
              autoSplit: true,
              onSplit(split) {
                // Words light up one at a time as the heading crosses the trigger
                // band; CSS eases each word from the muted tone to its final color.
                const words = split.words as HTMLElement[];
                return ScrollTrigger.create({
                  trigger: element,
                  start: 'top 82%',
                  end: 'bottom 48%',
                  onUpdate({ progress }) {
                    const lit = Math.round(progress * words.length);
                    words.forEach((word, index) => word.classList.toggle('is-lit', index < lit));
                  },
                });
              },
            });
          });
          root.querySelectorAll<HTMLElement>('.work-entry').forEach((entry, index) => {
            const image = entry.querySelector('.work-preview img');
            if (image)
              gsap.from(image, {
                clipPath: index % 2 ? 'inset(0 100% 0 0)' : 'inset(0 0 0 100%)',
                duration: 1.2,
                ease: 'power3.inOut',
                clearProps: 'clipPath',
                scrollTrigger: { trigger: entry, start: 'top 85%', once: true },
              });
          });
          root.querySelectorAll<HTMLElement>('.career-entry').forEach((entry) => {
            gsap.from(entry.querySelectorAll('.career-delivery li'), {
              y: 28,
              duration: 0.8,
              stagger: 0.14,
              ease: 'power3.out',
              clearProps: 'transform',
              scrollTrigger: { trigger: entry, start: 'top 85%', once: true },
            });
          });
          const awardVideo = root.querySelector<HTMLElement>('.award-preview');
          if (awardVideo) {
            gsap.from(awardVideo, {
              clipPath: 'inset(12% 6% 12% 6%)',
              duration: 1.2,
              ease: 'power3.inOut',
              clearProps: 'clipPath',
              scrollTrigger: { trigger: awardVideo, start: 'top 85%', once: true },
            });
          }
          const awardFacts = root.querySelectorAll<HTMLElement>('.award-facts > div');
          if (awardFacts.length) {
            gsap.from(awardFacts, {
              y: 32,
              opacity: 0,
              duration: 0.8,
              stagger: 0.12,
              ease: 'power3.out',
              clearProps: 'transform,opacity',
              scrollTrigger: { trigger: awardFacts[0], start: 'top 90%', once: true },
            });
          }
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
