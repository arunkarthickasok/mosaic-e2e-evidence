# Mosaic 1.0 design system export

**Status: DRAFT v1 (2026-09-20) — NOT yet the ACT 2 source of truth.**
Commit `ba37506`. A refined **v2 is owed before ACT 2 (frozen plan §6) starts**;
v2 becomes the source of truth, not this draft.

## Arun's bar for ACT 2 §6
Best-in-class, modern AND easy — **better than the paid builders it will be compared
to**. "A Rolls-Royce, not an Ambassador."

## v2 must KEEP what v1 got right
- Own tokens (`--mosaic-*`), never the admin theme's.
- `.mosaic` scoping (admin-theme-agnostic).
- Absent-not-disabled sections (a section with nothing to show is gone, not greyed).
- No settings page.
- Shimmer-not-overlay while previews load.
- The contrast audit.

## v2 must RAISE
- **Distinctive composites:** the rail, the canvas chrome, the bind panel, the palette.
- **Interaction choreography:** drag / drop / violation / shimmer.
- **Tablet + mobile** for screens 7–9.
- **Dark mode that is DESIGNED, not inverted.**

## ACT 2 ruling candidate (Arun rules at ACT 2)
Design decision 6 — accept-and-mark rule-breaking drops (Save stops) vs the current
native refusal.

---

## v2 — received 2026-09-29 · status: UNDER REVIEW (not yet source of truth)
`design/mosaic_ui_ux/v2/` — Arun's second design pass for Mosaic 1.0. **136 files, 4.7 MB, no
node_modules / build dirs, secret-guard clean, no library named** (grep verified). Committed under Arun's
personal identity.

**Status: UNDER REVIEW.** A reviewer coverage audit (see `reports/DESIGN-COVERAGE.md`) runs before v2
becomes the source of truth. Until that audit passes, ACT 2 continues to reference v1 where v2 has gaps.

**What v2 delivers (by file name):**
- **Design language:** `Mosaic Design System/tokens/` + `guidelines/` cards — colors (semantic / surfaces
  / accent / neutral / cues, each with a dark variant), type (roles / signature / scale), elevation (+dark),
  spacing (chrome / scale), radius, motion (easing / durations), brand (marks / wordmark).
- **Component cards:** `components/{core,navigation,feedback,surfaces,builder}/*.card.html`.
- **Builder UI kit:** `ui_kits/builder/index.html` + `motion.html`.
- **Authoring UI kit:** `Mosaic Authoring UI Kit.html`.
