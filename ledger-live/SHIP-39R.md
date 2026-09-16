# SHIP #39R — RIDER CP-VE3-R1 (accumulates on 137327c) — data-source Display auto-select

Rider on ship #39 (`137327c`, CP-VE3 closed). Mosaic git read-only — this is the ceremony add block for the
human commit. Closes WALK-CATCH #62 (parity).

## What it fixes (WC62)
The data-source picker's **Display** did NOT auto-select when a view was chosen — it cleared `display_id` and
forced a manual pick — while the **component panel** (`MosaicViewsDisplayField`) auto-selects the view's
first embeddable display. Parity gap.

## Witness → fix
- **Component panel behaviour (witnessed first):** `MosaicViewsDisplayField.onViewChange` →
  `onChange({ view, display: entry?.displays[0]?.id ?? '' })` — always selects the first embeddable display
  (the `/api/mosaic/views/list` endpoint pre-filters to views with ≥1 embeddable display).
- **Fix:** `ViewsDataSourceField.handleViewChange` now mirrors it —
  `const entry = views.find(v => v.id === viewId); onConfigChange({ ...config, view_id: viewId, display_id: entry?.displays[0]?.id ?? '' })`.
  When exactly one embeddable display exists it is selected; otherwise the first — identical to the panel.

## Gates
| Gate | Result |
|---|---|
| Vitest — `dataSourceViewsPicker` R1 cell (RED→GREEN) | **GREEN**; RED demonstrated (`-'embed_1' +''`) |
| Vitest — full | **539 / 1** (1 = pre-existing B-101; +R1 cell) |
| tsc | clean (only pre-existing `dsdShadow.ts`) |
| dist builder + FE | rebuilt; **0** debug leaks (no `console.log`/`debugger`/RED-DEMO from this change) |
| libs | **1.0.28 → 1.0.29** |

## CONSOLIDATED RIDER `git add` (run from `web/modules/custom/mosaic`)
Read-only law: the AI does not stage the mosaic repo. On top of ship #39 (`137327c`). Expected: **5 modified,
0 new**.

```bash
git add \
  js/src/builder/fields/ViewsDataSourceField.tsx \
  js/src/builder/fields/__tests__/dataSourceViewsPicker.test.tsx \
  mosaic.libraries.yml \
  js/dist/builder.js \
  js/dist/frontend-editor.js
```

**Verify:** `git status --porcelain | grep -c '^[MA]'` → **5** (after `git add`).

**EXCLUSIONS (never staged):** `js/e2e/` spec films; `AI/`; scratch dev content (`web/cpve3_content.php`,
nodes 983–986); `assets/`, `js/*.log`, `js/e2e.zip`, `js/esc-probe.*`.

## STOP — reviewer audits the rider; then ACT 2 VISUAL CAMPAIGN opener (from the reviewer).
