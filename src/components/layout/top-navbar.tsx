"use client";

import { useEffect, useState } from "react";
import { CommandMenu } from "@/components/layout/command-menu";

export function TopNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <nav className="fixed top-2 right-4 md:right-[31%] z-[100] pointer-events-auto">
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
