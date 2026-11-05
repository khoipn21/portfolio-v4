import { axisVector, boxCorners, fitProjection, iso, type Flat, type Plan, type Point3 } from '@/components/iso/iso-kit';
import { TRAVEL_MM } from './model';

export const WIDTH = 600;
export const HEIGHT = 420;
export const AZIMUTH = 40;
export const ELEVATION = 24;
export const UNITS_PER_MM = 4;
export const TRAVEL = TRAVEL_MM * UNITS_PER_MM;

export const PLATE: Plan = { x: -124, y: -66, w: 240, d: 124, r: 8 };
export const PLATE_H = 10;
export const FOOT_H = 5;

export const PCB: Plan = { x: -106, y: -52, w: 204, d: 96, r: 3 };
export const STANDOFF_H = 6;
export const PCB_H = 4;
export const PCB_TOP = STANDOFF_H + PCB_H;

export const SW: [number, number] = [-56, -6];
export const HOUSING_HALF = 28;
export const HOUSING: Plan = { x: SW[0] - HOUSING_HALF, y: SW[1] - HOUSING_HALF, w: HOUSING_HALF * 2, d: HOUSING_HALF * 2, r: 2.5 };
export const FLOOR = PCB_TOP + 12;
export const WALL = 3;
export const WALL_TOP = 58;

export const SLIDER_HALF = 8;
export const SLIDER_Z = 46;
export const SLIDER_H = 10;
export const SLIDER_TOP = SLIDER_Z + SLIDER_H;
export const POLE_R = 2.4;
export const SPRING_R = 11;
export const SPRING_WIRE_TURNS = 6.5;

export const SHAFT_R = 3.2;
export const CAP_Z = 82;
export const CAP_HALF = 36;
export const SKIRT_H = 14;
export const CROWN_INSET = 6;
export const CROWN_H = 6;
export const CAP_TOP = CAP_Z + SKIRT_H + CROWN_H;

export const BEAM_X = SW[0] + 18;
export const BEAM_Z = 32;
export const TOWER_GAP = 5;
export const TOWER_Y = 4;
export const TOWER_TOP = 36;
export const BLADE_BOTTOM = BEAM_Z + 2 * UNITS_PER_MM;

export const P = fitProjection(
  [
    ...boxCorners(PLATE, -PLATE_H - FOOT_H, 0),
    ...boxCorners({ x: SW[0] - CAP_HALF, y: SW[1] - CAP_HALF, w: CAP_HALF * 2, d: CAP_HALF * 2, r: 0 }, CAP_Z, CAP_TOP),
  ],
  WIDTH,
  HEIGHT,
  { pad: 26, azimuth: AZIMUTH, elevation: ELEVATION },
);

export const at = (point: Point3): Flat => iso(point, P);

const PER_UNIT_DOWN = axisVector(P, [0, 0, -1]);
const fine = (value: number) => Math.round(value * 100) / 100;

export const downBy = (units: number) => `translate(${fine(PER_UNIT_DOWN[0] * units)} ${fine(PER_UNIT_DOWN[1] * units)})`;
