# CP-VE3 — album INDEX

Films for the Views-embed depth arc (CP-VE3: P0.5 → G0). Ship #39.

## Frames present (P1c — SSR preview, panel-driven)
| # | Frame | What it shows |
|---|---|---|
| 01 | `01-admin-preview.png` | Admin node form: panel "Preview in canvas" run → the mosaic_view CARD shows the inert SSR snapshot (real rows, controls disabled). F-103 inert-canvas contract holds. |
| 02 | `02-fe-preview.png` | Front-end builder dialog: the same panel-driven preview on the FE surface — parity with admin. |

The full P1 film set (4/4: admin preview · inertness F-103 both-directions · config-clears · FE preview) ran
green from the gitignored e2e spec `js/e2e/journeys/cp-ve3-p1-preview.spec.ts`; frames 01–02 are the two
representative stills pushed here.

## Frames PENDING (P2-B + P4 — honest-checkpointed, next pass)
These need provisioned live dev content (an exposed-filter + paged view, single & dual host embeds) and are
walked step-by-step in `WALK-CP-VE3.md`. Reviewer/Arun can film them from that recipe; they are NOT yet in
this album:
- `p2b-a-pager-*` — `?page=N` advance, rows-change-by-id, full + mini pager.
- `p2b-b-exposed-*` — AJAX exposed-form filtering (no full reload, rows narrowed by id).
- `p2b-c-dual-*` — two embeds of the same view on one page (independence verdict).
- `p2b-d-embed-plus-page-*` — one embed + the view's own page display coexisting.
- `p2b-e-cache-*` — the exposed-filter cache fix LIVE (filter → unfiltered → filtered, no stale serve).
- `p4-preset-*` — configured mosaic_view saved as a global template, inserted on another node, config intact.

## Backing gates (P5, 2026-09-15)
- Kernel — mosaic_views FULL: **53 / 816 / 0**. Vitest **537 / 1** (B-101). phpcs **0 ERRORS**. phpstan **[OK]**.
- The cache finding (P2) is proven at the Kernel layer in `ViewsEmbedExposedPagerTest`; the P2-B `-e` film is
  the browser-truth confirmation of the same fix.
