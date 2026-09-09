# WAVE A — DOC-TRUTH PASS (CP-DOC-GRAND) — EVIDENCE LOG

Paper-only (MOSAIC.md + AI/ ledgers). Read-only git, no staging, no code.
Ratified R1-R10 (Arun 2026-08-08, 'ratify all as recommended'). Fresh-read rule: each de-claim below
quotes the CURRENT MOSAIC.md text + the witnessed code reality BEFORE the rewrite.

## DE-CLAIM SUMMARY TABLE (CBF# → old claim → new truth) — for Arun's eye-test

| CBF | Old claim (MOSAIC.md) | Witnessed reality | Rewrite |
|---|---|---|---|
| 1 | Schema.org JSON-LD auto ("only Mosaic: Yes") + OG via hook_metatags_alter | 0 json-ld/metatags_alter in code | DE-CLAIM → "PLANNED (roadmap RC-A1)"; table cell Yes→*Planned* |
| 2 | Collab via Mercure SSE, no Node.js, no WebSocket, POST /api/mosaic/yjs-sync polling | Yjs + HocuspocusProvider WebSocket + Node sidecar; route absent | CORRECT → "Yjs + Hocuspocus (WebSocket)" + SSE presence fallback |
| 3 | WCAG 2.5.7 keyboard-DnD via dnd-kit KeyboardSensor | dnd-kit not installed; Puck's own DnD | CORRECT → Puck DnD; keyboard-DnD UNVERIFIED (roadmap RC-A3) |
| 4 | mosaic.breakpoints.yml + mosaic.breakpoint_group entity shipped | both absent; fixed 4-bp set in BuilderApp.tsx; render ctx hardcoded 'default' | DE-CLAIM → fixed set; admin-configurable PLANNED |
| 5 | Builder ENFORCES requires_alt_text (cannot save w/o alt) | no requires_alt_text validator; axe badge is advisory | CORRECT → axe advisory; save-blocking PLANNED (RC-A2) |
| 6 | Routes /api/mosaic/layout + /api/mosaic/preview | phantom (26-route read) | CORRECT → /mosaic/frontend-save, /mosaic/render-preview, /api/mosaic/canvas/ssr |
| 7 | mosaic_starter_components, 25+ components | mosaic_components, 12 | CORRECT → mosaic_components (12, named) |
| 8 | Shipped mosaic-hero/-card-grid/-rich-text; "7 Level 0: …RichText…" | root components/ absent; 12 real, no RichText (=mosaic_text) | CORRECT → real 12-component list; tree fixed |
| 9 | MosaicGlobalComponent + ComponentPackage entity classes | absent; MosaicGlobalTemplate ships; orphan global_component schema | DE-CLAIM → global TEMPLATES ship; reusable-component entity PLANNED |
| 10 | JSON-schema via opis/json-schema | justinrainbow/json-schema | CORRECT → justinrainbow/json-schema |
| 11 | FE Break gated on drupalSettings.mosaic.frontend.hasBreakLock (parity) | flag never set by PHP → dead | CORRECT → parity-doctrine KNOWN GAP note (F-066, Wave C) |
| 12 | 4 submodule routes gate on `administer mosaic` | phantom perm (undeclared) → uid1-only | (route/perm fix = Wave B, R3; noted in Reality Addendum) |
| — | Undo/redo = Zustand + Immer 50-step / command-delta store | Puck built-in history; no builderStore/zustand | CORRECT → Puck history (both contradicting claims) |
| — | scaffold/ dir; 5 perms / 7 routes / 8 services; mosaic.module | no scaffold; 6 perms / 26 routes / ~23 services; no .module (F-062) | CORRECT → historical note + real counts; F-062 CLOSED |

## W-A.g VERIFY
- `git diff --stat` = **MOSAIC.md ONLY** (151 insertions, 173 deletions). No code touched. AI/ ledger
  writes are gitignored (untracked). `drush cr` clean. Read-only git, nothing staged.
- Sweep: residual Mercure/dnd-kit/breakpoints.yml/phantom-route hits are all correction/explanatory
  text ("none of which exist", "not a dependency", "there is no…") — verified benign.

## W-B / W-C CLOSEOUT
- Bible forged: **AI/MOSAIC-BIBLE.md (129 lines)** — P0 header + repo-overrules clause + R1-R10
  ratification · P1 governance absolutes · P2 product soul (P1/P2/P3 personas, strategy, feature map) ·
  P3 state-of-product · P4 ratified roadmap A-G · P5 pointers.
- MOSAIC.md diff:  1 file changed, 151 insertions(+), 173 deletions(-) (paper only; no code).
- Deliverables this wave: MOSAIC.md (truth) · AI/MOSAIC-BIBLE.md (new) · FINDINGS refresh · TODO
  Wave-A record + 3 roadmap candidates · this evidence log.
- Ship #21 (CP-DOC-GRAND) is Arun's hands after eye-test; bible upload to project folder is Arun's.

## AMENDMENT A2 (reviewer eye-test catches) — 2026-08-08, MOSAIC.md only
- A2a: chooser table React 19 row state/undo cell `Zustand + Immer` → `Puck built-in history`.
- A2b: replaced the stale `"responsive": {xs/sm/lg}` JSON example with a real `breakpoint_states`
  example (mobile/tablet, independent root+nodes) matching schema/mosaic_layout_value.schema.json:28
  (key = breakpoint ID 'mobile'/'tablet'; desktop/wide inherit top-level); fixed trailing prose.
- A2c: verified the historical-note config list — all four schemas (component_package.*,
  design_token_set.*, template.*, global_component.*) ARE declared in config/schema/mosaic.schema.yml;
  but "entity types" overstated → trimmed to truth: entity classes exist only for MosaicDesignTokenSet
  (config) + MosaicGlobalTemplate (config); MosaicTemplate is CONTENT; component_package + global_component
  are schema-only.
- A2d sweep: `"responsive"`/`responsive overrides`/`Zustand + Immer`/`xs is the default` = 0 residue;
  remaining Mercure (1) + dnd-kit (6) hits are correction-text / Svelte-hypothetical / advice (benign).
  git diff --stat = MOSAIC.md only, **169 insertions(+), 179 deletions(-)**. No code, nothing staged.
