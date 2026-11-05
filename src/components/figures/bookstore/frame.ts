import * as G from '@/components/iso/lathe.mjs';
import { solidSvg } from '@/components/iso/iso-kit';
import { KEY_AT, LOCK, P } from './view';

/* The key turns about its own axis, which points out of the lock face (+y). Its frame has u = -x and v = +z. */
const FACE = LOCK.y + LOCK.d;
const F = G.frameAlong([KEY_AT[0], FACE, KEY_AT[2]], [0, 1, 0]);
const BLADE: [number, number, number] = [2.6, 0.9, 0];
const BOW: [number, number, number] = [7.6, 1.4, 1.2];

/** A chamfered rectangle `long` by `wide`, its long side turned `angle` from vertical, in the key frame's (u, v). */
function section([long, wide, chamfer]: [number, number, number], angle: number): [number, number][] {
  const along: [number, number] = [Math.sin(angle), Math.cos(angle)];
  const across: [number, number] = [Math.cos(angle), -Math.sin(angle)];
  const a = long / 2;
  const b = wide / 2;
  const c = Math.min(chamfer, b * 0.9);
  const corners: [number, number][] = c
    ? [
        [a - c, b],
        [a, b - c],
        [a, -b + c],
        [a - c, -b],
        [-a + c, -b],
        [-a, -b + c],
        [-a, b - c],
        [-a + c, b],
      ]
    : [
        [a, b],
        [a, -b],
        [-a, -b],
        [-a, b],
      ];
  return corners.map(([s, t]) => {
    const x = along[0] * s + across[0] * t;
    const z = along[1] * s + across[1] * t;
    return [-x, z];
  });
}

/** The key at `turn` in [0, 1]: 0 is the user position, 1 a quarter turn on, the admin position. */
export function keyAt(turn: number) {
  const angle = (Math.PI / 2) * turn;
  const blade = G.prismOf(F, section(BLADE, angle), 0, 2.6, P);
  const bow = G.prismOf(F, section(BOW, angle), 2.6, 5.4, P);
  return solidSvg(blade, { tone: 'mid', crease: 'none' }) + solidSvg(bow, { tone: 'hi' });
}
