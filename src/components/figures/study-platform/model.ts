/*
 * Gateway constants from github.com/khoipn21/study-platform (api-gateway):
 * cmd/main.go sets the circuit breaker (MaxFailures 5, Timeout 10 s, ResetTimeout 60 s) and the
 * rate limit (RATE_LIMIT_REQUESTS 100, RATE_LIMIT_BURST 200); internal/middleware/retry.go sets
 * DefaultRetryConfig (MaxAttempts 3, InitialDelay 100 ms, BackoffFactor 2, MaxDelay 5 s).
 */
export const MAX_FAILURES = 5;
export const RESET_TIMEOUT_S = 60;
export const CALL_TIMEOUT_S = 10;
export const RETRY_ATTEMPTS = 3;
export const INITIAL_DELAY_MS = 100;
export const BACKOFF_FACTOR = 2;
export const RATE_PER_S = 100;
export const BURST = 200;

export const SERVICES = [
  { name: 'auth', port: 8081 },
  { name: 'course', port: 8082 },
  { name: 'progress', port: 8083 },
] as const;

/** The figure plays the 60 s open wait this many times faster; the caption says so. */
export const WAIT_SPEEDUP = 10;

/** Delay before attempt n (1 based): none before the first, then 100 ms, 200 ms. */
export const delayBeforeMs = (attempt: number) => (attempt <= 1 ? 0 : INITIAL_DELAY_MS * BACKOFF_FACTOR ** (attempt - 2));

export type BreakerState = 'closed' | 'open' | 'half';

export interface Breaker {
  state: BreakerState;
  failures: number;
  /** Seconds of breaker time since the last failure. */
  sinceFail: number;
}

export const freshBreaker = (): Breaker => ({ state: 'closed', failures: 0, sinceFail: 0 });

/** canExecute: an open breaker lets a call through as a trial once the reset timeout has passed. */
export function admit(b: Breaker): boolean {
  if (b.state === 'closed' || b.state === 'half') return true;
  if (b.sinceFail > RESET_TIMEOUT_S) {
    b.state = 'half';
    return true;
  }
  return false;
}

/** recordResult: a failure counts and may open the breaker; a success clears the count. */
export function record(b: Breaker, ok: boolean) {
  if (ok) {
    b.failures = 0;
    if (b.state === 'half') b.state = 'closed';
    return;
  }
  b.failures += 1;
  b.sinceFail = 0;
  if (b.state === 'half' || b.failures >= MAX_FAILURES) b.state = 'open';
}

export const RESTING_READOUT = `course · closed · 0 of ${MAX_FAILURES} failed`;

export interface ReadoutState {
  breaker: Breaker;
  /** Attempt number of a failing call in progress, or 0. */
  retrying: number;
  /** A call was just refused by the open breaker. */
  refused: boolean;
}

export function readoutOf({ breaker, retrying, refused }: ReadoutState) {
  if (breaker.state === 'open') {
    const left = Math.max(0, Math.ceil(RESET_TIMEOUT_S - breaker.sinceFail));
    if (refused) return `course · open · call refused`;
    return left > 0 ? `course · open · trial in ${left} s` : 'course · open · next call is a trial';
  }
  if (breaker.state === 'half') return 'course · half open · trial call';
  if (retrying > 1) return `course · attempt ${retrying} of ${RETRY_ATTEMPTS} · after ${delayBeforeMs(retrying)} ms`;
  return `course · closed · ${breaker.failures} of ${MAX_FAILURES} failed`;
}
