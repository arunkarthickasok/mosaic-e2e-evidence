# CP-ADOPT-6R PASS 2 — WC#85 (fixed) · WC#86 (UNPROVEN) · WC#87 (deferred)

## Oracles (BEFORE == AFTER, verbatim)
REGION 14e6cb9c17dc61b90a86dd97d8957ae462d789ff854d3523ae581010a43e0dec 3954 (both)
STYLE  b7756795ff2234b5793c3533f48c3a70b34c37989b946756f20b78aa9aaca982 4354 10 (both)
(renderFallback only fires for MISSING components; node/780 renders normally → unchanged.)

## WC#85 — fallback slot order = DECLARED order (FIXED)
MECHANISM: `MosaicRenderer::renderFallback` iterated `array_merge(keys(slots), keys(slotsBinding))`
(static-then-bound union), an arbitrary order. FIX (MosaicRenderer.php): pull the DECLARED order from
`componentManager->getDefinition($type, FALSE)['slots']` (available for a governance-OFF library — the
common case), render declared-order slots first (static children or bound rows per slot), unknown-slot
leftovers last. Kernel `FallbackRenderTest::testFallbackRendersSlotsInDeclaredOrder`: teaser STORED
image-first, DECLARED content-first → the fallback renders content before image.
MARKUP EXCERPT (live render, Olivero OFF):
    mosaic-fallback__children"><h4 …data-mosaic-instance="c"…>CONTENT-CHILD…  (content slot first)
…the image child ("i") follows — declared order, not the image-first storage order.

## WC#86 — "+ Add" real mouse click still dead — UNPROVEN
I attempted the REAL-conditions headed proof (Playwright, trusted mouse events, `elementsFromPoint`,
CDP) against the live builder via a `drush uli` login:
- The builder LOADS at node/780/edit — **3 owned slot zones** present.
- But **0 picker buttons** and **0 adopted boxes**: node/780 has **no adopted component** (teaser), and
  its owned zones have **no allowed list**, so — per the current picker gate — **no picker renders**.
  (See `node780-builder-no-picker.png`.)
- With no picker on any available node, there was **nothing to real-click**, and placing an adopted
  teaser via drag-automation is not reliably achievable this session.

Therefore WC#86 is **UNPROVEN** and **NO blind fix was applied** (the charter forbids it; the WC#84
stopPropagation fix already failed a real click, so a second unproven guess would repeat the mistake).

STRONGEST CODE-LEVEL HYPOTHESIS (to confirm headed next): Puck ships a **`_DropZone-hitbox`** class
(`node_modules/@puckeditor/core/dist/index.css`) — an interactive drop-target overlay. If that hitbox
sits ABOVE the picker button, `elementsFromPoint` at the "+" returns the hitbox and the click never
reaches the button — which is exactly why `stopPropagation` on the button (WC#84) did nothing (the
button never receives the event). A second candidate is the adopted-preview memoised tree
(`MosaicAdoptedPreview.tsx:60-64`, keyed on `[html, …]`) re-mounting the button when an SSR lands
between pointerdown and click. Confirming requires the headed `elementsFromPoint` + `getEventListeners`
capture — which needs a picker present.

## WC#87 — picker list — DEFERRED (and the prerequisite to prove WC#86)
The headed probe surfaced the key link: node/780's owned free-content zones show **no picker** because
they have **no allowed list**. WC#87 (no-allowed-list → offer Plain content + every authorable component
grouped by library) is exactly what makes the picker APPEAR on those zones — so WC#87 is the
**prerequisite** to reproduce + headed-prove WC#86. It is deferred here (context-bounded), recommended
as the immediate next step, after which the headed WC#86 elementsFromPoint proof becomes runnable.

## Gates
Kernel+Unit (WC#85) full run; Vitest unchanged (no JS changed this pass); phpcs clean; phpstan
`renderFallback` 0 new. Oracles identical. dist UNCHANGED (WC#85 is PHP-only) — no version bump.
