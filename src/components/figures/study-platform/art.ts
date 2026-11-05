import * as k from '@/components/iso/iso-kit';
import type { Plan, Point3 } from '@/components/iso/iso-kit';
import { fillet } from '@/components/iso/lathe.mjs';
import { tubePieces, tubeSvg } from '@/components/iso/tube.mjs';
import { BURST, MAX_FAILURES, RESET_TIMEOUT_S, SERVICES } from './model';
import {
  BASE,
  BASE_H,
  BODY_TOP,
  BREAKER_W,
  BREAKER_X0,
  CABLE_R,
  COMB_D,
  COMB_TOP,
  COMB_Y,
  COURSE,
  DIAL_FACE_R,
  DIAL_FROM,
  DIAL_H,
  DIAL_R,
  DIAL_SPAN,
  ENTRY_Z,
  FEED_GLAND,
  FEED_R,
  FOOT_H,
  GLAND_TOP,
  GLAND_Y,
  HANDLE,
  HANDLE_H,
  HANDLE_TRAVEL,
  IN_X,
  LIMITER_W,
  LIMITER_X0,
  MODULE_Y0,
  MODULE_Y1,
  MOUNT,
  MOUNT_H,
  MOUNT_TOP,
  OUT_X,
  P,
  RAIL_FLANGE_TOP,
  RAIL_TOP,
  RAIL_X0,
  RAIL_X1,
  RAISED_TOP,
  RAISED_Y,
  SCREW_Y,
  SLOT,
  STANDOFF_H,
  at,
  breakerCentre,
  dialCentre,
  NEEDLE,
  needleTip,
} from './view';

const S = k.solidSvg;
const L = k.lineSvg;
const D = k.dotsSvg;
const depth = ([x, y]: [number, number], z = 0) => k.depthOf([x, y, z], P);
const byDepth = <T extends [number, number]>(points: T[]) => [...points].sort((a, b) => depth(a) - depth(b));

/** A closed rounded slot drawn in the vertical plane y = face. */
function faceSlot(u0: number, u1: number, v: number, radius: number, face: number) {
  const points: Point3[] = [];
  const steps = 8;
  for (let i = 0; i <= steps; i++) {
    const a = Math.PI / 2 + (Math.PI * i) / steps;
    points.push([u0 + radius + radius * Math.cos(a), face, v + radius * Math.sin(a)]);
  }
  for (let i = 0; i <= steps; i++) {
    const a = -Math.PI / 2 + (Math.PI * i) / steps;
    points.push([u1 - radius + radius * Math.cos(a), face, v + radius * Math.sin(a)]);
  }
  return k.pathOf(points.map(at), true);
}

const voidOf = (d: string) => `<path class="sp-void" d="${d}"/>`;

/** A slotted screw head sitting in a shallow recess on a top face. */
function screw(x: number, y: number, z: number, radius = 2) {
  const c = Math.SQRT1_2 * radius;
  return L(k.ring(x, y, radius + 0.7, z, P, 24), { tone: 'faint' }) + L(k.ring(x, y, radius, z, P, 24) + k.lineOnTop([x - c, y - c], [x + c, y + c], z, P), { tone: 'lo' });
}

function base() {
  const out = [`<path class="iso-halo" d="${k.haloOf(BASE, -BASE_H - FOOT_H, BASE_H, P)}"/>`];
  for (const [x, y] of byDepth(k.corners(BASE, 22))) {
    out.push(S(k.cylinder(x, y, 7, -BASE_H - FOOT_H, 1.6, P, 28), { tone: 'lo' }));
    out.push(S(k.cylinder(x, y, 5.4, -BASE_H - FOOT_H + 1.6, FOOT_H - 1.6, P, 28), { tone: 'mid' }));
  }
  out.push(S(k.slabOf(BASE, -BASE_H, BASE_H, P, 8, 1.6), { tone: 'mid' }));
  out.push(L(k.planOutline(k.insetPlan(BASE, 5), 0, P), { tone: 'lo' }));
  const screws = k.corners(BASE, 10);
  out.push(L(screws.map(([x, y]) => k.ring(x, y, 2.2, 0, P, 16)).join(''), { tone: 'lo' }));
  out.push(D(screws.map(([x, y]) => at([x, y, 0])), { size: 0.5 }));
  return out.join('');
}

