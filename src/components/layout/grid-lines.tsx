'use client';

/**
 * Blueprint-style grid overlay with dotted lines and intersection nodes.
 * Only visible on md+ screens to keep mobile clean.
 */
export function GridLines() {
  return (
    <>
      {/* Vertical lines at 30% and 70% */}
      <div
        className="pointer-events-none absolute top-0 bottom-0 left-[30%] hidden w-0 border-r md:block"
        style={{
          borderColor: 'var(--grid-line)',
          maskImage:
            'repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 6px)',
          WebkitMaskImage:
            'repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 6px)',
        }}
      />
      <div
        className="pointer-events-none absolute top-0 right-[30%] bottom-0 hidden w-0 border-r md:block"
        style={{
          borderColor: 'var(--grid-line)',
          maskImage:
            'repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 6px)',
          WebkitMaskImage:
            'repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 6px)',
        }}
      />

      {/* Horizontal lines at banner bottom */}
      <div
        className="pointer-events-none absolute top-[22vh] right-0 left-0 h-0 border-b"
        style={{
          borderColor: 'var(--grid-line)',
          maskImage:
            'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)',
          WebkitMaskImage:
            'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)',
        }}
      />
      <div
        className="pointer-events-none absolute top-[calc(22vh+112px)] right-0 left-0 h-0 border-b"
        style={{
          borderColor: 'var(--grid-line)',
          maskImage:
            'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)',
          WebkitMaskImage:
            'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)',
        }}
      />

      {/* Intersection dots */}
      {[
        { top: '22vh', left: '30%' },
        { top: '22vh', right: '30%' },
        { top: 'calc(22vh + 112px)', left: '30%' },
        { top: 'calc(22vh + 112px)', right: '30%' },
      ].map((pos, i) => (
        <div
          key={i}
          className="grid-dot pointer-events-none absolute z-10 hidden h-[2px] w-[2px] md:block"
          style={{
            top: pos.top,
            left: pos.left,
            right: pos.right,
            transform: `translate(${pos.right ? '50%' : '-50%'}, -50%)`,
          }}
        />
      ))}
    </>
  );
}
