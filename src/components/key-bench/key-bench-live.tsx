'use client';
/* eslint-disable react/no-danger -- every injected string is SVG built by ./art and ./frame from numbers, never from user input */

import * as React from 'react';
import type { KeyBenchArt } from './art';
import { poleAt, springAt } from './frame';
import { TRAVEL_MM, isDown, readoutOf } from './model';
import { HEIGHT, TRAVEL, WIDTH, downBy } from './view';

const REST_SPRING = springAt(0);
const REST_POLE = poleAt(0);
const TOUR = 3.6;
const IDLE_BACK = 4000;
const MOST_DT = 1 / 30;
const STIFF = 520;
const DRAG = 30;

const tourTarget = (clock: number) => {
  const t = clock % TOUR;
  return t > 1.3 && t < 2.3 ? 1 : 0;
};

interface Props {
  art: KeyBenchArt;
  label: string;
}

const Layer = ({ html }: { html: string }) => <g dangerouslySetInnerHTML={{ __html: html }} />;

export function KeyBenchLive({ art, label }: Props) {
  const stage = React.useRef<HTMLDivElement>(null);
  const slider = React.useRef<SVGGElement>(null);
  const keycap = React.useRef<SVGGElement>(null);
  const pole = React.useRef<SVGGElement>(null);
  const springBack = React.useRef<SVGPathElement>(null);
  const springFront = React.useRef<SVGPathElement>(null);

  React.useEffect(() => {
    const root = stage.current;
    if (!root) return;
    const readout = root.closest('.iso-plate')?.querySelector('[data-readout]');
    const still = window.matchMedia('(prefers-reduced-motion: reduce)');
    let pos = 0;
    let rate = 0;
    let target = 0;
    let glow = 0;
    let shownDown = -1;
    let touring = !still.matches;
    let clock = 0;
    let visible = false;
    let frame = 0;
    let last = 0;
    let idle = 0;

    const draw = () => {
      const down = TRAVEL * pos;
      const rounded = Math.round(down * 20) / 20;
      if (rounded !== shownDown) {
        shownDown = rounded;
        const move = downBy(rounded);
        slider.current?.setAttribute('transform', move);
        keycap.current?.setAttribute('transform', move);
        const coil = springAt(rounded);
        springBack.current?.setAttribute('d', coil.back);
        springFront.current?.setAttribute('d', coil.front);
        if (pole.current) pole.current.innerHTML = poleAt(rounded);
      }
      const mm = TRAVEL_MM * pos;
      const on = isDown(mm);
      if (on) root.dataset.down = '';
      else delete root.dataset.down;
      root.style.setProperty('--kb-on', glow.toFixed(3));
      root.setAttribute('aria-pressed', on ? 'true' : 'false');
      const text = readoutOf(mm);
      if (readout && readout.textContent !== text) readout.textContent = text;
    };

    const tick = (now: number) => {
      const dt = last ? Math.min((now - last) / 1000, MOST_DT) : 1 / 60;
      last = now;
      const calm = still.matches;
      if (touring) {
        clock += dt;
        target = tourTarget(clock);
      }
      if (calm) {
        pos = target;
        rate = 0;
      } else {
        for (let i = 0; i < 4; i++) {
          rate += (((target - pos) * STIFF - rate * DRAG) * dt) / 4;
          pos += (rate * dt) / 4;
        }
        if (pos > 1) {
          pos = 1;
          rate = -rate * 0.18;
        }
        if (pos < 0) {
          pos = 0;
          rate = -rate * 0.3;
        }
      }
      const want = isDown(TRAVEL_MM * pos) ? 1 : 0;
      glow = calm ? want : glow + (want - glow) * (1 - Math.exp(-dt / (want ? 0.06 : 0.24)));
      if (Math.abs(want - glow) < 0.002) glow = want;
      draw();
      const settled = !touring && Math.abs(target - pos) < 1e-3 && Math.abs(rate) < 1e-3 && glow === want;
      frame = visible && !settled ? requestAnimationFrame(tick) : 0;
    };

    const run = () => {
      if (!frame && visible) {
        last = 0;
        frame = requestAnimationFrame(tick);
      }
    };

    const press = (held: boolean) => {
      touring = false;
      target = held ? 1 : 0;
      window.clearTimeout(idle);
      if (!held)
        idle = window.setTimeout(() => {
          touring = !still.matches;
          clock = 0;
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
      { rootMargin: '120px 0px' }
    );
    observer.observe(root);

    const onDown = (event: PointerEvent) => {
      if (event.button !== 0) return;
      root.setPointerCapture?.(event.pointerId);
      press(true);
    };
    const onUp = () => press(false);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== ' ' && event.key !== 'Enter') return;
      event.preventDefault();
      if (!event.repeat) press(true);
    };
    const onKeyUp = (event: KeyboardEvent) => {
      if (event.key === ' ' || event.key === 'Enter') press(false);
    };
    const onStill = () => {
      touring = !still.matches && touring;
      run();
    };

    root.addEventListener('pointerdown', onDown);
    root.addEventListener('pointerup', onUp);
    root.addEventListener('pointercancel', onUp);
    root.addEventListener('keydown', onKeyDown);
    root.addEventListener('keyup', onKeyUp);
    root.addEventListener('blur', onUp);
    still.addEventListener('change', onStill);
    draw();

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.clearTimeout(idle);
      root.removeEventListener('pointerdown', onDown);
      root.removeEventListener('pointerup', onUp);
      root.removeEventListener('pointercancel', onUp);
      root.removeEventListener('keydown', onKeyDown);
      root.removeEventListener('keyup', onKeyUp);
      root.removeEventListener('blur', onUp);
      still.removeEventListener('change', onStill);
    };
  }, []);

  return (
    <div
      ref={stage}
      className="iso-stage kb-stage"
      tabIndex={0}
      role="button"
      aria-pressed="false"
      aria-label="Keyswitch: press and hold the figure, or hold Space, to press the key past its actuation point"
    >
      <svg className="iso-svg" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label={label} focusable="false">
        <Layer html={art.base} />
        <Layer html={art.board} />
        <Layer html={art.traces} />
        <Layer html={art.glow} />
        <Layer html={art.housing} />
        <path ref={springBack} className="iso-line kb-spring" data-tone="lo" d={REST_SPRING.back} />
        <g ref={pole} dangerouslySetInnerHTML={{ __html: REST_POLE }} />
        <path ref={springFront} className="iso-line kb-spring" data-tone="mid" d={REST_SPRING.front} />
        <Layer html={art.emitter} />
        <Layer html={art.beamBack} />
        <g ref={slider} dangerouslySetInnerHTML={{ __html: art.slider }} />
        <g className="kb-beam-front" dangerouslySetInnerHTML={{ __html: art.beamFront }} />
        <Layer html={art.receiver} />
        <g ref={keycap} dangerouslySetInnerHTML={{ __html: art.keycap }} />
        <Layer html={art.front} />
      </svg>
    </div>
  );
}
