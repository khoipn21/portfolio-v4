import * as k from '@/components/iso/iso-kit';
import type { Plan, Point3 } from '@/components/iso/iso-kit';
import {
  ARCHIVE,
  ARCHIVE_COIL,
  ARCHIVE_FLANGE,
  ARCHIVE_TOP,
  BRACKET,
  COIL_TOP,
  COILS,
  DIAL,
  DIAL_R,
  DIAL_TOP,
  FOOT_H,
  GATE_X,
  HIST_FROM,
  HIST_RAIL,
  HIST_TO,
  HIST_Y,
  HIST_Z,
  HUB_TOP,
  LIVE_FROM,
  LIVE_RAIL,
  LIVE_RAIL_Z,
  LIVE_Y,
  LIVE_Z,
  MID_FLANGE_Z,
  P,
  PAGE_LEN,
  PIVOT_X,
  PLATE,
  PLATE_H,
  PRINT_X,
  REG_TOP,
  REGISTER,
  SPACING,
  SPOOL,
  SPOOL_COIL,
  SPOOL_FLANGE,
  SPRING_AT,
  SPRING_SEAT,
  TAPE_H,
  TAPE_T,
  UPPER_FLANGE_Z,
  ARM_Z,
  at,
} from './view';
import { PAGE_SIZE } from './model';

const S = k.solidSvg;
const L = k.lineSvg;
const D = k.dotsSvg;
const depth = ([x, y]: [number, number], z = 0) => k.depthOf([x, y, z], P);
const byDepth = <T extends [number, number]>(points: T[]) => [...points].sort((a, b) => depth(a) - depth(b));
const flat = (points: Point3[]) => points.map(at);
const cyl = (x: number, y: number, r: number, z: number, h: number, steps = 32, bevel = 0) => k.cylinder(x, y, r, z, h, P, steps, bevel);
const slab = (plan: Plan, z: number, h: number, steps = 3, bevel = 0) => k.slabOf(plan, z, h, P, steps, bevel);

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

/* A knurled binding post: neck, knurled cap, screw dot. */
function bindingPost(x: number, y: number, z: number) {
  return (
    S(cyl(x, y, 1.5, z, 2.4, 18), { tone: 'mid', crease: 'none' }) +
    S(cyl(x, y, 2.4, z + 2.4, 2.4, 24, 0.3), { tone: 'mid', inner: L(k.knurl(x, y, 2.4, z + 2.4, z + 4.8, 22, P), { tone: 'lo' }) }) +
    D([at([x, y, z + 4.8])], { size: 0.5 })
  );
}

/* A guide roller standing on a rail: flange, barrel, cap, axle dot. */
function roller(x: number, y: number, z: number, h: number, r = 2.2) {
  return (
    S(cyl(x, y, r + 0.8, z, 0.8, 24), { tone: 'lo', crease: 'none' }) +
    S(cyl(x, y, r, z + 0.8, h - 0.8, 24), { tone: 'mid', crease: 'none', inner: L(k.sideArc(x, y, r, z + h - 1.6, P, 16), { tone: 'faint' }) }) +
    S(cyl(x, y, r + 0.6, z + h, 0.9, 24, 0.3), { tone: 'mid' }) +
    D([at([x, y, z + h + 0.9])], { size: 0.45 })
  );
}

