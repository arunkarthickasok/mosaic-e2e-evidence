# MOSAIC GRAND RECONCILIATION AUDIT — THE CAMPAIGN BIBLE

**Doctrine v2, step 2. Authored 2026-08-08. Read-only audit — no code changed, nothing staged.**
Evidence appendix: `AI/REPORT-GRAND.md`. Prior audit (superseded-but-preserved): `AI/MASTER-AUDIT.md`
(July-18). Method: 4 read-only Explore subagents gathered leads; **every verdict below was
implementer-witnessed by fresh-read** (A-V rule). Verdicts trace to REPORT-GRAND E0–E8.

> **⚠ FILENAME RULING NEEDED (Ruling R1).** The directive said write `AI/MASTER-AUDIT.md`, but that
> file already exists (1300-line July-18 audit, gitignored, unrecoverable, cross-referenced by line
> number from TODO.md). Overwriting would destroy it. This bible is therefore `AI/MASTER-AUDIT-GRAND.md`.
> Arun: keep both, or archive July-18 (`mv MASTER-AUDIT.md MASTER-AUDIT-2026-07-18.md`) and rename this.

---

## 1. EXECUTIVE STATE OF THE PRODUCT (honest)

Mosaic is a **large, genuinely-built** Drupal 11/12 visual builder: a React/Puck admin canvas,
Twig-first server rendering, 7 data-source types, edit-locking (now enforced), revisions, AI layout
generation, 15 submodules. The **code security posture is markedly better than the F-050/F-063
scare implied** — the entity-access surface is broadly enforced (E1). The **product-truth posture
is the problem**: the spec (MOSAIC.md) is a pre-build planning narrative that never caught up to the
build and now contains **12 witnessed false/fictional claims** (E3), and the ledgers (FINDINGS.md)
are **stale post-ship**.

By the numbers (witnessed):
- **Surface:** 26 routes, 6 permissions, ~23 services, 4 libraries, 90 PHP classes, 81 TS files, 15 submodules.
- **Findings:** F-009..F-067 registered (F-001..008 never entered). ~20 OPEN, ~7 shipped-but-marked-pending (stale), 1 candidate (F-067), rest closed.
- **Ships:** #15–#20 complete; **Wave 3.3 CLOSED** (22 Arun walk-catches).
- **Tests:** strong at top level (Kernel 111/111, Unit 23/23, lock-2b e2e green); **submodule test desert** — 14/15 submodules have ZERO PHP tests.
- **CLAIMED-BUT-FALSE: 12 witnessed** (the single biggest debt).
- **Security:** entity-access enforced broadly; 1 phantom-permission functional bug; 1 dead permission; 2 fail-open-when-secret-unset nuances to witness.
- **Env:** 6 of 15 submodules enabled on dev; 10 disabled (unwalkable without enabling); FE editor off (MOSAIC_FE_ENABLED=0); AI off by default.

**Blunt read:** the *code* is closer to tag-ready than the *paper* is. The gating work to tag is
(a) a **doc-truth pass** (de-lie MOSAIC.md, refresh FINDINGS), (b) **permission-parity cleanup**,
(c) the **known functional queue** (F-066/067, Wave 3.4), (d) **test-desert closure**, then
(e) **a full walk-round-4 soak** across the disabled submodules. No tag until the paper stops lying.

---

## 2. CLASSIFIED REGISTER

### 2A — CLAIMED-BUT-FALSE (witnessed; REPORT-GRAND E3) — HIGHEST PRIORITY
| # | Claim | Reality | Ref |
|---|---|---|---|
| CBF-1 | Schema.org JSON-LD auto ("only Mosaic: Yes") + OG via hook_metatags_alter | **0** implementation anywhere | E3 |
| CBF-2 | Collab: Mercure SSE, no Node.js, no WebSocket, `/api/mosaic/yjs-sync` polling | Hocuspocus **WebSocket** + Node sidecar; route absent | E3 |
| CBF-3 | WCAG 2.5.7 keyboard-DnD via dnd-kit KeyboardSensor | dnd-kit **not installed**; a11y guarantee unbacked | E3 |
| CBF-4 | `mosaic.breakpoints.yml` + `mosaic.breakpoint_group` entity shipped | both **absent** | E3 |
| CBF-5 | Builder ENFORCES `requires_alt_text` (cannot save w/o alt) | **no** such enforcement | E3 |
| CBF-6 | Routes `/api/mosaic/layout/{type}/{id}` + `/api/mosaic/preview` | **phantom** (26-route read) | E3 |
| CBF-7 | Submodule `mosaic_starter_components`, 25+ components | is `mosaic_components`, ~12 | E3 |
| CBF-8 | Components `mosaic-hero`/`-card-grid`/`-rich-text` (the running example) | **fictional** | E3 |
| CBF-9 | `MosaicGlobalComponent` + `ComponentPackage` entity classes | **absent** (orphan schema only) | E3 |
| CBF-10 | JSON-schema via `opis/json-schema` | uses `justinrainbow/json-schema` | E3 |
| CBF-11 | FE Break gated on `drupalSettings.mosaic.frontend.hasBreakLock` | flag never set → dead (F-049/F-066) | E2 |
| CBF-12 | 4 submodule routes gate on `administer mosaic` | **phantom permission** (undeclared) | E2 |
Plus ~6 internal doc contradictions (undo model, breakpoint key, config-entity name, scaffold counts).

