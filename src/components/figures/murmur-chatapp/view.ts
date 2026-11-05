import { boxCorners, fitProjection, iso, sideMatrix, type Flat, type Plan, type Point3 } from '@/components/iso/iso-kit';
import { PAGE_SIZE } from './model';

export const WIDTH = 600;
export const HEIGHT = 290;
export const AZIMUTH = 58;
export const ELEVATION = 30;

/* One message is one embossed group on the tape, SPACING units apart, so a page of history is a marked length. */
export const SPACING = 3.6;
export const PAGE_LEN = SPACING * PAGE_SIZE;
export const TAPE_H = 9;
export const TAPE_T = 0.6;

export const PLATE: Plan = { x: -146, y: -58, w: 292, d: 110, r: 8 };
export const PLATE_H = 10;
export const FOOT_H = 5;

/* Shared take-up spool: the history tape winds on the lower deck from the front, the live tape on the upper deck from the back. */
export const SPOOL: [number, number] = [-108, -8];
export const SPOOL_COIL = 29;
export const SPOOL_FLANGE = 32;
export const HIST_Y = SPOOL[1] + SPOOL_COIL;
export const LIVE_Y = SPOOL[1] - SPOOL_COIL;
export const HIST_Z = 2.4;
export const MID_FLANGE_Z = HIST_Z + TAPE_H;
export const LIVE_Z = MID_FLANGE_Z + 1.6;
export const UPPER_FLANGE_Z = LIVE_Z + TAPE_H;

/* Archive reel: its coil radius makes one crank turn pay out exactly one page of tape. */
export const ARCHIVE_COIL = PAGE_LEN / (Math.PI * 2);
export const ARCHIVE: [number, number] = [96, HIST_Y - ARCHIVE_COIL];
export const ARCHIVE_FLANGE = ARCHIVE_COIL + 3;
export const ARCHIVE_TOP = HIST_Z + TAPE_H + 1.2;
export const HUB_TOP = ARCHIVE_TOP + 2.8;
export const CRANK_Z = HUB_TOP;
export const CRANK_LEN = 16;

export const HIST_RAIL: Plan = { x: -84, y: HIST_Y - 4.5, w: 154, d: 7, r: 1 };
export const LIVE_RAIL: Plan = { x: -90, y: LIVE_Y - 5, w: 122, d: 8, r: 1 };
export const LIVE_RAIL_Z = LIVE_Z - 3;
export const BRACKET: Plan = { x: 31, y: LIVE_Y - 8, w: 9, d: 16, r: 1.2 };

export const REGISTER: Plan = { x: 40, y: LIVE_Y - 11, w: 72, d: 24, r: 2 };
export const REG_TOP = 26;
export const COILS: [number, number][] = [
  [60, LIVE_Y],
  [76, LIVE_Y],
];
export const COIL_TOP = REG_TOP + 13.4;
export const ARM_Z = COIL_TOP + 1.6;
export const ARM_H = 3;
export const PIVOT_X = 100;
export const PRINT_X = 30;
/* The stylus drops 3 units onto the tape edge at the print point when the armature closes on the coils. */
export const STRIKE = 3;
export const TILT = STRIKE / (PIVOT_X - PRINT_X);
export const STYLUS_LOW = LIVE_Z + TAPE_H + STRIKE;
export const SPRING_AT: [number, number] = [90, LIVE_Y];
export const SPRING_SEAT = 1.2;

export const GATE_X = 40;
export const DIAL_R = 8.5;
export const DIAL: [number, number] = [GATE_X, HIST_Y + 17];
export const DIAL_TOP = 6;

export const LIVE_FROM = SPOOL[0];
export const HIST_FROM = SPOOL[0];
export const HIST_TO = ARCHIVE[0];

export const P = fitProjection(
  [...boxCorners(PLATE, -PLATE_H - FOOT_H, 0), ...boxCorners({ x: REGISTER.x - 14, y: REGISTER.y, w: REGISTER.w + 4, d: REGISTER.d, r: 0 }, 0, ARM_Z + ARM_H)],
  WIDTH,
  HEIGHT,
  { pad: 14, azimuth: AZIMUTH, elevation: ELEVATION },
);

export const at = (point: Point3): Flat => iso(point, P);

/* Local (u, v) on a tape face: u is world x, v is minus world z. */
export const histFace = sideMatrix([0, HIST_Y + TAPE_T / 2], 0, P, 'left');
export const liveFace = sideMatrix([0, LIVE_Y + TAPE_T / 2], 0, P, 'left');

/* Where the stylus meets the tape: the centre of the strike glow. */
export const PRINT_POINT = at([PRINT_X, LIVE_Y, LIVE_Z + TAPE_H]);