function base() {
  const out = [`<path class="iso-halo" d="${k.haloOf(PLATE, -PLATE_H - FOOT_H, PLATE_H, P)}"/>`];
  for (const [x, y] of byDepth(k.corners(PLATE, 20))) {
    out.push(S(cyl(x, y, 7, -PLATE_H - FOOT_H, 1.6, 28), { tone: 'lo' }));
    out.push(S(cyl(x, y, 5.4, -PLATE_H - FOOT_H + 1.6, FOOT_H - 1.6, 28), { tone: 'mid' }));
  }
  const plateSeam = L(k.sideSeam(PLATE, -PLATE_H + 3.2, P, 8), { tone: 'faint' });
  out.push(S(k.slabOf(PLATE, -PLATE_H, PLATE_H, P, 8, 1.6), { tone: 'mid', inner: plateSeam }));
  out.push(L(k.planOutline(k.insetPlan(PLATE, 5), 0, P), { tone: 'lo' }));
  const screws = k.corners(PLATE, 10);
  out.push(L(screws.map(([x, y]) => k.ring(x, y, 2.2, 0, P, 16)).join(''), { tone: 'lo' }));
  out.push(D(screws.map(([x, y]) => at([x, y, 0])), { size: 0.5 }));

  const label: Plan = { x: -64, y: PLATE.y + PLATE.d - 14, w: 44, d: 9, r: 1.2 };
  out.push(S(slab(label, 0, 0.8, 3), { tone: 'mid', crease: 'none' }));
  out.push(L(k.planOutline(k.insetPlan(label, 1.4), 0.8, P), { tone: 'faint' }));
  for (const [from, to, y] of [
    [8, 34, 2.8],
    [8, 26, 4.6],
    [8, 30, 6.4],
  ] as const) {
    out.push(L(k.lineOnTop([label.x + from, label.y + y], [label.x + to, label.y + y], 0.8, P), { tone: 'lo', free: true }));
  }
  out.push(D([at([label.x + 4, label.y + 4.5, 0.8]), at([label.x + label.w - 4, label.y + 4.5, 0.8])], { size: 0.4 }));
  return out.join('');
}

export const INSULATOR: [number, number] = [-58, -22];
export const INSULATOR_TOP = 25.6;

function insulator() {
  const [x, y] = INSULATOR;
  const foot: Plan = { x: x - 6, y: y - 5, w: 12, d: 10, r: 1.5 };
  return (
    S(slab(foot, 0, 2.4, 3, 0.4), { tone: 'mid' }) +
    D(k.corners(foot, 2).map(([px, py]) => at([px, py, 2.4])), { size: 0.4 }) +
    S(cyl(x, y, 1.8, 2.4, 12, 18), { tone: 'mid', crease: 'none' }) +
    S(cyl(x, y, 4.6, 14.4, 1.4, 32, 0.3), { tone: 'mid' }) +
    S(cyl(x, y, 3.4, 15.8, 5.6, 28), { tone: 'hi', crease: 'lo', inner: L(k.sideArc(x, y, 3.4, 17.6, P, 18) + k.sideArc(x, y, 3.4, 19.4, P, 18), { tone: 'faint' }) }) +
    S(cyl(x, y, 2.2, 21.4, 2.6, 22), { tone: 'hi', crease: 'lo' }) +
    S(cyl(x, y, 1.2, 24, 1.6, 16), { tone: 'mid', crease: 'none' })
  );
}

const HIST_TOP = HIST_Z + TAPE_H;
const GATE_BACK: Plan = { x: GATE_X - 1.6, y: HIST_RAIL.y - 3.2, w: 3.2, d: 3.2, r: 0.5 };
const GATE_FRONT: Plan = { x: GATE_X - 1.6, y: HIST_RAIL.y + HIST_RAIL.d, w: 3.2, d: 3.2, r: 0.5 };
const GATE_Z = HIST_TOP + 3.2;

function railOf(rail: Plan, z: number, h: number, tapeY: number, ticksTo: number) {
  const top = z + h;
  const front = rail.y + rail.d;
  const groove = k.planOutline({ x: rail.x + 2, y: tapeY - 0.9, w: rail.w - 4, d: 1.8, r: 0.6 }, top, P, 3);
  const ticks = k.topTicks(rail.x + 4, ticksTo, SPACING, 5, front, top, [-1.1, -2.1], P);
  return (
    S(slab(rail, z, h, 3, 0.4), { tone: 'mid', inner: L(k.sideSeam(rail, z + h * 0.45, P, 3), { tone: 'faint' }) }) +
    L(groove, { tone: 'faint' }) +
    L(ticks.minor, { tone: 'lo' }) +
    L(ticks.major, { tone: 'mid' })
  );
}

