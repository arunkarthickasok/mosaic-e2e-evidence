# SHIP #39 (accumulating on d915ee7) — CP-VE3 (P0.5 → G0) — CLOSING

Running ship doc. Accumulates on ship #38 (`d915ee7`). Mosaic git read-only here — this is the ceremony add
block for the human commit. NOT tagged. Closes CP-VE3 and the Views act.

## What has landed
- **P0.5** — plain-value argument inputs (url_param name, fixed plain value) adopt the WC57 debounced-commit
  contract (one history entry per typing burst).
- **P1a** — SSR preview BACKEND: shared `MosaicViewRenderer` (page + preview one path), `ViewsPreviewController`
  (editor-only, CSRF, uncacheable, inert snapshot), route.
- **P1b** — SSR preview UI, PANEL-DRIVEN (ratified): the panel "Preview in canvas" button runs the preview via
  the `viewPreviewStore`; the mosaic_view CARD displays the inert snapshot. Placeholder + control reset on ANY
  config change; abortable; both surfaces.
- **P1c** — films (admin, FE, inertness F-103, config-clears). **P1d** — gates.
- **P2** — exposed-filter + pager verification depth (`ViewsEmbedExposedPagerTest`) **+ the cache finding**:
  per-component render CID must add `url.query_args` when the display has an exposed filter or a full/mini
  pager, else stale serves. Fixed in `MosaicViewComponent::getCacheMetadata` via the shared
  `MosaicViewRenderer::displayUsesQuery` static.
- **P3 (backend)** — data-source sibling parity: `ViewsResultDataSource` resolves all six argument sources via
  the shared `ViewsArgumentResolver`; same `url.query_args` cache fix in `ViewsResultDataSource::getCacheMetadata`
  (`ViewsResultDataSourceParityTest`).
- **P3-UI** — the views_result data-source panel reuses `MosaicViewsArgumentsField` (same six sources + PANEL
  LABEL LAW), writing `argument_sources`; 3 obsolete literal-args-textarea cells retired (oracle-change).
- **G0** — page_field host-context gap closed: `hostEntityType`/`hostBundle` threaded adapter →
  `MosaicDataSourceField` → `BindingEditor` → `ViewsDataSourceField` → `MosaicViewsArgumentsField` →
  `PageFieldSelect`, so the data-source panel ships all six sources live (no dead dropdown).

## Why panel-driven (ruling)
The pinned inert-canvas contract (F-103) makes canvas content non-interactive (Puck's select overlay
intercepts card clicks — witnessed `btnClicked=false`). So the PANEL owns the interaction and the CARD
displays the result (tabsPanelSync/carouselPanelSync precedent). ACT-2 candidate filed: a Puck actionBar
Preview action (unwitnessed API, spike later).

## Gates (P5 — full sweep, 2026-09-15)
| Gate | Result |
|---|---|
| **Kernel — mosaic_views FULL suite** | **55 tests / 850 assertions / 0 failures** (WC61 +2/+34) |
| — incl. ViewsPreviewControllerTest | 4/4 (89 assertions) |
| — incl. ViewsEmbedExposedPagerTest (P2) | 3/3 (68 assertions) |
| — incl. ViewsResultDataSourceParityTest (P3) | 4/4 (79 assertions) |
| — incl. ViewsArgumentEntityTypeTest (WC61, RED→GREEN) | 2/2 (34 assertions) |
| — incl. embed-render regression (shared-path refactor) | 7/7 (75 assertions) |
| **Vitest — full** | **538 / 1** (1 = pre-existing B-101); +P0.5 (4) +P1b (9) +G0 (3) +WC61 guard (1) |
| tsc | clean (only pre-existing `dsdShadow.ts`) |
| **phpcs** (all 7 CP-VE3 PHP files) | **0 ERRORS** (warnings = pre-existing line-length, tolerated) |
| **phpstan** (all CP-VE3 PHP, level 6) | **[OK] No errors** (needs `--memory-limit=512M` for MosaicViewComponent) |
| e2e — WC61 fixed-taxonomy autocomplete | **PASS** (node 986: reopen field = "Citrus", not raw "6"; frame) |
| e2e — cp-ve3-p1-preview films | **4/4** (admin preview · inertness F-103 both-directions · config-clears · FE preview) |
| e2e — regression (wc60-spike + f106-flush) | **8/8** (panel + Preview button coexist; race green) |
| dist + libs | builder + FE rebuilt (no debug leaks); libs **1.0.23 → 1.0.28** |
| **P2-B browser films / P4 preset e2e** | **honest-checkpointed** (see report §Closing) — live-content ceremony, next pass |

