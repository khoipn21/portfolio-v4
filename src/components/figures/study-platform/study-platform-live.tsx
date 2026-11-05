'use client';
/* eslint-disable react/no-danger -- every injected string is SVG built by ./art and ./frame from numbers, never from user input */

import * as React from 'react';
import type { StudyPlatformArt } from './art';
import { needleAt } from './frame';
import { MAX_FAILURES, RESET_TIMEOUT_S, RETRY_ATTEMPTS, WAIT_SPEEDUP, admit, delayBeforeMs, freshBreaker, readoutOf, record } from './model';
import { HEIGHT, WIDTH, handleAt } from './view';

const REST_NEEDLE = needleAt(0);
/** Screen time one attempt stays in flight before it fails; drawing pace only. */
const ATTEMPT_S = 0.32;
/** Gap between failing calls while the figure plays on its own. */
const TOUR_GAP = 0.6;
/** Pause after the breaker closes before the tour fails the next call. */
const TOUR_REST = 3;
/** Pause after the open wait ends before ordinary traffic sends the trial call. */
const TRIAL_AFTER = 0.7;
const REFUSED_S = 1.1;
const IDLE_BACK = 6000;
const MOST_DT = 1 / 30;

interface Call {
  ok: boolean;
  attempt: number;
  /** Seconds left before this attempt starts (the retry backoff), then seconds left in flight. */
  wait: number;
  flying: boolean;
}

interface Props {
  art: StudyPlatformArt;
  label: string;
}

const Layer = ({ html }: { html: string }) => <g dangerouslySetInnerHTML={{ __html: html }} />;