function ledge() {
  const out: string[] = [];
  // Circuit schedule card: one rule line per branch.
  const card: Plan = { x: 28, y: BASE.y + BASE.d - 15, w: 70, d: 12, r: 1.2 };
  out.push(S(k.slabOf(card, 0, 0.8, P, 3), { tone: 'mid', crease: 'none' }));
  out.push(L(k.planOutline(k.insetPlan(card, 1.4), 0.8, P), { tone: 'faint' }));
  for (const [from, to, y] of [
    [8, 44, 3.2],
    [8, 36, 6],
    [8, 40, 8.8],
  ] as const) {
    out.push(L(k.lineOnTop([card.x + from, card.y + y], [card.x + to, card.y + y], 0.8, P), { tone: 'lo', free: true }));
  }
  out.push(D([at([card.x + 4, card.y + 6, 0.8]), at([card.x + card.w - 4, card.y + 6, 0.8])], { size: 0.4 }));
  return out.join('');
}

function mount() {
  const out: string[] = [];
  const posts = byDepth(k.corners(MOUNT, 9));
  for (const [x, y] of posts) out.push(S(k.cylinder(x, y, 4.5, 0, STANDOFF_H, P, 6), { tone: 'mid' }));
  out.push(S(k.slabOf(MOUNT, STANDOFF_H, MOUNT_H, P, 4, 0.6), { tone: 'mid' }));
  out.push(L(k.planOutline(k.insetPlan(MOUNT, 4), MOUNT_TOP, P, 4), { tone: 'faint' }));
  out.push(posts.map(([x, y]) => screw(x, y, MOUNT_TOP, 2.2)).join(''));
  return out.join('');
}

function rail() {
  const out: string[] = [];
  const flange: Plan = { x: RAIL_X0, y: -7.5, w: RAIL_X1 - RAIL_X0, d: 15, r: 0.8 };
  const hat: Plan = { x: RAIL_X0, y: -4.5, w: RAIL_X1 - RAIL_X0, d: 9, r: 0.6 };
  out.push(S(k.slabOf(flange, MOUNT_TOP, RAIL_FLANGE_TOP - MOUNT_TOP, P, 2), { tone: 'lo', crease: 'none' }));
  out.push(S(k.slabOf(hat, RAIL_FLANGE_TOP, RAIL_TOP - RAIL_FLANGE_TOP, P, 2, 0.4), { tone: 'mid' }));
  for (let x = RAIL_X0 + 4; x + 7 <= RAIL_X1; x += 12) {
    out.push(L(k.planOutline({ x, y: -2, w: 7, d: 4, r: 2 }, RAIL_TOP, P, 4), { tone: 'lo' }));
  }
  out.push(D([at([RAIL_X0 + 7.5, 0, RAIL_TOP]), at([RAIL_X1 - 8.5, 0, RAIL_TOP])], { size: 0.55 }));
  for (const x of [LIMITER_X0 - 5.5, BREAKER_X0[2] + BREAKER_W + 0.5]) {
    const stop: Plan = { x, y: -9, w: 5, d: 18, r: 1 };
    out.push(S(k.slabOf(stop, RAIL_TOP, 12, P, 3, 0.5), { tone: 'mid', inner: L(k.sideSeam(stop, RAIL_TOP + 3, P, 3), { tone: 'faint' }) }));
    out.push(screw(x + 2.5, 4.5, RAIL_TOP + 12, 1.4));
  }
  return out.join('');
}

/** The lower body and raised front of one DIN module, x0 to x0 + w. */
function moduleBody(x0: number, w: number) {
  const body: Plan = { x: x0, y: MODULE_Y0, w, d: MODULE_Y1 - MODULE_Y0, r: 1.4 };
  const raised: Plan = { x: x0 + 0.8, y: -RAISED_Y, w: w - 1.6, d: RAISED_Y * 2, r: 1.2 };
  const out: string[] = [];
  out.push(S(k.slabOf(body, RAIL_TOP, BODY_TOP - RAIL_TOP, P, 3, 0.5), { tone: 'hi', inner: L(k.sideSeam(body, BODY_TOP - 4, P, 3), { tone: 'faint' }) }));
  out.push(S(k.slabOf(raised, BODY_TOP, RAISED_TOP - BODY_TOP, P, 3, 0.6), { tone: 'hi', crease: 'lo' }));
  // The release clip at the foot of the front face.
  const mid = x0 + w / 2;
  const clip: Plan = { x: mid - 4, y: MODULE_Y1, w: 8, d: 1.6, r: 0.4 };
  out.push(S(k.slabOf(clip, RAIL_TOP, 3.2, P, 2), { tone: 'mid', crease: 'none' }));
  return out.join('');
}

