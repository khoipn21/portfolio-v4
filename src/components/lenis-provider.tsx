"use client";

import { useEffect, type ReactNode } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";

interface LenisProviderProps {
  children: ReactNode;
}

/**
 * Inner component that pipes Lenis scroll events to GSAP ScrollTrigger.
 * Resets scroll position on route change.
 */
function LenisBridge() {
  const pathname = usePathname();
  const lenis = useLenis();

  // Reset scroll position on route change
  useEffect(() => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
      lenis.resize();
      requestAnimationFrame(() => {
        ScrollTrigger.refresh(true);
      });
    }
  }, [pathname, lenis]);

  useLenis(() => {
    ScrollTrigger.update();
  });

  return null;
}

/**
 * Wraps the app with Lenis smooth scroll.
 * Uses key to force reinitialize on route changes.
 */
export function LenisProvider({ children }: LenisProviderProps) {
  const pathname = usePathname();

  useEffect(() => {
    ScrollTrigger.config({
      limitCallbacks: true,
      ignoreMobileResize: true,
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <ReactLenis
      key={pathname}
      root
      options={{
        autoRaf: true,
        lerp: 0.1,
        smoothWheel: true,
        syncTouch: false,
        touchMultiplier: 1.5,
        infinite: false,
      }}
    >
      <LenisBridge />
      {children}
    </ReactLenis>
  );
}
