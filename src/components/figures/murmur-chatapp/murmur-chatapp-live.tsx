'use client';
/* eslint-disable react/no-danger -- every injected string is SVG built by ./art and ./frame from numbers, never from user input */

import * as React from 'react';
import type { MurmurArt } from './art';
import { ARCHIVE_SPOKE_RANGE, ARCHIVE_SPOKE_Z, SPOOL_SPOKE_RANGE, SPOOL_SPOKES_Z, armatureAt, crankAt, dialHub, needleAt, notchesAt, spokesAt, springAt } from './frame';
import { PAGE_SIZE, describe, readoutOf, type Ledger } from './model';
import { ARCHIVE, HEIGHT, PAGE_LEN, PRINT_POINT, SPACING, SPOOL, SPOOL_COIL, TILT, WIDTH, histFace, liveFace } from './view';

const TURN = Math.PI * 2;
const MOST_DT = 1 / 30;
const IDLE_BACK = 3600;
const TOUR = 14;
/* Tour script, in seconds of the loop: live arrivals and page loads. */
const TOUR_EVENTS: [number, 'live' | 'page'][] = [
  [1.2, 'live'],
  [3.0, 'live'],
  [4.4, 'live'],
  [6.2, 'page'],
  [9.2, 'live'],
  [10.8, 'page'],
];
const TOUR_PAGES_CAP = 6;
const DIAL_STEP = TURN / 10;

const pulse = (age: number) => {
  if (age < 0) return 0;
  if (age < 0.04) {
    const t = age / 0.04;
    return t * t * (3 - 2 * t);
  }
  if (age < 0.12) return 1;
  return Math.exp(-(age - 0.12) / 0.07);
};

const settle = (s: { x: number; v: number }, target: number, dt: number, seconds: number, calm: boolean) => {
  if (calm) {
    s.x = target;
    s.v = 0;
    return false;
  }
  const w = 1 / seconds;
  const h = dt / 4;
  for (let i = 0; i < 4; i++) {
    s.v += (w * w * (target - s.x) - 2 * w * s.v) * h;
    s.x += s.v * h;
  }
  if (Math.abs(target - s.x) < 1e-4 && Math.abs(s.v) < 1e-4) {
    s.x = target;
    s.v = 0;
    return false;
  }
  return true;
};

const f2 = (n: number) => Math.round(n * 100) / 100;

interface Props {
  art: MurmurArt;
  label: string;
}

const Layer = ({ html }: { html: string }) => <g dangerouslySetInnerHTML={{ __html: html }} />;

interface TapeProps {
  face: string;
  clip: [number, number, number, number];
  marks: string;
  id: string;
  slide: React.Ref<SVGGElement>;
  kind: 'hist' | 'live';
  notches?: React.Ref<SVGPathElement>;
}

function Tape({ face, clip, marks, id, slide, kind, notches }: TapeProps) {
  const [x, y, w, h] = clip;
  return (
    <g transform={face}>
      <defs>
        <clipPath id={id}>
          <rect x={x} y={y} width={w} height={h} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>
        <g ref={slide}>
          <path className={kind === 'hist' ? 'mc-mark mc-mark-hist' : 'mc-mark'} d={marks} />
        </g>
      </g>
      {notches ? <path ref={notches} className="iso-line mc-notch" data-tone="mid" d={notchesAt(0)} /> : null}
    </g>
  );
}

const REST_ARM = armatureAt(0);
const REST_SPRING = springAt(0);
const REST_CRANK = crankAt(0);
const REST_NEEDLE = needleAt(DIAL_STEP);
const REST_SPOOL = spokesAt(SPOOL, SPOOL_SPOKE_RANGE[0], SPOOL_SPOKE_RANGE[1], SPOOL_SPOKES_Z, 0);
const REST_ARCHIVE = spokesAt(ARCHIVE, ARCHIVE_SPOKE_RANGE[0], ARCHIVE_SPOKE_RANGE[1], ARCHIVE_SPOKE_Z, 0);

