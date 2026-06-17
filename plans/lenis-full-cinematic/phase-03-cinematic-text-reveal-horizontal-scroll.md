---
phase: 3
title: "Cinematic: Text Reveal & Horizontal Scroll"
status: pending
priority: P2
effort: 3h
dependencies: [1]
---

# Phase 3: Cinematic: Text Reveal & Horizontal Scroll

## Overview

Add hero headline character-by-character reveal scrubbed to scroll, a pinned horizontal scroll section for projects, and velocity-based subtle scale transforms on cards. These are the "wow" effects that make the portfolio feel like a darkroom.engineering production.

## Requirements

- Functional: Hero text splits into characters and reveals center-outward on scroll, projects scroll horizontally on desktop
- Non-functional: All via GSAP ScrollTrigger + Lenis, reduced-motion fallback, mobile vertical fallback for horizontal section

## Architecture

**Hero Text Reveal** (modify profile-header):
- Split headline text into individual `<span class="char">` elements
- GSAP `fromTo` each char: `{ yPercent: 200, autoAlpha: 0 }` → `{ yPercent: 0, autoAlpha: 1 }`
- Stagger: `{ from: "center", each: 0.04 }` — characters radiate outward from middle
- Scrubbed to scroll: `scrollTrigger: { scrub: 1, start: "top 80%", end: "top 30%" }`
- Subtext fades in after headline completes (separate ScrollTrigger, later start)

**Horizontal Scroll — Projects** (modify projects-grid):
- Wrap projects grid in a pinned section
- `ScrollTrigger.create({ trigger, pin: true, start: "top top", end: () => "+=" + track.scrollWidth - window.innerWidth })`
- Inner track moves left via `gsap.to(track, { x: -distance, ease: "none", scrollTrigger: { scrub: 1 } })`
- Each card is `min-w-[80vw] md:min-w-[40vw]` inside a flex row
- Mobile: no pin, no horizontal — falls back to vertical single-column (existing grid)
- `containerAnimation` on child ScrollTriggers if per-card animations needed

**Velocity Scale on Cards** (modify experience-list + projects):
- `useScrollVelocity()` provides velocity
- `gsap.quickTo(card, "scale", { duration: 0.3 })` mapped to velocity magnitude
- Range: 0.98 → 1.02 (very subtle, not gimmicky)
- Dead zone: only active when `Math.abs(velocity) > 50`
- Reduced motion: no scale effect

## Related Code Files

- Modify: `src/components/sections/profile-header.tsx` (character split + scroll reveal)
- Modify: `src/components/sections/projects-grid.tsx` (horizontal scroll pin)
- Modify: `src/components/sections/experience-list.tsx` (velocity scale)
- Modify: `src/app/page.tsx` (wrap projects in horizontal scroll section if needed)

## Implementation Steps

1. **Hero text reveal** (`profile-header.tsx`):
   - Import `useGSAP`, `gsap`, `ScrollTrigger`
   - Ref for headline container
   - In `useGSAP`: split `textContent` into chars, wrap each in `<span class="char">` with `display: inline-block`
   - `gsap.fromTo` all `.char` elements with center-outward stagger
   - `scrollTrigger: { trigger, scrub: 1, start: "top 80%", end: "top 30%" }`
   - Separate trigger for subtext: `start: "top 60%"`, `toggleActions: "play none none none"`
   - Reduced motion: skip split, show text immediately

2. **Horizontal scroll — projects** (`projects-grid.tsx`):
   - Restructure: outer wrapper (pinner) + inner flex track (slides)
   - Desktop (`md:`): `display: flex; flex-nowrap` for track, each card `min-w-[40vw]`
   - `ScrollTrigger.create` on wrapper: `pin: true`, `start: "top top"`, `end: "+=" + distance`
   - `gsap.to(track, { x: -distance, ease: "none", scrollTrigger: { scrub: 1 } })`
   - Remove old stagger animation (replaced by horizontal scroll)
   - Mobile: `display: grid; grid-cols-1` fallback, no pin
   - `prefers-reduced-motion`: no pin, instant scroll, vertical layout

3. **Velocity scale** (`experience-list.tsx`):
   - Import `useScrollVelocity`
   - Refs for each card (or querySelectorAll in useGSAP)
   - Create `quickTo` for each card: `gsap.quickTo(card, "scale", { duration: 0.3, ease: "power2.out" })`
   - `useEffect` or `useGSAP` that reads velocity and maps to scale:
     - `const scale = 1 + Math.min(Math.abs(velocity) * 0.00005, 0.02) * Math.sign(velocity > 0 ? 1 : -1)`
     - Actually just: `const scale = 1 + gsap.utils.clamp(-0.02, 0.02, velocity * 0.00005)`
   - Only apply when `Math.abs(velocity) > 50` (dead zone)
   - Reduced motion: no scale

4. **Verify horizontal scroll integration**:
   - Ensure GSAP ScrollTrigger refreshes correctly after Lenis drives scroll
   - Test: scroll through projects section — cards pan horizontally
   - Test: resize to mobile — falls back to vertical grid
   - Test: reduced motion — no pin, no horizontal scroll

## Success Criteria

- [ ] Hero headline characters reveal one-by-one from center outward on scroll
- [ ] Subtext fades in after headline reveal completes
- [ ] Projects section pins and scrolls horizontally on desktop
- [ ] Projects section falls back to vertical grid on mobile (<768px)
- [ ] Experience cards subtly scale with scroll velocity (0.98–1.02 range)
- [ ] All effects disabled under `prefers-reduced-motion`
- [ ] ScrollTrigger positions are accurate (no offset from Lenis)
- [ ] Build passes clean

## Risk Assessment

- **ScrollTrigger offset with Lenis**: Lenis's `animatedScroll` can differ from `window.scrollY`. ScrollTrigger uses `window.scrollY` by default. Mitigation: the Lenis↔GSAP bridge (Phase 1) pipes `ScrollTrigger.update` on every Lenis scroll event, keeping positions in sync.
- **Horizontal scroll + vertical page**: Pinning a section while Lenis controls scroll can cause jitter. Mitigation: use `ScrollTrigger.create` with `pin: true` (not `pin` on a tween), and let Lenis drive the scroll naturally.
- **Character split performance**: Long headlines with 50+ chars create 50+ animated elements. Mitigation: GSAP handles this fine; the stagger is lightweight. Only split on desktop (mobile shows instant text).
- **Card scale jitter**: Rapid velocity changes could make cards "vibrate". Mitigation: `quickTo` with `duration: 0.3` smooths the transitions, and the dead zone prevents micro-movements.
