# CP-VE3 — recipe-grade WALK for Arun

The Views-embed depth arc: SSR preview (P1), exposed-filter + pager depth (P2),
data-source sibling parity (P3/P3-UI), six-live-sources everywhere (G0), and the
WC57 debounced-commit typing contract (P0.5). Every click spelled out, exact
expects, one STOP line each. Site: `https://drupalak.ddev.site:33001`.

Two sections need **provisioned live content** (an exposed-filter + paged view +
host embeds) — the provisioning command is given inline. Use SCRATCH host nodes
only; never type into the geometry hosts 977–981.

---

## A. Authoring — SSR preview, panel-driven (P1) — no new content needed

**A1. Preview a view in the canvas (admin).** Edit any node that already carries a
`mosaic_view` (e.g. **/node/977/edit** → the builder loads). Click the view card once
to select it. In the RIGHT panel, find the **"Preview in canvas"** button. Click it.
EXPECT: within ~1s the view CARD in the canvas swaps its placeholder for a real SSR
snapshot — actual rows, styled. The rows are INERT: click a row link → nothing
navigates (F-103 inert-canvas contract; controls are disabled + `pointer-events:none`).
→ **STOP: real rows appear in the card, and clicking them does nothing.**

**A2. Preview clears on config change.** With the snapshot showing (from A1), change ANY
setting in the panel — e.g. flip the display, or edit an argument source. EXPECT: the
snapshot immediately clears back to the placeholder (a stale preview is never shown
against changed config). Click "Preview in canvas" again → the NEW snapshot renders.
→ **STOP: editing config wipes the old preview; re-previewing shows the new one.**

**A3. Same preview on the front-end builder.** Open the FE builder dialog on a page that
has a `mosaic_view` (the front-end "Edit" entry). Select the view, click "Preview in
canvas". EXPECT: identical behaviour to A1 — inert SSR snapshot in the card.
→ **STOP: FE surface previews the same as admin (frame `02-fe-preview.png`).**

---

## B. Authoring — the debounced typing contract (P0.5) — no new content needed

**B1. One history entry per typing burst.** Edit a node with a `mosaic_view`; select it;
set an argument row's source to **URL query parameter**. In the "Parameter name" text
box, type `category` (7 keystrokes, steadily). EXPECT: the canvas does NOT re-render or
freeze on every keystroke; the value commits ~300ms after you stop. Now press Ctrl/Cmd-Z
ONCE. EXPECT: the whole word `category` is undone in a single step — not one letter per
undo. → **STOP: typing a value is one history entry, not one-per-keystroke.**

**B2. Blur flushes immediately.** Type a value into the same box, then click straight onto
another field WITHOUT pausing. EXPECT: the typed value is committed (not lost) — blur
flushes the pending debounce. → **STOP: tabbing away keeps the value (F-106 lineage).**

---

## C. Authoring — data-source picker parity + six live sources (P3-UI + G0) — no new content

**C1. The data-source panel has the same six sources.** Edit a node; add or select a
component that uses the **views_result DATA SOURCE** (a component bound to a view via the
data-source binding, not the `mosaic_view` component). Open its binding → choose a view +
display. EXPECT: below the display picker the SAME argument-source rows appear as on the
`mosaic_view` component — each row a dropdown with six options (View default, Fixed value,
URL query parameter, Current user, This page, Field on this page). The View-default option
reads **"View default (…behaviour…)"**, never a bare "default" (PANEL LABEL LAW / F-105).
→ **STOP: the data-source binding offers the same six sources as the component.**

