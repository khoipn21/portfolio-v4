"use client";

import { BannerParticles } from "./banner-particles";
import { CurrentTime } from "./current-time";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";

/**
 * Banner image config per theme.
 * Each theme has its own banner image and opacity.
 */
const bannerConfig = {
  dark: {
    src: "/images/banner-pixel-dark.png",
    opacity: 0.35,
  },
  light: {
    src: "/images/banner-pixel-light.png",
    opacity: 0.45,
  },
  mint: {
    src: "/images/banner-mint.png",
    opacity: 0.4,
  },
} as const;

/**
 * Hero banner area with theme-specific background images.
 * Fixes: only one banner visible at a time, proper crossfade on theme switch.
 */
export function Banner() {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Get current theme config, fallback to dark
  const currentTheme = (theme as keyof typeof bannerConfig) || "dark";
  const config = bannerConfig[currentTheme] || bannerConfig.dark;

  return (
    <div
      className="absolute left-0 right-0 md:left-[30%] md:right-[30%] top-0 h-[22vh] -z-0 pointer-events-auto overflow-hidden"
      style={{
        background: "var(--gradient-hero)",
        boxShadow: "var(--shadow-md)",
      }}
    >
      {/* Theme-specific banner - only render after mount to avoid hydration mismatch */}
      {mounted && (
        <Image
          src={config.src}
          alt=""
          fill
          loading="eager"
          fetchPriority="high"
          sizes="(min-width: 768px) 40vw, 100vw"
          quality={80}
          className="object-cover object-center transition-opacity duration-700 ease-in-out"
          style={{ opacity: config.opacity }}
        />
      )}

      {/* Animated gradient orbs */}
      {mounted && (
        <>
          <div
            className="absolute w-[300px] h-[300px] rounded-full blur-[80px] animate-float"
            style={{
              background: "var(--accent-primary)",
              opacity: 0.08,
              top: "-50%",
              left: "-10%",
            }}
          />
          <div
            className="absolute w-[200px] h-[200px] rounded-full blur-[60px] animate-float-delayed"
            style={{
              background: "var(--accent-secondary)",
              opacity: 0.06,
              bottom: "-30%",
              right: "10%",
            }}
          />
        </>
      )}

      {/* Dot pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, var(--text-primary) 1px, transparent 0)`,
          backgroundSize: "24px 24px",
        }}
      />

      {/* Mesh gradient overlay */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background: `
            radial-gradient(ellipse at 20% 50%, var(--accent-glow), transparent 50%),
            radial-gradient(ellipse at 80% 50%, var(--accent-glow), transparent 50%)
          `,
        }}
      />

      <BannerParticles />

      {/* Gradient overlays for smooth transition */}
      <div
        className="absolute inset-x-0 bottom-0 h-20 pointer-events-none z-[5]"
        style={{
          background: `linear-gradient(to top, var(--bg-primary) 0%, transparent 100%)`,
          opacity: 0.95,
        }}
      />
      <div
        className="absolute left-0 top-0 bottom-0 w-16 pointer-events-none z-20"
        style={{
          background: `linear-gradient(to right, color-mix(in srgb, var(--bg-primary) 95%, transparent), transparent)`,
        }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-16 pointer-events-none z-20"
        style={{
          background: `linear-gradient(to left, color-mix(in srgb, var(--bg-primary) 95%, transparent), transparent)`,
        }}
      />

      {/* Corner decorations */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <div
          className="w-8 h-[1px]"
          style={{ background: "var(--accent-primary)", opacity: 0.4 }}
        />
        <div
          className="w-[1px] h-8"
          style={{ background: "var(--accent-primary)", opacity: 0.4 }}
        />
      </div>
      <div className="absolute top-4 right-4 z-10 pointer-events-none">
        <div
          className="w-8 h-[1px] ml-auto"
          style={{ background: "var(--accent-primary)", opacity: 0.4 }}
        />
        <div
          className="w-[1px] h-8 ml-auto"
          style={{ background: "var(--accent-primary)", opacity: 0.4 }}
        />
      </div>

      <div className="absolute bottom-3 right-2 z-10 pointer-events-auto">
        <CurrentTime />
      </div>
    </div>
  );
}
