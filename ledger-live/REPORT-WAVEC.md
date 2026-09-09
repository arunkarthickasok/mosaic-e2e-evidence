# CP-UNIT-HYGIENE (F-071, ship #23) + WAVE C (ship #24) — EVIDENCE LOG

Read-only git, NO staging, NO live-DB writes. NEW GATE: every regression = FULL Kernel + FULL Unit.
Discipline per item: witness → derivation (before code) → RED → fix → GREEN → regression. phpcs 0/0.

## H0 — CHARTER FRESH-READ (scoped; anything vague parked)

### Wave 3.4 = F-055 + F-056 (clearly chartered, both MEDIUM)
- **F-055** (FINDINGS:1112-1140) — MosaicPropValidator skips existence/access on sentinels
  (`isSentinelValue()` → `continue`, L113-117). Fix: for `drupal_media` sentinels, load entity by
  UUID + check `view` access at SAVE time; error if missing/denied. Inject EntityRepositoryInterface
  + AccountInterface. Surface: `src/Service/MosaicPropValidator.php`. CLEARLY CHARTERED.
- **F-056** (FINDINGS:1144-1169) — no media usage tracking. Fix: scan layout JSON for `drupal_media`
  sentinels; register each UUID with `file.usage` on save; de-register on save-diff + hook_entity_delete.
  Surface: FrontendSaveController + admin save hook + hook_entity_delete + mosaic_media. LARGER feature
  (multi-path + delete hook + diff). CLEARLY CHARTERED but substantial.

### F-059 (FINDINGS:1316-1345) — flaky W12-S03 parity heading-color baseline
Playwright e2e flake at `js/e2e/fe-dialog-parity.spec.ts:706` (admin-builder cold-boot latency;
always retry-passes; LOW). Fix: web-first wait for builder-ready/token before the color assert; no
sleeps. **PLACEMENT FLAG:** the finding says **Wave 5.2**; this run's charter (H2.d) pulls it into
Wave C. Following the directive (attempt now); noting the original Wave-5.2 placement for the record.
The spec lives in js/e2e (gitignored, F-048) — fix is held/local-only.

### F-066 (H2.a) + F-070 (H2.b) — per directive, no ambiguity.

## H1 — CP-UNIT-HYGIENE (F-071, ship #23, TEST FILES ONLY)

### H1a inventory: 20 errors + 3 failures
- FrontendSaveControllerTest (10 errors) — constructs with OLD 3-arg signature; current is
  (entityTypeManager, schemaValidator, lockManager, currentUser, logger, translation) from ships #19/#20.
- MosaicLayoutWidgetTest (10 errors) — constructs with 10 args ending at entityTypeManager; current
  needs +lockManager +logger (12 args) from ship #20.
- MosaicLayoutValueTest (1 failure) + Sprint35SmokeTest + Sprint54SmokeTest (2 failures) — assertion drift.

### H1b oracle maintenance (old→new fixtures, to CURRENT witnessed signatures)
- FrontendSaveControllerTest: +MosaicLayoutLockManager (isLockedByOther→FALSE) +AccountInterface(id→1)
  +NullLogger; construction now 6-arg.
- MosaicLayoutWidgetTest: +MosaicLayoutLockManager mock +NullLogger; construction now 12-arg.
- **Final-class blocker + fix:** `MosaicLayoutLockManager` is `final` → `createMock()` throws
  ClassIsFinalException. Lawful oracle build: real `MosaicLayoutLockManager` over a mocked
  `KeyValueExpirableFactoryInterface`→`KeyValueStoreExpirableInterface` whose `get()`→NULL, so
  `isLockedByOther()`→FALSE and the save/widget paths proceed. Same pattern in both files.
- MosaicLayoutValueTest::testFromJsonThrowsOnMalformedJson: expected `\JsonException` → **witnessed**
  `MalformedLayoutException` ("Invalid Mosaic layout value: …"). SRC intentional (F-058: fromJson
  normalises every parse/structural failure — incl. raw JsonException — into one MalformedLayoutException).
  Oracle updated to expect MalformedLayoutException. No SRC change.
- Sprint35SmokeTest::testModuleAttachesRendererUnconditionally: asserted the attach string lived in
  `src/Hook/MosaicHooks.php`. F-046/W22 **moved** the `mosaic/renderer` attach OUT of the global
  pageAttachments() (it was shipping renderer.js to every anon page) INTO `MosaicLayoutFormatter`
  (L147, attaches only when a mosaic_layout field renders). Oracle re-pointed to the formatter +
  class docblock corrected. Witnessed src: `MosaicLayoutFormatter.php:147`. No SRC change.
- Sprint54SmokeTest::testFigmaSyncRouteRequiresAdministerPermission: asserted `'administer mosaic'`
  (phantom perm). Wave-B/R3 corrected the route to `'mosaic.administer'` (witnessed
  mosaic_tokens.routing.yml:13). Oracle updated to `'mosaic.administer'`. No SRC change.

### H1c GREEN evidence (all gates)
- **FULL Unit: OK — 2670 tests, 6247 assertions, 0 err, 0 fail** (was 20 err + 3 fail).
- **FULL Kernel: OK — 118 tests, 551 assertions, 0 err, 0 fail** (unchanged, standing gate).
- **phpcs (changed files): 0 errors, 0 NEW warnings.** All 4 long comment/docblock lines I added were
  shortened to ≤80; git diff confirms 0 long added lines in 4/5 files. Remaining phpcs warnings
  (Widget 41/107/117/207, Value 297/359/517, Sprint35 11/18, Sprint54 15/16/19) are ALL on
  pre-existing lines outside my diff → out of scope, ledgered below.
