# SHIP #44 PLAN — CP-ADOPT-4 + 4R (adopt any SDC, usable end-to-end)

Fresh-read 75b3039 (ship #43 at HEAD). MOSAIC git READ-ONLY — Arun does the human commit.
**Status: UNBLOCKED.** WC#69 drop PROVEN with real CDP input; WC#66/#67/#68/#70 resolved;
full gates green; byte-identical held.

## What ships

The first component from OUTSIDE Mosaic (Olivero's `teaser`) is authorable end-to-end:
enabled from a library, placed on the canvas with the library's own markup, its slots filled
by real drag-and-drop, an empty required slot refused rather than shipped broken, and the
saved page matches — while owned components stay byte-identical.

## Changes (CP-ADOPT-4 server/client + 4R fixes)

### CP-ADOPT-4 (from earlier passes, uncommitted)
- Hybrid renderer (owned → direct Twig byte-identical; adopted → core component element).
- Palette opens for adopted Ready/Attention of enabled libraries; canvas attaches adopted libs.
- Tier-B SSR canvas render of adopted; `MosaicAdoptedPreview` + inline slot composition.

### CP-ADOPT-4R PASS 1
- `MosaicSlotZone` min hittable box (empty adopted slots were zero-width); slot labels (WC#67).

### CP-ADOPT-4R PASS 2 (this pass)
- `css/builder.css` — `.mosaic-adopted-preview` layout reset + `--min-empty-height` cap (WC#69).
- `js/src/builder/MosaicPuckAdapter.ts` — `.mosaic-adopted-preview` class; `serializeForDirty`
  empty-array strip (WC#66); slot-info empty-state wiring (WC#68).
- `js/src/builder/fields/MosaicSlotInfo.tsx` (new) — WC#68 empty panel.
- `src/Service/MosaicPropValidator.php` — WC#70a required-slot save validation.
- `src/Service/MosaicRenderer.php` — WC#70b empty-required-slot render guard.
- `tests/src/Kernel/Adopt/RequiredSlotTest.php` (new) + `MosaicSlotInfo.test.tsx` (new).
- `js/dist/builder.js` + `frontend-editor.js` rebuilt; `mosaic.libraries.yml` → 1.0.42.

## Gates at ship

- Full Kernel+Unit **2988 / 0** (8065 assertions; 1 warn, 6 deprec, non-fatal).
- Vitest **556 / 1-B101** (pre-existing checkbox drift); +2 MosaicSlotInfo pass.
- PHPCS **0 errors** on changed files. PHPStan L6 **+0** (MosaicRenderer 3 pre-existing).
- **Byte-identical node/780 `14e6cb9c…43e0dec` (3954) — before==after.**
- Dist rebuilt → **BUMP-LIBS 1.0.42**.

## Walk-catch status

| # | Catch | Status |
|---|---|---|
| 66 | dirty on load | FIXED — `dialogFired:false`, WC66-adopted.json |
| 67 | zone order / labels / banner | FIXED — WC67-LABELS.json |
| 68 | empty panel | FIXED — WC68.json + wc68-empty-panel.png |
| 69 | drop into adopted slot | **FIXED + PROVEN (CDP)** — WC69-CDP-PROOF.json |
| 70 | empty required slot | FIXED (a validator + b renderer) — RequiredSlotTest 4/4 |

## After ship #44

SSR-attachments refinement (R5/R10 dynamic-attach adopted) → CP-ADOPT-5..7 → backend config
audit (parallel, read-only) → Wave D/F/G → minimal ACT 2 → soak → tag 1.0.0.

---

## Ship-set file list — read-only capture (2026-09-19)

### `git status --short` — verbatim (every M / ?? line)

```
 M css/builder.css
 M js/dist/builder.js
 M js/dist/frontend-editor.js
 M js/src/builder/MosaicPuckAdapter.ts
 M js/src/builder/fields/MosaicSlotZone.tsx
 M mosaic.libraries.yml
 M src/Plugin/Field/FieldWidget/MosaicLayoutWidget.php
 M src/Sdc/ComponentDefinition.php
 M src/Sdc/SdcComponentDiscovery.php
 M src/Service/MosaicComponentGovernance.php
 M src/Service/MosaicManifestBuilder.php
 M src/Service/MosaicPropValidator.php
 M src/Service/MosaicRenderer.php
 M tests/src/Kernel/Adopt/AdoptedDescriptorParityTest.php
 M tests/src/Unit/Sdc/SdcComponentDiscoveryTest.php
 M tests/src/Unit/Smoke/Sprint02SmokeTest.php
 M tests/src/Unit/Smoke/Sprint66SmokeTest.php
?? assets/
?? js/cp-edit13-proof.log
?? js/cr-016.log
?? js/d1-constraint-016.log
?? js/d2-presave-016.log
?? js/d2d3-016.log
?? js/d3-worker-016.log
?? js/d4-full-016.log
?? js/d4-full-016b.log
?? js/d4-smoke-016.log
?? js/d4-smokes-016.log
?? js/d4-smokes-016b.log
?? js/diag-fe-blankout.log
?? js/dist-build-2b-builder.log
?? js/dist-build-2b-fe.log
?? js/e2e.zip
?? js/esc-probe.config.ts
?? js/esc-probe.log
?? js/f067-probe.log
?? js/fe-dialog-geometry-green.log
?? js/fe-dialog-geometry-red.log
?? js/fe-smoke-post-fix.log
?? js/fe-smoke-preflight.log
?? js/j2-016-reproof.log
?? js/j2-run3.log
?? js/j2-run4.log
?? js/j2-run5.log
?? js/j2-run6.log
?? js/j2-smoke-post-fix.log
?? js/mystery-probe-2.log
?? js/mystery-probe.log
?? js/phpstan-016.log
?? js/probe-edit16.log
?? js/scan-016-final.log
?? js/scan-016.log
?? js/src/builder/__tests__/MosaicAdoptedPreview.test.tsx
?? js/src/builder/__tests__/MosaicSlotInfo.test.tsx
?? js/src/builder/fields/MosaicAdoptedPreview.tsx
?? js/src/builder/fields/MosaicSlotInfo.tsx
?? js/src/builder/fields/htmlToReactSlots.tsx
?? js/typecheck-2b-d2.log
?? js/unit-full-016.log
?? js/vitest-w1-audit.log
?? js/vitest-w1-final.log
?? js/vitest-w1-legacy.log
?? js/vitest-w1-rehab.log
?? js/w14-green-final.log
?? js/w14-green.log
?? js/w14-green2.log
?? js/w14-green3.log
?? js/w14-green4.log
?? js/w14-green5.log
?? js/w14-red.log
?? js/w14-red2.log
?? js/w14-red3.log
?? js/w14-regress-j2.log
?? js/w14-regress-w13.log
?? js/w14-vitest.log
?? js/w15-green-final.log
?? js/w15-green.log
?? js/w15-red.log
?? js/w15-regress-fe.log
?? js/w15-regress-fe2.log
?? js/w15-regress-final.log
?? js/w15-regress-parity.log
?? js/w15b-green.log
?? js/w16-green-final.log
?? js/w16-green.log
?? js/w16-red.log
?? js/w16-w14-regress.log
?? js/w16b-green.log
?? js/w16b-red.log
?? js/w16b-w14-regress.log
?? js/w17-green.log
?? js/w17-red.log
?? js/w17-regress-w14.log
?? js/w17-regress-w16.log
?? js/w17-vitest.log
?? js/w18-green.log
?? js/w18-red.log
?? js/w18-regress-fe.log
?? js/w18-regress-parity.log
?? js/w18-regress-w16.log
?? js/w18-regress-w17.log
?? js/w19-diag-s4.log
?? js/w19-green-final.log
?? js/w19-green-final2.log
?? js/w19-green-full.log
?? js/w19-green.log
?? js/w19-red.log
?? js/w19-regress-fe.log
?? js/w19-regress-guard.log
?? js/w19-vitest.log
?? js/w2-templates-smoke.log
?? js/w20-green.log
?? js/w20-red.log
?? js/w20-regress-fe.log
?? js/w20-regress-misc.log
?? js/w20-regress-w19.log
?? js/w20-vitest.log
?? js/w21-green.log
?? js/w21-red.log
?? js/w21-regress-fe.log
?? js/w21-regress-geom.log
?? js/w22-green-echo.log
?? js/w22-green.log
?? js/w22-green2.log
?? js/w22-red.log
?? js/w22-regress-fesmoke.log
?? js/w22-regress-parity.log
?? js/w22-regress-w18.log
?? js/w22-regress-w19.log
?? js/w22-regress-w20.log
?? js/w22-regress-w21.log
?? js/w22-vitest.log
?? js/w22b-regress-fesmoke.log
?? js/w22b-regress-parity.log
?? js/w22b-regress-w18.log
?? js/w22b-regress-w19.log
?? js/w22b-regress-w20.log
?? js/w22b-regress-w21.log
?? js/w23-green.log
?? js/w23-regress-fesmoke.log
?? js/w23-regress-w18.log
?? js/w23-regress-w21.log
?? js/w33-2b-e2e-green.log
?? js/w33-2b-e2e-run.log
?? js/w33-2b-smoke-green.log
?? js/w33-2b-smoke-red.log
?? js/w33-2b-y1-sse-red.log
?? js/w33-2b-y3-e2e-green.log
?? js/walk2-autopsy.log
?? tests/b094-green.log
?? tests/b094-red.log
?? tests/f058-green.log
?? tests/f058-red.log
?? tests/f058-regress-kernel.log
?? tests/kernel-b099.log
?? tests/modules/adopt_fixture/
?? tests/smoke-b099.log
?? tests/src/Kernel/Adopt/HybridRenderTest.php
?? tests/src/Kernel/Adopt/PaletteOpenTest.php
?? tests/src/Kernel/Adopt/RequiredSlotTest.php
?? tests/w22-kernel-green.log
?? tests/w22-kernel-green2.log
?? tests/w22-kernel-red.log
?? tests/w33-2b-c1-nonce-green.log
?? tests/w33-2b-c1-nonce-red.log
?? tests/w33-2b-e2-kernel.log
?? tests/w33-2b-e2-sentinels.log
?? tests/w33-2b-r3-kernel.log
?? tests/w33-2b-r3-phpcs.log
?? tests/w33-2b-widget-green.log
?? tests/w33-2b-y3-kernel-full.log
?? tests/w33-2b-y3-kernel-lock.log
?? tests/w33-2b-y3-sentinels.log
?? tests/w33-d1b-smokegreen.log
?? tests/w33-d1b-smokered.log
?? tests/w33-d1b.log
?? tests/w33-d5-kernel-rerun.log
?? tests/w33-d5-positive.log
?? tests/w33-d5-sentinels.log
?? tests/w33-f050-green.log
?? tests/w33-f050-red.log
?? tests/w33-f063-green.log
?? tests/w33-f063-smokegreen.log
?? tests/w33-f063-smokered.log
?? tests/w33-full-kernel.log
?? tests/w33-regress-kernel.log
?? tests/waveb-b1-green.log
?? tests/waveb-b1-red.log
?? tests/waveb-b2-green.log
?? tests/waveb-b2-red.log
?? tests/waveb-b3-collab.log
?? tests/waveb-b3-green.log
?? tests/waveb-b3-red.log
?? tests/waveb-b4-green.log
?? tests/waveb-b5-green.log
?? tests/waveb-b5-red.log
?? tests/waveb-b7-kernel.log
?? tests/waveb-b7-sentinels.log
?? tests/waveb-b7-unit.log
```

### Files to STAGE — 28 (17 modified + 11 new)

**17 modified (M):**
```
 M css/builder.css
 M js/dist/builder.js
 M js/dist/frontend-editor.js
 M js/src/builder/MosaicPuckAdapter.ts
 M js/src/builder/fields/MosaicSlotZone.tsx
 M mosaic.libraries.yml
 M src/Plugin/Field/FieldWidget/MosaicLayoutWidget.php
 M src/Sdc/ComponentDefinition.php
 M src/Sdc/SdcComponentDiscovery.php
 M src/Service/MosaicComponentGovernance.php
 M src/Service/MosaicManifestBuilder.php
 M src/Service/MosaicPropValidator.php
 M src/Service/MosaicRenderer.php
 M tests/src/Kernel/Adopt/AdoptedDescriptorParityTest.php
 M tests/src/Unit/Sdc/SdcComponentDiscoveryTest.php
 M tests/src/Unit/Smoke/Sprint02SmokeTest.php
 M tests/src/Unit/Smoke/Sprint66SmokeTest.php
```

**11 new source (from ??):**
```
js/src/builder/__tests__/MosaicAdoptedPreview.test.tsx
js/src/builder/__tests__/MosaicSlotInfo.test.tsx
js/src/builder/fields/MosaicAdoptedPreview.tsx
js/src/builder/fields/MosaicSlotInfo.tsx
js/src/builder/fields/htmlToReactSlots.tsx
tests/src/Kernel/Adopt/HybridRenderTest.php
tests/src/Kernel/Adopt/PaletteOpenTest.php
tests/src/Kernel/Adopt/RequiredSlotTest.php
tests/modules/adopt_fixture/adopt_fixture.info.yml
tests/modules/adopt_fixture/components/adopt_widget/adopt_widget.twig
tests/modules/adopt_fixture/components/adopt_widget/adopt_widget.component.yml
```
(`adopt_fixture/` shows as one `??` dir-entry = 3 files. Count of files to stage = **28**.)

### `git check-ignore -v` — verdict per path
```
AI                              .gitignore:12:AI   AI          → IGNORED (symlink → mosaic-e2e-evidence/ledger-live)
js/e2e/                         .gitignore:15:js/e2e/  js/e2e/  → IGNORED
js/e2e.zip                      NOT IGNORED (untracked cruft — NOT staged)
js/esc-probe.config.ts          NOT IGNORED (untracked cruft — NOT staged)
js/*.log, tests/*.log           NOT IGNORED (untracked cruft — NOT staged)
assets/                         NOT IGNORED (25 untracked brand files — out-of-scope, NOT this ship)
src/Service/MosaicRenderer.php  NOT IGNORED (staged)
tests/modules/adopt_fixture/    NOT IGNORED (staged)
```

### Exclusions
- **AI/** — gitignored (`.gitignore:12`, pattern `AI`, the ledger symlink). NOT staged.
- **js/e2e/** — gitignored (`.gitignore:15`). NOT staged.
- **173 untracked cruft lines** — every `*.log` (js/ + tests/), `js/e2e.zip`, `js/esc-probe.config.ts`, and `assets/` (25 pre-existing brand files, a separate concern) — NOT gitignored but NOT part of this ship, so NOT staged.

### `SdcComponentPlugin.php` status (must be absent/pristine)
```
src/Plugin/MosaicComponent/SdcComponentPlugin.php — TRACKED + PRISTINE (absent from git status --short; git diff --stat empty)
```

### Commit message (single-quoted, for Arun to paste)
```
'ship #44: CP-ADOPT-4 + 4R adopt any SDC end-to-end - hybrid renderer (owned direct-Twig byte-identical, adopted via core component element), palette opens enabled adopted libraries, canvas renders the library markup with authorable slot drop zones (WC#69 drop PROVEN via CDP: min hittable box + .mosaic-adopted-preview layout reset + min-empty-height cap fix the zero-width/overlap/reflow causes), empty required slot refused at save + renders nothing not broken markup (WC#70 a+b), props-less adopted panel shows built-from-slots empty state (WC#68), no false unsaved prompt on load (WC#66), slot labels + banners (WC#67); full Kernel+Unit 2988/0, byte-identical 14e6cb9c held, dist rebuilt, libs 1.0.42'
```
