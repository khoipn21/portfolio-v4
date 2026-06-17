"use client";

import { useEffect, type ReactNode } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface LenisProviderProps {
  children: ReactNode;
}

/**
 * Inner component that pipes Lenis scroll events to GSAP ScrollTrigger.
 * Separated so useLenis() has access to the Lenis context.
 */
function LenisBridge() {
  useLenis(() => {
    ScrollTrigger.update();
  });

  return null;
}

/**
 * Wraps the app with Lenis smooth scroll.
 * - autoRaf: true — Lenis handles its own RAF loop (no ticker bridge needed)
 * - ScrollTrigger.update piped from lenis scroll events via useLenis
 * - lagSmoothing adjusted on mount for responsive scroll-linked animations
 */
export function LenisProvider({ children }: LenisProviderProps) {
  // Disable GSAP's lag smoothing once on mount
  useEffect(() => {
    ScrollTrigger.refresh();
  }, []);

  return (
    <ReactLenis
      root
      options={{
        autoRaf: true,
        lerp: 0.08,
        smoothWheel: true,
        syncTouch: false,
      }}
    >
      <LenisBridge />
      {children}
    </ReactLenis>
  );
}