function tapeSlab(from: number, to: number, y: number, z: number) {
  return S(slab({ x: from, y: y - TAPE_T / 2, w: to - from, d: TAPE_T, r: 0 }, z, TAPE_H, 1), { tone: 'hi', crease: 'none' });
}

/* The history tape lies on the spool coil's front from the tangent point; the live tape leaves the back, behind the flanges. */
const HIST_VISIBLE_FROM = SPOOL[0];
const LIVE_VISIBLE_FROM = SPOOL[0] + Math.sqrt(SPOOL_FLANGE ** 2 - SPOOL_COIL ** 2);

function histBack() {
  return (
    railOf(HIST_RAIL, 0, HIST_Z, HIST_Y, HIST_RAIL.x + HIST_RAIL.w - 18) +
    roller(-76, HIST_Y - TAPE_T / 2 - 2.2, HIST_Z, TAPE_H + 1.2) +
    S(slab(GATE_BACK, 0, GATE_Z, 2, 0.3), { tone: 'mid' })
  );
}

function histFront() {
  const bridge: Plan = { x: GATE_X - 2.2, y: GATE_BACK.y, w: 4.4, d: GATE_FRONT.y + GATE_FRONT.d - GATE_BACK.y, r: 0.8 };
  const pawl: Plan = { x: GATE_X - 0.7, y: HIST_Y - 0.9, w: 1.4, d: 1.8, r: 0.3 };
  const link: Plan = { x: GATE_X - 1.2, y: GATE_FRONT.y + GATE_FRONT.d, w: 2.4, d: DIAL[1] - DIAL_R - GATE_FRONT.y - GATE_FRONT.d + 1, r: 0.4 };
  const [dx, dy] = DIAL;
  const ticks = k.radialTicks(dx, dy, DIAL_R - 1.8, 40, 4, DIAL_TOP, [1, 2.2], P);
  return (
    S(slab(pawl, HIST_TOP + 0.4, GATE_Z - HIST_TOP - 0.4, 2), { tone: 'mid', crease: 'none' }) +
    S(slab(GATE_FRONT, 0, GATE_Z, 2, 0.3), { tone: 'mid' }) +
    S(slab(bridge, GATE_Z, 1.8, 2, 0.4), { tone: 'mid' }) +
    D([at([GATE_X, GATE_BACK.y + 1.6, GATE_Z + 1.8]), at([GATE_X, GATE_FRONT.y + 1.6, GATE_Z + 1.8])], { size: 0.45 }) +
    S(slab(link, 2.4, 1.6, 2), { tone: 'mid', crease: 'none' }) +
    S(cyl(dx, dy, DIAL_R + 1, 0, 1.4, 40), { tone: 'lo' }) +
    S(cyl(dx, dy, DIAL_R, 1.4, DIAL_TOP - 1.4, 56, 0.6), { tone: 'mid', crease: 'lo', inner: L(k.sideArc(dx, dy, DIAL_R, 3.4, P, 30), { tone: 'faint' }) }) +
    L(k.ring(dx, dy, DIAL_R - 1, DIAL_TOP, P, 56), { tone: 'lo' }) +
    L(ticks.minor, { tone: 'lo' }) +
    L(ticks.major, { tone: 'mid' }) +
    L(k.ring(dx, dy, 1.4, DIAL_TOP, P, 16), { tone: 'mid' })
  );
}

