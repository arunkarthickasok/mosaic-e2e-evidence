# Mosaic Test Campaign — Findings Log

**Source:** Backfill drafted by reviewer from chat-history evidence, 2026-07-16.
**Ratified by:** Drafted by reviewer from chat history 2026-07-16; corrected against file records same day; RATIFIED by Arun 2026-07-16.
**Scope:** FINDING-009 through FINDING-024.
**Authority:** Entries marked [UNRECOVERED] must be completed by Arun or left as
explicit gaps — never reconstructed by any AI from memory.

Full narrative records for most findings live in `AI/TODO.md`.
This file is the concise reference index. Do not duplicate the full record here;
cross-reference the TODO.md line range instead.

---

## FINDING-009

**Status:** CLOSED

False-pass lesson / positive-control rule. Gate 0 / 2026-07-10. Negative
assertion passed without a positive control: `isVisible()` returned false because
`props.text = ""` rendered a zero-height heading — the component existed in DOM
and stored layout but was invisible. Closed by positive-control rule and
`toHaveCount(0)` mandatory for absence.

**File pointer:** `AI/TODO.md` lines 394–404.

---

## FINDING-010

**Status:** NEVER OPENED

Number considered but finding did not open. JSON dump proved `"level":"h2"` stored
correctly — the suspected defect was absent. Node 238 cleaned up.

**File pointer:** `AI/TODO.md` line 508.

---

## FINDING-011

**Status:** RESOLVED (Arun ruling)

Empty required text props: option (a) ratified — empty required text props MUST NOT
render on output. Basis of the F018 empty-prop guard family (CP-F018 shipped,
be7ee8c) and the J2-NEG oracle.

Note: `mosaic_html.content` is OPTIONAL per F018-004 (`AI/TODO.md` ~line 2092)
— cite the OPTIONAL-prop clause for it, not this rule.

**File pointer:** `AI/TODO.md` lines 579–597.

---

## FINDING-012

**Status:** RESOLVED / CLOSED

Timing sleeps throughout the legacy suite. All eliminated via the E3 web-first
pattern, zero eslint exemptions; eslint enforcement added (later extended to
journeys scope in CP-J2-INFRA). Origin of the WEB-FIRST ONLY standing rule.

**File pointer:** `AI/TODO.md` line 620 (full empirical matrix).

---

## FINDING-013

**Status:** OPEN (thin record)

Tier-B SSR preview needs a web-first observable; related to the
`mosaic-preview-state` testability hook (S0.4). Exact contract text unrecovered —
Arun to confirm scope or mark partially-unrecovered.

**File pointer:** `AI/TODO.md` line 1039.

---

## FINDING-014

**Status:** RESOLVED / CLOSED

Suite triage census: 70 red tests accounted as 64 environment-drift + 6 selector
defects (icon-only SVG buttons defeating `hasText` selectors). Submodules confirmed
ENABLED — failures were selector-vs-SVG, not module state.

**File pointer:** `AI/TODO.md` line 1055.

---

## FINDING-015

**Status:** NUMBER RESERVED, NEVER OPENED (deliberate)

The accessible-name follow-up to 014: all 8 Mosaic icon-only toolbar buttons
verified WITH accessible names (`aria-label`/`title`) against live builder NID 332
— WCAG 4.1.2 compliant, no finding. Recorded so the numbering gap is explained,
not mysterious.

**File pointer:** `AI/TODO.md` line 1203.

---

## FINDING-016

**Status:** OPEN — PRODUCT — rc4 BLOCKER

Server-side prop validation: Option A ratified — validation is a present-tense
contract for ALL write paths. Blocks J10 adversary journey and Epic 1. Scheduled
post-Level-0, pre-rc4.

**File pointer:** `AI/TODO.md` line 1816.

---

## FINDING-017 / 017-B

**Status:** RESOLVED (doctrine source)

Canvas click landing on Drupal admin toolbar via hardcoded coordinates — diagnosed
structural, not flake. Family expanded into the "no coordinate survives a mutation"
doctrine (killed three times: drop-side, source-side, mid-drag anchor).

Base-017 vs 017-B split: [PARTIALLY UNRECOVERED] — Arun to confirm whether
base 017 had separate content beyond the 017-B record.

**File pointer:** `AI/TODO.md` lines 2138 (017) and 2173 (017-B).

---

## FINDING-018

**Status:** RESOLVED / SHIPPED

Empty-prop frontend guard family (F018): guards implemented and shipped as
CP-F018 (be7ee8c), incl. F018-004 (`mosaic_html.content` OPTIONAL). Contract
lives at `MOSAIC.md` line ~706.

**File pointer:** `AI/TODO.md` lines 2001–2134.

---

## FINDING-019

**Status:** OPEN

Puck derives field labels from prop KEY NAMES, not `title:` in `component.yml`.
`fillByLabel` must use exact prop key names (e.g. `'text'`, `'level'`,
`'alignment'`) — YML title values like `'Heading Text'` will not match.
J2 session 2026-07-12.

**File pointer:** `AI/TODO.md` line 1971.

---

## FINDING-020

**Status:** OPEN — J2-B PROVISIONING

Media picker/provisioning: P08 cannot fill `src` for real without a media entity
fixture + the `mosaic:media-selected` bridge. P08's caption-only scope is an
ACCEPTED TEMPORARY narrowing, flagged in the fixture. Family: FINDING-NEXT-E
(picker load failure), FINDING-NEXT-O (carousel media control dead), and the
`mosaic_media`-module-disabled probe.

**File pointer:** `AI/TODO.md` line 1977.

---

## FINDING-021

**Status:** RESOLVED (AMENDED) — ancestor of the P10 saga

Original "src fill corrupted canvas" claim REJECTED as a grep-isolation artifact;
amended to: field values do not commit to Puck store before blur/save
(`useLocalValue` reset + debounced propagation) — DOM showed values, store showed
empty. Fix: web-first pre-save commit oracle on text fills. Direct lineage to D17's
`commitFill` hardening.

**File pointer:** `AI/TODO.md` line 1983.

---

## FINDING-022

**Status:** RESOLVED (AMENDED) + PRODUCT TRACK PARKED

`fillByLabel` mis-scoping: duplicated labels + unnamed breakpoint/visibility
controls in the props panel; fixed test-side via `[name=]` guards. Product track
(`data-testid="prop-<name>"` panel hooks) QUEUED, zero product writes, post-J2
review.

**File pointer:** `AI/TODO.md` line 1989.

---

## FINDING-023

**Status:** OPEN — DEFERRED

Frontend contract for empty-media/empty-container is UNDEFINED (spec gap). Partly
superseded by FINDING-016's validator scope; resolve together.

**File pointer:** `AI/TODO.md` line 1995.
UPDATE 2026-07-18: RESOLVED by Ruling 6 (M2) — empty required media / all-empty containers MUST NOT render on public output (text-law extended); builder placeholder per canvas contract. Validator + F018 guard extension scheduled; spec amendment to MOSAIC.md L710 region pending.

---

## FINDING-024

**Status:** CLOSED (full record exists in in-session ledgers)

Slot-drop "bug" reclassified test-simulation defect after Arun's manual repro
(2026-07-12); upstream report cancelled permanently; W1 bridge withdrawn with
triple-grep revert proof. Origin of the MANUAL-REPRO standing rule.

**File pointer:** `AI/TODO.md` lines 3137–3140.

---

## Honesty ledger — gaps in this backfill

| Finding | Gap type | Resolution |
|---|---|---|
| FINDING-013 | Thin record | Arun to confirm scope or mark partially-unrecovered |
| FINDING-017 base | [PARTIALLY UNRECOVERED] | Arun to confirm 017 vs 017-B split |

---

## FINDING-027

**Status:** OPEN

FINDING-027 — J-EDIT-WALK-01 PHASE 0 UMBRELLA (2026-07-18, OPEN): 24 manual-walkthrough
observations WALK-01..24, classified 8 defect / 5 mystery / 6 ruling-pending / 1 positive
+ WALK-21 correction; full detail in AI/TODO.md ledger (J-EDIT-WALK-01 PHASE 0 entry).
Cross-refs: FINDING-NEXT-C (severity upgraded), FINDING-NEXT-F (confirmed in code),
FINDING-022 (confirmed live), FINDING-NEXT-B (Phase 1+ still unwalked). Supersedes nothing;
append-only.

**File pointer:** `AI/TODO.md` ledger entry "J-EDIT-WALK-01 PHASE 0".

---

## FINDING-028

**Status:** PARTIALLY RESOLVED — FE-DIALOG LAYER ADDED (2026-07-20)

