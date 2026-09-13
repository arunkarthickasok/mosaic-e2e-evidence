# REPORT — CP-CAROUSEL-GEOMETRY (ruling R-56, SHIP #35)

**Status:** COMPLETE — carousel-level aspect_ratio + image_style built; per-slide style
select removed; RED→GREEN Kernel (4) + Vitest (4); geometry e2e both surfaces; gates green.
One uncommitted change set on top of ship #34 rider (0c3e5b2). Read-only mosaic git.

## Pre-flight
Rider verified: HEAD 0c3e5b2 "ship #34 rider: manifest guard cell for #50", parent 3873685,
== origin; ManifestFieldTypesTest.php +25 in HEAD; only noise unstaged.

## G1 WITNESS (quoted before building)
- `mosaic_carousel.component.yml`: props auto_advance/interval/loop/slides (no aspect_ratio/style).
- `mosaic_carousel.mosaic.yml`: field_types.slides (repeatable) → image sub-field type `media`.
- Image-style list source: `ImageStylesController::list()` → `[{id,label}]` from
  `image_style` storage, GET /mosaic/config/image-styles. `MosaicMediaField.tsx:59-64` fetches it;
  `default_image_style` (MediaFieldType.toBuilderField) only seeds the picker.
- Resolver precedence (`MosaicPropResolver.php:168-190`): responsive_image_style → image_style
  (`$style->buildUrl($uri)`) → original (`$file->createFileUrl()`).
- Slide markup: light-DOM slotted `.mosaic-carousel-slide` > (a?) > img; the shadow `<style>`
  `.mosaic-carousel-slide img{}` rule is INERT (shadow can't style slotted descendants). No
  light-DOM carousel CSS file exists.

## G2 BUILD (RED→GREEN)
- **a. aspect_ratio** — component.yml enum prop (auto default). The adapter's enum→select path
  (MosaicPuckAdapter:1694) renders it as a select. Twig emits INLINE `aspect-ratio:16/9;
  object-fit:cover` on the light-DOM image (a-wrapper when linked). **Design note:** the charter
  said "DSD AND Lit styles", but the target is light-DOM slotted content beyond shadow reach and
  the admin canvas doesn't load renderer CSS — inline SSR styles are the ONE mechanism all three
  surfaces obey, so the Lit renderer needed no change (dist/renderer.js untouched).
- **b. image_style** — new `ImageStyleFieldType` plugin (builder_type 'image_style'); mosaic.yml
  top-level `image_style` field_type → adapter `imageStyleField` → `MosaicImageStyleField.tsx`
  (fetches the same style list). Resolver: `MosaicRenderer::resolveFieldTypeMedia` reads the
  component-level `image_style` and injects it via `withDefaultImageStyle()` into any slide
  sentinel lacking its own — **precedence: legacy per-slide wins → carousel-level → original**.
- **c. per-slide select removed** — mosaic.yml slides.image `image_style_select: false` threaded
  through the adapter (`resolveSubFields`/`mediaField`) → `MosaicMediaField showImageStyle=false`
  hides the select. Saved sentinels untouched; no migration; legacy per-slide guards stay green.
- **RED→GREEN Kernel (MosaicCarouselRenderTest, 14/14):** aspect_ratio emits `aspect-ratio:16/9`
  + `object-fit:cover` on both slides; `auto` emits neither; carousel-level style → both slides
  `/styles/thumbnail/`; legacy per-slide `large` wins while the other inherits `thumbnail`.
- **RED→GREEN Vitest (carouselGeometry.test.tsx, 4/4):** manifest → aspect_ratio(select) +
  image_style(custom); carousel slide media hides the per-slide select; normal media keeps it;
  MosaicImageStyleField renders a style select with "— original —".

## G3 GEOMETRY e2e (cp-geo-aspect.spec.ts)
- Node 947 (3 source shapes: 1639×855, 450×420, 1070×1254), ratio 16:9:
  - VISITOR: all three `<img>` boxes = **788×443** (=16/9); object-fit computed `cover`; slider
    clips to one slide + arrow advances 0→1. Frame `cp-geo-01-visitor-16x9.png`.
  - FE dialog canvas: all three = **616×347** (=16/9); `data-mosaic-preview="canvas"` (F-103
    inert regression holds). Frame `cp-geo-02-fe-canvas-16x9.png`.
- Node 948 (same 3 shapes), ratio auto: natural different boxes **788×411 / 450×420 / 788×924**,
  img has no inline style → prior behavior intact.

## G4 dist + gates
- dist: builder + frontend-editor rebuilt (builder-first, FE-last, via the direct vite configs —
  `npm run build` is broken, missing vite.bundles.config.ts). **renderer.js untouched** (no Lit
  change — witness above).
- PHPCS 0/0; Unit+Kernel 2884/0; Vitest 507/1 (B-101 pre-existing); e2e 10/10; PHPStan delta clean.

## Files
See SHIP-35.md for the complete new/modified list + Arun's add commands.
