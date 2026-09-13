# SHIP #35 — CP-CAROUSEL-GEOMETRY (ruling R-56)

IN PROGRESS — one uncommitted change set on top of ship #34 rider (0c3e5b2). Mosaic git
read-only here; Arun commits at ceremony. REPORT-TO-REPO: reports/REPORT-CP-GEO.md.

## Scope (R-56)
Carousel-level frame + style, replacing per-slide image-style granularity.
- **aspect_ratio** prop (enum: auto|16:9|4:3|1:1|21:9, default auto). Every slide's image
  gets the SAME frame via CSS aspect-ratio + object-fit:cover; `auto` keeps natural shapes.
- **image_style** carousel-level select (one style, file weight). Resolver precedence
  contract: per-slide stored `image_style` (legacy) wins → else carousel-level → else original.
- **per-slide image-style select REMOVED** from the slides authoring surface (saved sentinels
  untouched, NO migration; legacy per-slide guard cells stay green).

## Key witness finding (why aspect-ratio is inline, not DSD/Lit)
The slides are LIGHT-DOM slotted content; shadow styles (DSD `<style>` + Lit static styles)
cannot reach a slotted slide's `<img>` descendant (::slotted matches only the top element),
and the admin builder page does not load the renderer CSS. The one mechanism visitor + admin
canvas + FE canvas ALL obey is INLINE styles on the light-DOM image in the SSR twig. The Lit
renderer needed NO change — so `dist/renderer.js` is untouched (builder bundle only).

## Files
**New:**
- `src/Plugin/MosaicFieldType/ImageStyleFieldType.php` (builder_type 'image_style').
- `js/src/builder/fields/MosaicImageStyleField.tsx` (carousel-level style select).
- `js/src/builder/fields/__tests__/carouselGeometry.test.tsx` (Vitest, 4 cells).
**Modified:**
- `modules/mosaic_components/components/mosaic_carousel/mosaic_carousel.component.yml` (aspect_ratio + image_style props).
- `modules/mosaic_components/components/mosaic_carousel/mosaic_carousel.mosaic.yml` (image_style field_type + slides.image image_style_select:false).
- `modules/mosaic_components/components/mosaic_carousel/mosaic_carousel.twig` (inline aspect-ratio/object-fit on the image).
- `src/Service/MosaicRenderer.php` (withDefaultImageStyle + carousel-level injection in resolveFieldTypeMedia).
- `js/src/builder/MosaicPuckAdapter.ts` (image_style case + imageStyleField + showImageStyle threading).
- `js/src/builder/fields/MosaicMediaField.tsx` (showImageStyle prop; per-slide select gated).
- `tests/src/Kernel/Component/MosaicCarouselRenderTest.php` (+ slide() helper + 4 CP-GEO cells).
- `js/dist/builder.js` + chunks + `js/dist/frontend-editor.js` (rebuilt; renderer.js UNTOUCHED).

## Gates
- PHPCS **0/0** (all changed PHP). Unit+Kernel **2884/0** (7605 assertions, 1 pre-existing warning).
- Vitest **507/1** (the 1 = pre-existing B-101 bool→radio oracle drift; unrelated).
- e2e **10/10**: cp-geo (visitor + FE canvas), F-103 (both), carousel slider-geometry + sync + fe,
  lock, f066, F-094 scroll.
- PHPStan delta clean (only hit = pre-existing MosaicRenderer.php:214 `$item->value` single-file artifact).

## Proof highlights
- Geometry e2e node 947 (3 wildly different source shapes, 16:9): VISITOR all 3 imgs = 788×443
  (=16/9), FE canvas all 3 = 616×347 (=16/9), object-fit:cover, slider clips/advances, FE inert.
- auto node 948: natural different boxes (788×411, 450×420, 788×924), no inline style.
- Kernel: aspect_ratio emits CSS; carousel-level styles all slides; legacy per-slide wins;
  auto emits no constraint. Vitest: panel exposes aspect_ratio(select)+image_style(custom);
  carousel slide media hides the per-slide select; normal media keeps it.

## Add commands (mosaic repo, Arun runs)
```
git add src/Plugin/MosaicFieldType/ImageStyleFieldType.php
git add src/Service/MosaicRenderer.php
git add modules/mosaic_components/components/mosaic_carousel/mosaic_carousel.component.yml
git add modules/mosaic_components/components/mosaic_carousel/mosaic_carousel.mosaic.yml
git add modules/mosaic_components/components/mosaic_carousel/mosaic_carousel.twig
git add js/src/builder/MosaicPuckAdapter.ts
git add js/src/builder/fields/MosaicMediaField.tsx js/src/builder/fields/MosaicImageStyleField.tsx
git add js/src/builder/fields/__tests__/carouselGeometry.test.tsx
git add tests/src/Kernel/Component/MosaicCarouselRenderTest.php
git add js/dist/builder.js js/dist/frontend-editor.js js/dist/chunk-*.js js/dist/assets
```
Evidence-only (gitignored): js/e2e/journeys/cp-geo-aspect.spec.ts.
