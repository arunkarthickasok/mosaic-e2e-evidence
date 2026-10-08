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
| E | Bind prop + slot to View | **PASS** (filmed; E1 fixed in #51) | prop: card `heading` ← Context `entity.label` → card title mirrors the page title (E-prop-render.png, node/1010); slot: accordion `items` ← View `cpve1_list:embed_1`, `title`→`heading`, child = the **«ext» Card** (adopted, no workaround) → renders "CPVE1 Article 1/2" as «ext» Cards, seed hidden (E-slot-render.png, node/1012) |
| F | Restrict / disable | **PASS** | an «ext» leaf component present (enabled) → absent (disabled) → restored (`palettePresent` true→false→re-enabled) |
| G | Schema drift | **DEFER** (automated-proven) | `SchemaDriftTest` + `MosaicDriftNotices.test.ts`; live trigger needs editing the «ext» contrib schema — out of scope (contrib, not ours to mutate) |
| H | OFF → fallback → ON byte-identical | **PASS** | H-ext-fallback.png (library OFF → components replaced by a safe fallback that KEEPS all authored content, logged out, no crash). node/1003 region-shasum: ON `9d8eee1e…8dd3 1216` → OFF `4b8c217f…8a68 2833` (fallback, differs) → ON again `9d8eee1e…8dd3 1216` (identical) |
| I | Two libraries ON → owned shasums verbatim | **PASS** | node/780 region `14e6cb9c…3954` verbatim with «ext» ON **and even while «ext» was OFF** — the owned invariant is independent of adopted-library state |
| J | Anonymous render | **PASS** | J-ext-anon.png: anon sees the «ext» accordion, logged out, **0 console errors** |
| W2 | Authoring form loads | **PASS** | the «ext» Card authoring form loads (fields surface, no access-denied) |
| W6 | Media prop | **PASS** | the «ext» Card exposes `image`/`media` props in its authoring surface (`W6_mediaPropPresent`) |
| W9 | Patterns section | **PASS** | libraries page renders the per-library Patterns / "Shown in palette" section |

**PASS: 12** (A, B, C, D, E, F, H, I, J, W2, W6, W9). **Automated-proven DEFER: 1** (G). **Findings: 1** (E1).

## Finding E1 (Mosaic-side) — FIXED in ship #51
Surfaced by the M1 E deep-dive (binding an accordion `items` slot to a View with a field_map). The save-path
validator `MosaicPropValidator::childDescriptors()` resolves the child's mappable props from
**`$plugin->getPropDefinitions()`**, which is **EMPTY for an adopted SDC** — an adopted component's props live
in **`getDefinition()['props']['properties']`** (verified live on the «ext» accordion-item component:
`getPropDefinitions.properties = []` vs `getDefinition.props.properties = [id,heading,headingLevel,expanded,content]`).
So any `field_map` targeting an adopted child is refused with *"slot '…' maps field '…' to '…' prop 'heading',
which does not exist."* — even though the prop exists. **Same class as the CP-9 x-allowed-schemes fix** (empty
`getPropDefinitions` for adopted SDCs → feed the full `getDefinition` schema).
- **Blast radius:** slot-to-View binding with a field_map to an **adopted** child type (owned children are
  fine — E filmed with `child_type: mosaic_heading`, field_map `title→text`, renders correctly). The binding
  engine, resolver, and render are all correct; only `childDescriptors()` reads the wrong source.
- **Fix (ship #51 — SHIP-51-PLAN.md):** one shared resolver `MosaicPropShapeRegistry::describeComponent`
  (resolveSchema: getPropDefinitions() for owned, the definition's `props` for adopted) now feeds
  `childDescriptors()`, the manifest's `buildPropDescriptors()`, and the authoring form. Owned unchanged. Cells:
  Kernel `testAdoptedChildFieldMapPasses` (RED-proved) + `testOwnedChildFieldMapUnchanged`; Functional
  `testAdoptedChildSlotBindingSavesViaForm`. The E film now uses the «ext» Card child directly (no workaround).
- **Classification:** **Mosaic-side → FIXED in ship #51** (Arun commits). Not library-side.

## Divergences — one Mosaic-side finding (E1), now FIXED in #51; otherwise identical
The real external contrib library behaves **identically** to the purpose-built reference fixture on every
journey: same grade surface, palette, schema-built panel, slot/item rendering, prop+slot binding,
disable→palette-drop, OFF→fallback→ON byte-identical round-trip, owned-invariant independence, and clean
anonymous render. The one gap the E deep-dive surfaced (E1 — the adopted-child field_map validation source) is
**fixed in ship #51**, and the E film now binds an «ext» Card child directly. A 47-component third-party design
system adopts, binds and renders end-to-end.

## Riders from Chunk 3
**E1** — **ship #51** (Mosaic-side; one shared prop-schema resolver so the validator/manifest/authoring form
resolve adopted child props identically). No other product finding needs a rider. (G is automated-proven; its
live trigger would require mutating a contrib module's schema, out of scope.)

## Dev state (sanctioned)
«ext» library ON (47 rows); its Alert component re-enabled (F restored); the H toggle returned «ext» to ON.
Reference library ON (Chunk 2). Test nodes left: 1003 («ext» accordion), 1006/1007/1008 (ref_card), 1009
(ref_accordion), **1010 (E-prop: card title ← page title), 1011 (E-slot: accordion items ← View)**. Nothing
uninstalled; no authoring overrides persisted.

## Rehearsal status — both tables
- **Reference library** (Chunk 1 W0–W9 + Chunk 2 rail + A–J): all product journeys PASS; the only code rider
  is **W8** (`mosaic_update_10007`, in the #50 batch). Deferred items (W2b/W2c, G, required-marker) are
  automated-proven.
- **«ext»** (this chunk): all product journeys PASS; the one Mosaic-side finding (E1 — adopted-child slot
  field_map) is **FIXED in ship #51**; no library-side divergence.

The #50 batch (A2 + W8) is committed at mosaic HEAD **`d18d26d`**; **ship #51 (E1)** is built + gated for
Arun's commit (SHIP-51-PLAN.md). The M1 walk is in `WALK-M1.md`. ADOPT closes on Arun's sign-off of the walk.
