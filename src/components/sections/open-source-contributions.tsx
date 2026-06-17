"use client";

import { useState } from "react";
import { openSourcePRs } from "@/data/blogs-data";
import { useStaggerChildren } from "@/hooks/use-gsap";

type FilterType = "merged" | "open" | "closed";

/**
 * Open source contributions with Double-Bezel architecture.
 * Filter toggle with sliding pill animation.
 */
export function OpenSourceContributions() {
  const [filterType, setFilterType] = useState<FilterType>("merged");
  const listRef = useStaggerChildren({ y: 15, stagger: 0.08 });

  const filteredPRs = openSourcePRs.filter((pr) => pr.state === filterType);

  const stateColors: Record<string, { dot: string; glow: string }> = {
    merged: {
      dot: "bg-purple-500",
      glow: "shadow-[0_0_8px_rgba(168,85,247,0.4)]",
    },
    open: {
      dot: "bg-emerald-500",
      glow: "shadow-[0_0_8px_rgba(16,185,129,0.4)]",
    },
    closed: {
      dot: "bg-rose-500",
      glow: "shadow-[0_0_8px_rgba(244,63,94,0.4)]",
    },
  };

  return (
    <div className="w-full flex flex-col">
      <div className="py-2 relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2
          className="text-[18px] font-bold tracking-tight"
          style={{ color: "var(--text-primary)" }}
        >
          Open Source Contributions
        </h2>

        {/* Filter Toggle - Premium pill design */}
        <div className="flex items-center gap-2 relative z-20">
          <div
            className="relative grid grid-cols-3 p-1 rounded-full border w-fit select-none"
            style={{
              background: "var(--bg-card)",
              borderColor: "var(--border-accent)",
              boxShadow: "inset 0 1px 1px rgba(255,255,255,0.03)",
            }}
          >
            {/* Sliding Pill */}
            <div
              className="absolute top-1 bottom-1 left-1 w-[calc((100%-8px)/3)] rounded-full transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
              style={{
                background: "var(--accent-primary)",
                opacity: 0.15,
                transform: `translateX(${
                  filterType === "merged"
                    ? "0%"
                    : filterType === "open"
                    ? "100%"
                    : "200%"
                })`,
              }}
            />

            {(["merged", "open", "closed"] as FilterType[]).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className="z-10 relative px-3 py-1.5 text-[12px] font-medium text-center transition-colors duration-300 capitalize rounded-full"
                style={{
                  color:
                    filterType === type
                      ? "var(--text-primary)"
                      : "var(--text-tertiary)",
                }}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom line */}
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
        <div className="absolute bottom-0 -left-4 w-[2px] h-[2px] grid-dot -translate-x-1/2 translate-y-1/2 pointer-events-none z-20" />
        <div className="absolute bottom-0 -right-4 w-[2px] h-[2px] grid-dot translate-x-1/2 translate-y-1/2 pointer-events-none z-20" />
      </div>

      <div
        ref={listRef as React.RefObject<HTMLDivElement>}
        className="relative pt-4 pb-2 flex flex-col gap-2"
      >
        {filteredPRs.length > 0 ? (
          filteredPRs.map((pr, idx) => {
            const colors = stateColors[pr.state] || stateColors.merged;

            return (
              <a
                key={idx}
                href={pr.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block"
              >
                {/* Double-Bezel: Outer Shell */}
                <div
                  className="rounded-[0.875rem] p-[1.5px] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
                  style={{ background: "var(--border-accent)" }}
                >
                  {/* Double-Bezel: Inner Core */}
                  <div
                    className="rounded-[calc(0.875rem-1.5px)] p-4 transition-all duration-500 group-hover:-translate-y-0.5"
                    style={{
                      background: "var(--bg-card)",
                      boxShadow: "inset 0 1px 1px rgba(255,255,255,0.03)",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2.5 h-2.5 rounded-full shrink-0 ${colors.dot} ${colors.glow}`}
                      />
                      <div className="flex-1 min-w-0">
                        <h3
                          className="text-[14px] font-medium truncate transition-colors duration-300 group-hover:text-[var(--accent-primary)]"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {pr.title}
                        </h3>
                        <p
                          className="text-[12px] mt-0.5"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {pr.repository} · {pr.date}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            );
          })
        ) : (
          <div
            className="text-center py-8 text-[13px]"
            style={{ color: "var(--text-muted)" }}
          >
            No {filterType} pull requests found.
          </div>
        )}
      </div>
    </div>
  );
}
