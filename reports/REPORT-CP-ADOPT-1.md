# REPORT — CP-ADOPT-1 (Discovery + Component Library entity; Pillars A+F, H1/H2/H8)

Evidence base: ADOPT-DESIGN.md RATIFIED (14abedf), PROBE-COMPONENT-PIPELINE.md (1df630c). Mosaic git
READ-ONLY. No dev DB/config writes. HEAD `d0fdb22` (ship #40), tracked tree clean.

---

## §P0 — FRESH-READ + DERIVED SCENARIO UNIVERSE (report-only)

### P0.1 The gate + discovery shape (fresh, d0fdb22)
Discovery is a **filesystem scan**, not core-SDC-derived:
- `src/Sdc/SdcComponentDiscovery.php:40-56` — `foreach (glob($componentsDir . '/*', GLOB_ONLYDIR) …) { … if
  (!file_exists($componentYml) || !file_exists($mosaicYml)) { continue; } … $definitions[$id] =
  ComponentDefinition::fromSidecarYaml($id, $data, $provider, $templatePath); }`. **THE GATE = lines 45-48**
  (skip unless BOTH `.component.yml` AND `.mosaic.yml` exist). `$id = $data['id'] ?? $name` → **bare id**;
  `$provider = basename($base)`.
- `src/Plugin/MosaicComponentManager.php:101-158` `findDefinitions()` merges PHP-attribute defs
  (`parent::findDefinitions()`) with `$this->sdcDiscovery->discover(...)` — SDC first, PHP overwrites on id
  conflict. NOT a wrapper of `plugin.manager.sdc`.
- **H2 target:** re-base `discover()` on core `plugin.manager.sdc->getDefinitions()` (definitions + cache tags +
  core `$ref` resolution); DROP the `.mosaic.yml` requirement (sidecar → optional enhancer, still parsed when
  present via `ComponentDefinition::fromSidecarYaml`). Keep the PHP-attribute plugins + the SDC→PHP override.

### P0.2 Bare-id consumer census (the H1 alias-map wiring blueprint)
Stored layouts use **bare** `nodes[id].type` (e.g. `mosaic_view`); every lookup passes that bare id to the
Mosaic manager (which returns bare ids). H1 = Mosaic's 14 keep bare ids via an alias map; adopted components
store full `provider:id`. Each site below must resolve a stored id through the alias map:

| # | Site (`file:line`) | Call | Note |
|---|---|---|---|
| 1 | MosaicRenderer.php:425 | `createInstance($type)` (SSR preview path) | bare stored type |
| 2 | MosaicRenderer.php:437 | `getDefinition($type, FALSE)` | " |
| 3 | MosaicRenderer.php:632 | `$instance->type === 'mosaic_region'` | synthetic region literal (keep bare) |
| 4 | MosaicRenderer.php:658 | `createInstance($instance->type)` (page render) | bare stored type |
| 5 | MosaicRenderer.php:731 | `getDefinition($instance->type, FALSE)` | " |
| 6 | MosaicRenderer.php:753,804 | `data-mosaic-component`, `alter('mosaic_render', …, $componentId)` | id surfaced to markup + hook |
| 7 | MosaicLayoutWidget.php:633 | `createInstance((string) $id)` (palette) | manifest ids |
| 8 | ManifestController.php:85 | `createInstance((string) $id)` (manifest) | manifest ids |
Alias map = `{bare ⇄ provider:id}` for the 14 owned ids (12 `mosaic_components:*`, `mosaic_views:mosaic_view`,
`mosaic_webform:webform_embed`); resolution must be idempotent for already-bare + already-prefixed inputs.
**Invariant (H1):** existing saved layouts (bare types) render byte-identically — assert with the current
render/round-trip fixtures.

### P0.3 Governance + entity (fresh; F + H8)
- `component_package` = schema-only config entity (`config/schema/mosaic.schema.yml:78-109`: `id, label,
  description, components[], allowed_bundles[], status`), **no class, `hasDefinition()=false`, zero consumers**
  (PROBE Q6). `default_component_package: base` (`mosaic.settings.yml:31-33`) has no consumer + no shipped
  `base`.
- Admin page groups by provider MODULE (`ComponentPackagesController.php:58-68`), not the entity.
- Governance today = node_type third-party setting `mosaic.allowed_components`: defined
  `MosaicFormHooks.php:39-99`, enforced `MosaicLayoutWidget.php:621-631` (`allowed_components`) +
  `restricted` from the PHP attribute (`ManifestController.php:73-80`, attribute default
  `Attribute/MosaicComponent.php:62`).
- **F/H8 target:** promote to `ConfigEntityType mosaic_component_library` (id=provider, provider_type
  module|theme, status default FALSE non-Mosaic / TRUE for `mosaic_*`, `components[]{id,enabled,restricted}`,
  readiness summary CACHED not stored); auto-create on discovery, never delete; `restricted` moves to the
  entity (attribute = fallback).

### P0.4 DERIVED scenario universe (dimensions crossed; oracle per equivalence class)
Dimensions (RATIFIED §3/§4): **discovery-shape** {sidecar+schema, schema-only, slots-only, no-schema,
theme-provided(active/inactive), replaces, internal, group} × **provider** {mosaic_components, other-module,
theme} × **grade** {Ready, Attention(prop+reason), Blocked} × **governance** {library OFF/ON; component
enabled/disabled/restricted; bundle allowlist empty/library-level/per-component} × **permission-parity**
{admin builder, FE dialog, anon manifest, mosaic.administer vs author} × **geometry** {admin page + palette
boundingBox: rows/badges visible, non-overlapping, section headers ordered}.

Derived cells (equivalence classes — each an ADOPT-1 Kernel/e2e oracle):

| # | Discovery shape | Provider | Expected grade | Admission / palette / governance oracle |
|---|---|---|---|---|
| C1 | sidecar+schema | mosaic_components | Ready | admitted; bare id via alias; in author palette; library ON default TRUE |
| C2 | schema-only (no sidecar) | other-module | Ready (all props map) | **admitted (gate removed)**; provider:id; NOT in author palette (adopt_palette FALSE); library entity auto-created, status FALSE |
| C3 | schema-only, one prop → raw fallback | other-module | **Attention** (names the prop + "fell to raw text") | admitted; grade badge = Attention w/ reason; library page shows reason |
| C4 | slots-only (no props) | other-module | Ready (no props = no props) | admitted; slot fields present; not blocked for having no props |
| C5 | no-schema (no props, no slots) | other-module | Ready or Attention (empty) | admitted; renders as bare element; graded, not dropped |
| C6 | unusable (e.g. missing template) | any | **Blocked** | admitted to library page but **hidden by default**; never in palette |
| C7 | theme-provided, theme ACTIVE | theme | grade as props | admitted; provider_type=theme; **theme-bound flag**; `olivero:teaser` day-one smoke |
| C8 | theme-provided, theme INACTIVE | theme | graded | admitted + flagged theme-bound; H-fallback covers switch (ADOPT-6) |
| C9 | `replaces` present | any | graded | `replaces` read + carried on definition (tolerate absence) |
| C10 | `internal: true` | any | graded | `internal` read; excluded from palette even when adopt opens (ADOPT-4) |
| C11 | `group` present | any | graded | `group` → category on the definition |
| C12 | library OFF | any adopted | n/a | component NOT in manifest (admin+FE); library page still lists it |
| C13 | component disabled in library | any | graded | not in manifest; enable toggles it back |
| C14 | component restricted (H8 entity) | any | graded | in manifest for `mosaic.administer` only; author omitted — Permission-Parity |
| C15 | bundle allowlist per-component | any | graded | admin AND FE dialog both honor it; anon manifest unaffected |

Permission-Parity oracle (every admitting cell): admin builder manifest == FE dialog manifest for the same
role; anon manifest excludes restricted/disabled; `mosaic.administer` sees restricted, author does not.
Geometry oracle (admin page + palette): each library = one section with an ordered header; component rows show
name + thumbnail slot + grade badge; badges/rows non-overlapping (boundingBox); Blocked hidden by default.

### P0.5 Smoke-alarm design (per RED→GREEN law)
Each grader cell has a smoke-alarm: neuter the grader (force Ready) → C3/C6 cells must FAIL (Attention/Blocked
no longer detected). Each alias cell: bypass the map → a bare stored `mosaic_view` fails to resolve.
Each guard cell: unset `adopt_palette=FALSE` → an adopted component leaks into the author manifest → cell bites.

---

## §P1 — DISCOVERY BUILD — HONEST CHECKPOINT (not started this pass)

**Decision (honest, quality-first):** P1 is an architectural change to the **discovery + render hot path** —
re-basing `SdcComponentDiscovery` on core `plugin.manager.sdc` (H2), removing the `.mosaic.yml` gate, and
threading an alias map through the 8 censused bare-id consumers (H1) plus the grader + palette guard. Mutating
that hot path at contrib-quality (with the H1 "saved layouts render byte-identical" invariant, the derived
Kernel matrix RED→GREEN, and full gates) is a focused build that must not be rushed at the tail of a very long
session — a half-applied gate-removal would change what dev discovers on the next cache rebuild and entangle
with P2's auto-create. P0 above is the complete blueprint (gate quote, consumer census, derived matrix + per-
cell oracles + smoke-alarms, entity shape) so P1 starts clean.

