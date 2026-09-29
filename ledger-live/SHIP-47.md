# SHIP #47 — CP-ADOPT-7 / 7R adopt-any-SDC readiness + composition

- **Commit:** `33cd40c` (MOSAIC git HEAD; parent `a36f028` = ship #46). Committed by Arun.
- **Scope:** `git diff a36f028..33cd40c` = **96 files changed**, 7997 insertions, 298 deletions
  (35 files newly added).
- **Arc:** CP-ADOPT-7 P1–P3 + WC#94/#95, then CP-ADOPT-7R CHECKPOINTS 1–18.
- **Walk-catches to date:** 104 (WC#101 drag-flakiness, WC#104 escaped-example/HTML-props/component-fill,
  B-FUNC-DRIFT closed, B-PATTERN-INSTANCE-REPEATER closed).

## Gates at ship
- Kernel+Unit **3141 / 0** (8863 assertions)
- Functional **76 / 0** (789 assertions) — now a permanent gate member (B-FUNC-DRIFT)
- Vitest **724 / 1** (the 1 = B-101, pre-existing boolean→radio oracle drift)
- phpcs **0** · phpstan **0 new** (4 pre-existing B-102)
- owned oracles IDENTICAL — REGION `14e6cb9c…3954`, STYLE `b7756795…ca982 4354 10`
- libs **1.0.79** (builder `7dcbf3ca`, frontend-editor `8a1226be`)

## Arun 3-step sanity — PASS
1. node/780 renders **identical** to before (owned REGION+STYLE oracles unchanged).
2. An «ext» Accordion with 2 items **round-trips** (save → reopen → same).
3. A library **Card saves** (previously would have failed — see the CP-14 schema bug below).

## The 96 files: the plan's 82 + the CHECKPOINT 12–18 additions
The SHIP-47-PLAN tracked 82 shippable paths at CHECKPOINT-11; CHECKPOINTS 12–18 (component fill, patterns,
instance slot rules, the schema fix) added the feature files below. Git `--diff-filter=A` over ship #47
confirms **35 new files** total; the **13** attributable to CHECKPOINTS 12–18 (the charter's "14
additions" resolves to 13 by git — the count difference is how the plan tallied M vs ?? paths):

1. `tests/src/Kernel/Adopt/PropFillsRenderTest.php` (CP-14)
2. `js/src/builder/propFills.ts` (CP-15)
3. `js/src/builder/fields/MosaicFillField.tsx` (CP-15)
4. `js/src/builder/__tests__/propFills.test.ts` (CP-15)
5. `js/src/builder/__tests__/propFillsRoundTrip.test.ts` (CP-15)
6. `js/src/builder/fields/__tests__/MosaicFillField.test.tsx` (CP-15)
7. `js/src/builder/patterns.ts` (CP-17)
8. `js/src/builder/fields/MosaicPatternsPanel.tsx` (CP-17)
9. `js/src/builder/__tests__/patterns.test.ts` (CP-17)
10. `js/src/builder/fields/__tests__/MosaicPatternsPanel.test.tsx` (CP-17)
11. `tests/src/Kernel/Adopt/PatternsTest.php` (CP-17)
12. `js/src/builder/__tests__/adoptedFieldsFromDescriptors.test.ts` (CP-13)
13. `js/src/builder/fields/__tests__/MosaicAdoptedPreviewBadge.test.tsx` (CP-11/12 badge)

CHECKPOINT-16 (Functional gate) + CHECKPOINT-18 (instance slot rules + the prop_fills schema fix) were
**modifications** to already-tracked files (`schema/mosaic_layout_value.schema.json`,
`src/Value/ComponentInstance.php`, `MosaicPuckAdapter.ts`, `patterns.ts`, the 3 Functional test files),
so they add no NEW paths.

## Notable catch shipped in #47
CHECKPOINT-18 found + fixed a real save bug: the node schema (`additionalProperties: false`) never listed
`prop_fills`, so `validateFull` rejected any layout carrying it — the component-fill feature would have
FAILED at save through the node form. Fixed (schema now defines `prop_fills` + `_mosaic_slot_rules`);
Arun's sanity step 3 (a library Card saves) confirms it.

## Held-file
`src/Plugin/Component/SdcComponentPlugin.php` remained PRISTINE through ship #47 (the F-108 held-file rule
held; no delta since HEAD) — the rule is now retired (see ROADMAP / DELIVERY-PLAN amendment).

**Ship #47 is HELD. Acceptance gate before tagging 1.0.0 = Arun's walk (WALK-CP-ADOPT-7.md).**
