# REPORT — CP-ADOPT-4R PASS 3 (WC#69, Arun's 4th report) — 2026-09-19

MOSAIC git READ-ONLY. Baseline byte-identical `14e6cb9c…43e0dec` (3954). The PASS-2 CDP
"PROVEN" mark was WITHDRAWN by Arun (drop still failed under his hands). This pass found the
TRUE root cause and re-proved under the **PROOF-CONDITIONS LAW** (headed Chrome, fresh
in-session page, served==built, Arun's exact step order).

## STEP 0 — stale-delivery check: served == built (NOT stale)

- `js.preprocess = false` (raw file served, no aggregation).
- libs `1.0.42` → served at `?v=1.0.42` sha256 = built `js/dist/builder.js` sha256 =
  `040e9cc0…784e5e` (identical, 1258770 bytes). Arun's browser had the fresh bundle.
- **Verdict: not a stale-delivery bug.** Arun's 1.0.42 correctly carried the PASS-2 code
  (layout reset + min-empty-height cap) — which was NECESSARY but still missing the true fix.

## STEP 1 — reproduced Arun's exact sequence in HEADED Chrome

Headed Chrome (`channel: 'chrome'`, `headless:false`, slowMo), admin storageState, real CDP
input. Arun's sequence: `/node/add/page` → type title → **Start blank** (splash) → drag
Teaser from palette onto canvas → drag Heading from palette into Content.

**FAILURE REPRODUCED** (`ARUN-HEADED.json`): `landed:false`, content slot stayed empty. The
instrumented Puck logs named the mechanism:
```
dragOver targetType=component targetId=olivero:teaser-5b1121bd-… targetZone=root:default-zone
dragEnd  previewKeys=["root:default-zone"]
```
The drop resolved to the teaser COMPONENT → its parent `root:default-zone`, never the inner
content slot.

## STEP 2 — cause (file:line) + fix

**Cause.** The freshly-PLACED teaser's instance id is **`olivero:teaser-5b1121bd-…` — it
contains a colon.** Puck derives every node id from the component type
(`generateId = (type) => \`${type}-${uuidv4()}\``, `@puckeditor/core/dist/chunk-6XCJ3Y7O.mjs:46`)
and PARSES zone ids by splitting on ':' (`chunk-YXFTA2VL.mjs:5786`
`const [componentId, slotId] = zoneCompound.split(":")`, also :3737-3738, :4709, :6125). For
the zone id `olivero:teaser-<uuid>:content` that yields `componentId="olivero",
slotId="teaser-<uuid>"` — the slot never resolves. My PASS-1/2 "proofs" used the node-988
FIXTURE whose id was the hand-crafted colon-free `teaser-a4`, which HID the bug — a
test-coupling failure exactly as the PROOF-CONDITIONS LAW anticipates.

**Fix** (`js/src/builder/MosaicPuckAdapter.ts`): register adopted components under a
COLON-FREE Puck key and map back to the real SDC type for save. SDC ids are
`[a-z0-9_]+:[a-z0-9_]+` (no hyphens in either segment), so `:` ⇆ `--` round-trips
unambiguously; owned types (no colon) are identity-mapped.
- `toPuckType(type)` / `fromPuckType(type)` helpers.
- `toConfig`: `components[toPuckType(id)]` + category push under the puck key.
- `nodeToPuckItem` (toPuck): `type: toPuckType(node.type)`.
- `fromPuck`: `type: fromPuckType(item.type)` (the saved layout keeps the real
  `olivero:teaser`). The internal `id` stays the real type for owned-type branch checks +
  the SSR `component_id`, so `renderSingleComponent` is unaffected.

## PROOF — headed Chrome, Arun's exact sequence, PROOF-CONDITIONS LAW

Instrumented run (`DRAG-SAMPLE.json`): the content dropzone is now a collision CANDIDATE
(`cands=[…:content dropzone dt:true, component, root]`), `dragOver targetZone=…:content`,
`dragEnd previewKeys=[…:content]`, **`after=1`**. The reflow is visible + tolerated (content
zone `y:951,h:32 → y:923,h:68` on hover; the pointer stays within the grown zone).

Clean, un-instrumented, shipped build (`HEADED-PROOF.json`, 3 consecutive runs + 1 clean
verify):
- 3/3 `landed:true`, `before:0 → after:1`, **saved `slots.content = ["mosaic_heading-…"]`**,
  child type `mosaic_heading`; placed id colon-free `olivero--teaser-<uuid>`.
- `CLEAN landed=true` on the final un-instrumented build.
- **served == built for 1.0.43**: `d7429dc5…95e7875a` (served at `?v=1.0.43`) = built.

All four PROOF-CONDITIONS met: fresh in-session page ✓ · served==built (js.preprocess=false,
libs bumped) ✓ · real headed Chrome ✓ · Arun's exact step order ✓.

## Gates (FULL)

- **Full Kernel+Unit:** unchanged from PASS 2 (JS-only pass, no PHP touched) — see run log.
- **Vitest:** 561 passed / 1 failed — the 1 is pre-existing **B-101**
  (`MosaicPuckAdapter.test.ts:148` checkbox drift). +5 `MosaicPuckAdapterColonType` cells pass.
- **Byte-identical:** node/780 `14e6cb9c…43e0dec` (3954) — before==after (JS canvas-only).
- **Dist:** builder.js + frontend-editor.js rebuilt clean (un-instrumented); **BUMP-LIBS
  1.0.42 → 1.0.43**. served==built verified.

## Files changed this pass (MOSAIC, uncommitted — Arun commits)

- `js/src/builder/MosaicPuckAdapter.ts` — colon-free adopted type (toPuckType/fromPuckType +
  4 mapping points).
- `js/src/builder/__tests__/MosaicPuckAdapterColonType.test.ts` (new) — 5 cells.
- `js/dist/builder.js` + `frontend-editor.js` (rebuilt) · `mosaic.libraries.yml` (1.0.43).

## Honest status line

Root cause = the colon in a placed adopted component's instance id breaking Puck's `:`-based
zone parsing; the earlier fixture (colon-free `teaser-a4`) hid it. Fixed (colon-free Puck key)
and **re-proved under the PROOF-CONDITIONS LAW** — headed Chrome, fresh page, served==built,
Arun's step order, 3/3 land + persist. Ship #44 unblocked pending Arun's own walk.
