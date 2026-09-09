# WAVE 3.3 REPORT — CP-FE-LOCK (F-049+F-050) + CP-ADMIN-LOCK-ENFORCE (F-051) + F-054 media-bridge

**Opened:** 2026-08-01 (Arun R1 placement 2026-07-29). Read-only git. NO staging. NO sanctioned DB writes.
All raw evidence inline. Chat gets only a pointer summary.

**Charter:**
- CP-FE-LOCK = F-049 (FE dialog has zero lock integration) + F-050 (FrontendSaveController no lock check) as ONE CP.
- CP-ADMIN-LOCK-ENFORCE = F-051 (admin builder warns but does not block when held-by-other).
- F-054 rider = media-library bridge not attached on the FE render path (MosaicHooks::entityView missing mirror).

**Surfaces (paths confirmed):**
- Server: `src/Controller/LayoutLockController.php`, `src/Service/MosaicLayoutLockManager.php`, `mosaic.routing.yml` L152-199 (lock routes).
- FE save: `src/Controller/FrontendSaveController.php` (route L247-249). Admin save: node form (TBD A4) / `TemplateSaveController` (L63).
- Admin client: `js/src/builder/BuilderApp.tsx`, `js/src/builder/LockManager.ts`.
- FE client: `js/src/frontend-editor/FrontendBuilderDialog.tsx`.
- F-054: `src/Plugin/Field/FieldWidget/MosaicLayoutWidget.php` (media attach), `src/Hook/MosaicHooks.php::entityView` (missing mirror).
- Tests: `js/e2e/lock.spec.ts`, `tests/src/Kernel/Controller/MosaicLayoutLockControllerTest.php`, `tests/src/Unit/Service/MosaicLayoutLockManagerTest.php`.

---

## PHASE A — RECON (in progress)

Recon method: 6-agent parallel fan-out (workflow wno1odi88, Opus, 0 errors), each returning
verbatim file:line evidence; the two load-bearing claims (lock routes + FrontendSaveController)
independently re-verified by the implementer. Full raw agent output archived at
tasks/wno1odi88.output.

### A1 — LOCK SERVER (5 routes, not 6)

`mosaic.routing.yml` L153-199: five routes — acquire (POST), release (DELETE), break (POST),
status (GET), stream (GET/SSE). ALL five use `_custom_access: LayoutLockController::access`
(NOT `_permission`). CSRF token on the three mutating routes only (acquire/release/break); the
two GET routes have none.

`LayoutLockController.php`:
- **L196-199 (SECURITY-CRITICAL):** `access(): AccessResultInterface { return
  AccessResult::allowedIf($this->currentUser->hasPermission('mosaic.use_builder'))->cachePerPermissions(); }`
  — the SINGLE gate for all 5 routes checks ONLY the flat `mosaic.use_builder` permission; loads
  NO entity, verifies NO per-entity edit/update access.
- L58-78 `acquire()`: 200 `{locked,owner:true,uid,name,expires}` on success; **409**
  `{locked:true,owner:false,uid,name,expires,message}` when the manager returns FALSE (foreign-held).
- L85-88 `release()`: always 200 `{released:true}` (discards manager bool).
- L95-101 `breakLock()`: `if (!hasPermission('mosaic.break_lock')) return 403 JSON;` then
  unconditional delete → 200 `{broken:true}`. (break_lock enforced in method body, not route.)
- L108-120 `status()`: `{locked:false}` or `{locked:true,owner:uid==me,uid,name,expires}` — leaks
  holder uid+name to any use_builder user for any entity.
- L133-191 `stream()`: SSE, deadline time()+28s, poll usleep(2s), heartbeat `: heartbeat` every 10s,
  `retry: 5000`; emits `lock-status`/`lock-released`. Also leaks uid+name.

`MosaicLayoutLockManager.php`: `KeyValueExpirableFactoryInterface`, `COLLECTION='mosaic.layout_locks'`,
`TTL=90`. L38-56 `acquire()` = heartbeat (returns FALSE only when existing uid != caller; else
`setWithExpire(key,lock,90)`). L63-76 `release()` (owner-only delete, else FALSE). L83-88
`breakLock()` unconditional delete. **L101-104 `isLockedBy()`** = `$lock!==NULL &&
(int)$lock['uid']===(int)$account->id()` — the correct owner-check primitive, **wired to NO save
path**. Key = `entityType.':'.entityId`.

### A2 — ADMIN CLIENT: WARN-ONLY (F-051 CONFIRMED)

`BuilderApp.tsx`:
- L195-196 comment claims `!status.owner = blocked` — but the ONLY consumer of `lockStatus.owner`
  is `renderLockBanner()`.
- **L419-445 `renderLockBanner()`:** non-owner branch renders a passive
  `<div class="mosaic-lock-banner--locked" role="alert">⚠ Locked by @name</div>` + optional Break
  button (gated on `hasBreakLock`). NO disable, NO read-only, NO early-return.
