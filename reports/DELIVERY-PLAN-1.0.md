# Mosaic 1.0 — Delivery Plan (frozen list)

> **Status:** FILLED from the reviewer's ruling via CP-ADOPT-5 P1d-A-CONT (LEDGER
> FIRST). **Frozen after Arun's line-by-line ratification; changes only by an
> Arun-ruled amendment.**
> **Timeline of record: late January 2027; soak week fixed.**

## §0 — ADOPT (external-library adoption arc)
- **ADOPT-5** — P1d-A-CONT, P1d-B; **ship #45**; cruft cleanup.
- **ADOPT-6** — G updates, H degradation, SO-7 flag, R5/R10 attach-once; **ship #46**.
- **ADOPT-7** — external-library oracle walk + fixes; **ship #47**; tag-gating.

## §1 — Author-trust
D-1, D-2, D-3-hide, F-095, D-8, D-14, WC#71 author-grade messages,
defaults-insertion ruling, held-file rule retirement (Arun ruling).

### §1.1 — Labelled (post-1.0 / parking)
RC-A1, F-037, D-6, registry/CEM, headless, versioned upgrades, render migration,
conditions plugins, Lighthouse.

## §2 — Backend config audit
Read-only in parallel now → gap register → ratification → fixes; **M3 sized in the
register**.

## §3 — Wave D
Test desert, D-0 retrofits, F-096 upgrade rehearsal, M1 moderation Kernel cells.

## §4 — Wave F
D-4 translation, F-072, F-059, F-069, F-076, B-101, F-086, F-081, F-079,
RC-A3 keyboard-drag spike (Puck has no keyboard sensor: add or label),
RC-A2 alt-text save-block.

## §5 — Wave G
All 15 submodules working (enable → walk → tests → fix), commerce dependency
ruling, CP-DATA-FABRIC (component index + hook_views_data), mosaic_search walked
as the Search API bridge, M1 live walk, walk round 4.

## §6 — ACT 2 (full 1.0 design)
Reference mocks implemented across builder, FE dialog, libraries page, governance
form; empty / failing states; keyboard paths; WCAG AA; **D1 admin-theme-agnostic**;
WC#65 / #72 + the consistency list closed.

## §7 — Release
Dev push → Arun soak → truth pass (bible, MOSAIC.md, docs, headline verified by
the oracle walk, M1 ADR) → **TAG 1.0.0**.

---

## Ratified amendments (recorded)
- **D1 amendment (P1d-A):** Mosaic's builder design system is admin-theme-agnostic
  (Claro / Gin / custom) — it never depends on the admin theme's classes.
- **ACT 2 (P1d-A):** ACT 2 = the full 1.0 design (NOT minimal). Timeline of record
  late January 2027.

## Walk-catch tally
- **WC#73 (P1d-A):** viewport switch with an adopted component wiped the canvas —
  FIXED (BuilderApp switchEditingTo else-branch guard). Tally 73.
