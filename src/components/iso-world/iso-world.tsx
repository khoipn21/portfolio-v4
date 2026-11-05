'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as k from '@/components/iso/iso-kit';
import type { Flat, Plan, Projection } from '@/components/iso/iso-kit';
import { SETTLED } from '@/components/work-showcase/work-showcase';
import './iso-world.css';

gsap.registerPlugin(useGSAP, ScrollTrigger);

// A 45/30 camera keeps the ground grid an exact 2:1 lattice, so the dolly slides along one line family.
const P: Projection = { origin: [0, 0], scale: 1, azimuth: 45, elevation: 30 };
const UX = k.axisVector(P, [1, 0, 0]);
const UY = k.axisVector(P, [0, 1, 0]);
const DOLLY = unit(UX);
// One grid tile on screen; its diagonals have the same ±0.5 slope as the ground axes above.
const TILE: Flat = [112, 56];
// The head line: a heading is in focus while it crosses this share of the viewport height.
const HEAD = 0.55;
// How many viewport heights a station takes to fade from lit back to ghost.
const REACH = 0.6;
// Where each station parks on screen while its heading is on the head line, as viewport shares.
const SLOTS: Flat[] = [
  [0.17, 0.5],
  [0.3, 0.8],
  [0.12, 0.28],
  [0.84, 0.62],
  [0.85, 0.16],
  [0.2, 0.82],
  [0.85, 0.16],
  [0.3, 0.38],
  [0.8, 0.55],
  [0.78, 0.62],
];

interface Art {
  body: string;
  labelY: number;
}

interface Station {
  el: SVGGElement;
  y: number;
  at: Flat;
  focus: number;
}

function unit([x, y]: Flat): Flat {
  const length = Math.hypot(x, y) || 1;
  return [x / length, y / length];
}

const f = (value: number) => (Math.round(value * 10) / 10).toString();
const mod = (value: number, by: number) => ((value % by) + by) % by;
const smooth = (t: number) => t * t * (3 - 2 * t);
const escape = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const ringOf = ({ x, y, w, d }: Plan): Flat[] => [
  [x, y],
  [x + w, y],
  [x + w, y + d],
  [x, y + d],
];

function wireBox(plan: Plan, z0: number, z1: number) {
  const ring = ringOf(plan);
  return k.onTop(ring, z0, P, true) + k.onTop(ring, z1, P, true) + ring.map((at) => k.rise(at, z0, z1, P)).join('');
}

// A drafting footprint: dashed outline, corner marks and a centre cross on the ground plane.
function footprint(w: number, d: number, extra = ''): Art {
  const plan: Plan = { x: -w / 2, y: -d / 2, w, d, r: 0 };
  const mark = Math.min(w, d) * 0.16;
  const marks = k
    .corners(plan)
    .map(([x, y]) => {
      const sx = x < 0 ? 1 : -1;
      const sy = y < 0 ? 1 : -1;
      return k.lineOnTop([x + sx * mark, y], [x, y], 0, P) + k.lineOnTop([x, y], [x, y + sy * mark], 0, P);
    })
    .join('');
  const cross = k.lineOnTop([-4, 0], [4, 0], 0, P) + k.lineOnTop([0, -4], [0, 4], 0, P);
  return {
    body: `<path class="iso-world-dash" d="${k.planOutline(plan, 0, P, 1)}"/><path d="${marks}${cross}"/>${extra}`,
    labelY: k.iso([w / 2, d / 2, 0], P)[1] + 22,
  };
}

function keycap(): Art {
  const skirt: Plan = { x: -40, y: -40, w: 80, d: 80, r: 0 };
  const crown: Plan = { x: -29, y: -29, w: 58, d: 58, r: 0 };
  const crownRing = ringOf(crown);
  const taper = ringOf(skirt)
    .map((at, index) => k.segment([at[0], at[1], 16], [crownRing[index][0], crownRing[index][1], 23], P))
    .join('');
  return footprint(124, 104, `<path d="${wireBox(skirt, 0, 16)}${k.planOutline(crown, 23, P, 1)}${taper}"/>`);
}