- **L697-705 `<Puck>`:** rendered with no `disabled`/`readOnly`/lock condition; `onChange` fires on
  every edit → `handleChange`. `onPublish` is a deliberate no-op ("Drupal's form submit is the only
  save path").
- L272-310 `handleChange`: NO `if(!owner) return` guard → flows to `saveLayoutJson` → L267-270
  `onLayoutJsonChange` writes into the Drupal field textarea.
- **L209-217 submit listener:** the ONLY submit handler calls `guard.markSaved()` and NEVER
  `preventDefault()`/checks owner → the node-form Save submits a non-owner's edits with zero client
  lock enforcement.
`LockManager.ts` L46-75: advisory only; docblock says "caller should check status.owner"; on 409 it
skips heartbeat/stream but still returns the status and editing proceeds.

### A3 — FE ZERO LOCK (F-049) + FRONTENDSAVECONTROLLER ZERO LOCK (F-050) — CONFIRMED

- F-049: `grep -rn "lock|Lock|LockManager" js/src/frontend-editor/` → **zero matches (exit 1)**.
  `FrontendBuilderDialog.tsx` L1-11 imports: no lock import; 424 lines, no acquire/release.
- F-050: `grep -n "lock|Lock|isLockedBy" FrontendSaveController.php` → **zero matches (exit 1)**.
  `access()` L64-78 = `use_builder` + entity `update` only. `save()` L114-138 = load → fieldable
  check → mosaic_layout check → `set()` → `save()`, NO lock check. (Independently re-verified.)

### A4 — ADMIN SAVE PATH = NODE FORM (shapes F-050 "both save paths")

- Admin builder does NOT POST to any mosaic controller. `BuilderApp.tsx` L697-705 onPublish no-op;
  React writes JSON into the widget hidden textarea (`MosaicLayoutWidget.php` L166-176); the standard
  node-form POST persists via WidgetBase → `$entity->save()`.
- Widget touchpoints have NO lock check: `massageFormValues` L205-212 (trim only), `validateJson`
  L191-200 (schema only).
- **Common chokepoint: `MosaicHooks::entityPresave` L166-191** — migrate + schema-validate, NO lock
  check. BOTH save paths call `$entity->save()` → fire entity_presave. BUT it fires on ALL saves
  (drush/migration/API) → a naive lock throw here would break programmatic saves.
- `mosaic.routing.yml` L1-4 "Sprint 03: layout get/save" is a stale comment; NO LayoutSaveController
  exists (only TemplateSaveController L63 + FrontendSaveController L249).

### A5 — F-054 MEDIA BRIDGE MISSING ON FE PATH — CONFIRMED

- `MosaicLayoutWidget.php` L130-136: `if ($this->moduleHandler->moduleExists('mosaic_media')) {
  $element['#attached']['library'][] = 'mosaic_media/media_library_bridge'; }` (present, guarded).
- `MosaicHooks::entityView` L322-344: mosaic_layout loop attaches ONLY `mosaic/frontend_editor`
  (L343). `grep "mosaic_media|media_library_bridge" MosaicHooks.php` → **zero matches**. Mirror attach
  MISSING.
- Library id verified: `mosaic_media.libraries.yml` L1 key `media_library_bridge` → full id
  `mosaic_media/media_library_bridge` (byte-identical to the widget string).

### A6 — EXISTING TESTS

- `js/e2e/lock.spec.ts`: 9 tests UAT-53..61. UAT-53/54/60 conditionally skipped; UAT-55/59 anon-403;
  UAT-56 accepts [200,409] (409 never forced); UAT-57/58/61 assertions guarded by `if(ok())` (403
  passes vacuously). Only `--owner` banner asserted; NO held-by-other banner test.
- `MosaicLayoutLockControllerTest.php`: 13 methods — same-user acquire/idempotent/isolation, release
  idempotent, status shape, breakLock **403-only**, access neutral-for-anon, all-JSON, expires-future.
  GAP: no cross-user 409; no privileged breakLock 200.
- `MosaicLayoutLockManagerTest.php`: 20 methods — full KV logic incl. `isLockedBy` TRUE/FALSE/loose-uid.
- **CRITICAL GAP:** ZERO tests exercise a SAVE/persist endpoint rejecting a write when held by another
  user. The lock is only ever proven advisory (manager.acquire → FALSE), never enforced on a write.

### NEW FINDINGS (beyond charter — report-only per scope law)

- **FINDING-063 candidate (SECURITY, MEDIUM-HIGH):** `LayoutLockController::access()` (L196-199)
  gates all 5 lock routes on `mosaic.use_builder` alone — no per-entity edit-access check. Any
  builder user can acquire/release/break/inspect the lock for ANY {entity_type}/{entity_id} they
  cannot even edit; `status`/`stream` additionally LEAK the holder's uid + display name. Fix
  direction: `access()` should load the entity and require `update` access (mirroring
  FrontendSaveController::access). Whether this rides IN CP-FE-LOCK (it is adjacent to the lock
  server) or as its own CP is an ARUN DECISION.

---

## PHASE B — DERIVATION (BLOCKED on one design decision — see B0)

### B0 — DESIGN FORK (server-enforce locus for the ADMIN save path) — ARUN DECISION NEEDED

F-050 charter: "server enforce must cover BOTH save paths." Recon (A4) proved the admin path is
the Drupal node form, whose only common server chokepoint with the FE controller is
`MosaicHooks::entityPresave` — which ALSO fires on drush/migration/programmatic saves that legitimately
hold no lock. Two viable designs; they change the Phase-B scenario matrix and the Phase-D fix:

- **Option A (recommended) — enforce at the two INTERACTIVE entry points, leave programmatic saves
  untouched:** (1) FrontendSaveController::save() adds an `isLockedBy` guard → 409 when foreign-held;
  (2) the admin node-form adds a FORM-context lock check (widget `#element_validate` or a
  form-level validate that runs only in the interactive form build) → form error when foreign-held.
  Programmatic/drush/migration/API saves are unaffected (no form, no controller). Clean
  Permission-Parity; no risk to non-interactive saves.
- **Option B — enforce in `entityPresave` with an origin guard:** a single lock check covers both,
  but entity_presave cannot reliably distinguish interactive from programmatic saves; would need a
  request-context/opt-out flag, risking broken drush/migration/config-import saves. Higher blast
  radius.

**Recommendation: Option A.** The exhaustive Phase-B matrix + Phase-C RED tests + Phase-D fix are
written against Option A UNLESS Arun rules Option B. Derivation below assumes Option A pending ruling.

### B1 — CP-FE-LOCK + F-051 scenario dimensions (Option A basis)

Surfaces {admin builder (node form), FE dialog} × lock-state {unlocked, held-by-self,
held-by-other-active, held-by-other-expired (TTL>90s → reads NULL → treat as unlocked),
broken-mid-session, lost-mid-session (SSE/poll takeover)} × permission {use_builder only,
+break_lock, no-perms abuse} × action {open editor, save, release-on-close, break, direct-POST
save WITHOUT lock (abuse, BOTH endpoints), double-acquire 409} × lifecycle {TTL expiry mid-edit,
crash-no-release then reopen, second tab same user} × geometry {banner/blocked-state position,
not overlapping toolbar, dialog centred — boundingBox oracles} × i18n {new t() strings}.
(Full cell enumeration deferred until B0 ruling — the write-path × enforcement-locus dimension is
the axis in flux.)

Server-enforce (PHP Kernel) derivation, both endpoints × lock-states × permissions:
- FrontendSaveController::save: held-by-other → 409 (typed JSON, one watchdog warn); held-by-self →
  200; unlocked → ??? (ARUN sub-decision: must the FE save REQUIRE an active self-lock, or allow
  lockless save when nobody else holds it? Recommend: allow when unlocked, reject only when
  foreign-held — least disruptive, matches "prevent overwrite" intent).
- Admin form validate: same three states → form error on foreign-held; pass otherwise.
- Full-entity-view oracle rule applies where render is involved (none here — these are save paths).

### B2 — F-054 derivation

Media-library-bridge attaches on FE render path {logged-in editor with use_builder+update → attach
present} × {anonymous → attach ABSENT (F-046/057 class: no JS bloat to anon)}. Kernel: editor view
of a node with a mosaic_layout field + mosaic_media enabled → `mosaic_media/media_library_bridge`
in `#attached[library]`; anon view → absent. The FE attach must sit inside the existing Pass-2
editor block (L322-344, already gated on use_builder + update access), mirroring the widget's
`moduleExists('mosaic_media')` guard — so anon never gets it for free.

### CHECKPOINT REACHED — STOP FOR ARUN RULING

Per the directive's A+B checkpoint + "stop-when-blocked, no silent scope widening": PHASE A recon
is complete and written; PHASE B derivation is blocked on the B0 design fork (admin-save enforcement
locus) and one sub-decision (FE save on unlocked). Building Phase C RED / Phase D fix before that
ruling would bake in an architecture Arun has not chosen. Also awaiting the ruling on whether
FINDING-063 (lock-route per-entity access + info leak) is in-charter here or a separate CP.

---

## PHASE A-V — IMPLEMENTER VERIFICATION (direct tool reads, no subagents) — 2026-08-01

Reviewer audit requirement: subagent-relayed quotes witnessed directly before Arun rules B0.

### V1 (A2 / F-051) — BuilderApp.tsx

**a. L421-445 renderLockBanner (non-owner branch):**
```
    if (lockStatus.owner) { ... "You are editing" ... }
    return (
      <div className="mosaic-lock-banner mosaic-lock-banner--locked" role="alert" aria-live="assertive">
        <span>⚠ {tFmt('lock_locked_by', 'Locked by @name', {'@name': lockStatus.name})}</span>
        {hasBreakLock && ( <button ... onClick={handleBreakLock}>Break Lock</button> )}
      </div>
    );
```
Non-owner branch = passive banner + optional Break button; NO disable, NO early-return.
**VERDICT: MATCHES-SUBAGENT.**

**b. L697-705 <Puck>:** `onPublish={() => { /* Drupal's form submit is the only save path. */ }}`;
props are key/config/iframe/overrides/data/onChange — NO `disabled`, NO `readOnly`, no lock
condition. **VERDICT: MATCHES-SUBAGENT.**

**c. L211-217 submit listener:** `const handleSubmit = (): void => { guard.markSaved(); };
document.addEventListener('submit', handleSubmit, { capture: true });` — markSaved() only, NO
`preventDefault()`, NO owner check. **VERDICT: MATCHES-SUBAGENT.**

**d. L272-283 handleChange head:** `const handleChange = useCallback((updatedData) => {
setCurrentData(updatedData); guard.updateCurrent(updatedData); let layoutJson; ...` — NO
`if (!lockStatus.owner) return` guard at the top. **VERDICT: MATCHES-SUBAGENT.**

### V2 (A4 / B0) — MosaicHooks.php + routing

**a. L166-191 entityPresave:** `#[Hook('entity_presave')]` → for each mosaic_layout field:
`migrateToCurrentVersion` then `schemaValidator->validateFull`, throwing `EntityStorageException`
ONLY on schema-invalid. NO lock check. The method operates on any `FieldableEntityInterface` save
with nothing distinguishing interactive (form/controller) from programmatic (drush/migration/API)
origin. **VERDICT: MATCHES-SUBAGENT** — confirms the B0 fork (no origin discriminator here).

**b. L322-344 entityView loop:** attaches drupalSettings.mosaicFrontendEdit + `$build['#attached']
['library'][] = 'mosaic/frontend_editor';` (L343) and NOTHING else library-wise.
**VERDICT: MATCHES-SUBAGENT** (only mosaic/frontend_editor).

**c. `grep -n "LayoutSaveController" src/ mosaic.routing.yml` → exit 1 (ZERO matches).**
**VERDICT: MATCHES-SUBAGENT** (stale Sprint-03 comment; no admin save controller).

### V3 (A5 / F-054) — MosaicLayoutWidget + MosaicHooks + libraries

**MosaicLayoutWidget.php L130-136:** `if ($this->moduleHandler->moduleExists('mosaic_media')) {
$element['#attached']['library'][] = 'mosaic_media/media_library_bridge'; }` (attach present,
guarded). **VERDICT: MATCHES-SUBAGENT.**
**`grep -n "media_library_bridge|mosaic_media" src/Hook/MosaicHooks.php` → exit 1 (ZERO).**
`mosaic_media.libraries.yml` L1 = `media_library_bridge:` → id `mosaic_media/media_library_bridge`.
**VERDICT: MATCHES-SUBAGENT** (mirror attach missing on entityView; id byte-identical).

### V4 (A6) — test spot-check

**UAT-56 body L94-117:** `expect([200, 409]).toContain(response.status());` (L109) with comment
"Could be 200 (acquired) or 409 (already locked by someone)." **VERDICT: MATCHES-SUBAGENT** ([200,409]
acceptance — 409 never forced with one user).
**UAT-57 vacuous guard L136-140:** `if (statusResponse.ok()) { const data = ...; expect(data.locked)
.toBe(true); }` + comment "403 means anonymous route guard ... That is acceptable here." → a 403
passes the test vacuously. **VERDICT: MATCHES-SUBAGENT.**
**Kernel breakLock 403-only L174-181:** `public function testBreakLockReturns403WithoutPermission():
void { $response = $this->controller->breakLock('node','1'); $this->assertSame(403,
$response->getStatusCode()); ... assertArrayHasKey('error', $data); }` — denied path only; no
privileged-200 breakLock test. **VERDICT: MATCHES-SUBAGENT.**

### VERIFICATION SUMMARY

All 10 checked items (V1a-d, V2a-c, V3, V4×3) = **MATCHES-SUBAGENT**, zero discrepancies. The
B0-decision-driving facts (F-051 warn-only; entityPresave is the only common chokepoint and has no
origin discriminator; admin save is the node form; F-054 mirror missing) are implementer-witnessed.
Recon is cleared for Arun's B0 ruling.

---

## PHASE C0 — DERIVATION (Option A basis; server increment scope) — 2026-08-01

Build split for stability: INCREMENT 1 (this pass) = server-side PHP security core
(manager `isLockedByOther` + D1a FrontendSaveController 409 + D2 F-063 lock-route access
hardening), Kernel RED→GREEN. INCREMENT 2 (next) = D1b admin widget validate, D5 F-054 media
mirror, D3/D4 client lock UI, D6 dist rebuild, C2 e2e. Rationale: the two access-path holes
(FE inline-edit overwrite + lock-route missing per-entity access) are the actual vulnerabilities
and are self-contained/fully-testable in PHP; the client blocking UX is defense-in-depth on top.

### F-050 (FrontendSaveController) cells — Option A, allow-when-unlocked

| Lock state | current user | expected save() | today |
|---|---|---|---|
| unlocked | editor | 200 success | 200 (guard, stays) |
| self-held-active | editor (holder) | 200 success | 200 (guard) |
| foreign-held-active | editor (non-holder) | **409** typed JSON + 1 watchdog warn | **200 (RED)** |
| foreign-held-expired (TTL>90 → getStatus NULL) | editor | 200 success (treated unlocked) | 200 (guard) |
| programmatic `$entity->save()` with foreign lock | n/a | **succeeds** (never blocked) | succeeds (guard — proves Option A boundary) |

### F-063 (LayoutLockController::access) cells

| Route | user | expected | today |
|---|---|---|---|
| acquire/status/break (any) | user WITH entity update access + use_builder | allowed | allowed (guard) |
| acquire/status/break (any) | user with use_builder but NO entity update access | **403/forbidden** | **allowed (RED)** |
| any | anonymous (no use_builder) | forbidden/neutral | forbidden (guard) |
| break | editor without mosaic.break_lock | 403 (method body, unchanged) | 403 (guard) |

Leak posture (status/stream uid+name): after D2, only users who pass the new per-entity access
gate reach status/stream — and such a user CAN edit the entity, so seeing the current holder's
name is legitimate (needed for the "Locked by X" banner). Decision: KEEP name (legitimate to
editors); uid is used client-side only for owner comparison and is not PII beyond name — KEEP but
documented. No change to response shape needed; the fix is the access gate, which removes exposure
to non-editors entirely.

---

## INCREMENT 1 — SERVER SECURITY CORE (F-050 FE-path + F-063) — BUILD COMPLETE 2026-08-01

### Changes (all PHP, all ship)
- `src/Service/MosaicLayoutLockManager.php` — new `isLockedByOther()` primitive (allow-when-unlocked).
- `src/Controller/FrontendSaveController.php` — D1a: inject lockManager + current_user +
  logger.channel.mosaic; in save(), foreign-held-active → 409 typed JSON (mirrors LayoutLockController
  409 shape) + ONE watchdog warning (entity/field/holder). Allow-when-unlocked; self-held proceeds.
- `src/Controller/LayoutLockController.php` — D2/F-063: `access()` now takes {entity_type, entity_id},
  loads the entity, requires `update` access (+ keeps use_builder). Break still additionally gated on
  mosaic.break_lock in the method body.

### RED (tests/w33-f050-red.log)
`testForeignHeldSaveReturns409` → FAIL "Failed asserting that 200 is identical to 409" (foreign save
returned 200 = the F-050 overwrite hole). Guards (unlocked/self-held/programmatic) already green.
F-063 RED evidence = recon witness (PHASE A1, implementer-noted): pre-fix access() was
`AccessResult::allowedIf(hasPermission('mosaic.use_builder'))` with no entity load.

### GREEN
| Suite | Log | Result |
|---|---|---|
| FrontendSaveControllerLockTest (F-050) | tests/w33-f050-green.log | 4/4 (unlocked 200, self 200, foreign **409**, programmatic not-blocked) |
| LayoutLockControllerAccessTest (F-063) | tests/w33-f063-green.log | 4/4 (editor allowed, no-access **forbidden**, anon forbidden, missing forbidden) |
| Full lock regression (existing + new) | tests/w33-regress-kernel.log | **41/41** (118 assertions) |

### ORACLE UPGRADE (ledgered, reviewer-acceptance flag)
`MosaicLayoutLockControllerTest::testAccessCheckReturnsNeutralForAnonymous` — `access()` → `access('node','1')`
(the F-063 signature change added {entity_type,entity_id}). Assertion unchanged (anon still !isAllowed).
Not an oracle relaxation — a signature adaptation. REVIEWER-ACCEPTANCE: required.

### PHPCS: zero errors, zero warnings on all changed source (comment lines reflowed to ≤80).

### SHIP-LIST (increment 1) — 6 files, all PHP, all ship (git check-ignore exit 1)
```
src/Service/MosaicLayoutLockManager.php
src/Controller/FrontendSaveController.php
src/Controller/LayoutLockController.php
tests/src/Kernel/Controller/MosaicLayoutLockControllerTest.php        (oracle upgrade)
tests/src/Kernel/Controller/FrontendSaveControllerLockTest.php        (NEW)
tests/src/Kernel/Controller/LayoutLockControllerAccessTest.php        (NEW)
```

### INCREMENT 2 (NOT built this turn — stop-when-blocked, stability)
- D1b: admin node-form lock validate (F-050 admin path — completes "both save paths"). Needs a
  Functional test (form submission), not a Kernel unit.
- D5: F-054 media-bridge mirror in entityView (needs ModuleHandler injected into MosaicHooks +
  services.yml + drush cr).
- D3/D4: FE client lock UI (FrontendBuilderDialog acquire/block) + admin block (BuilderApp disable
  Puck + intercept submit) + LockManager reuse. D6: dist rebuild.
- C2 e2e (held per F-048).
STATUS: F-063 CLOSED. F-050 FE-path CLOSED (admin-path pending increment 2). F-049/F-051/F-054 pending.

---

## N0 — F-063 SMOKE-ALARM DANCE (2026-08-02)

Backup: `AI/w33-inc1.patch` (177 lines, sha b619a0b473f9). Surgical revert of ONLY the access()
body → use_builder-only gate (2-arg signature kept). RED (tests/w33-f063-smokered.log):
`testBuilderWithoutEntityAccessIsForbidden` + `testMissingEntityIsForbidden` FAIL ("Failed
asserting that true is false" — no-access user & missing entity wrongly allowed); guards
(editor-allowed, anon-forbidden) stay green. Reapply byte-identical: `git diff` vs backup = EMPTY,
shasums identical (b619a0b473f9). GREEN (tests/w33-f063-smokegreen.log): 4/4. The F-063 test genuinely
bites the fix.

## N2 — FULL REGRESSION (2026-08-02)

- Sentinels (anon curl): node 826/841/842/843/844 → all HTTP 200 (844 empty by design). No render regression.
- FULL Kernel suite (tests/src/Kernel/): **102 tests, 482 assertions, OK** (tests/w33-full-kernel.log).
- phpcs on all 6 changed files: zero errors, zero warnings.

---

## N3/N4 — INCREMENT 2 (PHP) BUILD + CLOSEOUT (2026-08-02)

### D5 — F-054 media-bridge mirror (source complete, DI-verified)
- MosaicHooks: injected `ModuleHandlerInterface` (+services.yml `@module_handler`); entityView Pass-2
  now mirrors the widget's `mosaic_media/media_library_bridge` attach behind a moduleExists guard,
  inside the editor-gated block (anon never gets it). `drush cr` clean; entityView DI smoke
  (MosaicAnonRendererCacheTest 9/9). phpcs zero new errors.
- LIVE VERIFY (drush eval, uid 1 render of node 826): mosaic_media is NOT enabled on this site →
  guard correctly SKIPS the bridge; `mosaic/frontend_editor` still attaches. Negative guard +
  anon-absent confirmed. **Positive assertion (mosaic_media enabled → bridge present) DEFERRED** —
  requires enabling mosaic_media (a DB write, not sanctioned tonight); covered by e2e/Functional in
  an env where it is on. Source mirrors the proven widget attach byte-for-byte.

### D1b — F-050 admin node-form path (COMPLETE, tested)
- MosaicLayoutWidget: injected MosaicLayoutLockManager; `validateJson` (#element_validate) now
  rejects a foreign-held save with a form error. Placement justified: #element_validate runs ONLY
  during interactive Form API validation — a programmatic `$entity->save()` never triggers it — so
  drush/migration/API saves are never blocked (Option A boundary).
- TEST: MosaicLayoutWidgetLockTest (Kernel, invokes validateJson via a real form object) —
  **3/3 GREEN** (foreign-held → error; unlocked → none; self-held → none). tests/w33-d1b.log.
- **F-050 NOW FULLY CLOSED** (both interactive save paths: FE controller 409 + admin form error).

### REGRESSION (after D5+D1b)
- FULL Kernel suite: **105/105** (497 assertions) — tests/w33-full-kernel.log context.
- phpcs: zero new errors on all changed files (MosaicHooks' 1 error = pre-existing L96 `??`
  alignment, not introduced by Wave 3.3).

### SHIP-LIST (increments 1+2, 10 files, ALL SHIP — git check-ignore = not ignored)
```
mosaic.services.yml                                            (D5: +@module_handler)
src/Service/MosaicLayoutLockManager.php                       (isLockedByOther)
src/Controller/FrontendSaveController.php                     (D1a: FE 409)
src/Controller/LayoutLockController.php                       (D2/F-063: access hardening)
src/Hook/MosaicHooks.php                                       (D5/F-054: media mirror + ModuleHandler)
src/Plugin/Field/FieldWidget/MosaicLayoutWidget.php           (D1b: admin form validate)
tests/src/Kernel/Controller/MosaicLayoutLockControllerTest.php (oracle upgrade)
tests/src/Kernel/Controller/FrontendSaveControllerLockTest.php (NEW)
tests/src/Kernel/Controller/LayoutLockControllerAccessTest.php (NEW)
tests/src/Kernel/Field/MosaicLayoutWidgetLockTest.php          (NEW)
```

### STOP-THREAD — INCREMENT 2b (client + dist + e2e) DEFERRED to a dedicated session
Per stop-when-blocked-per-item + "fast but stable": D3 (F-049 FE dialog LockManager acquire/block
UI), D4 (F-051 admin block — disable Puck + intercept submit), D6 (dist rebuild), C2 (e2e with
geometry oracles) are NOT built tonight. Rationale: a React lock state machine + Puck disabling +
FE LockManager reuse + dist bundling reconciliation + geometry e2e is a large, security-adjacent UI
change that should be built + eye-tested in a focused session, not rushed unattended. CRUCIALLY, the
SERVER now REJECTS every foreign-held write (FE 409 + admin form error + lock-route access gate), so
the actual overwrite vulnerability is CLOSED server-side; D3/D4 add the visible blocked-state UX
(defense-in-depth), not the core protection.

### STATUS
- **F-050 CLOSED** (both paths, server-enforced + tested).
- **F-063 CLOSED** (per-entity access on all 5 lock routes + smoke-alarm verified).
- **F-054 source-complete** (DI-verified, negative-guard live; positive render test deferred).
- **F-049 / F-051 OPEN** — client blocked-state UX, increment 2b (overwrite already prevented server-side).

---

## BLOCK 1 — D1b SMOKE-ALARM (pre-ship law) — 2026-08-02

Backup: `AI/w33-d1b.patch` (83 lines, sha 432df07fa596). Surgical revert of ONLY the validateJson
lock-check block (DI/imports/@param kept). RED (tests/w33-d1b-smokered.log):
`testForeignHeldFormSubmitSetsError` FAIL "Failed asserting that false is true" (foreign-held set no
error); guards (unlocked/self-held) stay green. Reapply byte-identical: `git diff` vs backup = EMPTY,
shasums identical (432df07fa596). GREEN (tests/w33-d1b-smokegreen.log): 3/3. The D1b admin-path test
genuinely bites the fix.

---

## BLOCK 2 — F-054 POSITIVE VERIFY (sanctioned) — 2026-08-02

ARUN SANCTION 2026-08-02: "BLOCK 2 sanctioned — enable mosaic_media". Explicit grant received;
mosaic_media installed on dev (sanctioned config/DB write; TODO.md ledgered).

- **Enable:** `drush pm:install mosaic_media -y` → "Module mosaic_media has been installed" + `drush cr` clean.
- **D5 positive (live drush scr, node 826) — tests/w33-d5-positive.log:**
  - `UID1 BRIDGE=YES EDITOR=YES` — with mosaic_media ON, an editor's render attaches BOTH
    `mosaic_media/media_library_bridge` and `mosaic/frontend_editor` (positive assertion PROVEN).
  - `ANON BRIDGE=NO EDITOR=NO` — anonymous render receives neither (editor-gated block; F-046/057 class holds).
  - This is the exact deferred assertion from N3/D5, now closed live.
- **Sentinels (anon curl, module list changed) — tests/w33-d5-sentinels.log:** node 826/841/842/843/844 → all HTTP 200. No render regression from enabling mosaic_media.
- **Full mosaic Kernel re-run (mosaic_media enabled) — tests/w33-d5-kernel-rerun.log:** OK (105 tests, 497 assertions). Enabling mosaic_media does not perturb the mosaic suite.
- **FINDINGS:** F-054 upgraded RESOLVED(source) → **FULLY-VERIFIED** (positive render + anon-absent + Kernel green).

Verify script: AI/w33-f054-verify.php (uid-1 + anon probe, bubbled #attached inspection).
No source changed in BLOCK 2 — verification only. mosaic_media remains enabled on dev (sanctioned).
STOP — ship ceremony next (Arun's hands only).

---

## WALK-CATCH #17 SCOPING PROBE (read-only, no fixes, no staging) — 2026-08-02

Arun's walk: foreign-held save refused (form error) → refresh → browser resend popup → Continue →
same payload re-sent; holder had released in the interim → resubmit SUCCEEDED silently; change
persisted. User never re-clicked Save.

- **P1 mechanism (witnessed in code):** validateJson L223 rejects only when `isLockedByOther`
  (allow-when-unlocked). On the resulting validation error, `FormBuilder::processForm` L614 reaches
  the submit/redirect block ONLY when `!hasAnyErrors()` — so a validation error means NO
  Post/Redirect/Get (core behavior); the POST to `/node/826/edit` stays browser-resubmittable. The
  stale resubmit lands in the post-release unlocked window → passes → saves.
- **P2 timeline:** node 826 `vid=1451 2026-08-02 23:50:50 uid=3 (walktester) default=Y` (the
  stale-resubmit save, now live) over `vid=1387 uid=1 admin`. Lost-update confirmed.
- **P3 surface parity:** FE dialog NOT exposed — `fetch(POST)` (FrontendBuilderDialog.tsx L254-255)
  is not a navigation POST, no resend popup. Admin-form-specific.
- **P4 fix directions:** (a) client resubmit-neutralize [interim, JS-only]; (b) lock-nonce /
  require-live-self-lock [RECOMMENDED, server-authoritative, changes allow-when-unlocked semantics
  admin-form-only + couples to D4 → flag Arun]; (c) PRG on validation failure [REJECTED — fights
  core, high blast radius]; (d) do-nothing [REJECTED — reproduced lost-update].
- **P5:** FINDING-064 registered; ship #19 ON HOLD pending Arun ruling (ride interim-a in #19 vs
  sibling CP for authoritative-b + D4).

No code changed; no staging; read-only git. STOP after P5.

---

# INCREMENT 2b — FULL LOCK UX + F-064 AUTHORITATIVE FIX (overnight 2026-08-02→03)

## S0 SYNC (verified)
- HEAD `e2e263c` (new hash after 9ffef72) — CP-FE-LOCK Wave 3.3 server package. Tracked tree CLEAN
  (only untracked *.log/artifacts). Branch fix/finding-016-validator, local == origin.
- Ship #19 = 10 files, 579 insertions (mosaic.services.yml, FrontendSaveController, LayoutLockController,
  MosaicHooks, MosaicLayoutWidget, MosaicLayoutLockManager + 4 Kernel tests). F-050/063/054 CLOSED,
  F-064 registered known-open riding 2b. ✓
- ARUN RULINGS: 'sibling ratified' — (b) lock-nonce APPROVED; admin-form semantics change RATIFIED
  (allow-when-unlocked → **require live self-lock** on the admin node-form save path only);
  walk-catch #18 — lock banner unstyled → must be Drupal-admin-native (Claro messages--warning), rides 2b.

## B0 DERIVATION (truth tables — written before code)

### F-064 nonce (admin node-form save path; #element_validate; interactive-only)
| Scenario | lock state at SAVE | submitted nonce | OLD (allow-when-unlocked) | NEW (require live self-lock) |
|---|---|---|---|---|
| self-held, in-session save | self-held, token T | T | allowed | **allowed** |
| foreign-held active | other holds | (none/any) | rejected | **rejected** (holder named) |
| stale resubmit AFTER holder released | unlocked (NULL) | empty/old | **allowed (BUG F-064)** | **rejected** (no live self-lock) |
| self re-acquired new session | self-held, token T2 | old T1 | allowed | **rejected** (token mismatch) |
| programmatic $entity->save() / drush / migration | any | n/a | untouched | **untouched** (validate never fires) |

Mechanism: token minted at acquire, preserved across heartbeats (stable per session), regenerated on
fresh acquire after release. `isValidSelfLockToken()` = live self-lock AND hash_equals(token, nonce).
Widget seeds the hidden `lock_nonce` from the current self-lock token; client (D2/D3) acquires on open
and writes the returned token into it. hash_equals for constant-time compare.

### F-051 admin block-state (client, Puck)
| Lock state | Puck editing | Save/submit | Banner |
|---|---|---|---|
| unlocked → acquire on open | enabled | allowed (nonce set) | none |
| held-by-other | **disabled (read-only)** | **submit intercepted (preventDefault)** | warning + Break (if break_lock) |
| break/takeover → re-acquire | re-enabled | allowed (new nonce) | cleared |
| self-lock expired mid-edit | disabled on next poll | intercepted | warning "session expired, reopen" |

### F-049 FE dialog lock (client, FrontendBuilderDialog)
| Event | Action |
|---|---|
| dialog open | acquire lock (POST); on 200 store token for save payload |
| held-by-other (409 on acquire) | blocked UI (dialog shows locked state); Break button gated on has_break_lock |
| Break clicked | POST break → re-acquire → unblock |
| dialog close / unmount | release lock (DELETE) |
| acquire 409 / expiry / takeover | reflect via status poll; block or re-acquire |

### Banner geometry (walk-catch #18) — both surfaces
Claro messages--warning pattern: warning icon, warning background/border, standard message padding,
proper admin `<button class="button">` for Break. boundingBox oracles: banner visible & non-zero
size; positioned above the canvas (top edge < canvas top or within header band); Break button inside
the banner; NO overlap with the canvas mount / Puck toolbar.


## C1 + D1 — F-064 lock-nonce authoritative fix (COMPLETE, GREEN)
- **C1 RED** (tests/w33-2b-c1-nonce-red.log): stale-resubmit-after-release + self-held-without-nonce
  both FAIL today ("Failed asserting that false is true") — allow-when-unlocked lets them through.
- **D1 implement:** MosaicLayoutLockManager mints a per-session `token` at acquire (preserved across
  heartbeats, regenerated on fresh acquire after release) + new `isValidSelfLockToken()` (live
  self-lock AND hash_equals(token,nonce)). MosaicLayoutWidget adds a hidden `lock_nonce` (seeded from
  the current self-lock token) and validateJson now requires a valid live-self-lock nonce (ratified
  require-live-self-lock; foreign-held names the holder, otherwise "session expired, reopen").
  LayoutLockController::acquire returns `token` to the holder; status returns it owner-only (never to
  a non-owner — it authorises saves).
- **D1 GREEN** (tests/w33-2b-c1-nonce-green.log): MosaicLayoutWidgetNonceTest OK 6/6, 31 assertions
  (stale-resubmit rejected · self-held-no-nonce rejected · valid-nonce allowed · re-acquire replay
  rejected · foreign-held rejected · token stable across heartbeat).
- **Oracle change (ratified, ledgered old→new):** shipped MosaicLayoutWidgetLockTest —
  `testUnlockedFormSubmitHasNoError`(assertFalse) → `testUnlockedFormSubmitNowRejected`(assertTrue);
  `testSelfHeldFormSubmitHasNoError`(no nonce) → `testSelfHeldWithNonceHasNoError`(passes token).
  NOT a relaxation — a tightening driven by the ratified semantics. Field suite GREEN 20/20, 119
  assertions (tests/w33-2b-widget-green.log).
- FE path (FrontendSaveController) UNCHANGED — keeps allow-when-unlocked (fetch POST not
  browser-resubmittable; F-064 is admin-form-specific per P3). Semantics change is admin-form-only.

## D2/D3/D4/D5 — client lock UX + banner + dist (built, typechecked; browser held)
- **D2 admin (F-051):** BuilderApp writes the acquired session token into the hidden lock_nonce field
  (owner) / clears it (blocked); a not-allowed block-overlay covers the canvas when held-by-other;
  js/src/builder/index.tsx intercepts the node-form submit (preventDefault) while blocked. Existing
  banner + Break reused. LockStatus gains `token`.
- **D3 FE (F-049):** FrontendBuilderDialog acquires the lock on open, renders the shared banner
  (owner / locked-by-@name), gates Break on drupalSettings.mosaic.frontend.hasBreakLock, releases on
  close. FE save stays server-guarded (409) — non-save-breaking by construction.
- **D4 banner (walk-catch #18):** css/mosaic-lock.css — Claro messages--warning (colour, border,
  spacing, ✓ owner icon) + destructive Break button + block-overlay. Attached to BOTH the builder and
  frontend_editor libraries (identical on both surfaces).
- **D5 dist:** BUILDER FIRST then FRONTEND-EDITOR LAST (FINDING-035 manualChunks order). Node 16 too
  old for rolldown (styleText) → built under nvm node 22.21.1. builder.js 1.18MB + frontend-editor.js
  705KB rebuilt (Aug 3 00:32); grep confirms nonce+overlay in builder.js and lock lifecycle in
  frontend-editor.js. drush cr clean.
- **Verify:** typecheck PASS (tsc --noEmit, exit 0). Builder Vitest 362/363 — 1 PRE-EXISTING failure
  in MosaicPuckAdapter.test.ts (boolean→radio, module I did not touch), all LockManager/BuilderApp
  units green.

## E2 — regression
- Full mosaic **Kernel 111/111, 528 assertions** (tests/w33-2b-e2-kernel.log) — includes +6 nonce
  tests, oracle-updated widget tests, LayoutLockController token change (its tests still green).
- **Sentinels** 826/841/842/843/844 → all HTTP 200 (tests/w33-2b-e2-sentinels.log; 844 empty by design).
- **phpcs: 0 ERRORS** on all changed PHP (LayoutLockController fully clean). 22 LineLength WARNINGS on
  added docblock lines — consistent with the shipped baseline (MosaicHooks itself carries 1 error +
  10 warnings pre-existing). Error gate met; warnings can be reflowed in ship-prep if zero-warning is
  wanted.

## INCREMENT 2b — TALLIES
- PHP (ships, test-proven): MosaicLayoutLockManager (+token, +isValidSelfLockToken),
  MosaicLayoutWidget (+lock_nonce, validateJson require-live-self-lock), LayoutLockController
  (+token owner-only). Tests: +MosaicLayoutWidgetNonceTest (6), MosaicLayoutWidgetLockTest oracle.
- JS/CSS (built + typechecked; browser eye-test pending): LockManager.ts (+token),
  BuilderApp.tsx (+nonce/overlay/blocked), builder/index.tsx (+nonce write + submit intercept),
  FrontendBuilderDialog.tsx (+lock lifecycle), css/mosaic-lock.css (new), mosaic.libraries.yml (+2),
  js/dist/{builder,frontend-editor}.js rebuilt.
- Gates: Kernel 111/111 · Field 20/20 · Nonce 6/6 · typecheck PASS · Vitest 362/363 (1 pre-existing)
  · sentinels 5×200 · phpcs 0-err.
- HELD to eye-test (F-048): admin block geometry, FE lock lifecycle, banner boundingBox oracles,
  full admin-save nonce round-trip in a real browser.

## 12-LINE POINTER (increment 2b)
1. F-064 authoritative fix = lock nonce (ratified require-live-self-lock, admin form only).
2. Server: token minted at acquire, stable across heartbeats, hash_equals compare (isValidSelfLockToken).
3. Widget: hidden lock_nonce seeded from self-lock; validateJson rejects unless valid live self-lock.
4. Admin client MUST write the token into lock_nonce or legit admin saves fail — #1 eye-test item.
5. Block overlay + submit intercept engage only when locked && !owner (normal save path untouched).
6. FE path unchanged (allow-when-unlocked) — F-064 is admin-form-specific; FE D3 is UX only.
7. Banner restyled Claro messages--warning; css/mosaic-lock.css on both libraries.
8. Dist: builder first, FE last, under node 22 (node 16 breaks rolldown).
9. RED→GREEN proven on the nonce; shipped widget oracle updated (ratified tightening, not relaxation).
10. Kernel 111/111, sentinels 200, phpcs 0-err, typecheck PASS.
11. Browser lifecycle + geometry oracles HELD (F-048) → eye-test round 2.
12. mosaic_media still enabled on dev (BLOCK 2 sanction); walktester/uid3 + mosaic_tester fixture live.

---

# MORNING RIDERS (reviewer audit) — 2026-08-03

## R1 (Catch B) — the Vitest failure pre-exists
`git diff e2e263c -- js/src/builder/__tests__/MosaicPuckAdapter.test.ts js/src/builder/MosaicPuckAdapter.ts`
→ **EMPTY** (exit 0). shasums: test 5306f8d64f14 (wt) == 5306f8d64f14 (shipped); adapter 18f3a6c02cab ==
18f3a6c02cab. Both byte-identical to shipped e2e263c → we changed NEITHER → the boolean→radio failure
is pre-existing by definition, not introduced by increment 2b.

## R2 (Catch A) — owed e2e specs + smoke-alarm (js/e2e/lock-2b.spec.ts; HELD, local-only per F-048)
Ran under nvm node 22.21.1, --project=chromium (admin + editor auth setup). Real field is
`field_mosaic_layout`; node 332 (article) drives the admin surface; editor = mosaic_editor_e2e (uid2,
has update access). test.beforeEach breaks the lock (admin has break_lock) for isolation.
- **owner save persists @2b-nonce (GREEN):** admin opens /node/332/edit → owner banner → hidden
  lock_nonce carries a 32-hex token (web-first assertion) → node-form Save → success, no
  "session expired"/mosaic error. **Proves the #1 risk item: the client writes the nonce and the
  legit admin save round-trips.**
- **foreign-held save refused @2b-block (GREEN):** editor holds the lock → admin sees
  .mosaic-builder-block-overlay + .mosaic-lock-banner--locked, nonce field cleared to '', Save is
  intercepted (stays on /edit) — no overwrite.
- **banner geometry @2b-geometry (GREEN):** boundingBox oracles — banner visible, non-zero
  (height>10), sits above the canvas, no overlap, Break button inside the banner box; plus the
  load-bearing computed-style oracle backgroundColor === rgb(253,248,237) (Claro warning).
- **SMOKE-ALARM on the load-bearing oracle** (libraries.yml backup sha 04761db7…): reverted the
  builder-library `css/mosaic-lock.css` attach → drush cr → geometry oracle **RED**
  (backgroundColor = rgba(0,0,0,0), the walk-catch #18 unstyled failure) → restored byte-identical
  (sha match 04761db7…) → drush cr → **GREEN**. Logs: w33-2b-e2e-green.log, w33-2b-smoke-red.log,
  w33-2b-smoke-green.log.
- **Deferred (blocked, documented):** the live FE-dialog-open lifecycle e2e — MOSAIC_FE_ENABLED=0 on
  this env (FE edit trigger not rendered); not flipping a config flag unsanctioned. The FE banner
  reuses the SAME shared mosaic-lock-banner classes proven on the admin surface, and its
  acquire/release reuse the LockManager covered by the shipped lock.spec.ts.

## R3 (minor) — LineLength reflow → phpcs 0/0 on changed files
Reflowed our added docblock/comment lines to ≤80 across MosaicLayoutLockManager, MosaicLayoutWidget,
MosaicLayoutWidgetNonceTest, MosaicLayoutWidgetLockTest. Also reflowed a few PRE-EXISTING comment
lines in MosaicLayoutWidget (ERP-019 L138, P7-038 L532, UI-004 L564-567) since the reviewer asked for
zero warnings on the changed file (cosmetic-only, comments). **phpcs on all 5 changed PHP files:
0 ERRORS, 0 WARNINGS (exit 0)** — tests/w33-2b-r3-phpcs.log. Field Kernel re-run OK 20/20, 119
assertions (tests/w33-2b-r3-kernel.log) — reflow broke nothing.

---

## WALK-CATCH #19 / TEST-1 PROBE (read-only, no fixes) — 2026-08-03

Legit walktester save on node 826 refused: "edit session has expired or no longer locked to you."

- **Q1 watchdog:** NO admin-refusal entry — validateJson injects no logger and logs nothing; cannot
  distinguish no-live-self-lock vs token-mismatch. Only unrelated mosaic warnings ("Skipped a
  malformed Mosaic layout on node 844"). → LOGGING GAP.
- **Q2 heartbeat:** HEARTBEAT_INTERVAL_MS=30_000 (30s) re-POSTs acquire → setWithExpire refresh;
  TTL=90s. Started on the admin surface (BuilderApp acquire on mount). 3× margin → lock cannot die at
  human speed. Verdict: expiry is NOT the cause.
- **Q3 live:** node 826 lock HELD by uid=3 walktester, token d8a95597…(32ch), ~67s to expiry
  (heartbeat live). Scratch acquire proves the server mints a 32ch token. Arithmetic: 90 / 30 = 3
  refreshes per TTL → survives indefinitely under an open tab. So a LIVE self-lock with a token
  exists — the refusal is a NONCE MISMATCH (empty submitted nonce), not expiry.
- **Q5 parity:** page(826) + article(332) BOTH use the mosaic_layout widget; nonce read path
  [field_mosaic_layout,0,lock_nonce] is bundle-agnostic. No parity issue.
- **Root cause:** live lock + token (pre-2b heartbeat code) but empty nonce (new 2b write code
  absent) → Arun's window ran a STALE/cached builder.js. Old bundle acquires+heartbeats + shows the
  owner banner (all pre-2b) but never writes lock_nonce → empty nonce → require-live-self-lock
  refuses the legit save. e2e on 332 passed (fresh bundle). Registered FINDING-065; ship #20 FROZEN.

---

## WALK-CATCH #19 ADDENDUM PROBE (Z1–Z5, read-only) — 2026-08-08 — root cause CORRECTED

Stale-JS story DEAD. True mechanism: the SSE lock-status event omits the token; the client effect
clobbers its own server-seeded nonce to ''.
- **Z1 served==disk:** builder.js sha 1f6b8750… == served ?tjfmhc; both contain data-mosaic-lock-nonce.
  Fix present in served bytes: YES. Reviewer's hard-refresh cure prediction FAILED; Arun's STOP correct.
- **Z2 SSE omits token:** stream() lock-status payload = {locked,owner,uid,name,expires} — NO token
  (token only in acquire() L83 + status() L131). Client: LockManager openStream parses token-less
  event → emit → BuilderApp setLockStatus → effect onLockTokenChange(owner ? token??'' : '') writes ''.
- **Z3 server seeds nonce:** /node/826/edit as uid3 → lock_nonce #type=hidden #default_value=b10c3582…
  (= live token), data-mosaic-lock-nonce server-printed, parents match. No-JS save WOULD succeed;
  the client wipes it.
- **Z4 e2e blind:** beforeEach breaks lock → fresh acquire + fast save races past the SSE first-emit;
  never hits the steady-state wiped-nonce that Arun's held-since-yesterday session is always in.
- **Z5 verdict = "other": token-absent-on-SSE-refresh** → client effect clobbers the server-seeded /
  acquire-written nonce to ''. Server (seed + acquire + validateJson) is correct; the SSE payload +
  the unconditional client wipe are the bug. FINDING-065 corrected; ship #20 stays FROZEN.

---

## WALK-CATCH #19 FIX (ratified 'sse-fix') — 2026-08-08 — FIXED-PENDING-SHIP

Root cause (from Z-probe): SSE lock-status omits token → BuilderApp effect clobbers the nonce to ''.
Server-seed + acquire + validateJson were already correct.

**Y1 RED (tests/w33-2b-y1-sse-red.log):** new e2e @2b-sse-steady — register the lock-stream wait
before goto, let the SSE lock-status event land, THEN save. Today: save refused (page stays on
/node/332/edit) + nonce reads "" → RED. (Streaming makes a Kernel red-today impractical; the e2e is
the SSE oracle. Kernel viewerStatus is a green guard.)

**Y2 FIX (4 items):**
- SSE token owner-only — extracted MosaicLayoutLockManager::viewerStatus(); status() + stream() share it.
- BuilderApp effect writes the token only when present; never wipes a good nonce on a token-less owner
  update; still clears on blocked/released.
- validateJson logging — logger.channel.mosaic, one warning per refusal, distinguishes
  foreign-held / no-live-self-lock / token-mismatch (@type/@id/@field/@uid).
- Cache-bust — builder + frontend_editor `version: 1.0.1`; asset query tag tjfmhc→tjfq24.

**Y3 TALLIES (all GREEN):**
- e2e lock-2b: 4/4 — @2b-nonce, @2b-sse-steady (RED→GREEN), @2b-block, @2b-geometry (w33-2b-y3-e2e-green.log).
- Unit MosaicLayoutLockManagerTest: 23/23 (viewerStatus owner gets token, non-owner never).
- Field + Controller Kernel: 71/71, 284 assertions (logger-injected widget; status/stream refactor).
- Full mosaic Kernel: 111/111, 528 assertions (w33-2b-y3-kernel-full.log).
- Sentinels 826/841/842/843/844 → 5×200 (844 empty by design).
- phpcs on all changed PHP: 0 errors 0 warnings (exit 0).
- Dist: builder-first / FE-last under node 22; drush cr; query tag tjfmhc→tjfq24 (differs, confirmed).
- typecheck PASS.

Walk-catch #19 pending Arun re-walk (round 3); hard-refresh no longer required (cache-bust ships it).
Ship #20 source-ready, FIXED-PENDING-SHIP. Read-only git, nothing staged.

---

## EYE-TEST ROUND 3 PROBE (walk-catches #20–22, read-only) — 2026-08-08

FE dialog blocked-state. No fixes, no staging.
- **P1 (#22, claim-vs-reality):** F-049's "Break gated on drupalSettings.mosaic.frontend.hasBreakLock"
  is INACCURATE. grep: `has_break_lock` set ONLY by MosaicLayoutWidget.php:158 (admin, per-field);
  MosaicHooks entityView never sets `mosaic.frontend.hasBreakLock`. TSX reads it
  (FrontendBuilderDialog.tsx L112-114) → undefined. Live render node 826 uid1: `mosaic.frontend`
  ABSENT, no break flag in mosaicFrontendEdit. Verdict: NEVER-WIRED → FE Break is dead code.
- **P2 (#20):** FE dialog blocked-state = banner ONLY (no overlay / no Puck disable / no submit
  intercept — admin has all three). Server backstop confirmed: FrontendSaveControllerLockTest::
  testForeignHeldSaveReturns409 (foreign-held FE save → 409). No data loss; UX/defense gap.
- **P3 (#21):** admin locked banner has inline ⚠ (BuilderApp.tsx:464); FE dialog locked banner omits
  it (FrontendBuilderDialog.tsx:469). css/mosaic-lock.css has `--owner::before {content:"✓"}` but NO
  `--locked::before` and no base content → FE locked banner shows no icon.
- **P4 (#/F-067 candidate, low-sev):** green banner lingered >60s in window 2 after break. Candidate
  causes: SSE emits only on locked↔unlocked change (owner-takeover invisible); heartbeat `.catch`
  swallows 409 + silently re-acquires a freed lock; 28s reconnect gap. Probe-only.
- **P5:** registered FINDING-066 (#20/#21/#22) + F-049 correction (append-only) + FINDING-067 candidate.

Ship #20 (F-065 fix) UNAFFECTED — these are FE-dialog UX findings, separate from the admin nonce fix.
