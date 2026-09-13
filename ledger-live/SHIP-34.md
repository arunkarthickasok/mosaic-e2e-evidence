# SHIP #34 — CAROUSEL COUPLED LANDING (F-083 slides model, v6)

**Date:** 2026-09-10 · **Parent:** ship #33 part 1 `5f767d6`.
**Mosaic git: read-only, NOT staged** — all sub-landings accumulated uncommitted into ONE ship #34
(boundary ruling); Arun commits at ceremony. Built as five green checkpoints L-A…L-E, each verified.

## What landed
The `mosaic_carousel` moves from developer `slide_1..N` raw-HTML props to the author **`slides`** model — a
repeatable of `{ image (Media Library picker), caption (rich text via check_markup), link }` — with a v5→v6
migration for existing content, the panel↔canvas active-slide sync, and both authoring surfaces. Legacy
`slide_N` content renders byte-identically until it migrates (dual-mode), then auto-migrates to `slides` on
save. The old `slide|raw` XSS vector is **eliminated** (captions render through `processed_text`/check_markup).

## Green-checkpoint history
- **L-A** — media-repeatable-sub-field keystone: `MediaFieldType` (builder_type 'media') + adapter media case
  (MosaicMediaField per array row, per-row fieldKey) + `MosaicPropResolver::resolveMediaSentinel` (existence +
  view-access, F-055/075). Green in isolation. (`5918209`)
- **L-B** — slides render+author stack (dual-mode, v5 preserved): sidecar `field_types` slides + component.yml +
  twig (image via a new generic `MosaicRenderer::resolveFieldTypeMedia`, caption check_markup, link, DSD,
  autoescape per F-100) + generic getItemSummary/defaultItemProps + S2b discriminator guard. FE render
  live-proven. (`5690127`)
- **L-C** — active-slide sync: carousel `active` reactive prop + generalized `tabsPanelSync` →
  `installCarouselPanelSync` (both hosts). **LIVE real-pointer film GREEN** (admin). **FORK VERDICT: the earlier
  "puck=0" was a MALFORMED FIXTURE, not a bug** — the scratch node used region slot `content` instead of the
  canonical `items`; the Puck adapter maps a region slot to a canvas zone by name, so `content` children never
  mounted (the FE renderer iterates slots generically, hence FE rendered — the exact discrepancy). Bonus real
  bug fixed: `renderSingleComponent` (canvas SSR) rendered `processed_text` outside a render context → threw;
  now wrapped (+@renderer). (`7c03bea`)
- **L-D** — atomic flip: activated V5→V6 + `CURRENT_SCHEMA_VERSION=6` + schema enum `[1..6]`. Heal class was **6
  version-pinned oracles, not 33** — the dual-mode dividend (L-A/L-B already shipped the render+author stack).
  R-C8 migrate→render cell; migration idempotence/breakpoint/slots (V5ToV6MigrationTest); P3 re-witness on a
  migrated node (builder shows carousel + slides rows). (`e54f47b`)
- **L-E** — this closeout: final dist (builder→renderer→FE, version 1.0.15→1.0.16) + full gates + both-surface
  full-lifecycle journeys + album + this doc.

## Gates — ALL GREEN
| Gate | Result |
|---|---|
| FULL Kernel | **187 / 187** (1086 assertions) |
| FULL Unit | **2688 / 2688** (1 pre-existing warning) |
| Vitest | **491 pass / 1 fail** = pre-existing B-101 |
| phpcs | **0 errors** on every changed PHP file |
| f066 (FE-lock parity) + lock (save-lock) | **13 / 13** (FE dialog + lock unaffected by the sync install) |
| Sentinels | manifest carries carousel `field_types.slides.fields` = image,caption,link; endpoint gated (403 anon) |
| W18 (canvas scroll) | orthogonal — carousel changes do not touch canvas-scroll code |
| Carousel Kernel render | 7/7 (incl. R-C8 migrate→render); tabs render 8/8; live_search 4/4 |
| Both-surface journeys | admin sync film + admin lifecycle + FE surface — all GREEN (album, 11 frames) |
| dist | rebuilt (builder+renderer+FE), version bump 1.0.16 |