function sheets(): Art {
  const plan: Plan = { x: -48, y: -32, w: 96, d: 64, r: 0 };
  const layers = [0, 13, 26].map((z) => k.planOutline(plan, z, P, 1)).join('');
  const posts = ringOf(plan)
    .map((at) => k.rise(at, 0, 26, P))
    .join('');
  return footprint(140, 100, `<path d="${layers}"/><path class="iso-world-dash" d="${posts}"/>`);
}

function socket(): Art {
  const body: Plan = { x: -55, y: -35, w: 110, d: 70, r: 0 };
  const hole: Plan = { x: -36, y: -18, w: 72, d: 36, r: 0 };
  const floor = 11;
  const top = 22;
  const walls = ringOf(hole)
    .map((at) => k.rise(at, floor, top, P))
    .join('');
  const pins = k
    .dotGrid(-27.5, -5.5, 6, 2, 11, floor, P)
    .map(([cx, cy]) => `<circle cx="${f(cx)}" cy="${f(cy)}" r="1.8"/>`)
    .join('');
  return footprint(
    150,
    110,
    `<path d="${wireBox(body, 0, top)}${k.planOutline(hole, top, P, 1)}${k.planOutline(hole, floor, P, 1)}${walls}"/>${pins}`
  );
}

// A switch housing with its cross stem showing above the top.
function housing(): Art {
  const body: Plan = { x: -22, y: -22, w: 44, d: 44, r: 0 };
  const top = 20;
  const stem =
    k.lineOnTop([-7, 0], [7, 0], top + 6, P) +
    k.lineOnTop([0, -7], [0, 7], top + 6, P) +
    k.rise([0, 0], top, top + 6, P);
  return footprint(96, 84, `<path d="${wireBox(body, 0, top)}${stem}"/>`);
}

// Two cabinets joined by a raised rail: the request route in miniature.
function route(): Art {
  const desk: Plan = { x: -58, y: -14, w: 28, d: 28, r: 0 };
  const cabinet: Plan = { x: 22, y: -22, w: 36, d: 44, r: 0 };
  const rail = 30;
  const posts = [-44, -8, 20].map((x) => k.rise([x, 0], 0, rail, P)).join('');
  return footprint(
    150,
    90,
    `<path d="${wireBox(desk, 0, 14)}${wireBox(cabinet, 0, 26)}${posts}${k.lineOnTop([-44, 0], [40, 0], rail, P)}"/>` +
      `<circle cx="${f(k.iso([-8, 0, rail], P)[0])}" cy="${f(k.iso([-8, 0, rail], P)[1])}" r="2"/>`
  );
}

// A plinth: two stacked wire blocks, the upper one set back.
function plinth(): Art {
  const base: Plan = { x: -30, y: -30, w: 60, d: 60, r: 0 };
  const cap: Plan = { x: -18, y: -18, w: 36, d: 36, r: 0 };
  return footprint(104, 90, `<path d="${wireBox(base, 0, 8)}${wireBox(cap, 8, 30)}"/>`);
}

// A rail with one branch that leaves and rejoins, commits as dots along it.
function graph(): Art {
  const main = k.lineOnTop([-56, 0], [56, 0], 0, P);
  const branch = k.onTop(
    [
      [-28, 0],
      [-14, -20],
      [22, -20],
      [36, 0],
    ],
    0,
    P
  );
  const commits: Flat[] = [
    [-44, 0],
    [-28, 0],
    [-2, -20],
    [14, -20],
    [36, 0],
    [48, 0],
  ];
  const dots = commits
    .map((at) => {
      const [cx, cy] = k.iso([at[0], at[1], 0], P);
      return `<circle cx="${f(cx)}" cy="${f(cy)}" r="2.2"/>`;
    })
    .join('');
  return footprint(150, 80, `<path d="${main}${branch}"/>${dots}`);
}

