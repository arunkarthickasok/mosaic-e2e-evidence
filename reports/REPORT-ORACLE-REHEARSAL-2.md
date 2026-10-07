# Oracle rehearsal (2) — A1 reclassified + fixed (ship #49) + tables (2026-10-07)

Supersedes the A1 classification in REPORT-ORACLE-REHEARSAL.md. Parent ship #48 `6f859a8`. Mosaic git
READ-ONLY; dev writes sanctioned for the rehearsal. The headed Chromium harness (`js/e2e`,
`js/scripts/qa/style-shasum.mjs` launch pattern) produces films here (headed=true confirmed).

## Corrections (per Arun 2026-10-07)
- **WITHDRAWN:** LIBRARY-AUTHOR-GUIDE §0 ("never name your module `mosaic_*`") and the fixture-rename rider.
- **A1 reclassified MOSAIC-SIDE** and FIXED as ship #49 (SHIP-49-PLAN.md).

## A1 — fix (ship #49)
`MosaicComponentAlias::providerIsOwned()` used a `mosaic`/`mosaic_*` prefix heuristic, mis-reading any
third-party `mosaic_*` module as OWNED (bare ids → `#component` could not bind props → required-prop 500).
Replaced with an explicit **`OWNED_PROVIDERS` allow-list** (`MosaicComponentAlias.php:28`): the six
production owned modules + `mosaic_test` (the suite's own owned-style fixture, which the TIGHT-GATE Functional
FULL caught had flipped to adopted — 8 render tests — so it was added). A third-party `mosaic_civic` / the
`mosaic_reference_library` fixture is now correctly ADOPTED. Gate (full, 11.4.5): Kernel+Unit **3182/0**,
Functional **88/0**, Vitest **761/1**-pre, tsc clean, phpcs **0**, phpstan **0 new** (79), shasums verbatim
(`14e6cb9c…3954` / `b7756795…4354 10`), served==built (`21376a…`), headed film.

## Reference-library table (headed films where filmed; the rest is the continuing rehearsal)
| Step | Asserted condition | Result | Film / evidence |
|---|---|---|---|
| A1 render | a ref_card node renders (HTTP 200, `.ref-card`, heading) | **PASS** | films/cp-adopt-9r-a1/a1-ref_card-render.png (headed) |
| Grade | 7 ref comps READY | PASS | Kernel ReferenceLibraryTest |
| Zero-untitled | all rows titled (ref + «ext») | PASS | Kernel ReferenceLibraryTest |
| Rail=form order | manifest == schema order | PASS | Kernel ReferenceLibraryTest |
| WC#108 save | public:// media saves + renders | PASS | Functional InlineImageSaveTest |
| WC#106 menu/tabs | 3 pages 200 + reset | PASS | Functional AdminMenuTabsTest |
| **ref_card page render, enum UNSET** | renders with an unset `variant` | **FAIL → A2** | dev node 500, diagnosed below |
| W0–W9 + A–J (headed films, all components) | per-step authoring | **PENDING** | continuing rehearsal (gated on A2 for ref_card page journeys) |

## «ext» table
Prior passes graded «ext» (1.21.1-beta1, helper `mosaic_adopt_ext`, Olivero) at **47/47 Ready** and filmed it
(REPORT-CP-ADOPT-7R.md, films/cp-adopt-5/, films/checkpoint-*). The A–J + W2/W6/W9 headed re-run against «ext»
is PENDING (continuing rehearsal); divergences vs the reference run will classify Mosaic-side vs library-side.

## Finding A2 (next rider — NOT A1's subsystem)
**Symptom:** a ref_card node with its `variant` enum prop UNSET renders HTTP 500 on the PAGE path —
*"[…/variant] Does not have a value in the enumeration […]. The provided value is: ''"*. The canvas path
preview-fills the example so it only bites the real page.
**Mechanism:** the page render does not apply an adopted enum prop's schema `default` (nor pass it via
`#variant`), so SDC receives `""`.
**Classification: MOSAIC-SIDE.** Next rider (one subsystem, TIGHT GATE): on the page render, seed an adopted
enum prop from its schema default when unset (or pass it as `#variant`). Isolated out of A1 by setting
`variant` explicitly in the A1 Functional node + film.

## Dev state (sanctioned; restored where changed)
- `mosaic_reference_library` enabled (install-sync created its library entity; now ADOPTED post-#49 → status
  turned **ON** for the rehearsal). Left ON for Arun's M1 walk.
- **M1 test node left:** nid **1006** "ORACLE-M1 ref_card" (page, ref_card with `variant` set → renders).
- Stray/broken nodes from diagnosis deleted (the no-variant 500 nodes). No Manage-authoring overrides saved.
- "never uninstall" honoured — no module uninstalled.

## A2 — FIXED (ship #50 batch)
`MosaicRenderer::buildAdoptedComponentElement` now seeds every unset enum prop with its H4 default (schema
`default` → `examples[0]` → first enum value) via `enumDefault()`, so the render never hands the SDC an "".
Cells: Kernel `ReferenceLibraryTest::testUnsetEnumSeededAtRender` (#variant seeded 'default'); Functional
`ReferenceCardRenderTest::testRefCardRendersWithUnsetEnum`. **Headed film:** `films/cp-adopt-9r-a2/
a2-unset-enum-render.png` (headed=true, HTTP 200, `.ref-card--default`, no enumeration error). Gate (full):
Kernel+Unit **3183/0**, Functional **89/0**, Vitest 761/1-pre, tsc clean, phpcs 0, phpstan 0-new/79, shasums
verbatim, served==built. The reference-library "ref_card page render, enum UNSET" row is now **PASS**.

## Status
Ships #49 (A1) + #50/A2 are **GREEN** candidates (full TIGHT GATE + films). The two-table rehearsal CONTINUES:
the ref_card page journeys are unblocked; the full W0–W9 + A–J headed films + the «ext» A–J re-run are the
ongoing machine rehearsal (films per step, appended to the #50 batch). Both tables NOT yet fully green → no
ceremony. No finding needs a ruling (A1 + A2 are clear fixes).

## Dev state (updated)
M1 test nodes left for Arun's walk: **nid 1006** (ref_card, variant set) + **nid 1007** (ref_card, variant
UNSET — the A2 case, renders via the H4 seed). Reference library + its library ON. Nothing uninstalled; no
overrides saved; diagnosis nodes deleted.