function reelBody(cx: number, cy: number, coil: number, flange: number, z: number, pedestal = true) {
  const out: string[] = [];
  if (pedestal) out.push(S(cyl(cx, cy, 9, 0, 1.2, 36), { tone: 'lo' }));
  out.push(S(cyl(cx, cy, flange, z - 1.2, 1.2, 72, 0.4), { tone: 'mid' }));
  const wraps = [0.3, 0.55, 0.8].map((share) => k.sideArc(cx, cy, coil, z + TAPE_H * share, P, 40)).join('');
  out.push(S(cyl(cx, cy, coil, z, TAPE_H, 72), { tone: 'hi', crease: 'none', inner: L(wraps, { tone: 'faint' }) }));
  return out.join('');
}

function flangeTop(cx: number, cy: number, flange: number, z: number, hub: number, hubTop: number) {
  return (
    S(cyl(cx, cy, flange, z, 1.2, 72, 0.4), { tone: 'mid' }) +
    L(k.ring(cx, cy, flange - 3, z + 1.2, P, 64) + k.ring(cx, cy, hub + 2, z + 1.2, P, 32), { tone: 'faint' }) +
    S(cyl(cx, cy, hub, z + 1.2, hubTop - z - 1.2, 36, 0.4), { tone: 'mid', inner: L(k.knurl(cx, cy, hub, z + 1.2, hubTop, 30, P), { tone: 'faint' }) }) +
    L(k.ring(cx, cy, hub * 0.5, hubTop, P, 20), { tone: 'lo' })
  );
}

/* The history tape lies on the archive coil's front, so the coil paints before the tape and the top flange after it. */
function archiveLower() {
  const [x, y] = ARCHIVE;
  return reelBody(x, y, ARCHIVE_COIL, ARCHIVE_FLANGE, HIST_Z);
}

function archiveUpper() {
  const [x, y] = ARCHIVE;
  return flangeTop(x, y, ARCHIVE_FLANGE, ARCHIVE_TOP - 1.2, 5, HUB_TOP);
}

export const TERMINAL: Plan = { x: -42, y: -12, w: 24, d: 10, r: 1.4 };
export const TERMINAL_TOP = 4.6;
export const POSTS: [number, number][] = [
  [TERMINAL.x + 6, TERMINAL.y + 5],
  [TERMINAL.x + 18, TERMINAL.y + 5],
];

function middle() {
  return (
    S(slab(TERMINAL, 0, TERMINAL_TOP, 3, 0.5), { tone: 'mid', inner: L(k.sideSeam(TERMINAL, 1.6, P, 3), { tone: 'faint' }) }) +
    L(k.planOutline(k.insetPlan(TERMINAL, 1.6), TERMINAL_TOP, P, 3), { tone: 'faint' }) +
    D([at([TERMINAL.x + 12, TERMINAL.y + 3, TERMINAL_TOP]), at([TERMINAL.x + 12, TERMINAL.y + 7, TERMINAL_TOP])], { size: 0.45 }) +
    POSTS.map(([px, py]) => bindingPost(px, py, TERMINAL_TOP)).join('')
  );
}

function spoolLower() {
  const [x, y] = SPOOL;
  return reelBody(x, y, SPOOL_COIL, SPOOL_FLANGE, HIST_Z);
}

function spoolUpper() {
  const [x, y] = SPOOL;
  return (
    S(cyl(x, y, SPOOL_FLANGE, MID_FLANGE_Z, LIVE_Z - MID_FLANGE_Z, 72, 0.4), { tone: 'mid', inner: L(k.sideArc(x, y, SPOOL_FLANGE, MID_FLANGE_Z + 0.8, P, 48), { tone: 'faint' }) }) +
    S(cyl(x, y, SPOOL_COIL, LIVE_Z, TAPE_H, 72), {
      tone: 'hi',
      crease: 'none',
      inner: L([0.3, 0.55, 0.8].map((share) => k.sideArc(x, y, SPOOL_COIL, LIVE_Z + TAPE_H * share, P, 40)).join(''), { tone: 'faint' }),
    }) +
    flangeTop(x, y, SPOOL_FLANGE, UPPER_FLANGE_Z, 6, UPPER_FLANGE_Z + 4.4)
  );
}

