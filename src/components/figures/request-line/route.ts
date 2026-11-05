import type { Stop } from './model';
import { HEADING, HUB, RING_R, WIRE, depth, endOf, toward } from './view';

export interface Path {
  points: [number, number][];
  lengths: number[];
  total: number;
}

const ARC_STEPS = 24;

/** The floor path a carrier rides from one terminal, round the hub's ring rail, to another. */
export function pathOf(from: Stop, to: Stop): Path {
  const points: [number, number][] = [toward(from, endOf(from)), toward(from, RING_R)];
  let a = HEADING[from];
  let b = HEADING[to];
  if (b - a > 180) b -= 360;
  if (a - b > 180) a -= 360;
  for (let i = 1; i < ARC_STEPS; i++) {
    const deg = ((a + ((b - a) * i) / ARC_STEPS) * Math.PI) / 180;
    points.push([HUB[0] + RING_R * Math.cos(deg), HUB[1] + RING_R * Math.sin(deg)]);
  }
  points.push(toward(to, RING_R), toward(to, endOf(to)));
  const lengths = [0];
  for (let i = 1; i < points.length; i++) {
    const [x0, y0] = points[i - 1]!;
    const [x1, y1] = points[i]!;
    lengths.push(lengths[i - 1]! + Math.hypot(x1 - x0, y1 - y0));
  }
  return { points, lengths, total: lengths.at(-1)! };
}

export function pointAt(path: Path, s: number): [number, number] {
  const want = Math.max(0, Math.min(1, s)) * path.total;
  let i = 1;
  while (i < path.lengths.length - 1 && path.lengths[i]! < want) i++;
  const l0 = path.lengths[i - 1]!;
  const span = path.lengths[i]! - l0 || 1;
  const t = (want - l0) / span;
  const [x0, y0] = path.points[i - 1]!;
  const [x1, y1] = path.points[i]!;
  return [x0 + (x1 - x0) * t, y0 + (y1 - y0) * t];
}

/** Rides accelerate and settle like a sprung carrier: a quintic smoothstep over the leg. */
export const easeLeg = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);

/** Speed of the carrier along the wire, in world units per second. */
export const SPEED = 230;
export const durationOf = (path: Path) => 0.45 + path.total / SPEED;

/** True when the carrier at `at` hangs behind the Go post and must be painted before it. */
export const behindPost = (at: [number, number]) => depth(at, WIRE) < depth(HUB, WIRE);

export const homeOf = () => toward('counter', endOf('counter'));
