'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { splitText, prefersReducedMotion, type SplitMode } from '@/lib/text-split';

gsap.registerPlugin(ScrollTrigger);

/**
 * Cinematic scroll hooks built on the existing Lenis ↔ ScrollTrigger sync.
 * Lenis drives ScrollTrigger.update() every frame (see lenis-provider.tsx),
 * so scrubbed/pinned scenes stay frame-locked and smooth.
 *
 * Every hook is gated by prefers-reduced-motion (content stays readable).
 */

/**
 * Pin a section and expose scrub progress (0→1) via onUpdate.
 * Used for the hero "camera-push" (scrubbed scale + parallax).
 */
export function usePinnedScene(
  options: {
    end?: string;
    start?: string;
    pin?: boolean;
    onUpdate?: (progress: number) => void;
  } = {}
) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !ref.current) return;
      const { end = '+=120%', start = 'top top', pin = true, onUpdate } = options;

      ScrollTrigger.create({
        trigger: ref.current,
        start,
        end,
        pin,
        scrub: true,
        onUpdate: (self) => onUpdate?.(self.progress),
      });
    },
    { scope: ref }
  );

  return ref;
}

/**
 * Sticky stacking cards. Each [data-stack-card] is position:sticky (CSS);
 * as the next card scrolls up to cover it, the current one recedes
 * (scale down + dim). The last card stays put.
 */
export function useStickyStack(
  options: {
    selector?: string;
    scale?: number;
    dim?: number;
  } = {}
) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !ref.current) return;
      const { selector = '[data-stack-card]', scale = 0.94, dim = 0.5 } = options;
      const cards = ref.current.querySelectorAll(selector);

      cards.forEach((card, i) => {
        if (i === cards.length - 1) return; // last card does not recede
        gsap.to(card, {
          scale,
          autoAlpha: dim,
          ease: 'none',
          scrollTrigger: {
            trigger: cards[i + 1],
            start: 'top bottom',
            end: 'top top',
            scrub: true,
          },
        });
      });
    },
    { scope: ref }
  );

  return ref;
}

/**
 * Pinned horizontal filmstrip. Pins the section and translates the
 * [data-filmstrip-track] horizontally, snapping to each panel.
 *
 * Touch fallback: no pin — native overflow-x scroll with CSS scroll-snap.
 */
export function useHorizontalFilmstrip(
  options: {
    trackSelector?: string;
    snap?: boolean;
  } = {}
) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !ref.current) return;
      const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
      const { trackSelector = '[data-filmstrip-track]', snap = true } = options;

      const section = ref.current;
      const track = section.querySelector(trackSelector) as HTMLElement | null;
      if (!track) return;

      if (isTouch) {
        track.style.overflowX = 'auto';
        track.style.scrollSnapType = 'x mandatory';
        return;
      }

      const getScrollAmount = () => Math.max(0, track.scrollWidth - section.offsetWidth);
      const panelCount = Math.max(1, track.children.length);

      gsap.to(track, {
        x: () => -getScrollAmount(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${getScrollAmount()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          snap: snap
            ? { snapTo: 1 / Math.max(1, panelCount - 1), duration: 0.5, ease: 'power2.inOut' }
            : undefined,
        },
      });
    },
    { scope: ref }
  );

  return ref;
}

/**
 * Scrubbed text reveal. Splits [data-reveal-text] nodes into chars or words
 * and reveals them (y + opacity) tied to scroll progress.
 *
 * IMPORTANT: the caller must wrap each [data-reveal-text] in an
 * overflow-hidden parent so the y-translate reads as a mask wipe.
 */
export function useScrubbedTextReveal(
  options: {
    mode?: SplitMode;
    yPercent?: number;
    start?: string;
    end?: string;
    stagger?: number;
  } = {}
) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !ref.current) return;
      const {
        mode = 'words',
        yPercent = 120,
        start = 'top 82%',
        end = 'bottom 55%',
        stagger = 0.02,
      } = options;

      const root = ref.current;
      const targets: HTMLElement[] = root.hasAttribute('data-reveal-text')
        ? [root]
        : Array.from(root.querySelectorAll('[data-reveal-text]'));

      targets.forEach((target) => {
        const { items } = splitText(target, mode);
        if (!items.length) return;

        gsap.set(items, { yPercent, autoAlpha: 0 });
        gsap.to(items, {
          yPercent: 0,
          autoAlpha: 1,
          ease: 'none',
          stagger: { each: stagger, from: 'start' },
          scrollTrigger: {
            trigger: target,
            start,
            end,
            scrub: true,
          },
        });
      });
    },
    { scope: ref }
  );

  return ref;
}

/**
 * Track which chapter/act is currently active.
 * Uses ScrollTrigger per id (robust with pinned scenes); falls back to
 * IntersectionObserver when reduced motion is requested.
 */
export function useChapterActive(ids: string[]): string {
  const [activeId, setActiveId] = useState<string>(ids[0] ?? '');
  const key = ids.join(',');

  useEffect(() => {
    if (!ids.length) return;

    if (prefersReducedMotion()) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) setActiveId(entry.target.id);
          });
        },
        { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
      );
      ids.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      });
      return () => observer.disconnect();
    }

    const triggers = ids
      .map((id) => {
        const el = document.getElementById(id);
        if (!el) return null;
        return ScrollTrigger.create({
          trigger: el,
          start: 'top 50%',
          end: 'bottom 50%',
          onToggle: (self) => {
            if (self.isActive) setActiveId(id);
          },
        });
      })
      .filter((t): t is ScrollTrigger => t !== null);

    return () => triggers.forEach((t) => t.kill());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return activeId;
}
