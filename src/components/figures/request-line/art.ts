import * as k from '@/components/iso/iso-kit';
import type { Plan, Point3 } from '@/components/iso/iso-kit';
import { SLOTS } from './model';
import {
  BUFFER,
  CABINET_FRONT,
  CAP_TOP,
  CAP_Z,
  CARRIER_HANG,
  COUNTER_TOP,
  CUP_H,
  CUP_R,
  DESK_TOP,
  FOOT_H,
  HUB,
  P,
  PLATE,
  PLATE_H,
  POSTS,
  POST_R,
  POST_TOP,
  RACK_FRONT,
  RACK_Z,
  RING_R,
  WIRE,
  at,
  byDepth,
  depth,
} from './view';

const S = k.solidSvg;
const L = k.lineSvg;
const D = k.dotsSvg;
const flat = (points: Point3[]) => points.map(at);
const closed = (points: Point3[]) => k.pathOf(flat(points), true);

/** A closed rectangle in the vertical plane y = const. */
const rectOnY = (y: number, x0: number, x1: number, z0: number, z1: number) =>
  closed([
    [x0, y, z0],
    [x1, y, z0],
    [x1, y, z1],
    [x0, y, z1],
  ]);

/** A closed rectangle in the vertical plane x = const. */
const rectOnX = (x: number, y0: number, y1: number, z0: number, z1: number) =>
  closed([
    [x, y0, z0],
    [x, y1, z0],
    [x, y1, z1],
    [x, y0, z1],
  ]);

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
  return closed(points);
}

const halo = (plan: Plan, z = 0, h = 6) => `<path class="iso-halo" d="${k.haloOf(plan, z, h, P)}"/>`;

function screws(plan: Plan, inset: number, z: number) {
  const points = k.corners(plan, inset);
  return L(points.map(([x, y]) => k.ring(x, y, 1.8, z, P, 14)).join(''), { tone: 'lo' }) + D(points.map(([x, y]) => at([x, y, z])), { size: 0.45 });
}

function post([x, y]: [number, number], from: number, to: number) {
  return (
    S(k.cylinder(x, y, 6, from, 4, P, 28, 0.6), { tone: 'mid' }) +
    D(
      [0, 1, 2, 3].map((i) => {
        const a = Math.PI / 4 + (i * Math.PI) / 2;
        return at([x + 4.4 * Math.cos(a), y + 4.4 * Math.sin(a), from + 4]);
      }),
      { size: 0.4 },
    ) +
    S(k.cylinder(x, y, POST_R, from + 4, to - from - 4, P, 20), {
      tone: 'mid',
      crease: 'none',
      inner: L(k.sideArc(x, y, POST_R, from + 4 + (to - from - 4) * 0.5, P, 14), { tone: 'faint' }),
    })
  );
}

const cap = ([x, y]: [number, number]) => S(k.cylinder(x, y, 4.4, POST_TOP, 3, P, 24, 0.5), { tone: 'mid' }) + D([at([x, y, POST_TOP + 3])], { size: 0.5 });

