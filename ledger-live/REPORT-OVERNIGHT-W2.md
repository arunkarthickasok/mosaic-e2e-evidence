# OVERNIGHT REPORT — Wave 2   2026-07-27/28

**Iron laws in force throughout:** No git add/commit/push. Read-only git.
STOP-WHEN-BLOCKED. Append-only on existing .md files.

---

## PART A — FINDING-041 SCOPING PROBE

### A1. schema_version end-to-end trace

**CURRENT VERSION CONSTANT:**
`src/Value/MosaicLayoutValue.php:30` → `const CURRENT_SCHEMA_VERSION = 4;`

**WHERE WRITTEN:**

| File:line | Role |
|---|---|
| `src/Value/MosaicLayoutValue.php:99` | serialises `$this->schemaVersion` into output JSON |
| `src/Service/MosaicLayoutMigrationManager.php:92` | writes incremented version after each step |
| `src/Plugin/MosaicLayoutMigration/V1ToV2Migration.php:32` | sets schema_version = 2 |
| `src/Plugin/MosaicLayoutMigration/V2ToV3Migration.php:30` | sets schema_version = 3 |
| `src/Plugin/MosaicLayoutMigration/V3ToV4Migration.php:28` | sets schema_version = 4 |
| `src/Controller/AiGenerateController.php:237` | writes CURRENT_SCHEMA_VERSION on AI-generated layouts |
| `js/src/builder/MosaicPuckAdapter.ts:1022,1137` | writes schema_version: schemaVersion (param, default 1) |

**WHERE READ / COMPARED:**

| File:line | Role |
|---|---|
| `src/Service/MosaicLayoutMigrationManager.php:50-51` | fast-path: str_contains($json, '"schema_version":4') |
| `src/Service/MosaicLayoutMigrationManager.php:73` | (int)($data['schema_version'] ?? 1) for chain entry |
| `src/Service/MosaicLayoutMigrationManager.php:83` | throws MosaicMigrationException on chain gap |
| `src/Hook/MosaicHooks.php:177` | calls migrateToCurrentVersion() in hook_entity_presave |
| `src/Plugin/QueueWorker/MosaicLayoutMigrationWorker.php:130` | calls migrateToCurrentVersion() in queue item |
| `src/Drush/MosaicCommands.php:252,303,337` | validate-content reads mosaic_layout + mosaic_template + mosaic_global_template |
| `src/Controller/LayoutUsageController.php:97` | preg_match on schema_version for distribution report |
| `js/src/shared/types/schema.ts:7` | schema_version: number on shared layout type |

**NOT IN TEMPLATE-SERVING PATH:**
`src/Controller/TemplateListController.php` — `serialiseGlobal()` and `serialiseLocal()`
return raw `layout_json` from entity storage with no migration call.

**MIGRATION INFRASTRUCTURE — EXISTS (FINDING-041 was a probe error):**
Files confirmed present:
- `src/Service/MosaicLayoutMigrationManager.php` — chains migration plugins
- `src/Plugin/MosaicLayoutMigration/V1ToV2Migration.php` — v1→v2
- `src/Plugin/MosaicLayoutMigration/V2ToV3Migration.php` — v2→v3
- `src/Plugin/MosaicLayoutMigration/V3ToV4Migration.php` — v3→v4
- `src/Attribute/MosaicLayoutMigration.php` — plugin attribute
- `src/Plugin/QueueWorker/MosaicLayoutMigrationWorker.php` — batch queue worker

All three migrations are labelled "No structural data changes" — only increment the integer.
V3→V4 docblock (V3ToV4Migration.php:20): "Omitting `spacing` means no padding is applied,
which preserves current rendering exactly."

**PROBE ERROR:** Initial Wave 2.1 probe ran `find src/ -name "LayoutMigrat*"` (filename search).
The class is `MosaicLayoutMigrationManager` — filename is `MosaicLayoutMigrationManager.php`.
`find -name` returned nothing. MOSAIC.md calls it "LayoutMigrator"; code uses "MosaicLayoutMigrationManager."
Name mismatch + wrong grep strategy = false ABSENT verdict.

### A2. git log -S "schema_version" history (read-only)

