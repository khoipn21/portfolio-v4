"use client";

import { BannerParticles } from "./banner-particles";
import { CurrentTime } from "./current-time";
import { useEffect, useState, useRef } from "react";
import { useTheme } from "next-themes";
import { useLenis } from "lenis/react";
import gsap from "gsap";

/**
 * Banner config per theme.
 * Each theme has its own looping background video and opacity.
 */
const bannerConfig = {
  dark: {
    video: "/videos/dark-loop.mp4",
    opacity: 0.35,
  },
  light: {
    video: "/videos/light-loop.mp4",
    opacity: 0.45,
  },
  mint: {
    video: "/videos/mint-loop.mp4",
    opacity: 0.4,
  },
} as const;

/**
 * Hero banner area with theme-specific background images.
 * Fixes: only one banner visible at a time, proper crossfade on theme switch.
 */
export function Banner() {
  const [mounted, setMounted] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const { theme } = useTheme();
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset video ready state when theme changes
  useEffect(() => {
    setVideoReady(false);
  }, [theme]);

  // Velocity-driven parallax — uses useLenis callback (no re-renders)
  useLenis((lenis: { scroll: number; velocity: number }) => {
    if (!orb1Ref.current || !orb2Ref.current) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    // Orb 1: moves slower than scroll (parallax depth)
    gsap.set(orb1Ref.current, { y: lenis.scroll * -0.3 });
    // Orb 2: moves even slower + velocity influence
    gsap.set(orb2Ref.current, {
      y: lenis.scroll * -0.2 + lenis.velocity * 0.05,
    });
  });

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
      {/* Theme-specific looping video banner - hidden until ready */}
      {mounted && (
        <video
          ref={videoRef}
          key={config.video}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out"
          style={{ opacity: videoReady ? config.opacity : 0 }}
          onCanPlay={() => setVideoReady(true)}
        >
          <source src={config.video} type="video/mp4" />
        </video>
      )}

      {/* Animated gradient orbs */}
      {mounted && (
        <>
          <div
            ref={orb1Ref}
            className="absolute w-[300px] h-[300px] rounded-full blur-[80px] animate-float"
            style={{
              background: "var(--accent-primary)",
              opacity: 0.08,
              top: "-50%",
              left: "-10%",
            }}
          />
          <div
            ref={orb2Ref}
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
