"use client";

import { useEffect, useState, useCallback } from "react";
import { Search, Command } from "lucide-react";
import { useLenis } from "lenis/react";

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const lenis = useLenis();

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      setOpen((prev) => !prev);
    }
    if (e.key === "Escape") setOpen(false);
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const scrollToSection = useCallback(
    (id: string) => {
      const el = document.getElementById(id);
      if (el && lenis) {
        lenis.scrollTo(el, { offset: -80 });
      }
    },
    [lenis]
  );

  const commands = [
    { label: "Go to Experience", action: () => scrollToSection("experience") },
    { label: "Go to Projects", action: () => scrollToSection("projects") },
    { label: "Go to Skills", action: () => scrollToSection("skills") },
    { label: "View Resume", action: () => window.open("/resume", "_self") },
    { label: "Contact Me", action: () => window.open("mailto:khoingoc456@gmail.com") },
    { label: "View GitHub", action: () => window.open("https://github.com/khoipn21", "_blank") },
  ];

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] transition-colors duration-200 border"
        style={{
          color: "var(--text-tertiary)",
          borderColor: "var(--border-accent)",
          background: "var(--bg-card)",
        }}
      >
        <Search className="w-3 h-3" />
        <span className="hidden sm:inline">Search</span>
        <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1 py-0.5 rounded text-[9px] font-mono"
          style={{ background: "var(--bg-secondary)", color: "var(--text-muted)" }}
        >
          <Command className="w-2.5 h-2.5" />K
        </kbd>
      </button>

      {/* Command palette overlay */}
      {open && (
        <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[20vh]" onClick={() => setOpen(false)} data-lenis-prevent>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-md mx-4 rounded-xl border overflow-hidden"
            style={{
              background: "var(--bg-card)",
              borderColor: "var(--border-secondary)",
              boxShadow: "var(--shadow-lg)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor: "var(--border-accent)" }}>
              <Search className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
              <input
                autoFocus
                placeholder="Type a command..."
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--text-muted)]"
                style={{ color: "var(--text-primary)" }}
              />
            </div>
            <div className="py-2 max-h-64 overflow-y-auto">
              {commands.map((cmd, i) => (
                <button
                  key={i}
                  onClick={() => { cmd.action(); setOpen(false); }}
                  className="w-full text-left px-4 py-2.5 text-sm transition-colors duration-150 flex items-center gap-3"
                  style={{ color: "var(--text-secondary)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--bg-secondary)";
                    e.currentTarget.style.color = "var(--text-primary)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "var(--text-secondary)";
                  }}
                >
                  {cmd.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
