# CP-ADOPT-9 CHECKPOINT-7 — capability reconciliation + more knobs applied

**Date:** 2026-10-03 · **Branch:** `fix/finding-016-validator` (mosaic working tree — built + gated; not
AI-committed per commit-flow, handed to Arun). Parent ship #47 = `33cd40c`. **PHP + JS.**

CHECKPOINT-7 fixes the capability bug end-to-end and applies three more knobs (default, rail-order, open-
cell), bringing the rail to **10/14**. It does **not** reach 14/14 — the last four (required-marker, help,
slot-preferred, patterns-shown) each have a real obstacle (byte-identical conflict, no Puck slot, fill-UX,
or a separate palette change) and are tabled below so the accounting stays honest.

## The capability vocabulary chosen (one line)
**Native CP-ADOPT-5 shape** — `capabilities.bind` (a binding-source LIST, or `FALSE`), `capabilities.breakpoint`,
`capabilities.style`; the Manage-authoring Bindable/Breakpoint/Stylable checkboxes **restrict** (turn those
off), never fabricate a capability the shape does not have (H5). One vocabulary now runs form ↔ entity schema
↔ resolver ↔ manifest ↔ client gating.

## Built this pass
**PHP (capabilities reconciled):**
- `src/Sdc/MosaicAuthoringResolver.php` — writes the native shape: Bindable OFF → `capabilities.bind = FALSE`
  (the Data section drops), Breakpoint/Stylable OFF → their flags FALSE; ON leaves the native shape intact.
- `src/Form/MosaicComponentAuthoringForm.php` — capability checkboxes read the native shape (Bindable =
  `bind !== FALSE`), lock a capability the shape lacks, and store a `bind`/`breakpoint`/`style` toggle.
- `config/schema/mosaic.schema.yml` — row keys `bind`/`breakpoint`/`style`.
- `mosaic.install` `mosaic_update_10005()` — migrates any old `bindable`/`stylable` rows to the native keys
  (expect zero on dev). Idempotent.
- `tests/src/Kernel/Adopt/AuthoringResolverTest.php` — capability cell on the native shape + a new restrict cell.

**JS:**
- `MosaicPuckAdapter.ts` — `toConfig` seeds `defaultProps` from the resolved descriptor default (falling back
  to the schema default); `orderFields()` renders content fields in `rail_order` (empty → unchanged); an
  `open_cell` slot also allows `mosaic_plain_content`.
- `js/src/builder/__tests__/railApplication.test.ts` — **15 cells** (6 widget-kind + 2 hidden + 2 label +
  2 rail-order + 2 open-cell + 1 byte-identical).
- `mosaic.libraries.yml` — **BUMP-LIBS 1.0.82 → 1.0.83**; `js/dist/{builder,frontend-editor}.js` rebuilt
  (renderer untouched → owned shasums verbatim; FE dialog parity).

## Knob coverage table (knob · applied · cell / obstacle)

| knob | applied | cell / obstacle |
|---|---|---|
| widget kind | ✅ (CP-6) | Vitest railApplication ×6 |
| hidden | ✅ (CP-5) | Vitest ×2 |
| label | ✅ (CP-5) | Vitest ×2 |
| slot allowed children | ✅ (flows) | adapter:864 |
| slot repeater child/min/max | ✅ (flows) | adapter:868 |
| previews on/off | ✅ (flows) | adapter:660 + previewDefaults.test |
| **capabilities → section gating** | ✅ **FIXED (CP-7)** | Kernel AuthoringResolverTest (native bind/breakpoint/style, restrict cell) + client gating adapter:705 |
| **default value** | ✅ (CP-7) | toConfig defaultProps + Kernel (entity→manifest) |
| **rail order** | ✅ (CP-7) | Vitest railApplication ×2 |
| **slot open cell** | ✅ (CP-7) | Vitest railApplication ×2 |
| required marker | ❌ | an explicit marker would mark SCHEMA-required fields too → changes the owned rail baseline (breaks byte-identical); pending a design decision |
| help text | ❌ | Puck `PuckField` has no help/description slot — needs a custom field wrapper around EVERY widget (changes every field render) |
| slot preferred ("+ Add {Preferred}") | ❌ | the ADOPT-7R fill-UX quick-add; resolved into the manifest (Kernel), rail wiring unbuilt |
| patterns shown (palette filter) | ❌ | per-component palette filtering lives in PaletteCard/index.tsx + drupalSettings, not the adapter |

**Applied: 10/14.** Remaining 4, each with a precise obstacle above.

## Round-trip proof WITHOUT dev config writes
- **entity → manifest JSON** — Kernel `AuthoringResolverTest` asserts every knob in the manifest JSON
  (including the native capability restrict). Fully green.
- **manifest JSON → rail** — Vitest `railApplication.test.ts` (15) for the applied field-level knobs.
- No form save / `drush updb` on dev (isolation law).

## Gate (FULL, in DDEV)

| Check | Result |
|---|---|
| TypeScript typecheck | clean |
| Vitest | **746 pass / 1 pre-existing** (B-101; +4 rail-order/open-cell) |
| PHPUnit **Unit** | **2832 / 0** |
| PHPUnit **Kernel** | **337 / 0** (3 skip; +1 capability cell) |
| PHPUnit **Functional FULL** | **82 / 0** (859 assert, 2 skip) |
| dist | rebuilt, BUMP-LIBS **1.0.82 → 1.0.83** |
| Owned shasums | **VERBATIM** (REGION 14e6cb9c…3954 + STYLE b7756795…ca982 4354 10) |

## Honest status
The arc is **not fully closed** (10/14). The capability bug is fixed end-to-end — the single most important
item — and default/rail-order/open-cell land. The last four need: a design ruling (required marker vs
byte-identical), a custom field wrapper (help), fill-UX wiring (slot preferred), and a palette change
(patterns-shown). Each is recorded with its obstacle; none is a silent gap.
