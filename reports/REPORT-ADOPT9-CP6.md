# CP-ADOPT-9 CHECKPOINT-6 — apply the resolved knobs in the rail

**Date:** 2026-10-03 · **Branch:** `fix/finding-016-validator` (mosaic working tree — built + gated; not
AI-committed per commit-flow, handed to Arun). Parent ship #47 = `33cd40c`. **JS-only pass.**

CHECKPOINT-6 builds the **widget-kind** application (the biggest gap) and audits every knob end-to-end. The
investigation found most slot/preview knobs **already flow** (existing client consumption + the P2 overlay),
and surfaced two honest obstacles — a **capability-key mismatch** (a bug from CP-3/4) and two **component-
level gaps** (patterns-shown, rail-order). This pass advances the rail application; it does **not** close
every knob — the remaining ones are tabled below with their precise obstacle, so the accounting is honest.

## Built this pass
- `js/src/builder/shapeMap.ts` — `fieldTypeForWidget(widget)` maps a resolved widget override → the
  descriptor `type` (cke5→richtext, plain→textarea, media_picker→media, select→select, radios→radio,
  checkbox→checkbox, number→number, text→text).
- `js/src/builder/MosaicPuckAdapter.ts` — `descriptorToPuckField` re-dispatches on the widget override, so a
  field renders as the admin's chosen widget. No override → the computed type (byte-identical).
- `js/src/builder/__tests__/railApplication.test.ts` — **11 cells** (6 widget-kind + 2 hidden + 2 label +
  1 byte-identical).
- `mosaic.libraries.yml` — **BUMP-LIBS 1.0.81 → 1.0.82**; `js/dist/{builder,frontend-editor}.js` rebuilt
  (renderer untouched → owned shasums verbatim; FE dialog parity, same adapter).

## Knob coverage table (knob · applied in the rail · cell / obstacle)

| knob | applied | cell / obstacle |
|---|---|---|
| **widget kind** (cke5/plain/media_picker/select/radios/checkbox/number/text) | ✅ **yes** (CP-6) | Vitest railApplication ×6; entity→manifest: Kernel AuthoringResolverTest |
| **hidden** | ✅ yes (CP-5) | Vitest railApplication ×2 (prop_descriptors + field_types) |
| **label** | ✅ yes (CP-5) | Vitest railApplication ×2 |
| **slot: allowed children** → allow list | ✅ yes (already flows) | `MosaicPuckAdapter.ts:864` (slot_descriptors.allowed → `allow`) |
| **slot: repeater** child/min/max → repeater list | ✅ yes (already flows) | `MosaicPuckAdapter.ts:868` |
| **previews** on/off (SSR seed gate) | ✅ yes (already flows) | `MosaicPuckAdapter.ts:660` (preview_defaults) + previewDefaults.test |
| **required** | ⚠️ flows to the descriptor; the explicit rail marker is partial | entity→manifest: Kernel |
| **default value** | ❌ **gap** | `toConfig` seeds the SCHEMA default (`props[name].default`), not the override — a defaultProps follow-up |
| **slot: preferred** ("+ Add {Preferred}") | ⚠️ unverified in the rail | entity→manifest proven (Kernel); rail wiring unaudited |
| **slot: open cell** | ⚠️ unverified in the rail | entity→manifest proven (Kernel) |
| **capabilities → section gating** (bindable/breakpoint/stylable) | ❌ **key mismatch (bug)** | the form + resolver (CP-3/4) use `bindable`/`stylable`; the client gates on `capabilities.bind`/`.style` (native CP-ADOPT-5 keys, where `bind` is a LIST). Reconciling form↔resolver↔client is a PHP follow-up |
| **patterns shown** (palette filter) | ❌ **gap** | the palette does not read `patterns_shown` |
| **rail order** (row order) | ❌ **gap** | fields are not reordered by `rail_order` |
| **help text** | ❌ not natively applicable | Puck `PuckField` has no help/description slot — needs a custom field wrapper |

**Applied: 6** (widget-kind, hidden, label, slot-allowed, slot-repeater, previews). **Remaining: 8**, each
with a precise obstacle above — the biggest is the **capability-key mismatch**, which means the Manage-
authoring capability checkboxes do not yet drive the rail's section gating.

## Round-trip proof WITHOUT dev config writes
- **entity → manifest JSON** — Kernel `AuthoringResolverTest` (CHECKPOINT-3) asserts the resolver writes
  EVERY knob into the manifest JSON (widget/label/help/required/default/hidden/capabilities/slot-
  allowed/preferred/repeater/open_cell/previews/patterns_shown/rail_order). This link is fully green.
- **manifest JSON → rail** — Vitest `railApplication.test.ts` asserts the rail from that JSON for the
  applied knobs (widget-kind, hidden, label). The un-applied knobs have no manifest→rail cell yet (their
  obstacle is in the table).
- No form save or `drush updb` was run on dev (isolation law); the chain is proven JS-free + Vitest.

## Gate (FULL, in DDEV)

| Check | Result |
|---|---|
| TypeScript typecheck | clean |
| Vitest | **742 pass / 1 pre-existing** (B-101; +6 widget-kind) |
| PHPUnit **Unit** | **2832 / 0** (no PHP delta) |
| PHPUnit **Kernel** | **336 / 0** (no PHP delta — JS-only pass) |
| PHPUnit **Functional FULL** | **82 / 0** (859 assert, 2 skip; unchanged — no PHP delta) |
| dist | rebuilt, BUMP-LIBS **1.0.81 → 1.0.82** |
| Owned shasums | **VERBATIM** (REGION 14e6cb9c…3954 + STYLE b7756795…ca982 4354 10) |

## Honest status
The arc is **not fully closed**. The widget-kind knob lands and the slot/preview knobs are confirmed to
flow; the capability-key mismatch (a CP-3/4 bug), the default/patterns-shown/rail-order gaps, and the
help/preferred/open-cell items remain. Closing them is a bounded follow-up (one capability reconciliation +
three small client reads + a defaultProps tweak), recorded here per knob.