const RAIL_POSTS = [-74, -24, 22];

function liveBack() {
  const out: string[] = [];
  for (const px of RAIL_POSTS) {
    out.push(S(cyl(px, LIVE_RAIL.y + 4, 4, 0, 1.2, 24), { tone: 'lo' }));
    out.push(S(cyl(px, LIVE_RAIL.y + 4, 2.6, 1.2, LIVE_RAIL_Z - 1.2, 24), { tone: 'mid', crease: 'none', inner: L(k.sideArc(px, LIVE_RAIL.y + 4, 2.6, 3, P, 16), { tone: 'faint' }) }));
  }
  out.push(S(slab(BRACKET, 0, LIVE_RAIL_Z, 3, 0.5), { tone: 'mid', inner: L(k.sideSeam(BRACKET, LIVE_RAIL_Z * 0.5, P, 3), { tone: 'faint' }) }));
  out.push(railOf(LIVE_RAIL, LIVE_RAIL_Z, LIVE_Z - LIVE_RAIL_Z, LIVE_Y, PRINT_X - 4));
  out.push(D(k.corners(BRACKET, 1.8).filter(([, py]) => Math.abs(py - LIVE_Y) > 4).map(([px, py]) => at([px, py, LIVE_RAIL_Z])), { size: 0.45 }));
  out.push(roller(-82, LIVE_Y - TAPE_T / 2 - 2.2, LIVE_Z, TAPE_H + 1.2));
  out.push(roller(36, LIVE_Y - TAPE_T / 2 - 2.6, LIVE_Z, TAPE_H + 1.2, 2.6));
  out.push(tapeSlab(LIVE_VISIBLE_FROM, REGISTER.x + 2, LIVE_Y, LIVE_Z));
  return out.join('');
}

function liveFront() {
  return roller(36, LIVE_Y + TAPE_T / 2 + 2.6, LIVE_Z, TAPE_H + 1.2, 2.6);
}

export const REG_TERMINALS: [number, number][] = [
  [48, REGISTER.y + REGISTER.d - 3.4],
  [55, REGISTER.y + REGISTER.d - 3.4],
];

const POST_BACK: Plan = { x: PIVOT_X - 3, y: LIVE_Y - 6.4, w: 6, d: 3.4, r: 0.6 };
const POST_FRONT: Plan = { x: PIVOT_X - 3, y: LIVE_Y + 3, w: 6, d: 3.4, r: 0.6 };
const POST_TOP = ARM_Z + 4.6;

function registerBox() {
  const out: string[] = [];
  const face = REGISTER.y + REGISTER.d;
  const end = REGISTER.x + REGISTER.w;
  out.push(S(slab(REGISTER, 0, REG_TOP, 4, 0.8), { tone: 'mid', inner: L(k.sideSeam(REGISTER, REG_TOP - 4.4, P, 4) + k.sideSeam(REGISTER, 2.2, P, 4), { tone: 'faint' }) }));
  out.push(L(k.planOutline(k.insetPlan(REGISTER, 2.4), REG_TOP, P, 4), { tone: 'faint' }));
  const vents = [0, 1, 2, 3, 4].map((i) => stadium(64 + i * 8, 69 + i * 8, 11, 1, (u, v) => [u, face, v])).join('');
  out.push(L(vents, { tone: 'lo' }));
  out.push(L(stadium(REGISTER.y + 6, REGISTER.y + REGISTER.d - 6, 13, 3.2, (u, v) => [end, u, v]), { tone: 'lo' }));
  out.push(D([at([end, REGISTER.y + 9, 13]), at([end, REGISTER.y + 15, 13])], { size: 0.5, tone: 'mid' }));
  out.push(D([at([44, face, 18.5]), at([REGISTER.x + REGISTER.w - 4, face, 18.5]), at([44, face, 5]), at([REGISTER.x + REGISTER.w - 4, face, 5])], { size: 0.45 }));
  out.push(D(k.corners(REGISTER, 4).map(([px, py]) => at([px, py, REG_TOP])), { size: 0.45 }));
  return out.join('');
}