export function StudyPlatformLive({ art, label }: Props) {
  const stage = React.useRef<HTMLDivElement>(null);
  const handle = React.useRef<SVGGElement>(null);
  const needle = React.useRef<SVGPathElement>(null);
  const lampGroup = React.useRef<SVGGElement>(null);

  React.useEffect(() => {
    const root = stage.current;
    if (!root) return;
    const readout = root.closest('.iso-plate')?.querySelector('[data-readout]');
    const lamps = Array.from(lampGroup.current?.querySelectorAll<SVGPathElement>('[data-lamp]') ?? []);
    const still = window.matchMedia('(prefers-reduced-motion: reduce)');
    const breaker = freshBreaker();
    let call: Call | null = null;
    let lit = -1;
    let failed = 0;
    let refused = 0;
    let queued = 0;
    let gap = TOUR_GAP;
    let trialIn = TRIAL_AFTER;
    let touring = !still.matches;
    let hand = -1;
    let handRate = 0;
    let share = 0;
    let glow = 0;
    let shownHand = NaN;
    let shownShare = NaN;
    let shownLamps = '';
    let visible = false;
    let frame = 0;
    let last = 0;
    let idle = 0;

    const send = (ok: boolean) => {
      if (call) return;
      if (!admit(breaker)) {
        refused = REFUSED_S;
        return;
      }
      call = { ok, attempt: 1, wait: delayBeforeMs(1) / 1000, flying: false };
      failed = 0;
      if (still.matches) finishInstantly();
    };

    /** Under reduced motion a call resolves at once, as the gateway would see it after its retries. */
    const finishInstantly = () => {
      if (!call) return;
      record(breaker, call.ok);
      failed = call.ok ? 0 : RETRY_ATTEMPTS;
      call = null;
    };

    const step = (dt: number) => {
      if (refused > 0) refused = Math.max(0, refused - dt);
      if (breaker.state === 'open') breaker.sinceFail += dt * WAIT_SPEEDUP;
      if (call) {
        call.wait -= dt;
        if (call.wait <= 0) {
          if (!call.flying) {
            call.flying = true;
            call.wait = ATTEMPT_S;
            lit = call.attempt - 1;
          } else if (call.ok) {
            record(breaker, true);
            call = null;
            lit = -1;
            gap = TOUR_REST;
          } else {
            failed = call.attempt;
            lit = -1;
            if (call.attempt >= RETRY_ATTEMPTS) {
              record(breaker, false);
              call = null;
              gap = TOUR_GAP;
            } else {
              call.attempt += 1;
              call.flying = false;
              call.wait = delayBeforeMs(call.attempt) / 1000;
            }
          }
        }
        return;
      }
      if (queued > 0) {
        queued -= 1;
        send(false);
        return;
      }
      if (breaker.state === 'open' || breaker.state === 'half') {
        const due = breaker.state === 'half' || breaker.sinceFail > RESET_TIMEOUT_S;
        if (due) {
          trialIn -= dt;
          if (trialIn <= 0) {
            trialIn = TRIAL_AFTER;
            send(true);
          }
        }
        return;
      }
      if (touring) {
        gap -= dt;
        if (gap <= 0) {
          gap = TOUR_GAP;
          send(false);
        }
      }
    };

    const draw = () => {
      const rounded = Math.round(hand * 100) / 100;
      if (rounded !== shownHand) {
        shownHand = rounded;
        handle.current?.setAttribute('transform', handleAt(rounded));
      }
      const fine = Math.round(share * 200) / 200;
      if (fine !== shownShare) {
        shownShare = fine;
        needle.current?.setAttribute('d', needleAt(fine));
      }
      const lampKey = `${lit}:${failed}`;
      if (lampKey !== shownLamps) {
        shownLamps = lampKey;
        lamps.forEach((lamp, index) => {
          if (index === lit) lamp.dataset.on = '';
          else delete lamp.dataset.on;
          if (index < failed && index !== lit) lamp.dataset.failed = '';
          else delete lamp.dataset.failed;
        });
      }
      root.dataset.state = breaker.state;
      root.style.setProperty('--fig-on', glow.toFixed(3));
      const text = readoutOf({ breaker, retrying: call && !call.ok ? call.attempt : 0, refused: refused > 0 });
      if (readout && readout.textContent !== text) readout.textContent = text;
    };

    const tick = (now: number) => {
      const dt = last ? Math.min((now - last) / 1000, MOST_DT) : 1 / 60;
      last = now;
      const calm = still.matches;
      step(dt);
      const handWant = breaker.state === 'closed' ? -1 : breaker.state === 'open' ? 1 : 0;
      const shareWant = Math.min(breaker.failures, MAX_FAILURES) / MAX_FAILURES;
      const glowWant = breaker.state === 'open' ? 1 : breaker.state === 'half' ? 0.45 : 0;
      if (calm) {
        hand = handWant;
        handRate = 0;
        share = shareWant;
        glow = glowWant;
      } else {
        // A trip snaps the handle over; a reset lets it travel back more slowly.
        const stiff = handWant > hand ? 900 : 160;
        const drag = handWant > hand ? 34 : 22;
        for (let i = 0; i < 4; i++) {
          handRate += (((handWant - hand) * stiff - handRate * drag) * dt) / 4;
          hand += (handRate * dt) / 4;
        }
        if (hand > 1) {
          hand = 1;
          handRate = -handRate * 0.25;
        }
        share += (shareWant - share) * (1 - Math.exp(-dt / 0.12));
        glow += (glowWant - glow) * (1 - Math.exp(-dt / (glowWant > glow ? 0.08 : 0.4)));
      }
      if (Math.abs(shareWant - share) < 0.002) share = shareWant;
      if (Math.abs(glowWant - glow) < 0.002) glow = glowWant;
      draw();
      const settled =
        !touring && !call && !queued && refused === 0 && breaker.state === 'closed' && Math.abs(handWant - hand) < 1e-3 && Math.abs(handRate) < 1e-3 && share === shareWant && glow === glowWant;
      frame = visible && !settled ? requestAnimationFrame(tick) : 0;
    };

    const run = () => {
      if (!frame && visible) {
        last = 0;
        frame = requestAnimationFrame(tick);
      }
    };

    const press = () => {
      touring = false;
      window.clearTimeout(idle);
      idle = window.setTimeout(() => {
        touring = !still.matches;
        gap = TOUR_GAP;
        run();
      }, IDLE_BACK);
      if (call) queued = Math.min(queued + 1, MAX_FAILURES);
      else send(false);
      draw();
      run();
    };

    const observer = new IntersectionObserver(
      (entries) => {
        visible = Boolean(entries.at(-1)?.isIntersecting);
        if (visible) run();
        else if (frame) {
          cancelAnimationFrame(frame);
          frame = 0;
        }
      },
      { rootMargin: '120px 0px' },
    );
    observer.observe(root);

    const onDown = (event: PointerEvent) => {
      if (event.button !== 0) return;
      press();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== ' ' && event.key !== 'Enter') return;
      event.preventDefault();
      if (!event.repeat) press();
    };
    const onStill = () => {
      touring = !still.matches && touring;
      run();
    };

    root.addEventListener('pointerdown', onDown);
    root.addEventListener('keydown', onKeyDown);
    still.addEventListener('change', onStill);
    draw();

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.clearTimeout(idle);
      root.removeEventListener('pointerdown', onDown);
      root.removeEventListener('keydown', onKeyDown);
      still.removeEventListener('change', onStill);
    };
  }, []);

  return (
    <div
      ref={stage}
      className="iso-stage fig-stage sp-stage"
      tabIndex={0}
      role="button"
      data-state="closed"
      aria-label={`Course breaker: click the figure, or press Enter or Space, to send a failing call to the course service; ${MAX_FAILURES} failed calls trip the breaker`}
    >
      <svg className="iso-svg" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label={label} focusable="false">
        <Layer html={art.base} />
        <Layer html={art.limiter} />
        <Layer html={art.auth} />
        <g ref={lampGroup} dangerouslySetInnerHTML={{ __html: art.course }} />
        <path ref={needle} className="iso-line sp-needle" data-tone="hi" data-free="end" d={REST_NEEDLE} />
        <Layer html={art.hub} />
        <Layer html={art.glow} />
        <g ref={handle} className="sp-handle" transform={handleAt(-1)} dangerouslySetInnerHTML={{ __html: art.handle }} />
        <Layer html={art.progress} />
        <Layer html={art.front} />
      </svg>
    </div>
  );
}
