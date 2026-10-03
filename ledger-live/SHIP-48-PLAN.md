# SHIP #48 PLAN (started CP-ADOPT-8 CHECKPOINT-1) — Canvas-dialect shapes

Parent: ship #47 = `33cd40c`. Ship #48 = CP-ADOPT-8 (+ later CP-ADOPT-9). Mosaic tree edited (Arun
commits); evidence repo carries this plan + REPORT-CP-ADOPT-8.md. dist NOT bumped (no adapter/JS change —
resolution is server-side).

## New paths (CHECKPOINT-1)
- `src/Sdc/MosaicSchemaRefResolver.php` — the resolver service.
- `config/schema/mosaic.canvas-shapes.json` — bundled well-known shapes (convention-derived; confirm vs Canvas at build).
- `tests/src/Kernel/Adopt/CanvasShapesTest.php` — 7 cells.
- `tests/modules/adopt_fixture/schema.json` — a module-local `$def` (`local_media`).
- `tests/modules/adopt_fixture/components/adopt_shaped/{adopt_shaped.component.yml,adopt_shaped.twig}` — the fixture component.

## Modified
- `src/Sdc/MosaicPropShapeRegistry.php` — inject resolver; resolve → classify; `rawReason` names unresolved URI.
- `src/Sdc/PropShape.php` — scalar-only union → text (unwrapNullable).
- `mosaic.services.yml` — `mosaic.schema_ref_resolver` + inject into `mosaic.prop_shape_registry`.
- `tests/src/Unit/Sdc/PropShapeTest.php` — scalar-union oracle updated + structural-union cell added.

## Gates at CHECKPOINT-1
- Kernel+Unit 3150/0 · Functional 76/0 · Vitest 724/1 (B-101; no JS) · phpcs 0 · phpstan 0 new ·
  owned REGION 14e6cb9c…3954 + STYLE b7756795…ca982 4354 10 IDENTICAL · dist 1.0.79 (unchanged).
- Re-grade: «ext» base 47/47 Ready; «ext-canvas» card image → media (disk witness).

## Remaining in CP-ADOPT-8
- CHECKPOINT-2: object-shape detectors — link → link, date-range → dates, heading → text (resolved objects
  currently fall to RAW/Attention; safe). Plus H4 defaults + H5 validation of object shapes at save;
  Functional node-form save of a shape-ref component with a media value.
- Then CP-ADOPT-9 (Manage authoring): rail = exportable config; precedence SDC>site>profile>shape>heuristic.

## Standing
Owned oracles the gate; naming ban «ext»/«ext-canvas» in evidence; Canvas NEVER enabled; no AI co-author trailer.

## CHECKPOINT-2 additions
- Modified `src/Sdc/PropShape.php` (looksLikeLink), `tests/src/Kernel/Adopt/CanvasShapesTest.php` (10 cells),
  `tests/modules/adopt_fixture/components/adopt_shaped/{adopt_shaped.component.yml,adopt_shaped.twig}` (inline shapes + cta).
- date-range/heading compound-shape detectors DEFERRED (sub-field descriptor infra); the `$ref`-at-render
  finding recorded. dist still unchanged (no JS).
- CP-ADOPT-9 P0 blueprint filed: reports/REPORT-CP-ADOPT-9.md (14-knob table, shape_map + authoring entity
  overrides-only, precedence + H5, UI, lifecycle, 5 risks, 6-pass build order).

## CP-ADOPT-9 P1 (shape_map) — new paths
- `config/install/mosaic.shape_map.yml`, `src/Sdc/MosaicShapeMap.php`, `src/Form/MosaicShapeMapForm.php`,
  `tests/src/Kernel/Adopt/ShapeMapTest.php`, `tests/src/Functional/Adopt/ShapeMapFormTest.php`.
- Modified `mosaic.services.yml` (mosaic.shape_map), `mosaic.routing.yml` (mosaic.admin.field_types),
  `config/schema/mosaic.schema.yml`. Server-only — dist unchanged. Client rail-follows = CHECKPOINT-2.

