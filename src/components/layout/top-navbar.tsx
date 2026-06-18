"use client";

import { useEffect, useState, useRef } from "react";
import { CommandMenu } from "@/components/layout/command-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { CompactThemeToggle } from "@/components/compact-theme-toggle";
import { useScrollVelocity } from "@/hooks/use-scroll-velocity";
import { useLenis } from "lenis/react";
import gsap from "gsap";

export function TopNavbar() {
  const { scroll, direction } = useScrollVelocity();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const hiddenRef = useRef(false);
  const lenis = useLenis();

  const scrolled = scroll > 20;

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el && lenis) {
      lenis.scrollTo(el, { offset: -80, duration: 1.2 });
    } else if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Direction-aware hide/show via GSAP (animates inner wrapper so the nav's
  // own centering transform on mobile is preserved)
  useEffect(() => {
    if (!innerRef.current) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Hide on scroll-down past 200px, show on scroll-up
    if (scroll > 200 && direction === 1 && !hiddenRef.current) {
      hiddenRef.current = true;
      if (prefersReduced) {
        gsap.set(innerRef.current, { y: -100, opacity: 0 });
      } else {
        gsap.to(innerRef.current, {
          y: -100,
          opacity: 0,
          duration: 0.4,
          ease: "power2.inOut",
        });
      }
    } else if (direction === -1 && hiddenRef.current) {
      hiddenRef.current = false;
      if (prefersReduced) {
        gsap.set(innerRef.current, { y: 0, opacity: 1 });
      } else {
        gsap.to(innerRef.current, {
          y: 0,
          opacity: 1,
          duration: 0.4,
          ease: "power2.out",
        });
      }
    }
  }, [scroll, direction]);

  // IntersectionObserver for active section tracking (right tool for the job)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0.1 }
    );

    const sections = ["experience", "projects", "opensource", "skills", "blogs"];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const links = [
    { name: "Experience", href: "#experience", id: "experience" },
    { name: "Projects", href: "#projects", id: "projects" },
    { name: "Skills", href: "#skills", id: "skills" },
  ];

  return (
    <nav
      ref={navRef}
      className="fixed top-2 left-1/2 -translate-x-1/2 z-[100] pointer-events-auto"
    >
      <div
        ref={innerRef}
        className="flex items-center gap-3 sm:gap-5 px-4 sm:px-5 py-2.5 rounded-full transition-all duration-300"
        style={{
          background: scrolled
            ? "color-mix(in srgb, var(--bg-primary) 80%, transparent)"
            : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          boxShadow: scrolled ? "var(--shadow-md)" : "none",
          borderColor: scrolled ? "var(--border-secondary)" : "transparent",
          borderWidth: "1px",
          borderStyle: "solid",
        }}
      >
        {links.map((link) => {
          const isActive = activeSection === link.id;
          return (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.id)}
              className="text-[12px] font-medium tracking-[0.05em] transition-colors duration-500"
              style={{
                color: isActive
                  ? "var(--text-primary)"
                  : "var(--text-tertiary)",
              }}
            >
              {link.name}
            </a>
          );
        })}

        <div
          className="w-[1px] h-3.5 mx-0.5"
          style={{ background: "var(--border-secondary)" }}
        />

        {/* Full 3-pill switcher on desktop, single-icon cycle on mobile */}
        <div className="hidden lg:block">
          <ThemeToggle />
        </div>
        <div className="lg:hidden">
          <CompactThemeToggle />
        </div>

        <div
          className="w-[1px] h-3.5 mx-0.5"
          style={{ background: "var(--border-secondary)" }}
        />

        <CommandMenu />
      </div>
    </nav>
  );
}