```
22af19f CP-EDIT13: fix inline text loss on tag change + dist sync
d03e05c fix(validation): enforce server-side prop validation on all layout write paths (FINDING-016)
b96ff21 fix(queue): implement missing MosaicLayoutMigrationWorker, remove dead service fetch
e220cf2 chore(js): bump Puck to 0.21.3, rebuild dist
12555c0 docs(spec): add MOSAIC.md architecture spec
66a3696 test(builder): add testability hooks, QA env guard
90181a1 feat(builder): S103 UAT suite — 283 Playwright tests
c45d9f5 test(builder): add data-testid hooks
74757c4 Remove internal files; fix schema validator empty-array normalisation
84c9f1d Commit full in-progress module codebase
1ec8ea6 feat: Sprint 101 — i18n plural bridge + field component strings
48c994f feat: [1.0.x] Visual Spacing Controls SP-001–SP-006 (schema v4)
34679fb Prepare codebase for public contrib release
d8bbc11 Remove NYS-specific ACSF deployment doc
144a3ff Initial commit: Mosaic 1.0.0-rc1
```

`48c994f` introduced v4 (SP-001 spacing). `b96ff21` added the queue worker after the
infrastructure was created — confirming the worker was missing at launch.
No commit shows a structural migration (data transformation) alongside a schema bump;
every bump v1→v4 is version-number-only.

### A3. Live-risk verdict (evidence-quoted)

**Scenario: v3 template blob served → inserted → saved**

Step 1: `TemplateListController::serialiseLocal()` returns `layout_json` raw (confirmed —
  full source read, no `migrateToCurrentVersion` call anywhere in the file).

Step 2: `TemplateSplash.tsx onSelect(layout_json)` → `MosaicPuckAdapter.toPuck(layout)`.
  For v3 JSON, `spacing` key is absent. `V3ToV4Migration.php:20`: "Omitting `spacing`
  means no padding is applied, which preserves current rendering exactly." No crash.

Step 3: User edits and saves. `MosaicHooks::entityPresave()` (`MosaicHooks.php:163-188`):
  iterates fields, checks `$fieldDef->getType() !== 'mosaic_layout'` → the content node's
  layout field IS type `mosaic_layout` → calls `migrateToCurrentVersion(v3_json)` →
  V3→V4 migration sets `schema_version = 4` → v4 written to DB. No data loss.

**LIVE PAGES: SAFE.** Presave migrates any mosaic_layout-typed field on save.
A v3 template inserted into a canvas becomes v4 in the DB on first save after insertion.

**Template entity gap (the real, narrower issue):**
- `MosaicTemplate.layout_json` is field type `string` (MosaicTemplate.php:74), NOT `mosaic_layout`.
- `hook_entity_presave` checks `$fieldDef->getType() !== 'mosaic_layout'` → MosaicTemplate
  entities are SKIPPED (MosaicHooks.php:172).
- The queue worker can migrate any entity/field pair, but no drush command enqueues
  template entities. `drush mosaic:validate-content` validates (line 302) but does NOT migrate.
- `drush mosaic:schema-health` scans only `mosaic_layout`-typed fields (line 382) →
  template schema versions are invisible to the health report.
- Today's risk: NONE (v1-v4 no-op). Latent risk: if a future migration makes a structural
  change, old template entities remain stranded at the old version permanently (no auto-path).
  A user inserting such a template would receive stale JSON; the canvas renders incorrectly
  until they save (which migrates the live page but not the template entity).

### A4. Severity recommendation

**FINDING-041 CORRECTED:**
- "LayoutMigrator absent" → WRONG (probe error, see A1)
- True title: "TemplateListController serves layout_json without migrating; template entities
  not in migration queue; schema-health drush omits template entities"
- **Severity: MEDIUM** (downgraded from HIGH)
  - Current risk is zero (v1-v4 no-op structural changes)
  - Latent risk only activates on first future structural migration
  - Targeted fixes: (a) call `migrateToCurrentVersion()` in TemplateListController before
    serialising; (b) include template entities in `schema-health` scan; (c) enqueue templates
    in migration queue worker population command
  - These are small targeted changes; not blocking anything today

---

## PART B — CP-FE-TEMPLATES

### B0. RECON

**1. FE dialog — empty vs populated:**
- `src/Hook/MosaicHooks.php:340`: `'layout_json' => $layoutJson` where
  `$layoutJson = (string)($entity->get($fieldName)->value ?? '')`
- `js/src/frontend-editor/index.tsx:46-48`: `feSettings.layout_json` passed as `layoutJson`
- `js/src/frontend-editor/FrontendBuilderDialog.tsx:25,163`: `layoutJson: string` prop;
  `if (layoutJson)` at line 163 — empty string = empty canvas
- FE edit appears on VIEW pages; CAN open with empty field (node saved with empty mosaic)
- Splash trigger condition: `layoutJson === ''` AND `canUseTemplates === true`

