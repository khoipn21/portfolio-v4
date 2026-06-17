"use client";

import { useEffect, useState, useRef } from "react";
import { CommandMenu } from "@/components/layout/command-menu";
import { useScrollVelocity } from "@/hooks/use-scroll-velocity";
import gsap from "gsap";

export function TopNavbar() {
  const { scroll, direction } = useScrollVelocity();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const hiddenRef = useRef(false);

  const scrolled = scroll > 20;

  // Direction-aware hide/show via GSAP quickTo
  useEffect(() => {
    if (!navRef.current) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Hide on scroll-down past 200px, show on scroll-up
    if (scroll > 200 && direction === 1 && !hiddenRef.current) {
      hiddenRef.current = true;
      if (prefersReduced) {
        gsap.set(navRef.current, { y: -100, opacity: 0 });
      } else {
        gsap.to(navRef.current, {
          y: -100,
          opacity: 0,
          duration: 0.4,
          ease: "power2.inOut",
        });
      }
    } else if (direction === -1 && hiddenRef.current) {
      hiddenRef.current = false;
      if (prefersReduced) {
        gsap.set(navRef.current, { y: 0, opacity: 1 });
      } else {
        gsap.to(navRef.current, {
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
    { name: "Blog", href: "#blogs", id: "blogs" },
  ];

  return (
    <nav
      ref={navRef}
      className="fixed top-2 right-4 md:right-[31%] z-[100] pointer-events-auto"
    >
      <div
        className="flex items-center gap-5 px-5 py-2.5 rounded-full transition-all duration-300"
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

        <CommandMenu />
      </div>
    </nav>
  );
}
