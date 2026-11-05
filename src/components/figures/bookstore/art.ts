import * as k from '@/components/iso/iso-kit';
import type { Plan, Point3 } from '@/components/iso/iso-kit';
import * as G from '@/components/iso/lathe.mjs';
import {
  BED,
  BED_TOP,
  BODY_TOP,
  BOOK_DEPTH,
  BOOK_X0,
  BOOKS,
  CABINET,
  CAP_H,
  CARD_COUNT,
  CARD_PITCH,
  COLUMN,
  DIE_H,
  DRAWER_COLS,
  DRAWER_DEPTH,
  DRAWER_ROWS,
  DRAWER_TRAVEL,
  FACE_Y,
  FOOT_H,
  HEAD,
  HEAD_H,
  HEAD_Z,
  IN_TRAY,
  KEY_AT,
  LANE_Y,
  LANE_Z,
  LATCH,
  LATCH_TRAVEL,
  LOCK,
  MATCH_CARD,
  P,
  PLATE,
  PLATE_H,
  PLINTH_H,
  PRESS,
  PRESS_H,
  RACK,
  RACK_FRONT,
  RACK_X,
  RAM,
  READER_TOP,
  READER_Y,
  SEARCH_COL,
  SEARCH_ROW,
  SLIP,
  SLOT,
  STAMP_H,
  STAMP_HALF,
  STAMP_Z,
  TRAY,
  TRAY_TOP,
  TRAY_WALL,
  at,
} from './view';
import { CART_READERS } from './model';

const S = k.solidSvg;
const L = k.lineSvg;
const D = k.dotsSvg;
const depth = ([x, y]: [number, number], z = 0) => k.depthOf([x, y, z], P);
const byDepth = <T extends [number, number]>(points: T[]) => [...points].sort((a, b) => depth(a) - depth(b));
const box = (x0: number, y0: number, x1: number, y1: number, r = 0.6): Plan => ({ x: x0, y: y0, w: x1 - x0, d: y1 - y0, r });

/** A closed rounded rectangle drawn in a vertical face plane. */
function faceRect(u0: number, u1: number, v0: number, v1: number, r: number, place: (u: number, v: number) => Point3) {
  const points: Point3[] = [];
  const corner = (cu: number, cv: number, from: number) => {
    for (let i = 0; i <= 4; i++) {
      const a = from + (Math.PI / 2) * (i / 4);
      points.push(place(cu + r * Math.cos(a), cv + r * Math.sin(a)));
    }
  };
  corner(u1 - r, v0 + r, -Math.PI / 2);
  corner(u1 - r, v1 - r, 0);
  corner(u0 + r, v1 - r, Math.PI / 2);
  corner(u0 + r, v0 + r, Math.PI);
  return k.pathOf(points.map(at), true);
}

const onFaceY = (y: number) => (u: number, v: number): Point3 => [u, y, v];
const onFaceX = (x: number) => (u: number, v: number): Point3 => [x, u, v];

function screws(points: [number, number][], z: number, ring = 1.6) {
  return L(points.map(([x, y]) => k.ring(x, y, ring, z, P, 14)).join(''), { tone: 'lo' }) + D(points.map(([x, y]) => at([x, y, z])), { size: 0.45 });
}

/* ---------- Bench ---------- */

