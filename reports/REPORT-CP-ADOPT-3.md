# REPORT — CP-ADOPT-3 (Pillar C — SDC slots → drop zones with child rules; contract H7)

Evidence base: ADOPT-DESIGN.md RATIFIED (§3.C), MOSAIC-BIBLE.md. Mosaic git READ-ONLY.
HEAD `87be200` (ship #42). Paths relative to `web/modules/custom/mosaic/`.

---

## §P0 — DERIVATION (report-only)

### P0.1 How owned containers declare children TODAY
Slots reach the builder through **three** sources, unified at `getSlotDefinitions()`:

1. **PHP hardcode** — a `#[MosaicComponent]` container declares its slots inline:
   `modules/mosaic_components/src/Plugin/MosaicComponent/MosaicColumnsComponent.php:53`
   ```php
   public function getSlotDefinitions(): array {
     return ['column_1' => ['label' => 'Column 1'], 'column_2' => …, 'column_3' => …, 'column_4' => …];
   }
   ```
2. **`.mosaic.yml` sidecar** — `ComponentDefinition::fromSidecarYaml()` reads `$data['slots']`
   (`src/Sdc/ComponentDefinition.php:206`), stored on the definition and returned by
   `SdcComponentPlugin::getSlotDefinitions()` (`src/Plugin/MosaicComponent/SdcComponentPlugin.php:31` →
   `$definition['slots']`).
3. **Core SDC definition** — `ComponentDefinition::fromCoreDefinition()` reads `$sdcDefinition['slots']`
   (`src/Sdc/ComponentDefinition.php:133`). This is the ONLY path that reads the core SDC `slots:`, and it is
   used for **adopted** components (and owned-without-sidecar). `toPluginDefinition()` emits `'slots'`
   (`:263`).

Downstream, uniform for all three:
- **Manifest** — `MosaicManifestBuilder::buildComponentEntry()` emits `slotDefinitions` (the getSlotDefinitions
  map). (`src/Service/MosaicManifestBuilder.php` — `'slotDefinitions' => $slotDefinitions`.)
- **Puck slot fields** — `MosaicPuckAdapter.toConfig()` derives `slotKeys` from `manifest.slotDefinitions`
  (`js/src/builder/MosaicPuckAdapter.ts:405`) and emits **one bare `{ type: 'slot' }` field per slot**
  (`:583-585`), spread into the component fields (`:601`). Columns has a positional special-case (`:484`).
- **Storage** — a slotted node stores child UUIDs per zone: `node.slots[slotName] = [childUuid, …]`
  (round-trip at `MosaicPuckAdapter.ts:1062, 1181, 1202`; read at `:1045`).
- **Render** — `MosaicRenderer::renderNode()` renders slot children depth-first and passes the assembled HTML
  to the template as `slots` (`src/Service/MosaicRenderer.php:703-708` iterate `$instance->slots`; `:787`
  `'slots' => $renderedSlots`).

### P0.2 What is UNREAD — proof (file:line + live)
- **Core SDC `slots:` for owned containers is unread.** `mosaic_columns`'s slots are the PHP hardcode
  (`MosaicColumnsComponent:53`); its **core SDC `slots` is empty**:
  ```
  live: mosaic_columns  PHP getSlotDefinitions = [column_1..column_4];  core SDC slots = []
  ```
  So the `.component.yml` slot declaration is not the source of truth for owned containers — a hardcoded PHP
  list is. (Adopted `olivero:teaser` DOES carry 5 core slots — content/image/meta/prefix/title — but is
  palette-guarded, so its slots never reach the palette.)
- **Slot child-RULES are modeled NOWHERE.** The SDC slot descriptor carries only identity + `required`:
  ```
  live: olivero:teaser.slots = {content:{title,required:true,description}, image:{…required:false…}, …}
  ```
  There is no `allowed`, `preferred`, `min`, `max`, `defaults`, or `empty_display` anywhere. The adapter emits
  a **bare** `{ type: 'slot' }` (`:585`) — no child constraint; Puck accepts any component into any zone.
- **Even SDC `required` is unenforced.** `MosaicRenderer` passes children through (`:703-708`) and
  `MosaicPropValidator` validates props only — nothing consults a slot's `required` flag at author or save
  time. A required-but-empty slot is silently allowed.

### P0.3 H3 slot descriptor + H7 contract (the target)
- **H3** — the manifest emits an abstract **`slot` descriptor** per zone (id, label, required, + rules),
  alongside the existing `slotDefinitions` (additive; the adapter keeps emitting `{ type: 'slot' }` until it
  opts into the rules). One derivation, in PHP.
- **H7** — **the SDC descriptor is the TRUTH for slot identity; the sidecar adds RULES only and never
  redefines ids.** A sidecar entry naming a slot the SDC descriptor does not declare (or attempting to change
  a declared slot's id) is **rejected with a logged warning** — the descriptor wins.

### P0.4 DERIVED matrix — slot source × rules × violation × surface × geometry × permission-parity
Each cell names its oracle + smoke-alarm.

| Axis | Values | Oracle / smoke-alarm |
|---|---|---|
| **slot source** | SDC descriptor · sidecar · both (H7: descriptor=truth, sidecar=rules-only) · neither | descriptor-only slot emits identity; sidecar-only-rules attach to a descriptor slot; **H7 cell:** sidecar declaring a non-descriptor slot id → rejected + warning logged (smoke-alarm: without the guard the phantom slot appears) |
| **rules** | allowed[] · preferred[] · min · max · defaults[] · empty_display | each rule read from slot metadata when present, tolerant default when absent (allowed=∅→any; min=0; max=∞; defaults=[]; empty_display="") — smoke-alarm: a component with no rule keys behaves exactly as today (bare slot) |
| **violation** | below min · above max · non-allowed drop | below-min → banner on the zone; above-max → drop refused + banner; non-allowed → drop refused + reason. smoke-alarm: neutering the check lets a forbidden child land silently |
| **surface** | admin builder · FE dialog · render | admin+FE emit identical rules (parity cell); render passes children as `slots` unchanged (adopted render = ADOPT-4) — smoke-alarm: a rule present on one surface but not the other |
| **geometry** | drop-zone boundingBox visible + non-overlapping · violation-banner placement | each zone's boundingBox is present + non-overlapping; a violation banner renders on its zone, not floating — smoke-alarm: overlapping zones or an orphaned banner |
| **permission-parity** | admin vs author see the same rules; restricted children filtered per governance | a restricted child excluded from `allowed` for a non-admin (reuses MosaicComponentGovernance) — smoke-alarm: an author offered a restricted child |

**Byte-identical invariant (P1):** owned containers keep their exact slots + saved layouts (node/780 uses
`mosaic_columns`; region shasum `14e6cb9c…` before==after via `scripts/qa/region-shasum.sh`). Adopted stay
palette-guarded (render = ADOPT-4).

### P0.5 P1 build order (each RED→GREEN, checkpoints FILED)
1. Read SDC `slots:` into `ComponentDefinition` + emit an abstract `slot` descriptor per zone via the manifest
   (H3); owned containers switch to the same emitter — **NO storage / saved-layout change** (byte-identical;
   region shasum before==after). *(Owned columns keep column_1..4 from PHP — the emitter is source-agnostic.)*
2. Child-rules model `{allowed[], preferred[], min, max, defaults[], empty_display}` — read from SDC slot
   metadata (tolerant of absence) + sidecar (rules only; **H7 cell:** sidecar redefining a slot id → rejected
   + logged warning).
3. Enforcement — non-allowed drop refused with a visible reason; min/max → banner on the zone (never silent);
   defaults inserted on first placement; empty_display rendered in the canvas. Admin+FE parity cells; render
   passes children as `slots` exactly as before.
4. Palette guard stays CLOSED for adopted; prove olivero:teaser's slots appear in the libraries-page
   living-docs (raw manifest).
5. Full gates; dist rebuild (adapter) → BUMP-LIBS. CHECKPOINT-1.

---

## §P1 — BUILD

Like Pillar B, this pillar splits at a seam: (1) the **PHP slot-descriptor emission** — additive, provably
byte-identical because the adapter/render path is untouched; then (2–3) the **child-rules model + enforcement +
geometry + FE/admin parity + dist** — the coupled hot-path build. This pass built (1) end-to-end, RED→GREEN;
(2–5) are the next focused slice → CHECKPOINT-1. **3 files: 1 modified + 2 new, PHP only, NO dist / NO libs.**

### Item 1 — SDC slots → abstract slot descriptors via the manifest [DONE, GREEN]
```
NEW  src/Sdc/SlotDescriptor.php                              value object {id,label,required,+rule fields}
MOD  src/Service/MosaicManifestBuilder.php                   + slot_descriptors (additive) from slotDefinitions
NEW  tests/src/Kernel/Adopt/SlotDescriptorEmissionTest.php   owned + adopted emission + H7 identity (3 cells)
```
The manifest entry now carries `slot_descriptors` — one abstract `SlotDescriptor` per zone, normalised from
`getSlotDefinitions()` (source-agnostic: PHP hardcode, sidecar, or core SDC). ADDITIVE — `slotDefinitions` and
the adapter's `{type:'slot'}` emission are untouched, so owned container panels + saved layouts are unchanged.
Item 1 populates **identity only** (id, label, required); the rule fields carry tolerant defaults (item 2 fills
them). LIVE:
```
mosaic_columns  → column_1..4  (label "Column 1".."Column 4", required=false)   [identity from PHP getSlotDefinitions]
olivero:teaser  → content(required=TRUE) image meta prefix title               [core SDC slots — the `required` flag was UNREAD before]
```
The adopted `content` slot surfacing `required=true` is the F-108-class win for slots: the SDC slot `required`
metadata, previously consulted nowhere (§P0.2), now reaches the descriptor. **H7:** each descriptor's `id`
equals its storage zone key (never renamed). **Kernel SlotDescriptorEmissionTest 3/3.** **RED demo:** neuter
`buildSlotDescriptors` → the owned-container cell fails ("two arrays are identical") → restored clean.

### Item 1 — byte-identical [DONE]
Additive manifest key; adapter + render path untouched. node/780 (which uses `mosaic_columns`) region shasum
`14e6cb9c17dc61b90a86dd97d8957ae462d789ff854d3523ae581010a43e0dec` (3954 B) **before == after** via
`scripts/qa/region-shasum.sh`. No dist rebuild → libs stay 1.0.30.

### Gates (this pass — PHP only)
```
Unit FULL     2758/2758 OK   (additive slot_descriptors broke no manifest-shape assertion)
Kernel FULL    212/212  OK    (1293 assertions; +3 SlotDescriptorEmissionTest cells; 0 failures)
phpcs 0        phpstan L6 No errors  (SlotDescriptor + MosaicManifestBuilder)
byte-identical 14e6cb9c before==after   (no dist change → libs stay 1.0.30)
```

## §P1 — BUILD (PASS 2) — child-rules model + own-house truth

Same seam: PASS 2 builds the **PHP child-rules model** (items 2 + 2b) — additive, byte-identical; the
**adapter enforcement + geometry filming + dist** (items 3–5) is the coupled hot-path + UI slice →
CHECKPOINT-1. **8 files this pass** on top of item 1 (3 M src + 1 M services + 4 tests).

### Item 2 — child-rules model + H7 [DONE, GREEN]
`SlotDescriptor::fromMetadata()` reads `{allowed[], preferred[], min, max, defaults[], empty_display}` from a
slot's metadata, tolerant of absence, and maps `required → min = 1` (a required zone cannot be left empty).
`SlotDescriptor::withRules()` overlays sidecar rules **without touching identity** (id/label/required are the
descriptor's truth). `SlotDescriptor::partitionSidecarRules()` is the **H7** gate: a rule keyed by a slot the
descriptor does not declare is rejected. The manifest builder applies the overlay from the definition's
`slot_rules` (threaded through `ComponentDefinition` from the sidecar `slot_rules:` key) and **logs a warning**
(injected `logger.channel.mosaic`) for every rejected phantom id.
- LIVE: `olivero:teaser.content` (a required SDC slot) now emits **`min: 1`** in the manifest; `image` (not
  required) has no `min`. Owned columns unchanged (no rules → identity only).
- **Unit `SlotDescriptorTest` 4/4** (tolerant read, all-rules read, withRules-keeps-identity, H7 partition);
  **Kernel `SlotDescriptorEmissionTest` 5/5** (+required→min=1, +H7 wiring: valid rule applied, phantom
  rejected, `warning()` asserted once). **RED demo:** neuter `partitionSidecarRules` → the phantom slot appears
  and the logger is never warned → both cells fail → restored clean.

### Item 2b — own-house truth (audit) [DONE]
Only **one** owned container declares slots via a PHP hardcode: `MosaicColumnsComponent::getSlotDefinitions()`
→ `column_1..4`. Its core SDC `slots` is `[]` (§P0.2). **`mosaic_tabs` is NOT a slot container** — it uses a
`sets` repeatable (`field_types`), no `slots:`. No other `getSlotDefinitions()` override exists.
- **Ruled DYNAMIC exception — columns keeps its PHP source.** Reason: the container declares the max set
  (column_1..4) but the number of ACTIVE zones is driven by the `columns` prop (1–4) at author + render time
  (`MosaicPuckAdapter.ts:794` `slotKeys.filter((_, i) => i < colCount)`). Declaring a static `slots:` in the
  `.component.yml` would lose the prop-driven activation and cannot express "N of 4 by prop", so the PHP source
  is the correct home. **No storage change; byte-identical** (region shasum `14e6cb9c…` before==after).
- There is **no static owned slot container to migrate** — so no `.component.yml` slot move is made (honest:
  the charter's "move static slots to .component.yml" has an empty work-list here).

### Item 2 — byte-identical [DONE]
Additive to `slot_descriptors`; adapter + render path untouched. node/780 region shasum
`14e6cb9c17dc61b90a86dd97d8957ae462d789ff854d3523ae581010a43e0dec` (3954 B) **before == after**. No dist → libs
stay 1.0.30.

### Gates (PASS 2 — PHP only)
```
Unit FULL     2762/2762 OK   (+4 SlotDescriptorTest; additive slot rules broke no assertion)
Kernel FULL    214/214  OK    (1308 assertions; +2 SlotDescriptorEmissionTest cells; 0 failures)
phpcs 0        phpstan L6 No errors   (SlotDescriptor, ComponentDefinition, MosaicManifestBuilder)
byte-identical 14e6cb9c before==after   (no dist → libs 1.0.30)
```

### Oracle-change (PASS 2)
| # | Test | Old | New | Reason |
|---|---|---|---|---|
| 1 | ManifestControllerTest / MosaicLayoutWidgetTest | `MosaicManifestBuilder(3 args)` | 4 args (+logger, NullLogger) | H7 warning logging |

---

## §P1 — BUILD (PASS 3) — items 3–5 — enforcement + FILMED geometry + dist — CHECKPOINT-1 FILED

### Item 3 — adapter enforcement [DONE, GREEN]
```
NEW  js/src/builder/fields/MosaicSlotZone.tsx        drop-zone chrome (allowed hint, live min/max banner, empty_display)
MOD  js/src/builder/MosaicPuckAdapter.ts             slot field +allow (Puck drop refusal); slots render via MosaicSlotZone
MOD  js/src/shared/types/schema.ts                   + SlotDescriptorJson + manifest.slot_descriptors
MOD  modules/…/MosaicColumnsComponent.php            column_1 min=1 + empty_display (ruled-exception → a real banner)
MOD  tests/…/Smoke/Sprint61SmokeTest.php             oracle-change (slots render via MosaicSlotZone)
NEW  js/src/builder/__tests__/SlotEnforcement.test.tsx   adapter allow + zone chrome + live banner-clear (5 cells)
```
- **Drop refusal:** the slot field carries Puck `allow` from `slot_descriptors[zone].allowed`, so a non-allowed
  child is refused **natively at drop time**. The "Accepts: …" hint names why. (Vitest: the field carries
  `allow`; a bare slot stays `{type:'slot'}`.)
- **min/max banner (never silent):** `MosaicSlotZone` reads the **live** child count from the rendered canvas
  (`[data-puck-component]` via a MutationObserver) and shows a banner inside the zone when below min / above
  max. (Vitest: an empty min-1 zone shows `Requires at least 1 item — 0/1`; once a child is counted the banner
  clears.)
- **empty_display:** rendered while the zone is empty; **defaults/preferred** carried on the descriptor for the
  palette (defaults-insertion-on-first-placement is the one deferred sub-item — see §Deferred).
- **Columns min=1 (ruled exception):** `MosaicColumnsComponent.column_1` carries `min=1` + `empty_display`
  from its PHP source, so a **shipped** component shows a live banner. **Vitest `SlotEnforcement.test.tsx`
  5/5.** Oracle-change: `Sprint61SmokeTest` now asserts slots render via `MosaicSlotZone`.

### Item 4 — FILMED geometry journeys [DONE — real frames]
Journey `js/e2e/journeys/cp-adopt-3.spec.ts`, `--project=journeys`, no sleeps, element clips (full-page Puck
canvas is unstable — cp-adopt-1 precedent). Scratch node **987** (`column_1` empty). Album
`ledger-live/e2e-evidence/cp-adopt-3/` + INDEX (**4 frames + geometry.json**):
- `j1` — the live builder: red **"Requires at least 1 item — 0/1"** banner on the empty `column_1` + the
  dashed empty zone + the empty_display text.
- `j2`/`j3` — banner + empty_display crops.
- `j4` — a **filled** `column_1` (node 334) → **no banner** (the after-drop state; the banner is conditional).
- `geometry.json` — `col1 {x:415,w:136}` + `col2 {x:567,w:136}` → **non-overlapping** (551 ≤ 567).
- **Palette guard CLOSED;** teaser `content` required=true was proven in the manifest (§P1 PASS 2).
- **Machine-proven, not filmed (drag is the unstable surface):** drop-refusal (`allow`) + the live banner-clear
  are asserted in `SlotEnforcement.test.tsx`; FE-dialog parity is by construction (frontend-editor.js uses the
  same `MosaicPuckAdapter` + `MosaicSlotZone`). Honest: the album films the min-banner path (the "banner Arun
  sees") + before/after; the refused-drop is Vitest-proven, not filmed.

### Item 5 — gates + dist + BUMP-LIBS [DONE]
```
Unit FULL     2762/2762 OK   (oracle-changed Sprint61; 1 pre-existing warning)
Kernel FULL    214/214  OK    (SlotDescriptorEmissionTest updated for the column_1 rule)
Vitest FULL    552 pass / 1 pre-existing B-101   (+5 SlotEnforcement)
phpcs 0        phpstan L6 No errors   (MosaicColumnsComponent docblocks cleaned)   tsc: only pre-existing dsdShadow
byte-identical 14e6cb9c before==after   (dist rebuilt; FE render is Twig, unaffected by the builder adapter)
```
Bundling event: `vite build --config vite.builder.config.ts` (builder.js 1,249.57 kB) + `--config
vite.frontend-editor.config.ts` (779.23 kB). **BUMP-LIBS: `mosaic.libraries.yml` 1.0.30 → 1.0.31** (×3).

### Deferred (one honest sub-item)
**defaults[]-insertion-on-first-placement** — inserting the `defaults` children automatically when a zone is
first shown needs a Puck `dispatch(insert)` on mount, which risks a save-state write the byte-identical
invariant must not trigger silently; the `defaults` are emitted on the descriptor + carried to the palette,
but auto-insertion is ledgered for the author-trust slice (it is the one place "never write silently" and
"insert defaults" tension needs Arun's ruling). All other item-3 rules (allow, min/max banner, empty_display,
preferred) are done + filmed/tested.

### Oracle-changes (PASS 3)
| # | Test | Old | New | Reason |
|---|---|---|---|---|
| 1 | Sprint61SmokeTest slot-render | `React.createElement(SlotComp)` | `React.createElement(MosaicSlotZone, {…SlotComp})` | slots render through the zone chrome |
| 2 | SlotDescriptorEmissionTest owned | column_1 identity-only | column_1 has min=1 + empty_display | the ruled-exception rule |

### CHECKPOINT-1 FILED — CP-ADOPT-3 enforcement built, filmed, dist-shipped; SHIP-43-PLAN + WALK written.
### STOP — reviewer audits; then the ship #43 human-commit closes CP-ADOPT-3 (defaults-insertion → author-trust slice).
