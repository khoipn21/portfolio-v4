'use client';
/* eslint-disable react/no-danger -- every injected string is SVG built by ./art and ./frame from numbers, never from user input */

import * as React from 'react';
import { follow, spring, type Spring } from '@/components/iso/react/live';
import type { BioweaveArt } from './art';
import { cablesAt } from './frame';
import { MISSING_ORDER, RESTING, RESTING_READOUT, TAG_COUNT, nextCycle, type Cycle, type Targets } from './model';
import { GATE_LIFT, HEIGHT, HEAD_DROP, INSPECT_PARK, LOUPE_REACH, PIN_DROP, STATION_X, TAG_XS, WIDTH, alongX, alongY, alongZ } from './view';

const REST_CABLES = cablesAt(0);
const MOST_DT = 1 / 30;
const FIRST_TOUR = 1.4;
const TOUR_PAUSE = 2.6;
const IDLE_BACK = 6000;
const SLED_STIFF = 30;
const SLED_DRAG = 11;

const inspectorX = (stop: number) => (stop < 0 ? INSPECT_PARK : STATION_X.bay + TAG_XS[stop]!);
const tagShown = (state: Targets, placed: number, index: number) => (index === state.missing ? placed : 1);

interface Props {
  art: BioweaveArt;
  label: string;
}

const Layer = ({ html }: { html: string }) => <g dangerouslySetInnerHTML={{ __html: html }} />;

