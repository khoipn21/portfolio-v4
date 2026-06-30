'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Mail, FileText, ArrowRight } from 'lucide-react';
import { SiGithub } from 'react-icons/si';
import { FaLinkedin } from 'react-icons/fa';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { splitText, prefersReducedMotion } from '@/lib/text-split';
import { userData } from '@/data/user-data';
import { CrtOverlay } from '@/components/layout/crt-overlay';

gsap.registerPlugin(ScrollTrigger);

/** Theme-aware looping background video for the finale. */
const finaleVideo: Record<string, { src: string; opacity: number }> = {
  dark: { src: '/videos/dark-loop.mp4', opacity: 0.18 },
  light: { src: '/videos/light-loop.mp4', opacity: 0.22 },
  mint: { src: '/videos/mint-loop.mp4', opacity: 0.2 },
};

/**
 * ACT V — Transmission (finale).
 * Quote reveal (scrubbed words) + socials + footer. Theme loop video bg
 * + CRT finale overlay (stronger scanlines/vignette). A subtle scrubbed
 * vignette-tighten plays on scroll to evoke a CRT power-down.
 */
export function ContactAct() {
  const sectionRef = useRef<HTMLElement>(null);
  const quoteRef = useRef<HTMLHeadingElement>(null);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => setMounted(true), []);
  useEffect(() => setVideoReady(false), [theme]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const videoConfig = finaleVideo[(theme as string) || 'dark'] || finaleVideo.dark;

  useGSAP(
    () => {
      if (prefersReducedMotion() || !sectionRef.current) return;

      // Scrubbed word reveal for the quote
      if (quoteRef.current) {
        const { items } = splitText(quoteRef.current, 'words');
        gsap.set(items, { yPercent: 110, autoAlpha: 0 });
        gsap.to(items, {
          yPercent: 0,
          autoAlpha: 1,
          ease: 'none',
          stagger: { each: 0.04, from: 'start' },
          scrollTrigger: {
            trigger: quoteRef.current,
            start: 'top 85%',
            end: 'bottom 55%',
            scrub: true,
          },
        });
      }
    },
    { scope: sectionRef }
  );

  const socials = [
    {
      name: 'GitHub',
      href: userData.github,
      icon: <SiGithub className="h-4 w-4" />,
    },
    {
      name: 'LinkedIn',
      href: userData.linkedin,
      icon: <FaLinkedin className="h-4 w-4" />,
    },
    {
      name: 'Email',
      href: `mailto:${userData.email}`,
      icon: <Mail className="h-4 w-4" />,
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="act-5"
      className="relative w-full overflow-hidden bg-[var(--bg-primary)] py-[18vh]"
      aria-label="Get in touch"
    >
      {/* Theme loop video background (replaces grain) */}
      {mounted && (
        <div className="absolute inset-0">
          <video
            key={videoConfig.src}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out"
            style={{ opacity: videoReady ? videoConfig.opacity : 0 }}
            onCanPlay={() => setVideoReady(true)}
          >
            <source src={videoConfig.src} type="video/mp4" />
          </video>
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to bottom, color-mix(in srgb, var(--bg-primary) 72%, transparent) 0%, color-mix(in srgb, var(--bg-primary) 88%, transparent) 100%)',
            }}
          />
        </div>
      )}

      <CrtOverlay variant="finale" />

      <div className="cinema-container relative z-10 flex flex-col items-center gap-16">
        {/* Quote */}
        <div className="flex max-w-[640px] flex-col items-center text-center">
          <p className="act-label mb-8">
            <span className="act-num">ACT V</span> &nbsp;TRANSMISSION
          </p>
          <span className="reveal-mask">
            <h2
              ref={quoteRef}
              className="display-lg italic"
              style={{ color: 'var(--text-secondary)' }}
            >
              &ldquo;Do so much work that it would be unreasonable for you to not be
              successful.&rdquo;
            </h2>
          </span>
          <p className="eyebrow mt-6" style={{ color: 'var(--text-muted)' }}>
            — Alex Hormozi
          </p>
        </div>

        {/* CTA + socials */}
        <div className="flex flex-col items-center gap-8">
          <h3 className="display-md text-center" style={{ color: 'var(--text-primary)' }}>
            Let&apos;s build something.
          </h3>
          <Link
            href={`mailto:${userData.email}`}
            className="group inline-flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-medium transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
            style={{ background: 'var(--accent-primary)', color: 'white' }}
          >
            <Mail className="h-4 w-4" />
            Start a conversation
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {socials.map((s) => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium transition-all duration-300 hover:scale-[1.03]"
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-secondary)',
                  color: 'var(--text-tertiary)',
                }}
              >
                <span className="opacity-70 transition-opacity group-hover:opacity-100">
                  {s.icon}
                </span>
                {s.name}
              </a>
            ))}
            <Link
              href="/resume"
              className="group flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium transition-all duration-300 hover:scale-[1.03]"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-secondary)',
                color: 'var(--text-tertiary)',
              }}
            >
              <span className="opacity-70 transition-opacity group-hover:opacity-100">
                <FileText className="h-4 w-4" />
              </span>
              Resume
            </Link>
          </div>
        </div>
      </div>

      {/* Footer line */}
      <div className="cinema-container relative z-10 mt-20 flex flex-col items-center gap-1.5">
        <div className="mb-4 h-[1px] w-full" style={{ background: 'var(--border-secondary)' }} />
        <p className="text-[12px]" style={{ color: 'var(--text-muted)' }}>
          © {new Date().getFullYear()} {userData.name}
        </p>
        {/* <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>

        </p> */}
      </div>
    </section>
  );
}
