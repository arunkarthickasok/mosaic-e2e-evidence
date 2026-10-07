# Describing an SDC library so Mosaic can adopt it

Mosaic can adopt any Single-Directory-Component (SDC) library and let authors place, configure, and
compose its components on the page — with graceful defaults when the library says nothing. The more a
library describes itself, the richer the authoring experience. This page is the contract, from most to
least automatic.

> **Worked example.** The reference library `tests/modules/mosaic_reference_library` is this guide's
> executable example — a NON-Mosaic SDC library exercising every shape and profile key below, graded
> **100% Ready** (`ReferenceLibraryTest`). Each snippet here is drawn from its real components
> (`ref_card`, `ref_accordion`, `ref_accordion_item`, `ref_plain`, `ref_shadow`, `ref_canvas`,
> `ref_legacy`) and its `mosaic_reference_library.mosaic-adopt.yml` profile. Read it alongside this page.

## 0. Name your module anything EXCEPT `mosaic` / `mosaic_*`
Mosaic reserves the provider names `mosaic` and `mosaic_*` for its OWN owned components. A library whose
module machine name starts with `mosaic_` is read as owned, not adopted — it skips the adoption pipeline
(qualified SDC ids, the foreign-boundary render, grading-as-adopted) and will fail to render required props.
Name your module after your library (`acme_cards`, `olivero_blocks`), never `mosaic_*`.
*(Oracle-rehearsal finding A1, 2026-10-07: the reference fixture was mis-named `mosaic_reference_library` and
hit exactly this — the rename to a non-`mosaic_*` name is the fix.)*

## 1. SDC slot metadata — the first source of truth
Mosaic reads each component's `*.component.yml` directly. For every **slot** it honours:

- `title` → the slot's label in the panel/canvas.
- `required: true` → the slot cannot be saved empty (an author-grade message names it).
- (optional) a slot that accepts **exactly one child type** is treated as a **repeater** — the panel
  renders an inline item list (+ Add / reorder / remove) instead of a bare drop zone.

For every **prop** Mosaic reads its JSON-Schema `type`, `title`, `enum`, and `default`. A prop with a
clear scalar/enum/number type maps to the right field automatically. A **typeless** prop (no `type`, or
a PHP-class type such as `Drupal\Core\Template\Attribute`) is graded "needs attention" — give it a
`type` (even `type: string`) so authors get a real field instead of a raw fallback.

