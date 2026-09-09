# GRAND RECONCILIATION AUDIT — EVIDENCE APPENDIX (REPORT-GRAND)

Doctrine v2 step 2. Read-only. Companion to `AI/MASTER-AUDIT-GRAND.md` (the bible).
Every verdict in the bible traces to a witnessed line here. Subagent fan-out gathered leads
(4 Explore agents); every verdict-bearing claim below was implementer-witnessed by fresh-read.

> **FILENAME NOTE:** the directive named the output `AI/MASTER-AUDIT.md`, but that file already
> exists — a 1300-line prior audit "commissioned by Arun 2026-07-18", gitignored with NO git
> history (overwrite = unrecoverable) and cross-referenced by line number from TODO.md
> (L9802/9806/9809…). To avoid destroying it, the new bible is `AI/MASTER-AUDIT-GRAND.md`.
> The July-18 audit is preserved and used here as a G1 source. Arun: consolidate/rename as you wish.

---

## E0 — METHOD + SCOPE (witnessed)

- Module: `web/modules/custom/mosaic`, core `^11.1||^12`, version `1.0.1` (mosaic.info.yml:5-6).
- Surface (fresh-read counts): 26 routes, 6 permissions, ~23 services, 4 libraries, 90 src PHP
  classes, 81 js/src TS/TSX, 3 twig, 15 submodules.
- AI/ docs: TODO.md 10878 lines, FINDINGS.md 1816 (F-009..F-067), MASTER-AUDIT.md 1300 (July-18),
  MOSAIC.md 1999 lines (105KB, the spec/contract).
