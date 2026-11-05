import { cylinder, iso, lineOnTop, pathOf, ring, solidSvg, towardViewer, type Flat, type Plane, type SolidPaths } from '@/components/iso/iso-kit';
import { ARCHIVE, ARCHIVE_FLANGE, ARCHIVE_TOP, GATE_X, HIST_Z, PAGE_LEN, TAPE_H, ARM_H, ARM_Z, CRANK_LEN, CRANK_Z, DIAL, DIAL_R, DIAL_TOP, LIVE_Y, P, PIVOT_X, PRINT_X, REG_TOP, SPOOL, SPOOL_FLANGE, SPRING_AT, SPRING_SEAT, STYLUS_LOW, UPPER_FLANGE_Z } from './view';

const SHADES = 4;
const RAD = Math.PI / 180;
const { sin: sinOf, cos: cosOf } = Math;
const AZ = (P.azimuth ?? 45) * RAD;
const LIGHT: Plane = [-sinOf(AZ), cosOf(AZ)];

const cross = (o: Flat, a: Flat, b: Flat) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);

function hull(points: Flat[]): Flat[] {
  const sorted = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const lower: Flat[] = [];
  for (const p of sorted) {
    while (lower.length >= 2 && cross(lower[lower.length - 2]!, lower[lower.length - 1]!, p) <= 0) lower.pop();
    lower.push(p);
  }
  const upper: Flat[] = [];
  for (const p of sorted.reverse()) {
    while (upper.length >= 2 && cross(upper[upper.length - 2]!, upper[upper.length - 1]!, p) <= 0) upper.pop();
    upper.push(p);
  }
  return [...lower.slice(0, -1), ...upper.slice(0, -1)];
}

const area = (ring: Plane[]) => ring.reduce((sum, [x, y], i) => {
  const [nx, ny] = ring[(i + 1) % ring.length]!;
  return sum + x * ny - nx * y;
}, 0);

/* A prism whose base and top follow z(x, y): used for the armature, which pivots about a line along y. */
function prismOn(ringIn: Plane[], zAt: (x: number) => number, height: number): SolidPaths {
  const ringPts = area(ringIn) > 0 ? ringIn : [...ringIn].reverse();
  const count = ringPts.length;
  const [vx, vy] = towardViewer(P);
  const normals = ringPts.map(([ax, ay], i) => {
    const [bx, by] = ringPts[(i + 1) % count]!;
    const l = Math.hypot(bx - ax, by - ay) || 1;
    return [(by - ay) / l, -(bx - ax) / l] as Plane;
  });
  const facing = normals.map(([nx, ny]) => nx * vx + ny * vy > 1e-9);
  const top = ringPts.map(([x, y]) => iso([x, y, zAt(x) + height], P));
  const bottom = ringPts.map(([x, y]) => iso([x, y, zAt(x)], P));
  const outline: string[] = [];
  const crease: string[] = [];
  const shades: string[][] = Array.from({ length: SHADES }, () => []);
  for (let i = 0; i < count; i++) {
    const n = (i + 1) % count;
    if (facing[i]) {
      crease.push(pathOf([top[i]!, top[n]!]));
      outline.push(pathOf([bottom[i]!, bottom[n]!]));
      const [nx, ny] = normals[i]!;
      const lit = (nx * LIGHT[0] + ny * LIGHT[1] + 1) / 2;
      shades[Math.min(SHADES - 1, Math.max(0, Math.floor(lit * SHADES)))]!.push(pathOf([top[i]!, top[n]!, bottom[n]!, bottom[i]!], true));
    } else outline.push(pathOf([top[i]!, top[n]!]));
    if (facing[(i + count - 1) % count] !== facing[i]) outline.push(pathOf([top[i]!, bottom[i]!]));
  }
  return { fill: pathOf(hull([...top, ...bottom]), true), outline: outline.join(''), crease: crease.join(''), top: pathOf(top, true), shades: shades.map((list) => list.join('')) };
}

function roundRect(x0: number, y0: number, x1: number, y1: number, r: number, steps = 3): Plane[] {
  const out: Plane[] = [];
  const corner = (cx: number, cy: number, from: number) => {
    for (let s = 0; s <= steps; s++) {
      const a = from + (s / steps) * (Math.PI / 2);
      out.push([cx + r * cosOf(a), cy + r * sinOf(a)]);
    }
  };
  corner(x1 - r, y0 + r, -Math.PI / 2);
  corner(x1 - r, y1 - r, 0);
  corner(x0 + r, y1 - r, Math.PI / 2);
  corner(x0 + r, y0 + r, Math.PI);
  return out;
}

/* tilt in radians: positive lowers the free end (toward the print point) about the pivot. */
export const armZ = (x: number, tilt: number) => ARM_Z - (PIVOT_X - x) * Math.tan(tilt);

export function armatureAt(tilt: number) {
  const z = (x: number) => armZ(x, tilt);
  const bar = prismOn(roundRect(PRINT_X - 3, LIVE_Y - 2.5, PIVOT_X + 4, LIVE_Y + 2.5, 0.8), z, ARM_H);
  const keeper = prismOn(roundRect(54, LIVE_Y - 3.6, 82, LIVE_Y + 3.6, 1), (x) => z(x) + ARM_H - 0.01, 1.2);
  const tipZ = z(PRINT_X);
  const stylus = cylinder(PRINT_X, LIVE_Y, 1, STYLUS_LOW - (ARM_Z - tipZ), tipZ - STYLUS_LOW + (ARM_Z - tipZ), P, 16);
  const collar = cylinder(PRINT_X, LIVE_Y, 1.8, tipZ - 2.4, 2.4, P, 20);
  return (
    solidSvg(stylus, { tone: 'hi', lit: true, crease: 'none' }) +
    solidSvg(collar, { tone: 'hi', lit: true }) +
    solidSvg(bar, { tone: 'hi', lit: true }) +
    solidSvg(keeper, { tone: 'hi', lit: true })
  );
}

