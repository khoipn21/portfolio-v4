---
phase: 1
title: "Foundation: Lenis Provider & GSAP Bridge"
status: pending
priority: P2
effort: 2h
dependencies: []
---

# Phase 1: Foundation: Lenis Provider & GSAP Bridge

## Overview

Install Lenis, create the provider component with GSAP ticker integration, build the velocity/direction/progress hook, and wire everything into the layout. This phase replaces raw `window.scroll` listeners with Lenis-powered equivalents.

## Requirements

- Functional: Lenis smooth scroll active on all pages, GSAP ScrollTrigger animations still fire correctly
- Non-functional: No hydration mismatches, reduced-motion fallback, no double-RAF

## Architecture

```
layout.tsx
  └─ <ReactLenis root options={{ autoRaf: false, lerp: 0.08 }}>
       └─ <LenisProvider>
            └─ <ThemeProvider>
```

LenisProvider (client component):
- Holds `lenisRef` via `useRef<LenisRef>`
- `useEffect` adds `lenis.raf` to `gsap.ticker` (with `time * 1000`)
- `useEffect` pipes `ScrollTrigger.update` to `lenis.on('scroll')`
- Calls `gsap.ticker.lagSmoothing(0)`
- Provides `useLenis()` context to children

useScrollVelocity hook:
- Wraps `useLenis()` from `lenis/react`
- Returns `{ velocity, direction, progress, scroll }`
- Velocity is smoothed (raw velocity can be jittery)

## Related Code Files

- Create: `src/components/lenis-provider.tsx`
- Create: `src/hooks/use-scroll-velocity.ts`
- Modify: `src/app/layout.tsx` (wrap in ReactLenis + LenisProvider)
- Modify: `src/components/layout/top-navbar.tsx` (replace window.scroll with useLenis)
- Modify: `src/components/layout/command-menu.tsx` (add data-lenis-prevent)

## Implementation Steps

1. `npm install lenis`
2. Create `src/components/lenis-provider.tsx`:
   - `"use client"` directive
   - Import `ReactLenis` from `lenis/react`, `gsap`, `ScrollTrigger`, `useRef`, `useEffect`
   - Register ScrollTrigger plugin
   - Component accepts `children`, wraps in `<ReactLenis root options={{ autoRaf: false, lerp: 0.08 }}>`
   - `useEffect`: add `lenis.raf` to `gsap.ticker`, pipe scroll event to `ScrollTrigger.update`, disable lag smoothing
   - Cleanup: remove ticker add, destroy lenis on unmount
   - `prefers-reduced-motion` check: if reduced, set `smoothWheel: false`
3. Create `src/hooks/use-scroll-velocity.ts`:
   - Import `useLenis` from `lenis/react`
   - Return `{ velocity, direction, progress, scroll }` from lenis instance
   - Use `useLenis` callback to update a ref (not state — avoid re-renders)
4. Modify `src/app/layout.tsx`:
   - Import `LenisProvider`
   - Wrap children: `<LenisProvider><ThemeProvider>...</ThemeProvider></LenisProvider>`
5. Modify `src/components/layout/top-navbar.tsx`:
   - Import `useScrollVelocity`
   - Replace `window.addEventListener("scroll", handleScroll)` with `useScrollVelocity().scroll > 20`
   - Keep IntersectionObserver for active section (it's the right tool)
6. Modify `src/components/layout/command-menu.tsx`:
   - Add `data-lenis-prevent` to the overlay/backdrop element

## Success Criteria

- [ ] `npm install lenis` completes without errors
- [ ] Smooth scroll active on page load (mouse wheel produces eased scroll)
- [ ] All existing GSAP ScrollTrigger animations still fire at correct positions
- [ ] Navbar glassmorphism triggers at correct scroll position
- [ ] Command menu scroll is not affected by Lenis (data-lenis-prevent works)
- [ ] `prefers-reduced-motion` disables smooth scroll entirely
- [ ] No hydration mismatch warnings in console
- [ ] `npm run build` passes clean

## Risk Assessment

- **Hydration mismatch**: Lenis is client-only. SSR renders without it. The `root` prop on ReactLenis uses `<html>` as wrapper — must ensure no SSR/client attribute mismatch. Mitigation: suppress hydration warning on html tag (already present).
- **GSAP ticker conflict**: If another component also adds to `gsap.ticker`, double-updates could occur. Mitigation: LenisProvider is the single source of truth for the ticker bridge.
- **Scroll position desync**: Lenis's `animatedScroll` may differ from `window.scrollY`. Components using raw scroll listeners could desync. Mitigation: migrate all scroll listeners to `useLenis` in this phase.
