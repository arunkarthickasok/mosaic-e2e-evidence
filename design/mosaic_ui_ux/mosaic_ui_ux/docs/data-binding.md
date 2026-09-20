# Data binding

Mosaic binds to four sources and no others. If it is not one of these, the Data section does not offer it:

1. **A field of the page being edited** — `node.title`, `field_agency`, anything on the node.
2. **A Drupal View** — a View plus a display. Its contextual filter is fed from a page field, the URL, a reference on this page, a taxonomy term, the current user, or a fixed value. Exposed filters and the pager are opt-in per binding.
3. **An entity reference** — follow a reference and show a field of the referenced entity.
4. **Route or user context** — the current route's parameters, or the current user.

**Not in scope, and not drawn anywhere in this system:** an inline query builder, an external API source, generated code as a primary surface. A developer disclosure showing the resolved binding is fine; a code editor is not.

## Fields and slots bind differently

A bound **field** takes its VALUE from the source.

A bound **slot** takes its CHILDREN from a View: one child of a chosen type per row, with the View's fields mapped onto that child's fields. The slot's normal drop behaviour is suspended while it is bound, and the zone says so.

## Binding shows, it never copies

This sentence appears in the UI, under the field map, because it is the single most common misunderstanding about a page builder. A bound component renders the entity at request time. Edit the notice and every page that shows it follows. Nothing is snapshotted into the layout.

## The result line

Every bound component carries one line: how many rows are showing, out of how many, from which View and display, with the argument in mono at the end.

```
3 of 128 · Recent notices (Block: latest)        agency = field_agency
```

Three states, three different sentences:

- **Populated** — `data-subtle`. Normal.
- **Empty** — `surface-sunken`, muted. A healthy source with no rows. Never red, and always paired with the empty message visitors will see.
- **Failing** — `danger-subtle`, bold, with a danger banner above it that names what broke, what was kept, and at least one way out.

## The Data-state switcher

Populated · One item · Empty · Failing, in the builder bar. It changes only what the canvas renders. It never writes to the layout, and it resets when the node form is saved. It exists because empty and failing are the two states an author otherwise meets for the first time in production.

## Legacy bindings

A binding written by a version of Mosaic before 1.0, or pointing at something that has since changed shape, is shown read-only with the line **"Legacy binding — remove to edit."** The value is displayed, never silently dropped, and removing the binding is a deliberate act.

## What can be bound is a property of the field type

Not of the component, not of the site, and not of a setting. The Data section lists the fields whose types have a source, and says so plainly for the rest: *"Body and Image cannot be bound — their field types have no data source."*