## CP-ADOPT-9 P2 (CHECKPOINT-3) — authoring entity + resolver (H5) + owned migration
Arun-ruled scope: entity keystone + owned migration; the Manage-authoring form + client rail application (P3)
+ drift flag are the next landing.
- New: `src/Entity/MosaicComponentAuthoring.php` + `MosaicComponentAuthoringInterface.php` (overrides-only
  config entity), `src/Sdc/MosaicAuthoringResolver.php` (`mosaic.authoring_resolver` — the ONE resolver:
  precedence SDC>entity>profile>shape-map>heuristic + H5 refusals + `ensure()` auto-gen),
  `tests/src/Kernel/Adopt/AuthoringResolverTest.php` (11 cells / 61 assert).
- Modified: `config/schema/mosaic.schema.yml` (mosaic.component_authoring.*), `mosaic.services.yml`
  (authoring_resolver + inject into manifest_builder), `src/Service/MosaicManifestBuilder.php`
  (applyOverrides overlay at buildComponentEntry end), `src/Plugin/Field/FieldWidget/MosaicLayoutWidget.php`
  (mosaic_component_authoring_list cache tag), `mosaic.install` (mosaic_update_10004 owned migration),
  3 test instantiations updated (MosaicLayoutWidgetTest, ManifestControllerTest, SlotDescriptorEmissionTest).
- Gates FULL: Unit 2832/0 · Kernel 336/0 (3 skip) · Functional FULL 78/0 (813 assert, 2 skip) ·
  Vitest 731/1 (B-101; no JS) · phpcs 0 err · phpstan 0 new · owned REGION 14e6cb9c…3954 + STYLE
  b7756795…ca982 4354 10 VERBATIM · dist UNCHANGED (server-side overlay; no BUMP-LIBS).
- Evidence: reports/REPORT-ADOPT9-CP3.md.

## CP-ADOPT-9 P3 (CHECKPOINT-4) — the Manage-authoring FORM (§5.5)
Arun-ruled scope: the form first; the client rail application + headed films = CHECKPOINT-5.
- New: `src/Form/MosaicComponentAuthoringForm.php` (route
  /admin/config/mosaic/component-libraries/{provider}/{component}/authoring; FIELDS tabledrag +
  compatible-widget selects + Hidden + required-lock + capabilities + SLOTS + previews + Reset;
  validateForm = H5 refusals() as row errors + Save blocked; submitForm = overrides-only persist),
  `tests/src/Functional/Adopt/ComponentAuthoringFormTest.php` (4 cells / 46 assert),
  `tests/modules/adopt_fixture/components/adopt_required/` (required-prop fixture for the H5 refusal cell).
- Modified: `mosaic.routing.yml` (mosaic.admin.component_authoring), `src/Form/MosaicComponentLibrariesForm.php`
  ("Manage authoring →" link per component), `src/Service/MosaicManifestBuilder.php` (extract
  buildComponentDefaults = pre-overlay entry; buildComponentEntry = defaults + P2 overlay).
- Gates FULL: Unit 2832/0 · Kernel 336/0 (3 skip) · Functional FULL 82/0 (859 assert, 2 skip; +4
  ComponentAuthoringFormTest) · Vitest 731/1 (B-101; no JS) · phpcs 0 err · phpstan 0 new · owned REGION
  14e6cb9c…3954 + STYLE b7756795…ca982 4354 10 VERBATIM · dist UNCHANGED (no adapter/JS; no BUMP-LIBS).
- Evidence: reports/REPORT-ADOPT9-CP4.md + reports/WALK-CP-ADOPT-9.md.
- Ship count: parent #47 = 33cd40c; the full CP-ADOPT-9 landing (P0/P1 + CP-2 + CP-3 + CP-4) is the mosaic
  working tree, uncommitted (Arun commits). Mosaic one-line message:
  "CP-ADOPT-9: shape_map + authoring entity + resolver (H5) + owned migration + Manage-authoring form;
   Unit 2832/0 Kernel 336/0 Functional 82/0 Vitest 731/1; owned shasums verbatim; dist unchanged"