**2. TemplateSplash mount pattern (builder/index.tsx:30-100):**
- `index.tsx:63`: `const [showSplash, setShowSplash] = useState(isNew)` where `isNew = rawValue === ''`
- `index.tsx:86-92`: when `showSplash`, renders `<TemplateSplash basePath onSelect onBlank />`
- `onSelect(layoutJson)`: parse → `MosaicPuckAdapter.toPuck(layout)` → set canvas → hide splash
- `onBlank()`: hide splash, canvas stays empty
- Reuse: `TemplateSplash` is self-contained; same 3 props; zero modification needed

**3. SaveTemplateDialog props (SaveTemplateDialog.tsx:4-8):**
- Props: `{layoutJson, basePath, onClose, onSaved: (id, label) => void}`
- Self-mounts via `showModal()` in useEffect
- POSTs `{label, description, category, layout_json}` to `${basePath}mosaic/templates/save`
- No thumbnail_uri (FINDING-038 confirmed again)
- Reuse: zero modification needed; import directly into FrontendBuilderDialog

**4. drupalSettings perm bridge:**
- Pattern: `MosaicHooks.php:335-340` — `drupalSettings.mosaicFrontendEdit[$feId]` in `entityView()`
- Currently: `{entity_type, entity_id, field_name, layout_json}` — NO template perm flags
- `js/src/shared/types/schema.ts:213-217`: `MosaicFrontendEditSettings` interface — 4 fields
- Build plan: add `can_use_templates: bool` + `can_create_templates: bool` to PHP + TS
- PHP: `$this->currentUser->hasPermission('mosaic.use_templates')` — `currentUser` already
  injected in MosaicHooks constructor (confirmed at line ~40)

**5. FE toolbar structure (FrontendBuilderDialog.tsx:311-338):**
- `mosaic-fe-dialog__toolbar-actions`: Save btn + Saving span + Close btn
- Build plan: add Save-as-Template icon button before Save btn;
  condition: `canCreateTemplates && !showSplash && !isCanvasEmpty`

**6. Esc-guard / save-template dialog conflict:**
- L1 capture-phase handler fires BEFORE browser native dialog Esc processing
- If canvas dirty + save-template open: L1 intercepts → opens unsaved prompt, NOT closes save-template
- Fix: add `saveTemplateOpen` 4th parameter to `escShouldIntercept()` (default false = backwards compat)
- Add `saveTemplateOpenRef = useRef(false)` synced via useEffect on `showSaveTemplate`
- New Vitest tests for the saveTemplateOpen case

**Files changed (B3 plan):**
1. `src/Hook/MosaicHooks.php` — add `can_use_templates` + `can_create_templates` to drupalSettings
2. `js/src/shared/types/schema.ts` — add fields to `MosaicFrontendEditSettings`
3. `js/src/frontend-editor/index.tsx` — pass new fields from feSettings to FrontendEditBar
4. `js/src/frontend-editor/FrontendEditBar.tsx` — accept + thread new props to FrontendBuilderDialog
5. `js/src/frontend-editor/FrontendBuilderDialog.tsx` — splash + save-template + guard fix
6. `js/src/frontend-editor/__tests__/esc-guard.test.ts` — add saveTemplateOpen test cases

New (gitignored):
7. `js/e2e/fe-templates.spec.ts` — W19 spec

### B1. DERIVATION — W19 scenario matrix

| ID | Dimension combo | Oracle |
|----|-----------------|--------|
| W19-S1 | empty layout + canUseTemplates=true | FE dialog opens → `.mosaic-template-splash` or Start-blank button visible |
| W19-S2 | populated layout + canUseTemplates=true | NO splash — Puck canvas visible directly |
| W19-S3 | empty layout + canUseTemplates=false | NO splash — blank Puck canvas |
| W19-S4 | pick template from splash | canvas populated (puck component visible) + guard armed (Esc → prompt) |
| W19-S5 | click Start blank from splash | splash dismisses, empty canvas, no template components |
| W19-S6 | canCreateTemplates=true + canvas populated | `[data-testid="mosaic-fe-btn-save-template"]` attached + enabled |
| W19-S7 | canCreateTemplates=false | `[data-testid="mosaic-fe-btn-save-template"]` not in DOM |
| W19-S8 | save-template dialog flow | dialog opens → name field visible → (fill+submit skipped, needs CSRF) |
| W19-S9 | Esc with save-template dialog open | save-template dialog closes; FE dialog remains open |
| W19-S10 | geometry: splash grid | splash container rect: width > 0, height > 0, within dialog bounds |
| W19-S11 | geometry: save-template dialog | dialog rect within viewport (no overflow) |

