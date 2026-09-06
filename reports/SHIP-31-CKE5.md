# SHIP #31 — CONSOLIDATED authoritative ship-list (reconciled 2026-09-05)

Read-only git, NOTHING staged. Arun commits after his re-walk. This SUPERSEDES the
earlier "18 files" figure (that was the CP-BODY-CKE5 *delta only*) and the spike's
"44 tracked-M + 12 new" (STALE — it counted js/dist `chunk-*.js` that the
deterministic rebuild left byte-identical, plus files committed in interim ships).

## EXACT TOTALS (verified via git, this session)
- (a) tracked changes  `git status --short | grep -v '^??'`  = **33**  (all ` M`, zero ` D`)
- (b) untracked keep-list (minus AI/, *.log, assets/, *.zip, .DS_Store, esc-probe.config.ts) = **12**
- **GRAND TOTAL = 45 files**
- `git check-ignore` verdict: **45/45 ship-ok (0 ignored)**
- By origin: cke5 **18** · f087 **13** · stages34 **10** · f089-093 **4**
- deleted-tiptap-no-longer-appears: 5 files (DrupalMediaNode.ts, RichtextMediaMenu.tsx,
  DrupalMediaSurvival.test.ts, RichtextMediaMenu.test.tsx, RichtextField.test.ts) were
  UNTRACKED, so their deletion leaves **0** entries in git status — correctly absent.

## (a) TRACKED-M — 33 files  [file — origin — check-ignore]
```
MOSAIC.md                                                              f087       ship-ok
css/mosaic-fields.css                                                  cke5       ship-ok
js/dist/builder.js                                                     cke5       ship-ok
js/dist/frontend-editor.js                                             cke5       ship-ok
js/src/builder/BuilderApp.tsx                                          cke5       ship-ok
js/src/builder/LockManager.ts                                          cke5       ship-ok
js/src/builder/MosaicPuckAdapter.ts                                    cke5       ship-ok
js/src/builder/__tests__/FieldTypes.test.ts                           cke5       ship-ok
js/src/builder/__tests__/LockManager.test.ts                          cke5       ship-ok
js/src/frontend-editor/FrontendBuilderDialog.tsx                       cke5       ship-ok
js/src/shared/useDirtyGuard.ts                                         cke5       ship-ok
modules/mosaic_components/components/mosaic_tabs/mosaic_tabs.mosaic.yml stages34   ship-ok
modules/mosaic_media/js/media-library-bridge.js                        f089-093   ship-ok
modules/mosaic_media/mosaic_media.libraries.yml                        f089-093   ship-ok
modules/mosaic_media/src/Controller/MediaLibraryOpenController.php     f089-093   ship-ok
mosaic.libraries.yml                                                   cke5       ship-ok
mosaic.services.yml                                                    cke5       ship-ok
src/Controller/ManifestController.php                                  f087       ship-ok
src/Hook/MosaicHooks.php                                               cke5       ship-ok
src/Plugin/Field/FieldWidget/MosaicLayoutWidget.php                    f087       ship-ok
src/Plugin/MosaicFieldType/RepeatableFieldType.php                     stages34   ship-ok
src/Service/MosaicPropValidator.php                                    stages34   ship-ok
tests/src/Kernel/Component/MosaicTabsRenderTest.php                    stages34   ship-ok
tests/src/Kernel/Controller/ManifestFieldTypesTest.php                 stages34   ship-ok
tests/src/Unit/Controller/ManifestControllerTest.php                   f087       ship-ok
tests/src/Unit/Plugin/Field/MosaicLayoutWidgetTest.php                 f087       ship-ok
tests/src/Unit/Service/MosaicPropValidatorTest.php                     stages34   ship-ok
tests/src/Unit/Smoke/Sprint20SmokeTest.php                             f087       ship-ok
tests/src/Unit/Smoke/Sprint65SmokeTest.php                             f087       ship-ok
tests/src/Unit/Smoke/Sprint66SmokeTest.php                             f087       ship-ok
tests/src/Unit/Smoke/Sprint69SmokeTest.php                             f087       ship-ok
tests/src/Unit/Smoke/Sprint80SmokeTest.php                             f087       ship-ok
tests/src/Unit/Smoke/Sprint87SmokeTest.php                             f087       ship-ok
```
Tracked-M by origin: cke5 13 · f087 11 · stages34 6 · f089-093 3.
Note: MOSAIC.md is the cumulative changelog doc (touched every wave); tagged f087 by
its most-recent signature but not exclusive to one wave.

