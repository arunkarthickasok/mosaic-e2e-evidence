# REPORT — ACT 2 opener (A2-0) — 2026-09-16

Post ship #39R (`fcae651`). ACT 2 VISUAL CAMPAIGN opener: inventory + clear-defect polish, no taste decisions.
Ship #40 (ACT2-P0) = defects 2 + 3 fixed (PHP-only). Defects 1 + 4 honest-checkpointed (witness-first).

## A2-0a — baseline album
`ledger-live/e2e-evidence/act2-baseline/` (INDEX = full shot list). Seed frames captured with the
immediate-clip technique (the headless Puck builder closes under full-page screenshots — witnessed WC61):
`01-admin-canvas-d` (palette+canvas+panel, 1280), `01-admin-canvas-t` (834), `11-template-picker-d`. Remaining
surfaces are checkpointed for a capture pass on a running builder — Arun's own screenshots drive the campaign.

## A2-0b — clear defects

### Defect 3 — page_field lists the mosaic layout field (FIXED)
`ViewsArgumentSourcesController::pageFields` offered every `field_*` field, including the `field_mosaic_layout`
blob being edited. Fix: skip a small exclusion set of non-sensical field types.
```php
$excluded_types = ['mosaic_layout', 'map', 'password'];
...
if (in_array($definition->getType(), $excluded_types, TRUE)) { continue; }
```
Live witness (drush, node/page which carries field_mosaic_layout):
```
node/page fields: uid, title, field_cpve2_topic
field_mosaic_layout present? NO (excluded ✓)
```

### Defect 2 — argument-label raw-machine-name fallback (FIXED)
`ViewsArgumentsController` fell back to `$handler['field']` (raw id) when no admin label was set. Fix:
`argumentTitle()` humanizes the machine name (underscores → spaces, capitalise) as the fallback.

### RED → GREEN (Kernel oracles, both)
GREEN: `testArgumentTitleHumanizedFallback` + `testPageFieldsExcludesLayoutField` → `OK (2 tests, 35 assertions)`.
RED (both fixes reverted):
```
A2-0b: humanized, not "term_node_tid_depth"
Failed asserting that two strings are identical.
+'term_node_tid_depth'
Failed asserting that an array does not contain 'field_test_layout'.
FAILURES! Tests: 2, Assertions: 34, Failures: 2.
```
Gates: Kernel mosaic_views FULL **57/885/0**; phpcs **0 ERRORS**; phpstan **[OK]**. PHP-only → no dist/libs.

### Defects 1 + 4 — HONEST CHECKPOINT (witness-first law)
Not fixed blind — each needs a witnessed mechanism the current probes could not pin:
- **Defect 1 (breakpoint-override panel shows machine names → human labels, all components):** the adapter's
  normal field path already humanizes (`props[propName]?.title ?? humanizeFieldName`), and the mosaic_view
  custom fields come from `field_types` via `descriptorToPuckField` (`descriptor.label ?? humanizeFieldName`).
  The exact panel state that surfaces the RAW keys `view_display`/`arguments`/`hide_when_empty` was not
  reproduced in headless — it needs the baseline frame `04b-breakpoint-override-panel` as the witness before an
  all-components fix. Deferred (not guessed).
- **Defect 4 (carousel/tabs panel render-count ≤2, the WC60 remainder):** `MosaicViewsArgumentsPanel` is
  already `React.memo`; proving ≤2 for carousel/tabs needs a render-count instrument (a counting wrapper in a
  Vitest harness), then memoize only if the measurement exceeds 2. Deferred to a render-instrument pass.

## A2-0c — design-input packet
`reports/ACT2-DESIGN-PACKET.md` — the ten surfaces a daily author sees most (frequency-ranked, with frame
ids) + the candidates awaiting Arun's taste ruling (Puck actionBar preview spike, FE chrome scope, F-099,
F-037 media picker, page_field polish).

## STOP — reviewer audits defects 2+3 + the baseline album; Arun reviews the packet and rules ACT 2 directions.
The reviewer runs the REVIEWER-RESEARCH scan (Webflow/Framer/Canva/Builder.io) before design rulings.