function base() {
  const out = [`<path class="iso-halo" d="${k.haloOf(PLATE, -PLATE_H - FOOT_H, PLATE_H, P)}"/>`];
  for (const [x, y] of byDepth(k.corners(PLATE, 22))) {
    out.push(S(k.cylinder(x, y, 7, -PLATE_H - FOOT_H, 1.6, P, 28), { tone: 'lo' }));
    out.push(S(k.cylinder(x, y, 5.4, -PLATE_H - FOOT_H + 1.6, FOOT_H - 1.6, P, 28), { tone: 'mid' }));
  }
  out.push(S(k.slabOf(PLATE, -PLATE_H, PLATE_H, P, 8, 1.6), { tone: 'mid', inner: L(k.sideSeam(PLATE, -PLATE_H + 3.5, P, 8), { tone: 'faint' }) }));
  out.push(L(k.planOutline(k.insetPlan(PLATE, 5), 0, P), { tone: 'lo' }));
  out.push(screws(k.corners(PLATE, 10), 0, 2.2));

  const strip: Plan = { x: -88, y: PLATE.y + PLATE.d - 12, w: 132, d: 6, r: 1 };
  out.push(S(k.slabOf(strip, 0, 0.6, P, 3), { tone: 'lo', crease: 'none' }));
  const ticks = k.topTicks(strip.x + 4, strip.x + strip.w - 4, 4, 5, strip.y + 0.8, 0.6, [1.8, 3.4], P);
  out.push(L(ticks.minor, { tone: 'lo' }), L(ticks.major, { tone: 'mid' }));

  const label: Plan = { x: 56, y: PLATE.y + PLATE.d - 13.5, w: 40, d: 9, r: 1.2 };
  out.push(S(k.slabOf(label, 0, 0.8, P, 3), { tone: 'mid', crease: 'none' }));
  out.push(L(k.planOutline(k.insetPlan(label, 1.4), 0.8, P), { tone: 'faint' }));
  for (const [from, to, y] of [
    [7, 30, 2.8],
    [7, 22, 4.6],
    [7, 26, 6.4],
  ] as const) {
    out.push(L(k.lineOnTop([label.x + from, label.y + y], [label.x + to, label.y + y], 0.8, P), { tone: 'lo', free: true }));
  }
  out.push(D([at([label.x + 3.6, label.y + 4.5, 0.8]), at([label.x + label.w - 3.6, label.y + 4.5, 0.8])], { size: 0.4 }));
  return out.join('');
}

/* ---------- Card catalog cabinet ---------- */

const [SC0, SC1] = DRAWER_COLS[SEARCH_COL]!;
const [SR0, SR1] = DRAWER_ROWS[SEARCH_ROW]!;
const BOX = box(SC0 + 1.5, FACE_Y - DRAWER_DEPTH, SC1 - 1.5, FACE_Y);
const BOX_Z0 = SR0 + 1;
const BOX_Z1 = SR1 - 2.5;
const WALL = 1.2;

function drawerFront(c0: number, c1: number, r0: number, r1: number) {
  const plan = box(c0, FACE_Y, c1, FACE_Y + 1.6, 0.5);
  const cx = (c0 + c1) / 2;
  const fy = FACE_Y + 1.6;
  const out: string[] = [];
  out.push(S(k.slabOf(plan, r0, r1 - r0, P, 2, 0.4), { tone: 'mid' }));
  out.push(L(faceRect(c0 + 1.6, c1 - 1.6, r0 + 1.6, r1 - 1.6, 0.8, onFaceY(fy)), { tone: 'faint' }));
  const hz = r1 - 6;
  out.push(L(faceRect(cx - 6, cx + 6, hz - 2.4, hz + 2.4, 0.4, onFaceY(fy)), { tone: 'lo' }));
  out.push(L(k.segment([cx - 4.4, fy, hz + 0.6], [cx + 3, fy, hz + 0.6], P), { tone: 'lo', free: true }));
  out.push(L(k.segment([cx - 4.4, fy, hz - 0.8], [cx + 1.4, fy, hz - 0.8], P), { tone: 'lo', free: true }));
  out.push(D([at([cx - 7, fy, hz]), at([cx + 7, fy, hz])], { size: 0.35 }));
  const pz = (r0 + r1) / 2 - 3.4;
  out.push(S(k.slabOf(box(cx - 4.6, fy, cx - 3.2, fy + 2.2, 0.3), pz - 1, 2.6, P, 2), { tone: 'mid', crease: 'none' }));
  out.push(S(k.slabOf(box(cx + 3.2, fy, cx + 4.6, fy + 2.2, 0.3), pz - 1, 2.6, P, 2), { tone: 'mid', crease: 'none' }));
  out.push(S(k.slabOf(box(cx - 5.4, fy + 2.2, cx + 5.4, fy + 3.6, 0.6), pz - 1.2, 3, P, 3, 0.3), { tone: 'hi' }));
  const knob = G.frameAlong([cx, fy, r0 + 3.6], [0, 1, 0]);
  out.push(S(G.disc(0, 1.6, 1.3, knob, P), { tone: 'mid' }));
  return out.join('');
}