**P1 build order (next pass), each RED→GREEN in the Kernel test DB (no dev writes):**
1. Alias map helper (bare ⇄ provider:id, idempotent) + unit cell; then thread sites #1-8 (P0.2); assert the
   saved-layout render invariant with existing fixtures (smoke-alarm: bypass map → bare `mosaic_view` fails).
2. Readiness grader (Ready/Attention(prop+reason)/Blocked) as an isolated PHP service + cells C1-C6, C9-C11
   (smoke-alarm: force-Ready → C3/C6 bite).
3. Rebase `discover()` on core `plugin.manager.sdc`; drop the gate; sidecar optional enhancer; carry grade +
   provider + theme-bound; cells C2/C4/C5/C7/C8.
4. Palette guard `adopt_palette: FALSE` for non-Mosaic components + Kernel cell (C12-style leak alarm).
5. FULL Kernel+Unit, phpcs, phpstan → CHECKPOINT-1 push (red-before-green logs).

**P2 GATE:** the Component Library entity (auto-create on discovery, update hook, cache rebuild) **writes dev
config/DB** and REQUIRES Arun's sanction word in the triggering message. This charter's message contains no
sanction word → **P2 is not started; STOP-and-ask at that gate** per the charter.

### STOP — reviewer audits §P0 (the derivation blueprint); P1 discovery build is the next focused pass; P2 awaits the sanction word.

