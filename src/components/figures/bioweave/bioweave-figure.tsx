import '@/components/iso/iso.css';
import '@/components/iso/portfolio-figure.css';
import './bioweave.css';
import { Plate } from '@/components/iso/react/draw';
import { FIGURE_LABEL, bioweaveArt } from './art';
import { BioweaveLive } from './bioweave-live';
import { GENERATOR_BUILT, MODEL_PACKAGES, ONTOLOGIES, RESTING_READOUT } from './model';

const ART = bioweaveArt();
const SOURCES = `${ONTOLOGIES.slice(0, -1).join(', ')} or ${ONTOLOGIES.at(-1)}`;

export function BioweaveFigure() {
  return (
    <div className="iso portfolio-figure bioweave-figure">
      <Plate
        fig="Fig 3"
        title="Evidence gate"
        hint="Press to run a check"
        readout={RESTING_READOUT}
        keys={[
          { mark: 'lit', label: 'Gate: lifts only when every tag passes' },
          { mark: 'raised', label: 'Builder and inspector: separate arms on separate rails' },
        ]}
        caption={`Every part of a BioWeave model carries an ontology ID from ${SOURCES}, and every size and colour cites a source. Automated checks run first and a separate pass reviews the render, so the agent that builds a model never approves it; AI mesh results land in Drafts until a person reviews them. The demo library held ${MODEL_PACKAGES} model packages, ${GENERATOR_BUILT} of them generator built.`}
      >
        <BioweaveLive art={ART} label={FIGURE_LABEL} />
      </Plate>
    </div>
  );
}