function registerTop() {
  const out: string[] = [];
  for (const [x, y] of REG_TERMINALS) out.push(bindingPost(x, y, REG_TOP));
  out.push(S(cyl(108, REGISTER.y + 6, 3.4, REG_TOP, 1.2, 28), { tone: 'lo' }));
  out.push(S(cyl(108, REGISTER.y + 6, 2.8, REG_TOP + 1.2, 4.4, 28, 0.3), { tone: 'mid', inner: L(k.knurl(108, REGISTER.y + 6, 2.8, REG_TOP + 1.2, REG_TOP + 5.6, 26, P), { tone: 'lo' }) }));
  out.push(L(k.lineOnTop([106.4, REGISTER.y + 6], [109.6, REGISTER.y + 6], REG_TOP + 5.6, P), { tone: 'lo' }));
  out.push(S(slab(POST_BACK, REG_TOP, POST_TOP - REG_TOP, 2, 0.4), { tone: 'mid' }));
  out.push(S(cyl(SPRING_AT[0], SPRING_AT[1], 3.2, REG_TOP, SPRING_SEAT, 24, 0.3), { tone: 'mid', inner: L(k.ring(SPRING_AT[0], SPRING_AT[1], 2.2, REG_TOP + SPRING_SEAT, P, 24), { tone: 'lo' }) }));
  out.push(S(slab({ x: 52, y: LIVE_Y - 6.5, w: 32, d: 13, r: 1.2 }, REG_TOP, 1.4, 3, 0.4), { tone: 'mid' }));
  for (const [x, y] of COILS) {
    const z0 = REG_TOP + 1.4;
    const windings = Array.from({ length: 10 }, (_, i) => k.sideArc(x, y, 4.6, z0 + 1.8 + i * 0.95, P, 20)).join('');
    out.push(S(cyl(x, y, 5.8, z0, 1, 32), { tone: 'mid' }));
    out.push(S(cyl(x, y, 4.6, z0 + 1, 10.4, 32), { tone: 'hi', crease: 'none', inner: L(windings, { tone: 'lo' }) }));
    out.push(S(cyl(x, y, 5.8, z0 + 11.4, 1, 32, 0.3), { tone: 'mid' }));
    out.push(S(cyl(x, y, 2.4, COIL_TOP - 0.4 - 0.2, 0.6, 20), { tone: 'mid', crease: 'none' }));
  }
  return out.join('');
}

function registerFront() {
  return (
    S(slab(POST_FRONT, REG_TOP, POST_TOP - REG_TOP, 2, 0.4), { tone: 'mid' }) +
    D([at([PIVOT_X, POST_FRONT.y + POST_FRONT.d, ARM_Z + 1.5])], { size: 0.6, tone: 'hi' }) +
    L(k.ring(PIVOT_X, POST_FRONT.y + 1.7, 1.2, POST_TOP, P, 14), { tone: 'lo' })
  );
}

/* Tape marks drawn flat on each tape face, in face units (u = world x, v = minus world z). */
const hash = (n: number) => {
  let h = Math.imul(n ^ 0x9e3779b9, 0x85ebca6b);
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};

const f2 = (n: number) => Math.round(n * 100) / 100;

function messageMarks(u: number, index: number, v: number) {
  const parts: string[] = [];
  const count = 1 + Math.floor(hash(index % PAGE_SIZE) * 3);
  let at0 = u - 1.4;
  for (let i = 0; i < count; i++) {
    const long = hash((index % PAGE_SIZE) * 7 + i) > 0.5;
    const len = long ? 1.1 : 0.45;
    if (at0 + len > u + 1.4) break;
    parts.push(`M${f2(at0)} ${f2(v - 0.45)}h${f2(len)}v0.9h${f2(-len)}Z`);
    at0 += len + 0.35;
  }
  return parts.join('');
}

