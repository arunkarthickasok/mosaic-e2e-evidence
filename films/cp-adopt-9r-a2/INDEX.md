# Films — CP-ADOPT-9R A2 (adopted enum seeded at render)

Headed Chromium (headless:false), dev `https://drupalak.ddev.site:33001`, no retries.

| Film | Step | Asserted condition | Result |
|---|---|---|---|
| a2-unset-enum-render.png | Render a ref_card node (nid 1007) with `variant` UNSET | HTTP 200 · `.ref-card--default` (H4-seeded enum) · no "enumeration" error | **PASS** |

A2 cause: SDC validates an enum prop at render; an UNSET enum arrives as "" (not in the enumeration) → a
page-render 500. Fix (ship #50): `MosaicRenderer::buildAdoptedComponentElement` seeds every unset enum with
its H4 default (schema default → examples[0] → first enum value). Pre-fix this node returned HTTP 500.