## SHIP #48 — REGENERATED STATUS at CP-ADOPT-9 CHECKPOINT-5 (2026-10-03)

Parent ship #47 = `33cd40c`. The full CP-ADOPT-8 + CP-ADOPT-9 landing is in the mosaic working tree
(branch `fix/finding-016-validator`), **uncommitted — Arun commits**. Mosaic git is READ-ONLY to the AI.

### FULL verbatim `git status --short` (37 files)
```
 M config/schema/mosaic.schema.yml
 M js/dist/builder.js
 M js/dist/frontend-editor.js
 M js/src/builder/MosaicPuckAdapter.ts
 M mosaic.install
 M mosaic.libraries.yml
 M mosaic.routing.yml
 M mosaic.services.yml
 M src/Form/MosaicComponentLibrariesForm.php
 M src/Plugin/Field/FieldWidget/MosaicLayoutWidget.php
 M src/Sdc/MosaicPropShapeRegistry.php
 M src/Sdc/PropShape.php
 M src/Service/MosaicManifestBuilder.php
 M tests/src/Kernel/Adopt/SlotDescriptorEmissionTest.php
 M tests/src/Unit/Controller/ManifestControllerTest.php
 M tests/src/Unit/Plugin/Field/MosaicLayoutWidgetTest.php
 M tests/src/Unit/Sdc/PropShapeTest.php
?? config/install/mosaic.shape_map.yml
?? config/schema/mosaic.canvas-shapes.json
?? js/src/builder/__tests__/railApplication.test.ts
?? js/src/builder/__tests__/shapeMap.test.ts
?? js/src/builder/shapeMap.ts
?? src/Entity/MosaicComponentAuthoring.php
?? src/Entity/MosaicComponentAuthoringInterface.php
?? src/Form/MosaicComponentAuthoringForm.php
?? src/Form/MosaicShapeMapForm.php
?? src/Sdc/MosaicAuthoringResolver.php
?? src/Sdc/MosaicSchemaRefResolver.php
?? src/Sdc/MosaicShapeMap.php
?? tests/modules/adopt_fixture/components/adopt_required/
?? tests/modules/adopt_fixture/components/adopt_shaped/
?? tests/modules/adopt_fixture/schema.json
?? tests/src/Functional/Adopt/ComponentAuthoringFormTest.php
?? tests/src/Functional/Adopt/ShapeMapFormTest.php
?? tests/src/Kernel/Adopt/AuthoringResolverTest.php
?? tests/src/Kernel/Adopt/CanvasShapesTest.php
?? tests/src/Kernel/Adopt/ShapeMapTest.php
```
**Count: 37** (17 modified + 20 untracked).

### check-ignore + exclusions
- `git check-ignore js/node_modules` → **ignored** (build deps, never committed). ✓
- `git check-ignore js/dist/builder.js` → **NOT ignored = TRACKED**: the built bundles (`js/dist/*`) ARE
  committed — they are the shipped library (F-065 cache-bust via `mosaic.libraries.yml` versions). ✓
- No other exclusions: `tests/modules/adopt_fixture/` is a committed test module; `config/install/` and
  `config/schema/` are committed config.

### SdcComponentPlugin.php line
`src/Plugin/MosaicComponent/SdcComponentPlugin.php` is **UNMODIFIED** — the historical CP-SDC-PROPS hold is
NOT in this tree. This landing touches no SDC plugin internals; the authoring layer sits above the manifest
build (`MosaicManifestBuilder`), not the component plugin.

### Single-quoted commit message (covers ADOPT-8 + ADOPT-9)
```
'CP-ADOPT-8 + CP-ADOPT-9: Canvas-dialect shape resolver + site authoring config — json-schema-definitions resolver + bundled shapes (ADOPT-8); shape_map + per-component mosaic_component_authoring entity (overrides-only) + ONE H5 precedence resolver (SDC>entity>profile>shape-map>heuristic) + owned migration (mosaic_update_10004) + Manage-authoring form + rail applies the overrides (label/hidden) for owned and adopted (ADOPT-9 P1-P3); Unit 2832/0 Kernel 336/0 Functional 82/0 Vitest 736/1; owned shasums verbatim; dist 1.0.81'
```

