"use client";

import { useEffect, useState } from "react";
import { useLenis } from "lenis/react";

export function RightNavbar() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const lenis = useLenis();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el && lenis) {
      lenis.scrollTo(el, { offset: -80, duration: 1.2 });
    } else if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0.1 },
    );

    const sections = [
      "experience",
      "projects",
      // "opensource",
      "skills",
      // "blogs",
    ];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const links = [
    { name: "Experience", href: "#experience", id: "experience" },
    { name: "Projects", href: "#projects", id: "projects" },
    // { name: "Open Source", href: "#opensource", id: "opensource" },
    { name: "Skills", href: "#skills", id: "skills" },
    // { name: "Blog", href: "#blogs", id: "blogs" },
  ];

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col items-end gap-3">
      {/* Vertical line */}
      <div
        className="absolute top-0 bottom-0 right-[5px] w-0 border-r pointer-events-none"
        style={{
          borderColor: "var(--border-accent)",
          maskImage:
            "repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 6px)",
          WebkitMaskImage:
            "repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 6px)",
        }}
      />

      {links.map((link) => {
        const isActive = activeSection === link.id;
        return (
          <a
            key={link.name}
            href={link.href}
            onClick={(e) => handleNavClick(e, link.id)}
            className="flex items-center gap-3 group relative"
          >
            <span
              className="text-[10px] font-medium tracking-[0.1em] uppercase transition-all duration-300 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0"
              style={{
                color: isActive ? "var(--accent-primary)" : "var(--text-muted)",
              }}
            >
              {link.name}
            </span>
            <div
              className="w-[10px] h-[10px] rounded-full border-2 transition-all duration-300 relative z-10"
              style={{
                borderColor: isActive
                  ? "var(--accent-primary)"
                  : "var(--border-primary)",
                background: isActive
                  ? "var(--accent-primary)"
                  : "var(--bg-primary)",
                boxShadow: isActive ? "0 0 8px var(--accent-glow)" : "none",
              }}
            />
          </a>
        );
      })}
    </div>
  );
}
