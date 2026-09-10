# Pham Ngoc Khoi · Portfolio

Portfolio for a **Software Engineer & Full-Stack Developer**, with projects spanning React interfaces, Go/Node.js APIs, and a native Linux application. Frontend polish is a quality standard, not a replacement for the full-stack identity.

## Run locally

Requires Node.js 20.9+ and npm. No environment variables or external services are required for the portfolio pages.

```bash
npm ci
npm run dev
# http://localhost:3000

npm run lint
npm run typecheck
npm run build
npm run start
```

Fonts are downloaded by `next/font` at build time and served locally to visitors.

## Stack and architecture

- Next.js 16.2.9 App Router, React 19, TypeScript, Tailwind CSS 4.
- GSAP 3.15, `@gsap/react`, SplitText, ScrollTrigger, and Lenis 1.3.
- Cormorant Garamond display and Hanken Grotesk body typography via `next/font`; Lucide icons; `next-themes` for light, dark, and mint preferences. The typography-led opening and restrained image hierarchy follow [khanhnguyen.design](https://khanhnguyen.design/), without copying its branding or content.
- Pages and project content are server-rendered. Interactive client boundaries are limited to navigation state, theme selection, print, and motion.
- `src/data/user-data.ts`: profile, experience, education, and typed project case studies.
- `src/components/projects/project-card.tsx`: shared project presentation with separate, named case-study and source links, not nested interactive controls.
- `src/app/globals.css`: shared spacing/type/color tokens, responsive layouts, focus styles, reduced-motion and print rules.
- `public/logo.svg`: outlined serif `pk.` monogram matching the navigation wordmark and theme-aware favicon family. `public/og-image.png` carries the full professional title in the same editorial typography.

| Route              | Purpose                                                                                                    |
| ------------------ | ---------------------------------------------------------------------------------------------------------- |
| `/`                | Three selected projects, full-stack positioning, capability evidence, contact                              |
| `/projects`        | All four projects                                                                                          |
| `/projects/[slug]` | Problem, contribution/credits, decision, challenge, limitations, next improvement, and source-review steps |
| `/experience`      | Work experience and education                                                                              |
| `/resume`          | Server-rendered résumé with browser Print / Save PDF                                                       |
| `/contact`         | Direct email, phone, GitHub, and LinkedIn links                                                            |

Unknown projects use a real 404 page with recovery links. Project routes have static parameters and per-project metadata. Direct links, navigation, and substantive content work without JavaScript. Theme switching and printing require JavaScript; the underlying content does not.

## Motion decisions

The homepage keeps its opening typography-only, with a prominent CV-backed technology summary. A Codex-generated conceptual illustration supports the interface/system introduction and is labelled as illustration, not project evidence. Experience uses a chronological timeline with roles, dates, delivered workflows, and technologies. Selected projects use an alternating editorial showcase without a timeline. Both sections collapse to one column on mobile. Scrolling remains continuous: no snapping or pinned gallery.

- `PortfolioMotion` uses scoped `useGSAP` and `gsap.matchMedia`. SplitText animates heading and project-title characters with staggered rotation and vertical lift inside line masks, re-splits after font/width changes, and preserves accessible names. Reduced motion restores unsplit, stationary content.
- Project images use alternating horizontal shutter reveals. Career delivery items enter with a staggered vertical translation beside timeline markers. Content remains available without hover or JavaScript. The supporting illustration has a once-only vertical entrance.
- Lenis uses the GSAP ticker with lag smoothing disabled and a `0.085` interpolation factor. Wheel smoothing is independent of pointer type; touch gestures stay native (`syncTouch: false`). Anchor clicks use Lenis on non-coarse pointers and stay native on touch devices; keyboard/focus navigation cancels residual inertia.
- Touch, keyboard, hash links, and browser history retain native behavior. No route-change `scrollTo(0)` overrides Next/browser restoration.
- Media-query changes revert animations and destroy Lenis. Cleanup removes only listeners and instances owned by that component.
- All three color themes persist across routes and reloads. Native scrollbars remain visible.

## Project evidence and honesty

The public repositories were inspected on **September 9, 2026**. Source inspection is not the same as exercising the applications end to end.

| Project                                                      | Evidence                                                                                        | Availability / limitations                                                                                                                                                               |
| ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Bookstore](https://github.com/khoipn21/TMDT-main)           | React storefront/admin and Express/MongoDB API; README credits Pham Ngoc Khoi and Cao Quoc Viet | Local setup documented; no verified public demo.                                                                                                                                         |
| [Murmur](https://github.com/khoipn21/murmur-chatapp)         | React/Chakra UI, paginated message history, WebSocket updates, Go server                        | No verified public demo or project-specific root setup guide. No claim of a verified AWS deployment.                                                                                     |
| [CodexBar Linux](https://github.com/khoipn21/CodexBar-Linux) | Rust/GTK4 Linux GUI, tray and settings, CI build artifacts                                      | Native source build, not a web demo; no published release at inspection time. Upstream engine and original design credited to [steipete/CodexBar](https://github.com/steipete/CodexBar). |
| [Study Platform](https://github.com/khoipn21/study-platform) | Go services, gRPC gateway, PostgreSQL, Docker documentation                                     | Backend/API project. No frontend is present in this repository.                                                                                                                          |

The existing images are explicitly captioned as artwork, concept imagery, or an unverified storefront capture. They are not presented as verified product screenshots. Real captures and public demos still need to be supplied from the running projects. Adding a `live` URL should follow an actual successful demo walkthrough; missing demos render availability text, never a fake button.

## Browser checks

```bash
npx playwright install chromium
npm run build
npm run test:e2e
```

Playwright starts the production server on port 3100. Locally it can reuse an existing server; CI requires that port to be free. Tests run in desktop Chromium and Chromium with a phone-sized touch viewport (not a claim of Safari/device testing).

The suite exercises:

- Keyboard skip link, project discovery, source destination, résumé and contact paths.
- Wheel → hero project link → final project keyboard activation, plus phone navigation to that project.
- Theme persistence after route navigation and reload.
- Reduced-motion hash navigation and browser history restoration.
- No-JavaScript project content and unknown-project 404 recovery.
- Intermediate widths from 320px to 1280px without horizontal overflow.
- Automated axe WCAG A/AA checks on primary pages in all three themes.
- Print layout preserving résumé content while removing navigation.

Axe does not establish full accessibility compliance. The linked projects are not covered by this portfolio's test suite. No invented coverage percentage, performance score, or real-user metric is presented.

Verification on September 10, 2026 after the experience revision: production build and lint passed; all 14 Playwright checks passed. Desktop and mobile career layouts and the project showcase were visually inspected. A browser probe observed career items translate from 28px to their normal position; reduced-motion cleanup removed split-character wrappers and restored image visibility. The existing custom Cache-Control build warning remains.

The résumé supports browser print/PDF. `/pull-requests` and the unused `/api/github-contributions` route remain removed. No fabricated activity records are retained.

## Performance investigation

The original homepage loaded two video elements; a desktop development-server observation transferred **8,033,515 bytes of video**. The refactor removes both video elements and all video requests. This removes an observed payload, not a guessed speed improvement.

A production Chromium sample from **before the sculptural redesign**, on localhost at 1440 × 1000, browser cache disabled, no network/CPU throttling, measured:

- LCP: **560 ms**.
- CLS: **0** for the observed initial load.
- JavaScript resource transfer: **210,109 bytes**.
- Total observed subresource transfer: **376,177 bytes** (excludes the main HTML document).
- Video requests: **0**.

These are a single local diagnostic sample, not field Core Web Vitals or a performance guarantee. Development and production timing numbers are not compared. No INP claim is made from a page-load measurement. Record repeated throttled runs and real-device checks before making broader performance claims.

## Readiness and remaining evidence

The portfolio makes source code, project explanations, résumé, and contact information easy to find. Before treating the _showcased applications_ as hiring-ready, finish their setup documentation where missing, capture actual interfaces, publish and exercise intended demos, and record meaningful user-journey checks in those repositories. This refactor does not silently deploy or change those separate projects.

Maintainer: [Pham Ngoc Khoi](https://github.com/khoipn21). Bookstore co-author: [Cao Quoc Viet](https://github.com/CaoQuocViet). Existing personal/work history is retained from this repository; dates should be reviewed by the owner before sharing.