### Gates at CHECKPOINT-5 (FULL)
Unit **2832/0** · Kernel **336/0** (3 skip; no PHP delta this pass) · Functional FULL **82/0** (859 assert,
2 skip) · Vitest **736/1** (B-101; +5 railApplication) · phpcs **0 err** · phpstan **0 new** · typecheck
clean · owned **REGION 14e6cb9c…3954 + STYLE b7756795…ca982 4354 10 VERBATIM** · dist **1.0.80 → 1.0.81**
(builder + frontend-editor rebuilt; renderer unchanged).

### Checkpoints (all filed in reports/)
REPORT-CP-ADOPT-8.md · REPORT-CP-ADOPT-9.md (P0 blueprint) · REPORT-ADOPT9-CP2.md · REPORT-ADOPT9-CP3.md ·
REPORT-ADOPT9-CP4.md · REPORT-ADOPT9-CP5.md · WALK-CP-ADOPT-9.md. Remaining polish (recorded in CP5 report):
capability section-gating, slot-rail, previews/patterns/order, help text, and the headed films (Arun's walk,
config-write).

## CP-ADOPT-9 CHECKPOINT-6 note (2026-10-03) — widget-kind applied; arc NOT fully closed
JS-only pass; file count unchanged at **37** (no new files — shapeMap.ts/MosaicPuckAdapter.ts/
railApplication.test.ts/libraries.yml/dist already in the landing). Built: widget-kind re-dispatch
(shapeMap.fieldTypeForWidget + descriptorToPuckField). KNOB COVERAGE (see reports/REPORT-ADOPT9-CP6.md):
APPLIED 6 — widget-kind, hidden, label, slot-allowed, slot-repeater, previews. REMAINING 8 with precise
obstacles — default (schema-default seed), capabilities (KEY MISMATCH bindable/stylable vs native bind/
style — a CP-3/4 bug), patterns-shown + rail-order (not consumed), help (no Puck slot), slot preferred/
open-cell (rail wiring unaudited). Gates: Vitest 742/1 (+6 widget-kind), Unit 2832/0, Kernel 336/0,
Functional FULL 82/0; owned shasums VERBATIM; dist BUMP-LIBS 1.0.81→1.0.82. The arc is NOT fully closed;
the follow-up is bounded (1 capability reconciliation + 3 small client reads + a defaultProps tweak).

## CP-ADOPT-9 CHECKPOINT-7 note (2026-10-03) — capability reconciliation + 10/14 knobs
PHP + JS pass; file count unchanged **37** (no new files). Capability vocabulary RECONCILED to the native
CP-ADOPT-5 shape — `capabilities.bind` (source LIST | FALSE), `.breakpoint`, `.style` — across form ↔ schema
↔ resolver ↔ manifest ↔ client; the form's checkboxes RESTRICT (H5), never fabricate. Built: default
(toConfig defaultProps from the resolved row), rail_order (orderFields), slot open-cell (allows plain
content). Migration `mosaic_update_10005` renames old `bindable`/`stylable` rows (expect 0 on dev).
KNOB COVERAGE (see reports/REPORT-ADOPT9-CP7.md): APPLIED **10/14** — widget-kind, hidden, label,
slot-allowed, slot-repeater, previews, capabilities (FIXED), default, rail-order, open-cell. REMAINING **4**:
required-marker (byte-identical conflict — marks schema-required fields), help (no Puck help slot → custom
wrapper needed), slot-preferred (ADOPT-7R fill UX), patterns-shown (PaletteCard/index.tsx filter).
Gates: Vitest 746/1 (+4), Unit 2832/0, Kernel 337/0 (+1 capability cell), Functional FULL (see paste);
owned shasums VERBATIM; dist BUMP-LIBS 1.0.82→1.0.83. Arc NOT fully closed; the 4 follow-ups are a design
ruling + a custom wrapper + fill-UX + a palette change.

