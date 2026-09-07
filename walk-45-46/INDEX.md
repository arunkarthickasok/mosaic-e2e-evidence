# walk-45-46 — walk-catches #45 (F-056) & #46 (node-form Preview)

Arun walk 2026-09-07, probe-then-fix-if-in-charter, ship #31 frozen. Full detail in
[`../reports/REPORT-CKE5.md`](../reports/REPORT-CKE5.md) (section "WALK-CATCHES #45/#46").
Frames are fullPage, deviceScaleFactor 2, from scratch-entity `@journey` runs (DB net-zero).

## #45 (F-056) — CKEditor 5 direct image upload — **FIXED (in charter)**
A file uploaded inline into a Mosaic richtext body was never given a `file_usage` row
(editor.module scans only text fields; our body lives in `field_mosaic_layout` JSON), so it
stayed temporary, cron GC deleted it, and `filter_html_image_secure` rendered the red-X. Fix:
a new `MosaicFileUsage` service records usage + marks the file permanent on entity save
(mirrors editor.module), wired to `MosaicHooks` insert/update/delete.

| Frame | Shows | Proves |
|-------|-------|--------|
| `45-upload-redx-red.png` | An upload whose file was GC'd before the fix | RED baseline — the "image removed" red-X placeholder |
| `45-upload-renders-green.png` | Anonymous page (Log in shown, no toolbar) after the fix + `drush cron` | GREEN — the uploaded image survives GC and renders for visitors (an identical *unreferenced* control file was reclaimed by the same cron) |

## #46 — node-form Preview of the mosaic field — **STOP (out of the formatter/renderer charter), PRE-EXISTING**
The field renders correctly in preview; the "broken" symptom is Mosaic's SAVE-lock validation
(`MosaicLayoutWidget::validateJson`, the F-050/F-064 ratified path) rejecting the non-mutating
Preview op when the self-lock is not yet held — a race, because the builder acquires the lock
async after load. Fixing it means exempting Preview from a ratified security guard → Arun's
call. No preview-specific render defect: node 841's preview is byte-faithful to its published
render.

| Frame | Shows | Proves |
|-------|-------|--------|
| `46-preview-lock-bounce-red.png` | Preview clicked before the lock settles → `/node/N/edit` + "Your edit session has expired…" | RED — the lock gates Preview; the preview never renders |
| `46-preview-lock-held-green.png` | Preview with the lock HELD → `/node/preview/…/full` (node 841) | The field DOES render once Preview reaches it (busy content is node 841's own duplicated components) |
| `46-clean-preview-green.png` | A clean 2-tab scratch node previewed with the lock held | GREEN — the formatter/renderer render the field correctly (Overview/Details tabs, one panel visible) |
