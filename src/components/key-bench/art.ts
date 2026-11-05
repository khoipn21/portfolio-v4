import * as k from '@/components/iso/iso-kit';
import type { Plan, Point3 } from '@/components/iso/iso-kit';
import {
  BEAM_X,
  BEAM_Z,
  BLADE_BOTTOM,
  CAP_HALF,
  CAP_TOP,
  CAP_Z,
  CROWN_H,
  CROWN_INSET,
  FLOOR,
  FOOT_H,
  HOUSING,
  P,
  PCB,
  PCB_H,
  PCB_TOP,
  PLATE,
  PLATE_H,
  POLE_R,
  SHAFT_R,
  SKIRT_H,
  SLIDER_H,
  SLIDER_HALF,
  SLIDER_TOP,
  SLIDER_Z,
  SPRING_R,
  STANDOFF_H,
  SW,
  TOWER_GAP,
  TOWER_TOP,
  TOWER_Y,
  WALL,
  WALL_TOP,
  at,
} from './view';

const S = k.solidSvg;
const L = k.lineSvg;
const D = k.dotsSvg;
const depth = ([x, y]: [number, number], z = 0) => k.depthOf([x, y, z], P);
const byDepth = <T extends [number, number]>(points: T[]) => [...points].sort((a, b) => depth(a) - depth(b));
const flat = (points: Point3[]) => points.map(at);

function stadium(u0: number, u1: number, v: number, radius: number, place: (u: number, v: number) => Point3) {
  const points: Point3[] = [];
  const steps = 8;
  for (let i = 0; i <= steps; i++) {
    const a = Math.PI / 2 + (Math.PI * i) / steps;
    points.push(place(u0 + radius + radius * Math.cos(a), v + radius * Math.sin(a)));
  }
  for (let i = 0; i <= steps; i++) {
    const a = -Math.PI / 2 + (Math.PI * i) / steps;
    points.push(place(u1 - radius + radius * Math.cos(a), v + radius * Math.sin(a)));
  }
  return k.pathOf(flat(points), true);
}

function trace(route: [number, number][], className: string, ends: 'both' | 'from' | 'to' = 'both') {
  const points = route.map(([x, y]) => at([x, y, PCB_TOP]));
  return `<g class="${className}">${k.wireSvg(points[0]!, points[points.length - 1]!, { via: points.slice(1, -1), tone: 'lo', size: 1, ends })}</g>`;
}

function base() {
  const out = [`<path class="iso-halo" d="${k.haloOf(PLATE, -PLATE_H - FOOT_H, PLATE_H, P)}"/>`];
  for (const [x, y] of byDepth(k.corners(PLATE, 22))) {
    out.push(S(k.cylinder(x, y, 7, -PLATE_H - FOOT_H, 1.6, P, 28), { tone: 'lo' }));
    out.push(S(k.cylinder(x, y, 5.4, -PLATE_H - FOOT_H + 1.6, FOOT_H - 1.6, P, 28), { tone: 'mid' }));
  }
  out.push(S(k.slabOf(PLATE, -PLATE_H, PLATE_H, P, 8, 1.6), { tone: 'mid' }));
  out.push(L(k.planOutline(k.insetPlan(PLATE, 5), 0, P), { tone: 'lo' }));
  const screws = k.corners(PLATE, 10);
  out.push(L(screws.map(([x, y]) => k.ring(x, y, 2.2, 0, P, 16)).join(''), { tone: 'lo' }));
  out.push(D(screws.map(([x, y]) => at([x, y, 0])), { size: 0.5 }));

  const strip: Plan = { x: PLATE.x + 12, y: PLATE.y + PLATE.d - 11, w: 140, d: 6, r: 1 };
  out.push(S(k.slabOf(strip, 0, 0.6, P, 3), { tone: 'lo', crease: 'none' }));
  const ticks = k.topTicks(strip.x + 4, strip.x + strip.w - 4, 4, 5, strip.y + 0.8, 0.6, [1.8, 3.4], P);
  out.push(L(ticks.minor, { tone: 'lo' }), L(ticks.major, { tone: 'mid' }));

  const label: Plan = { x: 44, y: PLATE.y + PLATE.d - 12.5, w: 56, d: 9, r: 1.2 };
  out.push(S(k.slabOf(label, 0, 0.8, P, 3), { tone: 'mid', crease: 'none' }));
  out.push(L(k.planOutline(k.insetPlan(label, 1.4), 0.8, P), { tone: 'faint' }));
  for (const [from, to, y] of [
    [8, 40, 2.8],
    [8, 30, 4.6],
    [8, 34, 6.4],
  ] as const) {
    out.push(L(k.lineOnTop([label.x + from, label.y + y], [label.x + to, label.y + y], 0.8, P), { tone: 'lo', free: true }));
  }
  out.push(D([at([label.x + 4, label.y + 4.5, 0.8]), at([label.x + label.w - 4, label.y + 4.5, 0.8])], { size: 0.4 }));
  return out.join('');
}

