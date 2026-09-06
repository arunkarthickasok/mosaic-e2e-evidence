# Mosaic E2E Evidence — Index

Reviewer entry point. Evidence + run reports only (no code, DB, or secrets).

## Albums
- [`tabs-cke5/`](tabs-cke5/INDEX.md) — **CP-BODY-CKE5**: CKEditor 5 body editor (expand
  modal) replaces the TipTap fork. 19 frames across 3 green full-lifecycle journeys
  (admin, frontend, false-dirty untouched-page).
  - Money frame — image visible inside the CKE5 body (**admin**): [`tabs-cke5/05-media-in-cke5-body.png`](tabs-cke5/05-media-in-cke5-body.png)
  - Money frame — image visible inside the CKE5 body (**frontend**): [`tabs-cke5/FE-05-fe-media-in-cke5.png`](tabs-cke5/FE-05-fe-media-in-cke5.png)

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