## CP-ADOPT-9 CHECKPOINT-8 note (2026-10-03) — required + help + slot preferred (13/14)
JS-only pass; file count **37 → 39** (+ `js/src/builder/MosaicFieldLabel.tsx` new, `js/src/builder/BuilderApp.tsx`
newly modified for the fieldLabel override). Built: required marker (markRequired, both paths), help
(sentinel-encoded label + MosaicFieldLabel fieldLabel override reusing Puck's exported FieldLabel — help
under the control, byte-identical when absent), slot preferred (resolved child first in `allow` → zone-picker
primary). railApplication.test.ts 21 cells (+6). BUMP-LIBS 1.0.83→1.0.84; dist rebuilt (renderer untouched).
KNOB COVERAGE (reports/REPORT-ADOPT9-CP8.md): APPLIED **13/14** — widget-kind, hidden, label, slot-allowed,
slot-repeater, previews, capabilities, default, rail-order, open-cell, required, help, slot-preferred.
REMAINING **1**: patterns-shown — architectural blocker (patterns library-grouped not component-linked;
patterns_shown per-component + unexposed to client; ambiguous per-component→global-palette filter; needs PHP
exposure + PaletteCard filter + a semantic ruling).
ORACLE CHANGE: 0 owned-panel Vitest oracles changed (no owned/fixture component is required or has help →
marker/help are no-ops on fixtures); both page shasums VERBATIM.
Gates: Vitest 752/1 (+6), Unit 2832/0, Kernel 337/0 (no PHP delta), Functional FULL (see paste); owned
shasums VERBATIM; dist 1.0.84. ARC: 13/14 — one knob (patterns) with a recorded architectural blocker.

