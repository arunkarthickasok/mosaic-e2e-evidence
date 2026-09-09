# Mosaic — Deep E2E User-Journey Coverage Plan (Wave D charter, DRAFT for ratification)

**Authored:** 2026-09-03. **Owner:** Arun. **Status:** PLAN ONLY — no execution until reviewer + Arun ratify.
Born of the UAT-GATE LAW (AI/TODO.md): every feature CP ships a full-journey Playwright suite (real
interactions, screenshot per step under `AI/e2e-evidence/<feature>/`, reviewer-audited) GREEN before Arun
walks. This document is the full-product journey matrix that operationalises that law across Wave D.

## Legend
Status per journey: **G** exists green · **R** exists red/partial · **M** missing. Size: XS/S/M/L.
Every journey drives REAL interactions (dispatch/testid/accessible-name; no skipped 'fragile' steps) and,
where it changes data, RELOADS and asserts persistence server-side ([data-mosaic-field-id] textarea / node
field) AND in the panel, then asserts anon page render. Both surfaces (admin builder + FE dialog) where the
feature exists on both (one MosaicManifestBuilder / one adapter — F-087).

## 1. Component authoring (per component, the save→reload→render spine)
| Journey | Status | Size | Notes |
|---|---|---|---|
| Tabs: add/reorder/remove-to-min-1 + rich body + REAL media + save+reload+render, admin | **G** | — | tabs-full-journey.spec.ts (this ship; 8 screenshots) |
| Tabs: same on FE dialog incl. styled media library geometry | **M** | M | F-090/F-093 fixed; FE journey to write |
| Heading / Text / Button / Card / Columns / Divider / Spacer / Image / HTML: add→fill→save→reload→anon render exact value | **R** | M | J1/J2 cover heading+lifecycle; extend to each shipped component, each field type |
| Carousel (F-083) / Live search (F-084): authoring journeys | **M** | M | after their CPs; reuse Stage-2/3 machinery |
| Every FIELD TYPE persists (text, textarea, number, select, radio, richtext, array/repeatable, media/ERP, link, entity-ref, datasource, spacing, style-overrides, breakpoint overrides) — add→set→save→reload→value intact | **R** | L | F-089 class (array/richtext) fixed+guarded; audit each type with a live round-trip (the F-089 lesson: unit round-trip ≠ live) |

## 2. Media (the F-092/093 surface)
| Journey | Status | Size | Notes |
|---|---|---|---|
| Rich-body media insert (admin): library non-empty tab → select → Insert → editor+JSON→save→reload→render | **G** | — | this ship |
| Rich-body media insert (FE dialog): stacked above + styled + insert-at-cursor | **M** | M | F-090/093 fixed; drive it |
| drupal_media PROP field (MosaicMediaField) insert on any component | **R** | S | pre-existing; add a live journey |
| media_embed-format story: image renders vs inert without the filter | **R** | S | Kernel proven; add a render journey |

## 3. Locks / collaboration
| Journey | Status | Size | Notes |
|---|---|---|---|
| 2-window lock acquire/owner-change/heartbeat/break (f066/f067/lock specs) | **G** | — | lock.spec + f066 green |
| FE lock parity + blocked-state banner | **G** | — | f066-fe-lock-parity |
| Collab CRDT co-edit (mosaic_collab) round-trip | **M** | L | unwalked submodule |

## 4. Templates
| Journey | Status | Size | Notes |
|---|---|---|---|
| Save template → apply to a new node → layout hydrates → save → render | **R** | M | fe-templates spec partial; full round-trip incl. breakpoint_states (F-079) |
| Global vs site-local template scope + permission gating | **M** | M | manage_site_templates persona |

## 5. Breakpoints / responsive
| Journey | Status | Size | Notes |
|---|---|---|---|
| Author a mobile override → save → reload → override persists → anon render shows one tree per viewport (F-074) | **R** | M | W18/f074 specs partial; full save+reload+render journey |
| Array/richtext edits INSIDE a breakpoint tree persist (F-078 interplay) | **M** | S | the F-089 root lived in the shared serialize path — add a bp-tree cell |

## 6. Permissions personas (each drives the same journey, asserts allowed/denied)
| Persona | Status | Size | Notes |
|---|---|---|---|
| admin (mosaic.administer) · editor (use_builder) · templates (use/create_templates) · break_lock · anonymous (render-only, never loads editor libs) | **R** | M | access.spec partial; a persona matrix over the core author→save→render journey |
| restricted components / restricted style tokens hidden per persona (B-023/P7-038) | **R** | S | manifest filtering; live assert |

## 7. Cross-cutting invariants (assert inside every journey)
- Persistence: reload → [data-mosaic-field-id] value AND panel re-hydration match what was authored.
- Render parity: anon page render contains the authored value in the right tag; no `|raw`; XSS stripped.
- No builder-scoped `.messages--error` after save (scope to builder region — J-PV-002 lesson).
- Unsaved guard: dirty only when truly dirty; clears on save; `page.on('dialog')` in every save step.
- Manifest parity: admin (drupalSettings) == FE (API) shape (F-087 MosaicManifestParityTest is the unit guard).

## Slotting (proposed)
- **Wave D-1:** field-type persistence matrix (§1 last row) + Tabs FE journey (§1/§2) — closes the F-089/F-092
  class product-wide. Size L.
- **Wave D-2:** per-component authoring journeys (§1) + media prop journey (§2). Size L.
- **Wave D-3:** templates (§4) + breakpoints (§5) + permissions personas (§6). Size L.
- **Wave D-4:** collab (§3) + cross-cutting sweep (§7) + evidence audit. Size M.
Each journey → `AI/e2e-evidence/<feature>/` screenshots, reviewer-audited, then Arun walk.

*End of draft. Execute only after reviewer + Arun ratification.*
