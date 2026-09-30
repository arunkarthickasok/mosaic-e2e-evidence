# CP-ADOPT-9 CHECKPOINT-3 — component authoring entity + precedence resolver (H5) + owned migration

**Date:** 2026-10-01 · **Branch:** `fix/finding-016-validator` (mosaic working tree — built + gated;
not AI-committed per commit-flow, handed to Arun). Parent ship #47 = `33cd40c`.

Scope for this checkpoint (Arun-ruled): **the entity keystone + the owned migration** — build-order §5.2/§5.3
plus §5.4. The **Manage-authoring form** (§5.5) and the drift flag (§5.6) are the recorded next landing.

## What shipped

The per-component authoring model is now real config, and the ONE precedence resolver overlays it onto the
computed manifest — capped by SDC hard limits (H5). **No entity, or a pristine (auto-generated) entity, is a
no-op → the rail is byte-identical to today's build.**

### Entity (overrides-only)
- `src/Entity/MosaicComponentAuthoringInterface.php`, `src/Entity/MosaicComponentAuthoring.php` — the
  `mosaic_component_authoring` config entity. `id` = component id (`:` → `__`), `provider`, `rows`
  (a list of prop/slot override rows, each carrying only the fields it overrides + a `generated` marker),
  `previews`/`patterns_shown`/`rail_order`. Exportable (CMI). `railCacheTag()` = per-entity tag.
- `config/schema/mosaic.schema.yml` — `mosaic.component_authoring.*` schema (static, no dynamic keys).

### Resolver (precedence + H5) — the ONE resolver
- `src/Sdc/MosaicAuthoringResolver.php` (`mosaic.authoring_resolver`). Precedence **SDC hard limits →
  entity → profile → shape map → heuristics**. `applyOverrides()` overlays the entity's rows onto
  `field_types`/`prop_descriptors`/`slot_descriptors` + component-level; **H5 refuses** an over-reaching row
  (dropped + logged) with an author-grade message; `refusals()` exposes the same messages for the save path;
  `ensure()` auto-generates a pristine entity when absent (idempotent, never overwrites an edit).
- Wired into `MosaicManifestBuilder::buildComponentEntry` as the final overlay (no-op by default).
- `MosaicLayoutWidget` attaches the `mosaic_component_authoring_list` cache tag so the rail follows a change
  with no manual cache clear.

### Owned migration
- `mosaic.install` `mosaic_update_10004()` — generates a pristine (overrides-only, empty) authoring entity
  for every owned component that lacks one. The `field_types` sidecar keeps driving the descriptors
  (back-compat); the entity is the override surface and **wins** when it carries a row. Empty entity =
  no-op = **byte-identical** rail (proven below). Idempotent; Arun's walk runs `drush updb` on dev.

### Example entity (an override) — `mosaic.component_authoring.mosaic_card.yml`
```yaml
langcode: en
status: true
dependencies: {  }
id: mosaic_card
label: Card
provider: mosaic
rows:
  - name: body
    kind: prop
    generated: false
    widget: plain
    label: 'Body copy'
    help: 'Keep it under 200 characters.'
  - name: items
    kind: slot
    generated: false
    preferred: mosaic_card
    repeater_min: 1
    repeater_max: 6
previews: ''
patterns_shown: {  }
rail_order: {  }
```

### H5 refusal messages (author-grade)
- **required-hidden:** `The title field is required by the component and cannot be hidden.`
- **forbidden-child:** `mosaic_hero cannot be added to the items slot — the component does not allow it.`
- **type-mismatch widget:** `The media_picker widget cannot be used for the title field (a text field).`

## Owned rail byte-identical — proof
- **Both owned shasums VERBATIM** (before build == after): REGION `14e6cb9c…a43e0dec 3954`,
  STYLE `b7756795…9aaca982 4354 10`.
- **Vitest unchanged** — no JS this pass (server-only overlay), so the owned-panel oracles are identical to
  the CHECKPOINT-2 baseline (731 pass / 1 pre-existing B-101).
- **Kernel cells** — `testNoEntityIsByteIdentical`, `testEmptyEntityIsNoOp`, `testOwnedMigrationIsByteIdentical`
  assert the overlay returns the entry unchanged (`assertSame`) with no / empty / generated entity.

## Gate (FULL, in DDEV)

| Check | Result |
|---|---|
| PHPCS (Drupal,DrupalPractice) new/changed | **0 errors** |
| PHPStan `-l6` new classes | **0 errors** |
| Vitest (no JS) | 731 pass / **1 pre-existing** (B-101) |
| PHPUnit **Unit** | **2832 / 0** (1 pre-existing warning) |
| PHPUnit **Kernel** (incl. new AuthoringResolverTest 11/61) | **336 / 0** (3 pre-existing skips) |
| PHPUnit **Functional FULL** | **78 / 0** (813 assertions, 2 pre-existing skips) |
| dist | **UNCHANGED** (no adapter/JS change — server-side overlay; no BUMP-LIBS) |
| Owned shasums | **VERBATIM** (REGION + STYLE, before + after) |

## New AuthoringResolverTest cells (11 / 61 assertions)
no-entity byte-identical · empty-entity no-op · per-key prop overrides · slot overrides · component-level
overrides · H5 required-hidden refused+dropped · H5 forbidden-child refused+dropped · H5 type-mismatch
widget refused+dropped · auto-gen idempotent + never-overwrites · owned migration byte-identical · rail cache tag.

## Deferred (recorded next landing — CHECKPOINT-4/5)
- **Manage-authoring form** (§5.5) at `/admin/config/mosaic/component-libraries/{library}/{component}/authoring`
  per the FROZEN v4.1 design (tabledrag, per-row widget select limited by shape-map, reset, validation strip,
  overrides-only filter). Functional cells 403/200, save round-trip, refusal, reset.
- **Client rail application** (P3) — widget/label/help/hidden/default applied client-side; capability toggles.
- **Drift flag** in the library-changes report (§5.6) + export/import round-trip cells.
- **Perf** (P0 risk #3) — applyOverrides loads a config entity per component per build; overrides-only keeps
  the merge tiny and config loads are cached, but a "any authoring entity exists?" fast-path is a follow-up.