## Exact totals — change set (28 tracked code files; Arun to commit)
**Modified (23):** js/src/builder/{BuilderApp.tsx, MosaicPuckAdapter.ts, tabsPanelSync.ts,
__tests__/FieldTypes.test.ts} · js/src/frontend-editor/FrontendBuilderDialog.tsx ·
js/src/renderer/components/mosaic-carousel.ts · modules/mosaic_components/components/mosaic_carousel/{twig,
component.yml, mosaic.yml} · mosaic.libraries.yml · mosaic.services.yml · schema/mosaic_layout_value.schema.json ·
src/Service/{MosaicPropResolver.php, MosaicRenderer.php} · src/Value/MosaicLayoutValue.php · tests/src/Kernel/
{Component/MosaicTabsRenderTest.php, Migration/MosaicLayoutMigrationManagerTest.php, Plugin/
MosaicFieldTypeManagerTest.php, Service/MosaicPropResolverTest.php} · tests/src/Unit/Service/
{MosaicRendererTest.php, MosaicRendererCacheTest.php} · tests/src/Unit/Smoke/{Sprint23,Sprint41}SmokeTest.php
**New (5):** src/Plugin/MosaicFieldType/MediaFieldType.php · src/Plugin/MosaicLayoutMigration/V5ToV6Migration.php ·
tests/src/Unit/Plugin/MosaicLayoutMigration/V5ToV6MigrationTest.php ·
tests/src/Kernel/Component/MosaicCarouselRenderTest.php · js/src/builder/__tests__/CarouselPanelSync.test.ts +
CarouselSlidesDiscriminator.test.ts

**Add commands (mosaic repo, Arun runs):**
```
git add js/src/builder/BuilderApp.tsx js/src/builder/MosaicPuckAdapter.ts js/src/builder/tabsPanelSync.ts
git add js/src/builder/__tests__/FieldTypes.test.ts js/src/builder/__tests__/CarouselPanelSync.test.ts js/src/builder/__tests__/CarouselSlidesDiscriminator.test.ts
git add js/src/frontend-editor/FrontendBuilderDialog.tsx js/src/renderer/components/mosaic-carousel.ts
git add modules/mosaic_components/components/mosaic_carousel/
git add mosaic.libraries.yml mosaic.services.yml schema/mosaic_layout_value.schema.json
git add src/Service/MosaicPropResolver.php src/Service/MosaicRenderer.php src/Value/MosaicLayoutValue.php
git add src/Plugin/MosaicFieldType/MediaFieldType.php src/Plugin/MosaicLayoutMigration/V5ToV6Migration.php
git add tests/src/Kernel/Component/MosaicCarouselRenderTest.php tests/src/Kernel/Component/MosaicTabsRenderTest.php
git add tests/src/Kernel/Migration/MosaicLayoutMigrationManagerTest.php tests/src/Kernel/Plugin/MosaicFieldTypeManagerTest.php
git add tests/src/Kernel/Service/MosaicPropResolverTest.php tests/src/Unit/Service/MosaicRendererTest.php tests/src/Unit/Service/MosaicRendererCacheTest.php
git add tests/src/Unit/Smoke/Sprint23SmokeTest.php tests/src/Unit/Smoke/Sprint41SmokeTest.php
git add tests/src/Unit/Plugin/MosaicLayoutMigration/V5ToV6MigrationTest.php
git add js/dist   # rebuilt bundles (builder/renderer/FE), version 1.0.16
```
Evidence-only, NOT tracked (gitignored, js/e2e F-048): the 3 `ship34-carousel-*.spec.ts` journeys.

## Noise verdict
**Clean.** Every tracked change is an intentional carousel-landing file. Pre-existing untracked noise (`js/*.log`,
`tests/*.log`, `js/esc-probe.config.ts`, `assets/`) is NOT part of this ship and was not touched. Album:
`ledger-live/e2e-evidence/ship34-carousel/` (11 frames + INDEX). Reviewer audits frames → Arun walk → ceremony.

---

## WALK-CATCHES #50–#54 (Arun walk 2026-09-10) — PROBED + FIXED (ship #34 still FROZEN)

Five defects Arun's live walk found that the unit tests + attribute-only journeys
missed. All fixed into the same uncommitted ship #34 change set. Walk tally → 54.

