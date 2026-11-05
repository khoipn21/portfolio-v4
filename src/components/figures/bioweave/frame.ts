import { segment } from '@/components/iso/iso-kit';
import { CABLE_X, LUG_TOP, LUG_YS, P, POST_TOP } from './view';

/** The two lift cables, from the lugs on the gate plate up to the sheaves on the crossbar. */
export function cablesAt(lift: number) {
  return LUG_YS.map((y) => segment([CABLE_X, y, LUG_TOP + lift], [CABLE_X, y, POST_TOP + 0.2], P)).join('');
}