## (b) UNTRACKED KEEP-LIST — 12 files  [file — origin — check-ignore]
```
js/src/builder/__tests__/BodyEditModal.test.tsx                       cke5       ship-ok
js/src/builder/__tests__/TabsArrayUX.test.ts                          stages34   ship-ok
js/src/builder/__tests__/TabsPersistence.test.ts                      stages34   ship-ok
js/src/builder/fields/BodyEditModal.tsx                               cke5       ship-ok
js/src/shared/__tests__/DirtyBaseline.test.ts                         cke5       ship-ok
modules/mosaic_media/css/mosaic-media-fe.css                          f089-093   ship-ok
src/Service/MosaicEditorAttachments.php                               cke5       ship-ok
src/Service/MosaicManifestBuilder.php                                 f087       ship-ok
src/Service/MosaicTextFormatAccess.php                                stages34   ship-ok
tests/src/Kernel/Manifest/MosaicManifestParityTest.php                f087       ship-ok
tests/src/Kernel/Service/MosaicLayoutLockSelfLockoutTest.php          cke5       ship-ok
tests/src/Kernel/Service/MosaicTextFormatGuardTest.php                stages34   ship-ok
```
Untracked-keep by origin: cke5 5 · stages34 4 · f087 2 · f089-093 1.

## EXCLUDED untracked noise (NOT shipped — 172 entries)
`AI/**` (evidence/ledger, gitignored), `js/**/*.log` (dev logs), `assets/`,
`js/e2e.zip`, `.DS_Store`, `js/esc-probe.config.ts` (research-probe config for the
testIgnore'd esc-sequence-probe spec). Only AI/** and js/e2e/** are gitignored; the
rest are NON-ignored dev noise — which is EXACTLY why `git add -A` must NOT be used.

## EXACT git add commands for Arun (stages precisely the 45, no noise)
```sh
cd web/modules/custom/mosaic

# 1) all 33 tracked modifications (updates tracked files only — never adds untracked noise)
git add -u

# 2) the 12 new (untracked) ship files — explicit, so no dev noise is swept in
git add \
  js/src/builder/__tests__/BodyEditModal.test.tsx \
  js/src/builder/__tests__/TabsArrayUX.test.ts \
  js/src/builder/__tests__/TabsPersistence.test.ts \
  js/src/builder/fields/BodyEditModal.tsx \
  js/src/shared/__tests__/DirtyBaseline.test.ts \
  modules/mosaic_media/css/mosaic-media-fe.css \
  src/Service/MosaicEditorAttachments.php \
  src/Service/MosaicManifestBuilder.php \
  src/Service/MosaicTextFormatAccess.php \
  tests/src/Kernel/Manifest/MosaicManifestParityTest.php \
  tests/src/Kernel/Service/MosaicLayoutLockSelfLockoutTest.php \
  tests/src/Kernel/Service/MosaicTextFormatGuardTest.php

# 3) verify EXACTLY 45 staged, and that no noise slipped in
git diff --cached --name-only | wc -l          # must print 45
git diff --cached --name-only | grep -E '\.log$|^AI/|^assets/|\.zip$|esc-probe' || echo "clean — no noise staged"
```

## Ship #31 scope recap (what the 45 deliver)
- stages34 (CP-TABS-REDESIGN Stages 3+4): Tabs `sets` repeatable authoring, richtext
  body + author-first text-format UX, write-path format guard.
- f087: MosaicManifestBuilder extraction — admin(drupalSettings)/FE(API) manifest parity.
- f089-093: persistence fix, FE media dialog stacking, toolbar containment, media insert
  (first non-empty type), FE media library chrome.
- cke5 (CP-BODY-CKE5, this directive): CKEditor 5 expand-modal replaces the TipTap fork
  (deleted), #37 false-dirty + #38 self-lockout fixes, FE editor-asset attachments.

## Gates (all green — full detail in AI/REPORT-CKE5.md)
Vitest 481/482 (only B-101 pre-existing) · module unit+kernel FULL 2853/0-fail ·
lock Kernel+Unit 34/34 · PHPCS 0-err · PHPStan L6 OK · Admin + FE CKE5 journeys +
P3 untouched-page e2e GREEN (scratch entity, DB net-zero) · dist rebuilt (1.0.11).
Three live bugs caught+fixed: readHtml data-ckeditor5-id key; MosaicEditorAttachments
undefined supportsContentFiltering() FE fatal; serializeForDirty _renderedHtml false-dirty.
