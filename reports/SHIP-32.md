# SHIP #32 — authoritative ship-list (in progress). Parent 8124d3e == origin.

Read-only git, NOTHING staged. Arun commits after his walk. This is the completed
slice of ship #32 (Z1 F-094 + Z2 Preview-removal + Z3 Stage-5 Kernel round-trip).
Z4 (F-083 carousel) + Z5 (F-084 search) remain OPEN (see AI/REPORT-SHIP32.md / TODO).

## EXACT TOTALS (verified via git, since 8124d3e)
- tracked-M: **7** · tracked-D (deleted): **2** · new untracked: **1** · GRAND TOTAL = **10**
- `git check-ignore` verdict: all ship-ok (the js/e2e retarget is gitignored, does not ship).

## (a) TRACKED MODIFICATIONS — 7  [file — origin]
```
css/builder.css                                       Z1 (F-094 canvas scroll parity)
js/dist/builder.js                                    Z2 (rebuild — MosaicPreview/mode removed)
js/src/builder/BuilderApp.tsx                         Z2 (Preview toggle removal)
mosaic.libraries.yml                                  Z1/Z2 (version 1.0.14 → 1.0.15 cache-bust)
tests/src/Unit/Smoke/Sprint09SmokeTest.php            Z2 (oracle-change: MosaicPreview smokes removed)
tests/src/Unit/Smoke/Sprint11SmokeTest.php            Z2 (oracle-change: preview-breakpoint smoke removed)
tests/src/Unit/Smoke/Sprint100SmokeTest.php           Z2 (oracle-change: MosaicPreview i18n smoke removed)
```

## (b) DELETIONS — 2  [file — reason]
```
js/src/builder/MosaicPreview.tsx                      Z2 (mode-swap Preview removed, Arun-ratified)
js/src/builder/__tests__/MosaicPreview.test.tsx       Z2 (tests the deleted component)
```

## (c) NEW UNTRACKED — 1  [file — origin]
```
tests/src/Kernel/Template/MosaicTemplateRoundTripTest.php   Z3 (Stage 5 template v5 round-trip)
```

## NOT changed (verified)
- `js/dist/frontend-editor.js` — byte-identical: the FE dialog (FrontendBuilderDialog) does not
  use BuilderApp, so the mode-swap removal is admin-only.
- The `/mosaic/render-preview` route + `RenderPreviewController` + Sprint09's controller smoke
  tests — LEFT (unused-but-harmless; retirement ledgered as a follow-up).

## EXACT git commands for Arun (stages precisely the 10, no noise)
```sh
cd web/modules/custom/mosaic
git add -u   # 7 modifications + 2 deletions (tracked)
git add tests/src/Kernel/Template/MosaicTemplateRoundTripTest.php   # the 1 new file
git diff --cached --name-only | wc -l          # must print 10
git diff --cached --name-only | grep -E '\.log$|^AI/|^assets/|\.zip$|esc-probe|^js/e2e/' || echo "clean — no noise staged"
```

## Gates (this slice)
FULL Kernel+Unit **2853 / 0** (2863 − 10 oracle-changed smokes; incl. the new template test;
render-preview controller + Sprint09 controller smokes intact) · Vitest **482 / 1** pre-existing
B-101 (−10 = the deleted MosaicPreview tests) · phpcs 0/0 on the new/changed files · lock/f066/W18
green (W18 @2b-geometry + fe-sidebar-scroll before+after) · builder dist rebuilt, libs 1.0.15.
