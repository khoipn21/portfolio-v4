import { boxCorners, fitProjection, iso, translateAlong, type Flat, type Plan, type Point3 } from '@/components/iso/iso-kit';
import { PAGE_SIZE } from './model';

export const WIDTH = 600;
export const HEIGHT = 360;
export const AZIMUTH = 66;
export const ELEVATION = 30;

/* Bench plate on four feet. */
export const PLATE: Plan = { x: -164, y: -50, w: 328, d: 100, r: 8 };
export const PLATE_H = 10;
export const FOOT_H = 5;

/* The lane every moving part shares: the book stands on z = LANE_Z and travels along +x at y = LANE_Y. */
export const LANE_Y = -4;
export const LANE_Z = 8;

/* Card catalog cabinet, drawers on its +y face. */
export const CABINET: Plan = { x: -154, y: -40, w: 56, d: 58, r: 1.5 };
export const FACE_Y = CABINET.y + CABINET.d;
export const PLINTH_H = 6;
export const BODY_TOP = 78;
export const CAP_H = 4;
export const DRAWER_COLS: [number, number][] = [
  [-151, -127],
  [-125, -101],
];
export const DRAWER_ROWS: [number, number][] = [
  [9, 30],
  [33, 54],
  [57, 75],
];
/* The search drawer: right column, middle row. */
export const SEARCH_COL = 1;
export const SEARCH_ROW = 1;
export const DRAWER_TRAVEL = 26;
export const DRAWER_DEPTH = 40;
export const CARD_RISE = 9;
export const CARD_COUNT = PAGE_SIZE;
export const CARD_PITCH = 2.1;
export const MATCH_CARD = 4;

/* Book rack: twelve books standing on a plinth, spines facing +x toward the rail. */
export const BOOK_DEPTH = 24;
export const RACK_X = -88;
export const BOOK_X0 = RACK_X + 4;
export const SPINE_X = BOOK_X0 + BOOK_DEPTH;
export const RACK_FRONT = SPINE_X + 3;
const THICK = [4.4, 5.2, 3.8, 4.8, 4.2, 5.6, 4.0, 5, 4.6, 3.8, 5.2, 4.4];
const TALL = [30, 26, 33, 28, 31, 25, 29, 32, 27, 34, 28, 30];
export const SLOT = 7;
const GAP = 0.5;
const offsets = THICK.map((_, index) => THICK.slice(0, index).reduce((sum, t) => sum + t + GAP, 0));
const shift = LANE_Y - (offsets[SLOT]! + THICK[SLOT]! / 2);
export const BOOKS = THICK.map((t, index) => ({ y: offsets[index]! + shift, t, h: TALL[index]! }));
export const BOOK = BOOKS[SLOT]!;
export const RACK: Plan = { x: RACK_X, y: BOOKS[0]!.y - 3, w: RACK_FRONT - RACK_X, d: BOOKS[11]!.y + BOOKS[11]!.t - BOOKS[0]!.y + 6, r: 1.2 };

/* Trolley: the shared tray. */
export const TRAY: Plan = { x: -12, y: -28, w: 46, d: 46, r: 2.5 };
export const TRAY_WALL = 2;
export const TRAY_TOP = LANE_Z + 10;
export const READER_Y = TRAY.y - 4;
export const READER_TOP = 36;

/* Press with its in tray, bed, slip, latch and keyed lock. */
export const IN_TRAY: Plan = { x: 50, y: LANE_Y - 8, w: 36, d: 16, r: 1.5 };
export const PRESS: Plan = { x: 88, y: -42, w: 64, d: 72, r: 3 };
export const PRESS_H = 16;
export const BED: Plan = { x: 92, y: -28, w: 56, d: 32, r: 1.5 };
export const BED_TOP = PRESS_H + 3;
export const RAM: [number, number] = [121, -9];
export const COLUMN: Plan = { x: 110, y: -42, w: 22, d: 14, r: 2 };
export const HEAD: Plan = { x: 106, y: -42, w: 30, d: 46, r: 3 };
export const HEAD_Z = 72;
export const HEAD_H = 16;
export const STAMP_Z = 42;
export const STAMP_H = 8;
export const STAMP_HALF = 7;
export const SLIP_Z = BED_TOP + 0.6;
export const DIE_H = 1.5;
export const STROKE = STAMP_Z - DIE_H - SLIP_Z;
export const SLIP_PITCH = 10;
export const SLIP: Plan = { x: RAM[0] - 8, y: RAM[1] - 7, w: 34, d: 14, r: 0.6 };
export const LATCH: Plan = { x: SLIP.x - SLIP_PITCH - 4.4, y: RAM[1] - 4, w: 3.6, d: 8, r: 0.6 };
export const LATCH_TRAVEL = 13;
export const LOCK: Plan = { x: 106, y: PRESS.y + PRESS.d, w: 22, d: 3, r: 0.8 };
export const KEY_AT: Point3 = [117, LOCK.y + LOCK.d + 3.2, 8];

/* Book positions along the lane: 0 at rest in the rack, 1 in the tray, 2 in the press in tray. */
export const BOOK_STOPS = [BOOK_X0, TRAY.x + 11, IN_TRAY.x + 7];
export const bookXAt = (share: number) => {
  const first = Math.min(share, 1);
  const second = Math.max(share - 1, 0);
  return BOOK_X0 + (BOOK_STOPS[1]! - BOOK_STOPS[0]!) * first + (BOOK_STOPS[2]! - BOOK_STOPS[1]!) * second;
};

export const P = fitProjection(
  [
    ...boxCorners(PLATE, -PLATE_H - FOOT_H, 0),
    ...boxCorners(CABINET, 0, BODY_TOP + CAP_H),
    ...boxCorners(HEAD, HEAD_Z, HEAD_Z + HEAD_H + 6),
    [DRAWER_COLS[1]![0], FACE_Y + DRAWER_TRAVEL + 3, 33],
  ],
  WIDTH,
  HEIGHT,
  { pad: 22, azimuth: AZIMUTH, elevation: ELEVATION },
);

export const at = (point: Point3): Flat => iso(point, P);
export const move = (by: Point3) => translateAlong(P, by);
