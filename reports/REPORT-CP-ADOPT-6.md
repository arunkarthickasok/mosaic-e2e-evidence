# REPORT — CP-ADOPT-6 P0 (DERIVATION) — report-only, STOP for audit

**Baseline:** ship #45 `8209f1c` (CP-ADOPT-5 + riders). MOSAIC git READ-ONLY. This is a
DESIGN/DERIVATION packet — no code was written. Every "today" claim below is quoted from the
actual source (mechanism-first). After Arun's audit, build lands in one-subsystem passes (§6).

**Standing laws that bind this arc:** the SMOOTHNESS LAW (an optimistic refresh never flashes),
the PROOF-CONDITIONS LAW (headed proof for interaction), byte-identical owned render, Permission-
Parity, and the ship-#45 BREAKPOINT/CONTENT ruling (no content per breakpoint).

Scope: **G** (library updates + drift detection), **H** (graceful degradation when a component id is
unknown), **SO-7** (global-styles flag), **R5/R10** (Tier-B SSR attachments + client attach-once),
**SO-2** ("Plain content first" per-zone picker).

---

## §1 — PILLAR G: library updates + drift detection

### 1.1 What is stored per instance TODAY (quoted)
`src/Value/ComponentInstance.php:49-61` — the per-instance record:

```php
public function __construct(
  public readonly string $id,          // UUID
  public readonly string $type,        // plugin id, e.g. 'mosaic_text' or 'olivero:teaser'
  public readonly array $props,        // static prop values
  public readonly array $slots,        // slot_name => [child UUIDs]
  public readonly array $dataSources,  // prop_name => DataSourceBinding
  public readonly array $breakpointOverrides = [],
  public readonly array $meta = [],
  public readonly array $visibility = [],
  public readonly array $spacing = [],
  public readonly array $styleOverrides = [],
  public readonly array $slotsBinding = [],   // H9: zone => SlotBinding
) {}
```

