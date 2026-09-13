# CP-VIEWS-EMBED-1 — walk-prep album (cp-ve1)

Fixtures: node 970 embeds cpve1_list/embed_1 (paged mini-pager AJAX view over 20 "CPVE1 Article"
nodes, one nid contextual filter with default_action=ignore); node 971 embeds the DISABLED
cpve1_off (degradation). Real-pointer film.

- `01-admin-placeholder-card.png` — admin builder canvas: the mosaic_view PLACEHOLDER card
  (view label · display label · argument summary · "Renders on the published page"). R-V1: no
  live render on the canvas. ✅
- `02-admin-panel-DEFECT-raw-fields.png` — **DEFECT EVIDENCE (F-104).** The right panel shows
  RAW schema fields (View Display / View / Display / Arguments / Hide When Empty + the machine
  names view_display/view/display/arguments/hide_when_empty) instead of the field_types custom
  picker + argument rows. The cascading picker and the PANEL-LABEL-LAW argument string are
  ABSENT. Mechanism in REPORT-CP-VE1.md — field_types dropped for PHP-class components. ❌
- `03-fe-dialog-placeholder-card.png` — FE dialog: the SAME placeholder card (F-087 parity). ✅
- `04a-page-pager-before.png` / `04b-page-pager-after.png` — anon page: the real view renders
  with a mini pager; the AJAX "Next" click swaps the rows (before: Article 1|2 → after:
  Article 3|4 — geometry oracle, witnessed in the run log). ✅
- `05a-canvas-red-card.png` — disabled view → red "View no longer exists" card on the canvas. ✅
- `05b-page-empty.png` — the disabled view renders nothing on the page (0 rows, F-058). ✅
- `06-anon-page.png` — anon parity of the page render. ✅

7/8 frames GREEN. Frame 02 documents the F-104 authoring-panel defect (render path is unaffected
and Kernel-proven; only the panel field wiring is broken). Reviewer + Arun rule on the fix.
