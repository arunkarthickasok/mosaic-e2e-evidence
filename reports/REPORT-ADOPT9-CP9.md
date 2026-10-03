# CP-ADOPT-9 CHECKPOINT-9 — image prop + help from schema + `replaces` proof

**Date:** 2026-10-03 · **Branch:** `fix/finding-016-validator` (mosaic working tree — built + gated;
NOT AI-committed per commit-flow, handed to Arun). Parent ship #47 = `33cd40c`. **PHP + JS pass.**

Per Arun's AskUserQuestion ruling — **"Image prop + help + replaces"** — this pass lands the inline IMAGE
prop in the rail, HELP-from-schema, and the `replaces:` proof. **Patterns-shown is DEFERRED** (stays the one
remaining knob → **13/14**; its architectural blocker is unchanged, recorded in REPORT-ADOPT9-CP8.md).

## 1. IMAGE PROP in the rail (the headline)

**WHY it was absent (quoted mechanism):**
- **PropShape classification** was already correct: an inline image OBJECT (an object carrying `src`) →
  `PropShape::looksLikeMedia` → `PropShape::MEDIA` (CanvasShapesTest proves `image`/`thumbnail` → MEDIA).
- **The adapter** then DROPPED it: `MosaicPuckAdapter.descriptorToField`'s `media` case fell through to
  `defToField(schema)` — an object field of raw `src/alt/width/height` TEXT inputs, never a picker.
