import { boxCorners, depthOf, fitProjection, iso, translateAlong, type Flat, type Plan, type Point3 } from '@/components/iso/iso-kit';
import type { Stop } from './model';

export const WIDTH = 960;
export const HEIGHT = 520;
export const AZIMUTH = 38;
export const ELEVATION = 26;

export const PLATE: Plan = { x: -240, y: -168, w: 452, d: 240, r: 10 };
export const PLATE_H = 12;
export const FOOT_H = 6;

/** Height of the carrier wire above the plate. */
export const WIRE = 182;
export const POST_R = 3.2;
export const POST_TOP = WIRE + 6;

export const HUB: [number, number] = [0, 10];
export const RING_R = 24;
export const CAP_Z = WIRE + 8;
export const CAP_TOP = CAP_Z + 3;

/** Terminal posts, each the far end of one wire from the hub. */
export const POSTS: Record<Stop, [number, number]> = {
  counter: [-192, 10],
  rack: [0, -125],
  cabinet: [155, 10],
};

/** Direction from the hub towards each terminal, in degrees on the floor. */
export const HEADING: Record<Stop, number> = { counter: 180, rack: 270, cabinet: 0 };

export const BUFFER = 14;
/** The carrier stops this far short of a terminal post, against its buffer. */
export const STOP_AT = 25;

export const CARRIER_HANG = 24;
export const CUP_R = 8;
export const CUP_H = 16;

export const COUNTER_TOP = 51;
export const DESK_TOP = 51;
export const RACK_Z = 40;
export const RACK_TOP = 114;
export const RACK_FRONT = -106;
export const CABINET_TOP = 100;
export const CABINET_FRONT = 54;

export const P = fitProjection(
  [
    ...boxCorners(PLATE, -PLATE_H - FOOT_H, 0),
    ...Object.values(POSTS).map(([x, y]) => [x, y, POST_TOP + 4] as Point3),
    [HUB[0], HUB[1], CAP_TOP],
  ],
  WIDTH,
  HEIGHT,
  { pad: 28, azimuth: AZIMUTH, elevation: ELEVATION },
);

export const at = (point: Point3): Flat => iso(point, P);
export const depth = ([x, y]: [number, number], z = 0) => depthOf([x, y, z], P);
export const byDepth = <T extends [number, number]>(points: T[]) => [...points].sort((a, b) => depth(a) - depth(b));

export const moveBy = (by: Point3) => translateAlong(P, by);

const unit = (deg: number): [number, number] => [Math.cos((deg * Math.PI) / 180), Math.sin((deg * Math.PI) / 180)];
export const toward = (stop: Stop, distance: number): [number, number] => {
  const [ux, uy] = unit(HEADING[stop]);
  return [HUB[0] + ux * distance, HUB[1] + uy * distance];
};

const reach = (stop: Stop) => Math.hypot(POSTS[stop][0] - HUB[0], POSTS[stop][1] - HUB[1]);
export const endOf = (stop: Stop) => reach(stop) - STOP_AT;
