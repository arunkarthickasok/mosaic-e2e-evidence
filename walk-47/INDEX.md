# walk-47 — WALK ROUND FIXES (Arun 2026-09-08)

RED set captured BEFORE any fix (Y0 "his-reality film"); GREEN set added after the fixes (Y5).
Full detail: [`../reports/REPORT-CKE5.md`](../reports/REPORT-CKE5.md) (section "WALK-47").

## RED — `red/`
| Frame | Shows | The defect |
|-------|-------|------------|
| `red/01-admin-expand-row2-canvas.png` | Admin builder, tab-set row 2 (Beta) expanded in the panel | **#47** — the canvas still shows tab 0 (Alpha). Oracle: `{expandedRowIdx:1, canvasVisiblePanelIdx:0}` |
| `red/02-fe-format-arrow.png` | FE Body modal "Text format" select | The down-arrow glyph is drawn **on top of** the text ("Basic HTML"). Oracle: `padding-right:5.6px` but arrow at `calc(100% - 18px)` → text runs under the arrow |
| `red/03-fe-media-dialog.png` | FE media library dialog | Chrome incomplete in the FE theme — `.media-library-menu` absent (`hasMenu:false`), grid/menu unstyled |

## GREEN — `green/` (added in Y5)
See the report for the fix mechanisms (Y1 tabsPanelSync selectors, Y2 format-select padding, Y3 FE chrome attach set).
