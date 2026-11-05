/*
 * The evidence gate as a pure model. Project facts come from the bioweave entry in
 * src/data/user-data.ts; the drawn object (five parts, five tags) is one example model.
 */

export const ONTOLOGIES = ['Uberon', 'Cell Ontology', 'Gene Ontology', 'Plant Ontology'] as const;
export const MODEL_PACKAGES = 94;
export const GENERATOR_BUILT = 76;

/** Parts of the drawn specimen; each one carries one tag pin on the sled. */
export const TAG_COUNT = 5;

/** Which tag the next fresh model arrives without, in turn. */
export const MISSING_ORDER = [3, 1, 4, 2, 0] as const;

/** Stations along the track: the bay under the builder and the inspector, and the Drafts tray. */
export type Station = 'bay' | 'tray';

/** Inspector stop: -1 is its parking spot, 0..TAG_COUNT-1 the tags. */
export interface Targets {
  sled: Station;
  /** 0 hidden, 1 shown: the sled fades out of the tray and back in at the builder. */
  shown: number;
  /** Builder head travel, 0 up, 1 down on the model. */
  head: number;
  /** Model parts built so far, 0..TAG_COUNT. */
  built: number;
  inspector: number;
  /** Loupe pushed toward the tag, 0..1. */
  reach: number;
  /** Gate lift, 0 shut, 1 open. */
  gate: number;
  /** Tags inspected and passed so far, in order. */
  checked: number;
  /** The tag that is missing, or -1. */
  missing: number;
  /** The missing tag being placed, 0 above the socket, 1 seated. */
  placed: number;
  /** The model on the sled has been inspected and refused. */
  refused: boolean;
}

export interface Key {
  at: number;
  set: Partial<Targets>;
  /** Jump the sled to its station instead of gliding (only while it is hidden). */
  jump?: boolean;
  say?: string;
  /** Phase words for the polite live region. */
  announce?: string;
}

export interface Cycle {
  keys: Key[];
  length: number;
}

const tag = (index: number) => `tag ${index + 1} of ${TAG_COUNT}`;

export const RESTING: Targets = {
  sled: 'bay',
  shown: 1,
  head: 0,
  built: TAG_COUNT,
  inspector: -1,
  reach: 0,
  gate: 0,
  checked: 0,
  missing: MISSING_ORDER[0],
  placed: 0,
  refused: false,
};

export const RESTING_READOUT = `${TAG_COUNT - 1} of ${TAG_COUNT} tags · gate shut`;

const STEP = 0.95;

function inspect(keys: Key[], from: number, missing: number) {
  let at = from;
  for (let index = 0; index < TAG_COUNT; index++) {
    keys.push({ at, set: { inspector: index, reach: 0 }, say: `reading ${tag(index)}` });
    if (index === missing) {
      keys.push({ at: at + 0.5, set: { reach: 1 } });
      keys.push({ at: at + 0.95, set: { reach: 0 }, say: `tag ${index + 1} missing · gate shut`, announce: `Tag ${index + 1} is missing, the gate stays shut` });
      keys.push({ at: at + 2.4, set: { inspector: -1 } });
      return at + 3.4;
    }
    keys.push({ at: at + 0.45, set: { reach: 1 } });
    keys.push({ at: at + 0.7, set: { reach: 0, checked: index + 1 }, say: `${tag(index)} · ID and source` });
    at += STEP;
  }
  return at;
}

/** A model is inspected; if it came from the tray, a fresh one is built from its spec first. It is refused for its missing tag. */
export function freshCycle(missing: number, fromTray: boolean): Cycle {
  const keys: Key[] = [];
  let at = 0;
  if (fromTray) {
    keys.push({ at: 0, set: { shown: 0 }, say: 'next spec' });
    keys.push({ at: 0.55, set: { sled: 'bay', built: 0, checked: 0, missing, placed: 0, inspector: -1, refused: false }, jump: true });
    keys.push({ at: 0.6, set: { shown: 1 } });
    keys.push({ at: 1.0, set: { head: 1 }, say: 'building from spec', announce: 'Building a model from its spec' });
    for (let part = 1; part <= TAG_COUNT; part++) keys.push({ at: 1.2 + part * 0.2, set: { built: part }, say: `building · part ${part} of ${TAG_COUNT}` });
    keys.push({ at: 2.5, set: { head: 0 }, say: 'built · builder clear' });
    at = 3.0;
  }
  const end = inspect(keys, at, missing);
  keys.push({ at: end - 1, set: { refused: true } });
  return { keys, length: end };
}

/** The missing tag is added, every tag passes, the gate lifts and the model lands in Drafts. */
export function fixCycle(missing: number): Cycle {
  const keys: Key[] = [];
  keys.push({ at: 0, set: { placed: 1, checked: 0 }, say: `${tag(missing)} added`, announce: `Tag ${missing + 1} added` });
  keys.push({ at: 0.6, set: { missing: -1, refused: false } });
  const done = inspect(keys, 1.0, -1);
  keys.push({ at: done, set: { gate: 1, inspector: -1 }, say: `${TAG_COUNT} of ${TAG_COUNT} checked · gate open`, announce: 'Every tag checked, the gate opens' });
  keys.push({ at: done + 1.1, set: { sled: 'tray' }, say: 'to Drafts' });
  keys.push({ at: done + 2.8, set: { gate: 0 }, say: 'in Drafts · awaiting review', announce: 'The model lands in Drafts, awaiting human review' });
  return { keys, length: done + 3.8 };
}

/** The next cycle from where the bench stands: inspect, then fix and pass, then the next spec. */
export function nextCycle(state: Targets, fresh: number): Cycle {
  const cycle =
    state.sled === 'bay' && state.missing >= 0
      ? state.refused
        ? fixCycle(state.missing)
        : freshCycle(state.missing, false)
      : freshCycle(MISSING_ORDER[fresh % MISSING_ORDER.length]!, true);
  return { ...cycle, keys: [...cycle.keys].sort((a, b) => a.at - b.at) };
}
