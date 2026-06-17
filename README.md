# Portfolio v4

Personal portfolio website for Pham Ngoc Khoi.

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Styling:** Tailwind CSS v4
- **Animations:** GSAP + ScrollTrigger
- **Themes:** 3-theme system (Dark, Light, Sea Glass Mint)
- **Icons:** Lucide React + React Icons
- **Fonts:** Geist Sans + Geist Mono

## Pages (8)

| Route | Description |
|-------|-------------|
| `/` | Main page with all sections |
| `/experience` | Full work experience + education |
| `/projects` | All projects grid |
| `/projects/[slug]` | Individual project detail |
| `/pull-requests` | Open source PR history |
| `/resume` | Printable resume |
| `/contact` | Contact information |

## Main Page Sections (matching reference portfolio)

1. **Banner** — Canvas particle animation + floating gradient orbs + corner decorations
2. **Profile Header** — GitHub avatar, name, age, theme toggle + command menu
3. **Bio** — Short description
4. **Highlights** — Bullet points about current work
5. **Action Buttons** — Book an intro call, Send an email
6. **Social Links** — GitHub, LinkedIn, Email, Resume
7. **Experiences** — Work history with GSAP stagger animation
8. **Projects** — 2-column grid with hover effects
9. **GitHub Activity** — GitHub stats card
10. **Open Source Contributions** — Filterable PR list (merged/open/closed)
11. **Skills & Technologies** — Skill pills with CDN icons
12. **Blogs** — Blog post list with tags and clap counts
13. **Quote** — Motivational quote section
14. **Footer** — Fading grid pattern

## Three Themes

1. **Dark** — Black bg, indigo (#6366f1) accents, technology vibe
2. **Light** — Warm paper (#faf8f5), amber (#d97706) accents
3. **Sea Glass Mint** — Jade (#0E5F4D), emerald (#2AAE8A), coastal feel

Toggle via the 3-way theme switch in the top-right or right sidebar.

## Development

```bash
npm run dev      # Start dev server (port 3000)
npm run build    # Production build
npm run start    # Start production server
```

## Features

- Responsive design (mobile-first)
- Reduced motion support (`prefers-reduced-motion`)
- Command menu (`⌘K` / `Ctrl+K`)
- Blueprint-style grid overlay with intersection dots
- Canvas particle animation with connections
- GSAP ScrollTrigger fade-in/stagger animations
- GitHub stats integration
- Open source contributions with filter toggle
- Blog section with tags
- Print-friendly resume page
- Theme-aware selection colors
- Glass morphism navbar on scroll
