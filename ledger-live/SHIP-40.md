# SHIP #40 — ACT2-P0 clear-defect polish (accumulates on fcae651)

First slice of ACT 2 (opener A2-0). Accumulates on ship #39R (`fcae651`). Mosaic git read-only — this is the
ceremony add block for the human commit. **PHP-only — no dist rebuild, no libs bump.**

## What it fixes (A2-0b clear defects — no taste decisions)
- **page_field exclusion (defect 3):** `ViewsArgumentSourcesController::pageFields` now skips non-sensical
  field types (`mosaic_layout`, `map`, `password`) — the mosaic layout blob being edited can never be a
  contextual-filter argument, so it no longer appears as a "field on this page" source.
- **argument-label friendlier fallback (defect 2):** `ViewsArgumentsController::argumentTitle` — when an
  argument has no admin label, humanize the machine field name ("Term node tid depth") instead of surfacing
  the raw handler id ("term_node_tid_depth").

## Honest checkpoint — A2-0b defects 1 + 4 deferred (witness-first law)
- **Defect 1 — breakpoint-override panel machine names → human labels (all components):** the exact surface
  that shows raw prop keys (`view_display`/`arguments`/`hide_when_empty`) must be witnessed from a baseline
  frame before a correct, all-components fix. Shot `04b-breakpoint-override-panel` in the baseline album is
  the witness target. Not fixed blind.
- **Defect 4 — carousel/tabs panel render-count ≤2 (WC60 remainder):** needs a render-count instrument to
  prove the current count, then memoize only if >2. `MosaicViewsArgumentsPanel` is already `React.memo`;
  the carousel/tabs panels need the same measurement. Deferred to a render-instrument pass.

## Gates
| Gate | Result |
|---|---|
| Kernel — defect 2 + 3 oracles (RED→GREEN) | **GREEN**; RED demonstrated (`+'term_node_tid_depth'`; array contains `field_test_layout`) |
| Kernel — mosaic_views FULL | **57 tests / 885 assertions / 0 failures** (+2 vs ship #39's 55) |
| Live witness (defect 3) | node/page page-fields = `uid, title, field_cpve2_topic` — `field_mosaic_layout` excluded |
| phpcs (both controllers + test) | **0 ERRORS** |
| phpstan (both controllers, level 6) | **[OK] No errors** |
| dist / libs | **unchanged** (PHP-only) |

## CONSOLIDATED `git add` (run from `web/modules/custom/mosaic`)
Read-only law: the AI does not stage the mosaic repo. On top of ship #39R (`fcae651`). Expected: **4 modified,
0 new**.

```bash
git add \
  modules/mosaic_views/src/Controller/ViewsArgumentsController.php \
  modules/mosaic_views/src/Controller/ViewsArgumentSourcesController.php \
  modules/mosaic_views/tests/src/Kernel/ViewsArgumentEntityTypeTest.php \
  modules/mosaic_views/tests/src/Kernel/ViewsArgumentSourcesControllerTest.php
```

**Verify:** `git status --porcelain | grep -c '^[MA]'` → **4** (after `git add`).

**EXCLUSIONS (never staged):** `js/e2e/` spec films (incl. `act2-baseline.spec.ts`); `AI/`; scratch dev
content (`web/cpve3_content.php`, nodes 983–986); `assets/`, `js/*.log`, `js/e2e.zip`, `js/esc-probe.*`.

## STOP — reviewer audits A2-0b defects 2+3 + the baseline album; Arun reviews the design packet + rules ACT 2 directions.
