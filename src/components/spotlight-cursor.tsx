'use client';

import { useEffect, useRef } from 'react';

const REGION = '[data-spotlight]';
const FOLLOW = 0.32;
const EASE = 0.16;
const FOCUS_DELAY = 650;
const FOCUS_SLOP = 14;
const FOCUS_PAD = 24;
const LABEL_GAP = 12;

type Box = { x: number; y: number; w: number; h: number };

/**
 * Inspector lens. Over a spotlight region a rounded viewfinder follows the
 * pointer and shows the region's alternate copy; holding still snaps the frame
 * to the whole region, the way a DevTools inspector selects an element.
 */
export function SpotlightCursor() {
  const crossRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const query = window.matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)');
    if (!query.matches) return;
    const cross = crossRef.current;
    const frame = frameRef.current;
    const label = labelRef.current;
    if (!cross || !frame || !label) return;
    const corners = Array.from(frame.children).filter(
      (child): child is HTMLElement => child instanceof HTMLElement && child !== label,
    );

    const root = document.documentElement;
    root.classList.add('has-spotlight');

    const target = { x: -100, y: -100 };
    const pos = { x: -100, y: -100, scale: 0, turn: 0 };
    const lens: Box = { x: -100, y: -100, w: 0, h: 0 };
    let active: HTMLElement | null = null;
    let painted: HTMLElement | null = null;
    let interactive = false;
    let visible = false;
    let focused = false;
    let focusAnchor = { x: 0, y: 0 };
    let lastMove = 0;
    let focusTimer = 0;
    let raf = 0;
    let lastLabel = '';

    const setLabel = (text: string) => {
      if (text !== lastLabel) {
        label.textContent = text;
        lastLabel = text;
      }
    };

    const lensGoal = (): Box => {
      if (!active) return { x: lens.x, y: lens.y, w: 0, h: 0 };
      const rect = active.getBoundingClientRect();
      if (focused) {
        return {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
          w: rect.width / 2 + FOCUS_PAD,
          h: rect.height / 2 + FOCUS_PAD,
        };
      }
      const size = Number(active.dataset.spotlightRadius ?? 180);
      return { x: target.x, y: target.y, w: size * 1.45, h: size * 0.8 };
    };

    const tick = () => {
      raf = 0;
      const now = performance.now();
      if (active && !focused && now - lastMove >= FOCUS_DELAY) {
        focused = true;
        focusAnchor = { ...target };
      }

      pos.x += (target.x - pos.x) * FOLLOW;
      pos.y += (target.y - pos.y) * FOLLOW;
      const scaleGoal = !visible || active ? 0 : 1;
      const turnGoal = interactive ? 90 : 0;
      pos.scale += (scaleGoal - pos.scale) * EASE;
      pos.turn += (turnGoal - pos.turn) * EASE;
      if (Math.abs(scaleGoal - pos.scale) < 0.01) pos.scale = scaleGoal;
      if (Math.abs(turnGoal - pos.turn) < 0.2) pos.turn = turnGoal;
      cross.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) rotate(${pos.turn}deg) scale(${pos.scale})`;
      cross.dataset.over = interactive ? 'link' : '';

      const goal = lensGoal();
      const k = focused ? EASE : FOLLOW;
      lens.x += (goal.x - lens.x) * (active ? k : 1);
      lens.y += (goal.y - lens.y) * (active ? k : 1);
      lens.w += (goal.w - lens.w) * EASE;
      lens.h += (goal.h - lens.h) * EASE;
      if (Math.abs(goal.w - lens.w) < 0.3) lens.w = goal.w;
      if (Math.abs(goal.h - lens.h) < 0.3) lens.h = goal.h;

      if (painted && painted !== active && active) {
        painted.style.setProperty('--lens-w', '0px');
        painted.style.setProperty('--lens-h', '0px');
        painted = null;
      }
      if (active) painted = active;
      if (painted) {
        const rect = painted.getBoundingClientRect();
        painted.style.setProperty('--lens-x', `${lens.x - rect.left}px`);
        painted.style.setProperty('--lens-y', `${lens.y - rect.top}px`);
        painted.style.setProperty('--lens-w', `${lens.w}px`);
        painted.style.setProperty('--lens-h', `${lens.h}px`);
        if (focused && active) {
          const tag = active.querySelector('h1, h2, h3, p')?.tagName.toLowerCase() ?? 'div';
          setLabel(`${tag} · ${Math.round(rect.width)} × ${Math.round(rect.height)}`);
        } else {
          setLabel(
            `x ${String(Math.round(lens.x - rect.left)).padStart(4, '0')} · y ${String(
              Math.round(lens.y - rect.top),
            ).padStart(4, '0')}`,
          );
        }
      }

      const open = lens.w > 1 && lens.h > 1;
      frame.dataset.open = open ? 'true' : '';
      frame.dataset.focused = focused ? 'true' : '';
      const [tl, tr, bl, br] = corners;
      tl.style.transform = `translate3d(${lens.x - lens.w}px, ${lens.y - lens.h}px, 0)`;
      tr.style.transform = `translate3d(${lens.x + lens.w}px, ${lens.y - lens.h}px, 0)`;
      bl.style.transform = `translate3d(${lens.x - lens.w}px, ${lens.y + lens.h}px, 0)`;
      br.style.transform = `translate3d(${lens.x + lens.w}px, ${lens.y + lens.h}px, 0)`;
      label.style.transform = `translate3d(${lens.x - lens.w}px, ${lens.y + lens.h + LABEL_GAP}px, 0)`;

      if (!open && !active && painted) {
        painted.style.removeProperty('--lens-w');
        painted.style.removeProperty('--lens-h');
        painted = null;
      }

      const settling =
        Math.abs(target.x - pos.x) > 0.1 ||
        Math.abs(target.y - pos.y) > 0.1 ||
        pos.scale !== scaleGoal ||
        pos.turn !== turnGoal ||
        lens.w !== goal.w ||
        lens.h !== goal.h ||
        Math.abs(goal.x - lens.x) > 0.1 ||
        Math.abs(goal.y - lens.y) > 0.1;
      if (settling) raf = requestAnimationFrame(tick);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      target.x = event.clientX;
      target.y = event.clientY;
      if (!visible) {
        pos.x = target.x;
        pos.y = target.y;
        lens.x = target.x;
        lens.y = target.y;
        visible = true;
      }
      const el = event.target instanceof Element ? event.target : null;
      const next = el?.closest<HTMLElement>(REGION) ?? null;
      if (next !== active) {
        focused = false;
        if (!active) {
          lens.x = target.x;
          lens.y = target.y;
        }
      }
      active = next;
      interactive = !active && Boolean(el?.closest('a, button, [role="button"], summary'));
      if (
        focused &&
        Math.hypot(target.x - focusAnchor.x, target.y - focusAnchor.y) > FOCUS_SLOP
      ) {
        focused = false;
      }
      if (!focused) {
        lastMove = performance.now();
        window.clearTimeout(focusTimer);
        if (active) focusTimer = window.setTimeout(schedule, FOCUS_DELAY + 16);
      }
      schedule();
    };
    const onLeave = () => {
      visible = false;
      active = null;
      focused = false;
      schedule();
    };
    const onScroll = () => {
      if (painted) schedule();
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(focusTimer);
      root.classList.remove('has-spotlight');
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('scroll', onScroll);
      painted?.style.removeProperty('--lens-w');
      painted?.style.removeProperty('--lens-h');
    };
  }, []);

  return (
    <>
      <div ref={crossRef} className="lens-cross" aria-hidden="true" />
      <div ref={frameRef} className="lens-frame" aria-hidden="true">
        <span data-corner="tl" />
        <span data-corner="tr" />
        <span data-corner="bl" />
        <span data-corner="br" />
        <span ref={labelRef} className="lens-label" />
      </div>
    </>
  );
}
