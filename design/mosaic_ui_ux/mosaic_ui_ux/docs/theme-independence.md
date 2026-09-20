# Theme independence, and libraries that own the look

## Mosaic's own look

Every rule in `components/bundle.css` is scoped to `.mosaic` and resolves to a token from `tokens.json`. Not one value comes from Claro, Gin, Olivero or a custom admin theme, and Mosaic never targets an admin theme's class names.

Admin themes style bare elements aggressively, so `.mosaic` neutralises first and rebuilds after: `button`, `input`, `select`, `textarea` lose their inherited font, border, radius, shadow and casing; headings, paragraphs and lists lose their margins; tables lose their spacing. Every control is then drawn from tokens. The result survives an admin theme it has never met.

Screen 9 is the evidence: the same builder inside Claro and inside Gin, and Mosaic's own light and dark modes side by side. The chrome around the border changes completely. Nothing inside it moves.

## Dark mode

From `tokens.json`, not from the admin theme. `[data-theme="dark"]` switches it explicitly; `prefers-color-scheme` applies it where no explicit theme is set. The Drupal chrome around the builder stays whatever the admin theme decided — a light Claro page with a dark Mosaic inside it is a legitimate state, and the token set is built so it reads correctly.

## Style ownership

A component from an outside library brings its own styling. Inside it, that library owns the look:

- The rail shows **no Style, Spacing or Responsive section**. Not disabled, not greyed — absent, because a disabled control reads as a permission problem the author could get fixed.
- In its place, one line: **"Styling is owned by [Library] [Component]."**
- Anything an author places in its slots renders **bare** and inherits the library's styling.
- **Data binding still works.** Only the look is owned, not the content.

## Library notes on the admin page

Two facts about a library matter enough to be surfaced as badges, because both change how the site behaves outside Mosaic:

- **Theme-bound** — the library only renders when a particular front-end theme is active. Its components stay in the palette and say so, rather than vanishing and leaving layouts broken.
- **Ships global resets** — the library loads a stylesheet that resets elements across the whole page. Mosaic still paints itself from its own tokens, but the site's front end may shift, and a site builder should know before switching it on.

## Missing libraries

If a library is uninstalled, the layouts that used it **keep their values**. The component renders as a marked placeholder that prints its stored props and children in full and says, in those words, that the values are kept. Reinstall the library and the component returns exactly as it was.

This is the most important empty state in the system. An author who cannot see their content assumes it is gone, deletes the component, and then it really is gone.
