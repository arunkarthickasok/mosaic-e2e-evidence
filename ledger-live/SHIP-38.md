# SHIP #38 (accumulating on f3787cb) — CP-VE3 + WC60 optimistic commit

Running ship doc. Accumulates on ship #37R (`f3787cb`, parent `62a1c05`). Mosaic git read-only here — this
is the ceremony add block for the human commit. NOT tagged. CP-VE3 P1-P4 resume AFTER the WC60 feel-walk,
so this set still grows before the ship ceremony.

## What has landed so far
- **CP-VE3 P0** — F-106 flush-on-submit (interim side-channel), then SUPERSEDED + RETIRED by WC60/O3.
- **WC60 O1** — optimistic-commit SPIKE (mosaic_view), reviewer-accepted.
- **WC60 O2** — roster-wide migration (all 11 Tier-B on one optimistic path); dead inline SSR removed.
- **WC60 O3** — F-106 side-channel RETIRED (module + wiring); guards re-pointed; FE parity filmed.
- **WC60 O4** — perf oracle + films + full gates + this doc.

## WC60 in one paragraph
Every Tier-B (`requires_ssr_preview`) component's `resolveData` now **commits the raw props synchronously**
(so a fast edit-then-save keeps the value from the LIVE store — F-106 cannot recur — and Puck's 50 ms
loading flag is cancelled, so the panel overlay never latches) and resolves the SSR preview in the
**background** (debounced 200 ms, abortable, OFF the commit path). The preview HTML is applied via a
**history-excluded `setData`** that does not re-enter `resolveData` (proven from Puck 0.21.3 dist + a
per-id authoring-snapshot loop guard). The canvas shows **stale-preview-with-shimmer** on edit (never
blank; skeleton only on first insert). `_renderedHtml`/`_ssrError`/`_ssrShimmer` are preview-only and
**stripped on save** (fromPuck).

## Perf oracle (before → after)
| Metric | Before (WC60 probe) | After (optimistic) |
|---|---|---|
| Puck loading overlay in panel DOM (mosaic_view) | 103→357 ms (**254 ms**) | **never** (−1) |
| Panel overlay on a carousel prop edit | freeze | **never** (overlaySeen=false) |
| Search input focus after a pick | lost at **~36 ms** | **retained** (−1) |
| Panel re-renders per pick (mosaic_view) | **16** dev | **2 dev = 1 prod** |
| SSR requests per edit | inline (blocks commit) | **1** background; 4 rapid edits → **1** |
| Canvas on edit | freeze → skeleton | **stale-preview-with-shimmer** (never blank) |
| F-106 race (pick → instant save) | value **lost** | **survives** (live store, no side-channel) |

## Gates (WC60 slice)
| Gate | Result |
|---|---|
| Vitest — full | **524 / 1** (1 = pre-existing B-101 boolean→radio) |
| tsc | clean (only pre-existing `dsdShadow.ts`) |
| PHPUnit — full Unit suite | **2689 tests, 0 failures** (pre-existing warnings/deprecations only) |
| PHP JS-source smoke (Sprint65/66/67/68/87) | **green** (oracle-changes re-pointed to tierBOptimistic) |
| phpcs — changed PHP | **0 errors** (remaining line-length warnings are pre-existing file headers) |
| e2e — wc60-spike (mosaic_view) | **7/7** |
| e2e — f106-flush (race, no side-channel) | **2/2** |
| e2e — wc60-fe-film (FE parity) | **2/2** |
| e2e — carousel prop-edit perf | overlay never latches + canvas shimmer |
| e2e — sentinels (f094 scroll, f066 FE lock, ship34 carousel sync) | **3/3, 4/4, 2/2** |
| dist + libs | builder + FE rebuilt (no debug leaks); libs **1.0.19 → 1.0.23** |

Kernel/Functional unaffected — no production PHP changed (only JS + 2 smoke-test files).

## CONSOLIDATED CEREMONY `git add` (run from `web/modules/custom/mosaic`)
Read-only law: the AI does not stage the mosaic repo. Verified against `git status --porcelain` on top of
ship #37R (`f3787cb`). Expected: **10 modified + 3 new = 13**. The P0 side-channel files
(`pendingArgSources.ts` + its test) were created then deleted within this set → net zero (nothing to stage).

```bash
git add \
  js/src/builder/MosaicPuckAdapter.ts \
  js/src/builder/BuilderApp.tsx \
  js/src/builder/index.tsx \
  js/src/builder/fields/MosaicViewsArgumentsField.tsx \
  js/src/builder/tierBOptimistic.ts \
  js/src/builder/__tests__/tierBOptimistic.test.ts \
  js/src/builder/__tests__/TierBPreviewKeysStripped.test.ts \
  js/src/frontend-editor/FrontendBuilderDialog.tsx \
  tests/src/Unit/Smoke/Sprint67SmokeTest.php \
  tests/src/Unit/Smoke/Sprint68SmokeTest.php \
  mosaic.libraries.yml \
  js/dist/builder.js \
  js/dist/frontend-editor.js
```

**Verify:** `git status --porcelain | grep -c '^[MA]'` → **13** (after `git add`).

**EXCLUSIONS (never staged):** `js/e2e/journeys/wc60-*.spec.ts` + `f106-flush.spec.ts` (gitignored `js/e2e/`);
`AI/` (gitignored); scratch dev-site content (nodes 942/982); `assets/`, `js/*.log`, `tests/*.log` noise.

## STOP — reviewer audits WC60, Arun FEEL-WALK, then CP-VE3 P1-P4 resume on the cured pipeline.
Queue after WC60: CP-VE3 P1 (SSR preview button) → P2 (exposed filters + pager) → P3 (data-source parity)
→ P4 (A3 preset doc) → P5 (films + ship ceremony) → ACT 2 → Wave D-0+D/F → Wave G → dev push → tag.