function cabinet() {
  const out: string[] = [];
  const plinth = k.insetPlan(CABINET, 1);
  out.push(`<path class="iso-halo" d="${k.haloOf(CABINET, 0, 20, P)}"/>`);
  out.push(S(k.slabOf(plinth, 0, PLINTH_H, P, 3, 0.4), { tone: 'lo' }));
  const sideX = CABINET.x + CABINET.w;
  out.push(
    S(k.slabOf(CABINET, PLINTH_H, BODY_TOP - PLINTH_H, P, 3, 0.6), {
      tone: 'mid',
      inner: L(faceRect(CABINET.y + 5, FACE_Y - 5, PLINTH_H + 5, BODY_TOP - 5, 1.2, onFaceX(sideX)), { tone: 'faint' }),
    }),
  );
  const cap = k.insetPlan(CABINET, -1.6);
  out.push(S(k.slabOf(cap, BODY_TOP, CAP_H, P, 3, 0.8), { tone: 'mid', inner: L(k.sideSeam(cap, BODY_TOP + 1.4, P, 3), { tone: 'faint' }) }));
  out.push(L(k.planOutline(k.insetPlan(cap, 4), BODY_TOP + CAP_H, P, 3), { tone: 'faint' }));
  out.push(screws(k.corners(cap, 7), BODY_TOP + CAP_H, 1.4));
  /* the opening the search drawer leaves, dark inside */
  const hole = faceRect(BOX.x - 0.4, BOX.x + BOX.w + 0.4, BOX_Z0 - 0.4, BOX_Z1 + 0.6, 0.4, onFaceY(FACE_Y));
  out.push(`<path class="iso-shade" data-shade="0" d="${hole}"/>`);
  out.push(L(hole, { tone: 'lo' }));
  DRAWER_ROWS.forEach(([r0, r1], row) =>
    DRAWER_COLS.forEach(([c0, c1], col) => {
      if (row === SEARCH_ROW && col === SEARCH_COL) return;
      out.push(drawerFront(c0, c1, r0, r1));
    }),
  );
  return out.join('');
}

const CARD_W0 = BOX.x + WALL + 0.8;
const CARD_W1 = BOX.x + BOX.w - WALL - 0.8;
const CARD_Z0 = BOX_Z0 + 1.2;
const CARD_Z1 = BOX_Z1 - 1.6;
export const cardY = (index: number) => FACE_Y - 4 - index * CARD_PITCH;

function drawer() {
  const out: string[] = [];
  out.push(S(k.slabOf(BOX, BOX_Z0, 1.2, P, 2), { tone: 'lo', crease: 'none' }));
  out.push(S(k.slabOf(box(BOX.x, BOX.y, BOX.x + BOX.w, BOX.y + WALL), BOX_Z0 + 1.2, BOX_Z1 - BOX_Z0 - 1.2, P, 2), { tone: 'mid' }));
  out.push(S(k.slabOf(box(BOX.x, BOX.y + WALL, BOX.x + WALL, BOX.y + BOX.d), BOX_Z0 + 1.2, BOX_Z1 - BOX_Z0 - 1.2, P, 2), { tone: 'mid' }));
  /* the follower block that keeps the cards upright */
  const back = cardY(CARD_COUNT - 1);
  out.push(S(k.slabOf(box(BOX.x + WALL, back - 3.4, BOX.x + BOX.w - WALL, back - 1, 0.4), BOX_Z0 + 1.2, 10, P, 2, 0.3), { tone: 'mid' }));
  return out.join('');
}

function card(index: number, match: boolean) {
  const y = cardY(index);
  const plan = box(CARD_W0, y - 0.3, CARD_W1, y + 0.3, 0.15);
  let inner = '';
  if (match) {
    inner =
      L(k.segment([CARD_W0 + 2, y + 0.3, CARD_Z1 - 2.4], [CARD_W1 - 6, y + 0.3, CARD_Z1 - 2.4], P), { tone: 'mid', free: true }) +
      L(k.segment([CARD_W0 + 2, y + 0.3, CARD_Z1 - 4.2], [CARD_W1 - 9, y + 0.3, CARD_Z1 - 4.2], P), { tone: 'lo', free: true });
  }
  const body = S(k.slabOf(plan, CARD_Z0, CARD_Z1 - CARD_Z0, P, 1), { tone: match ? 'hi' : 'lo', crease: 'none', inner });
  const tabX = CARD_W0 + 2 + ((index * 5) % 12);
  const tab = S(k.slabOf(box(tabX, y - 0.3, tabX + 4, y + 0.3, 0.15), CARD_Z1, 1.6, P, 1), { tone: match ? 'hi' : 'lo', crease: 'none' });
  return body + tab;
}

