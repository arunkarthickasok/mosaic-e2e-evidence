# REPORT — CP-ADOPT-9 P0 (Manage authoring) — blueprint, report-only

> Report-only. NO Mosaic code changed here. Naming ban «ext». Goal: make **everything in the rail
> configuration** — for OWNED and ADOPTED alike — so a site admin (not only a developer or the library
> author) can shape the authoring experience, with shipped defaults that reproduce today's rail exactly.

## 1. TODAY — where authoring behaviour is decided (the knob table)
Every knob, its current source, a `file:line`, and **who can change it today** (the gap CP-ADOPT-9 closes:
almost nothing is site-admin-configurable).

| # | Knob | Today's source | file:line | Who can change it TODAY |
|---|---|---|---|---|
| 1 | Prop → widget KIND (text/media/link/select/…) | `PropShape::classify` | `src/Sdc/PropShape.php:56` | Developer (Mosaic code) |
| 2 | Prop capabilities (bindable / breakpoint / stylable) | `PropShape::capabilities` | `src/Sdc/PropShape.php:314` | Developer (Mosaic code) |
| 3 | Owned per-prop widget override (sidecar `field_types`) | component def `field_types` → `MosaicManifestBuilder` | `src/Service/MosaicManifestBuilder.php` (field_types path) | Owned-component developer (code/def) |
| 4 | Canvas-dialect shape → widget (CP-ADOPT-8) | `MosaicSchemaRefResolver` + `PropShape` detectors (`looksLikeMedia`/`looksLikeLink` in `classify`) | `src/Sdc/MosaicSchemaRefResolver.php`, `PropShape.php:56` | Library author (schema) / bundled |
| 5 | Repeater rule (a slot's single child + min/max) | profile `repeaters` → `resolveRepeater` | `MosaicAdoptionProfile.php:100`, `MosaicManifestBuilder.php:354` | Library author (YAML) |
| 6 | Repeater FLOOR (single-`allowed` heuristic) | `resolveRepeater` heuristic | `MosaicManifestBuilder.php:354` | **Nobody** (hardcoded) |
| 7 | Instance slot rule (a placed node's `_mosaic_slot_rules`) | `ComponentInstance` + client `resolveFields` | `ComponentInstance.php`, `MosaicPuckAdapter.ts` resolveFields | Author, via a **pattern** only |
| 8 | requires-parent (item → container) | profile `requiresParent` | `MosaicAdoptionProfile.php:113` | Library author (YAML) |
| 9 | Preferred child of a slot | `SlotDescriptor` (SDC slot metadata / sidecar `preferred`) | `src/Sdc/SlotDescriptor.php:92` | Component developer (SDC metadata) / library author (sidecar) |
| 10 | Preview-defaults (examples as preview, not saved) | profile `preview_defaults` → renderer | `MosaicAdoptionProfile.php:143`, `MosaicRenderer.php:503` | Library author (YAML) |
| 11 | Patterns (curated trees) | profile `patterns` | `MosaicAdoptionProfile.php:160` | Library author (YAML) |
| 12 | Containers / global_libraries | profile keys | `MosaicAdoptionProfile.php:87` | Library author (YAML) |
| 13 | Sidecar slot rules (allowed/min/max overlay) | def `slot_rules` → `SlotDescriptor::partitionSidecarRules` | `SlotDescriptor.php:175` | Component developer (def) |
| 14 | The five rail SECTIONS (Style/Spacing/Visibility/Breakpoint/Data) + gating | client `resolveFieldsWithDrift` + capability gate | `js/src/builder/MosaicPuckAdapter.ts` (resolveFields) | Developer (Mosaic code) |

**Reading:** rows 1–2, 6, 14 are **developer-only**; 3, 13 are **component-developer**; 4–5, 8–12 are
**library-author (YAML/schema)**. **The site admin can change almost nothing.** CP-ADOPT-9 adds a site
config layer above all of them. **Row count: 14.**

## 2. MODEL

### (a) Site-wide `mosaic.shape_map` (simple config)
`shape → default widget`, shipped in `config/install/mosaic.shape_map.yml`:
```yaml
map:
  image: media_picker      # | open_cell | url
  video: media_picker
  link:  link
  html:  cke5              # | plain
  enum:  select            # | radios
  number: number
  text:  text
```
Reproduces today's `PropShape` mapping exactly by default; a site admin can flip e.g. `enum → radios`.

### (b) Per-component `mosaic_component_authoring` config entity
`id = <component-id>` (colon → `__`); `provider`. **Rows are OVERRIDES ONLY** (see the bloat decision, §5).
Each row keyed by prop or slot name:
- prop row: `widget`, `label`, `help`, `required`, `default`, `hidden`, `capabilities{bindable,breakpoint,stylable}`.
- slot row: `allowed[]`, `preferred`, `repeater{child,min,max}`, `open_cell`.
- component-level: `previews` (on/off), `patterns_shown[]`, `rail_order[]`.

**Auto-generated at discovery** from the resolved defaults (SDC → profile → shape map → heuristics),
**idempotent**, and it **NEVER overwrites a site edit** (generation fills only unmanaged rows; an admin-
edited entity is left alone — a per-row `generated: true` marker is cleared on edit).

**Owned migration:** owned components' sidecar `field_types` migrate into shipped default authoring entities
via an **update hook**; the existing **owned-panel Vitest oracles** prove the rail is **byte-identical
before/after** (the migration is a lossless re-encoding of the same widget choices).

### (c) Precedence (H5-guarded)
**SDC hard limits → site config → profile → shape map → heuristics.** H5 **refuses** config that exceeds
SDC limits: a **required** prop cannot be `hidden`; a slot cannot `allow` a child the SDC forbids; a
`widget` cannot contradict the prop's type (e.g. `media` on a boolean). The config layer sits ABOVE the
profile/shape-map/heuristic, BELOW the SDC's own constraints.

### (d) Cache + drift + export
- **Cache:** the manifest + rail carry the authoring entity's **cache tag**; an edit invalidates them (the
  UI reflects changes without a manual clear — §3 cell).
- **Drift:** when a library update **removes a prop**, its authoring row is **flagged in the library-changes
  report** (Pillar H), never silently dropped.
- **Export/import:** config only (the entity is CMI) — a site's authoring model travels with its config.

## 3. UI
- **Component libraries page → per component "Manage authoring"** (a Drupal form; `mosaic.administer`):
  tabledrag rows like *Manage form display* — per-row **widget select + settings**, label/help/required/
  hidden, **reset-to-defaults**. Saves the config entity (override rows only).
- **Site-wide "Field types" form** for `mosaic.shape_map` (shape → default widget).
- Changes reflect in the rail **without a cache clear** (cache-tag invalidation — lifecycle cell).

## 4. LIFECYCLE cells (to build)
install library → **entities generated** (from resolved defaults) → **edit in UI** → **rail follows** →
**save validation honours config** (H5) → **render** → **library update flags rows** (drift) →
**export/import round-trips** → **library uninstall keeps config flagged** → **re-install reattaches**.

## 5. DERIVED matrix + risks + build order

### Matrix (knob × source-precedence × owned/adopted × surface × permission)
| knob | precedence layer | owned | adopted | admin surface | FE surface | permission |
|---|---|---|---|---|---|---|
| widget | site-config > profile > shape-map > heuristic | ✓ | ✓ | Manage-authoring | (read-only reflect) | mosaic.administer |
| required/hidden | SDC-limit > site-config | ✓ | ✓ | Manage-authoring | — | mosaic.administer |
| slot allowed/repeater | SDC-limit > site-config > profile > heuristic | ✓ | ✓ | Manage-authoring | — | mosaic.administer |
| shape default | site-config (shape_map) | ✓ | ✓ | Field-types form | — | mosaic.administer |
| previews / patterns_shown | site-config > profile | n/a | ✓ | Manage-authoring | — | mosaic.administer |

Oracle + smoke-alarm per cell: the rail renders the configured widget; H5 refuses over-reach; owned panel
byte-identical when no override.

### Risks
| # | risk | decision / mitigation |
|---|---|---|
| 1 | **Config bloat** on a 47-component library | **DECISION: OVERRIDES-ONLY rows.** An entity per component, but it stores ONLY rows that differ from the computed default (usually zero). A 47-component library × ~10 props = 470 potential rows, but untouched = 47 near-empty entities (id + provider, no rows) or lazy creation on first edit. The manifest build recomputes the resolved default and applies the entity's deltas. **Justification:** full-row entities would ~10× the config with data identical to the code-computed default (pure duplication + drift risk); overrides-only keeps config = intent. |
| 2 | **Owned `field_types` migration** | update hook re-encodes sidecar → shipped default entity; owned-panel Vitest oracles prove byte-identical rail before/after; migration is lossless. |
| 3 | **Manifest-build performance** (resolve + entity merge per component per builder open) | entities cached by tag; the merge is a shallow overlay on the already-computed descriptor; measure vs the current build; overrides-only keeps the merge tiny. |
| 4 | **H5 over-reach** (config that breaks the SDC contract) | precedence caps config below SDC hard limits; H5 refuses required-hidden / forbidden-child / type-mismatched widget at save. |
| 5 | **Drift** (a library update removes a prop with an override row) | flagged in the library-changes report, never dropped. |

**Risk count: 5.**

### Build order (one subsystem per pass, CHECKPOINTS; owned oracles the gate)
1. `mosaic.shape_map` config + shipped defaults + wire `PropShape`/manifest to read it (owned byte-identical).
2. `mosaic_component_authoring` entity + auto-generate at discovery (overrides-only) + manifest merge.
3. H5 precedence guard + save refusal cells.
4. Owned `field_types` → entity migration (update hook; Vitest oracle byte-identical).
5. Manage-authoring UI + Field-types form (tabledrag, per-row widget select, cache-tag live reflect).
6. Drift flag in library-changes report + export/import round-trip cells.

## Sources
All `file:line` in §1 verified this pass against the Mosaic tree at `33cd40c`. No Canvas dependency. This
is a blueprint — no code was written.

---

## CHECKPOINT-1 (P1 BUILD) — `mosaic.shape_map` site config + Field types form

The first CP-ADOPT-9 layer: a site admin can now set the **default widget per prop SHAPE**, for owned AND
adopted alike, at **`/admin/config/mosaic/field-types`**. Shipped defaults reproduce today's rail exactly.

### Built (Mosaic tree; Arun commits)
- **`config/install/mosaic.shape_map.yml`** — the shipped map (`media → media_picker`, `formatted_text →
  cke5`, `link → link`, `select → select`, `toggle → checkbox`, `number → number`, `text → text`) = the
  widget each `PropShape` kind renders as **today**.
- **`config/schema/mosaic.schema.yml`** — `mosaic.shape_map` config schema.
- **`src/Sdc/MosaicShapeMap.php`** (`mosaic.shape_map`) — `widgetFor(shape)` (config or shipped default),
  `allowedWidgets(shape)`, `shapes()`, and **`isCompatible(shape, widget)` = H5**: a widget outside a
  shape's allowed set never wins (a saved-but-incompatible value falls back to the default).
- **`src/Form/MosaicShapeMapForm.php`** + route `mosaic.admin.field_types` (`mosaic.administer`) — a select
  per shape (only its compatible widgets), **`validateForm` refuses** an incompatible widget.

### Proven
- **Kernel `ShapeMapTest` (4):** shipped defaults reproduce today's rail; a valid override is honoured; an
  incompatible widget is refused (fallback to default); shapes expose their allowed widgets.
- **Functional `ShapeMapFormTest` (2):** anon/non-admin → **403**, admin → **200**, a valid override saves;
  the form offers ONLY compatible widgets (Toggle offers `checkbox`, NOT `media_picker`).

### Today's rail is UNCHANGED — trivially proven
This pass added the config + service + form only; **nothing in the manifest or the rail consumes the map
yet**, so no JS changed, the manifest is byte-for-byte the same, and the **owned oracles are IDENTICAL**.
The owned-panel Vitest is therefore unchanged (no JS), and the manifest diff is empty by construction.

### DEFERRED → CHECKPOINT-2 (the "rail follows the map" half)
Making a **changed** map flow to the rail (client `descriptorToField` reads the map from `drupalSettings`,
default = current so untouched libraries stay byte-identical; the cache-tag invalidation cell "change map →
rail follows without a cache clear"; the client Vitest) is the next checkpoint — it is where the JS + dist
bump land. The server + form + H5 (this checkpoint) are the foundation.

### Gates
Kernel+Unit **3157 / 0** (8938 assert) (+4 ShapeMapTest) · Functional **78 / 0** (+2 ShapeMapFormTest) · Vitest
**724 / 1** (B-101; **no JS this pass**) · phpcs **0** · phpstan **0 new** · owned oracles **REGION
14e6cb9c…3954 + STYLE b7756795…ca982 4354 10** IDENTICAL · dist **UNCHANGED** (1.0.79).

**STOP after gates — CHECKPOINT-1 filed. The shape_map config + Field types form + H5 land; today's rail is
untouched (server-only). Next: CHECKPOINT-2 (client rail-follows + cache-tag live update).**
