# SHIP #33 BUILD — progress report (carousel + search, migration-bearing wave)

Parent: ship #32 = `90a8f8f` (== origin). Read-only git, nothing staged. All laws active.

## STATUS SUMMARY (honest)
| Item | State |
|------|-------|
| **S1 sync** | ✅ ship #32 recorded (90a8f8f); SHIP-32-FINAL pushed (7734a03); TODO record; tally 48 |
| **S2a V5→V6 migration** | ✅ BUILT + TESTED (7 cells, phpcs 0/0) — kept **DORMANT** (see coupling) |
| **S2b discriminator pin** | ⏸ not started |
| **S2c sidecar + render/adapter stack** | ⏸ not started — the coupled core |
| **S2d active-slide sync** | ⏸ not started |
| **S2e F-084 search** | ⏸ WITNESSED (props quoted); build not started |
| **S2f derivation/journeys/closeout** | ⏸ not started |

## S1 — SYNC. Done.
Ship #32 shipped as `90a8f8f` (== origin, clean). `reports/SHIP-32-FINAL.md` pushed (7734a03).
TODO SHIP-32 record: F-094 closed, Preview-toggle removed, Stage 5 locked. Walk tally 48
(open #25/F-072, #29/F-081).

## S2a — V5→V6 CAROUSEL MIGRATION. Built + tested; DORMANT.
- `src/Plugin/MosaicLayoutMigration/V5ToV6Migration.php` mirrors the ratified V4ToV5 chain-step
  pattern: every `mosaic_carousel` node's legacy `slide_1..N` richtext props → a `slides` list of
  `{image, caption, captionFormat, link}` — the witnessed `slide_N` HTML preserved verbatim as
  `caption` (reusing the CKE5 richtext field), `image` (media via the bridge) + `link` additive/empty;
  config `loop`/`auto_advance`/`interval` preserved; runs top-level + every breakpoint_states tree;
  idempotent; non-carousel nodes version-bump only.
- `V5ToV6MigrationTest` (7 cells / 21 assertions, phpcs 0/0): real-shape (node 330) → slides;
  zero slides; empty/gapped dropped; idempotence; breakpoint_states; non-carousel no-op; slot-child
  carousel (F-077/078 containers + root intact). GREEN.

## COUPLING (why the version bump is NOT active yet) — the load-bearing finding
`CURRENT_SCHEMA_VERSION` was bumped to 6 and the full suite run to witness the blast radius:
**23 errors + 10 failures (33 tests)**. Cause (confirmed by source witness):
- `mosaic_carousel.twig` reads `props.slide_1..6` directly (`{% set slides = [props.slide_1, …] %}`);
- `mosaic_carousel.component.yml` declares `slide_1..6`;
- `js/src/renderer/components/mosaic-carousel.ts` + the adapter consume the legacy shape;
- plus v5-asserting fixtures across the suite.
So migrating `slide_N` → `slides` while the render+author stack still reads `slide_N` renders every
carousel EMPTY. **The version bump MUST land together with S2c** (Twig + component.yml + renderer +
adapter + sidecar all reading `slides`) AND a v5→v6 fixture sweep of the 33 affected tests — as ONE
coherent change. Bumping alone is incoherent, so `CURRENT_SCHEMA_VERSION` was **reverted to 5**; the
migration plugin + test remain as verified DORMANT infrastructure. At v5 the suite is green (carousel
Kernel Component tests + the migration test pass).

## S2e — F-084 SEARCH witness (build not started)
`mosaic_live_search.component.yml` props: `endpoint` (string, "Search endpoint", default `/search?q=`),
`placeholder` (string, default `Search…`), `min_chars` (integer, 1–10, default 2). No `field_types`
block (Tabs has one). F-084 = declare these as structured labelled `field_types` mirroring Tabs.

## REMAINING (the coupled carousel-authoring build) — honest scope
S2b (discriminator-pin guard, RED-proven) + S2c (Twig + component.yml + renderer + adapter + sidecar
for `slides`: image via bridge, richtext caption, link; getItemSummary; defaultItemProps; DSD + #30
placeholder) + the **33-test v5→v6 fixture sweep** + activate `CURRENT_SCHEMA_VERSION = 6` + S2d
(active-slide sync — witness carousel canvas DOM first) + S2e build + S2f (derivation × surfaces ×
breakpoints × templates × geometry + journeys both surfaces + albums). This is the scale of the entire
Tabs Stage 3/4 redesign (its own ship). It is NOT completed here: per the no-superficial-work +
stop-when-blocked laws, the migration foundation + full coupling map + witnesses are recorded so it
can be built coherently as one landing, rather than shipped half-activated.