function cards() {
  const behind: string[] = [];
  const front: string[] = [];
  for (let index = CARD_COUNT - 1; index >= 0; index--) {
    if (index === MATCH_CARD) continue;
    (index > MATCH_CARD ? behind : front).push(card(index, false));
  }
  return { behind: behind.join(''), match: card(MATCH_CARD, true), front: front.join('') };
}

function drawerNear() {
  const out: string[] = [];
  out.push(S(k.slabOf(box(BOX.x + BOX.w - WALL, BOX.y + WALL, BOX.x + BOX.w, BOX.y + BOX.d), BOX_Z0 + 1.2, BOX_Z1 - BOX_Z0 - 1.2, P, 2), { tone: 'mid' }));
  out.push(drawerFront(SC0, SC1, SR0, SR1));
  return out.join('');
}

/* The drawer's own section swept out of the face: what is still inside only shows through the opening. */
export const DRAWER_CLIP = k.slabOf(box(SC0, FACE_Y, SC1, FACE_Y + DRAWER_TRAVEL + 8, 0), SR0, SR1 - SR0, P, 1).fill;

/* ---------- Book rack ---------- */

function book(index: number, lit = false, x0 = BOOK_X0) {
  const { y, t, h } = BOOKS[index]!;
  const plan = box(x0, y, x0 + BOOK_DEPTH, y + t, 0.7);
  const z0 = LANE_Z;
  const bands = k.sideSeam(plan, z0 + h - 4, P, 3) + k.sideSeam(plan, z0 + 4, P, 3);
  const out: string[] = [];
  out.push(S(k.slabOf(plan, z0, h, P, 3, 0.4), { tone: lit ? 'hi' : 'mid', lit, inner: L(bands, { tone: lit ? 'mid' : 'faint' }) }));
  const pages = box(x0 + 0.6, y + 0.6, x0 + BOOK_DEPTH - 1.4, y + t - 0.6, 0.2);
  out.push(L(k.planOutline(pages, z0 + h, P, 1), { tone: lit ? 'mid' : 'faint' }));
  return out.join('');
}

function rackBack() {
  const out: string[] = [];
  out.push(S(k.slabOf(RACK, 0, LANE_Z, P, 3, 0.6), { tone: 'lo', inner: L(k.sideSeam(RACK, 3, P, 3), { tone: 'faint' }) }));
  out.push(screws([
    [RACK.x + 2.2, RACK.y + 2.2],
    [RACK_FRONT - 1.4, RACK.y + 1.6],
  ], LANE_Z, 1));
  out.push(S(k.slabOf(box(RACK.x, RACK.y, RACK.x + RACK.w - 6, RACK.y + 2), LANE_Z, 34, P, 2, 0.4), { tone: 'mid' }));
  out.push(S(k.slabOf(box(RACK_X, RACK.y + 2, RACK_X + 3, RACK.y + RACK.d - 2), LANE_Z, 16, P, 2, 0.4), { tone: 'mid' }));
  for (let index = 0; index < SLOT; index++) out.push(book(index));
  return out.join('');
}

function rackFront() {
  const out: string[] = [];
  for (let index = SLOT + 1; index < BOOKS.length; index++) out.push(book(index));
  const end = box(RACK.x, RACK.y + RACK.d - 2, RACK.x + RACK.w - 6, RACK.y + RACK.d);
  out.push(S(k.slabOf(end, LANE_Z, 11, P, 2, 0.4), { tone: 'mid', inner: L(faceRect(RACK.x + 3, RACK.x + RACK.w - 9, LANE_Z + 2.5, LANE_Z + 8.5, 1, onFaceY(end.y + end.d)), { tone: 'faint' }) }));
  return out.join('');
}

export function litBook() {
  return book(SLOT, true, BOOK_X0);
}

/* ---------- Rails ---------- */

const LIP_BACK = box(0, LANE_Y - 4.2, 0, LANE_Y - 3.2);
const LIP_FRONT = box(0, LANE_Y + 3.2, 0, LANE_Y + 4.2);