## CP-ADOPT-9 CHECKPOINT-9 note (2026-10-03) — image prop + help-from-schema + `replaces` (13/14)
PHP + JS pass (Arun ruled "Image prop + help + replaces"; patterns-shown DEFERRED → stays 13/14). Drupal 11.4.5.
IMAGE: MosaicPuckAdapter propsFieldsFromDescriptors new `isAdopted && kind==='media'` branch → our media
picker ("Card Image", image before the HTML media fill; owned media unchanged). MosaicPropResolver::
resolveInlineImageSentinel (url→src). MosaicRenderer::resolveInlineImageProps (MEDIA props not in
prop_types/field_types holding a sentinel; both render sites; owned byte-identical). MosaicPropValidator::
validateMediaSchemes/validateInlineImageScheme/mediaFileScheme — x-allowed-schemes honoured at SAVE (full
definition schema, runs before the empty-getPropDefinitions early return → fires for adopted). Fixture
adopt_shaped image: required src + contentMediaType image/* + x-allowed-schemes [public,https] + default/
examples + title "Card Image"; thumbnail.src [private] (negative).
HELP: PropDescriptor::$help (emitted only when non-empty → byte-identical when absent) ← schema description
(MosaicPropShapeRegistry::describe); form help override wins (MosaicAuthoringResolver, pre-existing); client
consumes via CP-8 MosaicFieldLabel. ORACLE CHANGE: owned props WITH a schema description now show it as the
help line (intended UI gain); description-less fixtures byte-identical.
REPLACES: MosaicAdoptionProfile parses `replaces:` (validated/cached); MosaicComponentGovernance
replacedSet/replacedBy/isReplaced — replaced id NOT authorable (palette-hidden) but still isAvailable
(renders); libraries page "Replaced by …" note. Injected into widget + container service. Isolated fixture
module tests/modules/adopt_replacer/ (replaces adopt_fixture:adopt_widget) — no perturbation of adopt_fixture.
KNOB COVERAGE: 13/14 (unchanged; CP-9 closed the IMAGE gap + HELP + replaces governance, orthogonal to the
14 knobs). Patterns-shown remains the one deferred (architectural blocker).
GATE FULL GREEN (11.4.5): typecheck clean; Vitest 757/1-pre B-101 (+5: 3 image + 2 help; railApplication 26);
Unit+Kernel 3177/0 (1 warn + 3 skip pre-existing; +8 cells: InlineImageTest 4, ComponentReplacesTest 3,
MosaicPropResolverTest 1); Functional FULL 82/0 (859 assert, 2 skip — image save+render proven at Kernel,
not a new BrowserTestBase cell: a React media-pick can't run headless). phpcs src clean (0 err). PHPStan:
CP-9 files add 0; pre-existing Drupal-11.4 env baseline (80 module-wide: check_markup deprecation +
DependencySerializationTrait private-prop rule + ReflectionType casts) → backlog B-102. OWNED SHASUMS
VERBATIM: REGION 14e6cb9c…3954, STYLE b7756795…ca982 4354 10. BUMP-LIBS 1.0.84→1.0.85; dist rebuilt.
Evidence: reports/REPORT-ADOPT9-CP9.md + WALK (W6-W8) + SHIP-48-PLAN. REDS: B-101 (Vitest). Arun commits the
mosaic landing. NEW FILES: tests/modules/adopt_replacer/*, tests/src/Kernel/Adopt/{InlineImageTest,
ComponentReplacesTest}.php.

## SHIP #48 — REGENERATED STATUS at CP-ADOPT-9 CHECKPOINT-10 (2026-10-03)

Parent ship #47 = `33cd40c`. The full CP-ADOPT-8 + CP-ADOPT-9 landing (all checkpoints, patterns now 14/14)
is in the mosaic working tree (branch `fix/finding-016-validator`), **uncommitted — Arun commits**. Mosaic
git is READ-ONLY to the AI. Drupal core 11.4.5.

### FULL verbatim `git status --short` (53 files)
```
 M config/schema/mosaic.schema.yml
 M js/dist/builder.js
 M js/dist/frontend-editor.js
 M js/src/builder/BuilderApp.tsx
 M js/src/builder/MosaicPuckAdapter.ts
 M mosaic.install
 M mosaic.libraries.yml
 M mosaic.routing.yml
 M mosaic.services.yml
 M src/Entity/MosaicComponentLibrary.php
 M src/Form/MosaicComponentLibrariesForm.php
 M src/Plugin/Field/FieldWidget/MosaicLayoutWidget.php
 M src/Sdc/MosaicAdoptionProfile.php
 M src/Sdc/MosaicPropShapeRegistry.php
 M src/Sdc/PropDescriptor.php
 M src/Sdc/PropShape.php
 M src/Service/MosaicComponentGovernance.php
 M src/Service/MosaicManifestBuilder.php
 M src/Service/MosaicPropResolver.php
 M src/Service/MosaicPropValidator.php
 M src/Service/MosaicRenderer.php
 M tests/src/Kernel/Adopt/PatternsTest.php
 M tests/src/Kernel/Adopt/SlotDescriptorEmissionTest.php
 M tests/src/Kernel/Service/MosaicPropResolverTest.php
 M tests/src/Unit/Controller/ManifestControllerTest.php
 M tests/src/Unit/Plugin/Field/MosaicLayoutWidgetTest.php
 M tests/src/Unit/Sdc/PropShapeTest.php
?? config/install/mosaic.shape_map.yml
?? config/schema/mosaic.canvas-shapes.json
?? js/src/builder/MosaicFieldLabel.tsx
?? js/src/builder/__tests__/MosaicPatternsPanel.test.tsx
?? js/src/builder/__tests__/railApplication.test.ts
?? js/src/builder/__tests__/shapeMap.test.ts
?? js/src/builder/shapeMap.ts
?? src/Entity/MosaicComponentAuthoring.php
?? src/Entity/MosaicComponentAuthoringInterface.php
?? src/Form/MosaicComponentAuthoringForm.php
?? src/Form/MosaicShapeMapForm.php
?? src/Sdc/MosaicAuthoringResolver.php
?? src/Sdc/MosaicSchemaRefResolver.php
?? src/Sdc/MosaicShapeMap.php
?? tests/modules/adopt_fixture/components/adopt_required/
?? tests/modules/adopt_fixture/components/adopt_shaped/
?? tests/modules/adopt_fixture/schema.json
?? tests/modules/adopt_replacer/
?? tests/src/Functional/Adopt/ComponentAuthoringFormTest.php
?? tests/src/Functional/Adopt/LibraryPatternsFormTest.php
?? tests/src/Functional/Adopt/ShapeMapFormTest.php
?? tests/src/Kernel/Adopt/AuthoringResolverTest.php
?? tests/src/Kernel/Adopt/CanvasShapesTest.php
?? tests/src/Kernel/Adopt/ComponentReplacesTest.php
?? tests/src/Kernel/Adopt/InlineImageTest.php
?? tests/src/Kernel/Adopt/ShapeMapTest.php
```
**Count: 53** (27 modified + 26 untracked). CP-10 delta vs CHECKPOINT-9's 49: +`MosaicPatternsPanel.test.tsx`,
+`LibraryPatternsFormTest.php`, +`ComponentReplacesTest.php`/`InlineImageTest.php` (CP-9 untracked now listed),
and `PatternsTest.php` becomes modified.

### check-ignore + exclusions
- `git check-ignore js/node_modules` → **ignored** (build deps, never committed). ✓
- `git check-ignore js/dist/builder.js` → **NOT ignored = TRACKED**: the built bundles (`js/dist/*`) ARE
  committed — the shipped library (F-065 cache-bust via `mosaic.libraries.yml` versions). ✓
- No other exclusions: `tests/modules/adopt_fixture/` + `tests/modules/adopt_replacer/` are committed test
  modules; `config/install/` + `config/schema/` are committed config. CHECKPOINT-10 added no new ignore rule.

### SdcComponentPlugin.php line
`src/Plugin/MosaicComponent/SdcComponentPlugin.php` is **UNMODIFIED** (git diff --quiet clean) — the historical
CP-SDC-PROPS hold is NOT in this tree. The authoring + patterns layer sits above the manifest build
(`MosaicManifestBuilder`), never the component plugin internals.

### Single-quoted commit message (covers ADOPT-8 + ADOPT-9, all checkpoints)
```
'CP-ADOPT-8 + CP-ADOPT-9: Canvas-dialect shape resolver + site-configurable authoring — json-schema-definitions resolver + bundled canvas-shapes (ADOPT-8); shape_map + per-component mosaic_component_authoring entity (overrides-only) + ONE H5 precedence resolver (SDC>entity>profile>shape-map>heuristic) + owned migration (mosaic_update_10004) + Manage-authoring form + rail applies every resolved knob (14/14: widget-kind/hidden/label/slot allowed+repeater/previews/capabilities/default/rail-order/open-cell/required/help-from-schema/slot-preferred/patterns); adopted inline-image media picker (Card Image, url->src render + x-allowed-schemes at save); component replaces governance (replaced hidden from palette, still renders); patterns at the library level (mosaic_component_library.patterns_hidden[], per-library Show/Hide, palette follows) with patterns_shown removed from the component entity (mosaic_update_10006); owned FE render byte-identical 14e6cb9c/b7756795, libs 1.0.85'
```

### Gates at CHECKPOINT-10 (FULL, Drupal 11.4.5)
Unit+Kernel **3178/0** (1 warn + 3 skip pre-existing) · Functional FULL **84/0** (890 assert, 2 skip) · Vitest **759/1** (B-101;
+2 MosaicPatternsPanel) · phpcs **0 err** (mosaic.install 3 pre-existing errors auto-fixed; rest line-length
warnings) · phpstan **0 new** (CP-10 files; 79 pre-existing 11.4 baseline B-102) · typecheck clean · owned
**REGION 14e6cb9c…3954 + STYLE b7756795…ca982 4354 10 VERBATIM** · dist **unchanged (1.0.85)** — server-side
pass, no bundled client code changed, so NO rebuild / NO BUMP-LIBS.

### Checkpoints (all filed in reports/)
REPORT-CP-ADOPT-8.md · REPORT-CP-ADOPT-9.md · REPORT-ADOPT9-CP2…CP10.md · WALK-CP-ADOPT-9.md (final, W0–W10).
**Arc closed — 14/14 knobs applied.**
