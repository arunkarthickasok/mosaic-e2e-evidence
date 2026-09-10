# SHIP #33 — BUILD PLAN + K0 FRESH-READ (carousel coupled landing + F-084 search)

**Status of the source tree: UNTOUCHED this turn — clean, V5→V6 dormant, `CURRENT_SCHEMA_VERSION = 5`.**
No source edited; nothing staged (mosaic git read-only per allowlist law). K0 done; the coupled
carousel core is specced (below) for its dedicated multi-checkpoint run; F-084 confirmed landable green.

## K0 — FRESH-READ (quoted before building)
- **Entry point** (ledger-live/TODO.md:11968): "S2b discriminator-pin guard → S2c coupled render+author
  stack … + 33-test v5→v6 fixture sweep + activate CURRENT_SCHEMA_VERSION=6 → S2d → S2e F-084 → S2f."
- **Coupling** (TODO.md:11912): "bumping CURRENT_SCHEMA_VERSION=6 broke 33 tests (23 err + 10 fail) …
  the migration MUST land WITH the full render+author stack (S2c) + a 33-test fixture sweep as ONE change."
- **Carousel stack (the coupling, witnessed live):**
  - `mosaic_carousel.twig`: `{% set slides = [props.slide_1|default(''), … props.slide_6] %}` — reads slide_1..6.
  - `mosaic_carousel.component.yml`: declares `slide_1 … slide_6` (string props, "Up to 6 slides").
  - `mosaic_carousel.mosaic.yml`: NO `field_types` block (level 2, requires_ssr_preview: true).
- **Pattern to mirror — `mosaic_tabs.mosaic.yml`:** `field_types: sets: {type: repeatable, min: 1,
  summary: heading, item_label: 'Tab', default_item: {heading, body, bodyFormat: basic_html},
  fields: {heading: {type: text}, body: {type: richtext, formats: [basic_html, full_html]}}}`.
- **F-084 witness — `mosaic_live_search`:** props `endpoint` (string, default `/search?q=`), `placeholder`
  (string, default `Search…`), `min_chars` (integer 1–10, default 2); NO field_types block.
- **Dormant confirmed:** `MosaicLayoutValue.php:32 CURRENT_SCHEMA_VERSION = 5`; services.yml:101 manager
  map ends at `4: v4_to_v5` (V5→V6 not wired). Machinery: `MosaicManifestBuilder::buildFieldTypeDescriptors`
  resolves ANY field_types entry (singular text/number/richtext OR repeatable) via the field-type plugins.

## THE TREE-INTEGRITY CONSTRAINT (why the carousel core is NOT a single-turn landing)
Activating V5→V6 + `CURRENT_SCHEMA_VERSION=6` migrates every stored carousel `slide_N → slides[]`. Until
the render+author stack reads `slides[]`, every carousel renders EMPTY, and 33 version-pinned tests fail
(23 err + 10 fail). This is **all-or-nothing**: a partial S2c leaves the tree in the known-broken state —
a regression from today's clean, dormant-but-verified state. Per the gates-green + no-superficial +
no-broken-tree laws, the carousel core must land as ONE complete, green change; it cannot be half-built
in a turn that can't also carry the full 33-fixture heal + active-slide sync + S2f journeys + all gates + dist.

## S2c CAROUSEL — coupled-diff spec (the dedicated run, execute as ONE green change)
1. `mosaic_carousel.mosaic.yml` — add `field_types: slides: {type: repeatable, min: 0, summary: caption,
   item_label: 'Slide', default_item: {image: '', caption: '', captionFormat: basic_html, link: ''},
   fields: {image: {type: media/*(bridge)}, caption: {type: richtext, formats: [basic_html, full_html]},
   link: {type: text}}}`. (*confirm a `media` MosaicFieldType exists or add one; today's plugins are
   text/number/richtext/repeatable — media may need a descriptor or reuse of the drupal_media prop_type.)
2. `mosaic_carousel.component.yml` — replace slide_1..6 with a `slides` array prop (keep BC read if needed).
3. `mosaic_carousel.twig` — iterate `props.slides` → per slide {image via media render, caption via
   check_markup(captionFormat), optional link wrap}; keep DSD + named slots + no-JS fallback + #30 gating.
4. `js/src/renderer/components/mosaic-carousel.ts` — consume `slides[]`.
5. `js/src/builder/MosaicPuckAdapter.ts` — `slides` repeatable → Puck array field; `getItemSummary`
   (caption text → fallback 'Slide N'); `defaultItemProps` from default_item; media-bridge + CKE5 caption path.
6. Active-slide sync — **WITNESS carousel canvas DOM live FIRST** (walk-47 law), then generalize
   `tabsPanelSync` (sibling-position index + elementsFromPoint overlay link) to carousel.
7. `mosaic.services.yml` — wire `5: '@mosaic.migration.v5_to_v6'` into the manager map.
8. `MosaicLayoutValue.php:32` — `CURRENT_SCHEMA_VERSION = 6`.
9. **33-fixture oracle heal** — one ledgered class: v5-asserting fixtures → v6; carousel Kernel component
   tests slide_N → slides[]; F-077/F-078 interplay cells (object containers, root-resolving, breakpoint
   trees, slots); V5ToV6MigrationTest idempotence on real-shape v5 fixtures RED→GREEN.
10. **S2b discriminator guard** lands here (RED-proven synthetic {type,props} violation → GREEN): slide
    rows serialize as plain field-value items, never component-instance {type,props}.
11. Gates: FULL Kernel + FULL Unit + Vitest + W18 + f066 + lock + sentinels + phpcs 0/0 + dist
    (vite builder-first FE-last, version bump). S2f: full derivation matrix × surfaces × breakpoint trees
    × templates (v6 round-trip rider on Stage-5 invariant) × geometry; full-lifecycle journeys BOTH
    surfaces (scratch entities, real pointers, fullPage frames) → albums ship33-carousel/ + INDEX.

## F-084 SEARCH — NON-COUPLED, GREEN-LANDABLE STANDALONE (K4/S2e)
Additive: add to `mosaic_live_search.mosaic.yml` a `field_types` block declaring the 3 existing props as
labelled singular fields — `endpoint: {type: text, label: 'Search endpoint'}`, `placeholder: {type: text,
label: 'Placeholder text'}`, `min_chars: {type: number, label: 'Minimum characters', min: 1, max: 10}`.
No schema bump, no stored-data reshape, no carousel-fixture coupling. Blast radius: manifest-shape smoke
(Sprint28) + SdcComponentPluginPropsTest + adapter Vitest — additive green assertions. RED→GREEN:
manifest now emits labelled field_types for live_search; author gets labelled inputs, no raw JSON-ish.
UAT: one full-lifecycle search-config journey + album ship33-search/. **This is the tree-safe increment
that can land green without the carousel coupling.**

## RECOMMENDED SEQUENCING
1. **Now / next turn:** land F-084 search green (code + RED→GREEN + FULL gates + dist + journey + album).
2. **Dedicated carousel run(s):** execute S2c as ONE green change per the spec above (the 33-heal is the
   heavy anchor; witness canvas DOM before the sync work).
Nothing here is a tail-of-sync kickoff; the carousel core gets the sustained run the ledger reserved for it.
