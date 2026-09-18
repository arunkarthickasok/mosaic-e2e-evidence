# SHIP #43 PLAN — CP-ADOPT-3 (Pillar C — SDC slots → drop zones with child rules; H7)

Accumulates on ship #42 (`87be200`). Mosaic git READ-ONLY — the ceremony add block for Arun's human commit.
**17 files: 12 modified + 5 new.** Carries a **dist rebuild** (builder.js + frontend-editor.js) → **BUMP-LIBS
1.0.30 → 1.0.31**. Spans P1 items 1–3 (slot descriptors → child rules → adapter enforcement).

## New files (5)
```
src/Sdc/SlotDescriptor.php                              slot descriptor value object (identity + rules + H7 partition)
js/src/builder/fields/MosaicSlotZone.tsx               drop-zone chrome (allowed hint, live min/max banner, empty_display)
js/src/builder/__tests__/SlotEnforcement.test.tsx      adapter allow + zone chrome + live banner-clear (5 cells)
tests/src/Unit/Sdc/SlotDescriptorTest.php              fromMetadata/withRules/partition (H7) — 4 cells
tests/src/Kernel/Adopt/SlotDescriptorEmissionTest.php  owned + adopted emission, required→min1, H7 wiring — 5 cells
```

## Modified files (12)
```
src/Service/MosaicManifestBuilder.php        + slot_descriptors (identity+rules, additive) + H7 overlay + logger
src/Sdc/ComponentDefinition.php              + slotRules (sidecar slot_rules overlay source)
mosaic.services.yml                          manifest_builder + logger.channel.mosaic
mosaic.libraries.yml                         BUMP-LIBS 1.0.30 → 1.0.31 (×3)
js/src/builder/MosaicPuckAdapter.ts          slot field +allow; slots render via MosaicSlotZone; PuckField +allow/disallow
js/src/shared/types/schema.ts                + SlotDescriptorJson + manifest.slot_descriptors
js/dist/builder.js                           rebuilt (adapter + slot zone)
js/dist/frontend-editor.js                   rebuilt
modules/mosaic_components/src/Plugin/MosaicComponent/MosaicColumnsComponent.php   column_1 min=1 + empty_display (ruled exception) + docblock value types
tests/src/Unit/Controller/ManifestControllerTest.php   +logger (NullLogger) arg
tests/src/Unit/Plugin/Field/MosaicLayoutWidgetTest.php +logger (NullLogger) arg
tests/src/Unit/Smoke/Sprint61SmokeTest.php   oracle-change (slots render via MosaicSlotZone)
```

## `git add --dry-run` verdict — every file trackable
All 5 new files return `add '<path>'` (0 ignored). The journey `js/e2e/journeys/cp-adopt-3.spec.ts` is
gitignored (`js/e2e/`); the album frames are the artifact (in the evidence repo, not the module).

## EXCLUSIONS (never staged)
`AI/` (symlink); `js/*.log`, `js/dist-build-*.log`, `js/e2e/`; `assets/`; the scratch fixture **node 987** (dev
content, not config); node 334 fixture (pre-existing).

## Gates at plan time
Unit FULL 2762/2762; Kernel FULL 214/214; Vitest 552 pass / 1 pre-existing B-101; phpcs 0; phpstan L6 OK;
byte-identical region shasum `14e6cb9c…` before==after; palette guard CLOSED; dist 1.0.31.

## Deferred (ledgered, not in this ship's scope)
`defaults[]`-insertion-on-first-placement — a Puck `dispatch(insert)` on mount that risks a silent save-state
write; the `defaults` are emitted on the descriptor but auto-insertion goes to the author-trust slice (Arun's
"never write silently vs insert defaults" ruling).

## Proposed commit message (single quotes)
```
git commit -m 'ship #43: CP-ADOPT-3 SDC slots become drop zones with child rules - the manifest emits slot descriptors (identity + allowed/min/max/defaults/empty_display, H7: sidecar adds rules only), the Puck adapter enforces them (allow refuses non-allowed drops; a live min/max banner + empty_display via MosaicSlotZone), Columns column_1 ships min=1; byte-identical owned render, dist rebuilt, libs 1.0.31'
```

## STOP — Arun eye-test (WALK-CP-ADOPT-3.md, 3 steps + a drag), then the human commit closes ship #43.
