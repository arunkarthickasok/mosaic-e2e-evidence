# Overnight Package W2B — CP-SPLASH-POLISH + F-047 Hunt

**Date:** 2026-07-28  
**Operator:** Claude Sonnet 4.6  
**Iron laws:** Read-only git · No add/commit/push · Stop-when-blocked no exceptions · Tee ALL runs

---

## PART 0 — HYGIENE

### P0: Delete js/t4-outline-probe.mjs

Confirmed deleted. `ls js/t4-outline-probe.mjs` → `No such file or directory`.

---

## PART A — CP-SPLASH-POLISH

### A1. DERIVATION (W20) — dimension matrix

| Dimension | Values |
|---|---|
| Surface | FE dialog (primary test target); admin builder (regression, same CSS loaded) |
| Element | `.mosaic-splash-header` (centering); `.mosaic-splash-card__badge` (separation); `.mosaic-dialog-btn--primary` (background) |
| Geometry | CENTERED: `getComputedStyle.textAlign === 'center'`; BADGE: `badgeBox.y > labelBox.y + labelBox.height`; STYLED: `backgroundColor === 'rgb(26, 26, 46)'` |
| State | Empty library + fixture (S13/S14); populated layout (S15) |
| Regression | W19 13/13; W18 sidebar scroll; W17 esc-guard; W16 access/tokens |

**CSS file placement decision:** New `css/mosaic-splash.css` added to BOTH `builder` AND
`frontend_editor` libraries. Precedent: `mosaic-canvas-reset.css` and
`mosaic-canvas-compat.css` are already in both libraries for the same shared-component
reason. No TSX changes needed — class names already correct in existing markup.
`mosaic-design-system.css` is NOT in `frontend_editor`, so `mosaic-splash.css` uses
direct values with `system-ui` fallbacks (no `--mosaic-*` token references that would
silently fail on the FE surface).

### A2. RED run — w20-red.log

```
3 failed:
  W20-S13: textAlign = 'start' (not 'center')  ← WALK-CATCH #13 confirmed
  W20-S14: badgeBox.y=251, expected > 263       ← badge inline with label, WALK-CATCH #14 confirmed
  W20-S15: backgroundColor='rgb(239,239,239)'  ← browser default, not Mosaic navy
EXIT:0 (spec ran; 3 functional failures)
```

Failures are for the right reasons: zero CSS → browser defaults in all three cases.

### A3. BUILD

**New file:** `css/mosaic-splash.css` (~250 lines)

Key rules for oracle alignment:
```css
/* WALK-CATCH #13 fix — asserted by W20-S13 */
.mosaic-splash-header {
  text-align: center;
  align-items: center;
}

/* WALK-CATCH #14 fix — asserted by W20-S14 */
.mosaic-splash-card__badge {
  display: block;      /* was implicit inline */
  margin: 6px 12px 10px;
  border-radius: 20px;
}

/* W20-S15 oracle anchor */
.mosaic-dialog-btn--primary {
  background: #1a1a2e;  /* = rgb(26, 26, 46) */
}
```

**Library update:** `mosaic.libraries.yml` — added `css/mosaic-splash.css: {}` under
`theme:` in BOTH `frontend_editor` and `builder` libraries.

**No TSX changes** → dist rebuild NOT required.

`ddev drush cr` ran after libraries.yml change.

### A4. GREEN run — w20-green.log

```
5 passed (12.3s) — W20-S13 ✓  W20-S14 ✓  W20-S15 ✓
EXIT:0
```

**Regression runs:**

| File | Result |
|---|---|
| `w20-regress-w19.log` | W19: 13/13 ✓ |
| `w20-regress-fe.log` | FE dialog geometry+parity+sidebar+frontend-editor: 61/63 ✓, 1 flaky (W12-S03 admin builder timeout — pre-existing, retry passed), 1 skipped |
| `w20-regress-misc.log` | Esc-guard+access+tokens: 19/21 ✓, 2 skipped (UAT-51/52 — pre-existing skips) |
| `w20-vitest.log` | 434/435 ✓, 1 pre-existing failure (MosaicPuckAdapter boolean→checkbox, FINDING-024) |

No regressions attributable to CP-SPLASH-POLISH.

### A5. LEDGER

