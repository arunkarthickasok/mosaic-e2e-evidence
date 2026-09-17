# SHIP #41 PLAN — CP-ADOPT-1 (Adopt any SDC: discovery + grading + component libraries)

Accumulates on ship #40 (`d0fdb22`). Mosaic git READ-ONLY — this is the ceremony add block for Arun's human
commit. **27 files: 16 modified + 11 new** (CP-ADOPT-1R rider added `tests/src/Functional/Adopt/NodeTypeAllowlistTest.php`
[new] + WC#64 edits to `src/Hook/MosaicFormHooks.php` + `config/schema/mosaic.schema.yml`, both already in the
set). All trackable, 0 gitignored. PHP + YAML only → no dist rebuild, no BUMP-LIBS. `SdcComponentPlugin.php`
UNTOUCHED (not HELD, not in the set).

### CP-ADOPT-1R rider delta
- `src/Hook/MosaicFormHooks.php` — WC#64: `saveAllowedComponents` reads the flat `allowed_components` value path.
- `config/schema/mosaic.schema.yml` — WC#64: adds `node.type.*.third_party.mosaic` (allowed_components schema).
- `tests/src/Kernel/Adopt/ComponentLibraryGovernanceTest.php` — WC#63 real two-account cell.
- `tests/src/Functional/Adopt/NodeTypeAllowlistTest.php` [NEW] — WC#64 form round-trip (2/20).

## `git check-ignore -v` verdict — every file trackable (0 ignored)
Verified via `git status --porcelain | cut -c4- | git check-ignore -v` — all 26 return no ignore rule.

### New files (10)
```
src/Entity/MosaicComponentLibrary.php                 # ConfigEntityType (Pillar F / H8)
src/Form/MosaicComponentLibrariesForm.php             # admin page /component-libraries
src/Sdc/MosaicComponentAlias.php                      # H1 bare⇄provider:id
src/Sdc/MosaicComponentGrader.php                     # Pillar A readiness grader
src/Service/MosaicComponentGovernance.php             # enforcement gate
src/Service/MosaicComponentLibrarySync.php            # idempotent auto-create
tests/src/Kernel/Adopt/ComponentLibraryGovernanceTest.php   # 5/16
tests/src/Unit/Sdc/MosaicComponentAliasTest.php             # 8 cells
tests/src/Unit/Sdc/MosaicComponentGraderTest.php            # 7 cells
tests/src/Unit/Sdc/SdcComponentDiscoveryTest.php            # C2–C8, 8 cells
```

### Modified files (16)
```
src/Sdc/SdcComponentDiscovery.php          # H2 rebase on plugin.manager.sdc; gate deleted
src/Sdc/ComponentDefinition.php            # +grade/providerType/adoptPalette (+fromCoreDefinition/withGrade)
src/Plugin/MosaicComponentManager.php      # merge preserves the new discovery metadata
src/Controller/ManifestController.php       # +governance filter (adopt_palette + isAuthorable)
src/Plugin/Field/FieldWidget/MosaicLayoutWidget.php   # +governance + adopt_palette guard
src/Hook/MosaicFormHooks.php               # node-form filtered to authorable + libraries link
mosaic.services.yml                        # grader/sync/governance services; discovery args
mosaic.routing.yml                         # component_packages route → /component-libraries + form
mosaic.links.menu.yml                      # menu retitled "Component Libraries"
mosaic.install                             # hook_install + mosaic_update_10003 (auto-create + default_component_package unset)
config/install/mosaic.settings.yml         # default_component_package REMOVED
config/schema/mosaic.schema.yml            # +mosaic.component_library.*; default_component_package removed
tests/src/Unit/Controller/ManifestControllerTest.php  # oracle-change (+governance arg)
tests/src/Unit/Smoke/Sprint02SmokeTest.php # oracle-change (gate-removed flips)
tests/src/Unit/Smoke/Sprint30SmokeTest.php # oracle-change (route/menu)
tests/src/Unit/Smoke/Sprint80SmokeTest.php # oracle-change (isAuthorable)
```

## Config schema files
- `config/schema/mosaic.schema.yml` — adds `mosaic.component_library.*` (config_entity; FullyValidatable);
  removes the `default_component_package` string key.
- `config/install/mosaic.settings.yml` — removes `default_component_package: base`.

## Update hook
`mosaic_update_10003()` — idempotent auto-create of a `mosaic_component_library` per provider (via
`mosaic.component_library_sync`) + unset of the consumer-less `default_component_package`. Already run live on
dev (created 4 libraries). Existing sites run it via `drush updb`.

## EXCLUSIONS (never staged)
`js/e2e/journeys/cp-adopt-1.spec.ts` + `cpve3-*.spec.ts` (gitignored `js/e2e/`); `AI/` (symlink outside the
module); scratch dev content (`web/cpve3_content.php`, nodes 983–986, the 4 auto-created library entities are
config, exportable via `drush cex`); `assets/`, `js/*.log`, `js/e2e.zip`, `js/esc-probe.*`.

## Proposed commit message (single quotes)
```
git commit -m 'ship #41: CP-ADOPT-1 adopt any SDC - discovery rebased on core plugin.manager.sdc (the .mosaic.yml gate removed, sidecar optional), readiness grader (Ready/Attention/Blocked), bare-id alias for owned components, component library config entity with idempotent auto-create + governance (library on/off, per-component enabled/restricted entity-first), admin libraries page, palette guard keeping adopted components out of the author palette; olivero:teaser now admitted and graded; byte-identical existing render'
```

## Verify after `git add`
`git status --porcelain | grep -c '^[MA]'` → **26**.

## STOP — Arun eye-test (reports/WALK-CP-ADOPT-1.md), then the human commit. No ceremony without the walk.