- Fan-out: Agent-A (AI/ mining), Agent-B (code markers), Agent-C (MOSAIC.md claims), Agent-D
  (structural + submodules + Arun's console catch). Their reports are leads; witnesses below.

## E1 — SECURITY SURFACE (witnessed — the F-050/F-063 "assume unenforced until witnessed" lens)

All 26 main-module routes fresh-read from mosaic.routing.yml. Findings:
- **All POST routes carry `_csrf_request_header_token: TRUE`.** ✓ (canvas.ssr, ssr_batch,
  render_preview, templates.save, resolve, entity_query_preview, lock.acquire/release/break,
  frontend.save, ai.generate, design_token import).
- **Per-entity routes use `_custom_access`** (not permission-only): lock.* (159-198),
  revision.list/get (228-238), frontend.save (252). WITNESSED the callbacks enforce per-entity:
  - `FrontendSaveController::access` → use_builder + entity `update` (F-050).
  - `LayoutLockController::access` → use_builder + entity `update` (F-063).
  - `RevisionController::access` (L61-68) → `$entity->access('update', $account, TRUE)`.
- **Entity-touching use_builder endpoints enforce view/access INSIDE the controller** (witnessed):
  - `ResolveController.php:104` → `if (!$entity->access('view', $this->currentUser))`.
  - `EntityQueryPreviewController.php:63` → `getQuery()->accessCheck(TRUE)->count()`.
  - `EntitySuggestController.php:111` → `->accessCheck(TRUE)` (×2), cache scoped per-user.
  → The entity-read/resolve/suggest/revision surface is access-enforced. Positive result.
- **`ExternalRestDataSource::isUrlAllowed()`** — SSRF allow-list from `mosaic.settings.external_rest_allowlist`,
  empty=block-all + `block_private_ranges` (Agent-C witnessed; MOSAIC.md L563 claim HOLDS).
- **Submodule `_access: 'TRUE'` endpoints are in-controller authed** (witnessed):
  - mosaic_collab document.get/save/revoke → Bearer token vs `Settings::get('mosaic_collab_api_token')`
    (CollabDocumentController:109-116, CollabRevocationController:90-94); token endpoint uses JWT
    secret (CollabTokenController:75-77). presence.join/leave require CSRF+permission.
  - mosaic_tokens git-webhook → HMAC-SHA256 `X-Hub-Signature-256` vs configured `webhook_secret`
    (TokenGitWebhookController:24-29). figma-sync is a SEPARATE route: `administer mosaic` + CSRF.
  - **Fail-open nuance (witness-flagged, unconfirmed):** collab bearer check and the git-webhook
    signature are both "if secret configured" — behaviour when the secret is UNSET needs a witness
    (fail-open vs fail-closed).
- **Prop/schema validation on write paths (F-016)** — validators ARE called: FrontendSaveController
  (5 refs), AiGenerateController (5), MosaicLayoutWidget::validateJson (7), entity_presave hook (6).

## E2 — PERMISSION-PARITY (witnessed — the disease that recurred 4×)

- **PHANTOM PERMISSION** — `mosaic_intelligence` (3 routes) + `mosaic_tokens` figma-sync (1 route)
  require `_permission: 'administer mosaic'` (a SPACE). Grep across the WHOLE install
  (`modules/` + `core/` *.permissions.yml) → **'administer mosaic' is declared NOWHERE.** The
  module declares `mosaic.administer`. Consequence: those 4 routes fail CLOSED to uid-1-only
  (undeclared perm ⇒ no role can hold it). Functional bug (delegated admins locked out of the
  intelligence scores API + figma-sync), LOW security (fails closed). Should be `mosaic.administer`.
- **DEAD PERMISSION** — `mosaic.manage_site_templates` (permissions.yml:16, restrict access:true)
  is enforced by NO route/controller/form/hook. Only reference is Sprint02SmokeTest.php asserting
  its declaration. Declared-but-unused.
- **FE break-lock parity (F-049/F-066, already caught)** — re-witnessed: only MosaicLayoutWidget:158
  sets `has_break_lock`; `drupalSettings.mosaic.frontend.hasBreakLock` is set by NO PHP; live render
  of node 826 as uid1 → `mosaic.frontend` ABSENT. FE Break button = dead code.

## E3 — CLAIMED-BUT-FALSE REGISTER (witnessed — Arun: hunt HARD)

| # | Claim (source) | Witness | Verdict |
|---|---|---|---|
| CBF-1 | MOSAIC.md L178/L1161-1191: "Schema.org JSON-LD auto — only Mosaic: Yes" + OG via hook_metatags_alter | grep json-ld/ld+json/metatags_alter/schema.org across all src+modules PHP → **0 hits** | **FALSE** — headline differentiator unimplemented |
| CBF-2 | MOSAIC.md L1336-1343: "Real-time collab via Mercure SSE, no Node.js, no WebSocket; Yjs diffs via POST /api/mosaic/yjs-sync, poll 3-10s" | route yjs-sync **absent**; useCollabProvider.ts:3 imports `HocuspocusProvider` (WebSocket) + collab-server/server.mjs Node sidecar | **FALSE** — wrong transport entirely |
| CBF-3 | MOSAIC.md L1209-1214/1628: WCAG 2.5.7 keyboard DnD "via dnd-kit KeyboardSensor" | `dnd-kit` in js/package.json → **count 0** (Puck uses Pragmatic DnD) | **FALSE** — a11y guarantee pinned to absent lib |
| CBF-4 | MOSAIC.md L1083/L1497: `mosaic.breakpoints.yml` shipped; L980 `mosaic.breakpoint_group.{id}` config entity | file **absent**; no breakpoint Entity class; not in config/schema | **FALSE** — both absent |
| CBF-5 | MOSAIC.md L1244: "builder ENFORCES requires_alt_text — cannot save without alt text" | grep requires_alt_text across src+modules → **0 hits** | **FALSE** — a11y enforcement unimplemented |
| CBF-6 | MOSAIC.md L962/L965: routes `GET|POST /api/mosaic/layout/{type}/{id}` + `POST /api/mosaic/preview` | full routing.yml fresh-read (26 routes) — **neither exists** (actual: /mosaic/render-preview) | **FALSE** — phantom routes |
| CBF-7 | MOSAIC.md L1711: submodule `mosaic_starter_components`, "25+ components" | disk: submodule is `mosaic_components`, ~12 components | **FALSE** — wrong name + count |
| CBF-8 | MOSAIC.md L1552-1564/L698: shipped components `mosaic-hero`/`mosaic-card-grid`/`mosaic-rich-text` in root `components/` | no root `components/`; those component ids absent | **FALSE** — running example is fictional |
| CBF-9 | MOSAIC.md L1540/L1674: `MosaicGlobalComponent` entity + `Entity/ComponentPackage.php` | src/Entity has only DesignTokenSet/GlobalTemplate/Template; neither class exists | **FALSE** (note orphan `mosaic.global_component.*` schema exists) |
| CBF-10 | MOSAIC.md L1994: JSON-schema via `opis/json-schema` | composer.json requires no JSON-schema pkg; validator uses `justinrainbow/json-schema` | **FALSE** — wrong dependency named |
| CBF-11 | (already caught) F-049 "Break gated on drupalSettings.mosaic.frontend.hasBreakLock" | flag never set by PHP (E2) | **FALSE** — re-scoped F-066 |
| CBF-12 | Route-permission `administer mosaic` on 4 submodule routes | undeclared anywhere (E2) | **FALSE gate** (phantom perm) |

Plus internal doc contradictions (Agent-C leads, lower priority): undo model (Zustand vs command-delta,
L822 vs L1761); breakpoint override key (`responsive` vs `breakpoint_overrides`, L1101 vs L1068);
config-entity naming (`mosaic.template` vs `mosaic_global_template`, L396/L457/L979); scaffold `5
permissions/7 routes/8 services` counts (L59-61) all wrong vs actual 6/26/~23.

## E4 — STUBS / PARTIAL / DEAD (witnessed via Agent-B leads, spot-confirmed)

- **LighthouseAuditWorker.php:60-68** — `processItem()` logs only; no audit, no score persist
  ("Sprint 60 adds score persistence once schema defined"). Intelligence Lighthouse scoring is a
  SHELL end-to-end (needs an external Node worker that doesn't exist on this env).
- **MosaicRenderContext.php:74** — `breakpoint = 'default'` hardcoded; server-side request-based
  breakpoint detection unimplemented ("Sprint 06").
- **MosaicPropValidator.php:113-117** — required-prop non-empty check DELIBERATELY skipped for all
  sentinel values (FINDING-023 guard) — a documented validation blind spot.
- **MosaicCanvasBridgeHooks.php:44-47** — empty placeholder hook (Canvas ≥2.0).
- **Stale comments:** MosaicLayoutFormatter.php:26-28 calls the fully-implemented MosaicRenderer a
  "stub"; MosaicPackageInstaller.php:87-90 says install "deferred" but the body implements it.
- Code markers overall: **zero TODO/FIXME/@deprecated** in code scope (clean); the volume is
  sprint/finding traceability IDs.

## E5 — ARUN'S CONSOLE CATCH (witnessed via Agent-D + route read)

`api/mosaic/intelligence/scores/node/826` → `ERR_NAME_NOT_RESOLVED`. Root cause is **client-side**,
not the subsystem: `LighthouseScoreController::getScore` (mosaic_intelligence:49-52) only reads a
local DB table — NO external call. The fetch uses `basePath = drupalSettings.path.baseUrl`
(builder/index.tsx:191); a DNS failure means `$base_url` in settings.php carries an absolute
non-local host. Endpoint itself would return `{score:null}` (HTTP 200) locally. NOTE it's gated by
the phantom `administer mosaic` perm (E2) → uid1-only. Lighthouse scores never populate on this env
(worker stub + no external Node worker) — env-blocked + partial.

## E6 — ENV CONTEXT (witnessed — the walk/test-blocked axis)

Enabled mosaic modules on dev: **mosaic, mosaic_builder_ui, mosaic_components, mosaic_intelligence,
mosaic_media, mosaic_webform**. DISABLED (present on disk, unwalkable/untestable without enabling):
mosaic_acsf, mosaic_canvas_bridge, mosaic_collab, mosaic_commerce, mosaic_metatag,
mosaic_paragraphs, mosaic_registry, mosaic_search, mosaic_tokens, mosaic_views.
`MOSAIC_FE_ENABLED=0` in js/.env.e2e (frontend-editor trigger off for e2e). ai.enabled:false default.

## E7 — SUBMODULE REAL-VS-STUB + TEST DESERT (Agent-D lead, structure-witnessed)

Real/substantial: mosaic_collab (9 PHP + Node server), mosaic_registry (8), mosaic_components (12
SDC), mosaic_tokens (7), mosaic_intelligence (6). Thin/stub: mosaic_acsf (shell scripts only, no
PHP), mosaic_builder_ui / mosaic_canvas_bridge / mosaic_webform (single class). **Test coverage in
submodules: essentially ZERO — only mosaic_paragraphs ships a PHP test.** The real suite lives at
top-level tests/ + js __tests__.

## E8 — FINDINGS ↔ SHIP RECONCILIATION (witnessed backbone + ship commits)

Ships #15–#20 (TODO ledger): #15 CP-SDC-PROPS, #16 CP-LAYOUT-HARDENING (F-058), #17 CP-DOC-TRUTH
(F-044/045), #18 CP-DOC-PERMS (F-061), #19 working-tree e2e263c (F-050/054/063), #20 9b94fca
(F-064/065, walk-catch #18, F-049/051 as-built). **FINDINGS.md is STALE post-ship:** F-050/054/058/
061/063/064/065 still read "FIXED-PENDING-SHIP"/"FULLY-VERIFIED" though shipped in #16–#20 → should
read CLOSED/SHIPPED. F-016 reads "OPEN rc4-BLOCKER" but validators are live on write paths (E1) →
overstated/stale. Doc-debt for the truth pass.

## E0 — METADATA CORRECTION (2026-08-08, reviewer catch)
MOSAIC.md line count was reported as 1999 (a subagent lead, not witnessed). Witnessed `wc -l` pre-Wave-A
= **2031**. No verdict depended on the total. The A-V (implementer-witness) rule now applies to
metadata too, not just verdict-bearing claims.
