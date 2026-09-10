# SHIP #33 — F-084 SEARCH LANDED (part 1 of 2); carousel core deferred to its dedicated run

**Date:** 2026-09-09 · **Parent:** ship #32 `90a8f8f` · **Mosaic git: read-only (allowlist law) — NOT staged.**
Arun ruling this turn: "Land F-084 search green now." Carousel core (S2c) held for its coupled run
(spec: `ledger-live/SHIP-33-PLAN.md`) — activating v6 is all-or-nothing (partial = 33-test regression).

## What landed — F-084 (structured labelled search config)
`mosaic_live_search` shipped `endpoint`/`placeholder`/`min_chars` with **no field_types**, so the builder
fell through to schema-derived inputs. F-084 declares them as singular **labelled** `field_types`
(text/text/number, mirroring the Tabs contract) so the author gets persistent-labelled fields (F-060 law) —
no raw JSON-ish boxes. No schema-version bump, no stored-data reshape → **fully non-coupled, additive**.

## Exact change set (tracked in the mosaic repo — for Arun to commit)
1. `modules/mosaic_components/components/mosaic_live_search/mosaic_live_search.mosaic.yml`
   — `field_types: {endpoint: text 'Search endpoint', placeholder: text 'Placeholder text',
   min_chars: number 'Minimum characters' min 1 max 10}`.
2. `tests/src/Kernel/Controller/ManifestFieldTypesTest.php`
   — `testLiveSearchExposesLabelledFieldTypes()` (RED→GREEN, 9 assertions) + `liveSearchFromManifest()` helper.
3. `.gitignore` — pre-existing `AI/`→`AI` edit from the ledger relocation (already pending your commit).

**Add commands (mosaic repo, Arun runs):**
```
git add modules/mosaic_components/components/mosaic_live_search/mosaic_live_search.mosaic.yml
git add tests/src/Kernel/Controller/ManifestFieldTypesTest.php
git add .gitignore
```
Evidence-only, NOT tracked (gitignored, stays module-local per F-048): `js/e2e/journeys/ship33-search-journey.spec.ts`.
**No `js/src` touched → no dist rebuild / no version bump** (field_types come from the server manifest,
consumed by the existing built adapter — `MosaicPuckAdapter.fieldTypeFields`).

## Gates — ALL GREEN
| Gate | Result |
|---|---|
| RED→GREEN Kernel cell | RED (`null != 'text'`) → GREEN (9 assertions) |
| FULL Kernel | **173 / 173** (912 assertions) |
| FULL Unit | **2688 / 2688** (1 pre-existing warning: mosaic_registry L87) |
| Vitest | **482 pass / 1 fail** = pre-existing B-101 (boolean→radio, unrelated) |
| phpcs (changed test) | clean (0/0) |
| Live server proof | `drush` manifest → live_search field_types `endpoint,placeholder,min_chars`, label "Search endpoint" |
| Full-lifecycle journey (UAT-gate) | **GREEN** — open → select → labelled panel → edit endpoint → save → reload → server-JSON persistence → anon page render |

## Album (ledger-live/e2e-evidence/ship33-search/)
01-open-selected · 02-labelled-panel · 03-endpoint-edited · 04-saved · 05-reloaded-persisted · 07-page-render.
Screenshot 01/02 visually confirm the Puck panel "Page › Live Search" with the labelled **Search endpoint**
(`/search?q=`) + **Minimum characters** (`2`) fields.

## Noise verdict
Clean. Two intentional tracked source changes + one pre-existing `.gitignore`. The dormant
`V5ToV6Migration.php` + its test remain untracked by design (carousel HOLD). No stray/unintended edits.

## Remaining for ship #33 (carousel core — dedicated run)
S2b discriminator guard + S2c coupled render+author stack + activate v6 + 33-fixture oracle heal +
active-slide sync (witness-first) + S2f journeys/albums — per `SHIP-33-PLAN.md`. All-or-nothing green change.
