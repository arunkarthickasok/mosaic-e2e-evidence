# SHIP #45 — CP-ADOPT-5 + riders: adopt-any-SDC style ownership + typed slot binding + honest panels (2026-09-21)

Commit **8209f1c** (parent 0bcc2ab = ship #44). **70 files.** Walk **PASS** (Arun).
Tracked tree clean == HEAD. byte-identical node/780 REGION `14e6cb9c…43e0dec` + STYLE
`b7756795…ca982 4354 10` held. libs **1.0.53**.

## What shipped
An adopted (external-library) component now owns its LOOK end-to-end and any slot — owned or
adopted — can be filled from a View. Pillar E capability rules make the panels honest (Data only
when a prop can bind; Breakpoint only when a prop is per-screen; empty sections simply absent). The
SO cascade keeps a library owning its typography inside its slots (bare children, the donut). H9
"Views-into-slots" gives a slot a typed binding: a View's rows become one child component per row,
mapped field-by-field, rendered on the canvas AND the page (bare inside an adopted slot). A new
`mosaic_plain_content` fills a foreign slot with copy that inherits the library's look. Owned
components stay byte-identical.

## Walk-catches closed (tally 81 at ship)
| # | Catch | Resolution |
|---|---|---|
| 73 | viewport switch wiped the canvas (adopted) | `BuilderApp.switchEditingTo` only rebuilds via `toPuck` when LEAVING a breakpoint edit-state; the default canvas keeps its adopted `_renderedHtml`. |
| 74 | empty panel sections shown | Style section conditional on `style_tokens`; `SpacingControl` breakpoint tabs only when breakpointable — an absent section is gone, not an empty box. |
| 75 | bind panel unusable | `MosaicSlotBindField` rebuilt: Data-binding form, Row-component select (Card default), field-map SELECTs of the View's fields (`/api/mosaic/views/fields`), auto-matched. |
| 76 | field map only offered "Title" | display chosen by human label; field map = SELECT of the display's fields; no-fields display → designed notice. |
| 77 | bound rows invisible | auto-commit name matches into `field_map` on fields load; `ViewsSlotBindingRowProvider` strips wrapper markup to clean text. |
| 78 | node-form Save crashed | `#element_validate` form-cache serialize → `DependencySerializationTrait::__wakeup` cannot write `readonly` promoted services; made the 8 widget services `protected`. Standing serialization cell. |
| 79 | slotted Tier-B child stuck on ⏳ | `tierBOptimistic.applyPreview` recurses into nested slot props so a Tier-B child inside a slot receives its SSR `_renderedHtml`. |
| 80 | bound adopted slot blank on canvas | bindings + basePath threaded through `buildAdoptedRenderer → MosaicAdoptedPreview → htmlToReactSlots`; a bound adopted slot renders `MosaicBoundSlot` BARE (SO-1). Server page render was already correct. |
| 81 | binding change flickered the frame / no live update | `_mosaic_slot_binding` excluded from the SSR authoring (no chrome re-fetch); `useA11yAudit` emits only on an actual violations change; `BuilderApp` reads violations via `violationsRef` so `puckOverrides` is referentially stable → the canvas is never remounted. Affected zone alone swaps; owned + adopted alike. |

## Fix map (source)
- `js/src/builder/MosaicPuckAdapter.ts` — Pillar E gating; H9 `_mosaic_slot_binding` field + bind
  group heading/help; `buildAdoptedRenderer(manifest, basePath)`; bound-column render.
- `js/src/builder/fields/{MosaicAdoptedPreview,htmlToReactSlots,MosaicSlotZone,MosaicSlotBindField,MosaicBoundSlot,SpacingControl}.tsx`
  — inline bound slot, bare rows + result line, field-map selects, "{slot} — bound to {View}".
- `js/src/builder/tierBOptimistic.ts` — nested-slot SSR write-back (WC#79) + `SSR_AUTHORING_EXCLUDE` (WC#81).
- `js/src/builder/useA11yAudit.ts` + `BuilderApp.tsx` — emit-on-change + stable puckOverrides (WC#81).
- `src/Sdc/{PropShape,PropDescriptor}.php` + `src/Service/{MosaicManifestBuilder,MosaicPropValidator,MosaicCapabilityAudit}.php`
  — capability descriptors, save-time validation.
- `src/Render/{SlotBindingRowProviderInterface,NullSlotBindingRowProvider,BoundSlotResult}.php` +
  `modules/mosaic_views/src/Render/ViewsSlotBindingRowProvider.php` + `src/Value/SlotBinding.php` — H9 server.
- `modules/mosaic_components/components/mosaic_plain_content/*` — SO-2 slot-only component.
- `src/Plugin/Field/FieldWidget/MosaicLayoutWidget.php` — WC#78 protected services.

## Gates at ship
Full Kernel+Unit **3017/0** · mosaic_views Kernel **62/0** · Unit Smoke **2112/0** · Vitest
**604/1-B101** · phpcs ship-surface clean · phpstan ship-surface = 3 MosaicRenderer drift ·
**byte-identical REGION `14e6cb9c` + STYLE `b7756795` before==after** · dist rebuilt, libs **1.0.53**.

## Proof of record
Headed Chrome (PROOF-CONDITIONS LAW), Arun's steps across 4 passes. Reports
`reports/REPORT-CP-ADOPT-5.md` (CHECKPOINTs 3–12), `reports/SHIP-45-PLAN.md` (70 files),
`reports/WALK-CP-ADOPT-5.md`; film `e2e-evidence/cp-adopt-5/` (WC#79/#80/#81 frames).

## WC#82 (Arun, NEW — deferred to ACT 2)
The optimistic refresh **flashes per keystroke with a visible purple bar**. Not a correctness bug
(WC#81's frame no longer remounts) — it is an INTERACTION-CHOREOGRAPHY defect. Deferred to
**ACT 2 interaction choreography** under the standing SMOOTHNESS LAW below. Walk tally **82**.

## LAWS + RULINGS recorded this ship
- **SMOOTHNESS LAW (standing — belongs in EVERY directive):** an optimistic refresh never flashes.
  Crossfade in; a stale preview is quietly DIMMED, never blanked or bar-flashed; no layout jump; ONE
  refresh after typing PAUSES, never per keystroke. (WC#82 is the first debt against this law.)
- **BREAKPOINT / CONTENT RULING (Arun):** there is **no content per breakpoint**, and no permission
  will be added for it. Layout / style / **visibility** per breakpoint STAY. The visibility panel
  gains the line **"Hidden content is still downloaded and indexed."** Per-breakpoint REORDER is a
  **1.1, labelled** feature — not 1.0.
- **Ship #46 carries the `.gitignore` lines** for `*.log`, `js/e2e.zip`, `js/esc-probe.config.ts`,
  `assets/` (the session cruft the ship-#45 plan enumerated as EXCLUDE).

## Open after #45
WC#82 (per-keystroke flash → ACT 2) · CP-ADOPT-6 (Pillars G updates + H graceful degradation, SO-7
global-styles flag, R5/R10 SSR attach-once, SO-2 "Plain content first" picker) → backend config audit
→ Wave D/F/G → ACT 2 (full 1.0 design, SMOOTHNESS LAW binding) → soak → tag 1.0.0.
