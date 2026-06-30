'use client';

/**
 * Fading grid filler at the bottom of the page.
 * Shows a subtle grid pattern that fades out.
 */
export function FooterBackground() {
  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Top line */}
      <div
        className="pointer-events-none absolute top-0 right-[-100vw] left-[-100vw] z-10 h-0 border-t"
        style={{
          borderColor: 'var(--grid-line)',
          maskImage:
            'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)',
          WebkitMaskImage:
            'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)',
        }}
      />
      <div className="grid-dot pointer-events-none absolute top-0 left-0 z-20 h-[2px] w-[2px] -translate-x-1/2 -translate-y-1/2" />
      <div className="grid-dot pointer-events-none absolute top-0 right-0 z-20 h-[2px] w-[2px] translate-x-1/2 -translate-y-1/2" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, var(--text-primary) 1px, transparent 0)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Fade gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom, transparent 0%, var(--bg-primary) 100%)`,
        }}
      />

      {/* Footer text */}
      <div className="absolute right-0 bottom-8 left-0 flex flex-col items-center gap-2">
        <p className="text-[12px]" style={{ color: 'var(--text-muted)' }}>
          Built with Next.js, Tailwind CSS & GSAP
        </p>
        <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
          © {new Date().getFullYear()} Pham Ngoc Khoi
        </p>
      </div>
    </div>
  );
}
