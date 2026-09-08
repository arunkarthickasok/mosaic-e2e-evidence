# preview-lock — CP-PREVIEW-LOCK (walk-catch #46, Opt 1)

Arun ratified Opt 1 from the #46 STOP report: the non-mutating node-form **Preview** op is
now exempt from the save-lock (`MosaicLayoutWidget::validateJson` returns before the lock
block when the trigger is the core Preview button — identified by its `::preview` submit
handler, never the translated label). Schema validation + the write-path format guard still
run for Preview; **SAVE keeps full lock enforcement**. Full detail:
[`../reports/REPORT-CKE5.md`](../reports/REPORT-CKE5.md) (section "CP-PREVIEW-LOCK").

Full-lifecycle `@journey` (scratch node, DB net-zero): edit → **immediate Preview (before
the async lock settles — the exact old race)** → renders → back → Save → anonymous render.

| Frame | Shows | Proves |
|-------|-------|--------|
| `01-preview-pre-lock-renders.png` | Preview clicked immediately on a fresh edit page → `/node/N/preview/…/full` renders the tabs field (Overview/Details, one panel) | The fix — Preview renders **without** a settled lock; no "edit session expired" bounce |
| `02-saved.png` | Back to edit, lock settled, Save → redirect to `/node/N` | SAVE still works with the lock held (lock enforcement unchanged) |
| `03-anon-render.png` | Anonymous view of the saved node | The saved layout renders the field for visitors |

Kernel red→green: `MosaicLayoutWidgetPreviewExemptTest` — Preview without a lock PASSES
(today-red → green), Preview under a foreign lock PASSES, Preview still refuses invalid JSON,
SAVE without a lock still REFUSED, SAVE by the holder with the matching nonce PASSES.
