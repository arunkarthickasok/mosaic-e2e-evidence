# THE MOSAIC BIBLE — project constitution

**Authored:** 2026-08-08 (post Wave-A doc-truth pass). **Owner:** Arun Karthick.
**Ratification record:** Grand Reconciliation Audit rulings **R1–R10, ratified by Arun 2026-08-08**
("ratify all as recommended") — see §P4 and `AI/MASTER-AUDIT-GRAND.md` §5.

> **THE REPO OVERRULES THIS FILE.** Live truth lives in `AI/TODO.md` (ledger), `AI/FINDINGS.md`
> (findings), and git (code). This bible is a stable orientation document; it changes ONLY by
> Arun-ratified amendment. If this file and the repo disagree, the repo is right and this file is
> stale — fix this file.

---

## P1 — GOVERNANCE ABSOLUTES (compact; full text in `AI/Mosaic-ai-working-agreement.md` (historical governance — where it conflicts with campaign practice recorded in AI/TODO.md, the ledger wins) + iron-laws)

1. **Three-party system.** Arun (owner/decider/hands) · Claude windows (build/audit, one task at a
   time) · the repo (source of truth). No window trusts another window's memory — only the repo.
2. **Git law — Arun's hands only.** Claude NEVER `git commit`/`git push`/stages. Claude prepares;
   Arun ships. Every ship is a numbered ceremony in TODO.md.
3. **Sanction word for DB/config writes.** No database or config write without Arun's explicit
   sanction word in the triggering message. Read-only by default.
4. **Fresh-read rule (absolute).** Never assert a file/line/route/flag exists from memory — quote a
   fresh tool read. Every de-claim quotes current text + witnessed reality first.
5. **Eye-test before every ship.** Arun walks the change in a real browser before the ceremony.
   Automated green is necessary, not sufficient.
6. **Append-only ledgers.** FINDINGS/TODO entries are appended, never rewritten; corrections are new
   entries that supersede.
7. **Attribution law.** Public attribution (drupal.org, commits, releases) carries **Arun's name
   only — never AI**. Mosaic is Arun's work.
8. **RED→GREEN + Test-Coupling.** Fix + spec + exhaustive derived tests ship together; prove the
   test bites the fix (smoke-alarm) where feasible. Permission-Parity dimension in every derivation.

---

## P2 — PRODUCT SOUL

**One-line strategy:** a free, self-hosted, Twig-first visual page builder for Drupal 11/12 — the
architecture is strong (9/10); the campaign is about closing **market fit (5/10)**: instant demo,
AI assist, a headless path, governance (i18n/moderation/security), and a spec that tells the truth.

**The three personas (who we build for):**
| Persona | Who | Buys on | What kills adoption |
|---|---|---|---|
| **P1 Content Author** | Non-technical editor (gov/enterprise), daily builder use | "Build a page in 10 min, no IT ticket" | props-hunting, no inline edit, broken search, no AI assist |
| **P2 Developer / Site Builder** | Drupal dev evaluating Mosaic vs Canvas vs Paragraphs (~30 min trial) | "installs clean, demos instantly, headless + D12 + migrations" | no demo recipe, DB bloat at scale, no decoupled path, doc drift |
| **P3 Client / Decision-Maker** | Gov IT director / agency PM / procurement | "translation, workflow, a11y, security coverage, who maintains it" | missing multilingual/moderation, single-maintainer risk, no stable release |

**Feature-vision map (honest status, post Wave-A):**
| Capability | Status |
|---|---|
| Puck admin builder, Twig-first render, 7 data-source types | DONE |
| Edit-locking (both save paths enforced), revisions | DONE (Wave 3.3) |
| Frontend inline-edit dialog | DONE (blocked-state parity gap open — F-066) |
| AI layout generation (OpenAI-compatible, rule-based fallback) | DONE, off by default |
| Real-time collab (Yjs + Hocuspocus WS + SSE presence fallback) | DONE (mosaic_collab; unwalked on dev) |
| Design tokens (DTCG import, Figma/git sync) | DONE (mosaic_tokens; experimental sync surfaces) |
| Media Library bridge, a11y axe panel, device preview | DONE |
| Schema.org JSON-LD / OG auto-emission | PLANNED (RC-A1) |
| Save-blocking alt-text enforcement | PLANNED (RC-A2) |
| WCAG 2.5.7 keyboard-drag verification | PLANNED spike (RC-A3) |
| Admin-configurable breakpoints | PLANNED (fixed 4-bp set today) |
| Reusable global-component entity | PLANNED (global TEMPLATES ship today) |
| View Display component with full contextual-filter source matrix | PLANNED (ratified) |
| Lighthouse scoring (mosaic_intelligence) | EXPERIMENTAL (needs external Node worker; parked for tag) |
| Multilingual + Content Moderation stance | ADR pending (P3 gating) |
| Headless/decoupled path | roadmap (P2 differentiator) |

---

## P3 — STATE OF THE PRODUCT (post Wave-A, witnessed)

**Surface:** 26 routes · 6 permissions · ~23 services · 4 libraries · 90 PHP classes · 81 TS files ·
15 submodules (10 tag-scope, 5 experimental — R8).

**Ships:** ~20 ceremonies; latest #15–#20 (SDC-props, layout-hardening, doc-truth×2, CP-FE-LOCK Wave
3.3). **Wave 3.3 CLOSED**, 22 Arun walk-catches.

