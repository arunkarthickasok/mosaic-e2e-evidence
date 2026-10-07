# SHIP #49 PLAN — A1 rider: adopted libraries render (OWNED is an allow-list)

Parent ship #48 = `6f859a8`. Candidate uncommitted on the mosaic working tree; **Arun commits**. Mosaic git
READ-ONLY to the AI. Drupal core 11.4.5.

## Fix (A1, MOSAIC-SIDE)
`MosaicComponentAlias::providerIsOwned()` used a `mosaic`/`mosaic_*` **prefix** heuristic, so any third-party
module named `mosaic_*` (the reference fixture, a `mosaic_civic`) was mis-read as OWNED → bare ids → the
`#component` id could not bind props at SDC render → "property … is required" (HTTP 500). Replaced with an
explicit **`OWNED_PROVIDERS` allow-list** constant: the six production modules `mosaic, mosaic_components,
mosaic_views, mosaic_media, mosaic_webform, mosaic_builder_ui` **plus `mosaic_test`** (Mosaic's own test
fixture provider — never on production, but it ships owned-style components the test suite renders through
the owned path). Everything else — including a `mosaic_*`-named third party — is ADOPTED.
Cause: `src/Sdc/MosaicComponentAlias.php:92` (`providerIsOwned`); constant at `:28` (`OWNED_PROVIDERS`).

Verified safe: the only PRODUCTION owned providers that ship components (mosaic_components/13, mosaic_views/1,
mosaic_webform/1) are all in the list; only `mosaic_reference_library` flips to adopted (the fix). The
TIGHT-GATE Functional FULL CAUGHT a regression — `mosaic_test` (the suite's owned-style fixture) had flipped
to adopted and broke 8 render tests — so `mosaic_test` was added to the list (the gate did its job). The
guide §0 "never name mosaic_*" + the rename rider are WITHDRAWN — A1 is reclassified MOSAIC-SIDE.

## FULL verbatim `git status --short` (4 files)
```
 M src/Sdc/MosaicComponentAlias.php
 M tests/src/Kernel/Adopt/ReferenceLibraryTest.php
 M tests/src/Unit/Sdc/MosaicComponentAliasTest.php
?? tests/src/Functional/Adopt/ReferenceCardRenderTest.php
```
**Count: 4** (3 modified + 1 untracked). `SdcComponentPlugin.php` UNMODIFIED. node_modules ignored;
js/dist unchanged (no JS in this rider).

## Cells
- Unit `MosaicComponentAliasTest::testProviderIsOwned` — the six are owned; `mosaic_civic` +
  `mosaic_reference_library` are ADOPTED (A1); olivero/acme_ds/mosaicish adopted.
- Kernel `ReferenceLibraryTest::testRefCardRendersAfterA1` — ref_card renders (the 500 is gone); grade
  100% Ready + zero-untitled + rail=form order still green (ids now qualified).
- Functional `ReferenceCardRenderTest` — a ref_card node saves through the node form and renders `.ref-card`
  + its heading, no required-prop 500 (library turned ON; variant set — see A2).

## TIGHT GATE (full, quoted; Drupal 11.4.5)
Kernel+Unit FULL **3182/0** (1 warn + 3 skip pre-existing) · Functional FULL **88/0** (944 assert, 2 skip) · Vitest **761/1**
(B-101) · tsc **clean** · phpcs **0 errors** · phpstan **0 new** (B-102 baseline **79**) · region-shasum
**14e6cb9c…3954** verbatim · style-shasum **b7756795…ca982 4354 10** verbatim · served==built bundle
**21376a245c0e…** (dist unchanged, PHP-only rider) · headed film **films/cp-adopt-9r-a1/a1-ref_card-render.png**
(headed=true, status 200, .ref-card, heading rendered — the 500 is gone).

## Single-quoted commit message
```
'ship #49: CP-ADOPT-9R A1 - adopted libraries render (OWNED is an allow-list, not a mosaic_* prefix) - MosaicComponentAlias::providerIsOwned now checks an explicit OWNED_PROVIDERS constant (mosaic, mosaic_components, mosaic_views, mosaic_media, mosaic_webform, mosaic_builder_ui, + mosaic_test fixture); a third-party mosaic_*-named library (the reference fixture, mosaic_civic) is correctly ADOPTED, so its component ids stay qualified and bind props at SDC render (the required-prop 500 is gone); Unit+Kernel 3182/0, Functional 88/0, Vitest 761/1-pre, owned shasums verbatim 14e6cb9c/b7756795, dist unchanged libs 1.0.86'
```

## Follow-up finding (next rider, NOT this subsystem)
**A2:** an adopted component's **enum prop** left UNSET fails SDC validation on the FE page render ("" not
in the enum), because the canvas path preview-fills it but the page path does not and the schema default is
not applied through the `#variant` path. Next rider: apply the enum schema default (or pass the variant)
on the page render. Isolated out of A1 by setting `variant` explicitly in the Functional node.
