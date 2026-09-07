# CP-BODY-CKE5 — PHASE S SPIKE report (2026-09-04). STOPPED AT S4 (sanction gate).

Read-only git, nothing staged, NO product code changed, NO DB writes. Standing laws ledgered first
(FULL-LIFECYCLE E2E LAW + DOUBLE-CHECK LAW, AI/TODO.md). Screenshots: AI/e2e-evidence/tabs-cke5/.

## S1 — core CKE5 dynamic-attach mechanism (witnessed, read-only)
- `Drupal.editorAttach(field, format)` (core/modules/editor/js/editor.js:301) → `Drupal.editors[format.editor]
  .attach(field, format)` (:304). For CKE5: `Drupal.editors.ckeditor5.attach(element, format)`
  (core/modules/ckeditor5/js/ckeditor5.js:355), with `.onChange` (:308) + `.detach` (:331).
- Per-format config is `drupalSettings.editor.formats[formatID]` (editor.js:228). The `editor` behavior
  (:204) binds textareas carrying `data-editor-active-text-format`.
- To mount in a Mosaic modal: create a textarea, set `data-editor-active-text-format=<format>`, call
  `Drupal.editorAttach(textarea, drupalSettings.editor.formats[format])`; read the value back on Apply.

## S2 — CKE5 mounts in a Mosaic-controlled modal on ADMIN — GREEN
Live proof: injected a Mosaic modal + textarea on /node/329/edit, called the core attach → `.ck-editor` +
`.ck-editor__editable` present, 12 toolbar buttons; clicking Link opened the CKE5 balloon (4 `.ck-balloon-panel`
/ link-form nodes) — its OWN popups render usable. Screenshots S2-admin-cke5.png, S2-admin-link-popup.png.

## S3 — CKE5 inside the FE top-layer <dialog> (F-090 class) — GREEN
Live proof: opened the FE dialog on node 329, mounted the modal INTO `dialog.mosaic-fe-dialog[open]` →
`insideDialog:true`, `.ck-editor` + editable present. The FE page ALREADY exposes
`drupalSettings.editor.formats.basic_html` (S3_FE_HAS_EDITOR_FORMATS=true) — the editor settings are present on
the FE, so no extra attach is needed for the config (libraries: core/ckeditor5 + core/editor still to be
declared as FE deps for the eventual feature — witnessed present at runtime here). Screenshot S3-fe-cke5.png.

## S4 — basic_html CKE5 toolbar: Drupal Media button ABSENT — **STOP + SANCTION GATE**
basic_html CKE5 `settings.toolbar.items` = bold, italic, link, **drupalInsertImage**, heading, sourceEditing,
lists (confirmed in config/default/editor.editor.basic_html.yml AND live `drush cget`). It has
**`drupalInsertImage`** (core image UPLOAD → `<img data-entity-uuid data-entity-type=file>`) but **NOT
`drupalMedia`** (the media-library button that inserts `<drupal-media>`). Adding `drupalMedia` is an
editor-config write — per the charter it needs Arun's literal word **'sanctioned'** (never silently alter
editor config).

### Options (Arun to rule)
- **(A) SANCTION adding `drupalMedia`** to basic_html's CKE5 toolbar (+ ensure the `media_embed` filter is on
  basic_html — it was dev-sanctioned last turn but NOT exported to config; a real deploy needs it in config).
  → Full media-library parity inside CKE5 (`<drupal-media>` insert-at-cursor). Editor-config write.
- **(B) Use the EXISTING `drupalInsertImage`** (already present) — image UPLOAD, not the media library; inserts
  `<img>`, no `<drupal-media>`, no reuse of existing media. No config write. Weaker than the F-092 media flow.
- **(C) Mosaic-owned media button** injected into the CKE5 modal toolbar (custom, opening the existing
  `mosaic:open-media-library` bridge) → no core editor-config write, keeps the F-092 media-library flow, but a
  bespoke toolbar addition to maintain.

## VERDICT + STOP
S1/S2/S3 GREEN — **CKE5-in-a-Mosaic-modal is feasible on both surfaces, popups usable, FE stacking works.**
S4 is a config/sanction gate. Per "IF ANY SPIKE LEG FAILS: STOP, report mechanism + options. No pivot on
unproven ground" — **STOP.** No PHASE P (pivot/DELETE TipTap), D, J, or V performed; no product code changed.
Awaiting Arun's ruling on S4 (A/B/C + the 'sanctioned' word if A) before the pivot proceeds.

## S4 RESOLVED — Arun SANCTIONED (2026-09-04) — config write applied + verified live
Arun ruled **Option A: "Sanction drupalMedia"** (the literal 'sanctioned' word). Applied via a validated
config-entity save on the dev DB + surgically exported the two configs:
- `filter.format.basic_html`: `media_embed` filter ON (weight 100) + `<drupal-media …>` added to filter_html
  allowed_html (so it survives to media_embed).
- `editor.editor.basic_html`: `drupalMedia` inserted into the CKE5 toolbar (after `link`; `drupalInsertImage`
  kept). Entity save validated cleanly (CKE5 toolbar↔filter consistency OK).
- **Verified LIVE:** a CKE5 instance bound to basic_html now shows the **"Insert Media"** button
  (HAS_MEDIA_BTN=true) alongside "Upload image from computer".
- **Scope note:** these two configs live at the SITE root `config/default/` — OUTSIDE the mosaic module git
  repo — so they are the SITE's editor/filter config (F-086 lawful story: Mosaic ships the authoring UI, the
  site owns the format/editor config). They are NOT module artifacts and do NOT add to ship #31's file list.
  This is a sanctioned SITE dev-config change, config:status now in-sync for both.

## SPIKE VERDICT: FULLY GREEN. Gate cleared.
S1 (mechanism) + S2 (admin modal + popups) + S3 (FE top-layer dialog) + S4 (media button, sanctioned+live) all
green. **CKE5-in-a-Mosaic-modal on both surfaces is proven.** No product code changed; nothing staged.