**CP-SPLASH-POLISH status:** FIXED-PENDING-SHIP

**Files changed:**
- `css/mosaic-splash.css` (NEW — 250 lines, splash + dialog styles)
- `mosaic.libraries.yml` (UPDATED — css/mosaic-splash.css in builder + frontend_editor libraries)
- `js/e2e/w20-splash-polish.spec.ts` (NEW — W20-S13/S14/S15 specs; gitignored spec)

**WALK-CATCH resolutions:**
- #13 alignment: FIXED by `.mosaic-splash-header { text-align: center }` — asserted W20-S13
- #14 badge: FIXED by `.mosaic-splash-card__badge { display: block; margin: 6px 12px 10px; }` — asserted W20-S14

**Ship list (CP-FE-TEMPLATES + CP-SPLASH-POLISH combined candidate):**
```
css/mosaic-splash.css           (NEW)
mosaic.libraries.yml            (UPDATED — splash CSS in both libraries)
```
(The fe-templates.spec.ts and w20-splash-polish.spec.ts are gitignored — not shipped.)

**Arun decides:** whether CP-FE-TEMPLATES and CP-SPLASH-POLISH ship together or as separate commits.

---

## PART B — FINDING-047 REPRODUCTION HUNT

### B1. Puck Nav DOM discovery

The Puck nav in FE dialog is `_PuckLayout-nav_1dd16_192`: a 68×765px vertical icon-bar
at x=0, y=135 (left of the 274px sidebar panel). It is NOT inside the `Sidebar--left`
element — it is a sibling in the PuckLayout grid.

Nav items:
| Item | Class | Active? |
|---|---|---|
| Blocks | `_NavItem_1tvxq_38 _NavItem--active_1tvxq_94` | Yes (component palette) |
| Outline | `_NavItem_1tvxq_38` | No (component tree) |
| Fields | `_NavItem_1tvxq_38 _NavItem--mobileOnly_1tvxq_121` | Mobile only |

Each item is: `<li class="_NavItem_1tvxq_38"><div class="_NavItem-link_1tvxq_38">...</div></li>`

**NOT a `<button>`** — this is why T4's `button:has-text("Outline")` returned nothing.
The Outline link is a `<div>` clickable item at x=0, y=249, w=67, h=66.

### B2. Outline tab click — reproduced

Probe: `b2-outline-click.mjs` (scratchpad, not committed; js/ copy deleted after run)

```
MEASURE-1 (Blocks active, no selection):
  canvas: x=0 y=48 w=1280 h=852  sl: h=765  sr: h=765  pc: h=765
  [No overflow anywhere — correct]

OUTLINE CLICK (div._NavItem-link_1tvxq_38 at y=249)

MEASURE-2 (Outline active, no selection):
  canvas: x=0 y=48 w=1280 h=354  ← COLLAPSED from 852 (498px cut off)
  nav:    h=267 (was 765)
  sl:     h=267 (was 765)
  sr:     h=267 (was 765)
  pc:     h=267 (was 765)
  [Content in visible PuckPluginTab: "HeadingTextColumnsButtonButton" — Outline tree of node 826]

MEASURE-3 (Outline active + component selected):
  canvas: h=852  ← RESTORED to correct height
  sr.scrollH: 2090 vs clientH: 765  [properties panel — scrollable, correct]

MEASURE-4 (Outline active, canvas whitespace click, deselected):
  canvas: h=354  ← COLLAPSED again
  [Confirming toggle: select=expand, deselect=collapse]
```

### B3. Mechanism analysis

**Height chain when Outline is active (no selection):**
1. `.mosaic-fe-dialog__inner` has `height: 100%` → 900px
2. `.mosaic-fe-dialog__toolbar` has `flex-shrink: 0` → 48px
3. `.mosaic-fe-dialog__canvas` has `flex: 1; overflow: hidden` → should be 852px
4. `.mosaic-fe-dialog__canvas > div` has `height: 100% !important` → 100% of parent
5. `> div > _PuckLayout_` has `height: 100% !important` → 100% of parent

