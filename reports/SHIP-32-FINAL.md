# SHIP #32 — FINAL

**Shipped commit:** `90a8f8f41beddfd773856c713d30850915da11e2`
**Parent:** `8124d3e` (ship #31 milestone)
**Branch:** `fix/finding-016-validator` — `== origin`, tracked tree clean
**Date:** 2026-09-09

## What shipped (the completed slice)
- **F-094 / walk-catch #48 — CLOSED on ship.** The admin node-edit builder canvas now bounds +
  scrolls exactly like the FE dialog canvas (`_PuckCanvas-root` overflow-y:auto), so long layouts
  are reachable with a real wheel — proven by a geometry journey on both hosts, W18 green before
  and after.
- **Preview-toggle removal (Arun-ratified) — executed.** The redundant Edit/Preview mode tabs +
  `MosaicPreview` removed from the builder header (admin-only; FE bundle byte-identical). Ten
  source-grepping smoke tests honestly retargeted as ledgered oracle-changes after the gate caught
  the deletion regression. Server `/mosaic/render-preview` route left; retirement ledgered.
- **Stage 5 template round-trip — invariant locked.** A Kernel test proves a rich v5 `sets` payload
  (per-set bodyFormat + `<drupal-media>` + a breakpoint variant) round-trips save-as-template then
  apply byte-identical.

## Gates at ship
FULL Kernel+Unit **2853 / 0** · Vitest **482** (1 pre-existing B-101) · lock/f066/W18 green ·
PHPCS/PHPStan clean · dist **1.0.15**.

## Split out
The carousel authoring redesign (F-083) was **witnessed** (slide_N richtext props, no field_types)
and split to **ship #33** as a v5→v6 migration-bearing build, together with F-084 search.

## Evidence
Album `ship32-scroll/` (commit 7b89fe7). Reports: `REPORT-SHIP32.md`, `SHIP-32.md`, this file.

## Open after ship
#25 / F-072 (columns Wave 3.2) · #29 / F-081 (FE deselect, park). Walk tally 48.