**C2. G0 — "Field on this page" is LIVE, not a dead dropdown.** In that same data-source
panel (C1), on a row whose argument targets an entity, set the source to **Field on this
page**. EXPECT: a SECOND dropdown appears listing the fields of THIS node's bundle (e.g.
on an Article, **Topic** / **Tags**). It is populated — NOT empty. (Before G0 this dropdown
was dead on the data-source panel because host context wasn't threaded there.)
→ **STOP: choosing "Field on this page" shows a populated field list, both on the
component panel AND the data-source panel.**

---

## D. Runtime — exposed filters + pager depth (P2-B) — NEEDS LIVE CONTENT (provision first)

> **Content status:** these six D-walks are honest-checkpointed for the P2-B filming pass.
> They need a paged, exposed VIEW that does not exist on the dev site yet, plus two scratch
> host embeds. The P2-B pass will (1) create the view via the builder/Views UI or a scratch
> provisioner and (2) add the embeds to scratch hosts, then film D1–D6. The provisioning is
> scratch dev content (like the retired `cpve2_content.php`), never staged into ship #39.

Target content to create in the P2-B pass:
- A view (`cpve3_ep`) on published pages, **2 rows per page**, with an exposed **Title
  contains** filter, a **full pager** (numbered), and a **page** display at `/cpve3-list`.
- Scratch host **983** embedding it once; scratch host **984** embedding it TWICE on one page.
- The Kernel layer already proves the exposed/pager plumbing + the cache fix
  (`ViewsEmbedExposedPagerTest` 3/3) — D1–D6 are the browser-truth confirmation.

**D1. Pager `?page=N` advances by ID (full pager).** Visit **/node/983**. Note the exact
row TITLES on page 1. Click the pager's **"2"** (or "next"). EXPECT: the URL gains
`?page=1`; the rows CHANGE — a different set of titles, none repeated from page 1. Click
"1"/"previous" → the original titles return. → **STOP: paging swaps the rows by id, not
just a visual highlight.**

**D2. Mini pager variant.** (If `cpve3_ep` also exposes a mini-pager display, or switch the
embed's pager to mini in the builder.) Visit the mini-pager host. EXPECT: only
"‹ previous / next ›" controls (no numbered pages); "next" advances the rows the same way.
→ **STOP: mini pager advances rows with prev/next only.**

**D3. AJAX exposed-form filtering.** Visit **/node/983**. In the embedded view's exposed
form, type part of a known title into **Title** and submit. EXPECT: the row list narrows
to matching titles WITHOUT a full page reload (AJAX) — the rest of the node page (title,
other regions) does not flash/reload. Clear the filter → the full list returns.
→ **STOP: filtering narrows rows in place, no full reload.**

**D4. The cache fix, LIVE (the P2 finding).** Still on **/node/983**: (1) submit an exposed
filter that narrows to a few rows; note them. (2) Clear the filter → the FULL list returns.
(3) Re-submit the SAME filter → EXPECT the narrowed rows again, correctly — NOT the stale
full list served from a cached render. (Before the P2 fix, the per-component render CID
omitted `url.query_args`, so step 3 could serve the step-2 render.) → **STOP: filter →
unfiltered → same filter yields the correct narrowed rows each time, never a stale serve.**

**D5. Dual embed on one page — independence.** Visit **/node/984** (two embeds of the SAME
view). In the FIRST embed, page to `?page=1` or apply an exposed filter. EXPECT — record
which happens verbatim: (INDEPENDENT) only the first embed changes, the second holds its
own rows; OR (QUIRK-WITNESSED) both move together because they share the single `?page`
query key. Write the observed behaviour + a quote in the report; if QUIRK, the MOSAIC.md
author-note draft below applies. → **STOP: record INDEPENDENT or QUIRK, with a quote.**

**D6. Embed + the view's own page display coexist.** The `cpve3_ep` view also has a PAGE
display at **/cpve3-list**. Open **/node/983** (embed) and **/cpve3-list** (page) in two
tabs. Page/filter each independently. EXPECT: neither disturbs the other; the embed on the
node and the standalone page each keep their own state. → **STOP: node-embed and own-page
display operate independently.**

### MOSAIC.md author-note draft (use only if D5 is QUIRK-WITNESSED)
> **Two embeds of the same paged view on one page share the URL's `?page` key**, so paging
> one pages both. To page them independently, give each embed a display with a distinct
> pager `pager` element id (Views "Pager" → "Element" offset), or embed different displays.

---

## E. Runtime/Authoring — the A3 preset round-trip (P4) — uses one scratch host

**E1. Save a configured view as a global template.** Edit a scratch node; add a
`mosaic_view`, configure it fully (pick a view + display, set an argument source, e.g.
Fixed value = a term). Use the builder's **"Save as template"** (global template) action;
name it `cpve3-preset`. EXPECT: the template saves without error. → **STOP: the configured
view is stored as a reusable global template.**

**E2. Insert the preset on a DIFFERENT node — config intact.** Edit a second scratch node;
insert the `cpve3-preset` template. EXPECT: the inserted `mosaic_view` carries the SAME
view + display + argument source you configured in E1 — nothing reset to defaults, no
empty dropdowns. Save the node; view it. EXPECT: the runtime render matches the configured
source (same rows the source implies). → **STOP: a configured view round-trips through a
global template with its argument config fully intact (zero new code — this is a witness).**

---

## Backing gates (2026-09-15, ship #39)
Kernel — mosaic_views FULL **53 / 816 / 0**. Vitest **537 / 1** (pre-existing B-101).
phpcs **0 ERRORS**. phpstan **[OK]**. The D4 cache fix is proven at the Kernel layer in
`ViewsEmbedExposedPagerTest`; D4 is its browser-truth confirmation.
