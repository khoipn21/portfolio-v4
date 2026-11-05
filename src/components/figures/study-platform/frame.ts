import { lineOnTop } from '@/components/iso/iso-kit';
import { COURSE, DIAL_H, NEEDLE, P, RAISED_TOP, dialCentre, needleTip } from './view';

/** The course breaker's failure needle; share 1 sits on the trip mark. */
export function needleAt(share: number) {
  const [cx, cy] = dialCentre(COURSE);
  return lineOnTop([cx, cy], needleTip(cx, cy, NEEDLE, share), RAISED_TOP + DIAL_H, P);
}