function railBed(x0: number, x1: number) {
  const out: string[] = [];
  const legs = [x0 + 4, x1 - 4];
  for (const x of legs) out.push(S(k.slabOf(box(x - 2.4, LANE_Y - 3.2, x + 2.4, LANE_Y + 3.2, 0.6), 0, LANE_Z - 2.2, P, 2), { tone: 'lo' }));
  const bed = box(x0, LANE_Y - 4.2, x1, LANE_Y + 4.2, 0.4);
  out.push(S(k.slabOf(bed, LANE_Z - 2.2, 2.2, P, 2, 0.3), { tone: 'mid' }));
  out.push(L(k.lineOnTop([x0, LANE_Y], [x1, LANE_Y], LANE_Z, P), { tone: 'faint' }));
  out.push(D(legs.map((x) => at([x, LANE_Y - 2.4, LANE_Z])), { size: 0.4 }));
  out.push(S(k.slabOf({ ...LIP_BACK, x: x0, w: x1 - x0 }, LANE_Z, 2, P, 2), { tone: 'mid', crease: 'none' }));
  return out.join('');
}

function railLip(x0: number, x1: number) {
  return S(k.slabOf({ ...LIP_FRONT, x: x0, w: x1 - x0 }, LANE_Z, 2, P, 2), { tone: 'mid', crease: 'none' });
}

const RAIL_A: [number, number] = [RACK_FRONT, TRAY.x];
const RAIL_B: [number, number] = [TRAY.x + TRAY.w, IN_TRAY.x];

/* ---------- Trolley: the shared tray ---------- */

const DECK = box(TRAY.x - 2, READER_Y - 2, TRAY.x + TRAY.w + 2, TRAY.y + TRAY.d + 2, 3);
const GAP_LO = LANE_Y - 4.6;
const GAP_HI = LANE_Y + 4.6;
const WALL_H = TRAY_TOP - LANE_Z;
export const READER_XS = CART_READERS.map((_, index) => TRAY.x + 7 + index * 8);

function trayWall(plan: Plan, tone: k.Tone = 'mid') {
  return S(k.slabOf(plan, LANE_Z, WALL_H, P, 2, 0.4), { tone });
}

function trolleyBack() {
  const out: string[] = [];
  out.push(`<path class="iso-halo" d="${k.haloOf(DECK, 0, 6, P)}"/>`);
  for (const [x, y] of byDepth(k.corners(DECK, 5))) {
    out.push(S(k.cylinder(x, y, 3.2, 0, 1.4, P, 20), { tone: 'lo' }));
    out.push(S(k.cylinder(x, y, 2, 1.4, 2.6, P, 16), { tone: 'mid', crease: 'none' }));
  }
  out.push(S(k.slabOf(DECK, 4, LANE_Z - 4, P, 3, 0.6), { tone: 'mid', inner: L(k.sideSeam(DECK, 5.6, P, 3), { tone: 'faint' }) }));
  out.push(L(k.planOutline(k.insetPlan(TRAY, TRAY_WALL + 2), LANE_Z, P, 2), { tone: 'faint' }));
  out.push(screws(k.corners(DECK, 2.6).filter(([, y]) => y > TRAY.y + TRAY.d), LANE_Z, 0.9));
  /* reader bar: five windows on one bar, every view reads the same tray */
  const posts = [TRAY.x + 1, TRAY.x + TRAY.w - 4];
  for (const x of posts) out.push(S(k.slabOf(box(x, READER_Y - 1, x + 3, READER_Y + 2, 0.5), LANE_Z, READER_TOP - 6 - LANE_Z, P, 2), { tone: 'mid', crease: 'none' }));
  const bar = box(TRAY.x - 1, READER_Y - 1.4, TRAY.x + TRAY.w + 1, READER_Y + 2.4, 1);
  out.push(S(k.slabOf(bar, READER_TOP - 6, 6, P, 3, 0.4), { tone: 'mid' }));
  const fy = READER_Y + 2.4;
  const windows = READER_XS.map((x) => k.sideRing([x, fy, READER_TOP - 3], 1.7, 'y', P, 20)).join('');
  out.push(`<path class="iso-shade" data-shade="0" d="${windows}"/>`);
  out.push(L(windows, { tone: 'lo' }));
  out.push(D(posts.map((x) => at([x + 1.5, fy, READER_TOP - 3])), { size: 0.35 }));
  out.push(trayWall(box(TRAY.x, TRAY.y, TRAY.x + TRAY.w, TRAY.y + TRAY_WALL)));
  out.push(trayWall(box(TRAY.x, TRAY.y + TRAY_WALL, TRAY.x + TRAY_WALL, GAP_LO)));
  out.push(trayWall(box(TRAY.x + TRAY.w - TRAY_WALL, TRAY.y + TRAY_WALL, TRAY.x + TRAY.w, GAP_LO)));
  return out.join('');
}