function base() {
  const out = [`<path class="iso-halo" d="${k.haloOf(PLATE, -PLATE_H - FOOT_H, PLATE_H, P)}"/>`];
  for (const [x, y] of byDepth(k.corners(PLATE, 24))) {
    out.push(S(k.cylinder(x, y, 8, -PLATE_H - FOOT_H, 1.6, P, 28), { tone: 'lo' }));
    out.push(S(k.cylinder(x, y, 6.2, -PLATE_H - FOOT_H + 1.6, FOOT_H - 1.6, P, 28), { tone: 'mid' }));
  }
  out.push(S(k.slabOf(PLATE, -PLATE_H, PLATE_H, P, 8, 1.6), { tone: 'mid', inner: L(k.sideSeam(PLATE, -PLATE_H + 4, P, 8), { tone: 'faint' }) }));
  out.push(L(k.planOutline(k.insetPlan(PLATE, 6), 0, P), { tone: 'lo' }));
  const floor = { x0: PLATE.x + 16, x1: PLATE.x + PLATE.w - 16, y0: PLATE.y + 16, y1: PLATE.y + PLATE.d - 26 };
  const tiles: string[] = [k.pathOf(flat([[floor.x0, floor.y0, 0], [floor.x1, floor.y0, 0], [floor.x1, floor.y1, 0], [floor.x0, floor.y1, 0]]), true)];
  for (let x = floor.x0 + 30; x < floor.x1 - 8; x += 30) tiles.push(k.lineOnTop([x, floor.y0], [x, floor.y1], 0, P));
  for (let y = floor.y0 + 30; y < floor.y1 - 8; y += 30) tiles.push(k.lineOnTop([floor.x0, y], [floor.x1, y], 0, P));
  out.push(L(tiles.join(''), { tone: 'faint' }));
  out.push(screws(PLATE, 12, 0));

  const strip: Plan = { x: PLATE.x + 24, y: PLATE.y + PLATE.d - 15, w: 290, d: 7, r: 1 };
  out.push(S(k.slabOf(strip, 0, 0.6, P, 3), { tone: 'lo', crease: 'none' }));
  const ticks = k.topTicks(strip.x + 4, strip.x + strip.w - 4, 5, 5, strip.y + 0.8, 0.6, [2, 3.8], P);
  out.push(L(ticks.minor, { tone: 'lo' }), L(ticks.major, { tone: 'mid' }));

  const label: Plan = { x: 92, y: PLATE.y + PLATE.d - 17, w: 64, d: 10, r: 1.2 };
  out.push(S(k.slabOf(label, 0, 0.8, P, 3), { tone: 'mid', crease: 'none' }));
  out.push(L(k.planOutline(k.insetPlan(label, 1.4), 0.8, P), { tone: 'faint' }));
  for (const [from, to, y] of [
    [9, 46, 3],
    [9, 34, 5],
    [9, 40, 7],
  ] as const) {
    out.push(L(k.lineOnTop([label.x + from, label.y + y], [label.x + to, label.y + y], 0.8, P), { tone: 'lo', free: true }));
  }
  out.push(D([at([label.x + 4.5, label.y + 5, 0.8]), at([label.x + label.w - 4.5, label.y + 5, 0.8])], { size: 0.4 }));
  return out.join('');
}

const COUNTER_BODY: Plan = { x: -218, y: -22, w: 96, d: 64, r: 3 };
const COUNTER_LID: Plan = { x: -222, y: -26, w: 104, d: 72, r: 4 };

function counter() {
  const out: string[] = [halo(COUNTER_LID)];
  const front = COUNTER_BODY.y + COUNTER_BODY.d;
  out.push(S(k.slabOf({ x: -212, y: -16, w: 84, d: 52, r: 2 }, 0, 6, P, 4), { tone: 'lo' }));
  out.push(
    S(k.slabOf(COUNTER_BODY, 6, 40, P, 6, 0.6), {
      tone: 'mid',
      inner: L([-186, -154].map((x) => k.segment([x, front, 6], [x, front, 46], P)).join(''), { tone: 'faint' }),
    }),
  );
  for (const x of [-202, -170, -138]) {
    out.push(L(stadium(x - 7, x + 7, 34, 1.6, (u, v) => [u, front, v]), { tone: 'lo' }));
  }
  out.push(S(k.slabOf(COUNTER_LID, 46, COUNTER_TOP - 46, P, 8, 1), { tone: 'mid' }));
  out.push(L(k.planOutline(k.insetPlan(COUNTER_LID, 5), COUNTER_TOP, P), { tone: 'faint' }));
  out.push(screws(COUNTER_LID, 9, COUNTER_TOP));
  out.push(monitor());
  out.push(post(POSTS.counter, COUNTER_TOP, POST_TOP), cap(POSTS.counter));
  out.push(pullCord());
  return out.join('');
}

const SCREEN_Y = -2;
const SCREEN = { x0: -168, x1: -134, z0: 64, z1: 86 };