function board() {
  const out: string[] = [];
  const posts = byDepth(k.corners(PCB, 8));
  for (const [x, y] of posts) out.push(S(k.cylinder(x, y, 4, 0, STANDOFF_H, P, 24), { tone: 'mid' }));
  out.push(S(k.slabOf(PCB, STANDOFF_H, PCB_H, P, 4, 0.5), { tone: 'mid' }));
  out.push(L(k.planOutline(k.insetPlan(PCB, 3), PCB_TOP, P, 4), { tone: 'faint' }));
  out.push(L(posts.map(([x, y]) => k.ring(x, y, 3, PCB_TOP, P, 16)).join(''), { tone: 'lo' }));
  out.push(D(posts.map(([x, y]) => at([x, y, PCB_TOP])), { size: 0.5 }));
  return out.join('');
}

const SWITCH_X = HOUSING.x + HOUSING.w;

function traces() {
  return [
    trace(
      [
        [SWITCH_X, SW[1] + 18],
        [-15.75, SW[1] + 18],
        [-15.75, 22.6],
      ],
      'kb-signal',
    ),
    trace(
      [
        [-15.75, 34.4],
        [-15.75, 38],
        [14, 38],
        [14, -3],
      ],
      'kb-signal',
    ),
    trace(
      [
        [SWITCH_X, -20],
        [6, -20],
      ],
      'kb-signal',
      'from',
    ),
    trace(
      [
        [37, -10],
        [41, -10],
        [41, 8.5],
        [46.5, 8.5],
      ],
      'kb-drive',
      'from',
    ),
    trace(
      [
        [55.5, 8.5],
        [66, 8.5],
      ],
      'kb-drive',
      'from',
    ),
    trace(
      [
        [86, -18],
        [37, -18],
      ],
      'kb-bus',
    ),
    trace(
      [
        [86, -14],
        [37, -14],
      ],
      'kb-bus',
    ),
    trace(
      [
        [46, -37],
        [41, -37],
        [41, -30],
        [37, -30],
      ],
      'kb-bus',
      'to',
    ),
  ].join('');
}

const MCU: Plan = { x: 6, y: -34, w: 28, d: 28, r: 1.5 };