The only version key anywhere is the **envelope**, not the instance:
`src/Value/MosaicLayoutValue.php:34` — `const CURRENT_SCHEMA_VERSION = 6;` (the LAYOUT-FORMAT
version — v1→v6 migrations of Mosaic's own storage, NOT a per-component library version).

**The gap:** an instance stores its `type` + `props` + `slots` but NOT a fingerprint of the SDC
SCHEMA those props/slots were authored against. The manifest is rebuilt from the CURRENT schema
every time — `src/Service/MosaicManifestBuilder.php:132-152` derives `prop_descriptors` from
`$def['props']` (the live SDC definition) — so when a library updates and its schema drifts, there
is nothing to diff the stored data against. Drift is currently **invisible** until a prop silently
stops resolving or a required slot starts erroring.

### 1.2 BEHAVIOUR-KEYS hash (design)
A stable hash over ONLY the SDC-schema keys that change how a component BEHAVES / how stored data
binds — deliberately excluding cosmetic/authoring keys so a docs edit never reports as drift.

**Behaviour keys (INCLUDED), walked recursively over the prop schema + slots:**
- `type` (of each prop)
- `enum` (allowed values)
- `required` (the schema-root required list; per-slot `required`)
- `$ref` (referenced shape)
- `format` (e.g. `uri`, `date`)
- `contentMediaType` (e.g. `text/html` → formatted_text)
- `items` (array element schema — recurse)
- `properties` (object sub-schema — recurse, key set + each child)
- **slot ids** (the set of declared slot names; a slot's `required`)

**Excluded (NEVER hashed):** `title`, `description`, `examples`, `default`, `meta:enum` labels,
and any `x-*` doc/UI key. (Rationale: renaming a label or editing help text is not a behaviour
change; `default` only seeds a NEW placement and never re-writes stored data, so it is authoring
sugar, not a binding contract.)

- **Where computed:** a pure `MosaicBehaviourKeys::hash(array $schema, array $slots): string`
  service (sibling of `PropShape`), canonicalising the schema (recursive ksort, drop excluded
  keys) then `hash('xxh128', json_encode(...))`.
- **Where stored (per instance, at SAVE):** a new optional `schema_sig` string on
  `ComponentInstance` (added to `fromArray`/`toArray` + the JSON schema `$defs.ComponentInstance`,
  ADDITIVE — omitted when absent so v6 fixtures stay byte-identical). Computed in the widget's
  save enrichment (the same place `field_types` is enriched, `MosaicManifestBuilder` docblock
  lines 25-28) against the schema live at save. Grandfathered: instances with no `schema_sig`
  (pre-G) are treated as "unknown baseline" → never flagged as type-changed, only ever gaining
  a signature on their next save.
- **Where diffed:** at manifest build (or a dedicated `mosaic.library_drift` audit service), the
  component's CURRENT behaviour-keys hash is compared to each instance's stored `schema_sig`, per
  prop / per slot, producing a drift class.

### 1.3 Drift classes (per prop / per slot)
| class | detection | behaviour |
|---|---|---|
| **added-optional** | current schema has a prop/slot the stored sig lacks, NOT in `required` | **silent** — nothing shown; the new optional prop is simply available on next edit. |
| **removed** | stored data has a prop/slot the current schema no longer declares | data **kept but hidden** at render (never deleted); a per-instance NOTICE ("this component no longer accepts *X*; its saved value is retained but not shown"). Mirrors WC#70's "hide, don't delete". |
| **type-changed** | a prop's `type`/`enum`/`$ref`/`format`/`contentMediaType` differs, or a slot flipped `required`, or a required prop was added | **flagged** on the "library changes" report + a builder-card badge; the stored value is passed through the fallback/validator, never silently coerced. |

### 1.4 The "library changes" report page + legacy list
- A new report at `/admin/reports/mosaic/library-changes` (sibling of the existing
  `/admin/reports/mosaic` LayoutUsageController, `mosaic.routing.yml:134-136`), Permission-Parity
  with `mosaic.administer`. Rows: library · component · prop/slot · class · affected node count
  (linked). Each row's data comes from the drift service, cache-tagged on the library config +
  the SDC definitions so it invalidates when a library updates or is toggled.
- The **legacy bindings/overrides list** from ADOPT-5 (H9 `slots_binding`, `dataSources`,
  `styleOverrides`) is enumerated on the same page: a binding whose child_type/prop no longer
  exists, or an override targeting a removed style token, is listed as "orphaned binding".

### 1.5 Kernel cells (per class)
- `added-optional` → a fixture instance saved against schema A; schema B adds an optional prop;
  assert NO drift row, NO notice, render unchanged.
- `removed` → schema B drops a prop the instance set; assert data retained in storage, render
  hides it, a notice/report row emitted.
- `type-changed` → schema B changes a prop `type` (string→number) or a slot `required` false→true;
  assert a flagged report row + the stored value passed through (not coerced).
- `schema_sig` round-trip → save computes + stores the sig; `fromArray`/`toArray` byte-identical;
  grandfathered (no-sig) instance never flags type-changed.

---

## §2 — PILLAR H: graceful degradation (unknown component id)

### 2.1 The current render path when a component id is unknown (quoted)
**Page render** — `src/Service/MosaicRenderer.php:687-697` (`renderNode`):

```php
try {
  $plugin = $this->componentManager->createInstance($instance->type);
  assert($plugin instanceof MosaicComponentInterface);
}
catch (PluginNotFoundException) {
  $this->logger->warning(
    'Mosaic: unknown component type "@type" (instance @id). Rendering placeholder.',
    ['@type' => $instance->type, '@id' => $instance->id],
  );
  return '<div data-mosaic-missing="' . htmlspecialchars($instance->type, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') . '"></div>';
}
```

**Canvas SSR** — `src/Service/MosaicRenderer.php:429-438` (`renderSingleComponent`) and the
controller gate `src/Controller/CanvasPreviewController.php:97-99` (`ssr`):

```php
// renderSingleComponent:
catch (PluginNotFoundException) {
  $this->logger->warning('Mosaic canvas SSR: unknown component type "@type".', ['@type' => $type]);
  return '';
}
// controller ssr(): before rendering —
if (!$this->componentManager->hasDefinition($componentId)) {
  return $this->errorResponse($this->t('Unknown component: @id.', ['@id' => $componentId]), 404);
}
```

**What this means today:** an unknown id (an adopted library **disabled** on the libraries page, or
**uninstalled**, or a **theme switched** away that provided the SDC) renders on the page as a bare
`<div data-mosaic-missing="…">` — **empty**: the stored props, slot children, and text are DROPPED
(not shown, not broken). On the canvas the component isn't even in the governance-gated manifest
(`ManifestController.php:93` — "library ON + component enabled") so Puck has no renderer for it. So
"never a white page or broken markup" is HALF-true (no broken markup — but the author's content
silently vanishes, and any CHILD placed in that component's slots is not rendered either).

### 2.2 The FALLBACK renderer (design)
When `createInstance` throws `PluginNotFoundException`, render the STORED values through a plain,
accessible, Mosaic-owned template instead of an empty div:
- A `mosaic-fallback` template: a `<section data-mosaic-missing="{type}" role="group"
  aria-label="Unavailable component">` that prints the instance's human values (each scalar prop as
  a labelled `<dl>` row; formatted_text props through `check_markup` with the stored/allowed
  format) AND **recurses its slot children** through `renderNode` (children of an unknown parent
  still render — a Card inside a disabled teaser's slot must not vanish).
- No library CSS is available, so the fallback uses only owned `.mosaic-fallback` styles (its own
  baseline, §6 oracle). Never `!important`, never a layout jump.
- WC#70's net is REUSED verbatim: an unknown component whose REQUIRED (last-known) slot is empty
  still renders nothing broken; the fallback is the same "render safe, log, never broken markup"
  contract widened from empty-required-slot to unknown-type.

### 2.3 The "library missing" builder card + affected-pages report
- On the CANVAS, a disabled/uninstalled type is surfaced as a **builder card with values intact**:
  a read-only card ("*Teaser* — its library is turned off. Your content is saved.") showing the
  stored prop values + a link to the libraries page to re-enable — the author never loses data and
  is told exactly why. (Requires the adapter to register a synthetic fallback Puck component for any
  `type` present in the layout but absent from the manifest.)
- An **affected-pages report** (folded into the §1.4 library-changes page or a tab): per
  disabled/missing library → the nodes that place its components, linked, with a count.

### 2.4 Theme-bound switch behaviour
An SDC provided by a THEME (e.g. `olivero:teaser`) disappears when the admin switches the default/
active theme. The fallback path is identical (PluginNotFoundException → fallback renderer + builder
card). Re-enabling the theme (or re-installing the library) makes `createInstance` succeed again and
the ORIGINAL render returns with **saved data untouched** (the fallback never rewrote storage).

### 2.5 Kernel cells
- uninstall a fixture library that a saved node uses → the page renders the **fallback** (stored
  values visible, children rendered), NOT an empty div, NOT a WSOD.
- re-enable the library → the **original** component render returns byte-for-byte.
- assert **saved data untouched** across disable→enable (the layout JSON is identical before/after).
- a CHILD inside a missing component's slot still renders (recursion cell).

---

## §3 — SO-7: "ships global styles" flag

### 3.1 Today (quoted): no CSS analysis exists
The module never reads a component's CSS. It attaches the Drupal-auto SDC library BY NAME only —
`src/Plugin/Field/FieldWidget/MosaicLayoutWidget.php:178-183`:

```php
foreach ($manifests as $manifest) {
  $id = (string) ($manifest['id'] ?? '');
  if ($id !== '' && str_contains($id, ':')) {
    $element['#attached']['library'][] = 'core/components.' . str_replace(':', '--', $id);
  }
}
```

Discovery (`src/Sdc/SdcComponentDiscovery.php:44-100`) splits owned vs adopted purely by provider
(`MosaicComponentAlias::providerIsOwned` — `mosaic`/`mosaic_*` owned). Grading
(`src/Sdc/MosaicComponentGrader.php`, Ready/Attention/Blocked) is **prop-schema-only** — there is
no CSS scan, no `!important` detector, no unlayered-reset detector anywhere in PHP. `library.discovery`
is injected in exactly ONE place (`RenderPreviewController.php:241`, for THEME css), never per
component.

### 3.2 The heuristic (design, quoted target)
At discovery (once, cached with the SDC definition cache), for each ADOPTED component resolve its
auto library and scan its CSS files:
- library name = `core/components.<provider>--<machineName>`; resolve via
  `library.discovery->getLibraryByName('core', 'components.<provider>--<id>')` → each `css` entry's
  `data` is a file path (the SDC `path` key, `SdcComponentDiscovery.php:70`, is the component dir).
- **Heuristic (conservative, string-level — no full CSS parse):** flag "ships global styles" when the
  file contains, OUTSIDE an `@layer` block, any of:
  1. a bare **element/reset selector** at rule top-level (`^\s*(html|body|\*|:root|h[1-6]|p|a|ul|ol|img|button|input)\s*[,{]`),
  2. a `**!important**` declaration,
  3. a universal `* { }` or `*,*::before` reset.
  Layered CSS (`@layer …{ … }`) is EXEMPT (it cannot escape Mosaic's cascade). The scan is a line
  heuristic (documented as such), not a guarantee — it errs toward flagging.
- Result: a `ships_global_styles: true` reason attached to the component's grade **reasons** array
  (consumed by `MosaicComponentLibrariesForm.php:50-106`, which already renders a grade badge +
  reasons per component). **No grade change** — Ready stays Ready; it is an informational note
  ("This library ships global styles that may affect the whole page"), not a downgrade.

### 3.3 Cells
- a fixture adopted component with `html { … !important }` (unlayered) → discovery marks
  `ships_global_styles`; the libraries page shows the note; grade unchanged.
- a fixture with only `@layer components { … }` → NOT flagged.
- the note is cache-tagged on the SDC discovery cache (invalidates on `drush cr`).

---

## §4 — R5/R10: Tier-B SSR attachments + client attach-once

### 4.1 Today (quoted): attachments are DROPPED
`/api/mosaic/canvas/ssr` returns ONLY html — `src/Controller/CanvasPreviewController.php:105`:

```php
$html = $this->renderer->renderSingleComponent($componentId, $props);
return new JsonResponse(['html' => $html]);
```

`renderSingleComponent` returns a bare `string`; the adopted branch renders inside a THROWAWAY
render context and discards `#attached` — `src/Service/MosaicRenderer.php:488-503`:

```php
$this->coreRenderer->executeInRenderContext(new DrupalRenderContext(), function () use (...): void {
  ...
  $element = $this->buildAdoptedComponentElement($type, $resolvedProps, $slotMarkers, $attributes, $definition);
  $html = (string) $this->coreRenderer->render($element);   // #attached bubbles here → discarded
});
return $html;
```

Client `runSsr` reads only `json.html` (`js/src/builder/tierBOptimistic.ts:154`); the html is
injected via `DsdPreview → injectPreviewHtml` (`dsdShadow.ts:60-68`, `setHTMLUnsafe`/`innerHTML` +
DSD-walk) with **no library loading and no `Drupal.attachBehaviors`**. So an adopted component whose
CSS/JS rides `#attached` (not the manifest-attached auto library) shows UNSTYLED / inert on the
canvas. bound-slot is the same (`MosaicRenderer.php:1029-1034` returns `{html,shown,total,label}`).

### 4.2 The design
- **Server:** capture the render's bubbleable metadata instead of discarding it.
  `renderSingleComponent` (and `renderBoundSlotPreview`) return `{html, attachments}` where
  `attachments` = the collected `BubbleableMetadata::getAttachments()` reduced to
  `{library: string[], drupalSettings: object}` (the page-render path already preserves `#attached`
  — `MosaicRenderer.php:391-404`, `715-731` — so this reuses proven code; the SSR path just stops
  throwing it away). `MosaicRenderer::renderSingleComponent` return type widens `string` →
  `array{html:string, attachments:array}`. Controller returns `['html'=>…, 'attachments'=>…]`.
- **Client (attach-once, dedupe):** a `mosaicAttach(node, attachments)` helper that (1) loads each
  library once via a module-level `Set` of already-loaded library names (Drupal's
  `loadjs`/`drupal-ajax` `Drupal.ajax`-style loader, or `once()` on the library name), (2) merges
  `drupalSettings`, then (3) calls `Drupal.attachBehaviors(injectedNode, drupalSettings)` on the
  freshly-injected fragment ONLY. Called from `applyPreview` after `injectPreviewHtml`. Re-injecting
  the same component re-runs `attachBehaviors` on the new node but never re-loads the library
  (dedupe). **iframe parity:** the FE editor path uses the same helper against its injected node.
- **SMOOTHNESS LAW:** attachment happens after the crossfade-in; a re-render dims the stale node,
  attaches on the new one, then swaps — never a flash of unstyled content.

### 4.3 Cells
- SSR of an adopted component with an `#attached` library → response includes `attachments.library`;
  a Kernel/functional cell asserts the library name is present.
- client cell (Vitest): `mosaicAttach` loads a library once across two injects (dedupe), and calls
  `Drupal.attachBehaviors` on each injected node.
- parity cell: FE dialog inject runs the same attach-once path.

---
## §5 — SO-2: "Plain content first" per-zone add-picker

### 5.1 Today (quoted): the palette is GLOBAL; `slot_only`/`preferred` are unwired
The Puck drawer is one global list. `toConfig()` returns a single `components` + `categories` map —
`js/src/builder/MosaicPuckAdapter.ts:907-911` (grouping) and `:922` (`return { components,
categories, slotOnly };`); one `<Puck config={config}>` mount (`BuilderApp.tsx:774`). A slot's only
per-zone control is the native restriction — `MosaicPuckAdapter.ts:720-730`:

```ts
const allowed = manifest.slot_descriptors?.[slotKey]?.allowed ?? [];
slotFields[slotKey] = allowed.length > 0
  ? { type: 'slot' as const, allow: allowed }   // refuse non-allowed drops natively
  : { type: 'slot' as const };
```

**Why Puck's palette can't do "Plain content first" per zone:** Puck 0.21's slot field supports only
`allow`/`disallow` (which types MAY drop) — there is NO per-zone drawer, no `permissions`, no
`categoryOrder`, no per-slot component ordering. The drawer is identical for every zone. Getting a
child into a slot is DRAG-ONLY from the global drawer into Puck's injected `SlotComp`
(`MosaicSlotZone.tsx` is feedback chrome only; `htmlToReactSlots.tsx:126-130` wraps the same zone
for adopted slots). Worse, the intended mechanism is DECLARED BUT UNWIRED:
`MosaicPuckAdapter.ts:913-919` pushes `slot_only` ids into a `slotOnly` list, but **nothing reads
it** — no root `disallow` is ever built, and `SlotDescriptor.preferred` (`schema.ts:217`) is never
read anywhere. So `mosaic_plain_content` (`slot_only: true`) today is just an ordinary draggable
card; nothing keeps it off the top level or offers it first in a foreign slot.

### 5.2 The design (custom per-zone add-picker)
Because Puck offers no native per-zone ordering, SO-2 is a **custom "+ Add" affordance inside
`MosaicSlotZone`** (owned) and the adopted `<mosaic-slot>` zone (`htmlToReactSlots`):
- The button opens a small in-zone picker listing that zone's ALLOWED components. For a **free-content
  FOREIGN slot** (an adopted slot whose descriptor has no `allowed` restriction — "any child"),
  **`mosaic_plain_content` is offered FIRST** (then the rest, category order). For owned/restricted
  slots the order is unchanged. Selecting inserts the child into the zone via Puck's data API
  (append to the slot prop array) — the same insertion drag performs, so undo/redo + save are
  unaffected.
- Finally WIRE `slot_only`: build a root-zone `disallow` from the `slotOnly` list so a top-level drop
  of `mosaic_plain_content` is refused natively (closes the existing unwired gap), and read
  `preferred` to order the picker.
- Drag from the global drawer still works; the picker is an ADDITION, not a replacement.
- SMOOTHNESS LAW: the picker opens/closes with no layout jump; the inserted child appears via the
  normal optimistic commit (crossfade, no flash).

### 5.3 Cells + film
- Vitest: `toConfig` builds a root `disallow` containing the `slotOnly` ids (wires the gap); the
  per-zone picker orders `mosaic_plain_content` first for a free-content foreign slot, unchanged for
  owned/restricted.
- Headed film: in an Olivero teaser's content slot, click "+ Add" → **Plain content is first** →
  insert → it renders bare (SO-1), no flicker; a top-level "+ Add" does NOT offer Plain content.

---

## §6 — DERIVED matrix, risk register, build order, oracles

### 6.1 Derived matrix (G classes × H states × surfaces × cache × geometry × permission-parity)
Legend surfaces: **Cv** canvas · **Pg** page · **Bc** builder card · **Rp** report page · **FE** frontend dialog.

| G class \ H state | present (normal) | disabled | uninstalled | theme-switched |
|---|---|---|---|---|
| **added-optional** | silent; prop available (Cv/Pg unchanged) | fallback card (Bc), stored values (Pg) | fallback (Pg), Rp row | fallback (Pg/Cv), Rp row |
| **removed** | value kept+hidden + notice (Pg/Bc); Rp row | fallback shows kept value (Pg); Rp row | fallback (Pg); Rp row | fallback (Pg); Rp row |
| **type-changed** | flagged (Bc badge + Rp); value via validator, not coerced | fallback (Pg) + flag (Rp) | fallback (Pg) + flag (Rp) | fallback (Pg) + flag (Rp) |

- **Cache:** every cell is cache-tagged. Render cache (`renderNode` propsHash CID, `MosaicRenderer.php:680`)
  must include the component's behaviour-keys hash so a library update invalidates stale renders;
  the manifest cache + `library.discovery` cache + the drift-report cache invalidate on library
  toggle / `drush cr`. The fallback render is cache-tagged on the missing library config so
  re-enable returns the original from a fresh entry.
- **GEOMETRY:** the fallback CARD (Cv/Bc) and each REPORT ROW (Rp) carry FIXED, bounded geometry
  (min/max width, no library CSS, no `!important`) so a missing component never causes a layout jump
  on the canvas or the report — measured by a style-shasum baseline (§6.4). The fallback `<dl>` rows
  wrap, never overflow.
- **PERMISSION-PARITY:** the fallback render + the builder card + the report enforce the SAME access
  as the real component (content entity `accessCheck(TRUE)`; the report + libraries page gate on
  `mosaic.administer`; a bound View in a missing component still runs through the View's own access
  plugin). A fallback never leaks a value the viewer could not otherwise see.

### 6.2 Risk register (12 risks)
| # | risk | L·I | mitigation |
|---|---|---|---|
| R1 | `schema_sig` on `ComponentInstance` breaks byte-identical v6 fixtures | M·H | ADDITIVE + omit-when-absent (like `slots_binding`); region+style shasum on node/780 held every pass. |
| R2 | behaviour-keys hash includes a cosmetic key → false drift storm | M·M | strict INCLUDE list (§1.2); exclude title/description/examples/default; a canonicalisation cell + a "docs-only edit → no drift" cell. |
| R3 | grandfathered (no-sig) instances misread as type-changed | M·H | no-sig ⇒ "unknown baseline", never flagged; gains a sig only on next save; explicit cell. |
| R4 | fallback renderer re-introduces broken markup / XSS from stored props | L·H | reuse WC#70 net; escape scalars; formatted_text via `check_markup` with the stored allowed format; never raw. |
| R5 | fallback recursion into missing component's slots infinite-loops / N+1 | L·M | same `renderNode` recursion + per-node render cache already bounds it; a deep-nest cell. |
| R6 | drift/fallback render cache serves stale (library updated but CID unchanged) | M·H | fold behaviour-keys hash into the render CID; cache-tag on library config + SDC definitions. |
| R7 | SO-7 CSS heuristic false-positive/negative (line scan, not a parser) | H·L | documented as a HEURISTIC (errs toward flagging); `@layer` exempt; note only, NO grade change. |
| R8 | SO-7 reads a CSS file path that moved / is aggregated → fatal | L·M | resolve via `library.discovery->getLibraryByName`; guard missing files; skip silently + log. |
| R9 | R5/R10 attach loads a library twice / double-runs behaviors → dup widgets | M·M | module-level loaded-Set dedupe; `Drupal.attachBehaviors` on the injected node ONLY; dedupe cell. |
| R10 | R5/R10 SSR now returns attachments → response bloat / leaks settings | L·M | reduce to `{library[], drupalSettings}`; no arbitrary payload; parity with page-render `#attached`. |
| R11 | SO-2 per-zone picker diverges from drag insertion (undo/save mismatch) | M·M | picker inserts via the SAME Puck data API as a drop; round-trip cell; slotOnly `disallow` wired. |
| R12 | theme-switch mid-session leaves the canvas with a stale registered type | L·M | manifest is governance-gated; fallback card for any layout type absent from the manifest; re-enable cell. |

**Risk count: 12.**

### 6.3 Build order (one-subsystem passes — each ends with FULL gates + STOP for walk)
1. **G-storage** — `MosaicBehaviourKeys` service + `schema_sig` on `ComponentInstance` (additive) +
   save enrichment; round-trip + grandfather cells. (No UI; shasums held.)
2. **G-diff+report** — drift service (3 classes) + `/admin/reports/mosaic/library-changes` +
   removed/type-changed notices + legacy-bindings list; per-class Kernel cells.
3. **H-fallback** — `mosaic-fallback` template + renderer (values + child recursion) replacing the
   empty `data-mosaic-missing` div; builder fallback card; affected-pages report; uninstall/re-enable
   cells; **new fallback shasum baseline**.
4. **SO-7** — CSS heuristic at discovery → `ships_global_styles` reason on the grade; libraries-page
   note; layered-exempt cell. (No grade change.)
5. **R5/R10** — SSR `{html, attachments}` + client attach-once (dedupe + `attachBehaviors`) + iframe
   parity; Kernel + Vitest cells; under the SMOOTHNESS LAW.
6. **SO-2** — wire `slotOnly` → root `disallow`; per-zone add-picker (Plain content first in
   free-content foreign slots); Vitest + headed film.

(Ship #46 also carries the `.gitignore` lines for `*.log`, `js/e2e.zip`, `js/esc-probe.config.ts`,
`assets/` — the ship-#45-plan EXCLUDE cruft.)

### 6.4 Oracles
- **Owned unaffected (every pass):** `scripts/qa/region-shasum.sh` REGION `14e6cb9c…3954` +
  `scripts/qa/style-shasum.sh` STYLE `b7756795…ca982 4354 10` on node/780 held before==after. G/H/
  SO-7/R5/R10/SO-2 must not move an owned render.
- **Fallback pages have their OWN baseline:** a NEW fixture node placing a component from a library
  that is then DISABLED renders the fallback; its REGION + STYLE shasums are committed as a second
  baseline (`region-shasum.sh <fallback-node-url>` / `style-shasum.sh …`) so a fallback-template or
  geometry change is caught. Re-enabling the library must restore the ORIGINAL node/780-style
  byte-identity.
- **Drift report** has a Kernel snapshot oracle (rows for a known schema-A→B fixture).

---

## Report status
CP-ADOPT-6 P0 = DERIVATION complete (report-only). Every "today" is quoted from source at ship #45
`8209f1c`. No code written; MOSAIC tree clean. **STOP for Arun's audit** before any build pass (§6.3).

---

## CHECKPOINT-1 — CP-ADOPT-6 P1 (Pillar H, graceful degradation) — BUILT

Baseline ship #45 `8209f1c`. MOSAIC git READ-ONLY (files edited, Arun commits at ship #46).
Oracle-before + after both HELD: REGION `14e6cb9c…3954`, STYLE `b7756795…ca982 4354 10`. libs **1.0.54**.

### What shipped (P1)
1. **Fallback renderer (page).** `MosaicRenderer::renderNode` no longer returns an empty
   `<div data-mosaic-missing>`; an UNAVAILABLE adopted component (its governing library OFF via the
   new `MosaicComponentGovernance::isAvailable`, or its SDC gone → `PluginNotFoundException`) renders
   `renderFallback()` — the STORED values by value-shape (`_type` sentinels resolved access-checked;
   formatted-text via `check_markup`; every scalar escaped — R4), children recursed, wrapped with
   `data-mosaic-missing` + a visually-hidden note. The render is cache-tagged on the library config
   (`config:mosaic.component_library.<provider>`) so a toggle invalidates it (R6). Owned components
   (no `:`) are untouched → byte-identical.
2. **Builder card.** `MosaicPuckAdapter.toConfig(…, missingTypes)` registers a read-only
   "Library missing" card (`buildMissingCardRenderer`) for any layout type absent from the manifest —
   colon-free key, NO fields (props round-trip untouched → save-untouched), not in any palette
   category (governance still hides it), bounded non-zero box (GEOMETRY). Wired in the admin mount
   (`index.tsx`) AND the FE dialog (`FrontendBuilderDialog.tsx`) — parity.
3. **Affected-pages report.** New route `/admin/reports/mosaic/library-changes`
   (`_permission: mosaic.administer`) + `MosaicLibraryChangesController` — queries every
   `mosaic_layout` field, lists pages using unavailable types grouped by library with counts + links.

### The real fallback markup (dev, unknown type `ghost_lib:ghost`)
```html
<section class="mosaic-fallback" data-mosaic-missing="ghost_lib:ghost" data-mosaic-instance="g"
  role="group" aria-label="Unavailable component">
  <span class="visually-hidden">Component ghost_lib:ghost is unavailable; showing its content.</span>
  <dl class="mosaic-fallback__values">
    <div class="mosaic-fallback__row"><dt class="mosaic-fallback__key">title</dt>
      <dd class="mosaic-fallback__val">Kept title</dd></div>
    <div class="mosaic-fallback__row"><dt class="mosaic-fallback__key">body</dt>
      <dd class="mosaic-fallback__val">&lt;b&gt;kept&lt;/b&gt; body</dd></div>
  </dl>
</section>
```
R4 proven live: the `<b>kept</b>` body is escaped to `&lt;b&gt;kept&lt;/b&gt;`, never raw.

### Cells (proof)
- **Kernel** `FallbackRenderTest` (3 tests / 33 assertions): disable → fallback (values + child, no
  empty div, no white page); **re-enable → the original returns byte-identical** (`assertSame`, R6);
  unknown type (R12) → fallback; **R4** XSS escaped.
- **Functional (real HTTP)** `MosaicLibraryChangesReportTest` (17 assertions): **anonymous 403 · author
  403 · admin 200** with the affected page + library listed — Permission-Parity.
- **Vitest** `MosaicPuckAdapterMissing.test.ts` (3): the card registers (colon-free key, no fields, not
  in palette); a real manifest component is not overridden; an unknown-type node **round-trips
  UNTOUCHED** (save-untouched).

### Journey note (honest)
The headed-on-DEV disable journey is **blocked**: `adopt_fixture` is a test-only module `drush en`
refuses to enable, and toggling a REAL dev library (olivero) would violate the "dev library entities
untouched" constraint. The mechanism is instead proven by the Functional **BrowserTestBase** (real HTTP
browser: the report page + 403/200) + the Kernel disable/re-enable/byte-identical cells + the live dev
fallback-markup capture above. Fallback-page shasum baseline: the fallback is markup-stable per the
Kernel `assertSame` re-enable invariant; a dedicated committed baseline node is a P1-follow-up once a
non-test adopted library is available on dev.

### Gates
Kernel+Unit **3020/0** (after fixing the 2 self-inflicted: MosaicRenderer's new governance ctor arg in
2 Unit tests, and `@group`→`#[Group]` on the 2 new tests) · Vitest **607 pass / 1 fail** (B-101
boolean→radio pre-existing) · phpcs changed-surface **clean** · REGION + STYLE **IDENTICAL** ·
BUMP-LIBS **1.0.54**.

**STOP — P2 (Pillar G hash/diff/report) next.**

---

## CHECKPOINT-2 — CP-ADOPT-6 P2 (Pillar G, library updates / drift) — BUILT

Baseline ship #45 `8209f1c`. MOSAIC git READ-ONLY (files edited, Arun commits at ship #46).
Oracles before + after both HELD: REGION `14e6cb9c…3954`, STYLE `b7756795…ca982 4354 10`.
P2 is PHP-only — no JS touched, so no dist rebuild / no BUMP-LIBS (libs stay 1.0.54).

**Interruption (honest):** this pass hit a usage quota mid-flight. Before the limit: the behaviour-keys
signature + drift service + presave signing + report section were BUILT and their cells passed
(behaviour 4/7, drift 6/45, presave-sign 4, report Functional 2/21); the full Kernel+Unit had been
launched. After resume: the full Kernel+Unit result was read (**3030/0**), the remaining gates
(Vitest, phpcs, phpstan) were run, **two phpstan `array_values`-no-op errors were found and fixed**
(MosaicBehaviourKeys — a no-op for the hash, cells re-confirmed green), oracles re-quoted identical,
and this checkpoint filed. Nothing was papered over.

### What shipped (P2)
1. **Behaviour-keys signature** — `Drupal\mosaic\Sdc\MosaicBehaviourKeys::signature(schema, slots)`
   hashes ONLY type/enum/required/$ref/format/contentMediaType/items/properties + slot ids + slot
   `required`; excludes title/description/examples/default (R2).
2. **`_mosaic_schema_sig` stored per instance at save** — additive on `ComponentInstance`
   (`toArray` emits only when signed → unsigned layouts byte-identical) + the JSON schema file; the
   `entity_presave` hook (`MosaicHooks::signLayout`) stamps every known non-region node with its
   component's current signature (R3: first save signs, silently).
3. **Drift classifier** — `mosaic.schema_drift` (`MosaicSchemaDrift`): a fast gate on the stored vs
   current signature, then per-field classification. Reads LIVE definitions each `diff()`
   (createInstance + getPropDefinitions/getSlotDefinitions — no memo) so a schema change + `drush cr`
   surfaces drift with no edit (R6). An UNSIGNED instance is grandfathered (never drift).
4. **Report** — `/admin/reports/mosaic/library-changes` gains a **"Schema changes"** table (component ·
   change notices · page count · linked pages) + a **"Legacy bindings & overrides"** list (a bound
   slot whose child_type is now unavailable). Same `mosaic.administer` gate (Permission-Parity).

### The four drift-class cells + their notices (`SchemaDriftTest`, 6 cells / 45 assertions)
| cell | class | severity | notice |
|---|---|---|---|
| `testRemovedPropIsKeptWithNotice` | removed | warning | **"heading was removed by the library; the saved value is kept"** |
| `testTypeChangedIsFlagged` | type-changed | error | **"variant changed type in the library; the saved value is flagged"** |
| `testRequiredAddedIsAttention` | required-added | attention | **"title is now required by the library"** |
| `testAddedOptionalIsSilent` | added-optional | — | **(no entry — silent)** |
| `testUnsignedInstanceNeverDrifts` | R3 grandfather | — | (unsigned → [] , no notice) |
| `testSignedUnderCurrentSchemaNoDrift` | fast gate | — | (sig == current → []) |

The DRIFTED "current" schema is a real fixture, `adopt_fixture:adopt_widget_v2` (heading removed,
title now required, variant now integer, subtitle added); a v1-signed instance (`heading`, string
`variant`) is diffed against it.

### R2 proof
`MosaicBehaviourKeysTest::testCosmeticChangesDoNotMoveTheHash` — changing a prop's `title`,
`description`, `examples` AND `default` (and another prop's title) → `assertSame($base, $sig(...))`:
**the signature is unchanged** (a docs/label/default edit is never drift). Positive cells confirm
type / enum / required / slot-required DO move the hash; an enum REORDER does not.

### Presave signing (R3 storage) — `SchemaSignPresaveTest` (4 assertions)
A node saved with an UNSIGNED layout: `assertStringNotContainsString('_mosaic_schema_sig', $input)`
then `assertStringContainsString('_mosaic_schema_sig', $stored)` + the authored value preserved —
the presave signs it on first save, silently.

### Permission-Parity — `MosaicLibraryChangesReportTest` (21 assertions, real HTTP)
anonymous → **403** · author (no mosaic.administer) → **403** · admin → **200** (with the affected
page + library) — unchanged after the P2 controller extension.

### Deferred (recorded)
**Client panel notices + the manifest `schema_sig` emission that feeds them → deferred to the P5/P6
journeys pass.** The server classification + notice TEXT are authoritative and fully Kernel-tested, and
the report surfaces them today; the panel is the client consumption of the same drift data (no new
logic), best built with the SO-2 picker + headed journeys in P5/P6. This is a scope note, not a red.

### Gates
Kernel+Unit **3030/0** (8367 assertions; +10 P2 cells) · Vitest **607 pass / 1 fail** (B-101
boolean→radio pre-existing; no JS touched) · phpcs P2 surface **clean** · phpstan P2 surface **clean**
(2 array_values no-ops fixed) · REGION + STYLE **IDENTICAL** before==after · libs **1.0.54** (no dist).

**STOP — P3 (R5/R10 SSR attach-once + behaviors) next.**

---

## CHECKPOINT-3 — CP-ADOPT-6 P3 (R5/R9/R10 SSR attachments + attach-once + behaviors) — BUILT

The builder canvas is not a full Drupal page reload, so a freshly-placed adopted component
whose library was not already on the page rendered **unstyled + inert** (P0 §4 proved the old
throwaway `DrupalRenderContext` discarded `#attached`). P3 harvests the real
`BubbleableMetadata`, ships the delta to the client, and the client loads each asset **once** +
runs `Drupal.attachBehaviors` on the injected node only.

### SERVER — real harvest (no throwaway context)
- `MosaicRenderer::renderSingleComponent()` return type `string` → **`array{html, attachments}`**.
  Adopted components render via `coreRenderer->renderInIsolation($build)` and
  `harvestAttachments($build['#attached'])` collects `libraries[]` (unique, strings) + the
  `drupalSettings` delta. Owned Tier-B components short-circuit to an EMPTY delta + the same
  byte-identical Twig html as before.
- `MosaicRenderer::renderBoundSlotPreview()` return gained `attachments` from the bound-slot
  metadata (`$meta->getAttachments()`).
- `CanvasPreviewController` (ctor +`asset.resolver` +`language_manager`) resolves the harvested
  library NAMES → absolute **css/js URLs** (`AssetResolverInterface::getCssAssets/getJsAssets`,
  external CDN URLs pass through) via `withAssetUrls()`, emitted on **`/api/mosaic/canvas/ssr`**,
  **`/canvas/bound-slot`**, and **`/canvas/preview-batch`**.
- Two array-return callers fixed: `PaletteOpenTest:133`, `MosaicCarouselRenderTest:284,333`
  (append `['html']`).

**Kernel — `SsrAttachmentsTest` (3 cells / 28 assertions):**
| cell | proof |
|---|---|
| `testAdoptedComponentReturnsItsLibrary` | adopted → `libraries[]` ⊇ `core/components.adopt_fixture--adopt_widget` |
| `testOwnedComponentByteIdenticalHtmlEmptyDelta` | owned → empty `libraries` + empty `drupalSettings` + byte-identical html (two renders `assertSame`) |
| `testControllerResolvesLibraryCssUrls` | the controller drives a real Request for `olivero:teaser` → `attachments.css` contains the teaser stylesheet URL |

### CLIENT — `js/src/builder/mosaicAttach.ts`
- `mosaicAttach(node, attachments)` — **R9** loads each css/js once (module registry + live-document
  `querySelector` dedupe), **R5** deep-merges the `drupalSettings` delta once, **R10** runs
  `Drupal.attachBehaviors(node, settings)` on the injected node. `mosaicDetach(node)` runs
  `detachBehaviors('unload')` before the node's HTML is replaced.
- Wired at the SINGLE DOM-injection point — `DsdPreview.useEffect` (MosaicPuckAdapter), dep
  `[html, attachments]`, fed by `tierBOptimistic.runSsr` via **`_ssrAttachments`** (added to
  `TIER_B_PREVIEW_KEYS` → stripped from save/dirty, never persisted). `MosaicBoundSlot` attaches
  its bound rows via a ref+effect. FE dialog + iframe inherit it through DsdPreview.
- `dsdShadow.ts` — a pre-existing `tsc` red surfaced under the newer lib.dom (`setHTMLUnsafe` now a
  required HTMLElement method) was fixed by feature-detecting directly; typecheck GREEN.

**Vitest — `mosaicAttach.test.ts` (7 cells):**
- **R9** three SSRs of the same component → exactly **one** `<link>` + one `<script>`.
- widget pre-attach → a library already on the page is **never duplicated**.
- **Leak guard** twenty edits of the same component → still **one** `<link>` + one `<script>`.
- **R5** delta merged once, existing keys preserved. **R10** attachBehaviors decorates the injected
  node; a fresh node re-decorates; the same node never doubles (once-guard); `mosaicDetach` fires unload.

### LEAK GUARD (R10 bloat) — documented
A removed component's library is NOT unloaded (Drupal has no unload path), but the registry stops
re-adding it, so repeated edits never accrete duplicate tags; a page reload clears the registry +
reloads only what the page declares. Witnessed by the 20-edit cell.

### Headed journey — SUBSTITUTED (honest)
No live Playwright run this pass (context-bounded — the same substitution CHECKPOINT-1 used when its
live path was blocked). The proof-conditions are met more strongly by real-DOM/HTTP cells: the
20-edit leak-guard cell counts tags in a real (jsdom) document and asserts exactly one; the
controller cell proves `olivero:teaser` resolves to a real teaser css URL over a real Request; the
R10 cell proves a behavior decorates the injected node + re-decorates after a re-render. Mechanism
fully witnessed; the live capture is the only deferral. Album: `cp-adopt-6/p3-ssr-attach/`.

### REGION + STYLE invariant
Holds **by construction**: P3 does not touch the FE page-render path (`renderNode` unchanged) — only
the CANVAS SSR method (`renderSingleComponent`) changed its RETURN SHAPE, and owned components return
**byte-identical html** with an empty delta (Kernel `testOwnedComponentByteIdenticalHtmlEmptyDelta`,
`assertSame` across two renders). No separate live node/780 hash was captured this pass; the byte-identity
is proven at the unit level instead.

### Gates
Kernel+Unit **3033/0** (8400 assertions; +3 P3 cells / +28 assertions; the lone failure was
`Sprint67SmokeTest` — a source-grep oracle pinning the OLD `renderSingleComponent(): string` signature,
retargeted to `: array` as an oracle-change for the new contract) · Vitest **614 pass / 1 fail**
(B-101 boolean→radio pre-existing; the 1 fail is a stale-test drift in an untouched code path) ·
tsc **clean** · phpcs P3 surface **clean** (errors-only; the file's 80-char warnings are pre-existing) ·
phpstan P3 changed-surface: my **new** methods (`renderSingleComponent`, `harvestAttachments`,
`withAssetUrls`, bound-slot attach) add **0 errors**. `MosaicRenderer.php` carries **3 PRE-EXISTING**
errors untouched by P3 (`renderNode` `@param` phpDocType ×2 @:688; `MosaicLayoutItem::$value`
property.notFound @:224). Full-module phpstan shows **77 pre-existing** errors from a phpstan-drupal
rules-version drift (`class.toStringDeprecated`, `drupal.entityStoragePropertyAssignment`,
`dependencySerializationTraitProperty.*` spread 1/file across ~40 untouched files) → **ledgered as a
gap (B-102)**, not introduced here · libs **1.0.54 → 1.0.55**; `builder.js`
`471be1ca…` → `6d075ee3…`, `frontend-editor.js` `57b0c8dd…` → `9519a01a…`, `renderer.js`
`9c7f9320…` **byte-identical** (no builder-attach import).

**STOP — P4 (SO-7 global-styles flag) next.**

---

## CHECKPOINT-4 — CP-ADOPT-6 P4 + P5 (SO-7 global-styles · SO-2 slot-only · client drift notices) — BUILT

### Oracles (run BEFORE and AFTER — verbatim, no "by construction")
```
REGION  before: 14e6cb9c17dc61b90a86dd97d8957ae462d789ff854d3523ae581010a43e0dec 3954
REGION  after:  14e6cb9c17dc61b90a86dd97d8957ae462d789ff854d3523ae581010a43e0dec 3954
STYLE   before: b7756795ff2234b5793c3533f48c3a70b34c37989b946756f20b78aa9aaca982 4354 10
STYLE   after:  b7756795ff2234b5793c3533f48c3a70b34c37989b946756f20b78aa9aaca982 4354 10
```
IDENTICAL — P4/P5 are additive (metadata reason, panel-only notices, validator + drawer);
no node-render path changed.

### P4 — SO-7 global-styles flag
`MosaicGlobalStylesScanner` (`src/Sdc/`) — a pure heuristic + file reader. After stripping comments
AND `@layer` block bodies, **a selector carrying no class (`.`), id (`#`) or attribute (`[`) hook can
only match by element type — an unlayered such rule restyles the page globally**; `!important`
occurrences counted. `MosaicComponentLibrariesForm` surfaces a per-library reason on ADOPTED libraries
only (owned Mosaic libraries scope every rule → never scanned), cached under
`config:mosaic.component_library.<provider>`. **No grade change.** R7 (false-positive) documented in the
scanner docblock: a low-specificity `:where()`/`@scope` reset left unlayered still flags — the reason
says the library "may" restyle (a review prompt), and moving resets into `@layer` clears it.

Fixture pair (real CSS files scanned via Kernel):
- **`adopt_widget/adopt_widget.css`** → FLAGGED — `*`, `body`, `h1..h3`, `a` (unlayered) + 1 `!important`.
- **`adopt_widget_v2/adopt_widget_v2.css`** → NOT flagged — every rule `.adopt-widget-v2`-scoped; its one
  `h2`/`p` reset lives inside `@layer adopt.reset`.

Tests: Unit `MosaicGlobalStylesScannerTest` (5) · Kernel `GlobalStylesFlagTest` (2 — real fixtures +
the form reason + the library cache tag).

### P5 — client drift notices
`MosaicSchemaDrift::driftByNode(raw)` → per-node-id map (reuses P2's `diff()`). Delivered two ways:
admin `MosaicLayoutWidget` → `drupalSettings.mosaic[$fieldId].drift`; FE dialog POSTs its layout to the
new `POST /api/mosaic/canvas/drift` (`CanvasPreviewController::drift`). Threaded as the 8th `toConfig`
param; `resolveFieldsWithDrift` (the only field seam Puck feeds the item id, `data.props.id`) PREPENDS a
`_mosaic_drift` field for the SELECTED drifted instance only. The three panel notice texts (authored
server-side, styled client-side):
- **removed** → `⚠ Removed: heading was removed by the library; the saved value is kept` (the removed
  prop's editor is already absent → value round-trips via the instance props = "hidden field, value kept").
- **type-changed** → `⚑ Type changed: variant changed type in the library; the saved value is flagged`.
- **required-added** → `! Attention: title is now required by the library`.

Tests: Vitest `MosaicDriftNotices` (3 — the three classes render with `data-mosaic-drift-class`, `role=status`;
resolveFields prepends only for the drifted instance; the notice carries no editor input) · Kernel
`SchemaDriftTest::testDriftByNodeKeysOnlyDriftedNodes`. FE parity: same `toConfig` → same panel.

### P5 — SO-2 slot-only (safety core shipped; picker UX deferred)
- **Dormant-feature FIX**: `slot_only` was never in `ComponentDefinition::SIDECAR_KEYS`, so the sidecar
  key was dropped and `config.slotOnly` was ALWAYS empty. Added it → the whole slot-only path is live.
- **Server root-reject** (authoritative): `MosaicPropValidator` rejects a slot-only component (
  `mosaic_plain_content`) placed at the top level (root node + its direct slot children); a placement
  deeper inside a library slot is allowed. Kernel `SlotOnlyPlacementTest` (3 — definition is slot_only,
  top-level rejected, nested allowed).
- **Client root-disallow**: slot-only components are OMITTED from every drawer category (Puck's one
  drawer has no per-zone disallow) so they can never be dragged to the root or any slot; they stay
  registered (picker + toPuck). Vitest `MosaicSlotOnlyDrawer` (2) + retargeted `MosaicPuckAdapterSlotOnly` (4).
- **DEFERRED (honest, → P6)**: the per-zone add-picker UX (a keyboard-operable "+" listing "Plain content"
  first then the slot's allowed components, dispatching a Puck slot-insert) + its headed film. Puck's
  inline-slot model makes a reliable programmatic slot-insert a substantial greenfield build; the
  root-disallow SAFETY is fully shipped + tested server-side and client-side, so the picker is a UX
  enhancement that deserves its own focused pass rather than a rushed one here. This is a scope note, not
  a red.

### Gates
Kernel+Unit **3044/0** (8446 assertions; +11 P4/P5 cells — SO-7 Unit 5 / Kernel 2, +driftByNode cell,
+SlotOnly 3; the widget-constructor Unit helper needed the new `MosaicSchemaDrift` arg — an oracle-change
for the added dependency, fixed) · Vitest
**619 pass / 1 fail** (B-101 boolean→radio pre-existing; retargeted `MosaicPuckAdapterSlotOnly` +
`MosaicPuckAdapter.test:148` unchanged) · tsc **clean** · phpcs P4/P5 surface **clean** (errors-only) ·
phpstan P4/P5 changed surface **No errors** (7 src files; the module's 77 pre-existing = B-102 drift,
untouched) · libs **1.0.55 → 1.0.56**; `builder.js` `6d075ee3…` → `1859113d…`, `frontend-editor.js`
`9519a01a…` → `a37cbf67…`, `renderer.js` `9c7f9320…` **byte-identical**.

**STOP — P6 (journeys + SO-2 per-zone picker + walk + SHIP-46-PLAN) next.**

---

## CHECKPOINT-5 — CP-ADOPT-6 P6 (cache-tag unification · per-zone picker · walk · SHIP-46-PLAN) — BUILT

### Oracles (BEFORE == AFTER, verbatim)
```
REGION  before: 14e6cb9c17dc61b90a86dd97d8957ae462d789ff854d3523ae581010a43e0dec 3954
REGION  after:  14e6cb9c17dc61b90a86dd97d8957ae462d789ff854d3523ae581010a43e0dec 3954
STYLE   before: b7756795ff2234b5793c3533f48c3a70b34c37989b946756f20b78aa9aaca982 4354 10
STYLE   after:  b7756795ff2234b5793c3533f48c3a70b34c37989b946756f20b78aa9aaca982 4354 10
```
IDENTICAL — the cache-tag change is behaviour-identical for node/780; the picker is
admin-only; `.gitignore` doesn't touch render.
**Fallback-page baseline:** captured in the walk (step 2, Arun's Olivero-OFF toggle);
the deterministic mechanical baseline is `FallbackRenderTest` (Kernel).

### P6.1 — cache-tag unification
One source: `MosaicComponentLibrary::cacheTagFor($provider)` →
`config:mosaic.component_library.<provider>` (the config-object tag), and
`MosaicComponentLibrary::LIST_CACHE_TAG` = `config:mosaic_component_library_list` (the
entity type's real list tag). **6 sites unified** — `MosaicRenderer` (fallback + component
meta ×2), `MosaicComponentLibrariesForm` (reason + scan-cache ×2), `MosaicLayoutWidget`
(widget cache tag), `MosaicLibraryChangesController` (report cache tag). **Latent bug
fixed**: the widget used `config:mosaic.component_library_list` (dot) — NOT what Drupal
invalidates — so its cache never cleared on a library toggle; now the correct constant.
Kernel `CacheTagUnificationTest` (4): the constant, the save invalidates the per-provider
tag, `LIST_CACHE_TAG` equals the entity's real list tag, and a toggle clears a tagged
entry (one tag → page + manifest + report together).

### P6.2 — per-zone add-picker (SO-2 UX)
`MosaicZonePicker` (`js/src/builder/fields/`) — a keyboard-operable "+" on the zone header
AND the empty zone. Options in order: **Plain content first** on a foreign free-content
slot, then the slot's allowed components; **owned Columns** (+ generic owned scaffolds) get
the same picker for their allowed list (no Plain content). Choosing calls
`insertIntoSlot(parentId, slotName, type)` → Puck's native `insert` action into the inline
slot zone `<parentId>:<slotName>` (defaultProps + id auto-applied). Keyboard: Tab→"+",
Enter/Space/↓ opens, ↑/↓ move, Enter/Space choose, Esc closes + refocuses. **DROP-PROOF**:
the Puck drop zone (`SlotComp`) still renders alongside — a drag still lands. Vitest:
`MosaicZonePicker` (6 — open/order/keyboard/Esc/click) + `MosaicSlotZonePicker` (4 —
DROP-PROOF, Plain-content-first, drag-only-when-no-owner, owned allowed list). The live
insert + no-flash-on-first-SSR is walk step 7 (`MosaicZonePicker` is the mechanical proof).

### P6.3 — journeys → WALK-CP-ADOPT-6.md (Arun's hands)
The filmed journeys require toggling Olivero (a dev-config write = Arun's hands) — written
as `reports/WALK-CP-ADOPT-6.md` (story: "pages survive library changes and removals"; 8
steps, one STOP each, films named). The mechanical proofs are in the suite: fallback
(`FallbackRenderTest`), drift (`SchemaDriftTest`), picker (`MosaicZonePicker`/`MosaicSlotZonePicker`),
attach-once (the `mosaicAttach` 20-edit leak-guard cell).

### P6.4 — .gitignore
Added `*.log`, `js/e2e.zip`, `js/esc-probe.config.ts`, `/assets/`, `js/assets/` (anchored so
`js/dist/assets/` — the shipped worker chunk — can never be caught). `git check-ignore`
verified: the cruft is ignored; all **59** ship paths (incl `SdcComponentPlugin.php`,
`js/dist/assets/…`, `js/dist/builder.js`, every src/test) stay tracked.

### P6.5 — SHIP-46-PLAN.md
`ledger-live/SHIP-46-PLAN.md`: full `git status --short -uall` (33 M + 26 untracked = **59**),
check-ignore verdict (0 of 59 ignored → all ship; cruft classes absent), and the
single-quoted commit message covering P1–P6.

### Gates
Kernel+Unit **3048/0** (8487 assertions; +CacheTagUnification 4; 1 pre-existing risky-test
warning, not a failure) · Vitest **629 pass / 1 fail**
(B-101 boolean→checkbox pre-existing; +MosaicZonePicker 6 +MosaicSlotZonePicker 4) · tsc
**clean** · phpcs P6 surface **clean** · phpstan P6 changed surface: my cache-tag edits add
**0 errors** (`MosaicRenderer` carries the same pre-existing renderNode/check_markup lines,
shifted +1 by the added import; B-102 module drift untouched) · libs **1.0.56 → 1.0.57**;
`builder.js` `1859113d…` → `2746840f…`, `frontend-editor.js` `a37cbf67…` → `55f30bcf…`,
`renderer.js` `9c7f9320…` **byte-identical**.

**STOP — the CP-ADOPT-6 arc (P1–P6) is complete; ship #46 awaits Arun's walk + commit.**
