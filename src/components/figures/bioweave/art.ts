import * as k from '@/components/iso/iso-kit';
import type { Plan, Point3 } from '@/components/iso/iso-kit';
import * as G from '@/components/iso/lathe.mjs';
import {
  ARM_H,
  ARM_Z,
  BAR,
  BAR_H,
  BUD,
  budRadius,
  budSlope,
  CABLE_X,
  BUILD_COL,
  BUILD_COL_R,
  CUP_R,
  CUP_TOP,
  FOOT_H,
  GATE_H,
  GATE_PLAN,
  GATE_T,
  GATE_TOP,
  GATE_X,
  GATE_Z,
  INSPECT_RAIL,
  INSPECT_Y,
  LOUPE_R,
  LOUPE_REACH,
  LOUPE_Y,
  LUG_TOP,
  LUG_YS,
  MODEL_AT,
  NOZZLE_TIP,
  P,
  PLATE,
  PLATE_H,
  PLINTH_R,
  PLINTH_TOP,
  POST_BACK,
  POST_FRONT,
  POST_TOP,
  RAILS,
  RAIL_TOP,
  SLED,
  SLED_TOP,
  SLED_Z,
  STEM_R,
  STEM_TOP,
  TAG_BAR,
  TAG_BAR_TOP,
  TAG_FACE,
  TAG_HALF,
  TAG_HIGH,
  TAG_LOW,
  TAG_MID,
  TAG_PIN_R,
  TAG_T,
  TAG_XS,
  TAG_Y,
  TIP_FROM,
  TIP_R,
  TIP_TOP,
  TRAY,
  TRAY_FLOOR,
  TRAY_H,
  TRAY_WALL,
  at,
} from './view';

const S = k.solidSvg;
const L = k.lineSvg;
const D = k.dotsSvg;
const depth = ([x, y]: [number, number], z = 0) => k.depthOf([x, y, z], P);
const byDepth = <T extends [number, number]>(points: T[]) => [...points].sort((a, b) => depth(a) - depth(b));
const flat = (points: Point3[]) => points.map(at);

