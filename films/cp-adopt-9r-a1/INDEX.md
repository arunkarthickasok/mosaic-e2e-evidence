# Films — CP-ADOPT-9R A1 (adopted-render fix)

Headed Chromium (headless:false), dev `https://drupalak.ddev.site:33001`, no retries.

| Film | Step | Asserted condition | Result |
|---|---|---|---|
| a1-ref_card-render.png | Render a ref_card node (nid 1006) | HTTP 200 · `.ref-card` present · heading "A1 rehearsal card" renders | **PASS** |

A1 cause: `MosaicComponentAlias::providerIsOwned()` used a `mosaic_*` prefix heuristic → the reference
library was mis-read as OWNED → bare ids → `#component` could not bind props → SDC render-fail. Fix: explicit
`OWNED_PROVIDERS` allow-list (ship #49). Pre-fix this node returned HTTP 500; the film shows the 500 is gone.
