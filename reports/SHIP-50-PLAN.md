# SHIP #50 PLAN — oracle-rehearsal riders (batched)

Parent ship #49 = `0276f01`. Per Arun's ruling, the remaining rehearsal riders BATCH into one ship #50 with
this one plan; evidence is pushed per rider under the TIGHT GATE; no ceremony until both rehearsal tables are
green. Mosaic git READ-ONLY to the AI (Arun commits). Drupal 11.4.5.

## Riders in the #50 batch
### A2 — adopted enum prop seeded with its H4 default at render
**Cause (quoted):** SDC validates an enum prop at render; an UNSET enum arrives as `""` —
*"[…/variant] Does not have a value in the enumeration […]. The provided value is: ''"* — a page-render 500.
The canvas path preview-fills the example, so it only bit the real page.
**Fix:** `MosaicRenderer::buildAdoptedComponentElement` now seeds every unset enum prop with its H4 default —
schema `default` → `examples[0]` → the FIRST enum value (`MosaicRenderer::enumDefault`) — so the render NEVER
passes an unset enum to the SDC. Adopted element only; owned components (direct Twig) untouched. (Placement-
seed on the authoring side is the client complement; the render seed is what closes the 500 + fixes existing
nodes.) Cause/fix line: `src/Service/MosaicRenderer.php` `buildAdoptedComponentElement` seed loop +
`enumDefault()`.

## FULL verbatim `git status --short` (3 files, #50 so far)
```
 M src/Service/MosaicRenderer.php
 M tests/src/Functional/Adopt/ReferenceCardRenderTest.php
 M tests/src/Kernel/Adopt/ReferenceLibraryTest.php
```
**Count: 3** (all modified). node_modules ignored; js/dist unchanged (PHP-only). `SdcComponentPlugin.php`
UNMODIFIED.

## Cells
- Kernel `ReferenceLibraryTest::testUnsetEnumSeededAtRender` — `buildAdoptedComponentElement` seeds an unset
  `variant` with its schema default (`#variant === 'default'`).
- Functional `ReferenceCardRenderTest::testRefCardRendersWithUnsetEnum` — a ref_card node with no `variant`
  renders (HTTP 200, `.ref-card--default`, no "enumeration" error).

## TIGHT GATE (full, quoted; Drupal 11.4.5)
Kernel+Unit FULL **3183/0** · Functional FULL **89/0** (954 assert, 2 skip) · Vitest **761/1** (B-101) · tsc **clean** ·
phpcs **0 errors** · phpstan **0 new** (B-102 baseline **79**) · region-shasum **14e6cb9c…3954** verbatim ·
style-shasum **b7756795…ca982 4354 10** verbatim · served==built **21376a245c0e…** (dist unchanged) ·
headed films **films/cp-adopt-9r-a2/a2-unset-enum-render.png** (headed=true, HTTP 200, `.ref-card--default`).

## Single-quoted commit message (batch; grows as riders land)
```
'ship #50: oracle-rehearsal riders - A2 adopted enum props seeded with their H4 default at render (schema default -> examples[0] -> first enum value) so an UNSET enum is never passed to the SDC (the page-render enumeration 500 is gone); MosaicRenderer::buildAdoptedComponentElement + enumDefault(); owned components untouched; Kernel+Unit 3183/0, Functional 89/0, Vitest 761/1-pre, owned shasums verbatim 14e6cb9c/b7756795, dist unchanged libs 1.0.86'
```

## Rehearsal status
The ref_card page journeys (W-render, A–J) are UNBLOCKED by A2; the full W0–W9 + A–J headed-film suite and the
«ext» A–J + W2/W6/W9 re-run are the continuing rehearsal (films per step). Both tables not yet green →
no ceremony. Further riders found by the films append to this #50 batch.
