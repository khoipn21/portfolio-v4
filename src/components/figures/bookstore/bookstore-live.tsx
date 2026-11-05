'use client';
/* eslint-disable react/no-danger -- every injected string is SVG built by ./art and ./frame from numbers, never from user input */

import * as React from 'react';
import type { BookstoreArt } from './art';
import { keyAt } from './frame';
import { LAST_STAGE, announceOf, poseAt, readoutOf } from './model';
import { BOOK_X0, CARD_RISE, DRAWER_TRAVEL, HEIGHT, LATCH_TRAVEL, SLIP_PITCH, STROKE, WIDTH, bookXAt, move } from './view';

const REST_KEY = keyAt(0);
/* Stage units a second: about 1.8 s from one stage to the next. */
const SPEED = 0.55;
const DWELL = 1.1;
const LAST_DWELL = 2.2;
const FADE = 0.32;
const IDLE_BACK = 5000;
const MOST_DT = 1 / 30;

interface Props {
  art: BookstoreArt;
  label: string;
}

const Layer = ({ html }: { html: string }) => <g dangerouslySetInnerHTML={{ __html: html }} />;

export function BookstoreLive({ art, label }: Props) {
  const stage = React.useRef<HTMLDivElement>(null);
  const drawerBack = React.useRef<SVGGElement>(null);
  const drawerMid = React.useRef<SVGGElement>(null);
  const drawerFront = React.useRef<SVGGElement>(null);
  const cardStill = React.useRef<SVGGElement>(null);
  const cardUp = React.useRef<SVGGElement>(null);
  const book = React.useRef<SVGGElement>(null);
  const latch = React.useRef<SVGGElement>(null);
  const slip = React.useRef<SVGGElement>(null);
  const stamp = React.useRef<SVGGElement>(null);
  const key = React.useRef<SVGGElement>(null);
  const marks = React.useRef<Array<SVGGElement | null>>([]);
  const said = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    const root = stage.current;
    if (!root) return;
    const readout = root.closest('.iso-plate')?.querySelector('[data-readout]');
    const still = window.matchMedia('(prefers-reduced-motion: reduce)');
    let p = 0;
    let target = 0;
    let fade = 1;
    let resetting = false;
    let touring = !still.matches;
    let wait = DWELL;
    let visible = false;
    let frame = 0;
    let last = 0;
    let idle = 0;
    let shown = '';
    let shownKey = 0;
    let spoken = -1;

    const put = (element: Element | null, transform: string) => {
      if (element && element.getAttribute('transform') !== transform) element.setAttribute('transform', transform);
    };
    const show = (element: Element | null, on: boolean) => element?.setAttribute('opacity', on ? '1' : '0');

    const draw = () => {
      const pose = poseAt(p);
      const out = move([0, DRAWER_TRAVEL * pose.drawer, 0]);
      put(drawerBack.current, out);
      put(drawerMid.current, out);
      put(drawerFront.current, out);
      const up = pose.card > 0.002;
      show(cardStill.current, !up);
      show(cardUp.current, up);
      put(cardUp.current, move([0, 0, CARD_RISE * pose.card]));
      put(book.current, move([bookXAt(pose.bookX) - BOOK_X0, 0, 0]));
      put(slip.current, move([-SLIP_PITCH * pose.slip, 0, 0]));
      put(latch.current, move([0, -LATCH_TRAVEL * pose.key, 0]));
      put(stamp.current, move([0, 0, -STROKE * pose.ram]));
      pose.marks.forEach((on, index) => marks.current[index]?.setAttribute('opacity', on.toFixed(2)));
      const turn = Math.round(pose.key * 60) / 60;
      if (turn !== shownKey && key.current) {
        shownKey = turn;
        key.current.innerHTML = keyAt(turn);
      }
      if (pose.inCart) root.dataset.cart = '';
      else delete root.dataset.cart;
      root.style.setProperty('--bs-fade', fade.toFixed(3));
      const text = readoutOf(p);
      if (text !== shown && readout) {
        shown = text;
        readout.textContent = text;
      }
      const at = Math.round(p);
      if (Math.abs(p - at) < 1e-3 && at !== spoken && fade === 1) {
        spoken = at;
        if (said.current) said.current.textContent = announceOf(at);
      }
    };

    const tick = (now: number) => {
      const dt = last ? Math.min((now - last) / 1000, MOST_DT) : 1 / 60;
      last = now;
      const calm = still.matches;
      if (resetting) {
        fade = calm ? 0 : Math.max(0, fade - dt / FADE);
        if (fade === 0) {
          p = 0;
          resetting = false;
          target = 1;
          wait = DWELL;
        }
      } else if (fade < 1) fade = calm ? 1 : Math.min(1, fade + dt / FADE);
      if (!resetting) {
        const gap = target - p;
        p = calm ? target : p + Math.sign(gap) * Math.min(Math.abs(gap), SPEED * dt);
        if (touring && p === target) {
          wait -= dt;
          if (wait <= 0) {
            if (target >= LAST_STAGE) resetting = true;
            else {
              target += 1;
              wait = target === LAST_STAGE ? LAST_DWELL : DWELL;
            }
          }
        }
      }
      draw();
      const settled = !touring && !resetting && p === target && fade === 1;
      frame = visible && !settled ? requestAnimationFrame(tick) : 0;
    };

    const run = () => {
      if (!frame && visible) {
        last = 0;
        frame = requestAnimationFrame(tick);
      }
    };

    const next = () => {
      touring = false;
      window.clearTimeout(idle);
      if (resetting) return;
      if (target >= LAST_STAGE) {
        if (p !== target) return;
        resetting = true;
      } else target += 1;
      if (still.matches) {
        if (resetting) {
          resetting = false;
          target = 1;
        }
        p = target;
        draw();
      }
      idle = window.setTimeout(() => {
        touring = !still.matches;
        wait = DWELL;
        run();
      }, IDLE_BACK);
      run();
    };

    const observer = new IntersectionObserver(
      (entries) => {
        visible = Boolean(entries.at(-1)?.isIntersecting);
        if (visible) run();
        else if (frame) {
          cancelAnimationFrame(frame);
          frame = 0;
        }
      },
      { rootMargin: '120px 0px' },
    );
    observer.observe(root);

    const onDown = (event: PointerEvent) => {
      if (event.button !== 0) return;
      next();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== ' ' && event.key !== 'Enter') return;
      event.preventDefault();
      if (!event.repeat) next();
    };
    const onStill = () => {
      touring = !still.matches && touring;
      run();
    };

    root.addEventListener('pointerdown', onDown);
    root.addEventListener('keydown', onKeyDown);
    still.addEventListener('change', onStill);
    draw();

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.clearTimeout(idle);
      root.removeEventListener('pointerdown', onDown);
      root.removeEventListener('keydown', onKeyDown);
      still.removeEventListener('change', onStill);
    };
  }, []);

  return (
    <div
      ref={stage}
      className="iso-stage fig-stage bs-stage"
      tabIndex={0}
      role="button"
      aria-label="Bookstore machine: press the figure, or press Enter or Space, to send the next book through search, cart and order"
    >
      <svg className="iso-svg" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label={label} focusable="false">
        <defs>
          <clipPath id="bs-drawer-clip" clipPathUnits="userSpaceOnUse">
            <path d={art.clip} />
          </clipPath>
        </defs>
        <Layer html={art.base} />
        <Layer html={art.cabinet} />
        <g clipPath="url(#bs-drawer-clip)">
          <g ref={drawerBack}>
            <Layer html={art.drawer} />
            <Layer html={art.cardsBehind} />
            <g ref={cardStill} dangerouslySetInnerHTML={{ __html: art.cardMatch }} />
          </g>
        </g>
        <g ref={drawerMid}>
          <g ref={cardUp} opacity="0" dangerouslySetInnerHTML={{ __html: art.cardMatch }} />
        </g>
        <g clipPath="url(#bs-drawer-clip)">
          <g ref={drawerFront}>
            <Layer html={art.cardsFront} />
            <Layer html={art.drawerNear} />
          </g>
        </g>
        <Layer html={art.rackBack} />
        <Layer html={art.rails} />
        <Layer html={art.trolleyBack} />
        <g className="bs-readers" dangerouslySetInnerHTML={{ __html: art.readers }} />
        <Layer html={art.inTrayBack} />
        <g className="bs-fade">
          <g ref={book} dangerouslySetInnerHTML={{ __html: art.book }} />
        </g>
        <Layer html={art.rackFront} />
        <Layer html={art.railLips} />
        <Layer html={art.trolleyFront} />
        <Layer html={art.inTrayFront} />
        <Layer html={art.pressBase} />
        <g className="bs-fade">
          <g ref={latch} dangerouslySetInnerHTML={{ __html: art.latch }} />
        </g>
        <g className="bs-fade">
          <g ref={slip}>
            <Layer html={art.slip} />
            {art.marks.map((html, index) => (
              <g
                key={index}
                ref={(element) => {
                  marks.current[index] = element;
                }}
                opacity="0"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            ))}
          </g>
        </g>
        <g ref={stamp} dangerouslySetInnerHTML={{ __html: art.stamp }} />
        <Layer html={art.pressHead} />
        <Layer html={art.lock} />
        <g className="bs-fade">
          <g ref={key} dangerouslySetInnerHTML={{ __html: REST_KEY }} />
        </g>
      </svg>
      <span ref={said} className="bs-said" aria-live="polite" />
    </div>
  );
}