export const READER_DOTS = READER_XS.map((x) => at([x, READER_Y + 2.4, READER_TOP - 3]));

function trolleyFront() {
  const out: string[] = [];
  const y1 = TRAY.y + TRAY.d;
  out.push(trayWall(box(TRAY.x, GAP_HI, TRAY.x + TRAY_WALL, y1 - TRAY_WALL)));
  out.push(trayWall(box(TRAY.x + TRAY.w - TRAY_WALL, GAP_HI, TRAY.x + TRAY.w, y1 - TRAY_WALL)));
  const front = box(TRAY.x, y1 - TRAY_WALL, TRAY.x + TRAY.w, y1);
  out.push(S(k.slabOf(front, LANE_Z, WALL_H, P, 2, 0.4), { tone: 'mid', inner: L(k.sideSeam(front, LANE_Z + 3, P, 2), { tone: 'faint' }) }));
  /* push handle on the front wall */
  const hz = TRAY_TOP - 4.4;
  for (const x of [TRAY.x + 8, TRAY.x + TRAY.w - 10]) out.push(S(k.slabOf(box(x, y1, x + 2, y1 + 3.2, 0.4), hz - 1, 2, P, 2), { tone: 'mid', crease: 'none' }));
  out.push(S(k.slabOf(box(TRAY.x + 5, y1 + 3.2, TRAY.x + TRAY.w - 5, y1 + 5.2, 1), hz - 1.4, 2.8, P, 3, 0.3), { tone: 'hi' }));
  return out.join('');
}

/* ---------- Press in tray (the order) ---------- */

function inTrayBack() {
  const out: string[] = [];
  out.push(S(k.slabOf(IN_TRAY, 0, LANE_Z, P, 3, 0.5), { tone: 'lo', inner: L(k.sideSeam(IN_TRAY, 3, P, 3), { tone: 'faint' }) }));
  out.push(S(k.slabOf(box(IN_TRAY.x, IN_TRAY.y, IN_TRAY.x + IN_TRAY.w, IN_TRAY.y + 1.6), LANE_Z, 6, P, 2, 0.3), { tone: 'mid' }));
  out.push(S(k.slabOf(box(IN_TRAY.x, IN_TRAY.y + 1.6, IN_TRAY.x + 1.6, GAP_LO), LANE_Z, 6, P, 2), { tone: 'mid', crease: 'none' }));
  out.push(L(k.lineOnTop([IN_TRAY.x + 1.6, LANE_Y], [IN_TRAY.x + IN_TRAY.w - 1.6, LANE_Y], LANE_Z, P), { tone: 'faint' }));
  return out.join('');
}

function inTrayFront() {
  const out: string[] = [];
  const y1 = IN_TRAY.y + IN_TRAY.d;
  out.push(S(k.slabOf(box(IN_TRAY.x, GAP_HI, IN_TRAY.x + 1.6, y1 - 1.6), LANE_Z, 6, P, 2), { tone: 'mid', crease: 'none' }));
  out.push(S(k.slabOf(box(IN_TRAY.x + IN_TRAY.w - 1.6, IN_TRAY.y + 1.6, IN_TRAY.x + IN_TRAY.w, y1 - 1.6), LANE_Z, 6, P, 2), { tone: 'mid', crease: 'none' }));
  out.push(S(k.slabOf(box(IN_TRAY.x, y1 - 1.6, IN_TRAY.x + IN_TRAY.w, y1), LANE_Z, 6, P, 2, 0.3), { tone: 'mid' }));
  return out.join('');
}

/* ---------- Press ---------- */

