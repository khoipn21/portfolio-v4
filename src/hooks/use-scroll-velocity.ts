"use client";

import { useState, useRef, useEffect } from "react";
import { useLenis } from "lenis/react";

interface ScrollState {
  velocity: number;
  direction: 1 | -1;
  progress: number;
  scroll: number;
}

const defaultState: ScrollState = {
  velocity: 0,
  direction: 1,
  progress: 0,
  scroll: 0,
};

/**
 * Hook exposing Lenis scroll velocity, direction, progress, and scroll position.
 *
 * Uses useLenis callback to track values in a ref (no re-renders per frame),
 * then syncs to state at most once per requestAnimationFrame to avoid
 * the Maximum update depth error.
 */
export function useScrollVelocity(): ScrollState {
  const [state, setState] = useState<ScrollState>(defaultState);
  const stateRef = useRef<ScrollState>(defaultState);
  const rafRef = useRef<number>(0);

  useLenis(
    (lenis: {
      velocity: number;
      direction: number;
      progress: number;
      scroll: number;
    }) => {
      // Update ref immediately (cheap, no re-render)
      stateRef.current = {
        velocity: lenis.velocity,
        direction: lenis.direction as 1 | -1,
        progress: lenis.progress,
        scroll: lenis.scroll,
      };

      // Batch state update to next frame (prevents infinite loop)
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        setState(stateRef.current);
      });
    }
  );

  // Cleanup RAF on unmount
  useEffect(() => {
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return state;
}
