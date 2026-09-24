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
- **CKE5 sheet rider (amend 2026-09-23):** formatted-text props (adopted libraries ship
  many via `contentMediaType: text/html`) get a CKE5 editor whose stylesheet is governed
  by **Arun's sheet ruling** (which text-format / editor CSS applies inside the adopted
  slot) — build after that ruling.
- **Breakpoint-rule code (amend 2026-09-23):** the per-prop breakpoint capability needs
  the breakpoint-rule code landed **after Arun's sheet ruling** (paired, same slice).

### §1.1 — Labelled (post-1.0 / parking)
RC-A1, F-037, D-6, registry/CEM, headless, versioned upgrades, render migration,
conditions plugins, Lighthouse.

## §2 — Backend config audit
Read-only in parallel now → gap register → ratification → fixes; **M3 sized in the
register**.

## §3 — Wave D
Test desert, D-0 retrofits, F-096 upgrade rehearsal, M1 moderation Kernel cells.
- **B-102 phpstan-drupal drift baseline (amend 2026-09-23):** capture the module-wide
  phpstan-drupal drift as a baseline (`phpstan-baseline.neon` or equivalent) so new code
  gates at 0-new while the pre-existing drift is quarantined, not blocking.

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

**The bar (Arun):** best-in-class, modern AND easy — **better than the paid builders
it will be compared to**. "A Rolls-Royce, not an Ambassador."

**Design system source of truth:** the v1 export at `design/mosaic_ui_ux/` (`ba37506`)
is a **DRAFT** — NOT yet the source of truth. A refined **v2 is owed before ACT 2
starts** and becomes the source of truth. v2 KEEPS what v1 got right (own tokens,
`.mosaic` scoping, absent-not-disabled sections, no settings page, shimmer-not-overlay,
contrast audit) and RAISES: distinctive composites (rail, canvas chrome, bind panel,
palette); interaction choreography (drag / drop / violation / shimmer); tablet + mobile
for screens 7–9; and a **dark mode that is designed, not inverted**.

**Ruling candidate (Arun rules at ACT 2):** design decision 6 — accept-and-mark
rule-breaking drops (Save stops) vs the current native refusal.

**ACT 2 additions (amend 2026-09-23):**
- **WC#82** folded into the ACT 2 consistency list.
- **Message-wording audit** — every author-facing string (validation, notices, banners,
  errors) reviewed for author-grade voice (extends WC#71).
- **Report / libraries-page / fallback-block treatment** — the three surfaces get the
  ACT 2 design pass (currently functional-not-designed).
- **Zone-label consistency** — slot/zone labels consistent across canvas, panel, picker.
- **Design decision 6 ruling** — Arun rules accept-and-mark vs native refusal (moved from
  candidate to a required ACT-2 ruling).
- **design v2 due: `<Arun>`** — the refined design-system v2 (source of truth) is owed
  from Arun before ACT 2 starts.

## §7 — Release
Dev push → Arun soak → truth pass (bible, MOSAIC.md, docs, headline verified by
the oracle walk, M1 ADR) → **TAG 1.0.0**.
- **Security-coverage opt-in (amend 2026-09-23):** opt the project into the Drupal
  security advisory coverage policy at tag (stable-release requirement).
- **Release notes (amend 2026-09-23):** authored 1.0.0 release notes (headline features,
  upgrade/compat, known limitations).
- **Project page (amend 2026-09-23):** the drupal.org project page brought to release
  quality (description, screenshots, docs links) at tag.

---

## Ratified amendments (recorded)
- **CP-ADOPT-7 P1 amendment (delegated ruling 2026-09-23, overrule open):** §1 gains the
  CKE5 sheet rider + breakpoint-rule code (both after Arun's sheet ruling); §3 Wave D
  gains the B-102 phpstan-drupal drift baseline; §6 ACT 2 gains WC#82, the message-wording
  audit, report/libraries-page/fallback-block treatment, zone-label consistency, the
  design-decision-6 ruling, and "design v2 due: `<Arun>`"; §7 gains security-coverage
  opt-in + release notes + project page. Bible P4 timeline line aligned to late Jan 2027.
- **D1 amendment (P1d-A):** Mosaic's builder design system is admin-theme-agnostic
  (Claro / Gin / custom) — it never depends on the admin theme's classes.
- **ACT 2 (P1d-A):** ACT 2 = the full 1.0 design (NOT minimal). Timeline of record
  late January 2027.

## Walk-catch tally
- **WC#73 (P1d-A):** viewport switch with an adopted component wiped the canvas —
  FIXED (BuilderApp switchEditingTo else-branch guard). Tally 73.
