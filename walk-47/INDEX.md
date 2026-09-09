# walk-47 — WALK ROUND FIXES (Arun 2026-09-08)

RED set captured BEFORE any fix (Y0 "his-reality film"); GREEN set added after the fixes (Y5).
Full detail: [`../reports/REPORT-CKE5.md`](../reports/REPORT-CKE5.md) (section "WALK-47").

## RED — `red/`
| Frame | Shows | The defect |
|-------|-------|------------|
| `red/01-admin-expand-row2-canvas.png` | Admin builder, tab-set row 2 (Beta) expanded in the panel | **#47** — the canvas still shows tab 0 (Alpha). Oracle: `{expandedRowIdx:1, canvasVisiblePanelIdx:0}` |
| `red/02-fe-format-arrow.png` | FE Body modal "Text format" select | The down-arrow glyph is drawn **on top of** the text ("Basic HTML"). Oracle: `padding-right:5.6px` but arrow at `calc(100% - 18px)` → text runs under the arrow |
| `red/03-fe-media-dialog.png` | FE media library dialog | Chrome incomplete in the FE theme — `.media-library-menu` absent (`hasMenu:false`), grid/menu unstyled |

## GREEN — `green/`
Captured after the fixes, real-pointer law throughout (row expanded with a REAL mouse click,
click point asserted on the summary, canvas active tab read from the `<mosaic-tabs>` shadow).

| Frame | Shows | The fix |
|-------|-------|---------|
| `green/01-admin-sync-green.png` | Admin, row 2 (Beta) expanded → canvas shows tab 2 | **Y1 #47** fixed. Oracle: `{expandedIdx:1, canvasVisible:1, tabAria:["false","true","false"]}` |
| `green/03-fe-sync-green.png` | FE dialog, same — row 2 expanded → canvas tab 2 | Y1 #47 fixed on FE too (identical oracle) |
| `green/02-admin-format-arrow-green.png` | Admin format select | **Y2** — chevron sits in its own space; `paddingRight 25.6 ≥ arrowZone 19.2` (disjoint) |
| `green/04-fe-format-arrow-green.png` | FE format select | Y2 disjoint on FE too |
| `green/05-fe-media-dialog-green.png` | FE media dialog | **Y3** — styled vertical media-type menu (Image active), styled Choose File + Insert button, sane dark titlebar. Oracle: menu `list-style:none, display:flex, column` |

Fix mechanisms: Y1 `tabsPanelSync` selectors (sibling-index + overlay-geometry link, unit test
rewritten to the real Puck DOM); Y2 the select owns its arrow + padding-right 1.6rem; Y3 the
`mosaic/fe_chrome` library (scoped Claro component libs + bounded css), editor-gated so anon
loads nothing and admin is untouched. See `../reports/REPORT-CKE5.md` (section "WALK-47").

## Y4 — Preview-toggle ruling PREP (no build)
Options {remove / keep-as-is / make-interactive} with cost + a recommendation to REMOVE (the
builder Preview toggle is now redundant: WYSIWYG canvas + the fixed node-form Preview +
`mosaic/device_preview` breakpoint preview). See the report. Arun rules next window.