const [SVX, SVY] = towardViewer(P);

export function springAt(tilt: number) {
  const [cx, cy] = SPRING_AT;
  const from = REG_TOP + SPRING_SEAT;
  const to = armZ(cx, tilt) - 0.3;
  const turns = 5.5;
  const steps = Math.round(turns * 24);
  const back: Flat[][] = [];
  const front: Flat[][] = [];
  let run: Flat[] = [];
  let near: boolean | null = null;
  for (let s = 0; s <= steps; s++) {
    const t = s / steps;
    const a = t * turns * Math.PI * 2;
    const c = cosOf(a);
    const d = sinOf(a);
    const point = iso([cx + 2.2 * c, cy + 2.2 * d, from + (to - from) * t], P);
    const facing = c * SVX + d * SVY > 0;
    if (near === null) near = facing;
    if (facing !== near) {
      run.push(point);
      (near ? front : back).push(run);
      run = [point];
      near = facing;
    } else run.push(point);
  }
  if (run.length > 1) (near ? front : back).push(run);
  return { back: back.map((p) => pathOf(p)).join(''), front: front.map((p) => pathOf(p)).join('') };
}

/* Spokes and rivets on a flange top, turned by angle. */
export function spokesAt(center: [number, number], inner: number, outer: number, z: number, angle: number, count = 3) {
  const [cx, cy] = center;
  let lines = '';
  const rivets: Flat[] = [];
  for (let i = 0; i < count; i++) {
    const a = angle + (i / count) * Math.PI * 2;
    const c = cosOf(a);
    const d = sinOf(a);
    lines += lineOnTop([cx + inner * c, cy + inner * d], [cx + outer * c, cy + outer * d], z, P);
    const b = a + Math.PI / count;
    rivets.push(iso([cx + (outer + 1.5) * cosOf(b), cy + (outer + 1.5) * sinOf(b), z], P));
  }
  return { lines, rivets };
}

export const SPOOL_SPOKES_Z = UPPER_FLANGE_Z + 1.2;
export const SPOOL_SPOKE_RANGE: [number, number] = [8, SPOOL_FLANGE - 3];
export const ARCHIVE_SPOKE_Z = ARCHIVE_TOP;
export const ARCHIVE_SPOKE_RANGE: [number, number] = [7, ARCHIVE_FLANGE - 3];

export function crankAt(angle: number) {
  const [cx, cy] = ARCHIVE;
  const c = cosOf(angle);
  const d = sinOf(angle);
  const half = 1.8;
  const nx = -d * half;
  const ny = c * half;
  const tip: Plane = [cx + CRANK_LEN * c, cy + CRANK_LEN * d];
  const arm: Plane[] = [];
  for (let s = 0; s <= 8; s++) {
    const a = angle - Math.PI / 2 - (s / 8) * Math.PI;
    arm.push([cx + 3.2 * cosOf(a), cy + 3.2 * sinOf(a)]);
  }
  arm.push([tip[0] - nx, tip[1] - ny]);
  for (let s = 0; s <= 8; s++) {
    const a = angle - Math.PI / 2 + (s / 8) * Math.PI;
    arm.push([tip[0] + 2.4 * cosOf(a), tip[1] + 2.4 * sinOf(a)]);
  }
  arm.push([cx + nx, cy + ny]);
  const armPaths = prismOn(arm, () => CRANK_Z, 1.6);
  const knob = cylinder(tip[0], tip[1], 1.7, CRANK_Z + 1.6, 7, P, 24, 0.3);
  const knobCap = cylinder(tip[0], tip[1], 2.1, CRANK_Z + 8.6, 1.2, P, 24, 0.3);
  const nut = cylinder(cx, cy, 2.2, CRANK_Z + 1.6, 1.4, P, 6);
  return solidSvg(armPaths, { tone: 'mid' }) + solidSvg(nut, { tone: 'mid' }) + solidSvg(knob, { tone: 'mid', crease: 'none' }) + solidSvg(knobCap, { tone: 'mid' });
}

export function needleAt(angle: number) {
  const [cx, cy] = DIAL;
  const c = sinOf(angle);
  const d = -cosOf(angle);
  const len = DIAL_R - 2.4;
  return lineOnTop([cx - 2 * c, cy - 2 * d], [cx + len * c, cy + len * d], DIAL_TOP + 0.1, P);
}

export const dialHub = ring(DIAL[0], DIAL[1], 1, DIAL_TOP + 0.1, P, 12);


/* Page boundary notches on the history tape face, only where the tape is visible; shift is how far the tape has moved toward the spool. */
export function notchesAt(shift: number) {
  let d = '';
  for (let k = -2; k <= 3; k++) {
    const u = GATE_X + k * PAGE_LEN - (shift % PAGE_LEN);
    if (u > SPOOL[0] + 0.5 && u < ARCHIVE[0] - 0.5) d += `M${Math.round(u * 100) / 100} ${-(HIST_Z + TAPE_H)}V${-HIST_Z}`;
  }
  return d;
}