function pressBase() {
  const out: string[] = [];
  out.push(`<path class="iso-halo" d="${k.haloOf(PRESS, 0, 12, P)}"/>`);
  out.push(S(k.slabOf(PRESS, 0, PRESS_H, P, 4, 1), { tone: 'mid', inner: L(k.sideSeam(PRESS, 4, P, 4), { tone: 'faint' }) }));
  out.push(L(k.planOutline(k.insetPlan(PRESS, 3), PRESS_H, P, 4), { tone: 'faint' }));
  out.push(screws(k.corners(PRESS, 6).filter(([x, y]) => !(x < 100 && y < -20)), PRESS_H, 1.4));
  out.push(S(k.slabOf(COLUMN, PRESS_H, HEAD_Z - PRESS_H, P, 3, 0.6), { tone: 'mid', inner: L(k.sideSeam(COLUMN, PRESS_H + 8, P, 3), { tone: 'faint' }) }));
  out.push(S(k.slabOf(BED, PRESS_H, BED_TOP - PRESS_H, P, 2, 0.5), { tone: 'hi' }));
  for (const y of [BED.y + 6, BED.y + BED.d - 6]) out.push(L(k.planOutline(box(BED.x + 4, y - 0.8, BED.x + BED.w - 4, y + 0.8, 0.8), BED_TOP, P, 3), { tone: 'lo' }));
  /* slot the latch rides in */
  out.push(L(k.planOutline(box(LATCH.x - 0.6, LATCH.y - LATCH_TRAVEL - 0.6, LATCH.x + LATCH.w + 0.6, LATCH.y + LATCH.d + 0.6, 0.6), BED_TOP, P, 2), { tone: 'faint' }));
  return out.join('');
}

export function latch() {
  return S(k.slabOf(LATCH, BED_TOP, 3.4, P, 2, 0.3), { tone: 'mid' }) + D([at([LATCH.x + LATCH.w / 2, LATCH.y + 1.6, BED_TOP + 3.4])], { size: 0.4 });
}

export const BOX_U = [8, 18, 28];

export function slip() {
  const out: string[] = [];
  out.push(S(k.slabOf(SLIP, BED_TOP, 0.6, P, 1), { tone: 'hi', crease: 'none' }));
  for (const u of BOX_U) out.push(L(k.planOutline(box(SLIP.x + u - 4, SLIP.y + 3, SLIP.x + u + 4, SLIP.y + SLIP.d - 1.6, 0.4), BED_TOP + 0.6, P, 1), { tone: 'faint' }));
  out.push(L(k.lineOnTop([SLIP.x + 4, SLIP.y + 1.6], [SLIP.x + 20, SLIP.y + 1.6], BED_TOP + 0.6, P), { tone: 'lo', free: true }));
  return out.join('');
}

export function mark(index: number) {
  const u = SLIP.x + BOX_U[index]!;
  const z = BED_TOP + 0.6;
  const lines: string[] = [];
  for (let bar = 0; bar <= index; bar++) {
    const y = SLIP.y + 5 + bar * 2.4;
    lines.push(k.lineOnTop([u - 2.6, y], [u + 2.6, y], z, P));
  }
  return L(k.planOutline(box(u - 3.4, SLIP.y + 3.6, u + 3.4, SLIP.y + SLIP.d - 2.2, 0.6), z, P, 2), { tone: 'hi' }) + L(lines.join(''), { tone: 'hi', free: true });
}

export function stamp() {
  const head = box(RAM[0] - STAMP_HALF, RAM[1] - STAMP_HALF, RAM[0] + STAMP_HALF, RAM[1] + STAMP_HALF, 1.2);
  const die = box(RAM[0] - 5, RAM[1] - 5, RAM[0] + 5, RAM[1] + 5, 0.6);
  const top = STAMP_Z + STAMP_H;
  return (
    S(k.cylinder(RAM[0], RAM[1], 2.6, top, HEAD_Z + HEAD_H + 4 - top, P, 24), { tone: 'mid', crease: 'none' }) +
    S(k.slabOf(die, STAMP_Z - DIE_H, DIE_H, P, 2), { tone: 'lo', crease: 'none' }) +
    S(k.slabOf(head, STAMP_Z, STAMP_H, P, 3, 0.5), { tone: 'hi', inner: L(k.sideSeam(head, STAMP_Z + 2.4, P, 3), { tone: 'faint' }) }) +
    screws([[RAM[0] - 4.4, RAM[1] - 4.4], [RAM[0] + 4.4, RAM[1] + 4.4]], STAMP_Z + STAMP_H, 0.8)
  );
}

