'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { splitText, prefersReducedMotion } from '@/lib/text-split';
import { userData } from '@/data/user-data';
import { CurrentTime } from './current-time';
import { CrtOverlay } from '@/components/layout/crt-overlay';

gsap.registerPlugin(ScrollTrigger);

/** Theme-aware looping background video for the hero. */
const heroVideo: Record<string, { src: string; opacity: number }> = {
  dark: { src: '/videos/dark-loop.mp4', opacity: 0.4 },
  light: { src: '/videos/light-loop.mp4', opacity: 0.5 },
  mint: { src: '/videos/mint-loop.mp4', opacity: 0.45 },
};

/**
 * ACT I — Opening.
 * Full-height pinned hero. Scrubbed "camera-push" (bg video scales up,
 * content rises + fades) over one viewport of scroll. Name reveals
 * char-by-char (center-outward) on entry; pixel avatar + supporting text
 * cascade in after. Theme loop video + CRT scanlines/vignette (no grain).
 */
export function HeroScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => setMounted(true), []);
  useEffect(() => setVideoReady(false), [theme]);
  /* eslint-enable react-hooks/set-state-in-effect */

  useGSAP(
    () => {
      if (prefersReducedMotion() || !sectionRef.current) return;

      // Name char reveal — one-shot, center-outward stagger
      if (nameRef.current) {
        const { items } = splitText(nameRef.current, 'chars');
        gsap.set(items, { yPercent: 120, autoAlpha: 0 });
        gsap.to(items, {
          yPercent: 0,
          autoAlpha: 1,
          duration: 0.7,
          ease: 'power3.out',
          stagger: { from: 'center', each: 0.035 },
          delay: 0.2,
        });
      }

      // Supporting content (avatar, headline, bio, meta) cascades in after the name
      const support = sectionRef.current.querySelectorAll('[data-hero-fade]');
      if (support.length) {
        gsap.set(support, { y: 24, autoAlpha: 0 });
        gsap.to(support, {
          y: 0,
          autoAlpha: 1,
          duration: 0.8,
          ease: 'power2.out',
          stagger: 0.08,
          delay: 0.5,
        });
      }

      // Pinned camera-push over one viewport
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=100%',
          scrub: 1,
          pin: true,
        },
      });
      if (bgRef.current) {
        tl.fromTo(bgRef.current, { scale: 1.05 }, { scale: 1.18, ease: 'none' }, 0);
      }
      if (contentRef.current) {
        tl.to(contentRef.current, { y: -120, autoAlpha: 0, ease: 'none' }, 0);
      }
    },
    { scope: sectionRef }
  );

  const config = heroVideo[(theme as string) || 'dark'] || heroVideo.dark;

  return (
    <section
      ref={sectionRef}
      id="act-1"
      className="relative h-[100dvh] w-full overflow-hidden"
      aria-label="Opening"
    >
      {/* Theme loop video background (replaces grain) */}
      {mounted && (
        <div ref={bgRef} className="absolute inset-0">
          <video
            ref={videoRef}
            key={config.src}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out"
            style={{ opacity: videoReady ? config.opacity : 0 }}
            onCanPlay={() => setVideoReady(true)}
          >
            <source src={config.src} type="video/mp4" />
          </video>
          {/* Readability gradient — darkens left + bottom where text sits */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to right, color-mix(in srgb, var(--bg-primary) 82%, transparent) 0%, transparent 65%), linear-gradient(to top, color-mix(in srgb, var(--bg-primary) 60%, transparent) 0%, transparent 70%)',
            }}
          />
        </div>
      )}

      <CrtOverlay variant="hero" />

      <div className="cinema-container relative z-10 flex h-full flex-col justify-center">
        <div ref={contentRef}>
          <p className="act-label mb-6">
            <span className="act-num">ACT I</span> &nbsp;OPENING
          </p>

          {/* Pixel avatar — title-card portrait */}
          <div data-hero-fade className="mb-7 inline-block">
            <div
              className="rounded-[14px] border-[1.5px] p-[3px] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
              style={{ borderColor: 'var(--border-primary)' }}
            >
              <div
                className="relative h-20 w-20 overflow-hidden rounded-[11px]"
                style={{
                  background: 'var(--bg-secondary)',
                  boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.05)',
                }}
              >
                <Image
                  src="/images/pixel-avatar.gif"
                  alt="Pixel art avatar of Pham Ngoc Khoi"
                  width={88}
                  height={88}
                  className="h-full w-full object-cover"
                  style={{ imageRendering: 'pixelated' }}
                  priority
                  unoptimized
                />
              </div>
            </div>
          </div>

          <h1 ref={nameRef} className="display-xxl" style={{ color: 'var(--text-primary)' }}>
            {userData.name}
          </h1>
          <p
            data-hero-fade
            className="display-md mt-5 max-w-[28ch]"
            style={{ color: 'var(--text-secondary)', fontWeight: 500 }}
          >
            {userData.headline}
          </p>
          <p data-hero-fade className="lead mt-6">
            {userData.bio}
          </p>

          <div data-hero-fade className="mt-8 flex flex-wrap items-center gap-4">
            <span className="eyebrow">{userData.location}</span>
            <span style={{ color: 'var(--border-primary)' }}>·</span>
            <CurrentTime />
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2">
        <span className="eyebrow" style={{ color: 'var(--text-muted)' }}>
          SCROLL
        </span>
        <span
          className="block h-10 w-[1px] animate-pulse"
          style={{ background: 'var(--accent-primary)' }}
        />
      </div>
    </section>
  );
}
