# REPORT — W6-W7 (WALK-CATCHES #55–#56)

**Charter:** W6 (#56 FIX) + W7 (#55 PROBE-ONLY, zero code). Ship #34 FROZEN.
**Status:** COMPLETE — #56 does NOT reproduce (pipeline verified intact end-to-end;
regression guard added); #55 root-caused with live evidence + options analysis (no
code, per charter). Re-walk HOLD reconfirmed (#50–#54 hold).
**Tally:** 56.
**Only code change this charter:** `tests/src/Kernel/Component/MosaicCarouselRenderTest.php`
(+2 regression-guard cells). No production code changed (W6 non-repro; W7 probe-only).

---

## W6 — #56 per-slide "Image style" does not apply → **DID NOT REPRODUCE**

Charter asked: quote the full path of the chosen style value (panel → props →
resolveFieldTypeMedia/resolveMediaSentinel → render) and find which hop drops it.
Every hop was witnessed intact; the anon page renders the correct per-slide
derivative. The reported "renders ORIGINAL" symptom could not be reproduced.

### Hop-by-hop witness (with file:line)
1. **Panel field → sentinel.** `js/src/builder/fields/MosaicMediaField.tsx:93`
   `handleImageStyleChange` → `onChange({_type, uuid, label, ...(style ? {image_style: style} : {})})`.
   Line 76 (media-selected handler) re-applies `selectedImageStyle` on (re)pick.
   The image sub-field has no `default_image_style` override
   (`mosaic_carousel.mosaic.yml:33-35`), so per-slide is the only source.
2. **Live Puck state.** After setting the style on an existing-media slide the live
   layout JSON carries `slides[0].image.image_style` (witnessed:
   `{_type:drupal_media, uuid, label, image_style:"thumbnail"}`).
3. **Save → DB.** After saving node 942 with all three slides set, the stored field
   JSON carries `slide0/1/2.image_style = large` (read back from the DB).
4. **field_types hop.** `MosaicRenderer::resolveFieldTypeMedia` passes the FULL
   sentinel (incl. `image_style`) to `resolveMediaSentinel` for each repeatable
   media sub-field.
5. **Resolver applies it.** `MosaicPropResolver.php:181-186`:
   `$imageStyleId = $sentinel['image_style']; … $style->buildUrl($uri)` → the
   styled derivative URL (falls back to `createFileUrl()` only when the style is
   absent/empty).
6. **Media-library bridge.** `modules/mosaic_media/js/media-library-bridge.js:70`
   forwards `image_style` to the server; the `mosaic:media-selected` handler
   (`:30-34`) returns only `{fieldKey,uuid,label}` and the field re-applies the
   style from its closure — no drop.

### End-to-end proofs
- **Direct render** (drush, page path) of a slide sentinel with
  `image_style='thumbnail'` → `IMG_SRC=…/styles/thumbnail/…`, `HAS_STYLE_PATH=YES`.
- **Full authoring loop**: set all three slides → Save → anon `GET /node/942` →
  **3× `/styles/large/`, 0 original**.
- **Re-pick via the real Media Library dialog** with a style already set →
  the new sentinel keeps `image_style:"wide"` (preserved across media replacement).
- **Differing styles** [thumbnail, —original—, large] across three slides render
  independently with no cross-contamination (Kernel guard below).

### RED-cell premise did not hold → regression GUARD instead (GREEN)
Per the never-fabricate / stop-when-blocked laws, no speculative fix was shipped
for a non-reproducing defect. The discriminating test was added and is GREEN,
locking the behavior so it cannot silently regress:
- `testPerSlideImageStyleApplied` — 3 slides [thumbnail, '', large] → asserts
  `/styles/thumbnail/` + `/styles/large/` present and slide 1 renders the ORIGINAL
  (regex: an `<img src>` for the file WITHOUT `/styles/`).
- `testCanvasPreviewAppliesPerSlideImageStyle` — the canvas SSR path also emits the
  per-slide derivative.
- Full file GREEN: `MosaicCarouselRenderTest` **10/10, 163 assertions**; PHPCS 0/0.

### Leading hypotheses for Arun's observation (needs his exact node/steps)
- **Stale render/page cache during the walk** — most likely: the node save
  invalidates `node:NNN`, but if the walk viewed a pre-change cached page (or the
  style derivative had not yet generated), the original would show. A hard reload /
  `drush cr` would clear it.
- **"Style before media" UX gap** (narrow): on a slide with no media yet (a freshly
  added or migrated `image:''` slide), the style `<select>` is a controlled input
  whose change is a no-op (`handleImageStyleChange` guards on `hasSelection`), so it
  reverts to "— original —". You cannot set a style before a media pick — so this
  would show as the style NOT sticking in the panel, not as "set but renders
  original". Flagged as a possible UX improvement, not shipped.

**Recommendation (Arun/reviewer rule):** re-verify with cache cleared; if it
recurs, capture the node's stored field JSON — the single diagnostic that
localizes JS-persist vs render. The guard cells lock the render contract meanwhile.

---

## W7 — #55 FE dialog canvas runs the LIVE carousel → **ROOT-CAUSED (probe only)**

### P1 — library attachment per host (file:line)
- **Node view page:** `MosaicLayoutFormatter.php:150` attaches `mosaic/renderer`
  (plus each component twig `attach_library('mosaic/renderer')`). renderer.js
  (`type: module`) registers the custom elements → visitor components are LIVE.
- **Admin builder page (/node/N/edit):** `MosaicLayoutWidget.php:152` attaches
  `mosaic/builder` ONLY. `mosaic/builder` does **not** depend on `mosaic/renderer`.
- **FE dialog:** opens on the node-VIEW page, so `mosaic/renderer` (from the
  formatter, for the visitor content behind the dialog) is ALREADY on the page;
  `MosaicHooks.php:383` adds `mosaic/frontend_editor` (deps: `mosaic/fe_chrome`,
  not renderer). Canvas SSR HTML (`renderSingleComponent`) stamps
  `data-mosaic-preview="canvas"` on the host (`MosaicRenderer.php:449`).

### P2 — DSD upgrade, like-for-like (node 945: auto_advance=true, interval=1000)
| host | `customElements.get` | upgraded (live Lit) | `data-mosaic-preview` | auto-advance running |
|---|---|---|---|---|
| node-view | true | **true** | null | **yes** (visitor — correct) |
| admin canvas | **false** | **false** | canvas | no (inert static DSD) |
| FE dialog canvas | true | **true** | canvas | **yes** (translateX −100%→−200%) |

**Root cause:** the admin builder page never loads `mosaic/renderer`, so canvas
custom elements are never upgraded — they stay inert static DSD, driven only by the
panel sync's DSD-fallback transforms (`installCarouselPanelSync` → `setActiveSlide`
sets `.car-track` transform directly). That is why "admin works." The FE dialog,
by contrast, lives on the node-view page where `mosaic/renderer` is already loaded
for the visitor content, so the SAME canvas SSR markup UPGRADES to live Lit: the
carousel's `connectedCallback` starts its `setInterval` auto-advance timer
(`mosaic-carousel.ts:152-164`) and the component behaves as a visitor component
inside the editor.

