# CP-EDIT20 CONSOLIDATED REPORT + WAVE 1.3 RECON

**Generated:** 2026-07-21 (overnight directive)
**Status:** FIXED-PENDING-SHIP (ship ceremony = Arun commit + push)
**Ledger cross-refs:** AI/TODO.md L6054–6115, AI/FINDINGS.md L449–end

---

## PART 1 — CP-EDIT20 COMPLETE RECORD

### 0. Problem Statement

**EDIT-20:** FE dialog (frontend inline editor, `mosaic_fe_editor` surface) simultaneously
exposed two save-meaning controls:
1. Mosaic toolbar **Save** button (`.mosaic-fe-dialog__save`) — Mosaic-authored, correct
2. Puck native **Publish** control — rendered inside Puck's MenuBar via `headerActions`,
   calling the SAME `handleSave()` as the toolbar button → duplicate POST to
   `/mosaic/frontend-save/{entity_type}/{entity_id}/{field_name}`

Admin builder (`BuilderApp.tsx`) correctly suppresses Puck's Publish button via
`puckOverrides.headerActions: (): React.ReactElement => <MosaicTestabilityHooks />`.
FE dialog had no equivalent override → defect.

**Note:** Initial W13-S01 oracle (`getByRole('button', ...)`) was blind to the defect
because Puck renders `Publish` as a `<span>`, not a `<button>`. Arun's manual repro
(5th walk-catch, 2026-07-21) caught the oracle blindness; robot had a false-pass.

---

### 1c. Mechanism Fresh-Read (OBSERVED-IN-CODE)

**Puck source — chunk-YXFTA2VL.mjs:7138-7139:**
```javascript
const CustomHeaderActions = useAppStore(
  (s) => s.overrides.headerActions || defaultHeaderActionsRender
);
```
`MenuBar.renderHeaderActions()` always calls `CustomHeaderActions`, passing Publish
as `children`. Without an override, `defaultHeaderActionsRender` renders a
`<Button onClick={...}>Publish</Button>`.

**FrontendBuilderDialog.tsx pre-fix (lines ~202):**
```tsx
<Puck
  ...
  onPublish={() => { void handleSave(); }}
  // No overrides → defaultHeaderActionsRender fires → Publish span visible
/>
```

**BuilderApp.tsx:449 (admin builder — parity reference):**
```tsx
headerActions: (): React.ReactElement => <MosaicTestabilityHooks />
```
Same suppression pattern: custom `headerActions` override → Publish children not rendered.

---

### 1d. FINDINGS.md Amendment

Prior EDIT-20 mechanism text (Step 1 initial inference) stated mechanism via
`CustomHeader.actions` → `DefaultOverride` ignores `actions` prop. This was
imprecise. The actual render path is `MenuBar.renderHeaderActions()` inside
`_MenuBar_8pf8c_1 > _MenuBar-inner_8pf8c_29`, NOT via `CustomHeader.actions`.
Filed as UPDATE 2026-07-20 in `AI/FINDINGS.md` (FINDING-030 section, CP-EDIT20 STEP 1d).

---

### A. Element-Type Truth (Arun manual repro, 5th walk-catch)

**A1 — Diagnostic run results (diag deleted per scratch rule):**
```
tagName:       span
className:     _Button_10byl_1 _Button--primary_10byl_48 _Button--medium_10byl_29
role:          null
offsetParent:  not-null (VISIBLE)
insideDialog:  true
parentChain:   _MenuBar-inner_8pf8c_29 > _MenuBar_8pf8c_1 > _PuckHeader-tools_63pti_75
```

**A2 — Bundle proof (js/dist/frontend-editor.js, Button component):**
```javascript
const ElementType = href ? "a" : type ? "button" : "span";
```
Publish is given `onClick` only — no `href`, no `type` → `ElementType = "span"`.

