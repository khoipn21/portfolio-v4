import type { ReactNode } from 'react';

/**
 * Wraps content with a hidden alternate layer that the spotlight cursor
 * reveals inside a circle. The alternate copy is decorative and stays out of
 * the accessibility tree.
 */
export function Spotlight({
  children,
  reveal,
  className = '',
  radius = 180,
}: {
  children: ReactNode;
  reveal: ReactNode;
  className?: string;
  radius?: number;
}) {
  return (
    <div className={`spotlight ${className}`} data-spotlight data-spotlight-radius={radius}>
      {children}
      <div className="spotlight-layer" aria-hidden="true">
        {reveal}
      </div>
    </div>
  );
}