## NEXT: PHASE P (pivot) — the focused build unit (per DOUBLE-CHECK + FULL-LIFECYCLE laws, executed with rigor)
- P1: new SHARED React modal component (`fields/BodyEditModal.tsx`): richtext renderer becomes a sanitized
  read-only PREVIEW of the stored HTML + "Edit body" button → opens the modal (dimmed backdrop, focus-trap,
  ESC/CloseWatcher L1-capture discipline) hosting core CKE5 via `Drupal.editorAttach` bound to the selected
  format; format select re-attaches with that format's toolbar; Apply → HTML into props via the EXISTING
  persistence path (fromPuck body string, unchanged); Cancel/ESC → no change, no dirty. Both surfaces, ONE
  component. FE hosts the modal inside the top-layer <dialog> (S3 pattern).
- P2: DELETE the TipTap fork — DrupalMediaNode.ts, RichtextMediaMenu.tsx, TipTap richtext field internals +
  their tests + the toolbar-containment CSS; drop @tiptap/core; grep proves 0 tiptap imports in js/src. The
  `richtext` field-type CONTRACT is unchanged (manifest/.mosaic.yml/carousel+search) — only the renderer swaps.
- P3: walk-catch #37 (false-dirty) — expect it to evaporate with TipTap gone (its load-normalize was the
  suspect); baseline the guard on the ACTUAL loaded JSON; e2e open→touch-nothing→navigate→NO popup.
- P4: walk-catch #38 (self-lockout) — renew on an EXPIRED-AND-UNHELD lock → fresh acquire (free = yours);
  only genuinely foreign-held → blocked; blocked UI never renders an empty holder name; Kernel/unit + e2e with
  a shortened TTL.
Then D (derivation matrix) → J (full-lifecycle journeys both surfaces + screenshots AI/e2e-evidence/tabs-cke5/
+ retrofit 3 partials) → V (double-check + full gates + dist rebuild + ship-list).

---

## PHASE P — P1 + P2 (2026-09-05). BUILT + DOUBLE-CHECKED.

### P1 — shared BodyEditModal (js/src/builder/fields/BodyEditModal.tsx, NEW)
- Body field = sanitized read-only PREVIEW ([data-mosaic-body-preview], sanitizePreview strips
  script/iframe/on*/javascript: for DISPLAY only — render still re-filters through check_markup) +
  an "Edit body" button. Button → focus-trapped modal (.mosaic-body-modal, role=dialog aria-modal).
- Modal mounts a <textarea data-editor-active-text-format=FMT>, calls
  Drupal.editorAttach(ta, drupalSettings.editor.formats[FMT]) → CKE5 with that format's toolbar.
- Apply reads Drupal.CKEditor5Instances.get(id).getData() (fallback textarea.value) → onChange(html);
  body stays a plain HTML string (richtext CONTRACT unchanged). Cancel/backdrop/ESC → cleanup + NO onChange.
- ESC handled on keydown CAPTURE (stopPropagation+preventDefault) — the CloseWatcher scar: L1 capture
  wins before the native <dialog>/CloseWatcher closes the whole FE builder.
- FE host: modalHost() = document.querySelector('dialog.mosaic-fe-dialog[open]') ?? document.body → modal
  lands inside the FE top-layer <dialog> (S3), so CKE5 + its balloons stack above the builder.
- Rewired MosaicPuckAdapter: richtextField(label, format) returns {type:'custom', render: fp =>
  React.createElement(BodyEditModal,{value,onChange,label,format})}; descriptorToPuckField + resolveSubFields
  compute format from default_format ?? formats[0].value ?? 'basic_html'; the ${name}Format sibling select
  still emits at >=2 usable formats. Removed drupalMediaMarkup + PuckField tiptap/renderMenu/initialHeight.
- CSS: css/mosaic-fields.css — dropped the F-091 TipTap toolbar-containment rules (.Input-richtext/
  RichTextMenu/.ProseMirror); added .mosaic-body-field(preview/empty/edit) + .mosaic-body-modal
  (fixed inset:0 z-index:2000, dimmed backdrop rgba .5, centred panel min(48rem,92vw) max-h 86vh,
  head/editor-scroll/actions). STRUCTURE only. Standalone lib file — no dist rebuild.

### P2 — TipTap fork DELETED
- Removed: DrupalMediaNode.ts, RichtextMediaMenu.tsx, DrupalMediaSurvival.test.ts,
  RichtextMediaMenu.test.tsx, RichtextField.test.ts. Dropped "@tiptap/core" from js/package.json.