---

## §P1 — BUILD (interim checkpoint, 2026-09-17) — building blocks GREEN; hot-path integration honest-checkpointed

Mosaic git READ-ONLY (files edited, uncommitted — Arun commits at ship #41). No dev writes in this pass.
Order note (honest): the alias map (step 1) is a **no-op until the core-SDC rebase (step 3)** — its consumer
threading + smoke-alarm can only bite post-rebase — so I built the two **isolated, self-contained units**
first (grader step 2 + the alias-map class step 1) to green, and honest-checkpoint the coupled hot-path
integration (threading + rebase) as one change, per the coupling flagged in §P0.

### DONE + GREEN
**Grader (Pillar A) — `src/Sdc/MosaicComponentGrader.php` + `tests/src/Unit/Sdc/MosaicComponentGraderTest.php`:**
Ready / Attention(prop+reason) / Blocked; slots-only = Ready; shape test mirrors `defToField`
(enum→select; string/integer/number/boolean/array/object mapped; `$ref` + unknown type → raw fallback →
Attention); tolerant readers for `group`/`replaces`/`internal`/`variants`. Cells C1 (all-map=Ready), C3
(raw-fallback=Attention, names `geo`+`hero`, `$ref` reason), C4 (slots-only=Ready), C5 (no-schema=Ready),
C6 (unrenderable=Blocked), tolerated-keys, + smoke-alarm.
RED proof (neuter `mapsToKnownShape → TRUE`):
```
=== RED (mapsToKnownShape → TRUE): C3 must fail ===
Failed asserting that two strings are identical.
FAILURES!  Tests: 1, Assertions: 1, Failures: 1.
```
Restored → GREEN.

**Alias map (H1) — `src/Sdc/MosaicComponentAlias.php` + `…/MosaicComponentAliasTest.php`:**
`toCanonical` (bare→provider:id for owned) / `toBare` (provider:id→bare) / `isOwned` /
`fromSdcDefinitions` / `providerIsOwned`; owned = provider is `mosaic`/`mosaic_*`; adopted (`olivero:teaser`)
+ unknown ids + the `mosaic_region` literal pass through unchanged; both directions idempotent. Smoke-alarm:
bypassing `toCanonical` leaves a bare `mosaic_view` un-resolved (≠ `mosaic_views:mosaic_view`).

**Gates on these units:** Unit **15 tests / 54 assertions OK**; phpcs **0 ERRORS** (4 files; warnings =
pre-existing line-length); phpstan L6 **[OK] No errors**. No dist change → no libs bump.

### NOT STARTED — honest checkpoint (the integration heart of CP-ADOPT-1)
These are the large, coupled, hot-path + live-write pieces; not begun this pass and NOT faked:
- **Step 1 threading + Step 3 core-SDC rebase (H2):** thread `MosaicComponentAlias` through the 8 censused
  consumers (§P0.2) AND re-base `SdcComponentDiscovery::discover()` on core `plugin.manager.sdc` (drop the
  `.mosaic.yml` gate; sidecar optional; carry grade/provider/theme-bound; cache-tag invalidation), under the
  "saved layouts render byte-identical" invariant (shasum node/780 before/after) + cells C2/C4/C5/C7/C8. This
  is one coupled change on the render hot path — deferred to a fresh focused pass rather than rushed at the
  tail of a very long session (a half-applied gate-removal changes dev discovery on next cache rebuild).
- **Step 4 palette guard** (`adopt_palette: FALSE`, Permission-Parity admin/FE/anon).
- **Step 5 full gates + live drush proof** (olivero:teaser graded).
- **P2** Component Library entity + admin page + node-type form + **live auto-create** (SANCTIONED, dev-only) —
  not started; runs in the same focused pass after P1 integration is green.
- **P3** Playwright lifecycle · **P4** close/SHIP-41-PLAN.

No red left red: the two built units are green; the only RED (grader C3) was a deliberate smoke-alarm,
demonstrated then restored. No oracle changed.

### INTERIM CHECKPOINT filed — not CHECKPOINT-1 (which requires all of P1). Next focused pass: thread+rebase (1+3) → guard (4) → gates (5) → CHECKPOINT-1 → P2 (live, sanctioned) → P3 → P4.