BUT: the Outline panel (`_PuckPluginTab--visible`) renders its content with `height: auto`.
The Outline tree for node 826 (Heading, Text, Columns, Button×2) is ~267px tall.
This auto height propagates UP through the Puck layout, shrinking the PuckLayout.
Because `height: 100% !important` resolves to 100% of its parent's COMPUTED height,
and Puck's intermediate elements between the `_PuckLayout_` and the canvas `> div` may
allow shrink-to-fit, the computed height collapses.

**Why component selection restores height:**
When a component is selected, Puck adds `_PuckLayout--rightSideBarVisible_*` to the
layout, triggering different internal CSS that enforces a full-height grid. This
layout modifier class is the fix mechanism Puck uses internally — we need to apply
the equivalent CSS fix externally for the Outline-only state.

**Fix direction (NOT implemented — read-only B):**
```css
/* In css/mosaic-frontend-editor.css — CP-FE-DIALOG-OUTLINE-FIX */
.mosaic-fe-dialog__canvas [class*="PuckPluginTab--visible"] {
  height: 100%;
  min-height: 0;
}
```
This forces the visible plugin panel to take 100% of the container, preventing shrink-to-fit.

**FINDING-047 verdict:** REPRODUCED. Not caused by CP-FE-TEMPLATES (additive diff, no CSS).
Pre-existing Puck 0.21.x + FE dialog height-chain interaction. Severity: MEDIUM.
Recorded in `AI/FINDINGS.md`. T4 'PRE-EXISTING' claim corrected in `AI/TODO.md`.

---

## PART C — LEDGER SYNC

### C1. FINDING-046 entry
Added to `AI/FINDINGS.md` after FINDING-045: renderer JS for anon (WALK-CATCH #12).
Severity: LOW. Wave 3 candidate.

### C2. FINDING-047 entry
Added to `AI/FINDINGS.md` after FINDING-046: Outline tab collapses canvas (WALK-CATCH #15).
Severity: MEDIUM. CP-FE-DIALOG-OUTLINE-FIX required. Status: REPRODUCED, OPEN.

### C3. T4 'PRE-EXISTING' correction
`AI/TODO.md` T4 verdict block updated: prior verdict ('PRE-EXISTING, based on Outline tab not
found by button selector') corrected to 'REPRODUCED — not CP-caused, but real FE dialog bug'.
Fix direction quoted.

### C4. Walk-catch tally (Arun, 15 total)
All 15 walk-catches are Arun-identified from eye-test review sessions:
- #12: renderer JS for anon (FINDING-046, LOW)
- #13: splash no CSS / alignment (FINDING in TODO, FIXED by CP-SPLASH-POLISH W20-S13)
- #14: badge inline (FINDING in TODO, FIXED by CP-SPLASH-POLISH W20-S14)
- #15: Outline tab collapse (FINDING-047, MEDIUM, OPEN)

### C5. F-037 elevation note
F-037 (template browser missing search/filter): elevated by Arun to design CP scope
(search/filter/modern picker). Ratification pending. Queued under CP-SPLASH-POLISH.
Not implemented in this session.

---

## SUMMARY

| Item | Status |
|---|---|
| P0: Delete t4-outline-probe.mjs | ✅ DONE |
| A1: W20 dimension derivation | ✅ DONE |
| A2: RED run (3/3 fail, correct reasons) | ✅ w20-red.log |
| A3: css/mosaic-splash.css + libraries.yml | ✅ DONE, drush cr |
| A4: GREEN run 5/5; regressions clean | ✅ w20-green.log + regress logs |
| A5: CP-SPLASH-POLISH FIXED-PENDING-SHIP | ✅ Ledger updated |
| B1: Outline nav DOM discovered (div, not button) | ✅ DONE |
| B2: Outline click reproduced canvas collapse | ✅ DONE |
| B3: FINDING-047 REPRODUCED — OPEN | ✅ FINDINGS.md + TODO.md updated |
| C: FINDINGS.md F-046 + F-047 + T4 correction | ✅ DONE |

**Ship readiness:**
- CP-FE-TEMPLATES: FIXED-PENDING-SHIP (W19 13/13)
- CP-SPLASH-POLISH: FIXED-PENDING-SHIP (W20 5/5)
- FINDING-047 (Outline collapse): OPEN, separate CP needed, Arun ratification required
- Vitest 1 pre-existing failure (boolean→checkbox, FINDING-024, unrelated)
