# Oracle rehearsal — Chunk 3: «ext» A–J + W2/W6/W9 (2026-10-08)

The real external contrib library («ext») re-run. Headed Chromium (headless:false), dev
`https://drupalak.ddev.site:33001`, admin via `drush uli`; the byte-identical journeys (H, I) via the module's
`region-shasum.sh`. Parent: ship #49 `0276f01` + the #50 batch (A2 + W8). Mosaic git READ-ONLY; dev writes
sanctioned.

**Naming ban.** The external library is referred to only as «ext». Its admin surfaces (libraries page,
field-types, authoring form) render its machine name as visible text, so — per the ban — **no screenshots of
those surfaces are taken**; A/B/C/F/W2/W6/W9 are confirmed by DOM-probe booleans (the probe reads the page but
emits only booleans, never the machine name). Only the rendered node + the anonymous page are filmed. «ext» was
already graded 47/47 Ready and filmed in a prior pass; this is a post-#49 confirmation run.

**«ext» facts (live, not re-derived):** library ON, **47 components, all ids qualified** (`provider:local`,
correct post-#49), grade distribution **47 Ready / 0 attention / 0 blocked**, helper module enabled, installed
version 1.20.0-beta1. Content node **node/1003** uses the «ext» accordion with two accordion-items in a
populated `items` slot.

## Table — journey · condition · PASS/FAIL · evidence
| # | Journey | Result | Evidence (probe boolean / shasum / film) |
|---|---|---|---|
| A | Grade | **PASS** | grader: 47 Ready / 0 / 0; libraries page shows the Grade + Restricted columns (`A_ready`, `A_gradeColumn`) |
| B | Palette | **PASS** | builder mounted; «ext» Accordion/Card/Button authorable (`B_extComponentsInPalette`) |
| C | Place + panel | **PASS** | «ext» accordion selected in the builder → schema-built panel with a control (`panelControl:true`, `panelSelected:true`) |
| D | Slots + items | **PASS** | D-ext-accordion-render.png + node/1003: accordion renders a populated `items` slot (`D_accordionRendered`, `D_hasItems`) |
| E | Bind prop + slot to View | **DEFER** (automated-proven) | `SlotBindingTest` + `MosaicDataSourceManagerTest` + Views-embed design; deep bind-driving (W2b/W2c category) |
| F | Restrict / disable | **PASS** | an «ext» leaf component present (enabled) → absent (disabled) → restored (`palettePresent` true→false→re-enabled) |
| G | Schema drift | **DEFER** (automated-proven) | `SchemaDriftTest` + `MosaicDriftNotices.test.ts`; live trigger needs editing the «ext» contrib schema — out of scope (contrib, not ours to mutate) |
| H | OFF → fallback → ON byte-identical | **PASS** | node/1003 region-shasum: ON `9d8eee1e…8dd3 1216` → OFF `4b8c217f…8a68 2833` (graceful fallback, differs) → ON again `9d8eee1e…8dd3 1216` (identical) |
| I | Two libraries ON → owned shasums verbatim | **PASS** | node/780 region `14e6cb9c…3954` verbatim with «ext» ON **and even while «ext» was OFF** — the owned invariant is independent of adopted-library state |
| J | Anonymous render | **PASS** | J-ext-anon.png: anon sees the «ext» accordion, logged out, **0 console errors** |
| W2 | Authoring form loads | **PASS** | the «ext» Card authoring form loads (fields surface, no access-denied) |
| W6 | Media prop | **PASS** | the «ext» Card exposes `image`/`media` props in its authoring surface (`W6_mediaPropPresent`) |
| W9 | Patterns section | **PASS** | libraries page renders the per-library Patterns / "Shown in palette" section |

**PASS: 11** (A, B, C, D, F, H, I, J, W2, W6, W9). **Automated-proven DEFER: 2** (E, G).

## Divergences — NONE
The real external contrib library behaves **identically** to the purpose-built reference fixture on every
journey: same grade surface, palette, schema-built panel, slot/item rendering, disable→palette-drop,
OFF→fallback→ON byte-identical round-trip, owned-invariant independence, and clean anonymous render. There is
**no Mosaic-side divergence (no #50 rider)** and **no library-side divergence (no LIBRARY-AUTHOR-GUIDE line)**
to record. A 47-component third-party design system adopts cleanly end-to-end — the strongest single validation
of the adopt-any-SDC architecture to date.

## #50 batch riders from Chunk 3
**None.** No product finding needs a rider or a ruling. (E, G are automated-proven, not product gaps; G's live
trigger would require mutating a contrib module's schema, which is out of scope.)

## Dev state (sanctioned)
«ext» library ON (47 rows); its Alert component re-enabled (F restored); the H toggle returned «ext» to ON.
Reference library ON (Chunk 2). Test nodes left: 1003 («ext» accordion), 1006/1007/1008 (ref_card), 1009
(ref_accordion). Nothing uninstalled; no authoring overrides persisted.

## Rehearsal status — both tables
- **Reference library** (Chunk 1 W0–W9 + Chunk 2 rail + A–J): all product journeys PASS; the only code rider
  is **W8** (`mosaic_update_10007`, in the #50 batch). Deferred items (W2b/W2c, E, G, required-marker) are
  automated-proven.
- **«ext»** (this chunk): all product journeys PASS; **zero divergences**, zero riders.

Both rehearsal tables are green. The #50 batch carries two riders (A2, W8), fully gated. The rehearsal has
surfaced no further product findings and nothing awaits a ruling — ready for Arun's review toward #50 ceremony.
