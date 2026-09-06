# Mosaic — E2E Evidence & Run Reports

Reviewer-facing evidence for the [Mosaic](https://www.drupal.org/project/mosaic)
Drupal module. **Evidence and run reports only** — no module code, no database
dumps, no environment/secrets. The module source lives in its own repository.

## What's here

| Path | Contents |
|------|----------|
| [`INDEX.md`](INDEX.md) | Top-level index linking every album and report. |
| [`tabs-cke5/`](tabs-cke5/) | CP-BODY-CKE5 journey album (CKEditor 5 body editor) + [`INDEX.md`](tabs-cke5/INDEX.md). |
| [`reports/REPORT-CKE5.md`](reports/REPORT-CKE5.md) | Full CP-BODY-CKE5 phase log: spike, P1–P4, derivation matrix, live-journey findings, gates. |
| [`reports/SHIP-31-CKE5.md`](reports/SHIP-31-CKE5.md) | Consolidated ship #31 file list: counts, origin tags, `check-ignore` verdicts, exact `git add` commands. |

## Evidence-quality standard

Every journey frame is either a **fullPage** screenshot or a **targeted element
screenshot of the assertion region** (never a cropped half-window), captured at
`deviceScaleFactor: 2`, named `NN-description.png`, and indexed one-line-per-frame
in the album's `INDEX.md` (what it shows + which step/assertion it proves).

## How the journeys run

Playwright, against a live DDEV site, driving **real** author interactions
(enter → build → edit → save → reload → verify → render). Each journey creates a
throwaway scratch node and deletes it in `afterAll`, so the database returns to its
prior state (net-zero). Screenshots here are the captured proof of each green run.
