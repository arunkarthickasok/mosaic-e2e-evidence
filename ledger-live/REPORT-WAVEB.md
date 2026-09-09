# WAVE B — SECURITY & PERMISSION CLEANUP — EVIDENCE LOG

Read-only git, NO staging, NO live-DB writes (Kernel/Unit test DBs only). PHP-only wave (no dist).
Every fix: witness → derivation (before code) → RED → fix → GREEN → regression. phpcs 0/0 changed.

## B1 — R3 PHANTOM PERMISSION FIX

### Witness
- `modules/mosaic_intelligence/mosaic_intelligence.routing.yml`: 3 routes `_permission: 'administer mosaic'`
  — L6 queue.claim (POST /api/mosaic/intelligence/queue/claim), L15 scores.ingest (POST
  /api/mosaic/intelligence/scores), L24 scores.get (GET /api/mosaic/intelligence/scores/{type}/{id}).
- `modules/mosaic_tokens/mosaic_tokens.routing.yml`: L13 figma_sync `_permission: 'administer mosaic'`.
- `'administer mosaic'` (space) is declared NOWHERE in the install (re-witnessed). Module declares
  `mosaic.administer`. Undeclared perm ⇒ hasPermission() FALSE for all non-uid1 ⇒ routes fail CLOSED
  to uid1-only. Functional bug (delegated `mosaic.administer` admins cannot reach these), LOW security.

### Derivation (per route × account → expected)
| account | today (phantom) | after fix (mosaic.administer) |
|---|---|---|
| uid1 (super) | allowed | allowed |
| user w/ `mosaic.administer` | **DENIED (bug)** | **allowed** |
| user w/ `mosaic.use_builder` only | denied | denied |
| anon | denied | denied |
Fix = swap the 4 `_permission` strings `'administer mosaic'` → `'mosaic.administer'`. Intelligence
routes stay EXPERIMENTAL (R7) — gate corrected, scope label unchanged.

### RED oracle
Kernel: a user with ONLY `mosaic.administer` is DENIED each of the 4 routes today (checkNamedRoute).

### RED→GREEN (B1)
- RED (tests/waveb-b1-red.log): route requirement = 'administer mosaic' (Failed asserting identical to
  'mosaic.administer'). GREEN (tests/waveb-b1-green.log): OK 2 tests, 6 assertions.
- FIX: `modules/mosaic_intelligence/mosaic_intelligence.routing.yml` L6/L15/L24 +
  `modules/mosaic_tokens/mosaic_tokens.routing.yml` L13 → `_permission: 'mosaic.administer'`.
  Zero 'administer mosaic' remain. New Kernel test: tests/src/Kernel/Security/PhantomPermissionTest.php.
- Access-cell note: checkNamedRoute in Kernel doesn't reliably enforce an UNDECLARED perm without a
  request context (non-discriminating), so the oracle is the route-requirement assertion + the
  declared-permission assertion. On the live site core PermissionAccessCheck grants mosaic.administer
  holders / denies others by construction. Intelligence routes remain EXPERIMENTAL (R7) — gate fixed only.
- phpcs 0/0 on the test (routing .yml not phpcs-scoped). **B1 COMPLETE.**

## B2 — R4 WIRE manage_site_templates

### Witness
- Global-template management surfaces = the `MosaicGlobalTemplate` config entity (id
  `mosaic_global_template`, routes `/admin/config/mosaic/global-templates` collection/add/edit/delete
  via AdminHtmlRouteProvider). Access = default handler on `admin_permission: 'mosaic.administer'`
  (src/Entity/MosaicGlobalTemplate.php:36). No custom access handler.
- Site-local template surfaces: `mosaic.templates.save` (create_templates), `mosaic.templates.list`
  (use_templates) — unchanged (these are per-user site-local, not site-wide).
- `mosaic.manage_site_templates` is enforced NOWHERE (grep of src/+modules excl. permissions.yml +
  tests = 0). It is a declared-but-dead permission.

