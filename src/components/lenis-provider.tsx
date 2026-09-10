'use client';

import { useEffect, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Lenis needs elapsed wall time, not GSAP's compensated animation clock.
gsap.ticker.lagSmoothing(0);

export function LenisProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  useEffect(() => {
    // Touch and reduced motion retain native scrolling.
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const lenis = new Lenis({
        autoRaf: false,
        lerp: 0.085,
        syncTouch: false,
        anchors: !window.matchMedia('(pointer: coarse)').matches,
        stopInertiaOnNavigate: true,
      });
      const releaseKeyboard = (event: KeyboardEvent) => {
        if (
          ['Tab', 'Home', 'End', 'PageUp', 'PageDown', 'ArrowUp', 'ArrowDown', ' '].includes(
            event.key
          )
        ) {
          lenis.scrollTo(window.scrollY, { immediate: true });
        }
      };
      window.addEventListener('keydown', releaseKeyboard);
      const releaseFocus = () => lenis.scrollTo(window.scrollY, { immediate: true });
      window.addEventListener('focusin', releaseFocus, true);
      const update = (time: number) => lenis.raf(time * 1000);
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(update);
      return () => {
        window.removeEventListener('keydown', releaseKeyboard);
        window.removeEventListener('focusin', releaseFocus, true);
        gsap.ticker.remove(update);
        lenis.off('scroll', ScrollTrigger.update);
        lenis.destroy();
      };
    });
    return () => media.revert();
  }, [pathname]);

  return children;
}
