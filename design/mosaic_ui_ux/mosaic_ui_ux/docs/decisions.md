# Decisions, and what was rejected

Each entry: the decision, the reason, and the alternative that was considered and dropped. Where a decision is visible in a screen, the screen is named.

---

## 1. The builder lives inside the node form

**Decided.** One bordered rectangle inside the Layout field, with Drupal's title, sidebar and Save untouched. A full-screen focus mode is a button in the builder bar, not the default.

**Why.** The layout is a field. An author editing a page is editing title, layout, metadata and revision note as one act; taking over the screen breaks that act in half and creates the question "which Save is the real one?".

**Rejected.** A full-screen takeover by default, like most standalone builders. It reads impressively in a demo and costs an author a context switch every time they need to touch a field that is not in the layout.

**Visible in.** Screen 1.

---

## 2. Mosaic ships its own token set, and never reads the admin theme

**Decided.** Every rule scoped to `.mosaic`, every value from `tokens.json`. `.mosaic` neutralises inherited element styling and rebuilds from tokens.

**Why.** The builder must look and behave identically under Claro, Gin and whatever a state agency has customised. Inheriting from an admin theme means the builder's quality is capped by the theme's, and breaks on a theme it has never met.

**Rejected.** Consuming Claro's CSS custom properties where they exist and falling back otherwise. It halves the CSS and doubles the number of ways the builder can look wrong.

**Visible in.** Screen 9.

---

## 3. The rail is stacked sections, not tabs

**Decided.** Content · Data · Style · Responsive · Accessibility, each with a badge in its header.

**Why.** A tab hides state. An author cannot see that Data holds a binding or that Accessibility holds an error without clicking each tab. Sections cost scrolling, which is cheap, and hide nothing, which is not.

**Rejected.** Tabs in the rail. Rejected twice: once for hidden state, once because the front-end dialog is narrow and a tab strip there would wrap.

**Visible in.** Screens 1, 2, 3, 4.

---

## 4. A section is absent when it does not apply — never disabled

**Decided.** Style and Responsive do not render inside an outside library's component. One `m-owned` line takes their place.

**Why.** A greyed-out control reads as "you lack permission for this", which an author will try to get fixed. Absence plus a sentence reads as "this is not how this component works", which is true.

**Rejected.** Disabled controls with a tooltip. Tooltips are not reachable on touch and are not read aloud reliably.

**Visible in.** Screen 3.

---

## 5. There is no settings page for rail sections

**Decided.** The component's schema decides, per field: bindable, varies-by-breakpoint, styleable.

**Why.** It was named out of scope in the brief, and it is right: a section an author can switch on and then find empty is worse than no section at all.

---

## 6. Violations are shown, not refused

**Decided.** A drop that breaks a slot rule is accepted and the slot is marked. The **save** is what stops, with a sentence naming the component and the slot.

**Why.** A refused drop teaches nothing. The author learns only that the interface did not respond, which is indistinguishable from a bug.

**Rejected.** Refusing the drop with a shake animation. Fails silently for keyboard and screen-reader users, who get no shake.

**Visible in.** Screens 3 and 8.

---

## 7. Optimistic commit with a stale shimmer — never a blocking overlay

**Decided.** The edit lands at once; the affected component takes `opacity-stale` and a slow shimmer until the server preview catches up. Under reduced motion, a dashed outline instead.

**Why.** A page builder is used in long editing bursts. A modal spinner on every keystroke-driven re-render turns that into stop-start work, and a scrim over the canvas hides the thing being judged.

**Rejected.** A progress bar in the builder bar. Too far from the change to answer the only question that matters: "is what I am looking at current?".

**Visible in.** The StatusBar component; screen 1's status line.

---

## 8. One selection toolbar, not per-component hover overlays

**Decided.** A single floating toolbar attached to the current selection, holding move, wrap, duplicate, select parent, remove.

**Why.** Overlays on every component turn a page into a minefield and cover the content the author is judging. One toolbar means the canvas reads as the page almost all of the time.

**Rejected.** Hover overlays with edge handles. Also rejected for touch: a hover affordance has no touch equivalent.

**Visible in.** Screens 1, 2, 3, 4.

---

## 9. Four binding sources, and no query builder

**Decided.** Page field, Drupal View, entity reference, route/user context. Nothing else, including in the developer disclosure.

**Why.** Named out of scope, and correct: a query builder inside a page builder is a second product with a second security surface, and Views already exists, is already permissioned, and is already what a Drupal site builder knows.

**Visible in.** Screen 4.

---

## 10. "Binding shows an entity, it never copies one" is in the UI

**Decided.** That sentence is rendered under the field map, not left to documentation.

**Why.** It is the single most common misunderstanding about a page builder, and it determines whether an author trusts the layout after the source changes.

---

## 11. Three result-line states are three sentences, not three colours

**Decided.** Populated, Empty and Failing have different words, different grounds and different weight. Empty is never red.

**Why.** An empty result is a normal state of a healthy source. Colouring it like a failure trains authors to ignore the colour that does mean failure.

**Visible in.** Screens 4 and 7.

---

## 12. A Data-state switcher in the builder bar

**Decided.** Populated / One item / Empty / Failing, changing only what the canvas renders, never the layout, and resetting on save.

**Why.** Empty and failing are the states an author meets for the first time in production. Letting them be looked at safely is cheaper than the incident.

**Visible in.** Screens 1 and 4.

---

## 13. Native `<select>`, restyled

**Decided.** Real select elements with Mosaic's caret. A dialog with search is used instead above ~30 options, as the media library already is.

**Why.** Native gets keyboard, screen-reader and mobile-picker behaviour right for free. A government platform cannot afford a bespoke listbox that only mostly works.

**Rejected.** A custom combobox. Rejected on audit risk, not on taste.

---

## 14. Colour is never the only cue

**Decided.** Every badge carries a glyph and a word; every banner a glyph, a title and a sentence.

**Why.** `success` and `danger` sit at nearly identical luminance — any pair of accessible-on-white text colours does. Which means hue alone can never carry the distinction, however the palette is tuned. Glyph-plus-word is the fix, and it is also what survives a monochrome print of an audit report.

---

## 15. Move mode is explicit and reversible

**Decided.** `Space` enters it, a visible bar lists every key, every step is announced, `Esc` restores the original position.

**Why.** An implicit keyboard drag — arrows that move things while merely reading — makes the tree dangerous to explore. Explicit entry plus guaranteed `Esc` makes it safe.

**Visible in.** Screen 8.

---

## 16. "Library missing" prints the stored values in full

**Decided.** The placeholder lists props and children, marked as kept, with a "show me what is stored" action.

**Why.** This is the moment an author loses data. Not because Mosaic deletes it — because they cannot see it, assume it is gone, and remove the component themselves.

**Visible in.** Screen 7.

---

## 17. Public Sans, not Inter

**Decided.** Public Sans for the interface, IBM Plex Mono for machine names.

**Why.** It is the face of the U.S. Web Design System, so it is already the register a government content team reads in, and it is not the default-looking face every AI-styled interface currently uses.

**Note.** Hosted from Google Fonts, no files bundled. The layouts in this repository were also verified with the face unavailable, so the fallback stack is a tested state rather than an assumption.

---

## 18. The screens are HTML, not image exports

**Decided.** Every screen is a self-contained page built from `tokens.css` and `mosaic-ui.css`.

**Why.** A design that is a picture drifts from the implementation the moment either changes. A design that is the stylesheet cannot.