function controller() {
  const out: string[] = [];
  const top = PCB_TOP + 4;
  const pins: string[] = [];
  for (let y = MCU.y + 4; y <= MCU.y + MCU.d - 4; y += 4) pins.push(k.lineOnTop([MCU.x + MCU.w, y], [MCU.x + MCU.w + 3, y], PCB_TOP, P));
  for (let x = MCU.x + 4; x <= MCU.x + MCU.w - 4; x += 4) pins.push(k.lineOnTop([x, MCU.y + MCU.d], [x, MCU.y + MCU.d + 3], PCB_TOP, P));
  out.push(L(pins.join(''), { tone: 'mid' }));
  out.push(S(k.slabOf(MCU, PCB_TOP, 4, P, 3, 0.6), { tone: 'mid' }));
  out.push(L(k.planOutline(k.insetPlan(MCU, 2.4), top, P, 3), { tone: 'faint' }));
  out.push(L(k.ring(MCU.x + 6, MCU.y + 6, 1.4, top, P, 14), { tone: 'lo' }));
  for (const [from, to, y] of [
    [9, 22, 13],
    [9, 18, 16.5],
  ] as const) {
    out.push(L(k.lineOnTop([MCU.x + from, MCU.y + y], [MCU.x + to, MCU.y + y], top, P), { tone: 'lo', free: true }));
  }

  const crystal: Plan = { x: 46, y: -42, w: 14, d: 7, r: 3 };
  out.push(S(k.slabOf(crystal, PCB_TOP, 3.6, P, 6, 0.6), { tone: 'mid' }));
  out.push(L(k.planOutline(k.insetPlan(crystal, 1.2), PCB_TOP + 3.6, P, 6), { tone: 'faint' }));
  for (const x of [47, 55]) out.push(chip({ x, y: -31, w: 4, d: 2.4, r: 0.3 }, 1.6));
  for (const y of [-2.4]) out.push(chip({ x: 0, y, w: 2.4, d: 4, r: 0.3 }, 1.6));
  return out.join('');
}

function chip(plan: Plan, height: number) {
  const cap = Math.min(1.2, plan.w / 3);
  return (
    S(k.slabOf(plan, PCB_TOP, height, P, 2), { tone: 'mid', crease: 'none' }) +
    L(k.lineOnTop([plan.x + cap, plan.y], [plan.x + cap, plan.y + plan.d], PCB_TOP + height, P) + k.lineOnTop([plan.x + plan.w - cap, plan.y], [plan.x + plan.w - cap, plan.y + plan.d], PCB_TOP + height, P), {
      tone: 'lo',
    })
  );
}

function diode() {
  const plan: Plan = { x: -18, y: 23.4, w: 4.5, d: 10.4, r: 0.6 };
  const top = PCB_TOP + 2.6;
  return (
    S(k.slabOf(plan, PCB_TOP, 2.6, P, 2, 0.4), { tone: 'mid' }) +
    L(k.lineOnTop([plan.x, plan.y + 2.4], [plan.x + plan.w, plan.y + 2.4], top, P), { tone: 'hi' })
  );
}

function resistor() {
  const body: Plan = { x: 47, y: 6.3, w: 8, d: 4.4, r: 0.4 };
  return (
    S(k.slabOf({ x: 46, y: 6, w: 2, d: 5, r: 0.4 }, PCB_TOP, 2.4, P, 2), { tone: 'lo', crease: 'none' }) +
    S(k.slabOf(body, PCB_TOP, 2.2, P, 2), { tone: 'mid', crease: 'none' }) +
    S(k.slabOf({ x: 54, y: 6, w: 2, d: 5, r: 0.4 }, PCB_TOP, 2.4, P, 2), { tone: 'lo', crease: 'none' })
  );
}

export const LED_AT: [number, number] = [72, 10];

function ledGlow() {
  const [cx, cy] = at([LED_AT[0], LED_AT[1], PCB_TOP + 4]);
  const r = P.scale * 30;
  return `<defs><radialGradient id="kb-glow-g"><stop offset="0" class="kb-stop-0"/><stop offset=".4" class="kb-stop-1"/><stop offset="1" class="kb-stop-2"/></radialGradient></defs><ellipse class="kb-glow" cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" rx="${r.toFixed(1)}" ry="${(r * 0.62).toFixed(1)}" fill="url(#kb-glow-g)"/>`;
}

function led() {
  const [x, y] = LED_AT;
  return (
    S(k.slabOf({ x: x - 6, y: y - 6, w: 12, d: 12, r: 1.5 }, PCB_TOP, 2, P, 3, 0.4), { tone: 'mid' }) +
    `<g class="kb-led">${S(k.cylinder(x, y, 4.2, PCB_TOP + 2, 4.6, P, 32, 1), { tone: 'mid' })}</g>` +
    L(k.ring(x, y, 2, PCB_TOP + 6.6, P, 20), { tone: 'faint' })
  );
}