### P3 — interaction inventory inside the (upgraded) FE canvas
- **carousel** — `connectedCallback` starts the auto-advance `setInterval`; **no
  `data-mosaic-preview` handling at all**. Slides move under the author and FIGHT
  the panel sync (author expands a slide row → sync sets `active`; the timer then
  advances away from it). Highest-impact.
- **live_search** — `mosaic-live-search.ts:95,102`: debounced `setTimeout` →
  `fetch(endpoint+query)` on input; **no edit-mode handling**. Typing in the canvas
  fires live network requests to the search endpoint from inside the editor.
- **tabs** — the ONLY component with an edit-mode contract:
  `mosaic-tabs.ts:57` `:host([data-mosaic-preview]) button[role="tab"]{pointer-events:none}`.
  Still upgrades (its `willUpdate` active-sync runs), but tab buttons are inert;
  panel sync drives the active tab. Lowest-impact.
- **webform** — no such component exists (only carousel/live_search/tabs). The risk
  generalizes to any future interactive level-2 component that upgrades in the FE
  canvas.

### P4 — options analysis (design only; NO recommendation ships as code)
- **(A) Edit-mode inert contract for canvas instances.** `renderSingleComponent`
  already stamps `data-mosaic-preview="canvas"`; extend EVERY renderer component to
  fully inert when present (carousel: skip/stop the auto-advance timer +
  pointer-events:none on arrows/dots; live_search: disable input/fetch; tabs
  already inerts buttons). Blast radius: renderer components only (rebuild
  `dist/renderer.js`); **no PHP change** (attribute already set). Law conflicts:
  none — extends the existing tabs precedent, and is the sibling of F-102.
  Surfaces: neuters the FE-canvas symptoms; harmless on admin (never upgrades) and
  on node-view (no `data-mosaic-preview` → stays live for visitors). Limitation:
  components still UPGRADE in the FE canvas — symptoms are neutered, the underlying
  architectural divergence remains. Smallest, safest.
- **(B) FE dialog canvas in an isolated frame matching admin.** Host the FE builder
  canvas so it does NOT inherit the node-view's `mosaic/renderer` (an outer frame
  loading only `mosaic/builder`, like /node/edit) → elements never upgrade =
  true parity with admin. Blast radius: FrontendBuilderDialog architecture —
  large. Law/behaviour conflicts: the media-library bridge + CKE5 modal + panel
  sync all use window-level events and `document.elementsFromPoint` (same-document
  assumptions) and would break across a frame boundary; risks re-opening F-094
  scroll parity. Highest fidelity, highest risk.
- **(C) Suppress custom-element upgrade within the canvas subtree.** Canvas SSR
  emits a non-registered tag (e.g. `mosaic-carousel-preview`) so the registry never
  upgrades it; the DSD static fallback still renders (clipped, styled). Blast
  radius: `renderSingleComponent` + DSD templates + the panel sync (which targets
  the real tags — would retarget the `-preview` tags). Achieves admin/FE parity
  (inert canvas) without an iframe. Medium. Loses live-preview fidelity (matches
  admin's current inert model).

### Register (for the ruling / a future wave)
**F-103 — canvas edit-mode inert contract gap.** `mosaic-carousel` and
`mosaic-live-search` lack the `data-mosaic-preview` edit-mode handling that
`mosaic-tabs` has; combined with `mosaic/renderer` being live on the FE node-view
page, their canvas instances run as live visitor components inside the FE editor
(auto-advance, live fetch). Sibling of F-102. Scope ruling pending (Options A/B/C).

---

## Gates (this charter)
- PHPCS **0/0** on the only changed file (`MosaicCarouselRenderTest.php`).
- `MosaicCarouselRenderTest` **10/10** (163 assertions) — incl. the two #56 guards.
- No production code changed → no dist rebuild, no full-suite delta beyond the
  guard cells. Isolation self-check + secret guard performed before push.

## Files
- Changed: `tests/src/Kernel/Component/MosaicCarouselRenderTest.php` (+2 guard cells).
- Ledger: `ledger-live/TODO.md` (catches #55–#56 + resolution), this report.
- Scratch witness journeys used + removed (charter: scratch-only for W7).
