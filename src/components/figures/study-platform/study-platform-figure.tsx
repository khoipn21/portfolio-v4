import '@/components/iso/iso.css';
import '@/components/iso/portfolio-figure.css';
import './study-platform.css';
import { Plate } from '@/components/iso/react/draw';
import { FIGURE_LABEL, studyPlatformArt } from './art';
import { BURST, INITIAL_DELAY_MS, BACKOFF_FACTOR, MAX_FAILURES, RATE_PER_S, RESET_TIMEOUT_S, RESTING_READOUT, RETRY_ATTEMPTS, WAIT_SPEEDUP } from './model';
import { StudyPlatformLive } from './study-platform-live';

const ART = studyPlatformArt();

export function StudyPlatformFigure() {
  return (
    <div className="iso portfolio-figure study-platform-figure">
      <Plate
        fig="Fig 6"
        title="Gateway breaker"
        hint="Press to fail a call"
        readout={RESTING_READOUT}
        keys={[
          { mark: 'lit', label: 'Breaker handle: the circuit breaker on the course service' },
          { mark: 'raised', label: 'Limiter, busbar and backplate: rate limit, gRPC routes and Docker' },
        ]}
        caption={`The study platform's API gateway as a breaker panel. Requests draw from a bucket of ${BURST} tokens refilled at ${RATE_PER_S} a second, then reach the auth, course and progress services over gRPC, each call tried up to ${RETRY_ATTEMPTS} times with ${INITIAL_DELAY_MS} and ${INITIAL_DELAY_MS * BACKOFF_FACTOR} ms between tries. ${MAX_FAILURES} failed calls trip a breaker, which refuses calls for ${RESET_TIMEOUT_S} seconds (played ${WAIT_SPEEDUP} times faster here) and then lets one trial call through.`}
      >
        <StudyPlatformLive art={ART} label={FIGURE_LABEL} />
      </Plate>
    </div>
  );
}
