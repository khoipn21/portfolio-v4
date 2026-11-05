import { axisVector, boxCorners, fitProjection, iso, type Flat, type Plan, type Point3 } from '@/components/iso/iso-kit';
import type { Station } from './model';
import { TAG_COUNT } from './model';

export const WIDTH = 600;
export const HEIGHT = 404;
export const AZIMUTH = 58;
export const ELEVATION = 30;

/* Bench */
export const PLATE: Plan = { x: -56, y: -52, w: 202, d: 106, r: 8 };
export const PLATE_H = 10;
export const FOOT_H = 5;

/* Track: two rails along x carry the sled from the bay to the tray mouth. */
export const RAIL_TOP = 3;
export const RAILS: Plan[] = [
  { x: -34, y: -11, w: 104, d: 4, r: 1 },
  { x: -34, y: 15, w: 104, d: 4, r: 1 },
];

/* Sled, in its own coordinates (x about its centre); it only moves along x. */
export const SLED: Plan = { x: -31, y: -17, w: 62, d: 42, r: 3 };
export const SLED_Z = RAIL_TOP;
export const SLED_H = 4;
export const SLED_TOP = SLED_Z + SLED_H;
export const STATION_X: Record<Station, number> = { bay: 0, tray: 104 };

/* Tag bar along the sled's front, one pin and one standing tag per model part. */
export const TAG_BAR: Plan = { x: -30, y: 12, w: 60, d: 8, r: 1.2 };
export const TAG_BAR_TOP = SLED_TOP + 2;
export const TAG_Y = 16;
export const TAG_PIN_R = 1.1;
export const TAG_LOW = TAG_BAR_TOP + 3.6;
export const TAG_HIGH = TAG_LOW + 5.6;
export const TAG_HALF = 3.6;
export const TAG_T = 0.8;
export const TAG_FACE = TAG_Y + TAG_T / 2;
export const TAG_MID = (TAG_LOW + TAG_HIGH) / 2;
export const TAG_XS = Array.from({ length: TAG_COUNT }, (_, index) => (index - (TAG_COUNT - 1) / 2) * 12);
export const PIN_DROP = 12;

/* The specimen, a five part turned model at the back of the sled. */
export const MODEL_AT: [number, number] = [0, -5];
export const PLINTH_R = 11;
export const PLINTH_TOP = SLED_TOP + 3;
export const STEM_R = 3.2;
export const STEM_TOP = PLINTH_TOP + 5;
/** The bud, turned: a swelling that peaks low and closes at the tip. s is the height above the cup. */
const BUD_HEIGHT = 10.8;
const BUD_SWELL = 7.7;
const budAngle = (s: number) => Math.PI * (0.33 + (0.61 * s) / BUD_HEIGHT);
export const budRadius = (s: number) => BUD_SWELL * Math.sin(budAngle(s));
export const budSlope = (s: number) => ((BUD_SWELL * Math.PI * 0.61) / BUD_HEIGHT) * Math.cos(budAngle(s));
export const BUD: Array<[number, number]> = [0, 3, BUD_HEIGHT].map((s) => [s, budRadius(s)]);
export const CUP_R = BUD[0]![1];
export const CUP_TOP = STEM_TOP + 4;
export const TIP_R = 1.2;
export const TIP_FROM = CUP_TOP + BUD[BUD.length - 1]![0];
export const TIP_TOP = TIP_FROM + 2.6;

/* Builder: a column at the back with an arm out over the bay and a slide head. */
export const BUILD_COL: [number, number] = [STATION_X.bay + MODEL_AT[0], -40];
export const BUILD_COL_R = 4.2;
export const ARM_Z = 64;
export const ARM_H = 6;
export const HEAD_DROP = 8;
export const NOZZLE_TIP = TIP_TOP + HEAD_DROP + 3;

/* Gate across the track, between the bay and the tray. */
export const GATE_X = 44;
export const GATE_T = 3;
export const POST = 5;
export const POST_BACK: Plan = { x: GATE_X - 1, y: -27, w: POST, d: POST, r: 1 };
export const POST_FRONT: Plan = { x: GATE_X - 1, y: 29, w: POST, d: POST, r: 1 };
export const POST_TOP = 60;
export const BAR: Plan = { x: GATE_X - 2, y: -28, w: 7, d: 63, r: 1.2 };
export const BAR_H = 4;
export const GATE_PLAN: Plan = { x: GATE_X, y: -21, w: GATE_T, d: 49, r: 0.6 };
export const GATE_Z = RAIL_TOP + 1;
export const GATE_H = 22;
export const GATE_LIFT = 32;
export const LUG_YS = [-11, 18];
export const GATE_TOP = GATE_Z + GATE_H;
export const LUG_TOP = GATE_TOP + 2.4;
export const CABLE_X = GATE_X + GATE_T / 2;

/* Drafts tray at the end of the track. */
export const TRAY: Plan = { x: 72, y: -23, w: 66, d: 54, r: 3 };
export const TRAY_WALL = 2.6;
export const TRAY_H = 12;
export const TRAY_FLOOR = RAIL_TOP;

/* Inspector: its own rail along the front, a carriage, a post and a loupe arm. */
export const INSPECT_RAIL: Plan = { x: -52, y: 39, w: 86, d: 7, r: 1.4 };
export const INSPECT_Y = INSPECT_RAIL.y + INSPECT_RAIL.d / 2;
export const INSPECT_PARK = -44;
export const LOUPE_Y = TAG_FACE + 6.2;
export const LOUPE_R = 3.4;
export const LOUPE_REACH = 2;

export const P = fitProjection(
  [...boxCorners(PLATE, -PLATE_H - FOOT_H, 0), ...boxCorners(BAR, POST_TOP, POST_TOP + BAR_H + 6), [BUILD_COL[0], BUILD_COL[1], ARM_Z + ARM_H + 4]],
  WIDTH,
  HEIGHT,
  { pad: 18, azimuth: AZIMUTH, elevation: ELEVATION },
);

export const at = (point: Point3): Flat => iso(point, P);

const fine = (value: number) => Math.round(value * 100) / 100;
const moveBy = (axis: Point3) => {
  const [x, y] = axisVector(P, axis);
  return (units: number) => (Math.abs(units) < 0.005 ? '' : `translate(${fine(x * units)} ${fine(y * units)})`);
};

export const alongX = moveBy([1, 0, 0]);
export const alongY = moveBy([0, 1, 0]);
export const alongZ = moveBy([0, 0, 1]);