### Route→perm map (before → after)
| Surface | before | after |
|---|---|---|
| global-templates collection/add/edit/delete (mosaic_global_template CRUD) | mosaic.administer | **mosaic.manage_site_templates** |
| site-local templates.save | mosaic.create_templates | (unchanged) |
| site-local templates.list | mosaic.use_templates | (unchanged) |

### Derivation (global-template CRUD × account)
| account | today (administer gate) | after (manage_site_templates gate) |
|---|---|---|
| user w/ mosaic.manage_site_templates | **DENIED (dead perm)** | **allowed** |
| user w/ mosaic.create_templates only | denied | denied |
| user w/ mosaic.use_templates only | denied | denied |
| anon | denied | denied |
Fix = MosaicGlobalTemplate `admin_permission` → `mosaic.manage_site_templates`. RED: a
manage_site_templates-only user is DENIED CRUD today (surface requires administer).

### RED→GREEN (B2)
- RED (tests/waveb-b2-red.log): mosaic_global_template admin_permission = 'mosaic.administer' (Failed
  asserting identical to 'mosaic.manage_site_templates'). GREEN (tests/waveb-b2-green.log): OK 2/2.
- FIX: src/Entity/MosaicGlobalTemplate.php admin_permission → `mosaic.manage_site_templates`.
  New Kernel test: tests/src/Kernel/Security/GlobalTemplateAccessTest.php (2 tests: gate + perm declared/restricted).
- DISCOVERY F-069 (report-only, out-of-charter): mosaic.template.* config schema is missing `version`
  + `sync_to_config` keys (SchemaIncompleteException on save) — pre-existing schema gap, register.
- phpcs 0/0 on changed files. **B2 COMPLETE.**

## B3 — R10 FAIL CLOSED ON UNSET SECRETS

### Witness
- Collab bearer (CollabDocumentController::isAuthorized L112-115, CollabRevocationController L93-96):
  `$t = Settings::get('mosaic_collab_api_token',''); if ($t==='') return FALSE;` → ALREADY FAILS
  CLOSED on an unset secret (→ 403 via caller). Gap: no watchdog warning.
- Git-webhook (TokenGitWebhookController::handle L79-82): `if ($tokenSet->webhook_secret !== '') {
  validate → 403 on mismatch }` — when webhook_secret === '' the signature check is SKIPPED and
  `$this->gitSync->syncFromGit()` runs. **FAILS OPEN**: an unauthenticated caller triggers a token
  re-import when no secret is set. THIS is the R10 hole. No logger injected.

### Derivation ({secret set+valid, set+wrong, unset} × endpoint)
| | collab bearer | git-webhook |
|---|---|---|
| secret set + valid | allowed (200) | allowed (sync) |
| secret set + wrong | 403 | 403 |
| secret UNSET | **403 (already)** | **200/sync TODAY (hole) → 403 after** |
Fix: git-webhook — unset/empty `webhook_secret` → 403 + ONE watchdog warning ("secret not configured"),
BEFORE syncFromGit. Collab — already fail-closed; add the same watchdog warning for operator visibility.

### RED oracle
Git-webhook: handle() on a token set with empty webhook_secret returns 200/sync today (should be 403
and must NOT call gitSync).

### RED→GREEN (B3)
- RED (tests/waveb-b3-red.log): git-webhook with empty webhook_secret → 200 + gitSync CALLED (Failed
  asserting 200 identical to 403). GREEN (tests/waveb-b3-green.log): OK 1 test, 2 assertions (403 +
  gitSync NOT called).
- FIX: TokenGitWebhookController — inject logger.channel.mosaic_tokens; handle() rejects an empty
  webhook_secret with 403 + one watchdog warning BEFORE syncFromGit. New test:
  tests/src/Kernel/Security/GitWebhookFailClosedTest.php (spy git-sync, no external I/O).
