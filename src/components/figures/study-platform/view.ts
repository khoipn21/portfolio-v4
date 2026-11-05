import { axisVector, boxCorners, fitProjection, iso, type Flat, type Plan, type Point3 } from '@/components/iso/iso-kit';

export const WIDTH = 600;
export const HEIGHT = 400;
export const AZIMUTH = 58;
export const ELEVATION = 36;

export const BASE: Plan = { x: -112, y: -46, w: 224, d: 130, r: 8 };
export const BASE_H = 10;
export const FOOT_H = 5;

/** The backplate every module bolts to: Docker in the legend. */
export const MOUNT: Plan = { x: -104, y: -40, w: 208, d: 104, r: 4 };
export const STANDOFF_H = 4;
export const MOUNT_H = 3;
export const MOUNT_TOP = STANDOFF_H + MOUNT_H;

export const RAIL_X0 = -97;
export const RAIL_X1 = 97;
export const RAIL_FLANGE_TOP = MOUNT_TOP + 1.2;
export const RAIL_TOP = MOUNT_TOP + 4;

export const MODULE_Y0 = -30;
export const MODULE_Y1 = 30;
export const BODY_TOP = 33;
export const RAISED_Y = 12;
export const RAISED_TOP = 41;

export const LIMITER_X0 = -86;
export const LIMITER_W = 54;
export const BREAKER_W = 36;
export const BREAKER_X0 = [-28, 10, 48] as const;
export const COURSE = 1;
export const breakerCentre = (index: number) => BREAKER_X0[index]! + BREAKER_W / 2;

export const IN_X = LIMITER_X0 + 10;
export const OUT_X = LIMITER_X0 + LIMITER_W - 12;
export const SCREW_Y = 18;
export const COMB_Y = 22;
export const COMB_D = 5;
export const COMB_TOP = BODY_TOP + 3.2;

export const ENTRY_Z = 18;
export const CABLE_R = 2.2;
export const FEED_R = 2.8;
export const GLAND_Y = 52;
export const GLAND_TOP = MOUNT_TOP + 5.6;
export const FEED_GLAND: [number, number] = [-95, 50];

/** Toggle: a slider in a slot on the breaker's raised top. */
export const SLOT: Plan = { x: 4, y: -9, w: 11, d: 18, r: 1.6 };
export const HANDLE: Plan = { x: 5.5, y: -2.75, w: 8, d: 5.5, r: 1.1 };
export const HANDLE_H = 7;
export const HANDLE_TRAVEL = 5.5;

export const DIAL_R = 8.4;
export const DIAL_FACE_R = 7;
export const DIAL_H = 1.6;
export const NEEDLE = 5.6;
export const dialCentre = (index: number): [number, number] => [BREAKER_X0[index]! + 26, 0];
export const DIAL_FROM = (-120 * Math.PI) / 180;
export const DIAL_SPAN = (240 * Math.PI) / 180;

export const P = fitProjection(
  [...boxCorners(BASE, -BASE_H - FOOT_H, 0), ...boxCorners({ x: LIMITER_X0, y: MODULE_Y0, w: 170, d: 60, r: 0 }, 0, RAISED_TOP + HANDLE_H)],
  WIDTH,
  HEIGHT,
  { pad: 22, azimuth: AZIMUTH, elevation: ELEVATION },
);

export const at = (point: Point3): Flat => iso(point, P);

const PER_UNIT_Y = axisVector(P, [0, 1, 0]);
const fine = (value: number) => Math.round(value * 100) / 100;

/** Screen offset of the toggle handle; pos -1 is on (toward the back), 0 half, 1 off. */
export const handleAt = (pos: number) => {
  const units = pos * HANDLE_TRAVEL;
  return `translate(${fine(PER_UNIT_Y[0] * units)} ${fine(PER_UNIT_Y[1] * units)})`;
};

/** Tip of a dial needle: share 0 points at the zero mark, 1 at the last mark. */
export const needleTip = (cx: number, cy: number, length: number, share: number): [number, number] => {
  const a = DIAL_FROM + Math.max(0, Math.min(1, share)) * DIAL_SPAN;
  return [cx + Math.sin(a) * length, cy - Math.cos(a) * length];
};
