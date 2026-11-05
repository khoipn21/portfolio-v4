'use client';
/* eslint-disable react/no-danger -- every injected string is SVG built by ./art from numbers, never from user input */

import * as React from 'react';
import { DRAWERS, drawerSvg, type RequestLineArt } from './art';
import { SLOTS, TOUR_KEYS, doneReadout, emptyCache, hopReadout, lookup, restingReadout, store, touch, tripFor, type Cache, type Stop, type Trip } from './model';
import { behindPost, durationOf, easeLeg, homeOf, pathOf, pointAt, type Path } from './route';
import { HEIGHT, WIDTH, moveBy } from './view';

const MOST_DT = 1 / 30;
const DWELL: Record<Stop, number> = { counter: 1.6, rack: 0.55, cabinet: 1.2 };
const DRAWER_OUT = 16;
const IDLE_BACK = 6000;

const Layer = ({ html }: { html: string }) => <g dangerouslySetInnerHTML={{ __html: html }} />;

const follow = (value: number, target: number, dt: number, tau: number) => value + (target - value) * (1 - Math.exp(-dt / tau));

interface Props {
  art: RequestLineArt;
  label: string;
}

interface Leg {
  path: Path;
  from: Stop;
  to: Stop;
  time: number;
}

export function RequestLineLive({ art, label }: Props) {
  const stage = React.useRef<HTMLDivElement>(null);
  const carrierBack = React.useRef<SVGGElement>(null);
  const carrierFront = React.useRef<SVGGElement>(null);
  const holes = React.useRef<SVGGElement>(null);
  const drawers = React.useRef<SVGGElement>(null);
  const screen = React.useRef<SVGGElement>(null);

  React.useEffect(() => {
    const root = stage.current;
    const holeRoot = holes.current;
    const drawerRoot = drawers.current;
    if (!root || !holeRoot || !drawerRoot) return;
    const readout = root.closest('.iso-plate')?.querySelector('[data-readout]');
    const still = window.matchMedia('(prefers-reduced-motion: reduce)');
    const slotEls = () => holeRoot.querySelectorAll<SVGGElement>('[data-slot]');
    const drawerEl = (index: number) => drawerRoot.querySelector<SVGGElement>(`[data-drawer="${index}"]`);

    let cache: Cache = emptyCache();
    let tourIndex = 0;
    let trip: Trip | null = null;
    let hop = 0;
    let leg: Leg | null = null;
    let dwell = 0.8;
    let queued = false;
    let touring = true;
    let visible = false;
    let frame = 0;
    let last = 0;
    let idle = 0;
    let at = homeOf();
    let flash = -1;
    let drawerIndex = -1;
    let drawerWant = 0;
    let drawerPos = 0;
    let shownDrawer = 0;
    let page = 0;
    let pageWant = 0;
    const cardOn = Array<number>(SLOTS).fill(0);
    const lampOn = Array<number>(SLOTS).fill(0);
    let text = restingReadout(cache);

    const nextKey = () => {
      const key = TOUR_KEYS[tourIndex % TOUR_KEYS.length]!;
      tourIndex++;
      return key;
    };

    const place = () => {
      const move = moveBy([at[0], at[1], 0]);
      const back = behindPost(at);
      for (const [el, show] of [
        [carrierBack.current, back],
        [carrierFront.current, !back],
      ] as const) {
        if (!el) continue;
        el.setAttribute('transform', move);
        el.style.visibility = show ? 'visible' : 'hidden';
      }
    };

    const startLeg = () => {
      if (!trip) return;
      const from = trip.route[hop]!;
      const to = trip.route[hop + 1]!;
      const path = pathOf(from, to);
      leg = { path, from, to, time: 0 };
      text = hopReadout(trip, hop);
      root.dataset.busy = '';
    };

    const startTrip = () => {
      trip = tripFor(cache, nextKey());
      hop = 0;
      pageWant = 0;
      startLeg();
    };

    /** The carrier has reached `stop`: file, touch or fetch, then wait there. */
    const arrive = (stop: Stop) => {
      if (!trip) return;
      if (stop === 'rack') {
        const slot = lookup(cache, trip.key);
        if (trip.hit && slot >= 0) {
          cache = touch(cache, slot);
          flash = slot;
        } else if (hop === trip.route.length - 2 - 1) {
          const filed = store(cache, trip.key);
          cache = filed.cache;
          flash = filed.slot;
          cardOn[filed.slot] = 0;
        } else {
          flash = -1;
        }
      }
      if (stop === 'cabinet') {
        drawerIndex = (trip.key - 1) % DRAWERS.length;
        drawerWant = 1;
      }
      dwell = DWELL[stop];
      leg = null;
      hop++;
      if (hop >= trip.route.length - 1) {
        text = doneReadout(trip, cache);
        pageWant = 1;
        flash = -1;
        trip = null;
        delete root.dataset.busy;
      }
    };

    const send = () => {
      if (trip) {
        queued = true;
        return;
      }
      dwell = 0;
    };

    const instant = () => {
      const done = tripFor(cache, nextKey());
      const slot = lookup(cache, done.key);
      cache = slot >= 0 ? touch(cache, slot) : store(cache, done.key).cache;
      text = doneReadout(done, cache);
      page = pageWant = 1;
    };

    const paint = () => {
      place();
      slotEls().forEach((el, i) => {
        el.style.setProperty('--rl-card', cardOn[i]!.toFixed(3));
        el.style.setProperty('--rl-lamp', lampOn[i]!.toFixed(3));
      });
      const rounded = Math.round(drawerPos * DRAWER_OUT * 4) / 4;
      const drawer = drawerIndex >= 0 ? drawerEl(drawerIndex) : null;
      if (drawer && (rounded !== shownDrawer || drawer.dataset.out !== String(rounded))) {
        shownDrawer = rounded;
        drawer.dataset.out = String(rounded);
        drawer.innerHTML = drawerSvg(drawerIndex, rounded);
      }
      screen.current?.style.setProperty('--rl-page', page.toFixed(3));
      if (readout && readout.textContent !== text) readout.textContent = text;
    };

    const tick = (now: number) => {
      const dt = last ? Math.min((now - last) / 1000, MOST_DT) : 1 / 60;
      last = now;
      if (leg) {
        leg.time += dt;
        const span = durationOf(leg.path);
        at = pointAt(leg.path, easeLeg(Math.min(1, leg.time / span)));
        if (leg.time >= span) arrive(leg.to);
      } else {
        dwell -= dt;
        if (dwell <= 0.35 && drawerWant) drawerWant = 0;
        if (dwell <= 0) {
          if (trip) startLeg();
          else if (touring || queued) {
            queued = false;
            startTrip();
          } else dwell = Infinity;
        }
      }
      drawerPos = follow(drawerPos, drawerWant, dt, 0.14);
      page = follow(page, pageWant, dt, 0.22);
      cache.slots.forEach((key, i) => {
        cardOn[i] = follow(cardOn[i]!, key === null ? 0 : 1, dt, 0.25);
        lampOn[i] = follow(lampOn[i]!, i === flash ? 1 : 0, dt, i === flash ? 0.06 : 0.3);
      });
      paint();
      frame = visible ? requestAnimationFrame(tick) : 0;
    };

    const run = () => {
      if (still.matches) {
        paint();
        return;
      }
      if (!frame && visible) {
        last = 0;
        frame = requestAnimationFrame(tick);
      }
    };

    const press = () => {
      window.clearTimeout(idle);
      idle = window.setTimeout(() => {
        touring = true;
        run();
      }, IDLE_BACK);
      touring = false;
      if (still.matches) {
        instant();
        cache.slots.forEach((key, i) => {
          cardOn[i] = key === null ? 0 : 1;
        });
        paint();
        return;
      }
      send();
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
      if (event.button === 0) press();
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== ' ' && event.key !== 'Enter') return;
      event.preventDefault();
      if (!event.repeat) press();
    };
    const onStill = () => {
      if (still.matches && frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
      run();
    };

    root.addEventListener('pointerdown', onDown);
    root.addEventListener('keydown', onKey);
    still.addEventListener('change', onStill);
    paint();

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.clearTimeout(idle);
      root.removeEventListener('pointerdown', onDown);
      root.removeEventListener('keydown', onKey);
      still.removeEventListener('change', onStill);
    };
  }, []);

  return (
    <div
      ref={stage}
      className="iso-stage fig-stage rl-stage"
      tabIndex={0}
      role="button"
      aria-label="Request line: press the figure, or press Space, to send the next request from Next.js through Go to Redis, and on to Postgres when Redis misses"
    >
      <svg className="iso-svg" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label={label} focusable="false">
        <Layer html={art.base} />
        <g ref={screen} className="rl-screen">
          <Layer html={art.far} />
        </g>
        <g ref={holes} dangerouslySetInnerHTML={{ __html: art.holes }} />
        <Layer html={art.desk} />
        <Layer html={art.cabinet} />
        <g ref={drawers} dangerouslySetInnerHTML={{ __html: art.drawers }} />
        <Layer html={art.wires} />
        <Layer html={art.ringBack} />
        <g ref={carrierBack} dangerouslySetInnerHTML={{ __html: art.carrier }} />
        <Layer html={art.post} />
        <Layer html={art.ringFront} />
        <g ref={carrierFront} style={{ visibility: 'hidden' }} dangerouslySetInnerHTML={{ __html: art.carrier }} />
      </svg>
    </div>
  );
}