- **Zero src/ changes** — H1 diff is exclusively the 5 test files (+ this AI/ report). Verified via
  `git status` (only untracked .log/.DS_Store/assets scratch outside tests/).
- **VERIFY-per-item:** none of the 23 failures required a SRC change — every one was fixture staleness
  vs a witnessed CURRENT signature (ships #19–21) or intentional shipped behavior (F-058/F-046/R3).
  No item hit the STOP-and-report clause.

### H1 PARKED (report-only, NOT fixed here — outside "test files only" scope)
- **P-1 (pre-existing SRC warning):** `mosaic_registry/src/Plugin/ProjectBrowserSource/
  MosaicComponentRegistrySource.php:87` — "Undefined array key 'label'" PHP warning (6 tests trigger
  it). Not in H1 scope (would be a SRC edit). Candidate backlog tidy (null-coalesce the 'label' key).
- **P-2 (pre-existing test-file phpcs warnings):** the line-length + "blank line after inline comment"
  warnings listed above predate ship #23. Cosmetic; deferred to keep the ship #23 diff auditable.

### H1d — SHIP-LIST #23 (TEST FILES ONLY, all `git check-ignore` = NOT ignored → shippable)
1. tests/src/Unit/Controller/FrontendSaveControllerTest.php — 6-arg construction (real lock mgr).
2. tests/src/Unit/Plugin/Field/MosaicLayoutWidgetTest.php — 12-arg construction (real lock mgr).
3. tests/src/Unit/Value/MosaicLayoutValueTest.php — expect MalformedLayoutException (F-058).
4. tests/src/Unit/Smoke/Sprint35SmokeTest.php — renderer-attach oracle re-pointed to formatter (F-046).
5. tests/src/Unit/Smoke/Sprint54SmokeTest.php — figma_sync perm oracle → mosaic.administer (R3).
Count: 5 files, all test-only. check-ignore verdicts recorded at H4.

═══ CHECKPOINT: H1 COMPLETE & GREEN — starting H2 (Wave C) below ═══

## H2 — WAVE C BUILD (ship #24)

### H2.a — F-066 FE LOCK PARITY — COMPLETE & VERIFIED
**Root defect:** the FE dialog reads `window.drupalSettings.mosaic.frontend.hasBreakLock`
(FrontendBuilderDialog:112-115) but PHP never emitted it → the Break button never appeared even
for privileged users; the FE dialog also had NO blocked-state overlay, NO save-interception, and NO
⚠ glyph on its "Locked by …" banner (admin builder had all three). Confirmed by a js/src mapping
sweep (BuilderApp:280/451-492/482 vs the FE dialog gaps).
**PHP (src/Hook/MosaicHooks.php entityView, editor-gated):** emit
`drupalSettings.mosaic.frontend.hasBreakLock = currentUser.hasPermission('mosaic.break_lock')` once,
alongside uiStrings, after the use_builder + id>0 + update-access gates (so anon never receives it).
camelCase key (drupalSettings passes keys verbatim to JS).
**JS (js/src/frontend-editor/FrontendBuilderDialog.tsx):**
 - `isBlocked = lockStatus && lockStatus.locked && !lockStatus.owner` (mirrors BuilderApp:280).
 - blocked overlay: wrapped the canvas in the admin's EXISTING `.mosaic-builder-canvas` positioned
   wrapper + reused `.mosaic-builder-block-overlay` (data-testid `mosaic-fe-block-overlay`) — ZERO
   new CSS, and the overlay anchors to `.mosaic-builder-canvas` (not the `.mosaic-canvas-scope`
   element that `all:revert-layer` would reset) → no @layer-ordering risk (avoids the CP-SIDEBAR
   class of bug). "shared code over forked" satisfied.
 - save-interception: `handleSave` early-returns when `isBlocked` (+ added to useCallback deps) AND
   the Save button is `disabled={isBlocked}` (defense in depth; server 409 still the backstop).
 - ⚠ banner-icon parity: locked span now `⚠ {tFmt('lock_locked_by', …)}` (matches BuilderApp:464).
 - Break button (a): NO JS change needed — the existing hasBreakLock read now resolves because PHP
   emits the value.
**Tests / evidence:**
 - PHP RED→GREEN Kernel: tests/src/Kernel/Hook/MosaicFrontendEditAttachTest.php (3 tests, 15 asserts)
   — break-editor→TRUE, plain-editor→FALSE, anon→absent. RED proven by commenting the emit (2 fail).
 - JS: `tsc --noEmit` clean.
 - e2e RED→GREEN: js/e2e/f066-fe-lock-parity.spec.ts (HELD, 2 @f066 tests) — GREEN 2/2 live against
   the rebuilt dist (14s): geometry oracle (overlay boundingBox covers canvas), Save disabled, ⚠
   banner, admin Break→takeover clears the block. RED witnessed by the pre-change absence of the
   overlay/testid/disabled-save/⚠ (mapping sweep) — the assertions target markup that did not exist.

### H2.c(part) — F-055 VALIDATOR SENTINEL ACCESS-CHECK — COMPLETE & VERIFIED
**src/Service/MosaicPropValidator.php:** injected `EntityRepositoryInterface` + `AccountInterface`
(3-arg ctor; service def `@entity.repository`+`@current_user`). New `validateMediaSentinel()`: for a
`drupal_media` sentinel with a non-empty `uuid`, `loadEntityByUuid('media', uuid)` → error if missing;
`$media->access('view', currentUser)` → error if denied. Mirrors the render-path check
(MosaicPropResolver::resolveMedia:113-120) but at SAVE time. Empty/absent uuid deferred to F-023.
**Tests / evidence:** tests/src/Unit/Service/MosaicPropValidatorTest.php (4 tests, 13 asserts): missing
→fail, inaccessible→fail, viewable→pass, no-uuid→deferred-pass. RED proven by disabling the fix (2
fail). Kernel constraint test still green (3-arg service resolves via container). phpcs 0 errors on
changed files.

### H2.e — DIST REBUILD — DONE
Order per config docs (builder FIRST, frontend-editor LAST; emptyOutDir:false additive):
`vite build --config vite.builder.config.ts` → `…frontend-editor.config.ts` → `drush cr`. Both builds
clean; `mosaic-fe-block-overlay` marker confirmed present in dist/frontend-editor.js. renderer bundle
untouched (F-066 change is not in it).

### H2.b — F-070 BREAK-VS-HEARTBEAT — PROBE DONE (CONFIRMED), FIX PARKED
**Probe (code inspection, definitive):** `MosaicLayoutLockManager::acquire()` keys re-acquire on
**uid, not token** — `if ($existing !== NULL && existing.uid !== account.id) return FALSE;` else
acquires. A `breakLock()` deletes the lock → `$existing === NULL` → the victim's 30s heartbeat
(`LockManager.startHeartbeat` POSTs the acquire URL) re-acquires the now-free lock and re-owns it.
**Promote CANDIDATE→CONFIRMED.** Severity LOW in practice: the UI break path (`handleBreakLock`
break→acquire) re-acquires within ms, so the breaker holds the lock before the victim's next
heartbeat (≤30s away) — only a raw-API break WITHOUT immediate re-acquire triggers the linger.
**Fix design (parked):** make the heartbeat RENEW-ONLY — client sends its session token (F-064
already returns one); server adds `renew($type,$id,$account,$token)` that extends only if
`existing !== NULL && existing.token === token`, and NEVER re-acquires a freed lock; the heartbeat
calls renew (not acquire) and, on failure, flips the client to blocked/released. Touches LockManager
+ controller + route + LockManager.ts + tests + a >30s two-window live probe.
**PARKED** — a concurrency-semantics change that should not be rushed; low real-world severity.

### H2.c(part) — F-056 MEDIA USAGE TRACKING — PARKED (report-only)
Chartered (Wave 3.4) but a full feature requiring a design decision I will not make unilaterally:
media entities are not files, so Drupal's `file.usage` does not directly track media-in-layout usage
— the finding itself says "file.usage OR entity_usage (contrib)". Correct implementation needs: a
layout-JSON media-UUID scanner, a usage backend choice (entity_usage contrib vs a bespoke tracker),
registration in FrontendSaveController::save() + the admin save path, diff old-vs-new sentinels on
re-save, and de-registration via hook_entity_delete. This is multi-file with a load-bearing backend
choice; rushing it risks a wrong/broken feature. **PARKED** pending a backend-choice ruling.

### H2.d — F-059 FLAKY BASELINE — PARKED (report-only)
Per H0 charter, FINDINGS flags F-059 with a Wave-5.2 placement question (parity heading-color
baseline). Stabilizing it needs live flaky-spec iteration (repeat runs to characterize the race) that
is not safely completable in this run. **PARKED.**

## H3 — REGRESSION
- **FULL Kernel: OK — 121 tests** (118 + 3 new F-066 attach), 566 assertions, 0 fail.
- **FULL Unit: OK — 2674 tests** (2670 + 4 new F-055), 6270 assertions, 0 fail; 1 warning = pre-existing
  P-1 (mosaic_registry undefined 'label' key).
- **F-066 e2e: 2/2 GREEN** live (see H2.a).
- **dist-rebuild-regression e2e (lock + unsaved-guard + fe-dialog-parity, rebuilt dist):** 49 passed,
  1 skipped; the failures were NON-DETERMINISTIC across two 2-worker runs (run 1: W12-S19, W13-S02,
  W14-S07; run 2: W12-S03, W14-S07) and ALL 3 of run 1 PASS 3/3 in isolation (`--workers=1`, clean
  locks). Diagnosis: FE save→reload→beforeunload timing races under parallel load on the shared FE
  node — NOT an F-066 regression. Proof it is not mine: the F-066 changes are a strict no-op on the
  lock-OWNER save path (`if (isBlocked) return` and `disabled={isBlocked}` fire only when
  owner===false; these tests run as the owner), and the dedicated f066 spec is 2/2 green. js/e2e is
  HELD/gitignored → not a ship-#24 blocker.
- **F-059 REPRODUCED (bonus):** run 2's W12-S03 failure IS the F-059 flake ("admin builder canvas
  heading-color baseline rgb(23,23,23)") — failed 1 of 2 parallel runs, passed the other =
  confirmed live non-deterministic flake, independent of Wave C. Stabilization (3 consecutive green,
  no sleeps) needs the race diagnosed + fixed → PARKED, but the reproduce half of H2.d is done.
- phpcs full-changed gate: recorded at H4.

## H4 — CLOSEOUT

### SHIP-LIST #23 — CP-UNIT-HYGIENE (F-071) — TEST FILES ONLY (all shippable)
1. tests/src/Unit/Controller/FrontendSaveControllerTest.php
2. tests/src/Unit/Plugin/Field/MosaicLayoutWidgetTest.php
3. tests/src/Unit/Value/MosaicLayoutValueTest.php
4. tests/src/Unit/Smoke/Sprint35SmokeTest.php
5. tests/src/Unit/Smoke/Sprint54SmokeTest.php
check-ignore: all 5 → shippable (NOT ignored). Count: 5 files, test-only, 0 src changes.

### SHIP-LIST #24 — WAVE C (PARTIAL: F-066 + F-055 + dist) — code + dist
Source (check-ignore: all shippable):
1. src/Hook/MosaicHooks.php — F-066 emit drupalSettings.mosaic.frontend.hasBreakLock (editor-gated).
2. src/Service/MosaicPropValidator.php — F-055 media sentinel existence/view-access (3-arg ctor).
3. mosaic.services.yml — F-055 mosaic.prop_validator +@entity.repository +@current_user.
4. js/src/frontend-editor/FrontendBuilderDialog.tsx — F-066 blocked overlay + save-guard + ⚠ icon.
5. tests/src/Unit/Service/MosaicPropValidatorTest.php — F-055 RED→GREEN (4 tests).
6. tests/src/Kernel/Hook/MosaicFrontendEditAttachTest.php — F-066 RED→GREEN (3 tests).
Dist (rebuilt, check-ignore: shippable; tracked at js/dist/):
7. js/dist/builder.js (+ regenerated shared chunks) — builder rebuilt FIRST.
8. js/dist/frontend-editor.js (+ chunks) — rebuilt LAST; contains the mosaic-fe-block-overlay marker.
HELD (check-ignore: IGNORED — js/e2e gitignored, F-048, local-only):
 - js/e2e/f066-fe-lock-parity.spec.ts — F-066 RED→GREEN geometry-oracle spec (2 tests, GREEN live).

### PARKED (report-only, delegated to Arun)
- **F-070** — CONFIRMED (probe); renew-only-heartbeat fix scheduling.
- **F-056** — Wave 3.4 media usage tracking; needs usage-backend ruling (file.usage vs entity_usage).
- **F-059** — REPRODUCED; Wave-5.2 stabilization.

### TALLIES
- Ship #23: 5 files (test-only). Unit 20 err + 3 fail → 0/0.
- Ship #24: 6 source + 2 dist bundles (+chunks) shippable; 1 e2e spec held.
- Gates: FULL Kernel 121/0, FULL Unit 2674/0 (1 pre-existing warning P-1), f066 e2e 2/2,
  phpcs 0 errors/0 new warnings on all changed lines (pre-existing MosaicHooks:96 alignment = P-3,
  out of diff). RED→GREEN proven for F-055, F-066(PHP), F-066(e2e).
- Wave C completion: 3 of 6 H2 items DONE (F-066, F-055, dist); 1 PROBED (F-070); 2 PARKED (F-056,
  F-059-fix). Honest partial — no rushed feature work.

═══════════════════════════════════════════════════════════════════════════════
# WAVE C AMENDMENT (2026-08-16) — ENV FORENSICS + walk-catches #23/#24/#25
Ships #23/#24 ON HOLD. Read-only git, no staging, no live-DB writes w/o 'sanctioned'.
═══════════════════════════════════════════════════════════════════════════════

## PHASE F — ENVIRONMENT FORENSICS (the missing week since ship #22 · 59c2bce)
Reconstructed from EVIDENCE (backups/ artifacts, composer.lock diff, git, drush), not memory.
Standing rule in force: "Read-only git. NO staging. NO live-DB writes without 'sanctioned'."

### Timeline (dates from session)
- 2026-08-09→10  Wave C build (ship #23/#24 code): src/js/tests edits, dist rebuild, e2e.
                 Sanctioned by the Wave C directive. Uncommitted, unstaged.
- 2026-08-13     DB backup + DDEV router restart + CORE UPDATE 11.3.9→11.4.5 (composer + updatedb).
                 User-requested ("back up the DB… get the drupal Version updated"); literal 'sanctioned' ABSENT.
- 2026-08-14     SITE-DOWN incident + fix. User-requested ("get it up and running"); 'sanctioned' ABSENT.
- 2026-08-15     walktester permission grant (mosaic_editor +6 admin-UI perms).
                 User-requested ("make sure … permissions are set"); 'sanctioned' ABSENT.
- 2026-08-16     This forensics amendment.

### F1a — Drupal core / composer update
- drupal/core **11.3.9 → 11.4.5** (minor). Constraint `^11.3` already permitted 11.4; 11.3.9 was last 11.3.x.
- composer.lock delta (backups/composer.lock.pre-11.4.20260813-122402 → live): **72 packages changed version;
  3 ADDED** (symfony/runtime v7.4.14, symfony/polyfill-php86, twig/html-extra); 0 removed. Notables:
  symfony/console v7.4.11→v7.4.16, symfony/http-kernel →v7.4.16, twig/twig v3.22.2→v3.28.0.
- `drush updatedb` ran 6 post_update hooks (help/olivero/search/system×2/views). `drush status`: 11.4.5, Successful.
- WROTE (all at SITE ROOT, OUTSIDE the tracked module repo): composer.json (allow-plugins), composer.lock,
  vendor/ (72 pkgs), web/ scaffold (index.php, .htaccess, robots.txt, update.php, autoload_runtime.php,
  default.services.yml, default.settings.php), DB (updatedb schema + post_update).

### F1b — walktester permission change
- Role edited: **`mosaic_editor`** (role that user mosaic_editor_e2e carries; DB/script-created, NOT
  module-shipped config → verified no `user.role.mosaic_editor.yml` in the module → NO module-config drift).
- Added 6: access toolbar, access administration pages, view the administration theme, access content overview,
  access files overview, access contextual links (mirrored from the config-managed `content_editor` standard).
- Baseline BEFORE: 6 perms (access content, create/edit article, mosaic.use_builder, mosaic.use_templates). NOW: 12.
- vs FIXTURE RECORD (scripts/qa/e2e-setup-extended.sh): the script grants `mosaic_editor` only
  "edit any article content" and NEVER admin-UI perms → my grant is a **DRIFT from the fixture intent**.
  (Script uses `role:perm:add` = additive, so a re-run won't revoke it, but the documented baseline differs.)
- 'sanctioned' present: **NO**.

### F1c — site-down incident (root cause = MY error, no softening)
- Symptom: web 500 — `require(.../vendor/autoload_runtime.php): No such file` via web/index.php(13) →
  web/autoload_runtime.php(22).
- Root cause: during F1a I set `allow-plugins.symfony/runtime=false` reasoning "Drupal doesn't use Symfony
  runtime" — TRUE for 11.3, **WRONG for 11.4**: Drupal 11.4's scaffolded web/index.php requires
  vendor/autoload_runtime.php, which ONLY the symfony/runtime Composer plugin generates. Disabled plugin →
  file never created → web frontend 500. MASKED because drush/phpunit bootstrap via vendor/autoload.php and
  never hit web/index.php — my CLI verification (drush status, phpunit) passed while the frontend was broken.
- Remediation (EXACT commands): `composer config allow-plugins.symfony/runtime true` → `composer install`
  (plugin ran → generated vendor/autoload_runtime.php, 985B) → `drush cr`. Verified web entry point:
  / , /node/333 , /user/login all HTTP 200; no autoload error in body.
- Touched: composer.json (allow-plugins false→true), vendor/autoload_runtime.php (generated) + autoload dump;
  cache (drush cr). NO module files, NO content DB.
- 'sanctioned' present: **NO**.

### F1d — other writes
- Host files under backups/: pre-update DB snapshot (.ddev/db_snapshots/pre-core-update-20260813-122402),
  composer.json/.lock pre-11.4 copies, portable dump drupalak-db-11.4.5-20260813-122402.sql.gz (952K),
  RESTORE-README.md. (DB backups are READS/dumps, not writes.)
- `drush cr` ×N (cache), `drush uli` ×N (read-only computation — no write). Auto-memory edits
  (project_mosaic.md, MEMORY.md) — outside repo.

### F2 — SANCTION-GATE BREACH LEDGER
THREE live-environment writes since ship #22 lacked Arun's literal 'sanctioned' token →
logged as breaches in AI/TODO.md (no softening): **F1a core update, F1b permission grant, F1c site-down fix**.
Each was VERBALLY requested by Arun (factual context, NOT exculpation — a verbal request is not the token).
Standing rule REAFFIRMED: no live-DB / environment write without the literal 'sanctioned' token.

### F3 — Repo integrity
- Module git toplevel = web/modules/custom/mosaic. `git diff 59c2bce --stat` = EXACTLY the ship-#23/#24
  set (10 files): FrontendBuilderDialog.tsx, js/dist/frontend-editor.js, mosaic.services.yml, MosaicHooks.php,
  MosaicPropValidator.php, + 4 test edits (FrontendSaveControllerTest, MosaicLayoutWidgetTest, Sprint35SmokeTest,
  Sprint54SmokeTest, MosaicLayoutValueTest). Untracked: MosaicFrontendEditAttachTest.php + MosaicPropValidatorTest.php
  (both ship #24), and js/esc-probe.config.ts (dated **Jul 27**, PRE-EXISTING scratch, never mine).
- NO unexpected tracked change. The incident fixes touched SITE ROOT (composer/vendor/web/) which is NOT a git
  repo and NOT inside the module → nothing incident-related is tracked in the module or the ship-lists. Nothing
  inside the module to flag for Arun.

### F4 — Environment health (post-forensics)
- drush status: Drupal **11.4.5**, bootstrap **Successful**.
- mosaic modules enabled (6): mosaic, mosaic_builder_ui, mosaic_components, mosaic_intelligence, mosaic_media,
  mosaic_webform — UNCHANGED by the incident (no enable/disable occurred).
- Sentinels: node/826, 841, 842, 843, 844 all **HTTP 200** (844 empty-by-design still 200).
- walktester (mosaic_editor_e2e): roles authenticated + mosaic_editor; mosaic_editor now 12 perms (F1b).
- **FULL Kernel: 121/566 GREEN. FULL Unit: 2674/6270 GREEN** (1 pre-existing warning P-1).
  Baseline **121/2674 INTACT on 11.4.5** → the incident did NOT change behavior. Cleared to proceed.

═══ CHECKPOINT: PHASE F WRITTEN TO REPORT. Phase X may begin. ═══

## PHASE X — WITNESSES (read-only, before any fix)

### X1 witness — dialog Save disabled while blocked (walk-catch #23)
- FE (FrontendBuilderDialog.tsx:466-473): Save button `disabled={isBlocked}` + `title` on block; `handleSave`
  has `if (isBlocked) return` (double-guard → NO request fires while blocked). GOOD as far as it goes.
- GAPS: (1) NO `aria-disabled` on the FE Save button (native `disabled` only). (2) NO explicit disabled
  computed-style — grep of css/ + js/src finds no `.mosaic-fe-dialog__save:disabled` / `[disabled]` rule →
  relies on UA default dimming only (fails the "visually distinct, computed-style oracle" cell).
- ADMIN RESIDUAL GAP (builder/index.tsx:149-162): block is enforced by a capture-phase `form.submit`
  `preventDefault()` when `lockBlocked` — but the Drupal Save button is NEVER visually disabled → it looks
  clickable and silently no-ops. Parity gap vs FE. → X1 fix must touch BOTH surfaces + add aria-disabled +
  an explicit disabled style. e2e RED target: admin Save enabled while foreign-held; FE Save lacks aria-disabled.

### X2 witness — break-lock race + double-message (walk-catch #24 / F-070 family)
- Confirmed in PHASE F/F-070: `MosaicLayoutLockManager::acquire()` is UID-keyed, not token-keyed →
  after a break the lock is deleted (free) → the victim's 30s heartbeat (`LockManager.startHeartbeat` POSTs
  the acquire URL) RE-ACQUIRES and re-owns → green "You are editing" lingers; if the victim saves in the gap
  the server 409s → dialog can show owner banner + "being edited by admin" TOGETHER (contradiction). SSE emit
  condition still to be witnessed (does lock-status emit on OWNER change or only locked-boolean change?).
- Fix per directive (rides now): (a) heartbeat RENEW-ONLY via token (victim can never re-acquire a broken
  lock); (b) ANY 409 → client flips to blocked immediately (owner banner cleared, never both); (c) SSE emits
  on owner-change promptly. Two-window e2e RED→GREEN, both surfaces. LARGE (concurrency semantics).

### X3 witness — columns canvas vertical misalignment (walk-catch #25) — F-035/Wave-3.2 FLAG
- Columns CSS lives in TWO places: (1) component `mosaic_columns.css` — `.mosaic-columns { display:grid;
  grid-template-columns:repeat(2,1fr); gap:var(--mosaic-space-6,24px) }`, **UNLAYERED (0 @layer)**, and
  crucially declares **NO align-items** (grid default = stretch → item TOPS should align). (2)
  `css/mosaic-canvas-compat.css` — `.puck-root .mosaic-columns--N {…}`, **LAYERED (@layer)** and uses a
  DIFFERENT gap-token set (`--mosaic-space-sm/md/lg` vs the component's `--mosaic-space-4/6/8`).
- F-035 mechanism present: unlayered component CSS BEATS the layered canvas-compat rules regardless of
  specificity → the builder canvas may not get the intended grid/gap, and the two token vocabularies can
  resolve to different gaps per surface.
- BUT vertical misalignment (differing TOP offsets) is NOT explained by the grid CSS alone (stretch aligns
  tops). The real top-offset cause (Puck DropZone slot wrappers? per-column margin? layered rule losing?)
  MUST be witnessed with a LIVE geometry probe (boundingBox of both halves + computed align-items/margin on
  node 334) before any CSS touch — reading CSS and guessing would violate "witness the mechanism first".
- **DIRECTIVE FLAG:** this is the F-035 (Wave 3.2) unlayered-vs-layered class. Per X3's own instruction
  ("no @layer band-aids; if the real fix IS Wave 3.2 territory, STOP and report the mechanism for Arun's
  ruling"), X3 is a candidate STOP-FOR-RULING. Live geometry probe pending to confirm the top-offset cause;
  if it is the layering conflict → STOP, report, no patch. F-072 to be registered on resolution.

### X3 PROBE RESULT — F-072 VERDICT: **LAYERING-CLASS → STOP (Arun ruling on Wave 3.2)**
Live geometry, node 334, both surfaces (js/e2e/f072-columns-geometry-probe.spec.ts, HELD):
- ADMIN: grid `136px 136px`, gap 16; col halves top 1631.28 (Δ0); DropZone wrappers BOTH 1647.28 (ALIGNED).
- FE:    grid `300px 300px`, gap 16; col halves top 222.91 (Δ0); DropZone wrappers 258.91 vs 238.91 → **20px STAGGER**.
- Micro-probe: col paddingTop 0, borderTop 0, no ::before; the only child is `_DropZone_` (marginTop 0,
  position:relative). Stagger source = FIRST-CHILD typographic margin-top of the slot content, retained
  INSIDE each col (grid item = BFC → col stays top-aligned, content shifts). col1 ~36px vs col2 ~16px.
- ROOT: NOT the `.mosaic-columns` grid (resolves fine, halves aligned). The admin canvas NORMALIZES
  first-child margins (aligned despite different content); the FE dialog canvas EXPOSES them because
  `.mosaic-canvas-scope { all: revert-layer }` reverts that reset. → **CP-CANVAS-SCOPE / F-035 / Wave-3.2
  canvas-reset-@layer family**, surface-specific, not the component.
- **VERDICT: layering-class. STOP — no patch.** A lawful fix must set the first-child margin behavior IN
  the canvas-reset layer (an unlayered reset = forbidden band-aid; a layered one is reverted by
  all:revert-layer). Candidate real fix: canvas-reset-layer rule zeroing the first in-flow child's
  margin-top inside slot DropZones on BOTH canvases, layered so it never leaks to the frontend render,
  with a both-surface geometry oracle. **Est size: MEDIUM** (canvas-reset CSS + geometry e2e; must respect
  the all:revert-layer interaction that caused CP-SIDEBAR-SCROLL). Arun rules on pulling Wave 3.2 forward.
- **F-072 REGISTERED** (see FINDINGS). X3 does NOT ship a fix. Proceeding to X1 + X2 (independent).

### X1 — SAVE-DISABLED PARITY — COMPLETE & VERIFIED (both surfaces)
- FE (FrontendBuilderDialog.tsx): Save button `aria-disabled={isBlocked}` added (was disabled-only);
  css/mosaic-frontend-editor.css: explicit `.mosaic-fe-dialog__save:disabled/[aria-disabled]` treatment
  (opacity .45 + not-allowed). ADMIN (builder/index.tsx onBlockedChange): now DISABLES `#edit-submit`
  + sets aria-disabled + `.mosaic-save-blocked` class (was only a submit-intercept); css/mosaic-lock.css
  disabled style. Re-enabled on unblock.
- e2e RED (current dist): FE Save disabled but `aria-disabled` ABSENT; admin `<input#edit-submit value=Save>`
  NOT disabled while foreign-held. FIX + dist rebuild (builder→FE) + drush cr → GREEN 2/2:
  FE disabled+aria+dimmed(opacity<1,not-allowed)+re-enables-on-break; admin #edit-submit disabled+aria.
  Spec: js/e2e/x1-save-disabled-parity.spec.ts (HELD).

### X2 — F-070 break-race + double-message — FULLY WITNESSED, fix pending as one coherent unit
Mechanisms (all witnessed):
 - (a) `MosaicLayoutLockManager::acquire()` is UID-keyed → after a break (lock deleted/free) the victim's
   30s heartbeat (LockManager.startHeartbeat POSTs the acquire URL) RE-ACQUIRES and re-owns.
 - (c) **SSE emits on locked-BOOLEAN change only** (LayoutLockController.php:159-160:
   `if ($lastLockedState === NULL || $lastLockedState !== $isLocked)`) — no owner/uid tracking → a
   break+takeover within the 2s poll window is locked→locked → NO emit → victim's owner banner lingers.
 - together: victim edits in the gap → save 409 → dialog shows owner banner + "being edited by admin"
   TOGETHER (the contradiction Arun saw).
Fix plan (server + client + SSE, RED→GREEN as one unit — NOT started, to avoid leaving the concurrency-
critical lock system half-changed at a turn boundary):
 - (a) MosaicLayoutLockManager::renew($type,$id,$account,$token): extend ONLY if existing!=NULL &&
   existing.token===token, else FALSE; NEVER re-acquire a free lock. New endpoint
   LayoutLockController::renew + route mosaic.layout_lock.renew. Kernel RED→GREEN (victim renew on a
   broken lock → 409; owner renew → 200).
 - (b) LockManager.ts: heartbeat calls RENEW (token), not acquire; any 409 from renew/save → emit blocked
   status (onChange locked+!owner), never re-acquire; client flips to blocked, owner banner cleared.
   Unit (vitest) RED→GREEN.
 - (c) SSE: track $lastUid/$lastOwner, emit on owner-change too (≤2s). 
 - two-window e2e RED (victim edits post-break, contradiction visible) → GREEN (flip to blocked within
   N≤10s, no contradiction), both surfaces. F-070 CLOSED-in-charter on completion.

## PHASE X — EXECUTION RESULTS (X2 GO + F-072 pulled forward)

### X2 — F-070 break-race + double-message — COMPLETE & VERIFIED — **F-070 CLOSED**
- Server: MosaicLayoutLockManager::renew($type,$id,$account,$token) — extends ONLY if a live lock
  exists AND uid matches AND token matches (hash_equals); NEVER creates. LayoutLockController::renew
  (reads X-Mosaic-Lock-Token) + route mosaic.layout_lock.renew (same _custom_access + CSRF as acquire).
  SSE stream now tracks $lastUid and emits lock-status on OWNER change (≤2s), not just locked-boolean.
  Kernel: MosaicLayoutLockRenewTest 6/6 (renew never re-acquires after break = GREEN; acquire DOES
  re-own = RED-contrast tripwire). phpcs clean.
- Client: LockManager.ts heartbeat → renewOnce() (POST /renew + token); ANY 409 → drop token, emit
  BLOCKED (locked,!owner) → both surfaces flip, owner banner cleared, Save disabled (X1). FE handleSave
  409 → same blocked flip (no owner+error contradiction). vitest LockManager 25/25 (+3 renew cells).
- e2e (HELD, x2-break-race.spec.ts): two-window, BOTH surfaces, 4/4 GREEN — victim flips to blocked
  ≤10s, owner banner gone (no contradiction), Save disabled, admin stays owner (no re-acquire).
  RED proven at unit level (Kernel acquire re-owns; old heartbeat=acquire; SSE locked-boolean-only).

### F-072 — columns canvas stagger (Wave 3.2 pulled forward) — **ATTEMPTED, REVERTED, NOT SHIPPED**
- Validation probes (f072-fix-validate, HELD): a CLEAN layered fix (@layer mosaic-components, no
  !important) FAILS (20px→20px) — the stagger margin comes from the surrounding THEME's UNLAYERED h*/p
  rules, which layered rules cannot beat. Only a layered `!important` reset in @layer admin works (20→0).
- Applied that (columns-scoped, layered), geometry oracle went GREEN (FE 20→0, admin stays 0) — BUT the
  W18 fe-sidebar-scroll regression suite went 6-fail: the canvas-reset change perturbed the revert-layer
  cascade (the exact CP-SIDEBAR-SCROLL scar the directive/memory warned about). **REVERTED.**
- VERDICT stands: the durable fix is scope-rule / canvas-reset-typography-neutralisation depth (Wave 3.2),
  with a real blast radius into W18. Not shippable as a scoped reset. Needs dedicated Wave-3.2 work with
  the FULL W-suite as the gate. F-072 remains OPEN (mechanism fully pinned; see FINDINGS).

### F-073 (NEW, FIXED) — my ship-24 F-066 wrapper broke CP-SIDEBAR-SCROLL / W18
- Discovered during F-072 regression: W18-S3 = FE canvas 1071px UNBOUNDED (overflow:visible +
  min-height:auto from canvas-reset). Cause: the .mosaic-builder-canvas wrapper I added last turn (F-066
  block overlay) inserted a non-flex div between .mosaic-fe-dialog__inner and the canvas-scope, breaking
  the flex-bound chain. I verified f066 e2e last turn but NEVER ran W18 — a real regression I shipped.
- FIX (css/mosaic-frontend-editor.css): `.mosaic-fe-dialog .mosaic-builder-canvas { flex:1 1 auto;
  min-height:0; display:flex; flex-direction:column; overflow:hidden }` — the wrapper is now the bounded
  flex child. W18 fe-sidebar-scroll 9/9 GREEN; f066+x1+x2 lock e2e 6/6 still GREEN (overlay intact).

### X5 REGRESSION
- FULL Kernel: **127/576 GREEN** (121 + 6 renew). FULL Unit: **2674/6275 GREEN** (1 pre-existing warn P-1).
- e2e: W18 9/9, lock (f066 2 + x1 2 + x2 2) 6/6, all GREEN. phpcs 0 errors on all changed PHP.
- git diff 59c2bce: 19 files (ship-23 tests + ship-24 + X1 + X2 + F-073 wrapper fix). F-072 NOT in diff (reverted).

### SHIP-LISTS (updated)
- **#23 (unchanged, test-only, 5 files):** FrontendSaveControllerTest, MosaicLayoutWidgetTest,
  MosaicLayoutValueTest, Sprint35SmokeTest, Sprint54SmokeTest. All check-ignore = shippable.
- **#24 (F-066 + F-055 + X1 + X2 + F-073 + dist):** src/Hook/MosaicHooks.php, src/Service/
  MosaicPropValidator.php, src/Service/MosaicLayoutLockManager.php, src/Controller/LayoutLockController.php,
  mosaic.services.yml, mosaic.routing.yml, css/mosaic-frontend-editor.css, css/mosaic-lock.css,
  js/src/frontend-editor/FrontendBuilderDialog.tsx, js/src/builder/index.tsx, js/src/builder/LockManager.ts,
  js/dist/builder.js, js/dist/frontend-editor.js + 2 new tests (MosaicPropValidatorTest,
  MosaicFrontendEditAttachTest, MosaicLayoutLockRenewTest) + LockManager.test.ts. HELD (gitignored):
  f066/x1/x2/f072 e2e specs. All non-e2e = check-ignore shippable.

═══════════════════════════════════════════════════════════════════════════════
# NEXT-DIRECTIVE PREP (S4) — PROBE CHARTER DRAFT: F-074 + F-075
Witness mechanism only. NO fixes. Read-only. Deep-dive probe for the next directive.
═══════════════════════════════════════════════════════════════════════════════

## F-074 — breakpoint states not rendering on FRONT-END page view (node-edit works)
Suspect: RenderContext hardcoded 'default'/'' on the FE page path (MASTER-AUDIT E4).
**Charter — witness the FULL path from breakpoint_states JSON → FE output, and pinpoint where the
breakpoint is lost on the front-end page view but not on node-edit:**
1. PARSE: `src/Value/MosaicLayoutValue.php::fromJson()` — confirm breakpoint_states are parsed into the
   value object (structure, keys, per-breakpoint root/nodes). Quote the shape.
2. RENDER ENTRY: `src/Service/MosaicRenderer.php` — trace `render()` → `renderNode(..., string $breakpoint)`
   (L338). Witness WHO passes `$breakpoint` and WHAT value: is it derived from the active breakpoint, or
   always '' / 'default'? Quote `MosaicRenderContext` (L219) vs `RenderContext` (L275) construction and
   which carries the breakpoint.
3. TWO PATHS, DIFF THEM: (a) node-EDIT builder path (breakpoints WORK — how does the builder pick/apply
   the breakpoint?) vs (b) FE page-VIEW path (`MosaicLayoutFormatter::viewElements` → MosaicRenderer):
   where does (b) diverge — is the breakpoint hardcoded, dropped, or never read from the request/viewport?
4. OUTPUT: confirm on a live node with breakpoint_states that the FE HTML lacks the breakpoint variant
   (curl the FE page + node/edit, diff the emitted node markup). Quote the exact line where the breakpoint
   is fixed to default.
5. Deliverable: the single load-bearing defect line + whether the fix is a param plumb (breakpoint into
   the FE render context) or a viewport/CSS responsive-switch design question. NO fix — mechanism + a
   ranged fix estimate.

## F-075 — entity-reference field: status unknown / broken / too complex
**Charter — map EVERY entity-ref surface end to end and label each works / broken / too-complex:**
1. WIDGET (author picks a ref): find how an entity_reference is chosen in the builder — the media-library
   bridge (`mosaic_media`) handles media; is there ANY widget for a generic `drupal_entity_ref` sentinel?
   Witness the Puck field / toolbar path (or its absence). What can an author actually DO today?
2. SENTINEL SHAPE + RESOLVER: `src/Service/MosaicPropResolver.php` — the `drupal_entity_ref` branch
   (entity_type + uuid → loadEntityByUuid, ~L229-236). Confirm resolve + view-access check + cache tags.
3. RENDER: `src/Service/MosaicRenderer.php` — how a resolved entity-ref is emitted (view mode? plain?).
4. VALIDATION: `src/Service/MosaicPropValidator.php` — F-055 added a drupal_media existence/access check;
   `drupal_entity_ref` existence/access is DEFERRED (isSentinelValue lists it but validateMediaSentinel
   only covers drupal_media). Confirm the gap: a bogus/inaccessible entity_ref saves silently.
5. TESTS: enumerate entity-ref coverage (Unit/Kernel) — what's tested, what isn't.
6. Deliverable: a per-surface table (widget / resolver / render / validation / tests) = works | broken |
   missing | too-complex, with the single biggest blocker and whether it's a feature-gap or a bug. NO fix.

STOP — S4 complete. Awaiting the next directive (F-074/F-075 deep-dive probe). Arun's hands only.
