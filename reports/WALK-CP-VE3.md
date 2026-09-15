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

## D. Runtime — exposed filters + pager depth (P2-B) — FILMED GREEN

Content is live (scratch, `web/cpve3_content.php`): view **`cpve3_ep`** lists published nodes,
**2 rows per page**, sorted by nid ASC, with an exposed **Type** filter, AJAX on, a **full
pager** (`embed_1`), a **mini pager** (`embed_mini`), and a **page** at **/cpve3-list**. Hosts:
**983** = single `embed_1`, **984** = DUAL `embed_1`, **985** = single `embed_mini`. Row ids
below are the actual `/node/N` links filmed on 2026-09-15.

**D1. Pager `?page=N` advances by ID (full pager).** Visit **/node/983**. Page 1 lists nodes
**1, 2**. Click the pager's **"2"** (or "next"). EXPECT: the rows CHANGE to nodes **3, 4** —
none repeated from page 1. Click "1"/"previous" → **1, 2** return. *(filmed:
`p2b-a-pager-full-p0.png` → `-p1.png`)* → **STOP: paging swaps the rows by id `1,2`→`3,4`,
not just a visual highlight.**

**D2. Mini pager variant.** Visit **/node/985** (`embed_mini`). EXPECT: only
"‹ previous / next ›" controls — **zero numbered page links**. "next" advances **1, 2** →
**3, 4** the same way. *(filmed: `p2b-a-pager-mini-p0.png` → `-p1.png`)* → **STOP: mini pager
advances rows with prev/next only.**

**D3. AJAX exposed-form filtering.** Visit **/node/983** (page 1 = nodes **1, 2**). In the
embedded view's exposed form set **Type = Skill** and submit. EXPECT: the list narrows to
nodes **4, 5** (skill content) WITHOUT a full page reload — the rest of the node page does
not flash. *(Filmed proof of no-reload: a `window.__cpve3` marker set before submit still
reads `alive` after — a full navigation would wipe it.)* Clear → the full list returns.
*(filmed: `p2b-b-exposed-before.png` → `-after.png`)* → **STOP: filtering narrows `1,2`→`4,5`
in place, no full reload.**

**D4. The cache fix, LIVE (the P2 finding).** Still on **/node/983**: (1) filter **Type =
Skill** → nodes **4, 5**. (2) Clear → the full list **1, 2** returns. (3) Re-submit **Type =
Skill** → EXPECT nodes **4, 5** again, correctly — NOT the stale full list. (Before the P2
fix the per-component render CID omitted `url.query_args`, so step 3 could serve the step-2
render.) *(filmed: `p2b-e-cache-1filter.png` `4,5` → `-2clear.png` `1,2` → `-3refilter.png`
`4,5`)* → **STOP: filter → unfiltered → same filter yields `4,5` each time, never a stale
serve.**

**D5. Dual embed on one page — INDEPENDENT (AJAX), QUIRK (no-JS).** Visit **/node/984** (two
embeds of the SAME view, both `1,2`). Click the FIRST embed's pager "next". EXPECT in the
browser: only the first embed advances (`1,2`→`3,4`); the second embed holds `1,2` —
**INDEPENDENT**. *(filmed: `p2b-c-dual-before.png` → `-after.png`; witnessed e1 `1,2→3,4`,
e2 `1,2→1,2`.)* NUANCE (recorded, both true): Views AJAX replaces only the clicked embed's
`js-view-dom-id` container, so with JS they page independently; but a **no-JS / bookmarked
`/node/984?page=1`** shows `3,4,3,4` — BOTH advance, because they share pager element `id:0`
(one `?page` key). → **STOP: with JS the embeds page INDEPENDENTLY; the shared-`?page` quirk
only bites no-JS/bookmarked URLs (see author-note).**

**D6. Embed + the view's own page display coexist.** The `cpve3_ep` view also has a PAGE
display at **/cpve3-list**. On **/node/983** page the embed to nodes **3, 4**. Open
**/cpve3-list** — its page 1 is still nodes **1, 2**, unaffected by the embed's paging.
*(filmed: `p2b-d-embed-paged.png` `3,4` + `p2b-d-ownpage.png` `1,2`)* → **STOP: node-embed and
own-page display operate independently.**

### MOSAIC.md author-note (D5 — shared `?page` under no-JS)
> **Two embeds of the same paged view on one page share the URL's `?page` key.** With
> JavaScript enabled they page independently (Views AJAX targets each embed's own container),
> but a bookmarked or no-JS `?page=N` URL advances both. To make per-embed paging robust
> without JS, give each embed a display with a distinct pager **Element** id (Views "Pager"
> → "Element" offset), or embed different displays.

---

## E. Runtime/Authoring — the A3 preset round-trip (P4) — WITNESSED GREEN

Witnessed at the data layer through the REAL `MosaicGlobalTemplate` config entity (the same
store the builder's "Save as template" writes) + filmed rendering. Node **986** is the preset
instance. To repeat interactively:

**E1. Save a configured view as a global template.** Edit a scratch node; add a `mosaic_view`,
configure it fully (view + display + an argument source — the witnessed config is
`cpve2_termd0:embed_1` with **Fixed value = term 6** and **hide when empty = on**). Use the
builder's **"Save as template"** action; name it `cpve3_preset`. EXPECT: saves without error;
it appears in `/api/mosaic/templates` and the global-template collection. → **STOP: the
configured view is stored as a reusable global template.**

**E2. Insert the preset on another node — config intact.** Insert `cpve3_preset` on a fresh
node (witnessed: node **986**). EXPECT: the inserted `mosaic_view` carries the SAME view +
display + argument source — nothing reset. Witnessed round-trip: **view_display INTACT**
(`cpve2_termd0:embed_1`), **argument_sources INTACT** (`[{fixed, 6, taxonomy_term}]`),
**hide_when_empty INTACT** (`true`) → **"CONFIG ROUND-TRIPS INTACT"**. View **/node/986** →
the view renders (2 rows, the term-6 depth-0 set). *(filmed: `p4-preset-instance.png`)*
→ **STOP: a configured view round-trips through a global template with its Views config fully
intact (zero new code — a witness).**

---

## Backing gates (2026-09-15, ship #39)
Kernel — mosaic_views FULL **53 / 816 / 0**. Vitest **537 / 1** (pre-existing B-101).
phpcs **0 ERRORS**. phpstan **[OK]**. The D4 cache fix is proven at the Kernel layer in
`ViewsEmbedExposedPagerTest`; D4 is its browser-truth confirmation.