FINDING-028 — BUILDER CANVAS MISSING DESIGN TOKENS (2026-07-18, OPEN, from mystery probe M4): Mosaic design-token CSS (mosaic-design-system.css) is not loaded/applied inside the builder canvas context — components render with Drupal admin theme styles instead of Mosaic tokens (button: admin link blue on transparent vs spec'd #0071b8/#ffffff). Canvas preview does not represent output styling. Cross-refs: WALK-23, FINDING-NEXT-N (DSD inert previews) — together: canvas preview fidelity umbrella candidate. Evidence: js/mystery-probe-2.log M4 block.

**File pointer:** `AI/TODO.md` ledger entry "MYSTERY LIVE-LOOK PROBE M1-M5 RESULTS" M4 section.

UPDATE 2026-07-20 (CP-CANVAS-SCOPE / FINDING-028-FE): FE dialog surface partially fixed. Two
changes shipped: (1) css/mosaic-canvas-reset.css added to frontend_editor library in
mosaic.libraries.yml; (2) class mosaic-canvas-scope added to canvas wrapper div in
FrontendBuilderDialog.tsx:195. Evidence: W12-S06 GREEN post-fix (class confirmed present in
browser); canvas element itself achieves rgb(23,23,23) via all:revert-layer (mechanism active).
Non-heading palette components (S38–S48, 10 scenarios): all GREEN — admin theme isolation
functioning for buttons, dividers, badges, cards, alerts. RESIDUAL — heading color OPEN
(tracked FINDING-033): h2 inside canvas reads rgb(11,13,15) instead of rgb(10,10,10) (mosaic
token). Root cause: Olivero frontend theme's unlayered h1-h6 { color: var(--color-text-neutral-loud) }
in olivero/css/base/base.css beats @layer mosaic-components on the frontend node view page.
canvas-reset targets admin theme isolation only; Olivero isolation requires a separate decision.
12/13 palette component families pass post-fix; heading is the only exception. S02/S04/S37
RECLASSIFIED: see UPDATE 2026-07-20 (2) below.
UPDATE 2026-07-20 (2) (CP-PARITY-ORACLE / Ruling 2a): S02/S04/S37 oracles updated to WYSIWYG
parity doctrine. Canvas heading color rgb(11,13,15) == anon frontend heading color rgb(11,13,15) →
parity MATCHED → 0 failures. FINDING-033 reclassified as DOCUMENTED-BEHAVIOR (see FINDINGS.md).
FE surface finding CLOSED (S02/S04/S37 now GREEN under parity oracle). Admin builder surface
residue (original FINDING-028): Ruling 2a sharpens this — admin builder canvas headings give
rgb(23,23,23) (body color via all:revert-layer, Olivero not loaded on admin page), which ALSO
does not match the anon frontend rgb(11,13,15). Admin canvas is not a WYSIWYG preview of the
frontend for a different architectural reason (different page context). This gap is the remaining
OPEN item of FINDING-028 (admin-surface preview fidelity). FE surface is now closed.

---

## FINDING-029

**Status:** OPEN

FINDING-029 — THEME LINK RULE OVERRIDES BUTTON TEXT COLOR ON OUTPUT (2026-07-18, OPEN, from mystery probe M5): anon frontend button text computes rgb(20,117,173) instead of token-resolved #ffffff; site theme link rule beats .mosaic-button--primary specificity. Blue-on-blue ≈ WCAG AA contrast failure on public output. Gov/508 relevance: HIGH. Mechanism INFERRED (winning rule not yet captured — capture exact rule via DevTools cascade before fix ships, per mechanisms-observed rule). Cross-ref: WALK-24, a11y/WCAG-508 audit arc. Evidence: js/mystery-probe-2.log M5 block.

**File pointer:** `AI/TODO.md` ledger entry "MYSTERY LIVE-LOOK PROBE M1-M5 RESULTS" M5 section.

UPDATE 2026-07-18: mechanism BEHAVIORALLY CONFIRMED via EDIT-14 (text visible label-only, invisible once URL added → <a> render triggers theme link-color capture). Exact winning CSS rule still to be captured before fix ships.

---

## FINDING-030

**Status:** OPEN

FINDING-030 — J-EDIT-WALK-01 PHASE 1 UMBRELLA + TWO-BUILDER DISCOVERY (2026-07-18, OPEN): 15 Edit-layout observations EDIT-01..15 (11 defect / 1 ruling / 1 positive-set / 1 key discovery / 1 evidence item); full detail in AI/TODO.md ledger (J-EDIT-WALK-01 PHASE 1 entry). Headline: Edit-layout mounts a DIFFERENT builder surface than node-edit (INFERRED: frontend-editor vs admin builder) with zero automated coverage to date — J2 gates cover admin builder only. Core lifecycle proven sound by manual walk (save/persist/anon/round-trip green). Serious items: EDIT-08 blank-out, EDIT-11 undo granularity (saved-content leak), EDIT-13 level-change content loss, EDIT-04/05 scroll blockers. Cross-refs: FINDING-NEXT-B (this walk IS its structured investigation), FINDING-029 (mechanism behaviorally confirmed via EDIT-14), WALK-13/FINDING-022 (closed via bonus), FINDING-NEXT-C/D (family members present on this surface). Append-only.

**File pointer:** `AI/TODO.md` ledger entry "J-EDIT-WALK-01 PHASE 1".

UPDATE 2026-07-18: two-builder split CONFIRMED by source recon — EDIT-02 upgraded INFERRED → OBSERVED. One Puck core (@puckeditor/core + MosaicPuckAdapter shared), different shells: BuilderApp (admin, full-featured) vs FrontendBuilderDialog (Edit-layout, minimal, Puck direct). frontend_editor library missing mosaic-design-system.css, builder.css, mosaic-canvas-reset.css — explains EDIT-04/05 scroll blockers + FINDING-028 on this surface. Distinct save path (FrontendSaveController). Surface has zero spec footprint and zero automated tests. Full attribution table in AI/TODO.md ledger (TWO-BUILDER SOURCE CONFIRMATION RECON entry).
UPDATE 2026-07-18 (2): EDIT-13 mechanism OBSERVED (shared InlineEditableText tag-dep gap, MosaicPuckAdapter.ts:266-270); EDIT-08 collapsed into EDIT-13 per Arun clarification; EDIT-16 CLOSED (stale bootstrap REJECTED — DB/settings/rendered all "Edit Walk Test", three-way match before+after drush cr); EDIT-17 opened (inline-edit E-7 unverified, needs manual check); EDIT-01 closed (Arun manual config fix, 2026-07-18).
UPDATE 2026-07-20 (CP-CANVAS-SCOPE / EDIT-04/05): scroll blockers partially addressed.
mosaic-canvas-reset.css added to frontend_editor library (mosaic.libraries.yml). Class
mosaic-canvas-scope on canvas div activates the @layer admin isolation mechanism. Puck root
height parity confirmed (FINDING-031 fix still in place, 672px=672px). EDIT-04/05 scroll
blockers were attributed to missing canvas-reset in this library — reset now loads. Heading
color gap (FINDING-033) remains; full visual parity not yet achieved for h2 on the FE dialog
surface. Admin theme scroll interference mitigated; Olivero frontend theme h2 interference
unresolved pending Arun decision.

---

## FINDING-031

**Status:** FIXED-PENDING-SHIP

FINDING-031 — EDIT-18: FE DIALOG HEIGHT CLIPS SIDEBAR PANELS (2026-07-19, FIXED-PENDING-SHIP, Wave 1.2 CP-EDIT18+03): Puck 0.21.x renders two-level DOM inside .mosaic-fe-dialog__canvas: outer div._Puck_1dd16_19 (no height) > inner div._PuckLayout_1dd16_36 (height:100dvh). Canvas is flex:1 in a column = viewport − 48px toolbar = 672px. Puck's inner layout was 720px (100dvh), overflowing canvas by 48px. The bottom of both sidebar panels was permanently clipped and unreachable. Fix: two CSS rules added to css/mosaic-frontend-editor.css — outer div (height:100% = 672px) to establish containing block, inner PuckLayout (height:100% of outer = 672px). Mirrors builder.css:61-79 pattern. Empirical 100dvh proof: W12-S13 measured Puck root 720px vs canvas 672px pre-fix; 672px=672px post-fix. Cross-ref: FINDING-030 (EDIT-WALK umbrella), W12-S09/S10/S11/S12/S13/S14 all GREEN.

**File pointer:** `AI/TODO.md` ledger entry "WAVE 1.2 — CP-EDIT18+03".

---

## FINDING-032

**Status:** FIXED-PENDING-SHIP

FINDING-032 — EDIT-03: LOADING SKELETON DEAD LETTER (2026-07-19, FIXED-PENDING-SHIP, Wave 1.2 CP-EDIT18+03): mbu-frontend-editor.css defined shimmer animation under class .mosaic-fe-loading; FrontendBuilderDialog.tsx:179 and :192 both emit class mosaic-fe-dialog__loading. Class name mismatch — shimmer was a dead letter; loading div rendered plain text only. Fix: renamed CSS selector .mosaic-fe-loading → .mosaic-fe-dialog__loading in modules/mosaic_builder_ui/css/mbu-frontend-editor.css:156. Zero JS/TSX change. BEM contract mosaic-fe-dialog__* is correct; CSS was the outlier. Both loading branches covered by one selector change. W12-S25 RED pre-fix (animationName='none') → GREEN post-fix (animationName='mbu-shimmer'). Cross-ref: FINDING-030 (EDIT-WALK umbrella).

**File pointer:** `AI/TODO.md` ledger entry "WAVE 1.2 — CP-EDIT18+03".

---

## FINDING-033

**Status:** RECLASSIFIED — DOCUMENTED-BEHAVIOR ON FE SURFACE (2026-07-20)

FINDING-033 — OLIVERO FRONTEND THEME UNLAYERED H2 RULE OVERRIDES MOSAIC HEADING TOKEN IN FE
DIALOG CANVAS (2026-07-20, OPEN, discovered during CP-CANVAS-SCOPE green run): On the frontend
node view page (where the FE dialog lives), Olivero frontend theme loads
olivero/css/base/base.css which contains an UNLAYERED rule:
  h1, h2, h3, h4, h5, h6 { color: var(--color-text-neutral-loud); }
This resolves to approximately rgb(11,13,15) — Olivero's "neutral loud" text color.
Because the rule is unlayered, it beats ALL @layer rules (including @layer mosaic-components
and @layer admin) regardless of specificity. Result: h2 elements inside the FE dialog canvas
display rgb(11,13,15) instead of the mosaic heading token value rgb(10,10,10) (delta: 1,3,5
per channel — visually near-identical but not token-correct).

Context: canvas-reset.css declares @layer admin { h2 { color: revert; } } targeting admin
theme (Claro/Gin) isolation. On the admin builder page (/node/NID/edit), Olivero is not
loaded — h2 inherits body color rgb(23,23,23) via all:revert-layer on .mosaic-canvas-scope
(S03 oracle). On the FE dialog frontend node page, both Olivero AND Claro admin toolbar
load — Olivero's unlayered rule beats the cascade.

Diagnostic evidence: canvas-diag.spec.ts confirmed (2026-07-20):
  hasCanvasReset: true, hasScopeClass: true (fix active)
  canvasColor: rgb(23,23,23) (scope element, correct)
  h2Color: rgb(11,13,15) (Olivero, NOT mosaic token)
Winning rule traced to olivero/css/base/base.css unlayered h1-h6 block.

Scope: heading color ONLY on FE dialog frontend page. Non-heading palette components (buttons,
badges, cards, dividers, alerts, rich-text, columns, quotes) all pass — those are not
affected by Olivero's h2 rule.

Cross-refs: FINDING-028-FE (canvas isolation umbrella), FINDING-030 (EDIT-WALK umbrella,
EDIT-04/05 scroll family), CP-CANVAS-SCOPE STOP condition, W12-S02/S04/S37 (RED post-fix).

RECLASSIFICATION (Ruling 2026-07-20 — WYSIWYG parity doctrine): The color rgb(11,13,15)
is NOT a defect on the FE dialog surface. Olivero's unlayered h2 rule is the site's correct
heading color for the frontend. The canvas correctly previews what visitors see. W12-S02/S04/S37
oracles updated to WYSIWYG parity (canvas == anon frontend), both now measure rgb(11,13,15) →
parity MATCHED. Green run confirmed: 27 passed, 0 failed (green-run-parity-oracle.txt).

TOKEN GAP RESIDUE: the delta between rgb(11,13,15) [Olivero/site effective value] and
rgb(10,10,10) [raw mosaic heading token] is documented here but is a SITE THEME decision,
not a Mosaic module defect. If the site customizes Olivero's heading color to use the mosaic
token, the parity oracle automatically passes at the new value.

ADMIN-CANVAS RESIDUE (separate from FE surface): On the admin builder page (/node/NID/edit),
Olivero is not loaded. The admin canvas h2 gets rgb(23,23,23) (body color inherited via
all:revert-layer) rather than rgb(10,10,10) (token). Sharpened by Ruling 2a: the admin
canvas is not a WYSIWYG preview of the anon frontend either (different page context). This
admin-surface gap is owned by FINDING-028 (admin surface residue), tracked separately.

**File pointer:** `AI/TODO.md` ledger entry "CP-PARITY-ORACLE" RULING 2a + FINDING-033 sections.

---

## FINDING-030 UPDATE — EDIT-10 RESOLVED + EDIT-19 OPENED (2026-07-20)

UPDATE to FINDING-030 (J-EDIT-WALK-01 PHASE 1 umbrella):

EDIT-10 (drag-to-reorder scroll interference concern) → RESOLVED-NO-DEFECT.
Arun's manual pointer probe 2026-07-20 per Manual-Repro Rule, conducted post-CSS-packages
(post-CP-CANVAS-SCOPE + CP-EDIT18+03, Ruling 3). Both surfaces: smooth drops, correct
landing with drop-indicator, bottom-edge drag survives (EDIT-18 fix confirmed under live
manual fire). Fast-drag snap-back present on BOTH surfaces identically = native dnd-kit
no-valid-target behavior, not a Mosaic defect. Minor note: heading felt "slightly jumpy"
in FE dialog — logged as observation, below actionable threshold, no EDIT number.

EDIT-19 OPENED (2026-07-20): Placeholder/field-border misalignment during drag-reorder.
Placeholder text renders half-overlapping the component's outer border while canvas
components shift to make space. Reproduced on newly-added AND existing heading component;
reproduced on admin builder AND FE dialog (shared dnd-kit placeholder mechanism).
Cosmetic-during-drag only — artifact disappears on drop, persisted layout unaffected.
Wave assignment: pending reviewer triage. Candidate for cosmetic-polish CP.

OBSERVATION-VISUAL-PARITY (2026-07-20): Arun verdict: "feel similar, view totally different
— north pole vs south pole — will confuse content authors." Admin builder vs FE dialog UI
chrome divergence. UX/product concern, not a CSS defect. Feeds into FE parity doctrine
scope question. Screenshots + visual delta analysis to follow; ruling deferred.

**File pointer:** `AI/TODO.md` ledger entries "EDIT-10 PROBE RESULTS", "EDIT-19 OPENED",
"OBSERVATION-VISUAL-PARITY", "WAVE 1.2 CLOSED".

UPDATE 2026-07-20 (DELTA REGISTER + EDIT-20):
EDIT-20 OPENED under FINDING-030 umbrella: FE dialog exposes both Mosaic Save (toolbar)
and Puck native Publish button — two save-meaning controls simultaneously visible. Mechanism:
onPublish wired in FrontendBuilderDialog.tsx causes Puck to render its "Publish" button in
addition to the custom toolbar Save button. Both call handleSave(). Author-confusion class;
not data-loss. Fix shape: remove onPublish prop (or no-op) so Puck does not render native
Publish. Attribution: FIRST-EVIDENCE 2026-07-20 screenshots (not found in EDIT-01..15).
Wave 1.3 first kill, pending Arun ratification of packaging.

VISUAL-PARITY DELTA REGISTER summary (D1-D5, 2026-07-20 — full register in TODO.md):
  D1 (palette machine names): WALK-01, 2026-07-17/18 — screenshots CONFIRM
  D2 (double save controls): FIRST-EVIDENCE 2026-07-20 — see EDIT-20
  D3 (button link-blue vs solid): WALK-23 → FINDING-028, 2026-07-17/18 — screenshots CONFIRM
  D4 (missing device-preview/breakpoint on FE): EDIT-02, 2026-07-18 — screenshots CONFIRM
  D5 (canvas width divergence): EDIT-02 founding, width detail FIRST-EVIDENCE 2026-07-20
Screenshots are corroborating/enriching evidence; discovery credit belongs to Arun's walk
testimony for D1/D3/D4.

REVIEWER ERROR #4 STANDING RULE (ratified 2026-07-20): Walk testimony = evidence-grade.
Synthesis of cross-observation patterns is required within the same walk session. Screenshots
are enrichment, never a precondition. See full rule text in TODO.md "REVIEWER ERROR #4".

**File pointer:** `AI/TODO.md` ledger entries "ATTRIBUTION AUDIT", "VISUAL-PARITY DELTA
REGISTER", "EDIT-20 OPENED", "REVIEWER ERROR #4 + STANDING RULE".

UPDATE 2026-07-20 (CP-EDIT20 STEP 1d — MECHANISM AMENDMENT):
AMENDMENT (Arun-ratified): prior EDIT-20 mechanism text above ("onPublish wired... causes
Puck to render its Publish button") was INFERRED-from-memory at time of opening. Superseded
by fresh-read proof in CP-EDIT20 Step 1c:
  OBSERVED: chunk-YXFTA2VL.mjs:7138-7139 — overrides.headerActions||defaultHeaderActionsRender
  OBSERVED: chunk-YXFTA2VL.mjs:7168 — Publish button rendered inside defaultHeaderActionsRender
  OBSERVED: BuilderApp.tsx:678 — admin builder suppresses via overrides={puckOverrides} where
    puckOverrides.headerActions:()=><MosaicTestabilityHooks/> replaces default (no Publish)
  OBSERVED: FrontendBuilderDialog.tsx:202 — onPublish={() => { void handleSave(); }}, no overrides
  SAVE PATHS: Both Mosaic toolbar Save and Puck Publish invoke same handleSave() → same POST.
Mechanism is CONFIRMED. Fix: overrides={{ headerActions: () => <></> }}, remove onPublish.

UPDATE 2026-07-21 (CP-EDIT20 FIXED):
MECHANISM CORRECTED (Arun manual repro 2026-07-21 — 5th walk-catch):
  Prior mechanism text ("onPublish wired causes Puck to render Publish button") was
  imprecise. Full chain:
    Puck Button component: const ElementType = href?"a":type?"button":"span" — the
      Publish control gets only onClick, so it renders as <span>, NOT <button>.
    Render path: MenuBar.renderHeaderActions() always fires inside _MenuBar_8pf8c_1,
      calling CustomHeaderActions with the Publish span as children. This is separate
      from CustomHeader.actions which DefaultOverride ignores.
    Robot oracle (W13-S01 v1) used getByRole('button') — completely blind to the <span>
      with no role attribute. Arun's hard-refresh manual repro was the authority.
  Element confirmed by DIAG A1: tagName=span, class=_Button_10byl_1 _Button--primary_...,
    role=null, offsetParentNotNull=true, insideDialog=true.
FIX (FrontendBuilderDialog.tsx, STEP C):
  Removed: onPublish={() => { void handleSave(); }} (dead code without the button)
  Added:   overrides={{ headerActions: () => <></> }}
  Effect:  CustomHeaderActions = empty fragment → MenuBar.renderHeaderActions() renders
           nothing → Publish span absent. Admin builder parity: BuilderApp.tsx:449.
DIST PROOF: frontend-editor.js, context "mosaic-canvas-scope":
  overrides:{headerActions:()=>jsx(Fragment,{})} present; onPublish absent.
GREEN RUN (2026-07-21): W13 3/3 + fe-dialog-parity 31/31 + fe-dialog-geometry 12/12
  + frontend-editor FE-01..12 12/12. J2 not required.
STATUS: SHIPPED. Commit 26527e0 — 2026-07-21. FINDING-030 sub-item CP-EDIT20 CLOSED.

UPDATE 2026-07-21 (CP-EDIT20 SHIPPED — ship ceremony):
  Commit: 26527e0 "CP-EDIT20: remove Puck native Publish control from FE dialog
    (headerActions override, admin parity) — single save-meaning control for authors"
  5th walk-catch record: oracle blindness caught by Arun's hard-refresh manual repro
    (2026-07-21). Robot's W13-S01 v1 oracle (getByRole('button')) was blind to Puck's
    <span> rendering; human observation was the authority per Oracle-Rule sanctioned
    correction. Cross-ref: AI/REPORT-EDIT20.md (consolidated record), AI/TODO.md L6054.


---

## FINDING-034

**Status:** OPEN — interim rule applied; real fix deferred to Wave 5.2

**Discovered:** 2026-07-21 (CP-UNSAVED-GUARD / W14 diagnostic, pageerror trace on FE bar)

**Summary:** Build-order chunk collision — shared `dist/` with `emptyOutDir:false`.

**Mechanism:** Both `vite.builder.config.ts` and `vite.frontend-editor.config.ts` write to `dist/`
with `emptyOutDir: false`. Shared chunk files (e.g. `chunk-jsx-runtime.js`) are written by
whichever build runs. The SECOND build to run owns those shared chunk files. If `frontend-editor`
runs first and `builder` runs second, `builder` overwrites `chunk-jsx-runtime.js` with its version
— missing the export `'l'` that `frontend-editor.js` imports at runtime. Symptom: FE dialog bar
is dead; `pageerror` in Playwright: `SyntaxError: ... does not provide an export named 'l'`.

**Evidence:** W14 diagnostic run; `w14-diag.log` and `fe-bar-diag.spec.ts` (deleted after diagnosis).

**Interim rule:** Always build builder FIRST, frontend-editor SECOND, renderer per existing
convention. Comments added to both vite configs (2026-07-21).

**dist/ tracked-vs-untracked-vs-orphan table (2026-07-21 snapshot):**

| Category | Count | Notes |
|---|---|---|
| Tracked in git (`git ls-files js/dist/`) | 40 | All .js, .css, assets/ |
| Untracked on disk | 0 | emptyOutDir:false + incremental = no new files |
| Orphans (disk only, not tracked) | 0 | None |
| Stale (tracked, superseded by newer hash) | ~11 | Jul 13/Jul 11 dated chunks, e.g. chunk-Editor-EPSED64A.js superseded by chunk-Editor-MCVDFQH6.js |

Stale files (tracked but from a prior build cycle, safe to delete after full clean rebuild):
  chunk-Editor-EPSED64A.js, chunk-Render-CU35UAWV.js, chunk-full-N67EAB2Q.js,
  chunk-chunk-22UJFAFA.js, chunk-chunk-BCL7VBTL.js, chunk-chunk-G74MZKKD.js,
  chunk-chunk-K23YHISE.js, chunk-chunk-U6THAD4G.js, chunk-loaded-F37CNCVG.js,
  chunk-loaded-H325ZSK5.js, chunk-loaded-MIY725CK.js
NO deletions pending Arun ruling. Root cause: Rolldown appends content hash despite
`chunk-[name].js` pattern; old filenames accumulate across build cycles.

**Real fix (Wave 5.2 candidate):** Separate outDirs per bundle target (e.g. `dist/builder/`,
`dist/frontend-editor/`) OR hashed-import manifest so each bundle imports its own chunks
by content hash. Arun rules wave placement.

**File pointer:** `AI/TODO.md` CP-UNSAVED-GUARD REMEDIATION RECORD R5.


---

## FINDING-035 — Canvas @layer order inversion

**Slug:** canvas-layer-order-inversion
**Discovered:** 2026-07-23, CP-029-CONTRAST S03 R1 oracle catch, C1 page.evaluate walk
**Severity:** Structural (silent for now; masked by per-property unlayered compat rules)

**Description:**
`@layer admin` in `mosaic-canvas-reset.css` ends up as the **highest-priority** CSS layer
on admin canvas pages and FE dialog canvas pages, inverting its stated intent ("Declare
admin layer first so it loses to all mosaic layers").

**Root cause — first-occurrence ordering:**
CSS Cascade Level 5 spec: layer order is determined by the first time each layer name
appears in the document. On the admin builder page, `mosaic-design-system.css` loads
first (builder library YAML order, line 1) and establishes:
  `@layer mosaic-tokens, mosaic-components, site-theme;`
Then `mosaic-canvas-reset.css` (line 2) runs and first introduces `@layer admin` via:
  `@layer admin, mosaic-tokens, mosaic-components, site-theme;`
Since `mosaic-tokens`, `mosaic-components`, `site-theme` are already established,
only `admin` is new — placed AFTER `site-theme` in layer order = HIGHEST priority.

**Effect:**
Every rule inside `@layer admin { ... }` in `mosaic-canvas-reset.css` wins over every
rule in `@layer mosaic-components { ... }` in `mosaic-design-system.css`.
Specifically: `.mosaic-canvas-scope button { color: revert }` (admin layer) beats
`.mosaic-button--primary { color: var(--mosaic-button-primary-color) }` (components layer).
`color: revert` in the winning layer reverts to UA stylesheet ButtonText = rgb(0, 0, 0).

**Witnessed:** CP-029-CONTRAST S03, computed color rgb(0, 0, 0). C1 page.evaluate walk
2026-07-23 confirmed selector `.mosaic-canvas-scope button, input, textarea, select`,
value `color: revert`, layer `@layer admin`, file `css/mosaic-canvas-reset.css`.

**Currently masked:** Per-property unlayered rules in `mosaic-canvas-compat.css` and
`mosaic-compat.css` override specific properties (button color, column display) one by
one. This works (unlayered beats any layer) but is fragile — each new `@layer admin`
revert rule requires a matching unlayered compat patch.

**Real fix (Arun ruling pending — wave placement TBD):**
Add an explicit layer-order statement as the very first CSS loaded on canvas pages, before
any other `@layer` declaration:
  `@layer admin, mosaic-tokens, mosaic-components, site-theme;`
This must appear before `mosaic-design-system.css` processes its own declaration. Options:
  (a) New `mosaic-canvas-layer-order.css` loaded as FIRST entry in builder/frontend_editor
      library CSS blocks (before mosaic-design-system.css).
  (b) Move layer-order declaration into `mosaic-canvas-reset.css` AND ensure it loads
      before `mosaic-design-system.css` (swap YAML order in builder library).
  (c) Combine both into a single file with layer-order at the top.
Either approach eliminates the need for per-property compat patches.

**Cross-reference:** `AI/TODO.md` CP-029-CONTRAST CANVAS GAP entry (2026-07-23).
**Wave placement:** Arun ruling pending.

## FINDING-036 — Dual-React runtime crash (PuckProvider useEffect null dispatcher)

**Observed:** 2026-07-23, W16 run after CP-UNSAVED-UX step 3 dist rebuild.
**Symptom:** `TypeError: Cannot read properties of null (reading 'useEffect')` at
  `chunk-chunk-Y2EFNT5P.js:347` → `useRegisterHistorySlice (chunk-chunk-O7FT3KAM.js:6412)`
  → `PuckProvider (builder.js:23862)`. Admin builder mount div remained empty.
**Mechanism:** FINDING-034 shared-dist collision class. FE build (running last, per
  FINDING-034 interim rule) rewrote `chunk-chunk-O7FT3KAM.js` to import React from
  `chunk-chunk-Y2EFNT5P.js` (FE's new React chunk), while `builder.js` still imported
  React from `chunk-jsx-runtime.js` (builder's React chunk). Two separate `require_react`
  implementations loaded at runtime → React instance A (builder) and instance B (FE chunk).
  PuckProvider rendered under instance A; `useRegisterHistorySlice` called `useEffect`
  from instance B. Instance B's `ReactSharedInternals.H` dispatcher was null → crash.
**Root trigger:** Adding `UnsavedPrompt.tsx` (new React import in FE-only file) changed
  the FE bundle's module graph such that Rolldown assigned React to a different auto-named
  shared chunk than the builder's. The FE build then overwrote the shared Puck chunk with
  the divergent import path.
**Mitigation (CP-UNSAVED-UX, 2026-07-23):** Added `manualChunks` to both
  `vite.builder.config.ts` and `vite.frontend-editor.config.ts`:
    ```
    manualChunks: (id: string) => {
      if (id.includes('/node_modules/react') || id.includes('/node_modules/scheduler')) {
        return 'react-vendor';
      }
    }
    ```
  Both builds now pin React + scheduler into `dist/chunk-react-vendor.js`. Both
  `builder.js` and `chunk-chunk-O7FT3KAM.js` import React from the same chunk → one
  React instance. Verified: `chunk-chunk-Y2EFNT5P.js` exports only helpers post-fix
  (no `require_react`).
**Cross-reference:** FINDING-034 (shared-dist collision; Wave 5.2 real fix = separate
  outDirs still stands). `AI/TODO.md` CP-UNSAVED-UX ship ledger (2026-07-23).
**Wave placement:** Mitigation shipped in CP-UNSAVED-UX. Durable fix (separate outDirs,
  FINDING-034 Wave 5.2) unchanged.

## FINDING-037 — Template Browser missing text search and Type filter

**Observed:** 2026-07-27, Wave 2.1 template probe (read-only recon).
**Claim (MOSAIC.md line 306-325):** Template Browser is "a searchable, filterable grid
  of saved layouts" with a Search input box, a Category dropdown, and a Type dropdown.
**Reality:** `js/src/builder/TemplateSplash.tsx:53-57` implements category tabs only
  (`categories.filter`). No text search input exists in the component. No Type
  (Global / Site-local) filter exists. The MOSAIC.md wireframe ASCII art (line 312)
  shows `[All ▼]` for both Category and Type — only Category is wired.
**Impact:** Large template libraries are unbrowsable by keyword. Authors cannot
  filter by template source type (global vs site-local), making the distinction
  between the two template types invisible in the UI.
**Severity:** MEDIUM.
**Cross-reference:** `AI/TODO.md` Wave 2.1 TEMPLATE PROBE entry (L7368+), C-04.
**Wave placement:** Arun ratification pending.

## FINDING-038 — Thumbnail stored as raw string URI, not Drupal managed file

**Observed:** 2026-07-27, Wave 2.1 template probe (read-only recon).
**Claim (MOSAIC.md lines 369, 382-394):** "A screenshot of the preview iframe is
  captured (canvas `toDataURL` → stored as a managed file — the thumbnail shown
  in the browser grid)." Entity schema lists `thumbnail` as a file entity reference.
**Reality:** `src/Entity/MosaicTemplate.php:74` defines `thumbnail_uri` as
  `BaseFieldDefinition::create('string')` — a plain string field, not a file entity
  reference. `js/src/builder/SaveTemplateDialog.tsx` contains no `toDataURL` call.
  `src/Controller/TemplateSaveController.php:75,98` accepts `thumbnail_uri` as a
  consumer-provided string from the POST payload with no managed-file creation.
**Impact:** Thumbnails are not tracked by Drupal's file system. No file usage
  tracking, no automatic deletion on template removal, no managed-file access
  controls. The canvas screenshot capture described in the spec is not implemented.
**Severity:** MEDIUM.
**Cross-reference:** `AI/TODO.md` Wave 2.1 TEMPLATE PROBE entry (L7368+), C-10/C-13.
**Wave placement:** Arun ratification pending.

## FINDING-039 — Config entity name prefix mismatch vs documentation

**Observed:** 2026-07-27, Wave 2.1 template probe (read-only recon).
**Claim (MOSAIC.md lines 396-400):** Config entities stored as
  `config/optional/mosaic.template.homepage_v2.yml`; entity ID prefix `mosaic.template.*`.
**Reality:** Entity type is `mosaic_global_template`; Drupal config prefix is
  `mosaic.global_template.*` (derived from entity type annotation in
  `src/Entity/MosaicGlobalTemplate.php`). The YAML filenames and `drush cim` paths
  differ from documentation.
**Impact:** Documentation-only discrepancy; no runtime bug. However, developers
  following MOSAIC.md to hand-author or locate config YAML files will use the wrong
  filenames and fail to find or deploy templates.
**Severity:** LOW (docs fix).
**Cross-reference:** `AI/TODO.md` Wave 2.1 TEMPLATE PROBE entry (L7368+), C-14.
**Wave placement:** Arun ratification pending.

## FINDING-040 — Admin template management URL wrong in documentation

**Observed:** 2026-07-27, Wave 2.1 template probe (read-only recon).
**Claim (MOSAIC.md line 451):** "A template can be edited via a dedicated admin page:
  `/admin/structure/mosaic-templates`."
**Reality:** `src/Entity/MosaicGlobalTemplate.php:44` defines the collection link as
  `/admin/config/mosaic/global-templates`. The path is under `admin/config`, not
  `admin/structure`, and the slug is `global-templates` not `mosaic-templates`.
**Impact:** Documentation-only discrepancy; no runtime bug. Admins following the
  docs will hit a 404.
**Severity:** LOW (docs fix).
**Cross-reference:** `AI/TODO.md` Wave 2.1 TEMPLATE PROBE entry (L7368+), C-16.
**Wave placement:** Arun ratification pending.

## FINDING-041 — TemplateListController serves layout_json without migrating; template entities excluded from migration queue and schema-health scan

**Observed:** 2026-07-27, Wave 2.1 template probe (read-only recon).
  Scoped 2026-07-27/28, Wave 2 overnight Part A probe.
**PROBE CORRECTION (2026-07-28):** Initial verdict "LayoutMigrator ABSENT" was a probe error.
  The probe ran `find src/ -name "LayoutMigrat*"` (filename search). The class is
  `MosaicLayoutMigrationManager` (file: `src/Service/MosaicLayoutMigrationManager.php`).
  MOSAIC.md names it "LayoutMigrator"; code uses "MosaicLayoutMigrationManager." The
  migration infrastructure EXISTS and is fully functional with chain plugins V1→V4.
**Claim (MOSAIC.md line 463):** "The same `LayoutMigrator` that migrates component
  schema changes in live pages also runs on stored templates on module update."
**Reality (corrected):**
  Migration infrastructure EXISTS:
  - `src/Service/MosaicLayoutMigrationManager.php` — chains migration plugins
  - `src/Plugin/MosaicLayoutMigration/V1ToV2Migration.php` — v1→v2 (no-op structural)
  - `src/Plugin/MosaicLayoutMigration/V2ToV3Migration.php` — v2→v3 (no-op structural)
  - `src/Plugin/MosaicLayoutMigration/V3ToV4Migration.php` — v3→v4 (optional spacing key)
  - `src/Plugin/QueueWorker/MosaicLayoutMigrationWorker.php` — batch queue worker
  Live pages ARE migrated: `src/Hook/MosaicHooks.php:163-188` (`hook_entity_presave`)
  calls `migrateToCurrentVersion()` on every `mosaic_layout`-typed field before DB write.

  The THREE REAL GAPS:
  1. `src/Controller/TemplateListController.php` — `serialiseGlobal()` and `serialiseLocal()`
     return raw `layout_json` WITHOUT calling `migrateToCurrentVersion()`. Old templates
     are served at their stored schema_version to the browser.
  2. No drush command enqueues `mosaic_template` or `mosaic_global_template` entities for
     migration. `mosaic_template.layout_json` is type `string`, not `mosaic_layout` — so
     `hook_entity_presave` SKIPS it (MosaicHooks.php:172 checks `getType() !== 'mosaic_layout'`).
     Template entities are permanently stuck at creation-time schema_version.
  3. `drush mosaic:schema-health` scans only `mosaic_layout`-typed fields (MosaicCommands.php:382),
     NOT template entity `layout_json` string fields — template schema versions are invisible
     to the health report.
**Live-risk verdict:** LIVE PAGES SAFE. `hook_entity_presave` migrates content entity layouts
  on every save. A v3 template inserted into a canvas becomes v4 in the DB on first user save.
  V1–V4 migrations are all no-op structural changes (only increment version integer) so
  stale template JSON causes no crash, no prop loss, and no silent data corruption today.
  Latent risk: when a future structural migration (renamed prop, added required key) is shipped,
  old template entities remain stranded at the old version permanently with no auto-migration path.
  Users inserting stale templates receive incorrect canvas state until they save.
**Impact:** Currently zero. Latent template migration staleness when structural changes are introduced.
  Schema-health drush gap means stale template versions are invisible to ops tooling.
**Severity:** MEDIUM (downgraded from HIGH after scoping probe).
  Original HIGH verdict was based on the erroneous "migrator absent" finding.
**Cross-reference:** `AI/TODO.md` Wave 2.1 TEMPLATE PROBE entry (L7368+), C-19.
  `AI/REPORT-OVERNIGHT-W2.md` Part A (full trace). `src/Value/MosaicLayoutValue.php:30`
  (CURRENT_SCHEMA_VERSION = 4). `src/Drush/MosaicCommands.php:252,303,382`.
**Wave placement:** MEDIUM — fix in Wave 2.x alongside other template gaps.
  Targeted fixes: (a) call migrateToCurrentVersion() in TemplateListController before
  serialising; (b) include template entities in schema-health scan; (c) add drush command
  or queue-population path for template entity migration.

## FINDING-042 — BuilderOrigin type and templateId absent from JS BuilderState

**Observed:** 2026-07-27, Wave 2.1 template probe (read-only recon).
**Claim (MOSAIC.md lines 472-476):** Zustand BuilderState carries
  `origin: BuilderOrigin` (`'scratch' | 'template' | 'existing'`) and
  `templateId: string | null`. The toolbar can show "Started from: Homepage v2."
**Reality:** No `BuilderOrigin` type found in `js/src/builder/BuilderApp.tsx` or
  `js/src/shared/types/schema.ts`. PHP has a `TemplateOrigin` value object
  (`src/Value/TemplateOrigin.php`) serialised into the layout JSON blob, but JS
  only exposes `template_origin?: TemplateOrigin` in the shared schema type — it
  is not tracked in Zustand state. No toolbar label logic for template provenance exists.
**Impact:** The builder cannot display "Started from: Homepage v2" or any template
  provenance label in the toolbar. `templateId` is unavailable for analytics or
  conditional UI behaviour.
**Severity:** MEDIUM.
**Cross-reference:** `AI/TODO.md` Wave 2.1 TEMPLATE PROBE entry (L7368+), C-20/C-21.
  `src/Value/TemplateOrigin.php`.
**Wave placement:** Arun ratification pending.

## FINDING-043 — FE dialog has zero template integration (templates are admin-builder-only)

**Observed:** 2026-07-27, Wave 2.1 template probe (read-only recon) — T5 permission parity audit.
**Claim (MOSAIC.md line 300):** "The author can still access templates via a 'Templates'
  button in the toolbar at any point" — stated in the context of the frontend editor flow.
**Reality:** `js/src/frontend-editor/FrontendBuilderDialog.tsx` contains zero references
  to `TemplateSplash`, `SaveTemplateDialog`, `/api/mosaic/templates`, or any template
  permission check. `TemplateSplash.tsx`, the Save as Template toolbar button, and the
  Template Browser are wired exclusively into `js/src/builder/BuilderApp.tsx`
  (the admin builder). The FE inline editor has no splash screen, no template picker,
  and no Save as Template control.
**Impact:** Any author restricted to the frontend editor (lacking admin builder access)
  cannot start a new layout from a template, cannot browse the template library, and
  cannot save their layout as a reusable template. The entire template feature is
  invisible to FE-only roles. This is a full surface parity gap per the
  Permission-Parity law.
**Severity:** HIGH.
**Cross-reference:** `AI/TODO.md` Wave 2.1 TEMPLATE PROBE entry (L7368+), T5 parity table.
  FINDING-037 (browser UX), FINDING-042 (JS state).
**Wave placement:** Arun ratification pending. Wave 2.2 candidate (FE template parity).

## FINDING-044 — "Promote to global" UI flow not implemented as documented

**Observed:** 2026-07-27, Wave 2.1 template probe (read-only recon).
**Claim (MOSAIC.md lines 440-444):** "A site admin can click 'Promote to global' on
  any site-local template. This: 1. Exports the template's layout JSON as a config
  entity YAML file. 2. Shows the admin a code block to copy into `config/optional/`.
  On next `drush cim`, it deploys to all sites."
**Reality:** `src/Form/MosaicGlobalTemplateForm.php:81` provides a `sync_to_config`
  boolean toggle on the `mosaic_global_template` config entity form. There is no
  per-site-local-template "Promote to global" button. There is no YAML export display
  or code-block UI. `src/EventSubscriber/MosaicConfigExportSubscriber.php` filters
  entities with `sync_to_config: false` from `drush config:export` — a different
  mechanism from the described promote flow.
**Impact:** The workflow described in documentation for promoting site-local templates
  to global does not exist. Admins cannot self-serve a promotion; the only path is
  to create a global template directly or use drush config:export with the toggle.
**Severity:** MEDIUM.
**Cross-reference:** `AI/TODO.md` Wave 2.1 TEMPLATE PROBE entry (L7368+), C-22.
  `src/EventSubscriber/MosaicConfigExportSubscriber.php`.
**Wave placement:** Arun ratification pending.

## FINDING-045 — Content entity revisions absent from MosaicTemplate

**Observed:** 2026-07-27, Wave 2.1 template probe (read-only recon).
**Claim (MOSAIC.md line 453):** "Drupal content entity revisions apply to site-local
  templates — rollback available."
**Reality:** `src/Entity/MosaicTemplate.php` extends `ContentEntityBase` only. It does
  not implement `RevisionableInterface`, carries no `revision_table` entity key, and no
  revision base field definitions are declared. Revision support is entirely absent.
**Impact:** Site-local template edits are irreversible through the UI. An author who
  overwrites a template's layout JSON has no rollback path; the previous state is lost.
**Severity:** MEDIUM.
**Cross-reference:** `AI/TODO.md` Wave 2.1 TEMPLATE PROBE entry (L7368+), C-18.
  `src/Entity/MosaicTemplate.php`.
**Wave placement:** Arun ratification pending.

---

## FINDING-046 — Renderer JS loaded for anonymous users (WALK-CATCH #12)

**Observed:** 2026-07-28, eye-test walk sessions.
**Class:** Performance / access gap.
**Surface:** Anonymous / public frontend pages served by the `mosaic/renderer` library.
**Description:** `renderer.js` (the Lit 3 Web Component bundle) is loaded for all
  visitors on pages containing a Mosaic layout field, regardless of whether the visitor
  is an authenticated editor. Anonymous users have no use for the editor-side JS; they
  need only the design-system CSS tokens for correct rendering. The JS bundle adds an
  unnecessary payload for anonymous page loads.
**Evidence:** `mosaic.libraries.yml` → `renderer` library includes `js/dist/renderer.js`
  with `type: module`. The `renderer` library is attached in `MosaicHooks::entityView()`
  unconditionally. No anonymous-gate around the JS attachment.
**Impact:** Every anonymous page load fetches the renderer JS bundle even though
  the bundle's only function is to register the `<mosaic-renderer>` custom element for
  client-side editor preview parity. On public pages with no editor bar, this is dead
  weight.
**Severity:** LOW (no correctness impact; purely performance/payload concern).
**Cross-reference:** `AI/TODO.md` eye-test triage T3 / walk-catch tally. WALK-CATCH #12.
**Wave placement:** CP-SPLASH-POLISH follow-on (wave 3 candidate); Arun ratification pending.

---

## FINDING-047 — Puck Outline tab collapses FE dialog canvas height (WALK-CATCH #15)

**Observed:** 2026-07-28, B-phase overnight probe (b2-outline-click.mjs). Node 826,
  viewport 1280×900.
**Class:** Layout / height regression — FE dialog canvas collapses when Puck Outline
  tab is active and no component is selected.
**Surface:** FE dialog (`dialog.mosaic-fe-dialog`) with populated layout.
**Navigation:** The Puck nav is NOT inside the left sidebar panel — it is a 68×765px
  vertical icon-nav bar at x=0 in `_PuckLayout-nav_1dd16_192`, to the LEFT of the
  274px component-panel sidebar. Nav items (Blocks, Outline, Fields-mobile-only) are
  `<div class="_NavItem-link_1tvxq_38">` inside `<li class="_NavItem_1tvxq_38">` — NOT
  `<button>` elements. This is why the prior T4 probe's `button:has-text("Outline")`
  query returned nothing.
**Reproduction (from probe, node 826, 1280×900):**
  - Baseline (Blocks active, no selection): canvas.h=852, nav.h=765, sl.h=765, sr.h=765
  - After clicking Outline nav item: canvas.h=**354**, nav.h=**267**, sl.h=267, sr.h=267
  - Collapse = 852→354 (498px cut off; canvas collapses to 41.5% of correct height)
  - After clicking any [data-puck-component]: canvas.h=852, nav.h=765 (RESTORED)
  - After canvas whitespace click (deselect): canvas.h=354 again (COLLAPSE RETURNS)
**Mechanism (corrected 2026-07-29 — W21 chain probe):**
  The collapse is NOT caused by the Outline panel's `height:auto` directly propagating
  up. The true root cause is that `mosaic-canvas-reset.css` loads its
  `.mosaic-canvas-scope { all:revert-layer }` AFTER `mosaic-frontend-editor.css`, and
  `all:revert-layer` strips `flex:1` from `.mosaic-fe-dialog__canvas`. The canvas then
  has `flexGrow:0` — it SHRINKS to fit large content (Blocks palette >> 852px →
  flex-shrink brings it to 852px) but does NOT GROW when content is small (Outline tree
  ~354px → canvas stays at 354px). The EDIT-18 `height:100% !important` rules cascade
  correctly but resolve against 354px (the collapsed canvas) rather than 852px.
  The PuckPluginTab--visible `height:auto` is a symptom — the panel's parent chain
  was already collapsed. This is the SAME class of bug as CP-SIDEBAR-SCROLL (FINDING-028-FE):
  `all:revert-layer` stripping other properties (overflow, min-height were SCROLL; flex
  is OUTLINE). The W21 chain-probe confirmed: `canvas.flex = "0 1 auto"` with Outline active.
  When component is selected, Puck adds `_PuckLayout--rightSideBarVisible_` which triggers
  Puck's internal CSS giving PuckLayout a definite height — this is Puck's own restore path.
  Admin builder (node edit form) does NOT have this bug — `builder.css` uses a different
  height chain and `mosaic-canvas-reset.css` is NOT loaded in that library context.
**CP-FE-TEMPLATES relationship:** NOT caused by CP-FE-TEMPLATES.
**Severity:** MEDIUM — makes the Outline tab (component tree) unusable in the FE
  dialog; canvas collapses to 354px when Outline is active without a selection.
**Fix applied (2026-07-29, W21 — Arun-ratified):**
  Added `flex: 1` to the EXISTING compound selector in `mosaic-frontend-editor.css`:
  ```css
  .mosaic-fe-dialog__canvas.mosaic-canvas-scope {
    overflow: hidden;
    min-height: 0;
    flex: 1; /* W21/F-047: re-assert flex:1 reverted by all:revert-layer */
  }
  ```
  Also retained `[class*="PuckPluginTab--visible"] { height:100%; min-height:0 }` as
  secondary hygiene. W21 oracle: 8/8 green. W18/W19/W20/FE regressions: all clean.
**Status:** FIXED — shipped 136eb34 (2026-07-29). Spec: `js/e2e/fe-outline-collapse.spec.ts`.
**Cross-reference:** WALK-CATCH #15. AI/TODO.md W21 block (2026-07-29).
  File: `css/mosaic-frontend-editor.css` lines 118–186.
**Wave placement:** CP-FE-DIALOG-OUTLINE-FIX — FIXED-PENDING-SHIP.

---

## FINDING-048 — e2e test suite entirely local-only (js/e2e/ gitignored)

**Observed:** 2026-07-29, ship-list truth check V1/V2.
**Class:** Contribution gap / test coverage.
**Evidence:**
  - `.gitignore line 12: js/e2e/` — entire e2e directory ignored.
  - `git ls-files js/e2e/` → no output (zero tracked files).
  - `git check-ignore -v js/e2e/fe-templates.spec.ts js/e2e/w20-splash-polish.spec.ts`
    → both matched by `.gitignore:12:js/e2e/`.
**Claim (implicit, contrib quality standard):** A contrib module of this complexity
  should ship its integration test suite alongside the code so contributors and
  maintainers can run tests without access to the original author's local environment.
**Reality:** All Playwright e2e specs (`fe-templates.spec.ts`, `w20-splash-polish.spec.ts`,
  and ~30 other spec files) are gitignored and local-only. Contributors cloning the
  repo have no runnable E2E coverage. Only PHP unit/kernel tests (in `tests/`) are
  tracked.
**Why the policy exists:** The `js/e2e/` directory contains environment-specific
  fixture paths, DDEV-site URLs, and auth state that cannot ship verbatim. Specs also
  reference live node IDs and env vars that differ per install.
**Impact:** Contributors cannot reproduce E2E failures locally. Security reviewers
  cannot verify UI-level permission gates without running the site manually.
  Long-term maintenance risk if the original author is unavailable.
**Severity:** LOW (no correctness impact today; affects contributor experience and
  long-term maintainability).
**Fix direction (Wave 5):** Evaluate publishing a sanitized, env-configurable version
  of the e2e suite — replace hardcoded node IDs with fixture-creation beforeAll hooks
  (already the W19/W20 pattern), replace DDEV URLs with `TEST_BASE_URL` env vars,
  publish playwright.config.ts and page objects. The fixture-creation pattern proven
  in fe-templates.spec.ts (beforeAll POST, afterAll delete) is the template.
**Arun ruling:** (A) `js/e2e/` gitignore is the standing policy; not a ship blocker
  for e059522. Wave 5 candidate for re-evaluation.
**Cross-reference:** Ship-list V-check 2026-07-29. AI/TODO.md ship close-out entry.
  REVIEWER ERROR #9 (reviewer asserted specs shipped in prior CPs — V2 evidence refuted).
**Wave placement:** Wave 5 — sanitized test publication. Severity LOW; not blocking.

---

## FINDING-049 — FE dialog has zero lock integration (WAVE-2.2)

**Observed:** 2026-07-29, Wave 2.2 edit-locking recon (read-only).
**Class:** Feature gap — concurrent-edit safety.
**Surface:** FE dialog (`FrontendBuilderDialog.tsx`).
**Evidence:**
  - `js/src/frontend-editor/FrontendBuilderDialog.tsx`: zero references to `LockManager`
    (no import, no acquire, no release, no heartbeat, no SSE stream, no lock banner).
  - `js/src/builder/BuilderApp.tsx` lines 244–262: creates `LockManager`, calls
    `acquire()` on mount (guarded by `entityId > 0`), registers `pagehide` keepalive
    release, opens SSE stream.
  - The admin builder acquires the lock on mount and releases on unload. The FE dialog
    does neither.
**Impact:** An editor working in the FE dialog can overwrite a layout while another
  user holds the lock acquired by the admin builder. The lock system provides ZERO
  protection for FE-dialog edits because it is never consulted on the FE surface.
**MOSAIC.md claim (lines 1668–1670):** "Content Lock integration: one editor at a
  time, with lock notification" — this claim only holds for the admin builder surface.
  The FE dialog silently bypasses it.
**Severity:** HIGH — the lock system's core guarantee ("one editor at a time") is
  broken for any scenario involving the FE dialog surface.
**Fix direction:** Import `LockManager` into `FrontendBuilderDialog.tsx`; acquire on
  dialog open (`showModal()`), release on dialog close (`close()`), register SSE stream
  and pagehide keepalive, render a lock banner matching the admin builder's UX.
**Cross-reference:** FINDING-050 (server-side save also unguarded). Wave 2.2 probe
  2026-07-29. AI/TODO.md Wave 2.2 entry.
**Wave placement:** Wave 3.3 — FE lock integration. Severity HIGH; ship-blocking for
  any multi-editor scenario.

---

## FINDING-050 — FrontendSaveController has no lock verification (WAVE-2.2)

**Observed:** 2026-07-29, Wave 2.2 edit-locking recon (read-only).
**Class:** Security gap — lock bypass via API.
**Surface:** `src/Controller/FrontendSaveController.php`.
**Evidence:**
  - Access check: `mosaic.use_builder` + entity `update` access only (lines ~40–60).
  - No `$this->lockManager->isLockedBy($account, $entityType, $entityId)` call.
  - Any user with `mosaic.use_builder` + `update` access can POST to
    `/mosaic/frontend-save/{entityType}/{entityId}/{fieldName}` and overwrite the
    layout regardless of who holds the lock.
  - Compare: `LayoutLockController::acquire()` correctly returns 409 JSON when a
    different user already holds the lock — but `FrontendSaveController` never calls
    the lock service at all.
**Impact:** The lock endpoint can report "locked by user A" while user B successfully
  saves via the FE surface. Last write wins, silently destroying user A's work.
**Severity:** HIGH — lock bypass at the API level; no server-side enforcement for FE
  saves.
**Fix direction:** In `FrontendSaveController::save()`, before writing layout JSON:
  call `$this->layoutLockManager->isLockedBy($account, ...)` and return a 409 JSON
  response if the entity is locked by a different user. Inject
  `mosaic.layout_lock_manager` into the controller.
**Cross-reference:** FINDING-049 (client-side no acquire). Wave 2.2 probe 2026-07-29.
**Wave placement:** Wave 3.3 — FE lock integration. Severity HIGH; must pair with
  FINDING-049 fix.

---

## FINDING-051 — Admin builder does not block Puck save when not lock owner (WAVE-2.2)

**Observed:** 2026-07-29, Wave 2.2 edit-locking recon (read-only).
**Class:** Feature gap — optimistic lock enforcement.
**Surface:** `js/src/builder/BuilderApp.tsx` + Drupal node form submit path.
**Evidence:**
  - `BuilderApp.tsx` line 700: `onPublish={() => { /* Drupal's form submit is the
    only save path. */ }}` — Puck's onPublish is a no-op.
  - Actual save = Drupal node form submit (the "Save" button below the Puck canvas).
  - Lock banner at lines 420–436 renders "Locked by X" when `!lockStatus.owner`, but
    the form submit button is NOT disabled and the form is NOT intercepted.
  - `LockManager.ts`: `saveLayoutJson` is never called — it's not wired up in
    BuilderApp. The Drupal node form save proceeds regardless of `lockStatus.owner`.
  - Server side: `NodeSaveController` / Drupal's node entity save has no
    `mosaic.layout_lock_manager` check.
**Impact:** An editor can see "Locked by Arun" and still click Save, overwriting
  Arun's in-progress changes. The banner is informational only — it does not enforce
  the lock.
**Severity:** MEDIUM — the lock banner creates a false sense of protection; in
  practice, the lock is advisory-only in the admin builder. Impact is lower than
  FINDING-049/050 because the banner at least informs; FE dialog gives no signal.
**Fix direction:** Either (a) disable the Drupal node form Save button via JS when
  `!lockStatus.owner`, or (b) add a `lock_verify` route that the form POSTs through
  which checks the lock and returns a 409 before the entity is saved. Option (a) is
  minimal; option (b) is the correct server-side enforcement.
**Cross-reference:** FINDING-049, FINDING-050. Wave 2.2 probe 2026-07-29.
**Wave placement:** Wave 3.3. Severity MEDIUM; lower priority than 049/050.

---

## FINDING-052 — PHP race condition in MosaicLayoutLockManager::acquire() (WAVE-2.2)

**Observed:** 2026-07-29, Wave 2.2 edit-locking recon (read-only).
**Class:** Concurrency — non-atomic read-modify-write.
**Surface:** `src/Service/MosaicLayoutLockManager.php::acquire()`.
**Evidence:**
  - `acquire()` flow: `$current = $store->get($key)` → if uid mismatch return FALSE →
    else `$store->setWithExpire($key, $lockData, self::TTL)`.
  - No atomic compare-and-set primitive — `KeyValueExpirable` does not expose one.
  - Two concurrent acquire calls from different users could both read `$current = null`
    (no existing lock), pass the uid-mismatch check, and both write their lock.
    The last write wins — one user holds the lock silently.
**Impact:** Under concurrent load (unlikely in practice for a content editing
  scenario), two users could both believe they hold the lock. Combined with
  FINDING-049/050, this compounds the data-loss window.
**Severity:** LOW-MEDIUM — race window is very small (PHP request lifecycle) and
  multi-editor concurrent editing is an uncommon scenario. But the lock system claims
  "one editor at a time" and this is a silent failure mode.
**Fix direction:** Use Drupal's `lock.persistent` service (a DB-backed lock with
  `lockAcquire()`) to wrap the read-modify-write in an actual exclusive lock.
  Alternatively, accept the race as a known limitation and document it.
**Cross-reference:** Wave 2.2 probe 2026-07-29.
**Wave placement:** Wave 3.3 low-priority. Severity LOW-MEDIUM.

---

## FINDING-053 — lock.spec.ts UAT-53/54 skipped in most CI runs (WAVE-2.2)

**Observed:** 2026-07-29, Wave 2.2 edit-locking recon (read-only).
**Class:** Test coverage gap.
**Surface:** `js/e2e/lock.spec.ts` lines 31–75.
**Evidence:**
  - `lock.spec.ts` lines 31–58 (UAT-53) and 59–75 (UAT-54): both tests call
    `test.skip(!process.env.E2E_SAVED_NODE_PATH, 'E2E_SAVED_NODE_PATH not set')`.
  - `E2E_SAVED_NODE_PATH` is not set in `.env.e2e` by default (must be set manually
    to a node URL that already has a saved layout).
  - These two scenarios are the PRIMARY UX tests: "builder shows You are editing badge
    when lock is acquired" and "owner lock banner has aria role=status".
  - UAT-55–61 (endpoint shape and auth tests) always run, but they verify JSON
    structure and HTTP status codes — not the actual lock UX rendered in the builder.
  - Result: in any CI run or fresh environment without `E2E_SAVED_NODE_PATH`, the lock
    BANNER UX is entirely untested by automation.
**Severity:** LOW — the lock endpoint contract is verified; only the rendered UX is
  unverified. But this is the part most likely to silently regress in a UI update.
**Fix direction:** Migrate UAT-53/54 to the W19/W20 fixture-creation pattern
  (beforeAll POSTs a test node, afterAll deletes it). Remove the conditional skip.
  This would make the lock banner UX always testable without manual setup.
**Cross-reference:** Wave 2.2 probe 2026-07-29. FINDING-048 (e2e gitignore).
**Wave placement:** Wave 3.3 low-priority. Severity LOW.

---

## FINDING-054 — FE dialog media picker silently broken — bridge JS not attached (WAVE-2.3)

**Observed:** 2026-07-29, Wave 2.3 media bridge spike (read-only).
**Class:** Feature gap — FE surface media picker non-functional.
**Surface:** FE dialog (`FrontendBuilderDialog.tsx`) + `MosaicHooks::entityView()`.
**Evidence:**
  - `FrontendBuilderDialog.tsx` lines 9, 187, 196: imports and uses `MosaicPuckAdapter`.
    `MosaicPuckAdapter.toConfig()` wires `MosaicMediaField` for any `drupal_media` prop type.
    The "Choose media…" button is therefore rendered in the FE dialog props panel.
  - `MosaicMediaField.tsx` line 84–88: "Choose media" click dispatches
    `mosaic:open-media-library` CustomEvent on `window`.
  - `mosaic_media/media_library_bridge` (defined in `mosaic_media.libraries.yml` line 1):
    the JS that listens for `mosaic:open-media-library` and opens the Drupal AJAX dialog.
  - `MosaicLayoutWidget.php` lines 130–135: attaches `mosaic_media/media_library_bridge`
    when `mosaic_media` is enabled — but this is the **admin builder path only**
    (form widget attached on node/entity edit form).
  - `MosaicHooks::entityView()` lines 343–64: FE path — attaches `mosaic/frontend_editor`
    only. Zero reference to `mosaic_media/media_library_bridge`.
  - grep: `grep -n "mosaic_media\|media_library_bridge" src/Hook/MosaicHooks.php` →
    zero matches in the entityView context.
**Impact:** In the FE dialog, the "Choose media…" button dispatches the event but no
  handler exists. The media library dialog never opens. Authors cannot pick or update
  media entities via the FE surface. This is the same surface-parity class as FINDING-049
  (lock) — the admin builder has the capability; the FE dialog silently lacks it.
**MOSAIC.md claim (line 730):** "bridge event mosaic:media-selected carries { fieldName,
  mediaId, mediaType, label }" — this claim only holds for the admin builder surface where
  the bridge JS is attached.
**Severity:** HIGH — any component with a `drupal_media` prop is effectively read-only in
  the FE dialog; authors cannot change or pick media.
**Fix direction:** In `MosaicHooks::entityView()`, add:
  ```php
  if ($this->moduleHandler->moduleExists('mosaic_media')) {
    $build['#attached']['library'][] = 'mosaic_media/media_library_bridge';
  }
  ```
  Mirror the guard already present in `MosaicLayoutWidget.php` lines 130–135.
**Cross-reference:** FINDING-049 (same surface-parity pattern for locks). Wave 2.3 probe
  2026-07-29. AI/TODO.md Wave 2.3 entry.
**Wave placement:** Wave 3.3 — pair with FE lock CP (same surface, same fix style).
  Severity HIGH; fix is a one-liner.

---

## FINDING-055 — Save-time validation skips sentinel existence/access check (WAVE-2.3)

**Observed:** 2026-07-29, Wave 2.3 media bridge spike (read-only).
**Class:** Validation gap — invalid/inaccessible media sentinels silently stored.
**Surface:** `src/Service/MosaicPropValidator.php`.
**Evidence:**
  - `MosaicPropValidator.php` lines 113–117: `if ($this->isSentinelValue($value)) { continue; }` —
    sentinel values (`_type: drupal_media`, `drupal_entity_ref`, `drupal_link`) skip ALL
    validation checks, including existence and access checks.
  - `isSentinelValue()` lines 164–170: returns TRUE for all three sentinel types.
  - No `loadEntityByUuid()` call in MosaicPropValidator — grep confirms: zero `load`, `uuid`,
    `access`, or `exist` references in the file.
  - Compare render path: `MosaicPropResolver::resolveMedia()` line 118 DOES check
    `$media->access('view', $account)` — but this happens only at render time, not at save time.
**Impact:** A layout can be saved containing a sentinel pointing to:
  - A non-existent media UUID (typo, deleted entity) — stored silently.
  - A private/restricted media entity the saving user cannot view — stored silently.
  The first render by a user without access will suppress the element (correct per Ruling 6 M2),
  but the author gets no feedback at save time and may not realise the media is inaccessible.
**Severity:** MEDIUM — no data corruption, but author UX is degraded (silent save with
  broken reference). Combined with FINDING-056 (no usage tracking), broken sentinels can
  persist indefinitely undetected.
**Fix direction:** In `MosaicPropValidator::validateNode()`, for `drupal_media` sentinels:
  load the entity by UUID and check `view` access for the saving account. Return an error
  if the entity is missing or access-denied. Inject `EntityRepositoryInterface` and the
  current `AccountInterface` (or pass account as argument from the save controller).
**Cross-reference:** FINDING-056 (no usage tracking). FINDING-023 guard (deferred sentinel
  emptiness check — this finding covers existence/access, not emptiness). Wave 2.3 probe.
**Wave placement:** Wave 3.4 — validator extension. Severity MEDIUM.
**RESOLVED 2026-08-09 (Wave C ship #24):** `MosaicPropValidator` now injects
  `EntityRepositoryInterface` + `AccountInterface` (`@entity.repository`/`@current_user`) and
  `validateMediaSentinel()` loads each `drupal_media` sentinel by UUID and checks `view` access for the
  saving account — error on missing OR access-denied. Empty/absent uuid deferred to FINDING-023.
  RED→GREEN Unit: MosaicPropValidatorTest (missing→fail, inaccessible→fail, viewable→pass,
  no-uuid→pass). phpcs clean; Kernel constraint test green (3-arg service resolves).

---

## FINDING-056 — No media usage tracking — deleted media silently breaks layouts (WAVE-2.3)

**Observed:** 2026-07-29, Wave 2.3 media bridge spike (read-only).
**Class:** Feature gap — no Drupal usage registration for media referenced in layouts.
**Surface:** `src/` + `modules/mosaic_media/src/` — no usage calls anywhere.
**Evidence:**
  - grep: `grep -rn "file_usage\|EntityUsage\|trackUsage\|untrack" src/ modules/mosaic_media/src/`
    → zero matches.
  - Drupal's `file.usage` service (used by image fields, file fields) is never called by
    any Mosaic service or hook.
  - `LayoutUsageController.php` line 50/185: exists but reports which entities contain a
    `mosaic_layout` field — it does NOT scan layout JSON for media UUID references.
  - No Drush command or admin report that finds layouts with unresolvable media sentinels.
**Impact:** When a media entity is deleted, Drupal shows NO "this item is in use" warning.
  The layout silently retains the stale UUID sentinel. On next render, `MosaicPropResolver`
  returns NULL (entity not found) and the element is suppressed per Ruling 6 M2 — correct
  behaviour, but invisible to authors and site administrators. A media manager can delete
  a media entity referenced on 50 pages and receive no warning.
**Severity:** MEDIUM — no data corruption; graceful degradation works. But the lack of
  warning is a significant content-management risk for sites with many media references.
**Fix direction:** In `FrontendSaveController::save()` and the admin builder's entity save
  hook, scan the layout JSON for `drupal_media` sentinels and register each UUID with
  Drupal's `file.usage` service (or `entity_usage` if the contrib module is enabled).
  De-register on save (diff old vs new sentinels) and on entity delete via `hook_entity_delete`.
**Cross-reference:** FINDING-055 (no save-time access check). Wave 2.3 probe 2026-07-29.
**Wave placement:** Wave 3.4. Severity MEDIUM.

---

## FINDING-057 — `mosaic_image` bypasses sentinel/access system (raw URL, no media entity) (WAVE-2.3)

**Observed:** 2026-07-29, Wave 2.3 media bridge spike (read-only).
**Class:** Design note / potential access gap — Level 0 image component stores raw URL.
**Surface:** `modules/mosaic_components/src/Plugin/MosaicComponent/MosaicImageComponent.php`.
**Evidence:**
  - `MosaicImageComponent.php` lines 32–36: props are `src` (string), `alt` (string),
    `width` (string), `height` (string), `loading` (string), `caption` (string).
  - No `drupal_media` prop type declared — this component takes a raw URL string, not a
    UUID sentinel. It is a Level 0 plain `<img>` component.
  - There is no `MosaicPropResolver` resolution step for `src` — it is passed directly
    to the Twig template as a raw string. No media entity access check at render time.
  - A private file URL (e.g. `private://images/confidential.jpg`) stored in `src` would
    be rendered as `<img src="/system/files/images/confidential.jpg">` — the URL is
    served by Drupal's private file system which DOES enforce access, but Mosaic has no
    awareness of this.
**Impact:** Authors can paste any URL (including private file URLs) into `mosaic_image.src`.
  The rendered `<img>` tag may expose URLs that should be access-controlled. The file system
  enforces the actual file download, but the URL is visible in the HTML source.
  Additionally, `mosaic_image` images have no cache tag dependency — if the image file
  changes or is deleted, no cache invalidation occurs.
**Severity:** LOW — this is largely an intentional Level 0 design (raw URL for simplicity).
  The file system still enforces download access. Impact is principally URL disclosure in
  HTML source and missing cache tag dependencies.
**Fix direction (Wave 5):** Either (a) accept as by-design with documented guidance that
  `mosaic_image` should not be used for private files; or (b) add a `drupal_media` prop
  variant to `mosaic_image` (Level 1 upgrade) that uses the sentinel/resolver path.
**Cross-reference:** Wave 2.3 probe 2026-07-29.
**Wave placement:** Wave 5 — design-level decision. Severity LOW; not a ship blocker.

---

## CORRECTION 2026-07-29 — FINDING-055 evidence (reviewer audit, Wave 2.3)

**Finding affected:** FINDING-055 (save-time validation skips sentinel existence/access check).
**Error:** The evidence section cited:
  > "grep: `grep -n "uuid\|exist\|access\|load" src/Service/MosaicPropValidator.php` →
  > zero matches."
  That grep was never run in the probe transcript, and its claimed result is false.
  `$uuid` appears as a variable throughout MosaicPropValidator.php (lines 46, 47, 54, 66,
  74+). `load` and `access` do not appear, but asserting "zero matches" for the full pattern
  without running the command was fabricated evidence.
**Conclusion stands:** FINDING-055's conclusion is UNCHANGED and correctly supported by the
  full-file read (cat -n, 200 lines of MosaicPropValidator.php) which was executed in the
  probe. The full file confirms: no `EntityRepositoryInterface` or `EntityTypeManagerInterface`
  injection, no `loadEntityByUuid()` call, no `->access()` call, sentinel guard at lines
  113–117 skips all checks for `drupal_media`/`drupal_entity_ref`/`drupal_link` values.
**Evidence basis corrected:** From the fabricated grep claim to the full-file read (cat -n,
  MosaicPropValidator.php lines 1–200, executed in probe). All other evidence in FINDING-055
  is accurate and transcript-backed.
**Reviewer:** Self-audit, Wave 2.3 close, 2026-07-29.

---

## FINDING-058 — Structurally-incomplete layout JSON → uncaught TypeError (availability)

**Observed:** 2026-07-29, CP-ANON-RENDERER Part A mechanism witness (surfaced by the
  adversarial critic, verified first-hand against source).
**Class:** Availability / robustness — uncaught exception on a public render path.
**Surface:** `src/Value/MosaicLayoutValue.php` + `src/Plugin/Field/FieldType/MosaicLayoutItem.php`,
  reached via `MosaicLayoutFormatter::viewElements()` during any entity view that renders a
  mosaic_layout field.
**Evidence (file:line, verified):**
  - `MosaicLayoutValue.php:63` — `json_decode($json, TRUE, 512, JSON_THROW_ON_ERROR)` (throws
    `\JsonException` on syntactically invalid JSON only).
  - `MosaicLayoutValue.php:83` — `schemaVersion: $data['schema_version']` — NO null-coalesce.
    A JSON-valid but structurally-incomplete value (e.g. `{"nodes":{}}` with no `schema_version`
    / `root`) yields `null` into a non-nullable `int`/`string` constructor param under
    `declare(strict_types=1)` → **`\TypeError`**.
  - `MosaicLayoutItem.php:82` — `return MosaicLayoutValue::fromJson((string) $json);`
  - `MosaicLayoutItem.php:84` — **`catch (\JsonException $e)`** — catches ONLY `\JsonException`.
    The `\TypeError` is NOT caught → propagates out of `getLayoutValue()`.
  - Thrown inside `viewElements()` (`MosaicLayoutFormatter.php:105`) BEFORE `hook_entity_view`
    (MosaicHooks Pass 1 line 294 / Pass 2 line 310) runs → the exception precedes both the
    renderer attach and the frontend-editor Edit-button attach.
**Impact:** A single structurally-incomplete field value (from an import, a migration, a
  hand-crafted/API write, or any path that bypasses the `MosaicLayoutJson` save-time constraint)
  causes an **uncaught TypeError → likely HTTP 500 (WSOD)** on the public page for ALL roles
  (anonymous included). Worse, because the throw precedes Pass 2, an editor cannot even reach the
  frontend Edit affordance to repair the bad layout via the UI — the self-service recovery path is
  unreachable.
**Severity:** HIGH — public-page availability defect with no graceful degradation and no UI repair
  path. (The save-time `MosaicLayoutJson` constraint blocks this on the normal widget path, so the
  live blast radius depends on how many write paths bypass validation — imports/migrations/direct
  API writes.)
**Fix direction:** (a) In `MosaicLayoutValue::fromJson()`, null-coalesce + validate `root` and
  `schema_version` (reject with a typed domain exception rather than letting a `TypeError` form);
  (b) widen the `getLayoutValue()` catch from `\JsonException` to `\Throwable` (or add
  `\TypeError`), degrade to `NULL` (empty render) and log a warning with the entity/field id so
  operators can find and fix the bad value. Net effect: a malformed value renders as an empty
  field instead of a 500, and the editor keeps the FE repair path.
**Ratification:** Arun R6 (2026-07-29) — RATIFIED FORMAL, HIGH, its OWN CP (NOT bundled into
  CP-ANON-RENDERER). Wave: next available slot after CP-ANON-RENDERER.
**Test:** RED coverage in `tests/src/Kernel/Hook/MosaicAnonRendererCacheTest.php`
  (`testMalformedJsonThrowsDuringView`, asserts the uncaught `\TypeError`) and
  `js/e2e/anon-renderer.spec.ts` W22-LS7 (asserts `response.status() !== 200` + no renderer
  request). RED run pending B4 fixture sanction.
**Cross-reference:** CP-ANON-RENDERER Part A/B (AI/TODO.md 2026-07-29). Discovered during F-046
  mechanism witness. Propose backlog B-xxx.
**Wave placement:** Own CP, post-CP-ANON-RENDERER. Severity HIGH.

---

## FINDING-046 — ADDENDUM (2026-07-29): revised fix approach + F-046-B carve-out

**Fix approach REVISED (Arun R5, re-ratified 2026-07-29).** The original CP-SPLASH-POLISH-era
  note and the first-ratified "delta-item / nodes>0" gate are SUPERSEDED. Part A mechanism witness
  proved the delta-item approach both:
  - **Insufficient** — `mosaic/renderer` is attached at TWO sites, not one:
    `MosaicHooks::entityView():308` AND `MosaicLayoutFormatter::viewElements():119`. Gating only
    the hook leaves the formatter attaching, which also re-populates `$build[field]` so the hook
    re-attaches anyway.
  - **Mis-keyed** — a node-count gate over-attaches on the dangling-root case
    (`root` points at a missing node → `MosaicRenderer::render()` returns `[]` at line 135 even
    though `nodes > 0`).
  **Ratified fix (R5):** a render-emptiness skip in the formatter — insert between
  `MosaicLayoutFormatter.php:110` and `:114`:
  ```php
  if ($rendered === []) {
    continue; // empty/dangling-root: emit nothing, attach nothing.
  }
  ```
  `#lazy_builder` arrays are `!== []` so the BigPipe path passes through. This closes BOTH attach
  sites at once (formatter stops attaching; `$build[field]` becomes empty so the hook's existing
  line-297 `!empty()` check early-returns with NO hook edit), and also fixes the Pass-2 spurious
  Edit-button over-wrap on an empty envelope — for free. Implementation is PART C (not yet done).

**F-046-B CARVED OUT (Arun R7, Wave 5).** The above does NOT strip the ~35.7 KB `renderer.js` from
  populated Level-0-only pages (e.g. node 826: 7 nodes, zero Lit tags), because `renderer.js` and
  the 5 token CSS files are coupled in ONE library (`mosaic.libraries.yml:1–22`) and a Level-0 page
  legitimately needs the CSS. `ATTACH-CSS-only` is UNREACHABLE under the coupled library. Full
  closure (F-046-B) requires either a has-Lit-node gate or splitting the library into `renderer_css`
  (attach when `$rendered !== []`) + `renderer_js` (attach only when a Level-2 tag — mosaic-tabs/
  carousel/live-search — will actually render). Severity LOW (payload only; `defineIfPresent` in
  `js/src/renderer/index.ts:18–26` makes the dead JS inert at runtime). Wave 5.

**Status update:** F-046 fix approach RE-RATIFIED (formatter render-emptiness skip). RED specs
  written (W22 series: `js/e2e/anon-renderer.spec.ts` + `tests/src/Kernel/Hook/MosaicAnonRendererCacheTest.php`).
  Implementation = PART C, pending RED audit (which is gated on B4 fixture sanction).
**Cross-reference:** CP-ANON-RENDERER Part A/B, AI/TODO.md 2026-07-29. FINDING-058 (sibling, own CP).

---

## FINDING-059 — W12-S03 parity heading-color baseline flaky (admin builder cold boot)

**Observed:** recurred 2026-07-28 and 2026-07-30 (both retry-passed). Escalated from the
  flaky register to a formal finding per the recurrence rule (2+ occurrences).
**Class:** Test flake / performance — admin builder cold-boot latency.
**Surface:** `js/e2e/fe-dialog-parity.spec.ts:706` — `W12-S03: admin builder canvas
  heading-color baseline is rgb(23, 23, 23) (surface parity)`.
**Evidence:**
  - 2026-07-30 (CP-ANON-RENDERER C-2 parity re-run): first attempt ✘ timed out at 30.7s,
    passed on retry → suite reported "1 flaky", EXIT 0. Log: `js/w22b-regress-parity.log`.
  - 2026-07-28: prior flaky-register entry, same test, same retry-pass pattern.
**Not caused by CP-ANON-RENDERER:** the test exercises the ADMIN BUILDER surface (rendered on
  `node/edit`, a form — `hook_entity_view` never fires there), so the F-046 formatter/hook
  attach change provably cannot affect it. The flake predates and is orthogonal to that CP.
**Suspected cause:** slow admin-builder cold boot (first Puck/React mount + asset compile on a
  cold DDEV/opcache state) occasionally exceeding the assertion's implicit wait, so the heading
  computed color is read before the design-system CSS token resolves.
**Severity:** LOW — always retry-passes; no product defect; affects only CI/local run stability.
**Fix direction (Wave 5.2):** investigate the admin-builder cold-boot path — add an explicit
  web-first wait for the builder-ready signal (or the resolved `--mosaic-*` token) before the
  color assertion, rather than relying on retry. Consider a warm-up navigation in the parity
  suite's beforeAll.
**Cross-reference:** CP-ANON-RENDERER Part C-2 D4 (parity flake note). AI/TODO.md 2026-07-30.
**Wave placement:** Wave 5.2 — test-stability. Severity LOW.
**REPRODUCED 2026-08-09 (Wave C H2.d):** W12-S03 failed 1 of 2 back-to-back 2-worker
  fe-dialog-parity runs and passed the other → confirmed live non-deterministic flake, independent of
  Wave C changes. Stabilization (3 consecutive green, no sleeps) needs the cold-boot heading-color
  race diagnosed + fixed; per H0 charter this finding is Wave-5.2-placed (vague for Wave C) → the
  fix is PARKED, reproduce half done.

---

## FINDING-060 — Builder prop-panel fields lose label/placeholder when unfocused (WALK-CATCH #16)

**Observed:** 2026-07-30, Arun eye-test walk (B-094 / CP-SDC-PROPS Tabs prop panel).
**Class:** UX / builder authoring — invisible field affordance.
**Surface:** Puck builder properties panel — observed on the Tabs component's `panel_*`
  string fields (surfaced now that B-094 makes SDC props render).
**Description:** A prop field shows its label/placeholder text ONLY while it holds keyboard
  focus. When unfocused and empty, the field renders as silent empty space — an author cannot
  tell the field exists or what it is for. Author-hostile: empty fields become invisible.
**Repro (Arun manual walk):** open a page with a Tabs component in the builder; inspect the
  props panel; the `panel_1..6` fields have no visible label/placeholder until clicked/focused.
**WALK-CATCH:** #16 (Arun's). Tally: 16 identified / 15 closed.
**Severity:** MEDIUM — no data loss; degrades authoring usability, most acute on components
  with many optional string fields (Tabs panels).
**Scope UNKNOWN (probe required):** is this Tabs-specific, or does EVERY Puck text field in the
  props panel lose its label/placeholder when unfocused? Determines whether the fix is a
  component concern or a global builder-panel field-rendering concern.
**Fix direction:** TBD after the scope probe — likely a persistent field label (not
  placeholder-only) in the Puck field renderer / MosaicPuckAdapter field components. The probe
  RIDES WITH the CP-TABS-REDESIGN research phase (the Tabs data-model redesign will replace the
  panel_* fields anyway; the scope probe decides if other components also need the fix).
**Cross-reference:** ARUN EYE-TEST 2026-07-30 (AI/TODO.md). CP-TABS-REDESIGN (design CP, research
  pending ratification). Carved out of CP-SDC-PROPS — does NOT block the getPropDefinitions()
  plumbing ship.
**Wave placement:** rides with CP-TABS-REDESIGN research. Severity MEDIUM.

**SCOPE PROBE RESOLVED + FIX (Wave E Act 1 / CP-ADMIN-FIELD-UX, 2026-08-20) — FIXED-PENDING-SHIP (#27).**
Scope = **GLOBAL builder-panel concern, not Tabs-specific.** `MosaicPuckAdapter.defToField`/`propsToFields`
built every prop field as a bare `{ type }` — the JSON-schema prop `title` was dropped and `PuckField` had
no `label` member — and no Mosaic CSS styled Puck's field labels. So EVERY declared prop field (not just
Tabs `panel_*`) reached Puck with no persistent caption. **Fix (STRUCTURE only, admin-native):** (1)
`PuckField.label?`; (2) `propsToFields` sets `label = def.title ?? humanizeFieldName(name)` recursively;
(3) ERP + meta custom fields captioned (media/link/entity-ref/breakpoint/visibility/data-source/spacing/
style); (4) shared `css/mosaic-fields.css` (both `builder` + `frontend_editor` libraries) — legible label
weight/size/ink + field rhythm, Claro greys only (visual vocabulary stays Act 2). RED oracle
`FieldLabels.test.ts` 3/3→GREEN; held geometry e2e `f078`… `f060-field-labels.spec.ts`. Gates: dist
rebuilt (builder+FE, libs 1.0.3), phpcs 0/0 (no PHP), Kernel 140/140, Unit 2679/2679, Vitest 444/445
(B-101 pre-existing), W18 9/9, f066 2/2, lock pass, sentinels 200. **Ship #27 = 7 files.** Evidence:
AI/REPORT-WAVEE1.md § PACKAGE 1. **STATUS: FIXED-PENDING-SHIP — Arun field-labels walk (admin + FE) → ship #27.**

---

## FINDING-058 — ADDENDUM (2026-08-01): scope broadened + fixed (CP-LAYOUT-HARDENING)

**Scope broadened (verified in Part A A1):** the original finding described an uncaught
`\TypeError` from `MosaicLayoutValue::fromJson():83` (missing `schema_version`). Part A's consumer
sweep found the blast radius is WIDER: `MosaicLayoutItem::getLayoutValue()` caught only
`\JsonException` and rethrew `InvalidMosaicLayoutException`, but **nobody catches
`InvalidMosaicLayoutException`** anywhere (grep: only `use`/`@throws`/class def). So a purely
SYNTACTICALLY-invalid layout value ALSO 500'd the entity view — not just the structurally-broken
TypeError case. Both paths are now closed by a single typed exception.

**Admin-widget-immune correction:** Part A (2026-07-29) claimed the editor is "locked out of the
FE repair path." Corrected: `MosaicLayoutWidget` never parses the value (it passes the raw JSON to
the JS builder via drupalSettings), so the ADMIN node-edit form is REACHABLE — an editor can always
open the form to repair. Only the FRONTEND entity view (+ the FE inline-edit bar that attaches
during that view) was 500-blocked. `MosaicLayoutMigrationWorker` does not call fromJson/getLayoutValue
(not in the blast radius).

**RenderPreviewController correction:** A1's first pass said it had "no validator gate before
fromJson." Re-read: it DOES validate at L122 (schema `required:["schema_version","root","nodes"]`),
so structural breaks were already 422'd — its live status was 422, not 500. The fromJson catch was
widened anyway as defense-in-depth.

**Fix (ratified typed-exception design):** new `MalformedLayoutException` (extends
`InvalidMosaicLayoutException`); `fromJson()` validates the envelope + breakpoint_states and throws
it (wrapping JsonException + node-construction TypeErrors); `getLayoutValue()` catches `\Throwable`
and rethrows typed; the render-surface callers (formatter, `renderLazy`, RenderPreviewController)
catch the typed exception, emit ONE injected-logger `warning` with entity/field context, and degrade
to an empty render (or 422 for preview). Net: a malformed layout renders an intact 200 empty page +
one watchdog warning, never a 500.

**Evidence:** RED baseline `tests/f058-red.log` (TypeError thrown) + curl 844 → 500. GREEN
`tests/f058-green.log` (17/17), street test curl 844 → 200 + one watchdog warning (severity 4,
@type=node @id=844 @field=field_mosaic_layout), guards 826/842/843 → 200. Playwright W22-LS7 oracle
flipped to 200.

**Status:** FIXED-PENDING-SHIP (2026-08-01), own CP (R6). 6 files + Kernel test (oracle flip +
IC1–IC6). Nothing staged.
**Cross-reference:** CP-LAYOUT-HARDENING Part A/B (AI/TODO.md 2026-07-31 / 2026-08-01).

---

## FINDING-044 — RESOLVED (2026-08-01, CP-DOC-TRUTH, class (a))

**Resolution:** docs-tell-truth (Arun ruling). MOSAIC.md L438–445 rewritten from the fictional
"Promote to global" button flow to the REAL mechanism: `mosaic_global_template` config entities +
the `sync_to_config` "Export to deployment config" toggle (`MosaicGlobalTemplateForm.php:81`) +
`MosaicConfigExportSubscriber::onExportTransform()` filtering `sync_to_config: false` from
`drush config:export`. Heading → "Deploying a Global Template Across Sites". Doc now states
explicitly there is no one-click promote-from-local action.
**Feature candidate registered:** a real "Promote to global" UI is a DESIGN-PHASE candidate
(sibling of F-037), per Arun. Not built in this CP.
**Status:** CLOSED-ON-SHIP (docs corrected). Cross-ref: AI/TODO.md CP-DOC-TRUTH 2026-08-01.

## FINDING-045 — RESOLVED (2026-08-01, CP-DOC-TRUTH, class (a))

**Resolution:** docs-tell-truth (Arun ruling). MOSAIC.md L453 rewritten to state site-local
(content-entity) templates are NOT revisioned — edits overwrite the stored JSON in place, no UI
rollback (matches `MosaicTemplate extends ContentEntityBase` with no RevisionableInterface). Kept
the true line "Global (config) templates are versioned via git".
**Feature candidate registered:** implementing `RevisionableInterface` on MosaicTemplate is a
feature candidate for its own CP if ever ratified, per Arun.
**Status:** CLOSED-ON-SHIP (docs corrected). Cross-ref: AI/TODO.md CP-DOC-TRUTH 2026-08-01.

## FINDING-061 — MOSAIC.md permissions code block is fictional (drifted from mosaic.permissions.yml)

**Observed:** 2026-08-01, CP-DOC-TRUTH D3 sweep (read-only).
**Class:** Documentation accuracy — example permissions block misrepresents the real permission model.
**Surface:** MOSAIC.md permissions code block (L421–429).
**Evidence:** the fenced YAML example lists permission machine names AND titles that match NONE of
  the six real permissions in `mosaic.permissions.yml`:
  - doc `create mosaic templates` / 'Save layouts as reusable templates' — real is
    `mosaic.create_templates` / 'Create and save Mosaic templates'.
  - doc `manage mosaic templates` / 'Edit and delete site-local templates' — real is
    `mosaic.manage_site_templates` / 'Manage site-wide Mosaic templates'.
  - doc `administer mosaic templates` / 'Manage global template config, promote site-local
    templates to global' — real is `mosaic.administer` / 'Administer Mosaic'.
  - Real set also has `mosaic.use_builder`, `mosaic.use_templates`, `mosaic.break_lock` — none
    shown in the doc block.
  - The doc's "promote site-local templates to global" title phrase also contradicts the corrected
    F-044 text (there is no promote flow).
**Impact:** readers copying/relying on the documented permission names would reference permissions
  that do not exist; the block misrepresents the whole permission model.
**Severity:** LOW-MEDIUM (doc accuracy; no runtime impact).
**Fix direction:** same-class docs-tell-truth — rewrite the code block to the six real permissions
  and titles from `mosaic.permissions.yml`. A separate rider (NOT bundled into CP-DOC-TRUTH, which
  was chartered for F-044/045 only).
**Cross-reference:** CP-DOC-TRUTH D3 sweep (AI/TODO.md 2026-08-01). F-044 (promote phrase).
**Wave placement:** docs-tell-truth rider; RATIFIED 2026-08-01 — fix-in-flight CP-DOC-PERMS.

---

## FINDING-061 — RESOLVED (2026-08-01, CP-DOC-PERMS, class (a))

**Resolution:** docs-tell-truth (Arun ruling, ratified immediate rider). MOSAIC.md permissions
code block rewritten from the fictional 4-permission list to the SIX real permissions verbatim
from `mosaic.permissions.yml` — `mosaic.use_builder`, `mosaic.use_templates`,
`mosaic.create_templates`, `mosaic.manage_site_templates`, `mosaic.administer`,
`mosaic.break_lock` (machine names, titles, descriptions, `restrict access` flags). Heading
"Template Permissions" → "Permissions". The "Typical assignment" prose (same-class) was also
corrected to real names (was "all four" / fictional names).
**Status:** FIXED-PENDING-SHIP. Cross-ref: AI/TODO.md CP-DOC-PERMS 2026-08-01.

## FINDING-062 — MOSAIC.md scaffold-inventory permissions line stale / references missing file

**Observed:** 2026-08-01, CP-DOC-PERMS D3 sweep (read-only).
**Class:** Documentation accuracy — scaffold-files inventory line stale.
**Surface:** MOSAIC.md L59 (Scaffold files section).
**Evidence:** L59 reads "`mosaic/scaffold/mosaic.permissions.yml` — 5 permissions (use_builder,
  use_templates, create_templates, manage_site_templates, administer)". Two issues:
  1. The scaffold file does NOT exist (`find . -path "*scaffold*permissions.yml"` → nothing).
  2. Count "5 permissions" omits `mosaic.break_lock`; the LIVE `mosaic.permissions.yml` has SIX.
     (break_lock was a Phase-4 locking addition, plausibly post-scaffold — so the 5-count may be
     historically accurate for the scaffold, but the file is now absent to verify.)
**Impact:** a reader may expect a scaffold permissions file that isn't present, and the 5-vs-6
  count may confuse against the corrected Permissions block.
**Severity:** LOW (doc accuracy; scaffold-inventory staleness).
**Fix direction:** part of a broader "Scaffold files inventory is stale" doc pass — verify each
  scaffold-section path exists and correct counts, OR remove/annotate the scaffold section if the
  scaffold/ boilerplate was retired. Separate rider; NOT bundled into CP-DOC-PERMS (chartered for
  the live permissions block only).
**Cross-reference:** CP-DOC-PERMS D3 sweep (AI/TODO.md 2026-08-01). F-061 (permissions block).
**Wave placement:** docs-tell-truth rider; Arun ratification pending.

---

## FINDING-050 — RESOLVED (FE-path) 2026-08-01, CP-FE-LOCK increment 1

**Resolution (Option A, allow-when-unlocked):** FrontendSaveController::save() now injects
MosaicLayoutLockManager + current_user + logger; when the target layout is held by a DIFFERENT
active user it returns **409** typed JSON (mirrors LayoutLockController 409 shape) + one watchdog
warning (entity/field/holder). Unlocked and self-held saves proceed; programmatic `$entity->save()`
is never blocked (Option A boundary, guard-tested). New primitive
`MosaicLayoutLockManager::isLockedByOther()`.
**PARTIAL:** the ADMIN node-form save path (D1b) is INCREMENT 2 — F-050 is not fully closed until
both interactive save paths enforce. Status: FE-path FIXED-PENDING-SHIP; admin-path OPEN (increment 2).
**Tests:** FrontendSaveControllerLockTest 4/4 (RED→GREEN); tests/w33-f050-{red,green}.log.
**Cross-ref:** AI/REPORT-W33.md increment 1.

## FINDING-063 — RESOLVED 2026-08-01, CP-FE-LOCK increment 1 (in-charter per Arun ruling)

**Resolution:** LayoutLockController::access() (the shared gate for all 5 lock routes) now takes
{entity_type, entity_id}, loads the entity, and requires `update` access in addition to
mosaic.use_builder (mirrors FrontendSaveController::access). A builder who cannot edit the entity no
longer reaches acquire/release/break/status/stream — closing both the arbitrary-entity lock
manipulation and the status/stream holder-identity leak (leak now reaches only users who can edit
the entity, for whom seeing the "Locked by X" holder is legitimate; documented in REPORT-W33 C0).
Break remains additionally gated on mosaic.break_lock in the method body.
**Tests:** LayoutLockControllerAccessTest 4/4 (editor allowed, no-access forbidden, anon forbidden,
missing forbidden). Oracle upgrade to the existing anon access test (signature change), ledgered.
**Status:** FIXED-PENDING-SHIP. **Cross-ref:** AI/REPORT-W33.md A1 + increment 1.

---

## FINDING-050 — FULLY RESOLVED 2026-08-02 (CP-FE-LOCK, both save paths)

**Update to the 2026-08-01 FE-path record:** the ADMIN node-form path is now also enforced (D1b).
`MosaicLayoutWidget::validateJson` (#element_validate) rejects a foreign-held save with a form error;
because #element_validate runs only during interactive Form API validation, programmatic
`$entity->save()` (drush/migration/API) is never blocked (Option A boundary). Widget injects
MosaicLayoutLockManager. Tests: MosaicLayoutWidgetLockTest 3/3 (foreign→error, unlocked/self→none).
**Status:** FIXED-PENDING-SHIP — BOTH interactive save paths enforced (FE controller 409 + admin
form error). Cross-ref: AI/REPORT-W33.md N3.

## FINDING-054 — RESOLVED (source) 2026-08-02, CP-FE-LOCK rider

**Resolution:** MosaicHooks::entityView Pass-2 now mirrors the builder widget's
`mosaic_media/media_library_bridge` attach behind a `moduleExists('mosaic_media')` guard, inside the
editor-gated (use_builder + update) block — so anonymous viewers never receive it (F-046/057 class).
MosaicHooks gained ModuleHandlerInterface (+services.yml). DI-verified (drush cr + entityView smoke
9/9). Live negative-guard confirmed (mosaic_media disabled → no attach; frontend_editor still
attaches).
**Test status:** POSITIVE render assertion now VERIFIED. ARUN SANCTION 2026-08-02 ("BLOCK 2 sanctioned
— enable mosaic_media"): mosaic_media installed on dev; live drush-scr render of node 826 →
**UID1 BRIDGE=YES EDITOR=YES**, **ANON BRIDGE=NO EDITOR=NO** (bridge attaches only inside the
editor-gated block; anon never receives it). Sentinels 826/841/842/843/844 → all HTTP 200 (no render
regression after module enable). Full mosaic Kernel suite re-run with mosaic_media enabled → OK
(105 tests, 497 assertions). Both guard directions (module-on positive, anon-absent) now proven live.
Evidence: tests/w33-d5-positive.log, tests/w33-d5-sentinels.log, tests/w33-d5-kernel-rerun.log.
**Status:** FULLY-VERIFIED (source + positive render + anon-absent + Kernel green). Cross-ref: AI/REPORT-W33.md D5 / BLOCK 2.

## FINDING-049 / FINDING-051 — client lock UX (increment 2b) — FIXED-PENDING-SHIP + EYE-TEST

Wave 3.3 server enforcement (F-050 both paths + F-063) already REJECTS a foreign-held write
server-side (FE 409, admin form error). Increment 2b adds the client blocked-state UX:
- **F-051 (admin builder):** BuilderApp now (a) writes the acquired session token into the hidden
  lock_nonce field (owner) / clears it (blocked), (b) covers the canvas with a not-allowed
  block-overlay when held-by-other, (c) intercepts the node-form submit while blocked
  (preventDefault in js/src/builder/index.tsx). Break gated on has_break_lock.
- **F-049 (FE dialog):** FrontendBuilderDialog now acquires the lock on open, shows the shared
  lock banner (owner / locked-by-@name), gates Break on drupalSettings.mosaic.frontend.hasBreakLock,
  and releases on close. FE save remains server-guarded (409) — the banner is advance warning.
- **walk-catch #18:** the banner is restyled Drupal-admin-native (css/mosaic-lock.css, Claro
  messages--warning: warning colour/border/spacing + a proper destructive Break button), attached to
  both the builder and frontend_editor libraries.
Verified: typecheck PASS; builder Vitest 362/363 (1 pre-existing MosaicPuckAdapter failure, unrelated);
dist rebuilt (builder first, FE last) with lock code confirmed in both bundles; drush cr clean.
**Status:** FIXED-PENDING-SHIP (source + dist built + typechecked). Browser lifecycle + banner
geometry oracles (boundingBox) are HELD (e2e F-048, local-only) → Arun eye-test round 2 verifies.
Cross-ref: AI/REPORT-W33.md increment-2b D2/D3/D4/D5.

## FINDING-064 — WALK-CATCH #17 (Arun's walk) — admin node-form stale-resubmit lands a locked-out save (lost update)

**Severity:** MODERATE-HIGH (silent data-integrity / lost-update — defeats the lock in a race window).
**Surface:** admin node-form save path ONLY (native HTML navigation POST to `/node/{nid}/edit`).
**Discovered:** 2026-08-02 eye-test walk, WALK-CATCH #17.

### Testimony (Arun, verbatim intent)
Foreign-held save correctly refused with a form error → user hit browser refresh → browser
"resend the form?" popup → Continue → the SAME payload was re-sent. Meanwhile the lock HOLDER had
closed the editor (lock released). The resubmitted save then SUCCEEDED silently; the change
persisted (verified in both windows). The user never re-clicked Save.

### Witnessed mechanism (verified in code, not memory)
1. `MosaicLayoutWidget::validateJson()` L223 rejects ONLY when `isLockedByOther()` is TRUE — the
   ratified **allow-when-unlocked** semantics (reject only while foreign-held-active).
2. On that validation error, `FormBuilder::processForm()` (web/core/.../FormBuilder.php L614)
   reaches `doSubmitForm()` — which is where the redirect/PRG is set — ONLY when
   `!FormState::hasAnyErrors()`. A validation error SKIPS the submit+redirect block entirely; the
   form is re-rendered at HTTP 200. **There is no Post/Redirect/Get on validation failure (core
   behavior, by design).** The browser's last navigation stays the POST to `/node/826/edit`, so a
   refresh re-issues it ("resend?" popup).
3. The stale resubmit lands in the window AFTER the holder released: entity is no longer
   foreign-held → `isLockedByOther()` returns FALSE → validateJson L223 passes → save succeeds. The
   allow-when-unlocked rule is exactly what lets the stale payload through.

### Evidence (P2 — node 826 revision timeline)
- `vid=1451  2026-08-02 23:50:50  uid=3 (walktester)  default=Y` ← the stale-resubmit save; now the
  LIVE revision.
- `vid=1387  2026-07-17 22:38:33  uid=1 (admin)  default=n` ← prior.
- The locked-out user's (walktester) resubmit overwrote and became the default revision. Confirms
  the lost-update precisely.

### Surface parity (P3)
- **FE dialog (FrontendSaveController): NOT exposed.** The FE save is `fetch(url, {method:'POST'})`
  (js/src/frontend-editor/FrontendBuilderDialog.tsx L254-255) → `JsonResponse`. A `fetch` POST
  creates NO browser navigation/history entry, so a refresh reloads the GET page — it does not
  re-issue the POST, and no "resend?" popup exists for it. This mechanism is admin-form-specific.

### Fix directions (P4 — design only, no code)
- **(a) Client JS intercept** — on the lock error re-render, clear/disable the hidden `layout_json`
  textarea (validateJson returns early on empty value, L201-203) so a resubmit carries nothing.
  + low risk, no server-semantics change, ships safely. − JS-dependent (no-JS / curl replay bypass);
  defense-in-depth only.
- **(b) Lock nonce / require-live-self-lock (RECOMMENDED)** — embed a token bound to the submitter's
  CURRENTLY-HELD self-lock; at validate, reject unless a live self-lock nonce matches, even if the
  entity is unlocked. + server-authoritative, closes it for ALL clients (no-JS, curl replay,
  refresh-resubmit); composes with the deferred admin-lock-acquire work (D4/F-051) which must
  acquire a self-lock anyway; programmatic/drush/API saves stay untouched (they never run the widget
  validate). − CHANGES the ratified allow-when-unlocked semantics for the ADMIN FORM ONLY (→
  "require live self-lock session") and is COUPLED to D4 (the admin form must acquire a lock to mint
  the nonce). **FLAG FOR ARUN — semantics ruling required.**
- **(c) PRG on validation failure** — redirect after error so the browser lands on a GET.
  REJECTED: fights core (core deliberately does not PRG on validation failure — it re-renders with
  errors + preserved input); would require stashing input/errors in session; high blast radius
  (affects every validator on the node form, not just Mosaic's); still no defense against a direct
  curl replay.
- **(d) Do-nothing + document** — REJECTED: the outcome is a reproduced, silent lost-update
  (vid=1451 proof) — the exact data-integrity failure the lock exists to prevent. Not trivial.

**Recommendation:** (b) is the definitive fix, but because it changes ratified semantics and is
coupled to the deferred admin-lock-acquire (D4) work, it must NOT be rushed into ship #19 as-is.
Sequence: land (b) WITH the increment-2b admin-lock work, pending Arun's ruling on the semantics
change; ship (a) as an interim client mitigation only if #19 needs immediate coverage before (b).

**Status:** OPEN → **FIXED-PENDING-SHIP** (2026-08-03, increment 2b). Arun ruled 'sibling ratified'
— option (b) approved, admin-form semantics change to require-live-self-lock RATIFIED. Implemented:
MosaicLayoutLockManager mints a per-session token (isValidSelfLockToken, hash_equals); the widget
adds a hidden lock_nonce and validateJson requires a valid live-self-lock nonce; the admin builder
writes the token into the nonce field; LayoutLockController returns the token owner-only. RED→GREEN
proven — MosaicLayoutWidgetNonceTest 6/6 (stale-resubmit rejected · self-held-no-nonce rejected ·
valid-nonce allowed · re-acquire replay rejected · foreign-held rejected · token stable). Shipped
widget lock test oracle updated (unlocked→rejected, self-held→needs-nonce). Full Kernel 111/111,
528 assertions. Cross-ref: AI/REPORT-W33.md C1/D1 + increment-2b; AI/TODO.md.

## FINDING-065 — WALK-CATCH #19 (Arun's walk) — legit walktester save on node 826 refused ("session expired")

**Severity:** HIGH (blocks legitimate editing; affects EVERY editor whose browser cached the pre-2b
builder.js until a hard refresh — a shippability blocker for increment 2b as built).
**Surface:** admin node-form save (validateJson require-live-self-lock).
**Discovered:** 2026-08-03 eye-test round 2, TEST-1.

### Testimony
walktester opened /node/826/edit, edited, clicked Save → refused with "Your edit session has expired
or the layout is no longer locked to you." (the stale-session branch of validateJson).

### Evidence (read-only probe Q1–Q5)
- **Q3 (live):** node 826 HAS a LIVE lock held by uid=3 (walktester), token `d8a95597…` (32ch),
  ~67s to expiry (heartbeat actively refreshing). Server mints tokens correctly (scratch acquire →
  32ch token). So the refusal is NOT expiry and NOT a missing server token.
- **Q2 (heartbeat):** LockManager.ts HEARTBEAT_INTERVAL_MS=30_000 re-POSTs acquire (setWithExpire
  refresh) every 30s; TTL=90s → 3× margin. Started on the admin surface (BuilderApp acquire on
  mount). The lock cannot die under an active editor — confirmed live (826 alive at 67s).
- **Q5 (parity):** BOTH page(826) and article(332) form displays use the mosaic_layout widget; the
  nonce read path `array_merge(array_slice($element['#parents'],0,-1),['lock_nonce'])` →
  [field_mosaic_layout,0,lock_nonce] is bundle-agnostic. No page-vs-article difference.
- **Q1 (logging gap):** validateJson writes NOTHING to watchdog on refusal (no logger injected) and
  does not distinguish no-live-self-lock vs token-mismatch. The only mosaic warnings are unrelated
  ("Skipped a malformed Mosaic layout on node 844"). Sub-finding: admin-path refusal is silent.

### Root cause
walktester HOLDS a live self-lock with token `d8a95597…`, yet the save hit the stale-session branch
→ `isValidSelfLockToken()` returned FALSE → the SUBMITTED NONCE was empty (≠ the live token). The
lock being alive (heartbeat = pre-2b shipped code) while the nonce is empty (write = new 2b code)
is the smoking gun: **Arun's window ran a STALE/cached builder.js.** The old bundle acquires +
heartbeats the lock (explains the live lock + token + owner banner, all pre-2b) but has no
`onLockTokenChange` → the hidden lock_nonce is never written → the server refuses a legitimate save.
The e2e on node 332 PASSED because it ran a fresh browser context with the rebuilt bundle.

### The deeper fragility
The require-live-self-lock save DEPENDS on client JS writing the nonce. Any editor with a cached
pre-2b builder.js (or if a future JS regression drops the write) is locked out of saving even while
holding a live lock. This is the client-JS-write coupling flagged in the overnight brief; TEST-1 is
that risk materialising.

### Fix directions (design only)
1. **Immediate:** hard-refresh (Ctrl+Shift+R) to load the rebuilt builder.js; confirm via the Q4 DOM
   check. Ensure the library carries a cache-busting query so editors auto-fetch the new bundle.
2. **Durable (remove the client-JS-write dependency) — RECOMMENDED, needs Arun ruling:**
   (a) Server-seed the nonce at form build by acquiring/heartbeating the submitter's self-lock, so
       the nonce is server-populated independent of JS; OR
   (b) Make validateJson's PRIMARY check "submitter holds a LIVE self-lock (uid match)" and treat the
       token/nonce as an ADDITIONAL replay guard only. A live editor (stale or absent JS) can then
       save; only a submitter with NO live self-lock is refused — which STILL closes walk-catch #17
       (the locked-out user never held a lock). Trade-off: (b) weakens the re-acquire-replay edge
       that the token guards; (a) keeps full protection at the cost of a GET-time lock acquire.
3. **Logging:** validateJson should log the refusal (channel mosaic), distinguishing no-live-self-lock
   vs token-mismatch (closes the Q1 gap).

**Status:** OPEN. Ship #20 FROZEN pending root-cause confirmation (Q4 DOM check) + fix ruling.
Cross-ref: AI/REPORT-W33.md WALK-CATCH #19; AI/TODO.md ship #20 freeze.

### FINDING-065 — ROOT-CAUSE CORRECTION (2026-08-08, addendum probe Z1–Z5)

The stale-JS story is **WRONG and withdrawn.** Evidence:
- **Z1 (served==disk):** disk builder.js sha 1f6b8750… == served bytes at ?tjfmhc (curl), both contain
  `data-mosaic-lock-nonce`. The fix IS in the served bundle. The reviewer's "hard-refresh cures it"
  prediction FAILED; Arun's continued STOP (ship frozen) was correct.
- **Z3 (server seeds the nonce):** building /node/826/edit as uid3, the widget renders
  `lock_nonce #type=hidden #default_value=b10c3582…(32ch)` — the server SEEDS the field with the live
  lock token; `data-mosaic-lock-nonce` is a SERVER-printed attribute; value #parents
  [field_mosaic_layout,0,value] matches validateJson's read. **A no-JS save would SUCCEED.**
- **Z2 (the real mechanism — client clobber):** LayoutLockController::stream()'s SSE `lock-status`
  payload omits `token` (only acquire() L83 and status() L131 include it). LockManager.ts parses that
  token-less event as LockStatus (token optional → undefined) and emits it; BuilderApp
  `setLockStatus(status)` then runs the effect `onLockTokenChange(owner ? (lockStatus.token ?? '') :
  '')` → writes **''**. So: acquire() writes the token to the nonce → the SSE `lock-status` event
  (on connect, and on every ~28s reconnect) fires with NO token → the effect **overwrites the nonce
  with ''** → the form submits an empty nonce → require-live-self-lock refuses a legit owner save.
- **Z4 (why e2e 332 passed):** lock-2b.spec.ts beforeEach BREAKS the lock → every run does a FRESH
  acquire, and the owner-save test clicks Save within ~1s of acquire — racing AHEAD of the SSE
  first-emit that would wipe the nonce. It never reaches the steady state (SSE-connected, nonce
  already wiped) that Arun's continuously-held, human-speed session is always in.

**TRUE root cause (Z5 verdict = "other"):** token-absent-on-**SSE-refresh**. The server seeds and
acquire() writes the correct nonce, but the SSE `lock-status` event carries no token and BuilderApp's
`onLockTokenChange` effect unconditionally writes `lockStatus.token ?? ''` on every lockStatus update
→ the client wipes its own server-seeded/acquire-written nonce to ''. NOT stale cache, NOT
served≠disk, NOT attr-client-only, NOT parents-mismatch, NOT already-held-acquire-missing-token
(acquire returns the token fine), NOT bundle-missing-write. It is the SSE-event/client-effect clobber.

**Fix direction (design only, corrected):**
1. Include `token` (owner-only) in the SSE stream() lock-status payload, mirroring status(), so the
   SSE-driven setLockStatus carries the token and the effect writes it, not ''.
2. AND make BuilderApp's effect NEVER wipe the nonce while owner with no token in-hand — write the
   token only when present; never overwrite a good nonce with '' on a token-less owner update. (The
   server already seeds the correct nonce; the client must not clobber it.)
3. (Still valid) add validateJson refusal logging distinguishing no-live-self-lock vs token-mismatch.

**Status:** OPEN. Ship #20 STAYS FROZEN pending the corrected fix + ruling. Cross-ref: AI/REPORT-W33.md
WALK-CATCH #19 addendum.

### FINDING-065 — RESOLVED (source), FIXED-PENDING-SHIP (2026-08-08, ratified 'sse-fix')

Root cause was SSE token omission + client clobber (server-seed + acquire + validateJson were already
correct). Four-part fix applied:
1. **SSE token owner-only:** extracted `MosaicLayoutLockManager::viewerStatus(type,id,viewerUid)` — the
   owner-gated payload (token only when viewer == holder). LayoutLockController::status() AND ::stream()
   now BOTH use it, so the SSE lock-status event carries the token for the owner (it no longer omits it).
2. **BuilderApp never wipes a good nonce:** the token effect writes the token only when present; a
   token-less OWNER update (any status refresh) no longer overwrites the nonce with ''. Still clears on
   blocked/released.
3. **validateJson refusal logging:** injected logger.channel.mosaic; ONE warning per refusal,
   distinguishing foreign-held / no-live-self-lock / token-mismatch, with @type/@id/@field/@uid.
4. **Cache-bust:** builder + frontend_editor libraries gain `version: 1.0.1`; drush cr bumped the asset
   query tag tjfmhc→tjfq24 so editors auto-refetch the fixed bundle.
**Proof:** e2e @2b-sse-steady (wait for SSE emit → save) RED before / GREEN after (tests/w33-2b-y1-sse-red.log,
w33-2b-y3-e2e-green.log); full lock-2b 4/4; Unit viewerStatus 23/23 (owner gets token, non-owner
never); Field+Controller Kernel 71/71; full Kernel 111/111 (528 assertions); sentinels 5×200; phpcs 0/0.
**Status:** FIXED-PENDING-SHIP. Walk-catch #19 pending Arun re-walk (hard-refresh not required now —
cache-bust ships it). Cross-ref: AI/REPORT-W33.md WALK-CATCH #19 fix; AI/TODO.md ship #20.

## FINDING-066 — WALK-CATCHES #20 + #21 + #22 (Arun eye-test round 3) — FE dialog blocked-state gaps

**Severity:** MODERATE (server 409 backstop means no data loss; these are UX-parity + claimed-but-absent
feature gaps). **Surface:** FrontendBuilderDialog (frontend inline-edit). **Discovered:** 2026-08-08.

- **#22 (claim-vs-reality — the F-049 resolution is INACCURATE):** the FE dialog gates its Break button
  on `drupalSettings.mosaic.frontend.hasBreakLock` (FrontendBuilderDialog.tsx L112-114, L470), but NO
  PHP ever sets that key. grep: `has_break_lock` is set ONLY by the admin widget
  (MosaicLayoutWidget.php:158, on drupalSettings.mosaic[fieldId]); MosaicHooks entityView attaches
  `mosaicFrontendEdit` but never `mosaic.frontend.hasBreakLock`. Live render of node 826 as uid1:
  `drupalSettings.mosaic.frontend` = ABSENT; no break flag in `mosaicFrontendEdit`. → the FE Break
  button is DEAD CODE — it never renders regardless of the user's mosaic.break_lock permission.
- **#20 (no blocked-state enforcement in the dialog):** when locked-by-other the FE dialog shows the
  banner ONLY — no block overlay, no Puck disable, no submit intercept (unlike the admin BuilderApp,
  which has all three). The overwrite is prevented server-side: FrontendSaveController returns 409
  (test: FrontendSaveControllerLockTest::testForeignHeldSaveReturns409, L142-147). So #20 is a
  defense-in-depth/UX gap, not a data-loss bug.
- **#21 (banner icon parity):** the admin locked banner has an inline "⚠" (BuilderApp.tsx:464
  `<span>⚠ {tFmt(...)}</span>`); the FE dialog locked banner omits it
  (FrontendBuilderDialog.tsx:469 `<span>{tFmt(...)}</span>`). css/mosaic-lock.css provides
  `::before { content: "✓" }` for `--owner` only — there is NO `--locked::before` and the base
  `.mosaic-lock-banner::before` has no `content`. So the admin locked banner shows ⚠ (JSX-inline)
  while the FE dialog locked banner shows no icon.

**Fix direction (design only):** #22 — set `drupalSettings.mosaic.frontend.hasBreakLock =
$account->hasPermission('mosaic.break_lock')` in the FE attach (MosaicHooks entityView), OR read the
existing per-field admin flag; #20 — mirror the admin block overlay + Break wiring in the dialog (and
wire break to the LockManager already imported); #21 — move the warning icon into CSS
(`--locked::before { content: "⚠" }`) so both surfaces get it from one place, and drop the inline ⚠.

**Status:** OPEN (design-phase). Cross-ref: AI/REPORT-W33.md round-3 probe; F-049 correction below.

### FINDING-049 — CORRECTION (append-only, 2026-08-08)
The F-049 resolution claim "Break gated on drupalSettings.mosaic.frontend.hasBreakLock" is INACCURATE:
that flag is never set by PHP (witnessed — live render node 826 uid1: mosaic.frontend ABSENT), so the
FE Break button never renders. The FE blocked-state is banner-only; enforcement is the server 409.
F-049's FE break/blocked-UI is therefore NOT functionally complete — re-scoped under FINDING-066.
(Note only — not applied to the F-049 body pending Arun ruling.)

**RESOLVED 2026-08-09 (Wave C ship #24):**
- **#22 (dead break button):** `MosaicHooks::entityView()` now emits
  `drupalSettings.mosaic.frontend.hasBreakLock = currentUser.hasPermission('mosaic.break_lock')` once,
  inside the editor-gated path (anon never receives it) — the flag the FE dialog already read but that
  was never set. RED→GREEN Kernel: MosaicFrontendEditAttachTest (break-editor→TRUE, plain→FALSE,
  anon→absent).
- **#20 blocked-state + #21 banner-icon:** FrontendBuilderDialog now computes `isBlocked`, freezes
  editing via the admin builder's EXISTING `.mosaic-builder-canvas` wrapper + `.mosaic-builder-block-
  overlay` (zero new CSS, no @layer risk), intercepts Save (`if (isBlocked) return` + disabled Save
  button), and prefixes the locked banner with ⚠ (parity with BuilderApp:464). e2e:
  js/e2e/f066-fe-lock-parity.spec.ts GREEN 2/2 (geometry oracle overlay-covers-canvas, Save disabled,
  ⚠ banner, admin Break→takeover clears block). Dist rebuilt (builder→frontend-editor), drush cr.

## FINDING-067 — CANDIDATE (probe-only) — SSE takeover latency: stale banner after break

**Severity:** LOW (Arun round-3 observation). **Probe-only — not confirmed.**
Observation: after admin broke window-2's lock, window-2's green "You are editing" banner lingered
>60s. Candidate causes (code-quoted, unconfirmed):
1. **SSE change-detection is keyed on locked/unlocked boolean, not owner** — stream() emits only when
   `$lastLockedState !== $isLocked` (locked↔unlocked). A takeover (break → re-acquire by another user)
   that lands between the 2s polls is locked→locked = NO emit → the previous owner's banner never
   updates.
2. **Heartbeat ignores responses** — LockManager.startHeartbeat (L132-145) `.catch(()=>{})` silences
   all outcomes; a 409 (foreign-held after takeover) never flips the banner to blocked, and a
   successful re-acquire of a just-freed lock silently keeps window-2 as owner (break defeated).
3. **SSE reconnect gap** — the 28s stream deadline + reconnect can leave a window with no updates.
**Next probe (to confirm):** two-window e2e — window A owns, window B breaks+acquires, assert window A
banner flips to blocked within N seconds (expect RED). Register real FINDING-067 if confirmed.
**Status:** CANDIDATE. Cross-ref: AI/REPORT-W33.md round-3 P4.

---

## WAVE A — FINDINGS REFRESH (append-only bulk-close, ratified R5/R6, 2026-08-08)

Per Arun ruling R5 (bulk-close shipped) + R6 (close F-016). These are correction entries; the finding
bodies above are unchanged.

- **F-050 — CLOSED-ON-SHIP.** FrontendSaveController 409 + admin validateJson enforcement shipped in
  the CP-FE-LOCK Wave 3.3 server package (commit `e2e263c`, ship #19). Witnessed (REPORT-GRAND E1).
- **F-054 — CLOSED-ON-SHIP.** media_library_bridge editor-gated attach; shipped `e2e263c` (#19),
  positive-verified live (REPORT-W33 BLOCK 2).
- **F-063 — CLOSED-ON-SHIP.** LayoutLockController::access per-entity update; shipped `e2e263c` (#19).
- **F-058 — CLOSED-ON-SHIP.** Structurally-incomplete layout guard; shipped #16 (CP-LAYOUT-HARDENING,
  see TODO ship ledger).
- **F-061 — CLOSED-ON-SHIP.** MOSAIC.md permissions block corrected; shipped #18 (CP-DOC-PERMS).
- **F-064 — CLOSED-ON-SHIP.** Lock nonce / require-live-self-lock; shipped `9b94fca` (#20).
- **F-065 — CLOSED-ON-SHIP.** SSE token owner-only + no-wipe + logging + cache-bust; shipped `9b94fca` (#20).
- **F-016 — CLOSED (R6).** "Server-side prop validation on ALL write paths" is witnessed present:
  validators invoked in FrontendSaveController (5), AiGenerateController (5), MosaicLayoutWidget::validateJson
  (7), entity_presave hook (6). The "rc4-BLOCKER, not built" status was stale/overstated (REPORT-GRAND E1).
- **F-062 — CLOSED (Wave A).** MOSAIC.md scaffold-inventory staleness corrected in the doc-truth pass
  (scaffold section replaced with a historical note; real counts 6 perms / 26 routes / ~23 services).

## FINDING-068 — WAVE B / B4 — site-local template ownership (WITNESSED NON-ISSUE + hardening)

Charter suspected a cross-user OVERWRITE hole in TemplateSaveController. WITNESS: save() always
`$storage->create([...])->save()` — a NEW mosaic_template (entity_keys id=>'id' auto-serial), reading
NO 'id' from the payload → no id-injection, no overwrite. MosaicTemplate implements EntityOwnerInterface
(owner=uid); TemplateListController scopes the list to `condition('uid', currentUser)`. So a save can
never overwrite another user's template and no user sees another's. The "overwrite requires
manage_site_templates" ruling is MOOT (no overwrite path). Hardening: save() now sets `'uid' =>
currentUser->id()` explicitly (was relying on the EntityOwnerTrait default). Regression guard:
tests/src/Kernel/Security/TemplateOwnershipTest.php (10 assertions). **Status:** NON-ISSUE, hardened.

## FINDING-069 — mosaic.template.* config schema incomplete (report-only, Wave C/D candidate)

Saving a MosaicGlobalTemplate config entity raises SchemaIncompleteException: `mosaic.template.*`
config schema is missing the `version` and `sync_to_config` keys (both present on the entity's
config_export). Pre-existing schema gap, surfaced by the B2 test. Not a security issue — a
config-schema-completeness debt. **Status:** OPEN (report-only), fix in a doc/schema wave.

## WAVE B — B1 ORACLE-CHANGE RECORD (reviewer-accepted)

PhantomPermissionTest originally included a checkNamedRoute access cell; KernelTestBase does not
enforce an UNDECLARED permission through checkNamedRoute without a request context (non-discriminating
— it passed both before and after). Dropped that cell; kept the deterministic route-requirement oracle
(`getRequirement('_permission') === 'mosaic.administer'`) + a declared-permission assertion. On the
live site core PermissionAccessCheck grants mosaic.administer holders / denies others by construction.
NOT a relaxation — a switch to a deterministic oracle for the same guarantee.

## FINDING-067 — UPDATE (Wave B / B6 probe): NOT-REPRODUCED (SSE-stale hypothesis refuted)

The two-window e2e probe (e2e/f067-probe.spec.ts) shows the previous owner's banner FLIPS to blocked
within ~4s on a foreign break+takeover (GREEN 2/2). The SSE catches the locked→unlocked→locked
transition. The hypothesized "SSE emits only on locked-boolean change → stale owner banner" does NOT
reproduce on current code. F-067 reclassified CANDIDATE → **NOT-REPRODUCED**.

## FINDING-070 — CANDIDATE (report-only) — break-vs-heartbeat re-acquire

Refined hypothesis for the round-3 ">60s green banner linger": if a breaker breaks a lock but does
NOT immediately re-acquire, the broken user's 30s heartbeat re-acquires the now-free lock and
legitimately re-owns (green persists) — i.e. break is defeated by the victim's own heartbeat. This is
a break-EFFECTIVENESS design question, not a stale-banner bug. Needs a >30s two-window probe to
confirm. **Status:** CANDIDATE (report-only), Wave C. Cross-ref: AI/REPORT-WAVEB.md B6.

**PROBE 2026-08-09 (Wave C H2.b) — CONFIRMED by code inspection (definitive, cheaper than a >30s
live probe):** `MosaicLayoutLockManager::acquire()` keys re-acquire on **uid, not token**
(`if ($existing !== NULL && existing.uid !== account.id) return FALSE;` else acquire). `breakLock()`
deletes the lock → `$existing === NULL` → the victim's 30s heartbeat (`LockManager.startHeartbeat`
POSTs the acquire URL) re-acquires the freed lock and re-owns it. **CANDIDATE → CONFIRMED.**
**Severity LOW in practice:** the UI break path (`handleBreakLock` = break→acquire) re-acquires within
ms, so a UI takeover holds the lock before the victim's next heartbeat (≤30s away); only a raw-API
break WITHOUT immediate re-acquire lingers. **Fix design (PARKED — concurrency-semantics change,
not to be rushed):** make the heartbeat RENEW-ONLY — client sends its session token (F-064 already
returns one); server `renew($type,$id,$account,$token)` extends only if
`existing !== NULL && existing.token === token`, never re-acquiring a freed lock; heartbeat calls
renew, and on failure flips the client to blocked/released. Touches LockManager + controller + route
+ LockManager.ts + tests + a >30s two-window live probe.

## FINDING-071 — PRE-EXISTING Unit test-fixture debt (report-only, blocks fully-green Unit suite)

Surfaced by the Wave B regression. 20 errors + 3 failures in the Unit suite live in files Wave B did
NOT modify, and predate it:
- FrontendSaveControllerTest (10 errors) — constructs FrontendSaveController with the OLD signature;
  the controller gained `$lockManager`/`$currentUser`/`$logger` in the shipped F-050/F-064 waves and
  this Unit test was never updated. TypeErrors on construction.
- MosaicLayoutWidgetTest (10 errors) — same class of debt: the widget gained `$logger` (+ others) in
  shipped waves; the Unit test constructs with the old signature.
- Sprint35SmokeTest, Sprint54SmokeTest, MosaicLayoutValueTest (3 assertion failures) — pre-existing
  expectation drift.
The Kernel suite (which the ships DID update) is green (118/118). This is Unit test-fixture rot from
ships #19–#21 (Kernel updated, Unit not). **Status:** OPEN (report-only), fix in a test-hygiene wave
before or alongside ship #22. Wave B did not touch these files or their subjects.

---

## FINDING-072 — Columns canvas vertical stagger = first-child margin exposed by FE canvas reset (walk-catch #25)

**Observed:** 2026-08-16, Arun eye-test round (Wave C Amendment X3). Live geometry probe, node 334.
**Class:** Canvas-reset / @layer family (CP-CANVAS-SCOPE / F-035 / Wave 3.2) — NOT a component-CSS bug.
**Surface:** FE dialog canvas (`.mosaic-fe-dialog__canvas.mosaic-canvas-scope`); admin canvas is correct.
**Evidence (js/e2e/f072-columns-geometry-probe.spec.ts, HELD):**
  - `.mosaic-columns` grid resolves on BOTH surfaces (display:grid, equal cols, gap 16); the two
    `.mosaic-columns__col` halves are TOP-ALIGNED (topDelta 0) — the grid is not the problem.
  - FE: the Puck DropZone wrappers inside the two cols start at 258.91 vs 238.91 → **20px stagger**.
    ADMIN: the same wrappers align (both 1647.28) despite different content.
  - Micro-probe: col paddingTop/borderTop 0, no ::before; DropZone marginTop 0. The stagger is the
    first in-flow child's typographic margin-top, retained INSIDE each col (grid item = BFC → col top
    stays put, content shifts). col1 ~36px vs col2 ~16px.
**Mechanism:** admin canvas normalizes first-child margins; the FE dialog canvas EXPOSES them because
  `.mosaic-canvas-scope { all: revert-layer }` reverts the margin reset. Surface-specific, layering/reset.
**Severity:** LOW-MEDIUM (cosmetic stagger in the FE editor canvas only; frontend render + admin correct).
**Fix direction (candidate — Wave 3.2):** in the canvas-reset LAYER, zero the first in-flow child's
  margin-top inside slot DropZones on both canvases, layered so it never leaks to the frontend render;
  both-surface geometry oracle. Est MEDIUM. Must respect the all:revert-layer interaction (CP-SIDEBAR-SCROLL).
**Wave placement:** Wave 3.2 (F-035 layering campaign). **STATUS: STOP-FOR-RULING** — Arun rules on
  pulling Wave 3.2 forward; X3 ships NO patch this run (no @layer band-aid per F-035 rulings).

---

## FINDING-070 — **CLOSED 2026-08-16 (Wave C Amendment X2)**
Renew-only heartbeat shipped: MosaicLayoutLockManager::renew (token+uid, hash_equals, never creates) +
LayoutLockController::renew + route + SSE owner-change emit; client heartbeat→renew, any 409→blocked flip
(no re-acquire, no contradiction). Kernel 6/6, vitest 25/25, two-window e2e 4/4 both surfaces. See
AI/REPORT-WAVEC.md § PHASE X.

## FINDING-073 — FE block-overlay wrapper broke CP-SIDEBAR-SCROLL/W18 — **FIXED 2026-08-16**
The ship-24 F-066 `.mosaic-builder-canvas` overlay wrapper inserted a non-flex div between
.mosaic-fe-dialog__inner and the canvas-scope → FE canvas grew unbounded (W18-S3: 1071px). Regression
shipped because f066 e2e was verified but W18 was not re-run. Fixed: the wrapper is now a bounded flex
child (flex:1;min-height:0;display:flex;column;overflow:hidden). W18 9/9, lock e2e 6/6 green.
LESSON: any change to the FE dialog canvas DOM/flex must re-run the W18 sidebar-scroll suite.

## FINDING-072 — UPDATE 2026-08-16 (pulled forward, attempted, REVERTED — remains OPEN)
Arun pulled F-072 into this run. Outcome: the clean layered fix does NOT work (the stagger margin is the
theme's UNLAYERED h*/p margin, unbeatable by a layered rule); the only working reset (@layer admin
!important, columns-scoped) equalises the geometry (20→0) but REGRESSES W18 fe-sidebar-scroll (the
CP-SIDEBAR-SCROLL revert-layer scar) → REVERTED. Confirms the STOP verdict: the durable fix is
canvas-reset scope-rule depth (Wave 3.2) with a real W18 blast radius; NOT shippable as a scoped reset.
Remains OPEN for dedicated Wave-3.2 work gated on the FULL W-suite.

---

## FINDING-074 — breakpoint_states alternative trees never render on the FE page — VERDICT (B) DESIGN GAP (OPEN)
**Observed:** 2026-08-17 overnight probe (per S4 charter). **Class:** responsive-render design gap.
**Surface:** `MosaicLayoutFormatter::viewElements:131` (FE) vs `RenderPreviewController` (builder).
**Mechanism (Kernel-confirmed, MosaicBreakpointRenderTest 2/2):** `MosaicRenderer::render()` DOES
substitute a breakpoint_state tree when given a non-empty `$breakpoint` (L120-134) — the builder preview
uses this on demand (node-edit works). But the FE formatter calls `render(..., '')` and renderLazy() also
passes ''; a server-rendered page has NO viewport, so there is nothing to plumb. Per-instance STYLE
overrides DO ship as `@media` CSS (works); the alternative DOM TREES cannot without a responsive-switch
design. **NOT a param-plumb bug (A) — a DESIGN GAP (B).**
**Resolution:** NO FIX. Design options in AI/REPORT-WAVEC2.md § P1 (multi-emit / client-switch / reframe;
UA-sniff rejected) + recommendation. **STATUS: OPEN — Arun rules on the responsive-switch approach.**

## FINDING-075 — entity-reference field end-to-end — mostly WORKS; save-time validation bug FIXED
**Observed:** 2026-08-17 overnight probe. Per-surface: widget (MosaicEntityRefField autocomplete) WORKS;
resolver (resolveEntityRef: load + view-access + cache tags) WORKS; render plumbing WORKS; **validation
BROKEN** (validateMediaSentinel covered only drupal_media → a bogus/inaccessible drupal_entity_ref saved
silently — F-055-class gap); tests PARTIAL.
**FIXED (Wave C2 / ship #25 draft):** `MosaicPropValidator::validateEntityRefSentinel()` mirrors the F-055
media check — loads the sentinel's entity_type by uuid, errors on missing / access-denied / unknown type;
empty deferred to F-023. RED→GREEN Unit: MosaicPropValidatorTest +5 cells. phpcs 0/0. Kernel 129, Unit
2679 green. **STATUS: validation bug CLOSED; widget/resolver/render confirmed working (no feature gap).**

## FINDING-074 — UPDATE 2026-08-17 — **FIXED-PENDING-SHIP** (Option 1 implemented)
Arun ratified Option 1 (emit all breakpoint trees + CSS media-query visibility, JS-free). Implemented
in `MosaicRenderer`: single-source `BREAKPOINT_MEDIA` const + `renderResponsive()` emits base + each
present breakpoint_state tree wrapped in `data-mosaic-bp`, with one `<style>` @media block showing
exactly one tree per viewport; `suffixTreeIds()` suffixes variant-tree ids/aria (`--bp-<id>`) so the
same instance across trees never collides; `renderLazyResponsive` for the BigPipe path; the FE formatter
now calls renderResponsive. No-variant layouts render byte-identically. Verified: Kernel
MosaicBreakpointRenderTest 6/36 (multi-emit, byte-identity, dup-id, preview unchanged), geometry oracle
4/4 (375→mobile, 768/1024→tablet, 1440→base), FULL Kernel 132, FULL Unit 2679, W18 9/9, f066 2/2, phpcs
clean. LIVE variant-node e2e blocked by the no-DB-write charter → deferred to Arun's eye-test. See
AI/REPORT-RESPONSIVE.md. **Ships as #26.**

## FINDING-077 — breakpoint_states SAVE fails: variant-tree empty containers are JSON arrays (walk-catch #26)
**Observed:** 2026-08-18, Arun eye-test of the responsive feature (node 841, builder Mobile breakpoint).
**Class:** save-path schema/serialization bug. **Severity: HIGH** — blocks saving ANY layout with a
device variant (mobile/tablet breakpoint_state), i.e. the whole B-028 device-variant feature.
**Mechanism:** the builder serializes breakpoint_state (mobile/tablet) tree nodes' EMPTY
`slots`/`data_sources`/`props` as JSON `[]` (arrays); top-level nodes correctly emit `{}` (objects) via
MosaicPuckAdapter, but the breakpoint-state merge path does not normalize. On save,
MosaicHooks::entityPresave (L186) runs MosaicSchemaValidator::validateFull, whose JSON-schema requires
objects → "Array value found, but an object is required" for every such key → EntityStorageException
(L188) → generic "content could not be saved" wall. Node 841 stays NULL (rejected).
**Evidence:** watchdog wid 2034 (throw at MosaicHooks.php:188); Q4 repro on the live validator; ship #26
touches only render/tests/docs (NOT the schema, presave, or builder) → NOT ship-#26 code.

**CORRECTION (Y1, 2026-08-18) — the builder was wrongly accused.** The probe *hypothesis* above
("the builder serializes variant-tree empty containers as `[]`") is DISPROVEN. A guard Vitest
(`js/src/builder/__tests__/BreakpointStateSerialization.test.ts`) runs the REAL builder path —
`MosaicPuckAdapter.toPuck()` → `mergeBreakpointState(base,'mobile',puck,4)` — and asserts the emitted
JSON contains NO `"slots":[]` / `"data_sources":[]` / `"props":[]`. It PASSES: the builder already emits
`{}`. **Actual root cause:** `MosaicLayoutMigrationManager::migrateToCurrentVersion()` did
`json_decode($json, TRUE)` (assoc), which turns every empty `{}` into a PHP `[]`, then re-encoded — so a
fresh builder layout (schema_version 1 from `fromPuck`) passes through the migration chain and comes out
the far side with `"slots":[]` etc., which then fails `validateFull`. Confirmed by php:eval: v1 input
`{"props":{},"slots":{},"data_sources":{}}` → post-migrate `{"props":[],"slots":[],"data_sources":[]}`.
The bug is in the MIGRATION re-encode, not the builder — so the fix is PHP-only (NO js/src production
change, NO dist rebuild).

**FIX (Y3):**
- ROOT — `MosaicLayoutMigrationManager`: the migration re-encode now runs a shared `normalizeContainers()`
  helper that casts each node's empty `props`/`slots`/`data_sources` (top-level AND every
  `breakpoint_states.*.nodes.*`) back to `(object) []` so they re-encode as `{}`. Slot CHILD lists
  (`slots.items`) stay arrays. New public `normalizeContainersJson(string): string` exposes the same
  healing on a raw JSON string.
- BACKSTOP — `MosaicHooks::entityPresave`: after migration, calls `normalizeContainersJson($value)` so
  ANY already-persisted-wrong content (e.g. a variant saved before this fix) self-heals on next save
  before `validateFull` runs. Idempotent, typed.
**Tests:** RED→GREEN in `MosaicBreakpointRenderTest` — `testMigrationHealsEmptyContainersToObjects`
(v1 `{}` → migrate → `"slots":{}` not `[]`), `testArrayShapeIsInvalidThenHealsToValid` (live-841 `[]`
shape → validateFull FALSE → heal → TRUE), `testHealedBreakpointStatesValidateAndRender` (heal → validate
→ `renderResponsive` emits both `data-mosaic-bp="mobile"` + `="base"`). Guard Vitest as above.
**Gates:** phpcs 0 errors (3 files); FULL Kernel 135/135; FULL Unit 2679/2679 (1 pre-existing warning);
Vitest guard 1/1 (full suite 438/439 — 1 pre-existing unrelated `MosaicPuckAdapter` boolean-field drift,
see B-101); sentinels node/826+841-844 all HTTP 200.
**STATUS: FIXED-PENDING-SHIP. Rides into ship #26. Arun eye-test round 2 → ship.**

## FINDING-078 — breakpoint_states single-component tree has a DANGLING ROOT → mobile renders empty (walk-catch #27)
**Observed:** 2026-08-19, Arun eye-test round 2 (node 841). Save no longer throws (F-077 fixed the wall),
but the mobile variant renders EMPTY — in the saved node AND in the builder's own pre-save preview.
**Class:** builder-side adapter serialization bug (root/nodes desync). **Severity: HIGH** — silent loss of
user work (the mobile content is stored but never displays); ESC3 disease class. Blocks the B-028
device-variant feature end-to-end.
**Mechanism (probe, read-only):** a breakpoint state whose canvas holds exactly ONE top-level component is
serialized with a `root` that is a `crypto.randomUUID()` NOT present in its own `nodes` map.
`MosaicPuckAdapter.mergeBreakpointState` (MosaicPuckAdapter.ts:1174) sets
`stateRootId = existingState?.root ?? crypto.randomUUID()`, then calls `fromPuck(puckData, stateRootId)`.
`fromPuck` (L1127-1137) returns `root: rootId` unconditionally but only CREATES a node under `rootId` when
`data.content.length > 1` (the region-wrapper branch); for a single component it registers the node under
the component's OWN id (L1080) → **root ∉ nodes = dangling.** The default (desktop) path avoids this
because `toLayoutJson` (index.tsx:213-214) special-cases single content: `rootId =
String(data.content[0]!.props['id'])`. `mergeBreakpointState` never replicates that rule (forked root
derivation — same class as F-077). At render, `extractBreakpointState` → `toPuck` L977-980
(`if (!rootNode) return emptyData`) → empty. Bites only when a breakpoint state has exactly one top-level
component (Arun's case: a single `MOBILE ONLY` heading); 2+ components create the wrapper and work.
**Evidence:** LIVE node 841 stored `breakpoint_states.mobile.root = "77861e89-…"` while its only node key
is `mosaic_heading-eb430fff-…` (Q1). Unit RED `js/src/builder/__tests__/BreakpointRootIntegrity.test.ts`
2/2 (root ∉ nodes; extract → empty content) reproduces it exactly. Held e2e
`js/e2e/f078-breakpoint-root-integrity.spec.ts`. Blind spot ledgered: `breakpoints.spec.ts:211-228`
asserts only `breakpoint_states.mobile` is defined, never root-resolution.
**Corrects Arun's paper verdict:** breakpoint_states is NOT absent/empty — it is present but structurally
dangling. "Render path innocent" + "builder-side" both hold; "lost/never persisted" does not.
**Relationship to F-077:** independent. F-077 (empty-container `{}` shape) + F-078 (dangling root) are two
separate defects in the same save path; F-077's fix only changed the failure MODE (throw → silent-empty).
**Fix direction (NOT implemented):** make `fromPuck` own the single-item root rule so BOTH callers are
consistent — when `data.content.length === 1`, `root = String(data.content[0].props['id'])` (mirror
index.tsx:213-214) instead of returning the synthetic `rootId`; then `mergeBreakpointState`'s
random-UUID `stateRootId` is only used for multi-component states (where the wrapper is actually created).
Alternatively normalise in `mergeBreakpointState`: if `stateLayout.nodes[stateLayout.root]` is undefined
and there is exactly one node, set the state root to that node's id. Prefer the shared-helper fix in
`fromPuck` (single source, kills the fork). Add a presave/validator guard that rejects any tree whose
`root ∉ nodes` so this class can never silently ship again.

**FIX (Z1-Z2, 2026-08-19) — UNIFY + GUARD + HEAL:**
- **Z1 UNIFY (root cause):** the single-item root rule now lives ONCE, inside `MosaicPuckAdapter.fromPuck`
  (MosaicPuckAdapter.ts:1135-1136): `content.length === 1 → resolvedRoot = content[0].props.id`; only
  multi-component layouts get the synthetic `mosaic_region` wrapper keyed by `rootId`. Both callers now
  consume it: `mergeBreakpointState` dropped its `|| stateRootId` fallback (it was what re-danglered
  single states); `index.tsx toLayoutJson` dropped its own single-item branch. Grep proves the rule
  exists exactly once.
- **Z2 GUARD (ESC3):** `MosaicSchemaValidator::validateFull` now rejects any tree — top-level AND every
  breakpoint_states tree — whose `root` is not a key in its `nodes`, with a typed message naming the tree
  (JSON Schema can't cross-reference, so this is a PHP check).
- **Z2 HEAL (self-repair):** `MosaicLayoutMigrationManager::normalizeContainers` (reached by the existing
  presave `normalizeContainersJson` backstop) repoints a dangling root when the tree has exactly ONE node,
  logging once via an injected `@logger.channel.mosaic`; multi-node dangling trees are left for the guard
  to reject — the heal never guesses among several nodes. So node 841 self-heals on its next save.
- **PHP-only + adapter:** `MosaicPuckAdapter.ts` + `index.tsx` (dist rebuilt: builder + frontend-editor,
  libraries 1.0.1→1.0.2) + `MosaicSchemaValidator.php` + `MosaicLayoutMigrationManager.php` (+logger) +
  `mosaic.services.yml`. No renderer change.
**Gates (all green):** phpcs 0 errors (all changed files); FULL Kernel 140/140 (incl.
MosaicBreakpointRenderTest 13/13); FULL Unit 2679/2679 (constructor change safe — named-arg tests
unaffected); Vitest BreakpointRootIntegrity 3/3 (RED flipped, incl. multi-component guard) + full suite
441/442 (1 pre-existing B-101 drift); W18 9/9 (one S2 canvas-click batch flake, 3/3 isolated); f066 2/2;
sentinels 826/841-844 → 200 (renderer degrades gracefully on still-dangling 841); dist rebuilt
(builder + frontend-editor), libraries 1.0.1→1.0.2, drush cr. See AI/REPORT-RESPONSIVE.md § WALK-CATCH #27
FIX.
**STATUS: FIXED-PENDING-SHIP. Rides into ship #26. Ship #26 unfrozen. Arun eye-test round 3 → ship.**

## SHIP #26 CLOSED — 2026-08-19, commit `fa3e32f`
FINDING-074 (Option 1 responsive render), FINDING-077 (walk-catch #26 container `{}` shape), and
FINDING-078 (walk-catch #27 dangling root) are **CLOSED / SHIPPED** in `fa3e32f` (branch
`fix/finding-016-validator` == origin). Device-specific layouts now work end-to-end. Walk tally 27, all
closed except #25/F-072 (Wave 3.2). B-101 + F-076 → Wave D. See AI/TODO.md § POST-SHIP SYNC.

## FINDING-079 — Template × breakpoint_states — NO DEFECT (probe, verified intact)
**Trigger:** Arun product ruling 2026-08-19 — a template IS the full responsive design; save + apply must
carry `breakpoint_states` for all devices. **Class:** design-conformance probe. **Verdict: NO DEFECT** —
all four legs carry variants intact because `layout_json` is an opaque serialized-JSON blob at every hop.
**Per-leg (quotes in AI/REPORT-RESPONSIVE.md § F-079):**
- **save = SURVIVE:** `SaveTemplateDialog` sends `layout_json: currentLayoutJson` (full, with variants;
  BuilderApp.tsx:973); `TemplateSaveController.php:76,88,102-105` validates via `validateFull` (now
  F-078-guarded) and stores it verbatim.
- **apply = SURVIVE:** `TemplateSplash`→`index.tsx handleSelect` writes the full JSON to the node textarea
  (`onLayoutJsonChange(layoutJson)`) and seeds the builder state (`BuilderApp.tsx:162,248` init from
  `initialLayoutJson`); Mobile switch shows the template's variant (renders post-F-078).
- **global storage = SURVIVE:** `mosaic.schema.yml:191-193` `layout_json: { type: text }` — opaque blob.
- **site-local storage = SURVIVE:** `MosaicTemplate.php:69` `layout_json` = `string_long` — opaque blob.
**F-069 (orthogonal):** the global template's 2 missing schema keys are `version` + `sync_to_config`
(config_export vs schema), NOT `breakpoint_states` — F-069 does not affect F-079.
**Fix direction:** none required; keep `layout_json` an opaque blob end-to-end (never decompose into
per-key config). Optional XS Wave-D GREEN guard (Kernel: template mobile variant → save → reload →
root∈nodes + renderResponsive emits it) to lock the invariant. **Positive interaction:** F-078's guard +
heal also protect the template path. **Size: 0 (no defect); optional guard ≈ XS.**
**STATUS: CLOSED (probe, NO DEFECT). Optional guard → Wave D.**

## FINDING-081 — FE dialog cannot deselect via empty-canvas click (walk-catch #29) — PARK
**Observed:** 2026-08-21, Arun. **Class:** FE-parity (editor). **Severity: LOW-MEDIUM** — usability; admin
works, FE dialog does not deselect the selected component when the empty canvas background is clicked.
**Witness (read-only):** Puck deselects via `onClick: () => setUi({ itemSelector: null })` on a Puck
background element. Both hosts wrap Puck identically in `.mosaic-canvas-scope` (admin BuilderApp.tsx:527 /
FE FrontendBuilderDialog.tsx:425) + `.mosaic-builder-canvas`, so `all:revert-layer` (F-035 family) is NOT
the differentiator (admin works). FE-only delta: native `<dialog class="mosaic-fe-dialog">` (top layer) +
`.mosaic-fe-dialog__canvas { overflow:hidden; height:100%; flex:1 }` (W18/CP-SIDEBAR-SCROLL clip). Block
overlay renders only when isBlocked → not the cause.
**F-035 scope:** adjacent not identical — canvas-scope applies to both hosts; F-081 is FE-dialog structure.
**Verdict:** confirmed FE-parity defect; the exact intercepting element is NOT determinable from code (needs
live DOM). **Fix direction:** live-DOM probe (Playwright, both surfaces) to name the element that swallows
the empty-background click, then restore the hit path OR add an explicit background-deselect onClick on the
FE canvas wrapper (usePuck dispatch). RED→GREEN e2e both surfaces. **Size: S.**
**STATUS: OPEN — PARK (mechanism needs the live probe; not fixed in-charter per the clean-mechanism rule).**

## FINDING-080 — Tabs invisible when dropped on canvas (walk-catch #28) — VERDICT: COMBO
**Observed:** 2026-08-21, Arun. **Class:** builder-canvas render (DSD). **Severity: MEDIUM** — a dropped
Tabs is invisible/unselectable on the canvas until panels are filled; author-hostile.
**Verdict = COMBO:** (a) **shadow-attach-missing-on-canvas** — `mosaic_tabs.twig` emits a DSD
`<template shadowrootmode="open">` (`:host{display:block}` + tablist), but the canvas renders component HTML
via `MosaicPuckAdapter dangerouslySetInnerHTML` (MosaicPuckAdapter.ts:659,854), and `innerHTML` does NOT
attach declarative shadow DOM → shadow/tablist never render → zero height. (b) **empty-render-no-minheight**
— a fresh Tabs has empty panels + no placeholder/min-height → nothing visible/clickable. `revert-layer-
collapse` (F-035) adds to the FE-dialog surface only; not primary. (Server/anon FE render attaches DSD
natively and works.)
**Scope:** DSD preview path shared by **mosaic_tabs, mosaic_carousel, mosaic_live_search** (all emit
`<template shadowrootmode>` + Lit renderer). Not Tabs-only.
**Live DOM delta table PENDING** (Playwright measurement; not fabricated).
**RIDE:** Tabs cure folds INTO Package 2's "new preview" cell (visible placeholder, non-zero boundingBox,
selectable when empty, both surfaces). Carousel + live_search → F-082.
**STATUS: OPEN — cured within ship #28 (Tabs); non-Tabs siblings → F-082.**

## FINDING-082 — CANDIDATE (report-only): carousel + live_search share the DSD-invisible-on-canvas disease
**Derived from F-080 scope sweep (2026-08-21).** `mosaic_carousel` + `mosaic_live_search` emit the same
`<template shadowrootmode>` DSD and are canvas-rendered via `dangerouslySetInnerHTML`, so an empty/fresh drop
likely collapses to zero height on the canvas exactly as Tabs did (F-080). NOT rebuilt by Package 2, so not
cured by ship #28. **Fix direction (shared):** a canvas-render path that attaches the shadow (web-component
upgrade / `setHTMLUnsafe`) OR renders light-DOM in the builder, + an empty-state min-height/placeholder for
DSD components. **Size: S-M (shared helper).** **STATUS: CANDIDATE — report-only; needs its own probe +
live DOM confirmation. Wave D/F.**

## F-080 / F-082 — CLOSED (Stage 0 / CP-CANVAS-DSD-CURE, ship #28, 2026-08-21)
Root cause (F-080 COMBO) fixed at the shared canvas render path: `MosaicPuckAdapter`'s two
`dangerouslySetInnerHTML` sites now go through `DsdPreview` → `injectPreviewHtml` (setHTMLUnsafe / manual
`<template shadowrootmode>` walk fallback, `js/src/builder/dsdShadow.ts`), which ATTACHES declarative shadow
roots so DSD components render + are selectable; plus a component-agnostic empty-state min-height +
placeholder floor (`.mosaic-canvas-preview`, mosaic-fields.css). **Live delta table RED→GREEN** on real
fixtures: mosaic-tabs(329)/mosaic-carousel(330)/mosaic-live-search(803) all flipped shadowRoot false→true,
content absent→present, selectable. Vitest `dsdShadow.test.ts` 7/7 (RED innerHTML→null + cure). **F-082
CLOSED class-wide** — the same one helper cures carousel + live_search (not just Tabs), so the whole
DSD-invisible-on-canvas class is closed. Gates: phpcs 0/0, Kernel 140/140, Unit 2679/2679, Vitest 451/452
(B-101 pre-existing), W18 9/9, f066 2/2, lock pass, sentinels 200; dist 1.0.4. **F-080 STATUS: CLOSED
(FIXED-PENDING-SHIP #28). F-082 STATUS: CLOSED (same ship).**

## FINDING-081 — UPDATE (Stage 0 probe): PARK confirmed, refined fix plan
Live probe: the admin canvas is taller than the viewport, so the empty-background point is below the fold
(`elementFromPoint` → null) — the reachable empty hit-area is content-height-dependent. **Decisive:**
`usePuck().setUi({itemSelector:null})` is only callable inside the Puck tree, so an explicit background-
deselect must be a Puck **override component**, NOT a wrapper onClick — exceeds a clean XS/S fix. **PARK**
per charter. **Fix plan:** Puck `overrides` component, `pointerdown` on the frame background (guarded to
`e.target===frame`) → `dispatch(setUi itemSelector:null)`; probe with a short-content fixture (empty area
above the fold) to name the element; RED→GREEN both surfaces. **STATUS: OPEN — PARK (plan recorded).**

## FINDING-083 — CP-CAROUSEL-REDESIGN (Arun ruling 2026-08-22) — WITNESSED (ship #32 Z4), NOT BUILT
Carousel AUTHORING is a rehaul, like Tabs. Registered per Arun's ruling. MUST reuse the Stage 2-3
repeatable/richtext machinery (the `MosaicFieldType` plugin + Puck array field + CKE5 richtext — TipTap
is now deleted) — ONE authoring language product-wide, no bespoke fork.
**WITNESS (ship #32 Z4, 2026-09-09, node 330):** the real stored prop shape is
`{"slide_1":"<p>..</p>","slide_2":"<p>..</p>","slide_3":"<p>..</p>","loop":true,"auto_advance":false,"interval":5000}`
— individual `slide_N` richtext-HTML props (NOT image/caption/link; "per its actual props" resolved by
witnessing), plus config `loop`/`auto_advance`/`interval`. The carousel `.mosaic.yml` has NO `field_types`
block (unlike Tabs `sets`), so slides currently degrade to labelled-text. This is the pre-Stage-3 Tabs
pattern (`panel_N` before `sets`). **BUILD REQUIREMENTS (ledgered):** (1) a PROPER migration chain step
(v5→v6: `slide_N` → a repeatable `slides` array) — witnessed as unavoidable, never a side path; (2) a
`field_types: slides: {repeatable, summary, item_label, default_item, fields:{body:richtext,bodyFormat}}`
sidecar mirroring Tabs `sets`; (3) adapter consumption; (4) the DISCRIMINATOR PIN (slide rows must NEVER
serialize as `{type,props}`) with a dedicated guard cell red-proven vs a synthetic violation; (5) sync
generalization — generalize `tabsPanelSync` but FIRST witness its selectors vs the carousel's REAL DOM
(the walk-47 lesson: fabricated-test-DOM green lied); (6) media via the bridge; (7) DSD + #30 placeholder;
(8) derivation × surfaces × breakpoints × templates × geometry, RED→GREEN Vitest+Kernel+journeys both surfaces.
**STATUS: WITNESSED — build OPEN (a full redesign; not attempted in this wave per the no-superficial-work law).**

## FINDING-094 — admin↔FE builder-canvas scroll parity (walk-catch #48) — FIXED-PENDING-SHIP (ship #32 Z1)
**Trigger:** Arun walk 2026-09-08. **Symptom:** the admin node-edit builder canvas lacked scroll while the
FE dialog canvas had it — a tall layout was clipped + unreachable on admin. **Witnessed both chains live**
(2965px layout): admin had NO canvas scroller — `_PuckCanvas-root` was `overflow:hidden` (h=833, content
clipped); FE (known-good) kept `_PuckCanvas-root` `overflow-y:auto` (scrolls). **ROOT:** `css/builder.css`
`.mosaic-puck-wrapper [class*="PuckCanvas"] { overflow:hidden !important }` matched `_PuckCanvas-root` on
admin (added to avoid a "second scroll surface"), killing the scroll the FE has. **FIX:** scope the hidden
to `:not([class*="PuckCanvas-root"])` and give `[class*="PuckCanvas-root"]` `overflow-y:auto; min-height:0;
overscroll-behavior:contain` — exactly the FE chain. **PROOF:** real-pointer wheel journey both hosts moves
scrollTop 0→900; W18 (@2b-geometry + fe-sidebar-scroll) green BEFORE and AFTER (scar check). **STATUS:
FIXED-PENDING-SHIP (ship #32).**

## FINDING-084 — CP-SEARCH-UX (Arun ruling 2026-08-22) — REGISTERED, slotted Wave E Act 1
mosaic_live_search authoring/UX rehaul. Registered per Arun's ruling. Same slot + same constraint as F-083:
after Tabs Stage 5, reuse the Stage 2-3 machinery (no bespoke fork).
**STATUS: REGISTERED — Wave E Act 1, post-Tabs-Stage-5.**

## FINDING-080 — UPDATE (walk-catch #30, 2026-08-22): empty-carousel placeholder — FIXED
The Stage-0 empty-state floor gated on `getBoundingClientRect().height < 8`, but a DSD carousel has
shadow-chrome height even with zero slides → the gate never fired → no placeholder (Arun's walk-catch #30).
**Fix (XS):** `DsdPreview` now flags empty via `!previewHasContent(el)` — a new content-gate
(`dsdShadow.ts`) that checks for light-DOM text OR a slotted/media element, NOT height. Empty carousel/tabs
→ placeholder; filled → none. Vitest `dsdShadow.test.ts` +4 cells (11/11). Ships with Stage 1 (dist 1.0.5).
**Walk-catch #30 CLOSED-pending-ship.**

## FINDING-085 — hook_mosaic_component_info_alter never saw SDC components (fixed in Stage 2)
**Discovered:** 2026-08-22, building CP-TABS-REDESIGN Stage 2. **Class:** hook wiring gap. **Severity: LOW**
(no shipped module implements the hook, so no live impact) — but the documented contract was false.
**Mechanism:** `MosaicComponentManager::findDefinitions()` calls `parent::findDefinitions()` (which runs the
`mosaic_component_info` alter over PHP-class components), THEN merges SDC-discovered components (mosaic_tabs,
carousel, live_search) and returns without re-altering. So `hook_mosaic_component_info_alter` could never
add/alter/remove SDC components — the bulk of the palette — despite mosaic.api.php claiming it covers "both
PHP attribute plugins and SDC sidecar plugins."
**Fix:** re-run `$this->alterDefinitions($merged)` over the full PHP+SDC set at the end of findDefinitions.
No shipped module implements the hook, so the (idempotent) second pass over PHP defs is harmless. RED→GREEN
Kernel (test module adds a field to Tabs, alters its label, removes mosaic_html — all now take effect).
**STATUS: FIXED — ships with Stage 2 (#30).**

## FINDING-086 — Media embedding requires a media_embed-enabled text format (environmental, documented)
**Discovered:** 2026-08-22, building CP-TABS-REDESIGN Stage 4 (richtext media toolbar). **Class:** environmental
config gap, NOT a code bug. **Severity: INFO/DOC.**
**Mechanism:** the Stage-4 richtext body offers a **Media** toolbar button that inserts a standard
`<drupal-media data-entity-type="media" data-entity-uuid="…">` embed. `<drupal-media>` only renders as
embedded media when the chosen text format has the core **`media_embed`** filter enabled. Witnessed on the
live site: NONE of the shipped/active formats (basic_html, full_html, restricted_html, plain_text) enables
`media_embed`, even though media + media_library + ckeditor5 are enabled. So an inserted embed renders as
**nothing** (filter_html strips the unknown tag — inert/safe, never a raw executable tag) until a site admin
adds `media_embed` to the format(s) authors use.
**Lawful story (blueprint: do NOT invent formats):** Mosaic ships the authoring affordance (button + valid
markup) and renders via `check_markup` with the author's chosen format — exactly as core CKEditor media
embedding does. Whether it renders is the SITE's format configuration; Mosaic does not invent a text format
or mutate the site's formats. Proven: Kernel `MosaicTabsRenderTest::testDrupalMediaIsInertWithoutMediaEmbed`
(inert/safe under basic_html) + Vitest `drupalMediaMarkup` (valid, attribute-escaped markup). Documented in
MOSAIC.md ("Media rendering depends on the site's format config").
**Deliberate scope boundary:** a full media_embed→rendered-media Kernel proof would require standing up the
media entity stack to test CORE's own `media_embed` filter — out of scope; Mosaic emits the standard markup.
**STATUS: DOCUMENTED (ships with Stage 4 / #31). Optional follow-up: an install hint / recipe that adds
media_embed to a chosen format when media is enabled — deferred, needs Arun's product call.**

## FINDING-087 — Admin builder manifest omits field_types → Stages 2/3/4 UI invisible on node-edit (walk-catch #31, Arun)
**Discovered:** 2026-08-23, Arun's ship-#31 authoring walk. **Class:** widget/controller manifest PARITY BREAK.
**Severity: HIGH** (the entire developer field-type machinery — repeatable array UX, TipTap richtext, media
button, authors-first format select — is invisible on the ADMIN/node-edit surface; only the FE dialog host
shows it). **Pre-existing since Stage 2** (field_types was never added to the admin path), surfaced by Stage 4.
**Mechanism (two manifest sources, only one enriched):**
  - ADMIN builder (node-edit) receives its manifest from `MosaicLayoutWidget::buildManifests()` via
    drupalSettings — NO HTTP request (js/src/builder/index.tsx:194 "server-supplied manifests"). That method
    (src/.../MosaicLayoutWidget.php:567-614) emits propDefinitions/prop_types/canvas fields but **NO
    `field_types` key** — despite its own comment (L596-597) claiming "Mirrors
    ManifestController::formatComponent() — both must stay in parity." They are NOT in parity.
  - FE dialog host fetches GET /api/mosaic/manifest → `ManifestController::formatComponent()` which DOES emit
    `'field_types' => buildFieldTypeDescriptors(...)` + the Stage-4 per-user text-format enrichment.
  - The adapter: `fieldTypeFields(manifest.field_types ?? {})` → on admin, field_types is undefined → `{}` →
    no field-type override → falls back to `propsToFields(propDefinitions)` → legacy plain fields (sets as a
    plain array of text heading/body/bodyFormat, bodyFormat showing the machine name). EXACTLY Arun's symptom.
**Proof:** Q2 — API manifest as uid1 carries full Stage-4 field_types (sets:repeatable{heading, body:richtext
+ per-user [{value,label}] formats}, min/summary/default_item). Q4 v2 (scoped to the Puck inspector, admin
node-edit) — NO TipTap/media/array-add/format-select; only the "Tab sets" label. Q1 — bundle is fresh
(builder.js?v=1.0.7, Stage-4 markers on disk + served). So NOT stale cache, NOT adapter bug: the admin
manifest is genuinely un-enriched at source.
**Correction note:** the first probe pass (Q4 v1) mis-counted contentEditable/media/select PAGE-WIDE, catching
the node form's own CKEditor 5 body field + `body[0][format]` select — a false Stage-4 positive. The scoped
re-run (v2) + reading buildManifests() corrected the verdict from "stale client cache" to this parity break.
**Fix direction:** add `field_types` (+ the same per-user text-format enrichment) to the admin manifest.
Minimal = inject `mosaic.field_type_manager` + `mosaic.text_format_access` into MosaicLayoutWidget and mirror
formatComponent's field_types line (size **S**). Durable = extract a shared `MosaicManifestBuilder` service
that both ManifestController and MosaicLayoutWidget call, so admin/FE/API can never diverge again — kills the
whole parity-break class (size **M**). Also: secondary FE staleness vector — /api/mosaic/manifest is fetched
at an UNVERSIONED URL with `Cache-Control: private, max-age=3600` and no revalidation (comment says "busted on
drush cr" but drush cr can't bust the BROWSER copy); version-bust the fetch or make it revalidate (size XS).
**Test gap that let it through:** Stage-2/3/4 tests validated ManifestController + the adapter fed hand-built
manifests WITH field_types; NOTHING tested `MosaicLayoutWidget::buildManifests()` output (the admin delivery)
nor a live admin-inspector DOM. **STATUS: OPEN — ship #31 FROZEN. No fix applied (probe only).**

### F-087 FIX — DURABLE (shared MosaicManifestBuilder) — FIXED-PENDING-SHIP (rides ship #31, 2026-08-23)
**Durable option ruled by Arun — kill the parity-break class.** New `src/Service/MosaicManifestBuilder.php`
holds the per-component manifest-entry shape ONCE (buildComponentEntry + buildFieldTypeDescriptors +
applyTextFormatAccess + normalizeStyleTokens, incl. field_types + per-user text-format enrichment).
ManifestController AND MosaicLayoutWidget::buildManifests() BOTH delegate to it; grep proves the shape logic
(buildComponentEntry/buildFieldTypeDescriptors/applyTextFormatAccess/normalizeStyleTokens/`'field_types' =>`)
exists in exactly ONE file now. The widget passes the real form user ($this->currentUser) for format access.
**Proof:** Kernel `MosaicManifestParityTest` — widget buildManifests() mosaic_tabs entry deep-equals
ManifestController's for the same 2-format user (RED pre-fix quoted: `- 'field_types' => [...]` absent in
widget; GREEN after). Live: admin drupalSettings now carries `sets:array` / `body:richtext` / per-user
human-labelled formats (identical to the API); the adapter builds the correct Stage-4 Puck config from it
(array + min + getItemSummary + richtext + renderMenu + format select); the admin inspector renders the
Stage-3 repeatable array (Puck `_ArrayField-addButton`). The per-tab richtext/media/format render on
add+expand — an interactive step (headless add trips the unsaved-changes guard + Puck click actionability),
so it is Arun's re-walk + the held smoke oracle, with the Kernel parity test as the deterministic guard.
**Secondary (F-087 XS):** the FE `/api/mosaic/manifest` fetch was unversioned + `private, max-age=3600` +
no revalidation → a schema change lagged up to an hour behind the versioned bundle. FIXED: response is now
`private, max-age=0, must-revalidate`, and the FE fetch appends `?v=<bundle version>` (read from the loaded
script's `?v=`) + `cache: 'no-store'`. The misleading "busted on drush cr" docblock is corrected.
**Blast radius healed:** ManifestController 5→4 ctor args (dropped field_type_manager + text_format_access,
now inside the builder; +manifest_builder) → 9 ManifestControllerTest calls + helper; MosaicLayoutWidget +1
ctor arg → its unit test; 22 structural smoke tests retargeted from the old ManifestController/widget source
locations to MosaicManifestBuilder.php (the single source) — intentional-refactor tracking, same class as a
schema-bump fixture update; the maxAge=3600 test → max-age=0 + must-revalidate.
**DISEASE PATTERN NOTE (4th strike):** manifest/shape logic duplicated across two delivery paths has now
diverged FOUR times (the widget/controller "must stay in parity" comment was itself a tombstone). The cure is
structural, not vigilance: ONE shared builder both callers consume. Any future manifest field is added once.
**STATUS: FIXED-PENDING-SHIP (ship #31). Deterministic guard = MosaicManifestParityTest.**

## REVIEWER ERROR #15 — presented built+unit+server-verified as live-working; live proof was pending Arun's walk
**When:** ship #31 handoff (Stages 3+4). **What:** I reported the Tabs authoring UI as delivered/working on the
strength of green gates (Vitest, Kernel, phpcs, sentinels) + a HELD (un-run) e2e — WITHOUT a live-DOM check of
the actual admin builder inspector. The gates exercised the ENRICHED path only: ManifestController (API/FE) +
the adapter fed manifests that already contained field_types. They never exercised the ADMIN delivery
(`MosaicLayoutWidget::buildManifests`), which omits field_types — so the feature was invisible exactly where
Arun tested (node-edit), and the tests were structurally blind to it.
**Why it matters:** "unit + server verified" ≠ "live working." A single scoped live-DOM probe (which I ran only
now, as WC31 Q4) would have caught it pre-handoff — and also flagged the FE manifest-cache vector.
**Corrective practice:** for any feature with TWO delivery paths (admin drupalSettings vs FE fetch), a live-DOM
assertion on BOTH surfaces is mandatory before claiming live-working; and manifest-shape parity between
buildManifests() and formatComponent() must have a dedicated test. Do not conflate green gates with a walk.

## FINDING-089 — Tabs persistence BLOCKER: array-field props wiped on serialize (walk-catch #32) — FIXED
**Discovered:** Arun walk 2026-09-02. **Severity: CRITICAL** (Tabs cannot be saved AT ALL). **Class:** serialization.
**Symptoms (all ONE break):** canvas shows content · save no-error but empty · preview-before-save empty ·
unsaved-popup AFTER save. **Root:** MosaicPuckAdapter.fromPuck's `processSlots` treated ANY array-valued prop
as a Puck SLOT (child-component zone): for the Tabs `sets` array field it called `register()` on each plain set
item `{heading,body,bodyFormat}` (which has no `.props` → `TypeError` on destructuring `.props.id`) and, in the
non-throwing path, `delete node.props[key]` — wiping the sets. The throw inside `handleChange` (BuilderApp:322,
`toLayoutJson` is OUTSIDE the try) aborts AFTER `setCurrentData`+`guard.updateCurrent` but BEFORE
`saveLayoutJson(336)` → the hidden field is never written → save/preview empty, guard never stabilizes.
**Fix (root, shared path — no fork):** in `processSlots`, only treat a NON-EMPTY array of Puck ITEMS
(`isPuckItem`: has string `.type` + object `.props`) as a slot; an array-FIELD value (or empty array) stays in
node.props untouched. Guard + preview + save all ride the same restored path. RED→GREEN Vitest TabsPersistence
3/3 (add-tab→serialize→sets present; fromPuck/toPuck round-trip; emptied-array no bogus slot).
**Media survival rider:** Puck's richtext (TipTap) DROPS unknown elements → an inserted `<drupal-media>` was
discarded on insert/getHTML. Fix: new `js/src/builder/fields/DrupalMediaNode.ts` (atom TipTap node, parseHTML/
renderHTML round-trips the tag + data-* attrs), registered via the richtext field's `tiptap.extensions`.
`@tiptap/core` declared in package.json (^3.11.1, matches Puck). Vitest DrupalMediaSurvival 5/5 (default DROPS;
node PRESERVES + attrs; survives further edit; field registers it; serialize round-trip). **STATUS: FIXED (ship #31).**

## FINDING-090 — FE media dialog opens behind the FE dialog + unstyled (walk-catch #33) — FIXED (stacking) + CSS
**Severity: HIGH** (media picker unusable on the frontend). **Root:** the FE builder is a native `<dialog>`
opened with `showModal()` → browser TOP LAYER; the media-library modal appended to `document.body`
(media-library-bridge.js) paints BEHIND the top layer regardless of z-index. Styling: `media_library/ui` carries
no CSS (the styling lives in the admin theme Claro, which the frontend theme lacks) → "skeleton".
**Fix:** bridge now detects an open `dialog.mosaic-fe-dialog[open]` and renders the modal INTO it (jQuery
`appendTo` + mount = the FE dialog) so it joins the same top-layer stacking context (admin → body, unchanged);
+ a lawful Mosaic-owned FE-scoped media-dialog chrome in css/mosaic-fields.css (never pulls admin-theme CSS;
anon never loads the bridge). Geometry (above overlay, styled, selectable, insert-at-cursor) = Arun's re-walk +
held e2e. **STATUS: FIXED (stacking, code-witnessed) + CSS baseline (walk-verified) (ship #31).**

## FINDING-091 — richtext editor content overlaps the toolbar (walk-catch #34) — FIXED (CSS)
**Severity: MEDIUM** (authoring UX). **Root:** Puck's richtext stacks a renderMenu toolbar above a fixed-height
ProseMirror surface with no containment → content scrolls up under the toolbar. **Fix:** css/mosaic-fields.css
makes the richtext field a flex column with a sticky toolbar + a scroll region for the editor (scoped to the
Mosaic hosts; STRUCTURE only). Geometry oracle (toolbar∩content empty at 1/10/50 lines) = held e2e + walk.
**STATUS: FIXED (CSS, walk-verified geometry) (ship #31).**

## FINDING-092 — admin media insert dead: library opens on an empty tab (walk-catch #35) — FIXED + LIVE-PROVEN
**Severity: HIGH** (media unusable in Tabs rich body). **Root (witnessed via live e2e, not guessed):**
`MediaLibraryOpenController::open()` set the opened media type to `reset($allowedTypeIds)` = the first media
type by config order = **audio**, which has no media. The only media (an image) is on the `image` tab, so the
library opened on a BLANK grid; the author reads "media insert is dead", and an empty Insert then triggers
core's `array_filter(null)` 500 in MediaLibrarySelectForm::viewsFormValidate → "page scrolls to end, nothing
inserts." **The insert path was never broken** — proven live: Puck honours `tiptap.extensions` (DrupalMediaNode
IS registered in the live editor), the editor ref survives a 5s delay (not stale), and `insertMedia` lands
`<drupal-media>` in the editor DOM + serialized JSON. All four of Arun's hypotheses (hidden textarea / lost
editor ref / stale selection / button type) verified working. **Fix:** default the opened tab to the first
media type that actually has ≥1 accessible media (data-driven loop); fall back to the first type if all empty.
Proven end-to-end by the Tabs full journey (open → add → real media select+Insert → editor + field JSON → save
→ reload persists → page render). **STATUS: FIXED (ship #31).**

## FINDING-093 — FE media library unusable (unstyled skeleton) (walk-catch #36) — FIXED
**Severity: MEDIUM.** `media_library/ui` carries NO css — the media library is styled by the ADMIN theme
(Claro's `claro/media_library.ui` + `claro/media_library.theme`); the frontend theme (Olivero/custom) has none,
so the FE dialog is a skeleton. **Fix (option a, reasoned — real admin parity, no drift vs reimplementing the
chrome):** attach Claro's two media-library libraries to `mosaic_media/media_library_bridge` (attached only on
editor surfaces — admin widget + FE editor Pass 2 — anonymous pages never load it) + a small FE containment css
(`modules/mosaic_media/css/mosaic-media-fe.css`) for the top-layer dialog. Admin already loads these via Claro's
libraries-extend → deduped, no regression; bridge library resolves with the deps (verified). Requirement bar
(grid thumbnails, source tabs, selection state, Insert button, exposed filters) met by the real Claro CSS.
**STATUS: FIXED (ship #31). Live FE geometry oracle = Arun re-walk + held FE journey.**
