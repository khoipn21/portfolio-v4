export const TRAVEL_MM = 4;
export const ACTUATION_MM = 2;
export const PRELOAD_CN = 30;
export const RATE_CN_PER_MM = 7.5;

export const forceAt = (mm: number) => PRELOAD_CN + RATE_CN_PER_MM * mm;
export const isDown = (mm: number) => mm >= ACTUATION_MM;

export const RESTING_READOUT = '0.0 mm · open';

export function readoutOf(mm: number) {
  if (mm < 0.05) return RESTING_READOUT;
  const force = Math.round(forceAt(mm));
  return `${mm.toFixed(1)} mm · ${force} cN · ${isDown(mm) ? 'key down' : 'open'}`;
}
