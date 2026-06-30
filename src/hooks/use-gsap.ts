'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// Register ScrollTrigger plugin once
gsap.registerPlugin(ScrollTrigger);

/**
 * Hook for fade-in-up animation on scroll.
 * Uses useGSAP for proper cleanup per GSAP best practices.
 */
export function useScrollFadeIn(
  options: {
    y?: number;
    duration?: number;
    delay?: number;
    start?: string;
    stagger?: number;
  } = {}
) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced || !ref.current) return;

      const { y = 40, duration = 0.8, delay = 0, start = 'top 85%', stagger = 0 } = options;
      const elements = ref.current!.children.length > 0 ? ref.current!.children : [ref.current!];

      gsap.fromTo(
        elements,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration,
          delay,
          stagger,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: ref.current,
            start,
            toggleActions: 'play none none none',
          },
        }
      );
    },
    { scope: ref }
  );

  return ref;
}

/**
 * Hook for parallax effect.
 * Uses scrub to tie animation progress to scroll position.
 */
export function useParallax(speed: number = 0.5) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced || !ref.current) return;

      gsap.to(ref.current, {
        yPercent: speed * 100,
        ease: 'none',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    },
    { scope: ref }
  );

  return ref;
}

/**
 * Hook for staggered children animation.
 * Each child fades in with a delay.
 */
export function useStaggerChildren(
  options: {
    y?: number;
    duration?: number;
    stagger?: number;
    start?: string;
  } = {}
) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced || !ref.current) return;

      const { y = 30, duration = 0.6, stagger = 0.1, start = 'top 85%' } = options;
      const children = ref.current!.children;

      if (children.length === 0) return;

      gsap.fromTo(
        children,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration,
          stagger,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: ref.current,
            start,
            toggleActions: 'play none none none',
          },
        }
      );
    },
    { scope: ref }
  );

  return ref;
}

/**
 * Hook for horizontal line reveal animation.
 */
export function useLineReveal() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced || !ref.current) return;

      gsap.fromTo(
        ref.current,
        { scaleX: 0, transformOrigin: 'left center' },
        {
          scaleX: 1,
          duration: 1,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        }
      );
    },
    { scope: ref }
  );

  return ref;
}

/**
 * Hook for scale-in animation.
 */
export function useScaleIn(
  options: {
    duration?: number;
    delay?: number;
    start?: string;
  } = {}
) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced || !ref.current) return;

      const { duration = 0.6, delay = 0, start = 'top 85%' } = options;

      gsap.fromTo(
        ref.current,
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration,
          delay,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: ref.current,
            start,
            toggleActions: 'play none none none',
          },
        }
      );
    },
    { scope: ref }
  );

  return ref;
}

/**
 * Hook for ScrollTrigger.batch() - efficient batch animation for multiple elements.
 * Use when you have many similar elements that should animate together.
 */
export function useBatchAnimation(
  selector: string,
  options: {
    y?: number;
    duration?: number;
    stagger?: number;
    start?: string;
  } = {}
) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) return;

      const { y = 30, duration = 0.6, stagger = 0.1, start = 'top 85%' } = options;

      ScrollTrigger.batch(selector, {
        onEnter: (elements) => {
          gsap.fromTo(
            elements,
            { opacity: 0, y },
            {
              opacity: 1,
              y: 0,
              duration,
              stagger,
              ease: 'power2.out',
              overwrite: true,
            }
          );
        },
        start,
        once: true,
      });
    },
    { scope: containerRef }
  );

  return containerRef;
}