## CONSOLIDATED CEREMONY `git add` (run from `web/modules/custom/mosaic`)
Read-only law: the AI does not stage the mosaic repo. On top of ship #38 (`d915ee7`). Re-verified vs
`git status --porcelain` on 2026-09-15: **17 modified + 12 new = 29** (WC61 added
`ViewsArgumentsController.php` [M] + `ViewsArgumentEntityTypeTest.php` [new]; the WC61 `viewsFields.test.tsx`
guard cell folds into its existing line; NO dist/libs change — the fix is backend PHP only).

```bash
git add \
  js/src/builder/MosaicPuckAdapter.ts \
  js/src/builder/MosaicViewPreview.tsx \
  js/src/builder/viewPreviewStore.ts \
  js/src/builder/index.tsx \
  js/src/builder/tierBOptimistic.ts \
  js/src/builder/fields/MosaicViewsArgumentsField.tsx \
  js/src/builder/fields/ViewsDataSourceField.tsx \
  js/src/builder/fields/MosaicDataSourceField.tsx \
  js/src/builder/fields/__tests__/viewsFields.test.tsx \
  js/src/builder/fields/__tests__/debouncedInput.test.tsx \
  js/src/builder/fields/__tests__/dataSourceViewsPicker.test.tsx \
  js/src/builder/__tests__/ViewsDataSourceField.test.tsx \
  js/src/builder/__tests__/MosaicViewPreview.test.tsx \
  js/src/builder/__tests__/viewPreviewStore.test.ts \
  js/src/frontend-editor/FrontendBuilderDialog.tsx \
  modules/mosaic_views/src/Service/MosaicViewRenderer.php \
  modules/mosaic_views/src/Controller/ViewsPreviewController.php \
  modules/mosaic_views/src/Controller/ViewsArgumentsController.php \
  modules/mosaic_views/src/Plugin/MosaicComponent/MosaicViewComponent.php \
  modules/mosaic_views/src/Plugin/MosaicDataSource/ViewsResultDataSource.php \
  modules/mosaic_views/tests/src/Kernel/ViewsPreviewControllerTest.php \
  modules/mosaic_views/tests/src/Kernel/ViewsEmbedExposedPagerTest.php \
  modules/mosaic_views/tests/src/Kernel/ViewsResultDataSourceParityTest.php \
  modules/mosaic_views/tests/src/Kernel/ViewsArgumentEntityTypeTest.php \
  modules/mosaic_views/mosaic_views.routing.yml \
  modules/mosaic_views/mosaic_views.services.yml \
  mosaic.libraries.yml \
  js/dist/builder.js \
  js/dist/frontend-editor.js
```

**Verify:** `git status --porcelain | grep -c '^[MA]'` → **29** (after `git add`; WC61 = +1 M controller
+ 1 new Kernel test on the P5 count of 27). Count is current (P5
re-verified vs porcelain — 16 M + 11 new; the `MosaicViewsArgumentsField.tsx` line in this block covers the
P0.5 debounce + F-105 label law, the `ViewsDataSourceField.tsx` line the P3-UI picker reuse + G0 host props,
and `MosaicDataSourceField.tsx` the G0 thread).

**EXCLUSIONS (never staged):** `js/e2e/journeys/cp-ve3-p1-preview.spec.ts` + the other spec films (gitignored
`js/e2e/`); `AI/`; scratch dev-site content (node 982); `assets/`, `js/*.log`, `js/e2e.zip`, `js/esc-probe.*`.

## STOP — reviewer audits the CP-VE3 package (P0.5 → G0, all code landed + green), then Arun walks.
All CP-VE3 CODE is landed and green. Two live-content ceremony pieces are honest-checkpointed for the next
pass (they need provisioned dev content + browser films, not fresh code): **P2-B** browser-truth films and
**P4** preset round-trip witness. The recipe-grade `WALK-CP-VE3.md` (this repo) spells out both walks for Arun.
Road after ship #39: ACT 2 → Wave D-0+D/F → Wave G → dev push → Arun soak → tag 1.0.0.