function entry(x: number) {
  const d = faceSlot(x - 3.8, x + 3.8, ENTRY_Z, 2.9, MODULE_Y1);
  return voidOf(d) + L(d, { tone: 'lo' });
}

function dialTicks(cx: number, cy: number, radius: number, steps: number, every: number, z: number, short: number, long: number, tripTone: 'hi' | 'mid') {
  const minor: string[] = [];
  const major: string[] = [];
  let last = '';
  for (let i = 0; i <= steps; i++) {
    const a = DIAL_FROM + (i / steps) * DIAL_SPAN;
    const big = i % every === 0;
    const inner = radius - (big ? long : short);
    const line = k.lineOnTop([cx + Math.sin(a) * inner, cy - Math.cos(a) * inner], [cx + Math.sin(a) * radius, cy - Math.cos(a) * radius], z, P);
    if (i === steps) last = line;
    else (big ? major : minor).push(line);
  }
  return L(minor.join(''), { tone: 'lo' }) + L(major.join(''), { tone: 'mid' }) + L(last, { tone: tripTone });
}

function limiter() {
  const out = [moduleBody(LIMITER_X0, LIMITER_W)];
  out.push(screw(IN_X, -SCREW_Y - 3, BODY_TOP), screw(OUT_X, -SCREW_Y - 3, BODY_TOP));
  out.push(screw(IN_X, SCREW_Y, BODY_TOP), screw(OUT_X, SCREW_Y, BODY_TOP));
  out.push(entry(IN_X));

  // Token gauge: 0 to the burst of 200, needle resting full.
  const [cx, cy] = [LIMITER_X0 + 19, 0];
  const top = RAISED_TOP + DIAL_H;
  out.push(S(k.cylinder(cx, cy, 10.6, RAISED_TOP, DIAL_H, P, 56, 0.4), { tone: 'mid' }));
  out.push(L(k.ring(cx, cy, 9.4, top, P, 56), { tone: 'lo' }));
  out.push(dialTicks(cx, cy, 9.4, BURST / 10, 5, top, 1.3, 2.5, 'mid'));
  out.push(L(k.lineOnTop([cx, cy], needleTip(cx, cy, 7.4, 1), top, P), { tone: 'hi', className: 'sp-needle', free: 'end' }));
  out.push(D([at([cx, cy, top])], { size: 0.7, tone: 'mid' }));

  // Rate trimmer and a small rating window with two rule lines.
  const trim: [number, number] = [LIMITER_X0 + 44, -5.5];
  out.push(S(k.cylinder(trim[0], trim[1], 2.8, RAISED_TOP, 1.2, P, 24, 0.3), { tone: 'mid' }));
  out.push(L(k.lineOnTop([trim[0] - 2.8, trim[1]], [trim[0] + 2.8, trim[1]], RAISED_TOP + 1.2, P), { tone: 'lo' }));
  const window: Plan = { x: LIMITER_X0 + 36, y: 2.5, w: 14, d: 6.5, r: 1 };
  out.push(L(k.planOutline(window, RAISED_TOP, P, 3), { tone: 'lo' }));
  out.push(L(k.lineOnTop([window.x + 2.5, window.y + 2.2], [window.x + 10, window.y + 2.2], RAISED_TOP, P) + k.lineOnTop([window.x + 2.5, window.y + 4.4], [window.x + 7.5, window.y + 4.4], RAISED_TOP, P), { tone: 'faint', free: true }));
  return out.join('');
}

/** Attempt lamps on the raised front face of a breaker, one per retry attempt. */
export const lampCentre = (index: number, lamp: number): Point3 => [BREAKER_X0[index]! + 22 + lamp * 4, RAISED_Y, (BODY_TOP + RAISED_TOP) / 2];

