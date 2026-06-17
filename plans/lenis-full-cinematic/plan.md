---
title: "Lenis Full Cinematic Integration"
description: "Integrate Lenis smooth scroll with GSAP ticker bridge, velocity-driven UI effects, horizontal scroll, and character-by-character text reveals"
status: pending
priority: P2
effort: 8h
branch: "main"
tags: [frontend, animation, gsap, lenis]
blockedBy: []
blocks: []
created: "2026-06-17"
createdBy: "ck:plan"
source: skill
---

# Lenis Full Cinematic Integration

## Overview

Integrate Lenis (~3KB gzipped) as the scroll engine for the portfolio. Lenis wraps native scroll (no behavior loss) and drives all GSAP ScrollTrigger animations from a single unified loop via `gsap.ticker`. The integration adds: smooth scroll, velocity/direction-aware UI (navbar hide-on-down, parallax), scroll progress bar, hero text character reveal, and a pinned horizontal scroll section for projects.

## Architecture

```
layout.tsx
  └─ <ReactLenis root options={{ autoRaf: false }}>
       └─ <LenisProvider>  ← custom context exposing velocity/direction/progress
            └─ <ThemeProvider>
                 └─ {children}
```

**Lenis ↔ GSAP bridge** (in LenisProvider):
- `gsap.ticker.add(lenisRef.current.lenis.raf)` — drives Lenis from GSAP's frame loop
- `lenis.on('scroll', ScrollTrigger.update)` — keeps ScrollTrigger in sync
- `gsap.ticker.lagSmoothing(0)` — disables GSAP's built-in lag compensation

**Key gotchas:**
- `autoRaf: false` mandatory (GSAP ticker drives Lenis, not browser RAF)
- `time * 1000` conversion (GSAP seconds → Lenis milliseconds)
- `data-lenis-prevent` on command menu overlay
- `prefers-reduced-motion` → disable Lenis smooth scroll + all velocity effects
- Horizontal scroll needs mobile fallback (vertical single-column)

## Phases

| Phase | Name | Status |
|-------|------|--------|
| 1 | [Foundation: Lenis Provider & GSAP Bridge](./phase-01-foundation-lenis-provider-gsap-bridge.md) | Pending |
| 2 | [Visual Polish: Progress Bar & Velocity Effects](./phase-02-visual-polish-progress-bar-velocity-effects.md) | Pending |
| 3 | [Cinematic: Text Reveal & Horizontal Scroll](./phase-03-cinematic-text-reveal-horizontal-scroll.md) | Pending |

## Dependencies

- `lenis` npm package (install required, ~3KB gzipped)
- Already have: `gsap@^3.15.0`, `@gsap/react@^2.1.2`

## Acceptance Criteria

- [ ] Smooth scroll works on all devices via Lenis
- [ ] GSAP ScrollTrigger animations fire correctly (unified loop, no desync)
- [ ] Navbar hides on scroll-down, reveals on scroll-up
- [ ] Scroll progress bar reflects position accurately
- [ ] Hero text reveals character-by-character on scroll (center-outward stagger)
- [ ] Projects section has horizontal scroll on desktop, vertical fallback on mobile
- [ ] All effects disabled under `prefers-reduced-motion`
- [ ] No hydration mismatches (Lenis client-only, SSR fallback is instant)
- [ ] Build passes clean (`npm run build`)
