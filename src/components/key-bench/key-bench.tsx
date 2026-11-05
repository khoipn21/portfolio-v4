import '@/components/iso/iso.css';
import './key-bench.css';
import { Plate } from '@/components/iso/react/draw';
import { FIGURE_LABEL, keyBenchArt } from './art';
import { KeyBenchLive } from './key-bench-live';
import { ACTUATION_MM, RESTING_READOUT, TRAVEL_MM, forceAt } from './model';

const ART = keyBenchArt();

export function KeyBench() {
  return (
    <div className="iso key-bench">
      <Plate
        fig="Fig 1"
        title="Keystroke"
        hint="Press and hold"
        readout={RESTING_READOUT}
        keys={[
          { mark: 'lit', label: 'Keycap: the interface you touch' },
          { mark: 'raised', label: 'Stem, spring and beam: the system under it' },
        ]}
        caption={`One key, cut open. Press ${ACTUATION_MM} mm against the spring and a shutter on the stem cuts an infrared beam at ${forceAt(ACTUATION_MM)} cN; the controller reads the key through its diode and lights the LED. The stem keeps going to ${TRAVEL_MM} mm so the action never feels abrupt.`}
      >
        <KeyBenchLive art={ART} label={FIGURE_LABEL} />
      </Plate>
    </div>
  );
}
