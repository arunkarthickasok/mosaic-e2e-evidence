# Describing an SDC library so Mosaic can adopt it

Mosaic can adopt any Single-Directory-Component (SDC) library and let authors place, configure, and
compose its components on the page — with graceful defaults when the library says nothing. The more a
library describes itself, the richer the authoring experience. This page is the contract, from most to
least automatic. (No specific library is named here; «library» stands in for yours.)

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

## 2. The adoption profile — `«provider».mosaic-adopt.yml`
Composition rules an SDC does not encode (cardinality, which container an item belongs in, the base
asset library) live in a profile. Mosaic reads `«provider».mosaic-adopt.yml` from **any enabled
module** (ship it in the library's own module, or in a thin helper module). Every key is optional; the
SDC metadata above always wins, the profile fills the gaps, heuristics are the floor.

```yaml
# «provider».mosaic-adopt.yml
global_libraries:
  - «provider»/base            # attached whenever any of the library's components is used
preview_defaults: true         # the library's examples are PREVIEWS, not saved content (see §4)
containers:
  accordion:   { item_slot: items, item_type: accordionitem }
  tabgroup:    { item_slot: tabs,  item_type: tab, panel_slot: tabpanels, panel_type: tabpanel }
items:                         # components that are items (roles), not top-level components
  - accordionitem
  - tab
repeaters:                     # a slot that takes one child type, with cardinality
  accordion.items: { child: accordionitem, min: 1, max: null }
  tabgroup.tabs:   { child: tab,           min: 1, max: 10 }
requiresParent:                # an item must live inside its container(s)
  accordionitem: accordion
  tab:           tabgroup
thumbnails:
  card: assets/card.png
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

## Quick checklist
- [ ] Every prop has a `type` (typeless props grade "attention").
- [ ] Required slots/props are marked `required: true`.
- [ ] Container slots that take one child type are repeaters (or declared in `repeaters`).
- [ ] `requiresParent` set for item-only components.
- [ ] `global_libraries` points at the token/font/icon asset layer, shipped as a module library.
- [ ] `preview_defaults: true` if examples/defaults are previews, not content.