### 2B — SECURITY & PERMISSION-PARITY (witnessed; E1/E2)
| Item | Verdict | Ref |
|---|---|---|
| CSRF on all POST routes | ENFORCED ✓ | E1 |
| Per-entity `_custom_access` on lock/revision/frontend-save | ENFORCED (update access) ✓ | E1 |
| Resolve/EntityQuery/EntitySuggest entity access | ENFORCED (`access('view')`/`accessCheck(TRUE)`) ✓ | E1 |
| ExternalRest SSRF allow-list | ENFORCED ✓ | E1 |
| collab/webhook `_access:TRUE` endpoints | Bearer/HMAC in-controller ✓ (fail-open-when-unset: WITNESS) | E1 |
| Prop/schema validation on write paths (F-016) | validators live on all 4 paths → F-016 status STALE | E1 |
| `administer mosaic` phantom perm (4 routes) | FUNCTIONAL BUG (uid1-only), fix→`mosaic.administer` | E2 |
| `mosaic.manage_site_templates` | DEAD permission (enforced nowhere) | E2 |
| TemplateSaveController ownership/overwrite | permission-only; NO witnessed owner guard → WITNESS | E1 |
| F-052 PHP race in LockManager::acquire | OPEN (registered) | FINDINGS:1017 |

### 2C — PARTIAL / STUB / DEAD-CODE (witnessed; E4)
- **PARTIAL:** Lighthouse scoring (LighthouseAuditWorker logs only + no external Node worker on env);
  server-side breakpoint detection (RenderContext hardcoded 'default'); prop-validator sentinel
  non-empty blind spot (FINDING-023).
- **DEAD/PLACEHOLDER:** MosaicCanvasBridgeHooks (empty hook); FE Break button; manage_site_templates
  perm; 'administer mosaic' gate.
