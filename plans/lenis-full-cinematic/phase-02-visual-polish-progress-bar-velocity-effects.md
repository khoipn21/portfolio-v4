---
phase: 2
title: "Visual Polish: Progress Bar & Velocity Effects"
status: pending
priority: P2
effort: 3h
dependencies: [1]
---

# Phase 2: Visual Polish: Progress Bar & Velocity Effects

## Overview

Add scroll progress bar, direction-aware navbar hide/show, and velocity-driven parallax on banner particles and gradient orbs. These effects leverage Lenis's `velocity` and `direction` properties to create a premium, responsive feel.

## Requirements

- Functional: Progress bar reflects scroll position, navbar hides on down-scroll, banner parallax responds to velocity
- Non-functional: All animations use transform/opacity only (GPU compositor), no layout thrashing

## Architecture

**Scroll Progress Bar** (new component):
- Fixed 2px bar at top of viewport, `z-[200]`
- Width bound to `lenis.progress * 100%`
- Accent color follows `--accent-primary` per theme
- `pointer-events-none`

**Direction-Aware Navbar** (modify existing):
- Track `lenis.direction` (1 = up, -1 = down)
- Past 200px + scrolling down → `gsap.quickTo(navbar, "y", { y: -100, opacity: 0 })`
- Scrolling up → `gsap.quickTo(navbar, "y", { y: 0, opacity: 1 })`
- Uses `gsap.quickTo` (reuses single tween, no GC pressure, no useState re-renders)

**Velocity Parallax** (modify banner + particles):
- Banner gradient orbs: `useTransform` tied to `lenis.scroll` for Y offset (slower than scroll = parallax depth)
- BannerParticles canvas: read `lenis.velocity` each frame, add `velocity * 0.002` to particle `vy`
- Creates depth illusion: fast scroll = particles scatter, slow scroll = calm

## Related Code Files

- Create: `src/components/layout/scroll-progress.tsx`
- Modify: `src/components/layout/top-navbar.tsx` (direction-aware hide/show via quickTo)
- Modify: `src/components/sections/banner.tsx` (velocity parallax on orbs)
- Modify: `src/components/sections/banner-particles.tsx` (velocity affects particle drift)
- Modify: `src/app/page.tsx` (render scroll-progress component)

## Implementation Steps

1. Create `src/components/layout/scroll-progress.tsx`:
   - `"use client"`, import `useScrollVelocity`
   - Fixed bar: `position: fixed; top: 0; left: 0; height: 2px; z-index: 200; pointer-events: none`
   - Width: `style={{ width: `${progress * 100}%` }}` with transition
   - Background: `var(--accent-primary)`
   - `prefers-reduced-motion`: static full-width bar (no animation)
2. Modify `src/components/layout/top-navbar.tsx`:
   - Import `useScrollVelocity` and `gsap`
   - Ref for nav element
   - `useGSAP` watching `direction` and `scroll`:
     - `if (scroll > 200 && direction === -1)` → quickTo y: -100, opacity: 0
     - `if (direction === 1)` → quickTo y: 0, opacity: 1
   - Remove old `useState` + `window.addEventListener("scroll")` pattern
   - Keep glassmorphism logic (scrolled state) derived from `scroll > 20`
3. Modify `src/components/sections/banner.tsx`:
   - Import `useScrollVelocity`
   - Gradient orbs: wrap in `motion.div` with `useTransform(lenis.scroll, [0, 500], [0, -60])` for parallax
   - Reduced motion: no parallax offset
4. Modify `src/components/sections/banner-particles.tsx`:
   - Import `useScrollVelocity`
   - In the `animate` loop, read velocity from ref (not hook — canvas loop is outside React)
   - Add `velocityRef.current * 0.002` to each particle's `vy`
   - Clamp velocity contribution to prevent extreme drift
5. Modify `src/app/page.tsx`:
   - Import `ScrollProgress`
   - Render `<ScrollProgress />` at top of page (before TopNavbar)

## Success Criteria

- [ ] Thin accent-colored progress bar visible at top of viewport
- [ ] Progress bar width matches scroll position (0% at top, 100% at bottom)
- [ ] Navbar slides up and hides when scrolling down past 200px
- [ ] Navbar slides back down when scrolling up
- [ ] Banner gradient orbs move at different speed than scroll (parallax depth)
- [ ] Banner particles drift faster when scrolling fast, calm when slow
- [ ] All effects respect `prefers-reduced-motion` (static/disabled)
- [ ] No layout shifts, no scrollbar changes
- [ ] Build passes clean

## Risk Assessment

- **Navbar flicker**: If direction changes rapidly (short scroll bursts), the navbar could flicker. Mitigation: add a 100ms debounce on direction changes before triggering show/hide.
- **Performance on mobile**: Velocity reads in canvas loop are O(1) — negligible. But `useTransform` on orbs adds a compositor layer. Mitigation: only apply parallax on `md:` breakpoint.
- **Progress bar z-index**: At `z-[200]` it could overlap modals. Mitigation: command menu uses `z-[200]` too — ensure progress bar is below menu overlay.