**A3 — VERDICT:** Publish exists as `<span class="_Button_10byl_1 ...">Publish</span>`
inside dialog, via `MenuBar.renderHeaderActions()` path. Visible = true.
Robot missed it because `getByRole('button')` requires `<button>` element or
`role="button"` attribute — neither present on the span.

---

### W13 Oracle Corrections (Oracle-Rule sanctioned)

Both corrections made BEFORE the fix shipped, with Arun's manual repro as authority.

**W13-S01 (oracle v1 → v2):**
```typescript
// v1 — BLIND (getByRole requires <button> or role="button"):
const publishEl = fe.editorDialog.getByRole('button', { name: /^publish$/i });

// v2 — CORRECT (tag-agnostic text match finds the span):
const publishEl = fe.editorDialog.getByText('Publish', { exact: true });
```

**W13-S03 (waitForEvent → waitForResponse):**
```typescript
// BROKEN (times out: page.reload() fires before requestfinished resolves):
await page.waitForEvent('requestfinished',
  req => req.url().includes('mosaic/frontend-save'), { timeout: 30_000 });

// FIXED (resolves after route.fulfill() returns, before subsequent reload):
await page.waitForResponse('**/mosaic/frontend-save/**', { timeout: 15_000 });
```
Justification: `route.fulfill()` fulfils the intercepted request AND triggers
`window.location.reload()`. `waitForEvent('requestfinished')` races the page
navigation and loses. `waitForResponse()` resolves from `route.fulfill()`'s
return value before navigation completes.

---

### B. Required Red Run (post oracle correction)

```
W13-S01: FAILED ✓ (REQUIRED RED CONFIRMED)
  Expected: 0 (Publish count)
  Received: 1
  Locator: locator('dialog.mosaic-fe-dialog,...').getByText('Publish', { exact: true })

W13-S02: PASSED (save triggers reload pre-fix — regression guard baseline confirmed)

W13-S03: FAILED (waitForEvent timeout — separate oracle issue, fixed before green)
```

---

### C. Fix Applied

**File:** `js/src/frontend-editor/FrontendBuilderDialog.tsx`

```diff
-  onPublish={() => { void handleSave(); }}
+  overrides={{ headerActions: () => <></> }}
```

Puck mount (lines ~194-208):
```tsx
<div className="mosaic-fe-dialog__canvas mosaic-canvas-scope">
  {/* CP-CANVAS-SCOPE + FINDING-028-FE: activates canvas-reset @layer admin isolation */}
  {/* EDIT-20 / CP-EDIT20: overrides.headerActions suppresses Puck's native Publish
      button (MenuBar renders it as <span class="_Button_..."> via renderHeaderActions).
      Empty fragment → CustomHeaderActions renders nothing → Publish span absent.
      onPublish removed as dead code (no-op without the button). Admin parity:
      BuilderApp.tsx:449 same pattern. */}
  <Puck
    config={puckConfig as Parameters<typeof Puck>[0]['config']}
    data={puckData as Parameters<typeof Puck>[0]['data']}
    onChange={(updated) => handleChange(updated as PuckData)}
    iframe={{ enabled: false }}
    overrides={{ headerActions: () => <></> }}
  />
</div>
```

**JSX syntax note:** Comment placed in JSX body (inside `<div>`) not between props —
`{/* */}` is valid JSX body syntax, not a JSX attribute position.

---

### D. Dist Rebuild + Bundle Proof

```
npx vite build --config vite.frontend-editor.config.ts
✓ built in 173ms
```

**Bundle grep (js/dist/frontend-editor.js) — around "mosaic-canvas-scope":**
```javascript
overrides: { headerActions: () => jsx(Fragment, {}) }
```
`onPublish` → **ABSENT** from FE dialog Puck mount (confirmed by grep).
`overrides.headerActions` → **PRESENT** (empty fragment confirmed).

---

### E. Green Runs

All runs tee'd per protocol.