// The plotter head that travels the route: a ground diamond with a centre cross, a pen rising from it.
function plotterSvg() {
  const tile: Plan = { x: -14, y: -14, w: 28, d: 28, r: 0 };
  const pen = 20;
  const [capX, capY] = k.iso([0, 0, pen], P);
  return (
    '<g class="iso-world-plotter">' +
    `<path class="iso-world-plotter-ground" d="${k.planOutline(tile, 0, P, 1)}${k.lineOnTop([-5, 0], [5, 0], 0, P)}${k.lineOnTop([0, -5], [0, 5], 0, P)}"/>` +
    `<path class="iso-world-plotter-pen" d="${k.rise([0, 0], 0, pen, P)}"/>` +
    `<circle class="iso-world-plotter-cap" cx="${f(capX)}" cy="${f(capY)}" r="2.2"/>` +
    '</g>'
  );
}

// A project destination: a wire slab with a thumbnail inset and a signpost at one corner.
function signpost(): Art {
  const slab: Plan = { x: -36, y: -24, w: 72, d: 48, r: 0 };
  const inset: Plan = { x: -26, y: -16, w: 52, d: 32, r: 0 };
  const post: Flat = [-30, -18];
  const flag =
    k.rise(post, 5, 34, P) +
    k.lineOnTop(post, [post[0] + 18, post[1]], 34, P) +
    k.lineOnTop(post, [post[0] + 18, post[1]], 28, P) +
    k.rise([post[0] + 18, post[1]], 28, 34, P);
  return footprint(110, 86, `<path d="${wireBox(slab, 0, 5)}${k.planOutline(inset, 5, P, 1)}${flag}"/>`);
}

const ART: Record<string, () => Art> = {
  Intro: keycap,
  Approach: housing,
  Process: route,
  Work: sheets,
  Award: plinth,
  Experience: graph,
  Contact: socket,
  Project: signpost,
};

function stationSvg(label: string, kind: string, index: number, at: Flat, scale: number) {
  const art = (ART[kind] ?? (() => footprint(120, 80)))();
  const number = String(index + 1).padStart(2, '0');
  return (
    `<g class="iso-world-station" transform="translate(${f(at[0])} ${f(at[1])})">` +
    `<g transform="scale(${scale})">${art.body}</g>` +
    `<text y="${f(art.labelY * scale)}" text-anchor="middle"><tspan class="iso-world-index">${number}</tspan><tspan dx="12">${escape(label.toUpperCase())}</tspan></text>` +
    `</g>`
  );
}

// Between two stations the ground line runs along one iso axis, then the other. The corner can sit on
// either side; take the one nearer the viewport centre at the midpoint of that leg so the head stays on screen.
function bend(a: Flat, b: Flat, centre: Flat): Flat {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const det = UX[0] * UY[1] - UX[1] * UY[0];
  const along = (dx * UY[1] - dy * UY[0]) / det;
  const across = (UX[0] * dy - UX[1] * dx) / det;
  const first: Flat = [a[0] + along * UX[0], a[1] + along * UX[1]];
  const second: Flat = [a[0] + across * UY[0], a[1] + across * UY[1]];
  const far = (at: Flat) => Math.hypot(at[0] - centre[0], at[1] - centre[1]);
  return far(first) <= far(second) ? first : second;
}

function routeOf(points: Flat[], centreOf: (index: number) => Flat) {
  const route: Flat[] = [];
  points.forEach((point, index) => {
    if (index) route.push(bend(points[index - 1], point, centreOf(index)));
    route.push(point);
  });
  const lengths = [0];
  for (let index = 1; index < route.length; index++) {
    lengths.push(lengths[index - 1] + Math.hypot(route[index][0] - route[index - 1][0], route[index][1] - route[index - 1][1]));
  }
  return { route, lengths };
}