- COLLAB DECISION (deliberate): CollabDocumentController + CollabRevocationController ALREADY fail
  closed on an unset mosaic_collab_api_token (`if ($t==='') return FALSE`) — R10's security objective
  is already met. These are `_access: 'TRUE'` world-reachable endpoints; adding an UNCONDITIONAL
  per-request watchdog warning would create a log-flood/DoS vector (an attacker could POST repeatedly
  to fill the log). So the warning is NOT added there — that would trade a non-hole for a new issue.
  Flagged for Arun: if operator-visibility is wanted, use a rate-limited/once-per-process warning
  (Wave C). The webhook warning is safe (gated behind the token-set 404 load).
- phpcs 0/0 changed files. **B3 COMPLETE** (webhook fixed+tested; collab already compliant, documented).

## B4 — TEMPLATE OWNERSHIP (FINDING-068)

### Witness (TemplateSaveController full read)
- Route POST /mosaic/templates/save, `_permission: mosaic.create_templates` + CSRF.
- save(): validates label + layout_json, then `$storage->create([...])->save()`. It ALWAYS creates a
  NEW mosaic_template (entity_keys id=>'id' auto-serial) and reads NO 'id' from the payload → no
  id-injection, no overwrite. `$storage->create()` never loads/replaces an existing template.
- MosaicTemplate implements EntityOwnerInterface (owner=uid); TemplateListController scopes the list
  to `->condition('uid', currentUser)` (L68) — each author sees only their own.

### Verdict: the charter's cross-user OVERWRITE vulnerability does NOT exist
Create-only + auto-id + no id-injection + owner-scoped list ⇒ a save cannot overwrite another user's
template, and no user sees another's. The "overwrite requires manage_site_templates" ruling is moot —
there is no overwrite path to gate. No RED reproduces.

### Hardening applied (defence in depth) + regression guard
- TemplateSaveController now sets `'uid' => currentUser->id()` explicitly (was relying on the
  EntityOwnerTrait implicit default). Injected AccountInterface.
- New test tests/src/Kernel/Security/TemplateOwnershipTest.php (10 assertions): two users saving the
  same label create two DISTINCT owner-attributed templates; owner scoping holds. GREEN
  (tests/waveb-b4-green.log). This locks isolation so a future overwrite/id path cannot regress it.
- phpcs 0/0. **B4 COMPLETE** — FINDING-068 = witnessed NON-ISSUE (hardening + guard added).

### B3 collab warning (R1 resume — Arun-directed)
Added the unset-secret watchdog warning to CollabDocumentController + CollabRevocationController
(inject logger.channel.mosaic_collab; warn only on the `if (token==='')` already-fail-closed path —
never on wrong-token attempts, so no flood on a configured site). services.yml args updated. New test
CollabFailClosedTest (401 + exactly ONE warning). Cells: secret+valid→allowed, secret+wrong→401 (no
warn), unset→401 + warn. phpcs 0/0 all 4 files. **B3 fully COMPLETE.**

## B5 — F-052 LOCK-ACQUIRE RACE

### Witness
MosaicLayoutLockManager::acquire — CHECK then SET with a non-atomic gap:
`$existing = $store->get($key);` (L48) … build $lock … `$store->setWithExpire($key,$lock,TTL);` (later).
Two concurrent acquirers both read NULL → both setWithExpire → both return their lock (both believe
they own; last-write-wins). Core offers the atomic primitive
`KeyValueStoreExpirableInterface::setWithExpireIfNotExists($key,$value,$expire)` → TRUE if set, FALSE
if it already existed (DatabaseStorageExpirable atomic INSERT).

### Fix
First-acquire (existing === NULL) uses setWithExpireIfNotExists atomically: winner gets TRUE → returns
lock; loser gets FALSE → re-reads the holder and is refused (FALSE) if now foreign. Self-held heartbeat
keeps setWithExpire (already ours; no race).