function monitor() {
  const out: string[] = [];
  out.push(S(k.slabOf({ x: -162, y: -13, w: 22, d: 12, r: 2 }, COUNTER_TOP, 2, P, 4, 0.4), { tone: 'lo' }));
  out.push(S(k.slabOf({ x: -154, y: -9, w: 6, d: 4, r: 1 }, COUNTER_TOP + 2, 8, P, 3), { tone: 'mid', crease: 'none' }));
  const body: Plan = { x: -172, y: -10, w: 42, d: 8, r: 1.5 };
  out.push(S(k.slabOf(body, 61, 28, P, 4, 0.6), { tone: 'mid' }));
  const { x0, x1, z0, z1 } = SCREEN;
  out.push(`<path class="iso-shade" data-shade="0" d="${rectOnY(SCREEN_Y, x0, x1, z0, z1)}"/>`);
  out.push(L(rectOnY(SCREEN_Y, x0, x1, z0, z1), { tone: 'lo' }));
  const bars = [
    [x0 + 4, x0 + 20, z1 - 5],
    [x0 + 4, x1 - 6, z1 - 10],
    [x0 + 4, x1 - 12, z1 - 14],
    [x0 + 4, x0 + 16, z1 - 18],
  ] as const;
  out.push(
    `<g class="rl-page">${bars.map(([a, b, z]) => L(k.segment([a, SCREEN_Y, z], [b, SCREEN_Y, z], P), { tone: 'faint', free: true })).join('')}</g>`,
  );
  out.push(D([at([x1 + 2.2, SCREEN_Y, z0 + 2])], { size: 0.5, tone: 'hi' }));
  return out.join('');
}

function pullCord() {
  const [x, y] = POSTS.counter;
  const clamp: Plan = { x: x - 4.5, y: y - 4.5, w: 9, d: 9, r: 1.5 };
  const edge = y + 4.5;
  return (
    S(k.slabOf(clamp, 118, 8, P, 3, 0.4), { tone: 'mid' }) +
    D([at([x + 4.5, y, 122])], { size: 0.45 }) +
    L(k.segment([x, edge, 118], [x, edge, 88], P), { tone: 'mid' }) +
    S(k.cylinder(x, edge, 2.6, 80, 8, P, 20, 0.4), { tone: 'mid', inner: L(k.knurl(x, edge, 2.6, 80, 88, 16, P), { tone: 'lo' }) })
  );
}

const DESK_BODY: Plan = { x: -42, y: -16, w: 84, d: 52, r: 3 };
const DESK_LID: Plan = { x: -46, y: -20, w: 92, d: 60, r: 4 };

