'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { experiences } from '@/data/user-data';
import { MapPin, Calendar, ChevronDown, Building2 } from 'lucide-react';
import { useScrollVelocity } from '@/hooks/use-scroll-velocity';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

/**
 * Single collapsible experience card.
 * Collapsed: company icon + role + company + period.
 * Expanded: full description + tech tags.
 */
function ExperienceCard({ exp }: { exp: (typeof experiences)[number]; index?: number }) {
  const [expanded, setExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const chevronRef = useRef<SVGSVGElement>(null);

  const toggle = useCallback(() => {
    if (!contentRef.current || !chevronRef.current) return;

    if (!expanded) {
      // Expand
      setExpanded(true);
      gsap.fromTo(
        contentRef.current,
        { height: 0, opacity: 0 },
        {
          height: 'auto',
          opacity: 1,
          duration: 0.45,
          ease: 'power2.out',
        }
      );
      gsap.to(chevronRef.current, {
        rotation: 180,
        duration: 0.3,
        ease: 'power2.out',
      });
    } else {
      // Collapse
      gsap.to(contentRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.35,
        ease: 'power2.inOut',
        onComplete: () => setExpanded(false),
      });
      gsap.to(chevronRef.current, {
        rotation: 0,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  }, [expanded]);

  return (
    <div className="group relative" data-experience-card>
      {/* Double-Bezel: Outer Shell */}
      <div
        className="rounded-[1rem] p-[1.5px] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
        style={{ background: 'var(--border-accent)' }}
      >
        {/* Double-Bezel: Inner Core */}
        <div
          className="overflow-hidden rounded-[calc(1rem-1.5px)] transition-all duration-500"
          style={{
            background: 'var(--bg-card)',
            boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.03)',
          }}
        >
          {/* Clickable header - always visible */}
          <button
            onClick={toggle}
            className="flex w-full cursor-pointer items-start gap-4 p-5 text-left transition-colors duration-200"
            style={{ background: 'transparent' }}
            aria-expanded={expanded}
          >
            {/* Company icon placeholder */}
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] transition-all duration-300 group-hover:scale-105"
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-accent)',
              }}
            >
              <Building2
                className="h-4.5 w-4.5"
                style={{ color: 'var(--accent-primary)' }}
                strokeWidth={1.5}
              />
            </div>

            {/* Role + company + meta */}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3
                  className="text-[15px] font-semibold transition-colors duration-300"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {exp.role}
                </h3>
                {exp.current && (
                  <span
                    className="rounded-full px-2 py-0.5 text-[9px] font-medium tracking-wider uppercase"
                    style={{
                      background: 'var(--accent-glow)',
                      color: 'var(--accent-primary)',
                    }}
                  >
                    Current
                  </span>
                )}
              </div>
              <p
                className="mt-0.5 text-[13px] font-medium"
                style={{ color: 'var(--accent-primary)' }}
              >
                {exp.company}
              </p>
              <div
                className="mt-1.5 flex flex-wrap items-center gap-3 text-[11px]"
                style={{ color: 'var(--text-muted)' }}
              >
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {exp.period}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {exp.location}
                </span>
              </div>
            </div>

            {/* Chevron */}
            <ChevronDown
              ref={chevronRef}
              className="mt-1 h-4 w-4 shrink-0 transition-colors duration-200"
              style={{ color: 'var(--text-muted)' }}
            />
          </button>

          {/* Expandable content */}
          <div ref={contentRef} className="overflow-hidden" style={{ height: 0, opacity: 0 }}>
            <div className="px-5 pt-0 pb-5">
              {/* Divider */}
              <div className="mb-4 h-0 border-t" style={{ borderColor: 'var(--border-accent)' }} />

              <ul className="mb-4 space-y-2">
                {exp.description.map((desc, j) => (
                  <li
                    key={j}
                    className="flex gap-2 text-[13px] leading-relaxed"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    <span
                      className="mt-1.5 h-1 w-1 shrink-0 rounded-full"
                      style={{ background: 'var(--accent-primary)' }}
                    />
                    <span>{desc}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-1.5">
                {exp.tech.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border px-2.5 py-1 text-[10px] font-medium transition-all duration-300 hover:scale-105"
                    style={{
                      borderColor: 'var(--border-accent)',
                      color: 'var(--text-tertiary)',
                      background: 'var(--bg-secondary)',
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Experience list with collapsible cards.
 * GSAP stagger fade-in on scroll, each card independently expandable.
 */
export function ExperienceList() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { velocity } = useScrollVelocity();
  const cardsRef = useRef<Element[]>([]);

  // Cache card elements once
  useEffect(() => {
    if (!containerRef.current) return;
    cardsRef.current = Array.from(containerRef.current.querySelectorAll('[data-experience-card]'));
  }, []);

  // Apply velocity-based scale via gsap.set (scale not eligible for quickTo)
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !cardsRef.current.length) return;

    // Dead zone: only apply when velocity is significant
    if (Math.abs(velocity) < 50) {
      cardsRef.current.forEach((card) => gsap.set(card, { scale: 1 }));
      return;
    }

    // Subtle scale: 0.98 to 1.02 range
    const scale = 1 + gsap.utils.clamp(-0.02, 0.02, velocity * 0.00005);
    cardsRef.current.forEach((card) => gsap.set(card, { scale }));
  }, [velocity]);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced || !containerRef.current) return;

      const cards = containerRef.current.querySelectorAll('[data-experience-card]');
      if (!cards.length) return;

      gsap.fromTo(
        cards,
        { y: 30, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="flex flex-col gap-3">
      {experiences.map((exp, i) => (
        <ExperienceCard key={i} exp={exp} index={i} />
      ))}
    </div>
  );
}