function pointAlong(route: Flat[], lengths: number[], distance: number): Flat {
  let index = 1;
  while (index < route.length - 1 && lengths[index] < distance) index++;
  const span = lengths[index] - lengths[index - 1] || 1;
  const t = Math.max(0, Math.min(1, (distance - lengths[index - 1]) / span));
  return [
    route[index - 1][0] + (route[index][0] - route[index - 1][0]) * t,
    route[index - 1][1] + (route[index][1] - route[index - 1][1]) * t,
  ];
}

export function IsoWorld() {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const el = root.current;
      const main = el?.closest<HTMLElement>('main');
      const plane = el?.querySelector<SVGGElement>('.iso-world-plane');
      const planeRect = plane?.querySelector('rect');
      const scene = el?.querySelector<SVGGElement>('.iso-world-scene');
      if (!el || !main || !plane || !planeRect || !scene) return;
      const media = gsap.matchMedia();
      media.add(
        { motion: '(prefers-reduced-motion: no-preference)', still: '(prefers-reduced-motion: reduce)' },
        (context) => {
          const still = Boolean(context.conditions?.still);
          el.classList.toggle('is-static', still);
          let stations: Station[] = [];
          let route: Flat[] = [];
          let lengths: number[] = [];
          let marks: number[] = [];
          let plotter: SVGGElement | null = null;
          let ink: SVGPathElement | null = null;
          let total = 0;
          let dolly = 0.35;
          let reach = 1;

          const render = (y: number) => {
            if (!stations.length) return;
            if (!still) {
              const tx = -dolly * y * DOLLY[0];
              const ty = -dolly * y * DOLLY[1];
              scene.setAttribute('transform', `translate(${f(tx)} ${f(ty)})`);
              plane.setAttribute(
                'transform',
                `translate(${f(mod(tx, TILE[0]) - TILE[0])} ${f(mod(ty, TILE[1]) - TILE[1])})`
              );
              stations.forEach((station) => {
                const focus = smooth(Math.max(0, 1 - Math.abs(y - station.y) / reach));
                if (Math.abs(focus - station.focus) < 0.003) return;
                station.focus = focus;
                station.el.style.setProperty('--focus', focus.toFixed(3));
              });
            }
            if (!plotter || stations.length < 2) return;
            let index = stations.findIndex((station, at) => at < stations.length - 1 && y < stations[at + 1].y);
            if (index < 0) index = stations.length - 2;
            const from = stations[index];
            const to = stations[index + 1];
            const span = to.y - from.y;
            const t = span < 1 ? 1 : Math.max(0, Math.min(1, (y - from.y) / span));
            const distance = marks[index] + (marks[index + 1] - marks[index]) * t;
            const [px, py] = pointAlong(route, lengths, distance);
            plotter.setAttribute('transform', `translate(${f(px)} ${f(py)})`);
            ink?.setAttribute('stroke-dashoffset', f(total - distance));
          };

          const build = () => {
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            const scrollY = window.scrollY;
            const max = ScrollTrigger.maxScroll(window);
            const mainTop = main.getBoundingClientRect().top + scrollY;
            const style = getComputedStyle(el);
            dolly = parseFloat(style.getPropertyValue('--iso-world-dolly')) || 0.35;
            const scale = parseFloat(style.getPropertyValue('--iso-world-scale')) || 1;
            reach = REACH * vh;
            const headings = [...main.querySelectorAll<HTMLElement>('[data-station]')];
            const pins = ScrollTrigger.getAll().filter((st) => st.pin instanceof Element);
            const placed = headings.map((heading, index) => {
              const pin = pins.find((st) => (st.pin as Element).contains(heading));
              let y: number;
              if (pin) {
                const inside = [...(pin.pin as Element).querySelectorAll('[data-station]')];
                const duration = pin.animation?.duration() || inside.length;
                y = pin.start + (pin.end - pin.start) * ((inside.indexOf(heading) + SETTLED) / duration);
              } else {
                const rect = heading.getBoundingClientRect();
                y = rect.top + scrollY + rect.height / 2 - HEAD * vh;
              }
              const clamped = Math.max(0, Math.min(max, y));
              const slot = SLOTS[index % SLOTS.length];
              const at: Flat = still
                ? [slot[0] * vw, slot[1] * vh + y - mainTop]
                : [slot[0] * vw + dolly * clamped * DOLLY[0], slot[1] * vh + dolly * clamped * DOLLY[1]];
              const label = heading.dataset.station ?? '';
              return { label, kind: heading.dataset.stationKind ?? label, y: clamped, at, index };
            });
            if (still) {
              planeRect.setAttribute('x', '0');
              planeRect.setAttribute('y', '0');
              planeRect.setAttribute('width', String(main.offsetWidth));
              planeRect.setAttribute('height', String(main.offsetHeight));
            } else {
              planeRect.setAttribute('x', String(-TILE[0]));
              planeRect.setAttribute('y', String(-TILE[1]));
              planeRect.setAttribute('width', String(vw + TILE[0] * 2));
              planeRect.setAttribute('height', String(vh + TILE[1] * 2));
            }
            const centreOf = (index: number): Flat => {
              const a = placed[index - 1];
              const b = placed[index];
              if (still) return [(a.at[0] + b.at[0]) / 2, (a.at[1] + b.at[1]) / 2];
              const mid = (a.y + b.y) / 2;
              return [vw / 2 + dolly * mid * DOLLY[0], vh / 2 + dolly * mid * DOLLY[1]];
            };
            ({ route, lengths } = routeOf(placed.map((station) => station.at), centreOf));
            marks = placed.map((_, index) => lengths[index * 2]);
            total = lengths[lengths.length - 1];
            const d = k.pathOf(route);
            scene.innerHTML =
              `<path class="iso-world-route" d="${d}"/>` +
              (still ? '' : `<path class="iso-world-ink" d="${d}" stroke-dasharray="${f(total)}" stroke-dashoffset="${f(total)}"/>`) +
              placed.map((station) => stationSvg(station.label, station.kind, station.index, station.at, scale)).join('') +
              (still ? '' : plotterSvg());
            const groups = [...scene.querySelectorAll<SVGGElement>('.iso-world-station')];
            stations = placed.map((station, index) => ({ el: groups[index], y: station.y, at: station.at, focus: -1 }));
            plotter = scene.querySelector<SVGGElement>('.iso-world-plotter');
            ink = scene.querySelector<SVGPathElement>('.iso-world-ink');
            render(scrollY);
          };

          const trigger = still
            ? null
            : ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (self) => render(self.scroll()) });
          ScrollTrigger.addEventListener('refresh', build);
          build();
          el.classList.add('is-live');
          return () => {
            ScrollTrigger.removeEventListener('refresh', build);
            trigger?.kill();
            scene.innerHTML = '';
            el.classList.remove('is-live', 'is-static');
          };
        }
      );
      return () => media.revert();
    },
    { scope: root }
  );
  return (
    <div ref={root} className="iso-world" aria-hidden="true">
      <svg className="iso-world-svg" focusable="false">
        <defs>
          <pattern id="iso-world-grid" patternUnits="userSpaceOnUse" width={TILE[0]} height={TILE[1]}>
            <path
              className="iso-world-grid-line"
              d={`M0 0L${TILE[0]} ${TILE[1]}M0 ${TILE[1]}L${TILE[0]} 0`}
            />
          </pattern>
        </defs>
        <g className="iso-world-plane">
          <rect width="0" height="0" fill="url(#iso-world-grid)" />
        </g>
        <g className="iso-world-scene" />
      </svg>
    </div>
  );
}
