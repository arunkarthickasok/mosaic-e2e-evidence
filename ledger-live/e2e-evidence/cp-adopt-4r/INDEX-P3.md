# cp-adopt-4r PASS 3 — WC#69 true cause (colon in placed id) — 2026-09-19

Full narrative: `reports/REPORT-CP-ADOPT-4R-P3.md`. Re-proved under the PROOF-CONDITIONS LAW
(headed Chrome, fresh in-session page, served==built, Arun's exact steps).

- **`HEADED-PROOF.json`** — THE PROOF. 3 consecutive headed-Chrome runs of Arun's exact
  sequence (`/node/add/page` → title → Start blank → place Teaser → drag Heading into
  Content): 3/3 `landed:true`, `before:0→after:1`, saved `slots.content=["mosaic_heading-…"]`,
  placed id colon-free `olivero--teaser-<uuid>`.
- `ARUN-HEADED.json` — the FAILURE reproduced on the pre-fix build: `dragOver` resolves to
  `component olivero:teaser-<uuid> → root:default-zone` (colon breaks zone parsing).
- `ARUN-HEADED-FIXED.json` — an interim run showing the colon fix makes the id colon-free +
  the type decodes to `olivero:teaser` on save (a scroll-harness artifact still failed here;
  the natural-position runs land).
- `DRAG-SAMPLE.json` — instrumented Puck during the successful drop: content dropzone is a
  candidate (`dt:true`), `dragOver targetZone=…:content`, `dragEnd previewKeys=[…:content]`,
  `after=1`; the reflow (content zone `32→68px` on hover) is captured + tolerated.
- `FRESH-GEO.json` — at rest after fresh placement: all zones colon-free, `pos:static`,
  non-overlapping, `pe:auto`, `reachAtCenter:true` (the layout reset + cap work).

Cause: `generateId(type)` embeds the adopted type's colon in the node id; Puck parses zone
ids with `split(":")`. Fix: colon-free Puck key (`:`⇆`--`) mapped back to the real SDC type
for save. libs 1.0.43; served==built `d7429dc5…95e7875a`.