function desk() {
  const out: string[] = [halo(DESK_LID)];
  const front = DESK_BODY.y + DESK_BODY.d;
  const side = DESK_BODY.x + DESK_BODY.w;
  out.push(S(k.slabOf({ x: -36, y: -10, w: 72, d: 40, r: 2 }, 0, 6, P, 4), { tone: 'lo' }));
  out.push(S(k.slabOf(DESK_BODY, 6, 40, P, 6, 0.6), { tone: 'mid' }));
  for (const z of [18, 25, 32]) out.push(L(stadium(-6, 26, z, 1.4, (u, v) => [side, u, v]), { tone: 'lo' }));
  for (const x0 of [-37, 3]) {
    const plan: Plan = { x: x0, y: front, w: 34, d: 1.6, r: 0.6 };
    out.push(S(k.slabOf(plan, 12, 28, P, 3, 0.3), { tone: 'mid' }));
    const face = front + 1.6;
    out.push(L(rectOnY(face, x0 + 11, x0 + 23, 18, 24), { tone: 'lo' }));
    out.push(L(k.segment([x0 + 13, face, 21], [x0 + 20, face, 21], P), { tone: 'faint', free: true }));
    out.push(S(k.slabOf({ x: x0 + 13, y: face, w: 8, d: 1.6, r: 0.6 }, 30, 2.4, P, 3), { tone: 'hi', crease: 'none' }));
    out.push(D([at([x0 + 9.5, face, 21]), at([x0 + 24.5, face, 21])], { size: 0.4 }));
  }
  out.push(S(k.slabOf(DESK_LID, 46, DESK_TOP - 46, P, 8, 1), { tone: 'mid' }));
  out.push(screws(DESK_LID, 8, DESK_TOP));

  const ledger: Plan = { x: -38, y: 16, w: 26, d: 18, r: 1 };
  out.push(S(k.slabOf(ledger, DESK_TOP, 0.8, P, 3), { tone: 'mid', crease: 'none' }));
  out.push(L(k.planOutline(k.insetPlan(ledger, 1.4), DESK_TOP + 0.8, P, 3), { tone: 'faint' }));
  for (const [y, to] of [
    [5, 20],
    [8, 16],
    [11, 21],
    [14, 13],
  ] as const) {
    out.push(L(k.lineOnTop([ledger.x + 4, ledger.y + y], [ledger.x + to, ledger.y + y], DESK_TOP + 0.8, P), { tone: 'lo', free: true }));
  }
  const tray: Plan = { x: 14, y: 16, w: 24, d: 18, r: 1.5 };
  out.push(S(k.slabOf(tray, DESK_TOP, 4, P, 4, 0.4), { tone: 'mid' }));
  out.push(`<path class="iso-shade" data-shade="1" d="${closed(k.ringOf(k.insetPlan(tray, 2), 4).map(([x, y]) => [x, y, DESK_TOP + 4] as Point3))}"/>`);
  out.push(L(k.planOutline(k.insetPlan(tray, 2), DESK_TOP + 4, P, 4), { tone: 'lo' }));
  out.push(S(k.cylinder(HUB[0], HUB[1], 7, DESK_TOP, 4, P, 28, 0.6), { tone: 'mid' }));
  out.push(L(k.ring(HUB[0], HUB[1], 5.2, DESK_TOP + 4, P, 24), { tone: 'faint' }));
  return out.join('');
}

const RACK_STAND: Plan = { x: -48, y: -140, w: 96, d: 30, r: 1.5 };
const RACK_BODY: Plan = { x: -52, y: -144, w: 104, d: 38, r: 2 };
const RACK_LID: Plan = { x: -54, y: -146, w: 108, d: 42, r: 2.5 };
export const RACK_LID_TOP = 117;
const HOLE_DEPTH = 16;
export const HOLES = [0, 1].flatMap((row) =>
  [-32, 0, 32].map((cx) => {
    const z0 = row === 0 ? 80 : 46;
    return { cx, x0: cx - 13, x1: cx + 13, z0, z1: z0 + 24 };
  }),
);

function rack() {
  const out: string[] = [halo(RACK_LID)];
  const legs = byDepth(k.corners(RACK_STAND, 5));
  for (const [x, y] of legs) {
    out.push(S(k.cylinder(x, y, 4.6, 0, 2, P, 24), { tone: 'lo' }));
    out.push(S(k.cylinder(x, y, 2.6, 2, 12, P, 18), { tone: 'mid', crease: 'none' }));
  }
  out.push(S(k.slabOf(RACK_STAND, 14, 3, P, 3, 0.4), { tone: 'lo' }));
  for (const [x, y] of legs) out.push(S(k.cylinder(x, y, 2.6, 17, RACK_Z - 17, P, 18), { tone: 'mid', crease: 'none' }));
  out.push(
    S(k.slabOf(RACK_BODY, RACK_Z, RACK_LID_TOP - 3 - RACK_Z, P, 6, 0.6), {
      tone: 'mid',
      inner: L(k.sideSeam(RACK_BODY, 76, P, 6), { tone: 'faint' }),
    }),
  );
  out.push(S(k.slabOf(RACK_LID, RACK_LID_TOP - 3, 3, P, 6, 0.6), { tone: 'mid' }));
  out.push(screws(RACK_LID, 6, RACK_LID_TOP));
  out.push(post(POSTS.rack, RACK_LID_TOP, POST_TOP), cap(POSTS.rack));
  return out.join('');
}