function lamps(index: number, live: boolean) {
  const out: string[] = [];
  for (let lamp = 0; lamp < 3; lamp++) {
    const c = lampCentre(index, lamp);
    out.push(L(k.sideRing(c, 1.55, 'y', P, 20), { tone: 'faint' }));
    out.push(`<path class="sp-lamp"${live ? ` data-lamp="${lamp}"` : ''} d="${k.sideRing(c, 1.05, 'y', P, 16)}"/>`);
  }
  return out.join('');
}

/** The toggle handle, drawn at the slot centre; the live one is moved by transform, the others sit on. */
export function breakerHandle(index: number) {
  const x0 = BREAKER_X0[index]!;
  const lit = index === COURSE;
  const plan: Plan = { ...HANDLE, x: x0 + HANDLE.x, y: HANDLE.y - (lit ? 0 : HANDLE_TRAVEL) };
  const top = RAISED_TOP + HANDLE_H;
  return (
    S(k.slabOf(plan, RAISED_TOP, HANDLE_H, P, 3, 0.5), { tone: lit ? 'hi' : 'mid', lit, crease: lit ? 'lo' : 'faint' }) +
    L(k.lineOnTop([plan.x, plan.y + plan.d / 2], [plan.x + plan.w, plan.y + plan.d / 2], top, P), { tone: lit ? 'lo' : 'faint' })
  );
}

/** Everything of a breaker except its handle and, for the live one, its needle. */
function breakerBody(index: number) {
  const x0 = BREAKER_X0[index]!;
  const xc = breakerCentre(index);
  const live = index === COURSE;
  const out = [moduleBody(x0, BREAKER_W)];
  out.push(screw(xc, -SCREW_Y - 3, BODY_TOP), screw(xc, SCREW_Y, BODY_TOP));
  out.push(entry(xc));

  const slot: Plan = { ...SLOT, x: x0 + SLOT.x };
  const slotD = k.planOutline(slot, RAISED_TOP, P, 4);
  out.push(voidOf(slotD) + L(slotD, { tone: 'lo' }));
  out.push(D([at([slot.x + slot.w / 2, slot.y - 1.6, RAISED_TOP]), at([slot.x + slot.w / 2, slot.y + slot.d + 1.6, RAISED_TOP])], { size: 0.45, tone: 'mid' }));

  // Failure dial: 0 to the trip mark at 5.
  const [cx, cy] = dialCentre(index);
  const top = RAISED_TOP + DIAL_H;
  out.push(S(k.cylinder(cx, cy, DIAL_R, RAISED_TOP, DIAL_H, P, 48, 0.4), { tone: 'mid' }));
  out.push(L(k.ring(cx, cy, DIAL_FACE_R, top, P, 48), { tone: 'lo' }));
  out.push(dialTicks(cx, cy, DIAL_FACE_R, MAX_FAILURES, MAX_FAILURES, top, 1.4, 2.4, 'hi'));
  if (!live) {
    out.push(L(k.lineOnTop([cx, cy], needleTip(cx, cy, NEEDLE, 0), top, P), { tone: 'hi', className: 'sp-needle', free: 'end' }));
    out.push(D([at([cx, cy, top])], { size: 0.65, tone: 'mid' }));
  }
  out.push(lamps(index, live));
  return out.join('');
}

function comb() {
  const x0 = OUT_X - 3.5;
  const x1 = breakerCentre(2) + 3.5;
  const bar: Plan = { x: x0, y: COMB_Y, w: x1 - x0, d: COMB_D, r: 1 };
  const out: string[] = [];
  for (const x of [OUT_X, ...BREAKER_X0.map((_, index) => breakerCentre(index))]) {
    out.push(S(k.slabOf({ x: x - 1.3, y: SCREW_Y + 1.4, w: 2.6, d: COMB_Y - SCREW_Y - 1.2, r: 0.3 }, BODY_TOP, 1.4, P, 2), { tone: 'hi', crease: 'none' }));
  }
  out.push(S(k.slabOf(bar, BODY_TOP, COMB_TOP - BODY_TOP, P, 3, 0.4), { tone: 'mid', inner: L(k.sideSeam(bar, BODY_TOP + 1.2, P, 3), { tone: 'faint' }) }));
  for (const x of [x0 - 2.2, x1]) {
    out.push(S(k.slabOf({ x, y: COMB_Y - 0.6, w: 2.2, d: COMB_D + 1.2, r: 0.6 }, BODY_TOP, COMB_TOP - BODY_TOP + 0.6, P, 3), { tone: 'lo' }));
  }
  return out.join('');
}

