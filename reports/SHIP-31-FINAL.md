# SHIP #31 — FINAL (the milestone)

**Shipped commit:** `8124d3e825027d787e640e634750f3e88d961cec`
**Parent:** `db4f003236bc60a6d5f695f6925b04f5e77a88d3` (CP-TABS-REDESIGN Stage 2)
**Branch:** `fix/finding-016-validator` — `== origin` (in sync, tracked tree clean)
**Date:** 2026-09-08

## What shipped (55 files)
The full Tabs authoring experience on Drupal core CKEditor 5, and the arc around it:

- **CP-TABS-REDESIGN Stages 0–4** — repeatable Tab `sets` (heading summaries, min-1 floor),
  the MosaicFieldType engine, v4→v5 migration + check_markup render.
- **CP-BODY-CKE5** — the CKEditor 5 expand-modal body editor replaces the deleted TipTap fork;
  false-dirty (#37) + self-lockout (#38) cured; MosaicEditorAttachments for the FE surface.
- **CP-EDIT20 / CP-EDIT21** — editor UX (walk-catches #39–44): in-modal format select + bridge,
  fit-to-content modal, plain-text preview, panel↔canvas tab sync (first pass).
- **F-056 files** — `MosaicFileUsage` registers direct-upload files permanent across every tree
  (nodes, breakpoint_states, slots) so cron cannot reap referenced images.
- **CP-PREVIEW-LOCK (#46)** — node-form Preview exempt from the save-lock via structural gating
  (the `::preview` submit handler), while SAVE keeps full lock enforcement.
- **WALK-47** — #47 panel↔canvas sync rebuilt against the REAL Puck DOM (the fabricated-test-DOM
  green was caught by the live-film law); format-select arrow no longer overlaps its label; FE
  chrome completed with the scoped Claro libs + `mosaic/fe_chrome` (anon loads zero, admin
  untouched).

Walk-catches **#16, #26–#47 closed on ship**. TipTap fork deleted. MosaicManifestBuilder is the
single-source manifest.

## Gates at ship
- FULL Kernel + Unit: **2862 tests / 7270 assertions / 0 failures**
- Vitest: **492 pass** (1 pre-existing B-101 drift)
- lock + lock-2b + f066: **14** · W18 `@2b-geometry` · sentinels via Vitest
- PHPCS clean · PHPStan L6 clean · dist **1.0.14**

## Evidence albums (this repo)
`tabs-cke5/` (v1–v3) · `walk-45-46/` · `preview-lock/` · `walk-47/` (RED `ae37fe6` + GREEN
`b500f8f`). Reports: `REPORT-CKE5.md`, `SHIP-31-CKE5.md` (the 55-file ship-list), this file.

## Open after ship (queued for #32)
- #25 / F-072 — columns Wave 3.2
- #29 / F-081 — FE deselect (park)
- #48 / F-094 — admin node-edit canvas lacks scroll while the FE dialog canvas has it (parity)
- ARUN RULING pending: remove the builder Preview toggle (recommended) — rides #32 if ratified