### Slots vs. HTML content props
A **slot** is a drop zone the library owns — authors place components into it, and the library's template
decides where they render. An **HTML content prop** is a prop whose value is rich markup the library
prints (a card's `media`, `content`). Mosaic tells them apart from the schema and the example: a string
prop whose example contains HTML (`<img …>`, `<p>…</p>`) becomes a **rich-text (CKE5) field**, not a bare
text input. Each such prop ALSO offers **"+ Add {image | plain content}"** — a *component fill*: the
author drops a Mosaic component (an image, a block of text) INTO the prop, and its render replaces the
prop at page time (a fill and typed text are mutually exclusive — the fill wins). So a library's HTML
props are authorable as either rich text or a real Mosaic component, with no work by the library beyond a
representative example.

## 2. The adoption profile — `«provider».mosaic-adopt.yml`
Composition rules an SDC does not encode (cardinality, which container an item belongs in, the base
asset library) live in a profile. Mosaic reads `«provider».mosaic-adopt.yml` from **any enabled
module** (ship it in the library's own module, or in a thin helper module). Every key is optional; the
SDC metadata above always wins, the profile fills the gaps, heuristics are the floor.

```yaml
# mosaic_reference_library.mosaic-adopt.yml — the reference library's real profile.
global_libraries:
  - mosaic_reference_library/base   # attached whenever any of the library's components is used
preview_defaults: true              # the library's examples are PREVIEWS, not saved content (see §4)
containers:
  ref_accordion: { item_slot: items, item_type: ref_accordion_item }
items:                              # components that are items (roles), not top-level components
  - ref_accordion_item
repeaters:                          # a slot that takes one child type, with cardinality
  ref_accordion.items: { child: ref_accordion_item, min: 1, max: null }
requiresParent:                     # an item must live inside its container(s)
  ref_accordion_item: ref_accordion
preferred:                          # the child a slot SUGGESTS first (a soft default, not a lock)
  ref_card.body: ref_plain
thumbnails:
  ref_card: assets/ref-card.png
replaces:                           # a successor that supersedes an older component (CP-ADOPT-9)
  ref_card:
    - mosaic_reference_library:ref_legacy
patterns:                           # curated component trees the palette inserts as a unit (see §6)
  - id: card_row
    label: 'Card row'
    tree:
      type: mosaic_columns          # OWNED components are allowed in a pattern tree
      props: { columns: 3, gap: md }
      slots:
        column_1: [{ type: ref_card, props: { heading: 'Card one' } }]
        column_2: [{ type: ref_card, props: { heading: 'Card two' } }]
        column_3: [{ type: ref_card, props: { heading: 'Card three' } }]
```

Component ids in the profile are **local** (no provider prefix) — Mosaic qualifies them. An id the
profile names that is not a discovered component surfaces as a warning on the Component libraries page
(never a crash).

## 3. Global assets — ship them in a module
All-CSS-in-JS shadow-DOM libraries encapsulate their styling, but their **design tokens, brand font, and
icon font** often ship only in an example *theme*. For adopted components to look right on any page and
in the builder canvas, expose that asset layer as a Drupal library and name it in `global_libraries`
(or add it to the base library). Mosaic attaches it once wherever the library is used — page, canvas,
FE dialog. Without it, components render with fallback tokens (structure correct, brand look absent).

## 4. Examples are previews, not defaults
Set `preview_defaults: true` when your `examples` (and prop `default`s such as a placeholder image) are
meant to *illustrate* a component, not to be its saved content. Mosaic then:

- fills an **unset** prop with its example so the canvas isn't blank, and badges it **"example"**;
- **never** seeds that value into the saved layout — an untouched prop saves empty;
- keeps `required` honest — a required prop left at its example is still flagged, not silently filled.

This prevents a placeholder image (or sample text) from silently becoming published content.

## 5. Requires-parent items
An item that only makes sense inside a container (an accordion item, a tab) should declare its container
in `requiresParent`. Mosaic then auto-wraps a stray item in its container on drop (a toast confirms),
refuses when several containers could apply (with the reason), marks the item "needs {Container}" in the
palette, and rejects an orphaned item at save.

## 6. Patterns — insert a curated tree as a unit
A **pattern** is a ready-made arrangement the palette offers under your library, in a **"Patterns"** group.
Clicking it inserts the whole `tree` with fresh ids in one step. The tree uses Mosaic's layout node
grammar (`type`, `props`, `slots`, `prop_fills`) and may mix **owned** Mosaic components (a Columns
container) with your library's components — so "a row of three cards" is a pattern of the owned Columns
holding three of your cards, with no card-group component needed.

- **Validation.** Every `type` in the tree must resolve to a known component (yours or owned). A pattern
  that names an unknown type is hidden with a warning — never a crash.
- **`slot_rules` (per-instance rails).** A tree node may carry `slot_rules: {slot: {child, min, max}}`.
  These ride on the *placed* node, so that instance's slot shows a **"+ Add {child}"** rail — e.g. each
  column of an inserted "Card row" offers "+ Add card" — even though the owned Columns type has no
  repeater of its own. An instance rule overrides any type/profile rule for that node only; a normally
  placed component is unaffected.

### Patterns vs. site global templates
A **pattern** is **library-scoped** and **content** — it drops editable components onto *this* page, which
the author then changes freely. A **global template** (a site feature) is **site-scoped** and
**structural** — a saved layout a site builder reuses across pages. Ship compositions your library wants
to suggest as **patterns**; leave cross-library, site-wide layouts to global templates. A pattern never
edits global templates, and enabling your library never changes a site's templates.

## Quick checklist
- [ ] Every prop has a `type` (typeless props grade "attention").
- [ ] HTML content props ship a representative `example` (→ rich-text field + "+ Add" component fill).
- [ ] Required slots/props are marked `required: true`.
- [ ] Container slots that take one child type are repeaters (or declared in `repeaters`).
- [ ] `requiresParent` set for item-only components; `preferred` for a slot's suggested child.
- [ ] `global_libraries` points at the token/font/icon asset layer, shipped as a module library.
- [ ] `preview_defaults: true` if examples/defaults are previews, not content.
- [ ] `patterns` for curated trees; add `slot_rules` where an inserted container should offer "+ Add".