/** A closed slot (two half circles joined) in any plane: place(u, v) maps slot coordinates to world. */
function slot(u0: number, u1: number, v: number, radius: number, place: (u: number, v: number) => Point3) {
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

/** A closed rounded panel outline on a vertical face. */
function panel(u0: number, u1: number, v0: number, v1: number, radius: number, place: (u: number, v: number) => Point3) {
  const points: Point3[] = [];
  const corner = (cu: number, cv: number, from: number) => {
    for (let i = 0; i <= 4; i++) {
      const a = from + (Math.PI / 2) * (i / 4);
      points.push(place(cu + radius * Math.cos(a), cv + radius * Math.sin(a)));
    }
  };
  corner(u1 - radius, v1 - radius, 0);
  corner(u0 + radius, v1 - radius, Math.PI / 2);
  corner(u0 + radius, v0 + radius, Math.PI);
  corner(u1 - radius, v0 + radius, (3 * Math.PI) / 2);
  return k.pathOf(flat(points), true);
}

function base() {
  const out = [`<path class="iso-halo" d="${k.haloOf(PLATE, -PLATE_H - FOOT_H, PLATE_H, P)}"/>`];
  for (const [x, y] of byDepth(k.corners(PLATE, 22))) {
    out.push(S(k.cylinder(x, y, 7, -PLATE_H - FOOT_H, 1.6, P, 28), { tone: 'lo' }));
    out.push(S(k.cylinder(x, y, 5.4, -PLATE_H - FOOT_H + 1.6, FOOT_H - 1.6, P, 28), { tone: 'mid' }));
  }
  out.push(S(k.slabOf(PLATE, -PLATE_H, PLATE_H, P, 8, 1.6), { tone: 'mid', inner: L(k.sideSeam(PLATE, -PLATE_H + 3.2, P, 8), { tone: 'faint' }) }));
  out.push(L(k.planOutline(k.insetPlan(PLATE, 5), 0, P), { tone: 'lo' }));
  const screws = k.corners(PLATE, 10);
  out.push(L(screws.map(([x, y]) => k.ring(x, y, 2.2, 0, P, 16)).join(''), { tone: 'lo' }));
  out.push(D(screws.map(([x, y]) => at([x, y, 0])), { size: 0.5 }));

  // Ruler strip in front of the inspector rail: a major tick under every tag stop.
  const strip: Plan = { x: INSPECT_RAIL.x, y: INSPECT_RAIL.y + INSPECT_RAIL.d + 1.6, w: INSPECT_RAIL.w, d: 5.4, r: 1 };
  out.push(S(k.slabOf(strip, 0, 0.6, P, 3), { tone: 'lo', crease: 'none' }));
  const ticks = k.topTicks(strip.x + 2, strip.x + strip.w - 2, 3, 4, strip.y + 0.6, 0.6, [1.6, 3.2], P);
  out.push(L(ticks.minor, { tone: 'lo' }), L(ticks.major, { tone: 'mid' }));

  // Label plate at the front right, under the tray.
  const label: Plan = { x: 88, y: 39.5, w: 42, d: 9, r: 1.2 };
  out.push(S(k.slabOf(label, 0, 0.8, P, 3), { tone: 'mid', crease: 'none' }));
  out.push(L(k.planOutline(k.insetPlan(label, 1.4), 0.8, P), { tone: 'faint' }));
  for (const [from, to, y] of [
    [8, 30, 2.8],
    [8, 22, 4.6],
    [8, 26, 6.4],
  ] as const) {
    out.push(L(k.lineOnTop([label.x + from, label.y + y], [label.x + to, label.y + y], 0.8, P), { tone: 'lo', free: true }));
  }
  out.push(D([at([label.x + 4, label.y + 4.5, 0.8]), at([label.x + label.w - 4, label.y + 4.5, 0.8])], { size: 0.4 }));
  return out.join('');
}

/* Spec card in a slotted stand at the back: one row per model part, the same five rows the tags carry. */
function specCard() {
  const out: string[] = [];
  const stand: Plan = { x: -50, y: -43, w: 30, d: 6, r: 1.2 };
  const card: Plan = { x: -47, y: -40.4, w: 24, d: 0.8, r: 0.2 };
  const face = card.y + card.d;
  const top = 3 + 15;
  out.push(S(k.slabOf(stand, 0, 3, P, 3, 0.5), { tone: 'mid', inner: L(k.sideSeam(stand, 1.2, P, 3), { tone: 'faint' }) }));
  out.push(L(slot(card.x - 0.6, card.x + card.w + 0.6, card.y + card.d / 2, 0.9, (u, v) => [u, v, 3]), { tone: 'lo' }));
  out.push(S(k.slabOf(card, 3, top - 3, P, 2), { tone: 'hi', crease: 'none' }));
  for (let row = 0; row < TAG_XS.length; row++) {
    const z = top - 3 - row * 2.6;
    out.push(D([at([card.x + 2.4, face, z])], { size: 0.5, tone: 'hi' }));
    out.push(L(k.segment([card.x + 4.4, face, z], [card.x + 12 + (row % 3) * 2.4, face, z], P), { tone: 'lo', free: true }));
    out.push(L(k.segment([card.x + 16, face, z], [card.x + 21, face, z], P), { tone: 'faint', free: true }));
  }
  out.push(D([at([stand.x + 1.8, stand.y + stand.d, 2]), at([stand.x + stand.w - 1.8, stand.y + stand.d, 2])], { size: 0.4 }));
  return out.join('');
}

function rails() {
  const out: string[] = [];
  for (const rail of RAILS) {
    out.push(S(k.slabOf(rail, 0, RAIL_TOP, P, 3, 0.4), { tone: 'mid' }));
    const dots = [];
    for (let x = rail.x + 6; x < rail.x + rail.w - 2; x += 16) dots.push(at([x, rail.y + rail.d / 2, RAIL_TOP]));
    out.push(D(dots, { size: 0.4 }));
  }
  // End stop across both rails behind the bay.
  const stop: Plan = { x: RAILS[0]!.x - 5, y: RAILS[0]!.y - 3, w: 5, d: RAILS[1]!.y + RAILS[1]!.d - RAILS[0]!.y + 6, r: 1.2 };
  out.push(S(k.slabOf(stop, 0, 6, P, 3, 0.5), { tone: 'mid' }));
  out.push(D([at([stop.x + 2.5, stop.y + 3, 6]), at([stop.x + 2.5, stop.y + stop.d - 3, 6])], { size: 0.45 }));
  return out.join('');
}

/* Drafts tray: the floor and back wall sit behind the sled, the right and front walls in front of it. */
const TRAY_BACK: Plan = { x: TRAY.x, y: TRAY.y, w: TRAY.w, d: TRAY_WALL, r: 0.8 };
const TRAY_RIGHT: Plan = { x: TRAY.x + TRAY.w - TRAY_WALL, y: TRAY.y + TRAY_WALL, w: TRAY_WALL, d: TRAY.d - TRAY_WALL * 2, r: 0.6 };
const TRAY_FRONT: Plan = { x: TRAY.x, y: TRAY.y + TRAY.d - TRAY_WALL, w: TRAY.w, d: TRAY_WALL, r: 0.8 };

function trayBack() {
  const out: string[] = [];
  out.push(S(k.slabOf(TRAY, 0, TRAY_FLOOR, P, 4, 0.6), { tone: 'lo' }));
  for (const rail of RAILS) {
    const y = rail.y + rail.d / 2;
    out.push(L(k.lineOnTop([TRAY.x, y], [TRAY.x + TRAY.w - 0.6, y], TRAY_FLOOR, P), { tone: 'faint' }));
  }
  out.push(S(k.slabOf(TRAY_BACK, TRAY_FLOOR, TRAY_H - TRAY_FLOOR, P, 3, 0.4), { tone: 'mid' }));
  return out.join('');
}

function trayFront() {
  const out: string[] = [];
  out.push(S(k.slabOf(TRAY_RIGHT, TRAY_FLOOR, TRAY_H - TRAY_FLOOR, P, 3, 0.4), { tone: 'mid' }));
  out.push(S(k.slabOf(TRAY_FRONT, TRAY_FLOOR, TRAY_H - TRAY_FLOOR, P, 3, 0.4), { tone: 'mid' }));
  const face = TRAY_FRONT.y + TRAY_FRONT.d;
  const mid = TRAY.x + TRAY.w / 2;
  out.push(k.faceTextSvg(k.sideMatrix([mid, face], 5.6, P, 'left'), 'DRAFTS', { size: 4, tone: 'lo', anchor: 'middle' }));
  out.push(D([at([TRAY.x + 4, face, 7.5]), at([TRAY.x + TRAY.w - 4, face, 7.5])], { size: 0.45 }));
  out.push(D([at([TRAY.x + 4, TRAY_FRONT.y + 1.3, TRAY_H]), at([TRAY.x + TRAY.w - 4, TRAY_FRONT.y + 1.3, TRAY_H])], { size: 0.4 }));
  return out.join('');
}

/* Builder: column at the back, arm over the station, a head that slides down on a rod. */
const [BX, BY] = BUILD_COL;
const HEAD_AT: [number, number] = [BX, MODEL_AT[1]];
const GUIDE: Plan = { x: HEAD_AT[0] - 5, y: HEAD_AT[1] - 5, w: 10, d: 10, r: 1.5 };
const HEAD: Plan = { x: HEAD_AT[0] - 4.2, y: HEAD_AT[1] - 4.2, w: 8.4, d: 8.4, r: 1.4 };
const GUIDE_Z = ARM_Z - 4;
const HEAD_LOW = NOZZLE_TIP + 4;
/* The rod rides with the head; its top stays hidden inside the arm at both ends of the stroke. */
const ROD_LENGTH = ARM_Z + ARM_H - 1.4 - (HEAD_LOW + 9);

function builderBack() {
  const out: string[] = [];
  out.push(S(k.cylinder(BX, BY, 7.4, 0, 2, P, 32, 0.4), { tone: 'lo' }));
  out.push(D(byDepth([0, 1, 2, 3].map((i) => [BX + 5.4 * Math.cos(i * (Math.PI / 2) + 0.4), BY + 5.4 * Math.sin(i * (Math.PI / 2) + 0.4)] as [number, number])).map(([x, y]) => at([x, y, 2])), { size: 0.45 }));
  out.push(
    S(k.cylinder(BX, BY, BUILD_COL_R, 2, ARM_Z - 2, P, 32), {
      tone: 'mid',
      crease: 'none',
      inner: L(k.sideArc(BX, BY, BUILD_COL_R, 14, P, 24) + k.sideArc(BX, BY, BUILD_COL_R, 32, P, 24), { tone: 'faint' }),
    }),
  );
  out.push(S(k.cylinder(BX, BY, 5.8, ARM_Z - 7, 7, P, 32, 0.5), { tone: 'mid' }));
  out.push(L(k.knurl(BX, BY, 5.8, ARM_Z - 7, ARM_Z, 40, P), { tone: 'lo' }));
  return out.join('');
}

function builderRod() {
  return S(k.cylinder(HEAD_AT[0], HEAD_AT[1], 1.3, HEAD_LOW + 9, ROD_LENGTH, P, 20), { tone: 'mid', crease: 'none' });
}

function builderHead() {
  const out: string[] = [];
  out.push(S(k.cylinder(HEAD_AT[0], HEAD_AT[1], 1.2, NOZZLE_TIP, 2.4, P, 20), { tone: 'hi', crease: 'none' }));
  out.push(S(k.cylinder(HEAD_AT[0], HEAD_AT[1], 2.6, NOZZLE_TIP + 2.4, 1.6, P, 24, 0.3), { tone: 'mid' }));
  out.push(S(k.slabOf(HEAD, HEAD_LOW, 9, P, 3, 0.6), { tone: 'mid', inner: L(k.sideSeam(HEAD, HEAD_LOW + 3, P, 3), { tone: 'faint' }) }));
  out.push(D([at([HEAD.x + 1.8, HEAD.y + HEAD.d, HEAD_LOW + 6.4]), at([HEAD.x + HEAD.w - 1.8, HEAD.y + HEAD.d, HEAD_LOW + 6.4])], { size: 0.4 }));
  return out.join('');
}

function builderArm() {
  const out: string[] = [];
  const arm: Plan = { x: BX - 3.6, y: BY - 4.4, w: 7.2, d: HEAD_AT[1] - BY + 4.4, r: 1.4 };
  out.push(S(k.slabOf(GUIDE, GUIDE_Z, 4, P, 3, 0.4), { tone: 'mid' }));
  out.push(S(k.slabOf(arm, ARM_Z, ARM_H, P, 3, 0.6), { tone: 'mid', inner: L(k.sideSeam(arm, ARM_Z + 2, P, 3), { tone: 'faint' }) }));
  out.push(S(k.slabOf({ x: GUIDE.x, y: GUIDE.y, w: GUIDE.w, d: GUIDE.d, r: GUIDE.r }, ARM_Z, ARM_H, P, 3, 0.6), { tone: 'mid' }));
  out.push(D([at([GUIDE.x + 2, GUIDE.y + 2, ARM_Z + ARM_H]), at([GUIDE.x + GUIDE.w - 2, GUIDE.y + GUIDE.d - 2, ARM_Z + ARM_H]), at([BX, BY, ARM_Z + ARM_H])], { size: 0.45 }));
  // Knurled thumb knob that sets the head height.
  out.push(S(k.cylinder(BX, BY + 8, 2.8, ARM_Z + ARM_H, 3.4, P, 28, 0.4), { tone: 'mid' }));
  out.push(L(k.knurl(BX, BY + 8, 2.8, ARM_Z + ARM_H, ARM_Z + ARM_H + 3.4, 26, P), { tone: 'lo' }));
  out.push(L(k.lineOnTop([BX - 2.8, BY + 8], [BX + 2.8, BY + 8], ARM_Z + ARM_H + 3.4, P), { tone: 'hi' }));
  return out.join('');
}

/* Gate: two slotted posts, a crossbar with two sheaves, a lit plate hung on two cables. */

function post(plan: Plan) {
  const face = plan.x + plan.w;
  const mid = plan.y + plan.d / 2;
  return (
    S(k.slabOf(k.insetPlan(plan, -1.6), 0, 1.8, P, 3, 0.4), { tone: 'lo' }) +
    S(k.slabOf(plan, 1.8, POST_TOP - 1.8, P, 3, 0.5), { tone: 'mid' }) +
    L(slot(GATE_Z + 4, POST_TOP - 6, mid, 0.9, (u, v) => [face, v, u]), { tone: 'lo' }) +
    D([at([face, mid, 4.6]), at([face, mid, POST_TOP - 3])], { size: 0.4 })
  );
}

function gateBack() {
  return post(POST_BACK);
}

function gatePlate() {
  const face = GATE_PLAN.x + GATE_PLAN.w;
  const y0 = GATE_PLAN.y;
  const y1 = GATE_PLAN.y + GATE_PLAN.d;
  const out: string[] = [];
  out.push(
    S(k.slabOf(GATE_PLAN, GATE_Z, GATE_H, P, 3, 0.5), {
      tone: 'hi',
      lit: true,
      inner: L(panel(y0 + 3.4, y1 - 3.4, GATE_Z + 3.4, GATE_TOP - 3.4, 1.6, (u, v) => [face, u, v]), { tone: 'lit' }),
    }),
  );
  out.push(D([y0 + 1.7, y1 - 1.7].flatMap((y) => [at([face, y, GATE_Z + 1.7]), at([face, y, GATE_TOP - 1.7])]), { size: 0.4, tone: 'hi' }));
  for (const y of LUG_YS) {
    out.push(S(k.slabOf({ x: GATE_X, y: y - 2, w: GATE_T, d: 4, r: 0.5 }, GATE_TOP, LUG_TOP - GATE_TOP, P, 3, 0.3), { tone: 'mid' }));
    out.push(D([at([CABLE_X, y, LUG_TOP])], { size: 0.55, tone: 'hi' }));
  }
  return out.join('');
}

function gateFront() {
  const out: string[] = [post(POST_FRONT)];
  out.push(S(k.slabOf(BAR, POST_TOP, BAR_H, P, 3, 0.6), { tone: 'mid', inner: L(k.sideSeam(BAR, POST_TOP + 1.6, P, 3), { tone: 'faint' }) }));
  const top = POST_TOP + BAR_H;
  for (const y of LUG_YS) {
    for (const x of [GATE_X - 0.6, GATE_X + GATE_T + 0.6 - 0.8]) {
      out.push(S(k.slabOf({ x, y: y - 3.4, w: 0.8, d: 6.8, r: 0.4 }, top, 6.6, P, 3), { tone: 'mid', crease: 'none' }));
    }
  }
  const sheaves = byDepth(LUG_YS.map((y) => [CABLE_X, y] as [number, number]));
  for (const [x, y] of sheaves) {
    const F = G.frameAlong([x, y, top + 3.6], [1, 0, 0]);
    out.push(S(G.disc(-1.1, 1.1, 3, F, P), { tone: 'hi' }));
    out.push(L(G.circleOf(F, 1.1, 1.1, P, 24), { tone: 'lo' }));
    out.push(D([at([GATE_X + GATE_T + 0.6, y, top + 3.6])], { size: 0.5 }));
  }
  // Drive motor on the back end of the crossbar.
  const motor: [number, number] = [CABLE_X, BAR.y + 3.8];
  out.push(S(k.cylinder(motor[0], motor[1], 2.9, top, 7, P, 28, 0.4), { tone: 'mid', inner: L(k.sideArc(motor[0], motor[1], 2.9, top + 2.4, P, 20), { tone: 'faint' }) }));
  out.push(L(k.ring(motor[0], motor[1], 1.4, top + 7, P, 16), { tone: 'lo' }));
  out.push(D([at([BAR.x + 1.6, BAR.y + BAR.d - 2, top]), at([BAR.x + BAR.w - 1.6, BAR.y + BAR.d - 2, top])], { size: 0.4 }));
  return out.join('');
}

/* Sled, drawn at x = 0 and moved along the track. */
function sledBody() {
  const out: string[] = [];
  out.push(S(k.slabOf(SLED, SLED_Z, SLED_TOP - SLED_Z, P, 4, 0.6), { tone: 'mid', inner: L(k.sideSeam(SLED, SLED_Z + 1.6, P, 4), { tone: 'faint' }) }));
  out.push(L(k.planOutline(k.insetPlan(SLED, 3), SLED_TOP, P, 4), { tone: 'faint' }));
  out.push(L(k.ring(MODEL_AT[0], MODEL_AT[1], PLINTH_R + 1.4, SLED_TOP, P, 48), { tone: 'faint' }));
  out.push(D(k.corners(SLED, 5.5).map(([x, y]) => at([x, y, SLED_TOP])), { size: 0.45 }));
  // Pusher lug on the builder end.
  out.push(S(k.slabOf({ x: SLED.x + 1.5, y: MODEL_AT[1] - 5, w: 4, d: 10, r: 0.8 }, SLED_TOP, 3.4, P, 3, 0.4), { tone: 'mid' }));
  // Tag bar with one socket per model part.
  out.push(S(k.slabOf(TAG_BAR, SLED_TOP, TAG_BAR_TOP - SLED_TOP, P, 3, 0.4), { tone: 'mid' }));
  out.push(L(TAG_XS.map((x) => k.ring(x, TAG_Y, 1.9, TAG_BAR_TOP, P, 18)).join(''), { tone: 'lo' }));
  out.push(D(TAG_XS.map((x) => at([x, TAG_Y, TAG_BAR_TOP])), { size: 0.7, tone: 'lo' }));
  return out.join('');
}

function tagOf(x: number) {
  const plan: Plan = { x: x - TAG_HALF, y: TAG_Y - TAG_T / 2, w: TAG_HALF * 2, d: TAG_T, r: 0.25 };
  const out: string[] = [];
  out.push(S(k.cylinder(x, TAG_Y, TAG_PIN_R, TAG_BAR_TOP, TAG_LOW - TAG_BAR_TOP, P, 18), { tone: 'mid', crease: 'none' }));
  out.push(S(k.slabOf(plan, TAG_LOW, TAG_HIGH - TAG_LOW, P, 2), { tone: 'hi', crease: 'none' }));
  out.push(L(k.segment([x - 2.6, TAG_FACE, TAG_HIGH - 1.4], [x + 0.8, TAG_FACE, TAG_HIGH - 1.4], P) + k.segment([x - 2.6, TAG_FACE, TAG_HIGH - 2.7], [x - 0.4, TAG_FACE, TAG_HIGH - 2.7], P), { tone: 'lo', free: true }));
  out.push(L(k.sideRing([x + 1.9, TAG_FACE, TAG_LOW + 1.6], 0.95, 'y', P, 16), { tone: 'lo' }));
  out.push(`<g class="bw-seal">${D([at([x + 1.9, TAG_FACE, TAG_LOW + 1.6])], { size: 0.6, tone: 'hi' })}</g>`);
  return out.join('');
}

function modelParts() {
  const [mx, my] = MODEL_AT;
  const cup = G.solidOf(
    [
      [0, STEM_R],
      [CUP_TOP - STEM_TOP, CUP_R],
    ],
    G.frameAlong([mx, my, STEM_TOP], [0, 0, 1]),
    P,
  );
  return [
    S(k.cylinder(mx, my, PLINTH_R, SLED_TOP, PLINTH_TOP - SLED_TOP, P, 48, 0.6), { tone: 'hi', inner: L(k.sideArc(mx, my, PLINTH_R, SLED_TOP + 1.2, P, 32), { tone: 'faint' }) }),
    S(k.cylinder(mx, my, STEM_R, PLINTH_TOP, STEM_TOP - PLINTH_TOP, P, 28), { tone: 'hi', crease: 'none' }),
    S(cup, { tone: 'hi' }),
    S(G.solidOf(BUD, G.frameAlong([mx, my, CUP_TOP], [0, 0, 1]), P, { smooth: { radius: budRadius, slope: budSlope } }), { tone: 'hi' }),
    S(k.cylinder(mx, my, TIP_R, TIP_FROM, TIP_TOP - TIP_FROM, P, 20, 0.3), { tone: 'hi' }),
  ];
}

/* Inspector, drawn at x = 0 and moved along its own rail. */
function inspectorRail() {
  const out: string[] = [];
  out.push(S(k.slabOf(INSPECT_RAIL, 0, 3.4, P, 3, 0.5), { tone: 'mid', inner: L(k.sideSeam(INSPECT_RAIL, 1.4, P, 3), { tone: 'faint' }) }));
  out.push(L(k.lineOnTop([INSPECT_RAIL.x, INSPECT_Y], [INSPECT_RAIL.x + INSPECT_RAIL.w, INSPECT_Y], 3.4, P), { tone: 'faint' }));
  for (const x of [INSPECT_RAIL.x, INSPECT_RAIL.x + INSPECT_RAIL.w - 4]) {
    out.push(S(k.slabOf({ x, y: INSPECT_RAIL.y - 0.6, w: 4, d: INSPECT_RAIL.d + 1.2, r: 0.8 }, 3.4, 3.6, P, 3, 0.4), { tone: 'mid' }));
    out.push(D([at([x + 2, INSPECT_Y, 7])], { size: 0.45 }));
  }
  return out.join('');
}

const CLAMP: Plan = { x: -2.6, y: INSPECT_Y - 2.6, w: 5.2, d: 5.2, r: 1 };
const ARM_AXIS_Z = TAG_MID + LOUPE_R + 2.6;
const CLAMP_Z = ARM_AXIS_Z - 2.4;

function inspectorReach() {
  const out: string[] = [];
  const lens = G.frameAlong([0, LOUPE_Y, TAG_MID], [0, 1, 0]);
  out.push(S(G.ringBand(-0.7, 0.7, LOUPE_R - 1, LOUPE_R, lens, P), { tone: 'hi' }));
  out.push(L(G.circleOf(lens, 0.7, LOUPE_R - 1.5, P, 32), { tone: 'faint' }));
  out.push(S(k.cylinder(0, LOUPE_Y, 0.8, TAG_MID + LOUPE_R - 0.2, ARM_AXIS_Z - TAG_MID - LOUPE_R + 0.2, P, 16), { tone: 'mid', crease: 'none' }));
  const rod = G.frameAlong([0, LOUPE_Y - 1, ARM_AXIS_Z], [0, 1, 0]);
  out.push(S(G.disc(0, INSPECT_Y - LOUPE_Y + 1 + LOUPE_REACH + 0.4, 0.9, rod, P), { tone: 'mid', crease: 'none' }));
  out.push(S(G.sphereOf([0, LOUPE_Y - 1, ARM_AXIS_Z], 1.3, P), { tone: 'mid' }));
  return out.join('');
}

function inspectorBody() {
  const out: string[] = [];
  const carriage: Plan = { x: -6, y: INSPECT_RAIL.y - 1.5, w: 12, d: INSPECT_RAIL.d + 3, r: 1.5 };
  out.push(S(k.slabOf(carriage, 3.4, 3.6, P, 3, 0.5), { tone: 'mid', inner: L(k.sideSeam(carriage, 4.8, P, 3), { tone: 'faint' }) }));
  out.push(D(k.corners(carriage, 1.8).map(([x, y]) => at([x, y, 7])), { size: 0.4 }));
  out.push(L(k.lineOnTop([0, carriage.y + carriage.d], [0, carriage.y + carriage.d - 2.2], 7, P), { tone: 'hi' }));
  return out.join('');
}

function inspectorPost() {
  const out: string[] = [];
  out.push(S(k.cylinder(0, INSPECT_Y, 1.9, 7, ARM_AXIS_Z + 3.2 - 7, P, 20), { tone: 'mid', crease: 'none' }));
  out.push(S(k.slabOf(CLAMP, CLAMP_Z, 4.8, P, 3, 0.5), { tone: 'mid' }));
  out.push(L(k.ring(0, INSPECT_Y, 1.9, CLAMP_Z + 4.8, P, 18), { tone: 'lo' }));
  const neck: Plan = { x: CLAMP.x + CLAMP.w, y: INSPECT_Y - 1, w: 1.6, d: 2, r: 0.4 };
  out.push(S(k.slabOf(neck, CLAMP_Z + 1.4, 2, P, 2), { tone: 'mid', crease: 'none' }));
  const screw = G.frameAlong([neck.x + neck.w, INSPECT_Y, CLAMP_Z + 2.4], [1, 0, 0]);
  out.push(S(G.disc(0, 2.6, 2, screw, P), { tone: 'mid' }));
  out.push(L(G.ribsOf(screw, 0.2, 2.4, 2, 18, P, { seams: true }) as string, { tone: 'lo' }));
  out.push(L(k.ring(0, INSPECT_Y, 1.1, ARM_AXIS_Z + 3.2, P, 14), { tone: 'lo' }));
  return out.join('');
}

export interface BioweaveArt {
  base: string;
  rails: string;
  trayBack: string;
  builderBack: string;
  gateBack: string;
  sled: string;
  tags: string[];
  model: string[];
  builderRod: string;
  builderHead: string;
  builderArm: string;
  gatePlate: string;
  gateFront: string;
  trayFront: string;
  inspectorRail: string;
  inspectorReach: string;
  inspectorBody: string;
  inspectorPost: string;
}

export function bioweaveArt(): BioweaveArt {
  return {
    base: base() + specCard(),
    rails: rails(),
    trayBack: trayBack(),
    builderBack: builderBack(),
    gateBack: gateBack(),
    sled: sledBody(),
    tags: TAG_XS.map(tagOf),
    model: modelParts(),
    builderRod: builderRod(),
    builderHead: builderHead(),
    builderArm: builderArm(),
    gatePlate: gatePlate(),
    gateFront: gateFront(),
    trayFront: trayFront(),
    inspectorRail: inspectorRail(),
    inspectorReach: inspectorReach(),
    inspectorBody: inspectorBody(),
    inspectorPost: inspectorPost(),
  };
}

export const FIGURE_LABEL =
  'An evidence gate on a specimen bench. A sled carries a small five part model and a row of five standing tags, one per part. A builder arm at the back builds the model; a separate inspector with a loupe, on its own rail at the front, reads each tag in turn. A gate across the track lifts only when every tag has passed, and the model slides into a tray marked Drafts.';
