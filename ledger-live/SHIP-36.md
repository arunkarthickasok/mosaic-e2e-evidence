# SHIP #36 — CP-VIEWS-EMBED-1 (foundation) — IN PROGRESS

Uncommitted change set on top of ship #35 (108fa41). Mosaic git read-only here.
REPORT-TO-REPO: reports/REPORT-CP-VE1.md. **This checkpoint lands V0 (the gate) only.**

## V0 — the #attached-drop blocker: DONE + PROVEN (gate for everything after)

**Witness (the drop):** MosaicRenderer rendered every component to a STRING via
`$this->twig->render()` and applied only `CacheableMetadata` (`$cacheable->applyTo($build)`),
which carries `#cache` but NOT `#attached`. The per-component render cache stored a
CacheableMetadata; a warm cache HIT returned the stored HTML WITHOUT re-running twig — so a
component's libraries (a View embed's views/ajax + exposed-form + pager) were dropped, and
dropped ENTIRELY on warm hits. Confirmed on the page paths (render → renderInternal;
renderResponsive → renderResponsiveInternal; renderLazy/renderLazyResponsive call the same
internals). Canvas SSR (renderSingleComponent) is placeholder-only for views (R-V1) — no
dynamic libraries there in CP-1; canvas library DELIVERY rides with CP-3 live preview.

**Fix (src/Service/MosaicRenderer.php):**
- `$cacheable` / `$entityMeta` / `$componentMeta` are now `BubbleableMetadata` (extends
  CacheableMetadata + attachments). `BubbleableMetadata::applyTo` sets BOTH `#cache` AND
  `#attached` on the build.
- Each component's twig render runs inside a controlled `executeInRenderContext`; the bubbled
  BubbleableMetadata (attach_library + printed render arrays like `$view->buildRenderable()`)
  is popped and merged into `$componentMeta` — cacheability + attachments.
- The per-component render cache stores that BubbleableMetadata; the **cache-HIT path replays
  it** (`addCacheableDependency` + `addAttachments`) — the warm-hit crux.
- Component→field bubble carries attachments too.

**Proof (tests/src/Kernel/Service/MosaicRendererAttachedTest.php, 3/3, RED→GREEN):**
- COLD: a rendered component's library is in `$build['#attached']['library']`.
- WARM (crux): a cache HIT still carries `#attached` (no twig re-run).
- No regression: the host entity cache tag still bubbles.
(Pre-fix the cold+warm cells FAIL — CacheableMetadata carries no #attached; the tag cell passes.)

**Regressions fixed (the refactor's blast radius):** 8 renderer Unit tests
(MosaicRendererTest ×7 + MosaicRendererCacheTest ×1) whose `RendererInterface` mock did not
invoke the `executeInRenderContext` callback — configured to run it. 1 source-grep oracle
(Sprint76SmokeTest) updated CacheableMetadata → BubbleableMetadata.

**Gates:** PHPCS **0 errors** on all touched files (project gate is errors-only; remaining
warnings are pre-existing `// ── divider` convention debt in the two Unit test files, not V0).
Full Unit+Kernel **2887/0** (7625 assertions, 1 pre-existing warning). No JS changed → no dist
rebuild; no e2e (V0 is Kernel-proven).

## V1–V7 — NOT STARTED (scoped for continuation)
V0 was the explicit gate ("THE BLOCKER FIRST"). The remaining foundation is genuinely
multi-session and is deliberately NOT rushed:
- **V1** witness `mosaic_views` (data-source binder) structure.
- **V2** `views_display` + `views_arguments` MosaicFieldType plugins + `GET /api/mosaic/views/
  {view}/{display}/arguments` introspection endpoint (CP-1: "View default" source only).
- **V3** `mosaic_view` component — placeholder card both surfaces (F-087), red "view no longer
  exists" state; NO live canvas render (R-V1).
- **V4** page render via Views executable (design §3.3): access → setDisplay → setArguments([])
  → preExecute/execute → hide-when-empty (default OFF, R-V3) → buildRenderable, bubbled through
  the V0-fixed renderer.
- **V5** save-time validator (typed JSON) + F-058 degradation (deleted/disabled → [] + 1
  watchdog + red card).
- **V6** derived RED→GREEN matrix (design §6 restricted to CP-1).
- **V7** gates + dist (builder — new field types) + album cp-ve1 + this ship record.

## Files (this checkpoint)
Modified: `src/Service/MosaicRenderer.php`; `tests/src/Unit/Service/MosaicRendererTest.php`;
`tests/src/Unit/Service/MosaicRendererCacheTest.php`; `tests/src/Unit/Smoke/Sprint76SmokeTest.php`.
New: `tests/src/Kernel/Service/MosaicRendererAttachedTest.php`.

## Add commands (mosaic repo, Arun runs — ONLY if committing the V0 gate now)
```
git add src/Service/MosaicRenderer.php
git add tests/src/Kernel/Service/MosaicRendererAttachedTest.php
git add tests/src/Unit/Service/MosaicRendererTest.php tests/src/Unit/Service/MosaicRendererCacheTest.php
git add tests/src/Unit/Smoke/Sprint76SmokeTest.php
```