function tapeMarks(from: number, to: number, z: number, anchor: number) {
  const v = -(z + TAPE_H / 2);
  let marks = '';
  const first = Math.floor((from - anchor) / SPACING);
  const last = Math.ceil((to - anchor) / SPACING);
  for (let i = first; i <= last; i++) {
    const index = ((-i % PAGE_SIZE) + PAGE_SIZE) % PAGE_SIZE;
    marks += messageMarks(anchor + i * SPACING, index, v);
  }
  return marks;
}

export const HIST_ANCHOR = GATE_X - SPACING / 2;
export const LIVE_ANCHOR = PRINT_X - 2.4;

function wires() {
  const capTop = (z: number) => z + 4.8;
  const [ix, iy] = INSULATOR;
  const ends: [Point3, Point3][] = [
    [[ix, iy, INSULATOR_TOP], [POSTS[0]![0], POSTS[0]![1], capTop(TERMINAL_TOP)]],
    [[POSTS[0]![0], POSTS[0]![1], capTop(TERMINAL_TOP)], [REG_TERMINALS[0]![0], REG_TERMINALS[0]![1], capTop(REG_TOP)]],
    [[POSTS[1]![0], POSTS[1]![1], capTop(TERMINAL_TOP)], [REG_TERMINALS[1]![0], REG_TERMINALS[1]![1], capTop(REG_TOP)]],
  ];
  return ends.map(([a, b]) => `<g class="mc-line">${k.wireSvg(at(a), at(b), { tone: 'mid', size: 0.9 })}</g>`).join('');
}

export interface MurmurArt {
  wires: string;
  base: string;
  insulator: string;
  histBack: string;
  histMarks: string;
  histClip: [number, number, number, number];
  histTape: string;
  histFront: string;
  archiveLower: string;
  archiveUpper: string;
  middle: string;
  spoolLower: string;
  liveBack: string;
  liveMarks: string;
  liveClip: [number, number, number, number];
  liveFront: string;
  spoolUpper: string;
  registerBox: string;
  registerTop: string;
  registerFront: string;
}

export function murmurArt(): MurmurArt {
  return {
    wires: wires(),
    base: base(),
    insulator: insulator(),
    histBack: histBack(),
    histMarks: tapeMarks(HIST_VISIBLE_FROM - PAGE_LEN, HIST_TO + PAGE_LEN, HIST_Z, HIST_ANCHOR),
    histClip: [HIST_VISIBLE_FROM, -(HIST_Z + TAPE_H), HIST_TO - HIST_VISIBLE_FROM, TAPE_H],
    histTape: tapeSlab(HIST_VISIBLE_FROM, HIST_TO, HIST_Y, HIST_Z),
    histFront: histFront(),
    archiveLower: archiveLower(),
    archiveUpper: archiveUpper(),
    middle: middle(),
    spoolLower: spoolLower(),
    liveBack: liveBack(),
    liveMarks: tapeMarks(LIVE_VISIBLE_FROM - PAGE_LEN, PRINT_X + PAGE_LEN, LIVE_Z, LIVE_ANCHOR),
    liveClip: [LIVE_VISIBLE_FROM, -(LIVE_Z + TAPE_H), PRINT_X - LIVE_VISIBLE_FROM, TAPE_H],
    liveFront: liveFront(),
    spoolUpper: spoolUpper(),
    registerBox: registerBox(),
    registerTop: registerTop(),
    registerFront: registerFront(),
  };
}

export const FIGURE_LABEL = `A telegraph receiving desk. At the back a register with an electromagnet and a long armature embosses each live message onto a paper tape that runs left onto the upper deck of a shared take up spool. In front a crank turns an archive reel whose tape carries older messages in marked pages of ${PAGE_SIZE}, past an index gate and a page counter, onto the lower deck of the same spool.`;

export { HIST_FROM, LIVE_FROM };
