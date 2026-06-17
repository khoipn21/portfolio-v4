"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun, Leaf } from "lucide-react";
import { cn } from "@/lib/utils";

const themes = [
  { id: "dark", label: "Dark", icon: Moon, emoji: "🌙" },
  { id: "light", label: "Light", icon: Sun, emoji: "☀️" },
  { id: "mint", label: "Mint", icon: Leaf, emoji: "🍃" },
] as const;

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isChanging, setIsChanging] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setMounted(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const handleThemeChange = (id: string) => {
    if (id === theme) return;
    setIsChanging(true);
    setTheme(id);
    setTimeout(() => setIsChanging(false), 300);
  };

  if (!mounted) {
    return (
      <div
        className={cn("flex items-center gap-1 p-1 rounded-full border", className)}
        style={{ borderColor: "var(--border-secondary)", background: "var(--bg-secondary)" }}
      >
        {themes.map((t) => (
          <div key={t.id} className="w-7 h-7 rounded-full" />
        ))}
      </div>
    );
  }

  const currentIndex = themes.findIndex((t) => t.id === theme);
  const activeIndex = currentIndex === -1 ? 0 : currentIndex;

  return (
    <div
      className={cn(
        "relative flex items-center gap-1 p-1 rounded-full border transition-all duration-300",
        isChanging && "scale-95",
        className
      )}
      style={{
        borderColor: "var(--border-secondary)",
        background: "var(--bg-secondary)",
        boxShadow: isChanging ? "0 0 12px var(--accent-glow)" : "none",
      }}
    >
      {/* Sliding indicator with spring animation */}
      <div
        className="absolute top-1 w-7 h-7 rounded-full transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
        style={{
          left: `calc(4px + ${activeIndex} * 32px)`,
          background: "var(--accent-primary)",
          opacity: 0.2,
          transform: isChanging ? "scale(1.1)" : "scale(1)",
        }}
      />

      {themes.map((t) => {
        const Icon = t.icon;
        const isActive = theme === t.id;
        return (
          <button
            key={t.id}
            onClick={() => handleThemeChange(t.id)}
            className={cn(
              "relative z-10 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200",
              isActive
                ? "text-[var(--accent-primary)] scale-110"
                : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:scale-105"
            )}
            aria-label={`Switch to ${t.label} theme`}
            title={t.label}
          >
            <Icon
              className={cn(
                "w-3.5 h-3.5 transition-transform duration-200",
                isActive && "rotate-0",
                !isActive && "-rotate-12"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