| Suite | Result | Tee file |
|---|---|---|
| W13 (3 scenarios) | **3/3 passed** | `tee-w13-green.txt` |
| fe-dialog-parity.spec.ts | **31/31 passed** (W12-S30 pre-existing skip) | `tee-fe-parity-green.txt` |
| fe-dialog-geometry.spec.ts | **12/12 passed** | `tee-fe-geometry-green.txt` |
| frontend-editor.spec.ts (FE-01..12) | **12/12 passed** | `tee-frontend-editor-green.txt` |

J2 not required — `BuilderApp.tsx` not touched.

**W13-S01 green quote:**
```
✓ W13-S01 | FE dialog: Publish control absent (single save control) — count=0
  publishEl count: 0  ← REQUIRED
```

---

### F. Doc-Sync

Both ledger files appended with sed proofs.

**FINDINGS.md sed proof** (UPDATE 2026-07-21, FINDING-030 section):
```
sed -n '449,$p' AI/FINDINGS.md | head -3
→ UPDATE 2026-07-21 (CP-EDIT20 FIXED): corrected mechanism, fix summary, dist proof...
```

**TODO.md sed proof** (CP-EDIT20 entry, L6054–6115):
```
sed -n '6054,6060p' AI/TODO.md
→ CP-EDIT20 WAVE 1.3 — FE dialog single save control   2026-07-21   FIXED
→ ...
```

---

### Diag Deletion Confirmation

```
ls js/e2e/diag-*.spec.ts
→ (eval):1: no matches found
→ NONE — deleted
```

`diag-fe-blankout.spec.ts` (for EDIT-08/EDIT-13) was the only diag file found.
It was labeled "READ-ONLY: no saves, no ledger writes, no git. Throwaway — do not commit."
Deleted this session per diagnostics scratch rule + overnight directive instruction.

---

## PART 2 — WAVE 1.3 RECON (paper only)

### Ratified Wave 1 Roadmap — Verbatim from AI/MASTER-AUDIT.md L1264-1269

```
WAVE 1 — CRITICAL FIXES (shared-code first, cheapest-biggest):
1.1 CP-EDIT13: tag-dep fix at MosaicPuckAdapter sync effect (one-line shape; heals FE + admin,
    likely closes WALK-06).
1.2 CP-FE-PARITY: port missing CSS to frontend_editor library (design-system, builder.css scroll
    rules, canvas-reset) + undo keyboard handler + EDIT-03 skeleton. Closes EDIT-04/05/10-part/11
    + FINDING-028-FE.
1.3 CP-UNSAVED-GUARD: close-guard both surfaces (EDIT-12).
1.4 CP-029-CONTRAST: capture winning CSS rule (mechanisms-observed), then specificity fix for
    button text on output; WCAG AA verification test.
Each: full scenario derivation audited before build.
```

**Wave 1.3 session context:** CP-EDIT20 was handled as an unplanned fix within Wave 1.3
(defect surfaced during Walk Testimony 5th catch). Items 1.3 and 1.4 remain open.

---

### Item 1.1 — CP-EDIT13 (tag-dep fix)

**Status: COMPLETE. Shipped (commit 22af19f, 2026-07-19).**

**Mechanism (OBSERVED-IN-CODE):**
- `MosaicPuckAdapter.ts:265-272` — `InlineEditableText` sync effect:
  ```typescript
  React.useEffect(() => {
    if (ref.current && document.activeElement !== ref.current) {
      ref.current.innerText = initialValue || placeholder;
    }
  // tag in deps: when tag changes React replaces the DOM element; the new
  // element has empty innerText, so the effect must re-run to repopulate it.
  }, [initialValue, placeholder, tag]);
  ```
- Pre-fix deps were `[initialValue, placeholder]` — `tag` absent. When h2→h3,
  React replaced the DOM element; new element had empty `innerText`; effect
  did not re-run → content lost. Fix: add `tag` to deps.

**Affected surfaces:** Both (shared `MosaicPuckAdapter.ts` used by admin + FE dialog).
**Closes:** EDIT-13, WALK-06 (transient content loss on tag change).

