# SHIP #37R — CP-VE2-R1 (WALK-CATCH #59 rider) — native single-field autocomplete

Rider on ship #37 (62a1c05). Presentation-only rework — NO stored-data shape change. Mosaic git
read-only here; this is the ceremony add block for the human commit. REPORT: reports/REPORT-CP-VE2.md.

## WALK-CATCH #59 — the fix
The fixed-value entity autocomplete presented a "Selected: <label>" line ABOVE a separate persistent
search input. The Drupal-native pattern is ONE field that carries the chosen label with type-in-place
to change. Reworked `EntityAutocomplete` to the single-field combobox:
- ONE input; when a value is stored it DISPLAYS the label (resolved via the entity-label endpoint).
- Focus + type searches in place (WC57 debounce / local-state / abort machinery UNCHANGED).
- Pick writes the entity ID (WC58 value-commit contract UNCHANGED) and shows its label in the field.
- Clearing the field empties the source (native "remove selection").
- No `argument_sources` shape change; `view_default` / `url_param` / `page_field` rows untouched.

## ORACLE-CHANGE (presentation cells only — value-commit oracle untouched)
- OLD reopen cell: asserted a separate `getByText('Selected: Alpha term')` line.
- NEW reopen cell: asserts the single field's VALUE === 'Alpha term' (label in-field) + NO `Selected:`
  line. Plus a new cell: clearing the field commits `value: ''` (empties the source).
- The pick VALUE-commit oracle (`toHaveBeenCalledWith([{source:'fixed', value:'5', …}])`) is UNCHANGED.

## Gates
| Gate | Result |
|---|---|
| Vitest — panel | **12/12** (reopen-shows-label-in-field + clear-empties, native) |
| Vitest — full suite | **519 / 1** (pre-existing B-101) |
| tsc — my file | clean |
| e2e — cp-ve2 film | **8/8** incl. the full loop (frame 10): fast-type "Citrus" → pick → field shows "Citrus" → SAVE succeeds → /node/982 filters to the Citrus subtree |
| dist + libs | builder + FE rebuilt, libs **1.0.18 → 1.0.19** (BUMP-LIBS law) |

## CONSOLIDATED CEREMONY `git add` (run from `web/modules/custom/mosaic`)
Read-only law: the AI does not stage the mosaic repo. Verified against `git status --porcelain` on top
of ship #37 (62a1c05). Expected staged count: **5** (all modified — no new files).

```bash
git add \
  js/src/builder/fields/MosaicViewsArgumentsField.tsx \
  js/src/builder/fields/__tests__/viewsFields.test.tsx \
  mosaic.libraries.yml \
  js/dist/builder.js \
  js/dist/frontend-editor.js
```

**Verify:** `git status --porcelain | grep -c '^[MA]'` → **5**.

**EXCLUSIONS (never staged):** `js/e2e/journeys/cp-ve2-film.spec.ts` (gitignored `js/e2e/`); `AI/`
(gitignored); the scratch dev-site content (terms/nodes 972–982, throwaway host 982); `assets/`,
`js/*.log`, `tests/*.log`, `js/e2e.zip`, `js/esc-probe.*` (untracked noise).

## STOP — reviewer audits, Arun one-step re-check, rider ceremony.
Queue after R1: CP-VE3 → ACT 2 → Wave D-0 + D/F → Wave G → dev push → Arun soak → tag.