export function BioweaveLive({ art, label }: Props) {
  const stage = React.useRef<HTMLDivElement>(null);
  const voice = React.useRef<HTMLSpanElement>(null);
  const sled = React.useRef<SVGGElement>(null);
  const parts = React.useRef<Array<SVGGElement | null>>([]);
  const tags = React.useRef<Array<SVGGElement | null>>([]);
  const rod = React.useRef<SVGGElement>(null);
  const head = React.useRef<SVGGElement>(null);
  const gate = React.useRef<SVGGElement>(null);
  const cables = React.useRef<SVGPathElement>(null);
  const reach = React.useRef<SVGGElement>(null);
  const body = React.useRef<SVGGElement>(null);
  const post = React.useRef<SVGGElement>(null);

  React.useEffect(() => {
    const root = stage.current;
    if (!root) return;
    const readout = root.closest('.iso-plate')?.querySelector('[data-readout]');
    const still = window.matchMedia('(prefers-reduced-motion: reduce)');

    let state: Targets = { ...RESTING };
    let fresh = 1;
    let cycle: Cycle | null = null;
    let clock = 0;
    let nextKey = 0;
    let touring = !still.matches;
    let wait = FIRST_TOUR;
    let visible = false;
    let frame = 0;
    let last = 0;
    let idle = 0;

    const sledAt: Spring = { at: STATION_X[state.sled], rate: 0 };
    let shown = 1;
    let headAt = 0;
    let inspector = inspectorX(state.inspector);
    let reachAt = 0;
    let gateAt = 0;
    let placed = 0;
    const builtAt: number[] = Array.from({ length: TAG_COUNT }, (_, index) => (index < state.built ? 1 : 0));
    const written = new WeakMap<Element, Record<string, string>>();

    const put = (element: Element | null | undefined, name: string, value: string) => {
      if (!element) return;
      const seen = written.get(element) ?? {};
      if (seen[name] === value) return;
      seen[name] = value;
      written.set(element, seen);
      if (value) element.setAttribute(name, value);
      else element.removeAttribute(name);
    };
    const opacity = (value: number) => (value > 0.995 ? '' : value.toFixed(3));
    const say = (text: string) => {
      if (readout && readout.textContent !== text) readout.textContent = text;
    };

    const draw = () => {
      put(sled.current, 'transform', alongX(sledAt.at));
      put(sled.current, 'opacity', opacity(shown));
      parts.current.forEach((part, index) => put(part, 'opacity', opacity(builtAt[index]!)));
      tags.current.forEach((tag, index) => {
        const seen = tagShown(state, placed, index);
        put(tag, 'transform', alongZ((1 - seen) * PIN_DROP));
        put(tag, 'opacity', opacity(seen));
        put(tag, 'data-checked', index < state.checked ? 'true' : '');
      });
      const down = alongZ(-headAt * HEAD_DROP);
      put(rod.current, 'transform', down);
      put(head.current, 'transform', down);
      const lift = Math.round(gateAt * GATE_LIFT * 20) / 20;
      put(gate.current, 'transform', alongZ(lift));
      put(cables.current, 'd', cablesAt(lift));
      const across = alongX(inspector);
      put(reach.current, 'transform', `${across} ${alongY(-reachAt * LOUPE_REACH)}`.trim());
      put(body.current, 'transform', across);
      put(post.current, 'transform', across);
      put(root, 'data-open', gateAt > 0.5 ? 'true' : '');
    };

    const apply = (index: number) => {
      const key = cycle!.keys[index]!;
      state = { ...state, ...key.set };
      if (key.jump) {
        sledAt.at = STATION_X[state.sled];
        sledAt.rate = 0;
        placed = state.placed;
        builtAt.forEach((_, index) => (builtAt[index] = builtOf(index)));
      }
      if (key.say) say(key.say);
      if (key.announce && voice.current) voice.current.textContent = key.announce;
    };

    const begin = () => {
      const fromTray = !(state.sled === 'bay' && state.missing >= 0);
      const started = nextCycle(state, fresh);
      if (fromTray) fresh = (fresh + 1) % MISSING_ORDER.length;
      cycle = started;
      clock = 0;
      nextKey = 0;
      return started;
    };

    const builtOf = (index: number) => (index < state.built ? 1 : 0);

    const snap = () => {
      sledAt.at = STATION_X[state.sled];
      sledAt.rate = 0;
      shown = state.shown;
      headAt = state.head;
      inspector = inspectorX(state.inspector);
      reachAt = state.reach;
      gateAt = state.gate;
      placed = state.placed;
      builtAt.forEach((_, index) => (builtAt[index] = builtOf(index)));
    };

    const settled = () =>
      sledAt.at === STATION_X[state.sled] &&
      sledAt.rate === 0 &&
      shown === state.shown &&
      headAt === state.head &&
      inspector === inspectorX(state.inspector) &&
      reachAt === state.reach &&
      gateAt === state.gate &&
      placed === state.placed &&
      builtAt.every((value, index) => value === builtOf(index));

    const tick = (now: number) => {
      const dt = last ? Math.min((now - last) / 1000, MOST_DT) : 1 / 60;
      last = now;
      const calm = still.matches;

      if (cycle) {
        clock += dt;
        while (cycle && nextKey < cycle.keys.length && cycle.keys[nextKey]!.at <= clock) apply(nextKey++);
        if (cycle && clock >= cycle.length) {
          cycle = null;
          if (touring) wait = TOUR_PAUSE;
          else idle = window.setTimeout(resume, IDLE_BACK);
        }
      } else if (touring) {
        wait -= dt;
        if (wait <= 0) begin();
      }

      if (calm) snap();
      else {
        spring(sledAt, STATION_X[state.sled], dt, SLED_STIFF, SLED_DRAG);
        shown = follow(shown, state.shown, dt, 0.12);
        headAt = follow(headAt, state.head, dt, 0.16);
        inspector = follow(inspector, inspectorX(state.inspector), dt, 0.16);
        reachAt = follow(reachAt, state.reach, dt, 0.07);
        gateAt = follow(gateAt, state.gate, dt, 0.3);
        placed = follow(placed, state.placed, dt, 0.18);
        for (let index = 0; index < TAG_COUNT; index++) builtAt[index] = follow(builtAt[index]!, builtOf(index), dt, 0.1);
      }
      draw();

      const done = !cycle && !touring && settled();
      frame = visible && !done ? requestAnimationFrame(tick) : 0;
    };

    const run = () => {
      if (!frame && visible) {
        last = 0;
        frame = requestAnimationFrame(tick);
      }
    };

    function resume() {
      if (still.matches || cycle) return;
      touring = true;
      wait = TOUR_PAUSE;
      run();
    }

    const press = () => {
      window.clearTimeout(idle);
      touring = false;
      if (cycle) return;
      const started = begin();
      if (still.matches) {
        while (nextKey < started.keys.length) apply(nextKey++);
        cycle = null;
        snap();
        draw();
        return;
      }
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
      press();
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== ' ' && event.key !== 'Enter') return;
      event.preventDefault();
      if (!event.repeat) press();
    };
    const onStill = () => {
      touring = !still.matches && touring;
      if (still.matches) {
        snap();
        draw();
      }
      run();
    };

    root.addEventListener('pointerdown', onDown);
    root.addEventListener('keydown', onKey);
    still.addEventListener('change', onStill);
    say(RESTING_READOUT);
    draw();

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
      className="fig-stage bw-stage"
      tabIndex={0}
      role="button"
      aria-label="Evidence gate: press the figure, or press Enter or Space, to run the next inspection cycle"
    >
      <svg className="iso-svg" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label={label} focusable="false">
        <Layer html={art.base} />
        <Layer html={art.rails} />
        <Layer html={art.trayBack} />
        <Layer html={art.builderBack} />
        <Layer html={art.gateBack} />
        <g ref={sled} transform={alongX(STATION_X[RESTING.sled]) || undefined}>
          <Layer html={art.sled} />
          {art.model.map((html, index) => (
            <g
              key={`part-${index}`}
              ref={(node) => {
                parts.current[index] = node;
              }}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          ))}
          {art.tags.map((html, index) => (
            <g
              key={`tag-${index}`}
              className="bw-tag"
              ref={(node) => {
                tags.current[index] = node;
              }}
              transform={index === RESTING.missing ? alongZ(PIN_DROP) || undefined : undefined}
              opacity={index === RESTING.missing ? 0 : undefined}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          ))}
        </g>
        <g ref={rod} dangerouslySetInnerHTML={{ __html: art.builderRod }} />
        <g ref={head} dangerouslySetInnerHTML={{ __html: art.builderHead }} />
        <Layer html={art.builderArm} />
        <g ref={gate} dangerouslySetInnerHTML={{ __html: art.gatePlate }} />
        <path ref={cables} className="iso-line bw-cable" data-tone="mid" d={REST_CABLES} />
        <Layer html={art.gateFront} />
        <Layer html={art.trayFront} />
        <Layer html={art.inspectorRail} />
        <g ref={reach} transform={alongX(INSPECT_PARK) || undefined} dangerouslySetInnerHTML={{ __html: art.inspectorReach }} />
        <g ref={body} transform={alongX(INSPECT_PARK) || undefined} dangerouslySetInnerHTML={{ __html: art.inspectorBody }} />
        <g ref={post} transform={alongX(INSPECT_PARK) || undefined} dangerouslySetInnerHTML={{ __html: art.inspectorPost }} />
      </svg>
      <span ref={voice} className="bw-voice" aria-live="polite" />
    </div>
  );
}
