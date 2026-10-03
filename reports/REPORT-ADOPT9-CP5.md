# CP-ADOPT-9 CHECKPOINT-5 — the rail applies the resolved authoring overrides

**Date:** 2026-10-03 · **Branch:** `fix/finding-016-validator` (mosaic working tree — built + gated;
not AI-committed per commit-flow, handed to Arun). Parent ship #47 = `33cd40c`.

CHECKPOINT-5 closes the CP-ADOPT-9 loop: the override an admin saves in Manage authoring (CHECKPOINT-4)
now flows through the resolver overlay (CHECKPOINT-3) to the **builder rail** — for owned AND adopted.

## What shipped

The builder rail (and the FE edit dialog — same adapter) now **honors the resolved descriptor overrides**
the manifest carries:
- **hidden** — a field hidden in Manage authoring is **omitted from the rail**, via BOTH field-building
  paths: `fieldTypeFields` (the `field_types` sidecar) and `propsFieldsFromDescriptors` (the schema-derived
  prop descriptors), so it works for owned AND adopted. H5 forbids hiding a required prop, so the rail never
  loses a required field.
- **label** — the field renders with the admin's relabel (`descriptor.label`), both paths.
- **widget (scalar)** — the plain scalar shapes (number/text) follow the site shape-map (`scalarPuckType`,
  wired in CHECKPOINT-2).
- **no override → byte-identical** — a default descriptor carries no `hidden`/override keys, so the rail is
  unchanged until a field is overridden (proven by Vitest + both owned shasums).

### Files
- `js/src/builder/MosaicPuckAdapter.ts` — `fieldTypeFields` skips `hidden`; `propsFieldsFromDescriptors`
  skips `hidden`; label already flowed through both.
- `js/src/builder/__tests__/railApplication.test.ts` — 5 cells.
- `mosaic.libraries.yml` — **BUMP-LIBS 1.0.80 → 1.0.81** (builder + frontend_editor + fe_chrome).
- `js/dist/{builder,frontend-editor}.js` — rebuilt (`renderer.js` untouched → the FE render of node 780 is
  unchanged, both owned shasums verbatim).

## Vitest cells — railApplication.test.ts (5)
hidden omitted via prop_descriptors (owned/adopted schema path) · hidden omitted via field_types sidecar ·
label override honored (prop_descriptors) · label override honored (field_types) · no override is
byte-identical (field present + default label).

## The full chain is proven end-to-end (per link)
1. **Form saves overrides only** — CHECKPOINT-4 `ComponentAuthoringFormTest` (Functional): a relabel stores
   exactly one row; hiding a required field is refused + blocks Save.
2. **Entity → manifest overlay (H5)** — CHECKPOINT-3 `AuthoringResolverTest` (Kernel): the resolver overlays
   the rows onto `field_types`/`prop_descriptors`, capped by SDC limits; no/empty entity = byte-identical.
3. **Manifest → rail** — CHECKPOINT-5 `railApplication.test.ts` (Vitest): the rail omits a hidden field and
   honors a relabel.
4. **Live, no cache clear** — the widget attaches `config:mosaic.shape_map` + `mosaic_component_authoring_list`
   cache tags (CHECKPOINT-2/3), so a form save rebuilds the builder page with the new manifest.

## Gate (FULL, in DDEV)

| Check | Result |
|---|---|
| TypeScript typecheck | clean |
| Vitest | **736 pass / 1 pre-existing** (B-101; +5 railApplication) |
| PHPUnit **Unit** | **2832 / 0** (no PHP delta this pass; re-verified) |
| PHPUnit **Kernel** | **336 / 0** (no PHP delta — unchanged from CHECKPOINT-3/4; CHECKPOINT-5 is JS-only) |
| PHPUnit **Functional FULL** | **82 / 0** (859 assert, 2 skip; unchanged — no PHP delta) |
| dist | **rebuilt**, BUMP-LIBS **1.0.80 → 1.0.81** |
| Owned shasums | **VERBATIM** (REGION 14e6cb9c…3954 + STYLE b7756795…ca982 4354 10) |

## FILMS — deferred to Arun's walk (honest note)
The charter's films ("set Media widget → Save → rail shows it live") require **config writes** (the form
save) and a **JS-executing browser** against that site. The isolation law forbids dev config writes (form
saves on dev are Arun's walk), and a throwaway headed test environment with the built builder loaded is a
separate FunctionalJavascript harness (chromedriver) beyond this pass. The **correctness is proven by the
test chain above** (form → entity → manifest → rail, each link green). The visual walk is enabled by
`reports/WALK-CP-ADOPT-9.md`, which Arun runs on his environment (he can write config). This is the one
piece deferred; everything it would show is already asserted.

## Remaining rail-application polish (recorded)
The marquee knobs (hidden, label, widget-scalar) land this pass. The finer knobs — `help` text display
(Puck fields have no native help slot → needs a custom field wrapper), the capability section-gating
(bindable/breakpoint/stylable → which rail sections appear, via the ADOPT-5 `resolveFields` machinery),
the slot-rail overrides (allowed/preferred/repeater/open-cell), and previews/patterns/rail-order — are the
final polish. The server already resolves all of them into the manifest (CHECKPOINT-3); applying each in the
rail is additive.
