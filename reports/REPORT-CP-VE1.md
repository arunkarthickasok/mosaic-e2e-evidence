# REPORT — CP-VIEWS-EMBED-1 (foundation) — V0 GATE LANDED (checkpoint)

**Status:** V0 (the #attached-drop blocker — "gate for everything after") DONE + PROVEN.
V1–V7 NOT started (scoped for continuation). Honest checkpoint per the ratified oversized-wave
pattern — the gate is the hardest/highest-risk piece and is landed cleanly; the rest is
genuinely multi-session and is not rushed. Uncommitted on ship #35 (108fa41). Read-only mosaic git.

## Pre-flight
HEAD 108fa41 == origin. Design read: P-VIEWS-EMBED-DESIGN.md §7 CP-1 scope + rulings R-V1..V6.
CP-VE1 ledgered OPEN.

## V0 — WITNESS (with file:line)
- `MosaicRenderer::renderInternal` / `renderResponsiveInternal` build
  `['#markup' => Markup::create(...)]` + `$cacheable->applyTo($build)` where `$cacheable` was a
  **CacheableMetadata** → `#cache` only, **no `#attached`**.
- `renderNode` renders each component via `$this->twig->render()` to a STRING; the per-component
  render cache stores `['html' => ..., 'meta' => $componentMeta]` with `$componentMeta` a
  CacheableMetadata; the cache-HIT path returned the stored HTML and merged only cacheability.
- **Warm-hit crux:** a HIT never re-runs twig, so a component's `attach_library` never fires and
  its libraries are dropped entirely — a View embed's views/ajax/exposed-form/pager libraries
  would vanish on any warm page.
- Paths: render→renderInternal, renderResponsive→renderResponsiveInternal, renderLazy/
  renderLazyResponsive call the same internals (BigPipe). Canvas SSR is placeholder-only for
  views (R-V1); canvas library delivery = CP-3.

## V0 — FIX (src/Service/MosaicRenderer.php)
BubbleableMetadata end to end (`$cacheable`/`$entityMeta`/`$componentMeta`); component twig
rendered inside a controlled `executeInRenderContext`, bubbled metadata popped + merged
(cacheability + `addAttachments`); stored in the render cache; **replayed on cache HIT**;
`BubbleableMetadata::applyTo` sets `#attached` + `#cache` on the build.

## V0 — PROOF (Kernel, RED→GREEN)
`MosaicRendererAttachedTest` 3/3 (the mosaic_carousel twig `attach_library('mosaic/renderer')`
stands in for a View's dynamic #attached):
- `testAttachedBubblesOnColdRender` — `#attached.library` contains `mosaic/renderer` (cold).
- `testAttachedReplayedOnWarmCacheHit` — same after a cache HIT (the crux).
- `testCacheTagsStillBubble` — `entity_test:1` tag still present (no regression).
Pre-fix, the cold + warm cells fail (CacheableMetadata carries no #attached).

## V0 — blast radius handled
8 renderer Unit tests configured their `RendererInterface` mock to invoke the
`executeInRenderContext` callback; 1 source-grep oracle (Sprint76) updated to BubbleableMetadata.

## Gates (this checkpoint)
- PHPCS **0 errors** on all touched files (project gate = errors-only, per scripts/qa —
  `grep 'A TOTAL OF \K\d+ ERROR'`; remaining warnings are the pre-existing `// ── divider`
  convention in the two Unit test files, not V0).
- Full Unit+Kernel **2887/0** (7625 assertions, 1 pre-existing warning).
- No JS changed → no dist rebuild; no e2e (V0 is Kernel-proven).

## Remaining (V1–V7) — see SHIP-36.md for the scoped continuation
mosaic_views witness; views_display + views_arguments field types + arguments introspection API;
mosaic_view placeholder component; Views-executable page render (View-default args); validator +
degradation; the derived test matrix; dist (builder) + album + gates. NEXT SESSION.
