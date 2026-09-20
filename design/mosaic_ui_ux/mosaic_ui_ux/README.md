# Mosaic 1.0 — authoring UI/UX

The complete authoring design for **Mosaic**, the open-source visual page builder for Drupal 11 ([drupal.org/project/mosaic](https://www.drupal.org/project/mosaic)).

Everything here is a real, self-contained HTML file. No screenshots, no image exports, no design-tool lock-in: every screen is rendered from the same token set and the same stylesheet the module will ship, so the design and the implementation cannot drift.

```
tokens/tokens.json    the source of truth — a usage note on every token
tokens/tokens.css     compiled custom properties, light and dark
src/mosaic-ui.css     the builder's stylesheet. Tokens only, scoped to .mosaic
components/index.html the component inventory, every state
screens/*.html        17 screens: 9 designs at desktop, tablet and mobile
docs/*.md             the accessibility contract, data binding, decisions
tools/contrast.js     the contrast audit — 122 pairs, 0 failing
index.html            start here
```

Open `index.html` in a browser. Every page has a Light/Dark switch in the top-right corner.

---

## What Mosaic is, as designed for here

- A **layout field** on a Drupal node. The builder opens inside the node edit form, alongside the title, the revision sidebar and Drupal's own Save. A full-screen focus mode exists; the default lives in the form.
- Drag-and-drop canvas, palette on the left, property rail on the right. A separate **front-end edit dialog** opens on the live page, and every rail section works identically in both.
- Layouts are **structured data** — props and a child tree. Never HTML.
- Components come from **component libraries**: Mosaic's own starter library plus any library a site installs. Every panel field is derived from the component's own schema.
- Components can have **slots** with rules: allowed children, min/max, defaults, empty state. Violations are shown, never silently refused.
- Inside an outside library's component, **the library owns the look**. Data binding still works.

---

## The design system

### Foundations

| | |
| --- | --- |
| **Identity** | `brand` — a deep teal `#0d5c55`, chosen because it is unmistakably not Claro's or Gin's blue. Spent on exactly four things: the primary button, the selection outline, the drop indicator, the active tab. |
| **Binding** | `data` — violet `#5b3e8c`. Reserved. A violet surface anywhere in Mosaic means "this comes from somewhere else". |
| **Status** | `success` `attention` `danger` `info`, each with a `-subtle` ground. Never the only cue — every one ships with a glyph and a word. |
| **Type** | Public Sans throughout, IBM Plex Mono for machine names. 12 styles, no more. |
| **Spacing** | 4px base, `space-half` to `space-16`. No free pixel values anywhere. |
| **Radii** | 3 / 5 / 8 / 12 / 16 / pill. |
| **Elevation** | Three shadows. Structure is carried by borders; elevation means "floating above something". |
| **Motion** | 120 / 180 / 280ms, three easings, all suppressed under `prefers-reduced-motion`. |

The full sheet with a usage note on every token is [`tokens/tokens.json`](tokens/tokens.json); the compiled properties are [`tokens/tokens.css`](tokens/tokens.css).

### Theme independence

Every rule in `src/mosaic-ui.css` is scoped to `.mosaic` and resolves to a token. Nothing reads from Claro, Gin, Olivero or a custom admin theme, and Mosaic never targets an admin theme's class names. `.mosaic` neutralises inherited element styling first — `button`, `input`, `select`, `textarea`, headings, lists, tables — then rebuilds from tokens, so the builder survives an admin theme it has never met. Screen 9 is the proof.

### Component inventory

Ten primitives and eight builder composites, all in [`components/index.html`](components/index.html):

**Controls** — Button · Input · Select · Toggle · Segmented
**Signals** — Badge · Banner · EmptyState
**Surfaces** — Card · Tabs · Dialog
**Builder** — Toolbar · RailSection · SlotZone · StatusBar · KeyboardMove
**Data** — DataBind · ResultLine

---

## The screens, and the choice behind each

### 1 — Builder inside the node form · [1440](screens/01-builder-node-form.html) · [1024](screens/01-builder-node-form-tablet.html) · [390](screens/01-builder-node-form-mobile.html)

The builder is a field, so it stays inside the form. Drupal keeps its title, its revision sidebar and its Save button; Mosaic claims one bordered rectangle and paints it entirely from its own tokens. **No takeover, and no second Save competing with Drupal's** — the sync pill and "Revert to saved" are how an author knows where they stand, not a rival submit.

At 1024 the palette collapses into a search-and-insert dialog and the rail becomes a resizable bottom sheet. At 390 the canvas is the whole screen and both panels are sheets — because on a phone the one thing an author actually needs is to see the page.

### 2 — The same component, edited on the live page · [1440](screens/02-front-end-dialog.html) · [1024](screens/02-front-end-dialog-tablet.html) · [390](screens/02-front-end-dialog-mobile.html)

The dialog is **docked, not centred**, and the page is inset rather than covered, so the component being edited stays visible beside the fields that change it. It renders the identical rail sections from the identical markup, because two implementations of one panel is exactly how two surfaces drift apart. What it cannot do — move or remove — it says out loud rather than showing a disabled toolbar.

### 3 — Five slots, and a library that owns the look · [1440](screens/03-slots-and-ownership.html) · [1024](screens/03-slots-and-ownership-tablet.html)

Each slot states its own rules on the canvas, generated from the schema, so the rule an author reads is the rule the component enforces. The required slot is **marked, not silently refused** — refusing a drop teaches nothing and feels broken; the save is what stops.

Style, Spacing and Responsive are **gone** from the rail, replaced by one sentence naming the owner. Not greyed out: a disabled control reads as a permission problem an author could get fixed, and this one cannot be.

### 4 — A slot bound to a View · [1440](screens/04-slot-bound-to-view.html) · [390](screens/04-slot-bound-to-view-mobile.html)

Binding is shown as a chain an author can read end to end: View → display → which page field feeds the contextual filter → what each row becomes → which View field lands in which child field. The contextual filter offers **only the sources Drupal can actually feed it**, because that is the step authors get wrong.

The empty and failing states sit on the same screen, deliberately. They are the two states an author otherwise meets for the first time in production.

### 5 — Component libraries · [1440](screens/05-libraries-admin.html) · [1024](screens/05-libraries-admin-tablet.html)

Readiness is never a bare badge: every **Attention** and **Blocked** carries the field and the reason in the same cell. The schema-derived fields and slots are printed as **living documentation**, read on every scan, so this page cannot go stale relative to the code. Two library facts get their own badges because both change behaviour outside Mosaic: *theme-bound*, and *ships global resets*.

### 6 — Content-type governance · [1440](screens/06-content-type-governance.html) · [390](screens/06-content-type-governance-mobile.html)

The library switch and the per-component picks are one form, because they are one decision. The sentence that defines **Restricted** sits next to the control rather than in a help page nobody opens: *only an administrator may place it; everyone else can edit its content where it already is.*

### 7 — Empty states · [1440](screens/07-empty-states.html)

Five designed nothings: empty canvas, empty slot, empty palette, empty-and-failing data, library missing. The one that earns the most care is **library missing** — it prints the stored props and children in full and says, in those words, that the values are kept. An author who cannot see their content assumes it is gone and deletes the component, and then it really is gone.

### 8 — Keyboard move, and the errors that stop a save · [1440](screens/08-keyboard-and-errors.html)

Move mode is **explicit, announced and reversible**: `Space` enters it, a bar names every key that does something, each step is read out through a live region, and `Esc` always restores the original position so the tree can be explored without risk.

Both save errors lead with an alert that takes focus, and both are written in the author's language — *"Teaser (Olivero) needs content in its Content area"* — never a machine name and never "validation failed".

### 9 — Light, dark, Claro and Gin · [1440](screens/09-themes-and-frames.html)

Four surroundings, one builder. Light and dark both resolve from `tokens.json`. The Claro and Gin frames make the same point from the other side: the chrome changes completely, and not one pixel inside the border moves.

---

## Accessibility

Government-grade, and treated as a contract rather than a checklist — the full text is in [`docs/accessibility.md`](docs/accessibility.md).

- **Every drag has a keyboard path.** `↑`/`↓` before or after, `→` into a slot, `←` out to the parent, `Enter` to drop, `Esc` to put it back. Every step announced.
- **Alt text is required at save.** The summary takes focus, each line links to its field, the field takes focus when followed.
- **Heading-level guidance** that proposes and explains, and never silently rewrites.
- **One focus ring**, `border-focus` in `focus` with a `space-half` offset so it survives landing on a brand fill.
- **AA contrast, verified.** `node tools/contrast.js` checks 122 documented pairs across both themes. Zero failing.
- **Reduced motion** collapses every transition and swaps the stale shimmer for a dashed outline.

---

## Deliberately out of scope

Named in the brief and not drawn anywhere: inline query builders, external API sources, generated code as a primary surface (a developer disclosure is fine), and a settings page for choosing which rail sections appear. A section an author can switch on and then find empty is worse than no section at all — the schema decides.

---

## Verification

```bash
node tools/contrast.js          # 122 contrast pairs, both themes
ALL=1 node tools/contrast.js    # print every pair, not just failures
```

Screens were rendered headless at 1440 / 1024 / 390 and checked for console errors and horizontal overflow. They were also rendered with Public Sans **unavailable**, so the layouts are verified in their fallback stack as well as with the intended face.

## Licence

GPL-2.0-or-later, matching Drupal.