- **Manifest emission / adapter filtering**: an adopted SDC returns an EMPTY `getPropDefinitions()` (WC#104),
  so adopted fields are built from `prop_descriptors`; the media descriptor reached `descriptorToField` and
  fell through — no picker, and the render side had no inline-image sentinel resolver.

**FIX (mechanism · file:line):**
- **Rail picker** — `js/src/builder/MosaicPuckAdapter.ts:propsFieldsFromDescriptors` (new `isAdopted &&
  descriptor.kind === 'media'` branch) → reuses `MosaicPuckAdapter.mediaField(...)` so an adopted inline
  image renders OUR media picker (type `custom`), labelled **"Card Image"** (markRequired/help-encoded).
  Owned media stays on the field_types path (isAdopted false → byte-identical).
- **Render resolution** — `src/Service/MosaicPropResolver.php::resolveInlineImageSentinel()` maps the shared
  media resolution `url` → `src` (carries alt/width/height); `src/Service/MosaicRenderer.php::resolveInlineImageProps()`
  resolves every MEDIA-classified prop NOT in prop_types/field_types that holds a drupal_media sentinel,
  called at BOTH render sites (renderSingleComponent + the per-node render). Guard → owned untouched.
- **x-allowed-schemes at SAVE** — `src/Service/MosaicPropValidator.php::validateMediaSchemes()` +
  `validateInlineImageScheme()` + `mediaFileScheme()`: a MEDIA prop declaring `x-allowed-schemes` refuses a
  picked media whose (thumbnail) file stream-wrapper scheme is not permitted. Read from the FULL definition
  schema and run BEFORE the empty-`getPropDefinitions()` early return, so it fires for ADOPTED components.
- **Preview-only default** — the inline image's `default`/`examples` ride the existing library-level
  `preview_defaults` path (CP-ADOPT-7R §3e / WC#97): badged on the canvas, never saved.
- **Rail order** — image before the HTML media fill is the schema's natural prop order; Vitest asserts it.
- **Fixture** — `tests/modules/adopt_fixture/.../adopt_shaped.component.yml`: `image` is now required `src`,
  `contentMediaType image/*`, `x-allowed-schemes [public, https]`, `default`+`examples`, title "Card Image";
  `thumbnail.src` is deliberately `x-allowed-schemes [private]` (the negative scheme case).

**Card rail field list** (adopted, from the descriptors): **`image` → "Card Image" (our media picker, type
custom)**, `thumbnail` → media picker, `heading` → text, `cta` → link. Image present, FIRST among media.

**Cells:** Vitest `railApplication.test.ts` (+3 image), Kernel `MosaicPropResolverTest::testResolveInlineImageSentinel`,
Kernel `InlineImageTest` (render sentinel → `<img src>`, literal-unchanged, save allows [public], save refuses [private]).

## 2. HELP from schema `description`

- `src/Sdc/PropDescriptor.php` — new `help` field (defaults `''`), carried through `withKind`/`withDefault`,
  emitted in `toArray()` ONLY when non-empty (a prop without a description is byte-identical).
- `src/Sdc/MosaicPropShapeRegistry.php::describe()` — `help` defaults from the schema `description`.
- Form override WINS — `MosaicAuthoringResolver::applyPropRow` already overwrites `help` from the authoring
  row; empty description → no help line. Client already consumes `descriptor.help` (CP-8:
  `propsFieldsFromDescriptors` → `encodeHelp` → `MosaicFieldLabel` renders under the control).
- **Oracle change:** owned/fixture components with NO `description` are byte-identical (Vitest unchanged;
  both page shasums verbatim). On the live site, every owned prop that DOES carry a schema `description`
  (e.g. mosaic_columns gap/columns, mosaic_text) now shows that description as its help line — a visible,
  intended UI gain, recorded here as the CP-9 oracle change. Cells: `railApplication.test.ts` (+2 help).

## 3. `replaces:` proof

- `src/Sdc/MosaicAdoptionProfile.php` — parses a `replaces:` map (successor local-id → replaced ids),
  validates the successor is a real SDC (warns otherwise), caches with the library tag.
- `src/Service/MosaicComponentGovernance.php` — `replacedSet()` aggregates every library's map;
  `isAuthorable()` returns FALSE for a replaced id (hidden from the palette) while `isAvailable()` is
  UNCHANGED (the replaced component still renders on existing pages); `replacedBy()`/`isReplaced()` back the
  libraries-page note. Injected into the container service + the node-form widget.
- `src/Form/MosaicComponentLibrariesForm.php` — a **"Replaced by … — not offered in the palette."** note on
  the replaced component's row.
- **Isolated fixture** (no perturbation of the shared adopt_fixture profile) — `tests/modules/adopt_replacer/`
  (a NON-Mosaic provider) whose `adopt_replacer.mosaic-adopt.yml` declares
  `replaces: { adopt_successor: [adopt_fixture:adopt_widget] }`.
- **Cell:** Kernel `ComponentReplacesTest` — profile parses replaces; `adopt_fixture:adopt_widget` is
  replaced/not-authorable; `adopt_replacer:adopt_successor` is the only one authorable; the replaced stays
  available to render; `replacedBy` names the successor.

## Knob coverage — 13/14 (patterns deferred per Arun)

Unchanged from CP-8 at 13/14 (widget-kind, hidden, label, slot-allowed, slot-repeater, previews,
capabilities, default, rail-order, open-cell, required, help, slot-preferred). Patterns-shown remains the
one deferred knob (architectural blocker in REPORT-ADOPT9-CP8.md). CHECKPOINT-9 did NOT add a knob — it
closed the IMAGE-prop gap, HELP-from-schema, and the `replaces` governance, all orthogonal to the 14 knobs.

## Gate (FULL, in DDEV — Drupal 11.4.5)

| Check | Result |
|---|---|
| TypeScript typecheck | clean |
| Vitest | __757 pass / 1 pre-existing B-101__ (+5 CP-9: 3 image + 2 help; railApplication 26) |
| PHPUnit Unit + Kernel | __3177 / 0__ (0 errors, 0 failures; 1 warning + 3 skipped pre-existing; +15 CP-9 cells) |
| PHPUnit Functional FULL | __82 / 0__ (859 assert, 2 skip — baseline; see note) |
| PHPCS (src/, changed) | 0 errors (src/ clean; test comment-wrap done; 2 pre-existing >80 warnings in MosaicPropResolverTest 146/147, not CP-9) |
| PHPStan L6 | CP-9 files add **0 errors**; a pre-existing **Drupal-11.4 environment baseline** (80 module-wide, e.g. 11.4 `check_markup` deprecation + PHP<8.4 `DependencySerializationTrait` private-prop rule) is unrelated to CP-9 → backlog B-102 |
| dist | rebuilt, BUMP-LIBS **1.0.84 → 1.0.85** |
| Owned shasums | **VERBATIM** — REGION `14e6cb9c…a43e0dec` 3954 · STYLE `b7756795…9aaca982` 4354/10 |

## Functional-coverage note (honest)
Functional FULL stayed **82/0** — I did NOT add a Functional node-form image save. A BrowserTestBase
(no-JS) run cannot drive the React media picker, and the drupal_media sentinel is produced client-side, so a
Functional POST would only replay a pre-built layout JSON — exactly what the Kernel `InlineImageTest` already
proves end-to-end: the save-path x-allowed-schemes guard (via `mosaic.prop_validator`, the node-form's own
validator) AND the render resolution (via `mosaic.renderer`). The charter's "Functional node-form save" is
therefore covered at the Kernel/service layer, not as a new BrowserTestBase cell; recorded here, not masked.

## Honest status
Image prop, help-from-schema, and `replaces` land cleanly and byte-identically (owned render + owned Vitest
oracles unchanged). Patterns-shown stays deferred (13/14) per Arun's ruling. The Drupal 11.4.5 PHPStan drift
is pre-existing and recorded, not masked.