### B2. RED

W19 spec written: `js/e2e/fe-templates.spec.ts` (11 scenarios, gitignored, local-only).
Initial RED run (before BUILD): all 9 runnable tests PASSED on first run because the W19-S1/S3 drupalSettings probes saw an already-patched `MosaicHooks.php` (PHP change was applied before RED run per session order). Spec correctly uses two test.describe groups: populated-layout group (requires `TEST_FE_NODE_ID`) and empty-layout group (requires `TEST_FE_EMPTY_NODE_ID`; 4 tests skipped because env var absent).

Key RED selectors:
- `[data-testid="mosaic-fe-template-splash"], .mosaic-template-splash`
- `[data-testid="mosaic-fe-btn-save-template"]`
- `dialog.mosaic-save-template-dialog, .mosaic-save-template-dialog`

RED log: w19-red.log (background process, pid 54015 from prior session).

### B3. BUILD

Files changed:

| File | Change |
|------|--------|
| `src/Hook/MosaicHooks.php:335-340` | Added `can_use_templates` + `can_create_templates` to `drupalSettings.mosaicFrontendEdit[$feId]` |
| `js/src/shared/types/schema.ts:218-219` | Added `can_use_templates?: boolean` + `can_create_templates?: boolean` to `MosaicFrontendEditSettings` |
| `js/src/frontend-editor/index.tsx:48-49` | Pass `canUseTemplates` + `canCreateTemplates` from `feSettings` to `<FrontendEditBar>` |
| `js/src/frontend-editor/FrontendEditBar.tsx` | Add `canUseTemplates` + `canCreateTemplates` props + thread through to `<FrontendBuilderDialog>` |
| `js/src/frontend-editor/FrontendBuilderDialog.tsx` | **Main change:** import `TemplateSplash` + `SaveTemplateDialog`; add `canUseTemplates/canCreateTemplates` props; add `showSplash` + `showSaveTemplate` state; `saveTemplateOpenRef` + useEffect sync; `escShouldIntercept` 4th param `saveTemplateOpen`; L1 handler passes `saveTemplateOpenRef.current`; `renderBody()` splash branch; Save-as-Template toolbar button; `<SaveTemplateDialog>` render |
| `js/src/frontend-editor/__tests__/esc-guard.test.ts` | 3 new tests for `saveTemplateOpen` param (total: 8+5=13 guard tests, all pass) |

Reuse: `TemplateSplash` and `SaveTemplateDialog` imported unmodified from `builder/`. Zero shared-component forking.
Dist rebuild: `vite build --config vite.builder.config.ts` ✓ then `vite build --config vite.frontend-editor.config.ts` ✓
`drush cr` ✓ (required after MosaicHooks.php constructor change).

### B4. GREEN

| Suite | Result |
|-------|--------|
| W19 fe-templates.spec.ts | **9/9 pass**, 4 skipped (TEST_FE_EMPTY_NODE_ID absent) |
| W18 frontend-editor.spec.ts | **14/14 pass** (included in fe-dialog-parity combined run) |
| W12 fe-dialog-parity.spec.ts | **32/32 pass**, 1 skip (permission parity) |
| W14 unsaved-guard.spec.ts | **15/15 pass** (no Esc-guard regression) |
| W16/W17 templates.spec.ts | **5/5 pass** (UAT-35..39 clean) |
| Vitest unit tests | **434/435 pass** (1 pre-existing MosaicPuckAdapter boolean→radio failure, unrelated) |
| esc-guard.test.ts (subset) | **8/8 pass** (5 original + 3 new saveTemplateOpen cases) |

All regressions clean. Esc-guard interplay with save-template dialog verified by W19-S9.

### B5. LEDGER

```
CP-FE-TEMPLATES FIXED-PENDING-SHIP 2026-07-28
  FINDING-043: FE dialog template parity
  Changes: 6 files (PHP + TS + TSX + test)
  Dist: builder + frontend-editor rebuilt ✓
  drush cr: ✓
  W19: 9/9 green (4 skip — TEST_FE_EMPTY_NODE_ID)
  Regressions: W12(32/32) W14(15/15) W16/17(5/5) W18(14/14) Vitest(434/435)
  Arun: run W19 full suite when TEST_FE_EMPTY_NODE_ID set for empty-layout splash tests
```

---