---

### Item 1.2 — CP-FE-PARITY (CSS port + undo + skeleton)

**Status: COMPLETE. Wave 1.2 CLOSED (2026-07-20).**
Delivered: `CP-CANVAS-SCOPE`, `CP-PARITY-ORACLE`, `CP-EDIT18+03`.
Closes: EDIT-04/05/10-part/11, FINDING-028-FE, EDIT-18, EDIT-03.
Cross-ref: `AI/TODO.md` WAVE 1.2 CLOSED section (L5831–5846).

---

### Item 1.3 — CP-UNSAVED-GUARD (close-guard both surfaces, EDIT-12)

**Status: OPEN. Not yet implemented.**

**EDIT-12 finding (from AI/TODO.md L4980 + L5008):**
```
EDIT-12 no unsaved-changes warning on close (verified twice: Arun made changes,
closed, zero warning). Data-loss risk. Arun rules warning required.

EDIT-12 unsaved warning: NOT-FOUND in BOTH surfaces (handleClose closes with
zero guard in both). One pattern, two applications.
```

**Mechanism (OBSERVED-IN-CODE, both surfaces):**

*FE dialog — `js/src/frontend-editor/FrontendBuilderDialog.tsx:173-175`:*
```typescript
const handleClose = (): void => {
  dialogRef.current?.close();
};
```
No dirty-state check. `onChange` fires (L139-141) and updates `currentDataRef`
but nothing compares to `initialData` or guards closure.

*Admin builder — `js/src/builder/BuilderApp.tsx`:*
Grep for `beforeunload`, `dirty`, `hasUnsaved`, `isDirty` → **NONE FOUND**.
`onClose` callbacks on overlay dialogs (BuilderApp.tsx:902, 918, 931, 939, 947)
close their respective sub-dialogs, not the builder form itself.
No `window.addEventListener('beforeunload', ...)` present on either surface.

**Build shape required:**
1. Track dirty state: compare `currentDataRef.current` to `initialData` on `onChange`
2. FE dialog: intercept `handleClose` + native dialog `cancel` event (Escape key) →
   show confirm prompt if dirty
3. Admin builder: intercept form navigation / tab close → `beforeunload` handler +
   route-leave confirmation if dirty
4. Test: W14 scenarios deriving from EDIT-12 walk testimony — one per surface

**Open rulings needed:**
- R-UNSAVED-A: Confirm guard on BOTH surfaces (admin + FE) or FE-only first?
- R-UNSAVED-B: UX copy for the confirm prompt (browser native `confirm()` vs
  custom `<dialog>`)?
- R-UNSAVED-C: Should Escape on the FE dialog trigger the guard or always close?

**Proposed sequencing note:** Both surfaces share the dirty-detection pattern;
implement as a shared helper (e.g. `useDirtyGuard` hook). Admin guard needs
`beforeunload` (browser navigation) AND Drupal form route-leave (Puck UI only).
FE guard needs dialog `cancel` event interception AND toolbar ✕ Close button.

---

### Item 1.4 — CP-029-CONTRAST (button text contrast fix)

**Status: OPEN. Mechanism INFERRED; winning CSS rule not yet captured.**

**FINDING-029 (AI/FINDINGS.md:282):**
```
FINDING-029 — THEME LINK RULE OVERRIDES BUTTON TEXT COLOR ON OUTPUT (2026-07-18, OPEN):
anon frontend button text computes rgb(20,117,173) instead of token-resolved #ffffff;
site theme link rule beats .mosaic-button--primary specificity. Blue-on-blue ≈ WCAG AA
contrast failure on public output. Gov/508 relevance: HIGH. Mechanism INFERRED (winning
rule not yet captured — capture exact rule via DevTools cascade before fix ships, per
mechanisms-observed rule). Cross-ref: WALK-24, a11y/WCAG-508 audit arc.
```