/** Each pigeonhole: its inner walls, a card clipped to the opening, the rim and the slot's lamp. */
function holes() {
  const y = RACK_FRONT;
  const back = y - HOLE_DEPTH;
  return HOLES.map(({ cx, x0, x1, z0, z1 }, slot) => {
    const opening = rectOnY(y, x0, x1, z0, z1);
    const walls = [
      `<path class="iso-shade" data-shade="0" d="${rectOnY(back, x0, x1, z0, z1)}"/>`,
      `<path class="iso-shade" data-shade="2" d="${rectOnX(x0, back, y, z0, z1)}"/>`,
      `<path class="iso-top" d="${closed([
        [x0, y, z0],
        [x1, y, z0],
        [x1, back, z0],
        [x0, back, z0],
      ])}"/>`,
      L(k.segment([x0, back, z0], [x1, back, z0], P) + k.segment([x0, back, z0], [x0, back, z1], P), { tone: 'faint' }),
    ].join('');
    const cardY = y - 6;
    const card = S(k.slabOf({ x: cx - 12, y: cardY, w: 14, d: 1.6, r: 0.4 }, z0, 18, P, 2, 0.3), {
      tone: 'hi',
      inner: L(
        k.segment([cx - 9, cardY + 1.6, z0 + 14], [cx - 1, cardY + 1.6, z0 + 14], P) + k.segment([cx - 9, cardY + 1.6, z0 + 11], [cx - 4, cardY + 1.6, z0 + 11], P),
        { tone: 'lo', free: true },
      ),
    });
    const lamp = [x1 - 4, y, z1 + 4.5] as Point3;
    return (
      `<g data-slot="${slot}"><clipPath id="rl-hole-${slot}"><path d="${opening}"/></clipPath>` +
      `<g clip-path="url(#rl-hole-${slot})">${walls}<g class="rl-card">${card}</g></g>` +
      L(opening, { tone: 'lo' }) +
      L(k.sideRing(lamp, 1.7, 'y', P, 16), { tone: 'lo' }) +
      `<circle class="rl-lamp" cx="${at(lamp)[0].toFixed(1)}" cy="${at(lamp)[1].toFixed(1)}" r="${(P.scale * 1).toFixed(2)}"/>` +
      `</g>`
    );
  }).join('');
}

const CABINET_BODY: Plan = { x: 125, y: -10, w: 60, d: 64, r: 2 };
const CABINET_LID: Plan = { x: 123, y: -12, w: 64, d: 68, r: 3 };
export const DRAWERS = [66, 38, 10].map((z0) => ({ z0, h: 26 }));
export const DRAWER_PLAN: Plan = { x: 129, y: CABINET_FRONT, w: 52, d: 2, r: 1 };

function cabinet() {
  const out: string[] = [halo(CABINET_LID)];
  const side = CABINET_BODY.x + CABINET_BODY.w;
  out.push(S(k.slabOf({ x: 129, y: -6, w: 52, d: 56, r: 2 }, 0, 6, P, 4), { tone: 'lo' }));
  out.push(S(k.slabOf(CABINET_BODY, 6, 90, P, 6, 0.6), { tone: 'mid' }));
  out.push(L(rectOnX(side, -2, 46, 18, 84), { tone: 'faint' }));
  out.push(D([at([side, 2, 22]), at([side, 42, 22]), at([side, 2, 80]), at([side, 42, 80])], { size: 0.45 }));
  out.push(S(k.slabOf(CABINET_LID, 96, 4, P, 6, 0.6), { tone: 'mid' }));
  out.push(screws(CABINET_LID, 6, 100));
  out.push(post(POSTS.cabinet, 100, POST_TOP), cap(POSTS.cabinet));
  return out.join('');
}