function usb() {
  const shell: Plan = { x: 86, y: -24, w: 18, d: 20, r: 3 };
  const z = PCB_TOP;
  const face = shell.x + shell.w;
  return (
    S(k.slabOf(shell, z, 7, P, 6, 0.6), { tone: 'mid' }) +
    L(stadium(-20, -8, z + 3.5, 1.8, (u, v) => [face, u, v]), { tone: 'lo' }) +
    L(k.planOutline(k.insetPlan(shell, 3), z + 7, P, 6), { tone: 'faint' }) +
    D([at([shell.x + 3, shell.y + 3, z + 7]), at([shell.x + 3, shell.y + shell.d - 3, z + 7])], { size: 0.45 })
  );
}

const WALL_LEFT: Plan = { x: HOUSING.x, y: HOUSING.y, w: WALL, d: HOUSING.d, r: 0.6 };
const WALL_BACK: Plan = { x: HOUSING.x + WALL, y: HOUSING.y, w: HOUSING.w - WALL, d: WALL, r: 0.6 };

function housing() {
  const out: string[] = [];
  out.push(S(k.slabOf(HOUSING, PCB_TOP, FLOOR - PCB_TOP, P, 4, 0.8), { tone: 'mid' }));
  out.push(L(k.planOutline(k.insetPlan(HOUSING, 3.5), FLOOR, P, 4), { tone: 'faint' }));
  out.push(L(k.ring(SW[0], SW[1], SPRING_R + 1.4, FLOOR, P, 40), { tone: 'faint' }));
  out.push(L(k.ring(SW[0], SW[1], POLE_R + 1, FLOOR, P, 20), { tone: 'lo' }));
  out.push(D(k.corners(HOUSING, 6).map(([x, y]) => at([x, y, FLOOR])), { size: 0.45 }));
  out.push(S(k.slabOf(WALL_LEFT, FLOOR, WALL_TOP - FLOOR, P, 2, 0.4), { tone: 'mid' }));
  out.push(L(stadium(SW[1] + 8, SW[1] + 20, WALL_TOP - 8, 2.2, (u, v) => [WALL_LEFT.x + WALL, u, v]), { tone: 'lo' }));
  out.push(S(k.slabOf(WALL_BACK, FLOOR, WALL_TOP - FLOOR, P, 2, 0.4), { tone: 'mid' }));
  out.push(L(stadium(SW[0] + 6, SW[0] + 18, WALL_TOP - 8, 2.2, (u, v) => [u, WALL_BACK.y + WALL, v]), { tone: 'lo' }));
  return out.join('');
}

const EMITTER: Plan = { x: BEAM_X - 2.5, y: SW[1] - TOWER_Y - TOWER_GAP, w: 5, d: TOWER_GAP, r: 0.6 };
const RECEIVER: Plan = { x: BEAM_X - 2.5, y: SW[1] + TOWER_Y, w: 5, d: TOWER_GAP, r: 0.6 };
const BLADE: Plan = { x: BEAM_X - 3, y: SW[1] - 0.6, w: 6, d: 1.2, r: 0.3 };

function emitter() {
  const lens = k.sideRing([BEAM_X, SW[1] - TOWER_Y, BEAM_Z], 1.3, 'y', P, 16);
  return S(k.slabOf(EMITTER, FLOOR, TOWER_TOP - FLOOR, P, 2, 0.4), { tone: 'mid' }) + L(lens, { tone: 'hi' }) + D([at([BEAM_X, SW[1] - TOWER_Y, BEAM_Z])], { size: 0.5, tone: 'hi' });
}

function receiver() {
  return S(k.slabOf(RECEIVER, FLOOR, TOWER_TOP - FLOOR, P, 2, 0.4), { tone: 'mid' }) + D([at([BEAM_X - 1.2, SW[1] + TOWER_Y + 2.5, TOWER_TOP]), at([BEAM_X + 1.2, SW[1] + TOWER_Y + 2.5, TOWER_TOP])], { size: 0.4 });
}