**Mechanism (OBSERVED-IN-CODE — partial):**

*`css/mosaic-design-system.css:148-150 + 290-293`:*
```css
--mosaic-button-primary-color: #ffffff;
...
.mosaic-button--primary {
  color: var(--mosaic-button-primary-color);   /* → #ffffff */
}
```
Token resolves to `#ffffff` — correct intent.

*Inferred competing rule (NEEDS-LIVE-PROBE to capture exact selector):*
The site theme applies a link colour rule (e.g. `a { color: #1475ad }` or similar)
with higher effective specificity than `.mosaic-button--primary` on the rendered
`<a>` element. The mosaic button component likely renders as `<a>` in some contexts
(navigation/CTA buttons), making it vulnerable to theme link rules that override
`color` on `a` elements. Alternatively, the site theme's `a:not([class]) { ... }`
or a more specific `main a { color: ... }` rule beats `.mosaic-button--primary`.

**Why "mechanisms-observed" rule requires live capture before fix:**
The specificity battle cannot be resolved from CSS source alone without knowing
the EXACT theme rule and its selector weight. Fixing blindly (e.g. adding `!important`
or wrapping in `.mosaic-canvas-scope`) could mask a different defect or create
specificity debt. DevTools cascade inspector with the live Drupal frontend page
is the minimum required to identify the winning selector.

**Build shape required:**
1. CAPTURE: DevTools cascade on live anon page → quote winning rule + full selector + specificity score
2. FIX: Specificity patch targeting ONLY the proven winning rule (no `!important` if avoidable)
3. TEST: WCAG AA verification — `contrast(foreground, background) >= 4.5:1`
   (Playwright `toHaveCSS` + computed colour assertion or axe-core rule)

**Open rulings needed:**
- R-CONTRAST-A: Is `!important` acceptable on the colour fix, or must we match specificity exactly?
- R-CONTRAST-B: Scope the fix to `.mosaic-canvas-scope .mosaic-button--primary` (admin-canvas only)
  or apply to all `mosaic_frontend_editor` outputs too?

**Proposed sequencing:** CONTRAST requires a live Drupal session + DevTools — pure desk read
cannot close this item. Recommend as the LAST Wave 1 item after UNSAVED-GUARD is shipped,
since UNSAVED-GUARD is pure code and can be desk-read + built without env access.

---

### EDIT-19 Triage Input (drag placeholder/border overlap)

**EDIT-19 finding (AI/TODO.md L5792-5807):**
```
Placeholder/field-border misalignment during drag-reorder. During drag-reorder,
the placeholder text (showing the drop zone) renders half-overlapping the
component's outer border while canvas components shift to make space for the
incoming component. Reproduced on: admin builder AND FE dialog (both surfaces).
Severity: Cosmetic-during-drag only. Artifact disappears on drop.
Wave assignment: pending reviewer triage. Cosmetic-during-drag class = low urgency.
```

**Mechanism (OBSERVED-IN-CODE):**

Puck's `[data-dnd-placeholder]` rule — `@puckeditor/core/dist/index.css:640-647`:
```css
[data-dnd-placeholder] * {
  opacity: 0 !important;
}
[data-dnd-placeholder] {
  background: var(--puck-color-azure-09) !important;
  border: none !important;
  color: #00000000 !important;
  opacity: 0.3 !important;
  outline: none !important;
  transition: none !important;
}
```

The placeholder element (`[data-dnd-placeholder]`) suppresses its OWN border
(`border: none !important`) and children opacity. However, it is rendered as a
SIBLING to other `[data-puck-component]` elements in the dropzone. When the
component list shifts to create a gap for the dragged item, the rendered
components' own borders (from Puck's component-wrapper styling or Mosaic's
canvas CSS) remain visible adjacent to the placeholder stripe.

