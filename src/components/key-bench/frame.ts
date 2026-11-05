import { cylinder, iso, pathOf, solidSvg, towardViewer, type Flat } from '@/components/iso/iso-kit';
import { FLOOR, P, POLE_R, SLIDER_Z, SPRING_R, SPRING_WIRE_TURNS, SW } from './view';

const PER_TURN = 28;
const [VX, VY] = towardViewer(P);

export interface SpringFrame {
  back: string;
  front: string;
}

export function springAt(down: number): SpringFrame {
  const from = FLOOR + 0.6;
  const to = SLIDER_Z - down - 0.6;
  const count = Math.round(SPRING_WIRE_TURNS * PER_TURN);
  const back: Flat[][] = [];
  const front: Flat[][] = [];
  let run: Flat[] = [];
  let facing: boolean | null = null;
  for (let step = 0; step <= count; step++) {
    const t = step / count;
    const angle = t * SPRING_WIRE_TURNS * Math.PI * 2;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const point = iso([SW[0] + SPRING_R * cos, SW[1] + SPRING_R * sin, from + (to - from) * t], P);
    const near = cos * VX + sin * VY > 0;
    if (facing === null) facing = near;
    if (near !== facing) {
      run.push(point);
      (facing ? front : back).push(run);
      run = [point];
      facing = near;
    } else run.push(point);
  }
  if (run.length > 1) (facing ? front : back).push(run);
  return { back: back.map((points) => pathOf(points)).join(''), front: front.map((points) => pathOf(points)).join('') };
}

export function poleAt(down: number) {
  const height = SLIDER_Z - down - FLOOR;
  return solidSvg(cylinder(SW[0], SW[1], POLE_R, FLOOR, Math.max(height, 0.1), P, 20), { tone: 'mid', crease: 'none' });
}

