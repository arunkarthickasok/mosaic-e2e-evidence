# SHIP #43 — CP-ADOPT-3 (Pillar C — SDC slots → drop zones with child rules; H7)

**Commit `75b3039`** (parent `87be200` = ship #42). **17 files: 12 modified + 5 new.** PHP + TS + dist;
**BUMP-LIBS 1.0.30 → 1.0.31.** Arun walk **3/3 PASS** (WALK-CP-ADOPT-3.md) + **walk-catch #65** (appearance,
behaviour correct — see below). Tally **65**.

## What shipped
- **Slot descriptors (H3).** `SlotDescriptor` value object + `MosaicManifestBuilder` emits `slot_descriptors`
  (identity + child rules) per zone, source-agnostic (PHP hardcode / sidecar / core SDC). A required SDC slot
  maps to `min = 1`. `olivero:teaser.content` surfaces `required` (previously unread).
- **Child-rules model + H7.** `{allowed, preferred, min, max, defaults, empty_display}` read from slot metadata
  (tolerant) + a sidecar `slot_rules` overlay (rules only). **H7:** a rule keyed by a slot the descriptor does
  not declare is rejected + a warning logged (`logger.channel.mosaic`) — the descriptor is the truth.
- **Adapter enforcement.** The slot field carries Puck `allow` (non-allowed drop refused natively);
  `MosaicSlotZone` renders the drop-zone chrome — the "Accepts: …" hint, a **live** min/max banner (child count
  via a `[data-puck-component]` MutationObserver), and `empty_display`. `MosaicColumnsComponent.column_1` ships
  `min = 1` (ruled dynamic exception — the slot set is prop-driven) so a shipped component shows a real banner.
- **Filmed geometry.** `ledger-live/e2e-evidence/cp-adopt-3/` (4 frames + geometry.json): the live below-min
  banner + empty_display, a filled column with no banner (after-drop), non-overlapping zones.

## Gates at ship
Unit FULL 2762/2762; Kernel FULL 214/214; Vitest 552 pass / 1 pre-existing B-101; phpcs 0; phpstan L6 OK; tsc
clean (only pre-existing `dsdShadow`); byte-identical `14e6cb9c…` before==after; dist 1.0.31.

## Oracle-changes (accepted)
1. `Sprint61SmokeTest` — slots render via `React.createElement(MosaicSlotZone, …)` (was bare `SlotComp`).
2. `SlotDescriptorEmissionTest` — `column_1` now carries `min=1` + `empty_display` (the ruled exception).
3. `ManifestControllerTest` / `MosaicLayoutWidgetTest` — `MosaicManifestBuilder` +logger arg.

## Deferred (ledgered)
`defaults[]`-insertion-on-first-placement → the author-trust slice (see the deferred ruling in TODO.md).

## Evidence
reports/REPORT-CP-ADOPT-3.md (§P0 + §P1 PASS 1–3), reports/WALK-CP-ADOPT-3.md, ledger-live/SHIP-43-PLAN.md,
ledger-live/e2e-evidence/cp-adopt-3/. **CP-ADOPT-3 CLOSED.**