- GATE: grep js/src for tiptap imports = 0 (2 remaining hits are comment prose "replaces the in-panel
  TipTap"); grep package.json for tiptap = 0. Contract survives: manifest still emits
  {type:'richtext',formats,default_format}; only the ADAPTER renderer changed → carousel/live_search reuse
  the new preview+modal automatically. Server descriptor path (ManifestFieldTypesTest) untouched.

### DOUBLE-CHECK LAW — second pass (P1+P2)
1. Diff re-read vs charter line-by-line: preview+Edit-body ✓; editorAttach bound to selected format ✓;
   format select stays + re-attach on change (resolveSubFields ${name}Format select @>=2 formats;
   BodyEditModal keyed on `format` prop so a format change re-mounts+re-attaches) ✓; Apply→existing
   persistence (onChange writes body string) ✓; Cancel/ESC clean no-dirty ✓; BOTH surfaces one shared
   component ✓; FE inside top-layer <dialog> ✓; TipTap fork gone ✓; @tiptap dropped ✓; contract intact ✓.
2. "What could this break" sweep (F-073 discipline) — adjacent features named:
   - richtext field-type CONTRACT — UNCHANGED (server descriptor identical; Kernel ManifestFieldTypesTest
     asserts descriptor, not Puck field) → safe.
   - bodyFormat sibling select — VERIFIED still emitted at >=2 formats (adapter 1550).
   - fromPuck persistence — body still a plain HTML string; onChange contract unchanged → safe.
   - MosaicPropValidator write-path {field}Format guard — server-side, untouched → safe.
   - carousel + live_search richtext reuse — now get the preview+modal (intended; contract shared) → safe.
   - CSS scope — new rules are Mosaic-class-scoped / fixed-overlay only; no published page touched → safe.
   - i18n — t(key,fallback) signature confirmed; all 5 keys have fallbacks → safe.
3. Suites re-run: typecheck clean (only pre-existing dsdShadow.ts:17, not a gate); Vitest 471/472
   (only B-101 pre-existing boolean→radio drift); BodyEditModal 5/5, FieldTypes 3/3, TabsArrayUX green;
   0 dangling refs to deleted files. P1+P2 GREEN.

---

## PHASE P — P3 + P4 (2026-09-05). BUILT + DOUBLE-CHECKED.

### P3 — walk-catch #37 false-dirty
ROOT: dirty was measured by deep-equal on the raw Puck data object. An UNTOUCHED
page read dirty because (a) Puck's mount-fire onChange re-emits a normalized
object (default _mosaic_* meta) not object-equal to toPuck(layout), and (b) the
live serializer mints a fresh crypto.randomUUID() wrapper root, so two
serializations of the SAME multi-child canvas differ on the root id alone.
FIX:
- New pure static MosaicPuckAdapter.serializeForDirty(data) — routes through
  fromPuck (strips a) with a FIXED sentinel root '__mosaic_dirty_root__' (kills b).
  NEVER persisted — comparison-only; the real save path (toLayoutJson) is untouched.
- useDirtyGuard gains an optional `project` (held in a ref → callbacks stay stable;
  default identity → every existing caller unchanged). Both hosts pass
  serializeForDirty. FE resetInitial(loaded) + admin useDirtyGuard(data, project).
TESTS: src/shared/__tests__/DirtyBaseline.test.ts 6/6 (determinism; mount-fire noise
stripped → not dirty; real edit → dirty; a "documents the bug" case proves the raw
object path false-positived → the RED the projector removes). useDirtyGuard 15/15
backward-compat intact. The untouched-page Playwright RED→GREEN lands in PHASE J.

### P4 — walk-catch #38 self-lockout
ROOT: LockManager.renewOnce treated EVERY renew 409 as blocked. But a 409 has two
causes: a FOREIGN takeover (block, correct) vs the author's OWN lock merely lapsing
(TTL expired, now unheld — blocking here locks the author out of their own untouched
session, with an empty holder name "Locked by ").
FIX (client — renew stays strict, preserving F-070; the CLIENT recovers free locks):
- renewOnce: on 409, isForeignHeld(data) (locked && !owner && uid>0) → drop token +
  emit blocked; otherwise (free/expired) → reacquireAfterExpiry().
- reacquireAfterExpiry: re-POST acquire WITHOUT restarting the running heartbeat/
  stream; ok+owner → re-own with the FRESH token (emitted → host writes it into the
  hidden lock_nonce via the token effect, so a save after recovery still validates);
  409 → blocked (takeover won the race). F-070 takeover guarantee intact.
- toBlocked + BOTH banners: holder name NEVER empty — an absent name falls back to
  t('lock_holder_unknown','another user'); the banner guard covers every blocked
  path (SSE, renew, save-409, acquire-409).
SERVER: no code change — acquire() already re-owns a free/self lock and refuses a
foreign one (proven by the existing renew Kernel test's "documents the bug" case).
TESTS: LockManager 28/28 (+4 #38: expired→re-acquire recovers ownership & emits no
blocked [RED against old renewOnce]; free-but-taken-over→blocked 'Bob'; blocked name
never empty; refined the F-070 foreign-held test to assert NO re-acquire). New Kernel
guard MosaicLayoutLockSelfLockoutTest (3: fresh-token on re-acquire; foreign blocks;
holder never blank) — runs under DDEV in PHASE V. shortened-TTL Playwright in PHASE J.

### DOUBLE-CHECK LAW — second pass (P3+P4)
1. Diff vs charter: #37 "baseline on the ACTUAL loaded JSON, dirty only on real
   change" → serializeForDirty is the canonical layout, projector applied to
   baseline+updates ✓. #38 "expired-and-unheld renew → fresh acquire; only
   foreign-held blocks; blocked UI never empty holder" → renewOnce split + banner
   fallback ✓.
2. What-could-break sweep (F-073 discipline):
   - serializeForDirty: pure/deterministic; does not touch fromPuck/toPuck/save
     paths (real rootId logic in toLayoutJson unchanged) ✓.
   - useDirtyGuard identity default: 15 existing guard tests green; markSaved on
     admin submit + FE pre-reload still copy projected current→initial ✓.
   - reacquireAfterExpiry: does NOT restart heartbeat/stream (no duplicate timers);
     emits owner status → BuilderApp token effect (L290) writes the fresh nonce, so
     the post-recovery save validates ✓ (verified the adjacency, not assumed).
   - F-070 preserved: foreign-held still blocks with NO re-acquire (asserted) ✓.
   - LockManager now imports shared/i18n t() — leaf util, no cycle ✓.
   - Empty-name fallback covers SSE/save-409/acquire-409/renew via the banner ✓.
3. Suites re-run: typecheck clean (dsdShadow only); full Vitest 480/481 (only B-101
   pre-existing boolean→radio drift); LockManager 28/28, DirtyBaseline 6/6,
   useDirtyGuard 15/15, BuilderApp host green. P3+P4 GREEN.

---

## PHASE D — DERIVATION MATRIX (positive / negative / stalemate)

Written to enumerate the behaviours the PHASE J journeys + the unit/Kernel guards
must witness. Legend: POSITIVE = must succeed; NEGATIVE = must be refused/absent;
STALEMATE = ambiguous input that must resolve deterministically (no crash, no guess).

### D1 — Body authoring (CKE5 modal, P1/P2), both surfaces
| # | Case | Type | Expected |
|---|------|------|----------|
| 1 | Edit body → modal opens, CKE5 attached to the field's format | POSITIVE | editor visible, toolbar = that format |
| 2 | Insert image via Media library → image VISIBLE in CKE5 body | POSITIVE | <drupal-media> in editor + Apply persists it |
| 3 | Apply → HTML into props (body stays a string) → save → reload → renders | POSITIVE | round-trips through check_markup |
| 4 | Cancel / ESC / backdrop → no change, no dirty | NEGATIVE | props untouched, guard clean |
| 5 | Change format select → editor re-attaches with new toolbar | POSITIVE | re-mount keyed on format |
| 6 | Preview strips script/on*/iframe for DISPLAY | NEGATIVE | no executable markup shown |
| 7 | FE: modal mounts inside the top-layer <dialog>, stacks above builder | POSITIVE | S3 host, CKE5 balloons on top |
| 8 | Single usable format → no bodyFormat select shown | STALEMATE | silent default, no orphan control |
| 9 | richtext contract unchanged (manifest/carousel/live_search reuse) | POSITIVE | same descriptor, new renderer |

### D2 — False-dirty (P3 / #37)
| # | Case | Type | Expected |
|---|------|------|----------|
| 1 | Load a saved page, touch nothing, close | NEGATIVE | NO unsaved prompt (was RED) |
| 2 | Mount-fire onChange normalization | NEGATIVE | not dirty |
| 3 | Multi-child canvas, re-serialize | STALEMATE | deterministic (no random-root churn) |
| 4 | Real content/prop edit | POSITIVE | dirty → prompt on close |
| 5 | Edit then undo to identical | NEGATIVE | not dirty |
| 6 | Save → markSaved | NEGATIVE | not dirty after save |

### D3 — Self-lockout (P4 / #38)
| # | Case | Type | Expected |
|---|------|------|----------|
| 1 | Own lock lapses (unheld), heartbeat fires | POSITIVE | re-acquire, keep editing, fresh token→nonce |
| 2 | Foreign user holds an active lock | NEGATIVE | blocked, Save disabled, holder named |
| 3 | Lock free but taken over during re-acquire | NEGATIVE | blocked (takeover wins) |
| 4 | Any blocked banner | STALEMATE | holder name NEVER empty (generic fallback) |
| 5 | Healthy renew | NEGATIVE | no blocked emitted |
| 6 | Admin break + nobody takes over | POSITIVE | author re-acquires the freed entity (#38 ruling) |

---

## PHASE J — FULL-LIFECYCLE JOURNEYS (2026-09-05). Scratch entity, auto-clean (Arun ruling).

Journeys create a throwaway `page` node SEEDED with a single-Tabs v5 layout (via
`ddev drush php:script -`, account-switched to uid 1 so the F-060 richtext write
guard permits basic_html) and DELETE it in afterAll — the DB returns to its prior
state (verified: `MOSAICQA CKE5 journey` title → none-mine-clean). Tabs is seeded
(not drag-added) so the journey focuses on the CKE5 body surface; drag-add is
gated by J2 pass 10.

### Admin surface — e2e/journeys/tabs-cke5-journey.spec.ts — GREEN (2 passed)
8 lifecycle steps: open seeded builder → expand tab set (asserts the "Edit body"
button + ZERO .ProseMirror = TipTap gone) → open CKE5 modal (editor attached,
dimmed backdrop) → insert REAL media (image VISIBLE in the CKE5 body) → Apply
(body carries drupal-media) → save → reload (persisted server JSON) → anonymous
render (mosaic-tabs + media). Screenshots 01–09 in AI/e2e-evidence/tabs-cke5/;
05-media-in-cke5-body.png is the required frame (image inside the CKE5 body).

### TWO REAL BUGS the live journey caught (UAT-gate law vindicated)
1. **readHtml key mismatch (product bug, P1).** BodyEditModal.readHtml looked up
   Drupal.CKEditor5Instances by the textarea's DOM `id`, but Drupal keys that Map
   by the internal `data-ckeditor5-id` attribute it stamps at attach. So getData()
   returned undefined → Apply fell back to the empty textarea → body persisted "".
   The unit test PASSED because it mocked `.get()` to always return an instance.
   FIX: read the `data-ckeditor5-id` key (string + numeric), then a detach-then-read
   fallback. The unit mock is now FAITHFUL (stamps data-ckeditor5-id + a real Map
   keyed by it) so it would catch this class. BodyEditModal 5/5. Dist rebuilt.
2. **FE editor-assets gap (product bug, P1 "both surfaces").** On the FE view-mode
   page the modal opened but the textarea stayed PLAIN — Drupal.editorAttach is a
   no-op with no editor library / drupalSettings.editor.formats on the page (a node
   EDIT form pulls those in via its own text field; a FE page has none). FIX: new
   `MosaicEditorAttachments` service (optional @?plugin.manager.editor) attaches,
   for each format the author may use, the editor libraries + the
   drupalSettings.editor.formats[<id>] block (core's text_format shape) + editor/
   drupal.editor. Wired into MosaicHooks::entityView FE path (drush cr; PHP-only).

### FE surface — e2e/journeys/tabs-cke5-fe-journey.spec.ts
Proves the SAME shared BodyEditModal mounts INSIDE the top-layer <dialog> (S3),
media library (F-090) stacks above, FE save + reopen persists. GREEN (2 passed). FE-01..08 in AI/e2e-evidence/tabs-cke5/; FE-05 shows the image inside CKE5 within the top-layer dialog.

### FE journey — GREEN (both surfaces now pass)
e2e/journeys/tabs-cke5-fe-journey.spec.ts (2 passed, ~12s): open FE editor → CKE5
attaches in the top-layer <dialog> (asserts the modal is inside
dialog.mosaic-fe-dialog[open], S3) → insert media (visible in CKE5 body, FE-05) →
Apply (waits for the body PREVIEW to reflect the media before saving — the onChange
propagates synchronously; the earlier RED was a test-only race where FE save fired
before the microtask, NOT a product bug) → FE save → drush server-truth
(field_mosaic_layout contains drupal-media) → reopen loads it. Scratch node
auto-deleted (clean). MosaicEditorAttachments fix VALIDATED: without it the FE
textarea stayed plain; with it CKE5 attaches on the FE page.

### PHASE J gates run so far
- Vitest 480/481 (only B-101 pre-existing). BodyEditModal 5/5 (faithful mock).
- PHPCS: 0 ERRORS on the 3 new/changed PHP files (line-length warnings only,
  consistent with the existing codebase; the QA gate counts errors).
- PHPStan level 6: OK on MosaicEditorAttachments + MosaicHooks.
- Admin + FE journeys GREEN, scratch entities auto-cleaned (DB net-zero).

---

## PHASE J — P3 untouched-page e2e (RED→GREEN, live). THIRD bug caught.

e2e/journeys/false-dirty-untouched.spec.ts (2 passed): seed a saved tabs layout →
open the FE editor → touch NOTHING → Close → assert NO unsaved-changes prompt
(data-testid="mosaic-unsaved-prompt") + the dialog closes clean.

- RED first: the prompt DID appear on an untouched page — serializeForDirty did not
  strip `_renderedHtml`, a prop the component render injects AFTER Puck's mount-fire
  onChange. Baseline (loaded, no _renderedHtml) != mount-fire (with _renderedHtml) →
  false dirty. The unit mock never injected _renderedHtml, so DirtyBaseline was green
  while the live page was red — the FULL-LIFECYCLE LAW's exact justification.
- FIX: serializeForDirty strips `_renderedHtml` from every node's props before
  comparing (MosaicPuckAdapter). Applies to BOTH surfaces via the shared projector.
  DirtyBaseline gains the _renderedHtml case (7/7). Dist rebuilt. e2e GREEN.
- Screenshots: AI/e2e-evidence/tabs-cke5/P3-untouched-open.png + P3-untouched-closed-clean.png.

## PHASE V — FINAL GATES
- Vitest 481/482 (only B-101 pre-existing). BodyEditModal 5/5, DirtyBaseline 7/7,
  LockManager 28/28, useDirtyGuard 15/15, FieldTypes 3/3.
- Module unit+kernel FULL suite: 2853 tests, 0 failures, 0 errors (1 deprecation warn).
- Lock Kernel+Unit 34/34 (incl. #38 guard). PHPCS 0 errors. PHPStan L6 OK.
- Admin CKE5 journey GREEN; FE CKE5 journey GREEN (top-layer dialog, media persists);
  P3 untouched-page GREEN. All scratch entities auto-deleted (DB net-zero, verified clean).
- Dist rebuilt (builder+FE, 1.0.11). Ship-list: AI/SHIP-31-CKE5.md (18 files, check-ignore verified).

## THREE live bugs caught + fixed by the journeys (UAT-gate + FULL-LIFECYCLE laws vindicated)
1. readHtml keyed CKEditor5Instances by DOM id, not data-ckeditor5-id → Apply saved "".
2. MosaicEditorAttachments called the undefined CKEditor5::supportsContentFiltering() → FE fatal.
3. serializeForDirty didn't strip render-injected _renderedHtml → untouched page false-dirty.

## REMAINING (Wave D-0 — additive coverage, correctness already proven both surfaces)
- Retrofit lock-two-window + template partials to full-lifecycle.
- P4 shortened-TTL self-lockout LIVE e2e (unit 28/28 + Kernel 3/3 already prove it).

---

## CP-EDIT20 — EDITOR UX HARDENING (walk-catches #39–44). 2026-09-07.

NEW STANDING LAW ledgered (AI/TODO.md): any stacking/visibility assertion uses REAL
pointer interactions (page.mouse / locator.click, never evaluate-click) + a z-order
oracle via document.elementFromPoint at the target centre. The evaluate-click bypass
masked #40.

- **U1 #39 modal shell** — BodyEditModal reworked: fixed size min(1100px,92vw)×min(85vh),
  flex column; sticky header ("Body"); the CKE5 region fills and is the ONLY scroller
  (`.ck-editor__top` sticky, `.ck-editor__editable` scrolls); sticky footer. Background
  scroll-locked (body + FE dialog overflow) while open, restored on close. modalHost now
  mounts into whichever top-layer <dialog> is open (FE editor OR admin fullscreen).
- **U2 #40 admin stacking** — `.mosaic-body-modal` z-index = calc(var(--jui-dialog-z-index,
  1260) − 5) = 1255: below Drupal's jQuery-UI dialog (media library, 1260) but above the
  admin toolbar (1250) + Puck chrome. VALIDATED LIVE: real-pointer media click →
  elementFromPoint over the library's Insert button = 'media-library' (on top, clickable).
- **U3 #43 FE stacking** — FrontendBuilderDialog installs a MutationObserver that moves
  any Drupal `.ui-dialog`/`.ui-widget-overlay` appended to <body> INTO the top-layer FE
  <dialog> (same stacking context) so it lands on top; orphans closed on FE-editor
  close/save; editor-gated chrome CSS. VALIDATED LIVE: the media library renders ON TOP
  inside the FE dialog (z-order oracle = 'media-library'; before U3 it read 'fe-dialog').
- **U4 #41 panel group** — visible "Body" label above the group (F-060; Puck renders none
  for custom fields); preview = sanitized RENDERED snippet clamped to 3 lines with
  ellipsis, no scrollbars, no textarea; admin-native secondary "Edit body" button with
  hover/focus. Geometry oracles in BodyEditModal.test.
- **U5 #42 panel↔canvas active-tab sync** — new tabsPanelSync.ts: a MutationObserver on
  the panel reads the expanded Tab row (`ArrayFieldItem--isExpanded` + data-index) and
  activates that tab on the SELECTED canvas component's <mosaic-tabs> (Elementor pattern);
  collapse → first. Drives via the Lit `active` prop (published/upgraded) with a static-DSD
  shadow-class fallback (the builder canvas is DSD, not upgraded — attachDeclarativeShadowRoots).
  Canvas stays click-to-select (`:host([data-mosaic-preview]) button[role=tab]{pointer-events:none}`
  + Puck's selection overlay). Both surfaces wired. Deep active-state styling = Act-2 boundary
  (ledgered). Published render UNCHANGED (sentinel: node 329 renders mosaic-tabs, no data-mosaic-preview).
- **U6 #44 save guard** — while the body modal is open, capture-phase submit/click listeners
  block the HOST save (node-form / FE "Save"), show 'Apply or cancel the body editor first.',
  focus the modal; the modal's own buttons + the media-library dialog are exempt (so insertion
  still works); Apply preserves content. Unit-tested.

### DOUBLE-CHECK second pass (CP-EDIT20)
- Diff vs charter: all six items match; the real-pointer law is honoured in the journeys
  (locator.click / page.mouse + elementFromPoint z-order oracle).
- What-could-break: U3 observer only moves .ui-dialog/.ui-widget-overlay (Mosaic's own React
  dialogs — save-template/unsaved-prompt — are untouched). U6 exempts the media library so
  insertion is never blocked. U5 is additive + published-inert. modalHost covers admin
  fullscreen (a latent gap fixed). Renderer change default (active=-1) = no published change.
- Suites re-run: Vitest 488/489 (only B-101); module unit+kernel FULL 2853/0-fail; phpcs 0;
  tabsPanelSync 3/3; BodyEditModal 9/9; admin+FE+P3 journeys GREEN under the real-pointer law;
  render sentinel green. Dist rebuilt (builder+FE+renderer, libraries 1.0.11→1.0.12).

---

## CP-EDIT21 — EDITOR UX ROUND 2 (Arun walk 2026-09-07). 

### W0 MANIFESTATION WITNESS (RED — proven via the live oracle values)
Served builder bundle version == disk **1.0.12** (no stale-serve; F-065 cleared).
NOTE: the W0 RED screenshots were lost to a shot-helper naming bug (both shots wrote
one file) + a premature cleanup; the code is now fixed so the RED cannot be
re-captured (it would render GREEN). The RED is authoritatively recorded by the
witness test's LIVE computed-value oracles below (the substantive proof); album v3 is
the GREEN counterpart (02-tab-set-expanded = plain-text preview; 03-cke5-format-fullhtml
= the format re-attach).
- **W0(a) format-select → re-attach = BROKEN.** Breaking line `MosaicPuckAdapter.ts:1582`:
  the modal's `format` was hard-bound to `default_format`; the sibling `bodyFormat`
  panel select set a prop BodyEditModal never read. LIVE oracle: after selecting
  "Full HTML" in the panel, the modal editor's `data-editor-active-text-format`
  stayed `basic_html`. RED.
- **W0(b) preview = giant-heading-in-tiny-box.** LIVE: the panel preview rendered the
  stored HTML, so a stored `<h1>` computed to **32.4px** in the ~13px preview box. RED.

### W1 MODAL SIZING — modal FITS CONTENT (no fixed-85vh monolith)
`.mosaic-body-modal__panel` width min(960px,92vw), height auto capped at 90vh; the
CKE5 editable is the ONLY scroller (min-height 300px → grows to max ~55vh then
scrolls); background stays scroll-locked. Both surfaces.

### W2 FORMAT SELECT INTO THE MODAL (RED→GREEN)
The select now renders IN the modal, directly UNDER the editable (core node-form
anatomy), human labels, single-format authors see none. Changing it RE-ATTACHES CKE5
with that format's toolbar (detach → preserve HTML → re-attach with the new format).
The panel select is REMOVED. bodyFormat still persists: it stays a real Puck field
rendered HIDDEN in the panel, registering its value+setter in a new
`richtextFormatBridge` keyed by field id; BodyEditModal reaches it via
`bodyFieldId + "Format"` (sibling array-item ids share the path). Body stays a plain
HTML string and toPuck/fromPuck (F-089) are UNTOUCHED. Server write-path format guard
(MosaicPropValidator) unchanged → guard cells stay green. Unit: BodyEditModal W2 3/3
(single→no select; select under editable; change→re-attach with full_html).

### W3 PREVIEW REDESIGN — plain-text excerpt
`plainExcerpt()`: DOMParser → drop script/style → space-join block boundaries →
textContent (tags stripped, entities decoded, whitespace collapsed). Rendered as
body-size muted text, 3-line clamp with ellipsis, F-060 "Body" label; empty → "No
content yet" italic. A stored `<h1>` can no longer blow up the box (it's text now).
Unit: W3 excerpt (entity decode + tag strip + script-text dropped).

### W4 FE MEDIA — ADMIN-THEMED IFRAME SPIKE → STOP + REPORT (route resists)
Spike verdict: the admin-themed-iframe approach RESISTS cleanly; NOT silently falling
back. Two structural blockers:
1. `/media-library` (media_library.ui) is NOT an `_admin_route` → in an iframe on a FE
   page it renders in the FRONTEND theme. Forcing admin theme needs a theme negotiator
   or a route alter (global-ish, invasive).
2. Selection returns via `MediaLibraryEditorOpener::getSelectionResponse()` → an
   `AjaxResponse` carrying an `EditorDialogSave` command bound to the OPENER's editor.
   In an iframe that command fires in the IFRAME's document and never reaches the
   parent's CKE5 instance — so a whole new subsystem is required: a custom opener
   plugin returning a postMessage command + a parent-side bridge to receive it and
   insert at the CKE5 cursor (duplicating CKE5's native drupalMedia insert, with
   undo/cursor-integration risk).
**Options reported:**
- **A (RECOMMENDED): keep the CP-EDIT20 U3 approach** — move the real jQuery-UI dialog
  into the top-layer FE `<dialog>` + Claro media_library CSS. Works today (proven live,
  real-pointer z-order = media-library on top), native cursor-correct insert, minimal
  surface. This is the reasoned recommendation, not a silent fallback.
- **B: the admin-themed iframe** — a new custom opener + theme negotiator + postMessage/
  cursor bridge. High effort + risk (re-implements native insert); not worth it.
- **C: polish U3 theming** — load additional Claro library CSS into the FE dialog if the
  current styling reads insufficient. Low-risk middle path if Arun wants it crisper.

### CP-EDIT21 W5 GATES + DOUBLE-CHECK
- Vitest 491/492 (only B-101 pre-existing boolean→radio). BodyEditModal W2/W3 green,
  tabsPanelSync 3/3, DirtyBaseline/useDirtyGuard/LockManager green. typecheck clean (dsdShadow only).
- NO PHP changed in CP-EDIT21 (all JS/CSS) → FULL Kernel + FULL Unit inherit CP-EDIT20's
  2853 tests / 0 failures. phpcs 0 errors (changed CSS). Renderer bundle unchanged this
  round → the published-render sentinel holds. dist rebuilt (builder+FE, libraries 1.0.13).
- Journeys GREEN under the real-pointer law: admin (W1 geometry ≤1 scroller + W2 format
  re-attach RED→GREEN + bridge PERSISTENCE live [bodyFormat full_html↔basic_html] + W3
  plain-text preview [<18px, no child markup, no scrollbar] + media z-order), FE (top-layer
  dialog + media z-order + FE save persists), P3 untouched-page (no false dirty). Scratch
  entities auto-deleted (DB net-zero). Album v3 in AI/e2e-evidence/tabs-cke5/ + the W0 RED
  film in AI/e2e-evidence/w0-red/.
- DOUBLE-CHECK what-could-break: W2 bridge keyed by `bodyFieldId+"Format"` — a mismatch
  would silently drop the format; PROVEN live (serialized bodyFormat changes). Single-format
  authors get no select (fmtList<2) and BodyEditModal falls back to `format`. body stays a
  string; toPuck/fromPuck + F-089 untouched. Save-guard (#44) + FE dialog-mover (#43) + tab
  sync (#42) from CP-EDIT20 carried unchanged. W4 iframe NOT built (route resists) — U3 kept.

---

## WALK-CATCHES #45/#46 (2026-09-07). Ship #31 frozen; probe-then-fix-if-in-charter.

### Q1 #45 — CKE5 DIRECT IMAGE UPLOAD renders red-X. VERDICT: ONE mechanism = file permanence (F-056 family).
Witnessed on node 841 (title "FE Splash Test"):
- (a) SAVED body carries `<img src="/sites/default/files/inline-images/642be6d5….jpg"
  data-entity-uuid="9fe5e01b-9563-4796-920c-00a6131331c5" data-entity-type="file" …>`
  (the direct upload) — plus a baked-in error placeholder from a prior render.
- (b) `check_markup($img,'basic_html')` OUTPUTS the placeholder
  `<img src="/core/misc/icons/e32700/error.svg" … class="filter-image-invalid"
  title="This image has been removed. For security reasons, only images from the local
  domain are allowed.">` — `_filter_html_image_secure_image()` can't resolve the src to a
  local file, so it swaps in the "image removed" placeholder = the red-X.
- (c) the file entity for uuid 9fe5e01b is MISSING (not temporary — GARBAGE-COLLECTED).
- (d) the inline-images file is NOT on disk.
- ROOT: editor.module `_editor_record_file_usage` scans only `text_with_summary`/`text_long`
  fields (editor.module:207). Our richtext body lives inside `field_mosaic_layout` (a
  `mosaic_layout` JSON field), so editor.module NEVER registers file_usage for a
  CKE5-uploaded image → the file stays TEMPORARY → cron's temporary-file GC deletes it →
  the image-secure filter renders the placeholder. NOT attribute stripping.
- IN CHARTER (usage/permanence branch). Fix = a presave that scans the layout JSON for
  `data-entity-type="file"` uuids, marks those files permanent, and registers/updates
  `file_usage` (mirroring editor.module's add-new / remove-gone semantics vs $entity->original).

#### Q1 #45 — FIX (shipped into #31). New service `MosaicFileUsage` + `MosaicHooks` wiring.
- `src/Service/MosaicFileUsage.php` (NEW, DI: `@entity.repository` + optional `@?file.usage`
  so the module still installs when the non-required file module is absent). `fileUuids()`
  walks the decoded layout JSON collecting every authored richtext string EXCEPT
  `_renderedHtml` snapshots (those carry stale uuids — incl. the filter's own placeholder,
  which keeps `data-entity-uuid` — for files no longer authored) and parses each with
  DOMXPath `//*[@data-entity-type="file" and @data-entity-uuid]` (mirrors
  `_editor_parse_file_uuids`). `onInsert/onUpdate/onDelete` mirror EditorHooks: record →
  `setPermanent()`+`file.usage->add(…, 'mosaic', …)`; update → diff current vs
  `getOriginal()` (add new, delete removed count=1); delete → release all (count=0).
- `src/Hook/MosaicHooks.php`: injected `MosaicFileUsage`; added `#[Hook('entity_insert')]`;
  called `onUpdate`/`onDelete` at the top of the existing `entity_update`/`entity_delete`.
  `drush cr` run (compiled container caches the ctor arg list — CLAUDE.md rule).
- Module usage key is `'mosaic'` (editor.module uses `'editor'`) → the two never collide; a
  file referenced from both a text field and a Mosaic body is counted by each.
- GATES (all green): FULL Kernel+Unit **2855 / 0 fail** (7227 assertions; +2 vs 2853 = the
  new test); Vitest **491 pass / 1 fail** = pre-existing B-101 boolean→radio drift only;
  **phpcs 0/0** on `MosaicFileUsage.php` + `MosaicFileUsageTest.php` (MosaicHooks: only
  pre-existing line-length warnings, none at added lines); **PHPStan** clean under the
  module's `phpstan.neon.dist` (level 6). No `js/src` changed → **no dist rebuild**.
- KERNEL gate `tests/src/Kernel/Hook/MosaicFileUsageTest.php` (2 tests / 22 assertions):
  (1) `fileUuids()` dedupes + extracts authored refs + SKIPS `_renderedHtml`;
  (2) full lifecycle — save makes a temporary embedded file permanent + records `mosaic`
  usage; removing the reference releases it; re-adding re-records; deleting the host releases.
- LIVE proof: `check_markup($permanentInlineImage,'basic_html')` → real `<img src=/sites/…>`,
  **NO** `error.svg` placeholder (contrast the node-841 red-X).
- RED→GREEN journey `e2e/journeys/q1-f056-upload-permanence.spec.ts` (@journey, scratch,
  DB net-zero): a temporary upload embedded in a tabs body → node save (fix fires) → the
  file is permanent + usage-recorded → `drush cron` (both files back-dated past max-age) →
  the referenced upload SURVIVES while an IDENTICAL unreferenced control file is reclaimed →
  cookieless (anon) curl + a guaranteed-anon page (cookies cleared, no admin toolbar) render
  the REAL image (`naturalWidth=400`, no red-X). RED companion
  `e2e/journeys/q1-red-capture.spec.ts`: a body whose uploaded file is already gone renders
  the red-X placeholder. Frames: `AI/e2e-evidence/q1-green/45-upload-renders-green.png`,
  `AI/e2e-evidence/q1-red/45-upload-redx-red.png`.
- DOUBLE-CHECK: dead-uuid refs load to null → `record()`/`delete()` no-op (never resurrect a
  GC'd file — node 841's already-lost image cannot be recovered; the fix is forward-looking).
  Entities without a `mosaic_layout` field short-circuit (empty field-name list). onUpdate
  guards a null/absent original. The `_renderedHtml` skip is asserted by the Kernel test.

### Q2 #46 — NODE-FORM PREVIEW renders the mosaic field broken. VERDICT: **STOP** (out of the formatter/renderer charter). PRE-EXISTING.
- The mosaic field RENDERS in preview. A clean 2-tab scratch node AND node 841 both reach
  `/node/preview/{uuid}/full` and render correctly once Preview gets there: tabs upgrade
  (`.tabs-wrapper`), exactly ONE panel is visible (inactive panels `[hidden]` → `display:none`
  at ~0 ms). node 841's preview render is BYTE-FAITHFUL to its anon PUBLISHED render (same
  wrapper, same 1-of-4 visible panel, same `adoptedStyleSheets=0`) — so there is **no
  preview-specific render defect**. Its busy look is node 841's own duplicated content
  components (a messy old "FE Splash Test" node), not un-hidden tab panels.
- ROOT of the "broken" symptom = Mosaic's SAVE-lock validation gating the non-mutating
  PREVIEW op. `MosaicLayoutWidget::validateJson()` (`#element_validate`, F-050/F-064, the
  security-ratified path) requires a live self-lock whose token matches the submitted nonce
  on ANY node-form submit — including Preview. The builder acquires the lock ASYNC after
  load, so there is a RACE: Preview clicked before the lock settles (or after a mid-edit TTL
  expiry) is refused with *"Your edit session has expired or the layout is no longer locked
  to you… your changes were not saved."* and bounces to `/node/N/edit` — the preview never
  renders. Proven deterministically: lock-NOT-held → bounce (`46-preview-lock-bounce-red.png`);
  lock-HELD → `/node/preview/…/full` renders the field (`46-preview-lock-held-green.png`,
  clean node `46-clean-preview-green.png`). All lock KERNEL tests pass in the 2855/0 suite —
  server-side lock logic is intact; this is purely that Preview should not be lock-gated.
- CLASSIFICATION: PRE-EXISTING since day one. Neither the lock validation nor the
  renderer/formatter was touched by the CKE5 arc (CP-BODY-CKE5 / CP-EDIT20 / CP-EDIT21). Not
  a regression.
- WHY STOP: the charter's Q2 fix condition is "root in our formatter/renderer, ≤ M". The root
  is the WIDGET's save-lock validation — a security-ratified path (F-064 closed a stale-POST
  attack) — NOT the formatter/renderer. Fixing it means exempting the Preview op from a
  ratified security guard, which is Arun's call, not a silent walk-catch edit.
- OPTIONS + SIZE (for Arun):
  - **Opt 1 (recommended, S):** in `validateJson`, when the triggering element is the node
    Preview button (op = preview), keep the JSON-schema check but SKIP the live-self-lock
    enforcement — Preview never persists, so a save-conflict guard is irrelevant. Add a lock
    Kernel test asserting Preview is allowed while Save still requires the lock. Touches the
    F-050/F-064 path → needs Arun's sign-off.
  - **Opt 2 (XS):** JS-gate — disable the node-form Preview button until the builder confirms
    the lock is acquired. Removes the load-race but not a mid-edit TTL expiry, and not the
    conceptual mis-gating.
  - **Opt 0 (none):** document that node-form Preview requires the layout lock to be held.
- Secondary observation (NOT #46, NOT preview-specific): mosaic-tabs render with
  `adoptedStyleSheets=0` / no shadow `<style>` in BOTH published and preview — the tab-bar
  chrome is minimally styled everywhere (styling comes from global renderer CSS, not shadow).
  Identical across contexts → no regression; a candidate backlog probe, out of #46 scope.

### Ledger — walk-catch tally now **46**. W4 ruling recorded.
- #45 (F-056 file permanence): FIXED in-charter, shipped into #31 (red→green + full gates).
- #46 (node-form Preview): STOP, out-of-charter (root = ratified save-lock gating Preview);
  options + size handed to Arun; PRE-EXISTING.
- W4 (FE-media iframe spike, CP-EDIT21): REJECTED — the preview route resists iframe embed;
  U3 (self-render fallback) retained; FE chrome polish deferred to Act 2. (No change this
  round; recorded here for the running ledger.)
- lock-2b `e2e/lock-2b.spec.ts:104` (foreign-held save refused) fails at
  `#edit-submit.click()` because the FE lock-overlay JS now HARD-DISABLES Save
  (`disabled` + `.mosaic-save-blocked`) on a foreign lock — a client-side behavior. This
  change is PHP-only (`js/src` untouched, dist unchanged) → it cannot cause a JS-behavior
  failure; PRE-EXISTING test/impl drift (impl is stricter than the test expects). Candidate
  backlog B-item: update lock-2b to assert the disabled Save button rather than click it.
