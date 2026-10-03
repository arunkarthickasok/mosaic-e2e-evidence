# CP-ADOPT-9 CHECKPOINT-10 — patterns at the library level (14/14)

**Date:** 2026-10-03 · **Branch:** `fix/finding-016-validator` (mosaic working tree — built + gated; NOT
AI-committed per commit-flow, handed to Arun). Parent ship #47 = `33cd40c`. Drupal core 11.4.5.
**Server-side pass (PHP) — no bundled client code changed, so dist is unchanged (libs stay 1.0.85).**

The one deferred knob — patterns-shown — lands here per the reviewer's ruling: **patterns are library-scoped**,
so "patterns shown" moves from the per-component authoring entity to the library entity as
`patterns_hidden[]`. Knob coverage reaches **14/14**.

## Built this pass (per the ruling)

### 1. Entity + form move
- **`mosaic_component_library::patterns_hidden[]`** — new config-exported property + `getHiddenPatterns()` /
  `setHiddenPatterns()` / `isPatternHidden()` on the library entity; schema `mosaic.component_library.*`
  gains a `patterns_hidden` sequence.
- **Removed `patterns_shown`** from the component authoring layer: the `MosaicComponentAuthoring` property +
  config_export + `getPatternsShown()` + its `isEmpty()` clause, the interface method, the resolver's
  `applyComponentLevel()` emission, the schema `mosaic.component_authoring.*`, and the stale form comment.
- **Update hook `mosaic_update_10006`** — strips any stored `patterns_shown` from authoring config via the
  config factory (the entity property no longer exists). Expected migration count **0** (the key was never
  exposed in the authoring form, so nothing ever stored it).
- **Component libraries page → per-library PATTERNS section** (`MosaicComponentLibrariesForm`): a `details`
  table of the library's declared patterns (label + machine id + the components inside the tree) each with a
  **"Shown in palette"** checkbox. Unticking persists the pattern's LOCAL id in `patterns_hidden[]`; re-ticking
  clears it. `mosaic.administer` gated (the page's route permission). The section is absent for a library that
  ships no patterns (owned/profile-less → nothing new).

### 2. Palette follows
- **`MosaicManifestBuilder::buildPatterns()`** now filters each library's `patterns_hidden[]` (read from the
  entity via a new, null-safe `EntityTypeManagerInterface` injection) — a hidden pattern never reaches the
  manifest, so the palette's Patterns group follows. The render is library-cache-tagged, so a hide/show
  takes effect **without a manual cache clear**.

## Knob coverage — 14/14 APPLIED

| knob | applied | cell / mechanism |
|---|---|---|
| widget kind | ✅ | Vitest ×6 |
| hidden | ✅ | Vitest ×2 |
| label | ✅ | Vitest ×2 |
| slot allowed children | ✅ | adapter |
| slot repeater child/min/max | ✅ | adapter + Kernel |
| previews on/off | ✅ | previewDefaults |
| capabilities → section gating | ✅ | Kernel AuthoringResolverTest |
| default value | ✅ | Kernel + toConfig |
| rail order | ✅ | Vitest ×2 |
| slot open cell | ✅ | Kernel |
| required marker | ✅ | Vitest ×2 |
| help text | ✅ (CP-9 from schema) | Vitest ×2 + MosaicFieldLabel |
| slot preferred | ✅ | Vitest ×2 |
| **patterns shown** | ✅ **(CP-10, library-level)** | Kernel `PatternsTest::testHiddenPatternIsFilteredFromManifest` + Functional `LibraryPatternsFormTest` (403/200 + hide/show round-trip) + Vitest `MosaicPatternsPanel` (shown present / hidden absent) |

**14/14 applied. The arc is closed.**

## Cells
- Kernel `PatternsTest::testHiddenPatternIsFilteredFromManifest` — a library with `patterns_hidden=['widget_row']`
  → `buildPatterns` drops `adopt_fixture:widget_row`; shown by default when nothing hidden.
- Kernel `AuthoringResolverTest::testComponentLevelOverridesApply` — retargeted: no component-level
  `patterns_shown` (asserts the key is absent from the resolved entry).
- Functional `LibraryPatternsFormTest` — 403 (anon + non-admin) / 200 (admin) with the Patterns section;
  untick → `patterns_hidden=['widget_row']` persisted; reload reflects it; re-tick clears it.
- Vitest `MosaicPatternsPanel.test.tsx` — the panel renders a shown pattern and never a hidden (absent) one.

## Gate (FULL, in DDEV — Drupal 11.4.5)

| Check | Result |
|---|---|
| TypeScript typecheck | clean |
| Vitest | __759 pass / 1 pre-existing B-101__ (+2 MosaicPatternsPanel) |
| PHPUnit Unit + Kernel | __3178 / 0__ (0 errors/failures; 1 warning + 3 skip pre-existing; +1 PatternsTest cell) |
| PHPUnit Functional FULL | __84 / 0__ (890 assert, 2 skip; +2 LibraryPatternsFormTest) |
| PHPCS | **0 errors** (3 pre-existing errors in mosaic.install auto-fixed; remaining are line-length warnings, mostly pre-existing) |
| PHPStan L6 | CP-10 files add **0 errors** (full-module filtered to the touched files = none); pre-existing Drupal-11.4 baseline B-102 = 79 (one fewer than CP-9's 80) |
| dist | **unchanged** — no bundled client code changed (server-side pass); libs stay **1.0.85**, no BUMP-LIBS |
| Owned shasums | **VERBATIM** — REGION `14e6cb9c…a43e0dec` 3954 · STYLE `b7756795…9aaca982` 4354/10 (the manifest filter touches the builder palette, not node/780's owned FE render) |

## Honest status
Patterns move cleanly to the library level; the per-component `patterns_shown` is fully removed (with a
no-op migration hook). Knob coverage is **14/14** — the arc is closed. This pass is server-side only, so the
client bundle is byte-identical (no BUMP-LIBS) and the owned render is untouched. The only red is the
pre-existing B-101 (Vitest) and the pre-existing Drupal-11.4 PHPStan baseline (B-102); neither is CP-10.
