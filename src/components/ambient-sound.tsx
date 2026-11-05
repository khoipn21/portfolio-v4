'use client';

import { useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'portfolio-sound';
const SOURCE = '/audio/ambient-loop.mp3';
const VOLUME = 0.4;
const FADE_SECONDS = 0.6;

type Engine = { ctx: AudioContext; gain: GainNode };

function readPreference() {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'on';
  } catch {
    return false;
  }
}

function writePreference(on: boolean) {
  try {
    localStorage.setItem(STORAGE_KEY, on ? 'on' : 'off');
  } catch {}
}

// Web Audio gives a gapless loop and a gain node that also works on iOS,
// where HTMLMediaElement.volume is read only.
async function createEngine(): Promise<Engine> {
  const ctx = new AudioContext();
  const gain = ctx.createGain();
  gain.gain.value = 0;
  gain.connect(ctx.destination);
  const response = await fetch(SOURCE);
  if (!response.ok) throw new Error(`Ambient track failed to load (${response.status})`);
  const buffer = await ctx.decodeAudioData(await response.arrayBuffer());
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  source.connect(gain);
  source.start();
  return { ctx, gain };
}

function rampTo({ ctx, gain }: Engine, value: number) {
  const now = ctx.currentTime;
  gain.gain.cancelScheduledValues(now);
  gain.gain.setValueAtTime(gain.gain.value, now);
  gain.gain.setTargetAtTime(value, now, FADE_SECONDS / 3);
}

export function AmbientSound() {
  const engineRef = useRef<Promise<Engine> | null>(null);
  const playingRef = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  const start = async () => {
    try {
      engineRef.current ??= createEngine();
      const engine = await engineRef.current;
      await engine.ctx.resume();
      rampTo(engine, VOLUME);
      playingRef.current = true;
      setPlaying(true);
      setFailed(false);
      return true;
    } catch {
      engineRef.current = null;
      setFailed(true);
      return false;
    }
  };

  const stop = async () => {
    playingRef.current = false;
    setPlaying(false);
    const engine = await engineRef.current;
    if (!engine) return;
    rampTo(engine, 0);
    window.setTimeout(() => {
      if (!playingRef.current) void engine.ctx.suspend();
    }, FADE_SECONDS * 1500);
  };

  useEffect(() => {
    if (!readPreference()) return;
    // Browsers only allow audio after a user gesture, so resume on the first one.
    const resume = (event: Event) => {
      const fromToggle =
        event.target instanceof Element && event.target.closest('.sound-toggle') !== null;
      if (!fromToggle) void start();
      window.removeEventListener('pointerdown', resume);
      window.removeEventListener('keydown', resume);
    };
    window.addEventListener('pointerdown', resume);
    window.addEventListener('keydown', resume);
    return () => {
      window.removeEventListener('pointerdown', resume);
      window.removeEventListener('keydown', resume);
    };
  }, []);

  useEffect(() => {
    const onVisibility = async () => {
      const engine = await engineRef.current;
      if (!engine || !playingRef.current) return;
      if (document.hidden) void engine.ctx.suspend();
      else void engine.ctx.resume();
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      void engineRef.current?.then((engine) => engine.ctx.close()).catch(() => {});
    };
  }, []);

  const toggle = async () => {
    if (playingRef.current) {
      await stop();
      writePreference(false);
    } else if (await start()) {
      writePreference(true);
    }
  };

  return (
    <button
      type="button"
      className="sound-toggle print-hidden"
      aria-pressed={playing}
      aria-label="Ambient sound"
      title={failed ? 'Sound could not start. Try again.' : undefined}
      onClick={toggle}
    >
      <span className="sound-bars" data-playing={playing} aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </span>
      <span className="sound-label" aria-hidden="true">
        Sound <strong>{failed ? 'retry' : playing ? 'on' : 'off'}</strong>
      </span>
    </button>
  );
}
