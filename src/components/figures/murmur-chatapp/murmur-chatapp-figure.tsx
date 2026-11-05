import '@/components/iso/iso.css';
import '@/components/iso/portfolio-figure.css';
import './murmur-chatapp.css';
import { Plate } from '@/components/iso/react/draw';
import { FIGURE_LABEL, murmurArt } from './art';
import { MurmurChatappLive } from './murmur-chatapp-live';
import { PAGE_SIZE, PING_PERIOD_S, PONG_WAIT_S, RESTING_READOUT } from './model';

const ART = murmurArt();

export function MurmurChatappFigure() {
  return (
    <div className="iso portfolio-figure murmur-chatapp-figure">
      <Plate
        fig="Fig 5"
        title="Two lines, one spool"
        hint="Press for an older page"
        readout={RESTING_READOUT}
        keys={[
          { mark: 'lit', label: 'Register armature: a live message over the WebSocket' },
          { mark: 'raised', label: `Archive reel and crank: one turn is one page of ${PAGE_SIZE}` },
        ]}
        caption={`Live messages and stored history arrive by separate mechanisms and wind onto one spool, the shared TanStack Query cache. Each crank turn fetches ${PAGE_SIZE} older messages, using the oldest timestamp as the cursor, while the WebSocket adds each new message to the newest page; the Go server pings every ${PING_PERIOD_S} s and drops a connection that stays silent for ${PONG_WAIT_S} s.`}
      >
        <MurmurChatappLive art={ART} label={FIGURE_LABEL} />
      </Plate>
    </div>
  );
}
