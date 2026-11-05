# Figure: bioweave (Fig 3, `BioweaveFigure`)

## Concept
An evidence gate on a specimen bench. A sled carries a turned five part specimen (plinth, stem, cup, bud, tip) and a tag bar with one standing tag per part; a spec card in a stand at the back holds the same five rows. A builder (column at the back, arm, sliding head) builds the specimen in the bay. A separate inspector, with its own carriage on its own front rail and a loupe on an arm, reads each tag in turn. The gate (the single lit part) lifts on two cables only when every tag passes; then the sled slides through into a tray engraved DRAFTS. In the mapping, the tags are the ontology IDs and cited sources, the inspector is the separate review pass, and Drafts is where results wait for a person.

Interaction: each press (pointer, or Enter/Space on the focusable stage) runs one cycle. The cycles run inspect and refuse (one tag missing, gate stays shut), then add the tag, re-check all five and pass, then build the next spec. The idle tour loops the same cycles. Under reduced motion the figure stays still and each press jumps to the end state of the next cycle. The loop pauses offscreen (IntersectionObserver), updates only attributes on refs, and announces through a polite live region.

## Truths used (all from the bioweave entry in `src/data/user-data.ts`; the repository is private)
- Ontologies Uberon, Cell Ontology, Gene Ontology, Plant Ontology; every size and colour cites a source (`decision`).
- Automated checks, then a separate review pass, so the builder never approves its own render (`challenge`, `highlights`).
- AI mesh results land as Drafts and still need human review (`limitation`, `highlights`).
- 94 model packages, 76 generator built (`highlights`).
- Five parts, five tags, and all distances belong to the drawn object. They are not presented as project statistics.

## Parts
76 solids (plus 34 dot groups for screws and rivets), within the Figure tier of 40 to 80.

## Files
- `src/components/figures/bioweave/`: `model.ts`, `view.ts`, `art.ts`, `frame.ts`, `bioweave-live.tsx` (client), `bioweave-figure.tsx` (server, exports `BioweaveFigure`), `bioweave.css`
- Temporary preview route: `src/app/figure-lab/bioweave/page.tsx`

## Final screenshots
`/tmp/claude-1000/-home-khoipn21-workspaces-projects-portfolio-v4/aabefdd1-e408-4206-ac11-1caa36c98196/scratchpad/figures/bioweave/`
- `final-1440-dark.png`, `final-1440-light.png`, `final-390-dark.png`, `final-390-light.png`
- Motion: `t-*.png`, `press-sheet.png`; reduced motion: `red-1..3.png`; close-ups: `r5-spec.png`, `r8-bud-both.png`

## Verification
- `lines.mjs`: `line ends: 0` in both themes at rest, refused, gate open, in Drafts and mid build.
- `capture.mjs` and `drive.mjs` at 1440 and 390: console clean, no hydration warnings, no sideways scroll.
- Keyboard (Enter, Space) and click step through the cycles; reduced motion is still and steps instantly.
- `npx tsc --noEmit -p .`: no errors from bioweave files. `npx eslint src/components/figures/bioweave src/app/figure-lab/bioweave`: clean.
- No dev server was started or stopped, and `next build` was not run.