- **STALE COMMENTS:** MosaicLayoutFormatter:26-28 ("renderer stub" — it's fully built);
  MosaicPackageInstaller:87-90 ("deferred" — body implements it).

### 2D — UNPLANNED-EXISTS (DRIFT — built, undocumented in MOSAIC.md) — DOC DEBT
AI generation (routes/services/dialog) absent from architecture doc; FE dialog surface; PresenceAvatars;
LighthouseScorePanel; 12 of 15 submodules unnamed in the spec; SIDECAR_KEYS 10 not 8; device-preview.

### 2E — SHIPPED-VERIFIED (in-tree + tested + walked)
CP-FE-LOCK Wave 3.3 (F-050/054/063/064/065) — ships #19/#20, Kernel 111/111 + lock-2b e2e, walked
3 rounds. Builder core, Twig-first render, empty-prop guards (F-018), doc-truth ships #17/#18
(F-044/045/061). Ships #15 (SDC props) / #16 (layout hardening F-058).

### 2F — SHIPPED-UNTESTED / SHIPPED-UNWALKED (risk)
- **14/15 submodules: ZERO PHP tests** (only mosaic_paragraphs).
- Endpoints without e2e: canvas.ssr, resolve, entity_query_preview, ai.generate, revision.*, templates.*.
- **10 disabled submodules never walked on this env** (collab, tokens, views, search, paragraphs,
  commerce, metatag, canvas_bridge, acsf, registry).
- FE dialog surface (MOSAIC_FE_ENABLED=0 — unwalked here).

### 2G — OPEN FINDINGS (from witnessed FINDINGS backbone)
Product/rc: F-013, F-016(stale?), F-019, F-020, F-027, F-028(admin residue), F-029, F-030.
Deferred waves: F-034/F-036/F-057(W5.2), F-035(W3.2), F-055/F-056(W3.4).
Ratification-pending: F-037/038/039/040/041/042. Test/infra: F-048(e2e gitignored), F-052(lock race),
F-053(skipped tests), F-059(flaky). Design: F-060, F-062, F-066. Candidate: F-067.

---

## 3. WALK ROUND 4 CHARTER (untested/unwalked → what Arun must eye-test)

**Enable-then-walk (currently disabled on dev):**
1. `mosaic_collab` — 2-session real-time edit + presence + break/takeover (also tests F-067 live).
2. `mosaic_tokens` — DTCG import (web), Figma sync, git-webhook (HMAC).
3. `mosaic_views` / `mosaic_search` / `mosaic_paragraphs` / `mosaic_commerce` — data-source binding + render.
4. `mosaic_metatag` — per-layout metatag override (and the missing Schema.org — CBF-1).
5. `mosaic_registry` — component registry / CEM / MCP API.
6. `mosaic_canvas_bridge` — coexistence with Drupal Canvas.

**Enabled-but-unwalked / broken:**
7. FE inline-edit dialog (enable MOSAIC_FE_ENABLED) — F-066 blocked-state, banner icon (#21), break parity.
8. `mosaic_intelligence` Lighthouse scores panel — currently non-functional (stub worker + phantom perm + client base_url); walk after fix.
9. `mosaic_media` full picker walk (F-054 verified render, not full journey).
10. AI layout generation (enable ai.* or exercise rule-based fallback).

**Security walks:** phantom-perm delegated-admin test; template overwrite by a second create_templates
user; collab/webhook behaviour with secret UNSET.

---

## 4. DRAFT ROADMAP — HERE TO TAG (⚠ DRAFT — RATIFICATION IS ARUN'S)

Reconciles the July-18 A4 (Waves 0-5→rc4, ratified) + the current OPEN QUEUE + this audit's
discoveries. Ranked by risk/leverage. Test-Coupling + Permission-Parity rules apply to every wave.

- **WAVE A — DOC-TRUTH PASS (BLOCKER, cheapest-biggest).** Fix/de-claim the 12 CLAIMED-BUT-FALSE in
  MOSAIC.md (delete fictional features or build them — see Ruling R3); refresh FINDINGS.md stale
  statuses (bulk-close shipped F-050/054/058/061/063/064/065; reconcile F-016); document the DRIFT
  features (2D). No code beyond doc + status. (= prior A4 WAVE 0 + roadmap EPIC 0.)
- **WAVE B — SECURITY/PERMISSION CLEANUP.** `administer mosaic`→`mosaic.administer` (4 routes);
  decide manage_site_templates (wire or remove); witness+fix fail-open-when-secret-unset on
  collab bearer + git-webhook; TemplateSave ownership/overwrite; F-052 lock race + Kernel test.
- **WAVE C — KNOWN FUNCTIONAL QUEUE.** F-066 (FE blocked-state parity + break wiring), F-067
  (confirm via 2-window e2e → fix SSE owner-change detection + heartbeat 409 handling), Wave 3.4
  (F-055 sentinel access-check, F-056 media usage tracking), F-059 (flaky baseline).
- **WAVE D — TEST-DESERT CLOSURE.** Submodule test coverage (14 modules, 0 tests → at least access +
  smoke per real submodule); e2e for the untested endpoints (2F); resolve F-048 (js/e2e gitignore).
- **WAVE E — DESIGN CAMPAIGN.** F-066 #21 icon (CSS `--locked::before`), Arun's disabled-button-message
  idea, F-037 (template search/filter) / F-060 (prop-panel label loss) / F-062 riders.
- **WAVE F — DEFERRED DURABLE FIXES.** Wave 3.2 (F-035 @layer-order real fix), Wave 5.2 (F-034
  shared-dist, F-057 mosaic_image), F-046-B (strip renderer.js from anon).
- **WAVE G — WALK ROUND 4 FULL SOAK** (§3 charter, all submodules enabled) → **then rc → Arun soak → TAG.**

Sequencing: paper before code (Oracle Rule); security + parity before feature polish; tests lock each
wave. The July-18 estimate ("rc4 in 4-7 weeks from 07-19") is now stale — re-estimate after Ruling.

---

## 5. OPEN RULINGS NEEDED FROM ARUN (consolidated)

- **R1 — Filename:** keep `MASTER-AUDIT-GRAND.md` separate, or archive July-18 and rename this to `MASTER-AUDIT.md`?
- **R2 — Doc-truth scope:** for each CLAIMED-BUT-FALSE (Schema.org JSON-LD, alt-text enforcement,
  dnd-kit keyboard a11y, breakpoints.yml/entity, phantom routes): **DE-CLAIM** (delete from spec) or
  **BUILD** (implement to match)? These decide whether Mosaic ships those differentiators.
- **R3 — Phantom permission:** ratify `administer mosaic` → `mosaic.administer` on the 4 submodule routes.
- **R4 — Dead permission `manage_site_templates`:** wire it (site-template management enforcement) or remove it?
- **R5 — FINDINGS refresh:** authorize bulk-closing shipped findings (F-050/054/058/061/063/064/065) → CLOSED.
- **R6 — F-016 rc4-blocker:** is it truly still OPEN, or close it (validators witnessed on all write paths)?
- **R7 — mosaic_intelligence Lighthouse:** in-scope for tag (needs external Node worker) or cut/park?
- **R8 — Disabled submodules (10):** which are tag-scope vs experimental/cut? (collab/tokens/views/
  search real; commerce/canvas_bridge/acsf/registry/metatag/paragraphs — decide.)
- **R9 — Roadmap ratification:** approve/reorder Waves A–G; re-estimate to tag.
- **R10 — Fail-open nuance:** should collab-bearer / git-webhook FAIL CLOSED when the secret is unset?

---

*End of bible. This document is a DRAFT constitution for Arun's cold read + ratification. Nothing here
is ratified. No ledger status was changed by this audit (read-only); WAVE A will apply the corrections.*