const beam = (from: number, to: number) => L(k.segment([BEAM_X, from, BEAM_Z], [BEAM_X, to, BEAM_Z], P), { tone: 'lit', className: 'kb-beam' });

function slider() {
  const plan: Plan = { x: SW[0] - SLIDER_HALF, y: SW[1] - SLIDER_HALF, w: SLIDER_HALF * 2, d: SLIDER_HALF * 2, r: 1.5 };
  const arm: Plan = { x: SW[0] + SLIDER_HALF, y: SW[1] - 2, w: BEAM_X + 3 - SW[0] - SLIDER_HALF, d: 4, r: 0.6 };
  return (
    S(k.slabOf(BLADE, BLADE_BOTTOM, SLIDER_Z - BLADE_BOTTOM, P, 2), { tone: 'hi', crease: 'none' }) +
    S(k.slabOf(plan, SLIDER_Z, SLIDER_H, P, 3, 0.6), { tone: 'hi' }) +
    S(k.slabOf(arm, SLIDER_Z, 4, P, 2, 0.4), { tone: 'hi' }) +
    L(k.sideSeam(plan, SLIDER_Z + 3.5, P, 3), { tone: 'faint' })
  );
}

function keycap() {
  const skirt: Plan = { x: SW[0] - CAP_HALF, y: SW[1] - CAP_HALF, w: CAP_HALF * 2, d: CAP_HALF * 2, r: 6 };
  const crown = k.insetPlan(skirt, CROWN_INSET);
  const out: string[] = [];
  out.push(S(k.cylinder(SW[0], SW[1], SHAFT_R, SLIDER_TOP, CAP_Z - SLIDER_TOP, P, 20), { tone: 'mid', crease: 'none' }));
  out.push(L(k.sideArc(SW[0], SW[1], SHAFT_R, SLIDER_TOP + 3, P, 16), { tone: 'faint' }));
  out.push(S(k.slabOf(skirt, CAP_Z, SKIRT_H, P, 8, 1.2), { tone: 'hi', lit: true, inner: L(k.sideSeam(skirt, CAP_Z + 2.4, P, 8), { tone: 'faint' }) }));
  out.push(S(k.slabOf(crown, CAP_Z + SKIRT_H, CROWN_H, P, 8, 1.6), { tone: 'hi', lit: true }));
  out.push(L(k.planOutline(k.insetPlan(crown, 4), CAP_TOP, P, 8), { tone: 'faint' }));
  out.push(k.faceTextSvg(k.topMatrix([SW[0] + 6, SW[1]], CAP_TOP, P, 'y'), 'K', { size: 17, tone: 'hi', anchor: 'middle' }));
  return out.join('');
}

export interface KeyBenchArt {
  base: string;
  board: string;
  traces: string;
  housing: string;
  emitter: string;
  beamBack: string;
  slider: string;
  beamFront: string;
  receiver: string;
  keycap: string;
  front: string;
  glow: string;
}

export function keyBenchArt(): KeyBenchArt {
  return {
    base: base(),
    board: board(),
    traces: traces(),
    glow: ledGlow(),
    housing: housing(),
    emitter: emitter(),
    beamBack: beam(SW[1] - TOWER_Y, BLADE.y),
    slider: slider(),
    beamFront: beam(BLADE.y + BLADE.d, SW[1] + TOWER_Y),
    receiver: receiver(),
    keycap: keycap(),
    front: controller() + diode() + resistor() + led() + usb(),
  };
}

export const FIGURE_LABEL =
  'A keyswitch on a bench. A keycap marked K sits on the stem of a cut away linear optical switch, mounted on a small circuit board with a diode, a controller chip, a crystal, a USB connector and an LED. Press the key and the stem sinks against its spring; at 2 millimetres a shutter on the stem cuts an infrared beam, the controller reads the key and the LED lights.';


