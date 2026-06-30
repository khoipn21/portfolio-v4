/**
 * Manual text-splitting helpers — SSR-safe replacement for gsap/SplitText.
 *
 * Splitting is applied inside client effects (never during render) to avoid
 * hydration mismatch. The original innerHTML is captured so the element can
 * be reverted (e.g. on cleanup or theme/font resize).
 *
 * Pattern proven in src/components/sections/profile-header.tsx.
 */

export type SplitMode = 'chars' | 'words';

export interface SplitResult {
  /** The wrapper span elements (one per char or word). */
  items: HTMLElement[];
  /** Restore the element's original innerHTML. */
  revert: () => void;
}

const wrapChar = (char: string): string =>
  char === ' '
    ? `<span class="split-char" style="display:inline-block;will-change:transform">&nbsp;</span>`
    : `<span class="split-char" style="display:inline-block;will-change:transform">${char}</span>`;

const wrapWord = (word: string): string =>
  `<span class="split-word" style="display:inline-block;will-change:transform;white-space:nowrap">${word}</span>`;

/**
 * Split an element's text content into char or word spans.
 * Call this inside a client effect (useGSAP / useEffect).
 */
export function splitText(el: HTMLElement, mode: SplitMode = 'chars'): SplitResult {
  const original = el.innerHTML;
  const text = el.textContent || '';

  if (!text) {
    return { items: [], revert: () => {} };
  }

  el.innerHTML =
    mode === 'chars'
      ? text.split('').map(wrapChar).join('')
      : text
          .split(/(\s+)/)
          .map((part) => (part.trim() === '' ? part : wrapWord(part)))
          .join('');

  const selector = mode === 'chars' ? '.split-char' : '.split-word';
  const items = Array.from(el.querySelectorAll(selector)) as HTMLElement[];

  return {
    items,
    revert: () => {
      el.innerHTML = original;
    },
  };
}

/** True when the user prefers reduced motion. */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
