"use client";

import { useRef } from "react";
import { userData } from "@/data/user-data";
import { ThemeToggle } from "@/components/theme-toggle";
import { CommandMenu } from "@/components/layout/command-menu";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

/**
 * Profile row below the banner — avatar, name, theme toggle + command menu.
 * Name reveals character-by-character on scroll (center-outward stagger).
 */
export function ProfileHeader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);

  // Character-by-character reveal on scroll
  useGSAP(
    () => {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (prefersReduced || !nameRef.current || !containerRef.current) return;

      const el = nameRef.current;
      const text = el.textContent || "";
      if (!text) return;

      // Split text into individual character spans
      el.innerHTML = text
        .split("")
        .map(
          (char) =>
            `<span class="char-reveal" style="display:inline-block; will-change:transform">${char === " " ? "&nbsp;" : char}</span>`,
        )
        .join("");

      const chars = el.querySelectorAll(".char-reveal");
      if (!chars.length) return;

      // Initial state: hidden
      gsap.set(chars, { yPercent: 150, autoAlpha: 0 });

      // Animate on scroll — center-outward stagger
      gsap.to(chars, {
        yPercent: 0,
        autoAlpha: 1,
        duration: 0.6,
        stagger: {
          from: "center",
          each: 0.04,
        },
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    },
    { scope: containerRef },
  );

  return (
    <div
      ref={containerRef}
      className="absolute left-0 right-0 md:left-[30%] md:right-[30%] top-[22vh] h-[112px] flex items-center px-4 z-50"
    >
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-4 sm:gap-5">
          {/* Avatar with pixel art style and Double-Bezel frame */}
          <div
            className="relative p-[3px] rounded-[12px] sm:rounded-[14px] border-[1.5px] shrink-0 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
            style={{ borderColor: "var(--border-primary)" }}
          >
            <div
              className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-[9px] sm:rounded-[11px] overflow-hidden"
              style={{
                background: "var(--bg-secondary)",
                boxShadow: "inset 0 1px 1px rgba(255,255,255,0.05)",
              }}
            >
              {/* Pixel art avatar */}
              <Image
                src="/images/pixel-avatar.gif"
                alt="Pixel Art Avatar"
                width={96}
                height={96}
                className="h-full w-full object-cover"
                style={{ imageRendering: "pixelated" }}
                unoptimized
              />
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <h1
              ref={nameRef}
              className="text-[20px] sm:text-[24px] font-bold tracking-tight leading-none mb-0.5 overflow-hidden"
              style={{
                color: "var(--text-primary)",
              }}
            >
              {userData.name}
            </h1>
            <p
              className="text-[13px] sm:text-[14px]"
              style={{ color: "var(--text-tertiary)" }}
            >
              {userData.headline}
            </p>
          </div>
        </div>

        <div className="flex items-start justify-end gap-2 sm:gap-3 h-20 sm:h-24 py-1">
          <CommandMenu />
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
