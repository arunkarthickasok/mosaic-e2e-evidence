# CP-ADOPT-6 P6 — cache-tag unification · per-zone picker · walk · SHIP-46-PLAN — PROOF

## Oracles (BEFORE == AFTER)
See `oracles-dist.txt`. REGION `14e6cb9c…3954` and STYLE `b7756795…ca982 4354 10` byte-identical
before/after. Fallback-page baseline = walk step 2 (Arun's Olivero OFF); mechanical = `FallbackRenderTest`.

## P6.1 — cache-tag unification
`MosaicComponentLibrary::cacheTagFor($provider)` (`config:mosaic.component_library.<provider>`) +
`::LIST_CACHE_TAG` (`config:mosaic_component_library_list`, = the entity's real list tag). 6 sites
unified: MosaicRenderer ×2, MosaicComponentLibrariesForm ×2, MosaicLayoutWidget, MosaicLibraryChangesController.
Fixed a latent bug: the widget's old `config:mosaic.component_library_list` (dot) never invalidated.
Kernel `CacheTagUnificationTest` (4): constant; save invalidates per-provider tag; LIST_CACHE_TAG ==
entity list tag; a toggle clears a tagged entry (one tag → page + manifest + report).

## P6.2 — per-zone add-picker (SO-2 UX)
`MosaicZonePicker` — keyboard "+" on the zone header + empty zone. Plain content FIRST on a foreign
free-content slot, then allowed; owned Columns get their allowed list. `insertIntoSlot(parentId,
slotName, type)` → Puck native `insert` into `<parentId>:<slotName>`. Keyboard: Tab/Enter/↑↓/Esc.
DROP-PROOF: the drop zone still renders (drag lands). Vitest: `MosaicZonePicker` (6) +
`MosaicSlotZonePicker` (4). Live insert + no-flash = walk step 7.

## P6.3 — journeys → WALK-CP-ADOPT-6.md
`reports/WALK-CP-ADOPT-6.md` — "pages survive library changes and removals", 8 steps, one STOP each,
Arun toggles Olivero. Mechanical proofs in the suite (FallbackRenderTest, SchemaDriftTest, the picker
Vitest, the mosaicAttach 20-edit leak-guard).

## P6.4 — .gitignore
`*.log`, `js/e2e.zip`, `js/esc-probe.config.ts`, `/assets/`, `js/assets/` (anchored — never catches the
shipped `js/dist/assets/`). See `check-ignore.txt`: cruft ignored, all 59 ship paths tracked.

## P6.5 — SHIP-46-PLAN.md
`ledger-live/SHIP-46-PLAN.md` — full `git status --short -uall` (33 M + 26 untracked = 59), check-ignore
verdict (0 ignored), single-quoted commit message P1–P6.

## Gates
See CHECKPOINT-5 in reports/REPORT-CP-ADOPT-6.md. Vitest 629/1 (B-101). tsc clean. phpstan P6 cache-tag
edits add 0. dist 1.0.56→1.0.57 (renderer byte-identical).
