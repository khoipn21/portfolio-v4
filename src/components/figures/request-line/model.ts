export type Stop = 'counter' | 'rack' | 'cabinet';

export const SLOTS = 6;
export const TOUR_KEYS = [3, 5, 3, 1, 6, 5, 2, 8, 3, 7, 4, 1, 6, 2, 5, 3];

export interface Cache {
  slots: (number | null)[];
  used: number[];
  tick: number;
}

export const emptyCache = (): Cache => ({ slots: Array(SLOTS).fill(null), used: Array(SLOTS).fill(0), tick: 0 });

export const warmCount = (cache: Cache) => cache.slots.filter((key) => key !== null).length;

export function lookup(cache: Cache, key: number) {
  return cache.slots.indexOf(key);
}

export function touch(cache: Cache, slot: number): Cache {
  const used = [...cache.used];
  used[slot] = cache.tick + 1;
  return { ...cache, used, tick: cache.tick + 1 };
}

/** Files `key`, taking an empty slot first and otherwise the least recently used one. */
export function store(cache: Cache, key: number) {
  let slot = cache.slots.indexOf(null);
  if (slot < 0) slot = cache.used.indexOf(Math.min(...cache.used));
  const evicted = cache.slots[slot] ?? null;
  const slots = [...cache.slots];
  slots[slot] = key;
  return { cache: touch({ ...cache, slots }, slot), slot, evicted };
}

export interface Trip {
  key: number;
  hit: boolean;
  route: Stop[];
  hops: number;
}

/** Cache aside: Go asks Redis first; a miss reads Postgres and files a copy in Redis before answering. */
export function tripFor(cache: Cache, key: number): Trip {
  const hit = lookup(cache, key) >= 0;
  const route: Stop[] = hit ? ['counter', 'rack', 'counter'] : ['counter', 'rack', 'cabinet', 'rack', 'counter'];
  return { key, hit, route, hops: route.length - 1 };
}

export const restingReadout = (cache: Cache) => `cache ${warmCount(cache)} of ${SLOTS} · ready`;

export const RESTING_READOUT = restingReadout(emptyCache());

export function hopReadout(trip: Trip, hop: number) {
  const k = `key ${trip.key}`;
  if (hop === 0) return `${k} · checking Redis`;
  if (trip.hit) return `${k} · hit · back to Next.js`;
  if (hop === 1) return `${k} · miss · reading Postgres`;
  if (hop === 2) return `${k} · filing a copy in Redis`;
  return `${k} · back to Next.js`;
}

export const doneReadout = (trip: Trip, cache: Cache) =>
  `key ${trip.key} · ${trip.hit ? 'hit' : 'miss'} · ${trip.hops} hops · cache ${warmCount(cache)} of ${SLOTS}`;