export function MurmurChatappLive({ art, label }: Props) {
  const stage = React.useRef<HTMLDivElement>(null);
  const histSlide = React.useRef<SVGGElement>(null);
  const liveSlide = React.useRef<SVGGElement>(null);
  const arm = React.useRef<SVGGElement>(null);
  const springBack = React.useRef<SVGPathElement>(null);
  const springFront = React.useRef<SVGPathElement>(null);
  const crank = React.useRef<SVGGElement>(null);
  const needle = React.useRef<SVGPathElement>(null);
  const spoolSpokes = React.useRef<SVGPathElement>(null);
  const spoolRivets = React.useRef<SVGGElement>(null);
  const archiveSpokes = React.useRef<SVGPathElement>(null);
  const archiveRivets = React.useRef<SVGGElement>(null);
  const announce = React.useRef<HTMLSpanElement>(null);
  const notches = React.useRef<SVGPathElement>(null);
  const uid = React.useId().replace(/[^a-zA-Z0-9_-]/g, '');

  React.useEffect(() => {
    const root = stage.current;
    if (!root) return;
    const readout = root.closest('.iso-plate')?.querySelector('[data-readout]');
    const still = window.matchMedia('(prefers-reduced-motion: reduce)');
    const crankState = { x: 0, v: 0 };
    const dialState = { x: DIAL_STEP, v: 0 };
    let crankTarget = 0;
    let liveOffset = 0;
    let liveTarget = 0;
    let strikeAt = -10;
    let liveShownUntil = -10;
    let pagesBase = 1;
    let live = 0;
    let reopenUntil = -10;
    let clock = 0;
    let tourClock = 0;
    let touring = !still.matches;
    let visible = false;
    let frame = 0;
    let last = 0;
    let idle = 0;
    let shownTilt = -1;
    let shownCrank = Number.NaN;
    let shownLive = Number.NaN;
    let shownDial = Number.NaN;
    let lastPages = 1;

    const turnsDone = () => Math.floor(crankState.x / TURN + 1e-3);
    const ledgerNow = (): Ledger => ({ pages: pagesBase + turnsDone(), live });
    const fetching = () => crankTarget - crankState.x > 0.02;

    const say = (text: string) => {
      if (readout && readout.textContent !== text) readout.textContent = text;
    };

    const draw = () => {
      const age = clock - strikeAt;
      const strike = still.matches ? 0 : pulse(age);
      const roundedTilt = Math.round(strike * 200) / 200;
      if (roundedTilt !== shownTilt) {
        shownTilt = roundedTilt;
        root.style.setProperty('--fig-on', String(roundedTilt));
        if (arm.current) arm.current.innerHTML = armatureAt(roundedTilt * TILT);
        const coil = springAt(roundedTilt * TILT);
        springBack.current?.setAttribute('d', coil.back);
        springFront.current?.setAttribute('d', coil.front);
      }
      const angle = crankState.x;
      if (angle !== shownCrank) {
        shownCrank = angle;
        const turn = -angle;
        if (crank.current) crank.current.innerHTML = crankAt(turn);
        const spokes = spokesAt(ARCHIVE, ARCHIVE_SPOKE_RANGE[0], ARCHIVE_SPOKE_RANGE[1], ARCHIVE_SPOKE_Z, turn);
        archiveSpokes.current?.setAttribute('d', spokes.lines);
        archiveRivets.current?.querySelectorAll('circle').forEach((dot, i) => {
          const p = spokes.rivets[i];
          if (p) {
            dot.setAttribute('cx', String(f2(p[0])));
            dot.setAttribute('cy', String(f2(p[1])));
          }
        });
        const along = (angle / TURN) * PAGE_LEN;
        histSlide.current?.setAttribute('transform', `translate(${f2(-(along % PAGE_LEN))} 0)`);
        notches.current?.setAttribute('d', notchesAt(along));
      }
      if (liveOffset !== shownLive) {
        shownLive = liveOffset;
        liveSlide.current?.setAttribute('transform', `translate(${f2(-(liveOffset % PAGE_LEN))} 0)`);
        const spokes = spokesAt(SPOOL, SPOOL_SPOKE_RANGE[0], SPOOL_SPOKE_RANGE[1], SPOOL_SPOKES_Z, liveOffset / SPOOL_COIL);
        spoolSpokes.current?.setAttribute('d', spokes.lines);
        spoolRivets.current?.querySelectorAll('circle').forEach((dot, i) => {
          const p = spokes.rivets[i];
          if (p) {
            dot.setAttribute('cx', String(f2(p[0])));
            dot.setAttribute('cy', String(f2(p[1])));
          }
        });
      }
      if (dialState.x !== shownDial) {
        shownDial = dialState.x;
        needle.current?.setAttribute('d', needleAt(dialState.x));
      }
      const ledger = ledgerNow();
      if (ledger.pages !== lastPages) {
        lastPages = ledger.pages;
        if (announce.current) announce.current.textContent = describe(ledger);
      }
      if (clock < reopenUntil) say(readoutOf(ledger, 'reopen'));
      else if (fetching()) say(readoutOf(ledger, 'fetch'));
      else if (clock < liveShownUntil) say(readoutOf(ledger, 'live'));
      else say(readoutOf(ledger));
    };

    const arrive = () => {
      live += 1;
      strikeAt = clock;
      liveShownUntil = clock + 0.9;
      liveTarget += SPACING;
    };

    const loadPage = () => {
      crankTarget = Math.round(crankTarget / TURN) * TURN + TURN;
    };

    const reopen = () => {
      pagesBase = 1 - Math.round(crankTarget / TURN);
      live = 0;
      reopenUntil = clock + 1.4;
    };

    const tour = (dt: number) => {
      const before = tourClock % TOUR;
      tourClock += dt;
      const after = tourClock % TOUR;
      if (after < before && ledgerNow().pages >= TOUR_PAGES_CAP) reopen();
      for (const [at, kind] of TOUR_EVENTS) {
        const crossed = after >= before ? before < at && at <= after : before < at || at <= after;
        if (!crossed) continue;
        if (kind === 'live') arrive();
        else loadPage();
      }
    };

    const tick = (now: number) => {
      const dt = last ? Math.min((now - last) / 1000, MOST_DT) : 1 / 60;
      last = now;
      const calm = still.matches;
      clock += dt;
      if (touring) tour(dt);
      const cranking = settle(crankState, crankTarget, dt, 0.2, calm);
      const pagesShown = pagesBase + Math.round(crankTarget / TURN);
      const dialMoving = settle(dialState, pagesShown * DIAL_STEP, dt, 0.18, calm);
      if (calm) liveOffset = liveTarget;
      else {
        liveOffset += (liveTarget - liveOffset) * (1 - Math.exp(-dt / 0.14));
        if (Math.abs(liveTarget - liveOffset) < 1e-3) liveOffset = liveTarget;
      }
      draw();
      const busy = touring || cranking || dialMoving || liveOffset !== liveTarget || clock - strikeAt < 0.6 || clock < liveShownUntil || clock < reopenUntil;
      frame = visible && busy ? requestAnimationFrame(tick) : 0;
    };

    const run = () => {
      if (!frame && visible) {
        last = 0;
        frame = requestAnimationFrame(tick);
      }
    };

    const press = () => {
      touring = false;
      window.clearTimeout(idle);
      loadPage();
      idle = window.setTimeout(() => {
        touring = !still.matches;
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
      press();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== ' ' && event.key !== 'Enter') return;
      event.preventDefault();
      if (!event.repeat) press();
    };
    const onFocus = () => {
      if (announce.current) announce.current.textContent = describe(ledgerNow());
    };
    const onStill = () => {
      touring = !still.matches && touring;
      run();
    };

    root.addEventListener('pointerdown', onDown);
    root.addEventListener('keydown', onKeyDown);
    root.addEventListener('focus', onFocus);
    still.addEventListener('change', onStill);
    draw();

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.clearTimeout(idle);
      root.removeEventListener('pointerdown', onDown);
      root.removeEventListener('keydown', onKeyDown);
      root.removeEventListener('focus', onFocus);
      still.removeEventListener('change', onStill);
    };
  }, []);

  return (
    <div
      ref={stage}
      className="iso-stage fig-stage mc-stage"
      tabIndex={0}
      role="button"
      aria-label={`Telegraph desk: press the figure, or press Enter or Space, to turn the archive crank once and load an older page of ${PAGE_SIZE} messages`}
    >
      <svg className="iso-svg" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label={label} focusable="false">
        <Layer html={art.base} />
        <Layer html={art.liveBack} />
        <Tape face={liveFace} clip={art.liveClip} marks={art.liveMarks} id={`${uid}-live`} slide={liveSlide} kind="live" />
        <Layer html={art.liveFront} />
        <defs>
          <radialGradient id={`${uid}-glow`}>
            <stop offset="0" className="fig-stop-0" />
            <stop offset=".4" className="fig-stop-1" />
            <stop offset="1" className="fig-stop-2" />
          </radialGradient>
        </defs>
        <ellipse className="fig-glow" cx={f2(PRINT_POINT[0])} cy={f2(PRINT_POINT[1])} rx={16} ry={10} fill={`url(#${uid}-glow)`} />
        <Layer html={art.registerBox} />
        <Layer html={art.registerTop} />
        <path ref={springBack} className="iso-line" data-tone="lo" d={REST_SPRING.back} />
        <path ref={springFront} className="iso-line" data-tone="mid" d={REST_SPRING.front} />
        <g ref={arm} dangerouslySetInnerHTML={{ __html: REST_ARM }} />
        <Layer html={art.registerFront} />
        <Layer html={art.insulator} />
        <Layer html={art.middle} />
        <Layer html={art.wires} />
        <Layer html={art.spoolLower} />
        <Layer html={art.histBack} />
        <Layer html={art.archiveLower} />
        <Layer html={art.histTape} />
        <Tape face={histFace} clip={art.histClip} marks={art.histMarks} id={`${uid}-hist`} slide={histSlide} kind="hist" notches={notches} />
        <Layer html={art.spoolUpper} />
        <path ref={spoolSpokes} className="iso-line" data-tone="lo" d={REST_SPOOL.lines} />
        <g ref={spoolRivets} className="iso-dots" data-tone="mid">
          {REST_SPOOL.rivets.map(([x, y], i) => (
            <circle key={i} cx={f2(x)} cy={f2(y)} r={0.45} />
          ))}
        </g>
        <Layer html={art.histFront} />
        <path ref={needle} className="iso-line" data-tone="hi" data-free="" d={REST_NEEDLE} />
        <path className="iso-line" data-tone="mid" d={dialHub} />
        <Layer html={art.archiveUpper} />
        <path ref={archiveSpokes} className="iso-line" data-tone="lo" d={REST_ARCHIVE.lines} />
        <g ref={archiveRivets} className="iso-dots" data-tone="mid">
          {REST_ARCHIVE.rivets.map(([x, y], i) => (
            <circle key={i} cx={f2(x)} cy={f2(y)} r={0.45} />
          ))}
        </g>
        <g ref={crank} dangerouslySetInnerHTML={{ __html: REST_CRANK }} />
      </svg>
      <span ref={announce} className="mc-live-region" aria-live="polite" />
    </div>
  );
}
