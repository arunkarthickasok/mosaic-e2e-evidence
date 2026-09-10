# SHIP #34 — CAROUSEL LANDING: Y2 WITNESS + green-sub-landing decomposition

**Y1 done:** ship #33 part 1 = `5f767d6` (==origin, clean; dormant V5ToV6 pair untracked). F-099 registered → Act 2. Ledger `f498557`.
**Mosaic git: read-only, nothing staged.** No source touched this run — tree stays green.

## Y2 WITNESS (file:line grounded)
- **Reference (tabs) is text+richtext only:** `mosaic_tabs.twig` renders each set body via a `processed_text`
  (check_markup) element, never `|raw`; `sets` is an `array` prop of `{heading:text, body:richtext, bodyFormat}`.
- **Carousel today:** `mosaic_carousel.twig` reads `props.slide_1..6` with `|raw`; component.yml declares
  `slide_1..6` strings; mosaic.yml has no field_types. (Quoted in SHIP-33-PLAN.md.)
- **THE KEYSTONE FINDING — the `image` slide sub-field is NET-NEW machinery:**
  - No `media` field type: `src/Plugin/MosaicFieldType/` = text/number/richtext/repeatable only.
  - `MosaicPuckAdapter.resolveSubFields` (adapter:1580–1624) handles ONLY `richtext` (BodyEditModal/CKE5)
    + plain types → a `media` sub-field falls to `{type:'media'}` which Puck has no renderer for.
  - The media picker `MosaicMediaField` is component-PROP-level (`drupal_media` prop_type + `_type` sentinel
    resolution), NOT a repeatable sub-field. Wiring it into an array row needs per-row fieldId + bridge + serialize.
  - SHIP-33-PLAN.md line 1 flagged exactly this. **This is not in the tabs redesign — it is additional.**
- **Discriminator (S2b) location:** `MosaicPuckAdapter.fromPuck` slot-detection (adapter:1173–1185) distinguishes
  a SLOT value (array of `{type, props:{id}}` component instances) from a field_types array (plain field-value
  objects). The S2b guard pins slide rows to the plain-field-value shape — and is RED until S2c exists (coupled).

## Why this is a MULTI-SESSION landing (not one-turn-green)
The coupled change is ~11 mutually-dependent pieces, ship-#31-comparable (55 files) PLUS the net-new media
subsystem: (1) media-repeatable-sub-field type — plugin + descriptor + adapter Puck field + serialize + render;
(2) caption richtext via check_markup (eliminate `|raw`, XSS cells) + (3) link; (4) twig + (5) component.yml +
(6) Lit `mosaic-carousel.ts`; (7) S2b discriminator guard; (8) active-slide sync (tabsPanelSync generalization,
live-DOM-witness-first); (9) activate V5→V6 + `CURRENT_SCHEMA_VERSION=6` + heal the **33 version-pinned fixtures**
as one oracle class + migration idempotence RED→GREEN + R-C8 carousel render test; (10) dist rebuild (vite
builder+FE, version bump); (11) full-lifecycle journeys BOTH surfaces + derivation matrix + album. Activating v6
before (1)–(8) land renders every carousel empty and turns 33 tests red — all-or-nothing, so a partial turn = a
broken tree or superficial half-wiring. Both are barred by the gates-green + no-superficial + no-broken-tree laws.

## RECOMMENDED green-sub-landing sequence (each lands green + tested; tree never broken)
- **L-A — media-repeatable-sub-field type (the reusable keystone).** New `MediaFieldType` plugin (builder_type
  'media') + `resolveSubFields` media case rendering `MosaicMediaField` per array row (per-row fieldId + bridge)
  + serialize + a generic render resolver for a media-id sub-field. Green + tested (Kernel manifest + Vitest
  adapter) with NO carousel wiring yet — like S2a's dormant migration. De-risks the whole landing.
- **L-B — slides render+author stack composed on L-A**, backward-compatible with `slide_N` (fallback keeps v5
  green): twig (image via L-A resolver, caption `processed_text`, link, DSD, #30 placeholder, autoescape per
  F-100 law) + component.yml `slides` array + Lit consume slides + sidecar field_types + getItemSummary/
  defaultItemProps + S2b guard now GREEN.
- **L-C — active-slide sync** (witness carousel canvas DOM live first, walk-47 law).
- **L-D — the atomic flip:** activate V5→V6 + `CURRENT_SCHEMA_VERSION=6` + heal the 33 fixtures as one oracle
  class + idempotence RED→GREEN + R-C8. (Only now do v5 carousels migrate; L-B already renders slides[].)
- **L-E — dist + both-surface journeys + derivation matrix + album ship34-carousel/ + SHIP-34.md + all gates.**

Each of L-A…L-E is a bounded run that ends green and pushable. L-A is the right start (net-new, reusable, testable
in isolation). This sequences the exact plan Arun ratified — it just executes it as green checkpoints instead of
one un-shippable turn.