/** A drawer front at rest, pulled `out` units towards the viewer (the box behind it shows when it is). */
export function drawerSvg(index: number, out = 0) {
  const { z0, h } = DRAWERS[index]!;
  const plan = DRAWER_PLAN;
  const parts: string[] = [];
  if (out > 0.2) {
    parts.push(S(k.slabOf({ x: plan.x + 2, y: plan.y, w: plan.w - 4, d: out, r: 0.4 }, z0 + 2, h - 6, P, 2), { tone: 'mid', crease: 'none' }));
  }
  const y = plan.y + out;
  parts.push(S(k.slabOf({ ...plan, y }, z0, h, P, 3, 0.4), { tone: 'mid' }));
  const face = y + plan.d;
  parts.push(L(rectOnY(face, plan.x + 20, plan.x + 32, z0 + 5, z0 + 11), { tone: 'lo' }));
  parts.push(L(k.segment([plan.x + 22, face, z0 + 8], [plan.x + 29, face, z0 + 8], P), { tone: 'faint', free: true }));
  parts.push(D([at([plan.x + 18, face, z0 + 8]), at([plan.x + 34, face, z0 + 8])], { size: 0.4 }));
  parts.push(S(k.slabOf({ x: plan.x + 18, y: face, w: 16, d: 2, r: 0.8 }, z0 + 16, 3, P, 3, 0.3), { tone: 'hi', crease: 'none' }));
  return parts.join('');
}

function drawers() {
  return DRAWERS.map((_, index) => `<g data-drawer="${index}">${drawerSvg(index)}</g>`).join('');
}

const STOPS = (['counter', 'rack', 'cabinet'] as const).map((stop) => {
  const [px, py] = POSTS[stop];
  const axis: 'x' | 'y' = stop === 'rack' ? 'y' : 'x';
  const sign = stop === 'cabinet' ? -1 : 1;
  const along = axis === 'x' ? px : py;
  return { stop, px, py, axis, from: along + sign * POST_R, to: along + sign * BUFFER };
});

const HUB_ENTRY: Record<string, [number, number]> = {
  counter: [HUB[0] - RING_R, HUB[1]],
  rack: [HUB[0], HUB[1] - RING_R],
  cabinet: [HUB[0] + RING_R, HUB[1]],
};

function wires() {
  const backs: string[] = [];
  const fronts: string[] = [];
  const lines: string[] = [];
  const blocks: string[] = [];
  const hooks: [number, number][] = [];
  for (const { stop, px, py, axis, from, to } of STOPS) {
    const centre: [number, number] = axis === 'x' ? [py, WIRE] : [px, WIRE];
    const end = to - Math.sign(to - from) * 3;
    const spring = k.coil(from, end, centre, 2.4, 5, axis, P, 14);
    backs.push(spring.back);
    fronts.push(spring.front);
    const hook = (along: number): Point3 => (axis === 'x' ? [along, py + 2.4, WIRE] : [px + 2.4, along, WIRE]);
    hooks.push(at(hook(from)), at(hook(end)));
    const start: Point3 = axis === 'x' ? [from, py, WIRE] : [px, from, WIRE];
    const [hx, hy] = HUB_ENTRY[stop]!;
    lines.push(k.wireSvg(at(start), at([hx, hy, WIRE]), { tone: 'mid', size: 0.9 }));
    const block: Plan =
      axis === 'x' ? { x: Math.min(to, to - Math.sign(to - from) * 3), y: py - 3, w: 3, d: 6, r: 0.6 } : { x: px - 3, y: Math.min(to, to - 3), w: 6, d: 3, r: 0.6 };
    blocks.push(S(k.slabOf(block, WIRE - 3, 6, P, 2, 0.3), { tone: 'mid' }) + D([at([block.x + block.w / 2, block.y + block.d / 2, WIRE + 3])], { size: 0.4 }));
  }
  return L(backs.join(''), { tone: 'lo' }) + `<g class="rl-wire">${lines.join('')}</g>` + blocks.join('') + L(fronts.join(''), { tone: 'mid' }) + D(hooks, { size: 0.45 });
}

