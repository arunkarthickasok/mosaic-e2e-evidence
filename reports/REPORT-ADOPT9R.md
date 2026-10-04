# CP-ADOPT-9R — RIDER (WC#105–#108) + reference library

**Date:** 2026-10-04 · **Branch:** `fix/finding-016-validator` (mosaic working tree — built + gated; NOT
AI-committed per commit-flow, handed to Arun). Parent ship #47 = `33cd40c`. Drupal core 11.4.5. Ship #48 HELD.
**Walk tally → 108.** Arun's ruling (2026-10-04): the engine is built + tested against the Mosaic-authored
**reference library** (the worked example of LIBRARY-AUTHOR-GUIDE.md); the external «ext» library is the
single acceptance oracle, walked once at the end.

## WC#108 (BLOCKER) — x-allowed-schemes validates the RESOLVED src, not the stored scheme
The CP-9 guard checked the stored stream-wrapper scheme (`public`) and wrongly REFUSED a legitimate media
pick. Fixed:
- `MosaicPropValidator::resolvedSrcScheme()` resolves the media file URI to its ABSOLUTE URL via
  `FileUrlGeneratorInterface` (null-safe 7th ctor arg + `@file_url_generator` wire) and validates THAT URL's
  scheme (`parse_url`), so a `public://` media resolves to the site's http(s) URL and **SAVES**.
- `validateInlineImageScheme()` returns an **author-grade** message for a TRUE violation only —
  *"The image chosen for '…' is served over '…', which this component does not allow (allowed: …)."* — no
  `://` stream-wrapper jargon.
- Fixture `adopt_shaped`: `image.src` x-allowed-schemes `[http, https]` (public media → http(s) → saves);
  `thumbnail.src` `[https]` (the test env resolves to http → a TRUE violation, refused).
- Cells: Kernel `InlineImageTest::testSaveAllowsResolvedScheme` + `testSaveRefusesTrueViolation`; Functional
  `InlineImageSaveTest` — a public:// media picked for the adopted inline image **saves through the node form**
  and the page **renders** its served file URL (1 test, 13 assertions).

## WC#107 — titled rows, help, "+ Add content", rail = form order
- **Help from title + description** for image-like props was already live (CP-9 help-from-description); the
  reference library + `adopt_shaped` now carry descriptions (image → *"Image displayed at the top of the
  card."*).
- **"+ Add content" (not "+ Add image")** — `preferredFillType/Label` gain a `hasObjectImage` gate: when a
  component owns an inline image OBJECT prop, its HTML fill rows read **"+ Add content"**, never competing with
  the object picker. "plain content" → "content" per the ruling. Wired through `MosaicFillField` + the adapter
  formatted_text branch.
- **Every row has a title** (schema title, else humanised name): `ReferenceLibraryTest::testZeroUntitledRows­
  AcrossLibraries` — **zero untitled rows** across the reference library AND adopt_fixture («ext»).
- **Rail order = form order by default**: `testRailOrderFollowsFormOrder` — the manifest's prop_descriptors
  are emitted in the component's schema (form) order with no rail_order override.
- Cells: `propFills.test` (+hasObjectImage), `MosaicFillField.test` (+WC#107, relabel), `ReferenceLibraryTest`.

## WC#106 — Mosaic admin menu group + tabs + Field-types Reset
- `mosaic.links.menu.yml` adds **Field types** + **Reports** under the **Mosaic** config group (Component
  Libraries already there).
- NEW `mosaic.links.task.yml` makes **Field types / Component libraries / Reports** ONE local-task set (shared
  `base_route`), so each page shows the three as tabs under an admin theme.
- `MosaicShapeMapForm` gains **Reset to defaults** (clears the shape_map config).
- Cell: Functional `AdminMenuTabsTest` — 403→200 on all three; tabs wired (asserted at the local-task
  discovery level — the stark test theme does not render `{{ tabs }}`; Claro does); Reset works. (2 tests.)

## Reference library — the engine's acceptance fixture (100% Ready)
`tests/modules/mosaic_reference_library` — a NON-Mosaic SDC library, the worked example of the guide.
**7 components:**
- `ref_card` — the shape showcase: string (preheading/heading), **inline image object + x-allowed-schemes**
  (Card Image), **html + contentMediaType** (media, mediaAccent), **enum + meta:enum** (variant), **boolean**
  (featured), **integer min/max** (column span), **nullable union** `[integer,null]` (badge count), **link**
  object (cta), **array repeatable** (tags), a **slot** (body). A description on every prop.
- `ref_accordion` + `ref_accordion_item` — container + item, **repeater** + **requires-parent**.
- `ref_shadow` — a **shadow-DOM web component** (CSS-in-JS, isolated).
- `ref_plain` — a **plain-twig** component.
- `ref_legacy` — the component `ref_card` **replaces**.
- `ref_canvas` — the **Canvas image shape** (inline) + link.

Profile `mosaic_reference_library.mosaic-adopt.yml` exercises **every key**: global_libraries,
preview_defaults, containers, items, repeaters, requiresParent, preferred, thumbnails, **replaces**, patterns.
**Grade: 100% Ready** (`ReferenceLibraryTest::testReferenceLibraryGrades100PercentReady`).

Two guide-fidelity gotchas, recorded:
- SDC core rejects an **unresolvable `json-schema-definitions://` $ref** prop at DISCOVERY ("non-string
  types"), so `ref_canvas` uses the inline Canvas image shape; the `$ref` → MEDIA resolution itself stays
  proven in `CanvasShapesTest` (resolver on explicit $ref schemas).
- A **required prop with no default/example grades ATTENTION** (H4), so required props carry an `examples`
  (a preview under `preview_defaults`) to stay READY — exactly the guide's §4.

`LIBRARY-AUTHOR-GUIDE.md` updated: the reference library IS its worked example (intro note + §2 profile = the
real `mosaic_reference_library` profile).

## Gate (FULL, Drupal 11.4.5)

| Check | Result |
|---|---|
| TypeScript typecheck | clean |
| Vitest | __761 pass / 1 pre-existing B-101__ (+propFills/MosaicFillField WC#107 + MosaicPatternsPanel) |
| PHPUnit Unit + Kernel | __87 / 0__ (932 assert, 2 skip; +3 CP-9R) |
| PHPUnit Functional FULL | __87 / 0__ (932 assert, 2 skip; +3 CP-9R) |
| PHPCS | **0 errors** (line-length warnings only, mostly pre-existing) |
| PHPStan L6 | CP-9R files add **0 errors** (pre-existing Drupal-11.4 baseline B-102 unchanged) |
| dist | rebuilt, **BUMP-LIBS 1.0.85 → 1.0.86** (WC#107 touched bundled code) |
| Owned shasums | **VERBATIM** — REGION `14e6cb9c…a43e0dec` 3954 · STYLE `b7756795…9aaca982` 4354/10 |

## Honest status
WC#108 (blocker) is CLOSED end-to-end (Kernel + Functional node-form save). WC#106 + WC#107 land with cells.
The reference library is built, grades 100% Ready, and anchors the guide + the WC#107 cross-library cells. The
**headed per-component lifecycle films** remain Arun's walk (the end oracle) — not runnable headed in this
non-interactive environment; the automated cells + the reference-library grade stand as the proof, the films
and the «ext» oracle (W11) are the acceptance step. The WALK is rewritten with the menu path + the reference
library's real field names; the full every-label live-screen capture is Arun's walk rehearsal.