### RED oracle (Unit, interleaving stub)
Stub: get() → NULL (our check) then competitor(uid 99); setWithExpireIfNotExists → FALSE (competitor
won atomically). acquire(...,uid 5) must be FALSE. RED today: current code ignores the atomic result
and returns a lock array.

### RED→GREEN (B5)
- RED (tests/waveb-b5-red.log): testAcquireRefusesLoserOfConcurrentRace → current acquire() returned a
  lock array for the loser (not FALSE); testAcquireWinnerOfRaceGetsLock → current code called
  setWithExpire (unconditional). Both RED.
- FIX: MosaicLayoutLockManager::acquire — first acquire (existing===NULL) uses
  setWithExpireIfNotExists (atomic); loser re-reads holder and is refused. Self-held heartbeat keeps
  setWithExpire.
- GREEN (tests/waveb-b5-green.log): full Unit suite 25 tests, 57 assertions (2 new race tests + 3
  oracle-updated first-acquire tests now assert the atomic write). ORACLE CHANGE recorded: first-acquire
  write path setWithExpire → setWithExpireIfNotExists (driven by the fix, not a relaxation).
- phpcs 0/0. **B5 COMPLETE.**

## B6 — F-067 CONFIRMATION PROBE (probe only) — RESULT: REFUTED

e2e/f067-probe.spec.ts (held; node 22): editor (A) opens the builder and owns the lock; admin (B)
breaks + takes over via API; assert A's banner flips to blocked within 10s.
- RESULT: **GREEN 2/2** (banner flips to `.mosaic-lock-banner--locked` in ~4s). The SSE catches the
  break→takeover (locked→unlocked→locked) transition within the 2s poll and flips A. **The
  SSE-stale-banner hypothesis does NOT reproduce on current code** — F-067 is NOT confirmed.
- Refined hypothesis for Arun's round-3 ">60s linger": a break-vs-HEARTBEAT race — if the breaker does
  NOT immediately re-acquire, the broken user's 30s heartbeat re-acquires the freed lock and
  legitimately re-owns (green persists). That is a break-EFFECTIVENESS question, not a stale-banner
  bug, and needs a longer probe (>30s). Registered as F-070 (report-only).
- F-067: reclassified CANDIDATE → **NOT-REPRODUCED** (SSE-stale refuted); the probe now stands as a
  regression guard that the banner DOES flip on break+takeover. **B6 COMPLETE** (probe only, no fix).

## B7 — REGRESSION
- Kernel (full suite): **118/118, 551 assertions** GREEN (tests/waveb-b7-kernel.log) — includes the 4
  new Security Kernel tests.
- Wave B Unit tests (changed code): 63 tests, 150 assertions GREEN (lock manager 25/25 + the 4
  controller test classes + 4 Security tests). RED→GREEN oracle updates: TokenGitWebhook 200→403,
  first-acquire setWithExpire→setWithExpireIfNotExists, collab/webhook/template constructor fixtures.
- Full Unit suite: 20 errors + 3 failures REMAIN — all PRE-EXISTING (F-071), in files Wave B did not
  touch (FrontendSaveControllerTest + MosaicLayoutWidgetTest constructor debt from ships #19-21; +
  smoke/Value assertion drift). Not Wave B regressions.
- Sentinels 826/841/842/843/844 → 5×200 (844 empty by design). phpcs 0/0 on every changed PHP file.
- **Zero js/src changes** (PHP-only wave verified; js/e2e specs are held/gitignored per F-048).

## B8 — SHIP-LIST DRAFT (git check-ignore verdict per file)

Ship-list: **19 files SHIP** (3 yml + 6 src PHP + 5 new Kernel Security tests + 5 updated Unit tests);
js/e2e/{f067-probe,lock-2b}.spec.ts = IGNORED (held, F-048). Zero js/src. **WAVE B COMPLETE — pending
reviewer audit → Arun eye-test → ship #22.** (Pre-existing F-071 Unit debt flagged, not shipped here.)