/** The hub's ring rail and its spokes, split into the halves behind and in front of the Go post. */
function ring(near: boolean) {
  const [vx, vy] = k.towardViewer(P);
  const facing = Math.atan2(vy, vx);
  const half: Point3[] = [];
  const steps = 48;
  for (let i = 0; i <= steps; i++) {
    const a = facing + (near ? -Math.PI / 2 : Math.PI / 2) + (i / steps) * Math.PI;
    half.push([HUB[0] + RING_R * Math.cos(a), HUB[1] + RING_R * Math.sin(a), WIRE]);
  }
  const angles = [45, 135, 225, 315].map((deg) => (deg * Math.PI) / 180).filter((a) => Math.cos(a) * vx + Math.sin(a) * vy > 0 === near);
  const spoke = (a: number, r: number): Point3 => [HUB[0] + r * Math.cos(a), HUB[1] + r * Math.sin(a), WIRE];
  const spokes = angles.map((a) => k.segment(spoke(a, 5), spoke(a, RING_R), P)).join('');
  return L(spokes, { tone: 'mid' }) + D(angles.map((a) => at(spoke(a, 5))), { size: 0.4 }) + `<path class="iso-line rl-rail" data-tone="hi" d="${k.pathOf(flat(half))}"/>`;
}

function goPost() {
  return (
    S(k.cylinder(HUB[0], HUB[1], POST_R, DESK_TOP + 4, CAP_Z - DESK_TOP - 4, P, 20), {
      tone: 'mid',
      crease: 'none',
      inner: L(k.sideArc(HUB[0], HUB[1], POST_R, 110, P, 14), { tone: 'faint' }),
    }) +
    S(k.cylinder(HUB[0], HUB[1], 5, WIRE - 2, 4, P, 24, 0.4), { tone: 'mid' }) +
    S(k.cylinder(HUB[0], HUB[1], 7, CAP_Z, CAP_TOP - CAP_Z, P, 32, 0.5), { tone: 'mid' }) +
    (() => {
      const ticks = k.radialTicks(HUB[0], HUB[1], 6.4, 24, 6, CAP_TOP, [0.9, 1.8], P);
      return L(ticks.minor, { tone: 'lo' }) + L(ticks.major, { tone: 'mid' });
    })()
  );
}

/** The request carrier, built over the floor origin and moved along the wires. */
function carrier() {
  const lid = WIRE - CARRIER_HANG;
  const top = lid - 3;
  const bottom = top - CUP_H;
  return (
    S(k.cylinder(0, 0, 2, bottom - 2, 2, P, 16), { tone: 'mid', crease: 'none' }) +
    S(k.cylinder(0, 0, CUP_R, bottom, CUP_H, P, 36, 1), {
      tone: 'hi',
      lit: true,
      inner: L(k.sideArc(0, 0, CUP_R, bottom + CUP_H * 0.42, P, 24), { tone: 'lo' }),
    }) +
    S(k.cylinder(0, 0, CUP_R + 0.6, top, 3, P, 36, 0.5), { tone: 'hi', inner: L(k.knurl(0, 0, CUP_R + 0.6, top, lid, 30, P, 0.5), { tone: 'lo' }) }) +
    S(k.cylinder(0, 0, 1, lid, CARRIER_HANG - 2, P, 12), { tone: 'mid', crease: 'none' }) +
    S(k.cylinder(0, 0, 4, WIRE - 2, 5, P, 24, 0.5), { tone: 'mid' }) +
    D([at([0, 0, WIRE + 3])], { size: 0.5, tone: 'hi' })
  );
}

export const POST_DEPTH = depth(HUB, WIRE);

export interface RequestLineArt {
  base: string;
  far: string;
  holes: string;
  desk: string;
  cabinet: string;
  drawers: string;
  wires: string;
  ringBack: string;
  post: string;
  ringFront: string;
  carrier: string;
}

export function requestLineArt(): RequestLineArt {
  return {
    base: base(),
    far: counter() + rack(),
    holes: holes(),
    desk: desk(),
    cabinet: cabinet(),
    drawers: drawers(),
    wires: wires(),
    ringBack: ring(false),
    post: goPost(),
    ringFront: ring(true),
    carrier: carrier(),
  };
}

export const SLOT_COUNT = SLOTS;

export const FIGURE_LABEL =
  'A cash railway on a long bench. A carrier cup hangs from an overhead wire that runs from a shop counter with a small screen to a sorting desk, whose ring rail switches it onto a wire to a rack of six pigeonholes or a wire to a three drawer filing cabinet. A request rides to the rack first; if its card is there it rides straight back, otherwise it rides on to the cabinet, files a copy in the rack and then returns.';
