# SHIP #42 — CP-ADOPT-2 (Panel from schema; Pillar B / H3 + H4 + H5 + F-108)

**Commit `87be200`** (parent `5a65173` = ship #41). **27 files: 16 modified + 11 new.** PHP + YAML + TS + dist;
**BUMP-LIBS 1.0.29 → 1.0.30.** Arun walk **PASS** (WALK-CP-ADOPT-2.md, 4 steps). Walk-catch tally unchanged
(64 — no new walk-catch this ship). The held `SdcComponentPlugin.php` is **NOT** in the set (pristine).

## What shipped
- **H3 — panel from schema in PHP.** `PropShape` (one shared classifier: schema → semantic kind) +
  `PropDescriptor` (immutable value object) + `MosaicPropShapeEvent` (alter point) + `MosaicPropShapeRegistry`
  (service). The manifest emits `prop_descriptors`; the Puck adapter maps them to fields **byte-identically for
  owned** (`descriptorToField` mirrors `defToField`; boolean stays Yes/No radio; `field_types` sidecar still
  wins). The grader now delegates its raw/known boundary to `PropShape` (single source of truth).
- **H4 — defaults.** `default → examples[0] → type-empty`; a required prop with neither grades Attention.
- **H5 — save-time validation.** `MosaicPropValidator::validateShapes()` rejects a formatted_text (HTML) prop
  that carries content but declares no text format; unknown props tolerated (forward-compat). Registry-driven.
- **F-108 — adopted components expose their props schema.** Discovery stores the core SDC `props` root on the
  definition (`ComponentDefinition::fromCoreDefinition` → `toPluginDefinition`); the manifest builder derives
  descriptors from it when `getPropDefinitions()` is empty. `olivero:teaser` now describes `attributes → raw`
  (Attention). **The held `SdcComponentPlugin` is untouched — F-108 lives on the definition path** (PASS-4
  correction of a PASS-3 held-file violation).
- **Committed byte-identical invariant.** `scripts/qa/region-shasum.sh` (ships via a `.gitignore` exception) is
  the reproducible replacement for the ad-hoc `0864e238` baseline. Canonical node/780 region shasum
  `14e6cb9c17dc61b90a86dd97d8957ae462d789ff854d3523ae581010a43e0dec` (3954 B).

## Gates at ship
Unit FULL 2758/2758 (1 pre-existing warning, mosaic_registry); Kernel FULL 209/209; Vitest 547 pass / 1
pre-existing B-101 (checkbox drift); phpcs 0 on the change set; phpstan L6 OK; byte-identical before==after;
palette guard CLOSED (olivero:teaser guarded); dist 1.0.30.

## Oracle-changes (accepted)
1. Grader C1 — a bare `object` prop grades Attention (was Ready); zero live effect (no object props exist).
2. ManifestControllerTest / MosaicLayoutWidgetTest — `MosaicManifestBuilder` +registry arg.
3. MosaicPropValidatorTest — `MosaicPropValidator` +registry arg (H5).

## Findings recorded
- **FINDING-108** — `getPropDefinitions()` returns the JSON-schema ROOT; adopted components return `[]`
  (their `.component.yml` is not resolvable by template_path). Adopted manifest emission folds into the
  palette-opening slice.
- **FINDING-109** — `js/package.json` `"build"` points to a renamed/missing `vite.bundles.config.ts`; the real
  configs are `vite.builder.config.ts` + `vite.frontend-editor.config.ts`. Fix ledgered.

## Evidence
reports/REPORT-CP-ADOPT-2.md (§P0 + §P1 PASS 1–4), reports/WALK-CP-ADOPT-2.md, ledger-live/SHIP-42-PLAN.md,
ledger-live/FINDINGS.md (107/108/109). **CP-ADOPT-2 CLOSED.**
