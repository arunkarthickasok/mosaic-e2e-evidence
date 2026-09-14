# CP-VE2 — Proposed representative WALK LIST for Arun

Exact nodes + exact expects, drawn from the argument matrix + the cp-ve2 film.
Scratch content is deterministic (created by `web/cpve2_content.php`). Term tree:
**Fruit**(1) → **Citrus**(2) → **Lemon**(4); **Fruit**(1) → **Berry**(3) → **Straw**(5).
Content pages: Navel(972)=Citrus, Orange(973)=Citrus, Meyer(974)=Lemon,
Blueberry(975)=Berry, Wild Straw(976)=Straw. Host pages embed a `mosaic_view` with
per-slot `argument_sources`. Site: `https://drupalak.ddev.site:33001`.

## Runtime (published-page) — geometry oracles

1. **Fixed-value source (exact term).** Visit **/node/977**. The embedded View lists
   EXACTLY **CPVE2 Navel** + **CPVE2 Orange** (2 rows) — the two Citrus-tagged pages.
   Meyer/Blueberry/Wild Straw MUST NOT appear. *(source: fixed = Citrus, depth 0)*

2. **URL-parameter source + swap.** Visit **/node/978?tid=2** → **Navel + Orange**.
   Change the URL to **/node/978?tid=3** → the list changes to **Blueberry** only.
   Reload ?tid=2 → back to Navel + Orange. *(the render varies per ?tid — the
   render-cache fix; contexts fold into the component CID)*

3. **Taxonomy depth.** Visit **/node/979**. The View lists **5 rows** — the CHILDREN
   (Navel, Orange, Blueberry) AND the GRANDCHILDREN (Meyer, Wild Straw) of the Fruit
   root. *(source: fixed = Fruit root, depth 2 → the whole subtree)*

4. **Exclude this page (native A2).** Visit **/node/981**. The View lists the other
   CPVE2 pages but the host node's OWN row (**CPVE2 Host Exclude**) is ABSENT — the
   View's native `not` ("Exclude") on the nid argument, fed by the `this_page` source.

5. **Current-user delta.** Logged in as admin, visit **/node/980** → the View lists
   many page rows (the pages you authored — current_user resolves to uid 1). Log out
   (or open an incognito window) and visit **/node/980** → the list is **empty** (the
   anonymous viewer, uid 0, authored none). *(current_user source → 'user' context)*

## Authoring (builder-panel) — PANEL LABEL LAW

6. **Source dropdown + F-105 label.** Edit **/node/977** (the builder loads). Click the
   View component to select it; in the right panel under **Contextual filters** each
   argument row has a **source dropdown** with six options — View default, Fixed value,
   URL query parameter, Current user, This page, Field on this page. The View-default
   option reads **"View default (show all)"** — the resolved behaviour in parentheses,
   NEVER a bare "default".

7. **Fixed-value entity autocomplete.** In that panel, set the row's source to **Fixed
   value**. Because the argument targets a taxonomy term, an **entity autocomplete**
   appears — type **"Cit"** → the suggestion **Citrus** appears → click it to pick.

8. **N1 native-exclude help.** Edit **/node/981**, select the View component. The row's
   source is **This page**; because the nid argument supports Views' native Exclude, a
   help note reads: **"To exclude this page, enable 'Exclude' on the View's contextual
   filter."**

9. **Page-field source select.** On any host builder, set a row's source to **Field on
   this page** → a select lists the host bundle's fields (e.g. **Topic**) — the value is
   read from that field of the page being viewed.

10. **Degradation (save-time guard).** In a host builder, set a Fixed-value source to a
    term, then delete that term and re-save the node → a validation error names the
    contextual filter: "references a taxonomy_term that no longer exists". *(the View
    itself degrades to an empty result at render — no crash.)*

## Frames (cp-ve2 album) that back each step
- 03 = step 1 · 04a/04b = step 2 · 06 = step 3 · 07 = step 4 · 05a/05b = step 5 ·
  01 = step 6 · 02 = step 7 · 08 = step 8.
