'use client';

import { userData } from '@/data/user-data';
import { ArrowLeft, Mail, Phone, MapPin, Globe } from 'lucide-react';
import { SiGithub } from 'react-icons/si';
import { FaLinkedin } from 'react-icons/fa';
import Link from 'next/link';
import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '@/lib/text-split';

gsap.registerPlugin(ScrollTrigger);

/**
 * Contact page — ACT V Transmission.
 * Double-bezel cards with GSAP batch reveal.
 */
export default function ContactPage() {
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion() || !cardsRef.current) return;

    const ctx = gsap.context(() => {
      const cards = cardsRef.current?.querySelectorAll('.contact-card');
      if (cards) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.1,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  const contactItems = [
    {
      icon: <Mail className="h-5 w-5" />,
      label: 'Email',
      value: userData.email,
      href: `mailto:${userData.email}`,
    },
    {
      icon: <Phone className="h-5 w-5" />,
      label: 'Phone',
      value: userData.phone,
      href: `tel:${userData.phone.replace(/[^\d+]/g, '')}`,
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      label: 'Location',
      value: userData.location,
      href: undefined,
    },
    {
      icon: <SiGithub className="h-5 w-5" />,
      label: 'GitHub',
      value: userData.githubUsername,
      href: userData.github,
    },
    {
      icon: <Globe className="h-5 w-5" />,
      label: 'Portfolio',
      value: 'portfolio.khoipn.com',
      href: userData.portfolio,
    },
  ];

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
    <div className="relative min-h-[100dvh] w-full overflow-x-hidden bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <div className="cinema-container py-12">
        {/* Back link */}
        <Link
          href="/"
          className="mb-10 inline-flex items-center gap-2 text-[12px] font-medium tracking-[0.15em] uppercase transition-colors duration-200"
          style={{ color: 'var(--text-muted)' }}
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Home
        </Link>

        {/* Chapter header */}
        <p className="act-label mb-6">
          <span className="act-num">ACT V</span> &nbsp;TRANSMISSION
        </p>
        <h1 className="display-xl" style={{ color: 'var(--text-primary)' }}>
          Get in touch.
        </h1>
        <p className="lead mt-5">
          Reach out for collaborations, opportunities, or just to say hello.
        </p>

        {/* Contact cards */}
        <div ref={cardsRef} className="mt-14 space-y-3">
          {contactItems.map((item, idx) => {
            const Wrapper = item.href ? 'a' : 'div';
            return (
              <Wrapper
                key={idx}
                {...(item.href
                  ? { href: item.href, target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
                className="contact-card group block"
              >
                {/* Double-Bezel: Outer Shell */}
                <div
                  className="rounded-[1.25rem] p-[1.5px] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
                  style={{ background: 'var(--border-secondary)' }}
                >
                  {/* Double-Bezel: Inner Core */}
                  <div
                    className="flex items-center gap-5 rounded-[calc(1.25rem-1.5px)] p-6 transition-all duration-500 group-hover:-translate-y-0.5"
                    style={{
                      background: 'var(--bg-card)',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  >
                    <div
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-all duration-300 group-hover:scale-110"
                      style={{
                        background: 'var(--accent-glow)',
                        color: 'var(--accent-primary)',
                      }}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <p
                        className="text-[14px] font-medium"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {item.label}
                      </p>
                      <p className="text-[13px]" style={{ color: 'var(--text-tertiary)' }}>
                        {item.value}
                      </p>
                    </div>
                  </div>
                </div>
              </Wrapper>
            );
          })}
        </div>

        {/* Socials */}
        <div className="mt-14">
          <p
            className="mb-5 text-[12px] font-medium tracking-[0.15em] uppercase"
            style={{ color: 'var(--text-muted)' }}
          >
            Also find me on
          </p>
          <div className="flex flex-wrap gap-3">
            {socials.map((s) => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 rounded-full px-4 py-2.5 text-[13px] font-medium transition-all duration-300 hover:scale-[1.03]"
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
          </div>
        </div>
      </div>
    </div>
  );
}
