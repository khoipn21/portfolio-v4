import '@/components/iso/iso.css';
import '@/components/iso/portfolio-figure.css';
import './request-line.css';
import { Plate } from '@/components/iso/react/draw';
import { FIGURE_LABEL, requestLineArt } from './art';
import { RESTING_READOUT, SLOTS } from './model';
import { RequestLineLive } from './request-line-live';

const ART = requestLineArt();

export function RequestLineFigure() {
  return (
    <div className="iso portfolio-figure request-line-figure">
      <Plate
        fig="Fig 2"
        title="Request line"
        hint="Press to send a request"
        readout={RESTING_READOUT}
        keys={[
          { mark: 'lit', label: 'Carrier: one request in flight' },
          { mark: 'raised', label: 'Counter: Next.js · desk and switch: Go' },
          { mark: 'flat', label: 'Pigeonholes: Redis · cabinet: Postgres' },
        ]}
        caption={`A cash railway for one request. Next.js sends the carrier to Go, which asks Redis first. On a miss it rides on to Postgres, files a copy in Redis on the way back and only then answers. This rack holds ${SLOTS} cards, so when it is full the least recently used card makes room.`}
      >
        <RequestLineLive art={ART} label={FIGURE_LABEL} />
      </Plate>
    </div>
  );
}