**Root cause (shared by #53 + #54, and the FE half of #51/#52 symptoms):** the Lit
`<mosaic-carousel>` overrides `createRenderRoot()` to REUSE a hydrated declarative-
shadow-DOM root, but that path never reached `ReactiveElement.createRenderRoot()`,
so Lit's `static styles` were NEVER adopted. On the FE page (DSD parsed at load)
and in the canvas (DSD via `setHTMLUnsafe`) the shadow had zero CSS: `.car-track`
fell back to `display:block`, `.car` to `overflow:visible`, so every slide stacked
as a vertical list and the sync transform slid the whole unclipped list off-screen.
The admin canvas "worked" only when `this.shadowRoot` was null (fresh attachShadow
→ super adopted styles). Fix: `mosaic-carousel.ts` adopts `elementStyles` into the
(possibly hydrated) shadow root after clearing it (replicates Lit's `adoptStyles`).

- **#50 legacy fields on the v6 panel** — `mosaic_carousel.component.yml` no longer
  declares `slide_1..6` props → the manifest exposes only `slides`; the migration
  idempotence path strips any stray `slide_N` keys (`V5ToV6Migration.php`).
  Proven: Kernel `testCarouselManifestHasNoLegacySlideProps`, Unit
  `testIdempotenceStripsStrayLegacyKeys`, live panel witness (labels =
  auto_advance/interval/loop/slides only, zero "Slide N HTML").
- **#51 canvas image missing** — `MosaicRenderer::renderSingleComponent` now runs
  `resolveFieldTypeMedia` (canvas SSR resolved only prop_types before). Kernel
  `testCanvasPreviewResolvesSlideImage`; FE frame `11-fe-carousel.png`.
- **#52 delete-all-slides ghost** — `mosaic_carousel.twig` keys the new branch on
  `props.slides is defined` (KEY presence), never emptiness. Kernel
  `testEmptySlidesRendersNoLegacyGhost`.
- **#53 page slider broken** — style-adoption fix (above). Geometry e2e
  `carousel-slider-geometry.spec.ts` on ANON node 942: one slide visible, arrow
  0→1→2, loop wraps, prev wraps, dots track.
- **#54 FE canvas ≠ admin (stacked captions + dead sync)** — same style-adoption
  fix; the sync code was always correct. The VOIDED "both hosts" claim is re-proven
  from zero with a **geometry oracle** (which slide's centre is in the viewport) on
  BOTH hosts: `ship34-carousel-sync.spec.ts` (admin) + `ship34-carousel-fe.spec.ts`
  (FE), expanding row 2 → slide 1 shown, not just `active="1"`.

**Changed this pass — modified:** `js/src/renderer/components/mosaic-carousel.ts` ·
`src/Service/MosaicRenderer.php` · `src/Plugin/MosaicLayoutMigration/V5ToV6Migration.php` ·
`modules/mosaic_components/components/mosaic_carousel/{mosaic_carousel.twig, mosaic_carousel.component.yml}` ·
`tests/src/Kernel/Component/MosaicCarouselRenderTest.php` ·
`tests/src/Unit/Plugin/MosaicLayoutMigration/V5ToV6MigrationTest.php` · `js/dist/renderer.js` (rebuilt).
**New:** `tests/src/Kernel/Controller/ManifestFieldTypesTest.php` (#50 cell added) ·
evidence-only journeys `js/e2e/journeys/{carousel-slider-geometry, ship34-carousel-sync, ship34-carousel-fe, ship34-carousel-lifecycle}.spec.ts` (gitignored).

**Extra add commands (mosaic repo, Arun runs):**
```
git add modules/mosaic_components/components/mosaic_carousel/mosaic_carousel.component.yml
git add tests/src/Kernel/Controller/ManifestFieldTypesTest.php
git add js/dist/renderer.js   # rebuilt with the #53/#54 style-adoption fix
```

**Gates (this pass):** PHPCS 0/0 (all changed files) · Unit+Kernel **2878/0** (7516
assertions, 1 pre-existing PHPUnit warning) · Vitest **496/1** (the 1 fail is the
documented pre-existing B-101 adapter bool→radio oracle drift, unrelated to the
carousel) · e2e gates lock + f066 + F-094 scroll parity **15/15** · all 5 carousel
journeys green. PHPStan: my delta is clean (the only hit in a changed file is the
pre-existing `MosaicRenderer.php:214 $item->value` magic-property access in the
untouched `render()`); the module currently shows 61 pre-existing PHPStan errors on
`src/ tests/` with PHP-version/tooling signatures (`on PHP < 8.4`,
`AccessResultInterface::cachePerPermissions()`, `ReflectionType` cast deprecation)
= environmental drift since ship #34, spanning dozens of untouched files.

**FOLLOW-UP LEDGER:** (a) `npm run build` is broken — references a missing
`vite.bundles.config.ts`; the builder bundle can only be rebuilt via
`vite.builder.config.ts` directly (renderer via `build:renderer` works). (b) PHPStan
environmental drift (61 errors) needs a tooling/PHP-version reconcile, separate
from any feature work. (c) The same DSD style-adoption gap is latent in
`mosaic-tabs.ts` + `mosaic-live-search.ts` (they survive unstyled because their
show/hide is attribute-driven, not CSS-driven) — witness + fix when touched.
