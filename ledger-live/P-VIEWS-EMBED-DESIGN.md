# CP-VIEWS-EMBED — "View Display" component design (DRAFT for Arun ratification)

**Authored:** 2026-09-01 (reviewer window, brainstorm session). **Owner:** Arun Karthick.
**Status:** DRAFT — nothing built, nothing chartered. Ratification = Arun's word. Repo overrules this file.

---

## 0. The one-line goal

Let a content author drag a **"View"** component onto the canvas, pick any Drupal View + display
from a human-labeled list in the right panel, wire its **contextual filters** from real page context
without touching the View, and have it render on the page **exactly as Views renders it** — with
relationships, exposed filters, pagers, AJAX and access all working — better than Drupal Canvas,
Layout Builder, or any contrib block-placement path does today.

---

## 1. Competitive reality (researched 2026-09-01 — the pain we obliterate)

- **Drupal Canvas** exposes Views *block displays* as components (WebWash, Jun 2026: "When you create a
  Views block, Drupal Canvas automatically exposes it as a component"). It inherits the **block-plugin
  context-mapping** model — the same model Layout Builder uses. That model is the decade-long sore:
  - AJAX/PHP errors when a views block with a contextual argument sits in the layout
    (core issue #3103970).
  - The context selector silently does not appear unless the argument has "Specify validation
    criteria" (core #3255977) — authors never discover it.
  - Views blocks with contextual filters vanish from the builder UI (core #3196319).
  - List-field contextual filter dropdowns render empty (core #3318434).
  - The community workaround is contrib (ctools_views #2759445, views_token_argument, custom blocks
    with a Views Reference field) — i.e. "install a plugin to pass a value".
  - "Only works on the full node route, not when the node is viewed elsewhere" (#2886116) — because
    the value comes from the ROUTE, not from the entity being rendered.
- The colleague's claim ("Canvas doesn't support relationships and contextual filters") is directionally
  right: relationships are irrelevant to the placement layer (they live inside the View and just work
  when the REAL Views executable renders), but **contextual filters through block-context mapping are
  brittle, limited to route-derived contexts, and author-hostile.**

**Mosaic's angle:** render the *real* View through Views' own executable (Twig-first, Drupal-idiomatic),
and give authors a **full argument-source matrix** in the panel — resolved from the **host entity
object**, not the route. That single design choice kills the "only on the full node page" failure
class and makes previews, revisions, unpublished drafts and templates all work.

---

## 2. Author experience (the panel — authors-first law applies)

Drag **"View"** from the palette. Canvas shows a **placeholder card** (Arun ruling: no live render by
default). Right panel:

1. **View** — searchable select, human labels only (`Recent articles`, never `recent_articles`),
   grouped by view; lists **enabled** views that have at least one embeddable display.
2. **Display** — dependent select (`Block: Sidebar list`, `Embed: Teasers`). Default = first
   embeddable display. Page/feed/REST displays excluded by default (ruling R-V2 below).
3. **Contextual filters** — appears ONLY if the chosen display defines any. One labeled row per
   argument (label = the argument's admin title, e.g. "Tags"), each with a **Source**:
   - **View default** — pass nothing; the View's own default-argument plugin runs (from URL, raw
     path, logged-in user, fixed…). Zero-config parity with everything Canvas can do.
   - **This page** — the entity the layout lives on: `ID` or a **field of this page** (entity-reference
     fields yield target ids; multi-value joins with Views `+` syntax). Resolved from the **entity
     object** at render time (works in preview/revision/draft/template contexts).
   - **Fixed value** — text/number input; when the argument validator is an entity type (node, term,
     user…) the input becomes an **autocomplete** (reuses `EntitySuggestController`), multi-value
     with `+` (OR) / `,` (AND) per Views syntax, shown as chips.
   - **URL parameter** — `?name=` query string mapping (route args are already covered by View default).
   - **Current user** — the viewer's uid.
4. **Display options** (collapsed group): Title (*View default / Custom / Hidden*) · Items per page
   (*View default / override N*) · Offset · **Hide when empty** (toggle; enterprise favorite).
5. **Preview results** button (opt-in): renders the actual view once, server-side, capped at N rows,
   into the placeholder card. Never automatic — the canvas stays fast.
6. **"Edit this view"** link (only for users with `administer views`) → opens the Views UI in a new tab.

Placeholder card content: view label · display label · argument summary line
("Tags: from this page · Author: view default") · "Renders on the published page".

Same panel and placeholder on **both** surfaces (admin builder + FE dialog) — one manifest source
(MosaicManifestBuilder), the F-087 law.

---

## 3. Architecture (Drupal-idiomatic, Mosaic-native)

### 3.1 Where it lives
`mosaic_views` submodule (exists; currently a data-source binder, unwalked). Two sibling capabilities
share one **argument-resolution service**:
- **`mosaic_view` component** — embeds a whole display (this design).
- **Views data source** (existing) — feeds view ROWS into a Mosaic-designed component (cards, grids).
  Headline differentiator: "use the View as data, design the cards in the builder."

### 3.2 Field types (reuses the Stage-2 `MosaicFieldType` machinery — no forks)
- `views_display` — cascading view→display select. Options served through the manifest (human labels,
  embeddable displays only). Per-user note: authors see all enabled views; the **viewer's** access is
  enforced at render.
- `views_arguments` — dynamic rows. On display change the adapter calls
  `GET /api/mosaic/views/{view}/{display}/arguments` (uncacheable, config-derived) → per-argument
  metadata: `id`, `title`, `validator` (plugin + entity type + bundles), `default_argument` plugin,
  `not_available` behavior, `multiple` allowed. Rows are built client-side from that metadata.
- Both types declared in `mosaic_view.mosaic.yml` → any developer component can embed a View
  (e.g. a "Tabbed views" component) via the same sidecar keys.

### 3.3 Render pipeline (server, Twig-first)
```
Views::getView($view_id)
  → $view->access($display_id)            // viewer access, view's own access plugin
  → $view->setDisplay($display_id)
  → $view->setArguments(ArgumentResolver::resolve($config, $hostEntity, $request, $account))
  → setItemsPerPage/setOffset if overridden; title mode applied to display option
  → $view->preExecute(); $view->execute()
  → hide-when-empty: if empty result AND no exposed input → return [] (log nothing)
  → $view->buildRenderable()               // full cacheability + #attached bubble
```
Relationships need **nothing** — Views owns its query. Exposed filters, pagers, AJAX, contextual
"when not available" behaviors are all Views' native behavior, because we call Views.

**Mosaic renderer contract to verify (witness before build):** component output must **bubble
`#attached`** (views/ajax, exposed-form libraries, pager) and **cacheability** (the view's tags,
contexts, max-age) through `MosaicRenderer` on every path (render, renderLazy/BigPipe, renderResponsive
breakpoint trees, SSR preview). The entity-ref render path already carries cache tags — confirm the
same for render arrays.

### 3.4 Cacheability derivation (per argument source)
| Source | Added cache contexts | Tags |
|---|---|---|
| View default | whatever the View declares (Views bubbles `route`/`url` itself) | view's |
| This page: ID / field | host entity already in the page's render context; add entity list tag if field-driven | view's + host |
| Fixed value | none extra | view's + referenced entities' tags |
| URL parameter | `url.query_args:<name>` | view's |
| Current user | `user` | view's |
Max-age: respect the View's cache plugin (tag/time/none). Never `|raw`; never `max-age 0` blanket.

### 3.5 Security & validation (the F-055 / F-075 / F-058 laws)
- **Save-time validation** (`MosaicPropValidator`): view exists & enabled; display exists & is
  embeddable; argument count ≤ defined; fixed entity values exist and are **viewable by the author**
  (no reference laundering); URL param names sanitized; items-per-page/offset are non-negative ints.
  Reject with typed JSON naming the row.
- **Render-time**: viewer access via `$view->access()`; arguments are strings handed to Views (Views
  performs its own SQL safety — we never build SQL); host-entity field values resolved through the
  existing entity data-source resolver with `access('view')` checks.
- **Graceful degradation** (F-058 class): view deleted/disabled later → component renders nothing,
  ONE watchdog warning with entity+field context, never a 500. Placeholder in the builder shows
  "View no longer exists" in red.
- **Permission-parity**: identical enforcement on admin preview, FE dialog preview, page render, anon.

---

## 4. Scenario matrix (Arun ruling: practical coverage, honestly labeled)

**SUPPORTED — must be green in tests**
- Display types: **block**, **embed** (default list); **page** displays optional (ruling R-V2).
- Row styles: fields, content (rendered entity), grid, table, unformatted, HTML list — pass-through.
- **Relationships**: any, any depth — Views owns the join.
- **Contextual filters**: 0..N, ordered; each with any of the 5 sources; multi-value (`+`/`,`);
  "when not available" behaviors (hide view / show all / summary / 404-not-applicable) pass through.
- **Exposed filters + sorts**: GET-based forms; AJAX forms when the View has `use_ajax`.
- **Pagers**: full/mini/some/none; AJAX pager with library bubbling.
- **Overrides** without editing the View: title mode, items per page, offset, hide-when-empty.
- **Access**: View access plugin (permission/role) enforced per viewer; anon parity.
- **Caching**: tag invalidation on content/config save; per-source contexts (3.4).
- **Host contexts**: node page, **preview**, **revision view**, **unpublished draft**, FE dialog,
  admin builder (placeholder), **templates** (component config travels; host-field args validate
  against the receiving bundle — missing field → warning + fallback to View default).
- **Breakpoint trees**: a View component inside a mobile/tablet tree renders per F-074 rules
  (suffixed ids — AJAX wrappers must not collide: dedicated cell).
- **Two instances** of the same View on one page: supported; exposed-form GET input applies to
  both (documented Views limitation, not ours).
- **Translation**: display titles/exposed labels follow config translation; arguments pass through.

**SUPPORTED WITH CAVEAT (documented)**
- Page displays (path/menu ignored when embedded) — opt-in.
- Views with `use_ajax` inside BigPipe/lazy paths — verify wrapper ids under `renderLazyResponsive`.

**OUT OF SCOPE v1 (explicitly)**
- Feed, REST export, attachment displays (not embeddable by nature).
- Editing the View inside the builder (link to Views UI instead).
- Interactive exposed forms inside the canvas preview (placeholder shows "has exposed filters").
- Nested Mosaic layouts inside View rows (rows render their own entities; Mosaic fields inside those
  entities already render via the formatter — no special work, but not a tested promise in v1).

---

## 5. What makes it the best (the delta vs Canvas / Layout Builder)

1. **Argument sources beyond the route**: host-entity fields, fixed values with entity autocomplete,
   query params, current user — no ctools_views, no token modules, no custom blocks.
2. **Resolves from the entity object, not the URL** → works in previews, revisions, drafts, templates.
3. **Authors-first**: human labels, grouped searchable picker, argument rows labeled by the View's own
   admin titles, machine names never shown.
4. **Save-time validation + graceful degradation**: bogus config can't be saved; deleted views can't
   500 a page.
5. **Overrides without touching the View** (title/items/offset/hide-when-empty).
6. **Opt-in live preview** in the canvas, capped — fast by default, real when you ask.
7. **Composable sibling**: the same argument resolver powers the Views *data source*, so an author can
   choose "embed the View's own display" OR "feed my designed card grid with the View's rows".
8. **Developer API**: `views_display` + `views_arguments` field types in any `.mosaic.yml` component.

---

## 6. Test derivation dimensions (Test-Coupling — derive, never sample)
display type × row style × relationships {none, one, chained} × arguments {0,1,N} × source
{default, page-id, page-field(single/multi), fixed(entity/plain, single/multi), url-param, user} ×
validator {entity:node, entity:term, numeric, none} × not-available {hide, all, summary} × exposed
{none, GET, AJAX} × pager {none, mini, full, ajax} × overrides {title×3, items, offset, hide-empty} ×
access {viewer allowed, denied, anon} × cache {cold, warm, tag-invalidate on node save, context per
source} × surface {admin placeholder, FE dialog, page, anon, preview, revision, draft} × template
{apply to same bundle, apply to bundle lacking the field} × breakpoint tree {top-level, mobile} ×
degradation {view deleted, display deleted, disabled} × validation-abuse {bogus view, extra args,
forbidden fixed entity, negative ints} × GEOMETRY {placeholder card, argument rows, chips, preview
cap} × i18n. Kernel for render/cache/access/validation; Vitest for field types + rows; held e2e for
panel + geometry; full Kernel + full Unit gate every ship.

---

## 7. Delivery (three CPs, each shippable)

- **CP-VIEWS-EMBED-1 — foundation:** witness `mosaic_views` + renderer bubbling; `views_display` +
  `views_arguments` field types; arguments introspection API; placeholder card both surfaces;
  render via Views executable with **View default** args only; validator; degradation; Kernel +
  Vitest red→green. *Ship.*
- **CP-VIEWS-EMBED-2 — the argument matrix:** page-id / page-field / fixed(autocomplete, multi) /
  url-param / current-user sources; ArgumentResolver service shared with the data source;
  cacheability derivation; overrides + hide-when-empty; template + breakpoint cells. *Ship.*
- **CP-VIEWS-EMBED-3 — polish + power:** exposed/AJAX/pager verification incl. BigPipe/lazy;
  opt-in SSR live preview; "Edit this view" link; `.mosaic.yml` developer API + docs; MOSAIC.md
  section; walk. *Ship.*

**Estimate:** 3–4 working sessions total. **Slot:** immediately after ship #32 (Stage 5 + carousel/
search), BEFORE Act 2 — so the visual campaign styles these new panel field types once, not twice.
**Tag impact:** +3–4 sessions (honest).

---

## 8. Open rulings for Arun (say the numbers)

- **R-V1 Placeholder-by-default with opt-in "Preview results"** (this design) vs always-live render
  in the canvas. Recommendation: placeholder + opt-in (fast canvas, real when asked).
- **R-V2 Embeddable displays:** block + embed only (default) vs also page displays (opt-in toggle in
  settings). Recommendation: block + embed default, page opt-in.
- **R-V3 Hide-when-empty default:** OFF (Views' own empty text shows) vs ON. Recommendation: OFF by
  default, one click to enable — least surprise for site builders.
- **R-V4 Preview cap:** 10 rows (recommendation) for the opt-in preview.
- **R-V5 Slot:** after ship #32, before Act 2 (recommendation) vs after Act 2.
- **R-V6 Data-source sibling:** unify the argument resolver with the existing `mosaic_views` data
  source in CP-2 (recommendation) vs leave the data source untouched until Wave G walk.

*End of draft. Amend only by Arun's ratified ruling.*