**Findings:** F-009..F-067. Wave A bulk-closed the shipped set (F-050/054/058/061/063/064/065) +
F-016 (validators witnessed) + F-062. Remaining open: product (F-013/019/020/027/028/029/030),
deferred waves (F-034/035/036/055/056/057), ratification-pending (F-037..042), infra
(F-048/052/053/059), design (F-060/062→closed/066), candidate (F-067).

**Security posture (witnessed, better than the F-050 scare implied):** CSRF on all POST; per-entity
`_custom_access` on lock/revision/frontend-save; Resolve/EntityQuery/EntitySuggest enforce
`access`/`accessCheck(TRUE)`; SSRF allow-list on ExternalRest; collab/webhook endpoints bearer/HMAC
authed. Open items: phantom `administer mosaic` perm (→ Wave B), dead `manage_site_templates`
(→ Wave B), fail-open-when-secret-unset nuance (→ Wave B, R10), TemplateSave ownership, F-052 race.

**Test-desert:** strong top-level suite (Kernel 111/111, Unit 23/23, lock-2b e2e); **14/15 submodules
have ZERO PHP tests** (→ Wave D).

**Walk Round 4 charter (§3 of MASTER-AUDIT-GRAND):** enable + walk the 10 tag-scope submodules
(esp. collab 2-session, tokens sync, data-source submodules), the FE dialog (F-066), media picker,
AI generation. Security walks: delegated-admin (post phantom-perm fix), template overwrite, unset-secret.

---

## P4 — RATIFIED ROADMAP (Waves A–G, R-outcomes baked in; est. 3–4 weeks to tag — R9)

- **WAVE A — DOC-TRUTH (COMPLETE, pending ship #21).** 12 CBF de-claimed/corrected, FINDINGS refreshed,
  Reality Addendum added. Paper-only. R1(keep both audits)/R2(3 roadmap candidates)/R5/R6/F-062 applied.
- **WAVE B — SECURITY & PERMISSION CLEANUP.** R3: `administer mosaic`→`mosaic.administer` (4 routes).
  R4: WIRE `manage_site_templates`. R10: FAIL CLOSED on unset collab/webhook secrets. + TemplateSave
  ownership, F-052 lock race + Kernel test.
- **WAVE C — FUNCTIONAL QUEUE.** F-066 (FE blocked-state parity + break wiring + #21 icon), F-067
  (2-window e2e → SSE owner-change detection + heartbeat 409 handling), Wave 3.4 (F-055/056), F-059.
- **WAVE D — TEST-DESERT CLOSURE.** Access + smoke tests per real submodule; e2e for untested
  endpoints; resolve F-048 (js/e2e gitignore).
- **WAVE E — DESIGN CAMPAIGN. Act 1 (component authoring):** F-060 persistent field labels · CP-TABS-REDESIGN
  (Stages 0–5: DSD cure, v4→v5 migration, MosaicFieldType machinery, array UX, TipTap+media, template) ·
  F-083 carousel · F-084 search · **CP-VIEWS-EMBED (F-088, 3 CPs — design AI/P-VIEWS-EMBED-DESIGN.md)** —
  ratified 2026-09-01, slotted immediately after ship #32, BEFORE Act 2 (so the visual campaign styles the
  new panel field types once). **Act 2 (visual):** Arun's disabled-button-message idea; F-037/060/062 riders;
  polish.
- **WAVE F — DEFERRED DURABLE FIXES.** Wave 3.2 (F-035 @layer order), Wave 5.2 (F-034 shared-dist,
  F-057 mosaic_image), F-046-B (strip renderer.js from anon).
- **WAVE G — WALK ROUND 4 FULL SOAK** (all tag-scope submodules enabled) → **rc → Arun soak → TAG.**
- **Roadmap candidates (R2):** RC-A1 Schema.org JSON-LD · RC-A2 alt-text enforcement · RC-A3 keyboard-drag a11y spike (slot into C/E per Arun).
- **R7:** mosaic_intelligence/Lighthouse PARKED, labeled experimental — not tag-gating.

**Tag criteria:** Waves A–G closed · all tag-scope submodules walked green (round 4) · findings clear
or accepted · MOSAIC.md truthful · ≥1 production site · Arun's soak. No tag until all hold.

---

## P5 — POINTERS (what lives ONLY in the repo; how future windows must read)

- **Ledger:** `AI/TODO.md` (chronological, ships, rulings). **Findings:** `AI/FINDINGS.md`.
- **Audits:** `AI/MASTER-AUDIT.md` (July-18) + `AI/MASTER-AUDIT-GRAND.md` (2026-08-08, current) — both kept (R1).
- **Reports:** `AI/REPORT-*.md` (per-wave evidence). **Spec:** `MOSAIC.md` (truthful post Wave-A; repo still overrules).
- **Governance:** `AI/Mosaic-ai-working-agreement.md` (historical governance — where it conflicts with campaign practice recorded in AI/TODO.md, the ledger wins), `AI/MOSAIC-TEST-ARCHITECTURE-DIRECTIVE.md`, `contrib_drupal_11_bible.md`.
- **Future windows:** FRESH-READ before asserting. Never trust a prior window's summary of code —
  quote a live read. This bible orients; the repo decides.

*End. DRAFT constitution — amend only by Arun's ratified ruling.*