**Candidate mechanism A — OBSERVED-IN-CODE (most likely):**
The overlap/clip is a box model artefact: the placeholder element occupies the
height of the dragged item (dnd-kit `useDraggable` + `DragOverlay`), but the
adjacent components' borders render outside their padding box, creating a 1px
visual bleed into the placeholder zone. This is inherent to how dnd-kit's
placeholder mechanism interacts with bordered block elements.

**Candidate mechanism B — NEEDS-LIVE-PROBE:**
Whether Mosaic's canvas CSS (`css/mosaic-canvas-reset.css` or
`css/builder.css`) adds borders to `[data-puck-component]` wrappers that
compound the dnd-kit overlap. Grep shows `[data-dnd-placeholder]` rules in
`index.css:1498-1511` (a second rule set at line 1498) — whether these conflict
or compound requires measuring the stacking in DevTools.

**Probe spec (if live evidence needed):**
```
1. Open admin builder, add mosaic_heading component
2. Begin drag-reorder
3. DevTools: inspect the [data-dnd-placeholder] element during drag
4. Measure: placeholder bounding rect vs adjacent [data-puck-component] border rect
5. Record: which CSS rule is responsible for the visible border (computed styles)
```

**Wave assignment (reviewer recommendation):**
EDIT-19 is cosmetic-during-drag with zero data-loss and zero post-drop impact.
It is a shared Puck/dnd-kit behaviour inherited by both surfaces. Recommend:
- **NOT** in Wave 1 (Wave 1 = critical fixes only)
- Wave 5 (hygiene/brand package, MASTER-AUDIT.md 5.2 grouping), or bundle with
  any future Puck version upgrade that may resolve it upstream.
- No CP needed until wave assignment confirmed by Arun.

---

### CP-EDIT20 Wave 1.3 Status Summary

| Item | CP label | Status |
|---|---|---|
| Wave 1.1 | CP-EDIT13 | COMPLETE (shipped 22af19f) |
| Wave 1.2 | CP-FE-PARITY + CANVAS-SCOPE + PARITY-ORACLE | COMPLETE (Wave 1.2 CLOSED) |
| Wave 1.3 — unplanned | CP-EDIT20 | COMPLETE (FIXED-PENDING-SHIP) |
| Wave 1.3 — roadmap 1.3 | CP-UNSAVED-GUARD | OPEN (rulings needed, see above) |
| Wave 1.3 — roadmap 1.4 | CP-029-CONTRAST | OPEN (live probe required) |
| EDIT-19 | (no CP yet) | OPEN — wave TBD, cosmetic-during-drag |

**Proposed Wave 1 completion sequence:**
1. Arun ships CP-EDIT20 (git add + commit + push) → closes Wave 1.3 unplanned item
2. Arun rules on R-UNSAVED-A/B/C → CP-UNSAVED-GUARD build begins
3. Live session: DevTools cascade on contrast defect → closes R-CONTRAST-A/B → CP-029-CONTRAST build
4. EDIT-19: defer to Wave 5 bundle unless Arun upgrades its priority

---

## OPEN QUESTIONS (requiring Arun rulings before work proceeds)

| ID | Question | Blocks |
|---|---|---|
| R-UNSAVED-A | Guard on BOTH surfaces simultaneously or FE-only first? | CP-UNSAVED-GUARD build start |
| R-UNSAVED-B | UX: browser native `confirm()` or custom `<dialog>` for the prompt? | CP-UNSAVED-GUARD UI shape |
| R-UNSAVED-C | Does Escape on FE dialog trigger the guard or always close? | CP-UNSAVED-GUARD FE spec |
| R-CONTRAST-A | Is `!important` acceptable on the colour fix? | CP-029-CONTRAST fix approach |
| R-CONTRAST-B | Scope: `.mosaic-canvas-scope` only or all Mosaic output contexts? | CP-029-CONTRAST fix scope |
| R-EDIT19-WAVE | Confirm Wave 5 deferral for EDIT-19 cosmetic drag overlap? | EDIT-19 CP assignment |
