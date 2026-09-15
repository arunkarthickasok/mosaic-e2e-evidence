# SHIP #39 (accumulating on d915ee7) — CP-VE3 P0.5 + P1

Running ship doc. Accumulates on ship #38 (`d915ee7`). Mosaic git read-only here — this is the ceremony add
block for the human commit. NOT tagged. CP-VE3 P2-P5 continue before the ship ceremony.

## What has landed
- **P0.5** — plain-value argument inputs (url_param name, fixed plain value) adopt the WC57 debounced-commit
  contract (one history entry per typing burst).
- **P1a** — SSR preview BACKEND: shared `MosaicViewRenderer` (page + preview one path), `ViewsPreviewController`
  (editor-only, CSRF, uncacheable, inert snapshot), route.
- **P1b** — SSR preview UI, PANEL-DRIVEN (ratified): the panel "Preview in canvas" button runs the preview via
  the `viewPreviewStore`; the mosaic_view CARD displays the inert snapshot. Placeholder + control reset on ANY
  config change; abortable; both surfaces.
- **P1c** — films (admin, FE, inertness F-103, config-clears). **P1d** — gates + this doc.

## Why panel-driven (ruling)
The pinned inert-canvas contract (F-103) makes canvas content non-interactive (Puck's select overlay
intercepts card clicks — witnessed `btnClicked=false`). So the PANEL owns the interaction and the CARD
displays the result (tabsPanelSync/carouselPanelSync precedent). ACT-2 candidate filed: a Puck actionBar
Preview action (unwitnessed API, spike later).

## Gates
| Gate | Result |
|---|---|
| Vitest — full | **537 / 1** (1 = pre-existing B-101); +P0.5 (4) +P1b store/card/button (9) |
| tsc | clean (only pre-existing `dsdShadow.ts`) |
| Kernel — ViewsPreviewControllerTest | **4/4 (89 assertions)** |
| Kernel — embed-render regression (shared-path refactor) | **7/7 (75 assertions)** |
| phpstan (new PHP) | **OK** · phpcs (P1a PHP) **0 errors** |
| e2e — cp-ve3-p1-preview films | **4/4** (admin preview · inertness F-103 both-directions · config-clears · FE preview) |
| e2e — regression (wc60-spike + f106-flush) | **8/8** (panel + Preview button coexist; race green) |
| dist + libs | builder + FE rebuilt (no debug leaks); libs **1.0.23 → 1.0.26** |

## CONSOLIDATED CEREMONY `git add` (run from `web/modules/custom/mosaic`)
Read-only law: the AI does not stage the mosaic repo. On top of ship #38 (`d915ee7`). Expected: **12 modified
+ 8 new = 20**.

```bash
git add \
  js/src/builder/MosaicPuckAdapter.ts \
  js/src/builder/MosaicViewPreview.tsx \
  js/src/builder/viewPreviewStore.ts \
  js/src/builder/index.tsx \
  js/src/builder/tierBOptimistic.ts \
  js/src/builder/fields/MosaicViewsArgumentsField.tsx \
  js/src/builder/fields/ViewsDataSourceField.tsx \
  js/src/builder/fields/__tests__/viewsFields.test.tsx \
  js/src/builder/fields/__tests__/debouncedInput.test.tsx \
  js/src/builder/fields/__tests__/dataSourceViewsPicker.test.tsx \
  js/src/builder/__tests__/ViewsDataSourceField.test.tsx \
  js/src/builder/__tests__/MosaicViewPreview.test.tsx \
  js/src/builder/__tests__/viewPreviewStore.test.ts \
  js/src/frontend-editor/FrontendBuilderDialog.tsx \
  modules/mosaic_views/src/Service/MosaicViewRenderer.php \
  modules/mosaic_views/src/Controller/ViewsPreviewController.php \
  modules/mosaic_views/src/Plugin/MosaicComponent/MosaicViewComponent.php \
  modules/mosaic_views/src/Plugin/MosaicDataSource/ViewsResultDataSource.php \
  modules/mosaic_views/tests/src/Kernel/ViewsPreviewControllerTest.php \
  modules/mosaic_views/tests/src/Kernel/ViewsEmbedExposedPagerTest.php \
  modules/mosaic_views/tests/src/Kernel/ViewsResultDataSourceParityTest.php \
  modules/mosaic_views/mosaic_views.routing.yml \
  modules/mosaic_views/mosaic_views.services.yml \
  mosaic.libraries.yml \
  js/dist/builder.js \
  js/dist/frontend-editor.js
```

**Verify:** `git status --porcelain | grep -c '^[MA]'` → **26** (after `git add`). P2 adds
`ViewsEmbedExposedPagerTest.php`; P3 adds `ViewsResultDataSource.php` + `ViewsResultDataSourceParityTest.php`;
P3-UI adds `ViewsDataSourceField.tsx` + `dataSourceViewsPicker.test.tsx` + `ViewsDataSourceField.test.tsx`
(oracle-change). NB: this block is still ACCUMULATING — the P5 pass re-verifies the FINAL count against
`git status --porcelain` before the ceremony.

**EXCLUSIONS (never staged):** `js/e2e/journeys/cp-ve3-p1-preview.spec.ts` + the other spec films (gitignored
`js/e2e/`); `AI/`; scratch dev-site content (node 982); `assets/`, `js/*.log`, `js/e2e.zip`, `js/esc-probe.*`.

## STOP — reviewer audits P1 (P0.5 + P1a-d), then P2 (exposed filters + pager depth).
Queue: CP-VE3 P2 → P3 (data-source parity) → P4 (A3 preset doc) → P5 (film + ship ceremony) → ACT 2 → …