function gland(x: number, y: number, size: number) {
  const top = GLAND_TOP;
  return (
    S(k.cylinder(x, y, size + 2.6, MOUNT_TOP, 1.2, P, 32), { tone: 'lo' }) +
    S(k.cylinder(x, y, size + 1.8, MOUNT_TOP + 1.2, 2.6, P, 6, 0.3), { tone: 'mid' }) +
    S(k.cylinder(x, y, size + 1, MOUNT_TOP + 3.8, top - MOUNT_TOP - 3.8, P, 32, 0.4), { tone: 'mid' })
  );
}

function cable(points: Point3[], radius: number) {
  const route = fillet(points, radius * 2.4) as Point3[];
  return tubePieces(route, radius, P, { maxLength: 400 })
    .map((piece) => tubeSvg(piece, { tone: 'mid' }))
    .join('');
}

function wiring() {
  const out: string[] = [];
  out.push(gland(FEED_GLAND[0], FEED_GLAND[1], FEED_R));
  out.push(
    cable(
      [
        [FEED_GLAND[0], FEED_GLAND[1], GLAND_TOP],
        [FEED_GLAND[0], FEED_GLAND[1], ENTRY_Z],
        [IN_X, FEED_GLAND[1], ENTRY_Z],
        [IN_X, MODULE_Y1, ENTRY_Z],
      ],
      FEED_R,
    ),
  );
  for (const index of [0, 1, 2]) {
    const x = breakerCentre(index);
    out.push(`<g data-branch="${SERVICES[index]!.name}">${gland(x, GLAND_Y, CABLE_R)}${cable([
      [x, MODULE_Y1, ENTRY_Z],
      [x, GLAND_Y, ENTRY_Z],
      [x, GLAND_Y, GLAND_TOP],
    ], CABLE_R)}</g>`);
  }
  return out.join('');
}

function glow() {
  const [cx, cy] = at([BREAKER_X0[COURSE]! + HANDLE.x + HANDLE.w / 2, 0, RAISED_TOP + 3]);
  const r = P.scale * 30;
  return `<defs><radialGradient id="sp-glow-g"><stop offset="0" class="fig-stop-0"/><stop offset=".4" class="fig-stop-1"/><stop offset="1" class="fig-stop-2"/></radialGradient></defs><ellipse class="fig-glow" cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" rx="${r.toFixed(1)}" ry="${(r * 0.62).toFixed(1)}" fill="url(#sp-glow-g)"/>`;
}

export interface StudyPlatformArt {
  base: string;
  limiter: string;
  auth: string;
  course: string;
  handle: string;
  hub: string;
  glow: string;
  progress: string;
  front: string;
}

export function studyPlatformArt(): StudyPlatformArt {
  return {
    base: base() + mount() + rail(),
    limiter: limiter(),
    auth: breakerBody(0) + breakerHandle(0),
    course: breakerBody(COURSE),
    handle: breakerHandle(COURSE),
    hub: D([at([dialCentre(COURSE)[0], dialCentre(COURSE)[1], RAISED_TOP + DIAL_H])], { size: 0.65, tone: 'mid' }),
    glow: glow(),
    progress: breakerBody(2) + breakerHandle(2),
    front: comb() + wiring() + ledge(),
  };
}

export const FIGURE_LABEL = `A small distribution panel on a bench, standing for the study platform's API gateway. A feed cable enters a limiter module whose gauge reads a full bucket of ${BURST} tokens. A comb busbar carries the feed to three breakers for the auth, course and progress services, each with a failure dial marked to ${MAX_FAILURES}, three attempt lamps and a cable leaving through its own gland. When the course service keeps failing, its breaker trips at ${MAX_FAILURES} failures and lets a trial call through after ${RESET_TIMEOUT_S} seconds.`;
