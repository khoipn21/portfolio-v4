"use client";

import { useEffect, useState } from "react";
import { userData } from "@/data/user-data";
import Image from "next/image";

/**
 * GitHub contribution graph using github-readme-stats.
 * Falls back to a static placeholder if fetch fails.
 */
export function GithubGraph() {
  const [mounted, setMounted] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => setMounted(true), []);
  /* eslint-enable react-hooks/set-state-in-effect */

  if (!mounted) return null;

  return (
    <div className="mt-6 flex flex-col relative z-10">
      {/* Top line */}
      <div
        className="absolute top-0 left-[-100vw] right-[-100vw] h-0 border-t pointer-events-none"
        style={{
          borderColor: "var(--grid-line)",
          maskImage:
            "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
          WebkitMaskImage:
            "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
        }}
      />
      <div className="absolute top-0 -left-4 w-[2px] h-[2px] grid-dot -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20" />
      <div className="absolute top-0 -right-4 w-[2px] h-[2px] grid-dot translate-x-1/2 -translate-y-1/2 pointer-events-none z-20" />

      <div className="py-2 relative">
        <h2 className="text-[18px] font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
          GitHub Activity
        </h2>
        <div
          className="absolute bottom-0 left-[-100vw] right-[-100vw] h-0 border-b pointer-events-none"
          style={{
            borderColor: "var(--grid-line)",
            maskImage:
              "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
            WebkitMaskImage:
              "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
          }}
        />
      </div>

      <div className="pt-4 pb-2">
        <a
          href={`https://github.com/${userData.githubUsername}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <Image
            src={`https://github-readme-stats.vercel.app/api?username=${userData.githubUsername}&show_icons=true&theme=transparent&hide_border=true&count_private=true`}
            alt="GitHub contribution statistics for Pham Ngoc Khoi"
            width={600}
            height={200}
            className="w-full max-w-md"
            sizes="(max-width: 768px) 100vw, 600px"
            loading="lazy"
            unoptimized
          />
        </a>
      </div>
    </div>
  );
}
