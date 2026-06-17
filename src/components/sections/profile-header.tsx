"use client";

import { userData } from "@/data/user-data";
import { ThemeToggle } from "@/components/theme-toggle";
import { CommandMenu } from "@/components/layout/command-menu";
import Image from "next/image";

/**
 * Profile row below the banner — avatar, name, theme toggle + command menu.
 */
export function ProfileHeader() {
  return (
    <div className="absolute left-0 right-0 md:left-[30%] md:right-[30%] top-[22vh] h-[112px] flex items-center px-4 z-50">
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
                src="/images/avatar-pixel.png"
                alt="Pixel Art Avatar"
                width={240}
                height={240}
                quality={90}
                fetchPriority="high"
                sizes="(min-width: 640px) 120px, 96px"
                className="h-full w-full object-cover"
                style={{ imageRendering: "pixelated" }}
              />
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <h1
              className="text-[20px] sm:text-[24px] font-bold tracking-tight leading-none mb-0.5"
              style={{
                color: "var(--text-primary)",
                textShadow: "var(--text-primary) === #fafafa ? -1.5px 0 0 rgba(0,200,255,0.3), 1.5px 0 0 rgba(255,80,0,0.3) : none",
              }}
            >
              {userData.displayName}
            </h1>
            <p className="text-[13px] sm:text-[14px]" style={{ color: "var(--text-tertiary)" }}>
              {userData.age}
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
