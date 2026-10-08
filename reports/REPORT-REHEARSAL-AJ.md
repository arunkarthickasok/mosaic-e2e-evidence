# Oracle rehearsal — Chunk 2 part 2: reference library A–J (2026-10-07)

Headed Chromium (headless:false), dev `https://drupalak.ddev.site:33001`, admin via `drush uli`; the
byte-identical journeys (H, I) via the module's `region-shasum.sh` / `style-shasum.mjs`. Films:
`films/cp-adopt-9r-aj/`. Parent: ship #49 `0276f01` + the #50 batch (A2 + W8). Mosaic git READ-ONLY; dev writes
sanctioned. Naming ban observed — the real external library is referred to only as «ext».

## Table — journey · condition · PASS/FAIL · evidence
| # | Journey | Condition | Result | Evidence |
|---|---|---|---|---|
| A | Grade | Libraries page shows the Reference library with a **Ready** grade badge, a Restricted column, the Replaced-by note + Patterns section | **PASS** | A-grade.png (`Reference Card`, `Ready`, `Restricted`, `Replaced by`, `Shown in palette` all present) |
| B | Palette | The builder palette lists the adopted components (Reference Card + Reference Accordion) | **PASS** | B-palette.png (`mounted`, both labels in palette) |
| C | Place + panel | A placed ref_card exposes a prop panel built from its SDC schema | **PASS** | (rail pass) cp-adopt-9r-rail/02-rail-selected.png — Card Image picker + schema help in the rail |
| D | Accordion slots + items + bare owned child | A ref_accordion renders its items, each `content` slot holding a BARE OWNED `mosaic_heading` child | **PASS** | D-accordion-render.png + node/1009: `.ref-accordion`, items Shipping/Returns, `.ref-accordion .mosaic-heading` ("Delivered in 3 days") = owned child nested in an adopted slot |
| E | Bind prop + slot to View | A prop bound to a data source; a slot populated by a View embed | **DEFER** (automated-proven) | `SlotBindingTest` + `MosaicDataSourceManagerTest` + the Views-embed design; live bind-panel + View round-trip = deep builder-driving (W2b/W2c category) |
| F | Restrict / disable | Disabling a component in the library removes it from the builder palette for everyone; re-enabling restores it | **PASS** | F-enabled.png (`Reference Shadow Widget` present) → F-disabled.png (absent) → re-enabled |
| G | Schema drift | The library-changes report flags a component whose schema changed since a page was saved | **DEFER** (automated-proven) | `SchemaDriftTest` (Kernel) + `MosaicDriftNotices.test.ts` (builder) + the wired report (G-drift-report.png baseline "No pages affected"). Live trigger needs a schema edit of a shipped component — forbidden by the Mosaic READ-ONLY law; a stale stored sig alone does NOT fake drift (`classify` is schema-accurate — verified: `driftByNode` = [] on a bogus-sig node) |
| H | Library OFF → fallback → ON byte-identical | A ref_card page falls back when the library is OFF, and is byte-for-byte identical when turned ON again | **PASS** | node/1006 region-shasum: ON `905aaec3…bebe 514` → OFF `176241d8…1802 835` (graceful fallback, differs) → ON again `905aaec3…bebe 514` (identical to baseline) |
| I | Two libraries ON → owned shasums verbatim | With the reference + «ext» libraries both ON, an OWNED page is byte- and style-identical to its invariant | **PASS** | node/780 region `14e6cb9c…3954` + style `b7756795…ca982 4354 10` verbatim (three adopted libs ON: reference + «ext» + olivero) |
| J | Anonymous render | An anonymous visitor sees the ref_card render with a clean console | **PASS** | J-anon.png — logged out, `.ref-card` present, **0 console errors**, no page errors |

**Filmed/proven PASS: 8** (A, B, C, D, F, H, I, J). **Automated-proven DEFER: 2** (E, G).

## E + G — automated-proven, live film out of this pass (honest classification)
- **E (bind prop + slot to View)** is the deepest authoring journey — bind-panel driving + a View embed round-trip,
  the same multi-session builder-driving category as W2b/W2c. The binding data model + data-source manager are
  unit-proven (`SlotBindingTest`, `MosaicDataSourceManagerTest`); the Views-embed path has its design + specs.
  A dedicated bind-driving headed pass is the right place to film it; not faked here.
- **G (schema drift)** needs a REAL schema change to a shipped component to surface on the report. Editing the
  reference library's component yml is a Mosaic-repo write, which the READ-ONLY law forbids; and a stale stored
  `_mosaic_schema_sig` alone does NOT fake it — `MosaicSchemaDrift::classify` compares stored data against the
  *current* schema and correctly finds no drift (verified live: `driftByNode` returns `[]` for a bogus-sig
  ref_card node). Drift is fully covered by `SchemaDriftTest` + `MosaicDriftNotices.test.ts`, and the report
  surface is live (G-drift-report.png, baseline "No pages are affected").

## #50 batch riders from Chunk 2 part 2
**None.** Every A–J finding is product-correct: adopted grade/palette/panel/accordion/restrict/anon all behave;
owned content stays byte- and style-identical with adopted libraries ON (H, I); the two defers are
automated-proven, not product gaps.

## Dev state (sanctioned)
Reference library enabled + ON; ref_shadow re-enabled (F restored). M1/M-D test nodes left: nid 1006 (ref_card
variant set), 1007 (ref_card unset-enum/A2), 1008 (ref_card image/W6), **1009 (ref_accordion, ORACLE-D — owned
child nested in an adopted slot)**. All render HTTP 200. Nothing uninstalled; the H library toggle was returned
to ON; no authoring overrides persisted.

## Next
Chunk 3 — «ext» (the real external library) A–J + W2/W6/W9 headed re-run; classify each divergence Mosaic-side
(a #50 rider) vs library-side (a LIBRARY-AUTHOR-GUIDE line with the exact yml). Both rehearsal tables then
reviewed for ceremony.
