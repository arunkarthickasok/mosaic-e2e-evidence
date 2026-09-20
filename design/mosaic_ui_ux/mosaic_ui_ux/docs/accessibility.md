# The accessibility contract

Mosaic is built for government sites. These are commitments, not aspirations, and every one of them is visible in the screens.

## Every drag has a keyboard path

`Space` on a selected component enters move mode.

| Key | Does |
| --- | --- |
| `↑` `↓` | Move before or after the previous or next sibling |
| `→` | Move into the slot that follows |
| `←` | Move out to the parent |
| `Enter` | Drop here |
| `Esc` | Put it back exactly where it was |

Move mode is explicit and visible: a bar names what is moving and every key that does something, and the component takes a dashed `brand` outline. Every step is announced through a live region — *"Call to action, position 2 of 4, inside Columns, second column"* — because a keyboard author cannot see the drop indicator. `Esc` always restores the original position, so the tree can be explored without risk.

The palette is keyboard-reachable too: tab to a component and press `Enter` to place it at the current insertion point.

## Alt text is required at save

Saving a node whose layout contains an image with no alternative text fails. The error summary appears at the top of the form, takes focus, carries `role="alert"`, and each line links to the field. Following the link moves focus into the field itself, which carries `aria-invalid="true"` and an `aria-describedby` pointing at the message.

An image that genuinely carries no information is marked decorative with a checkbox. That is a decision an author makes, not a validation an author bypasses.

## Heading-level guidance

The Accessibility section proposes a heading level based on the outline of the page as it currently stands, and says why: *"The page already has one H1. Mosaic suggests H2 so the outline stays in order."* It proposes; the author decides. Mosaic never silently rewrites a heading level.

## Contrast

Every text colour in `tokens.json` names the grounds it reads on, and every one of those pairs holds at least 4.5:1 in **both** themes — 3:1 for control borders, focus rings and meaningful icons. The repository ships the audit as a script: 122 pairs, zero failing.

The Accessibility section also reports the contrast of the *authored* content against the background it sits on, which is the ratio an auditor will actually measure.

## Focus

One ring, everywhere: `border-focus` solid `focus`, offset by `space-half`. The offset is what keeps it legible when the ring lands on a `brand`-filled button, where ring and fill are the same colour. The ring holds 3:1 against every surface in its own theme.

## Colour is never the only cue

Badges carry a glyph and a word. Banners carry a glyph, a title and a sentence. The result line's three states are three different sentences, not one sentence in three colours. `success` and `danger` sit at nearly the same luminance — which is precisely why neither is ever allowed to signal alone.

## Reduced motion

Under `prefers-reduced-motion: reduce` every transition and animation collapses to 1ms, and the stale shimmer is replaced by a dashed `line-strong` outline, so the "the server has not caught up yet" state is still legible without movement.

## Semantics

- The selection toolbar is a real `role="toolbar"`: one tab stop, arrow keys between buttons, `aria-label` on every icon button.
- The segmented switcher is a group of `aria-pressed` buttons, not a fake select.
- Selects are native `<select>` elements. A government platform cannot afford a bespoke listbox that only mostly works.
- Tabs are a real `tablist` with arrow-key navigation.
- A modal traps focus, closes on `Esc`, and returns focus to the control that opened it.
- A bound list can be rendered as a real `<ul>` with an accessible name, which is offered in the Accessibility section rather than assumed.
