# Mosaic E2E Evidence — Index

Reviewer entry point. Evidence + run reports only (no code, DB, or secrets).

## Albums
- [`tabs-cke5/`](tabs-cke5/INDEX.md) — **CP-BODY-CKE5 + CP-EDIT20 + CP-EDIT21 (v3)**:
  CKEditor 5 body editor (expand modal) replaces the TipTap fork, plus two rounds of
  editor-UX hardening. 20 frames across 3 green full-lifecycle journeys (admin, frontend,
  false-dirty untouched). Media steps use REAL pointers + `elementFromPoint` z-order oracle.
  v3 adds: format select IN the modal (change → re-attach, RED→GREEN), fit-to-content modal,
  plain-text preview (no giant-heading-in-tiny-box).
  - Money frame — image inside the CKE5 body (**admin**): [`tabs-cke5/06-media-in-cke5-body.png`](tabs-cke5/06-media-in-cke5-body.png)
  - Money frame — image inside the CKE5 body (**frontend**): [`tabs-cke5/FE-05-fe-media-in-cke5.png`](tabs-cke5/FE-05-fe-media-in-cke5.png)
  - Format re-attach (**W2, admin #Full HTML**): [`tabs-cke5/03-cke5-format-fullhtml.png`](tabs-cke5/03-cke5-format-fullhtml.png)
  - Plain-text preview (**W3, no giant heading**): [`tabs-cke5/02-tab-set-expanded.png`](tabs-cke5/02-tab-set-expanded.png)
  - Stacking proof — media library on top (**admin #40**): [`tabs-cke5/05-media-library.png`](tabs-cke5/05-media-library.png)
  - Stacking proof — media library on top inside the top-layer dialog (**frontend #43**): [`tabs-cke5/FE-04-fe-media-library.png`](tabs-cke5/FE-04-fe-media-library.png)

- [`walk-45-46/`](walk-45-46/INDEX.md) — **walk-catches #45 (F-056) & #46 (node-form Preview)**:
  #45 CKEditor 5 inline uploads embedded in a Mosaic body now survive cron GC (new
  `MosaicFileUsage` service — RED red-X → GREEN real image renders for anon); #46 node-form
  Preview verdict = STOP (the field renders; the save-lock gates the non-mutating Preview op —
  Arun's call). 5 frames across scratch-entity journeys.
  - Money frame — uploaded image renders for anon after the fix: [`walk-45-46/45-upload-renders-green.png`](walk-45-46/45-upload-renders-green.png)
  - RED baseline — GC'd upload red-X: [`walk-45-46/45-upload-redx-red.png`](walk-45-46/45-upload-redx-red.png)

- [`preview-lock/`](preview-lock/INDEX.md) — **CP-PREVIEW-LOCK (walk-catch #46, Opt 1)**:
  the node-form Preview op is now exempt from the save-lock (Preview never persists), fixing
  the race where an immediate Preview bounced with "edit session expired". Full-lifecycle
  journey (edit → immediate Preview renders → back → Save → anon render); Kernel red→green
  keeps SAVE fully locked.
  - Money frame — Preview renders before the lock settles: [`preview-lock/01-preview-pre-lock-renders.png`](preview-lock/01-preview-pre-lock-renders.png)

## Reports
- [`reports/REPORT-CKE5.md`](reports/REPORT-CKE5.md) — full CP-BODY-CKE5 phase log:
  spike (S1–S4), P1 CKE5 modal, P2 TipTap deletion, P3 false-dirty, P4 self-lockout,
  derivation matrix, the three live bugs the journeys caught, and all gate results.
- [`reports/SHIP-31-CKE5.md`](reports/SHIP-31-CKE5.md) — consolidated ship #31 list:
  33 tracked + 12 new = 45 files, per-file origin tags, `git check-ignore` verdicts
  (45/45 ship-ok), and the exact `git add` commands.

## Headline results
- Both surfaces (admin + frontend) green; false-dirty untouched-page RED→GREEN.
- Three real product bugs caught by the live journeys and fixed: CKEditor5 instance
  key (`data-ckeditor5-id`), FE editor-asset fatal, and `_renderedHtml` false-dirty.
- Gates: Vitest 481/482 (1 pre-existing), module unit+kernel 2853/0-fail, lock
  Kernel+Unit 34/34, PHPCS 0-err, PHPStan L6 OK.