function pressHead() {
  const out: string[] = [];
  out.push(S(k.cylinder(RAM[0], RAM[1], 4.4, HEAD_Z - 3, 3, P, 28, 0.4), { tone: 'mid' }));
  out.push(S(k.slabOf(HEAD, HEAD_Z, HEAD_H, P, 4, 1), { tone: 'mid', inner: L(k.sideSeam(HEAD, HEAD_Z + 4, P, 4), { tone: 'faint' }) }));
  out.push(L(k.planOutline(k.insetPlan(HEAD, 3), HEAD_Z + HEAD_H, P, 4), { tone: 'faint' }));
  out.push(screws(k.corners(HEAD, 4.5), HEAD_Z + HEAD_H, 1.2));
  const top = HEAD_Z + HEAD_H;
  out.push(S(k.cylinder(RAM[0], RAM[1], 7, top, 1.4, P, 40), { tone: 'lo' }));
  out.push(S(k.cylinder(RAM[0], RAM[1], 5.6, top + 1.4, 4.4, P, 40, 0.4), { tone: 'mid' }));
  out.push(L(k.knurl(RAM[0], RAM[1], 5.6, top + 1.4, top + 5.8, 36, P), { tone: 'lo' }));
  out.push(L(k.ring(RAM[0], RAM[1], 2, top + 5.8, P, 20), { tone: 'lo' }));
  out.push(D([at([RAM[0], RAM[1], top + 5.8])], { size: 0.5 }));
  return out.join('');
}

/* ---------- Keyed lock: the admin boundary ---------- */

const KEY_FRAME = G.frameAlong([KEY_AT[0], LOCK.y + LOCK.d, KEY_AT[2]], [0, 1, 0]);

function lock() {
  const out: string[] = [];
  const z0 = 2.4;
  const z1 = 13.6;
  out.push(S(k.slabOf(LOCK, z0, z1 - z0, P, 2, 0.4), { tone: 'mid' }));
  const fy = LOCK.y + LOCK.d;
  out.push(D([at([LOCK.x + 2.4, fy, z1 - 2.4]), at([LOCK.x + LOCK.w - 2.4, fy, z1 - 2.4]), at([LOCK.x + 2.4, fy, z0 + 2.4]), at([LOCK.x + LOCK.w - 2.4, fy, z0 + 2.4])], { size: 0.45 }));
  out.push(S(G.disc(0, 1.6, 4, KEY_FRAME, P), { tone: 'hi' }));
  out.push(L(G.circleOf(KEY_FRAME, 1.6, 2.8, P), { tone: 'lo' }));
  /* index marks for the two key positions: user at 0, admin a quarter turn on */
  out.push(L(k.segment([KEY_AT[0], fy, KEY_AT[2] + 5], [KEY_AT[0], fy, KEY_AT[2] + 6.6], P) + k.segment([KEY_AT[0] + 5, fy, KEY_AT[2]], [KEY_AT[0] + 6.6, fy, KEY_AT[2]], P), { tone: 'mid', free: true }));
  return out.join('');
}

export interface BookstoreArt {
  base: string;
  cabinet: string;
  drawer: string;
  cardsBehind: string;
  cardMatch: string;
  cardsFront: string;
  drawerNear: string;
  rackBack: string;
  rails: string;
  trolleyBack: string;
  inTrayBack: string;
  book: string;
  rackFront: string;
  railLips: string;
  trolleyFront: string;
  inTrayFront: string;
  pressBase: string;
  latch: string;
  slip: string;
  marks: string[];
  stamp: string;
  pressHead: string;
  lock: string;
  readers: string;
  clip: string;
}

export function bookstoreArt(): BookstoreArt {
  const c = cards();
  return {
    base: base(),
    cabinet: cabinet(),
    drawer: drawer(),
    cardsBehind: c.behind,
    cardMatch: c.match,
    cardsFront: c.front,
    drawerNear: drawerNear(),
    rackBack: rackBack(),
    rails: railBed(...RAIL_A) + railBed(...RAIL_B),
    trolleyBack: trolleyBack(),
    inTrayBack: inTrayBack(),
    book: litBook(),
    rackFront: rackFront(),
    railLips: railLip(...RAIL_A) + railLip(...RAIL_B),
    trolleyFront: trolleyFront(),
    inTrayFront: inTrayFront(),
    pressBase: pressBase(),
    latch: latch(),
    slip: slip(),
    marks: [0, 1, 2].map(mark),
    stamp: stamp(),
    pressHead: pressHead(),
    lock: lock(),
    readers: D(READER_DOTS, { size: 1, tone: 'hi' }),
    clip: DRAWER_CLIP,
  };
}


export const FIGURE_LABEL =
  'A small bookstore machine on a bench. On the left a card catalog cabinet opens its search drawer on a page of twelve cards and one card rises. A matching book slides out of a rack of twelve along a rail into a trolley tray read by five windows, then on into the in tray of a stamping press, which stamps an order slip not paid, then paid, and only after a key turns in the lock on its base, delivered.';
