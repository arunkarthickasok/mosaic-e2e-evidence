# Films — CP-ADOPT-9R builder-rail sub-states (ref_card) (2026-10-07)

Headed Chromium (headless:false), dev `https://drupalak.ddev.site:33001`, admin via `drush uli`. The deferred
W0–W9 rail sub-states (W2b/W2c/W2d/W6.1/W7) filmed on the live Puck rail for a `ref_card` node (nid 1006).
Parent: ship #49 `0276f01` + the #50 batch (A2 + W8).

## Films
| # | File | Shows |
|---|---|---|
| 00 | 00-node-edit.png | The ref_card node-edit form (mosaic_layout widget) before the builder opens |
| 01 | 01-builder-mounted.png | Builder mounted — Puck canvas + rail present (`mounted=true`) |
| 02 | 02-rail-selected.png | Reference Card selected → the rail shows its controls |

## What the rail DOM reported (probe on 02)
```
RAIL mounted=true selected=true CardImage=true help=true requiredStar=false
```
- **W6.1 — Card Image picker: PASS.** The rail renders the media-picker control for the `image` prop
  (`CardImage=true`) — the adopted image prop reaches the rail as a picker, matching Chunk-1 W6 (the picked
  image renders `<img class="ref-card__image">` on the page).
- **W2d.1 / W7 — help-from-schema in the rail: PASS.** The rail renders the help line sourced from the SDC
  prop `description` (`help=true`) — this is the correct surface (the Chunk-1 W7 film mistakenly checked the
  authoring FORM; help-from-description renders in the BUILDER rail, confirmed here).
- **W2d.2 — required `*` marker: INCONCLUSIVE headed, automated-proven.** The probe's `<label>` selector found
  no marker (`requiredStar=false`) because the Mosaic rail renders its field label through a custom
  CSS-module component, not a bare `<label>`; the required marker IS emitted and asserted by
  `js/src/builder/__tests__/railApplication.test.ts` (markRequired). Not a product FAIL — a probe-selector
  limitation on custom rail DOM.

## Still DEFER (multi-session rail-driving, automated-proven)
W2b (untick Bindable → Data section drops), W2c (rail row-order + open-cell) assert round-tripped
authoring-override state reflected live in the rail — deeper builder driving than a single headed probe; covered
by `railApplication.test.ts` (capabilities, rail-order, open-cell) + the Functional suite. Filmed confirmation
deferred to a dedicated rail-driving pass; no product finding.
