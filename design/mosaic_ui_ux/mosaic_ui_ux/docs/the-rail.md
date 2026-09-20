# The property rail

Five sections, this order, no others:

| Section | Present when | What it holds |
| --- | --- | --- |
| Content | The component declares at least one field or slot | Every field, in schema order, with human labels |
| Data | At least one field or slot can be bound | The bind controls, the field map, the result line |
| Style | The component belongs to a library that does not own its own styling | Variant, background, alignment, spacing — token values only |
| Responsive | At least one field's type has a per-breakpoint form | The breakpoint switcher and the overrides for that breakpoint |
| Accessibility | Always | Heading level, alt text, the contrast summary |

## Why sections and not tabs

A rail of tabs hides state. An author cannot see that Data holds a binding, or that Accessibility holds an error, without clicking through each tab. Sections stack, each header carries a badge — `5 fields`, `1 bound`, `1 to fix` — and everything that needs attention is visible in one glance. The cost is scrolling, which is cheap; the benefit is that nothing hides, which is not.

## What decides whether a section appears

The component's own schema, per field. Three properties, each answered by the field's type:

- **Bindable?** Contributes to Data.
- **Varies by breakpoint?** Contributes to Responsive.
- **Styleable?** Contributes to Style.

A section with no contributing fields is absent. It is not empty, not collapsed, not greyed — absent. There is no administration screen for turning sections on and off, because a section an author can turn on and then find empty is worse than no section at all.

## Labels

Human labels, read from the schema's own titles. If a schema gives a field no title, the component's readiness drops to **Attention** and the admin page says which field, rather than the rail quietly falling back to a machine name.

Machine names appear in exactly one place: the **Developer details** disclosure at the foot of a section, closed by default.

## Two surfaces, one implementation

The same markup renders in the builder's rail and in the front-end edit dialog. There is no second implementation and no "front-end subset". What differs between the two is only what sits around the sections: the front-end dialog cannot move or remove a component, so it has no selection toolbar, and it says so.

## Formatted text

A formatted-text field never gets an inline editor in the rail. It shows three clamped lines of its current value and a button that opens Drupal's CKEditor 5 in a modal. The rail is `rail-width` wide; CKEditor's toolbar is not.
